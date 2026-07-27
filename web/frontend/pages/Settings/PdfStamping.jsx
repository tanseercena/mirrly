import SettingSideBar from "../../components/SettingSideBar";
import {
    BlockStack,
    Button,
    Card,
    InlineStack,
    Layout,
    Page,
    Select,
    SkeletonBodyText,
    SkeletonPage,
    Text,
    TextField,
    Checkbox,
    Modal,
        Banner,
} from "@shopify/polaris";
import { PopoverPicker } from "../../components/PopoverPicker.jsx";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { AppContext } from "../../components/providers/AppProvider";
// import "../App.css";
import { useAppBridge } from "@shopify/app-bridge-react";
import { SaveBar } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LanguageSelector from "../../components/LanguageSelector.jsx";
const PdfStamping = () => {
    const shopify = useAppBridge();
    const { store, isLoadingData, refetchStore } = useContext(AppContext);
    const navigate = useNavigate();

    const [userPlan, setUserPlan] = useState("free");
        const [currentSetting, setCurrentSetting] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);
    const [isPreviewFetching, setIsPreviewFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [downloadPreviewHtml, setDownloadPreviewHtml] = useState(null);
    const [isDownloadPreviewFetching, setIsDownloadPreviewFetching] =
        useState(true);
    const [file, setFile] = useState(null);
    const [lotteryContentFile, setLotteryContentFile] = useState(null);
    const [downloadContentFile, setDownloadContentFile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [hasRequiredScopes, setHasRequiredScopes] = useState(false);
    const [permissionRequesting, setPermissionRequesting] = useState(false);
    const [hasOrderRequiredScopes, setHasOrderRequiredScopes] = useState(false);
    const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
    const [hasUnsavedPDFChanges, setHasUnsavedPDFChanges] = useState(false);
    const [warning, setWarning] = useState("");
    const [pdfPreviewFile, setPdfPreviewFile] = useState(null);
    const [isPdfPreviewLoading, setIsPdfPreviewLoading] = useState(false);
    const { t } = useTranslation()


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

    const setting = store?.setting
        ? {
            ...store.setting,
        }
        : null;

    useEffect(() => {
        setCurrentSetting(setting);
    }, [store]);

    useEffect(() => {
        shopify.loading(isLoadingData);
    }, [isLoadingData, shopify]);

    // Effect to monitor PDF changes and show/hide SaveBar
    useEffect(() => {
        console.log('PDF SaveBar state changed:', { hasUnsavedPDFChanges, isPDFModalOpen });
        if (hasUnsavedPDFChanges && shopify) {
            console.log('Showing PDF SaveBar');
            try {
                shopify.saveBar.show('pdf-stamping-savebar');
            } catch (error) {
                // SaveBar not set up - ignore error
            }
        } else if (shopify) {
            console.log('Hiding PDF SaveBar');
            try {
                shopify.saveBar.hide('pdf-stamping-savebar');
            } catch (error) {
                // SaveBar not set up - ignore error
            }
        }
    }, [hasUnsavedPDFChanges, isPDFModalOpen, shopify]);

    const handlePDFOpenModal = () => {
        setIsPDFModalOpen(true);
        setHasUnsavedPDFChanges(false);
    };

    const handlePDFCloseModal = () => {
        setIsPDFModalOpen(false);
        setHasUnsavedPDFChanges(false);
    };

    const handleTranslation = () =>
        navigate("/translations");

    const handlePricing = () => navigate("/pricing");

    const handlePDFSettingsChange = useCallback(
        (key, value) => {
            console.log('handlePDFSettingsChange:', { key, value, isPDFModalOpen });

            setCurrentSetting((prevSetting) => {
                const updatedDownloadContent = {
                    ...prevSetting.pdf_stamping,
                    [key]: value,
                };

                return {
                    ...prevSetting,
                    pdf_stamping: updatedDownloadContent,
                };
            });

            // Mark as having unsaved changes when in modal
            if (isPDFModalOpen) {
                console.log('Setting hasUnsavedPDFChanges to true');
                setHasUnsavedPDFChanges(true);
            }
        },
        [setting, isPDFModalOpen]
    );

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const response = await fetch("/api/user-plan");
                const data = await response.json();
                setUserPlan(data.plan);
            } catch (error) {
                console.error(t("settings.pdf_stamping_security.failed_to_fetch_user_plan"), error);
            }
        };

        fetchUserPlan();
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

        const response = await fetch("/api/save-setting", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            shopify.toast.show(t("settings.pdf_stamping_security.settings_updated_successfully"));
            refetchStore();
            setIsSaving(false);
            setHasUnsavedPDFChanges(false);
        } else {
            shopify.toast.show(t("settings.pdf_stamping_security.failed_to_update_settings"), { isError: true, duration: 9999999 });
            setIsSaving(false);
        }
    };

    const handlePdfPreviewFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfPreviewFile(file);
        } else if (file) {
            alert('Please select a valid PDF file');
            event.target.value = ''; // Clear the input
        }
    };

    const handlePdfPreviewTemplate = async () => {
        if (!pdfPreviewFile) {
            alert('Please select a PDF file first');
            return;
        }

        if (!currentSetting?.pdf_stamping) {
            alert('Please configure your default PDF template first');
            return;
        }

        setIsPdfPreviewLoading(true);

        try {
            const formData = new FormData();
            formData.append('pdf_file', pdfPreviewFile);
            formData.append('text_size', currentSetting.pdf_stamping?.text_size || '12');
            formData.append('text_color', currentSetting.pdf_stamping?.text_color || '#000000');
            formData.append('alignment', currentSetting.pdf_stamping?.alignment || 'center');
            formData.append('font', currentSetting.pdf_stamping?.font || 'arial');
            formData.append('page_size', currentSetting.pdf_stamping?.page_size || 'A4');
            formData.append('page_layout', currentSetting.pdf_stamping?.page_layout || 'portrait');
            formData.append('vertical_adjustment', currentSetting.pdf_stamping?.vertical_adjustment || '5');
            formData.append('pages_to_stamp', currentSetting.pdf_stamping?.pages_to_stamp || 'all');
            formData.append('stamp_text', currentSetting.pdf_stamping?.stamp_text || 'Prepared exclusively for {order.receiver_email}. Order {order.id}');
            formData.append('allow_printing', currentSetting.pdf_stamping?.allow_printing || false);
            formData.append('allow_copying', currentSetting.pdf_stamping?.allow_copying || false);
            formData.append('password_protect', currentSetting.pdf_stamping?.password_protect || false);

            const response = await fetch('/api/preview-pdf-template', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'default-template-preview.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const errorData = await response.json();
                alert('Error generating preview: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Preview error:', error);
            alert('Error generating preview. Please try again.');
        } finally {
            setIsPdfPreviewLoading(false);
        }
    };

    const loadingMarkup = (isLoadingData) && (
        <SkeletonPage title={t("settings.pdf_stamping_security.title")}>
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
        <div className="settings-pdf-stamping-container">
            {loadingMarkup}

            {/* SaveBar Component - Always rendered, controlled by show/hide */}
            <SaveBar id="pdf-stamping-savebar">
                <button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? t("saving") : t("save")}
                </button>
                <button onClick={handlePDFCloseModal}>
                    {t("cancel")}
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
                        <Card title={t("settings.pdf_stamping_security.tags")} sectioned>
                            {loadingMarkup}
                            {!isLoadingData &&
                                currentSetting
                                && (
                                    <Page
                                        title={t("settings.pdf_stamping_security.title")}
                                        subtitle={t("settings.pdf_stamping_security.desc")}
                                    >
                                        <BlockStack
                                            gap={{ xs: "800", sm: "400" }}
                                        >
                                            <BlockStack gap="400">
                                                <Text>
                                                    {t("settings.pdf_stamping_security.pdf_stamping_content")}
                                                </Text>
                                                <Button
                                                    variant="primary"
                                                    onClick={handlePDFOpenModal}
                                                >
                                                    {t("settings.pdf_stamping_security.pdf_stamping_template_btn")}
                                                </Button>
                                                <Modal
                                                    size="large"
                                                    open={isPDFModalOpen}
                                                    onClose={
                                                        handlePDFCloseModal
                                                    }
                                                    title={t("settings.pdf_stamping_security.pdf_stamping_template")}
                                                    // primaryAction={{
                                                    //     content: t("settings.pdf_stamping_security.save"),
                                                    //     onAction: handleSave,
                                                    //     loading: isSaving,
                                                    // }}
                                                    // secondaryActions={[
                                                    //     {
                                                    //         content: t("settings.pdf_stamping_security.cancel"),
                                                    //         onAction:
                                                    //             handlePDFCloseModal,
                                                    //     },
                                                    // ]}
                                                >
                                                    <Modal.Section>
                                                        <Layout>
                                                            <Layout.Section>
                                                                <Card>
                                                                    <Text
                                                                        as="h3"
                                                                        variant="headingMd"
                                                                    >
                                                                        {t("settings.pdf_stamping_security.stamping_variables")}
                                                                    </Text>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        {t("settings.pdf_stamping_security.stamping_variables_desc")}
                                                                    </Text>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{t("settings.pdf_stamping_security.{order.receive_name}")}</code>{" "}
                                                                        {t("settings.pdf_stamping_security.for_receiver_name")}
                                                                    </Text>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{t("settings.pdf_stamping_security.{order.receiver_email}")}</code>{" "}
                                                                        {t("settings.pdf_stamping_security.for_receiver_email")}
                                                                    </Text>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{t("settings.pdf_stamping_security.{order_id}")}</code>{" "}
                                                                        {t("settings.pdf_stamping_security.for_the_order")}
                                                                    </Text>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{t("settings.pdf_stamping_security.{order_date}")}</code>{" "}
                                                                        {t("settings.pdf_stamping_security.for_the_order_date")}
                                                                    </Text>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{t("settings.pdf_stamping_security.{product_name}")}</code>{" "}
                                                                        {t("settings.pdf_stamping_security.for_the_stamped")}
                                                                    </Text>
                                                                </Card>
                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            "10px",
                                                                    }}
                                                                ></div>
                                                                <Card>
                                                                    <Text
                                                                        as="h3"
                                                                        variant="headingMd"
                                                                    >
                                                                        {t("settings.pdf_stamping_security.stamping_text")}
                                                                    </Text>
                                                                    <BlockStack
                                                                        gap={
                                                                            200
                                                                        }
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            <TextField
                                                                                label={t("settings.pdf_stamping_security.stamp_text")}
                                                                                multiline={
                                                                                    4
                                                                                }
                                                                                value={
                                                                                    currentSetting
                                                                                        .pdf_stamping
                                                                                        ?.stamp_text ??
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    value
                                                                                ) =>
                                                                                    handlePDFSettingsChange(
                                                                                        "stamp_text",
                                                                                        value
                                                                                    )
                                                                                }
                                                                                autoComplete="off"
                                                                                placeholder={t("settings.pdf_stamping_security.prepared_exclusively")}
                                                                                disabled={
                                                                                    userPlan ===
                                                                                    "free"
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </BlockStack>
                                                                </Card>
                                                                <div
                                                                    style={{
                                                                        marginTop: "10px",
                                                                    }}
                                                                ></div>
                                                                <Card>
                                                                    <InlineStack
                                                                        align="space-between"
                                                                        blockAlign="center"
                                                                    >
                                                                        <Text
                                                                            as="h3"
                                                                            variant="headingMd"
                                                                        >
                                                                            {t("settings.pdf_stamping_security.preview_default_template")}
                                                                        </Text>
                                                                        <Button
                                                                            onClick={handlePdfPreviewTemplate}
                                                                            disabled={!pdfPreviewFile || isPdfPreviewLoading}
                                                                            loading={isPdfPreviewLoading}
                                                                        >
                                                                            {isPdfPreviewLoading ? t("settings.pdf_stamping_security.generating") : t("settings.pdf_stamping_security.generate_preview")}
                                                                        </Button>
                                                                    </InlineStack>
                                                                    <div
                                                                        style={{
                                                                            marginTop: "10px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            onChange={handlePdfPreviewFileChange}
                                                                            style={{ display: 'none' }}
                                                                            id="preview-pdf-input-settings"
                                                                        />
                                                                        <Button onClick={() => document.getElementById('preview-pdf-input-settings').click()}>
                                                                            {t("settings.pdf_stamping_security.choose_pdf_for_preview")}
                                                                        </Button>
                                                                        {pdfPreviewFile && (
                                                                            <Text as="span" variant="bodySm" tone="subdued" style={{ marginLeft: '10px' }}>
                                                                                {pdfPreviewFile.name}
                                                                            </Text>
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop: "5px",
                                                                        }}
                                                                    >
                                                                        <Text as="p" variant="bodySm" tone="subdued">
                                                                            {t("settings.pdf_stamping_security.select_pdf_to_preview_default_template")}
                                                                        </Text>
                                                                    </div>
                                                                </Card>
                                                            </Layout.Section>
                                                            <Layout.Section variant="oneThird">
                                                                <Card>
                                                                    <Text
                                                                        as="h3"
                                                                        variant="headingMd"
                                                                    >
                                                                        {t("settings.pdf_stamping_security.editor")}
                                                                    </Text>
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
                                                                                    title={t("settings.pdf_stamping_security.upgrade_your_plan")}
                                                                                >
                                                                                    <Text
                                                                                        variant="bodyMd"
                                                                                        as="p"
                                                                                    >
                                                                                        {t("settings.pdf_stamping_security.upgrade_to_paid_plan_edit_pdf")}
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
                                                                                        {t("settings.pdf_stamping_security.upgrade_now")}
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
                                                                        <Select
                                                                            label={t("settings.pdf_stamping_security.text_size")}
                                                                            options={[
                                                                                {
                                                                                    label: "2",
                                                                                    value: "2",
                                                                                },
                                                                                {
                                                                                    label: "4",
                                                                                    value: "4",
                                                                                },
                                                                                {
                                                                                    label: "6",
                                                                                    value: "6",
                                                                                },
                                                                                {
                                                                                    label: "8",
                                                                                    value: "8",
                                                                                },
                                                                                {
                                                                                    label: "10",
                                                                                    value: "10",
                                                                                },
                                                                                {
                                                                                    label: "12",
                                                                                    value: "12",
                                                                                },
                                                                                {
                                                                                    label: "14",
                                                                                    value: "14",
                                                                                },
                                                                                {
                                                                                    label: "16",
                                                                                    value: "16",
                                                                                },
                                                                                {
                                                                                    label: "18",
                                                                                    value: "18",
                                                                                },
                                                                                {
                                                                                    label: "20",
                                                                                    value: "20",
                                                                                },
                                                                            ]}
                                                                            value={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.text_size ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "text_size",
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
                                                                        <Text
                                                                            variant="bodySm"
                                                                            as="p"
                                                                        >
                                                                            {t("settings.pdf_stamping_security.text_color")}
                                                                        </Text>
                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                marginTop:
                                                                                    "5px",
                                                                            }}
                                                                        >
                                                                            <PopoverPicker
                                                                                color={
                                                                                    currentSetting
                                                                                        .pdf_stamping
                                                                                        ?.text_color ??
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    value
                                                                                ) =>
                                                                                    handlePDFSettingsChange(
                                                                                        "text_color",
                                                                                        value
                                                                                    )
                                                                                }
                                                                            />
                                                                            <div
                                                                                style={{
                                                                                    width: "-webkit-fill-available",
                                                                                }}
                                                                            >
                                                                                <TextField
                                                                                    // label="Text color"
                                                                                    value={
                                                                                        currentSetting
                                                                                            .pdf_stamping
                                                                                            ?.text_color ??
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        value
                                                                                    ) =>
                                                                                        handlePDFSettingsChange(
                                                                                            "text_color",
                                                                                            value
                                                                                        )
                                                                                    }
                                                                                    autoComplete="off"
                                                                                    placeholder={t("settings.pdf_stamping_security.enter_text_color")}
                                                                                    disabled={
                                                                                        userPlan ===
                                                                                        "free"
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        <PopoverPicker
                                                                            color={
                                                                                 currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.text_color ??
                                                                                ""
                                                                            }
                                                                           onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "text_color",
                                                                                    value
                                                                                )
                                                                            }
                                                                        />
                                                                        <TextField
                                                                            label="Text color"
                                                                            value={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.text_color ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "text_color",
                                                                                    value
                                                                                )
                                                                            }
                                                                            autoComplete="off"
                                                                            placeholder="Enter text color (e.g. #FF5733)"
                                                                            disabled={
                                                                                userPlan ===
                                                                                "free"
                                                                            }
                                                                        />
                                                                    </div> */}
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        <Select
                                                                            label={t("settings.pdf_stamping_security.alignment")}
                                                                            options={[
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.left"),
                                                                                    value: "left",
                                                                                },
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.center"),
                                                                                    value: "center",
                                                                                },
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.right"),
                                                                                    value: "right",
                                                                                },
                                                                            ]}
                                                                            value={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.alignment ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "alignment",
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
                                                                        <Select
                                                                            label={t("settings.pdf_stamping_security.font")}
                                                                            options={[
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.arial"),
                                                                                    value: "arial",
                                                                                },
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.times_new_roman"),
                                                                                    value: "times",
                                                                                },
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.courier"),
                                                                                    value: "courier",
                                                                                },
                                                                            ]}
                                                                            value={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.font ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "font",
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
                                                                        <Select
                                                                            label={t("settings.pdf_stamping_security.page_size")}
                                                                            options={[
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.a4"),
                                                                                    value: "A4",
                                                                                },
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.letter"),
                                                                                    value: "Letter",
                                                                                },
                                                                            ]}
                                                                            value={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.page_size ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "page_size",
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
                                                                        <Select
                                                                            label={t("settings.pdf_stamping_security.page_layout")}
                                                                            options={[
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.portrait"),
                                                                                    value: "portrait",
                                                                                },
                                                                                {
                                                                                    label: t("settings.pdf_stamping_security.landscape"),
                                                                                    value: "landscape",
                                                                                },
                                                                            ]}
                                                                            value={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.page_layout ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "page_layout",
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
                                                                        <TextField
                                                                            label={t("settings.pdf_stamping_security.vertical_adjustment")}
                                                                            type="number"
                                                                            value={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.vertical_adjustment ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "vertical_adjustment",
                                                                                    value
                                                                                )
                                                                            }
                                                                            autoComplete="off"
                                                                            placeholder={t("settings.pdf_stamping_security.5")}
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
                                                                            label={t("settings.pdf_stamping_security.pages_to_stamp")}
                                                                            value={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.pages_to_stamp ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "pages_to_stamp",
                                                                                    value
                                                                                )
                                                                            }
                                                                            autoComplete="off"
                                                                            placeholder={t("settings.pdf_stamping_security.e.g_1,2")}
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
                                                                        <Text
                                                                            as="p"
                                                                            variant="bodyMd"
                                                                        >
                                                                            {t("settings.pdf_stamping_security.pdf_options")}
                                                                        </Text>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "5px",
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.allow_printing ??
                                                                                false
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "allow_printing",
                                                                                    value
                                                                                )
                                                                            }
                                                                            label={t("settings.pdf_stamping_security.allow_printing")}
                                                                            disabled={
                                                                                userPlan ===
                                                                                "free"
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "5px",
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.allow_copying ??
                                                                                false
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "allow_copying",
                                                                                    value
                                                                                )
                                                                            }
                                                                            label={t("settings.pdf_stamping_security.allow_content")}
                                                                            disabled={
                                                                                userPlan ===
                                                                                "free"
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "5px",
                                                                            display:
                                                                                "none",
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                currentSetting
                                                                                    .pdf_stamping
                                                                                    ?.password_protect ??
                                                                                false
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handlePDFSettingsChange(
                                                                                    "password_protect",
                                                                                    value
                                                                                )
                                                                            }
                                                                            label={t("settings.pdf_stamping_security.password_protect_pdf")}
                                                                            disabled={
                                                                                userPlan ===
                                                                                "free"
                                                                            }
                                                                        />
                                                                    </div>
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

export default PdfStamping;
