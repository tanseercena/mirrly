import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    BlockStack,
    InlineStack,
    Text,
    Button,
    Icon,
    TextField,
    Badge,
    Thumbnail,
} from '@shopify/polaris';
import {
    XIcon,
    AlertTriangleIcon,
    InfoIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    UploadIcon,
    CameraIcon,
    ImageIcon,
    ArrowUpIcon,
} from '@shopify/polaris-icons';
import SessionFunnelDateFilter from './SessionFunnelDateFilter';

/* ============================================
    TOGGLE SWITCH (reused from dashboard build)
    ============================================ */
const Toggle = ({ checked, onChange, disabled = false }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
            width: '44px',
            height: '24px',
            borderRadius: '999px',
            border: 'none',
            padding: '2px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: checked ? '#0F6E5C' : '#E3E5E7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: checked ? 'flex-end' : 'flex-start',
            transition: 'background 0.15s ease',
            flexShrink: 0,
        }}
    >
        <span
            style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
        />
    </button>
);

/* ============================================
    REFERENCE IMAGE PICKER
    Grid of selectable image cards + "Upload new"
    ============================================ */
const ReferenceImagePicker = ({ images, selectedId, onSelect, onUploadNew, t }) => (
    <InlineStack gap="300" wrap={false}>
        {images.map((image) => {
            const isSelected = image.id === selectedId;
            return (
                <div
                    key={image.id}
                    onClick={() => onSelect(image.id)}
                    style={{
                        position: 'relative',
                        width: '125px',
                        height: '155px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #0F6E5C' : '1px solid #E1E3E5',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isSelected && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: '#0F6E5C',
                                textAlign: 'center',
                                padding: '2px 0',
                            }}
                        >
                            <Text variant="bodySm" as="span" tone="text-inverse" fontWeight="semibold">
                                {t('product_drawer.default')}
                            </Text>
                        </div>
                    )}
                </div>
            );
        })}

        {/* Upload new card */}
        <div
            onClick={onUploadNew}
            style={{
                width: '125px',
                height: '155px',
                borderRadius: '8px',
                border: '1px dashed #C9CCCF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                flexShrink: 0,
            }}
        >
            <Icon source={UploadIcon} tone="subdued" />
            <Text variant="bodySm" as="span" fontWeight="semibold" tone="subdued">
                {t('product_drawer.upload_new')}
            </Text>
        </div>
    </InlineStack>
);

/* ============================================
    VARIANT IMAGE ROW
    ============================================ */
const VariantImageRow = ({ variant, isLast, onExpand, t }) => (
    <Box
        paddingBlock="300"
        paddingInline="400"
        borderBlockEndWidth={isLast ? '0' : '025'}
        borderColor="border-subdued"
    >
        <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="300" blockAlign="center" wrap={false}>
                <Text variant="bodyMd" as="span" fontWeight="medium">
                    {variant.name}
                </Text>
            </InlineStack>

            <InlineStack gap="300" blockAlign="center" wrap={false}>
                {variant.image ? (
                    <Thumbnail source={variant.image} alt={variant.name} size="small" />
                ) : (
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            border: '1px dashed #C9CCCF',
                        }}
                    />
                )}

                {variant.status === 'matched' ? (
                    <Badge tone="success">{t('product_drawer.auto_matched')}</Badge>
                ) : (
                    <InlineStack gap="100" blockAlign="center">
                        <Icon source={AlertTriangleIcon} tone="warning" />
                        <Text variant="bodySm" as="span" tone="caution">
                            {t('product_drawer.no_image_needs_upload')}
                        </Text>
                    </InlineStack>
                )}

                <Button
                    icon={ChevronRightIcon}
                    variant="tertiary"
                    accessibilityLabel={t('product_drawer.edit_variant_image', { name: variant.name })}
                    onClick={() => onExpand(variant)}
                />
            </InlineStack>
        </InlineStack>
    </Box>
);

