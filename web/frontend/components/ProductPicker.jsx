import {
    Button,
    InlineStack,
    Icon,
    BlockStack,
    Text,
    Thumbnail,
    Link
} from "@shopify/polaris"
import { useState } from "react"
import { useAppBridge } from "@shopify/app-bridge-react"
import { useTranslation } from "react-i18next"

import {
  ResetIcon
} from '@shopify/polaris-icons';

const ProductPicker = (props) => {
    /**
     * Schema : { title: string, images: [{ originalSrc: string }] }
     */
    const product = props.product
    const onProductSelection = props.onProductSelection
    const onReset = props.onReset
    const isEdit = props.isEdit;
    const shopify = useAppBridge();
    const { t } = useTranslation();

    const toggleProductPicker = async () => {
        try {
            const selected = await shopify.resourcePicker({
                type: 'product',
                action: 'select',
                multiple: false,
                filter: { variants: false }
            });

            if (selected && selected.length > 0) {
                onProductSelection(selected[0]);
            }
        } catch (error) {
            console.error('Resource picker error:', error);
        }
    };

    const selectorMarkup = !product && (
        <>
            <BlockStack inlineAlign="center">
                <Button
                    primary
                    onClick={toggleProductPicker}
                >
                    {t("digtal_lottery.select_product") || "Select Product"}
                </Button>
            </BlockStack>
        </>
    )

    const productMarkup = product && (
        <ProductItem 
            {...product} 
            onReset={onReset} 
            isEdit={isEdit}
            onEdit={toggleProductPicker}
        />
    )

    return (
        <>
            {selectorMarkup}
            {productMarkup}
        </>
    )
}

const ProductItem = (props) => {
    const image = props.images.find(image => image.originalSrc != null)
    const { t } = useTranslation();

    return (
        <InlineStack gap="800" blockAlign="center" align="space-between">
            <InlineStack gap="400" blockAlign="center">
                <Thumbnail source={image?.originalSrc} />

                <BlockStack gap="200">
                    <Text variant="bodyMd" color='subdued' as="p">
                        {t("digtal_lottery.product") || "Product"}
                    </Text>

                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                        {props.title}
                    </Text>
                </BlockStack>
            </InlineStack>

            {
                props.isEdit === false && (
                    <div onClick={props.onEdit} style={{ cursor: 'pointer' }}>
                        <Link>
                            <Text variant="bodyLg" as="p">
                                {t("digtal_lottery.edit") || "Edit"}
                            </Text>
                        </Link>
                    </div>
                )
            }

        </InlineStack>
    )
}

export default ProductPicker
