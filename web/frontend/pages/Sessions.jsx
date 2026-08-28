import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Page,
    Box,
    BlockStack,
    Card,
    InlineStack,
    Text,
    Button,
    Icon,
    InlineGrid,
    Badge,
    IndexTable,
    Thumbnail,
} from '@shopify/polaris';
import {
    PlayIcon,
    MagicIcon,
    CartIcon,
    OrderIcon,
    CashDollarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowRightIcon,
    InfoIcon,
    CameraIcon,
    PersonIcon,
    OrderFulfilledIcon,
    ImageIcon,
} from '@shopify/polaris-icons';
import { SparkLineChart, LineChart } from '@shopify/polaris-viz';
import '@shopify/polaris-viz/build/esm/styles.css';
import SessionFunnelDateFilter from '../components/SessionFunnelDateFilter';
import { PageLoader } from '../components/PageLoader.jsx';

/* ============================================
    SHARED HELPERS
    ============================================ */

/* Default "Last 30 days" window */
const defaultRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    return { start, end };
};

/* Local-date YYYY-MM-DD (no UTC shifting) */
const toISODate = (d) =>
    d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

/* "2026-08-27" -> "Aug 27"; non-daily buckets pass through untouched */
const bucketLabel = (bucket) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(bucket)) {
        return new Date(bucket + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    }
    return bucket;
};

const formatCount = (n) => Number(n || 0).toLocaleString();
const rate = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0);

const pctChange = (cur, prev) => {
    if (prev > 0) return ((cur - prev) / prev) * 100;
    return cur > 0 ? 100 : 0;
};

/* Previous period of equal length, immediately before [start, end].
   Works uniformly for today (-> yesterday), last 7 days (-> prior 7),
   and any custom range (-> N days before its start). */
const getPreviousPeriod = (start, end) => {
    const length = Math.max(1, Math.round((end - start) / 86400000) + 1);
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - (length - 1));
    return { start: prevStart, end: prevEnd };
};

/* Evenly reduce an array to at most `max` points (for sparklines) */
const downsample = (arr, max) => {
    const limit = max || 12;
    if (arr.length <= limit) return arr;
    const out = [];
    const step = arr.length / limit;
    for (let i = 0; i < limit; i += 1) {
        out.push(arr[Math.floor(i * step)]);
    }
    return out;
};

/* polaris-viz cannot draw a line through a single point (single-day ranges),
   so duplicate the lone point to keep charts rendering */
const padSinglePoint = (points) => (points.length === 1 ? [points[0], points[0]] : points);

/* ============================================
    SECTION 1: HEADER
    ============================================ */
const SessionsHeader = ({ range, onRangeChange }) => {
    const { t } = useTranslation();

    /* Comparison window label, from the shared previous-period utility */
    const comparison = useMemo(() => {
        const { start, end } = getPreviousPeriod(range.start, range.end);
        const fmt = (d) =>
            d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return { start: fmt(start), end: fmt(end) };
    }, [range]);

    return (
        <InlineStack align="space-between" blockAlign="start">
            <BlockStack gap="100">
                <Text variant="heading2xl" as="h1">
                    {t('sessions_page.title')}
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                    {t('sessions_page.subtitle')}
                </Text>
            </BlockStack>

            <BlockStack gap="100" inlineAlign="end">
                <InlineStack gap="200" blockAlign="center">
                    <SessionFunnelDateFilter onChange={onRangeChange} />
                </InlineStack>
                <Text variant="bodySm" as="p" tone="subdued">
                    {t('sessions_page.compared_to', { startDate: comparison.start, endDate: comparison.end })}
                </Text>
            </BlockStack>
        </InlineStack>
    );
};

/* ============================================
    SECTION 2: KPI CARDS
    ============================================ */
const Sparkline = ({ data, color, label }) => (
    <div style={{ width: '100%', height: '40px' }}>
        <SparkLineChart
            accessibilityLabel={label + ' trend'}
            data={[{ name: label, data, color }]}
            isAnimated={false}
        />
    </div>
);