/* ============================================
    STAT (Product performance column)
    ============================================ */
const PerformanceStat = ({ label, value, change, showDivider, t }) => (
    <Box
        paddingInlineEnd={showDivider ? "500" : "0"}
        borderInlineEndWidth={showDivider ? "025" : "0"}
        borderColor="border-subdued"
    >
        <BlockStack gap="200">
            <Text variant="bodyMd" as="p" tone="subdued">
                {label}
            </Text>
            <Text variant="headingLg" as="p">
                {value}
            </Text>
            <InlineStack gap="100" blockAlign="center" align="start">
                <Text fontWeight="semibold"> <Icon source={ArrowUpIcon} tone="success" /> </Text>
                <Text variant="bodySm" as="span" tone="success" fontWeight="medium">
                    {change}
                </Text>
            </InlineStack>
            <Text variant="bodySm" as="p" tone="subdued">
                {t('product_drawer.vs_previous_30_days')}
            </Text>
        </BlockStack>
    </Box>
);

/* ============================================
    VARIANT DRAWER (STUB)
    Slides in above the product drawer.
    Content to be built out later.
    ============================================ */
const VariantDrawer = ({ variant, onClose, t }) => {
    if (!variant) return null;

    return (
        <>
            {/* Extra backdrop layer above the product drawer */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.25)',
                    zIndex: 60,
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100vh',
                    width: '420px',
                    background: '#FFFFFF',
                    boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
                    zIndex: 61,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box padding="400" borderBlockEndWidth="025" borderColor="border-subdued">
                    <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="h3" fontWeight={600}>
                            {variant.name}
                        </Text>
                        <Button
                            icon={XIcon}
                            variant="tertiary"
                            accessibilityLabel={t('product_drawer.close')}
                            onClick={onClose}
                        />
                    </InlineStack>
                </Box>
                <Box padding="400">
                    <Text variant="bodyMd" as="p" tone="subdued">
                        {t('product_drawer.content_coming_soon')}
                    </Text>
                </Box>
            </div>
        </>
    );
};

/* ============================================
    PRODUCT SETTINGS DRAWER
    ============================================ */
