import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Page,
    Card,
    Box,
    Banner,
    BlockStack,
    InlineStack,
    InlineGrid,
    Text,
    TextField,
    Select,
    Checkbox,
    Button,
    Icon,
    Popover,
    ColorPicker,
    Thumbnail,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
    InfoIcon,
    MobileIcon,
    CameraIcon,
    LockIcon,
    CheckIcon,
    NotificationIcon,
    AlertTriangleIcon,
    RefreshIcon,
    DeleteIcon,
    EmailIcon,
    CashDollarIcon,
    ChartLineIcon,
    ImageIcon,
    ArrowDiagonalIcon
} from '@shopify/polaris-icons';
import { showErrorToast } from '../helpers/functions';

/* ============================================
    TOGGLE SWITCH (reused across the app)
    ============================================ */
const Toggle = ({ checked, onChange, disabled = false }) => (
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
            opacity: disabled ? 0.5 : 1,
        }}
    >
        <span
            style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
        />
    </button>
);

/* ============================================
    COLOR <-> HSB CONVERSION HELPERS
    Polaris ColorPicker works in HSB, we display/store hex.
    ============================================ */
const hexToHsb = (hex) => {
    let r = 0, g = 0, b = 0;
    const clean = hex.replace('#', '');
    if (clean.length === 6) {
        r = parseInt(clean.substring(0, 2), 16) / 255;
        g = parseInt(clean.substring(2, 4), 16) / 255;
        b = parseInt(clean.substring(4, 6), 16) / 255;
    }
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta !== 0) {
        if (max === r) hue = ((g - b) / delta) % 6;
        else if (max === g) hue = (b - r) / delta + 2;
        else hue = (r - g) / delta + 4;
        hue *= 60;
        if (hue < 0) hue += 360;
    }
    const saturation = max === 0 ? 0 : delta / max;
    const brightness = max;
    return { hue, saturation, brightness };
};

const hsbToHex = ({ hue, saturation, brightness }) => {
    const c = brightness * saturation;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = brightness - c;
    let r = 0, g = 0, b = 0;
    if (hue < 60) [r, g, b] = [c, x, 0];
    else if (hue < 120) [r, g, b] = [x, c, 0];
    else if (hue < 180) [r, g, b] = [0, c, x];
    else if (hue < 240) [r, g, b] = [0, x, c];
    else if (hue < 300) [r, g, b] = [x, 0, c];
    else[r, g, b] = [c, 0, x];
    const toHex = (v) =>
        Math.round((v + m) * 255)
            .toString(16)
            .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

/* ============================================
    COLOR PICKER FIELD
    Swatch button (opens Popover + ColorPicker) + hex TextField
    ============================================ */
const ColorPickerField = ({ label, value, onChange }) => {
    const [popoverActive, setPopoverActive] = useState(false);
    const togglePopover = useCallback(() => setPopoverActive((active) => !active), []);

    const handleHsbChange = useCallback(
        (hsb) => {
            onChange(hsbToHex(hsb));
        },
        [onChange]
    );

    const handleHexChange = useCallback(
        (hex) => {
            onChange(hex);
        },
        [onChange]
    );

    return (
        <BlockStack gap="150">
            <Text variant="bodyMd" as="p" fontWeight="medium">
                {label}
            </Text>
            <InlineStack gap="200" blockAlign="center" wrap={false}>
                <Popover
                    active={popoverActive}
                    onClose={togglePopover}
                    activator={
                        <button
                            type="button"
                            onClick={togglePopover}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '6px',
                                border: '1px solid #C9CCCF',
                                background: value,
                                cursor: 'pointer',
                                padding: 0,
                                flexShrink: 0,
                            }}
                            aria-label={`Choose ${label}`}
                        />
                    }
                >
                    <Box padding="300">
                        <ColorPicker onChange={handleHsbChange} color={hexToHsb(value)} />
                    </Box>
                </Popover>
                <div style={{ flex: 1 }}>
                    <TextField
                        label={label}
                        labelHidden
                        value={value}
                        onChange={handleHexChange}
                        autoComplete="off"
                    />
                </div>
            </InlineStack>
        </BlockStack>
    );
};


/* ============================================
    SELECTABLE OPTION CARD (button position)
    ============================================ */
const PositionOptionCard = ({ label, barPosition, isSelected, onClick }) => (
    <div
        onClick={onClick}
        style={{
            flex: 1,
            border: isSelected ? '2px solid #0F6E5C' : '1px solid #E1E3E5',
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        }}
    >
        <div
            style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                border: '1px solid #C9CCCF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: barPosition,
                padding: '3px',
                gap: '2px',
                flexShrink: 0,
            }}
        >
            <div style={{ height: '3px', background: '#DFE3E8', borderRadius: '1px' }} />
            <div
                style={{
                    height: '4px',
                    background: barPosition === 'flex-end' ? '#0F6E5C' : '#DFE3E8',
                    borderRadius: '1px',
                }}
            />
        </div>
        <Text variant="bodySm" as="span" fontWeight="medium">
            {label}
        </Text>
    </div>
);

