import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Page,
    Card,
    Box,
    BlockStack,
    InlineStack,
    Text,
    Button,
    Icon,
    TextField,
    Select,
    IndexTable,
    useIndexResourceState,
    Thumbnail,
    Badge,
} from '@shopify/polaris';
import {
    RefreshIcon,
    CheckCircleIcon,
    SearchIcon,
    FilterIcon,
    AlertTriangleIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    InfoIcon,
    ImageIcon,
} from '@shopify/polaris-icons';

import ProductSettingsDrawer from '../components/ProductSettingsDrawer';

/* ============================================
    CUSTOM TOGGLE SWITCH
    Polaris has no built-in switch component,
    so this is hand-built to match the design.
    ============================================ */
const Toggle = ({ checked, onChange, disabled = false }) => {
    return (
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {!checked && (
                    <span style={{ fontSize: '11px', color: '#8C9196', fontWeight: 700, lineHeight: 1 }}>
                        &times;
                    </span>
                )}
            </span>
        </button>
    );
};

/* ============================================
    SAMPLE DATA
    ============================================ */
const INITIAL_PRODUCTS = [
    {
        id: '1',
        name: 'Linen wrap dress',
        warning: 'No usable image',
        collection: 'Dresses',
        sessions: 28,
        tryOn: true,
    },
    {
        id: '2',
        name: 'Denim jacket',
        warning: null,
        collection: 'Outerwear',
        sessions: 19,
        tryOn: true,
    },
    {
        id: '3',
        name: 'Canvas tote bag',
        warning: null,
        collection: 'Accessories',
        sessions: null,
        tryOn: false,
    },
    {
        id: '4',
        name: 'Silk blouse',
        warning: null,
        collection: 'Tops',
        sessions: 41,
        tryOn: true,
    },
    {
        id: '5',
        name: 'Essential hoodie',
        warning: 'Low quality image',
        collection: 'Hoodies',
        sessions: 3,
        tryOn: false,
    },
    {
        id: '6',
        name: 'Relaxed tee',
        warning: null,
        collection: 'Tops',
        sessions: null,
        tryOn: false,
    },
    {
        id: '7',
        name: 'Cargo pants',
        warning: null,
        collection: 'Bottoms',
        sessions: 7,
        tryOn: true,
    },
];

/* ============================================
    PRODUCTS PAGE
    ============================================ */
