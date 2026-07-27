import SettingSideBar from "../../components/SettingSideBar";

import {
    BlockStack,
    Card,
    Layout,
    Page,
    SkeletonBodyText,
    SkeletonPage,
    Checkbox,
    Banner,
    LegacyStack,
    Tag,
    Listbox,
    Combobox,
    Icon,
    Text,
    Button,
    InlineStack,
    Thumbnail,
    Link,
    InlineGrid,
    TextField,
} from "@shopify/polaris";
import { SearchIcon } from '@shopify/polaris-icons';
import LanguageSelector from "../../components/LanguageSelector";
import React, { useCallback, useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../../components/providers/AppProvider";
// import "../App.css";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const OrderDelivery = () => {
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

    const [downloadPreviewHtml, setDownloadPreviewHtml] = useState(null);
    const [isDownloadPreviewFetching, setIsDownloadPreviewFetching] = useState(true);
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
    const { t } = useTranslation();
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [countryOptions, setCountryOptions] = useState([]);

    // New states for product restriction
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [validating, setValidating] = useState(false);

    const allCountryOptions = useMemo(
        () => [
            { label: "Afghanistan", value: "AF" },
            { label: "Albania", value: "AL" },
            { label: "Algeria", value: "DZ" },
            { label: "Andorra", value: "AD" },
            { label: "Angola", value: "AO" },
            { label: "Antigua and Barbuda", value: "AG" },
            { label: "Argentina", value: "AR" },
            { label: "Armenia", value: "AM" },
            { label: "Australia", value: "AU" },
            { label: "Austria", value: "AT" },
            { label: "Azerbaijan", value: "AZ" },
            { label: "Bahamas", value: "BS" },
            { label: "Bahrain", value: "BH" },
            { label: "Bangladesh", value: "BD" },
            { label: "Barbados", value: "BB" },
            { label: "Belarus", value: "BY" },
            { label: "Belgium", value: "BE" },
            { label: "Belize", value: "BZ" },
            { label: "Benin", value: "BJ" },
            { label: "Bhutan", value: "BT" },
            { label: "Bolivia", value: "BO" },
            { label: "Bosnia and Herzegovina", value: "BA" },
            { label: "Botswana", value: "BW" },
            { label: "Brazil", value: "BR" },
            { label: "Brunei", value: "BN" },
            { label: "Bulgaria", value: "BG" },
            { label: "Burkina Faso", value: "BF" },
            { label: "Burundi", value: "BI" },
            { label: "Cambodia", value: "KH" },
            { label: "Cameroon", value: "CM" },
            { label: "Canada", value: "CA" },
            { label: "Cape Verde", value: "CV" },
            { label: "Central African Republic", value: "CF" },
            { label: "Chad", value: "TD" },
            { label: "Chile", value: "CL" },
            { label: "China", value: "CN" },
            { label: "Colombia", value: "CO" },
            { label: "Comoros", value: "KM" },
            { label: "Congo (Congo-Brazzaville)", value: "CG" },
            { label: "Costa Rica", value: "CR" },
            { label: "Croatia", value: "HR" },
            { label: "Cuba", value: "CU" },
            { label: "Cyprus", value: "CY" },
            { label: "Czech Republic", value: "CZ" },
            { label: "Denmark", value: "DK" },
            { label: "Djibouti", value: "DJ" },
            { label: "Dominica", value: "DM" },
            { label: "Dominican Republic", value: "DO" },
            { label: "Ecuador", value: "EC" },
            { label: "Egypt", value: "EG" },
            { label: "El Salvador", value: "SV" },
            { label: "Equatorial Guinea", value: "GQ" },
            { label: "Eritrea", value: "ER" },
            { label: "Estonia", value: "EE" },
            { label: "Eswatini", value: "SZ" },
            { label: "Ethiopia", value: "ET" },
            { label: "Fiji", value: "FJ" },
            { label: "Finland", value: "FI" },
            { label: "France", value: "FR" },
            { label: "Gabon", value: "GA" },
            { label: "Gambia", value: "GM" },
            { label: "Georgia", value: "GE" },
            { label: "Germany", value: "DE" },
            { label: "Ghana", value: "GH" },
            { label: "Greece", value: "GR" },
            { label: "Grenada", value: "GD" },
            { label: "Guatemala", value: "GT" },
            { label: "Guinea", value: "GN" },
            { label: "Guinea-Bissau", value: "GW" },
            { label: "Guyana", value: "GY" },
            { label: "Haiti", value: "HT" },
            { label: "Honduras", value: "HN" },
            { label: "Hungary", value: "HU" },
            { label: "Iceland", value: "IS" },
            { label: "India", value: "IN" },
            { label: "Indonesia", value: "ID" },
            { label: "Iran", value: "IR" },
            { label: "Iraq", value: "IQ" },
            { label: "Ireland", value: "IE" },
            { label: "Israel", value: "IL" },
            { label: "Italy", value: "IT" },
            { label: "Jamaica", value: "JM" },
            { label: "Japan", value: "JP" },
            { label: "Jordan", value: "JO" },
            { label: "Kazakhstan", value: "KZ" },
            { label: "Kenya", value: "KE" },
            { label: "Kiribati", value: "KI" },
            { label: "Kuwait", value: "KW" },
            { label: "Kyrgyzstan", value: "KG" },
            { label: "Laos", value: "LA" },
            { label: "Latvia", value: "LV" },
            { label: "Lebanon", value: "LB" },
            { label: "Lesotho", value: "LS" },
            { label: "Liberia", value: "LR" },
            { label: "Libya", value: "LY" },
            { label: "Liechtenstein", value: "LI" },
            { label: "Lithuania", value: "LT" },
            { label: "Luxembourg", value: "LU" },
            { label: "Madagascar", value: "MG" },
            { label: "Malawi", value: "MW" },
            { label: "Malaysia", value: "MY" },
            { label: "Maldives", value: "MV" },
            { label: "Mali", value: "ML" },
            { label: "Malta", value: "MT" },
            { label: "Marshall Islands", value: "MH" },
            { label: "Mauritania", value: "MR" },
            { label: "Mauritius", value: "MU" },
            { label: "Mexico", value: "MX" },
            { label: "Micronesia", value: "FM" },
            { label: "Moldova", value: "MD" },
            { label: "Monaco", value: "MC" },
            { label: "Mongolia", value: "MN" },
            { label: "Montenegro", value: "ME" },
            { label: "Morocco", value: "MA" },
            { label: "Mozambique", value: "MZ" },
            { label: "Myanmar", value: "MM" },
            { label: "Namibia", value: "NA" },
            { label: "Nauru", value: "NR" },
            { label: "Nepal", value: "NP" },
            { label: "Netherlands", value: "NL" },
            { label: "New Zealand", value: "NZ" },
            { label: "Nicaragua", value: "NI" },
            { label: "Niger", value: "NE" },
            { label: "Nigeria", value: "NG" },
            { label: "North Korea", value: "KP" },
            { label: "North Macedonia", value: "MK" },
            { label: "Norway", value: "NO" },
            { label: "Oman", value: "OM" },
            { label: "Pakistan", value: "PK" },
            { label: "Palau", value: "PW" },
            { label: "Panama", value: "PA" },
            { label: "Papua New Guinea", value: "PG" },
            { label: "Paraguay", value: "PY" },
            { label: "Peru", value: "PE" },
            { label: "Philippines", value: "PH" },
            { label: "Poland", value: "PL" },
            { label: "Portugal", value: "PT" },
            { label: "Qatar", value: "QA" },
            { label: "Romania", value: "RO" },
            { label: "Russia", value: "RU" },
            { label: "Rwanda", value: "RW" },
            { label: "Saint Kitts and Nevis", value: "KN" },
            { label: "Saint Lucia", value: "LC" },
            { label: "Saint Vincent and the Grenadines", value: "VC" },
            { label: "Samoa", value: "WS" },
            { label: "San Marino", value: "SM" },
            { label: "Sao Tome and Principe", value: "ST" },
            { label: "Saudi Arabia", value: "SA" },
            { label: "Senegal", value: "SN" },
            { label: "Serbia", value: "RS" },
            { label: "Seychelles", value: "SC" },
            { label: "Sierra Leone", value: "SL" },
            { label: "Singapore", value: "SG" },
            { label: "Slovakia", value: "SK" },
            { label: "Slovenia", value: "SI" },
            { label: "Solomon Islands", value: "SB" },
            { label: "Somalia", value: "SO" },
            { label: "South Africa", value: "ZA" },
            { label: "South Korea", value: "KR" },
            { label: "South Sudan", value: "SS" },
            { label: "Spain", value: "ES" },
            { label: "Sri Lanka", value: "LK" },
            { label: "Sudan", value: "SD" },
            { label: "Suriname", value: "SR" },
            { label: "Sweden", value: "SE" },
            { label: "Switzerland", value: "CH" },
            { label: "Syria", value: "SY" },
            { label: "Taiwan", value: "TW" },
            { label: "Tajikistan", value: "TJ" },
            { label: "Tanzania", value: "TZ" },
            { label: "Thailand", value: "TH" },
            { label: "Timor-Leste", value: "TL" },
            { label: "Togo", value: "TG" },
            { label: "Tonga", value: "TO" },
            { label: "Trinidad and Tobago", value: "TT" },
            { label: "Tunisia", value: "TN" },
            { label: "Turkey", value: "TR" },
            { label: "Turkmenistan", value: "TM" },
            { label: "Tuvalu", value: "TV" },
            { label: "Uganda", value: "UG" },
            { label: "Ukraine", value: "UA" },
            { label: "United Arab Emirates", value: "AE" },
            { label: "United Kingdom", value: "GB" },
            { label: "United States", value: "US" },
            { label: "Uruguay", value: "UY" },
            { label: "Uzbekistan", value: "UZ" },
            { label: "Vanuatu", value: "VU" },
            { label: "Vatican City", value: "VA" },
            { label: "Venezuela", value: "VE" },
            { label: "Vietnam", value: "VN" },
            { label: "Yemen", value: "YE" },
            { label: "Zambia", value: "ZM" },
            { label: "Zimbabwe", value: "ZW" },
        ],
        []
    );

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

    // );

    const setting = store?.setting
        ? {
            ...store.setting,
        }
        : null;

    useEffect(() => {
        setCurrentSetting(setting);

        // Load saved products if they exist
        if (setting?.restricted_products) {
            setSelectedProducts(setting.restricted_products);
        }
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

    // const handlePricing = () => navigate("/pricing", { replace: true });

    const handleRestrictPaidDownloadsChange = useCallback(
        async (value) => {
            currentSetting.restrict_paid_downloads = value ? 1 : 0;
            setCurrentSetting(currentSetting);

            handleSave();
        },
        [currentSetting]
    );

    const handleLicensePerProductChange = useCallback(
        async (value) => {
            currentSetting.license_per_product = value ? 1 : 0;
            setCurrentSetting(currentSetting);

            handleSave();
        },
        [currentSetting]
    );

    const handleEmailPerLicensePerQtyChange = useCallback(
        async (value) => {
            currentSetting.email_per_license_per_qty = value ? 1 : 0;
            setCurrentSetting(currentSetting);
            handleSave();
        },
        [currentSetting]
    );

    const handleTagCustomerChange = useCallback(
        async (value) => {
            currentSetting.tag_customer = value ? 1 : 0;
            setCurrentSetting(currentSetting);

            handleSave();
        },
        [currentSetting]
    );

    const handleRiskyOrderDeliveryChange = useCallback(
        async (value) => {
            currentSetting.risky_order_delivery = value ? 1 : 0;
            setCurrentSetting(currentSetting);

            handleSave();
        },
        [currentSetting]
    );

    const handleCountryBlockChange = useCallback(
        async (value) => {
            currentSetting.country_block_enabled = value ? 1 : 0;
            setCurrentSetting(currentSetting);
            handleSave();
        },
        [currentSetting]
    );

    const handleRestrictProductAccessChange = useCallback(
        async (value) => {
            currentSetting.restrict_product_access = value ? 1 : 0;
            setCurrentSetting({ ...currentSetting });
            handleSave();
        },
        [currentSetting]
    );

    const toggleProductPicker = async () => {
        try {
            const selected = await shopify.resourcePicker({
                type: 'product',
                action: 'select',
                multiple: true,
                selectionIds: selectedProducts.map(product => product.id)
            });

            if (selected && selected.length > 0) {
                setValidating(true);

                try {
                    const response = await fetch("/api/validate-product-selection", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            products: selected
                        }),
                    });

                    const data = await response.json();

                    if (response.ok && data.valid) {
                        setSelectedProducts(selected);
                        currentSetting.restricted_products = selected;
                        setCurrentSetting({ ...currentSetting });
                        handleSave();
                    } else {
                        shopify.toast.show(data.message || "Invalid product selection. Please select only digital products.", { isError: true, duration: 9999999 });
                        setSelectedProducts([]);
                    }
                } catch (error) {
                    console.error("Error validating product:", error);
                    shopify.toast.show("Error validating product. Please try again.", { isError: true, duration: 9999999 });
                    setSelectedProducts([]);
                } finally {
                    setValidating(false);
                }
            }
        } catch (error) {
            console.error('Resource picker error:', error);
        }
    };

    const escapeSpecialRegExCharacters = useCallback(
        (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        []
    );

    const updateText = useCallback(
        (value) => {
            setInputValue(value);
            if (value === '') {
                setCountryOptions(allCountryOptions);
                return;
            }
            const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
            const resultOptions = allCountryOptions.filter((option) =>
                option.label.match(filterRegex)
            );
            setCountryOptions(resultOptions);
        },
        [allCountryOptions, escapeSpecialRegExCharacters]
    );

    const updateSelection = useCallback(
        (selected) => {
            let newSelectedCountries;
            if (selectedCountries.includes(selected)) {
                newSelectedCountries = selectedCountries.filter((option) => option !== selected);
            } else {
                newSelectedCountries = [...selectedCountries, selected];
            }
            setSelectedCountries(newSelectedCountries);
            updateText('');

            currentSetting.blocked_countries = newSelectedCountries;
            setCurrentSetting({ ...currentSetting });

            handleSave();
        },
        [selectedCountries, currentSetting, updateText]
    );

    const removeTag = useCallback(
        (tag) => () => {
            const updatedCountries = selectedCountries.filter((country) => country !== tag);
            setSelectedCountries(updatedCountries);
            currentSetting.blocked_countries = updatedCountries;
            setCurrentSetting({ ...currentSetting });

            handleSave();
        },
        [selectedCountries, currentSetting]
    );

    useEffect(() => {
        if (currentSetting?.blocked_countries) {
            setSelectedCountries(currentSetting.blocked_countries);
        }
    }, [currentSetting]);

    useEffect(() => {
        setCountryOptions(allCountryOptions);
    }, [allCountryOptions]);

    useEffect(() => {
        if (setting) {
            setCurrentSetting({
                restriction_title: t("settings.order_delivery.access_restricted"),
                restriction_description: t("settings.order_delivery.product_not_available_in_your_region"),
                ...setting,
            });

            if (setting?.restricted_products) {
                setSelectedProducts(setting.restricted_products);
            }
        }
    }, [store]);

    const handleRestrictionTitleChange = useCallback((value) => {
        const updated = {
            ...currentSetting,
            restriction_title: value,
        };
        setCurrentSetting(updated);
    }, [currentSetting]);

    const handleRestrictionDescriptionChange = useCallback((value) => {
        const updated = {
            ...currentSetting,
            restriction_description: value,
        };
        setCurrentSetting(updated);
    }, [currentSetting]);

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const response = await fetch("/api/user-plan");
                const data = await response.json();
                setUserPlan(data.plan);
            } catch (error) {
                console.error(t("settings.order_delivery.failed_to_fetch_user_plan"), error);
            }t("")
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
            "email_per_license_per_qty",
            currentSetting.email_per_license_per_qty
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
        formData.append(
            "country_block_enabled",
            currentSetting.country_block_enabled
        );
        formData.append(
            "blocked_countries",
            JSON.stringify(currentSetting.blocked_countries)
        );
        formData.append(
            "restrict_product_access",
            currentSetting.restrict_product_access
        );
        formData.append(
            "restricted_products",
            JSON.stringify(currentSetting.restricted_products || [])
        );
        formData.append(
            "restriction_title",
            currentSetting.restriction_title
        );
        formData.append(
            "restriction_description",
            currentSetting.restriction_description
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
            setIsSaving(false);
        } else {
            shopify.toast.show(t("settings.lottery_content.failed_to_update_settings"), { isError: true, duration: 9999999 });
            setIsSaving(false);
        }
    };

    const loadingMarkup = (isLoadingData) && (
        <SkeletonPage title={t("settings.order_delivery.order_delivery_conditions")}>
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

    const tagsMarkup = selectedCountries.map((countryValue) => {
        const country = allCountryOptions.find(opt => opt.value === countryValue);
        return (
            <Tag key={`option-${countryValue}`} onRemove={removeTag(countryValue)}>
                {country?.label || countryValue}
            </Tag>
        );
    });

    const optionsMarkup =
        countryOptions.length > 0
            ? countryOptions.map((option) => {
                const { label, value } = option;
                return (
                    <Listbox.Option
                        key={`${value}`}
                        value={value}
                        selected={selectedCountries.includes(value)}
                        accessibilityLabel={label}
                    >
                        {label}
                    </Listbox.Option>
                );
            })
            : null;

    return (
        <div
            className="settings-order-delivery-container"
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
                        <Card title={t("settings.order_delivery.tags")} sectioned>
                            {loadingMarkup}
                            {!isLoadingData &&
                                currentSetting
                                 && (
                                    <Page
                                        title={t("settings.order_delivery.order_delivery_conditions")}
                                        subtitle={t("settings.order_delivery.desc")}
                                    >
                                        <BlockStack
                                            gap={{ xs: "800", sm: "400" }}
                                        >
                                            <BlockStack gap="400">
                                                <Checkbox
                                                    checked={
                                                        currentSetting.restrict_paid_downloads
                                                    }
                                                    disabled={isSaving}
                                                    onChange={(newValue, _) =>
                                                        handleRestrictPaidDownloadsChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.order_delivery.access_download_only_for_paid_orders")}
                                                />
                                            </BlockStack>

                                            <BlockStack gap="400">
                                                <Checkbox
                                                    checked={
                                                        currentSetting.license_per_product
                                                    }
                                                    disabled={isSaving}
                                                    onChange={(newValue, _) =>
                                                        handleLicensePerProductChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.order_delivery.send_license_code")}
                                                />
                                            </BlockStack>

                                            <BlockStack gap="400">
                                                <Checkbox
                                                    checked={
                                                        currentSetting.email_per_license_per_qty
                                                    }
                                                    disabled={isSaving}
                                                    onChange={(newValue, _) =>
                                                        handleEmailPerLicensePerQtyChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.order_delivery.send_email_license_code")}
                                                />
                                            </BlockStack>

                                            <BlockStack gap="400">
                                                <Checkbox
                                                    checked={
                                                        currentSetting.tag_customer
                                                    }
                                                    disabled={isSaving}
                                                    onChange={(newValue, _) =>
                                                        handleTagCustomerChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.order_delivery.add_products_name")}
                                                />

                                                {currentSetting.tag_customer ==
                                                    true &&
                                                    !hasRequiredScopes && (
                                                        <Banner
                                                            title={t("settings.order_delivery.additional_permissions")}
                                                            status="warning"
                                                            action={{
                                                                content:
                                                                    t("settings.order_delivery.request_permissions"),
                                                                onAction: () =>
                                                                    requestCustomerWritePermission(
                                                                        "write_customers"
                                                                    ),
                                                                loading:
                                                                    permissionRequesting,
                                                            }}
                                                        >
                                                            <p>
                                                                {t("settings.order_delivery.to_enable_customers_tagging")}
                                                            </p>
                                                        </Banner>
                                                    )}
                                            </BlockStack>

                                            <BlockStack gap="400">
                                                <Checkbox
                                                    checked={
                                                        currentSetting.risky_order_delivery
                                                    }
                                                    disabled={isSaving}
                                                    onChange={(newValue, _) =>
                                                        handleRiskyOrderDeliveryChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.order_delivery.block_digital_content")}
                                                />
                                            </BlockStack>

                                            <BlockStack gap="400">
                                                <Checkbox
                                                    checked={currentSetting.country_block_enabled}
                                                    disabled={isSaving}
                                                    onChange={(newValue, _) =>
                                                        handleCountryBlockChange(
                                                            newValue
                                                        )
                                                    }
                                                    label={t("settings.order_delivery.enable_country_based_blocking")}
                                                />

                                                {currentSetting.country_block_enabled && (
                                                    <Card>
                                                        <BlockStack gap="400">
                                                            <Text as="p" variant="bodyMd" fontWeight="semibold">
                                                                {t("settings.order_delivery.block_users_from_these_countries")}
                                                            </Text>
                                                            <Combobox
                                                                allowMultiple
                                                                activator={
                                                                    <Combobox.TextField
                                                                        prefix={<Icon source={SearchIcon} />}
                                                                        onChange={updateText}
                                                                        label={t("settings.order_delivery.search_countries")}
                                                                        labelHidden
                                                                        value={inputValue}
                                                                        placeholder={t("settings.order_delivery.search_countries")}
                                                                        autoComplete="off"
                                                                    />
                                                                }
                                                            >
                                                                {optionsMarkup ? (
                                                                    <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
                                                                ) : null}
                                                            </Combobox>
                                                            {selectedCountries.length > 0 && (
                                                                <LegacyStack spacing="tight">{tagsMarkup}</LegacyStack>
                                                            )}
                                                        </BlockStack>
                                                        <div style={{marginTop: "15px"}}></div>
                                                        <BlockStack gap="400">
                                                            <Checkbox
                                                                checked={currentSetting.restrict_product_access}
                                                                disabled={isSaving}
                                                                onChange={(newValue, _) =>
                                                                    handleRestrictProductAccessChange(
                                                                        newValue
                                                                    )
                                                                }
                                                                label={t("settings.order_delivery.restrict_product_access")}
                                                            />
                                                        </BlockStack>

                                                        {currentSetting.restrict_product_access && (
                                                            <>
                                                                <BlockStack gap="300">
                                                                    <Text variant="headingMd" as="h6">
                                                                        {t("settings.order_delivery.select_products_to_restrict")}
                                                                    </Text>
                                                                    <Banner>
                                                                        <p>
                                                                            {t("settings.order_delivery.select_products_restricted_description")}
                                                                        </p>
                                                                    </Banner>
                                                                    {selectedProducts.length > 0 ? (
                                                                        <div style={{ marginTop: "10px" }}>
                                                                            <InlineGrid columns="1fr auto" style={{ marginBottom: "10px" }}>
                                                                                <div>
                                                                                    {selectedProducts.map((product) => (
                                                                                        <div style={{ marginTop: "10px" }} key={product.id}>
                                                                                            <InlineStack>
                                                                                                <div>
                                                                                                    <Thumbnail
                                                                                                        source={product.images[0]?.originalSrc ?? 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081'}
                                                                                                        alt={product.title}
                                                                                                        size="large"
                                                                                                    />
                                                                                                </div>
                                                                                                <div style={{ marginLeft: '20px' }}>
                                                                                                    <div>
                                                                                                        <Link url="#">
                                                                                                            <Text variant="headingMd" as="h6">
                                                                                                                {product.title}
                                                                                                            </Text>
                                                                                                        </Link>
                                                                                                        {product.variants?.length > 1 ? (
                                                                                                            <Text variant="bodyLg" as="p">
                                                                                                                {t("settings.order_delivery.all_variants")} ({product.variants.length})
                                                                                                            </Text>
                                                                                                        ) : (
                                                                                                            product.variants?.map((variant) => (
                                                                                                                <Text key={variant.id} variant="bodyLg" as="h6">
                                                                                                                    {variant.title}
                                                                                                                </Text>
                                                                                                            ))
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </InlineStack>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <div onClick={toggleProductPicker}>
                                                                                    <Link url="#">
                                                                                        <Text variant="bodyLg" as="p">
                                                                                            {t("settings.order_delivery.edit_products")}
                                                                                        </Text>
                                                                                    </Link>
                                                                                </div>
                                                                            </InlineGrid>
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <div style={{ flex: '78%' }}>
                                                                                <TextField
                                                                                    value={selectedProducts.map(product => product.title).join(", ")}
                                                                                    onFocus={toggleProductPicker}
                                                                                    placeholder={t("settings.order_delivery.search_shopify_products")}
                                                                                    fullWidth
                                                                                    readOnly
                                                                                    disabled={validating}
                                                                                />
                                                                            </div>
                                                                            <div style={{ flex: '22%', marginLeft: '1rem' }}>
                                                                                <Button
                                                                                    onClick={toggleProductPicker}
                                                                                    disabled={validating}
                                                                                    loading={validating}
                                                                                >
                                                                                    {t("settings.order_delivery.browse_products")}
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </BlockStack>
                                                                <div style={{marginTop: "15px"}}></div>
                                                                <BlockStack gap="400">
                                                                    <Text variant="headingMd" as="h6">
                                                                        {t("settings.order_delivery.restricted_product_message")}
                                                                    </Text>
                                                                    <TextField
                                                                        label={t("settings.order_delivery.title")}
                                                                        value={currentSetting.restriction_title}
                                                                        onChange={handleRestrictionTitleChange}
                                                                        onBlur={handleSave}
                                                                        placeholder={t("settings.order_delivery.access_restricted")}
                                                                    />
                                                                    <TextField
                                                                        label={t("settings.order_delivery.description")}
                                                                        value={currentSetting.restriction_description}
                                                                        onChange={handleRestrictionDescriptionChange}
                                                                        onBlur={handleSave}
                                                                        placeholder={t("settings.order_delivery.product_not_available_in_your_region")}
                                                                        multiline={3}
                                                                    />
                                                                    <Text variant="bodySm" tone="subdued">
                                                                        {t("settings.order_delivery.restriction_message_help_text")}
                                                                    </Text>
                                                                </BlockStack>
                                                            </>
                                                        )}
                                                    </Card>
                                                )}
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

export default OrderDelivery;
