import React, { useContext, useEffect, useRef, useState } from "react";
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
import { useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../components/PageLoader.jsx";
import SessionFunnelDateFilter from '../components/SessionFunnelDateFilter';
import { isCardDismissed, dismissCard } from "../utils/sessionStorage.js";


import useReviewModal from "../hooks/useReviewModal.js";
import {
    CalendarIcon,
    ChevronDownIcon,
    ClockIcon,
    ArrowRightIcon,
    XSmallIcon,
    PlayIcon,
    ArrowUpIcon,
    ArrowDownIcon,
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

// Theme extension deep link + polling (setup progress banner)
const APP_ID = '9d72bb0915715baf6d8d8b6b9bb15d29';
const EXTENSION_HANDLE = 'mirrly';
const THEME_POLL_INTERVAL_MS = 1000;
const THEME_POLL_MAX_ATTEMPTS = 30; // checks every 1s for up to 30s

/* ============================================
    OVERVIEW ANALYTICS
    Date-range helpers + dynamic KPI cards — mirrors the Sessions page
    pattern, but keeps the dashboard's own card look (no sparklines).
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

/* Previous period of equal length, immediately before [start, end].
   Works uniformly for today (-> yesterday), last 7 days (-> prior 7)
   and any custom range (-> N days before its start). */
const getPreviousPeriod = (start, end) => {
    const length = Math.max(1, Math.round((end - start) / 86400000) + 1);
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - (length - 1));
    return { start: prevStart, end: prevEnd };
};

const formatCount = (n) => Number(n || 0).toLocaleString();
const rate = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0);

const pctChange = (cur, prev) => {
    if (prev > 0) return ((cur - prev) / prev) * 100;
    return cur > 0 ? 100 : 0;
};