const ProductSettingsDrawer = ({ product, open, onClose }) => {
    const { t } = useTranslation();
    const [tryOnEnabled, setTryOnEnabled] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState('1');
    const [styleHint, setStyleHint] = useState('');
    const [expandedVariant, setExpandedVariant] = useState(null);

    const handleStyleHintChange = useCallback((value) => {
        if (value.length <= 120) setStyleHint(value);
    }, []);

    if (!open || !product) return null;

    const referenceImages = [
        { id: '1', src: product.image, alt: t('product_drawer.front_view') },
        { id: '2', src: product.image, alt: t('product_drawer.alternate_view') },
        { id: '3', src: product.image, alt: t('product_drawer.lifestyle_shot') },
    ];

    const variants = product.variants ?? [
        { name: 'Terracotta', status: 'matched', image: ImageIcon },
        { name: 'Sage green', status: 'matched', image: ImageIcon },
        { name: 'Ivory', status: 'missing', image: null },
    ];


    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    zIndex: 50,
                }}
            />

            {/* Drawer panel */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100vh',
                    width: '620px',
                    maxWidth: '100vw',
                    background: '#FFFFFF',
                    boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
                    zIndex: 51,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Scrollable content */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <BlockStack gap="0">
                        {/* Header */}
                        <Box padding="400">
                            <InlineStack align="space-between" blockAlign="start">
                                <InlineStack gap="300" blockAlign="center" wrap={false}>
                                    <Thumbnail source={product.image ?? ImageIcon} alt={product.name} size="medium" />
                                    <BlockStack gap="0">
                                        <Text variant="headingMd" as="h2" fontWeight={600}>
                                            {product.name}
                                        </Text>
                                        <Text variant="bodyMd" as="p" tone="subdued">
                                            {product.collection} &middot; {variants.length} {t('product_drawer.variants')}
                                        </Text>
                                    </BlockStack>
                                </InlineStack>
                                <Button
                                    icon={XIcon}
                                    variant="tertiary"
                                    accessibilityLabel={t('product_drawer.close')}
                                    onClick={onClose}
                                />
                            </InlineStack>
                        </Box>

                        <Box paddingInline="400">
                            <BlockStack gap="600">
                                {/* Try-on enabled */}
                                <Box
                                    padding="400"
                                    borderWidth="025"
                                    borderColor="border-subdued"
                                    borderRadius="200"
                                >
                                    <InlineStack align="space-between" blockAlign="center">
                                        <BlockStack gap="050">
                                            <Text variant="bodyMd" as="p" fontWeight="semibold">
                                                {t('product_drawer.try_on_enabled')}
                                            </Text>
                                            <Text variant="bodySm" as="p" tone="subdued">
                                                {t('product_drawer.try_on_enabled_description')}
                                            </Text>
                                        </BlockStack>
                                        <Toggle checked={tryOnEnabled} onChange={setTryOnEnabled} />
                                    </InlineStack>
                                </Box>

                                {/* Reference image */}
                                <BlockStack gap="300" >
                                    <BlockStack gap="050">
                                        <Text variant="headingSm" as="h3" fontWeight={600}>
                                            {t('product_drawer.reference_image')}
                                        </Text>
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {t('product_drawer.reference_image_description')}
                                        </Text>
                                    </BlockStack>

                                    <ReferenceImagePicker
                                        images={referenceImages}
                                        selectedId={selectedImageId}
                                        onSelect={setSelectedImageId}
                                        onUploadNew={() => { }}
                                        t={t}
                                    />

                                    <InlineStack gap="100" blockAlign="start" wrap={false}>
                                        <Icon source={InfoIcon} tone="subdued" />
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {t('product_drawer.reference_image_info')}
                                        </Text>
                                    </InlineStack>
                                </BlockStack>

                                {/* Style hint */}
                                <BlockStack gap="300">
                                    <BlockStack gap="050">
                                        <InlineStack gap="100">
                                            <Text variant="headingSm" as="h3" fontWeight={600}>
                                                {t('product_drawer.style_hint')}
                                            </Text>
                                            <Text variant="bodySm" as="span" tone="subdued">
                                                {t('product_drawer.optional')}
                                            </Text>
                                        </InlineStack>
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {t('product_drawer.style_hint_description')}
                                        </Text>
                                    </BlockStack>
                                    <TextField
                                        placeholder={t('product_drawer.style_hint_placeholder')}
                                        value={styleHint}
                                        onChange={handleStyleHintChange}
                                        autoComplete="off"
                                        label={t('product_drawer.style_hint')}
                                        labelHidden
                                        showCharacterCount
                                        maxLength={120}
                                    />
                                </BlockStack>

                                {/* Variant images */}
                                <BlockStack gap="300">
                                    <BlockStack gap="050">
                                        <Text variant="headingSm" as="h3" fontWeight={600}>
                                            {t('product_drawer.variant_images')}
                                        </Text>
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {t('product_drawer.variant_images_description')}
                                        </Text>
                                    </BlockStack>

                                    <Box borderWidth="025" borderColor="border-subdued" borderRadius="200">
                                        <Box
                                            paddingBlock="200"
                                            paddingInline="400"
                                            background="bg-surface-secondary"
                                            borderBlockEndWidth="025"
                                            borderColor="border-subdued"
                                        >
                                            <InlineStack align="space-between">
                                                <Text variant="bodySm" as="span" fontWeight="semibold" tone="subdued">
                                                    {t('product_drawer.variant')}
                                                </Text>
                                                <Text variant="bodySm" as="span" fontWeight="semibold" tone="subdued">
                                                    {t('product_drawer.image_status')}
                                                </Text>
                                            </InlineStack>
                                        </Box>
                                        {variants.map((variant, index) => (
                                            <VariantImageRow
                                                key={variant.name}
                                                variant={variant}
                                                isLast={index === variants.length - 1}
                                                onExpand={setExpandedVariant}
                                                t={t}
                                            />
                                        ))}
                                    </Box>

                                    <Box background="bg-fill-info-secondary" padding="300" borderRadius="200">
                                        <InlineStack gap="200" blockAlign="start" wrap={false}>
                                            <Icon source={InfoIcon} tone="info" />
                                            <Text variant="bodySm" as="p">
                                                {t('product_drawer.variant_image_warning')}{' '}
                                                <Text variant="bodySm" as="span" tone="info" fontWeight="medium">
                                                    {t('product_drawer.upload_image_best_results')}
                                                </Text>
                                            </Text>
                                        </InlineStack>
                                    </Box>
                                </BlockStack>

                                {/* Product performance */}
                                <BlockStack gap="400">
                                    <InlineStack align="space-between" blockAlign="center">
                                        <Text variant="headingSm" as="h3" fontWeight={600}>
                                            {t('product_drawer.product_performance')}
                                        </Text>
                                        <SessionFunnelDateFilter />
                                    </InlineStack>

                                    <InlineStack align="space-evenly" gap="600" wrap={false}>
                                        <PerformanceStat label={t('product_drawer.sessions')} value="28" change="12%" showDivider={true} t={t} />
                                        <PerformanceStat label={t('product_drawer.completion_rate')} value="86%" change="8%" showDivider={true} t={t} />
                                        <PerformanceStat label={t('product_drawer.avg_session_length')} value="26s" change="6%" showDivider={false} t={t} />
                                    </InlineStack>
                                </BlockStack>

                                {/* Test this product */}
                                <Box borderColor="border" borderWidth="025" padding="400" borderRadius="200">
                                    <InlineStack align="space-between" blockAlign="center" wrap={false}>
                                        <InlineStack gap="300" blockAlign="center" wrap={false}>
                                            <Box background="bg-fill-success-secondary" borderRadius="200" padding="200">
                                                <Icon source={CameraIcon} tone="success" />
                                            </Box>
                                            <BlockStack gap="100" >
                                                <Text variant="bodyMd" as="p" fontWeight="semibold">
                                                    {t('product_drawer.test_this_product')}
                                                </Text>
                                                <Text variant="bodySm" as="p" tone="subdued" >
                                                    {t('product_drawer.test_this_product_description')}
                                                </Text>
                                            </BlockStack>
                                        </InlineStack>

                                        <div style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                                            <Button>{t('product_drawer.test_now')}</Button>
                                        </div>

                                    </InlineStack>
                                </Box>
                            </BlockStack>
                        </Box>

                        <Box padding="400" />
                    </BlockStack>
                </div>

                {/* Sticky footer */}
                <Box
                    padding="400"
                    borderBlockStartWidth="025"
                    borderColor="border-subdued"
                >
                    <BlockStack gap="200">
                        <InlineStack gap="200">
                            <div style={{ flex: 1 }}>
                                <Button fullWidth onClick={onClose} size="large">
                                    {t('product_drawer.cancel')}
                                </Button>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Button fullWidth  size="large" variant="primary"  onClick={onClose}>
                                    {t('product_drawer.save_changes')}
                                </Button>
                            </div>
                        </InlineStack>
                        <Text variant="bodySm" as="p" tone="subdued" alignment="center">
                            {t('product_drawer.changes_saved_product_only')}
                        </Text>
                    </BlockStack>
                </Box>
            </div>

            {/* Variant-specific drawer stub */}
            <VariantDrawer variant={expandedVariant} onClose={() => setExpandedVariant(null)} />
        </>
    );
};

export default ProductSettingsDrawer;