const KpiCard = ({ icon, iconBg, iconTone, label, value, change, direction, tooltip, sparklineData, sublabel }) => {
    const { t } = useTranslation();

    /* Change indicator + sparkline color: green up, red down, neutral gray on exactly 0 */
    const changeTone = direction === 'up' ? 'success' : direction === 'down' ? 'critical' : 'subdued';
    const ChangeIcon = direction === 'up' ? ArrowUpIcon : direction === 'down' ? ArrowDownIcon : ArrowRightIcon;
    const sparklineTone =
        direction === 'up' ? '#22C55E' : direction === 'down' ? '#EF4444' : '#9CA3AF';

    return (
        <Card padding="400">
            <BlockStack gap="300">
                <Box background={iconBg} borderRadius="200" padding="200" minWidth="36px" maxWidth="36px">
                    <Icon source={icon} tone={iconTone} />
                </Box>

                <BlockStack gap="150">
                    <InlineStack gap="100" blockAlign="center">
                        <Text variant="bodyMd" as="p" tone="subdued">
                            {label}
                        </Text>
                        {tooltip && <Icon source={InfoIcon} tone="subdued" />}
                    </InlineStack>

                    <Text variant="headingXl" as="p">
                        {value}
                    </Text>

                    <BlockStack gap="050">
                        <InlineStack gap="100" blockAlign="center">
                            <Text>
                                {' '}
                                <Icon source={ChangeIcon} tone={changeTone} />
                                {' '}
                            </Text>
                            <Text variant="bodySm" as="span" tone={changeTone} fontWeight="medium">
                                {change}
                            </Text>
                        </InlineStack>
                        <Text variant="bodySm" as="span" tone="subdued">
                            {sublabel}
                        </Text>
                    </BlockStack>
                </BlockStack>

                <Sparkline data={sparklineData} color={sparklineTone} label={label} />
            </BlockStack>
        </Card>
    );
};

/* ============================================
    SECTION 2: SESSIONS KPI CARDS (dynamic)
    ============================================ */
const SessionsKpiCards = ({ analytics, range }) => {
    const { t } = useTranslation();

    if (!analytics) return null;

    const { kpis, trend } = analytics;
    const cur = kpis.funnel.current;
    const prev = kpis.funnel.previous;

    /* Card sublabel mirrors the real comparison window (equal-length prior period) */
    const previousPeriod = getPreviousPeriod(range.start, range.end);
    const windowDays = Math.max(1, Math.round((previousPeriod.end - previousPeriod.start) / 86400000) + 1);
    const sublabel = windowDays === 1
        ? t('sessions_page.vs_previous_day')
        : t('sessions_page.vs_previous_days', { count: windowDays });

    /* Daily counts for sparklines, downsampled to <= 12 points */
    const dailyCounts = downsample(
        (trend.current || []).map((point) => point.count),
        12
    );
    const flatSpark = new Array(dailyCounts.length || 12).fill(0);
    const asSpark = (values) => padSinglePoint(values).map((value, i) => ({ key: i, value }));

    /* Per-day metric rows (from trend.metrics) -> real sparkline series */
    const metricRows = trend.metrics?.current || [];
    const sparkSeries = (pick) => downsample(metricRows.map(pick), 12);
    const completionSeries = sparkSeries((r) => (r.sessions > 0 ? Math.round((r.completed / r.sessions) * 1000) / 10 : 0));
    const cartRateSeries = sparkSeries((r) => (r.started > 0 ? Math.round((r.added_to_cart / r.started) * 1000) / 10 : 0));
    const ordersSeries = sparkSeries((r) => r.orders);

    /* % change vs prior period. prev=0 handled explicitly: cur>0 -> +100%, both 0 -> 0% */
    const changeLabel = (delta) => parseFloat(Math.abs(delta).toFixed(1)).toLocaleString() + '%';

    const directionOf = (delta) => (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat');

    const cards = [
        {
            icon: PlayIcon,
            iconBg: 'bg-fill-info-secondary',
            iconTone: 'info',
            label: t('sessions_page.kpi_cards.sessions'),
            value: formatCount(kpis.sessions.current),
            change: changeLabel(pctChange(kpis.sessions.current, kpis.sessions.previous)),
            direction: directionOf(pctChange(kpis.sessions.current, kpis.sessions.previous)),
            sparklineData: asSpark(dailyCounts),
        },
        {
            icon: MagicIcon,
            iconBg: 'bg-fill-success-secondary',
            iconTone: 'success',
            label: t('sessions_page.kpi_cards.completion_rate'),
            value: rate(cur.completed, cur.opened).toFixed(1) + '%',
            change: changeLabel(pctChange(rate(cur.completed, cur.opened), rate(prev.completed, prev.opened))),
            direction: directionOf(pctChange(rate(cur.completed, cur.opened), rate(prev.completed, prev.opened))),
            sparklineData: asSpark(completionSeries),
        },
        {
            icon: CartIcon,
            iconBg: 'bg-fill-magic-secondary',
            iconTone: 'magic',
            label: t('sessions_page.kpi_cards.add_to_cart_rate'),
            value: rate(cur.added_to_cart, cur.started).toFixed(1) + '%',
            change: changeLabel(pctChange(rate(cur.added_to_cart, cur.started), rate(prev.added_to_cart, prev.started))),
            direction: directionOf(pctChange(rate(cur.added_to_cart, cur.started), rate(prev.added_to_cart, prev.started))),
            sparklineData: asSpark(cartRateSeries),
        },
        {
            icon: OrderIcon,
            iconBg: 'bg-fill-caution-secondary',
            iconTone: 'warning',
            label: t('sessions_page.kpi_cards.orders_from_try_on'),
            value: formatCount(kpis.orders.current),
            change: changeLabel(pctChange(kpis.orders.current, kpis.orders.previous)),
            direction: directionOf(pctChange(kpis.orders.current, kpis.orders.previous)),
            tooltip: true,
            sparklineData: asSpark(ordersSeries),
        },
        {
            icon: CashDollarIcon,
            iconBg: 'bg-fill-info-secondary',
            iconTone: 'info',
            label: t('sessions_page.kpi_cards.revenue_from_try_on'),
            value: '-',
            change: '-',
            direction: 'flat',
            tooltip: true,
            sparklineData: asSpark(flatSpark),
        },
    ];

    return (
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 5 }} gap="300">
            {cards.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} sublabel={sublabel} />
            ))}
        </InlineGrid>
    );
};

