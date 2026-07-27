import SettingSideBar from "../../components/SettingSideBar";
import {
    BlockStack,
    Card,
    Layout,
    Link,
    Page,
    SkeletonBodyText,
    SkeletonPage,
    Text,
    TextField,
    Checkbox,
        Banner,
    Select
} from "@shopify/polaris";
import LanguageSelector from "../../components/LanguageSelector";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { AppContext } from "../../components/providers/AppProvider";
// import '../App.css'
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";


const TrackLicenseKeys = () => {
    const shopify = useAppBridge();
    const { store, isLoadingData, refetchStore } = useContext(AppContext);
    const navigate = useNavigate();

    const [userPlan, setUserPlan] = useState("free");

        const [currentSetting, setCurrentSetting] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    const [isDownloadPreviewFetching, setIsDownloadPreviewFetching] =
        useState(true);
    const [file, setFile] = useState(null);
    const [lotteryContentFile, setLotteryContentFile] = useState(null);
    const [downloadContentFile, setDownloadContentFile] = useState(null);
    const [copied, setCopied] = useState(false);
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

    const toggleToast = useCallback(
        () => setShowToast((showToast) => !showToast),
        []
    );

    const handleTranslation = () =>
        navigate("/translations");

    const handlePricing = () => navigate("/pricing");

    const handleLicenseTrackingChange = useCallback(
        async (value) => {
            currentSetting.track_license_codes = value ? 1 : 0;
            setCurrentSetting(currentSetting);

            handleSave();
        },
        [setting]
    );

    const handleLicenseOptionChange = useCallback(
        async (optionName, value, saveImmediately = true) => {
            // Check if this is a nested property (contains a dot)
            if (optionName.includes(".")) {
                // Split the option name into parts
                const [parentKey, childKey] = optionName.split(".");

                // Create a copy of the current license tracking options or initialize an empty object
                const updatedOptions = {
                    ...(currentSetting.license_tracking_options || {}),
                    [parentKey]: {
                        ...(currentSetting.license_tracking_options?.[
                            parentKey
                        ] || {}),
                        [childKey]: value,
                    },
                };

                // Update the current setting in a non-destructive way
                currentSetting.license_tracking_options = updatedOptions;
                setCurrentSetting({ ...currentSetting });
            } else {
                // Handle non-nested properties as before
                const updatedOptions = {
                    ...(currentSetting.license_tracking_options || {}),
                    [optionName]: value,
                };

                // Update the current setting in a non-destructive way
                currentSetting.license_tracking_options = updatedOptions;
                setCurrentSetting({ ...currentSetting });
            }

            // Only save immediately for checkbox changes, not for text input changes
            if (saveImmediately) {
                handleSave();
            }
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
                console.error(t("settings.track_license_keys.failed_to_fetch_user_plan"), error);
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
            shopify.toast.show(t("settings.track_license_keys.settings_updated_successfully"));
            refetchStore();
            setIsSaving(false);
        } else {
            setShowToast(true);
            shopify.toast.show(t("settings.track_license_keys.failed_to_update_settings"), { isError: true, duration: 9999999 });
            setIsSaving(false);
        }
    };

    const loadingMarkup = (isLoadingData) && (
        <SkeletonPage title={t("settings.track_license_keys.title")}>
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
                marginBottom: "5px",
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
                        <Card title={t("settings.track_license_keys.tags")} sectioned>
                            {loadingMarkup}
                                {!isLoadingData &&
                                currentSetting
                                && (
                                    <Page
                                        title={t("settings.track_license_keys.title")}
                                        subtitle={t("settings.track_license_keys.desc")}
                                    >
                                        <BlockStack
                                            gap={{ xs: "800", sm: "400" }}
                                        >
                                            {userPlan !== "plus" &&
                                                userPlan !== "unlimited" && (
                                                    <Banner
                                                        tone="warning"
                                                        title={t("settings.track_license_keys.upgrade_your_plan")}
                                                    >
                                                        <Text
                                                            variant="bodyMd"
                                                            as="p"
                                                        >
                                                            {t("settings.track_license_keys.upgrade_to_plus")}
                                                        </Text>
                                                        <div
                                                            onClick={
                                                                handlePricing
                                                            }
                                                        >
                                                            <Link>
                                                                {t("settings.track_license_keys.upgrade_now")}
                                                            </Link>
                                                        </div>
                                                    </Banner>
                                                )}
                                            {/* <div
                                                style={{ marginTop: "10px" }}
                                            ></div> */}
                                            <Checkbox
                                                checked={
                                                    currentSetting.track_license_codes
                                                }
                                                disabled={
                                                    (userPlan !== "unlimited" &&
                                                        userPlan !== "plus") ||
                                                    isSaving
                                                }
                                                onChange={(newValue, _) =>
                                                    handleLicenseTrackingChange(
                                                        newValue
                                                    )
                                                }
                                                label={t("settings.track_license_keys.enable_license_code_tracking")}
                                            />

                                            {currentSetting.track_license_codes && (
                                                <>
                                                    <Card sectioned subdued>
                                                        <Checkbox
                                                            checked={
                                                                currentSetting
                                                                    .license_tracking_options
                                                                    ?.limit_cart_quantity ||
                                                                false
                                                            }
                                                            disabled={isSaving}
                                                            onChange={(
                                                                newValue,
                                                                _
                                                            ) =>
                                                                handleLicenseOptionChange(
                                                                    "limit_cart_quantity",
                                                                    newValue
                                                                )
                                                            }
                                                            label={t("settings.track_license_keys.limit_cart_quantity")}
                                                        />
                                                        <Text
                                                            variant="bodySm"
                                                            color="subdued"
                                                            as="p"
                                                            style={{
                                                                marginLeft:
                                                                    "24px",
                                                                marginTop:
                                                                    "4px",
                                                            }}
                                                        >
                                                            {t("settings.track_license_keys.limit_cart_quantity_desc")}
                                                        </Text>

                                                        {currentSetting
                                                            .license_tracking_options
                                                            ?.limit_cart_quantity && (
                                                                <div
                                                                    style={{
                                                                        marginLeft:
                                                                            "24px",
                                                                        marginTop:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <Text
                                                                        variant="bodyMd"
                                                                        as="p"
                                                                        fontWeight="semibold"
                                                                    >
                                                                        {t("settings.track_license_keys.custom_element_selectors")}
                                                                    </Text>
                                                                    <Text
                                                                        variant="bodySm"
                                                                        color="subdued"
                                                                        as="p"
                                                                    >
                                                                        {t("settings.track_license_keys.custom_element_selectors_desc")}
                                                                    </Text>

                                                                    <TextField
                                                                        label={t("settings.track_license_keys.quantity_input_selector")}
                                                                        value={
                                                                            currentSetting
                                                                                .license_tracking_options
                                                                                ?.selectors
                                                                                ?.quantityInput ||
                                                                            "input[name='quantity'], [name='quantity']"
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            handleLicenseOptionChange(
                                                                                "selectors.quantityInput",
                                                                                value,
                                                                                false
                                                                            )
                                                                        }
                                                                        placeholder={t("settings.track_license_keys.input_name")}
                                                                        helpText={t("settings.track_license_keys.quantity_input_selector_desc")}
                                                                        onBlur={() =>
                                                                            handleSave()
                                                                        }
                                                                    />

                                                                    <TextField
                                                                        label={t("settings.track_license_keys.add_to_cart_button_selector")}
                                                                        value={
                                                                            currentSetting
                                                                                .license_tracking_options
                                                                                ?.selectors
                                                                                ?.addToCartButton ||
                                                                            "[name='add'], .add-to-cart, .add_to_cart_button"
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            handleLicenseOptionChange(
                                                                                "selectors.addToCartButton",
                                                                                value,
                                                                                false
                                                                            )
                                                                        }
                                                                        placeholder={t("settings.track_license_keys.name_add")}
                                                                        helpText={t("settings.track_license_keys.add_to_cart_button_selector_desc")}
                                                                        onBlur={() =>
                                                                            handleSave()
                                                                        }
                                                                    />

                                                                    <TextField
                                                                        label={t("settings.track_license_keys.quantity_plus_button_selector")}
                                                                        value={
                                                                            currentSetting
                                                                                .license_tracking_options
                                                                                ?.selectors
                                                                                ?.plusButton ||
                                                                            "form [data-action='increase-quantity'], .quantity-up, .plus"
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            handleLicenseOptionChange(
                                                                                "selectors.plusButton",
                                                                                value,
                                                                                false
                                                                            )
                                                                        }
                                                                        placeholder={t("settings.track_license_keys.form_action")}
                                                                        helpText={t("settings.track_license_keys.quantity_plus_button_selector_desc")}
                                                                        onBlur={() =>
                                                                            handleSave()
                                                                        }
                                                                    />

                                                                    <TextField
                                                                        label={t("settings.track_license_keys.cart_drawer_plus")}
                                                                        value={
                                                                            currentSetting
                                                                                .license_tracking_options
                                                                                ?.selectors
                                                                                ?.drawerPlusCartButton ||
                                                                            "#CartDrawer-Form .quantity__button[name='plus']"
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            handleLicenseOptionChange(
                                                                                "selectors.drawerPlusCartButton",
                                                                                value,
                                                                                false
                                                                            )
                                                                        }
                                                                        placeholder={t("settings.track_license_keys.cart_drawer_form")}
                                                                        helpText={t("settings.track_license_keys.cart_drawer_plus_desc")}
                                                                        onBlur={() =>
                                                                            handleSave()
                                                                        }
                                                                    />

                                                                    <TextField
                                                                        label={t("settings.track_license_keys.cart_drawer_quantity")}
                                                                        value={
                                                                            currentSetting
                                                                                .license_tracking_options
                                                                                ?.selectors
                                                                                ?.drawerQuantityInput ||
                                                                            ".quantity__input"
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            handleLicenseOptionChange(
                                                                                "selectors.drawerQuantityInput",
                                                                                value,
                                                                                false
                                                                            )
                                                                        }
                                                                        placeholder={t("settings.track_license_keys.quantity_input")}
                                                                        helpText={t("settings.track_license_keys.cart_drawer_quantity_desc")}
                                                                        onBlur={() =>
                                                                            handleSave()
                                                                        }
                                                                    />

                                                                    <TextField
                                                                        label={t("settings.track_license_keys.home_page_selector")}
                                                                        value={
                                                                            currentSetting
                                                                                .license_tracking_options
                                                                                ?.selectors
                                                                                ?.featuredProductSelector ||
                                                                            ".featured-product"
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            handleLicenseOptionChange(
                                                                                "selectors.featuredProductSelector",
                                                                                value,
                                                                                false
                                                                            )
                                                                        }
                                                                        placeholder={t("settings.track_license_keys..featured_product")}
                                                                        helpText={t("settings.track_license_keys.home_page_selector_desc")}
                                                                        onBlur={() =>
                                                                            handleSave()
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "15px",
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    currentSetting
                                                                        .license_tracking_options
                                                                        ?.send_email_notification ||
                                                                    false
                                                                }
                                                                disabled={
                                                                    isSaving
                                                                }
                                                                onChange={(
                                                                    newValue,
                                                                    _
                                                                ) =>
                                                                    handleLicenseOptionChange(
                                                                        "send_email_notification",
                                                                        newValue
                                                                    )
                                                                }
                                                                label={t("settings.track_license_keys.send_low_stock")}
                                                            />
                                                            <Text
                                                                variant="bodySm"
                                                                color="subdued"
                                                                as="p"
                                                                style={{
                                                                    marginLeft:
                                                                        "24px",
                                                                    marginTop:
                                                                        "4px",
                                                                }}
                                                            >
                                                                {t("settings.track_license_keys.send_low_stock_desc")}
                                                            </Text>

                                                            {currentSetting
                                                                .license_tracking_options
                                                                ?.send_email_notification && (
                                                                    <div
                                                                        style={{
                                                                            marginLeft:
                                                                                "24px",
                                                                            marginTop:
                                                                                "10px",
                                                                            maxWidth:
                                                                                "400px",
                                                                        }}
                                                                    >
                                                                        <TextField
                                                                            label={t("settings.track_license_keys.notification_email")}
                                                                            type="email"
                                                                            value={
                                                                                currentSetting
                                                                                    .license_tracking_options
                                                                                    ?.notification_email ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handleLicenseOptionChange(
                                                                                    "notification_email",
                                                                                    value,
                                                                                    false
                                                                                )
                                                                            }
                                                                            onBlur={() =>
                                                                                handleSave()
                                                                            } // Save when user leaves the field
                                                                            disabled={
                                                                                isSaving
                                                                            }
                                                                        />
                                                                        <TextField
                                                                            label={t("settings.track_license_keys.threshold_value")}
                                                                            type="number"
                                                                            value={
                                                                                currentSetting
                                                                                    .license_tracking_options
                                                                                    ?.notification_threshold
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handleLicenseOptionChange(
                                                                                    "notification_threshold",
                                                                                    value,
                                                                                    false
                                                                                )
                                                                            }
                                                                            onBlur={() =>
                                                                                handleSave()
                                                                            } // Save when user leaves the field
                                                                            helpText={t("settings.track_license_keys.you_will_receive")}
                                                                            min={1}
                                                                            disabled={
                                                                                isSaving
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </Card>
                                                </>
                                            )}

                                            <div
                                                style={{
                                                    marginTop:
                                                        "15px",
                                                }}
                                            >
                                                <Checkbox
                                                    checked={
                                                        currentSetting
                                                            .license_tracking_options
                                                            ?.show_bundle_product_name ||
                                                        false
                                                    }
                                                    disabled={
                                                        isSaving
                                                    }
                                                    onChange={(
                                                        newValue,
                                                        _
                                                    ) =>
                                                        handleLicenseOptionChange(
                                                            "show_bundle_product_name",
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.track_license_keys.show_bundle_product_name")}
                                                />
                                            </div>

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

export default TrackLicenseKeys;
