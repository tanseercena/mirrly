import {
    Button,
    Checkbox,
    BlockStack,
    Text,
    Frame,
    Link,
    InlineStack,
    Box,
    Modal,
    TextContainer,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

import { Icon } from "@shopify/polaris";
import {
    PlusCircleIcon,
    EmailIcon,
    EditIcon,
    FlipVerticalIcon,
} from "@shopify/polaris-icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Congratulations = ({ onComplete }) => {

    const [active, setActive] = useState(true);
    const handleChange = useCallback(() => setActive(!active), [active]);

    const [digitalProduct, setDigitalProduct] = useState(true);
    const [license, setLicense] = useState(true);
    const [linkProduct, setLinkProduct] = useState(true);
    const [publish, setPublish] = useState(true);

    const { t } = useTranslation();
    const navigate = useNavigate();

    // Navigation handlers
    const handleCreateNewProduct = useCallback(() => {
        navigate("/CreateDigitalProduct");
    }, [navigate]);

    const handleTestOrder = useCallback(() => {
        navigate("/createFreeOrder");
    }, [navigate]);

    const handleUpgradePlan = useCallback(() => {
        navigate("/pricing");
    }, [navigate]);

    const handleContinueToDashboard = useCallback(() => {
        navigate("/");
    }, [navigate]);

    // const activator = <Button onClick={handleChange}>Open</Button>;
    return (
        <div>
            <style>
                {`
        .Polaris-Modal-CloseButton,
        .Polaris-Modal-Header__CloseButton,
        [aria-label="Close"],
        .Polaris-Modal .Polaris-Button[aria-label="Close"],
        .Polaris-Button.Polaris-Button--pressable.Polaris-Button--variantTertiary.Polaris-Button--sizeMedium.Polaris-Button--textAlignCenter.Polaris-Button--iconOnly,
        .Polaris-Button--iconOnly {
            display: none !important;
        }
        .Polaris-Modal-Header {
            padding-right: 0 !important;
        }
        `}
            </style>
            <div style={{ height: "500px" }}>
                <Frame>
                    <Modal
                        // activator={activator}
                        open={active}
                        // onClose={handleChange}
                        title={t("onboarding.congratulations")}
                        // primaryAction={{
                        //     content: "Continue",
                        //     onAction: onComplete,
                        // }}
                    >
                        <Modal.Section>
                            <BlockStack gap="200">
                                {/* Header */}
                                <InlineStack
                                    align="space-between"
                                    blockAlign="start"
                                >
                                    <Box>
                                        <Text variant="headingXl" as="h2">
                                            {t(
                                                "onboarding.your_digital_product_is_live"
                                            )}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <div
                                            style={{
                                                fontSize: "48px",
                                                lineHeight: "1",
                                            }}
                                        >
                                            🎉
                                        </div>
                                    </Box>
                                </InlineStack>

                                {/* Next Steps */}
                                <BlockStack gap="300">
                                    <Text variant="headingMd" as="h3">
                                        {t("onboarding.next_steps")}
                                    </Text>

                                    <BlockStack gap="200">
                                        {/* Test Order */}
                                        <InlineStack
                                            align="space-between"
                                            blockAlign="center"
                                        >
                                            <InlineStack
                                                gap="200"
                                                blockAlign="center"
                                            >
                                                <Icon
                                                    source={EditIcon}
                                                    tone="base"
                                                />
                                                <Text
                                                    variant="bodyMd"
                                                    as="span"
                                                >
                                                    {t(
                                                        "onboarding.test_digital_product_with_order"
                                                    )}
                                                </Text>
                                            </InlineStack>
                                            <Button
                                                size="slim"
                                                variant="secondary"
                                                onClick={handleTestOrder}
                                            >
                                                {t(
                                                    "onboarding.test_digital_product"
                                                )}
                                            </Button>
                                        </InlineStack>
                                        {/* Create another product */}
                                        <InlineStack
                                            align="space-between"
                                            blockAlign="center"
                                        >
                                            <InlineStack
                                                gap="200"
                                                blockAlign="center"
                                            >
                                                <Icon
                                                    source={PlusCircleIcon}
                                                    tone="base"
                                                />
                                                <Text
                                                    variant="bodyMd"
                                                    as="span"
                                                >
                                                    {t(
                                                        "onboarding.create_another_product"
                                                    )}
                                                </Text>
                                            </InlineStack>
                                            <Button
                                                size="slim"
                                                variant="secondary"
                                                onClick={handleCreateNewProduct}
                                            >
                                                {t(
                                                    "onboarding.create_new_product"
                                                )}
                                            </Button>
                                        </InlineStack>

                                        {/* Customize Emails */}
                                        <InlineStack
                                            align="space-between"
                                            blockAlign="center"
                                        >
                                            <InlineStack
                                                gap="200"
                                                blockAlign="center"
                                            >
                                                <Icon
                                                    source={EmailIcon}
                                                    tone="base"
                                                />
                                                <Text
                                                    variant="bodyMd"
                                                    as="span"
                                                >
                                                    {t(
                                                        "onboarding.customize_emails"
                                                    )}
                                                </Text>
                                            </InlineStack>
                                            <Button
                                                size="slim"
                                                variant="secondary"
                                                onClick={handleOpenEmailEditor}
                                            >
                                                {t(
                                                    "onboarding.open_email_editor"
                                                )}
                                            </Button>
                                        </InlineStack>

                                        {/* Explore Premium Features */}
                                        <InlineStack
                                            align="space-between"
                                            blockAlign="center"
                                        >
                                            <InlineStack
                                                gap="200"
                                                blockAlign="center"
                                            >
                                                <Icon
                                                    source={FlipVerticalIcon}
                                                    tone="base"
                                                />
                                                <Text
                                                    variant="bodyMd"
                                                    as="span"
                                                >
                                                    {t(
                                                        "onboarding.explore_premium_features"
                                                    )}
                                                </Text>
                                            </InlineStack>
                                            <Button
                                                size="slim"
                                                variant="secondary"
                                                onClick={handleUpgradePlan}
                                            >
                                                {t("onboarding.upgrade_plan")}
                                            </Button>
                                        </InlineStack>
                                    </BlockStack>
                                </BlockStack>

                                {/* Help Text */}
                                <div
                                    style={{
                                        marginTop: "20px",
                                    }}
                                >
                                    <Box>
                                        <InlineStack align="center">
                                            <Button
                                                variant="primary"
                                                onClick={
                                                    handleContinueToDashboard
                                                }
                                            >
                                                {t(
                                                    "onboarding.continue_to_dashboard"
                                                )}
                                            </Button>
                                        </InlineStack>
                                    </Box>
                                </div>
                                <Box>
                                    <InlineStack align="center">
                                        <Text
                                            variant="bodySm"
                                            as="p"
                                            tone="subdued"
                                        >Need help ?{" "}
                                            <Button
                                                onClick={() =>
                                                    window.$crisp.push([
                                                        "do",
                                                        "chat:open",
                                                    ])
                                                }
                                                variant="plain"
                                            >
                                                {/* {t(
                                                    "onboarding.need_help_chat_with_us"
                                                )} */}
                                                Chat with us
                                            </Button>
                                        </Text>
                                    </InlineStack>
                                </Box>
                            </BlockStack>
                        </Modal.Section>
                    </Modal>
                </Frame>
            </div>
        </div>
    );
};

export default Congratulations;
