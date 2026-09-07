import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
    Box,
    BlockStack,
    InlineStack,
    Text,
    Button,
    Icon,
    TextField,
    Select,
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
    ArrowDownIcon,
    ArrowRightIcon,
} from '@shopify/polaris-icons';
import SessionFunnelDateFilter from './SessionFunnelDateFilter';

/* ============================================
    PERFORMANCE HELPERS (mirror the Sessions page)
    ============================================ */
const defaultRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    return { start, end };
};

const toISODate = (d) =>
    d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

const formatCount = (n) => Number(n || 0).toLocaleString();

const pctChange = (cur, prev) => {
    if (prev > 0) return ((cur - prev) / prev) * 100;
    return cur > 0 ? 100 : 0;
};

const changeLabel = (delta) => parseFloat(Math.abs(delta).toFixed(1)).toLocaleString() + '%';

const directionOf = (delta) => (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat');

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
const PerformanceStat = ({ label, value, change, direction = 'up', showDivider, t }) => {
    const changeTone = direction === 'up' ? 'success' : direction === 'down' ? 'critical' : 'subdued';
    const ChangeIcon = direction === 'up' ? ArrowUpIcon : direction === 'down' ? ArrowDownIcon : ArrowRightIcon;

    return (
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
                    <Text fontWeight="semibold"> <Icon source={ChangeIcon} tone={changeTone} /> </Text>
                    <Text variant="bodySm" as="span" tone={changeTone} fontWeight="medium">
                        {change}
                    </Text>
                </InlineStack>
                <Text variant="bodySm" as="p" tone="subdued">
                    {t('product_drawer.vs_previous_30_days')}
                </Text>
            </BlockStack>
        </Box>
    );
};

/* ============================================
    VARIANT DRAWER
    Upload and manage images for one variant.
    ============================================ */
const dedupeByUrl = (entries) => {
    const seen = new Set();
    return entries.filter((entry) => {
        if (!entry?.url || seen.has(entry.url)) return false;
        seen.add(entry.url);
        return true;
    });
};

const VariantDrawer = ({ variant, product, onClose, onUploaded }) => {
    const { t } = useTranslation();
    const shopify = useAppBridge();
    const [pending, setPending] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Resolve the live variant from the product (refreshes after uploads)
    const currentVariant = variant && product
        ? ((product.variants ?? []).find((v) => String(v.id) === String(variant.id)) ?? variant)
        : null;

    if (!currentVariant) return null;

    const existingImages = (product?.variant_images ?? [])
        .filter((entry) => entry.variant_id && Number(entry.variant_id) === Number(currentVariant.id));

    const displayImages = dedupeByUrl([
        ...(currentVariant.image ? [{ url: currentVariant.image, variant_title: currentVariant.name }] : []),
        ...existingImages,
    ]);

    const handleFilesSelected = (event) => {
        const files = Array.from(event.target.files ?? []).filter((f) => f.type.startsWith('image/'));
        if (files.length === 0) return;

        setPending((prev) => [
            ...prev,
            ...files.map((file, index) => ({
                id: `new-${Date.now()}-${index}`,
                file,
                previewUrl: URL.createObjectURL(file),
            })),
        ]);
        event.target.value = '';
    };

    const removePending = (id) => {
        setPending((prev) => {
            const target = prev.find((p) => p.id === id);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((p) => p.id !== id);
        });
    };

    const handleUpload = async () => {
        if (pending.length === 0) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('product_id', product.id);
            formData.append('variant_id', currentVariant.id);
            pending.forEach((p) => formData.append('variant_images[]', p.file));

            const response = await fetch('/api/products/variant-images', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message ?? 'Upload failed');
            }

            pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
            setPending([]);
            onUploaded?.(data.product);
            shopify.toast.show(t('product_drawer.images_uploaded'));
        } catch (error) {
            console.error('Failed to upload variant images:', error);
            shopify.toast.show(t('product_drawer.save_failed'), { isError: true , duration: 999999});
        } finally {
            setIsUploading(false);
        }
    };

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
                    maxWidth: '100vw',
                    background: '#FFFFFF',
                    boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
                    zIndex: 61,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box padding="400" borderBlockEndWidth="025" borderColor="border-subdued">
                    <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="0">
                            <Text variant="headingMd" as="h3" fontWeight={600}>
                                {currentVariant.name}
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                                {t('product_drawer.variant_images')}
                            </Text>
                        </BlockStack>
                        <Button
                            icon={XIcon}
                            variant="tertiary"
                            accessibilityLabel={t('product_drawer.close')}
                            onClick={onClose}
                        />
                    </InlineStack>
                </Box>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <Box padding="400">
                        <BlockStack gap="400">
                            <BlockStack gap="200">
                                <Text variant="bodySm" as="span" fontWeight="semibold" tone="subdued">
                                    {t('product_drawer.current_images')}
                                </Text>
                                {displayImages.length > 0 ? (
                                    <InlineStack gap="200" wrap>
                                        {displayImages.map((image, index) => (
                                            <img
                                                key={`img-${index}`}
                                                src={image.url}
                                                alt={image.variant_title ?? currentVariant.name}
                                                style={{
                                                    width: '88px',
                                                    height: '110px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '1px solid #E1E3E5',
                                                }}
                                            />
                                        ))}
                                    </InlineStack>
                                ) : (
                                    <Box borderWidth="025" borderColor="border-subdued" borderRadius="200" padding="400">
                                        <Text variant="bodySm" as="p" tone="subdued" alignment="center">
                                            {t('product_drawer.no_image_needs_upload')}
                                        </Text>
                                    </Box>
                                )}
                            </BlockStack>

                            {pending.length > 0 && (
                                <BlockStack gap="200">
                                    <Text variant="bodySm" as="span" fontWeight="semibold" tone="subdued">
                                        {t('product_drawer.pending_uploads')}
                                    </Text>
                                    <InlineStack gap="200" wrap>
                                        {pending.map((p) => (
                                            <div key={p.id} style={{ position: 'relative' }}>
                                                <img
                                                    src={p.previewUrl}
                                                    alt={t('product_drawer.upload_new')}
                                                    style={{
                                                        width: '88px',
                                                        height: '110px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '1px dashed #C9CCCF',
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePending(p.id)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-6px',
                                                        right: '-6px',
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '999px',
                                                        border: '1px solid #E1E3E5',
                                                        background: '#FFFFFF',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {'×'}
                                                </button>
                                            </div>
                                        ))}
                                    </InlineStack>
                                </BlockStack>
                            )}
                        </BlockStack>
                    </Box>
                </div>

                <Box padding="400" borderBlockStartWidth="025" borderColor="border-subdued">
                    <BlockStack gap="200">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleFilesSelected}
                        />
                        <InlineStack gap="200">
                            <Button icon={UploadIcon} onClick={() => fileInputRef.current?.click()}>
                                {t('product_drawer.upload_new')}
                            </Button>
                            {pending.length > 0 && (
                                <Button variant="primary" loading={isUploading} onClick={handleUpload}>
                                    {t('product_drawer.upload_images', { count: pending.length })}
                                </Button>
                            )}
                        </InlineStack>
                        <Text variant="bodySm" as="p" tone="subdued" alignment="center">
                            {t('product_drawer.changes_saved_product_only')}
                        </Text>
                    </BlockStack>
                </Box>
            </div>
        </>
    );
};

