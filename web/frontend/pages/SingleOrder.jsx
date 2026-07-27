import React, {useState, useEffect, useCallback, useRef, useContext} from 'react';
import {
    Page,
    Card,
    Button,
    Text,
    InlineStack,
    BlockStack,
    InlineGrid,
    Badge,
    Thumbnail,
    Divider,
    Link,
    Spinner,
        SkeletonBodyText,
    Layout,
    TextField,
    Modal,
    LegacyStack,
    FormLayout,
    List,
    RadioButton,
    Box,
    Popover,
    Icon,
    DatePicker,
    IndexTable,
    useIndexResourceState,
    Select, DropZone
} from "@shopify/polaris";
import { useLocation, useParams } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import prettyBytes from "pretty-bytes"
import { CalendarIcon } from "@shopify/polaris-icons";
import { AppContext } from "../components/providers/AppProvider";
import { useTranslation } from "react-i18next";
import LanguageSelector from '../components/LanguageSelector';
import { XSmallIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
function SingleOrder() {
    const { id } = useParams();
    const { store } = useContext(AppContext);
    const navigate = useNavigate();
    const { t } = useTranslation()
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [resendingEmail, setResendingEmail] = useState(false);
    const [downloads, setDownloads] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [customerEmail, setCustomerEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loadingLicenses, setLoadingLicenses] = useState({});
    const [showResetModal, setShowResetModal] = useState(false);
        const [resetOption, setResetOption] = useState(t("orders.single_order.download_limits"));
    const [expirationOption, setExpirationOption] = useState(t("orders.single_order.expire_after_days"));
    const [downloadLimit, setDownloadLimit] = useState('');
    const [expirationDays, setExpirationDays] = useState('');
    const [pickerVisible, setPickerVisible] = useState(false);
    const [expirationDate, setExpirationDate] = useState(new Date());
    const formattedValue = expirationDate.toISOString().slice(0, 10);
    const [{ month, year }, setDate] = useState({
        month: expirationDate.getMonth(),
        year: expirationDate.getFullYear(),
    });
    const datePickerRef = useRef(null);
    const [saving, setSaving] = useState(false);
    const [showDownloadsModal, setShowDownloadsModal] = useState(false);
    const [selectedDownloads, setSelectedDownloads] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [manualDeliveryFiles, setManualDeliveryFiles] = useState({});
    const [showSendContentModal, setShowSendContentModal] = useState(false);
    const [sendingContent, setSendingContent] = useState(false);
    const [showRevokeAccessModal, setShowRevokeAccessModal] = useState(false);
    const [revokingAccess, setRevokingAccess] = useState(false);


    function isNodeWithinPopover(node) {
        return datePickerRef?.current
            ? nodeContainsDescendant(datePickerRef.current, node)
            : false;
    }

    const handleOpenDownloadsModal = async (fileId, productId, orderId) => {
        try {
            const res = await fetch(`/api/downloads/${fileId}/${productId}/${orderId}`);
            const data = await res.json();

            if (res.ok) {
                setSelectedDownloads(data.downloads);
                setShowDownloadsModal(true);
            } else {
                console.error('Failed to fetch downloads:', data.message || res.statusText);
            }
        } catch (error) {
            console.error('Error opening downloads modal:', error);
        }
    };

    function handleMonthChange(month, year) {
        setDate({ month, year });
    }

    function handleDateSelection({ end: newSelectedDate }) {
        setExpirationDate(newSelectedDate);
        setPickerVisible(false);
    }


    const fetchDownloads = async (fileDetails) => {
        try {
            const downloadPromises = fileDetails.map(({ fileId, productId, orderId }) =>
                fetch(`/api/downloads/${fileId}/${productId}/${orderId}`)
                    .then(res => res.json())
            );

            const responses = await Promise.all(downloadPromises);
            const allDownloads = responses.flatMap(res => res.downloads || []);
            setDownloads(allDownloads);
        } catch (error) {
            console.error("Error fetching downloads:", error);
        }
    };

    useEffect(() => {
        let singleId = '';
        if (id) {
            // if route param exists
            singleId = id;
        } else {
            // else try getting query param `resource`
            const params = new URLSearchParams(location.search);
            const resource = params.get('id');
            if (resource) {
                singleId = t("orders.single_order.admin_") + resource;
            }
        }

        const fetchOrderById = async () => {
            try {
                const response = await fetch(`/api/get-order/${singleId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data.order);

                    const customer = data?.order?.body?.customer;

                    if (!customerEmail && !firstName && !lastName) {
                        setCustomerEmail(customer?.email ?? '');
                        setFirstName(customer?.first_name ?? '');
                        setLastName(customer?.last_name ?? '');
                    }

                    const filesByProduct = {};
                    data.order.digital_products.forEach(product => {
                        if (product.manual_delivery_files && product.manual_delivery_files.length > 0) {
                            filesByProduct[product.id] = product.manual_delivery_files;
                        }
                    });
                    setManualDeliveryFiles(filesByProduct);

                    setIsLoading(false);

                    const fileIds = data.order.digital_products.flatMap(product =>
                        product.attached_files.map(file => ({
                            fileId: file.id,
                            productId: product.id,
                            orderId: data.order.id,
                        }))
                    );

                    const videoIds = data.order.digital_products.flatMap(product =>
                        (product.attached_videos || []).map(video => ({
                            fileId: video.id,
                            productId: product.id,
                            orderId: data.order.id,
                        }))
                    );

                    const allIds = [...fileIds, ...videoIds];
                    if (allIds.length > 0) {
                        fetchDownloads(allIds);
                    }
                } else {
                    console.error('Failed to fetch order by ID:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching order by ID:', error);
            }
        };

        fetchOrderById();
    }, [id, location.search]);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const calculateTotalQuantity = (productId) => {
        if (!order || !order.body.line_items) {
            return 0;
        }

        let totalQuantity = 0;
        order.body.line_items.forEach(item => {
            if (item.product_id && item.product_id.toString() === productId.toString()) {
                totalQuantity += item.quantity;
            }
        });

        return totalQuantity;
    };

    const perFileDownloads = (fileId, type = 'file') => {
        if (!downloads || downloads.length === 0) {
            return 0;
        }

        if (type === 'video') {
            return downloads.filter(d => d.video_id === fileId).length;
        }

        return downloads.filter(d => d.file_id === fileId).length;
    };

    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenUploadModal = (productId) => {
        setSelectedProductId(productId);
        setShowUploadModal(true);
        setUploadFiles([]);
    };

    const handleCloseUploadModal = () => {
        setShowUploadModal(false);
        setSelectedProductId(null);
        setUploadFiles([]);
    };

    const handleFileChange = useCallback((files) => {
        setUploadFiles((prevFiles) => [...prevFiles, ...files]);
    }, []);

    const handleDeleteUploadFileAtIndex = useCallback((index) => {
        setUploadFiles((files) => {
            const newFiles = [...files];
            newFiles.splice(index, 1);
            return newFiles;
        });
    }, []);

    const handleUploadFiles = async () => {
        if (uploadFiles.length === 0) {
            shopify.toast.show("Please select files to upload", { isError: true, duration: 9999999 });
            return;
        }

        setUploading(true);

        const formData = new FormData();
        uploadFiles.forEach(file => {
            formData.append('files[]', file);
        });
        formData.append('product_id', selectedProductId);
        formData.append('order_id', order.id);

        try {
            const response = await fetch('/api/upload-manual-delivery-files', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                shopify.toast.show("Files uploaded successfully!");

                setManualDeliveryFiles(prev => ({
                    ...prev,
                    [selectedProductId]: [...(prev[selectedProductId] || []), ...data.files]
                }));

                handleCloseUploadModal();
            } else {
                shopify.toast.show(data.message || "Failed to upload files", { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error('Upload error:', error);
            shopify.toast.show("Error uploading files", { isError: true, duration: 9999999 });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteManualDeliveryFile = async (fileId, productId) => {
        try {
            const response = await fetch(`/api/delete-manual-delivery-file/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setManualDeliveryFiles(prev => ({
                    ...prev,
                    [productId]: prev[productId].filter(file => file.id !== fileId)
                }));

                shopify.toast.show("File deleted successfully!");
            } else {
                const data = await response.json();
                shopify.toast.show(data.message || "Failed to delete file", { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error('Delete error:', error);
            shopify.toast.show("Error deleting file", { isError: true, duration: 9999999 });
        }
    };

    const handleSendManualContent = async () => {
        setSendingContent(true);
        try {
            const response = await fetch(`/api/send-manual-content/${order.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                shopify.toast.show("Manual content sent successfully!");
                setShowSendContentModal(false);
            } else {
                shopify.toast.show(data.message || "Failed to send manual content", { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error('Send manual content error:', error);
            shopify.toast.show("Error sending manual content", { isError: true, duration: 9999999 });
        } finally {
            setSendingContent(false);
        }
    };

    const handleRevokeAccess = async () => {
        setRevokingAccess(true);
        try {
            const response = await fetch(`/api/revoke-access/${order.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setOrder(prev => ({ ...prev, can_access: false }));
                shopify.toast.show(t("orders.single_order.access_revoked_successfully"));
                setShowRevokeAccessModal(false);
            } else {
                shopify.toast.show(data.message || t("orders.single_order.failed_to_revoke_access"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error('Revoke access error:', error);
            shopify.toast.show(t("orders.single_order.error_revoking_access"), { isError: true, duration: 9999999 });
        } finally {
            setRevokingAccess(false);
        }
    };

    const handleGrantAccess = async () => {
        try {
            const response = await fetch(`/api/grant-access/${order.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setOrder(prev => ({ ...prev, can_access: true }));
                shopify.toast.show(t("orders.single_order.access_granted_successfully"));
            } else {
                shopify.toast.show(data.message || t("orders.single_order.failed_to_grant_access"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error('Grant access error:', error);
            shopify.toast.show(t("orders.single_order.error_granting_access"), { isError: true, duration: 9999999 });
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/update-customer/${order.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: customerEmail,
                    first_name: firstName,
                    last_name: lastName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const updatedOrder = { ...order };
                updatedOrder.body.customer.email = customerEmail;
                updatedOrder.body.customer.first_name = firstName;
                updatedOrder.body.customer.last_name = lastName;

                setOrder(updatedOrder);
                shopify.toast.show(t("orders.single_order.customer_updated_successfully"));
                setShowModal(false);
            } else {
                shopify.toast.show(`${t("orders.single_order.error")} ${data.error}`, { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error('Network error:', error);
            shopify.toast.show(t("orders.single_order.network_error"), { isError: true, duration: 9999999 });
        }
    };

    // const getTicketNumberForLottery = (digitalLotteryId) => {
    //     if (order && order.tickets) {
    //         const ticket = order.tickets.find(ticket => ticket.digital_lottery_id === digitalLotteryId);
    //         return ticket ? ticket.ticket_no : 'N/A';
    //     }
    //     return 'N/A';
    // };

    const getTicketNumberForLottery = (digitalLotteryId) => {
        if (order && order.tickets) {
            const matchingTickets = order.tickets.filter(ticket => ticket.digital_lottery_id === digitalLotteryId);
            if (matchingTickets.length > 0) {
                const ticketNumbers = matchingTickets.map(ticket => ticket.ticket_no);
                return ticketNumbers.join(', ');
            }
        }
        return t("orders.single_order.n/a");
    };

    const getLicenseCodeForProduct = (productId, licenseId) => {
        if (order && order.licenses) {
            const license = order.licenses.find(license => license.digital_product_id === productId && license.license_id === licenseId);
            return license?.license_key ?? t("orders.single_order.n/a");
        }

        return t("orders.single_order.n/a");
    };

    // const getLicenseCodeForLineItem = (variant_id, line_item_id) => {
    //     let license_keys = [t("orders.single_order.n/a")];
    //     if (order && order.licenses) {
    //         license_keys = order.licenses.filter(license => license.item_id == line_item_id && license.variant_id == variant_id);
    //     }
    //
    //     return license_keys;
    // }

    const getLicenseCodeForLineItem = (variant_id, line_item_id) => {
        let license_keys = [t("orders.single_order.n/a")];

        if (order && order.licenses) {
            console.log("Licenses: ");
            console.log(order.licenses);
            console.log("Looking for variant_id:", variant_id, "line_item_id:", line_item_id);

            // First try exact match (this will work for both regular items and gift items)
            license_keys = order.licenses.filter(license => {
                console.log("Comparing license:", license.item_id, "with line_item_id:", line_item_id);
                return license.item_id == line_item_id && license.variant_id == variant_id;
            });

            // If no exact match found and line_item_id doesn't have suffix,
            // try matching licenses that have suffix (for gift items when line_item_id doesn't have suffix yet)
            if (license_keys.length === 0 && !line_item_id.toString().includes('_')) {
                console.log("No exact match found, trying to match licenses with suffix for line_item_id:", line_item_id);

                license_keys = order.licenses.filter(license => {
                    // Check if license.item_id starts with line_item_id followed by underscore
                    const licenseItemId = license.item_id.toString();
                    const lineItemIdStr = line_item_id.toString();
                    const hasMatchingPrefix = licenseItemId.startsWith(lineItemIdStr + '_');
                    const hasMatchingVariant = license.variant_id == variant_id;

                    console.log("Checking license:", licenseItemId, "against:", lineItemIdStr, "hasPrefix:", hasMatchingPrefix, "hasVariant:", hasMatchingVariant);

                    return hasMatchingPrefix && hasMatchingVariant;
                });
            }

            // If still no match and line_item_id has suffix, try matching without suffix
            // (fallback case - shouldn't normally happen with current logic)
            if (license_keys.length === 0 && line_item_id.toString().includes('_')) {
                console.log("Trying fallback: removing suffix from line_item_id");
                const originalLineItemId = line_item_id.toString().split('_')[0];

                license_keys = order.licenses.filter(license =>
                    license.item_id == originalLineItemId && license.variant_id == variant_id
                );
            }
        }

        console.log("Final license_keys found:", license_keys);

        return license_keys.length > 0 ? license_keys : [{ license_key: t("orders.single_order.n/a") }];
    }

    const getFilteredLineItems = (product) => {
        if (!order?.body?.line_items || !product?.associatedProduct?.variants) {
            console.warn('Missing order line items or associated product variants');
            return [];
        }

        console.log("Line ITEMS: ");
        console.log(order.body);
        console.log("Variants");
        console.log(product.associatedProduct.variants);

        return order.body.line_items.filter(lineItem => {
            try {
                if (!lineItem.variant_id) {
                    return false;
                }

                const lineItemVariantId = lineItem.variant_id.toString();

                const associatedVariantIds = product.associatedProduct.variants
                    .map(variant => {
                        if (!variant.id) return null;
                        return variant.id.replace('gid://shopify/ProductVariant/', '');
                    })
                    .filter(id => id !== null);

                return associatedVariantIds.includes(lineItemVariantId);

            } catch (error) {
                console.error('Error filtering line item:', error, lineItem);
                return false;
            }
        });
    };

    const markLicenseUnused = async (licenseId) => {
        setLoadingLicenses(prev => ({ ...prev, [licenseId]: true }));

        try {
            const res = await fetch(`/api/generated-licenses/${licenseId}/mark-unused`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const data = await res.json();

                setOrder(prev => {
                    const updatedLicenses = prev.licenses.map(license =>
                        license.id === licenseId
                            ? { ...license, mark_unused: Number(data.mark_unused) }
                            : license
                    );

                    return { ...prev, licenses: updatedLicenses };
                });

                shopify.toast.show(t("orders.single_order.license_status_updated"));
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
            shopify.toast.show(t("orders.single_order.an_error_occurred_while"), { isError: true, duration: 9999999 });
        } finally {
            setLoadingLicenses(prev => ({ ...prev, [licenseId]: false }));
        }
    };

    const extractProductId = (gid) => {
        const parts = gid.split('/');
        return parts[parts.length - 1];
    }

    const resendEmail = async () => {
        setResendingEmail(true);
        try {
            const response = await fetch(`/api/resend-email/${order.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: order.id }),
            });
            if (response.ok) {
                shopify.toast.show(t("orders.single_order.email_re_sent"));
                const response = await fetch(`/api/get-order/${order.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(prev => data.order);
                }
            } else {
                shopify.toast.show(`${t("orders.single_order.failed_to_resent_email")} ${response.statusText}`, { isError: true, duration: 9999999 });
            }
        } catch (error) {
            shopify.toast.show(`${t("orders.single_order.error_resending_email")} ${error.message}`, { isError: true, duration: 9999999 });
        } finally {
            setResendingEmail(false);
        }
    };

    const resetAccess = () => {
        setShowResetModal(true);
    };

    const handleResetAccessConfirm = async () => {
        setSaving(true)
        try {
            const payload = {
                resetType: resetOption,
                ...(resetOption === 'downloadLimits' && { downloadLimit }),
                ...(resetOption === 'downloadExpiration' && {
                    expirationType: expirationOption,
                    ...(expirationOption === 'expireAfterDays' && { expirationDays }),
                    ...(expirationOption === 'expireAfterDate' && { expirationDate }),
                }),
            };

            const response = await fetch(`/api/reset-access/${order.id}`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setSaving(false)

            if (response.ok) {
                shopify.toast.show(t("orders.single_order.download_access"));
                const response = await fetch(`/api/get-order/${order.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(prev => data.order);
                }
            } else {
                shopify.toast.show(`${t("orders.single_order.failed_to_reset_access")} ${data.error}`, { isError: true, duration: 9999999 });
            }
            setShowResetModal(false);
        } catch (error) {
            shopify.toast.show(t("orders.single_order.an_error_occurred_while_resetting"), { isError: true, duration: 9999999 });
            setShowResetModal(false);
        }
    };

    const hasManualDeliveryProduct = order?.digital_products?.some(
    product =>
        product.is_manual_delivery_enabled &&
        product.content_type?.includes('manual_delivery')
    ) ?? false;

    const resetAccesses = order?.download_accesses || [];

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(selectedDownloads);

    if (isLoading) {
        return (
            <Page>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <BlockStack gap="300">
                                <Text variant="headingLg" as="h5">
                                    {t("orders.single_order.title")}
                                </Text>
                                <div style={{ marginTop: "10px" }}></div>
                                <SkeletonBodyText />
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return (
        <Page
            backAction={{ content: t("orders.single_order.orders"), onAction: () => navigate('/orders') }}
            title={`${t("orders.single_order.order")} ${order.body.name}`}
            titleMetadata={
                <div>
                    {order.is_risky && (
                        <span style={{ marginRight: "5px" }}>
                            <Badge tone="critical">
                                {t("orders.single_order.risky")}
                            </Badge>
                        </span>
                    )}
                    {order.is_delivered ? (
                        <Badge tone="success">
                            {t("orders.single_order.delivered")}
                        </Badge>
                    ) : (
                        <Badge tone="warning">
                            {t("orders.single_order.not_delivered")}
                        </Badge>
                    )}
                </div>
            }
            subtitle={`${t("orders.single_order.created")} ${formatDate(order.created_at)}`}
            compactTitle
            primaryAction={
                <LanguageSelector />
            }
            secondaryActions={[
                ...(order.digital_products.some(product =>
                    product.is_download_limit_enabled || product.download_expiration
                ) ? [{
                    content: t("orders.single_order.reset_access"),
                    onAction: resetAccess,
                }] : []),
                ...(hasManualDeliveryProduct
                ? [{
                    content: "Send manual content",
                    onAction: () => setShowSendContentModal(true),
                    }]
                : []),
                {
                    content: t("orders.single_order.view_order_page"),
                    onAction: () => window.open(`/file/${order.checkout_token || order.id}/download`, '_blank'),
                },
                {
                    content: resendingEmail ? <Spinner accessibilityLabel={t("orders.single_order.sending..._")} size="small" /> : (
                        order.is_risky && !order.is_delivered ? t("orders.single_order.send_email") : t("orders.single_order.resend_email")
                    ),
                    onAction: resendEmail,
                },
            ]}
        >
            <Modal
                open={showResetModal}
                onClose={() => setShowResetModal(false)}
                title={t("orders.single_order.reset_download_access")}
                primaryAction={{
                    content: t("orders.single_order.reset_access"),
                    destructive: true,
                    onAction: handleResetAccessConfirm,
                    loading: saving,
                }}
                secondaryActions={[
                    {
                        content: t("orders.single_order.cancel"),
                        onAction: () => setShowResetModal(false),
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack vertical spacing="tight">
                        <Text as="p">
                            {t("orders.single_order.customer_will_regain")}
                        </Text>

                        <BlockStack vertical spacing="tight" gap={200}>
                            <Text variant="headingMd" as="h3">{t("orders.single_order.reset_options")}</Text>

                            <RadioButton
                                label={t("orders.single_order.download_limits_")}
                                checked={resetOption === 'downloadLimits'}
                                id="downloadLimits"
                                name="resetOption"
                                onChange={() => setResetOption('downloadLimits')}
                            />

                            {resetOption === 'downloadLimits' && (
                                <Card sectioned subdued>
                                    <TextField
                                        label={t("orders.single_order.total_number_of")}
                                        type="number"
                                        value={downloadLimit}
                                        onChange={setDownloadLimit}
                                        autoComplete="off"
                                    />
                                </Card>
                            )}

                            <RadioButton
                                label={t("orders.single_order.download_expiration")}
                                checked={resetOption === 'downloadExpiration'}
                                id="downloadExpiration"
                                name="resetOption"
                                onChange={() => setResetOption('downloadExpiration')}
                            />

                            {resetOption === 'downloadExpiration' && (
                                <Card sectioned subdued>
                                    <BlockStack vertical spacing="tight" distribution="fillEvenly">
                                        <RadioButton
                                            label={t("orders.single_order.expire_after_days_")}
                                            checked={expirationOption === 'expireAfterDays'}
                                            id="expireAfterDays"
                                            name="expirationOption"
                                            onChange={() => setExpirationOption('expireAfterDays')}
                                        />

                                        {expirationOption === 'expireAfterDays' && (
                                            <TextField
                                                label={t("orders.single_order.number_of_days")}
                                                type="number"
                                                value={expirationDays}
                                                onChange={setExpirationDays}
                                                autoComplete="off"
                                            />
                                        )}

                                        <RadioButton
                                            label={t("orders.single_order.number_of_days")}
                                            checked={expirationOption === 'expireAfterDate'}
                                            id="expireAfterDate"
                                            name="expirationOption"
                                            onChange={() => setExpirationOption('expireAfterDate')}
                                        />

                                        {expirationOption === 'expireAfterDate' && (
                                            <BlockStack gap="400">
                                                <Box minWidth="276px" padding={{ xs: 200 }}>
                                                    <Popover
                                                        active={pickerVisible}
                                                        autofocusTarget="none"
                                                        preferredAlignment="left"
                                                        fullWidth
                                                        preferInputActivator={false}
                                                        preferredPosition="below"
                                                        preventCloseOnChildOverlayClick
                                                        onClose={() => setPickerVisible(false)}
                                                        activator={
                                                            <TextField
                                                                role="combobox"
                                                                label={t("orders.single_order.expire_on")}
                                                                prefix={<Icon source={CalendarIcon} />}
                                                                value={formattedValue}
                                                                onFocus={() => setPickerVisible(true)}
                                                                autoComplete="off"
                                                            />
                                                        }
                                                    >
                                                        <Card ref={datePickerRef}>
                                                            <DatePicker
                                                                month={month}
                                                                year={year}
                                                                selected={expirationDate}
                                                                onMonthChange={handleMonthChange}
                                                                onChange={handleDateSelection}
                                                            />
                                                        </Card>
                                                    </Popover>
                                                </Box>
                                            </BlockStack>
                                        )}
                                    </BlockStack>
                                </Card>

                            )}
                        </BlockStack>
                    </BlockStack>
                </Modal.Section>
            </Modal>

            <Modal
                open={showRevokeAccessModal}
                onClose={() => setShowRevokeAccessModal(false)}
                title={t("orders.single_order.revoke_access")}
                primaryAction={{
                    content: t("orders.single_order.revoke"),
                    destructive: true,
                    onAction: handleRevokeAccess,
                    loading: revokingAccess,
                }}
                secondaryActions={[
                    {
                        content: t("orders.single_order.cancel"),
                        onAction: () => setShowRevokeAccessModal(false),
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack gap="200">
                        <Text as="p">
                            {t("orders.single_order.are_you_sure_to_revoke_access")}
                        </Text>
                        <Text as="p" color="subdued">
                            {t("orders.single_order.revoke_access_warning")}
                        </Text>
                    </BlockStack>
                </Modal.Section>
            </Modal>

            <Modal
                open={showDownloadsModal}
                onClose={() => setShowDownloadsModal(false)}
                title={t("orders.single_order.download_history")}
                primaryAction={{
                    content: t("orders.single_order.close"),
                    onAction: () => setShowDownloadsModal(false),
                }}
            >
                <Modal.Section>
                    {selectedDownloads.length > 0 ? (
                        <IndexTable
                            selectable={false}
                            resourceName={{ singular: t("orders.single_order.download_small"), plural: t("orders.single_order.downloads") }}
                            itemCount={selectedDownloads.length}
                            selectedItemsCount={
                                allResourcesSelected ? t("orders.single_order.all") : selectedResources.length
                            }
                            onSelectionChange={handleSelectionChange}
                            headings={[
                                { title: t("orders.single_order.download_time") },
                                { title: t("orders.single_order.country_code") },
                            ]}
                        >
                            {selectedDownloads.map((download, index) => (
                                <IndexTable.Row
                                    id={`download-${index}`}
                                    key={`download-${index}`}
                                    selected={selectedResources.includes(`download-${index}`)}
                                    position={index}
                                >
                                    <IndexTable.Cell>
                                        {new Date(download.created_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        {download.country_code ?? t("orders.single_order.n/a")}
                                    </IndexTable.Cell>
                                </IndexTable.Row>
                            ))}
                        </IndexTable>
                    ) : (
                        <Text variant="bodyMd" as="p">{t("orders.single_order.no_downloads_found")}</Text>
                    )}
                </Modal.Section>
            </Modal>

            <Modal
                open={showUploadModal}
                onClose={handleCloseUploadModal}
                title={t("orders.single_order.upload_files_for_manual_delivery")}
                primaryAction={{
                    content: uploading ? "Uploading..." : "Upload",
                    onAction: handleUploadFiles,
                    loading: uploading,
                    disabled: uploadFiles.length === 0,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: handleCloseUploadModal,
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack gap="400">
                        <Text variant="bodyMd" as="p">
                            Upload files for this manual delivery product. These files will be attached to the order.
                        </Text>

                        <DropZone
                            onDrop={handleFileChange}
                            allowMultiple={true}
                        >
                            <DropZone.FileUpload actionTitle="Add files" />
                        </DropZone>

                        {uploadFiles.length > 0 && (
                            <BlockStack gap="200">
                                {uploadFiles.map((file, index) => (
                                    <InlineStack
                                        key={index}
                                        gap="200"
                                        blockAlign="center"
                                    >
                                        <Button
                                            icon={
                                                <Icon
                                                    source={XSmallIcon}
                                                />
                                            }
                                            onClick={() => handleDeleteUploadFileAtIndex(index)}
                                        />

                                        <BlockStack>
                                            <Text
                                                variant="bodyMd"
                                                as="p"
                                                fontWeight="bold"
                                            >
                                                {file.name}
                                            </Text>
                                            <Text
                                                variant="bodySm"
                                                as="p"
                                                color="subdued"
                                            >
                                                {prettyBytes(file.size)}
                                            </Text>
                                        </BlockStack>
                                    </InlineStack>
                                ))}
                            </BlockStack>
                        )}
                    </BlockStack>
                </Modal.Section>
            </Modal>

            <Modal
                open={showSendContentModal}
                onClose={() => setShowSendContentModal(false)}
                title="Send Manual Content"
                primaryAction={{
                    content: sendingContent ? "Sending..." : "Send Content",
                    onAction: handleSendManualContent,
                    loading: sendingContent,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: () => setShowSendContentModal(false),
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack gap="400">
                        <Text variant="bodyMd" as="p">
                            All uploaded files will be sent to the customer.
                        </Text>
                        <Text variant="bodyMd" as="p" tone="subdued">
                            The customer will receive an email with download links for all manually uploaded files.
                        </Text>
                    </BlockStack>
                </Modal.Section>
            </Modal>

            <div style={{ display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ width: "64%", minWidth: "300px", flex: "1 1 500px" }} className="single-order-main-content">
                    <BlockStack gap="400">
                        <Card>
                            <BlockStack gap="300">
                                <InlineStack gap="200">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
                                            height="24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M8 14l3.5 3.5L18 12" />
                                        </svg>
                                    </div>
                                    <div style={{ marginLeft: '18px' }}>
                                        <Text variant="headingMd" as="h6">
                                            {
                                                order.digital_products.length > 0 &&
                                                `${order.digital_products.length} ${t("orders.single_order.digital_product")}${order.digital_products.length !== 1 ? 's' : ''}`
                                            }
                                            {
                                                order.digital_products.length > 0 && order.digital_lotteries.length > 0 && ` ${t("orders.single_order.and")} `
                                            }
                                            {
                                                order.digital_lotteries.length > 0 &&
                                                `${order.digital_lotteries.length} ${t("orders.single_order.digital_lotter")}${order.digital_lotteries.length !== 1 ? t("orders.single_order.ies") : t("orders.single_order.y")}`
                                            }
                                            {
                                                (order.digital_products.length > 0 || order.digital_lotteries.length > 0) && t("orders.single_order.delivered_small")
                                            }
                                        </Text>
                                    </div>
                                </InlineStack>

                                <div style={{ marginLeft: '50px' }}>
                                    <Text variant="bodySm" as="p" color="subdued">
                                        {t("orders.single_order.new_digital_products_email_sent")} {order.body.email} {t("orders.single_order.on")} {formatDate(order.created_at)}.
                                    </Text>
                                </div>
                                <Divider />

                                {order.digital_products.map(product => (
                                    <>
                                        <div key={product.id} style={{ marginTop: "10px" }}>
                                            <InlineGrid columns="1fr auto" style={{ marginBottom: "10px" }}>
                                                <div>
                                                    <InlineStack>
                                                        <div>
                                                            <Thumbnail
                                                                source={product.associatedProduct.images[0]?.originalSrc || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081'}
                                                                alt={product.associatedProduct.title}
                                                                size="large"
                                                            />
                                                        </div>
                                                        <div style={{ marginLeft: '20px' }}>
                                                            <div>
                                                                <Text variant="headingMd" as="h6">
                                                                    {product.associatedProduct.title}
                                                                </Text>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    {product.associatedProduct.variants.length > 1 ? (
                                                                        <Text variant="bodyLg" as="p">
                                                                            {t("orders.single_order.all_variants")}
                                                                            ({product.associatedProduct.variants.length})
                                                                        </Text>
                                                                    ) : (
                                                                        product.associatedProduct.variants.map((variant, index) => (
                                                                            <Text key={variant.id} variant="bodyLg"
                                                                                as="h6">
                                                                                {variant.title}
                                                                            </Text>
                                                                        ))
                                                                    )}
                                                                </div>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <Text variant="bodyLg" as="p" color="subdued">
                                                                        {t("orders.single_order.product_id")} {extractProductId(product.associatedProduct.id)}
                                                                    </Text>
                                                                </div>
                                                                {product.is_manual_delivery_enabled && product.content_type?.includes('manual_delivery') && (
                                                                    <div style={{ marginTop: '10px' }}>
                                                                        {product.manualDeliveryFiles && product.manualDeliveryFiles.length > 0 && (
                                                                            <BlockStack gap="200">
                                                                                {product.manualDeliveryFiles.map((file, index) => (
                                                                                    <InlineGrid columns="1fr auto">
                                                                                        <div>
                                                                                            <InlineStack>
                                                                                                <div>
                                                                                                    <Card>
                                                                                                        <BlockStack gap="300">
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    width: "24px",
                                                                                                                    height: "24px",
                                                                                                                }}
                                                                                                            >
                                                                                                                <svg
                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                    viewBox="0 0 20 20"
                                                                                                                >
                                                                                                                    <path
                                                                                                                        fillRule="evenodd"
                                                                                                                        d="M4.843 9.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.043 2.043 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.244 2.244 0 0 1 3.173 3.172l-2.286 2.286a.817.817 0 1 1-1.155-1.155l2.25-2.25a.75.75 0 1 0-1.06-1.061l-2.25 2.25a2.317 2.317 0 0 0 3.275 3.277l2.286-2.286a3.744 3.744 0 0 0-5.294-5.294l-5.015 5.015Z"
                                                                                                                    />
                                                                                                                </svg>
                                                                                                            </div>
                                                                                                        </BlockStack>
                                                                                                    </Card>
                                                                                                </div>
                                                                                                <div
                                                                                                    style={{
                                                                                                        marginLeft: "20px",
                                                                                                    }}
                                                                                                >
                                                                                                    <div>
                                                                                                        <BlockStack gap="200">
                                                                                                            <Link url={file.file_url}>
                                                                                                                <Text
                                                                                                                    variant="bodyMd"
                                                                                                                    as="p"
                                                                                                                    fontWeight="bold"
                                                                                                                >
                                                                                                                    {file.file_name}
                                                                                                                </Text>
                                                                                                            </Link>
                                                                                                            <Text
                                                                                                                variant="bodySm"
                                                                                                                as="p"
                                                                                                                color="subdued"
                                                                                                            >
                                                                                                                {`${file.mime_type.toUpperCase()} - ${prettyBytes(file.byte_size)}`}
                                                                                                            </Text>
                                                                                                        </BlockStack>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </InlineStack>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Button
                                                                                                icon={<Icon source={XSmallIcon} />}
                                                                                                onClick={() => handleDeleteManualDeliveryFile(file.id, product.id)}
                                                                                            />
                                                                                        </div>
                                                                                    </InlineGrid>
                                                                                ))}
                                                                            </BlockStack>
                                                                        )}
                                                                        {manualDeliveryFiles[product.id] && manualDeliveryFiles[product.id].length > 0 && (
                                                                            <BlockStack gap="200">
                                                                                {manualDeliveryFiles[product.id].map((file, index) => (
                                                                                    <InlineGrid columns="1fr auto">
                                                                                        <div>
                                                                                            <InlineStack>
                                                                                                <div>
                                                                                                    <Card>
                                                                                                        <BlockStack gap="300">
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    width: "24px",
                                                                                                                    height: "24px",
                                                                                                                }}
                                                                                                            >
                                                                                                                <svg
                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                    viewBox="0 0 20 20"
                                                                                                                >
                                                                                                                    <path
                                                                                                                        fillRule="evenodd"
                                                                                                                        d="M4.843 9.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.043 2.043 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.244 2.244 0 0 1 3.173 3.172l-2.286 2.286a.817.817 0 1 1-1.155-1.155l2.25-2.25a.75.75 0 1 0-1.06-1.061l-2.25 2.25a2.317 2.317 0 0 0 3.275 3.277l2.286-2.286a3.744 3.744 0 0 0-5.294-5.294l-5.015 5.015Z"
                                                                                                                    />
                                                                                                                </svg>
                                                                                                            </div>
                                                                                                        </BlockStack>
                                                                                                    </Card>
                                                                                                </div>
                                                                                                <div
                                                                                                    style={{
                                                                                                        marginLeft: "20px",
                                                                                                    }}
                                                                                                >
                                                                                                    <div>
                                                                                                        <BlockStack gap="200">
                                                                                                            <Link url={file.file_url}>
                                                                                                                <Text
                                                                                                                    variant="bodyMd"
                                                                                                                    as="p"
                                                                                                                    fontWeight="bold"
                                                                                                                >
                                                                                                                    {file.file_name}
                                                                                                                </Text>
                                                                                                            </Link>
                                                                                                            <Text
                                                                                                                variant="bodySm"
                                                                                                                as="p"
                                                                                                                color="subdued"
                                                                                                            >
                                                                                                                {`${file.mime_type.toUpperCase()} - ${prettyBytes(file.byte_size)}`}
                                                                                                            </Text>
                                                                                                        </BlockStack>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </InlineStack>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Button
                                                                                                icon={<Icon source={XSmallIcon} />}
                                                                                                onClick={() => handleDeleteManualDeliveryFile(file.id, product.id)}
                                                                                            />
                                                                                        </div>
                                                                                    </InlineGrid>
                                                                                ))}
                                                                            </BlockStack>
                                                                        )}
                                                                        <Button
                                                                            onClick={() => handleOpenUploadModal(product.id)}
                                                                            variant="primary"
                                                                            size="slim"
                                                                        >
                                                                            {t("orders.single_order.upload_files")}
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </InlineStack>
                                                </div>
                                                <div style={{ marginTop: "20px" }}>
                                                    <Text variant="headingMd" as="h6">
                                                        {t("orders.single_order.x")} {calculateTotalQuantity(extractProductId(product.associatedProduct.id))}
                                                    </Text>
                                                </div>
                                            </InlineGrid>
                                        </div>

                                        {product.attached_files.map(file => (
                                            <div key={file.id} style={{ marginTop: "10px" }}>
                                                <BlockStack gap="200">
                                                    <InlineGrid columns="1fr auto">
                                                        <div>
                                                            <InlineStack>
                                                                <div>
                                                                    <Card>
                                                                        <BlockStack gap="300">
                                                                            <div
                                                                                style={{ width: '24px', height: '24px' }}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                    viewBox="0 0 20 20">
                                                                                    <path fill-rule="evenodd"
                                                                                        d="M4.843 9.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.043 2.043 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.244 2.244 0 0 1 3.173 3.172l-2.286 2.286a.817.817 0 1 1-1.155-1.155l2.25-2.25a.75.75 0 1 0-1.06-1.061l-2.25 2.25a2.317 2.317 0 0 0 3.275 3.277l2.286-2.286a3.744 3.744 0 0 0-5.294-5.294l-5.015 5.015Z" />
                                                                                </svg>
                                                                            </div>
                                                                        </BlockStack>
                                                                    </Card>
                                                                </div>
                                                                <div style={{ marginLeft: '20px' }}>
                                                                    <div>
                                                                        <BlockStack gap="200">
                                                                            <Text variant="bodyMd" as="p"
                                                                                fontWeight="bold" color={"critical"}>
                                                                                {file.fileName}
                                                                            </Text>
                                                                            <Text variant="bodySm" as="p"
                                                                                color="subdued">
                                                                                {file.mimeType} - {prettyBytes(file.byteSize)}
                                                                            </Text>
                                                                        </BlockStack>
                                                                    </div>
                                                                </div>
                                                            </InlineStack>
                                                        </div>
                                                        <div style={{ marginTop: "18px" }}>
                                                            <Link onClick={() => handleOpenDownloadsModal(file.id, product.id, order.id)}>
                                                                {perFileDownloads(file.id)} {t("orders.single_order.downloads")}
                                                            </Link>
                                                        </div>
                                                    </InlineGrid>
                                                </BlockStack>
                                            </div>
                                        ))}

                                        {product.attached_videos && product.attached_videos.length > 0 && (
                                            <div>
                                                {product.attached_videos.map(video => (
                                                    <div key={video.id} style={{ marginTop: "10px" }}>
                                                        <BlockStack gap="200">
                                                            <InlineGrid columns="1fr auto">
                                                                <div>
                                                                    <InlineStack>
                                                                        <div>
                                                                            <Card>
                                                                                <BlockStack gap="300">
                                                                                    <div style={{ width: '24px', height: '24px' }}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                                            viewBox="0 0 24 24"
                                                                                            width="24"
                                                                                            height="24"
                                                                                            fill="currentColor" >
                                                                                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                                            <polygon points="10,8 16,12 10,16" fill="currentColor" /> </svg>
                                                                                    </div>
                                                                                </BlockStack>
                                                                            </Card>
                                                                        </div>
                                                                        <div style={{ marginLeft: '20px' }}>
                                                                            <div>
                                                                                <BlockStack gap="200">
                                                                                    <div style={{ maxWidth: 380 }}>
                                                                                    <Text truncate variant="bodyMd" as="p" fontWeight="bold" color="critical">
                                                                                        {video.title}
                                                                                    </Text>
                                                                                    </div>
                                                                                    <Text variant="bodySm" as="p" color="subdued">
                                                                                        {video.duration || t("orders.single_order.n/a")}
                                                                                    </Text>
                                                                                </BlockStack>
                                                                            </div>
                                                                        </div>
                                                                    </InlineStack>
                                                                </div>
                                                                <div style={{ marginTop: "18px" }}>
                                                                    <Link onClick={() => handleOpenDownloadsModal(video.id, product.id, order.id, 'video')}>
                                                                    {perFileDownloads(video.id, 'video')}{" "}{perFileDownloads(video.id, 'video') === 1 ? t("orders.single_order.view") : t("orders.single_order.views")}
                                                                    </Link>
                                                                </div>
                                                            </InlineGrid>
                                                        </BlockStack>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {product.licenses.length > 0 && (
                                            <div style={{ marginTop: "10px" }}>
                                                <Text variant="headingMd" as="h6">
                                                    {t("orders.single_order.license_key_list")}
                                                </Text>
                                                <BlockStack>
                                                    <div style={{ marginTop: "10px" }}>
                                                        {getFilteredLineItems(product)
                                                            .map(lineItem => (
                                                                <BlockStack gap="200">
                                                                    <InlineGrid columns="10% 85%">
                                                                        <div>
                                                                            <Card>
                                                                                <BlockStack gap="300">
                                                                                    <div style={{
                                                                                        width: '24px',
                                                                                        height: '24px'
                                                                                    }}>
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            viewBox="0 0 20 20">
                                                                                            <path fill-rule="evenodd"
                                                                                                d="M5.5 6.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5Zm3.5-2c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2Z" />
                                                                                            <path
                                                                                                d="M9 12.5c-1.734 0-3.33.94-4.173 2.455l-.302.545h5.725c.414 0 .75.336.75.75s-.336.75-.75.75h-6.001c-1.02 0-1.665-1.096-1.17-1.987l.437-.786c1.106-1.992 3.206-3.227 5.484-3.227.414 0 .75.336.75.75s-.336.75-.75.75Z" />
                                                                                            <path
                                                                                                d="M15.5 11.375c0 .483-.392.875-.875.875s-.875-.392-.875-.875.392-.875.875-.875.875.392.875.875Z" />
                                                                                            <path fill-rule="evenodd"
                                                                                                d="M11.25 11.376c0-1.865 1.511-3.376 3.376-3.376 1.864 0 3.376 1.511 3.376 3.376v.726c0 .731-.365 1.377-.923 1.766.05.353-.002.713-.145 1.036.295.752.117 1.65-.542 2.226l-.397.347c-.915.798-2.324.604-2.989-.412l-.326-.498c-.213-.325-.326-.706-.326-1.095v-1.492c-.659-.367-1.104-1.07-1.104-1.879v-.725Zm2.41 1.457c-.074-.051-.163-.081-.26-.081-.359 0-.65-.291-.65-.65v-.726c0-1.036.84-1.876 1.876-1.876s1.876.84 1.876 1.876v.726c0 .359-.291.65-.65.65h-.247c-.106 0-.205.034-.285.092-.114.082-.19.212-.201.361l-.001.015v.02c0 .112.038.222.11.309l.282.345c.164.2.087.502-.153.6l-.003.001c-.193.08-.274.288-.22.466.02.07.062.135.125.187l.133.109c.014.01.026.021.038.033.196.196.19.523-.025.71l-.397.347c-.16.14-.383.158-.559.067-.01-.005-.021-.011-.031-.018l-.005-.002c-.034-.022-.065-.047-.094-.077l-.006-.007c-.019-.02-.036-.042-.052-.066l-.326-.498c-.053-.082-.082-.177-.082-.274v-2.267c0-.154-.076-.29-.194-.372Z" />
                                                                                        </svg>
                                                                                    </div>
                                                                                </BlockStack>
                                                                            </Card>
                                                                        </div>
                                                                        <div style={{ marginLeft: "20px" }}>
                                                                            <BlockStack gap="200">
                                                                                <Text variant="bodyMd" as="p"
                                                                                    fontWeight="bold"
                                                                                    color={"critical"}>
                                                                                    {lineItem.name} |
                                                                                    {t("orders.single_order.x")} {lineItem.quantity}
                                                                                </Text>
                                                                                <List type="bullet">
                                                                                    {getLicenseCodeForLineItem(lineItem.variant_id, lineItem.id).map((item, index) => (
                                                                                        <List.Item key={index} >
                                                                                            <InlineGrid columns="1fr auto">
                                                                                                <Text as="span"
                                                                                                    variant="bodyMd">
                                                                                                    <strong>{item.license_key}
                                                                                                        {store &&  store?.setting && store?.setting?.license_tracking_options?.show_bundle_product_name && item.first_digital_product?.associatedProduct && (
                                                                                                            <><br /> Product: {JSON.parse(item.first_digital_product.associatedProduct).title}</>
                                                                                                        )}
                                                                                                    </strong>
                                                                                                </Text>
                                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                                    <Button
                                                                                                        onClick={() => markLicenseUnused(item.id)}
                                                                                                        loading={loadingLicenses[item.id]}
                                                                                                    >
                                                                                                        {item.mark_unused == 1 ? t("orders.single_order.mark_as_used") : t("orders.single_order.mark_as_unused")}
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </InlineGrid>
                                                                                            <Divider style={{ marginBottom: "10px" }} />
                                                                                        </List.Item>
                                                                                    ))}
                                                                                </List>
                                                                            </BlockStack>
                                                                        </div>
                                                                    </InlineGrid>

                                                                </BlockStack>
                                                            ))}

                                                    </div>
                                                </BlockStack>
                                            </div>
                                        )}
                                        {product.custom_links.map(link => (
                                            <div key={link.id} style={{ marginTop: "10px" }}>
                                                <Text variant="headingMd" as="h6">
                                                    {t("orders.single_order.custom_link")}
                                                </Text>
                                                <BlockStack>
                                                    <div style={{ marginTop: "10px" }}>
                                                        <Text variant="bodyLg" as="p">
                                                            {t("orders.single_order.title:")} {link.title}
                                                        </Text>
                                                    </div>
                                                    <Text variant="bodyLg" as="p">
                                                        {t("orders.single_order.link:")} <Link>{link.redirect_url}</Link>
                                                    </Text>
                                                    <Text variant="bodyLg" as="p">
                                                        {t("orders.single_order.link_details:")} {link.link_details}
                                                    </Text>
                                                </BlockStack>
                                            </div>
                                        ))}
                                        <Divider />
                                    </>
                                ))}

                                {order.digital_lotteries.map(lottery => (
                                    <>
                                        <div key={lottery.id} style={{ marginTop: "10px" }}>
                                            <InlineGrid columns="1fr auto" style={{ marginBottom: "10px" }}>
                                                <div>
                                                    <InlineStack>
                                                        <div>
                                                            <Thumbnail
                                                                source={lottery.product.images[0]?.originalSrc || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081'}
                                                                alt={lottery.product.title}
                                                                size="large"
                                                            />
                                                        </div>
                                                        <div style={{ marginLeft: '20px' }}>
                                                            <div>
                                                                <Text variant="headingMd" as="h6">
                                                                    {lottery.product.title}
                                                                </Text>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    {lottery.product.variants.length > 1 ? (
                                                                        <Text variant="bodyLg" as="p">
                                                                            {t("orders.single_order.all_variants")}
                                                                            ({lottery.product.variants.length})
                                                                        </Text>
                                                                    ) : (
                                                                        lottery.product.variants.map((variant, index) => (
                                                                            <Text key={variant.id} variant="bodyLg"
                                                                                as="h6">
                                                                                {variant.title}
                                                                            </Text>
                                                                        ))
                                                                    )}
                                                                </div>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <Text variant="bodyLg" as="p" color="subdued">
                                                                        {t("orders.single_order.matched_product_id")} {extractProductId(lottery.product.id)}
                                                                    </Text>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </InlineStack>
                                                </div>
                                                <div style={{ marginTop: "20px" }}>
                                                    <Text variant="headingMd" as="h6">
                                                        {t("orders.single_order.x")} {calculateTotalQuantity(extractProductId(lottery.product.id))}
                                                    </Text>
                                                </div>
                                            </InlineGrid>
                                        </div>

                                        <div style={{ marginTop: "10px" }}>
                                            <BlockStack gap="200">
                                                <div>
                                                    <InlineStack>
                                                        <div>
                                                            <Card>
                                                                <BlockStack gap="300">
                                                                    <div style={{ width: '24px', height: '24px' }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 20 20">
                                                                            <path fill-rule="evenodd"
                                                                                d="M4.843 9.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.043 2.043 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.244 2.244 0 0 1 3.173 3.172l-2.286 2.286a.817.817 0 1 1-1.155-1.155l2.25-2.25a.75.75 0 1 0-1.06-1.061l-2.25 2.25a2.317 2.317 0 0 0 3.275 3.277l2.286-2.286a3.744 3.744 0 0 0-5.294-5.294l-5.015 5.015Z" />
                                                                        </svg>
                                                                    </div>
                                                                </BlockStack>
                                                            </Card>
                                                        </div>
                                                        <div style={{ marginLeft: '20px' }}>
                                                            <div>
                                                                <BlockStack gap="200">
                                                                    <Text variant="bodyMd" as="p" fontWeight="bold"
                                                                        color={"critical"}>
                                                                        {t("orders.single_order.digital_lottery_type")}
                                                                    </Text>
                                                                    <Text variant="bodySm" as="p" color="subdued">
                                                                        {t("orders.single_order.ticket_no")} <strong>{getTicketNumberForLottery(lottery.id)}</strong>
                                                                    </Text>
                                                                </BlockStack>
                                                            </div>
                                                        </div>
                                                    </InlineStack>
                                                </div>
                                            </BlockStack>
                                        </div>
                                        <Divider />
                                    </>
                                ))}

                                <div style={{ display: 'none' }}>
                                    <InlineStack align="end">
                                        <Button size={"large"}>{t("orders.single_order.view_all_deliveries")}</Button>
                                    </InlineStack>
                                </div>

                            </BlockStack>
                        </Card>
                    </BlockStack>
                </div>

                <div style={{ width: "34%", minWidth: "280px", flex: "1 1 300px" }}>
                    <BlockStack gap="400">
                        <Card>
                            <BlockStack gap="300">
                                <Text variant="headingMd" as="h6">
                                    {t("orders.single_order.order_details")}
                                </Text>

                                <BlockStack gap="200">
                                    <InlineStack gap="100" align="space-between">
                                        <Text variant="bodyMd" as="p" color="subdued">
                                            {t("orders.single_order.order_date")}:
                                        </Text>
                                        <Text variant="bodyMd" as="p">
                                            {formatDate(order.created_at)}
                                        </Text>
                                    </InlineStack>

                                    <InlineStack gap="100" align="space-between">
                                        <Text variant="bodyMd" as="p" color="subdued">
                                            {t("orders.single_order.order_status")}:
                                        </Text>
                                        {order.body?.cancelled_at ? (
                                            <Badge tone="critical">
                                                {t("orders.single_order.cancelled")}
                                            </Badge>
                                        ) : order.body?.financial_status === 'paid' ? (
                                            <Badge tone="success">
                                                {t("orders.single_order.paid")}
                                            </Badge>
                                        ) : order.body?.financial_status === 'partially_paid' ? (
                                            <Badge tone="warning">
                                                {t("orders.single_order.partially_paid")}
                                            </Badge>
                                        ) : order.body?.financial_status === 'refunded' ? (
                                            <Badge tone="critical">
                                                {t("orders.single_order.refunded")}
                                            </Badge>
                                        ) : order.body?.financial_status === 'partially_refunded' ? (
                                            <Badge tone="warning">
                                                {t("orders.single_order.partially_refunded")}
                                            </Badge>
                                        ) : order.body?.financial_status === 'voided' ? (
                                            <Badge tone="critical">
                                                {t("orders.single_order.voided")}
                                            </Badge>
                                        ) : (
                                            <Badge tone="warning">
                                                {order.body?.financial_status || t("orders.single_order.pending")}
                                            </Badge>
                                        )}
                                    </InlineStack>

                                    {order.body?.fulfillment_status && (
                                        <InlineStack gap="100" align="space-between">
                                            <Text variant="bodyMd" as="p" color="subdued">
                                                {t("orders.single_order.fulfillment_status")}:
                                            </Text>
                                            <Badge tone={order.body.fulfillment_status === 'fulfilled' ? 'success' : 'info'}>
                                                {order.body.fulfillment_status === 'fulfilled'
                                                    ? t("orders.single_order.fulfilled")
                                                    : order.body.fulfillment_status}
                                            </Badge>
                                        </InlineStack>
                                    )}
                                </BlockStack>
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="300">
                                <Text variant="headingMd" as="h6">
                                    {t("orders.single_order.order_access")}
                                </Text>

                                <InlineStack gap="200">
                                    <div>
                                        {order.can_access === false ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                className="Polaris-Icon__Svg icon-small" focusable="false"
                                                aria-hidden="true" style={{ width: '24px', height: '24px' }}>
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                                                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                className="Polaris-Icon__Svg icon-small" focusable="false"
                                                aria-hidden="true" style={{ width: '24px', height: '24px' }}>
                                                <path
                                                    d="M8.28 8.683a.75.75 0 0 0-1.06 1.06l1.548 1.548a.75.75 0 0 0 1.06 0l2.963-2.962a.75.75 0 0 0-1.06-1.06l-2.433 2.431-1.018-1.017Z"></path>
                                                    <path fill-rule="evenodd"
                                                        d="M11.093 2.914a1.75 1.75 0 0 0-2.186 0l-.317.253a15.25 15.25 0 0 1-3.217 1.976l-.847.384a1.71 1.71 0 0 0-1.01 1.628c.28 6.25 4.38 9.048 5.732 9.802.47.262 1.034.262 1.503 0 1.352-.753 5.454-3.55 5.734-9.783a1.71 1.71 0 0 0-1.002-1.623l-.9-.416a15.249 15.249 0 0 1-3.136-1.938l-.354-.283Zm-1.25 1.171a.25.25 0 0 1 .313 0l.354.283a16.749 16.749 0 0 0 3.445 2.129l.9.415a.213.213 0 0 1 .131.195c-.246 5.489-3.827 7.906-4.965 8.54a.042.042 0 0 1-.02.006c-.005 0-.012 0-.022-.006-1.136-.634-4.718-3.053-4.965-8.56-.003-.066.037-.15.133-.194l.846-.385a16.75 16.75 0 0 0 3.534-2.17l.317-.253Z"></path>
                                                </svg>
                                        )}
                                    </div>
                                    <div style={{ marginLeft: '12px' }}>
                                        <Text variant="bodyLg" as="p">
                                            {order.can_access === false
                                                ? t("orders.single_order.customer_cant_access_this_order")
                                                : t("orders.single_order.customer_can_access_this_order")}
                                        </Text>
                                    </div>
                                </InlineStack>

                                {order.can_access !== false ? (
                                    <Button onClick={() => setShowRevokeAccessModal(true)} tone="critical">
                                        {t("orders.single_order.revoke_access")}
                                    </Button>
                                ) : (
                                    <Button onClick={() => handleGrantAccess()} tone="success">
                                        {t("orders.single_order.grant_access")}
                                    </Button>
                                )}

                                {resetAccesses.length > 0 && (
                                    <BlockStack gap="100">
                                        {resetAccesses.map((reset) => (
                                            <Text variant="bodySm" as="p" color="subdued" key={reset.id}>
                                                {t("orders.single_order.download_access_reset_on")} <strong>{formatDateTime(reset.created_at)}</strong>
                                            </Text>
                                        ))}
                                    </BlockStack>
                                )}

                                <div style={{ display: 'none' }}>
                                    <InlineStack>
                                        <div style={{ marginTop: '10px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
                                                height="24">
                                                <circle cx="12" cy="12" r="10" stroke="#9e9e9e" stroke-width="4"
                                                    fill="none" />
                                            </svg>
                                        </div>
                                        <div style={{ marginLeft: '20px' }}>
                                            <div>
                                                <Text variant="headingMd" as="h6">
                                                    {t("orders.single_order.accessed_by_customer")}
                                                </Text>
                                                <div style={{ marginTop: '5px' }}>
                                                    <Link url="#">
                                                        <Text variant="bodyLg" as="p">
                                                            {t("orders.single_order.0_of_3_times")}
                                                        </Text>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </InlineStack>
                                </div>
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="300">
                                <InlineGrid columns="1fr auto">
                                    <div>
                                        <Text variant="headingMd" as="h6">
                                            {t("orders.single_order.customer")}
                                        </Text>
                                    </div>
                                    <div onClick={handleEditClick}>
                                        <Link url="#">
                                            <Text variant="bodyLg" as="p">
                                                {t("orders.single_order.edit")}
                                            </Text>
                                        </Link>
                                    </div>
                                </InlineGrid>

                                <Text variant="bodyLg" as="p">
                                    {order.body?.customer?.first_name && order.body?.customer?.last_name
                                        ? `${order.body.customer.first_name} ${order.body.customer.last_name}`
                                        : order.body?.customer?.first_name || order.body?.customer?.last_name || ''
                                    }
                                </Text>

                                <Text variant="bodyLg" as="p">
                                    {order.body?.customer?.email || ''}
                                </Text>

                            </BlockStack>
                        </Card>
                        <Modal
                            open={showModal}
                            onClose={handleCloseModal}
                            title={t("orders.single_order.edit_customer")}
                            primaryAction={{
                                content: t("orders.single_order.save"),
                                onAction: handleSave,
                            }}
                            secondaryActions={[
                                {
                                    content: t("orders.single_order.cancel"),
                                    onAction: handleCloseModal,
                                },
                            ]}
                        >
                            <Modal.Section>
                                <TextField
                                    label={t("orders.single_order.customer_email")}
                                    value={customerEmail}
                                    onChange={(value) => setCustomerEmail(value)}
                                    type="email"
                                    autoComplete=""
                                />
                                <div style={{ marginTop: '10px' }}></div>
                                <LegacyStack wrap={false} alignment="leading" spacing="loose">
                                    <LegacyStack.Item fill>
                                        <FormLayout>
                                            <FormLayout.Group condensed>
                                                <TextField
                                                    label={t("orders.single_order.customer_first_name")}
                                                    value={firstName}
                                                    onChange={(value) => setFirstName(value)}
                                                    autoComplete=""
                                                />
                                                <TextField
                                                    label={t("orders.single_order.customer_last_name")}
                                                    value={lastName}
                                                    onChange={(value) => setLastName(value)}
                                                    autoComplete=""
                                                />
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </LegacyStack.Item>
                                </LegacyStack>
                            </Modal.Section>
                        </Modal>

                        <Card>
                            <BlockStack gap="300">
                                <Text variant="headingMd" as="h6">
                                    {t("orders.single_order.logs")}
                                </Text>

                                <BlockStack gap="200">
                                    {downloads.length > 0 ? (
                                        <BlockStack gap="100">
                                            <Text variant="bodySm" as="p" color="subdued">
                                                {t("orders.single_order.file_downloads")}
                                            </Text>
                                            {downloads.slice(0, 5).map((download, index) => (
                                                <InlineStack key={index} gap="100">
                                                    <Text variant="bodySm" as="p">
                                                        {new Date(download.created_at).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </Text>
                                                    <Text variant="bodySm" as="p" color="subdued">
                                                        {download.country_code ? `(${download.country_code})` : ''}
                                                    </Text>
                                                </InlineStack>
                                            ))}
                                            {downloads.length > 5 && (
                                                <Text variant="bodySm" as="p" color="subdued">
                                                    +{downloads.length - 5} {t("orders.single_order.more")}
                                                </Text>
                                            )}
                                        </BlockStack>
                                    ) : (
                                        <Text variant="bodySm" as="p" color="subdued">
                                            {t("orders.single_order.no_logs_yet")}
                                        </Text>
                                    )}
                                </BlockStack>
                            </BlockStack>
                        </Card>
                    </BlockStack>
                </div>
            </div>

                    </Page>
    );
};

export default SingleOrder;
