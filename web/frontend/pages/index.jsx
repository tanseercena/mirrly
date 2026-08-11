import React, { useContext, useEffect, useState } from "react";
import {
    Page,
    Card,
    InlineGrid,
    BlockStack,
    InlineStack,
    Text,
    Box,
    Button,
    Badge,
    ProgressBar,
    Icon,
    SkeletonBodyText,
    SkeletonDisplayText,
    Divider,
    Avatar,
    Thumbnail,
    IndexTable,
    LegacyCard,
    useIndexResourceState
} from "@shopify/polaris";
import { AppContext } from "../components/providers/AppProvider.jsx";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../components/PageLoader.jsx";
import SessionFunnelDateFilter from '../components/SessionFunnelDateFilter';

import useReviewModal from "../hooks/useReviewModal.js";
import {
    CalendarIcon,
    ChevronDownIcon,
    ClockIcon,
    ArrowRightIcon,
    XSmallIcon,
    PlayIcon,
    ArrowUpIcon,
    CartIcon,
    DatabaseIcon,
    CheckSmallIcon,
    InfoIcon,
    ChartVerticalFilledIcon,
    CheckIcon,
    CameraIcon,
    ImageIcon,
    MagicIcon,
    ChevronRightIcon,
    ExternalIcon,
    MenuHorizontalIcon
} from "@shopify/polaris-icons";

