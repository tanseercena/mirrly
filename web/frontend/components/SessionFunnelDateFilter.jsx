import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Popover,
    Button,
    DatePicker,
    Text,
    InlineStack,
    BlockStack,
    Icon,
} from '@shopify/polaris';
import { CheckSmallIcon } from '@shopify/polaris-icons';
import { prefetchJSON } from '../utils/prefetch.js';

/**
 * The store plan's analytics-history cap, in days (null = unlimited —
 * Scale plan, or the plan not loaded yet). Drives every restriction in
 * this filter: presets beyond the cap are locked (with an upgrade
 * nudge), the calendar disables older dates, and Apply clamps
 * over-long ranges.
 */
const planAnalyticsHistoryDays = (plan) => {
    const raw = plan?.limits?.analytics_history_days;
    if (raw === null || raw === undefined || raw === '' || raw === 'unlimited') return null;
    const days = Number(raw);
    return Number.isFinite(days) && days > 0 ? days : null;
};

/** Span of each preset, in days — presets wider than the plan cap are locked */
const PRESET_DAYS = { today: 1, yesterday: 1, last7: 7, last30: 30, last90: 90 };

/**
 * Preset date range options shown in the left pane of the popover.
 * Presets wider than the plan's history cap stay visible but locked,
 * with an upgrade nudge on hover.
 */
const getRangeOptions = (t, maxDays) => {
    const options = [
        { label: t('dashboard.date_filter.today'), value: 'today', days: 1 },
        { label: t('dashboard.date_filter.yesterday'), value: 'yesterday', days: 1 },
        { label: t('dashboard.date_filter.last_7_days'), value: 'last7', days: 7 },
        { label: t('dashboard.date_filter.last_30_days'), value: 'last30', days: 30 },
        { label: t('dashboard.date_filter.last_90_days'), value: 'last90', days: 90 },
        { label: t('dashboard.date_filter.custom'), value: 'custom' },
    ];
    return options.map((option) => ({
        ...option,
        locked: maxDays != null && option.days !== undefined && option.days > maxDays,
    }));
};

/** Compute {start, end} Date objects for a given preset value */
function getRangeDates(value) {
    const today = new Date();
    const end = new Date(today);
    let start = new Date(today);

    switch (value) {
        case 'yesterday':
            start.setDate(today.getDate() - 1);
            end.setDate(today.getDate() - 1);
            break;
        case 'last7':
            start.setDate(today.getDate() - 6);
            break;
        case 'last30':
            start.setDate(today.getDate() - 29);
            break;
        case 'last90':
            start.setDate(today.getDate() - 89);
            break;
        case 'today':
        default:
            break;
    }
    return { start, end };
}

/** Number of calendar days a {start, end} range covers */
const spanDays = ({ start, end }) => Math.max(1, Math.round((end - start) / 86400000) + 1);

/** Widest preset the plan cap still allows ('last30' when unrestricted) */
const largestAllowedPreset = (maxDays) => {
    if (maxDays == null) return 'last30';
    if (maxDays >= 90) return 'last90';
    if (maxDays >= 30) return 'last30';
    if (maxDays >= 7) return 'last7';
    return 'today';
};

/** Oldest date the plan cap lets the user pick (midnight, local) */
const earliestSelectableDate = (maxDays) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (maxDays - 1));
    return date;
};

const formatDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/**
 * Date range filter button + popover (preset list + calendar), matching
 * the standard Shopify admin "Last 30 days" date filter pattern.
 *
 * Enforces the store plan's analytics-history limit (Free: 7 days,
 * Growth: 90 days, Scale: unlimited): presets beyond the limit stay in
 * the list but locked (hover shows an upgrade nudge), the calendar
 * can't select beyond the limit, and Apply clamps the range.
 *
 * @param {function} [onChange] - optional callback receiving the committed
 *   {start, end} Date range when Apply is clicked.
 */
