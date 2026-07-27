import React, { useState, useEffect, useCallback } from "react";
import {
    IndexTable,
    Card,
    useIndexResourceState,
    Text,
    Page,
    Button,
    EmptyState,
    TextField,
    Link,
    Pagination,
    Spinner,
    Badge,
    Autocomplete,
    InlineStack,
    Select,
    Modal,
    BlockStack,
    RadioButton
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../components/providers/AppProvider";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LanguageSelector from "../components/LanguageSelector";
import useReviewModal from "../hooks/useReviewModal.js";

function Orders() {
    const shopify = useAppBridge();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const ordersPerPage = 10;
    const [selectedOrderOptions, setSelectedOrderOptions] = useState([]);
    const [inputOrderValue, setInputOrderValue] = useState("");
    const [searchOrderOptions, setSearchOrderOptions] = useState([]);

    // Export modal state
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportOption, setExportOption] = useState('all'); // 'all' or 'dateRange'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const { t } = useTranslation()

    const { refetchStore,store } = React.useContext(AppContext)

    // Shopify Review Modal Hook - checks if this is the first order scenario
    // Only triggers if user is eligible and hasn't seen it recently
    const { hasRequested: hasRequestedReview } = useReviewModal({
        delay: 3000, // 3 seconds delay
        triggerContext: 'first_order',
        enabled: true, // Always check on orders page
    });

    const handleFreeOrder = () => navigate("/createFreeOrder");

    const handleSingleOrder = (orderId) => {
        navigate(`/singleOrder/${orderId}`);
    };

    useEffect(() => {
        if (store.finish_onboarding === 0) {
            refetchStore();
        }
    }, [refetchStore, store.finish_onboarding]);

    const fetchOrders = async () => {
        // refetchStore();
        setIsLoadingData(true);
        try {
            const response = await fetch(`/api/get-orders?page=${currentPage}&limit=${ordersPerPage}`);

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
                setTotalOrders(data.total);
            } else {
                shopify.toast.show(t("orders.failed_to_fetch_orders"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            shopify.toast.show(t("orders.failed_to_fetch_orders"), { isError: true, duration: 9999999 });
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const handlePaginationChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const resourceName = {
        singular: t("orders.order_"),
        plural: t("orders.orders_"),
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(orders);

    const rowMarkup = orders.map((order) => {
        const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const productIds = order.digital_products ? order.digital_products.split(',') : [];
        const productText = productIds.length === 1 ? t("orders.product") : t("orders.products");

        const lotteryIds = order.digital_lotteries ? order.digital_lotteries.split(',') : [];
        const lotteryText = lotteryIds.length === 1 ? t("orders.lottery") : t("orders.lotteries");

        return (
            <IndexTable.Row
                id={order.id}
                key={order.id}
                selected={selectedResources.includes(order.id)}
            >
                <IndexTable.Cell>
                    <div onClick={() => handleSingleOrder(order.id)}>
                        <Link>{order.body.name}</Link>
                    </div>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div>
                        {order.is_risky ? (
                            <div><Badge tone="critical">{t("orders.risky")}</Badge></div>
                        ) : ''}

                        {order.is_delivered ? (
                            <Badge tone="success">{t("orders.delivered")}</Badge>
                        ) : (
                            <Badge tone="warning">{t("orders.not_delivered")}</Badge>
                        )}
                    </div>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {order.body?.customer?.first_name && order.body?.customer?.last_name
                        ? `${order.body.customer.first_name} ${order.body.customer.last_name}`
                        : order.body?.customer?.email || ''}
                </IndexTable.Cell>
                <IndexTable.Cell>{formattedDate}</IndexTable.Cell>
                <IndexTable.Cell>
                    <a href="#" style={{ color: 'black' }}>{productIds.length} {productText}</a>
                </IndexTable.Cell>
                {/* <IndexTable.Cell>
                    <a href="#" style={{ color: 'black' }}>{lotteryIds.length} {lotteryText}</a>
                </IndexTable.Cell> */}
            </IndexTable.Row>
        );
    });

    const handleInputOrderChange = async (value) => {
        setInputOrderValue(value);
    };

    const updateOrderSelection = useCallback(
        (selected) => {
            if (!selected || selected.length === 0) {
                return;
            }

            const selectedValue = selected[0];
            const matchedOption = searchOrderOptions.find((option) => option.label === selectedValue);

            if (matchedOption) {
                setSelectedOrderOptions([selectedValue]);
                setInputOrderValue(matchedOption.label);
                setSearchOrderOptions([matchedOption]);
            }
        },
        [searchOrderOptions]
    );

    const handleClearOrderSearch = () => {
        setInputOrderValue("");
        setSelectedOrderOptions([]);
        setIsLoadingData(true);
        setCurrentPage(1);

        fetch(`/api/search-orders?page=1&limit=${ordersPerPage}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setOrders(data.orders);
                setTotalOrders(data.total);
                setIsLoadingData(false);
            })
            .catch(() => {
                setIsLoadingData(false);
                console.error("Error fetching orders");
            });
    };

    const handleOrderSearch = async () => {
        setIsLoadingData(true);
        setCurrentPage(1);
        const response = await fetch(
            `/api/search-orders?search=${inputOrderValue}&page=1&limit=${ordersPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setOrders(data.orders);
            setTotalOrders(data.total);
            setCurrentPage(1);
            setIsLoadingData(false);
        } else {
            console.error("Error fetching search results");
            setIsLoadingData(false);
        }
    };


    function escapeCSV(value) {
      if (value == null) return "";
      const v = value.toString().replace(/"/g, '""');
      return `"${v}"`;
    }

    const handleExportData = async (dateRange = null) => {
        try {
            setIsExporting(true);

            let url = `/api/export-orders`;
            if (dateRange) {
                url += `?start_date=${dateRange.start}&end_date=${dateRange.end}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data?.error || "Failed to export CSV");
            }

            const orders = data.orders;

            if (orders.length === 0) {
                alert("No orders found to export.");
                return;
            }

            // Get all unique product names across all orders for the header
            const allProductNames = [];
            const productMap = new Map(); // To track product names and their columns

            orders.forEach(order => {
                (order.digital_products || []).forEach(product => {
                    const productName = product.title || "Unknown Product";
                    if (!productMap.has(productName)) {
                        productMap.set(productName, {
                            name: productName,
                            filesColumn: `${productName} Files`,
                            licensesColumn: `${productName} Licenses`,
                            linksColumn: `${productName} Links`
                        });
                        allProductNames.push(productName);
                    }
                });
            });

            // Build CSV header with actual product names
            const csvHeader = ["Order ID", "Customer Email"];
            allProductNames.forEach(productName => {
                csvHeader.push(`${productName} Files`, `${productName} Licenses`, `${productName} Links`);
            });
            csvHeader.push("Created At");

            // Build CSV rows
            const csvRows = orders.map(order => {
                const base = [
                    order.order_id || "",
                    order.customer_email || ""
                ];

                const productColumns = [];

                // Create a map of products for this order for easy lookup
                const orderProductMap = new Map();
                (order.digital_products || []).forEach(product => {
                    const productName = product.title || "Unknown Product";
                    orderProductMap.set(productName, {
                        files: product.attached_files?.map(f => f.file_name || f.fileName).join(", ") || "",
                        licenses: product.licenses?.map(l => l.license_key || l.title).join(", ") || "",
                        links: product.custom_links?.map(l => l.url || l.redirect_url).join(", ") || ""
                    });
                });

                // For each unique product name across all orders, add columns
                allProductNames.forEach(productName => {
                    const productData = orderProductMap.get(productName);
                    if (productData) {
                        // Product exists in this order
                        productColumns.push(productData.files, productData.licenses, productData.links);
                    } else {
                        // Product doesn't exist in this order, add empty columns
                        productColumns.push("", "", "");
                    }
                });

                // Combine base + product columns + created_at at the end
                const allColumns = base.concat(productColumns);
                allColumns.push(order.created_at || "");

                return allColumns.map(escapeCSV).join(",");
            });


            // Combine header + rows
            const csvContent = [
                csvHeader.map(escapeCSV).join(","),
                ...csvRows
            ].join("\n");

            // Download CSV
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            shopify.toast.show(`Successfully exported ${data.total} orders!`);



            // const csvHeader = ["Order Name", "Customer Name", "Customer Email", "Product Name"];
            // const csvRows = rows.map((row) =>
            //     [row.id, row?.body?.shipping_address?.first_name + " " + row?.body?.shipping_address?.last_name, row?.body?.contact_email, row?.body?.line_items[0]?.title + '-' + row?.body?.line_items[0]?.variant_title].join(",")
            // );
            // const csvContent = [csvHeader.join(","), ...csvRows].join("\n");

            // const blob = new Blob([csvContent], {
            //     type: "text/csv;charset=utf-8;",
            // });

            // const url = URL.createObjectURL(blob);
            // const link = document.createElement("a");
            // link.href = url;
            // link.setAttribute("download", `license_keys_used_${licenseId}.csv`);
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting CSV:", error);
            shopify.toast.show(error.message || "Failed to export orders. Please try again.", { isError: true, duration: 9999999 });
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportModalSubmit = async () => {
        let dateRange = null;

        if (exportOption === 'dateRange') {
            if (!startDate || !endDate) {
                shopify.toast.show("Please select both start and end dates", { isError: true, duration: 9999999 });
                return;
            }
            dateRange = { start: startDate, end: endDate };
        }

        setShowExportModal(false);
        await handleExportData(dateRange);
    };

    function getTableContent() {
        if (orders.length === 0) {
            return (
                <EmptyState
                    heading={t("orders.no_orders_found")}
                    image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
                >
                    <p>{t("orders.try_to_add_new_order")}</p>
                </EmptyState>
            );
        } else {
            return (
                <>
                    <IndexTable
                        resourceName={resourceName}
                        itemCount={orders.length}
                        selectedItemsCount={
                            allResourcesSelected ? t("orders.all") : selectedResources.length
                        }
                        onSelectionChange={handleSelectionChange}
                        headings={[
                            { title: t("orders.order_name") },
                            { title: t("orders.status") },
                            { title: t("orders.customer") },
                            { title: t("orders.date") },
                            { title: t("orders.digital_product") },
                        ]}
                    >
                        {rowMarkup}
                    </IndexTable>
                </>
            );
        }
    }

    function getMobileCardContent() {
        if (orders.length === 0) {
            return (
                <EmptyState
                    heading={t("orders.no_orders_found")}
                    image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
                >
                    <p>{t("orders.try_to_add_new_order")}</p>
                </EmptyState>
            );
        }

        return (
            <div>
                {orders.map((order) => {
                    const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    const productIds = order.digital_products ? order.digital_products.split(',') : [];
                    const productText = productIds.length === 1 ? t("orders.product") : t("orders.products");

                    const customerName = order.body?.customer?.first_name && order.body?.customer?.last_name
                        ? `${order.body.customer.first_name} ${order.body.customer.last_name}`
                        : order.body?.customer?.email || '';

                    return (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div
                                    className="order-card-name order-card-link"
                                    onClick={() => handleSingleOrder(order.id)}
                                >
                                    {order.body.name}
                                </div>
                                <div className="order-card-status">
                                    {order.is_risky && (
                                        <Badge tone="critical">{t("orders.risky")}</Badge>
                                    )}
                                    {order.is_delivered ? (
                                        <Badge tone="success">{t("orders.delivered")}</Badge>
                                    ) : (
                                        <Badge tone="warning">{t("orders.not_delivered")}</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="order-card-row">
                                <span className="order-card-label">{t("orders.customer")}:</span>
                                <span className="order-card-value">{customerName}</span>
                            </div>

                            <div className="order-card-row">
                                <span className="order-card-label">{t("orders.date")}:</span>
                                <span className="order-card-value">{formattedDate}</span>
                            </div>

                            <div className="order-card-row">
                                <span className="order-card-label">{t("orders.digital_product")}:</span>
                                <span className="order-card-value">
                                    {productIds.length} {productText}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <>
            <style>{`
                /* Search container responsive styles */
                .orders-search-container {
                    display: flex;
                    gap: 8px;
                    flex-wrap: nowrap;
                    align-items: center;
                }

                .orders-search-input {
                    flex: 1;
                    min-width: 200px;
                }

                .orders-search-button {
                    flex-shrink: 0;
                }

                /* Desktop (default) */
                @media (min-width: 769px) {
                    .orders-search-input {
                        flex: 1 1 auto;
                        min-width: 200px;
                    }

                    .orders-search-button {
                        flex: 0 0 auto;
                    }
                }

                /* Tablet (≤ 768px) */
                @media (max-width: 768px) {
                    .orders-search-container {
                        flex-direction: column;
                    }

                    .orders-search-input,
                    .orders-search-button {
                        width: 100%;
                        flex: 1 1 auto;
                    }

                    .orders-search-button button {
                        width: 100%;
                    }
                }

                /* Mobile (≤ 480px) */
                @media (max-width: 480px) {
                    .orders-search-container {
                        gap: 8px;
                    }
                }

                /* Mobile card layout for orders */
                .orders-mobile-card {
                    display: none;
                }

                @media (max-width: 768px) {
                    .orders-desktop-table {
                        display: none !important;
                    }

                    .orders-mobile-card {
                        display: block;
                    }

                    .order-card {
                        border: 1px solid #e1e3e5;
                        border-radius: 8px;
                        padding: 16px;
                        margin-bottom: 12px;
                        background: white;
                    }

                    .order-card-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: start;
                        margin-bottom: 12px;
                    }

                    .order-card-name {
                        font-weight: 600;
                        font-size: 16px;
                        flex: 1;
                        word-break: break-word;
                    }

                    .order-card-status {
                        flex-shrink: 0;
                        margin-left: 8px;
                    }

                    .order-card-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px solid #f1f2f4;
                        font-size: 14px;
                    }

                    .order-card-row:last-child {
                        border-bottom: none;
                    }

                    .order-card-label {
                        color: #6d7175;
                        font-weight: 500;
                    }

                    .order-card-value {
                        text-align: right;
                        word-break: break-word;
                        margin-left: 16px;
                    }

                    .order-card-link {
                        color: #006fbb;
                        text-decoration: none;
                        cursor: pointer;
                    }

                    .order-card-link:hover {
                        text-decoration: underline;
                    }
                }

                /* Pagination responsive */
                .orders-pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                @media (max-width: 480px) {
                    .orders-pagination {
                        margin-top: 16px;
                    }
                }
            `}</style>

            <Page
                title={t("orders.title")}
                primaryAction={<LanguageSelector/>}
                secondaryActions={[
                    {
                        content: t("create_free_order.create_test_order"),
                        onAction: handleFreeOrder,
                    },
                    {
                        content: isExporting ? t('digtal_product_listing.exporting') : t('digtal_product_listing.export_as_csv'),
                        onAction: () => setShowExportModal(true),
                        disabled: isExporting,
                    }
                ]}
            >
                    <Card sectioned>
                        {/* Responsive Search Bar */}
                        <div style={{ margin: "5px", padding: "5px" }}>
                            <div className="orders-search-container">
                                <div className="orders-search-input">
                                    <TextField
                                        onChange={handleInputOrderChange}
                                        value={inputOrderValue}
                                        autoComplete="off"
                                        placeholder={t("orders.search_order_by")}
                                        clearButton
                                        onClearButtonClick={handleClearOrderSearch}
                                    />
                                </div>

                                <div className="orders-search-button">
                                    <Button variant="primary" onClick={handleOrderSearch} primary>
                                        {t("orders.search")}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: "15px" }}></div>

                        {/* Desktop Table View */}
                        <div className="orders-desktop-table">
                            {getTableContent()}
                        </div>

                        {/* Mobile Card View */}
                        <div className="orders-mobile-card">
                            {getMobileCardContent()}
                        </div>

                        {isLoadingData && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Spinner size="small" />
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="orders-pagination">
                            <Pagination
                                hasPrevious={currentPage > 1}
                                onPrevious={() => handlePaginationChange(currentPage - 1)}
                                hasNext={orders.length === ordersPerPage && totalOrders > currentPage * ordersPerPage}
                                onNext={() => handlePaginationChange(currentPage + 1)}
                                labels={{ next: t("orders.next"), previous: t("orders.previous") }}
                                disabled={isLoadingData}
                            />
                        </div>
                    </Card>

                    {/* Export Modal */}
                    <Modal
                        open={showExportModal}
                        onClose={() => {
                            if (!isExporting) {
                                setShowExportModal(false);
                            }
                        }}
                        title={t('digtal_product_listing.export_as_csv')}
                        primaryAction={{
                            content: t('digtal_product_listing.export'),
                            onAction: handleExportModalSubmit,
                            disabled: isExporting || (exportOption === 'dateRange' && (!startDate || !endDate))
                        }}
                        secondaryActions={[
                            {
                                content: t('digtal_product_listing.cancel'),
                                onAction: () => {
                                    if (!isExporting) {
                                        setShowExportModal(false);
                                    }
                                },
                                disabled: isExporting
                            }
                        ]}
                    >
                        <Modal.Section>
                            <BlockStack gap="400">
                                <Text as="p" variant="headingMd">{t('digtal_product_listing.select_export_range')}</Text>

                                <RadioButton
                                    label={t('digtal_product_listing.all_orders')}
                                    checked={exportOption === 'all'}
                                    id="all-orders"
                                    name="export-option"
                                    onChange={() => setExportOption('all')}
                                    disabled={isExporting}
                                />

                                <RadioButton
                                    label={t('digtal_product_listing.date_range')}
                                    checked={exportOption === 'dateRange'}
                                    id="date-range"
                                    name="export-option"
                                    onChange={() => setExportOption('dateRange')}
                                    disabled={isExporting}
                                />

                                {exportOption === 'dateRange' && (
                                    <BlockStack gap="200">
                                        <div style={{ marginTop: '10px' }}>
                                            <TextField
                                                label={t('digtal_product_listing.start_date')}
                                                type="date"
                                                value={startDate}
                                                onChange={(value) => setStartDate(value)}
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="off"
                                                disabled={isExporting}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                label={t('digtal_product_listing.end_date')}
                                                type="date"
                                                value={endDate}
                                                onChange={(value) => setEndDate(value)}
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="off"
                                                disabled={isExporting}
                                            />
                                        </div>
                                    </BlockStack>
                                )}
                            </BlockStack>
                        </Modal.Section>
                    </Modal>
            </Page>
        </>
    );
}

export default Orders;