/* ============================================
    SECTION 3: SESSIONS OVER TIME (dynamic)
    ============================================ */
const SessionsOverTimeChart = ({ analytics }) => {
    const { t } = useTranslation();

    if (!analytics) return null;

    const labels = (analytics.trend.current || []).map((point) => bucketLabel(point.bucket));

    const lineData = [
        {
            name: t('sessions_page.sessions_over_time.sessions'),
            data: padSinglePoint((analytics.trend.current || []).map((point) => ({
                key: bucketLabel(point.bucket),
                value: point.count,
            }))),
            color: '#0F6E5C',
        },
        {
            name: t('sessions_page.sessions_over_time.previous_period'),
            data: padSinglePoint((analytics.trend.previous || []).map((point) => ({
                key: bucketLabel(point.bucket),
                value: point.count,
            }))),
            isComparison: true,
            color: '#B5B5B5',
        },
    ];

    return (
        <Card padding="400">
            <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="150">
                        <Text variant="headingMd" as="h3" fontWeight={600}>
                            {t('sessions_page.sessions_over_time.title')}
                        </Text>
                        <InlineStack gap="400" blockAlign="center">
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{ width: '16px', height: '2px', background: '#0F6E5C' }} />
                                <Text variant="bodySm" as="span" tone="subdued">
                                    {t('sessions_page.sessions_over_time.sessions')}
                                </Text>
                            </InlineStack>
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{ width: '16px', height: '0px', borderTop: '2px dashed #B5B5B5' }} />
                                <Text variant="bodySm" as="span" tone="subdued">
                                    {t('sessions_page.sessions_over_time.previous_period')}
                                </Text>
                            </InlineStack>
                        </InlineStack>
                    </BlockStack>
                </InlineStack>

                <div style={{ height: '320px' }}>
                    <LineChart
                        data={lineData}
                        isAnimated={false}
                        xAxisOptions={{
                            labelFormatter: (value) => {
                                const index = labels.indexOf(value);
                                return index % 4 === 0 ? value : '';
                            },
                        }}
                    />
                </div>
            </BlockStack>
        </Card>
    );
};

/* ============================================
    SECTION 4: TRY-ON FUNNEL (dynamic)
    ============================================ */
