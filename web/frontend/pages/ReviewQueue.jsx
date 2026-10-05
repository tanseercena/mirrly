import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Page,
    Card,
    Box,
    BlockStack,
    InlineStack,
    Text,
    Select,
    Badge,
    Button,
    Modal,
    Thumbnail,
    Spinner,
} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { ImageIcon } from '@shopify/polaris-icons';

// ============================================================
// ANCHOR EDITOR — drag-to-correct
//
// The cutout is rendered as an <img>; each anchor is an absolutely
// positioned handle at (x·100%, y·100%) with translate(-50%,-50%).
// Dragging uses pointer capture on the handle and converts pointer
// position back to normalized 0..1 coordinates relative to the image.
// ============================================================

function clamp01(v) {
    return Math.max(0, Math.min(1, v));
}

function AnchorEditor({ cutoutUrl, anchors, onChange }) {
    const containerRef = useRef(null);
    const dragRef = useRef(null);

    const onPointerDown = (name) => (e) => {
        e.preventDefault();
        dragRef.current = name;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        const name = dragRef.current;
        if (!name || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clamp01((e.clientX - rect.left) / rect.width);
        const y = clamp01((e.clientY - rect.top) / rect.height);
        onChange(name, x, y);
    };

    const onPointerUp = () => {
        dragRef.current = null;
    };

    return (
        <div
            ref={containerRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{ position: 'relative', width: '100%', maxWidth: 420, margin: '0 auto', touchAction: 'none', userSelect: 'none' }}
        >
            <img src={cutoutUrl} alt="garment cutout" style={{ width: '100%', display: 'block' }} draggable={false} />
            {Object.entries(anchors).map(([name, pt]) => (
                <div
                    key={name}
                    onPointerDown={onPointerDown(name)}
                    title={name}
                    style={{
                        position: 'absolute',
                        left: `${pt.x * 100}%`,
                        top: `${pt.y * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#2c6ecb',
                        border: '2px solid #fff',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                        cursor: 'grab',
                        zIndex: 2,
                    }}
                />
            ))}
        </div>
    );
}

// ============================================================
// QUEUE PAGE
// ============================================================

const TYPE_KEYS = ['', 'top', 'jacket', 'dress', 'pants', 'shorts', 'skirt', 'cap', 'glasses', 'shoes', 'bag', 'necklace'];
const STATUS_KEYS = ['needs_review', 'auto_approved', 'all'];

const statusKey = (key) => `status_${key}`;
const typeKey = (key) => (key ? `type_${key}` : 'type_all');

export default function ReviewQueue() {
    const { t } = useTranslation();
    const shopify = useAppBridge();
    const [rows, setRows] = useState(null);
    const [statusFilter, setStatusFilter] = useState('needs_review');
    const [typeFilter, setTypeFilter] = useState('');
    const [detail, setDetail] = useState(null);
    const [anchors, setAnchors] = useState({});
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [viewRaw, setViewRaw] = useState(false);

    const loadRows = useCallback(async () => {
        setRows(null);
        setLoadError(null);
        try {
            const res = await fetch(`/api/review-queue?status=${statusFilter}&type=${typeFilter}`);
            if (!res.ok) throw new Error(`${t('review_queue_page.queue_load_failed')} (${res.status})`);
            const { data } = await res.json();
            setRows(data);
        } catch (err) {
            setLoadError(err.message);
            setRows([]);
        }
    }, [statusFilter, typeFilter]);

    useEffect(() => {
        loadRows();
    }, [loadRows]);

    const openDetail = async (id) => {
        setDetail({ loading: true });
        try {
            const res = await fetch(`/api/review-queue/${id}`);
            if (!res.ok) throw new Error(`${t('review_queue_page.detail_load_failed')} (${res.status})`);
            const { data } = await res.json();
            setDetail(data);
            setAnchors(data.anchors ?? {});
        } catch (err) {
            shopify.toast.show(err.message, { isError: true });
            setDetail(null);
        }
    };

    const handleAnchorChange = (name, x, y) => {
        setAnchors((current) => ({ ...current, [name]: { x, y } }));
    };

    const saveCorrection = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/review-queue/${detail.id}/correct`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ anchors }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? `${t('review_queue_page.save_failed')} (${res.status})`);
            }
            shopify.toast.show(t('review_queue_page.correction_saved'));
            setDetail(null);
            loadRows();
        } catch (err) {
            shopify.toast.show(err.message, { isError: true });
        } finally {
            setSaving(false);
        }
    };

    const approveAsIs = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/review-queue/${detail.id}/approve`, { method: 'POST' });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? `${t('review_queue_page.approve_failed')} (${res.status})`);
            }
            shopify.toast.show(t('review_queue_page.approved_as_is'));
            setDetail(null);
            loadRows();
        } catch (err) {
            shopify.toast.show(err.message, { isError: true });
        } finally {
            setSaving(false);
        }
    };

    const detailLoading = detail?.loading === true;

    return (
        <Page fullWidth>
                <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="start">
                    <BlockStack gap="050">
                        <Text variant="heading2xl" as="h1">
                            {t('review_queue_page.title')}
                        </Text>
                        <Text variant="bodyMd" as="p" tone="subdued">
                            {t('review_queue_page.subtitle')}
                        </Text>
                    </BlockStack>
                    <InlineStack gap="300" blockAlign="end">
                        <Select
                            label={t('review_queue_page.status_label')}
                            labelInline
                            options={STATUS_KEYS.map((key) => ({ label: t(`review_queue_page.${statusKey(key)}`), value: key }))}
                            onChange={setStatusFilter}
                            value={statusFilter}
                        />
                        <Select
                            label={t('review_queue_page.type_label')}
                            labelInline
                            options={TYPE_KEYS.map((key) => ({ label: t(`review_queue_page.${typeKey(key)}`), value: key }))}
                            onChange={setTypeFilter}
                            value={typeFilter}
                        />
                        <Button onClick={loadRows}>{t('review_queue_page.refresh')}</Button>
                    </InlineStack>
                </InlineStack>

                {loadError && <Text tone="critical">{loadError}</Text>}

                {rows === null ? (
                    <Box paddingBlock="800"><BlockStack align="center"><Spinner /></BlockStack></Box>
                ) : rows.length === 0 ? (
                    <Card>
                        <Box padding="600">
                            <BlockStack gap="200" align="center">
                                <Text variant="headingMd">{t('review_queue_page.queue_clear_title')}</Text>
                                <Text tone="subdued" as="p">
                                    {t('review_queue_page.queue_clear_body')}
                                </Text>
                            </BlockStack>
                        </Box>
                    </Card>
                ) : (
                    <Card padding="0">
                        {rows.map((row, index) => (
                            <div
                                key={row.id}
                                style={
                                    index < rows.length - 1
                                        ? { borderBottom: '1px solid #F1F2F3' }
                                        : undefined
                                }
                            >
                                <Box padding="600">
                                    <InlineStack align="space-between" blockAlign="center">
                                        <InlineStack gap="300" blockAlign="center" wrap={false}>
                                            <Thumbnail
                                                source={row.product_image || ImageIcon}
                                                alt=""
                                                size="small"
                                            />
                                            <BlockStack gap="050">
                                                <InlineStack gap="200" align="start">
                                                    <Text variant="bodyMd" fontWeight="semibold">
                                                        {row.product_title ?? `Product #${row.id}`}
                                                    </Text>
                                                    <Badge tone={row.status === 'needs_review' ? 'attention' : 'success'}>
                                                        {t(`review_queue_page.${statusKey(row.status)}`)}
                                                    </Badge>
                                                    <Badge>{row.template_type}</Badge>
                                                </InlineStack>
                                                <Text variant="bodySm" as="p" tone="subdued">
                                                    {row.merchant ?? '—'} · confidence {row.confidence_score ?? '—'}
                                                    · {row.detection_method === 'ml_model' ? 'ML model' : 'geometric'}
                                                    · {row.created_at ? new Date(row.created_at).toLocaleDateString() : ''}
                                                </Text>
                                            </BlockStack>
                                        </InlineStack>
                                        <Button onClick={() => openDetail(row.id)}>{t('review_queue_page.review')}</Button>
                                    </InlineStack>
                                </Box>
                            </div>
                        ))}
                    </Card>
                )}
            </BlockStack>

            <Modal
                open={!!detail}
                onClose={() => setDetail(null)}
                title={detail && !detailLoading ? `${t('review_queue_page.modal_correct_title')}${detail.product_title ?? ''}` : t('review_queue_page.modal_loading')}
                large
            >
                {!detail || detailLoading ? (
                    <Box padding="800"><BlockStack align="center"><Spinner /></BlockStack></Box>
                ) : (
                    <Modal.Section>
                        <BlockStack gap="400">
                            <InlineStack gap="300" align="start">
                                <Button
                                    variant={viewRaw ? 'secondary' : 'primary'}
                                    onClick={() => setViewRaw(false)}
                                >
                                    {t('review_queue_page.view_cutout')}
                                </Button>
                                <Button
                                    variant={viewRaw ? 'primary' : 'secondary'}
                                    onClick={() => setViewRaw(true)}
                                >
                                    {t('review_queue_page.view_raw_photo')}
                                </Button>
                                <Text tone="subdued">{t('review_queue_page.drag_hint')}</Text>
                            </InlineStack>

                            <AnchorEditor
                                cutoutUrl={viewRaw ? detail.raw_url : detail.cutout_url}
                                anchors={anchors}
                                onChange={handleAnchorChange}
                            />

                            <InlineStack gap="300" align="end">
                                <Button onClick={() => setDetail(null)}>{t('review_queue_page.cancel')}</Button>
                                <Button onClick={approveAsIs} disabled={saving}>{t('review_queue_page.approve_as_is')}</Button>
                                <Button variant="primary" onClick={saveCorrection} loading={saving}>
                                    {t('review_queue_page.save_correction')}
                                </Button>
                            </InlineStack>
                        </BlockStack>
                    </Modal.Section>
                )}
            </Modal>
        </Page>
    );
}