/* ============================================
    SETTINGS ROW (icon + title + description, generic)
    ============================================ */
const SettingsRow = ({ icon, iconBg, iconTone, title, description, children }) => (
    <InlineStack gap="300" blockAlign="start" wrap={false}>
        <Box background={iconBg} borderRadius="200" padding="200" minWidth="36px" maxWidth="36px">
            <Icon source={icon} tone={iconTone} />
        </Box>
        <BlockStack gap="100" >
            <Text variant="bodyMd" as="p" fontWeight="semibold">
                {title}
            </Text>
            <Text variant="bodySm" as="p" tone="subdued">
                {description}
            </Text>
        </BlockStack>
    </InlineStack>
);

/* ============================================
    SECTION: TRY-ON BUTTON BRANDING + LIVE PREVIEW
    ============================================ */
const BrandingCard = ({ settings, onChange, t }) => {
    const positions = [
        { value: 'below_cart', label: t('mirrly_settings.branding_card.position_below_cart'), bar: 'center' },
        { value: 'above_cart', label: t('mirrly_settings.branding_card.position_above_cart'), bar: 'flex-start' },
        { value: 'below_buy', label: t('mirrly_settings.branding_card.position_below_buy'), bar: 'flex-end' },
    ];

    return (
        <Card padding="400">
            <BlockStack gap="600">
                <BlockStack gap="050">
                    <Text variant="headingMd" as="h3" fontWeight={600}>
                        {t('mirrly_settings.branding_card.title')}
                    </Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                        {t('mirrly_settings.branding_card.description')}
                    </Text>
                </BlockStack>

                <TextField
                    label={t('mirrly_settings.branding_card.button_text')}
                    value={settings.buttonText}
                    onChange={(value) => onChange({ buttonText: value })}
                    autoComplete="off"
                />

                <BlockStack gap="200">
                    <Text variant="bodyMd" as="p" fontWeight="medium">
                        {t('mirrly_settings.branding_card.button_position')}
                    </Text>
                    <InlineStack gap="200" wrap={false}>
                        {positions.map((position) => (
                            <PositionOptionCard
                                key={position.value}
                                label={position.label}
                                barPosition={position.bar}
                                isSelected={settings.position === position.value}
                                onClick={() => onChange({ position: position.value })}
                            />
                        ))}
                    </InlineStack>
                </BlockStack>

                <BlockStack gap="200">
                    <Text variant="bodyMd" as="p" fontWeight="medium">
                        {t('mirrly_settings.branding_card.button_style')}
                    </Text>
                    <InlineGrid columns={3} gap="300">
                        <ColorPickerField
                            label={t('mirrly_settings.branding_card.text_color')}
                            value={settings.textColor}
                            onChange={(value) => onChange({ textColor: value })}
                        />
                        <ColorPickerField
                            label={t('mirrly_settings.branding_card.background_color')}
                            value={settings.bgColor}
                            onChange={(value) => onChange({ bgColor: value })}
                        />
                        <Select
                            label={t('mirrly_settings.branding_card.border_radius')}
                            options={[
                                { label: t('mirrly_settings.branding_card.border_radius_full'), value: 'full' },
                                { label: t('mirrly_settings.branding_card.border_radius_rounded'), value: 'rounded' },
                                { label: t('mirrly_settings.branding_card.border_radius_square'), value: 'square' },
                            ]}
                            value={settings.borderRadius}
                            onChange={(value) => onChange({ borderRadius: value })}
                        />
                    </InlineGrid>
                </BlockStack>

                <Checkbox
                    label={t('mirrly_settings.branding_card.show_icon')}
                    helpText={t('mirrly_settings.branding_card.show_icon_description')}
                    checked={settings.showIcon}
                    onChange={(value) => onChange({ showIcon: value })}
                />
            </BlockStack>
        </Card>
    );
    
};