const IndexPage = () => {
    const navigate = useNavigate();
    const { isLoadingData, store } = useContext(AppContext);
    const { t } = useTranslation();

    const handlePricing = () => navigate("/pricing");

    // Shopify Review Modal Hook - triggers after 5 seconds on dashboard
    const { hasRequested: hasRequestedReview } = useReviewModal({
        delay: 5000,
        triggerContext: 'dashboard',
        enabled: true,
    });

    const [subscription, setSubscription] = useState(null);

    const sessions = [
        {
            id: '1',
            initials: 'JS',
            name: 'Jane Smith',
            location: 'New York, US',
            product: 'Classic Crewneck',
            variant: 'Gray / M',
            date: 'May 20, 2025',
            time: '2:34 PM',
            length: '48s',
            result: 'Added to cart',
            resultTone: 'success',
        },
        {
            id: '2',
            initials: 'MK',
            name: 'Mike Chen',
            location: 'Toronto, CA',
            product: 'Essential Hoodie',
            variant: 'Black / L',
            date: 'May 20, 2025',
            time: '1:12 PM',
            length: '37s',
            result: 'Completed',
            resultTone: 'info',
        },
        {
            id: '3',
            initials: 'AT',
            name: 'Anna Taylor',
            location: 'London, UK',
            product: 'Relaxed Tee',
            variant: 'White / M',
            date: 'May 20, 2025',
            time: '11:48 AM',
            length: '52s',
            result: 'Completed',
            resultTone: 'info',
        },
        {
            id: '4',
            initials: 'DR',
            name: 'David Rodriguez',
            location: 'Madrid, ES',
            product: 'Zip Jacket',
            variant: 'Green / L',
            date: 'May 20, 2025',
            time: '11:18 AM',
            length: '29s',
            result: 'Started',
            resultTone: 'attention',
        },
    ];

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await fetch("/api/subscription");
                if (response.ok) {
                    const data = await response.json();
                    setSubscription(data.data.subscription);
                }
            } catch (error) {
                console.error("Error fetching subscription:", error);
            }
        };
        fetchSubscription();
    }, []);

    if (isLoadingData) {
        return <PageLoader />;
    }

    /**
     * Metric Card Skeleton Component
     * Placeholder for overview metrics
     * Structure: Icon → Title → Value → Trend → Supporting text
     */
    const MetricCardSkeleton = () => (
        <Card>
            <Box padding="500" minHeight="280px">
                <BlockStack gap="400">
                    {/* Icon at top */}
                    <Box width="56px" height="56px" background="bg-surface-secondary" borderRadius="200" />

                    {/* Metric Title */}
                    <SkeletonBodyText lines={1} />

                    {/* Large Metric Value */}
                    <Box width="50%">
                        <SkeletonDisplayText size="extraLarge" />
                    </Box>

                    {/* Growth/Change Row */}
                    <Box width="35%">
                        <SkeletonBodyText lines={1} />
                    </Box>

                    {/* Supporting Comparison Text */}
                    <Box width="85%">
                        <SkeletonBodyText lines={1} />
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );

    /**
     * Status configuration lookup - defined once outside the component
     * so it isn't recreated on every render.
     */
    const STEP_STATUS_CONFIG = {
        completed: {
            background: '#10B981',
            statusText: t('dashboard.status.completed'),
            statusTone: 'success',
            renderIcon: () => <Icon source={CheckIcon} tone="text-inverse" />,
        },
        current: {
            background: '#F59E0B',
            statusText: t('dashboard.status.pending'),
            statusTone: 'warning',
            renderIcon: (stepNumber) => (
                <Text variant="bodySm" as="span" fontWeight="bold" tone="text-inverse">
                    {stepNumber}
                </Text>
            ),
        },
        pending: {
            background: '#6B7280',
            statusText: t('dashboard.status.pending'),
            statusTone: 'subdued',
            renderIcon: (stepNumber) => (
                <Text variant="bodySm" as="span" fontWeight="bold" tone="text-inverse">
                    {stepNumber}
                </Text>
            ),
        },
    };

    /**
     * Setup Step Component
     * Displays a single setup progress step (circle + label + status)
     */
    const SetupStep = ({ label, status, stepNumber }) => {
        const config = STEP_STATUS_CONFIG[status] ?? STEP_STATUS_CONFIG.pending;

        return (
            <InlineStack gap="300" blockAlign="center" wrap={false}>
                <div
                    style={{
                        width: '28px',
                        height: '28px',
                        minWidth: '28px',
                        borderRadius: '50%',
                        background: config.background,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {config.renderIcon(stepNumber)}
                </div>

                <BlockStack gap="0">
                    <Text variant="bodySm" as="p" fontWeight="semibold">
                        {label}
                    </Text>
                    <Text variant="bodyXs" as="p" fontWeight="medium" tone={config.statusTone}>
                        {config.statusText}
                    </Text>
                </BlockStack>
            </InlineStack>
        );
    };

    /**
     * Setup Steps Row
     * Renders a list of steps with chevron connectors between them,
     * so callers just pass data instead of manually interleaving <Icon> separators.
     */
    const SetupStepsRow = ({ steps }) => (
        <Box paddingInline="1600">
            <InlineStack gap="600" blockAlign="center" align="" wrap={false}>
                {steps.map((step, index) => (
                    <React.Fragment key={step.label}>
                        <SetupStep {...step} stepNumber={index + 1} />
                        {index < steps.length - 1 &&  <Text> <Icon source={ArrowRightIcon} tone="subdued" /> </Text>}
                    </React.Fragment>
                ))}
            </InlineStack>
        </Box>
    );

    /* ============================================
        SETUP PROGRESS BANNER
        Full-width section
        ============================================ */
    const setupSteps = [
        { label: t('dashboard.setup_progress_banner.steps.product_type'), status: 'completed' },
        { label: t('dashboard.setup_progress_banner.steps.theme_embed'), status: 'completed' },
        { label: t('dashboard.setup_progress_banner.steps.live_test'), status: 'current' },
        { label: t('dashboard.setup_progress_banner.steps.choose_plan'), status: 'pending' },
    ];


    return (

        <Page
            title={t('dashboard.title')}
            primaryAction={<LanguageSelector homepage />}
        >
            <BlockStack gap="500">

                {/* ============================================
                    SETUP PROGRESS BANNER
                    Full-width section
                    ============================================ */}
                <div
                    style={{
                        background: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        borderRadius: '12px',
                        padding: '24px',
                    }}
                >
                    <BlockStack gap="400">
                        {/* Row 1: Header with icon, title, CTA, and close */}
                        <InlineStack align="space-between" blockAlign="start" wrap={false}>
                            <InlineStack gap="300" blockAlign="start" wrap={false}>
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        minWidth: '48px',
                                        borderRadius: '50%',
                                        border: '2px solid #F59E0B',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Icon source={ClockIcon} tone="warning" />
                                </div>

                                <BlockStack gap="100">
                                    <Text variant="headingMd" as="h3" fontWeight={600}>
                                        {t('dashboard.setup_progress_banner.title')}
                                    </Text>
                                    <Text variant="bodyMd" as="p" tone="subdued">
                                        {t('dashboard.setup_progress_banner.subtitle')}
                                    </Text>
                                </BlockStack>
                            </InlineStack>

                            <InlineStack gap="200" blockAlign="center" wrap={false}>
                                <Button variant="primary" icon={ArrowRightIcon}>
                                    {t('dashboard.setup_progress_banner.continue_live_test')}
                                </Button>
                                <Button icon={XSmallIcon} variant="tertiary" accessibilityLabel={t('dashboard.dismiss')} />
                            </InlineStack>
                        </InlineStack>

                        {/* Row 2: Step Indicators */}
                        <SetupStepsRow steps={setupSteps} />
                    </BlockStack>
                </div>

                {/* ============================================
                    OVERVIEW SECTION
                    Section heading, description, date-range selector, 4 metric cards
                    ============================================ */}
                <BlockStack gap="200">
                    {/* Overview Header - Heading and Date Selector on same row */}
                    <InlineStack align="space-between">
                        <Text variant="headingLg" as="h2" fontWeight={600}>
                            {t('dashboard.overview.title')}
                        </Text>
                        <SessionFunnelDateFilter />
                    </InlineStack>

                    {/* Description below heading */}
                    <Text variant="bodyMd" as="p" tone="subdued">
                        {t('dashboard.overview.description')}
                    </Text>

                    {/* Metric Cards Grid - 4 real columns */}
                    <InlineGrid columns={{ xs: 1, sm: 2, md: 4, lg: 4 }} gap="400">

                        {/* Sessions this cycle */}
                        <Card>
                            <BlockStack gap="300" align="start">
                                <Box
                                    background="bg-fill-info-secondary"
                                    borderRadius="200"
                                    padding="200"
                                    minWidth="40px"
                                    maxWidth="40px"
                                >
                                    <Icon source={PlayIcon} tone="info" />
                                </Box>
                                <BlockStack gap="200">
                                    <Text variant="bodyMd" as="p" tone="subdued">
                                        {t('dashboard.overview.sessions_this_cycle')}
                                    </Text>
                                    <Text variant="heading2xl" as="h3">
                                        2,847
                                    </Text>
                                    <InlineStack direction="row" alignItems="start">
                                        <Text><Icon source={ArrowUpIcon} tone="success" /> </Text>
                                        <Text variant="bodyLg" as="span" tone="success" fontWeight="bold">
                                            12%
                                        </Text>
                                    </InlineStack>
                                    <Text gap="200" variant="bodySm" as="p" tone="subdued">
                                        {t('dashboard.overview.vs_previous_30_days')}
                                    </Text>
                                </BlockStack>
                            </BlockStack>
                        </Card>

                        {/* Add-to-cart after try-on */}
                        <Card>
                            <BlockStack gap="300">
                                <Box
                                    background="bg-fill-success-secondary"
                                    borderRadius="200"
                                    padding="200"
                                    minWidth="40px"
                                    maxWidth="40px"
                                >
                                    <Icon source={CartIcon} tone="success" />
                                </Box>
                                <BlockStack gap="200">
                                    <Text variant="bodyMd" as="p" tone="subdued">
                                        {t('dashboard.overview.add_to_cart_after_try_on')}
                                    </Text>
                                    <Text variant="heading2xl" as="h3">
                                        342
                                    </Text>
                                    <InlineStack blockAlign="center">
                                        <Text> <Icon source={ArrowUpIcon} tone="success" /> </Text>
                                        <Text variant="bodyLg" as="span" tone="success" fontWeight="bold">
                                            18%
                                        </Text>
                                    </InlineStack>
                                    <Text gap="200" variant="bodySm" as="p" tone="subdued">
                                        12.0% {t('dashboard.overview.conversion_rate')}
                                    </Text>
                                </BlockStack>
                            </BlockStack>
                        </Card>

                        {/* Avg. session length */}
                        <Card>
                            <BlockStack gap="300">
                                <Box
                                    background="bg-fill-info-secondary"
                                    borderRadius="200"
                                    padding="200"
                                    minWidth="40px"
                                    maxWidth="40px"
                                >
                                    <Icon source={ClockIcon} tone="info" />
                                </Box>
                                <BlockStack gap="200">
                                    <Text variant="bodyMd" as="p" tone="subdued">
                                        {t('dashboard.overview.avg_session_length')}
                                    </Text>
                                    <Text variant="heading2xl" as="h3">
                                        42s
                                    </Text>
                                    <InlineStack gap="100" blockAlign="center">
                                        <Text> <Icon source={ArrowUpIcon} tone="success" /> </Text>
                                        <Text variant="bodyLg" as="span" tone="success" fontWeight="bold">
                                            6%
                                        </Text>
                                    </InlineStack>
                                    <Text gap="200" variant="bodySm" as="p" tone="subdued">
                                        {t('dashboard.overview.vs_previous_30_days')}
                                    </Text>
                                </BlockStack>
                            </BlockStack>
                        </Card>

                        {/* Spend this cycle */}
                        <Card>
                            <BlockStack gap="300">
                                <Box
                                    background="bg-fill-magic-secondary"
                                    borderRadius="200"
                                    padding="200"
                                    minWidth="40px"
                                    maxWidth="40px"
                                >
                                    <Icon source={DatabaseIcon} tone="magic" />
                                </Box>
                                <BlockStack gap="200">
                                    <Text variant="bodyMd" as="p" tone="subdued">
                                        {t('dashboard.overview.spend_this_cycle')}
                                    </Text>
                                    <Text variant="heading2xl" as="h3">
                                        $18.42
                                    </Text>
                                    <InlineStack blockAlign="center">
                                        <Text> <Icon source={ArrowUpIcon} tone="success" /> </Text>
                                        <Text variant="bodyLg" as="span" tone="success" fontWeight="bold">
                                            8%
                                        </Text>
                                    </InlineStack>
                                    <Text gap="200" variant="bodySm" as="p" tone="subdued">
                                        $0.0065 {t('dashboard.overview.per_session')}
                                    </Text>
                                </BlockStack>
                            </BlockStack>
                        </Card>

                    </InlineGrid>
                </BlockStack>

                {/* ============================================
                    SESSION USAGE + CURRENT PLAN
                    Two equal-width cards in responsive two-column layout
                    ============================================ */}
                <InlineGrid columns={{ xs: 1, md: 2, lg: 2 }} gap="400">
                    {/* Session Usage Card */}
                    <Card>
                        <Box padding="400" borderColor="border-subdued">
                            <InlineStack align="space-between" blockAlign="center">
                                <InlineStack gap="150" blockAlign="center">
                                    <Text variant="headingLg" as="h5" fontWeight={600}>
                                        {t('dashboard.session_usage.title')}
                                    </Text>
                                    <Icon source={InfoIcon} tone="subdued" />
                                </InlineStack>
                                <Text variant="bodySm" as="span" tone="subdued">
                                    {t('dashboard.session_usage.resets_on', { date: 'May 31, 2025' })}
                                </Text>
                            </InlineStack>
                        </Box>

                        <Box padding="400">
                            <BlockStack gap="500">
                                {/* Plan usage box */}
                                <Box
                                    background="bg-surface-secondary"
                                    borderRadius="200"
                                    borderWidth="025"
                                    borderColor="border-subdued"
                                    padding="400"
                                >
                                    <BlockStack gap="300">
                                        <BlockStack gap="500">
                                            <InlineStack gap="200" blockAlign="center">
                                                <Text variant="headingMd" as="p" fontWeight="semibold">
                                                    {t('dashboard.session_usage.growth_plan')}
                                                </Text>
                                                <Badge tone="success">{t('dashboard.session_usage.current_plan')}</Badge>
                                            </InlineStack>

                                            <InlineStack align="space-between" blockAlign="center">
                                                <Text variant="headingLg" as="p">
                                                    2,847{' '}
                                                    <Text variant="bodyMd" as="span" tone="subdued" fontWeight="regular">
                                                        {t('dashboard.session_usage.of_sessions', { count: '5,000' })}
                                                    </Text>
                                                </Text>
                                                <Text variant="bodyMd" as="span" tone="subdued">
                                                    {t('dashboard.session_usage.used', { percentage: '57%' })}
                                                </Text>
                                            </InlineStack>
                                        </BlockStack>
                                        <ProgressBar progress={57} size="medium" tone="primary" />
                                    </BlockStack>
                                </Box>

                                {/* Sessions remaining callout */}
                                <Box
                                    background="bg-fill-info-secondary"
                                    borderRadius="200"
                                    padding="400"
                                >
                                    <InlineStack gap="300" blockAlign="center" wrap={false}>
                                        <Text> <Icon source={ChartVerticalFilledIcon} tone="info" /> </Text>
                                        <BlockStack gap="050">
                                            <Text variant="bodyMd" as="p" fontWeight="semibold" tone="info">
                                                {t('dashboard.session_usage.sessions_remaining', { count: '2,153' })}
                                            </Text>
                                            <Text variant="bodySm" as="p" tone="subdued">
                                                {t('dashboard.session_usage.need_more_upgrade')}
                                            </Text>
                                        </BlockStack>
                                    </InlineStack>
                                </Box>
                            </BlockStack>
                        </Box>
                    </Card>

                    {/* Current Plan Card */}
                    <Card>
                        <Box padding="400" borderColor="border-subdued">
                            <InlineStack align="space-between" blockAlign="center">
                                <Text variant="headingLg" as="h5" fontWeight={600}>
                                    {t('dashboard.current_plan.title')}
                                </Text>
                                <Badge tone="magic">Growth</Badge>
                            </InlineStack>
                        </Box>

                        <Box padding="400">
                            <BlockStack gap="400">
                                <BlockStack gap="100">
                                    <InlineStack gap="100" blockAlign="baseline">
                                        <Text variant="headingXl" as="p">
                                            $29
                                        </Text>
                                        <Text variant="bodyMd" as="span" tone="subdued">
                                            {t('plans.per_month')}
                                        </Text>
                                    </InlineStack>
                                    <Text variant="bodyMd" as="p" tone="subdued">
                                        {t('dashboard.current_plan.up_to_sessions', { count: '5,000' })}
                                    </Text>
                                </BlockStack>

                                <BlockStack gap="150">
                                    {[
                                        t('dashboard.current_plan.all_core_features'),
                                        t('dashboard.current_plan.sessions_per_month', { count: '5,000' }),
                                        t('dashboard.current_plan.high_quality_results'),
                                        t('dashboard.current_plan.priority_support'),
                                        t('dashboard.current_plan.usage_analytics'),
                                    ].map((feature) => (
                                        <InlineStack key={feature} gap="150" blockAlign="center">
                                            <Box
                                                background="bg-fill-success-secondary"
                                                borderRadius="full"
                                                padding="025"
                                            >
                                                <Icon source={CheckIcon} tone="success" />
                                            </Box>
                                            <Text variant="bodysm" as="span">
                                                {feature}
                                            </Text>
                                        </InlineStack>
                                    ))}
                                </BlockStack>

                                <InlineStack gap="200">
                                    <Button size="large">{t('dashboard.current_plan.manage_plan')}</Button>
                                    <Button size="large" variant="primary" >
                                        {t('dashboard.current_plan.view_all_plans')}
                                    </Button>
                                </InlineStack>
                            </BlockStack>
                        </Box>
                    </Card>
                </InlineGrid>

                {/* ============================================
                    SESSION FUNNEL
                    ============================================ 
                */}
                <Card>
                    <Box padding="400" borderColor="border-subdued">
                        <InlineStack align="space-between" blockAlign="start">
                            <BlockStack gap="100">
                                <Text variant="headingMd" as="h3" fontWeight={600}>
                                    {t('dashboard.session_funnel.title')}
                                </Text>
                                <Text variant="bodyMd" as="p" tone="subdued">
                                    {t('dashboard.session_funnel.description')}
                                </Text>
                            </BlockStack>
                            <SessionFunnelDateFilter />
                        </InlineStack>
                    </Box>

                    <Box padding="400">
                        <InlineStack align="space-between" blockAlign="center" wrap={false} gap="200">

                            {/* Step 1 - Camera opened */}
                            <Box width="100%">
                                <BlockStack gap="200" inlineAlign="center">
                                    <div style={{ position: 'relative', width: '100%', marginTop: "15px" }}>
                                        <Box
                                            borderWidth="025"
                                            borderColor="border-subdued"
                                            borderRadius="200"
                                            paddingBlockStart="600"
                                            paddingBlockEnd="400"
                                            paddingInline="300"
                                        >
                                            <BlockStack gap="050" inlineAlign="center">
                                                <Text variant="headingLg" as="p">
                                                    3,421
                                                </Text>
                                                <Text variant="bodyMd" as="p" tone="subdued">
                                                    {t('dashboard.session_funnel.camera_opened')}
                                                </Text>
                                            </BlockStack>
                                        </Box>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            <Box
                                                background="bg-fill-info-secondary"
                                                borderRadius="full"
                                                padding="300"
                                            >
                                                <Icon source={CameraIcon} tone="info" />
                                            </Box>
                                        </div>
                                    </div>
                                    <BlockStack gap="0" inlineAlign="center">
                                        <Text variant="bodyMd" as="p" fontWeight="semibold">
                                            100%
                                        </Text>
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {t('dashboard.session_funnel.of_product_page_clicks')}
                                        </Text>
                                    </BlockStack>
                                </BlockStack>
                            </Box>


                            <Text blockAlign="center" > <Icon source={ChevronRightIcon} tone="subdued" /> </Text>

                            {/* Step 2 - Try-on started */}
                            <Box width="100%">
                                <BlockStack gap="200" inlineAlign="center">
                                    <div style={{ position: 'relative', width: '100%', marginTop: "15px" }}>
                                        <Box
                                            borderWidth="025"
                                            borderColor="border-subdued"
                                            borderRadius="200"
                                            paddingBlockStart="600"
                                            paddingBlockEnd="400"
                                            paddingInline="300"
                                        >
                                            <BlockStack gap="050" inlineAlign="center">
                                                <Text variant="headingLg" as="p">
                                                    2,847
                                                </Text>
                                                <Text variant="bodyMd" as="p" tone="subdued">
                                                    {t('dashboard.session_funnel.try_on_started')}
                                                </Text>
                                            </BlockStack>
                                        </Box>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            <Box
                                                background="bg-fill-info-secondary"
                                                borderRadius="full"
                                                padding="300"
                                            >
                                                <Icon source={ImageIcon} tone="info" />
                                            </Box>
                                        </div>
                                    </div>
                                    <BlockStack gap="0" inlineAlign="center">
                                        <Text variant="bodyMd" as="p" fontWeight="semibold">
                                            83.2%
                                        </Text>
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {t('dashboard.session_funnel.continued_after_camera')}
                                        </Text>
                                    </BlockStack>
                                </BlockStack>
                            </Box>

                            <Text> <Icon source={ChevronRightIcon} tone="subdued" /> </Text>

                            {/* Step 3 - Try-on completed */}
                            <Box width="100%">
                                <BlockStack gap="200" inlineAlign="center">
                                    <div style={{ position: 'relative', width: '100%', marginTop: "15px" }}>
                                        <Box
                                            borderWidth="025"
                                            borderColor="border-subdued"
                                            borderRadius="200"
                                            paddingBlockStart="600"
                                            paddingBlockEnd="400"
                                            paddingInline="300"
                                        >
                                            <BlockStack gap="050" inlineAlign="center">
                                                <Text variant="headingLg" as="p">
                                                    2,156
                                                </Text>
                                                <Text variant="bodyMd" as="p" tone="subdued">
                                                    {t('dashboard.session_funnel.try_on_completed')}
                                                </Text>
                                            </BlockStack>
                                        </Box>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            <Box
                                                background="bg-fill-info-secondary"
                                                borderRadius="full"
                                                padding="300"
                                            >
                                                <Icon source={MagicIcon} tone="info" />
                                            </Box>
                                        </div>
                                    </div>
                                    <BlockStack gap="0" inlineAlign="center">
                                        <Text variant="bodyMd" as="p" fontWeight="semibold">
                                            75.7%
                                        </Text>
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {t('dashboard.session_funnel.completed_try_on')}
                                        </Text>
                                    </BlockStack>
                                </BlockStack>
                            </Box>

                            <Text > <Icon source={ChevronRightIcon} tone="subdued" /> </Text>

                            {/* Step 4 - Added to cart */}
                            <Box width="100%">
                                <BlockStack gap="200" inlineAlign="center">
                                    <div style={{ position: 'relative', width: '100%', marginTop: "15px" }}>
                                        <Box
                                            borderWidth="025"
                                            borderColor="subdued"
                                            borderRadius="200"
                                            paddingBlockStart="600"
                                            paddingBlockEnd="400"
                                            paddingInline="300"
                                        >
                                            <BlockStack gap="050" inlineAlign="center">
                                                <Text variant="headingLg" as="p">
                                                    342
                                                </Text>
                                                <Text variant="bodyMd" as="p" tone="subdued">
                                                    {t('dashboard.session_funnel.added_to_cart')}
                                                </Text>
                                            </BlockStack>
                                        </Box>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            <Box
                                                background="bg-fill-info-secondary"
                                                borderRadius="full"
                                                padding="300"
                                            >
                                                <Icon source={CartIcon} tone="info" />
                                            </Box>
                                        </div>
                                    </div>
                                    <BlockStack gap="0" inlineAlign="center">
                                        <Text variant="bodyMd" as="p" fontWeight="semibold">
                                            15.9%
                                        </Text>
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {t('dashboard.session_funnel.added_to_cart_step')}
                                        </Text>
                                    </BlockStack>
                                </BlockStack>
                            </Box>

                        </InlineStack>
                    </Box>
                </Card>

                {/* ============================================
                    RECENT SESSIONS
                    ============================================ 
                */}
                <Card padding="200">
                    <Box padding="400"  borderColor="border-subdued">
                        <InlineStack align="space-between" blockAlign="start">
                            <BlockStack gap="100">
                                <Text variant="headingMd" as="h3" fontWeight={600}>
                                    {t('dashboard.recent_sessions.title')}
                                </Text>
                                <Text variant="bodyMd" as="p" tone="subdued">
                                    {t('dashboard.recent_sessions.description')}
                                </Text>
                            </BlockStack>
                            <Button>{t('dashboard.recent_sessions.view_all_sessions')}</Button>
                        </InlineStack>
                    </Box>

                    <IndexTable
                        itemCount={sessions.length}
                        headings={[
                            { title: t('dashboard.recent_sessions.table_headers.customer') },
                            { title: t('dashboard.recent_sessions.table_headers.product') },
                            { title: t('dashboard.recent_sessions.table_headers.date_time') },
                            { title: t('dashboard.recent_sessions.table_headers.session_length') },
                            { title: t('dashboard.recent_sessions.table_headers.result') },
                            { title: t('dashboard.recent_sessions.table_headers.action') },
                        ]}
                        selectable={false}
                    >
                        {sessions.map((session, index) => (
                            <IndexTable.Row id={session.id} key={session.id} position={index}>
                                {/* Customer */}
                                <IndexTable.Cell>
                                    <InlineStack gap="200" blockAlign="center" wrap={false}>
                                        <Avatar initials={session.initials} name={session.name} size="md" />
                                        <BlockStack gap="0">
                                            <Text variant="bodyMd" as="span" fontWeight="semibold">
                                                {session.name}
                                            </Text>
                                            <Text variant="bodySm" as="span" tone="subdued">
                                                {session.location}
                                            </Text>
                                        </BlockStack>
                                    </InlineStack>
                                </IndexTable.Cell>

                                {/* Product */}
                                <IndexTable.Cell>
                                    <InlineStack gap="200" blockAlign="center" wrap={false}>
                                        <Thumbnail source={ImageIcon} alt={session.product} size="small" />
                                        <BlockStack gap="0">
                                            <Text variant="bodyMd" as="span" fontWeight="semibold">
                                                {session.product}
                                            </Text>
                                            <Text variant="bodySm" as="span" tone="subdued">
                                                {session.variant}
                                            </Text>
                                        </BlockStack>
                                    </InlineStack>
                                </IndexTable.Cell>

                                {/* Date & time */}
                                <IndexTable.Cell>
                                    <BlockStack gap="0">
                                        <Text variant="bodyMd" as="span">
                                            {session.date}
                                        </Text>
                                        <Text variant="bodySm" as="span" tone="subdued">
                                            {session.time}
                                        </Text>
                                    </BlockStack>
                                </IndexTable.Cell>

                                {/* Session length */}
                                <IndexTable.Cell>
                                    <Text variant="bodyMd" as="span">
                                        {session.length}
                                    </Text>
                                </IndexTable.Cell>

                                {/* Result */}
                                <IndexTable.Cell>
                                    <Badge tone={session.resultTone}>{session.result}</Badge>
                                </IndexTable.Cell>

                                {/* Action */}
                                <IndexTable.Cell>
                                    <InlineStack gap="200" blockAlign="center" wrap={false}>
                                        <Button icon={ExternalIcon} size="slim">
                                            {t('dashboard.recent_sessions.view')}
                                        </Button>
                                        <Button icon={MenuHorizontalIcon} variant="tertiary" accessibilityLabel={t('dashboard.recent_sessions.more_actions')} />
                                    </InlineStack>
                                </IndexTable.Cell>
                            </IndexTable.Row>
                        ))}
                    </IndexTable>
                </Card>

                <div style={{
                    marginBottom: "10px",
                }}></div>

            </BlockStack>
        </Page>

    );
};

export default IndexPage;
