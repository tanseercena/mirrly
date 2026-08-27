import { useState, useRef, useEffect, useContext } from 'react';
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
import { AppContext } from '../components/providers/AppProvider.jsx';
import { PageLoader } from '../components/PageLoader.jsx';

/* Plan hierarchy - lowest to highest rank */
const PLAN_RANK = ['free', 'growth', 'scale'];

/* ============================================
    PLANS PAGE
    ============================================ */
const PlansPage = () => {
    const { t } = useTranslation();
    const { store } = useContext(AppContext);
    const [cycle, setCycle] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState('growth');
    const [plans, setPlans] = useState([]);
    const [activePlan, setActivePlan] = useState(null); // DB plan behind the active subscription
    const [subscription, setSubscription] = useState(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [upgradingPlan, setUpgradingPlan] = useState(null); // plan key currently processing billing
    const pricingSectionRef = useRef(null);

    /* Load plans list + current subscription once */
    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const [plansRes, subRes] = await Promise.all([
                    fetch('/api/plans'),
                    fetch('/api/subscription'),
                ]);

                const plansData = plansRes.ok ? await plansRes.json() : { data: [] };
                const subData = subRes.ok ? await subRes.json() : null;

                if (cancelled) return;
                setPlans(plansData.data ?? []);
                setActivePlan(subData?.data?.plan ?? null);
                setSubscription(subData?.data?.subscription ?? null);
            } catch (error) {
                console.error('Failed loading plans data:', error);
            } finally {
                if (!cancelled) setIsLoadingPage(false);
            }
        };

        loadData();
        return () => { cancelled = true; };
    }, []);

    /* ---------- Helpers ---------- */
    const normKey = (name) => {
        const k = String(name ?? '').trim().toLowerCase();
        return k === 'starter' ? 'free' : k;
    };
    const rankOf = (key) => PLAN_RANK.indexOf(key);
    const findPlanByKey = (key) => plans.find((p) => normKey(p.name) === key) ?? null;

    const getLimitRaw = (p) => p?.limits?.sessions ?? p?.limits?.session ?? null;
    const isUnlimitedPlan = (p) => getLimitRaw(p) === 'unlimited';
    const limitOf = (p) => {
        const raw = getLimitRaw(p);
        return typeof raw === 'number' ? raw : null;
    };
    const rateOf = (p) => Number(p?.limits?.session_rate ?? 0);
    const priceOf = (p) => Number((cycle === 'yearly' ? p?.yearly_charge : p?.monthly_charge) ?? 0);

    const formatNumber = (n) => Number(n || 0).toLocaleString();
    const formatMoney = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
    const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    /* ---------- Derived values ---------- */
    const activeKey = normKey(activePlan?.name) || 'free';
    const activeRank = rankOf(activeKey);

    // selected card follows the real active plan once data is loaded
    useEffect(() => {
        if (!isLoadingPage) setSelectedPlan(activeKey);
    }, [isLoadingPage, activeKey]);

    const usedSessions = Number(store?.monthly_sessions ?? 0);
    const activePlanRow = findPlanByKey(activeKey);
    const hasActiveLimit = !!activePlanRow && !isUnlimitedPlan(activePlanRow);
    const sessionLimit = limitOf(activePlanRow);

    const usagePercent = hasActiveLimit && sessionLimit
        ? Math.min(100, Math.round((usedSessions / sessionLimit) * 100))
        : null;

    // Spend from per-session rate.
    // Free is pay-as-you-go: every session billed. Paid plans bill only sessions over the included limit.
    const sessionSpend = (() => {
        const rate = rateOf(activePlanRow);
        if (!(rate > 0)) return 0;
        if (!hasActiveLimit) return 0; // unlimited - nothing extra to bill
        const included = activeKey === 'free' ? 0 : sessionLimit ?? 0;
        return Math.max(0, usedSessions - included) * rate;
    })();

    // Cycle window: ends on next_reset_date, spans one month/year back
    const cycleInfo = (() => {
        const end = subscription?.next_reset_date
            ? new Date(subscription.next_reset_date)
            : new Date(new Date().setMonth(new Date().getMonth() + 1));
        const start = new Date(end);
        if (subscription?.interval === 'yearly') {
            start.setFullYear(start.getFullYear() - 1);
        } else {
            start.setMonth(start.getMonth() - 1);
        }
        const days = Math.max(1, Math.round((end - start) / 86400000));
        return { start, end, days };
    })();

    // Breakeven banner: usage above 60% and a higher plan exists
    const nextHigherKey = activeRank > -1 && activeRank < PLAN_RANK.length - 1
        ? PLAN_RANK[activeRank + 1]
        : null;
    const showBreakeven = usagePercent !== null && usagePercent > 60 && !!nextHigherKey;

    /* ---------- Billing ---------- */
    const scrollToPricing = () => {
        pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const initiateBilling = async (planKey) => {
        if (upgradingPlan) return;
        setUpgradingPlan(planKey);

        try {
            // $0 plan - no Shopify checkout needed, cancel & create local free subscription
            if (planKey === 'free') {
                const res = await fetch('/api/billing/free', { method: 'POST' });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || 'Failed to switch to the Free plan');
                }
                window.location.reload(); // refresh all state with the new subscription
                return;
            }

            const plan = findPlanByKey(planKey);
            if (!plan) throw new Error(t('onboarding.invalid_plan_error') || 'Invalid plan selected');

            const response = await fetch('/api/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: plan.id,
                    interval: cycle,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate billing');
            }

            // Redirect to Shopify's billing confirmation page
            if (data.confirmationUrl) {
                window.open(data.confirmationUrl, '_top'); // keep loading state - page redirects
                return;
            }
            throw new Error('No confirmation URL received');
        } catch (error) {
            console.error('Error initiating billing:', error);
            alert(error.message || t('onboarding.billing_error') || 'An error occurred while initiating billing.');
            setUpgradingPlan(null); // only reset loading state on error
        }
    };

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

    /* Static, translated descriptors per plan key */
    const PLAN_META = {
        free: {
            title: t('plans_page.free'),
            note: t('plans_page.pay_as_you_go'),
            popular: false,
            includesLabel: t('plans_page.includes'),
            features: [
                t('plans_page.unlimited_tryon_sessions'),
                t('plans_page.7_day_analytics'),
                t('plans_page.standard_tryon_button'),
                { text: t('plans_page.community_support'), note: `(${t('plans_page.community_support_note')})` },
            ],
        },
        growth: {
            title: t('plans_page.growth'),
            note: t('plans_page.for_growing_stores'),
            popular: true,
            includesLabel: t('plans_page.everything_in_free_plus'),
            features: [
                t('plans_page.90_day_analytics'),
                t('plans_page.custom_button_branding'),
                { text: t('plans_page.email_notifications'), note: `(${t('plans_page.email_notifications_note')})` },
            ],
        },
        scale: {
            title: t('plans_page.scale'),
            note: t('plans_page.for_high_volume_stores'),
            popular: false,
            includesLabel: t('plans_page.everything_in_growth_plus'),
            features: [
                t('plans_page.unlimited_analytics'),
                t('plans_page.export_analytics'),
                { text: t('plans_page.priority_support'), note: `(${t('plans_page.priority_support_note')})` },
                t('plans_page.multilanguage_button'),
            ],
        },
    };

    /* Button label depends on the relationship to the active plan */
    const planActionLabel = (planKey) => {
        if (planKey === activeKey) return t('plans_page.current_plan_badge');
        const displayName = findPlanByKey(planKey)?.name
            || planKey.charAt(0).toUpperCase() + planKey.slice(1);
        if (rankOf(planKey) > activeRank) {
            return t('plans_page.upgrade_to_plan', { plan: displayName });
        }
        return t('plans_page.downgrade_to_plan', { plan: displayName });
    };

    const getCardWrapperStyle = (planKey) => ({
        border: selectedPlan === planKey ? '2px solid #0F6E5C' : '1px solid #E1E3E5',
        borderRadius: '14px',
        boxShadow: selectedPlan === planKey ? '0 4px 12px rgba(15, 110, 92, 0.15)' : 'none',
        display: 'grid',
        cursor: 'pointer',
    });

    /* Single data-driven card renderer for Free / Growth / Scale */
    const PricingCard = ({ planKey }) => {
        const meta = PLAN_META[planKey];
        const plan = findPlanByKey(planKey);
        const unlimited = !!plan && isUnlimitedPlan(plan);
        const limit = plan ? limitOf(plan) : null;
        const rate = plan ? rateOf(plan) : 0;
        const isActiveCard = planKey === activeKey;
        const pad = meta.popular ? '800' : '500';

        return (
            <Card padding={pad}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '28px' }}>
                    <div style={{ flex: 1 }}>
                        <BlockStack gap="500">
                            <InlineStack align="space-between" blockAlign="start" wrap={false}>
                                <BlockStack gap="050">
                                    <Text variant="headingMd" as="h3" fontWeight={600}>
                                        {meta.title}
                                    </Text>
                                    <Text variant="bodySm" as="p" tone="subdued">
                                        {meta.note}
                                    </Text>
                                </BlockStack>

                                {meta.popular && (
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
                                )}
                            </InlineStack>

                            <BlockStack gap="100">
                                <InlineStack gap="100" blockAlign="baseline">
                                    <Text variant="heading2xl" as="p">
                                        ${formatMoney(priceOf(plan))}
                                    </Text>
                                    <Text variant="bodyMd" as="span" tone="subdued">
                                        /month
                                    </Text>
                                </InlineStack>

                                {/* Included sessions line - unlimited plans use their own label */}
                                {unlimited ? (
                                    <Text variant="bodySm" as="p" fontWeight="medium">
                                        {t('plans_page.scale_included')}
                                    </Text>
                                ) : (
                                    <Text variant="bodySm" as="p" fontWeight="medium">
                                        {limit !== null
                                            ? t('plans_page.sessions_included', { count: formatNumber(limit) })
                                            : meta.note}
                                    </Text>
                                )}

                                {/* Extra-session rate - rendered for every plan, from the seed */}
                                {rate > 0 && (
                                    <Text variant="bodySm" as="p" fontWeight="medium">
                                        {t('plans_page.per_extra_session', { price: rate.toFixed(2) })}
                                    </Text>
                                )}
                            </BlockStack>

                            <Box borderBlockStartWidth="025" borderColor="border-subdued" paddingBlockStart="400">
                                <BlockStack gap="300">
                                    <Text variant="bodySm" as="p" fontWeight="semibold">
                                        {meta.includesLabel}
                                    </Text>
                                    <BlockStack gap="300">
                                        {meta.features.map((feature) => {
                                            const isObj = typeof feature === 'object';
                                            return (
                                                <PricingFeature
                                                    key={isObj ? feature.text : feature}
                                                    text={isObj ? feature.text : feature}
                                                    note={isObj ? feature.note : undefined}
                                                />
                                            );
                                        })}
                                    </BlockStack>
                                </BlockStack>
                            </Box>
                        </BlockStack>
                    </div>

                    <div style={{ paddingTop: '8px' }}>
                        <Button
                            fullWidth
                            size="large"
                            variant={isActiveCard ? undefined : 'primary'}
                            disabled={isActiveCard || !!upgradingPlan}
                            loading={upgradingPlan === planKey}
                            onClick={() => initiateBilling(planKey)}
                        >
                            {planActionLabel(planKey)}
                        </Button>
                    </div>
                </div>
            </Card>
        );
    };

    /* ============================================
        SECTION: CURRENT PLAN CARD
        ============================================ */
    const CurrentPlanCard = () => {
        const meta = PLAN_META[activeKey];
        const displayName = activePlanRow?.name
            || activeKey.charAt(0).toUpperCase() + activeKey.slice(1);

        return (
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
                                        {displayName}
                                    </Text>
                                    {meta && (
                                        <Text variant="bodySm" as="p" tone="subdued">
                                            {meta.note}
                                        </Text>
                                    )}
                                </BlockStack>
                            </InlineStack>
                            <Button disclosure onClick={scrollToPricing}>{t('plans_page.change_plan')}</Button>
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
                                                {formatNumber(usedSessions)}
                                            </Text>
                                            <Text variant="bodyMd" as="span" tone="subdued">
                                                {t('plans_page.sessions')}
                                            </Text>
                                        </InlineStack>
                                        {sessionSpend > 0 && (
                                            <Text variant="bodyMd" as="p" tone="subdued">
                                                ${sessionSpend.toFixed(2)} {t('plans_page.spent')}
                                            </Text>
                                        )}
                                    </BlockStack>
                                </div>

                                {/* Right: progress bar + labels */}
                                <div style={{ flex: 1 }}>
                                    <BlockStack gap="200">
                                        <InlineStack align="end">
                                            <BlockStack gap="0" inlineAlign="end">
                                                <Text variant="bodySm" as="span" tone="subdued">
                                                    {!hasActiveLimit
                                                        ? `${formatNumber(usedSessions)} ${t('plans_page.of_unlimited_sessions')}`
                                                        : `${formatNumber(usedSessions)} ${t('dashboard.session_usage.of_sessions', { count: formatNumber(sessionLimit) })}`}
                                                </Text>
                                                <Text variant="bodySm" as="span" tone="subdued">
                                                    {t('plans_page.this_cycle')}
                                                </Text>
                                            </BlockStack>
                                        </InlineStack>

                                        {hasActiveLimit && usagePercent !== null && (
                                            <div style={{ position: 'relative', paddingTop: '20px' }}>
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: `${Math.min(96, Math.max(6, usagePercent))}%`,
                                                        transform: 'translateX(-50%)',
                                                    }}
                                                >
                                                    <Text variant="bodySm" as="span" tone="caution" fontWeight="semibold">
                                                        {usagePercent}% {t('plans_page.used')}
                                                    </Text>
                                                </div>
                                                <ProgressBar
                                                    progress={usagePercent}
                                                    size="small"
                                                    tone={usagePercent >= 90 ? 'critical' : 'primary'}
                                                />
                                            </div>
                                        )}

                                        {!hasActiveLimit && (
                                            <Badge tone="magic">{t('dashboard.session_usage.unlimited_active')}</Badge>
                                        )}
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
                                {formatDate(cycleInfo.start)} &ndash; {formatDate(cycleInfo.end)} ({cycleInfo.days} {t('plans_page.days')})
                            </Text>
                        </BlockStack>
                        <BlockStack gap="050">
                            <Text variant="bodySm" as="p" tone="subdued">
                                {t('plans_page.Reset_on')}
                            </Text>
                            <Text variant="bodyMd" as="p" fontWeight="medium">
                                {formatDate(cycleInfo.end)}
                            </Text>
                        </BlockStack>
                        <BlockStack gap="050">
                            <Text variant="bodySm" as="p" tone="subdued">
                                {t('plans_page.rate')}
                            </Text>
                            <Text variant="bodyMd" as="p" fontWeight="medium">
                                ${rateOf(activePlanRow).toFixed(2)} {t('plans_page.per_session')}
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
    };

    /* ============================================
        SECTION: BREAKEVEN WARNING BANNER
        Shows when usage passes 60% of the plan limit.
        CTA targets the next plan up in the hierarchy.
        ============================================ */
    const BreakevenBanner = () => {
        if (!showBreakeven) return null;

        return (
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
                        <Button
                            variant="primary"
                            loading={upgradingPlan === nextHigherKey}
                            disabled={!!upgradingPlan}
                            onClick={() => initiateBilling(nextHigherKey)}
                        >
                            {planActionLabel(nextHigherKey)}
                        </Button>
                    </div>
                </InlineStack>
            </div>
        );
    };

    /* ============================================
        PRICING SECTION
        ============================================ */
    const PricingSection = () => (
        <div ref={pricingSectionRef}>
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
                {PLAN_RANK.map((planKey) => (
                    <div
                        key={planKey}
                        style={getCardWrapperStyle(planKey)}
                        onClick={() => setSelectedPlan(planKey)}
                    >
                        <PricingCard planKey={planKey} />
                    </div>
                ))}
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
        </div>
    );

    if (isLoadingPage) {
        return <PageLoader />;
    }

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
                    {/* <Button icon={CreditCardIcon} disclosure>
                        {t('plans_page.manage_payment_method')}
                    </Button> */}
                </InlineStack>

                <CurrentPlanCard />
                <BreakevenBanner />
                <PricingSection />
                <div style={{ marginTop: '10px' }}></div>
            </BlockStack>
        </Page>
    );
};

export default PlansPage;
