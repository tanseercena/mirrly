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
    Checkbox,
    Modal,
    Tabs,
    LegacyCard,
        Banner,
    Tooltip,
    DropZone,
    Select
} from "@shopify/polaris";
import LanguageSelector from "../../components/LanguageSelector";
import { SaveBar } from "@shopify/app-bridge-react";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { AppContext } from "../../components/providers/AppProvider";
// import "../App.css";
import prettyBytes from "pretty-bytes";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";


const Lottery = () => {
    const shopify = useAppBridge();
    const { store, isLoadingData, refetchStore } = useContext(AppContext);
    const navigate = useNavigate();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [userPlan, setUserPlan] = useState("free");
    const [currentSetting, setCurrentSetting] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    const [downloadPreviewHtml, setDownloadPreviewHtml] = useState(null);
    const [isDownloadPreviewFetching, setIsDownloadPreviewFetching] =
        useState(true);
    const [file, setFile] = useState(null);
    const [lotteryContentFile, setLotteryContentFile] = useState(null);
    const [downloadContentFile, setDownloadContentFile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [hasRequiredScopes, setHasRequiredScopes] = useState(false);
    const [hasOrderRequiredScopes, setHasOrderRequiredScopes] = useState(false);
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

    const handleLotteryContentDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setLotteryContentFile(acceptedFiles[0]);
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
        shopify.loading(isLoadingData);
    }, [isLoadingData, shopify]);

    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLotteryModalOpen, setIsLotteryModalOpen] = useState(false);
    // const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const toggleLotteryModal = () => {
        setIsLotteryModalOpen(!isLotteryModalOpen);
    };

    const tabs = [
        { id: "content-1", content: t("settings.lottery_content.content"), panelID: "content-1" },
        { id: "content-3", content: t("settings.lottery_content.branding"), panelID: "content-3" },
    ];

    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedSampleTab, setSelectedSampleTab] = useState(0);

    const handleTranslation = () =>
        navigate("/translations");

    const handlePricing = () => navigate("/pricing");

    const handleLotteryTabChange = useCallback(
        (selectedTabIndex) => setSelectedTab(selectedTabIndex),
        []
    );

    const handleTicketImageChange = useCallback(
        async (value) => {
            currentSetting.ticket_image = value ? 1 : 0;
            setCurrentSetting(currentSetting);

            handleSave();
        },
        [setting]
    );

    const handleLotterySettingsChange = useCallback((key, value) => {
        setCurrentSetting((prevSetting) => ({
            ...prevSetting,
            lottery_content: {
                ...prevSetting.lottery_content,
                [key]: value,
            },
        }));
        setHasUnsavedChanges(true);
        try {
            shopify.saveBar.show('lottery-savebar');
        } catch (error) {
            // SaveBar not set up - ignore error
        }
    }, [setting]);

    const handleLotteryBrandingChange = useCallback((key, value) => {
        setCurrentSetting((prevSetting) => ({
            ...prevSetting,
            lottery_content: {
                ...prevSetting.lottery_content,
                [key]: value,
            },
        }));
        setHasUnsavedChanges(true);
        try {
            shopify.saveBar.show('lottery-savebar');
        } catch (error) {
            // SaveBar not set up - ignore error
        }
    }, [setting]);

    const fetchDownloadPreview = async () => {
        setIsDownloadPreviewFetching(true);
        try {
            const response = await fetch("/api/get-download-page-preview");
            if (response.ok) {
                const data = await response.json();
                setDownloadPreviewHtml(data.html);
            } else {
                shopify.toast.show(t("settings.lottery_content.failed_to_fetch_preview"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching download preview:", error);
            shopify.toast.show(t("settings.lottery_content.failed_to_fetch_preview"), { isError: true, duration: 9999999 });
        } finally {
            setIsDownloadPreviewFetching(false);
        }
    };

    useEffect(() => {
        if (isLotteryModalOpen) {
            const style = document.createElement('style');
            style.id = 'hide-chat-style';
            style.innerHTML = `
                @media (max-width: 768px) {
                    iframe,
                    [class*="chat"],
                    [id*="chat"],
                    [class*="messenger"],
                    [id*="messenger"] {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }
                }
            `;
            document.head.appendChild(style);
        } else {
            const style = document.getElementById('hide-chat-style');
            if (style) {
                style.remove();
            }
        }
        
        return () => {
            const style = document.getElementById('hide-chat-style');
            if (style) {
                style.remove();
            }
        };
    }, [isLotteryModalOpen]);

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const response = await fetch("/api/user-plan");
                const data = await response.json();
                setUserPlan(data.plan);
            } catch (error) {
                console.error(t("settings.lottery_content.failed_to_fetch_user_plan"), error);
            }
        };

        fetchUserPlan();
        fetchDownloadPreview();
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
            shopify.toast.show(t("settings.lottery_content.settings_updated_successfully"));
            refetchStore();
            fetchDownloadPreview();
            setIsSaving(false);
            setHasUnsavedChanges(false);
            try {
                shopify.saveBar.hide('lottery-savebar');
            } catch (error) {
                // SaveBar not set up - ignore error
            }
        } else {
            shopify.toast.show(t("settings.lottery_content.failed_to_update_settings"), { isError: true, duration: 9999999 });
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        setCurrentSetting(setting); // Reset to original
        setHasUnsavedChanges(false);
        try {
            shopify.saveBar.hide('lottery-savebar');
        } catch (error) {
            // SaveBar not set up - ignore error
        }
    };

    const loadingMarkup = (isLoadingData) && (
        <SkeletonPage title={t("settings.lottery_content.lottery_setup")}>
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
        <div>
            <SaveBar id="lottery-savebar">
                <button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleDiscard}>
                    Discard
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
                        <Card title={t("settings.lottery_content.tags")} sectioned>
                            {loadingMarkup}
                            {!isLoadingData &&
                                currentSetting &&
                                 (
                                    <Page
                                        title={t("settings.lottery_content.lottery_setup")}
                                        subtitle={t("settings.lottery_content.lottery_setup_desc")}
                                    >
                                        <BlockStack
                                            gap={{ xs: "800", sm: "400" }}
                                        >
                                            <BlockStack gap="400">
                                                <Text>{t("settings.lottery_content.title")}</Text>
                                                {userPlan === "free" && (
                                                    <div
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <Banner
                                                            tone="warning"
                                                            title={t("settings.lottery_content.upgrade_your_plan")}
                                                        >
                                                            <Text
                                                                variant="bodyMd"
                                                                as="p"
                                                            >
                                                                {t("settings.lottery_content.upgrade_to_paid_plan_ticket")}
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
                                                                {t("settings.lottery_content.upgrade_now")}
                                                            </Button>
                                                        </Banner>
                                                    </div>
                                                )}
                                                <Checkbox
                                                    checked={
                                                        currentSetting.ticket_image
                                                    }
                                                    onChange={(newValue, _) =>
                                                        handleTicketImageChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.lottery_content.generate_ticket_as_image")}
                                                    disabled={
                                                        userPlan === "free" ||
                                                        isSaving
                                                    }
                                                />

                                                <Button
                                                    variant="primary"
                                                    onClick={toggleLotteryModal}
                                                >
                                                    {t("settings.lottery_content.edit_lottery_content_btn")}
                                                </Button>

                                                <Modal
                                                    size="large"
                                                    open={isLotteryModalOpen}
                                                    onClose={toggleLotteryModal}
                                                    title={t("settings.lottery_content.lottery_preview")}
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
                                                                            {t("settings.lottery_content.preview")}
                                                                        </Text>
                                                                    </InlineStack>

                                                                    <div>
                                                                        <div
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            {currentSetting
                                                                                .lottery_content
                                                                                ?.lottery_logo
                                                                                ?.url && (
                                                                                    <img
                                                                                        src={
                                                                                            currentSetting
                                                                                                .lottery_content
                                                                                                .lottery_logo
                                                                                                .url
                                                                                        }
                                                                                        alt={t("settings.lottery_content.lottery_logo")}
                                                                                        style={{
                                                                                            maxWidth:
                                                                                                "200px",
                                                                                            height: "auto",
                                                                                            borderRadius:
                                                                                                "8px",
                                                                                            boxShadow:
                                                                                                "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                        </div>

                                                                        <div
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                                marginTop:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                variant="headingXl"
                                                                                as="h4"
                                                                            >
                                                                                {
                                                                                    currentSetting
                                                                                        .lottery_content
                                                                                        ?.company_name
                                                                                }
                                                                            </Text>
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "30px",
                                                                            }}
                                                                        ></div>

                                                                        <div
                                                                            dangerouslySetInnerHTML={{
                                                                                __html:
                                                                                    currentSetting
                                                                                        .lottery_content
                                                                                        ?.lottery_header_text ||
                                                                                    "",
                                                                            }}
                                                                        />
                                                                        <br />

                                                                        <div className="ticket-container">
                                                                            <div className="ticket-content">
                                                                                <div className="header">
                                                                                    <h1>
                                                                                        {currentSetting
                                                                                            .lottery_content
                                                                                            ?.title
                                                                                            ? currentSetting
                                                                                                .lottery_content
                                                                                                .title
                                                                                            : ""}
                                                                                    </h1>
                                                                                    <h2>
                                                                                        {currentSetting
                                                                                            .lottery_content
                                                                                            ?.sub_title
                                                                                            ? currentSetting
                                                                                                .lottery_content
                                                                                                .sub_title
                                                                                            : ""}
                                                                                    </h2>
                                                                                </div>
                                                                                <div className="code">
                                                                                    {t("settings.lottery_content.XXX")}
                                                                                </div>
                                                                                <div className="info">
                                                                                    <div>
                                                                                        <p className="phone">
                                                                                            {currentSetting
                                                                                                .lottery_content
                                                                                                ?.phone
                                                                                                ? currentSetting
                                                                                                    .lottery_content
                                                                                                    .phone
                                                                                                : ""}
                                                                                        </p>
                                                                                        <p className="site">
                                                                                            <a href="#">
                                                                                                {currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.site
                                                                                                    ? currentSetting
                                                                                                        .lottery_content
                                                                                                        .site
                                                                                                    : ""}
                                                                                            </a>
                                                                                        </p>
                                                                                    </div>
                                                                                    <p className="address">
                                                                                        {currentSetting
                                                                                            .lottery_content
                                                                                            ?.address
                                                                                            ? currentSetting
                                                                                                .lottery_content
                                                                                                .address
                                                                                            : ""}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <br />
                                                                        <div
                                                                            dangerouslySetInnerHTML={{
                                                                                __html:
                                                                                    currentSetting
                                                                                        .lottery_content
                                                                                        ?.lottery_footer_text ||
                                                                                    "",
                                                                            }}
                                                                        />

                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "30px",
                                                                            }}
                                                                        ></div>

                                                                        <p
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                                color: "gray",
                                                                                fontSize:
                                                                                    "15px",
                                                                            }}
                                                                        >
                                                                            {
                                                                                currentSetting
                                                                                    .lottery_content
                                                                                    ?.contact_details
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </Card>
                                                            </Layout.Section>
                                                            <Layout.Section variant="oneThird">
                                                                <Card>
                                                                    <Text
                                                                        as="h3"
                                                                        variant="headingMd"
                                                                    >
                                                                        {t("settings.lottery_content.editor")}
                                                                    </Text>
                                                                    <Tabs
                                                                        tabs={
                                                                            tabs
                                                                        }
                                                                        selected={
                                                                            selectedTab
                                                                        }
                                                                        onSelect={
                                                                            handleLotteryTabChange
                                                                        }
                                                                    >
                                                                        <LegacyCard.Section>
                                                                            {tabs[selectedTab].id === "content-1" ? (
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
                                                                                                    title={t("settings.lottery_content.upgrade_your_plan")}
                                                                                                >
                                                                                                    <Text
                                                                                                        variant="bodyMd"
                                                                                                        as="p"
                                                                                                    >
                                                                                                        {t("settings.lottery_content.upgrade_to_paid_plan_edit_lottery")}
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
                                                                                                        {t("settings.lottery_content.upgrade_now")}
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
                                                                                            label={t("settings.lottery_content.lottery_title")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotterySettingsChange(
                                                                                                    "title",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.lottery_content.lottery_title_1")}
                                                                                            helpText={t("settings.lottery_content.your_digital_lotteries_are_ready")}
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
                                                                                            label={t("settings.lottery_content.lottery_subtitle")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.sub_title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotterySettingsChange(
                                                                                                    "sub_title",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.lottery_content.subtitle")}
                                                                                            helpText={t("settings.lottery_content.lottery_subtitle_1")}
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
                                                                                            label={t("settings.lottery_content.lottery_phone")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.phone ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotterySettingsChange(
                                                                                                    "phone",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.lottery_content.lottery_phone_placeholder")}
                                                                                            helpText={t("settings.lottery_content.phone_number")}
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
                                                                                            label={t("settings.lottery_content.lottery_site")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.site ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotterySettingsChange(
                                                                                                    "site",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.lottery_content.example.com")}
                                                                                            helpText={t("settings.lottery_content.website_of_the_lottery")}
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
                                                                                            label={t("settings.lottery_content.lottery_address")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.address ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotterySettingsChange(
                                                                                                    "address",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.lottery_content.address_")}
                                                                                            helpText={t("settings.lottery_content.address")}
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
                                                                                            label={t("settings.lottery_content.lottery_email_subject")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.subject ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotterySettingsChange(
                                                                                                    "subject",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.lottery_content.lottery_email_subject_")}
                                                                                            helpText={t("settings.lottery_content.lottery_email_subject")}
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
                                                                                            label={t("settings.lottery_content.header_text")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.lottery_header_text ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotterySettingsChange(
                                                                                                    "lottery_header_text",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            multiline={
                                                                                                4
                                                                                            }
                                                                                            placeholder={t("settings.lottery_content.lottery_email_header")}
                                                                                            helpText={
                                                                                                <span>
                                                                                                    <Tooltip content={t("settings.lottery_content.this_will_be_replace_customer_name")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.lottery_content.customer_name")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>

                                                                                                    {t("settings.lottery_content._,")}
                                                                                                    <Tooltip content={t("settings.lottery_content.this_will_be_replace_be_lottery_title")}>
                                                                                                        <strong>
                                                                                                            &#123;{t("settings.lottery_content.lottery_title1")}&#125;
                                                                                                        </strong>
                                                                                                    </Tooltip>{" "}
                                                                                                    {t("settings.lottery_content.variable_available")}
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
                                                                                            label={t("settings.lottery_content.footer_text")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.lottery_footer_text ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotterySettingsChange(
                                                                                                    "lottery_footer_text",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            multiline={
                                                                                                4
                                                                                            }
                                                                                            placeholder={t("settings.lottery_content.lottery_email_footer_")}
                                                                                            helpText={t("settings.lottery_content.lottery_email_footer")}
                                                                                            disabled={
                                                                                                userPlan ===
                                                                                                "free"
                                                                                            }
                                                                                        />
                                                                                    </div>
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
                                                                                                    title={t("settings.lottery_content.upgrade_your_plan")}
                                                                                                >
                                                                                                    <Text
                                                                                                        variant="bodyMd"
                                                                                                        as="p"
                                                                                                    >
                                                                                                        {t("settings.lottery_content.upgrade_to_paid_plan_edit_branding")}
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
                                                                                                        {t("settings.lottery_content.upgrade_now")}
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
                                                                                            label={t("settings.lottery_content.upload_company_logo")}
                                                                                            onDrop={
                                                                                                handleLotteryContentDropZoneDrop
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

                                                                                        {lotteryContentFile ? (
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
                                                                                                                lotteryContentFile.name
                                                                                                            }
                                                                                                        </Text>
                                                                                                        <Text
                                                                                                            variant="bodySm"
                                                                                                            as="p"
                                                                                                        >
                                                                                                            {prettyBytes(
                                                                                                                lotteryContentFile.size
                                                                                                            )}
                                                                                                        </Text>
                                                                                                    </BlockStack>
                                                                                                </InlineStack>
                                                                                            </BlockStack>
                                                                                        ) : (
                                                                                            currentSetting
                                                                                                .lottery_content
                                                                                                ?.lottery_logo
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
                                                                                                                        .lottery_content
                                                                                                                        .lottery_logo
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
                                                                                            label={t("settings.lottery_content.company_name")}
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.company_name ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotteryBrandingChange(
                                                                                                    "company_name",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.lottery_content.enter_your_company_name")}
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
                                                                                            label={t("settings.lottery_content.contact_details")}
                                                                                            multiline={
                                                                                                4
                                                                                            }
                                                                                            value={
                                                                                                currentSetting
                                                                                                    .lottery_content
                                                                                                    ?.contact_details ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                value
                                                                                            ) =>
                                                                                                handleLotteryBrandingChange(
                                                                                                    "contact_details",
                                                                                                    value
                                                                                                )
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("settings.lottery_content.enter_contact_desc")}
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

                                            {/* <div
                                                style={{ marginTop: "15px" }}
                                            ></div> */}
                                        </BlockStack>
                                    </Page>
                                )}
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </div>
    );
};

export default Lottery;
