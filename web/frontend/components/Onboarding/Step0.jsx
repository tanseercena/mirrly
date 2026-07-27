import {
    Button,
    Modal,
    LegacyStack,
    DropZone,
    Checkbox,
    BlockStack,
    Frame,
    Box,
    Text,
} from "@shopify/polaris";
import { Icon } from "@shopify/polaris";
import { useTranslation } from "react-i18next";

import { FileIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
const Step0 = ({ handleNextAction }) => {
    const [active, setActive] = useState(true);
    const [checked, setChecked] = useState(true);
    const { t } = useTranslation();

    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const handleCheckbox = useCallback((value) => setChecked(value), []);

    //   const activator = <Button onClick={toggleActive}>Open</Button>;
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

            <Frame>
                <Modal
                    // size="large"
                    //   activator={activator}
                    open={active}
                    onClose={() => {}}
                    title={t("onboarding.onboarding_welcome")}
                    instant
                    primaryAction={{
                        content: t("onboarding.lets_get_started"),
                        onAction: handleNextAction,
                    }}
                    secondaryActions={[
                        {
                            content: t("onboarding.chat_with_us"),
                            onAction: () =>
                                window.$crisp.push(["do", "chat:open"]),
                        },
                    ]}
                >
                    <Modal.Section>
                        <BlockStack inlineAlign="center" gap={300}>
                            <Box>
                                <Text
                                    variant="headingXl"
                                    as="h1"
                                    alignment="center"
                                >
                                    {t("onboarding.welcome_to_digitally")}
                                </Text>
                            </Box>

                            <Box>
                                <img
                                    style={{
                                        width: "128px",
                                    }}
                                    src="./images/logo_digitally.png"
                                    alt=""
                                />
                                <div>
                                    {/* <Icon
  source={FileIcon}
  tone="base"
/> */}
                                </div>
                            </Box>

                            <Box>
                                {/* <div
                                        style={{
                                            width: "450px",
                                        }}
                                    > */}
                                <Text
                                    variant="bodyLg"
                                    as="p"
                                    alignment="center"
                                >
                                    {t(
                                        "onboarding.welcome_to_digitally_description"
                                    )}
                                </Text>
                                {/* </div> */}
                            </Box>
                        </BlockStack>
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    );
};

export default Step0;