const changeLabel = (delta) => parseFloat(Math.abs(delta).toFixed(1)).toLocaleString() + '%';
const directionOf = (delta) => (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat');

/* "42" -> "42s", "95" -> "1m 35s" */
const formatDuration = (seconds) => {
    const s = Math.round(seconds || 0);
    if (s < 60) return s + 's';
    return Math.floor(s / 60) + 'm ' + (s % 60) + 's';
};

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

/* One overview metric card — keeps the dashboard's current look (no sparkline) */
const OverviewCard = ({ icon, iconBg, iconTone, label, value, change, direction, sublabel }) => {
    const changeTone = direction === 'up' ? 'success' : direction === 'down' ? 'critical' : 'subdued';
    const ChangeIcon = direction === 'up' ? ArrowUpIcon : direction === 'down' ? ArrowDownIcon : ArrowRightIcon;

    return (
        <Card>
            <BlockStack gap="300" align="start">
                <Box background={iconBg} borderRadius="200" padding="200" minWidth="40px" maxWidth="40px">
                    <Icon source={icon} tone={iconTone} />
                </Box>
                <BlockStack gap="200">
                    <Text variant="bodyMd" as="p" tone="subdued">
                        {label}
                    </Text>
                    <Text variant="heading2xl" as="h3">
                        {value}
                    </Text>
                    <InlineStack gap="100" blockAlign="center">
                        <Text> <Icon source={ChangeIcon} tone={changeTone} /> </Text>
                        <Text variant="bodyLg" as="span" tone={changeTone} fontWeight="bold">
                            {change}
                        </Text>
                    </InlineStack>
                    <Text variant="bodySm" as="p" tone="subdued">
                        {sublabel}
                    </Text>
                </BlockStack>
            </BlockStack>
        </Card>
    );
};

/* The 4 overview metric cards, driven by /api/sessions/analytics */
const OverviewKpiCards = ({ analytics, range, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading || !analytics) {
        return (
            <InlineGrid columns={{ xs: 1, sm: 2, md: 4, lg: 4 }} gap="400">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
            </InlineGrid>
        );
    }

    const { kpis } = analytics;
    const cur = kpis.funnel.current;
    const prev = kpis.funnel.previous;
    const avgLen = kpis.avg_session_length ?? { current: 0, previous: 0 };

    /* Comparison sublabel mirrors the real previous window (equal-length prior period) */
    const previousPeriod = getPreviousPeriod(range.start, range.end);
    const windowDays = Math.max(1, Math.round((previousPeriod.end - previousPeriod.start) / 86400000) + 1);
    const compareSublabel = windowDays === 1
        ? t('dashboard.overview.vs_previous_day')
        : t('dashboard.overview.vs_previous_days', { count: windowDays });

    const cards = [
        {
            icon: PlayIcon,
            iconBg: 'bg-fill-info-secondary',
            iconTone: 'info',
            label: t('dashboard.overview.sessions_this_cycle'),
            value: formatCount(kpis.sessions.current),
            change: changeLabel(pctChange(kpis.sessions.current, kpis.sessions.previous)),
            direction: directionOf(pctChange(kpis.sessions.current, kpis.sessions.previous)),
            sublabel: compareSublabel,
        },
        {
            icon: CartIcon,
            iconBg: 'bg-fill-success-secondary',
            iconTone: 'success',
            label: t('dashboard.overview.add_to_cart_after_try_on'),
            value: formatCount(cur.added_to_cart),
            change: changeLabel(pctChange(cur.added_to_cart, prev.added_to_cart)),
            direction: directionOf(pctChange(cur.added_to_cart, prev.added_to_cart)),
            sublabel: rate(cur.added_to_cart, cur.started).toFixed(1) + '% ' + t('dashboard.overview.conversion_rate'),
        },
        {
            icon: ClockIcon,
            iconBg: 'bg-fill-info-secondary',
            iconTone: 'info',
            label: t('dashboard.overview.avg_session_length'),
            value: formatDuration(avgLen.current),
            change: changeLabel(pctChange(avgLen.current, avgLen.previous)),
            direction: directionOf(pctChange(avgLen.current, avgLen.previous)),
            sublabel: compareSublabel,
        },
        {
            icon: DatabaseIcon,
            iconBg: 'bg-fill-magic-secondary',
            iconTone: 'magic',
            label: t('dashboard.overview.spend_this_cycle'),
            value: '-',
            change: '-',
            direction: 'flat',
            sublabel: t('dashboard.overview.per_session'),
        },
    ];

    return (
        <InlineGrid columns={{ xs: 1, sm: 2, md: 4, lg: 4 }} gap="400">
            {cards.map((kpi) => (
                <OverviewCard key={kpi.label} {...kpi} />
            ))}
        </InlineGrid>
    );
};

/* One funnel step box — keeps the dashboard's current look.
   While data is loading (value/percent null) it shows skeletons. */
const FunnelStepBox = ({ icon, value, label, percent, caption }) => (
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
                        {value !== null ? (
                            <Text variant="headingLg" as="p">
                                {value}
                            </Text>
                        ) : (
                            <SkeletonDisplayText size="medium" />
                        )}
                        <Text variant="bodyMd" as="p" tone="subdued">
                            {label}
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
                        <Icon source={icon} tone="info" />
                    </Box>
                </div>
            </div>
            <BlockStack gap="0" inlineAlign="center">
                {percent !== null ? (
                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                        {percent}
                    </Text>
                ) : (
                    <SkeletonBodyText lines={1} />
                )}
                <Text variant="bodySm" as="p" tone="subdued">
                    {caption}
                </Text>
            </BlockStack>
        </BlockStack>
    </Box>
);

/* The 4 session funnel steps, driven by /api/sessions/analytics.
   Percent at each step is relative to the previous step. */
const SessionFunnelSteps = ({ analytics }) => {
    const { t } = useTranslation();

    const f = analytics?.kpis?.funnel?.current ?? null;
    const pct = (step, before) => rate(step, before).toFixed(1) + '%';

    const steps = [
        {
            icon: CameraIcon,
            label: t('dashboard.session_funnel.camera_opened'),
            caption: t('dashboard.session_funnel.of_product_page_clicks'),
            value: f ? formatCount(f.opened) : null,
            percent: f ? '100%' : null,
        },
        {
            icon: ImageIcon,
            label: t('dashboard.session_funnel.try_on_started'),
            caption: t('dashboard.session_funnel.continued_after_camera'),
            value: f ? formatCount(f.started) : null,
            percent: f ? pct(f.started, f.opened) : null,
        },
        {
            icon: MagicIcon,
            label: t('dashboard.session_funnel.try_on_completed'),
            caption: t('dashboard.session_funnel.completed_try_on'),
            value: f ? formatCount(f.completed) : null,
            percent: f ? pct(f.completed, f.started) : null,
        },
        {
            icon: CartIcon,
            label: t('dashboard.session_funnel.added_to_cart'),
            caption: t('dashboard.session_funnel.added_to_cart_step'),
            value: f ? formatCount(f.added_to_cart) : null,
            percent: f ? pct(f.added_to_cart, f.completed) : null,
        },
    ];

    return (
        <InlineStack align="space-between" blockAlign="center" wrap={false} gap="200">
            {steps.map((step, index) => (
                <React.Fragment key={step.label}>
                    <FunnelStepBox {...step} />
                    {index < steps.length - 1 && (
                        <Text> <Icon source={ChevronRightIcon} tone="subdued" /> </Text>
                    )}
                </React.Fragment>
            ))}
        </InlineStack>
    );
};

const IndexPage = () => {
    const navigate = useNavigate();
    const { isLoadingData, store } = useContext(AppContext);
    const { t } = useTranslation();
    const shopify = useAppBridge();

    // Theme extension status (setup progress banner)
    const [themeExtensionEnabled, setThemeExtensionEnabled] = useState(false);
    const [isEnabling, setIsEnabling] = useState(false);
    const themePollIntervalRef = useRef(null);
    const themePollBusyRef = useRef(false);

    // Setup progress banner visibility (X dismiss)
    const [isBannerDismissed, setIsBannerDismissed] = useState(isCardDismissed('setup_progress_banner'));

    const handlePricing = () => navigate("/plans");

    // Shopify Review Modal Hook - triggers after 5 seconds on dashboard
    const { hasRequested: hasRequestedReview } = useReviewModal({
        delay: 5000,
        triggerContext: 'dashboard',
        enabled: true,
    });

    const [subscriptionData, setSubscriptionData] = useState(null);

    /**
     * Plan/usage derived values
     * plan + subscription come from /api/subscription, used count from store context.
     */
    const plan = subscriptionData?.plan ?? null;
    const activeSubscription = subscriptionData?.subscription ?? null;

    // limits key standardized to 'sessions', but fall back to 'session' for older rows
    const sessionLimitRaw = plan?.limits?.sessions ?? plan?.limits?.session ?? null;
    const isUnlimitedSessions = sessionLimitRaw === 'unlimited';
    const sessionLimit = typeof sessionLimitRaw === 'number' ? sessionLimitRaw : null;

    const usedSessions = Number(store?.monthly_sessions ?? 0);
    const usagePercent = sessionLimit
        ? Math.min(100, Math.round((usedSessions / sessionLimit) * 100))
        : 0;
    const remainingSessions = sessionLimit !== null ? Math.max(0, sessionLimit - usedSessions) : null;

    const formatNumber = (n) => Number(n || 0).toLocaleString();

    const planDisplayName = plan?.name
        ? plan.name.charAt(0).toUpperCase() + plan.name.slice(1)
        : '';
    const planPrice = activeSubscription?.interval === 'yearly'
        ? plan?.yearly_charge
        : plan?.monthly_charge;

    const resetDate = activeSubscription?.next_reset_date
        ? new Date(activeSubscription.next_reset_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : null;

    /* ============================================
        RECENT SESSIONS (live: /api/sessions/recent)
        ============================================ */
    const [recentSessions, setRecentSessions] = useState([]);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const response = await fetch('/api/sessions/recent');
                const payload = response.ok ? await response.json() : null;
                if (!cancelled && payload && payload.data) {
                    setRecentSessions(payload.data);
                }
            } catch (error) {
                console.error('Failed loading recent sessions:', error);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const formatSessionDate = (iso) => {
        if (!iso) return { date: '—', time: '' };
        const d = new Date(iso);
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
    };

    const sessionResult = (slug) => ({
        purchased: { label: t('dashboard.recent_sessions.results.purchased'), tone: 'success' },
        added_to_cart: { label: t('dashboard.recent_sessions.results.added_to_cart'), tone: 'success' },
        completed: { label: t('dashboard.recent_sessions.results.completed'), tone: 'info' },
        started: { label: t('dashboard.recent_sessions.results.started'), tone: 'attention' },
        opened: { label: t('dashboard.recent_sessions.results.opened'), tone: 'subdued' },
    }[slug] ?? { label: slug, tone: 'subdued' });

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await fetch("/api/subscription");
                if (response.ok) {
                    const data = await response.json();
                    setSubscriptionData(data.data);
                }
            } catch (error) {
                console.error("Error fetching subscription:", error);
            }
        };
        fetchSubscription();
    }, []);

    /* ============================================
        OVERVIEW ANALYTICS (4 KPI cards)
        Same pattern as the Sessions page: range -> /api/sessions/analytics
        ============================================ */
    const [overviewRange, setOverviewRange] = useState(defaultRange);
    const [overviewAnalytics, setOverviewAnalytics] = useState(null);
    const [isOverviewLoading, setIsOverviewLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsOverviewLoading(true);
            try {
                const params = new URLSearchParams({
                    from: toISODate(overviewRange.start),
                    to: toISODate(overviewRange.end),
                });
                const response = await fetch('/api/sessions/analytics?' + params.toString());
                const payload = response.ok ? await response.json() : null;
                if (!cancelled && payload && payload.data) {
                    setOverviewAnalytics(payload.data);
                }
            } catch (error) {
                console.error('Failed loading overview analytics:', error);
            } finally {
                if (!cancelled) {
                    setIsOverviewLoading(false);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [overviewRange]);

    /* ============================================
        THEME EXTENSION (Setup progress banner)
        Same flow as onboarding Step 3
        ============================================ */
    const checkThemeExtension = async () => {
        try {
            const extensions = await shopify.app.extensions();

            // --- Theme App Extension ---
            const themeExtension = extensions.find(e => e.type === 'theme_app_extension');
            // Get the specific block by handle (e.g. 'mirrly')
            const themeBlock = themeExtension?.activations.find(a => a.handle === EXTENSION_HANDLE);
            const themeExtensionStatus = themeBlock?.status ?? 'unavailable'; // 'active' | 'available' | 'unavailable'
            const enabled = themeExtensionStatus === 'active';
            setThemeExtensionEnabled(enabled);
            return enabled;
        } catch (error) {
            console.error('Error checking theme extension status:', error);
            return false;
        }
    };

    // Check theme extension status automatically on page load
    useEffect(() => {
        checkThemeExtension();
    }, []);

    // Stop polling if the component unmounts
    useEffect(() => () => {
        if (themePollIntervalRef.current) clearInterval(themePollIntervalRef.current);
    }, []);

    const handleEnableThemeExtension = () => {
        if (isEnabling || themeExtensionEnabled) return; // no re-click while polling / already active

        setIsEnabling(true);
        // Deep link to theme editor with the app block pre-activated (new tab so polling keeps running)
        const themeEditorUrl = `https://${shopify.config.shop}/admin/themes/current/editor?context=apps&activateAppId=${APP_ID}/${EXTENSION_HANDLE}`;
        window.open(themeEditorUrl, '_blank');

        // Poll for activation every 1s, for up to 30s
        let attempts = 0;
        themePollIntervalRef.current = setInterval(async () => {
            if (themePollBusyRef.current) return; // skip tick if the previous check is still in flight
            themePollBusyRef.current = true;
            attempts++;

            const enabled = await checkThemeExtension();
            themePollBusyRef.current = false;

            if (enabled) {
                clearInterval(themePollIntervalRef.current);
                setIsEnabling(false);
                shopify.toast.show(t("onboarding.theme_extension_enabled_success"));
            } else if (attempts >= THEME_POLL_MAX_ATTEMPTS) {
                clearInterval(themePollIntervalRef.current);
                setIsEnabling(false);
                shopify.toast.show(t("onboarding.theme_extension_not_detected"), { isError: true });
            }
        }, THEME_POLL_INTERVAL_MS);
    };

    if (isLoadingData) {
        return <PageLoader />;
    }

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
    /* ============================================
        SETUP PROGRESS BANNER
        Steps are checked in order: first incomplete step = current (yellow),
        steps before it = completed (green), steps after it = pending (grey).
        ============================================ */
    const productTypeDone = !!store?.setting?.collection_type; // set by onboarding step 2
    const planDone = !!activeSubscription?.plan_selected; // plan chosen: paid via billing (plan_selected=true) or Free selected (defaults true); false on install's default free sub
    const liveTestDone = !!store?.setup_steps?.live_test_done; // saved by onboarding step 4

    const stepDoneFlags = [productTypeDone, themeExtensionEnabled, planDone, liveTestDone];
    const allStepsDone = stepDoneFlags.every(Boolean);
    const currentStepIndex = stepDoneFlags.indexOf(false); // -1 when all completed

    const setupSteps = [
        { label: t('dashboard.setup_progress_banner.steps.product_type') },
        { label: t('dashboard.setup_progress_banner.steps.theme_embed') },
        { label: t('dashboard.setup_progress_banner.steps.choose_plan') },
        { label: t('dashboard.setup_progress_banner.steps.live_test') },
    ].map((step, index) => ({
        ...step,
        status: currentStepIndex === -1 || index < currentStepIndex
            ? 'completed'
            : index === currentStepIndex ? 'current' : 'pending',
    }));

    // Banner stays hidden permanently (per user) once dismissed with all steps completed;
    // while setup is incomplete, X only hides it for the current session.
    const showBanner = !(allStepsDone && store?.dismissed_banners?.setup_progress_banner) && !isBannerDismissed;

    const handleDismissBanner = () => {
        if (allStepsDone) {
            // Persist: never show again for this user
            fetch('/api/dismiss-banner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ banner: 'setup_progress_banner' }),
            }).catch(error => console.error('Failed to dismiss banner:', error));
        } else {
            // Session-only dismissal
            dismissCard('setup_progress_banner');
        }
        setIsBannerDismissed(true);
    };

    // CTA label + action follow the current (first incomplete) step
    const bannerCtaLabel = [
        t('dashboard.setup_progress_banner.select_products'),
        t('dashboard.setup_progress_banner.enable_theme_extension'),
        t('dashboard.setup_progress_banner.choose_plan'),
        t('dashboard.setup_progress_banner.continue_live_test'),
    ][currentStepIndex];

    const handleBannerCta = () => {
        switch (currentStepIndex) {
            case 0: // Product type → onboarding (product selection)
                navigate("/NewOnboarding");
                break;
            case 1: // Theme embed → open theme editor + poll for activation
                handleEnableThemeExtension();
                break;
            case 2: // Choose plan → plans / billing flow
                handlePricing();
                break;
            case 3: // Live test → redirect link to be provided later
            default:
                break;
        }
    };


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
                {showBanner && (
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
                                {!allStepsDone && (
                                    <Button
                                        variant="primary"
                                        icon={ArrowRightIcon}
                                        loading={isEnabling}
                                        onClick={handleBannerCta}
                                    >
                                        {bannerCtaLabel}
                                    </Button>
                                )}
                                <Button
                                    icon={XSmallIcon}
                                    variant="tertiary"
                                    accessibilityLabel={t('dashboard.dismiss')}
                                    onClick={handleDismissBanner}
                                />
                            </InlineStack>
                        </InlineStack>

                        {/* Row 2: Step Indicators */}
                        <SetupStepsRow steps={setupSteps} />
                    </BlockStack>
                </div>
                )}

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
                        <SessionFunnelDateFilter onChange={setOverviewRange} />
                    </InlineStack>

                    {/* Description below heading */}
                    <Text variant="bodyMd" as="p" tone="subdued">
                        {t('dashboard.overview.description')}
                    </Text>

                    {/* Metric Cards Grid - 4 real columns */}
                    <OverviewKpiCards
                        analytics={overviewAnalytics}
                        range={overviewRange}
                        isLoading={isOverviewLoading && !overviewAnalytics}
                    />
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
                                {resetDate && (
                                    <Text variant="bodySm" as="span" tone="subdued">
                                        {t('dashboard.session_usage.resets_on', { date: resetDate })}
                                    </Text>
                                )}
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
                                                    {planDisplayName}
                                                </Text>
                                                <Badge tone="success">{t('dashboard.session_usage.current_plan')}</Badge>
                                            </InlineStack>

                                            <InlineStack align="space-between" blockAlign="center">
                                                <Text variant="headingLg" as="p">
                                                    {formatNumber(usedSessions)}{' '}
                                                    <Text variant="bodyMd" as="span" tone="subdued" fontWeight="regular">
                                                        {isUnlimitedSessions
                                                            ? t('plans_page.of_unlimited_sessions')
                                                            : t('dashboard.session_usage.of_sessions', { count: formatNumber(sessionLimit) })}
                                                    </Text>
                                                </Text>
                                                {!isUnlimitedSessions && (
                                                    <Text variant="bodyMd" as="span" tone="subdued">
                                                        {t('dashboard.session_usage.used', { percentage: `${usagePercent}%` })}
                                                    </Text>
                                                )}
                                            </InlineStack>
                                        </BlockStack>
                                        {!isUnlimitedSessions && (
                                            <ProgressBar progress={usagePercent} size="medium" tone="primary" />
                                        )}
                                    </BlockStack>
                                </Box>

                                {/* Sessions remaining callout / unlimited note */}
                                <Box
                                    background="bg-fill-info-secondary"
                                    borderRadius="200"
                                    padding="400"
                                >
                                    <InlineStack gap="300" blockAlign="center" wrap={false}>
                                        <Text> <Icon source={ChartVerticalFilledIcon} tone="info" /> </Text>
                                        <BlockStack gap="050">
                                            {isUnlimitedSessions ? (
                                                <>
                                                    <Text variant="bodyMd" as="p" fontWeight="semibold" tone="info">
                                                        {t('dashboard.session_usage.unlimited_active')}
                                                    </Text>
                                                    <Text variant="bodySm" as="p" tone="subdued">
                                                        {t('dashboard.session_usage.unlimited_note')}
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text variant="bodyMd" as="p" fontWeight="semibold" tone="info">
                                                        {t('dashboard.session_usage.sessions_remaining', { count: formatNumber(remainingSessions) })}
                                                    </Text>
                                                    <Text variant="bodySm" as="p" tone="subdued">
                                                        {t('dashboard.session_usage.need_more_upgrade')}
                                                    </Text>
                                                </>
                                            )}
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
                                <Badge tone="magic">{planDisplayName}</Badge>
                            </InlineStack>
                        </Box>

                        <Box padding="400">
                            <BlockStack gap="400">
                                <BlockStack gap="100">
                                    <InlineStack gap="100" blockAlign="baseline">
                                        <Text variant="headingXl" as="p">
                                            ${formatNumber(planPrice)}
                                        </Text>
                                        <Text variant="bodyMd" as="span" tone="subdued">
                                            {t('dashboard.current_plan.per_month')}
                                        </Text>
                                    </InlineStack>
                                    <Text variant="bodyMd" as="p" tone="subdued">
                                        {sessionLimit !== null
                                            ? t('dashboard.current_plan.up_to_sessions', { count: formatNumber(sessionLimit) })
                                            : t('plans_page.unlimited_tryon_sessions')}
                                    </Text>
                                </BlockStack>

                                {!!plan?.features?.length && (
                                    <BlockStack gap="150">
                                        {plan.features.map((feature) => (
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
                                )}

                                <InlineStack gap="200">
                                    <Button size="large" onClick={handlePricing}>{t('dashboard.current_plan.manage_plan')}</Button>
                                    {/* <Button size="large" variant="primary" >
                                        {t('dashboard.current_plan.view_all_plans')}
                                    </Button> */}
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
                            {/* <SessionFunnelDateFilter onChange={setOverviewRange} /> */}
                        </InlineStack>
                    </Box>

                    <Box padding="400">
                        <SessionFunnelSteps analytics={overviewAnalytics} />
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
                            <Button onClick={() => navigate('/sessions')}>{t('dashboard.recent_sessions.view_all_sessions')}</Button>
                        </InlineStack>
                    </Box>

                    <IndexTable
                        itemCount={recentSessions.length}
                        headings={[
                            { title: t('dashboard.recent_sessions.table_headers.customer') },
                            { title: t('dashboard.recent_sessions.table_headers.product') },
                            { title: t('dashboard.recent_sessions.table_headers.date_time') },
                            { title: t('dashboard.recent_sessions.table_headers.session_length') },
                            { title: t('dashboard.recent_sessions.table_headers.result') },
                            { title: t('dashboard.recent_sessions.table_headers.action') },
                        ]}
                        selectable={false}
                        emptyState={
                            <Box padding="400">
                                <Text alignment="center" tone="subdued" as="p">
                                    {t('dashboard.recent_sessions.empty')}
                                </Text>
                            </Box>
                        }
                    >
                        {recentSessions.map((session, index) => (
                            <IndexTable.Row id={session.id} key={session.id} position={index}>
                                {/* Customer (sessions are anonymous — show device info) */}
                                <IndexTable.Cell>
                                    <InlineStack gap="200" blockAlign="center" wrap={false}>
                                        <Avatar customer name={t('dashboard.recent_sessions.guest')} size="md" />
                                        <BlockStack gap="0">
                                            <Text variant="bodyMd" as="span" fontWeight="semibold">
                                                {t('dashboard.recent_sessions.guest')}
                                            </Text>
                                            <Text variant="bodySm" as="span" tone="subdued">
                                                {[session.device_type, session.browser].filter(Boolean).join(' · ') || '—'}
                                            </Text>
                                        </BlockStack>
                                    </InlineStack>
                                </IndexTable.Cell>

                                {/* Product */}
                                <IndexTable.Cell>
                                    <InlineStack gap="200" blockAlign="center" wrap={false}>
                                        <Thumbnail source={session.product_image || ImageIcon} alt={session.product} size="small" />
                                        <BlockStack gap="0">
                                            <Text variant="bodyMd" as="span" fontWeight="semibold">
                                                {session.product ?? '—'}
                                            </Text>
                                            {session.variant && (
                                                <Text variant="bodySm" as="span" tone="subdued">
                                                    {session.variant}
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </InlineStack>
                                </IndexTable.Cell>

                                {/* Date & time */}
                                <IndexTable.Cell>
                                    <BlockStack gap="0">
                                        <Text variant="bodyMd" as="span">
                                            {formatSessionDate(session.created_at).date}
                                        </Text>
                                        <Text variant="bodySm" as="span" tone="subdued">
                                            {formatSessionDate(session.created_at).time}
                                        </Text>
                                    </BlockStack>
                                </IndexTable.Cell>

                                {/* Session length */}
                                <IndexTable.Cell>
                                    <Text variant="bodyMd" as="span">
                                        {session.duration_seconds ? `${session.duration_seconds}s` : '—'}
                                    </Text>
                                </IndexTable.Cell>

                                {/* Result */}
                                <IndexTable.Cell>
                                    <Badge tone={sessionResult(session.result).tone}>
                                        {sessionResult(session.result).label}
                                    </Badge>
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