const LivePreviewCard = ({ settings, t }) => {
    const radiusMap = { full: '999px', rounded: '8px', square: '2px' };
    const [selectedColor, setSelectedColor] = useState('natural');
    const [selectedSize, setSelectedSize] = useState('M');

    const colors = [
        { value: 'natural', hex: '#C8AD8B' },
        { value: 'gray', hex: '#9CA3AF' },
        { value: 'black', hex: '#1F2937' },
    ];

    const addToCartButton = (
        <button
            key="addToCart"
            type="button"
            style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #C9CCCF',
                background: '#FFFFFF',
                fontWeight: 600,
                cursor: 'default',
            }}
        >
            {t('mirrly_settings.live_preview_card.add_to_cart')}
        </button>
    );

    const buyItNowButton = (
        <button
            key="buyItNow"
            type="button"
            style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                background: '#111827',
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: 'default',
            }}
        >
            {t('mirrly_settings.live_preview_card.buy_it_now')}
        </button>
    );

    const tryOnButton = (
        <button
            key="tryOn"
            type="button"
            style={{
                width: '100%',
                padding: '10px',
                borderRadius: radiusMap[settings.borderRadius] ?? '999px',
                border: 'none',
                background: settings.bgColor,
                color: settings.textColor,
                fontWeight: 600,
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
            }}
        >
            {settings.showIcon && <Text> <Icon source={CameraIcon} tone="inherit" /> </Text>}
            {settings.buttonText || t('mirrly_settings.live_preview_card.try_it_on')}
        </button>
    );

    // Determine button order based on the selected position
    const buttonOrder = {
        below_cart: [addToCartButton, tryOnButton, buyItNowButton],
        above_cart: [tryOnButton, addToCartButton, buyItNowButton],
        below_buy: [addToCartButton, buyItNowButton, tryOnButton],
    };

    const orderedButtons = buttonOrder[settings.position] ?? buttonOrder.below_cart;

    return (
        <Card padding="400">
            <BlockStack gap="400">
                <Text variant="headingMd" as="h3" fontWeight={600}>
                    {t('mirrly_settings.live_preview_card.title')}
                </Text>

                <InlineStack gap="400" wrap={false} blockAlign="stretch">
                    <div style={{ width: '180px', flexShrink: 0 }}>
                        <img
                            src="/images/Live-Preview-settings-image.png"
                            alt={t('mirrly_settings.live_preview_card.product_title')}
                            style={{
                                width: '100%',
                                height: '100%',
                                minHeight: '340px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #E1E3E5',
                            }}
                        />
                    </div>

                    <BlockStack gap="400">
                        <BlockStack gap="100">
                            <Text variant="headingSm" as="p" fontWeight={600}>
                                {t('mirrly_settings.live_preview_card.product_title')}
                            </Text>
                            <Text variant="bodyMd" as="p" tone="subdued">
                                {t('mirrly_settings.live_preview_card.product_price')}
                            </Text>
                        </BlockStack>

                        <BlockStack gap="150">
                            <Text variant="bodySm" as="p" fontWeight="medium">
                                {t('mirrly_settings.live_preview_card.color_label')}: {(() => {
                                    const label = colors.find((c) => c.value === selectedColor)?.value ?? '';
                                    return label.charAt(0).toUpperCase() + label.slice(1);
                                })()}
                            </Text>
                            <InlineStack gap="150">
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setSelectedColor(color.value)}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: color.hex,
                                            border:
                                                selectedColor === color.value
                                                    ? '2px solid #0F6E5C'
                                                    : '2px solid transparent',
                                            outline: '1px solid #E1E3E5',
                                            cursor: 'pointer',
                                            padding: 0,
                                        }}
                                    />
                                ))}
                            </InlineStack>
                        </BlockStack>

                        <BlockStack gap="150">
                            <Text variant="bodySm" as="p" fontWeight="medium">
                                {t('mirrly_settings.live_preview_card.size_label')}: {selectedSize}
                            </Text>
                            <InlineStack gap="150">
                                {['S', 'M', 'L'].map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            width: '36px',
                                            height: '32px',
                                            borderRadius: '6px',
                                            border:
                                                selectedSize === size
                                                    ? '2px solid #0F6E5C'
                                                    : '1px solid #C9CCCF',
                                            background: '#FFFFFF',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </InlineStack>
                        </BlockStack>

                        <BlockStack gap="150">{orderedButtons}</BlockStack>
                    </BlockStack>
                </InlineStack>

                <InlineStack gap="100" blockAlign="start" align="start" wrap={false}>
                    <Text>  <Icon source={InfoIcon} tone="subdued" /> </Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                        {t('mirrly_settings.live_preview_card.preview_note')}
                    </Text>
                </InlineStack>
            </BlockStack>
        </Card>
    );
};

/* ============================================
    SECTION: CAMERA FALLBACK BEHAVIOR
    ============================================ */
