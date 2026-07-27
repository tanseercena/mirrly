import SettingSideBar from "../../components/SettingSideBar";
import {
    BlockStack,
    Button,
    Card,
    InlineStack,
    Layout,
    Page,
    SkeletonBodyText,
    SkeletonPage,
    Text,
    TextField,
    Modal,
    Tabs,
    LegacyCard,
    Banner,
    DropZone,
    Select, Checkbox
} from "@shopify/polaris";
import LanguageSelector from "../../components/LanguageSelector";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { AppContext } from "../../components/providers/AppProvider";
// import '../App.css'
import prettyBytes from "pretty-bytes";
import { useAppBridge } from "@shopify/app-bridge-react";
import { SaveBar } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";


const Download = () => {
    const shopify = useAppBridge();
    const { store, isLoadingData, refetchStore } = useContext(AppContext);
    const navigate = useNavigate();

    const [userPlan, setUserPlan] = useState("free");
    const [currentSetting, setCurrentSetting] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [downloadPreviewHtml, setDownloadPreviewHtml] = useState(null);
    const [isDownloadPreviewFetching, setIsDownloadPreviewFetching] =
        useState(true);
    const [downloadFrameElement, setDownloadFrameElement] =
        React.useState(null);

    const [file, setFile] = useState(null);
    const [lotteryContentFile, setLotteryContentFile] = useState(null);
    const [downloadContentFile, setDownloadContentFile] = useState(null);
    const [faviconFile, setFaviconFile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [hasRequiredScopes, setHasRequiredScopes] = useState(false);
    const [hasOrderRequiredScopes, setHasOrderRequiredScopes] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const { t } = useTranslation()

    // Effect to monitor changes and show/hide SaveBar
    useEffect(() => {
        console.log('SaveBar state changed:', { hasUnsavedChanges, isSampleModalOpen });
        if (hasUnsavedChanges && shopify) {
            console.log('Showing SaveBar');
            try {
                shopify.saveBar.show('download-settings-savebar');
            } catch (error) {
                // SaveBar not set up - ignore error
            }
        } else if (shopify) {
            console.log('Hiding SaveBar');
            try {
                shopify.saveBar.hide('download-settings-savebar');
            } catch (error) {
                // SaveBar not set up - ignore error
            }
        }
    }, [hasUnsavedChanges, isSampleModalOpen, shopify]);


    const apiEndpoint = process.env.SHOPIFY_API_KEY?.endsWith("fb15d")
        ? "https://digitally.test/api/v1/create-order"
        : "https://digitally.conversionproplus.com/api/v1/create-order";
    const apiDocumentationUrl = "#";

    const linkRegex =
        /(?:<a\s+[^>]*href\s*=\s*["'][^"']+["'][^>]*>)|(?:https?:\/\/[^\s]+)|(?:www\.[^\s]+)|(?:[^\s]+\.[^\s]{2,})/i;

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(store?.api_token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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

    const handleDownloadContentDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setDownloadContentFile(acceptedFiles[0]);
            }
        },
        []
    );

    const handleFaviconDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setFaviconFile(acceptedFiles[0]);
            }
        },
        []
    );

    const setting = store?.setting
        ? {
            ...store.setting,
        }
        : null;

    useEffect(() => {
        setCurrentSetting(setting);
    }, [store]);

    useEffect(() => {
        shopify.loading(isLoadingData || isDownloadPreviewFetching);
    }, [isLoadingData, isDownloadPreviewFetching, shopify]);

    const toggleToast = useCallback(
        () => setShowToast((showToast) => !showToast),
        []
    );

    const toggleSampleModal = () => {
        if (!isSampleModalOpen) {
            // Opening the modal - reset unsaved changes
            setHasUnsavedChanges(false);
        } else if (hasUnsavedChanges) {
            // Closing the modal with unsaved changes - confirm or just close
            setHasUnsavedChanges(false);
        }
        setIsSampleModalOpen(!isSampleModalOpen);
    };

    const tabs = [
        { id: "content-1", content: t("settings.download_page.content"), panelID: "content-1" },
        // { id: 'content-2', content: 'Template', panelID: 'content-2' },
        { id: "content-3", content: t("settings.download_page.branding"), panelID: "content-3" },
        // { id: "content-4", content: t("settings.download_page.options"), panelID: "content-4" },
    ];

    const [selectedSampleTab, setSelectedSampleTab] = useState(0);

    const handlePricing = () => navigate("/pricing");

    const handleSampleTabChange = useCallback(
        (selectedTabIndex) => setSelectedSampleTab(selectedTabIndex),
        []
    );

    const handleSampleSettingsChange = useCallback(
        (key, value) => {
            console.log('handleSampleSettingsChange:', { key, value, isSampleModalOpen });

            // let sett = setting;
            // let email_content = setting.download_content;
            // email_content[key] = value;
            // sett.download_content = email_content;
            // setCurrentSetting(sett)

            setCurrentSetting((prevSetting) => {
                // Ensure download_content is initialized properly
                const updatedDownloadContent = {
                    ...prevSetting.download_content, // Preserve existing values
                    [key]: value, // Update the specific key
                };

                // Return the updated setting object
                return {
                    ...prevSetting,
                    download_content: updatedDownloadContent,
                };
            });

            // Mark as having unsaved changes when in modal
            if (isSampleModalOpen) {
                console.log('Setting hasUnsavedChanges to true');
                setHasUnsavedChanges(true);
            }
        },
        [setting, isSampleModalOpen]
    );

    const handleSampleBrandingChange = useCallback(
        (key, value) => {
            console.log('handleSampleBrandingChange:', { key, value, isSampleModalOpen });

            // let sett = setting;
            // let email_content = setting.lottery_content;
            // email_content[key] = value;
            // sett.lottery_content = email_content;
            // setCurrentSetting(sett)

            setCurrentSetting((prevSetting) => {
                // Ensure download_content is initialized properly
                const updatedDownloadContent = {
                    ...prevSetting.download_content, // Preserve existing values
                    [key]: value, // Update the specific key
                };

                // Return the updated setting object
                return {
                    ...prevSetting,
                    download_content: updatedDownloadContent,
                };
            });

            // Mark as having unsaved changes when in modal
            if (isSampleModalOpen) {
                console.log('Setting hasUnsavedChanges to true');
                setHasUnsavedChanges(true);
            }
        },
        [setting, isSampleModalOpen]
    );

    const [isDownloadPreviewRefeching, setIsDownloadPreviewRefeching] = useState(false);

    const refetchDownloadPreview = useCallback(async () => {
        setIsDownloadPreviewRefeching(true);
        try {
            const response = await fetch("/api/get-download-page-preview");
            const data = await response.json();
            setDownloadPreviewHtml(data.html);
            setIsDownloadPreviewFetching(false);
        } catch (error) {
            console.error("Failed to fetch download page preview:", error);
            setIsDownloadPreviewFetching(false);
        } finally {
            setIsDownloadPreviewRefeching(false);
        }
    }, []);

    const handleDownloadFrameElement = React.useCallback((e) => {
        setDownloadFrameElement(e.target);
    }, []);

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const response = await fetch("/api/user-plan");
                const data = await response.json();
                setUserPlan(data.plan);
            } catch (error) {
                console.error(t("settings.download_page.failed_to_fetch_user_plan"), error);
            }
        };

        fetchUserPlan();
        refetchDownloadPreview();
    }, []);

    const handleSave = async () => {
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

        if (file) {
            formData.append("email_logo", file);
        }
        if (lotteryContentFile) {
            formData.append("lottery_logo", lotteryContentFile);
        }
        if (downloadContentFile) {
            formData.append("download_logo", downloadContentFile);
        }
        if (faviconFile) {
            formData.append("favicon", faviconFile);
        }

        const response = await fetch("/api/save-setting", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            shopify.toast.show(t("settings.download_page.settings_updated_successfully"));
            refetchStore();
            refetchDownloadPreview();
            setIsSaving(false);
            setHasUnsavedChanges(false);
        } else {
            setShowToast(true);
            shopify.toast.show(t("settings.download_page.failed_to_update_settings"), { isError: true, duration: 9999999 });
            setIsSaving(false);
        }
    };

    const loadingMarkup = (isLoadingData || isDownloadPreviewFetching) && (
        <SkeletonPage title={t("settings.download_page.title")}>
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
        <div className="settings-download-container">
            {/* {loadingMarkup} */}

            {/* SaveBar Component - Always rendered, controlled by show/hide */}
            <SaveBar id="download-settings-savebar">
                <button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? t("saving") : t("settings.download_page.save")}
                </button>
                <button onClick={toggleSampleModal}>
                    {t("settings.download_page.cancel")}
                </button>
            </SaveBar>

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
                        <Card title={t("settings.download_page.tags")} sectioned>
                            {loadingMarkup}
                            {!isLoadingData &&
                                currentSetting &&
                                !isDownloadPreviewFetching && (
                                    <Page
                                        title={t("settings.download_page.title")}
                                        subtitle={t("settings.download_page.desc")}
                                    >
                                        <BlockStack
                                            gap={{ xs: "800", sm: "400" }}
                                        >
                                            <BlockStack gap="400">
                                                <Text as="p" variant="bodyMd">
                                                    {t("settings.download_page.download_sample_content")}
                                                </Text>
                                                <Button
                                                    variant="primary"
                                                    onClick={toggleSampleModal}
                                                >
                                                    {t("settings.download_page.edit_download_and_sample")}
                                                </Button>

                                                <Modal
                                                    size="large"
                                                    open={isSampleModalOpen}
                                                    onClose={toggleSampleModal}
                                                    title={t("settings.download_page.download_sample_or_content")}
                                                    // primaryAction={{
                                                    //     content: t("settings.download_page.save"),
                                                    //     onAction: handleSave,
                                                    //     loading: isSaving,
                                                    // }}
                                                    // secondaryActions={[
                                                    //     {
                                                    //         content: t("settings.download_page.cancel"),
                                                    //         onAction:
                                                    //             toggleSampleModal,
                                                    //     },
                                                    // ]}
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
                                                                            {t("settings.download_page.title_")}
                                                                        </Text>
                                                                        <Button
                                                                            loading={
                                                                                isDownloadPreviewRefeching
                                                                            }
                                                                            onClick={
                                                                                refetchDownloadPreview
                                                                            }
                                                                            style={{
                                                                                float: "right",
                                                                            }}
                                                                        >
                                                                            {t("settings.download_page.update_download_preview")}
                                                                        </Button>
                                                                    </InlineStack>

                                                                    {isDownloadPreviewFetching && (
                                                                        <p>
                                                                            {t("settings.download_page.loading")}
                                                                        </p>
                                                                    )}

                                                                    {!isDownloadPreviewFetching && (
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            <Layout>
                                                                                <Layout.Section>
                                                                                    {downloadPreviewHtml && (
                                                                                        <iframe
                                                                                            style={{
                                                                                                width: "100%",
                                                                                                height: "550px",
                                                                                                border: "none",
                                                                                            }}
                                                                                            srcDoc={
                                                                                                downloadPreviewHtml
                                                                                            }
                                                                                            sandbox="allow-same-origin"
                                                                                            onLoad={
                                                                                                handleDownloadFrameElement
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
                                                                        {t("settings.download_page.editor")}
                                                                    </Text>
                                                                    <Tabs
                                                                        tabs={
                                                                            tabs
                                                                        }
                                                                        selected={
                                                                            selectedSampleTab
                                                                        }
                                                                        onSelect={
                                                                            handleSampleTabChange
                                                                        }
                                                                    >
                                                                        <LegacyCard.Section>
                                                                            {tabs[
                                                                                selectedSampleTab
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
                                                                                                    title={t("settings.download_page.upgrade_your_plan")}
                                                                                                >
                                                                                                    <Text
                                                                                                        variant="bodyMd"
                                                                                                        as="p"
                                                                                                    >
                                                                                                        {t("settings.download_page.upgrade_to_paid_plan_edit_download")}
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
                                                                                                        {t("settings.download_page.upgrade_now")}
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
                                                                                            label={t("settings.download_page.order_title")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .download_content
                                                                                                    ?.order_title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSampleSettingsChange(
                                                                                                    "order_title",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.download_page.order_{{")}
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
                                                                                            label={t("settings.download_page.sample_files")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .download_content
                                                                                                    ?.sample_file_title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSampleSettingsChange(
                                                                                                    "sample_file_title",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.download_page.sample_files")}
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
                                                                                            label={t("settings.download_page.digital_products_title")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .download_content
                                                                                                    ?.digital_products_title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSampleSettingsChange(
                                                                                                    "digital_products_title",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.download_page.digital_products")}
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
                                                                                            label={t("settings.download_page.download_file_button_text")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .download_content
                                                                                                    ?.download_file_button_text ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSampleSettingsChange(
                                                                                                    "download_file_button_text",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.download_page.download_file")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div style={{ marginTop: '10px' }}>
                                                                                        <TextField
                                                                                            label={t("settings.download_page.files_title")}
                                                                                            value={currentSetting.download_content?.files_title ?? 'Files'}
                                                                                            onChange={(value) => handleSampleSettingsChange('files_title', value)}
                                                                                            autoComplete="off"
                                                                                            placeholder="Files"
                                                                                            disabled={userPlan === 'free'}
                                                                                        />
                                                                                    </div>
                                                                                    <div style={{ marginTop: '10px' }}>
                                                                                        <TextField
                                                                                            label={t("settings.download_page.license_keys_title")}
                                                                                            value={currentSetting.download_content?.license_keys_title ?? 'License Keys/Codes'}
                                                                                            onChange={(value) => handleSampleSettingsChange('license_keys_title', value)}
                                                                                            autoComplete="off"
                                                                                            placeholder="License Keys/Codes"
                                                                                            disabled={userPlan === 'free'}
                                                                                        />
                                                                                    </div>
                                                                                    <div style={{ marginTop: '10px' }}>
                                                                                        <TextField
                                                                                            label={t("settings.download_page.custom_links_title")}
                                                                                            value={currentSetting.download_content?.custom_links_title ?? 'Links'}
                                                                                            onChange={(value) => handleSampleSettingsChange('custom_links_title', value)}
                                                                                            autoComplete="off"
                                                                                            placeholder="Links"
                                                                                            disabled={userPlan === 'free'}
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <Checkbox
                                                                                            label={t("settings.download_page.show_zip_download_buttons")}
                                                                                            checked={
                                                                                                currentSetting
                                                                                                    .download_content
                                                                                                    ?.show_zip_downloads ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSampleSettingsChange(
                                                                                                    "show_zip_downloads",
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
                                                                                        .download_content
                                                                                        ?.show_zip_downloads && (
                                                                                        <div>
                                                                                            <div style={{ marginTop: '10px' }}>
                                                                                                <TextField
                                                                                                    label={t("settings.download_page.download_order_all_files_button_text")}
                                                                                                    value={currentSetting.download_content?.download_order_all_files_button_text ?? 'Download All Order Files'}
                                                                                                    onChange={(value) => handleSampleSettingsChange('download_order_all_files_button_text', value)}
                                                                                                    autoComplete="off"
                                                                                                    placeholder="Download All Order Files"
                                                                                                    disabled={userPlan === 'free'}
                                                                                                />
                                                                                            </div>

                                                                                            <div style={{ marginTop: '10px' }}>
                                                                                                <TextField
                                                                                                    label={t("settings.download_page.download_product_all_files_button_text")}
                                                                                                    value={currentSetting.download_content?.download_product_all_files_button_text ?? 'Download Product Files'}
                                                                                                    onChange={(value) => handleSampleSettingsChange('download_product_all_files_button_text', value)}
                                                                                                    autoComplete="off"
                                                                                                    placeholder="Download Product Files"
                                                                                                    disabled={userPlan === 'free'}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            ) : (
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
                                                                                                    title={t("settings.download_page.upgrade_your_plan")}
                                                                                                >
                                                                                                    <Text
                                                                                                        variant="bodyMd"
                                                                                                        as="p"
                                                                                                    >
                                                                                                        {t("settings.download_page.upgrade_to_paid_plan_edit_branding")}
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
                                                                                                        {t("settings.download_page.upgrade_now")}
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
                                                                                            label={t("settings.download_page.upload_company_logo")}
                                                                                            onDrop={
                                                                                                handleDownloadContentDropZoneDrop
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

                                                                                        {downloadContentFile ? (
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
                                                                                                                downloadContentFile.name
                                                                                                            }
                                                                                                        </Text>
                                                                                                        <Text
                                                                                                            variant="bodySm"
                                                                                                            as="p"
                                                                                                        >
                                                                                                            {prettyBytes(
                                                                                                                downloadContentFile.size
                                                                                                            )}
                                                                                                        </Text>
                                                                                                    </BlockStack>
                                                                                                </InlineStack>
                                                                                            </BlockStack>
                                                                                        ) : (
                                                                                            currentSetting
                                                                                                .download_content
                                                                                                ?.download_logo
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
                                                                                                                        .download_content
                                                                                                                        .download_logo
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
                                                                                                "20px",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop:
                                                                                                    "10px",
                                                                                            }}
                                                                                        >
                                                                                            <DropZone
                                                                                                label={t("settings.download_page.upload_company_favicon")}
                                                                                                onDrop={
                                                                                                    handleFaviconDropZoneDrop
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

                                                                                            {faviconFile ? (
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
                                                                                                                    faviconFile.name
                                                                                                                }
                                                                                                            </Text>
                                                                                                            <Text
                                                                                                                variant="bodySm"
                                                                                                                as="p"
                                                                                                            >
                                                                                                                {prettyBytes(
                                                                                                                    faviconFile.size
                                                                                                                )}
                                                                                                            </Text>
                                                                                                        </BlockStack>
                                                                                                    </InlineStack>
                                                                                                </BlockStack>
                                                                                            ) : (
                                                                                                currentSetting
                                                                                                    .download_content
                                                                                                    ?.favicon
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
                                                                                                                            .download_content
                                                                                                                            .favicon
                                                                                                                            .file_name
                                                                                                                    }
                                                                                                                </Text>
                                                                                                            </BlockStack>
                                                                                                        </InlineStack>
                                                                                                    </BlockStack>
                                                                                                )
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("settings.download_page.company_name")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .download_content
                                                                                                    ?.company_name ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSampleBrandingChange(
                                                                                                    "company_name",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.download_page.enter_you_company_name")}
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
                                                                                            label={t("settings.download_page.contact_details")}
                                                                                            multiline={
                                                                                                4
                                                                                            }
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .download_content
                                                                                                    ?.contact_details ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleSampleBrandingChange(
                                                                                                    "contact_details",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.download_page.enter_contact_desc")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </LegacyCard.Section>
                                                                    </Tabs>
                                                                </Card>
                                                            </Layout.Section>
                                                        </Layout>
                                                    </Modal.Section>
                                                </Modal>
                                            </BlockStack>

                                            <div
                                                style={{ marginTop: "15px" }}
                                            ></div>
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
            </Page>
        </div>
    );
};

export default Download;
