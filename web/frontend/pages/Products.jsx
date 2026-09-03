import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
import { useAppBridge } from '@shopify/app-bridge-react';
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
    PRODUCTS PAGE
    ============================================ */
const ProductsPage = () => {
    const { t } = useTranslation();
    const shopify = useAppBridge();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [stats, setStats] = useState({ total: 0, enabled: 0, lastSyncedAt: null });
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const syncPollRef = useRef(null);

    const [searchInput, setSearchInput] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [collectionFilter, setCollectionFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    // Per-page preference persists for the browser session so it survives
    // navigating between pages
    const [perPage, setPerPage] = useState(() => {
        try {
            const stored = sessionStorage.getItem('products_per_page');
            return ['10', '25', '50', '100'].includes(stored) ? stored : '25';
        } catch {
            return '25';
        }
    });
    const [page, setPage] = useState(1);
    const [drawerProduct, setDrawerProduct] = useState(null);

    // Debounce the search box before it drives a refetch
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                per_page: perPage,
                status: statusFilter,
            });
            if (searchValue) {
                params.set('search', searchValue);
            }
            if (collectionFilter !== 'all') {
                params.set('collection_id', collectionFilter);
            }

            const response = await fetch(`/api/products?${params.toString()}`);
            const data = await response.json();

            setProducts(data.products ?? []);
            setPagination(data.pagination ?? null);
            setStats(data.stats ?? { total: 0, enabled: 0, lastSyncedAt: null });
            setCollections(data.collections ?? []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, perPage, statusFilter, searchValue, collectionFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const COLLECTION_OPTIONS = useMemo(() => [
        { label: t('products_page.all_collections'), value: 'all' },
        ...collections.map((c) => ({ label: c.title ?? `#${c.id}`, value: c.id })),
    ], [collections, t]);

    const STATUS_OPTIONS = [
        { label: t('products_page.all_statuses'), value: 'all' },
        { label: t('products_page.enabled'), value: 'enabled' },
        { label: t('products_page.disabled'), value: 'disabled' },
    ];

    const PER_PAGE_OPTIONS = [
        { label: t('products_page.x_per_page', { count: '10' }), value: '10' },
        { label: t('products_page.x_per_page', { count: '25' }), value: '25' },
        { label: t('products_page.x_per_page', { count: '50' }), value: '50' },
        { label: t('products_page.x_per_page', { count: '100' }), value: '100' },
    ];

    const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
        useIndexResourceState(products);

    const handleToggle = useCallback(async (id, value, name) => {
        setProducts((prev) =>
            prev.map((product) => (product.id === id ? { ...product, tryOn: value } : product))
        );
        try {
            const response = await fetch('/api/products/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: id, try_on: value }),
            });
            if (!response.ok) {
                throw new Error(`Toggle failed with status ${response.status}`);
            }
            shopify.toast.show(
                t(value ? 'products_page.try_on_enabled_toast' : 'products_page.try_on_disabled_toast', { name })
            );
        } catch (error) {
            console.error('Failed to toggle product:', error);
            setProducts((prev) =>
                prev.map((product) => (product.id === id ? { ...product, tryOn: !value } : product))
            );
            shopify.toast.show(t('products_page.failed_to_update'), { isError: true });
        }
    }, [t, shopify]);

    const handleBulkToggle = useCallback(async (value) => {
        const selectedCount = selectedResources.length;
        setProducts((prev) =>
            prev.map((product) =>
                selectedResources.includes(product.id) ? { ...product, tryOn: value } : product
            )
        );
        try {
            const response = await fetch('/api/products/bulk-toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_ids: selectedResources, try_on: value }),
            });
            if (!response.ok) {
                throw new Error(`Bulk toggle failed with status ${response.status}`);
            }
            shopify.toast.show(
                t(value ? 'products_page.bulk_try_on_enabled_toast' : 'products_page.bulk_try_on_disabled_toast', { count: selectedCount })
            );
        } catch (error) {
            console.error('Failed to bulk toggle products:', error);
            fetchProducts();
            shopify.toast.show(t('products_page.failed_to_update'), { isError: true });
        }
        clearSelection();
    }, [selectedResources, clearSelection, fetchProducts, t, shopify]);

    const handleSyncNow = useCallback(async () => {
        if (isSyncing) return;
        setIsSyncing(true);
        try {
            await fetch('/api/products/sync', { method: 'POST' });

            const poll = async () => {
                try {
                    const response = await fetch('/api/sync-status');
                    const data = await response.json();
                    if (data.sync && data.sync.status === 'running') {
                        syncPollRef.current = setTimeout(poll, 2000);
                        return;
                    }
                    setIsSyncing(false);
                    if (data.sync && data.sync.status === 'completed') {
                        setPage(1);
                        fetchProducts();
                        shopify.toast.show(t('products_page.sync_completed'));
                    } else if (data.sync && data.sync.status === 'failed') {
                        shopify.toast.show(t('products_page.sync_failed'), { isError: true });
                    }
                } catch (error) {
                    syncPollRef.current = setTimeout(poll, 2000);
                }
            };
            poll();
        } catch (error) {
            console.error('Failed to start sync:', error);
            setIsSyncing(false);
            shopify.toast.show(t('products_page.sync_failed'), { isError: true });
        }
    }, [isSyncing, fetchProducts, t, shopify]);

    useEffect(() => () => {
        if (syncPollRef.current) {
            clearTimeout(syncPollRef.current);
        }
    }, []);

    const enabledCount = stats.enabled;
    const syncTimeAgo = useMemo(() => {
        if (!stats.lastSyncedAt) return null;
        const mins = Math.floor((Date.now() - new Date(stats.lastSyncedAt).getTime()) / 60000);
        if (mins < 1) return '1 min';
        if (mins < 60) return `${mins} min`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} hr`;
        return `${Math.floor(hours / 24)} d`;
    }, [stats.lastSyncedAt]);

    const pageButtons = useMemo(() => {
        if (!pagination || pagination.last_page <= 1) return [];
        const { current_page, last_page } = pagination;
        const pages = [...new Set(
            [1, last_page, current_page - 1, current_page, current_page + 1]
                .filter((p) => p >= 1 && p <= last_page)
        )].sort((a, b) => a - b);
        return pages;
    }, [pagination]);

    // Merge drawer saves back into the table row and the open drawer
    const handleProductSaved = useCallback((updated) => {
        setProducts((prev) =>
            prev.map((product) => (product.id === updated.id ? { ...product, ...updated } : product))
        );
        setDrawerProduct((prev) => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
    }, []);

    const promotedBulkActions = [        {
            content: t('products_page.enable_try_on'),
            onAction: () => handleBulkToggle(true),
        },
        {
            content: t('products_page.disable_try_on'),
            onAction: () => handleBulkToggle(false),
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
                    <Thumbnail source={product.image || ImageIcon} alt={product.name} size="small" />
                    <BlockStack gap="0">
                        <Text variant="bodyMd" as="span" fontWeight="semibold">
                            {product.name}
                        </Text>
                        {product.warning && (
                            <InlineStack gap="100" blockAlign="center">
                                <Text> <Icon source={AlertTriangleIcon} tone="warning" /> </Text>
                                <Text variant="bodySm" as="span" tone="caution">
                                    {t(`products_page.${product.warning}`)}
                                </Text>
                            </InlineStack>
                        )}
                    </BlockStack>
                </InlineStack>
            </IndexTable.Cell>

            {/* Collection */}
            <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                    {product.collection ?? '—'}
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
                    <Toggle checked={product.tryOn} onChange={(value) => handleToggle(product.id, value, product.name)} />
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
                                {t('products_page.of_products_enabled', { enabled: enabledCount, total: stats.total })}
                                {syncTimeAgo && (
                                    <>
                                        {' · '}
                                        {t('products_page.synced_time_ago', { time: syncTimeAgo })}
                                    </>
                                )}
                            </Text>
                        </InlineStack>
                    </BlockStack>

                    <InlineStack gap="400" blockAlign="center">
                        <Button
                            icon={isSyncing ? undefined : RefreshIcon}
                            loading={isSyncing}
                            onClick={handleSyncNow}
                        >
                            {isSyncing ? t('products_page.syncing') : t('products_page.sync_now')}
                        </Button>
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
                                    value={searchInput}
                                    onChange={setSearchInput}
                                    autoComplete="off"
                                    label={t('products_page.search_products')}
                                    labelHidden
                                    clearButton
                                    onClearButtonClick={() => {
                                        setSearchInput('');
                                        setSearchValue('');
                                        setPage(1);
                                    }}
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
                            {/* <Button icon={FilterIcon}>{t('products_page.more_filters')}</Button> */}
                        </InlineStack>
                    </Box>

                    {/* Table */}
                    <IndexTable
                        resourceName={{ singular: 'product', plural: 'products' }}
                        itemCount={products.length}
                        selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                        onSelectionChange={handleSelectionChange}
                        promotedBulkActions={promotedBulkActions}
                        emptyState={
                            <Box padding="600">
                                <Text alignment="center" tone="subdued" as="p">
                                    {isLoading
                                        ? t('products_page.loading_products')
                                        : t('products_page.no_products_found')}
                                </Text>
                            </Box>
                        }
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
                                {t('products_page.showing_x_of_y_products', {
                                    start: pagination?.from ?? 0,
                                    end: pagination?.to ?? 0,
                                    total: pagination?.total ?? 0,
                                })}
                            </Text>

                            <InlineStack gap="150" blockAlign="center">
                                <Button
                                    icon={ChevronLeftIcon}
                                    variant="tertiary"
                                    disabled={!pagination || pagination.current_page <= 1}
                                    accessibilityLabel={t('products_page.previous_page')}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                />
                                {pageButtons.map((p, idx) => (
                                    <Box key={`gap-${p}`} padding="0">
                                        <InlineStack gap="150" blockAlign="center">
                                            {idx > 0 && p - pageButtons[idx - 1] > 1 && (
                                                <Text variant="bodyMd" as="span" tone="subdued">
                                                    &hellip;
                                                </Text>
                                            )}
                                            <Button
                                                size="slim"
                                                variant={p === page ? 'primary' : 'tertiary'}
                                                onClick={() => setPage(p)}
                                            >
                                                {p}
                                            </Button>
                                        </InlineStack>
                                    </Box>
                                ))}
                                <Button
                                    icon={ChevronRightIcon}
                                    variant="tertiary"
                                    disabled={!pagination || pagination.current_page >= pagination.last_page}
                                    accessibilityLabel={t('products_page.next_page')}
                                    onClick={() => setPage((p) => (pagination ? Math.min(pagination.last_page, p + 1) : p))}
                                />
                            </InlineStack>

                            <Select
                                label={t('products_page.per_page')}
                                labelHidden
                                options={PER_PAGE_OPTIONS}
                                value={perPage}
                                onChange={(value) => {
                                    setPerPage(value);
                                    setPage(1);
                                    try {
                                        sessionStorage.setItem('products_per_page', value);
                                    } catch {
                                        // storage unavailable — selection just won't persist
                                    }
                                }}
                            />
                        </InlineStack>
                    </Box>
                </Card>


                <ProductSettingsDrawer
                    product={drawerProduct}
                    open={drawerProduct !== null}
                    onClose={() => setDrawerProduct(null)}
                    onSaved={handleProductSaved}
                />

            </BlockStack>
        </Page>
    );
};

export default ProductsPage;