const ProductsPage = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [searchValue, setSearchValue] = useState('');
    const [collectionFilter, setCollectionFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [perPage, setPerPage] = useState('25');
    const [drawerProduct, setDrawerProduct] = useState(null);

    const COLLECTION_OPTIONS = [
        { label: t('products_page.all_collections'), value: 'all' },
        { label: 'Dresses', value: 'dresses' },
        { label: 'Outerwear', value: 'outerwear' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Tops', value: 'tops' },
        { label: 'Hoodies', value: 'hoodies' },
        { label: 'Bottoms', value: 'bottoms' },
    ];

    const STATUS_OPTIONS = [
        { label: t('products_page.all_statuses'), value: 'all' },
        { label: t('products_page.enabled'), value: 'enabled' },
        { label: t('products_page.disabled'), value: 'disabled' },
    ];

    const PER_PAGE_OPTIONS = [
        { label: t('products_page.x_per_page', { count: '25' }), value: '25' },
        { label: t('products_page.x_per_page', { count: '50' }), value: '50' },
        { label: t('products_page.x_per_page', { count: '100' }), value: '100' },
    ];

    const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
        useIndexResourceState(products);

    const handleToggle = useCallback((id, value) => {
        setProducts((prev) =>
            prev.map((product) => (product.id === id ? { ...product, tryOn: value } : product))
        );
    }, []);

    const handleEnableSelected = useCallback(() => {
        setProducts((prev) =>
            prev.map((product) =>
                selectedResources.includes(product.id) ? { ...product, tryOn: true } : product
            )
        );
        clearSelection();
    }, [selectedResources, clearSelection]);

    const handleDisableSelected = useCallback(() => {
        setProducts((prev) =>
            prev.map((product) =>
                selectedResources.includes(product.id) ? { ...product, tryOn: false } : product
            )
        );
        clearSelection();
    }, [selectedResources, clearSelection]);

    const enabledCount = products.filter((product) => product.tryOn).length;

    const promotedBulkActions = [
        {
            content: t('products_page.enable_try_on'),
            onAction: handleEnableSelected,
        },
        {
            content: t('products_page.disable_try_on'),
            onAction: handleDisableSelected,
        },
    ];

    const rowMarkup = products.map((product, index) => (
        <IndexTable.Row
            id={product.id}
            key={product.id}
            selected={selectedResources.includes(product.id)}
            position={index}
        >
            {/* Product */}
            <IndexTable.Cell>
                <InlineStack gap="300" blockAlign="center" wrap={false}>
                    <Thumbnail source={ImageIcon} alt={product.name} size="small" />
                    <BlockStack gap="0">
                        <Text variant="bodyMd" as="span" fontWeight="semibold">
                            {product.name}
                        </Text>
                        {product.warning && (
                            <InlineStack gap="100" blockAlign="center">
                                <Icon source={AlertTriangleIcon} tone="warning" />
                                <Text variant="bodySm" as="span" tone="caution">
                                    {t(`products_page.${product.warning === 'No usable image' ? 'no_usable_image' : 'low_quality_image'}`)}
                                </Text>
                            </InlineStack>
                        )}
                    </BlockStack>
                </InlineStack>
            </IndexTable.Cell>

            {/* Collection */}
            <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                    {product.collection}
                </Text>
            </IndexTable.Cell>

            {/* Sessions */}
            <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                    {product.sessions ?? '\u2014'}
                </Text>
            </IndexTable.Cell>

            {/* Try-on toggle */}
            <IndexTable.Cell>
                <div onClick={(e) => e.stopPropagation()}>
                    <Toggle checked={product.tryOn} onChange={(value) => handleToggle(product.id, value)} />
                </div>
            </IndexTable.Cell>

            {/* Status */}
            <IndexTable.Cell>
                <Badge tone={product.tryOn ? 'success' : undefined}>
                    {product.tryOn ? t('products_page.enabled') : t('products_page.disabled')}
                </Badge>
            </IndexTable.Cell>

            {/* Chevron */}
            <IndexTable.Cell>
                <div onClick={(e) => e.stopPropagation()}>
                    <Button
                        icon={ChevronRightIcon}
                        variant="tertiary"
                        accessibilityLabel={t('products_page.open_settings', { name: product.name })}
                        onClick={() => setDrawerProduct(product)}
                    />
                </div>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <Page fullWidth>
            <BlockStack gap="400">
                {/* Header */}
                <InlineStack align="space-between" blockAlign="start">
                    <BlockStack gap="100">
                        <Text variant="heading2xl" as="h1">
                            {t('products_page.title')}
                        </Text>
                        <InlineStack gap="200" blockAlign="center">
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#22C55E',
                                }}
                            />
                            <Text variant="bodyMd" as="span" tone="subdued">
                                {t('products_page.of_products_enabled', { enabled: enabledCount, total: products.length })} &middot; {t('products_page.synced_time_ago', { time: '2 min' })}
                            </Text>
                        </InlineStack>
                    </BlockStack>

                    <InlineStack gap="400" blockAlign="center">
                        <Button icon={RefreshIcon}>{t('products_page.sync_now')}</Button>
                        <InlineStack gap="100" blockAlign="center">
                            <Icon source={CheckCircleIcon} tone="success" />
                            <Text variant="bodyMd" as="span" tone="success">
                                {t('products_page.auto_sync_is_on')}
                            </Text>
                        </InlineStack>
                    </InlineStack>
                </InlineStack>

                <Card padding="0">
                    {/* Filter bar */}
                    <Box padding="400">
                        <InlineStack gap="300" wrap={false} blockAlign="center">
                            <div style={{ flex: 1 }}>
                                <TextField
                                    prefix={<Icon source={SearchIcon} tone="subdued" />}
                                    placeholder={t('products_page.search_products')}
                                    value={searchValue}
                                    onChange={setSearchValue}
                                    autoComplete="off"
                                    label={t('products_page.search_products')}
                                    labelHidden
                                />
                            </div>
                            <Select
                                label={t('products_page.collections')}
                                labelHidden
                                options={COLLECTION_OPTIONS}
                                value={collectionFilter}
                                onChange={setCollectionFilter}
                            />
                            <Select
                                label={t('products_page.status')}
                                labelHidden
                                options={STATUS_OPTIONS}
                                value={statusFilter}
                                onChange={setStatusFilter}
                            />
                            <Button icon={FilterIcon}>{t('products_page.more_filters')}</Button>
                        </InlineStack>
                    </Box>

                    {/* Table */}
                    <IndexTable
                        resourceName={{ singular: 'product', plural: 'products' }}
                        itemCount={products.length}
                        selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                        onSelectionChange={handleSelectionChange}
                        promotedBulkActions={promotedBulkActions}
                        headings={[
                            { title: t('products_page.product') },
                            { title: t('products_page.collection') },
                            {
                                title: (
                                    <InlineStack gap="100" blockAlign="center">
                                        <Text variant="bodySm" as="span" fontWeight="semibold" tone="subdued">
                                            {t('products_page.sessions')}
                                        </Text>
                                        <Text> <Icon source={InfoIcon} tone="subdued" /> </Text>
                                    </InlineStack>
                                ),
                            },
                            { title: t('products_page.try_on') },
                            { title: t('products_page.status') },
                            { title: '' },
                        ]}
                    >
                        {rowMarkup}
                    </IndexTable>

                    {/* Pagination footer */}
                    <Box padding="400" borderBlockStartWidth="025" borderColor="border-subdued">
                        <InlineStack align="space-between" blockAlign="center">
                            <Text variant="bodyMd" as="span" tone="subdued">
                                {t('products_page.showing_x_of_y_products', { start: '1', end: '25', total: '214' })}
                            </Text>

                            <InlineStack gap="150" blockAlign="center">
                                <Button icon={ChevronLeftIcon} variant="tertiary" disabled accessibilityLabel={t('products_page.previous_page')} />
                                <Button variant="primary" size="slim">
                                    1
                                </Button>
                                <Button variant="tertiary" size="slim">
                                    2
                                </Button>
                                <Button variant="tertiary" size="slim">
                                    3
                                </Button>
                                <Text variant="bodyMd" as="span" tone="subdued">
                                    &hellip;
                                </Text>
                                <Button variant="tertiary" size="slim">
                                    9
                                </Button>
                                <Button icon={ChevronRightIcon} variant="tertiary" accessibilityLabel={t('products_page.next_page')} />
                            </InlineStack>

                            <Select
                                label={t('products_page.per_page')}
                                labelHidden
                                options={PER_PAGE_OPTIONS}
                                value={perPage}
                                onChange={setPerPage}
                            />
                        </InlineStack>
                    </Box>
                </Card>


                <ProductSettingsDrawer
                    product={drawerProduct}
                    open={drawerProduct !== null}
                    onClose={() => setDrawerProduct(null)}
                />

            </BlockStack>
        </Page>
    );
};

export default ProductsPage;