const CameraFallbackCard = ({ settings, onChange, t }) => {
    const [unsupported, setUnsupported] = useState(settings?.unsupported || 'ai_preview');
    const [permissionDenied, setPermissionDenied] = useState(settings?.permission_denied || 'guidance');

    // Update local state when settings prop changes
    useEffect(() => {
        if (settings) {
            setUnsupported(settings.unsupported || 'ai_preview');
            setPermissionDenied(settings.permission_denied || 'guidance');
        }
    }, [settings]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <Card padding="400">
                <BlockStack gap="400">
                    <BlockStack gap="050">
                        <Text variant="headingMd" as="h3" fontWeight={600}>
                            {t('mirrly_settings.camera_fallback_card.title')}
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                            {t('mirrly_settings.camera_fallback_card.description')}
                        </Text>
                    </BlockStack>

                    <InlineStack align="space-between" blockAlign="start" wrap={false} gap="400">
                        <SettingsRow
                            icon={MobileIcon}
                            iconBg="bg-fill-info-secondary"
                            iconTone="info"
                            title={t('mirrly_settings.camera_fallback_card.unsupported_browser')}
                            description={t('mirrly_settings.camera_fallback_card.unsupported_browser_description')}
                        />
                        <div style={{ width: '260px', flexShrink: 0 }}>
                            <BlockStack gap="100">
                                <Select
                                    label={t('mirrly_settings.camera_fallback_card.unsupported_browser_fallback')}
                                    labelHidden
                                    options={[
                                        { label: t('mirrly_settings.camera_fallback_card.show_ai_preview'), value: 'ai_preview' },
                                        { label: t('mirrly_settings.camera_fallback_card.hide_try_on_button'), value: 'hide' },
                                    ]}
                                    value={unsupported}
                                    onChange={(value) => {
                                        setUnsupported(value);
                                        onChange('unsupported', value);
                                    }}
                                />
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {t('mirrly_settings.camera_fallback_card.ai_preview_description')}
                                </Text>
                            </BlockStack>
                        </div>
                    </InlineStack>

                    <InlineStack align="space-between" blockAlign="start" wrap={false} gap="400">
                        <SettingsRow
                            icon={CameraIcon}
                            iconBg="bg-fill-magic-secondary"
                            iconTone="magic"
                            title={t('mirrly_settings.camera_fallback_card.permission_denied')}
                            description={t('mirrly_settings.camera_fallback_card.permission_denied_description')}
                        />
                        <div style={{ width: '260px', flexShrink: 0 }}>
                            <BlockStack gap="100">
                                <Select
                                    label={t('mirrly_settings.camera_fallback_card.permission_denied_fallback')}
                                    labelHidden
                                    options={[
                                        { label: t('mirrly_settings.camera_fallback_card.show_guidance'), value: 'guidance' },
                                        { label: t('mirrly_settings.camera_fallback_card.show_ai_preview'), value: 'ai_preview' },
                                    ]}
                                    value={permissionDenied}
                                    onChange={(value) => {
                                        setPermissionDenied(value);
                                        onChange('permission_denied', value);
                                    }}
                                />
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {t('mirrly_settings.camera_fallback_card.guidance_description')}
                                </Text>
                            </BlockStack>
                        </div>
                    </InlineStack>
                </BlockStack>
            </Card>

            <Box
                background="bg-fill-info-secondary"
                borderWidth="025"
                borderColor="border-info"
                borderRadius="200"
                padding="400"
            >
                <BlockStack gap="400">
                    <InlineStack gap="150" blockAlign="center">
                        <Text> <Icon source={InfoIcon} tone="info" /> </Text>
                        <Text variant="bodyMd" as="p" fontWeight="semibold" tone="info">
                            {t('mirrly_settings.camera_fallback_card.why_fallbacks_matter')}
                        </Text>
                    </InlineStack>

                    <div style={{ lineHeight: '2.0', paddingLeft: '16px' }}>
                        <Text variant="bodyMd" as="p">
                            {t('mirrly_settings.camera_fallback_card.why_fallbacks_description')}
                        </Text>
                    </div>

                    <InlineStack gap="050" blockAlign="center" padding="400">
                        <Button variant="plain">{t('mirrly_settings.camera_fallback_card.learn_more_about_fallbacks')}</Button>
                        <Text> <Icon source={ArrowDiagonalIcon} tone="info" /> </Text>
                    </InlineStack>
                </BlockStack>
            </Box>
        </div>
    );
};

/* ============================================
    SECTION: PRIVACY & RECORDING
    ============================================ */
