import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Popover,
    Button,
    DatePicker,
    OptionList,
    Box,
    InlineStack,
} from '@shopify/polaris';

/**
 * Preset date range options shown in the left pane of the popover.
 */
const getRangeOptions = (t) => [
    { label: t('dashboard.date_filter.today'), value: 'today' },
    { label: t('dashboard.date_filter.yesterday'), value: 'yesterday' },
    { label: t('dashboard.date_filter.last_7_days'), value: 'last7' },
    { label: t('dashboard.date_filter.last_30_days'), value: 'last30' },
    { label: t('dashboard.date_filter.last_90_days'), value: 'last90' },
    { label: t('dashboard.date_filter.custom'), value: 'custom' },
];

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

const formatDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/**
 * Date range filter button + popover (preset list + calendar), matching
 * the standard Shopify admin "Last 30 days" date filter pattern.
 */
const SessionFunnelDateFilter = () => {
    const { t } = useTranslation();
    const [popoverActive, setPopoverActive] = useState(false);
    const [selectedRangeValue, setSelectedRangeValue] = useState('last30');
    const [selectedDates, setSelectedDates] = useState(getRangeDates('last30'));
    const [{ month, year }, setMonthYear] = useState({
        month: selectedDates.end.getMonth(),
        year: selectedDates.end.getFullYear(),
    });
    const RANGE_OPTIONS = getRangeOptions(t);

    const togglePopoverActive = useCallback(() => setPopoverActive((active) => !active), []);

    const handleMonthChange = useCallback((month, year) => setMonthYear({ month, year }), []);

    const handleOptionSelect = useCallback((value) => {
        const [selected] = value;
        setSelectedRangeValue(selected);
        if (selected !== 'custom') {
            const range = getRangeDates(selected);
            setSelectedDates(range);
            setMonthYear({ month: range.end.getMonth(), year: range.end.getFullYear() });
        }
    }, []);

    const handleDatePickerChange = useCallback(({ start, end }) => {
        setSelectedDates({ start, end });
        setSelectedRangeValue('custom');
    }, []);

    const handleApply = useCallback(() => setPopoverActive(false), []);
    const handleCancel = useCallback(() => setPopoverActive(false), []);

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
                            <OptionList
                                options={RANGE_OPTIONS}
                                selected={[selectedRangeValue]}
                                onChange={handleOptionSelect}
                            />
                        </div>
                        <div style={{ minWidth: '360px', padding: '16px' }}>
                            <DatePicker
                                month={month}
                                year={year}
                                onChange={handleDatePickerChange}
                                onMonthChange={handleMonthChange}
                                selected={selectedDates}
                                allowRange
                            />
                        </div>
                    </InlineStack>
                </div>
            </Popover.Pane>
            <Popover.Pane fixed>
                <Popover.Section>
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