const SessionFunnelDateFilter = ({ onChange }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [popoverActive, setPopoverActive] = useState(false);
    const [hintValue, setHintValue] = useState(null); // locked option whose upsell card is open

    // Plan cap in days: undefined = loading, null = unlimited, number = capped
    const [maxDays, setMaxDays] = useState(undefined);

    useEffect(() => {
        let cancelled = false;

        // Reuses the request warmed at HTML-parse time (utils/prefetch.js)
        // on routes that warm /api/subscription.
        prefetchJSON('/api/subscription').then((response) => {
            if (cancelled) return;
            const plan = response?.ok ? response.data?.data?.plan : null;
            setMaxDays(planAnalyticsHistoryDays(plan));
        }).catch(() => {
            // Plan unknown — don't restrict the UI; the server clamps anyway
            if (!cancelled) setMaxDays(null);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // Committed state (only updated on Apply)
    const [selectedRangeValue, setSelectedRangeValue] = useState('last30');
    const [selectedDates, setSelectedDates] = useState(getRangeDates('last30'));

    // Temporary state for popover UI
    const [tempRangeValue, setTempRangeValue] = useState('last30');
    const [tempDates, setTempDates] = useState(getRangeDates('last30'));

    const [{ month, year }, setMonthYear] = useState({
        month: selectedDates.end.getMonth(),
        year: selectedDates.end.getFullYear(),
    });
    const RANGE_OPTIONS = getRangeOptions(t, maxDays);

    // When the plan cap becomes known and the committed range is wider
    // than allowed (e.g. a Free store's initial "Last 30 days"), shrink it
    // to the widest allowed preset and let the page refetch.
    useEffect(() => {
        if (maxDays == null) return;
        if (spanDays(selectedDates) <= maxDays) return;

        const preset = largestAllowedPreset(maxDays);
        const range = getRangeDates(preset);
        setSelectedRangeValue(preset);
        setSelectedDates(range);
        if (onChange) onChange(range);
    }, [maxDays, selectedDates, onChange]);

    const togglePopoverActive = useCallback(() => {
        setPopoverActive((active) => !active);
        // Reset temp state to committed state when opening
        if (!popoverActive) {
            setTempRangeValue(selectedRangeValue);
            setTempDates(selectedDates);
            setMonthYear({ month: selectedDates.end.getMonth(), year: selectedDates.end.getFullYear() });
        }
    }, [popoverActive, selectedRangeValue, selectedDates]);

    const handleMonthChange = useCallback((month, year) => setMonthYear({ month, year }), []);

    const handleOptionSelect = useCallback((value) => {
        setTempRangeValue(value);
        if (value !== 'custom') {
            const range = getRangeDates(value);
            setTempDates(range);
            setMonthYear({ month: range.end.getMonth(), year: range.end.getFullYear() });
        }
    }, []);

    const handleUpgrade = useCallback(() => {
        setPopoverActive(false);
        navigate('/plans');
    }, [navigate]);

    const handleDatePickerChange = useCallback(({ start, end }) => {
        setTempDates({ start, end });
        setTempRangeValue('custom');
    }, []);

    const handleApply = useCallback(() => {
        // Safety net: if the plan cap arrived while the popover was open,
        // pull the start forward instead of committing an over-long range.
        let committed = tempDates;
        if (maxDays != null && spanDays(committed) > maxDays) {
            const start = new Date(committed.end);
            start.setDate(start.getDate() - (maxDays - 1));
            committed = { start, end: committed.end };
        }
        // Commit the temp state
        setSelectedRangeValue(tempRangeValue);
        setSelectedDates(committed);
        setPopoverActive(false);
        // Notify parent pages that consume the selected range
        if (onChange) {
            onChange(committed);
        }
    }, [tempRangeValue, tempDates, maxDays, onChange]);

    const handleCancel = useCallback(() => {
        // Reset temp state to committed state
        setTempRangeValue(selectedRangeValue);
        setTempDates(selectedDates);
        setPopoverActive(false);
    }, [selectedRangeValue, selectedDates]);

    const activeLabel = RANGE_OPTIONS.find((option) => option.value === selectedRangeValue)?.label;
    const buttonLabel =
        selectedRangeValue === 'custom'
            ? `${formatDate(selectedDates.start)} - ${formatDate(selectedDates.end)}`
            : activeLabel;

    return (
        <Popover
            active={popoverActive}
            activator={
                <Button disclosure onClick={togglePopoverActive}>
                    {buttonLabel}
                </Button>
            }
            onClose={togglePopoverActive}
            fluidContent
        >
            <Popover.Pane fixed>
                <div style={{ width: '620px' }}>
                    <InlineStack wrap={false} gap="0">
                        <div style={{ minWidth: '180px', padding: '8px', borderInlineEnd: '1px solid var(--p-color-border-subdued)' }}>
                            <style>{`
                                .sfd-option {
                                    display: flex;
                                    align-items: center;
                                    gap: 8px;
                                    width: 100%;
                                    padding: 6px 8px;
                                    border: none;
                                    background: none;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    font-size: 13px;
                                    line-height: 20px;
                                    text-align: left;
                                    color: var(--p-color-text);
                                    font-family: inherit;
                                }
                                .sfd-option:hover, .sfd-option:focus-visible {
                                    background: var(--p-color-bg-hover);
                                    outline: none;
                                }
                                .sfd-option.sfd-selected { font-weight: 600; }
                                .sfd-option .sfd-check { width: 16px; min-width: 16px; }
                                .sfd-option.locked {
                                    color: var(--p-color-text-subdued);
                                }
                                .sfd-option.locked:hover, .sfd-option.locked:focus-visible {
                                    background: none;
                                }
                                /* Float the upsell card to the right of the
                                   labels so the disabled rows stay visible */
                                .sfd-hint .Polaris-PositionedOverlay {
                                    left: 170px !important;
                                }
                            `}</style>
                            {RANGE_OPTIONS.map((option) => {
                                const selected = tempRangeValue === option.value;
                                const row = (
                                    <button
                                        type="button"
                                        className={'sfd-option' + (selected ? ' sfd-selected' : '') + (option.locked ? ' locked' : '')}
                                        onClick={() => !option.locked && handleOptionSelect(option.value)}
                                    >
                                        <span className="sfd-check">
                                            {selected && <Icon source={CheckSmallIcon} />}
                                        </span>
                                        <span style={{ flex: 1 }}>{option.label}</span>
                                    </button>
                                );

                                return option.locked ? (
                                    // Hover-triggered upsell card, opened BELOW the
                                    // row so it never covers the option's label. The
                                    // Popover is rendered inside this wrapper, so
                                    // moving the cursor onto the card doesn't fire
                                    // the wrapper's mouseleave — it stays open while
                                    // hovered and closes when the cursor leaves.
                                    <div
                                        key={option.value}
                                        className="sfd-hint"
                                        onMouseEnter={() => setHintValue(option.value)}
                                        onMouseLeave={() => setHintValue((cur) => (cur === option.value ? null : cur))}
                                    >
                                        <Popover
                                            active={hintValue === option.value}
                                            activator={row}
                                            preferredPosition="below"
                                            preferredAlignment="left"
                                            autofocusTarget="none"
                                            fixed
                                            onClose={() => setHintValue(null)}
                                        >
                                            <Popover.Pane>
                                                <div style={{ padding: '16px 20px', width: '250px' }}>
                                                    <BlockStack gap="300">
                                                        <Text variant="bodyMd" as="p">
                                                            {t('dashboard.date_filter.upgrade_to_increase_retention')}
                                                        </Text>
                                                        <Button variant="primary" onClick={handleUpgrade}>
                                                            {t('dashboard.date_filter.upgrade')}
                                                        </Button>
                                                    </BlockStack>
                                                </div>
                                            </Popover.Pane>
                                        </Popover>
                                    </div>
                                ) : (
                                    <div key={option.value}>{row}</div>
                                );
                            })}
                        </div>
                        <div style={{ minWidth: '360px', padding: '16px' }}>
                            <DatePicker
                                month={month}
                                year={year}
                                onChange={handleDatePickerChange}
                                onMonthChange={handleMonthChange}
                                selected={tempDates}
                                allowRange
                                // Plan cap: dates older than the allowed window can't be picked
                                disableDatesBefore={maxDays != null ? earliestSelectableDate(maxDays) : undefined}
                            />
                        </div>
                    </InlineStack>
                </div>
            </Popover.Pane>
            <Popover.Pane fixed>
                <Popover.Section>
                    {maxDays != null && (
                        <>
                            <Text variant="bodySm" as="p" tone="subdued">
                                {t('dashboard.date_filter.history_limit', { days: maxDays })}
                            </Text>
                            <div style={{ height: '8px' }} />
                        </>
                    )}
                    <InlineStack align="end" gap="200">
                        <Button onClick={handleCancel}>{t('dashboard.date_filter.cancel')}</Button>
                        <Button variant="primary" onClick={handleApply}>
                            {t('dashboard.date_filter.apply')}
                        </Button>
                    </InlineStack>
                </Popover.Section>
            </Popover.Pane>
        </Popover>
    );
};

export default SessionFunnelDateFilter;
