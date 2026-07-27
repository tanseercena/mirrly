import SettingSideBar from "../../components/SettingSideBar";

import {
    BlockStack,
    Button,
    Card,
    List,
    InlineStack,
    Layout,
    Badge,
    Page,
    SkeletonBodyText,
    SkeletonPage,
    Text,
    TextField,
    Checkbox,
    Modal,
    Tabs,
    Banner,
    Tooltip,
    DropZone,
    Select
} from "@shopify/polaris";
import LanguageSelector from "../../components/LanguageSelector";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { AppContext } from "../../components/providers/AppProvider";
// import '../App.css'
import prettyBytes from "pretty-bytes";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { SendIcon } from "@shopify/polaris-icons";
import { Knob } from "../../components/knob/Knob";

const Email = () => {
    const shopify = useAppBridge();
    const { store, isLoadingData, refetchStore } = useContext(AppContext);
    const navigate = useNavigate();

    const [userPlan, setUserPlan] = useState("free");
    const [currentSetting, setCurrentSetting] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);

    const [isPreviewFetching, setIsPreviewFetching] = useState(true);
    const [frameElement, setFrameElement] = React.useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [downloadPreviewHtml, setDownloadPreviewHtml] = useState(null);
    const [isDownloadPreviewFetching, setIsDownloadPreviewFetching] =
        useState(true);
    const [replyToEmail, setReplyToEmail] = useState(
        store?.reply_to_email || store?.email || ""
    );
    const [ccEmail, setCcEmail] = useState(store?.setting?.cc_email || "");
    const [bccEmail, setBccEmail] = useState(store?.setting?.bcc_email || "");

    const [file, setFile] = useState(null);
    const [lotteryContentFile, setLotteryContentFile] = useState(null);
    const [downloadContentFile, setDownloadContentFile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [hasRequiredScopes, setHasRequiredScopes] = useState(false);
    const [permissionRequesting, setPermissionRequesting] = useState(false);
    const [hasOrderRequiredScopes, setHasOrderRequiredScopes] = useState(false);
    const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
    const [warning, setWarning] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const [emailTemplates, setEmailTemplates] = useState();
    const [emailTemplateId, setEmailTemplateId] = useState(String(store?.setting?.email_template_id) || "");
    const { t } = useTranslation()

    const [knobSelected, setKnobSelected] = useState(false);

    const [serverName, setServerName] = useState(
        store?.setting?.smtp_details?.server_name || ""
    );
    //store?.setting?.integrations?.klavio?.api_key || false
    const [port, setPort] = useState(store?.setting?.smtp_details?.port || "");

    const [mailTransport, setMailTransport] = useState(
        store?.setting?.smtp_details?.mail_transport || ""
    );
    const [mailEncryption, setMailEncryption] = useState(
        store?.setting?.smtp_details?.mail_encryption || ""
    );

    const [username, setUserName] = useState(
        store?.setting?.smtp_details?.username || ""
    );
    const [password, setPassword] = useState(
        store?.setting?.smtp_details?.password || ""
    );

    const [fromEmail, setFromEmail] = useState(
        store?.setting?.smtp_details?.fromEmail || ""
    );

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);

    const [tlsChecked, setTlsChecked] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const apiEndpoint = process.env.SHOPIFY_API_KEY?.endsWith("fb15d")
        ? "https://digitally.test/api/v1/create-order"
        : "https://digitally.conversionproplus.com/api/v1/create-order";
    const apiDocumentationUrl = "#";

    const linkRegex =
        /(?:<a\s+[^>]*href\s*=\s*["'][^"']+["'][^>]*>)|(?:https?:\/\/[^\s]+)|(?:www\.[^\s]+)|(?:[^\s]+\.[^\s]{2,})/i;

    useEffect(() => {
        // This would be an API call to your backend to check permissions
        checkAppPermissions().then((permissions) => {
            setHasRequiredScopes(permissions.includes("write_customers"));
            setHasOrderRequiredScopes(permissions.includes("write_orders"));
        });
    }, []);

    async function checkAppPermissions() {
        const response = await fetch("/api/check-permissions");
        const data = await response.json();
        return data.scopes || [];
    }

    const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const setting = store?.setting
        ? {
            ...store.setting,
        }
        : null;

    useEffect(() => {
        setCurrentSetting(setting);
    }, [store]);

    useEffect(() => {
        shopify.loading(isLoadingData || isPreviewFetching);
    }, [isLoadingData, isPreviewFetching, shopify]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const tabs = [
        { id: "content-1", content: t("settings.email_content.content"), panelID: "content-1" },
        // { id: 'content-2', content: 'Template', panelID: 'content-2' },
        { id: "content-3", content: t("settings.email_content.branding"), panelID: "content-3" },
        { id: "content-4", content: t("settings.email_content.options"), panelID: "content-4" },
    ];

    const [selected, setSelected] = useState(0);
    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        []
    );

    const handleTranslation = () =>
        navigate("/translations");

    const handlePricing = () => navigate("/pricing");

    const handleSettingsChange = useCallback(
        (key, value) => {
            // let sett = setting;
            // let email_content = setting.email_content;
            // email_content[key] = value;
            // sett.email_content = email_content;
            // setCurrentSetting(sett)

            if (key === "intro_text" || key === "footer_text") {
                if (linkRegex.test(value)) {
                    setWarning(
                        t("settings.warning_links_detected")
                    );
                    return;
                } else {
                    setWarning("");
                }
            }

            setCurrentSetting((prevSetting) => {
                // Ensure download_content is initialized properly
                const updatedDownloadContent = {
                    ...prevSetting.email_content, // Preserve existing values
                    [key]: value, // Update the specific key
                };

                // Return the updated setting object
                return {
                    ...prevSetting,
                    email_content: updatedDownloadContent,
                };
            });
        },
        [setting]
    );

    const handleBrandingChange = useCallback(
        (key, value) => {
            // let sett = setting;
            // let email_content = setting.email_content;
            // email_content[key] = value;
            // sett.email_content = email_content;
            // setCurrentSetting(sett)

            setCurrentSetting((prevSetting) => {
                // Ensure download_content is initialized properly
                const updatedDownloadContent = {
                    ...prevSetting.email_content, // Preserve existing values
                    [key]: value, // Update the specific key
                };

                // Return the updated setting object
                return {
                    ...prevSetting,
                    email_content: updatedDownloadContent,
                };
            });
        },
        [setting]
    );

    const handleSendEmailChange = useCallback(
        async (value) => {
            setIsSaving(true);
            currentSetting.send_email = value ? 1 : 0;
            setCurrentSetting(currentSetting);
            // const response = await fetch('/api/save-setting', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(currentSetting),
            // });
            // if (response.ok) {
            //     // setIsModalOpen(false);
            //     setShowToast(true);
            //     setToastMessage('Email settings updated successfully');
            //     setIsSaving(false)
            // } else {
            //     setShowToast(true);
            //     setToastMessage('Failed to update email settings');
            //     setIsSaving(false)
            // }
            handleSave();
        },
        [setting]
    );

    const [isPreviewRefeching, setIsPreviewRefeching] = useState(false);

    const refetchPreview = async () => {
        try {
            setIsPreviewRefeching(true);
            const response = await fetch("/api/get-email-preview");

            if (!response.ok) {
                throw new Error('Failed to fetch email preview');
            }

            const result = await response.json();
            setPreviewHtml(result.html);
            setIsPreviewFetching(false);
        } catch (error) {
            console.error('Failed to fetch email preview:', error);
            setIsPreviewFetching(false);
        } finally {
            setIsPreviewRefeching(false);
        }
    };

    const handleFrameElement = React.useCallback((e) => {
        setFrameElement(e.target);
    }, []);

    useEffect(() => {
        if (store.finish_onboarding === 0) {
            refetchStore();
        }
        refetchPreview()
    }, [refetchStore, store.finish_onboarding]);

    useEffect(() => {
        const fetchUserPlan = async () => {
            // refetchStore();
            try {
                const response = await fetch("/api/user-plan");
                const data = await response.json();
                setUserPlan(data.plan);
            } catch (error) {
                console.error(t("settings.failed_to_fetch_user_plan"), error);
            }
        };

        const checkNewUsers = async () => {
            try {
                const response = await fetch('/api/check-new-user');
                const data = await response.json();
                setIsNewUser(data.isNewUser);
            } catch (error) {
                console.error('Failed to fetch user plan:', error);
            }
        };

        const getEmailTemplates = async () => {
            try {
                const response = await fetch('/api/get-templates');
                const data = await response.json();

                setEmailTemplates(data.templates)
                if(data.templates.length === 1) {
                    handleEmailTemplateChange(data.templates[0].id)
                }
            } catch (error) {
                console.error('Failed to fetch user plan:', error);
            }
        };

        getEmailTemplates();

        fetchUserPlan();
        checkNewUsers()
    }, []);

    const handleSmptKnob = useCallback(
        async (value) => {
            currentSetting.smtp_enabled = value ? 1 : 0;
            setCurrentSetting(currentSetting);

            handleSave();
        },
        [setting]
    );

    const handleSmpt = useCallback(
        async (key, value) => {
            const updatedSetting = setCurrentSetting((prevSetting) => {
                const updatedDownloadContent = {
                    ...prevSetting.smtp_details,
                    [key]: value,
                };

                const newSetting = {
                    ...prevSetting,
                    smtp_details: updatedDownloadContent,
                };

                // Call handleSave with the updated setting
                handleSave(newSetting);

                return newSetting;
            });
        },
        [setting]
    );

    const handleSave = async (newSetting = null) => {
        setIsSaving(true);

        const formData = new FormData();
        console.log(currentSetting.license_tracking_options);

        formData.append(
            "restrict_paid_downloads",
            currentSetting.restrict_paid_downloads
        );
        formData.append(
            "license_per_product",
            currentSetting.license_per_product
        );
        formData.append(
            "track_license_codes",
            currentSetting.track_license_codes
        );
        formData.append("tag_customer", currentSetting.tag_customer);
        formData.append("api_enabled", currentSetting.api_enabled);
        formData.append("smtp_enabled", currentSetting.smtp_enabled);
        formData.append("send_email", currentSetting.send_email);
        formData.append(
            "email_content",
            JSON.stringify(currentSetting.email_content)
        );
        formData.append(
            "lottery_content",
            JSON.stringify(currentSetting.lottery_content)
        );
        formData.append(
            "download_content",
            JSON.stringify(currentSetting.download_content)
        );
        formData.append(
            "license_tracking_options",
            JSON.stringify(currentSetting.license_tracking_options)
        );
        formData.append(
            "risky_order_delivery",
            currentSetting.risky_order_delivery
        );
        formData.append("ticket_image", currentSetting.ticket_image);
        formData.append(
            "pdf_stamping",
            JSON.stringify(currentSetting.pdf_stamping)
        );
        formData.append(
            "smtp_details",
            JSON.stringify(
                newSetting?.smtp_details ?? currentSetting.smtp_details
            )
        );

        if (file) {
            formData.append("email_logo", file);
        }
        if (lotteryContentFile) {
            formData.append("lottery_logo", lotteryContentFile);
        }
        if (downloadContentFile) {
            formData.append("download_logo", downloadContentFile);
        }

        const response = await fetch("/api/save-setting", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            shopify.toast.show(t("settings.settings_updated_successfully"));
            refetchStore();
            refetchPreview();
            setIsSaving(false);
        } else {
            shopify.toast.show(t("settings.failed_to_update_settings"), { isError: true, duration: 9999999 });
            setIsSaving(false);
        }
    };

    // const sendsmtp = async()=>{
    //     const response = await fetch("/api/sendsmtp",{
    //         testemail=email;
    //     })
    // }

    const sendsmtp = async () => {
        setIsSaving(false);
        setLoading(false);
        const formData = new FormData();

        formData.append("email", email);

        const response = await fetch("/api/sendsmtp", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            setLoading(true);
            setEmail("");
            shopify.toast.show("Email sent successfully.");
            setIsSaving(false);
        } else {
            shopify.toast.show("Failed to send email.", { isError: true, duration: 9999999 });
            setLoading(true);
            setIsSaving(false);
        }
    };

    const handleReplyToEmailChange = useCallback(
        async (value) => {
            setReplyToEmail(value);

            try {
                const response = await fetch("/api/update-reply-to-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reply_to_email: value }),
                });

                if (response.ok) {
                    shopify.toast.show(t("settings.email_content.reply_to_email_update_success"));
                    await refetchStore();
                    // setReplyToEmail('');
                } else {
                    shopify.toast.show(t("settings.email_content.failed_to_update_reply_to_email"), { isError: true, duration: 9999999 });
                }
            } catch (error) {
                console.error(t("settings.email_content.error_updating_reply"), error);
                shopify.toast.show(t("settings.email_content.failed_to_update_reply_to_email"), { isError: true, duration: 9999999 });

            }
        },
        [refetchStore]
    );

    const handleCcBccEmailChange = useCallback(async () => {
        try {
            const response = await fetch("/api/update-cc-bcc-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cc_email: ccEmail,
                    bcc_email: bccEmail,
                }),
            });

            if (response.ok) {
                setShowToast(true);
                setToastMessage(t("settings.email_content.cc/bcc_email_updated"));
                await refetchStore();
            } else {
                setShowToast(true);
                setToastMessage(t("settings.email_content.failed_to_update"));

            }
        } catch (error) {
            console.error(t("settings.email_content.error_updating_cc/bcc"), error);
            setShowToast(true);
            setToastMessage(t("settings.email_content.failed_to_update"));
        }
    }, [ccEmail, bccEmail, refetchStore]);

    const handleEmailTemplateChange = useCallback(async (value) => {

        try {
            setEmailTemplateId(value)
            const response = await fetch("/api/update-email-template", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email_template_id: value
                }),
            });

            if (response.ok) {
                setShowToast(true);
                setToastMessage(t("settings.email_content.email_template_updated_successfully"));
                await refetchStore();
            } else {
                setShowToast(true);
                setToastMessage(t("settings.email_content.failed_to_update_email_template"));
            }
        } catch (error) {
            console.error("Error updating Email Template:", error);
            setShowToast(true);
            setToastMessage(t("settings.email_content.failed_to_update_email_template"));
        }
    }, [emailTemplateId, refetchStore]);

    const loadingMarkup = (isLoadingData || isPreviewFetching) && (
        <SkeletonPage title={t("settings.email_content.email_setup")}>
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="300">
                            <SkeletonBodyText />
                            <SkeletonBodyText />
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    return (
        <div className="settings-email-container">
            <Page
                title={t("settings.title")}
                primaryAction={
                 <LanguageSelector/>
                }
            >
                <Layout>
                    <Layout.Section variant="oneThird">
                        <Card>
                            <SettingSideBar />
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card title={t("settings.email_content.tags")} sectioned>
                            {loadingMarkup}
                                                        {!isLoadingData &&
                                currentSetting &&
                                !isPreviewFetching && (
                                    <Page
                                        title={t("settings.email_content.email_setup")}
                                        subtitle={t("settings.email_content.email_setup_desc")}
                                    >
                                        <BlockStack
                                            gap={{ xs: "800", sm: "400" }}
                                        >
                                            <BlockStack gap="400">
                                                <Checkbox
                                                    checked={
                                                        currentSetting.send_email
                                                    }
                                                    onChange={(newValue, _) =>
                                                        handleSendEmailChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.email_content.send_email_to_customer")}
                                                />
                                                <Banner
                                                    title={t("settings.email_content.new_templates")}
                                                    status="warning"
                                                    action={{
                                                        content: t("settings.email_content.go_to_email_templates"),
                                                        onAction: () => navigate('/EmailTemplates'),
                                                        loading: permissionRequesting
                                                    }}
                                                >
                                                    <p>{t("settings.email_content.you_can_use_new_templates_instead_of_the_old_ones")}</p>
                                                </Banner>

                                                {
                                                    !isNewUser ?
                                                        <Button variant="primary" onClick={toggleModal}>
                                                            {t("settings.email_content.edit_order_email")}
                                                        </Button>
                                                    :
                                                        <Button variant="primary" onClick={() => {navigate('/EmailTemplates')}}>
                                                            {t("settings.email_content.email_templates")}
                                                        </Button>
                                                }

                                                <Select
                                                    options={[
                                                        ...(emailTemplates?.map((temp) => ({
                                                            label: temp.title === "Default Template" ? t("settings.email_content.default_template") : temp.title,
                                                            value: String(temp.id),
                                                        })) || []),
                                                    ]}
                                                    onChange={handleEmailTemplateChange}
                                                    value={emailTemplateId || ""}
                                                    label={t("settings.email_content.multi_product_order_template")}
                                                    helpText={t("settings.email_content.this_ensures_all_digital_products_in_a_single_order_are_delivered_in_one_email_with_unified_design")}
                                                    placeholder={t("settings.email_content.select_template")} // Optional: for react-select
                                                />

                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <TextField
                                                        label={t("settings.email_content.reply_to_email")}
                                                        type="email"
                                                        value={replyToEmail}
                                                        onChange={(value) =>
                                                            setReplyToEmail(
                                                                value
                                                            )
                                                        }
                                                        onBlur={() =>
                                                            handleReplyToEmailChange(
                                                                replyToEmail
                                                            )
                                                        }
                                                        autoComplete="off"
                                                        placeholder={t("settings.email_content.support@digitally.com")}
                                                    />
                                                </div>
                                                <div>
                                                    <Text
                                                        variant="bodySm"
                                                        as="p"
                                                        color="subdued"
                                                    >
                                                        {t("settings.email_content.reply_to_email_desc")}
                                                    </Text>
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <TextField
                                                        label={t("settings.email_content.cc_email_address")}
                                                        value={ccEmail}
                                                        onChange={setCcEmail}
                                                        onBlur={
                                                            handleCcBccEmailChange
                                                        }
                                                        autoComplete="off"
                                                        placeholder={t("settings.email_content.cc@exmple.com")}
                                                    />
                                                </div>
                                                <div>
                                                    <Text
                                                        variant="bodySm"
                                                        as="p"
                                                        color="subdued"
                                                    >
                                                        {t("settings.email_content.cc_desc")}
                                                    </Text>
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <TextField
                                                        label={t("settings.email_content.bcc_email_address")}
                                                        value={bccEmail}
                                                        onChange={setBccEmail}
                                                        onBlur={
                                                            handleCcBccEmailChange
                                                        }
                                                        autoComplete="off"
                                                        placeholder={t("settings.email_content.bcc@example.com")}
                                                    />
                                                </div>
                                                <div>
                                                    <Text
                                                        variant="bodySm"
                                                        as="p"
                                                        color="subdued"
                                                    >
                                                        {t("settings.email_content.bcc_desc")}
                                                    </Text>
                                                </div>



                                                <BlockStack gap={300}>
                                                    <BlockStack>
                                                        <InlineStack align="space-between">
                                                            <InlineStack
                                                                align="start"
                                                                gap="300"
                                                                blockAlign="center"
                                                            >
                                                                <Text
                                                                    variant="headingXs"
                                                                    as="h6"
                                                                >
                                                                     {t("settings.email_content.use_your_own_smtp_server_optional")}

                                                                </Text>
                                                                {/* <div className="badge-responsive-margin"> */}
                                                                <Badge
                                                                    tone={
                                                                        currentSetting.smtp_enabled
                                                                            ? "success"
                                                                            : "attention"
                                                                    }
                                                                >
                                                                    {currentSetting.smtp_enabled
                                                                        ?  t("settings.email_content.enabled")
                                                                        : t("settings.email_content.disabled")}
                                                                </Badge>
                                                                {/* </div> */}
                                                            </InlineStack>
                                                            <Knob
                                                                selected={
                                                                    currentSetting.smtp_enabled
                                                                }
                                                                onClick={() =>
                                                                    handleSmptKnob(
                                                                        !currentSetting.smtp_enabled
                                                                    )
                                                                }
                                                            />
                                                        </InlineStack>
                                                    </BlockStack>

                                                    {currentSetting.smtp_enabled ==
                                                        1 && (
                                                        <div>
                                                            <BlockStack
                                                                gap={300}
                                                            >
                                                                <BlockStack>
                                                                    <List type="bullet">
                                                                        <List.Item>
                                                                            {t("settings.email_content.use_your_own_smtp_server_to_avoid_delayed_email_delivery_at_peak_times_or_bursts_of_email_volume")}

                                                                        </List.Item>
                                                                        <List.Item>
                                                                            { t("settings.email_content.our_app_will_send_email_through_your_own_smtp_server")}

                                                                        </List.Item>
                                                                        <List.Item>
                                                                            { t("settings.email_content.we_cant_track_email_delivery_status_events_when_you_use_custom_smtp")}

                                                                        </List.Item>
                                                                    </List>
                                                                </BlockStack>

                                                                <BlockStack
                                                                    gap={300}
                                                                >
                                                                    <TextField
                                                                        label={t("settings.email_content.server_name")}
                                                                        value={
                                                                            serverName
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) => {
                                                                            setServerName(
                                                                                value
                                                                            );
                                                                        }}
                                                                        onBlur={(
                                                                            event
                                                                        ) =>
                                                                            handleSmpt(
                                                                                "server_name",
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        autoComplete="off"
                                                                    />
                                                                    <TextField
                                                                        label={t("settings.email_content.port")}
                                                                        placeholder="465,587,..."
                                                                        value={
                                                                            port
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) => {
                                                                            setPort(
                                                                                value
                                                                            );
                                                                        }}
                                                                        onBlur={(
                                                                            event
                                                                        ) =>
                                                                            handleSmpt(
                                                                                "port",
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        autoComplete="off"
                                                                    />
                                                                    <TextField
                                                                        label={t("settings.email_content.from_email")}
                                                                        value={
                                                                            fromEmail
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) => {
                                                                            setFromEmail(
                                                                                value
                                                                            );
                                                                        }}
                                                                        onBlur={(
                                                                            event
                                                                        ) =>
                                                                            handleSmpt(
                                                                                "fromEmail",
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        autoComplete="off"
                                                                    />
                                                                </BlockStack>

                                                                <BlockStack>
                                                                    <Checkbox
                                                                        label={t("settings.email_content.tls_secure")}
                                                                        checked={
                                                                            currentSetting
                                                                                .smtp_details
                                                                                ?.tls_secure ??
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) => {
                                                                            handleSmpt(
                                                                                "tls_secure",
                                                                                value
                                                                            );
                                                                        }}
                                                                    />
                                                                </BlockStack>

                                                                <BlockStack
                                                                    gap={300}
                                                                >
                                                                    <Checkbox
                                                                        label={t("settings.email_content.require_authentication")}
                                                                        checked={
                                                                            currentSetting
                                                                                .smtp_details
                                                                                ?.require_authentication ??
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) => {
                                                                            handleSmpt(
                                                                                "require_authentication",
                                                                                value
                                                                            );
                                                                        }}
                                                                    />
                                                                    {currentSetting
                                                                        .smtp_details
                                                                        ?.require_authentication ==
                                                                        1 && (
                                                                        <BlockStack
                                                                            gap={
                                                                                300
                                                                            }
                                                                        >
                                                                            <TextField
                                                                                label={t("settings.email_content.username")}
                                                                                value={
                                                                                    username
                                                                                }
                                                                                onChange={(
                                                                                    value
                                                                                ) => {
                                                                                    setUserName(
                                                                                        value
                                                                                    );
                                                                                }}
                                                                                onBlur={(
                                                                                    event
                                                                                ) =>
                                                                                    handleSmpt(
                                                                                        "username",
                                                                                        event
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                autoComplete="off"
                                                                            />
                                                                            <TextField
                                                                                label={t("settings.email_content.password")}
                                                                                type="password"
                                                                                value={
                                                                                    password
                                                                                }
                                                                                onChange={(
                                                                                    value
                                                                                ) => {
                                                                                    setPassword(
                                                                                        value
                                                                                    );
                                                                                }}
                                                                                onBlur={(
                                                                                    event
                                                                                ) =>
                                                                                    handleSmpt(
                                                                                        "password",
                                                                                        event
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                autoComplete="off"
                                                                            />
                                                                        </BlockStack>
                                                                    )}
                                                                </BlockStack>

                                                                <BlockStack
                                                                    gap={300}
                                                                >
                                                                    <Text
                                                                        variant="headingMd"
                                                                        as="h6"
                                                                    >
                                                                        {t("settings.email_content.send_test_email")}
                                                                    </Text>

                                                                    <BlockStack
                                                                        gap={
                                                                            100
                                                                        }
                                                                    >
                                                                        <Text
                                                                            variant="bodyMd"
                                                                            as="p"
                                                                        >
                                                                             {t("settings.email_content.receiver_email")}
                                                                        </Text>
                                                                        <InlineStack
                                                                            gap={
                                                                                100
                                                                            }
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    flex: 1,
                                                                                }}
                                                                            >
                                                                                <TextField
                                                                                    value={
                                                                                        email
                                                                                    }
                                                                                    placeholder="youremail@gmail.com"
                                                                                    onChange={(
                                                                                        value
                                                                                    ) => {
                                                                                        setEmail(
                                                                                            value
                                                                                        );
                                                                                    }}
                                                                                    autoComplete="off"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                {loading ==
                                                                                    true && (
                                                                                    <Button
                                                                                        size="large"
                                                                                        icon={
                                                                                            SendIcon
                                                                                        }
                                                                                        onClick={() => {
                                                                                            sendsmtp();
                                                                                        }}
                                                                                    >
                                                                                       {t("settings.email_content.send")}
                                                                                    </Button>
                                                                                )}
                                                                                {loading ==
                                                                                    false && (
                                                                                    <Button
                                                                                        loading
                                                                                    >
                                                                                        Save
                                                                                        product
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        </InlineStack>
                                                                    </BlockStack>
                                                                </BlockStack>
                                                            </BlockStack>
                                                        </div>
                                                    )}
                                                </BlockStack>

                                                <Modal
                                                    size="large"
                                                    open={isModalOpen}
                                                    onClose={toggleModal}
                                                    title={t("settings.email_content.new_digital_products_email")}
                                                    primaryAction={{
                                                        content: t("settings.email_content.save_capital"),
                                                        onAction: handleSave,
                                                        loading: isSaving,
                                                        disabled:
                                                            warning !== "",
                                                    }}
                                                    secondaryActions={[
                                                        {
                                                            content: t("settings.email_content.cancel_capital"),
                                                            onAction:
                                                                toggleModal,
                                                        },
                                                    ]}
                                                >
                                                    <Modal.Section>
                                                        <Layout>
                                                            <Layout.Section>
                                                                <Card>
                                                                    <InlineStack
                                                                        align="space-between"
                                                                        blockAlign="center"
                                                                    >
                                                                        <Text
                                                                            as="h3"
                                                                            variant="headingMd"
                                                                        >
                                                                            {t("settings.email_content.preview")}
                                                                        </Text>
                                                                        <Button
                                                                            loading={
                                                                                isPreviewRefeching
                                                                            }
                                                                            onClick={
                                                                                refetchPreview
                                                                            }
                                                                            style={{
                                                                                float: "right",
                                                                            }}
                                                                        >
                                                                            {t("settings.email_content.update_preview")}
                                                                        </Button>
                                                                    </InlineStack>

                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "20px",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            as="h3"
                                                                            variant="headingMd"
                                                                        >
                                                                            {t("settings.email_content.subject")}
                                                                        </Text>
                                                                        <Text
                                                                            as="p"
                                                                            variant="bodyMd"
                                                                        >
                                                                            {currentSetting.email_content.subject.replace(
                                                                                t("settings.email_content.order_name_"),
                                                                                '#1001'
                                                                            )}
                                                                        </Text>
                                                                    </div>
                                                                    {isPreviewFetching && (
                                                                        <p>
                                                                            {t("settings.email_content.loading")}
                                                                        </p>
                                                                    )}

                                                                    {!isPreviewFetching && (
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            <Layout>
                                                                                <Layout.Section variant="oneThird">
                                                                                    <Text
                                                                                        as="h3"
                                                                                        variant="headingMd"
                                                                                    >
                                                                                        {t("settings.email_content.body")}
                                                                                    </Text>
                                                                                </Layout.Section>
                                                                                <Layout.Section>
                                                                                    {previewHtml && (
                                                                                        <iframe
                                                                                            style={{
                                                                                                width: "100%",
                                                                                                height: "400px",
                                                                                                border: "none",
                                                                                            }}
                                                                                            srcDoc={
                                                                                                previewHtml
                                                                                            }
                                                                                            sandbox="allow-same-origin"
                                                                                            onLoad={
                                                                                                handleFrameElement
                                                                                            }
                                                                                        />
                                                                                    )}
                                                                                </Layout.Section>
                                                                            </Layout>
                                                                        </div>
                                                                    )}
                                                                </Card>
                                                            </Layout.Section>
                                                            <Layout.Section variant="oneThird">
                                                                <Card>
                                                                    <Text
                                                                        as="h3"
                                                                        variant="headingMd"
                                                                    >
                                                                        {t("settings.email_content.editor")}
                                                                    </Text>
                                                                    <Tabs
                                                                        tabs={
                                                                            tabs
                                                                        }
                                                                        selected={
                                                                            selected
                                                                        }
                                                                        onSelect={
                                                                            handleTabChange
                                                                        }
                                                                    >
                                                                        <Card>
                                                                            {tabs[
                                                                                selected
                                                                            ]
                                                                                .content ===
                                                                                "Content" ? (
                                                                                <>
                                                                                    {userPlan ===
                                                                                        "free" && (
                                                                                            <div
                                                                                                style={{
                                                                                                    marginTop:
                                                                                                        "10px",
                                                                                                }}
                                                                                            >
                                                                                                <Banner
                                                                                                    tone="warning"
                                                                                                    title={t("settings.email_content.upgrade_your_plan")}
                                                                                                >
                                                                                                    <Text
                                                                                                        variant="bodyMd"
                                                                                                        as="p"
                                                                                                    >
                                                                                                        {t("settings.email_content.upgrade_to_paid_plan")}
                                                                                                    </Text>
                                                                                                    <div
                                                                                                        style={{
                                                                                                            marginTop:
                                                                                                                "5px",
                                                                                                        }}
                                                                                                    ></div>
                                                                                                    <Button
                                                                                                        variant="primary"
                                                                                                        onClick={
                                                                                                            handlePricing
                                                                                                        }
                                                                                                    >
                                                                                                        {t("settings.email_content.upgrade_now")}
                                                                                                    </Button>
                                                                                                </Banner>
                                                                                            </div>
                                                                                        )}
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.email_from_name")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.from ??
                                                                                                store?.name ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "from",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.from_email_name")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.email_subject")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.subject ??
                                                                                                t("settings.email_content.your_digital_products")
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "subject",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.your_digital_products_are")}
                                                                                            helpText={
                                                                                                <span>
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.order_name1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    "&"{" "}
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_product")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.product_name1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    {t("settings.email_content.variables_available")}
                                                                                                </span>
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.update_email")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.subject_updated ??
                                                                                                t("settings.email_content.update_your_digital")
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "subject_updated",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.update_your_digital")}
                                                                                            helpText={
                                                                                                <span>
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.order_name1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    "&"{" "}
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_product")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.product_name1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    {t("settings.email_content.variables_available")}
                                                                                                </span>
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.email_introduction")}
                                                                                            multiline={
                                                                                                4
                                                                                            }
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.intro_text ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "intro_text",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.hello_full_name")}
                                                                                            helpText={
                                                                                                <span>
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_be_order_name")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.order_name1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    "&"
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_customer_full")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.full_name")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    "&"
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_customer_first")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.first_name")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    "&"
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_customer_last")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.last_name")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    "&"
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_by_product_name")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.product_name1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    {t("settings.email_content.variables_available")}
                                                                                                </span>
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                        {warning && (
                                                                                            <div
                                                                                                style={{
                                                                                                    color: "red",
                                                                                                    marginTop:
                                                                                                        "10px",
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    warning
                                                                                                }
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.digital_products_file_title")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.file_title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "file_title",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.files")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.digital_products_license_title")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.license_title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "license_title",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.license_title")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.digital_products_custom_link_title")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.custom_link_title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "custom_link_title",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.custom_link_title")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <Checkbox
                                                                                            label={t("settings.email_content.enable_custom_link_button")}
                                                                                            checked={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.enable_custom_link_button ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "enable_custom_link_button",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    {currentSetting
                                                                                        .email_content
                                                                                        ?.enable_custom_link_button && (
                                                                                            <div
                                                                                                style={{
                                                                                                    marginTop:
                                                                                                        "10px",
                                                                                                }}
                                                                                            >
                                                                                                <TextField
                                                                                                    label={t("settings.email_content.custom_link_button_text")}
                                                                                                    value={
                                                                                                        currentSetting
                                                                                                            .email_content
                                                                                                            ?.custom_link_button_text ??
                                                                                                        ""
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        value
                                                                                                    ) =>
                                                                                                        handleSettingsChange(
                                                                                                            "custom_link_button_text",
                                                                                                            value
                                                                                                        )
                                                                                                    }
                                                                                                    autoComplete="off"
                                                                                                    placeholder={t("settings.email_content.enter_custom_link_button_text")}
                                                                                                    disabled={
                                                                                                        userPlan ===
                                                                                                        "free"
                                                                                                    }
                                                                                                    helpText={
                                                                                                        <span>
                                                                                                            {t("settings.email_content.enter_custom_link_desc")}
                                                                                                        </span>
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                        )}
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.download_button_text")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.download_button_text ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "download_button_text",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.downloads_digital_assets")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                            helpText={
                                                                                                <span>
                                                                                                    {t("settings.email_content.download_digital_assets_desc")}
                                                                                                </span>
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            multiline={
                                                                                                4
                                                                                            }
                                                                                            label={t("settings.email_content.footer_text")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.footer_text ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "footer_text",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.thanks_if_you")}
                                                                                            helpText={
                                                                                                <span>
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_be_order_name")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.order_name1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    "&"
                                                                                                    <Tooltip content={t("settings.email_content.this_will_be_replace_by_product_name")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.email_content.product_name1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    {t("settings.email_content.variables_available")}
                                                                                                </span>
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                        {warning && (
                                                                                            <div
                                                                                                style={{
                                                                                                    color: "red",
                                                                                                    marginTop:
                                                                                                        "10px",
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    warning
                                                                                                }
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </>
                                                                            ) : tabs[
                                                                                selected
                                                                            ]
                                                                                .content ===
                                                                                "Branding" ? (
                                                                                <div>
                                                                                    {userPlan ===
                                                                                        "free" && (
                                                                                            <div
                                                                                                style={{
                                                                                                    marginTop:
                                                                                                        "10px",
                                                                                                }}
                                                                                            >
                                                                                                <Banner
                                                                                                    tone="warning"
                                                                                                    title={t("settings.email_content.upgrade_your_plan")}
                                                                                                >
                                                                                                    <Text
                                                                                                        variant="bodyMd"
                                                                                                        as="p"
                                                                                                    >
                                                                                                        {t("settings.email_content.upgrade_to_paid_plan_edit_branding")}
                                                                                                    </Text>
                                                                                                    <div
                                                                                                        style={{
                                                                                                            marginTop:
                                                                                                                "5px",
                                                                                                        }}
                                                                                                    ></div>
                                                                                                    <Button
                                                                                                        variant="primary"
                                                                                                        onClick={
                                                                                                            handlePricing
                                                                                                        }
                                                                                                    >
                                                                                                        {t("settings.email_content.upgrade_now")}
                                                                                                    </Button>
                                                                                                </Banner>
                                                                                            </div>
                                                                                        )}
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <DropZone
                                                                                            label={t("settings.email_content.upload_company_logo")}
                                                                                            onDrop={
                                                                                                handleDropZoneDrop
                                                                                            }
                                                                                            accept="image/*"
                                                                                            maxFiles={
                                                                                                1
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        >
                                                                                            <DropZone.FileUpload />
                                                                                        </DropZone>

                                                                                        {file ? (
                                                                                            <BlockStack gap="200">
                                                                                                <InlineStack
                                                                                                    gap="200"
                                                                                                    blockAlign="center"
                                                                                                >
                                                                                                    <BlockStack>
                                                                                                        <Text
                                                                                                            variant="bodyMd"
                                                                                                            as="p"
                                                                                                            fontWeight="bold"
                                                                                                        >
                                                                                                            {
                                                                                                                file.name
                                                                                                            }
                                                                                                        </Text>
                                                                                                        <Text
                                                                                                            variant="bodySm"
                                                                                                            as="p"
                                                                                                        >
                                                                                                            {prettyBytes(
                                                                                                                file.size
                                                                                                            )}
                                                                                                        </Text>
                                                                                                    </BlockStack>
                                                                                                </InlineStack>
                                                                                            </BlockStack>
                                                                                        ) : (
                                                                                            currentSetting
                                                                                                .email_content
                                                                                                ?.email_logo
                                                                                                ?.file_name && (
                                                                                                <BlockStack
                                                                                                    gap="200"
                                                                                                    style={{
                                                                                                        marginTop:
                                                                                                            "10px",
                                                                                                    }}
                                                                                                >
                                                                                                    <InlineStack
                                                                                                        gap="200"
                                                                                                        blockAlign="center"
                                                                                                    >
                                                                                                        <BlockStack>
                                                                                                            <Text
                                                                                                                variant="bodyMd"
                                                                                                                as="p"
                                                                                                                fontWeight="bold"
                                                                                                            >
                                                                                                                {
                                                                                                                    currentSetting
                                                                                                                        .email_content
                                                                                                                        .email_logo
                                                                                                                        .file_name
                                                                                                                }
                                                                                                            </Text>
                                                                                                        </BlockStack>
                                                                                                    </InlineStack>
                                                                                                </BlockStack>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.company_name")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.company_name ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleBrandingChange(
                                                                                                    "company_name",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.enter_you_company_name")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.email_content.contact_details")}
                                                                                            multiline={
                                                                                                4
                                                                                            }
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.contact_details ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleBrandingChange(
                                                                                                    "contact_details",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.email_content.enter_contact_desc")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div
                                                                                    style={{
                                                                                        marginTop:
                                                                                            "10px",
                                                                                    }}
                                                                                >
                                                                                    <Checkbox
                                                                                        label={t("settings.email_content.send_only_text_email")}
                                                                                        checked={
                                                                                            currentSetting
                                                                                                .email_content
                                                                                                ?.send_text_email_only ??
                                                                                            false
                                                                                        }
                                                                                        onChange={(
                                                                                            value
                                                                                        ) =>
                                                                                            handleSettingsChange(
                                                                                                "send_text_email_only",
                                                                                                value
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            userPlan ===
                                                                                            "free"
                                                                                        }
                                                                                    />
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <Checkbox
                                                                                            label={t("settings.email_content.show_files_downloads")}
                                                                                            checked={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.show_files ??
                                                                                                true
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "show_files",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <Checkbox
                                                                                            label={t("settings.email_content.show_custom_links")}
                                                                                            checked={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.show_custom_links ??
                                                                                                true
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "show_custom_links",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <Checkbox
                                                                                            label={t("settings.email_content.show_license_keys")}
                                                                                            checked={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.show_license_keys ??
                                                                                                true
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "show_license_keys",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <Checkbox
                                                                                            label={t("settings.email_content.show_product_quantity")}
                                                                                            checked={
                                                                                                currentSetting
                                                                                                    .email_content
                                                                                                    ?.show_product_qty ??
                                                                                                true
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSettingsChange(
                                                                                                    "show_product_qty",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </Card>
                                                                    </Tabs>
                                                                </Card>
                                                            </Layout.Section>
                                                        </Layout>
                                                    </Modal.Section>
                                                </Modal>
                                            </BlockStack>

                                            {/* <div style={{ marginBottom: "25px" }}></div> */}
                                        </BlockStack>
                                    </Page>
                                )}
                        </Card>
                        <div
            style={{
                marginBottom: "16px",
            }}
        ></div>
                    </Layout.Section>
                </Layout>
                <div style={{ paddingBottom: "80px" }}></div>
            </Page>
        </div>
    );
};

export default Email;
