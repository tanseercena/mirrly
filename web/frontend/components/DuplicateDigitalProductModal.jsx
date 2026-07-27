import {
    Modal,
    Text,
    BlockStack,
    Button,
    InlineStack,
    Thumbnail,
    InlineGrid,
    Icon
} from "@shopify/polaris"
import { ResetIcon } from "@shopify/polaris-icons";
import { useCallback, useState} from "react"
import { useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";

const DuplicateDigitalProductModal = (props) => {
    const shopify = useAppBridge();
    const { t } = useTranslation();

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isDuplicating, setIsDuplicating] = useState(false)

    const canDuplicate = !isDuplicating && selectedProduct

    const handleReset = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    const toggleProductPicker = useCallback(async () => {
        try {
            const selected = await shopify.resourcePicker({
                type: 'product',
                action: 'select',
                multiple: false,
                selectionIds: selectedProduct ? [selectedProduct.id] : []
            });

            if (selected && selected.length > 0) {
                setSelectedProduct(selected[0]);
            }
        } catch (error) {
            console.error('Resource picker error:', error);
        }
    }, [shopify, selectedProduct]);

    const handleDuplicate = useCallback(async () => {
        if (!selectedProduct) {
            shopify.toast.show(t("digtal_product_listing.please_select_a_product"), { isError: true, duration: 9999999 })
            return
        }

        setIsDuplicating(true)

        try {
            const response = await fetch('/api/duplicate-digital-product/' + props.digitalProduct.id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product: selectedProduct
                }),
            })

            const data = await response.json()
            if (response.ok) {
                if (data.error) {
                    if (data.type === 'exists') {
                        shopify.toast.show(t("digtal_product_listing.this_product_already_exists"), { isError: true, duration: 9999999 })
                    } else {
                        shopify.toast.show(data.message || t("digtal_product_listing.something_went_wrong"), { isError: true, duration: 9999999 })
                    }
                } else {
                    shopify.toast.show(t("digtal_product_listing.digital_product_duplicated_successfully"))
                    props.onClose()
                }
            } else {
                shopify.toast.show(data.message || t("digtal_product_listing.something_went_wrong"), { isError: true, duration: 9999999 })
            }
        } catch (error) {
            console.error('Error duplicating digital product:', error)
            shopify.toast.show(t("digtal_product_listing.something_went_wrong"), { isError: true, duration: 9999999 })
        }

        setIsDuplicating(false)
    }, [selectedProduct, props.digitalProduct.id, shopify, t, props])

    return (
        <>
            <Modal
                open={props.isActive}
                onClose={props.onClose}
                title={isDuplicating ? t("digtal_product_listing.duplicating") : t("digtal_product_listing.duplicate_digital_product")}
                loading={isDuplicating}
                primaryAction={{
                    content: t("digtal_product_listing.create_product"),
                    onAction: handleDuplicate,
                    disabled: !canDuplicate
                }}
                secondaryActions={[
                    {
                        content: t("digtal_product_listing.cancel"),
                        onAction: props.onClose,
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack gap="400">
                        <Text variant="bodyMd" as="p">
                            {t("digtal_product_listing.choose_product_variant_text")}
                        </Text>

                        {!selectedProduct ? (
                            <BlockStack inlineAlign="center">
                                <Button
                                    primary
                                    onClick={toggleProductPicker}
                                >
                                    {t("digtal_product_listing.select_product")}
                                </Button>
                            </BlockStack>
                        ) : (
                            <InlineGrid columns="1fr auto">
                                <InlineStack gap="200" blockAlign="center">
                                    <Thumbnail
                                        source={
                                            selectedProduct.images?.[0]?.originalSrc ??
                                            "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                                        }
                                        alt={selectedProduct.title}
                                        size="large"
                                    />
                                    <div>
                                        <Text variant="headingMd" as="h6" fontWeight="bold">
                                            {selectedProduct.title}
                                        </Text>
                                        {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                                            <>
                                                {selectedProduct.variants.length > 1 ? (
                                                    <Text variant="bodySm" as="p" tone="subdued">
                                                        All Variants ({selectedProduct.variants.length})
                                                    </Text>
                                                ) : (
                                                    selectedProduct.variants.map((variant) => (
                                                        <Text key={variant.id} variant="bodySm" as="p" tone="subdued">
                                                            {variant.title}
                                                        </Text>
                                                    ))
                                                )}
                                            </>
                                        )}
                                    </div>
                                </InlineStack>
                                <span onClick={handleReset} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}>
                                    <Icon source={ResetIcon} />
                                </span>
                            </InlineGrid>
                        )}
                    </BlockStack>
                </Modal.Section>
            </Modal>
        </>
    )
}

export default DuplicateDigitalProductModal