const FunnelStep = ({ step }) => (
    <Card padding="400">
        <BlockStack gap="200">
            <InlineStack gap="100" blockAlign="center" wrap={false}>
                <div
                    style={{
                        width: '32px',
                        height: '32px',
                        minWidth: '32px',
                        borderRadius: '8px',
                        background: step.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon source={step.icon} tone={step.iconTone} />
                </div>
                <Text variant="bodyMd" as="p" fontWeight="medium">
                    {step.label}
                </Text>
            </InlineStack>

            <Text variant="headingLg" as="p">
                {step.value}
            </Text>

            <BlockStack gap="0">
                <Text variant="bodyMd" as="p" fontWeight="semibold">
                    {step.percent}
                </Text>
                <Text variant="bodySm" as="p" tone="subdued">
                    {step.caption}
                </Text>
            </BlockStack>
        </BlockStack>
    </Card>
);

/* ============================================
    SECTION 4: TRY-ON FUNNEL (dynamic)
    ============================================ */
const TryOnFunnel = ({ analytics }) => {
    const { t } = useTranslation();

    if (!analytics) return null;

    const f = analytics.kpis.funnel.current;

    /* Percent at each step relative to the previous step */
    const pct = (step, before) => rate(step, before).toFixed(1) + '%';

    const funnelSteps = [
        {
            icon: CameraIcon,
            value: formatCount(f.opened),
            label: t('sessions_page.try_on_funnel.steps.camera_opened'),
            percent: '100%',
            caption: t('sessions_page.try_on_funnel.captions.of_product_page_clicks'),
            iconBg: '#DBEAFE',
            iconTone: 'info',
        },
        {
            icon: PersonIcon,
            value: formatCount(f.started),
            label: t('sessions_page.try_on_funnel.steps.try_on_started'),
            percent: pct(f.started, f.opened),
            caption: t('sessions_page.try_on_funnel.captions.continued_after_camera'),
            iconBg: '#D1FAE5',
            iconTone: 'success',
        },
        {
            icon: MagicIcon,
            value: formatCount(f.completed),
            label: t('sessions_page.try_on_funnel.steps.try_on_completed'),
            percent: pct(f.completed, f.started),
            caption: t('sessions_page.try_on_funnel.captions.completed_try_on'),
            iconBg: '#EDE9FE',
            iconTone: 'magic',
        },
        {
            icon: CartIcon,
            value: formatCount(f.added_to_cart),
            label: t('sessions_page.try_on_funnel.steps.added_to_cart'),
            percent: pct(f.added_to_cart, f.completed),
            caption: t('sessions_page.try_on_funnel.captions.added_to_cart'),
            iconBg: '#FFEDD5',
            iconTone: 'warning',
        },
        {
            icon: OrderFulfilledIcon,
            value: formatCount(f.purchased),
            label: t('sessions_page.try_on_funnel.steps.purchased'),
            percent: pct(f.purchased, f.added_to_cart),
            caption: t('sessions_page.try_on_funnel.captions.purchased'),
            iconBg: '#CCFBF1',
            iconTone: 'success',
        },
    ];

    return (
        <Card padding="400">
            <BlockStack gap="400">
                <BlockStack gap="100">
                    <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingMd" as="h3" fontWeight={600}>
                            {t('sessions_page.try_on_funnel.title')}
                        </Text>
                        <Badge tone="info">{t('sessions_page.try_on_funnel.estimated')}</Badge>
                    </InlineStack>
                    <Text variant="bodyMd" as="p" tone="subdued">
                        {t('sessions_page.try_on_funnel.description')}
                    </Text>
                </BlockStack>

                <InlineStack align="space-between" blockAlign="center" wrap={false} gap="200">
                    {funnelSteps.map((step, index) => (
                        <InlineStack key={step.label} gap="200" blockAlign="center" wrap={false} style={{ flex: 1 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <FunnelStep step={step} />
                            </div>
                            {index < funnelSteps.length - 1 && (
                                <Text> <Icon source={ArrowRightIcon} tone="subdued" /> </Text>
                            )}
                        </InlineStack>
                    ))}
                </InlineStack>

                <Box background="bg-fill-info-secondary" padding="300" borderRadius="200">
                    <InlineStack gap="200" blockAlign="start" wrap={false}>
                        <Text> <Icon source={InfoIcon} tone="info" /> </Text>
                        <Text variant="bodySm" as="p">
                            {t('sessions_page.try_on_funnel.attribution_note')}
                        </Text>
                    </InlineStack>
                </Box>
            </BlockStack>
        </Card>
    );
};

/* ============================================
    SECTION 6: TOP / LOWEST PERFORMING PRODUCTS
    (static mock data - not yet wired to try_sessions)
    ============================================ */
const TOP_PRODUCTS = [
    { id: 't1', name: 'Silk blouse', sessions: 41, completion: '89%', addToCart: '44%' },
    { id: 't2', name: 'Linen wrap dress', sessions: 28, completion: '86%', addToCart: '39%' },
    { id: 't3', name: 'Denim jacket', sessions: 19, completion: '74%', addToCart: '28%' },
    { id: 't4', name: 'Canvas tote bag', sessions: 6, completion: '52%', addToCart: '11%' },
    { id: 't5', name: 'Essential hoodie', sessions: 5, completion: '60%', addToCart: '20%' },
];

const LOWEST_PRODUCTS = [
    { id: 'l1', name: 'Relaxed tee', sessions: 7, completion: '42%', addToCart: '6%' },
    { id: 'l2', name: 'Ivory linen shirt', sessions: 4, completion: '45%', addToCart: '8%' },
    { id: 'l3', name: 'Cargo pants', sessions: 9, completion: '48%', addToCart: '10%' },
    { id: 'l4', name: 'Wool beanie', sessions: 3, completion: '50%', addToCart: '0%' },
    { id: 'l5', name: 'Canvas tote bag', sessions: 6, completion: '52%', addToCart: '11%' },
];

const ProductPerformanceTable = ({ title, products, sortLabel, lowPerforming }) => {
    const { t } = useTranslation();

    return (
        <Card padding="400">
            <Box padding="400">
                <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingMd" as="h3" fontWeight={600}>
                        {title}
                    </Text>
                    <Button disclosure>{t('sessions_page.top_performing_products.sort_by')} {sortLabel}</Button>
                </InlineStack>
            </Box>

            <IndexTable
                resourceName={{ singular: 'product', plural: 'products' }}
                itemCount={products.length}
                selectable={false}
                headings={[
                    { title: t('sessions_page.top_performing_products.table.product') },
                    { title: t('sessions_page.top_performing_products.table.sessions') },
                    { title: t('sessions_page.top_performing_products.table.completion_rate') },
                    { title: t('sessions_page.top_performing_products.table.add_to_cart_rate') },
                ]}
            >
                {products.map((product, index) => (
                    <IndexTable.Row id={product.id} key={product.id} position={index}>
                        <IndexTable.Cell>
                            <InlineStack gap="200" blockAlign="center" wrap={false}>
                                <Thumbnail source={ImageIcon} alt={product.name} size="small" />
                                <Text variant="bodyMd" as="span" fontWeight="medium">
                                    {product.name}
                                </Text>
                            </InlineStack>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <Text variant="bodyMd" as="span">
                                {product.sessions}
                            </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <Text variant="bodyMd" as="span" tone={lowPerforming ? 'critical' : undefined}>
                                {product.completion}
                            </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <Text variant="bodyMd" as="span">
                                {product.addToCart}
                            </Text>
                        </IndexTable.Cell>
                    </IndexTable.Row>
                ))}
            </IndexTable>

            <Box padding="400" align="center">
                <Button variant="plain">{t('sessions_page.top_performing_products.view_all_products')}</Button>
            </Box>
        </Card>
    );
};

const SessionsProductTables = () => {
    const { t } = useTranslation();

    return (
        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
            <ProductPerformanceTable
                title={t('sessions_page.top_performing_products.title')}
                products={TOP_PRODUCTS}
                sortLabel={t('sessions_page.top_performing_products.sort_by_sessions')}
            />
            <ProductPerformanceTable
                title={t('sessions_page.lowest_performing_products.title')}
                products={LOWEST_PRODUCTS}
                sortLabel={t('sessions_page.lowest_performing_products.sort_by_completion_rate')}
                lowPerforming
            />
        </InlineGrid>
    );
};

/* ============================================
    SESSIONS PAGE
    ============================================ */
const SessionsPage = () => {
    const [range, setRange] = useState(defaultRange);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    from: toISODate(range.start),
                    to: toISODate(range.end),
                });
                const response = await fetch('/api/sessions/analytics?' + params.toString());
                const payload = response.ok ? await response.json() : null;
                if (!cancelled && payload && payload.data) {
                    setAnalytics(payload.data);
                }
            } catch (error) {
                console.error('Failed loading sessions analytics:', error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [range]);

    if (isLoading && !analytics) {
        return <PageLoader />;
    }

    return (
        <Page fullWidth>
            <BlockStack gap="400">
                <SessionsHeader range={range} onRangeChange={setRange} />
                <SessionsKpiCards analytics={analytics} range={range} />
                <SessionsOverTimeChart analytics={analytics} />
                <TryOnFunnel analytics={analytics} />
                <SessionsProductTables />
            </BlockStack>
        </Page>
    );
};

export default SessionsPage;
