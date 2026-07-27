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
} from "@shopify/polaris";
import LanguageSelector from "../../components/LanguageSelector";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { AppContext } from "../../components/providers/AppProvider";
// import '../App.css'
import { useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const OrderAPI = () => {
    const shopify = useAppBridge();
    const { store, isLoadingData, refetchStore } = useContext(AppContext);

    const [userPlan, setUserPlan] = useState("free");

    const [showToast, setShowToast] = useState(false);
    const [isErrorToast, setIsErrorToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [currentSetting, setCurrentSetting] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);

    const [isPreviewFetching, setIsPreviewFetching] = useState(true);

    const [isSaving, setIsSaving] = useState(false);

    const [isDownloadPreviewFetching, setIsDownloadPreviewFetching] =
        useState(true);
    const [replyToEmail, setReplyToEmail] = useState(
        store?.reply_to_email || store?.email || ""
    );

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

        // Use Redirect action from App Bridge to request new permissions
        // const redirect = Redirect.create(app);
        //
        // redirect.dispatch(
        //     Redirect.Action.REMOTE,
        //     decodeURIComponent(data.url)
        // );
        open(data.url, '_top');
    };

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

    const toggleToast = useCallback(
        () => setShowToast((showToast) => !showToast),
        []
    );

    const handleTranslation = () =>
        navigate("/translations", { replace: true });

    const handlePricing = () => navigate("/pricing", { replace: true });

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

    const handleSave = async (newSetting = null) => {
        setIsSaving(true);
        const formData = new FormData();
        console.log(currentSetting);

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
            shopify.toast.show(t("settings.order_api.failed_to_update_settings"), { isError: true, duration: 9999999 });
            setIsSaving(false);
        }
    };

    const loadingMarkup = (isLoadingData) && (
        <SkeletonPage title={t("settings.order_api.skeleton_title")}>
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
            className="settings-order-api-container"
            style={{
                marginBottom: "10px",
            }}
        >
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
                        <Card title={t("settings.order_api.tags")} sectioned>
                            {loadingMarkup}
                            {!isLoadingData &&
                                currentSetting  && (
                                    <Page
                                        title={t("settings.order_api.title")}
                                        subtitle={t("settings.order_api.desc")}
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
                                                <Checkbox
                                                    checked={
                                                        currentSetting.api_enabled
                                                    }
                                                    disabled={
                                                        isSaving ||
                                                        userPlan === "free"
                                                    }
                                                    onChange={(newValue, _) =>
                                                        handleApiEnabledChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.order_api.enable_api")}
                                                />

                                                {currentSetting.api_enabled ==
                                                    true &&
                                                    !hasOrderRequiredScopes && (
                                                        <Banner
                                                            title={t("settings.order_api.additional_permissions")}
                                                            status="warning"
                                                            action={{
                                                                content:
                                                                    t("settings.order_api.request_permissions"),
                                                                onAction: () =>
                                                                    requestCustomerWritePermission(
                                                                        "write_orders"
                                                                    ),
                                                                loading:
                                                                    permissionRequesting,
                                                            }}
                                                        >
                                                            <p>
                                                                {t("settings.order_api.additional_permissions_desc")}
                                                            </p>
                                                        </Banner>
                                                    )}

                                                {currentSetting.api_enabled ? (
                                                    <BlockStack
                                                        vertical
                                                        gap="300"
                                                    >
                                                        <Banner status="success">
                                                            <p>
                                                                {t("settings.order_api.api_integration_is_now_enabled")}
                                                            </p>
                                                        </Banner>

                                                        <Card sectioned subdued>
                                                            <BlockStack
                                                                gap="200"
                                                                vertical
                                                                spacing="tight"
                                                            >
                                                                <Text
                                                                    variation="headingSm"
                                                                    fontWeight="bold"
                                                                >
                                                                    {t("settings.order_api.api_key")}
                                                                </Text>
                                                                <BlockStack
                                                                    distribution="equalSpacing"
                                                                    alignment="center"
                                                                >
                                                                    <Text variation="code">
                                                                        {
                                                                            store?.api_token
                                                                        }
                                                                    </Text>
                                                                    <Button
                                                                        onClick={
                                                                            handleCopyApiKey
                                                                        }
                                                                        disclosure={
                                                                            copied
                                                                                ? "✓"
                                                                                : undefined
                                                                        }
                                                                        disabled={
                                                                            copied
                                                                        }
                                                                        size="slim"
                                                                    >
                                                                        {copied
                                                                            ? t("settings.order_api.copied")
                                                                            : t("settings.order_api.copy")}
                                                                    </Button>
                                                                </BlockStack>
                                                                <Text variation="subdued">
                                                                   {t("settings.order_api.keep_this_key")}
                                                                </Text>
                                                            </BlockStack>
                                                        </Card>

                                                        <Card sectioned subdued>
                                                            <BlockStack
                                                                gap="200"
                                                                vertical
                                                                spacing="tight"
                                                            >
                                                                <Text
                                                                    variation="headingSm"
                                                                    fontWeight="bold"
                                                                >
                                                                    {t("settings.order_api.api_endpoint")}
                                                                </Text>
                                                                <Text variation="code">
                                                                    {
                                                                        apiEndpoint
                                                                    }
                                                                </Text>
                                                            </BlockStack>
                                                        </Card>

                                                        <Card sectioned subdued>
                                                            <BlockStack
                                                                gap="200"
                                                                vertical
                                                                spacing="tight"
                                                            >
                                                                <Text
                                                                    variation="headingSm"
                                                                    fontWeight="bold"
                                                                >
                                                                    {t("settings.order_api.ip_restrictions")}
                                                                </Text>
                                                                <BlockStack
                                                                    distribution="equalSpacing"
                                                                    alignment="center"
                                                                >
                                                                    <Checkbox
                                                                        label={t("settings.order_api.enable_ip_restrictions")}
                                                                        checked={
                                                                            currentSetting
                                                                                .ip_restrictions
                                                                                ?.enable_restriction ??
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            handleSettingsChange(
                                                                                "enable_restriction",
                                                                                value
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isSaving ||
                                                                            userPlan === "free"
                                                                        }
                                                                    />

                                                                    {currentSetting
                                                                        .ip_restrictions
                                                                        ?.enable_restriction && (
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
                                                                                label={t("settings.order_api.allow_ips_list")}
                                                                                value={
                                                                                    ipList
                                                                                }
                                                                                onChange={setIpList}
                                                                                onBlur={(event) => handleSettingsChange("ips", event.target.value)}
                                                                                autoComplete="off"
                                                                                placeholder={t("settings.order_api.enter_ip_addresses")}
                                                                                disabled={
                                                                                    isSaving ||
                                                                                    userPlan ===
                                                                                    "free"
                                                                                }
                                                                                helpText={
                                                                                    <span>
                                                                                                        {t("settings.order_api.add_multiple_ips_comma_separated")}
                                                                                                    </span>
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}

                                                                </BlockStack>
                                                            </BlockStack>
                                                        </Card>

                                                        <Card sectioned subdued>
                                                            <BlockStack
                                                                gap="200"
                                                                vertical
                                                                spacing="tight"
                                                            >
                                                                <Text
                                                                    variation="headingSm"
                                                                    fontWeight="bold"
                                                                >
                                                                    {t("settings.order_api.documentation")}
                                                                </Text>
                                                                <Button
                                                                    url={
                                                                        apiDocumentationUrl
                                                                    }
                                                                    external
                                                                    disabled={
                                                                        true
                                                                    }
                                                                >
                                                                    {/*View API Documentation*/}{" "}
                                                                    {t("settings.order_api.coming_soon!")}
                                                                </Button>
                                                            </BlockStack>
                                                        </Card>
                                                    </BlockStack>
                                                ) : null}
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

export default OrderAPI;
