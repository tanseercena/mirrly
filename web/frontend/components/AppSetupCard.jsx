import {useState, useEffect, lazy} from "react";
import {
    Button,
    Text,
    Layout,
    Card,
    BlockStack,
    SkeletonBodyText,
    Badge,
    InlineStack
} from "@shopify/polaris";
import {SetupGuide} from "./SetupGuide.jsx";
import { useAppBridge } from '@shopify/app-bridge-react';
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { isCardDismissed, dismissCard } from "../utils/sessionStorage.js";

const ComponentSkeleton = () => (
    <div style={{ padding: '20px' }}>
        <SkeletonBodyText lines={5} />
    </div>
);

const displayGuideModal = (guide_type) => {
    const urls = {
        checkout_block: "https://www.loom.com/share/e366b2e1e0fa4db4bc9d9d7449fcb0ee",
    };
    const url = urls[guide_type] || urls.checkout_block;
    window.open(url, "_blank");
};

export const AppSetupCard = ({guideType, onReady}) => {
    const { t } = useTranslation()
    const shopify = useAppBridge();
    const navigate = useNavigate();
    const [showGuide, setShowGuide] = useState(!isCardDismissed('dashboard_setup_card'));
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [digitalProductsCount, setDigitalProductsCount] = useState(0);
    const [digitalLotteriesCount, setDigitalLotteriesCount] = useState(0);
    const [storeUpdated, setStoreUpdated] = useState(false);
    const [setupSteps, setSetupSteps] = useState({
        checkout_step: false,
        theme_extension_step: false,
        dp_create: false,
        settings_updated: false,
        dl_create: false,
    });

    // Replace these with your actual extension IDs/handles
    const CHECKOUT_EXTENSION_ID = 'thank-you-downloads';
    const THEME_BLOCK_TYPE = 'theme';
    //const APP_ID = '064e6080360edb2e75ba6048434fb15d'; // For local
    const APP_ID = '78b2cf9c2a9c63431defd44ad600ee8f';
    const EXTENSION_HANDLE = 'digitally';

    const handleEnableThankYouBlock = () => {
        // const redirect = Redirect.create(app);
        // redirect.dispatch(Redirect.Action.ADMIN_PATH,
        //     `/settings/checkout/editor?page=thank-you&context=apps&extension=${CHECKOUT_EXTENSION_ID}&focus=true`
        // );
        open(`shopify://admin/settings/checkout/editor?page=thank-you&context=apps&extension=${CHECKOUT_EXTENSION_ID}&focus=true`, '_top');
    };

    const handleEnableThemeExtension = () => {
        // const redirect = Redirect.create(app);
        // redirect.dispatch(Redirect.Action.ADMIN_PATH,
        //     `/themes/current/editor?context=apps&activateAppId=${APP_ID}/${EXTENSION_HANDLE}`
        // );
        open(`shopify://admin/themes/current/editor?context=apps&activateAppId=${APP_ID}/${EXTENSION_HANDLE}`, '_top');
    };

    // useEffect(() => {
    //
    //
    //
    // }, []);

    useEffect(() => {
        const fetchSetupData = async (isThankYouBlockAdded, themeExtensionEnabled) => {
            try {
                console.log('AppSetupCard: Starting data fetch...');
                const response = await fetch('/api/app-setup-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isThankYouBlockAdded,
                        themeExtensionEnabled
                    }),
                });
                const setupData = await response.json();
                console.log('AppSetupCard: Data fetched successfully', setupData);
                // const itemsWithCompletion = generateItems(setupData);
                // setItems(itemsWithCompletion);
                setDigitalProductsCount(setupData.digitalProductsCount);
                setDigitalLotteriesCount(setupData.digitalLotteriesCount);
                setStoreUpdated(setupData.storeUpdated);
                setSetupSteps(setupData.setupSteps || {
                    checkout_step: false,
                    theme_extension_step: false,
                    dp_create: false,
                    settings_updated: false,
                    dl_create: false,
                });
            } catch (error) {
                console.error("Failed to fetch setup data:", error);
                // setItems(generateItems({digitalProductsCount: 0, digitalLotteriesCount: 0, storeUpdated: false}));
            } finally {
                setIsLoading(false);
                console.log('AppSetupCard: Calling onReady callback');
                if (onReady) {
                    onReady();
                }
            }
        };

        const checkThankYouExtension = async () => {
            const extensions = await shopify.app.extensions();
            const checkoutExt = extensions.find(e => e.type === 'ui_extension');
            const thankYouEnabled = checkoutExt?.activations
                .some(a => a.target === 'purchase.thank-you.block.render') ?? false;
            const orderStatusEnabled = checkoutExt?.activations
                .some(a => a.target === 'customer-account.order-status.block.render') ?? false;
            const isThankYouBlockAdded = thankYouEnabled || orderStatusEnabled;

            // --- Theme App Extension ---
            const themeExtension = extensions.find(e => e.type === 'theme_app_extension');
            // Get the specific block by handle (e.g. 'digitally')
            const themeBlock = themeExtension?.activations.find(a => a.handle === 'digitally');
            const themeExtensionStatus = themeBlock?.status ?? 'unavailable'; // 'active' | 'available' | 'unavailable'
            const themeExtensionEnabled = themeExtensionStatus === 'active';

            await fetchSetupData(isThankYouBlockAdded, themeExtensionEnabled);
        };

        checkThankYouExtension();
    }, []);

    const onStepComplete = async (stepId) => {
        try {
            const response = await fetch('/api/toggle-setup-step', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ step_id: stepId }),
            });

            const data = await response.json();

            if (data.success) {
                setSetupSteps(data.setupSteps);
            }
        } catch (error) {
            console.error('Failed to toggle step:', error);
        }
    };

    const getExtensionStatusBadge = (isEnabled) => {
        return isEnabled ? (
            <Badge tone="success">{t("dashboard.setup_theme_extension_enabled")}</Badge>
        ) : (
            <Badge tone="attention">{t("dashboard.setup_theme_extension_not_enabled")}</Badge>
        );
    };

    const ITEMS = [
        {
            id: 0,
            title: t("dashboard.setup_checkout_block_heading"),
            description: (
                <>
                    <BlockStack gap="200">
                        <Text as="p">{t("dashboard.setup_checkout_block_desc")}</Text>
                        <InlineStack gap="200" blockAlign="center">
                            <Text as="span" variant="bodyMd" fontWeight="semibold">{t("dashboard.setup_theme_extension_status")}</Text>
                            {getExtensionStatusBadge(setupSteps.checkout_step)}
                        </InlineStack>
                        <a
                            href="https://www.loom.com/share/b5da505e75894208bbd880169405959e"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2c6ecb' }}
                        >
                            {t("dashboard.step1_link")}
                        </a>
                    </BlockStack>
                </>
            ),
            image: {
                url: "/images/setup-checkout-theme-ext.png",
                alt: "Setup Checkout Block",
            },
            complete: setupSteps.checkout_step,
            primaryButton: {
                content: t("dashboard.setup_thank_you_page"),
                props: {
                    onClick: handleEnableThankYouBlock,
                },
            },
        },
        {
            id: 1,
            title: t("dashboard.setup_theme_extension_heading"),
            description: (
                <>
                    <BlockStack gap="200">
                        <Text as="p">{t("dashboard.setup_theme_extension_desc")}</Text>
                        <InlineStack gap="200" blockAlign="center">
                            <Text as="span" variant="bodyMd" fontWeight="semibold">{t("dashboard.setup_theme_extension_status")}</Text>
                            {getExtensionStatusBadge(setupSteps.theme_extension_step)}
                        </InlineStack>
                        <a
                            href="https://www.loom.com/share/e04f7b2556544de0a7cc9d2373d665e0"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2c6ecb' }}
                        >
                            {t("dashboard.step1_link")}
                        </a>
                    </BlockStack>
                </>
            ),
            image: {
                url: "/images/setup-checkout-theme-ext.png",
                alt: "Setup Theme Extension",
            },
            complete: setupSteps.theme_extension_step,
            primaryButton: {
                content: t("dashboard.setup_theme_extension"),
                props: {
                    onClick: handleEnableThemeExtension,
                },
            },
        },
        {
            id: 2,
            title: t("dashboard.create_first_digital_product_heading"),
            description:
                t("dashboard.create_first_dp_desc"),
            image: {
                url: "/images/digital-product-guide.png",
                alt: t("dashboard.create_digital_product_btn"),
            },
            complete: setupSteps.dp_create || digitalProductsCount > 0,
            primaryButton: {
                content: t("dashboard.create_digital_product_btn"),
                props: {
                    onClick: () => navigate("/createDigitalProduct")
                },
            },
        },
        {
            id: 3,
            title: t("dashboard.configure_app_settings"),
            description:
                t("dashboard.configure_app_settings_desc"),
            image: {
                url: "/images/setup-guide.png",
                alt: "Setup",
            },
            complete: setupSteps.settings_updated || storeUpdated,
            primaryButton: {
                content: t("dashboard.configure_settings"),
                props: {
                    onClick: () => navigate("/Settings/Email"),
                },
            },
        },
        // {
        //     id: 4,
        //     title: t("dashboard.setup_digital_lottery"),
        //     description:
        //         t("dashboard.setup_digital_lottery_desc"),
        //     image: {
        //         url: "/images/ticket-guide.png",
        //     },
        //     complete: setupSteps.dl_create || digitalLotteriesCount > 0,
        //     primaryButton: {
        //         content: t("dashboard.create_digital_lottery"),
        //         props: {
        //             onClick: () => navigate("/digitalLottery"),
        //         },
        //     },
        // },
    ];

    // const onStepComplete = async (id) => {
    //     try {
    //         await new Promise((res) => setTimeout(res, 1000));

    //         setItems((prev) =>
    //             prev.map((item) =>
    //                 item.id === id ? {...item, complete: !item.complete} : item
    //             )
    //         );
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };

    if (isLoading) {
        // Don't show skeleton if setup guide was dismissed
        if (!showGuide) {
            return null;
        }

        return (
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="300">
                            <Text variant="headingLg" as="h5">
                                {t("dashboard.setup_guide")}
                            </Text>
                            <SkeletonBodyText/>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        );
    }

    // if (!showGuide) return <Button onClick={() => setShowGuide(true)}>{t("dashboard.show_setup_guide")}</Button>;

    return (
        <div className="max-w-[60rem] m-auto">
            {showGuide && (
                <SetupGuide
                    onDismiss={() => {
                        setShowGuide(false);
                        dismissCard('dashboard_setup_card');
                        setItems(ITEMS);
                    }}
                    onStepComplete={onStepComplete}
                    items={ITEMS}
                />
            )}

            {guideType === "theme_extension" && (
                <div style={{marginTop: "2rem"}}>
                    <Text as="p">
                        {t("dashboard.go_to_online_store_themes")} {'->'} {t("dashboard.customize_live_theme")} {'->'} {t("dashboard.go_to_app_embeds")} {'->'} {t("dashboard.enable_digitally_block")} {'->'} {t("dashboard.save")}
                    </Text>
                    <img
                        src="/images/theme_guide.png"
                        alt= {t("dashboard.theme_app_block_guide")}
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            marginTop: "10px",
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default AppSetupCard;
