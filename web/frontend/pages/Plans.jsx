import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Page,
    Card,
    Box,
    BlockStack,
    InlineStack,
    InlineGrid,
    ProgressBar,
    Text,
    Button,
    Icon,
    Badge,
} from '@shopify/polaris';
import {
    CreditCardIcon,
    ChartLineIcon,
    InfoIcon,
    CheckIcon,
    ExternalIcon,
} from '@shopify/polaris-icons';

/* ============================================
    PLANS PAGE
    ============================================ */
const PlansPage = () => {
    const { t } = useTranslation();
    const [cycle, setCycle] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState('growth');

    /* ============================================
        SEGMENTED TOGGLE (Monthly / Yearly)
        Reused pattern from the period toggle on Sessions.
        ============================================ */
    const BillingCycleToggle = ({ value, onChange }) => {
        const options = [
            { label: t('plans_page.monthly'), value: 'monthly' },
            { label: t('plans_page.yearly'), value: 'yearly', badge: t('plans_page.save_20') },
        ];

        return (
            <InlineStack gap="150" blockAlign="center">
                {options.map((option) => {
                    const isActive = option.value === value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                border: isActive ? '1px solid #0F6E5C' : '1px solid #E1E3E5',
                                borderRadius: '8px',
                                padding: '6px 14px',
                                background: '#FFFFFF',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: isActive ? '#0F6E5C' : '#616161',
                            }}
                        >
                            {option.label}
                            {option.badge && (
                                <span
                                    style={{
                                        background: '#E6F4EA',
                                        color: '#1E8E3E',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {option.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </InlineStack>
        );
    };

    const LightningBoltIcon = ({ color = '#EA8A00', size = 20 }) => (
        <div
            style={{
                width: `${size + 12}px`,
                height: `${size + 12}px`,
                borderRadius: '50%',
                border: `1.5px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L4.5 13.5H11L10 22L19.5 9.5H13L13 2Z" fill={color} />
            </svg>
        </div>
    );

    /* ============================================
        SECTION: PRICING CARDS
        ============================================ */
    const PricingFeature = ({ text, note }) => (
        <InlineStack gap="150" blockAlign="start" wrap={false}>
            <div style={{ marginTop: '1px' }}>
                <Box background="bg-fill-success-secondary" borderRadius="full" padding="025">
                    <Icon source={CheckIcon} tone="success" />
                </Box>
            </div>
            <BlockStack gap="0" >
                <Text variant="bodySm" as="span">
                    {text}
                </Text>
                {note && (
                    <Text variant="bodySm" as="span" tone="subdued">
                        {note}
                    </Text>
                )}
            </BlockStack>
        </InlineStack>
    );

    /* ============================================
        FREE PLAN CARD
        ============================================ */
    const FreePlanCard = () => (
        <Card padding="500">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '28px' }}>
                <div style={{ flex: 1 }}>
                    <BlockStack gap="500">
                        <BlockStack gap="050">
                            <Text variant="headingMd" as="h3" fontWeight={600}>
                                {t('plans_page.free')}
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                                {t('plans_page.pay_as_you_go')}
                            </Text>
                        </BlockStack>

                        <BlockStack gap="100">
                            <InlineStack gap="100" blockAlign="baseline">
                                <Text variant="heading2xl" as="p">
                                    $0
                                </Text>
                                <Text variant="bodyMd" as="span" tone="subdued">
                                    /month
                                </Text>
                            </InlineStack>
                            <Text variant="bodySm" as="p" fontWeight="medium">
                                + $0.05 per session
                            </Text>
                        </BlockStack>

                        <Box borderBlockStartWidth="025" borderColor="border-subdued" paddingBlockStart="400">
                            <BlockStack gap="300">
                                <Text variant="bodySm" as="p" fontWeight="semibold">
                                    {t('plans_page.includes')}
                                </Text>
                                <BlockStack gap="300">
                                    <PricingFeature text={t('plans_page.unlimited_tryon_sessions')} />
                                    <PricingFeature text={t('plans_page.7_day_analytics')} />
                                    <PricingFeature text={t('plans_page.standard_tryon_button')} />
                                    <PricingFeature text={t('plans_page.community_support')} note={`(${t('plans_page.community_support_note')})`} />
                                </BlockStack>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </div>

                <div style={{ paddingTop: '8px' }}>
                    <Button fullWidth size="large" disabled>
                        {t('plans_page.current_plan_badge')}
                    </Button>
                </div>
            </div>
        </Card>
    );

    /* ============================================
        GROWTH PLAN CARD (Most Popular - Highlighted)
        ============================================ */
    const GrowthPlanCard = () => (
        <Card padding="800">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: '28px'
                }}
            >
                <div>
                    <BlockStack gap="500">
                        <InlineStack align="space-between" blockAlign="start" wrap={false}>
                            <BlockStack gap="050">
                                <Text variant="headingMd" as="h3" fontWeight={600}>
                                    {t('plans_page.growth')}
                                </Text>
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {t('plans_page.for_growing_stores')}
                                </Text>
                            </BlockStack>

                            <div
                                style={{
                                    background: '#0F6E5C',
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    padding: '4px 12px',
                                    borderRadius: '999px',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}
                            >
                                {t('plans_page.most_popular')}
                            </div>
                        </InlineStack>

                        <BlockStack gap="100">
                            <InlineStack gap="100" blockAlign="baseline">
                                <Text variant="heading2xl" as="p">
                                    $79
                                </Text>
                                <Text variant="bodyMd" as="span" tone="subdued">
                                    /month
                                </Text>
                            </InlineStack>
                            <Text variant="bodySm" as="p" fontWeight="medium">
                                Up to 5,000 sessions included
                            </Text>
                            <Text variant="bodySm" as="p" fontWeight="medium">
                                Then $0.04 per extra session
                            </Text>
                        </BlockStack>

                        <Box borderBlockStartWidth="025" borderColor="border-subdued" paddingBlockStart="400">
                            <BlockStack gap="300">
                                <Text variant="bodySm" as="p" fontWeight="semibold">
                                    {t('plans_page.everything_in_free_plus')}
                                </Text>
                                <BlockStack gap="300">
                                    <PricingFeature text={t('plans_page.90_day_analytics')} />
                                    <PricingFeature text={t('plans_page.custom_button_branding')} />
                                    <PricingFeature
                                        text={t('plans_page.email_notifications')}
                                        note={`(${t('plans_page.email_notifications_note')})`}
                                    />
                                </BlockStack>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </div>

                <div >
                    <Button fullWidth size="large" variant="primary">
                        {t('plans_page.upgrade_to_growth_btn')}
                    </Button>
                </div>
            </div>
        </Card>
    );

    /* ============================================
        SCALE PLAN CARD
        ============================================ */
    const ScalePlanCard = () => (
        <Card padding="500">

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '28px' }}>
                <div style={{ flex: 1 }}>
                    <BlockStack gap="500">
                        <BlockStack gap="050">
                            <Text variant="headingMd" as="h3" fontWeight={600}>
                                {t('plans_page.scale')}
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                                {t('plans_page.for_high_volume_stores')}
                            </Text>
                        </BlockStack>

                        <BlockStack gap="100">
                            <InlineStack gap="100" blockAlign="baseline">
                                <Text variant="heading2xl" as="p">
                                    $199
                                </Text>
                                <Text variant="bodyMd" as="span" tone="subdued">
                                    /month
                                </Text>
                            </InlineStack>
                            <Text variant="bodySm" as="p" fontWeight="medium">
                                Up to 20,000 sessions included
                            </Text>
                            <Text variant="bodySm" as="p" fontWeight="medium">
                                Then $0.03 per extra session
                            </Text>
                        </BlockStack>

                        <Box borderBlockStartWidth="025" borderColor="border-subdued" paddingBlockStart="400">
                            <BlockStack gap="300">
                                <Text variant="bodySm" as="p" fontWeight="semibold">
                                    {t('plans_page.everything_in_growth_plus')}
                                </Text>
                                <BlockStack gap="300">
                                    <PricingFeature text={t('plans_page.unlimited_analytics')} />
                                    <PricingFeature text={t('plans_page.export_analytics')} />
                                    <PricingFeature text={t('plans_page.priority_support')} note={`(${t('plans_page.priority_support_note')})`} />
                                    <PricingFeature text={t('plans_page.multilanguage_button')} />
                                </BlockStack>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </div>

                <div style={{ paddingTop: '8px' }}>
                    <Button fullWidth size="large" variant="primary">
                        {t('plans_page.upgrade_to_scale_btn')}
                    </Button>
                </div>
            </div>
        </Card>
    );

    const getCardWrapperStyle = (planKey) => ({
        border: selectedPlan === planKey ? '2px solid #0F6E5C' : '1px solid #E1E3E5',
        borderRadius: '14px',
        boxShadow: selectedPlan === planKey ? '0 4px 12px rgba(15, 110, 92, 0.15)' : 'none',
        display: 'grid',
        cursor: 'pointer',
    });

    /* ============================================
        SECTION: CURRENT PLAN CARD
        ============================================ */
    const CurrentPlanCard = () => (
        <Card padding="0">
            {/* Top: plan identity */}
            <div style={{ borderBottom: '1px solid #F1F2F3' }}>
                <Box padding="600">
                    <InlineStack align="space-between" blockAlign="start">
                        <InlineStack gap="300" blockAlign="center" wrap={false}>
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '10px',
                                    background: '#2fab94',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <Icon source={ChartLineIcon} tone="text-inverse" />
                            </div>
                            <BlockStack gap="0">
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {t('plans_page.current_plan')}
                                </Text>
                                <Text variant="heading2xl" as="p">
                                    {t('plans_page.free')}
                                </Text>
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {t('plans_page.pay_as_you_go')}
                                </Text>
                            </BlockStack>
                        </InlineStack>
                        <Button disclosure>{t('plans_page.change_plan')}</Button>
                    </InlineStack>
                </Box>
            </div>

            {/* Middle: usage */}
            <div style={{ borderBottom: '1px solid #F1F2F3' }}>
                <Box padding="600">
                    <BlockStack gap="300">
                        <InlineStack gap="100" blockAlign="center" wrap={false}>
                            <Text variant="bodyMd" as="p" fontWeight="medium">
                                {t('plans_page.this_cycle_usage')}
                            </Text>
                            <Text> <Icon source={InfoIcon} tone="subdued" /> </Text>
                        </InlineStack>

                        <InlineStack gap="600" blockAlign="start" wrap={false}>
                            {/* Left: sessions + spend */}
                            <div style={{ flexShrink: 0 }}>
                                <BlockStack gap="150">
                                    <InlineStack gap="100" blockAlign="baseline">
                                        <Text variant="heading2xl" as="p">
                                            1,284
                                        </Text>
                                        <Text variant="bodyMd" as="span" tone="subdued">
                                            {t('plans_page.sessions')}
                                        </Text>
                                    </InlineStack>
                                    <Text variant="bodyMd" as="p" tone="subdued">
                                        $64.20 {t('plans_page.spent')}
                                    </Text>
                                </BlockStack>
                            </div>

                            {/* Right: progress bar + labels */}
                            <div style={{ flex: 1 }}>
                                <BlockStack gap="200">
                                    <InlineStack align="end">
                                        <BlockStack gap="0" inlineAlign="end">
                                            <Text variant="bodySm" as="span" tone="subdued">
                                                1,284 {t('plans_page.of_unlimited_sessions')}
                                            </Text>
                                            <Text variant="bodySm" as="span" tone="subdued">
                                                {t('plans_page.this_cycle')}
                                            </Text>
                                        </BlockStack>
                                    </InlineStack>

                                    <div style={{ position: 'relative', paddingTop: '20px' }}>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '82%',
                                                transform: 'translateX(-50%)',
                                            }}
                                        >
                                            <Text variant="bodySm" as="span" tone="caution" fontWeight="semibold">
                                                82% {t('plans_page.used')}
                                            </Text>
                                        </div>
                                        <ProgressBar progress={82} size="small" tone="critical" />
                                    </div>

                                    <Text variant="bodySm" as="p" tone="subdued">
                                        {t('plans_page.usage_uncapped')}
                                    </Text>
                                </BlockStack>
                            </div>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </div>

            {/* Bottom: cycle stats */}
            <Box padding="600">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <BlockStack gap="050">
                        <Text variant="bodySm" as="p" tone="subdued">
                            {t('plans_page.cycle')}
                        </Text>
                        <Text variant="bodyMd" as="p" fontWeight="medium">
                            Jun 23 &ndash; Jul 22, 2026 (30 days)
                        </Text>
                    </BlockStack>
                    <BlockStack gap="050">
                        <Text variant="bodySm" as="p" tone="subdued">
                            {t('plans_page.next_invoice')}
                        </Text>
                        <Text variant="bodyMd" as="p" fontWeight="medium">
                            Jul 23, 2026
                        </Text>
                    </BlockStack>
                    <BlockStack gap="050">
                        <Text variant="bodySm" as="p" tone="subdued">
                            {t('plans_page.rate')}
                        </Text>
                        <Text variant="bodyMd" as="p" fontWeight="medium">
                            $0.05 {t('plans_page.per_session')}
                        </Text>
                    </BlockStack>
                    <div>
                        <BlockStack gap="050" inlineAlign="start">
                            <InlineStack gap="100" blockAlign="center">
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {t('plans_page.auto_recharge')}
                                </Text>
                                <Icon source={InfoIcon} tone="subdued" />
                            </InlineStack>
                            <div style={{ display: 'inline-block' }}>
                                <Badge tone="success">On</Badge>
                            </div>
                        </BlockStack>
                    </div>
                </div>
            </Box>
        </Card>
    );

    /* ============================================
        SECTION: BREAKEVEN WARNING BANNER
        ============================================ */
    const BreakevenBanner = () => (
        <div
            style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '12px',
                padding: '20px 24px',
            }}
        >
            <InlineStack align="space-between" blockAlign="center" gap="400">
                <InlineStack gap="300" blockAlign="center" wrap={false}>
                    <LightningBoltIcon />
                    <BlockStack gap="050">
                        <Text variant="bodyMd" as="p" fontWeight="semibold">
                            {t('plans_page.breakeven_title')}
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                            {t('plans_page.breakeven_description')}
                        </Text>
                    </BlockStack>
                </InlineStack>
                <div style={{ flexShrink: 0 }}>
                    <Button>{t('plans_page.upgrade_to_growth')}</Button>
                </div>
            </InlineStack>
        </div>
    );

    /* ============================================
        PRICING SECTION
        ============================================ */
    const PricingSection = () => (
        <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="start">
                <BlockStack gap="050">
                    <Text variant="headingLg" as="h2" fontWeight={600}>
                        {t('plans_page.choose_right_plan')}
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                        {t('plans_page.all_plans_include')}
                    </Text>
                </BlockStack>
                <BillingCycleToggle value={cycle} onChange={setCycle} />
            </InlineStack>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
                <div style={getCardWrapperStyle('free')} onClick={() => setSelectedPlan('free')}>
                    <FreePlanCard />
                </div>
                <div style={getCardWrapperStyle('growth')} onClick={() => setSelectedPlan('growth')}>
                    <GrowthPlanCard />
                </div>
                <div style={getCardWrapperStyle('scale')} onClick={() => setSelectedPlan('scale')}>
                    <ScalePlanCard />
                </div>
            </div>

            <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="100" blockAlign="center">
                    <Icon source={InfoIcon} tone="subdued" />
                    <Text variant="bodySm" as="p" tone="subdued">
                        {t('plans_page.unused_sessions_note')}
                    </Text>
                </InlineStack>
                <InlineStack gap="100" blockAlign="center">
                    <Text variant="bodySm" as="p" tone="subdued">
                        {t('plans_page.need_help')}
                    </Text>
                    <Button variant="plain">
                        <InlineStack gap="050" blockAlign="center" wrap={false}>
                            <Text as="span">{t('plans_page.contact_support')}</Text>
                            <Icon source={ExternalIcon} />
                        </InlineStack>
                    </Button>
                </InlineStack>
            </InlineStack>
        </BlockStack>
    );

    return (
        <Page fullWidth>
            <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="start">
                    <BlockStack gap="050">
                        <Text variant="heading2xl" as="h1">
                            {t('plans_page.billing_title')}
                        </Text>
                        <Text variant="bodyMd" as="p" tone="subdued">
                            {t('plans_page.billing_subtitle')}
                        </Text>
                    </BlockStack>
                    <Button icon={CreditCardIcon} disclosure>
                        {t('plans_page.manage_payment_method')}
                    </Button>
                </InlineStack>

                <CurrentPlanCard />
                <BreakevenBanner />
                <PricingSection />
                <div style={{ marginTop: '10px' }}>

                </div>
            </BlockStack>
        </Page>
    );
};

export default PlansPage;
