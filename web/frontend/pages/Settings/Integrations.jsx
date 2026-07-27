import SettingSideBar from "../../components/SettingSideBar";
import {
    BlockStack,
    Button,
    Card,
    Layout,
    Page,
    SkeletonBodyText,
    SkeletonPage,
    Text,
    Checkbox,
    Banner,
    Select,
    TextField,
    Badge,
    Box,
    InlineCode,
    InlineStack,
    Link,
    Icon,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../../components/LanguageSelector";
import { Knob } from "../../components/knob/Knob";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { AppContext } from "../../components/providers/AppProvider";
import "../../App.css";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ExternalIcon } from "@shopify/polaris-icons";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const Integrations = () => {
    const navigate = useNavigate();
    const shopify = useAppBridge();
    const { store, isLoadingData, refetchStore } = useContext(AppContext);

    const [userPlan, setUserPlan] = useState("free");
    const [buttonLoading, setButtonLoading] = useState(false);
    const [buttonLoading1, setButtonLoading1] = useState(false);
    const [currentSetting, setCurrentSetting] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);

    const [isPreviewFetching, setIsPreviewFetching] = useState(true);

    const [isSaving, setIsSaving] = useState(false);

    const [klaviyoKey, setKlaviyoKey] = useState(store?.setting?.integrations?.klaviyo_api_key || " ");
    const [mailChimpKey, setMailChimpKey] = useState(store?.setting?.integrations?.mailChimp_api_key || " ");
    const [mailChimpAudienceId, setMailChimpAudienceId] = useState(store?.setting?.integrations?.mailChimp_audience_id || " ");

    const [file, setFile] = useState(null);
    const [lotteryContentFile, setLotteryContentFile] = useState(null);
    const [downloadContentFile, setDownloadContentFile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [hasRequiredScopes, setHasRequiredScopes] = useState(false);
    const [permissionRequesting, setPermissionRequesting] = useState(false);
    const [hasOrderRequiredScopes, setHasOrderRequiredScopes] = useState(false);
    const { t } = useTranslation()

    const [ipList, setIpList] = useState(store?.setting?.ip_restrictions?.ips || '');

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

    const requestCustomerWritePermission = async (scope) => {
        setPermissionRequesting(true);
        // Construct the URL for requesting additional scopes
        //const scopes = ['write_customers', 'write_orders']; // Add to existing scopes
        const scopes = [scope]; // Add to existing scopes

        const response = await fetch(
            `/api/request-permissions?scopes=${scopes.join(",")}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();
    };

    const setting = store?.setting
        ? {
            ...store.setting,
        }
        : null;

    useEffect(() => {
        setCurrentSetting(setting);
    }, [store]);

    const handleTranslation = () =>
        navigate("/translations", { replace: true });

    const handlePricing = () => navigate("/pricing", { replace: true });

    const handleVimeoConnect = async () => {
        setButtonLoading(true);
        try {
            const response = await fetch("/api/vimeo/connect");
            const data = await response.json();
            if (data.url) {
                window.open(data.url, '_blank');
            }

            const intervalId = setInterval(() => {
                refetchStore();
                setButtonLoading(false);

                // Check if token exists and clear interval if it does
                if (store.setting?.vimeo_integration?.token_data) {
                    clearInterval(intervalId);
                }
            }, 3000);
        } catch (error) {
            console.error("Failed connecting to Vimeo:", error);
        }
    };

    const handleVimeoDelete = async () => {
        setButtonLoading(true);
        try {
            const response = await fetch("/api/delete-vimeo-account");
            if (response.ok) {

                shopify.toast.show(t("settings.order_api.settings_updated_successfully"));
                refetchStore();
                setButtonLoading(false);
                setIsSaving(false);
            }
        } catch {
            shopify.toast.show(t("settings.order_api.failed_to_update_settings"), { isError: true });
            setButtonLoading(false);
            setIsSaving(false);
        }
    };

    const handleWistiaConnect = async () => {
        setButtonLoading1(true);
        try {
            const response = await fetch("/api/wistia/connect");
            const data = await response.json();
            if (data.url) {
                window.open(data.url, '_blank');
            }

            const intervalId = setInterval(() => {
                refetchStore();
                setButtonLoading1(false);

                // Check if token exists and clear interval if it does
                if (store.setting?.wistia_integration?.token_data) {
                    clearInterval(intervalId);
                }
            }, 3000);
        } catch (error) {
            console.error("Failed connecting to Wistia:", error);
        }
    }

    const handleWistiaDelete = async () => {
        setButtonLoading1(true);
        try {
            const response = await fetch("/api/delete-wistia-account");
            if (response.ok) {

                shopify.toast.show(t("settings.order_api.settings_updated_successfully"));
                refetchStore();
                setButtonLoading1(false);
                setIsSaving(false);
            }
        } catch {
            shopify.toast.show(t("settings.order_api.failed_to_update_settings"), { isError: true });
            setButtonLoading1(false);
            setIsSaving(false);
        }
    };


    const handleApiEnabledChange = useCallback(
        async (value) => {
            currentSetting.api_enabled = value ? 1 : 0;
            setCurrentSetting(currentSetting);

            handleSave();
        },
        [setting]
    );

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const response = await fetch("/api/user-plan");
                const data = await response.json();
                setUserPlan(data.plan);
            } catch (error) {
                console.error(t("settings.order_api.failed_to_fetch_user_plan"), error);
            }
        };

        fetchUserPlan();
    }, []);

    const handleSettingsChange = useCallback(
        async (key, value) => {
            const updatedSetting = setCurrentSetting((prevSetting) => {
                const updatedDownloadContent = {
                    ...prevSetting.ip_restrictions,
                    [key]: value,
                };

                const newSetting = {
                    ...prevSetting,
                    ip_restrictions: updatedDownloadContent,
                };

                // Call handleSave with the updated setting
                handleSave(newSetting);

                return newSetting;
            });
        },
        [setting]
    );

    const handleKlaviyoKnob = useCallback(
        async (value) => {
            setCurrentSetting((prevSetting) => {
                const updatedIntegrationKnob = {
                    ...prevSetting.integrations,
                    klaviyo_enabled: value ? 1 : 0,
                };

                const newSetting = {
                    ...prevSetting,
                    integrations: updatedIntegrationKnob,
                };

                handleSave(newSetting);
                return newSetting;
            });
        },
        [setting]
    );

    const handleKlaviyoKeyChange = useCallback(
        async (key, value) => {
            setCurrentSetting((prevSetting) => {
                const updatedIntegrationKey = {
                    ...prevSetting.integrations,
                    [key]: value,
                };

                const newSetting = {
                    ...prevSetting,
                    integrations: updatedIntegrationKey,
                };

                handleSave(newSetting);
                return newSetting;
            });
        },
        [setting]
    );

    const handleMailChimpKnob = useCallback(
        async (value) => {
            setCurrentSetting((prevSetting) => {
                const updatedIntegrationKnob = {
                    ...prevSetting.integrations,
                    mailChimp_enabled: value ? 1 : 0,
                };

                const newSetting = {
                    ...prevSetting,
                    integrations: updatedIntegrationKnob,
                };

                handleSave(newSetting);
                return newSetting;
            });
        },
        [setting]
    );

    const handleMailChimpKeyChange = useCallback(
        async (key, value) => {
            setCurrentSetting((prevSetting) => {
                const updatedIntegrationKey = {
                    ...prevSetting.integrations,
                    [key]: value,
                };

                const newSetting = {
                    ...prevSetting,
                    integrations: updatedIntegrationKey,
                };

                handleSave(newSetting);

                return newSetting;
            });
        },
        [setting]
    );

    useEffect(() => {
        shopify.loading(isLoadingData);
    }, [isLoadingData, shopify]);

    const handleMailChimpAudienceIdChange = useCallback(
        async (key, value) => {
            setCurrentSetting((prevSetting) => {
                const updatedAudienceKey = {
                    ...prevSetting.integrations,
                    [key]: value,
                };

                const newSetting = {
                    ...prevSetting,
                    integrations: updatedAudienceKey,
                };

                handleSave(newSetting);

                return newSetting;
            });
        },
        [setting]
    );

    const handleVimeoKnob = useCallback(
        async (value) => {
            setCurrentSetting((prevSetting) => {
                const updatedVimeoKnob = {
                    ...prevSetting.vimeo_integration,
                    vimeo_integration_enabled: value ? 1 : 0,
                };

                const newSetting = {
                    ...prevSetting,
                    vimeo_integration: updatedVimeoKnob,
                };

                handleSave(newSetting);
                return newSetting;
            });
        },
        [setting]
    );

    const handleWistiaKnob = useCallback(
        async (value) => {
            setCurrentSetting((prevSetting) => {
                const updatedWistiaKnob = {
                    ...prevSetting.wistia_integration,
                    wistia_integration_enabled: value ? 1 : 0,
                };

                const newSetting = {
                    ...prevSetting,
                    wistia_integration: updatedWistiaKnob,
                };

                handleSave(newSetting);
                return newSetting;
            });
        },
        [setting]
    );

    const handleSave = async (newSetting = null) => {
        setIsSaving(true);
        const formData = new FormData();
        console.log(currentSetting);

        formData.append(
            "email_content",
            JSON.stringify(currentSetting.email_content)
        );
        formData.append("integrations",
            JSON.stringify(newSetting?.integrations ?? currentSetting?.integrations)
        );
        formData.append("vimeo_integration",
            JSON.stringify(newSetting?.vimeo_integration ?? currentSetting?.vimeo_integration)
        );
        formData.append("wistia_integration",
            JSON.stringify(newSetting?.wistia_integration ?? currentSetting?.wistia_integration)
        );
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

        formData.append(
            "ip_restrictions",
            JSON.stringify(newSetting?.ip_restrictions ?? currentSetting.ip_restrictions)
        );

        const response = await fetch("/api/save-setting", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            shopify.toast.show(t("settings.order_api.settings_updated_successfully"));
            refetchStore();
            setIsSaving(false);
        } else {
            shopify.toast.show(t("settings.order_api.failed_to_update_settings"), { isError: true });
            setIsSaving(false);
        }
    };

    const loadingMarkup = (isLoadingData) && (
        <SkeletonPage title={t("settings.integrations.title")} >
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
        <div
            style={{
                marginBottom: "10px",
            }}
        >
            <Page
                title={t("settings.title")}
                primaryAction={
                    <LanguageSelector />
                }
            >
                <Layout>
                    <Layout.Section variant="oneThird">
                        <Card>
                            <SettingSideBar />
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card
                            // title={t("settings.integrations.title")}
                            sectioned>
                            {loadingMarkup}
                            {!isLoadingData &&
                                currentSetting && (
                                    <Page
                                        title={t("settings.integrations.title")}
                                        subtitle={t("settings.integrations.subtitle")}
                                    >
                                        <BlockStack
                                            gap={{ xs: "800", sm: "400" }}
                                        >
                                            {userPlan === "free" && (
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Banner
                                                        tone="warning"
                                                        title={t("settings.order_api.upgrade_your_plan")}
                                                    >
                                                        <Text
                                                            variant="bodyMd"
                                                            as="p"
                                                        >
                                                            {t("settings.order_api.upgrade_to_paid")}
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
                                                            {t("settings.order_api.upgrade_now")}
                                                        </Button>
                                                    </Banner>
                                                </div>
                                            )}
                                            <BlockStack gap="400">
                                                <Card sectioned subdued>
                                                    <BlockStack gap={400}>
                                                        <BlockStack
                                                            gap={100}
                                                            vertical
                                                            spacing="tight"
                                                        >
                                                            <InlineStack align="space-between">
                                                                <InlineStack
                                                                    align="start"
                                                                    gap={200}
                                                                    blockAlign="center"
                                                                >
                                                                    <Text
                                                                        variation="headingSm"
                                                                        fontWeight="bold"
                                                                    >
                                                                        {t("settings.integrations.klaviyo.title")}
                                                                    </Text>
                                                                    <Badge
                                                                        tone={currentSetting?.integrations?.klaviyo_enabled ? 'success' : 'attention'}
                                                                    >
                                                                        {currentSetting?.integrations?.klaviyo_enabled
                                                                            ? t("settings.email_content.enabled")
                                                                            : t("settings.email_content.disabled")}
                                                                    </Badge>
                                                                </InlineStack>
                                                                <Knob
                                                                    selected={currentSetting?.integrations?.klaviyo_enabled ?? false}
                                                                    disabled={userPlan === "free"}
                                                                    onClick={() => {
                                                                        if (userPlan !== "free") {
                                                                            handleKlaviyoKnob(!currentSetting?.integrations?.klaviyo_enabled ?? false)
                                                                        }
                                                                    }}
                                                                />
                                                            </InlineStack>
                                                            <Text variant="bodySm" as="p" tone="subdued">
                                                                {t("settings.integrations.klaviyo.description")}
                                                            </Text>
                                                        </BlockStack>
                                                        <BlockStack
                                                            gap={200}>
                                                            <TextField
                                                                label={t("settings.integrations.klaviyo.api_key")}
                                                                value={
                                                                    klaviyoKey
                                                                }
                                                                onChange={(value) => {
                                                                    setKlaviyoKey(value);
                                                                }}
                                                                onBlur={(event) => handleKlaviyoKeyChange("klaviyo_api_key", event.target.value
                                                                )}
                                                                autoComplete="off"
                                                                placeholder={t("settings.integrations.klaviyo.api_key_placeholder")}
                                                                disabled={userPlan === "free" || !currentSetting?.integrations?.klaviyo_enabled}
                                                            />
                                                            {userPlan === "free" ? <Banner tone="warning">
                                                                <p>
                                                                    {t("settings.integrations.klaviyo.upgrade_to_paid_plan")}
                                                                </p>
                                                            </Banner>
                                                                : ""
                                                            }
                                                            {currentSetting?.integrations?.klaviyo_enabled ?
                                                                <Banner status="success">
                                                                    <p>
                                                                        {t("settings.integrations.klaviyo.enabled_description")}
                                                                    </p>
                                                                    <div style={{
                                                                        marginTop: "8px"
                                                                    }}>
                                                                        <Button size="slim" url="https://conversionproplus.com/single-guide/how-to-integrate-klaviyo-with-digitally-digital-products-app" target="_blank" icon={ExternalIcon}>
                                                                            View Guide
                                                                        </Button>
                                                                    </div>

                                                                </Banner>
                                                                :
                                                                " "}
                                                        </BlockStack>
                                                    </BlockStack>
                                                </Card>

                                            </BlockStack>

                                            <BlockStack gap="400">
                                                <Card sectioned subdued>
                                                    <BlockStack gap={400}>
                                                        <BlockStack
                                                            gap={100}
                                                            vertical
                                                            spacing="tight"
                                                        >
                                                            <InlineStack align="space-between">
                                                                <InlineStack
                                                                    align="start"
                                                                    gap={200}
                                                                    blockAlign="center"
                                                                >
                                                                    <Text
                                                                        variation="headingSm"
                                                                        fontWeight="bold"
                                                                    >
                                                                        {t("settings.integrations.mailchimp.title")}
                                                                    </Text>
                                                                    <Badge
                                                                        tone={currentSetting?.integrations?.mailChimp_enabled ? 'success' : 'attention'}
                                                                    >
                                                                        {currentSetting?.integrations?.mailChimp_enabled
                                                                            ? t("settings.email_content.enabled")
                                                                            : t("settings.email_content.disabled")}
                                                                    </Badge>
                                                                </InlineStack>
                                                                <Knob
                                                                    selected={currentSetting?.integrations?.mailChimp_enabled ?? false}
                                                                    onClick={() => {
                                                                        if (userPlan !== "free") {
                                                                            handleMailChimpKnob(!currentSetting?.integrations?.mailChimp_enabled ?? false)
                                                                        }
                                                                    }}
                                                                    disabled={userPlan === "free"}
                                                                />
                                                            </InlineStack>
                                                            <Text variant="bodySm" as="p" tone="subdued">
                                                                {t("settings.integrations.mailchimp.description")}
                                                            </Text>
                                                        </BlockStack>
                                                        <BlockStack
                                                            gap={200}
                                                        >
                                                            <TextField
                                                                label={t("settings.integrations.mailchimp.api_key")}
                                                                value={
                                                                    mailChimpKey
                                                                }
                                                                onChange={(value) => {
                                                                    setMailChimpKey(value);
                                                                }}
                                                                onBlur={(event) => handleMailChimpKeyChange("mailChimp_api_key", event.target.value)}
                                                                autoComplete="off"
                                                                placeholder={t("settings.integrations.mailchimp.api_key_placeholder")}
                                                                disabled={
                                                                    userPlan === "free" || !currentSetting?.integrations?.mailChimp_enabled
                                                                }
                                                            />
                                                            {currentSetting?.integrations?.mailChimp_enabled ?
                                                                <Banner status="success">
                                                                    <p>
                                                                        {t("settings.integrations.mailchimp.enabled_description")}
                                                                    </p>
                                                                    <div style={{
                                                                        marginTop: "8px"
                                                                    }}>
                                                                        <Button size="slim" url="https://conversionproplus.com/single-guide/how-to-integrate-mailchimp-with-the-digitally-digital-products-app" target="_blank" icon={ExternalIcon}>
                                                                            View Guide
                                                                        </Button>
                                                                    </div>
                                                                </Banner>
                                                                :
                                                                " "}
                                                            {/* {userPlan === "free" ? <Banner tone="warning">
                                                                <p>
                                                                    {t("settings.integrations.mailchimp.upgrade_to_paid_plan")}
                                                                </p>
                                                            </Banner>
                                                                : ""
                                                            } */}
                                                            <TextField
                                                                label={t("settings.integrations.mailchimp.audience_id")}
                                                                value={
                                                                    mailChimpAudienceId
                                                                }
                                                                onChange={(value) => {
                                                                    setMailChimpAudienceId(value);
                                                                }}
                                                                onBlur={(event) => handleMailChimpAudienceIdChange("mailChimp_audience_id", event.target.value)}
                                                                autoComplete="off"
                                                                placeholder={t("settings.integrations.mailchimp.audience_id_placeholder")}
                                                                disabled={
                                                                    userPlan === "free" || !currentSetting?.integrations?.mailChimp_enabled
                                                                }
                                                            />
                                                            {userPlan === "free" ? <Banner tone="warning">
                                                                <p>
                                                                    {t("settings.integrations.mailchimp.upgrade_to_paid_plan")}
                                                                </p>
                                                            </Banner>
                                                                : ""
                                                            }
                                                            {currentSetting?.integrations?.mailChimp_enabled ?
                                                                <Banner status="success">
                                                                    <p>
                                                                        {t("settings.integrations.mailchimp.audience_id_description")}
                                                                    </p>
                                                                    <div style={{
                                                                        marginTop: "8px"
                                                                    }}>
                                                                        <Button size="slim" url="https://conversionproplus.com/single-guide/how-to-add-your-mailchimp-audience-id-in-the-digitally-digital-products-app" target="_blank" icon={ExternalIcon}>
                                                                            View Guide
                                                                        </Button>
                                                                    </div>
                                                                </Banner>
                                                                :
                                                                " "}

                                                        </BlockStack>
                                                    </BlockStack>

                                                </Card>
                                            </BlockStack>
                                            <BlockStack gap="400">
                                                <Card sectioned subdued>
                                                    <BlockStack gap={400}>
                                                        <BlockStack
                                                            gap={100}
                                                            vertical
                                                            spacing="tight"
                                                        >
                                                            <InlineStack align="space-between">
                                                                <InlineStack
                                                                    align="start"
                                                                    gap={200}
                                                                    blockAlign="center"
                                                                >
                                                                    <Text
                                                                        variation="headingSm"
                                                                        fontWeight="bold"
                                                                    >
                                                                        {t("settings.integrations.vimeo_integration.title")}
                                                                    </Text>
                                                                    <Badge
                                                                        tone={currentSetting?.vimeo_integration?.vimeo_integration_enabled ? 'success' : 'attention'}
                                                                    >
                                                                        {currentSetting?.vimeo_integration?.vimeo_integration_enabled
                                                                            ? t("settings.email_content.enabled")
                                                                            : t("settings.email_content.disabled")}
                                                                    </Badge>
                                                                </InlineStack>
                                                                <Knob
                                                                    selected={currentSetting?.vimeo_integration?.vimeo_integration_enabled ?? false}
                                                                    onClick={() => {
                                                                        if (userPlan !== "free") {
                                                                            handleVimeoKnob(!currentSetting?.vimeo_integration?.vimeo_integration_enabled ?? false)
                                                                        }
                                                                    }}
                                                                    disabled={userPlan === "free"}
                                                                />
                                                            </InlineStack>
                                                            <Text variant="bodySm" as="p" tone="subdued">
                                                                {t("settings.integrations.vimeo_integration.description")}
                                                            </Text>
                                                        </BlockStack>
                                                        <BlockStack
                                                            gap={200}
                                                        >
                                                            <Button
                                                                onClick={handleVimeoConnect}
                                                                size="large"
                                                                loading={buttonLoading}
                                                                disabled={userPlan === "free" || !currentSetting?.vimeo_integration?.vimeo_integration_enabled || store.setting?.vimeo_integration?.token_data}
                                                            >
                                                                {store.setting?.vimeo_integration?.token_data ? t("settings.integrations.vimeo_integration.connected_button") : t("settings.integrations.vimeo_integration.connect_button")}
                                                            </Button>
                                                            {store.setting?.vimeo_integration?.token_data ?
                                                                <Button
                                                                    onClick={handleVimeoDelete}
                                                                    size="large"
                                                                    variant="plain"
                                                                    tone="critical"
                                                                >
                                                                    {t("settings.integrations.vimeo_integration.remove_connection")}
                                                                </Button> : ""
                                                            }
                                                            {currentSetting?.vimeo_integration?.vimeo_integration_enabled ?
                                                                <Banner status="success">
                                                                    <p>
                                                                        {t("settings.integrations.vimeo_integration.enabled_description")}
                                                                    </p>
                                                                    <div style={{
                                                                        marginTop: "8px"
                                                                    }}>
                                                                        <Button size="slim" url="https://conversionproplus.com/single-guide/how-to-connect-vimeo-account-with-digitally-digital-products" target="_blank" icon={ExternalIcon}>
                                                                            View Guide
                                                                        </Button>
                                                                    </div>
                                                                </Banner>
                                                                :
                                                                " "}

                                                            {userPlan === "free" ? <Banner tone="warning">
                                                                <p>
                                                                    {t("settings.integrations.mailchimp.upgrade_to_paid_plan")}
                                                                </p>
                                                            </Banner>
                                                                : ""
                                                            }

                                                        </BlockStack>
                                                    </BlockStack>

                                                </Card>
                                            </BlockStack>
                                            <BlockStack gap="400">
                                                <Card sectioned subdued>
                                                    <BlockStack gap={400}>
                                                        <BlockStack
                                                            gap={100}
                                                            vertical
                                                            spacing="tight"
                                                        >
                                                            <InlineStack align="space-between">
                                                                <InlineStack
                                                                    align="start"
                                                                    gap={200}
                                                                    blockAlign="center"
                                                                >
                                                                    <Text
                                                                        variation="headingSm"
                                                                        fontWeight="bold"
                                                                    >
                                                                        {t("settings.integrations.wistia_integration.title")}
                                                                    </Text>
                                                                    <Badge
                                                                        tone={currentSetting?.wistia_integration?.wistia_integration_enabled ? 'success' : 'attention'}
                                                                    >
                                                                        {currentSetting?.wistia_integration?.wistia_integration_enabled
                                                                            ? t("settings.email_content.enabled")
                                                                            : t("settings.email_content.disabled")}
                                                                    </Badge>
                                                                </InlineStack>
                                                                <Knob
                                                                    selected={currentSetting?.wistia_integration?.wistia_integration_enabled ?? false}
                                                                    onClick={() => {
                                                                        if (userPlan !== "free") {
                                                                            handleWistiaKnob(!currentSetting?.wistia_integration?.wistia_integration_enabled ?? false)
                                                                        }
                                                                    }}
                                                                    disabled={userPlan === "free"}
                                                                />
                                                            </InlineStack>
                                                            <Text variant="bodySm" as="p" tone="subdued">
                                                                {t("settings.integrations.wistia_integration.description")}
                                                            </Text>
                                                        </BlockStack>
                                                        <BlockStack
                                                            gap={200}
                                                        >
                                                            <Button
                                                                onClick={handleWistiaConnect}
                                                                size="large"
                                                                loading={buttonLoading1}
                                                                disabled={userPlan === "free" || !currentSetting?.wistia_integration?.wistia_integration_enabled || store.setting?.wistia_integration?.token_data}
                                                            >
                                                                {store.setting?.wistia_integration?.token_data ? t("settings.integrations.wistia_integration.connected_button") : t("settings.integrations.wistia_integration.connect_button")}
                                                            </Button>
                                                            {store.setting?.wistia_integration?.token_data ?
                                                                <Button
                                                                    onClick={handleWistiaDelete}
                                                                    size="large"
                                                                    variant="plain"
                                                                    tone="critical"
                                                                >
                                                                    {t("settings.integrations.wistia_integration.remove_connection")}
                                                                </Button> : ""
                                                            }
                                                            {currentSetting?.wistia_integration?.wistia_integration_enabled ?
                                                                <Banner status="success">
                                                                    <p>
                                                                        {t("settings.integrations.wistia_integration.enabled_description")}
                                                                    </p>
                                                                    <div style={{
                                                                        marginTop: "8px"
                                                                    }}>
                                                                        <Button size="slim" url="https://conversionproplus.com/single-guide/how-to-connect-your-wistia-account-with-digitally-digital-products" target="_blank" icon={ExternalIcon}>
                                                                            View Guide
                                                                        </Button>
                                                                    </div>
                                                                </Banner>
                                                                :
                                                                " "}

                                                            {userPlan === "free" ?
                                                                <Banner tone="warning">
                                                                    <p>
                                                                        {t("settings.integrations.mailchimp.upgrade_to_paid_plan")}
                                                                    </p>
                                                                </Banner>
                                                                : ""
                                                            }

                                                        </BlockStack>
                                                    </BlockStack>

                                                </Card>
                                            </BlockStack>
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

export default Integrations;
