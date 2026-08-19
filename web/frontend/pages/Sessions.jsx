import { useState } from 'react';
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
    Select,
    Badge,
    IndexTable,
    Thumbnail,
} from '@shopify/polaris';
import {
    CalendarIcon,
    PlayIcon,
    MagicIcon,
    CartIcon,
    OrderIcon,
    CashDollarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowRightIcon,
    InfoIcon,
    ChartLineIcon,
    ChartVerticalIcon,
    CameraIcon,
    PersonIcon,
    OrderFulfilledIcon,
    ImageIcon,
    ChevronRightIcon,
} from '@shopify/polaris-icons';
import { SparkLineChart, LineChart, DonutChart } from '@shopify/polaris-viz';
import '@shopify/polaris-viz/build/esm/styles.css';
import SessionFunnelDateFilter from '../components/SessionFunnelDateFilter';

/* ============================================
    SHARED: PERIOD TOGGLE (7D / 30D / 90D)
    ============================================ */

/* ============================================
    SECTION 1: HEADER
    ============================================ */
const SessionsHeader = ({ period, onPeriodChange }) => {
    const { t } = useTranslation();

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
                    <SessionFunnelDateFilter />
                </InlineStack>
                <Text variant="bodySm" as="p" tone="subdued">
                    {t('sessions_page.compared_to', { startDate: 'Mar 24', endDate: 'Apr 22, 2025' })}
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
            accessibilityLabel={`${label} trend`}
            data={[{ name: label, data, color }]}
            isAnimated={false}
        />
    </div>
);

const KpiCard = ({ icon, iconBg, iconTone, label, value, change, direction, tooltip, sparklineData, sparklineColor }) => {
    const { t } = useTranslation();

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
                            <Text> <Icon
                                source={direction === 'up' ? ArrowUpIcon : ArrowDownIcon}
                                tone={direction === 'up' ? 'success' : 'critical'}
                            />
                            </Text>
                            <Text variant="bodySm" as="span" tone={direction === 'up' ? 'success' : 'critical'} fontWeight="medium">
                                {change}
                            </Text>
                        </InlineStack>
                        <Text variant="bodySm" as="span" tone="subdued">
                            {t('sessions_page.vs_previous_30_days')}
                        </Text>
                    </BlockStack>
                </BlockStack>

                <Sparkline data={sparklineData} color={sparklineColor} label={label} />
            </BlockStack>
        </Card>
    );
};

const genSparkline = (base, variance) =>
    Array.from({ length: 12 }, (_, i) => ({
        key: i,
        value: Math.round(base + Math.sin(i * 0.8) * variance + Math.random() * variance * 0.3),
    }));

const getKpiData = (t) => [
    {
        icon: PlayIcon,
        iconBg: 'bg-fill-info-secondary',
        iconTone: 'info',
        label: t('sessions_page.kpi_cards.sessions'),
        value: '2,847',
        change: '12%',
        direction: 'up',
        sparklineData: genSparkline(100, 30),
        sparklineColor: '#3B82F6',
    },
    {
        icon: MagicIcon,
        iconBg: 'bg-fill-success-secondary',
        iconTone: 'success',
        label: t('sessions_page.kpi_cards.completion_rate'),
        value: '75.7%',
        change: '6.3pt',
        direction: 'up',
        sparklineData: genSparkline(80, 15),
        sparklineColor: '#22C55E',
    },
    {
        icon: CartIcon,
        iconBg: 'bg-fill-magic-secondary',
        iconTone: 'magic',
        label: t('sessions_page.kpi_cards.add_to_cart_rate'),
        value: '32.1%',
        change: '2.0pt',
        direction: 'down',
        sparklineData: genSparkline(60, 20),
        sparklineColor: '#8B5CF6',
    },
    {
        icon: OrderIcon,
        iconBg: 'bg-fill-caution-secondary',
        iconTone: 'warning',
        label: t('sessions_page.kpi_cards.orders_from_try_on'),
        value: '213',
        change: '9% ',
        direction: 'up',
        tooltip: true,
        sparklineData: genSparkline(40, 15),
        sparklineColor: '#F97316',
    },
    {
        icon: CashDollarIcon,
        iconBg: 'bg-fill-info-secondary',
        iconTone: 'info',
        label: t('sessions_page.kpi_cards.revenue_from_try_on'),
        value: '$6,842.31',
        change: '14%',
        direction: 'up',
        tooltip: true,
        sparklineData: genSparkline(90, 25),
        sparklineColor: '#0F6E5C',
    },
];

const SessionsKpiCards = () => {
    const { t } = useTranslation();
    const KPI_DATA = getKpiData(t);

    return (
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 5 }} gap="300">
            {KPI_DATA.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
            ))}
        </InlineGrid>
    );
};