/* ============================================
    PRODUCT SETTINGS DRAWER
    ============================================ */
const ProductSettingsDrawer = ({ product, open, onClose, onSaved }) => {
    const { t } = useTranslation();
    const shopify = useAppBridge();
    const [tryOnEnabled, setTryOnEnabled] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState('1');
    const [styleHint, setStyleHint] = useState('');
    const [expandedVariant, setExpandedVariant] = useState(null);
    const [pendingImages, setPendingImages] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [performanceRange, setPerformanceRange] = useState(defaultRange);
    const [performance, setPerformance] = useState(null);
    const fileInputRef = useRef(null);

    // Re-initialize the editable state whenever a different product opens
    useEffect(() => {
        if (product) {
            setTryOnEnabled(!!product.tryOn);
            setStyleHint(product.style_hint ?? '');
            setSelectedImageId('1');
            setExpandedVariant(null);
            setPendingImages([]);
            setPerformance(null);
        }
    }, [product]);

    // Per-product session performance for the selected range
    useEffect(() => {
        if (!product) return;

        let cancelled = false;

        const load = async () => {
            try {
                const params = new URLSearchParams({
                    product_id: String(product.id),
                    from: toISODate(performanceRange.start),
                    to: toISODate(performanceRange.end),
                });
                const response = await fetch('/api/sessions/product-stats?' + params.toString());
                const payload = response.ok ? await response.json() : null;
                if (!cancelled && payload && payload.data) {
                    setPerformance(payload.data);
                }
            } catch (error) {
                console.error('Failed loading product performance:', error);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [product, performanceRange]);

    const handleStyleHintChange = useCallback((value) => {
        if (value.length <= 120) setStyleHint(value);
    }, []);

    if (!open || !product) return null;

    // Variant options for tagging reference images
    const variantOptions = [
        { label: t('product_drawer.default'), value: '' },
        ...(product.variants ?? [])
            .filter((v) => v.id)
            .map((v) => ({ label: v.name, value: String(v.id) })),
    ];

    // Reference image options: synced Shopify images + pending uploads,
    // each entry keyed {variant_id, variant_title, url}
    const referenceAltLabels = [
        t('product_drawer.front_view'),
        t('product_drawer.alternate_view'),
        t('product_drawer.lifestyle_shot'),
    ];
    const referenceImages = [
        ...(product.reference_images ?? []).slice(0, 10).map((entry, index) => ({
            id: `existing-${index}`,
            src: entry.url,
            alt: entry.variant_title ?? referenceAltLabels[index] ?? t('product_drawer.alternate_view'),
        })),
        ...pendingImages.map((p) => ({
            id: p.id,
            src: p.previewUrl,
            alt: t('product_drawer.upload_new'),
        })),
    ];

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFilesSelected = (event) => {
        const files = Array.from(event.target.files ?? []).filter((f) => f.type.startsWith('image/'));
        if (files.length === 0) return;

        const defaultVariantId = (product.variants ?? []).find((v) => v.id)?.id;
        setPendingImages((prev) => [
            ...prev,
            ...files.map((file, index) => ({
                id: `new-${Date.now()}-${index}`,
                file,
                previewUrl: URL.createObjectURL(file),
                variantId: defaultVariantId ? String(defaultVariantId) : '',
            })),
        ]);
        event.target.value = '';
    };

    const handlePendingVariantChange = (pendingId, value) => {
        setPendingImages((prev) =>
            prev.map((p) => (p.id === pendingId ? { ...p, variantId: value } : p))
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('product_id', product.id);
            formData.append('style_hint', styleHint);
            formData.append('try_on', tryOnEnabled ? '1' : '0');
            pendingImages.forEach((p) => {
                formData.append('reference_images[]', p.file);
                formData.append('variant_ids[]', p.variantId ?? '');
            });

            const response = await fetch('/api/products/settings', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message ?? 'Save failed');
            }

            pendingImages.forEach((p) => URL.revokeObjectURL(p.previewUrl));
            setPendingImages([]);
            onSaved?.(data.product);
            shopify.toast.show(t('product_drawer.changes_saved'));
        } catch (error) {
            console.error('Failed to save product settings:', error);
            shopify.toast.show(t('product_drawer.save_failed'), { isError: true , duration: 999999 });
        } finally {
            setIsSaving(false);
        }
    };

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
                {/* Hidden input for reference image uploads */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFilesSelected}
                />
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
                                            {product.collection ?? '—'} &middot; {variants.length} {t('product_drawer.variants')}
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
                                        onUploadNew={handleUploadClick}
                                        t={t}
                                    />

                                    {/* Tag each pending upload with its variant */}
                                    {pendingImages.length > 0 && (
                                        <BlockStack gap="150">
                                            {pendingImages.map((p) => (
                                                <InlineStack key={p.id} align="space-between" blockAlign="center" gap="300">
                                                    <InlineStack gap="200" blockAlign="center" wrap={false}>
                                                        <Thumbnail source={p.previewUrl} alt={t('product_drawer.upload_new')} size="small" />
                                                        <Text variant="bodySm" as="span" tone="subdued">
                                                            {t('product_drawer.new_upload')}
                                                        </Text>
                                                    </InlineStack>
                                                    <div style={{ minWidth: '180px' }}>
                                                        <Select
                                                            label={t('product_drawer.variant')}
                                                            labelHidden
                                                            options={variantOptions}
                                                            value={p.variantId ?? ''}
                                                            onChange={(value) => handlePendingVariantChange(p.id, value)}
                                                        />
                                                    </div>
                                                </InlineStack>
                                            ))}
                                        </BlockStack>
                                    )}

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
                                        {variants.map((variant, index) => {
                                            const uploads = (product.variant_images ?? []).filter(
                                                (entry) => entry.variant_id && Number(entry.variant_id) === Number(variant.id)
                                            );
                                            const rowVariant = {
                                                ...variant,
                                                image: variant.image ?? uploads[0]?.url ?? null,
                                                status: (variant.image || uploads.length > 0) ? 'matched' : 'missing',
                                            };
                                            return (
                                                <VariantImageRow
                                                    key={variant.id ?? variant.name}
                                                    variant={rowVariant}
                                                    isLast={index === variants.length - 1}
                                                    onExpand={setExpandedVariant}
                                                    t={t}
                                                />
                                            );
                                        })}
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
                                        <SessionFunnelDateFilter onChange={setPerformanceRange} />
                                    </InlineStack>

                                    <InlineStack align="space-evenly" gap="600" wrap={false}>
                                        <PerformanceStat
                                            label={t('product_drawer.sessions')}
                                            value={performance ? formatCount(performance.sessions.current) : '—'}
                                            change={performance
                                                ? changeLabel(pctChange(performance.sessions.current, performance.sessions.previous))
                                                : '—'}
                                            direction={performance
                                                ? directionOf(pctChange(performance.sessions.current, performance.sessions.previous))
                                                : 'flat'}
                                            showDivider={true}
                                            t={t}
                                        />
                                        <PerformanceStat
                                            label={t('product_drawer.completion_rate')}
                                            value={performance ? performance.completion_rate.current.toFixed(1) + '%' : '—'}
                                            change={performance
                                                ? changeLabel(pctChange(performance.completion_rate.current, performance.completion_rate.previous))
                                                : '—'}
                                            direction={performance
                                                ? directionOf(pctChange(performance.completion_rate.current, performance.completion_rate.previous))
                                                : 'flat'}
                                            showDivider={true}
                                            t={t}
                                        />
                                        <PerformanceStat
                                            label={t('product_drawer.avg_session_length')}
                                            value={performance ? Math.round(performance.avg_session_length.current) + 's' : '—'}
                                            change={performance
                                                ? changeLabel(pctChange(performance.avg_session_length.current, performance.avg_session_length.previous))
                                                : '—'}
                                            direction={performance
                                                ? directionOf(pctChange(performance.avg_session_length.current, performance.avg_session_length.previous))
                                                : 'flat'}
                                            showDivider={false}
                                            t={t}
                                        />
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
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="primary"
                                    loading={isSaving}
                                    onClick={handleSave}
                                >
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

            {/* Variant-specific drawer */}
            <VariantDrawer
                variant={expandedVariant}
                product={product}
                onClose={() => setExpandedVariant(null)}
                onUploaded={onSaved}
            />
        </>
    );
};

export default ProductSettingsDrawer;