const PrivacyCard = ({ settings, onChange, t }) => {
    const [recording, setRecording] = useState(settings?.recording || false);
    const [retention, setRetention] = useState(settings?.retention || '7');

    // Update local state when settings prop changes
    useEffect(() => {
        if (settings) {
            setRecording(settings.recording || false);
            setRetention(settings.retention || '7');
        }
    }, [settings]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <Card padding="400">
                <BlockStack gap="400">
                    <BlockStack gap="050">
                        <Text variant="headingMd" as="h3" fontWeight={600}>
                            {t('mirrly_settings.privacy_card.title')}
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                            {t('mirrly_settings.privacy_card.description')}
                        </Text>
                    </BlockStack>

                    <InlineStack align="space-between" blockAlign="center" wrap={false}>
                        <BlockStack gap="050">
                            <Text variant="bodyMd" as="p" fontWeight="semibold">
                                {t('mirrly_settings.privacy_card.record_shopper_videos')}
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                                {t('mirrly_settings.privacy_card.record_shopper_videos_description')}
                            </Text>
                        </BlockStack>
                        <Toggle
                            checked={recording}
                            onChange={(value) => {
                                setRecording(value);
                                onChange('recording', value);
                            }}
                        />
                    </InlineStack>

                    <Box paddingInlineStart="400">
                        <InlineStack align="space-between" blockAlign="center" wrap={false}>
                            <BlockStack gap="050">
                                <Text
                                    variant="bodyMd"
                                    as="p"
                                    fontWeight="medium"
                                    tone={recording ? undefined : 'subdued'}
                                >
                                    {t('mirrly_settings.privacy_card.retention_period')}
                                </Text>
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {t('mirrly_settings.privacy_card.retention_period_description')}
                                </Text>
                            </BlockStack>
                            <div style={{ width: '160px', flexShrink: 0 }}>
                                <Select
                                    label={t('mirrly_settings.privacy_card.retention_period')}
                                    labelHidden
                                    disabled={!recording}
                                    options={[
                                        { label: t('mirrly_settings.privacy_card.7_days'), value: '7' },
                                        { label: t('mirrly_settings.privacy_card.30_days'), value: '30' },
                                        { label: t('mirrly_settings.privacy_card.90_days'), value: '90' },
                                    ]}
                                    value={retention}
                                    onChange={(value) => {
                                        setRetention(value);
                                        onChange('retention', value);
                                    }}
                                />
                            </div>
                        </InlineStack>
                    </Box>

                    <Box background="bg-fill-info-secondary" padding="300" borderRadius="200">
                        <InlineStack gap="200" blockAlign="start" wrap={false}>
                            <Text> <Icon source={InfoIcon} tone="info" /> </Text>
                            <Text variant="bodySm" as="p">
                                {t('mirrly_settings.privacy_card.privacy_info')}
                            </Text>
                        </InlineStack>
                    </Box>
                </BlockStack>
            </Card>

            <Box background="bg-fill-success-secondary" borderRadius="200" padding="400">
                <BlockStack gap="400">
                    <InlineStack gap="150" blockAlign="center">
                        <Text> <Icon source={LockIcon} tone="success" /> </Text>
                        <Text variant="bodyMd" as="p" fontWeight="semibold" tone="success">
                            {t('mirrly_settings.privacy_card.privacy_first')}
                        </Text>
                    </InlineStack>
                    <BlockStack gap="200" >
                        {[
                            t('mirrly_settings.privacy_card.off_by_default'),
                            t('mirrly_settings.privacy_card.no_recordings_saved'),
                            t('mirrly_settings.privacy_card.data_only_used'),
                            t('mirrly_settings.privacy_card.youre_in_control'),
                        ].map((item) => (
                            <InlineStack key={item} gap="200" blockAlign="center" wrap={false}>
                                <Text> <Icon source={CheckIcon} tone="success" /> </Text>
                                <Text variant="bodySm" as="span">
                                    {item}
                                </Text>
                            </InlineStack>
                        ))}
                    </BlockStack>
                    <InlineStack gap="100" blockAlign="center" padding="400">
                        <Button variant="plain">{t('mirrly_settings.camera_fallback_card.learn_more_about_fallbacks')}</Button>
                        <Text> <Icon source={ArrowDiagonalIcon} tone="info" /> </Text>
                    </InlineStack>
                </BlockStack>
            </Box>
        </div>
    );
};

/* ============================================
    SECTION: NOTIFICATIONS
    ============================================ */