/* ============================================
    SECTION 3: SESSIONS OVER TIME
    ============================================ */
const SESSIONS_OVER_TIME_LABELS = [
    'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26', 'Apr 27', 'Apr 28', 'Apr 29',
    'Apr 30', 'May 1', 'May 2', 'May 3', 'May 4', 'May 5', 'May 6',
    'May 7', 'May 8', 'May 9', 'May 10', 'May 11', 'May 12', 'May 13',
    'May 14', 'May 15', 'May 16', 'May 17', 'May 18', 'May 19', 'May 20',
    'May 21', 'May 22',
];

const genSeries = (base, variance) =>
    SESSIONS_OVER_TIME_LABELS.map((label, i) => ({
        key: label,
        value: Math.max(0, Math.round(base + Math.sin(i * 0.5) * variance + Math.random() * variance * 0.4)),
    }));

const getSessionLineData = (t) => [
    { name: t('sessions_page.sessions_over_time.sessions'), data: genSeries(110, 40), color: '#0F6E5C' },
    { name: t('sessions_page.sessions_over_time.previous_period'), data: genSeries(95, 30), isComparison: true, color: '#B5B5B5' },
];

const SessionsOverTimeChart = () => {
    const { t } = useTranslation();
    const [interval, setInterval_] = useState('daily');
    const [chartType, setChartType] = useState('line');
    const SESSIONS_LINE_DATA = getSessionLineData(t);

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
                                <div
                                    style={{
                                        width: '16px',
                                        height: '0px',
                                        borderTop: '2px dashed #B5B5B5',
                                    }}
                                />
                                <Text variant="bodySm" as="span" tone="subdued">
                                    {t('sessions_page.sessions_over_time.previous_period')}
                                </Text>
                            </InlineStack>
                        </InlineStack>
                    </BlockStack>

                    <InlineStack gap="200" blockAlign="center">
                        <Select
                            label={t('sessions_page.sessions_over_time.interval')}
                            labelHidden
                            options={[
                                { label: t('sessions_page.sessions_over_time.daily'), value: 'daily' },
                                { label: t('sessions_page.sessions_over_time.weekly'), value: 'weekly' },
                                { label: t('sessions_page.sessions_over_time.monthly'), value: 'monthly' },
                            ]}
                            value={interval}
                            onChange={setInterval_}
                        />

                    </InlineStack>
                </InlineStack>

                <div style={{ height: '320px' }}>
                    <LineChart
                        data={SESSIONS_LINE_DATA}
                        isAnimated={false}
                        xAxisOptions={{
                            labelFormatter: (value) => {
                                const index = SESSIONS_OVER_TIME_LABELS.indexOf(value);
                                // Show every ~4th label to avoid crowding
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
    SECTION 4: TRY-ON FUNNEL (5 steps)
    ============================================ */
const getFunnelSteps = (t) => [
    { icon: CameraIcon, value: '3,421', label: t('sessions_page.try_on_funnel.steps.camera_opened'), percent: '100%', caption: t('sessions_page.try_on_funnel.captions.of_product_page_clicks'), iconBg: '#DBEAFE', iconTone: 'info' },
    { icon: PersonIcon, value: '2,847', label: t('sessions_page.try_on_funnel.steps.try_on_started'), percent: '83.2%', caption: t('sessions_page.try_on_funnel.captions.continued_after_camera'), iconBg: '#D1FAE5', iconTone: 'success' },
    { icon: MagicIcon, value: '2,156', label: t('sessions_page.try_on_funnel.steps.try_on_completed'), percent: '75.7%', caption: t('sessions_page.try_on_funnel.captions.completed_try_on'), iconBg: '#EDE9FE', iconTone: 'magic' },
    { icon: CartIcon, value: '912', label: t('sessions_page.try_on_funnel.steps.added_to_cart'), percent: '32.1%', caption: t('sessions_page.try_on_funnel.captions.added_to_cart'), iconBg: '#FFEDD5', iconTone: 'warning' },
    { icon: OrderFulfilledIcon, value: '213', label: t('sessions_page.try_on_funnel.steps.purchased'), percent: '7.5%', caption: t('sessions_page.try_on_funnel.captions.purchased'), iconBg: '#CCFBF1', iconTone: 'success' },
];

const FunnelStep = ({ step, index }) => (
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
                    {index + 1}. {step.label}
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

const TryOnFunnel = () => {
    const { t } = useTranslation();
    const FUNNEL_STEPS = getFunnelSteps(t);

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
                    {FUNNEL_STEPS.map((step, index) => (
                        <InlineStack key={step.label} gap="200" blockAlign="center" wrap={false} style={{ flex: 1 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <FunnelStep step={step} index={index} />
                            </div>
                            {index < FUNNEL_STEPS.length - 1 && (
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
    SECTION 5: DONUT CHARTS (device / browser)
    ============================================ */
const getDeviceData = (t) => [
    { label: t('sessions_page.sessions_by_device.mobile'), value: 2021, percent: '71.0%', color: '#3B82F6' },
    { label: t('sessions_page.sessions_by_device.desktop'), value: 623, percent: '21.9%', color: '#22C55E' },
    { label: t('sessions_page.sessions_by_device.tablet'), value: 149, percent: '5.2%', color: '#8B5CF6' },
    { label: t('sessions_page.sessions_by_device.other'), value: 54, percent: '1.9%', color: '#F97316' },
];

const getBrowserData = (t) => [
    { label: t('sessions_page.sessions_by_browser.safari'), value: 1236, percent: '43.4%', color: '#3B82F6' },
    { label: t('sessions_page.sessions_by_browser.chrome'), value: 1071, percent: '37.6%', color: '#22C55E' },
    { label: t('sessions_page.sessions_by_browser.samsung_internet'), value: 238, percent: '8.4%', color: '#8B5CF6' },
    { label: t('sessions_page.sessions_by_browser.edge'), value: 139, percent: '4.9%', color: '#F97316' },
    { label: t('sessions_page.sessions_by_browser.other'), value: 163, percent: '5.7%', color: '#9CA3AF' },
];

const DonutCard = ({ title, data, total, buttonLabel }) => {
    const { t } = useTranslation();

    return (
        <Card padding="500">
            <BlockStack gap="400">
                <Text variant="headingMd" as="h3" fontWeight={600}>
                    {title}
                </Text>

                <InlineStack gap="600" blockAlign="start" wrap={false}>
                    {/* Donut */}
                    <div
                        className="donut-chart-wrapper"
                        style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}
                    >
                        <style>{`
                            .donut-chart-wrapper svg circle {
                                stroke-width: 32px !important;
                            }
                            .donut-chart-wrapper [class*="_ContentWrapper_"] {
                                display: none !important;
                            }
                        `}</style>
                        <DonutChart
                            data={data.map((item) => ({
                                name: item.label,
                                data: [{ key: item.label, value: item.value }],
                                color: item.color,
                            }))}
                            showLegend={false}
                            isAnimated={false}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                pointerEvents: 'none',
                            }}
                        >
                            <Text variant="heading2xl" as="p" fontWeight={700}>
                                {total}
                            </Text>
                            <Text variant="bodyMd" as="p" tone="subdued">
                                {t('sessions_page.common.sessions')}
                            </Text>
                        </div>
                    </div>

                    {/* Right column: legend + button */}
                    <BlockStack gap="400" style={{ flex: 1 }}>
                        <BlockStack gap="300">
                            {data.map((item) => (
                                <InlineStack key={item.label} align="space-between" blockAlign="center" gap="400">
                                    <InlineStack gap="200" blockAlign="center" wrap={false}>
                                        <div
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: item.color,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Text variant="bodyLg" as="span" fontWeight={500}>
                                            {item.label}
                                        </Text>
                                    </InlineStack>
                                    <Text variant="bodyLg" as="span" tone="subdued">
                                        {item.value.toLocaleString()} ({item.percent})
                                    </Text>
                                </InlineStack>
                            ))}

                            <Button fullWidth size="large">{buttonLabel}</Button>

                        </BlockStack>




                    </BlockStack>
                </InlineStack>
            </BlockStack>
        </Card>
    );
};

const SessionsCharts = () => {
    const { t } = useTranslation();
    const DEVICE_DATA = getDeviceData(t);
    const BROWSER_DATA = getBrowserData(t);

    return (
        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
            <DonutCard title={t('sessions_page.sessions_by_device.title')} data={DEVICE_DATA} total="2,847" buttonLabel={t('sessions_page.sessions_by_device.view_device_details')} />
            <DonutCard title={t('sessions_page.sessions_by_browser.title')} data={BROWSER_DATA} total="2,847" buttonLabel={t('sessions_page.sessions_by_browser.view_browser_details')} />
        </InlineGrid>
    );
};

/* ============================================
    SECTION 6: TOP / LOWEST PERFORMING PRODUCTS
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

const ProductPerformanceTable = ({ title, products, sortLabel, lowPerforming = false }) => {
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
    const [period, setPeriod] = useState('30d');

    return (
        <Page fullWidth>
            <BlockStack gap="400">
                <SessionsHeader period={period} onPeriodChange={setPeriod} />
                <SessionsKpiCards />
                <SessionsOverTimeChart />
                <TryOnFunnel />
                <SessionsCharts />
                <SessionsProductTables />
            </BlockStack>
        </Page>
    );
};

export default SessionsPage;