const NotificationsCard = ({ settings, onChange, t }) => {
    const [weeklySummary, setWeeklySummary] = useState(settings?.weekly_summary ?? true);
    const [spendAlert, setSpendAlert] = useState(settings?.spend_alert ?? true);
    const [completionAlert, setCompletionAlert] = useState(settings?.completion_alert ?? true);
    const [spendThreshold, setSpendThreshold] = useState(settings?.spend_threshold ?? '80');
    const [completionThreshold, setCompletionThreshold] = useState(settings?.completion_threshold ?? '60');
    const [email, setEmail] = useState(settings?.email ?? 'you@yourstore.com');

    // Update local state when settings prop changes
    useEffect(() => {
        if (settings) {
            setWeeklySummary(settings.weekly_summary ?? true);
            setSpendAlert(settings.spend_alert ?? true);
            setCompletionAlert(settings.completion_alert ?? true);
            setSpendThreshold(settings.spend_threshold ?? '80');
            setCompletionThreshold(settings.completion_threshold ?? '60');
            setEmail(settings.email ?? 'you@yourstore.com');
        }
    }, [settings]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <Card padding="400">
                <BlockStack gap="400">
                    <BlockStack gap="050">
                        <Text variant="headingMd" as="h3" fontWeight={600}>
                            {t('mirrly_settings.notifications_card.title')}
                        </Text>
                        <Text variant="bodySm" as="p" tone="subdued">
                            {t('mirrly_settings.notifications_card.description')}
                        </Text>
                    </BlockStack>

                    <InlineStack align="space-between" blockAlign="center" wrap={false}>
                        <SettingsRow
                            icon={EmailIcon}
                            iconBg="bg-fill-success-secondary"
                            iconTone="success"
                            title={t('mirrly_settings.notifications_card.weekly_summary_email')}
                            description={t('mirrly_settings.notifications_card.weekly_summary_description')}
                        />
                        <Toggle
                            checked={weeklySummary}
                            onChange={(value) => {
                                setWeeklySummary(value);
                                onChange('weekly_summary', value);
                            }}
                        />
                    </InlineStack>

                    <InlineStack align="space-between" blockAlign="center" wrap={false} gap="300">
                        <SettingsRow
                            icon={CashDollarIcon}
                            iconBg="bg-fill-caution-secondary"
                            iconTone="warning"
                            title={t('mirrly_settings.notifications_card.spend_milestone_alerts')}
                            description={t('mirrly_settings.notifications_card.spend_milestone_description')}
                        />
                        <InlineStack gap="300" blockAlign="center" wrap={false}>
                            <div style={{ width: '180px' }}>
                                <Select
                                    label={t('mirrly_settings.notifications_card.spend_threshold')}
                                    labelHidden
                                    options={[
                                        { label: t('mirrly_settings.notifications_card.80_percent_monthly'), value: '80' },
                                        { label: t('mirrly_settings.notifications_card.90_percent_monthly'), value: '90' },
                                        { label: t('mirrly_settings.notifications_card.100_percent_monthly'), value: '100' },
                                    ]}
                                    value={spendThreshold}
                                    onChange={(value) => {
                                        setSpendThreshold(value);
                                        onChange('spend_threshold', value);
                                    }}
                                />
                            </div>
                            <Toggle
                                checked={spendAlert}
                                onChange={(value) => {
                                    setSpendAlert(value);
                                    onChange('spend_alert', value);
                                }}
                            />
                        </InlineStack>
                    </InlineStack>

                    <InlineStack align="space-between" blockAlign="center" wrap={false} gap="300">
                        <SettingsRow
                            icon={ChartLineIcon}
                            iconBg="bg-fill-magic-secondary"
                            iconTone="magic"
                            title={t('mirrly_settings.notifications_card.low_completion_rate_alerts')}
                            description={t('mirrly_settings.notifications_card.low_completion_rate_description')}
                        />
                        <InlineStack gap="300" blockAlign="center" wrap={false}>
                            <div style={{ width: '150px' }}>
                                <Select
                                    label={t('mirrly_settings.notifications_card.completion_threshold')}
                                    labelHidden
                                    options={[
                                        { label: t('mirrly_settings.notifications_card.below_60_percent'), value: '60' },
                                        { label: t('mirrly_settings.notifications_card.below_70_percent'), value: '70' },
                                        { label: t('mirrly_settings.notifications_card.below_80_percent'), value: '80' },
                                    ]}
                                    value={completionThreshold}
                                    onChange={(value) => {
                                        setCompletionThreshold(value);
                                        onChange('completion_threshold', value);
                                    }}
                                />
                            </div>
                            <Toggle
                                checked={completionAlert}
                                onChange={(value) => {
                                    setCompletionAlert(value);
                                    onChange('completion_alert', value);
                                }}
                            />
                        </InlineStack>
                    </InlineStack>

                    <BlockStack gap="200">
                        <InlineStack gap="100" blockAlign="center" wrap={false}>
                            <div style={{ minWidth: '160px' }}>
                                <Text variant="bodyMd" as="label" fontWeight="medium">
                                    {t('mirrly_settings.notifications_card.send_notifications_to')}
                                </Text>
                            </div>
                            <div style={{ flex: 1 }}>
                                <TextField
                                    label={t('mirrly_settings.notifications_card.send_notifications_to')}
                                    labelHidden
                                    value={email}
                                    onChange={(value) => {
                                        setEmail(value);
                                        onChange('email', value);
                                    }}
                                    autoComplete="off"
                                    type="email"
                                />
                            </div>
                        </InlineStack>
                        <Text variant="bodySm" as="p" tone="subdued">
                            {t('mirrly_settings.notifications_card.notifications_email_description')}
                        </Text>
                    </BlockStack>
                </BlockStack>
            </Card>

            <div
                style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '12px',
                    padding: '24px',
                }}
            >
                <BlockStack gap="600">
                    <InlineStack gap="200" blockAlign="center">
                        <Text> <Icon source={NotificationIcon} tone="warning" /> </Text>
                        <Text variant="bodyLg" as="p" fontWeight="semibold" tone="warning">
                            {t('mirrly_settings.notifications_card.notifications_via_email')}
                        </Text>
                    </InlineStack>
                    <BlockStack gap="150" align="center" >
                        <Text variant="bodyMd" as="p" >
                            {t('mirrly_settings.notifications_card.never_spam')}
                        </Text>
                        <Text variant="bodyMd" as="p" >
                            {t('mirrly_settings.notifications_card.change_anytime')}
                        </Text>
                        <Text variant="bodyMd" as="p" >
                            {t('mirrly_settings.notifications_card.critical_alerts')}
                        </Text>
                    </BlockStack>
                </BlockStack>
            </div>
        </div>
    );
};
/* ============================================
    SECTION: ADVANCED
    ============================================ */
const AdvancedCard = ({ t }) => {
    const recordingOff = true;

    return (
        <Box
            background="bg-surface"
            borderWidth="025"
            borderColor="border-critical"
            borderRadius="200"
            padding="400"
        >
            <BlockStack gap="400">
                <BlockStack gap="050">
                    <Text variant="headingMd" as="h3" fontWeight={600} tone="critical">
                        {t('mirrly_settings.advanced_card.title')}
                    </Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                        {t('mirrly_settings.advanced_card.description')}
                    </Text>
                </BlockStack>

                <InlineStack align="space-between" blockAlign="center" wrap={false}>
                    <SettingsRow
                        icon={RefreshIcon}
                        iconBg="bg-fill-critical-secondary"
                        iconTone="critical"
                        title={t('mirrly_settings.advanced_card.reset_onboarding')}
                        description={t('mirrly_settings.advanced_card.reset_onboarding_description')}
                    />
                    <Button>{t('mirrly_settings.advanced_card.reset_onboarding_button')}</Button>
                </InlineStack>

                <InlineStack align="space-between" blockAlign="center" wrap={false}>
                    <SettingsRow
                        icon={DeleteIcon}
                        iconBg="bg-fill-critical-secondary"
                        iconTone="critical"
                        title={t('mirrly_settings.advanced_card.clear_stored_clips')}
                        description={t('mirrly_settings.advanced_card.clear_stored_clips_description')}
                    />
                    <BlockStack gap="100" inlineAlign="end">
                        <Button disabled={recordingOff}>{t('mirrly_settings.advanced_card.clear_clips_button')}</Button>
                        {recordingOff && (
                            <Text variant="bodySm" as="p" tone="subdued">
                                {t('mirrly_settings.advanced_card.recording_is_off')}
                            </Text>
                        )}
                    </BlockStack>
                </InlineStack>
            </BlockStack>
        </Box>
    );
};

/* ============================================
    SETTINGS PAGE
    ============================================ */
const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const shopify = useAppBridge();
    const [branding, setBranding] = useState({
        buttonText: t('mirrly_settings.live_preview_card.try_it_on'),
        position: 'below_cart',
        textColor: '#FFFFFF',
        bgColor: '#0D9488',
        borderRadius: 'full',
        showIcon: true,
    });

    // Camera fallback state
    const [cameraFallback, setCameraFallback] = useState({
        unsupported: 'ai_preview',
        permission_denied: 'guidance',
    });

    // Privacy recording state
    const [privacyRecording, setPrivacyRecording] = useState({
        recording: false,
        retention: '7',
    });

    // Notification state
    const [notification, setNotification] = useState({
        weekly_summary: true,
        spend_alert: true,
        completion_alert: true,
        spend_threshold: '80',
        completion_threshold: '60',
        email: 'you@yourstore.com',
    });

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                if (data.data?.button_branding) {
                    const backendData = data.data.button_branding;
                    // Transform nested buttonStyle to flat structure for BrandingCard
                    setBranding({
                        buttonText: backendData.buttonText || t('mirrly_settings.live_preview_card.try_it_on'),
                        position: backendData.position || 'below_cart',
                        textColor: backendData.buttonStyle?.textColor || '#FFFFFF',
                        bgColor: backendData.buttonStyle?.bgColor || '#0D9488',
                        borderRadius: backendData.buttonStyle?.borderRadius || 'full',
                        showIcon: backendData.showIcon !== undefined ? backendData.showIcon : true,
                    });
                }
                if (data.data?.camera_fallback) {
                    setCameraFallback(data.data.camera_fallback);
                }
                if (data.data?.privacy_recording) {
                    setPrivacyRecording(data.data.privacy_recording);
                }
                if (data.data?.notification) {
                    setNotification(data.data.notification);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, [t]);

    // Update buttonText when language changes
    useEffect(() => {
        setBranding(prev => ({
            ...prev,
            buttonText: t('mirrly_settings.live_preview_card.try_it_on')
        }));
    }, [i18n.language, t]);

    const handleBrandingChange = useCallback(async (partial) => {
        // Update local state immediately for responsive UI
        setBranding((prev) => ({ ...prev, ...partial }));

        // Get the updated state for the backend
        const updated = { ...branding, ...partial };

        // Transform flat structure to nested structure for backend
        const backendData = {
            buttonText: updated.buttonText,
            position: updated.position,
            textColor: updated.textColor,
            bgColor: updated.bgColor,
            borderRadius: updated.borderRadius,
            showIcon: updated.showIcon,
        };

        try {
            const response = await fetch('/api/button-branding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendData),
            });

            if (response.ok) {
                shopify.toast.show(t('changes_saved'));
            } else {
                showErrorToast(shopify, t('error_occur'));
            }
        } catch (error) {
            console.error('Failed to save button branding:', error);
            shopify.toast.show(t('error_occur'), { isError: true , duration:999999} );
        }
    }, [branding, shopify, t]);

    const handleCameraFallbackChange = useCallback(async (field, value) => {
        // Update local state immediately
        setCameraFallback((prev) => ({ ...prev, [field]: value }));

        try {
            const response = await fetch('/api/camera-fallback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...cameraFallback,
                    [field]: value,
                }),
            });

            if (response.ok) {
                shopify.toast.show(t('changes_saved'));
            } else {
                showErrorToast(shopify, t('error_occur'));
            }
        } catch (error) {
            console.error('Failed to save camera fallback settings:', error);
            shopify.toast.show(t('error_occur'), { isError: true , duration: 999999});
        }
    }, [cameraFallback, shopify, t]);

    const handlePrivacyRecordingChange = useCallback(async (field, value) => {
        // Update local state immediately
        setPrivacyRecording((prev) => ({ ...prev, [field]: value }));

        try {
            const response = await fetch('/api/privacy-recording', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...privacyRecording,
                    [field]: value,
                }),
            });

            if (response.ok) {
                shopify.toast.show(t('changes_saved'));
            } else {
                showErrorToast(shopify, t('error_occur'));
            }
        } catch (error) {
            console.error('Failed to save privacy recording settings:', error);
            shopify.toast.show(t('error_occur'), { isError: true , duration:999999 });
        }
    }, [privacyRecording, shopify, t]);

    const handleNotificationChange = useCallback(async (field, value) => {
        // Update local state immediately
        setNotification((prev) => ({ ...prev, [field]: value }));

        try {
            const response = await fetch('/api/notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...notification,
                    [field]: value,
                }),
            });

            if (response.ok) {
                shopify.toast.show(t('changes_saved'));
            } else {
                showErrorToast(shopify, t('error_occur'));
            }
        } catch (error) {
            console.error('Failed to save notification settings:', error);
            shopify.toast.show(t('error_occur'), { isError: true , duration: 999999 });
        }
    }, [notification, shopify, t]);

    return (
        <Page fullWidth>
            <BlockStack gap="400">
                <BlockStack gap="050">
                    <Text variant="heading2xl" as="h1">
                        {t('mirrly_settings.title')}
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                        {t('mirrly_settings.subtitle')}
                    </Text>
                </BlockStack>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '12px' }}>
                    <BrandingCard settings={branding} onChange={handleBrandingChange} t={t} />
                    <LivePreviewCard settings={branding} t={t} />
                </div>

                <CameraFallbackCard settings={cameraFallback} onChange={handleCameraFallbackChange} t={t} />
                <PrivacyCard settings={privacyRecording} onChange={handlePrivacyRecordingChange} t={t} />
                <NotificationsCard settings={notification} onChange={handleNotificationChange} t={t} />
                <AdvancedCard t={t} />
            </BlockStack>
        </Page>
    );
};
export default SettingsPage;