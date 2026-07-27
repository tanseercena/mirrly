import {
    Card,
    Button,
    ButtonGroup,
    EmptyState,
    Select,
    InlineStack,
    Layout,
    Page,
    ResourceItem,
    ResourceList,
    Text,
    Thumbnail,
    Icon,
    BlockStack,
    Modal,
    DropZone,
    Checkbox,
    Badge,
    LegacyStack,
    Banner,
    InlineGrid,
    Pagination,
    SkeletonBodyText,
    RadioButton,
    TextField,
    Autocomplete,
    Spinner,
    IndexTable,
    TextContainer,
    DataTable,
    Divider,

} from "@shopify/polaris";
import { Link as PolarisLink } from "@shopify/polaris";
import { EditIcon, DeleteIcon, PlusIcon, ImportIcon } from "@shopify/polaris-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Styles.css";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import {
    DigitalProductsModal,
    EditDigitalProductModal,
    DuplicateDigitalProductModal,
    IntroVideoCard,
    SendOwlImportModal,
} from "../components";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useQuery } from "react-query";
import { AppContext } from "../components/providers/AppProvider.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { isCardDismissed, dismissCard } from "../utils/sessionStorage.js";
// import
const DigitalProductsPage = () => {
    const { store, primaryLocale, refetchStore } = React.useContext(AppContext);
    const shopify = useAppBridge();
    const navigate = useNavigate();
    const location = useLocation();

    // Utility function to construct full Shopify admin URL
    const getShopifyAdminUrl = (path) => {
        let storeName = '';

        // Get store name from store state
        if (store && store.shopify_domain) {
            // Remove .myshopify.com suffix if present
            storeName = store.shopify_domain.replace('.myshopify.com', '');
        }

        // Determine app name based on API key
        const appName = process.env.SHOPIFY_API_KEY?.endsWith('fb15d') ? 'digitally' : 'digitally-digital-products';

        // If we have store name, construct full Shopify admin URL
        if (storeName) {
            return `https://admin.shopify.com/store/${storeName}/apps/${appName}${path}`;
        }

        // Fallback to relative URL for development or when store detection fails
        return path;
    };
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [active, setActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [autoFulfill, setAutoFulfill] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [digitalProductsLimit, setDigitalProductsLimit] = useState(0);
    const [isLimitExceededModalActive, setIsLimitExceededModalActive] =
        useState(false);
    const [issetIsLoading] = useState(true);
    const [deleteType, setDeleteType] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [showSetupGuide, setShowSetupGuide] = useState(!isCardDismissed('digital_products_setup_guide'));
    const { t } = useTranslation();

    // Inject side spacing CSS for screens below 490px
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `

            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleDismissSetupGuide = useCallback(() => {
        setShowSetupGuide(false);
        dismissCard('digital_products_setup_guide');
    }, []);

    // Load products per page from session storage or default to 10
    const getInitialProductsPerPage = () => {
        const saved = sessionStorage.getItem('digitally_products_per_page');
        return saved ? Number(saved) : 10;
    };

    const [productsPerPage, setProductsPerPage] = useState(getInitialProductsPerPage);

    // Function to handle products per page change and save to session storage
    const handleProductsPerPageChange = (value) => {
        const numValue = Number(value);
        setProductsPerPage(numValue);
        sessionStorage.setItem('digitally_products_per_page', numValue.toString());
        setCurrentPage(1);
        setIsLoadingData(true);
    };

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFiles((files) => [...files, ...acceptedFiles]),
        [files]
    );

    const handleAutoFulfillCheckbox = useCallback(
        (value) => {
            setAutoFulfill(value);
        },
        [autoFulfill]
    );

    const [isDigitalModalActive, setIsDigitalModalActive] = useState(false);
    const [isEditDigitalModalActive, setIsEditDigitalModalActive] =
        useState(false);
    const [isDuplicateModalActive, setIsDuplicateModalActive] = useState(false);
    const [isSendOwlImportModalActive, setIsSendOwlImportModalActive] = useState(false);

    // const [{ data: shop, fetching: isFetchingShop }, refetch] = useShopForDigitalProductsPage()
    // const [{ fetching: isDeleting }, deleteDigitalProduct] = useAction(api.digitalProduct.delete)

    //const digitalProducts = shop?.digitalProducts.edges ?? []
    // const digitalProducts = []
    const [digitalProducts, setDigitalProducts] = useState([]);
    const hasEmptyDigitalProducts = !digitalProducts.length;
    const [digitalProduct, setDigitalProduct] = useState(null);
    const [digitalProductToDuplicate, setDigitalProductToDuplicate] = useState(null);
    const [isConfirmDeleteModalActive, setIsConfirmDeleteModalActive] =
        useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [licenseTrackingEnabled, setLicenseTrackingEnabled] = useState(false);
    const perPageOptions = [
        { label: "10", value: "10" },
        { label: "20", value: "20" },
        { label: "50", value: "50" },
        { label: "100", value: "100" },
        { label: "500", value: "500" },
    ];
    useEffect(() => {
        if (store.finish_onboarding === 0) {
            refetchStore();
        }
    }, [refetchStore, store.finish_onboarding]);
    const fetchDigitalProducts = async () => {
        const response = await fetch(`/api/digital-products?page=${currentPage}&limit=${productsPerPage}`);
        if (!response.ok) {
            throw new Error('Failed to fetch digital products');
        }
        return response.json();
    };

    const {
        data: productsData,
        refetch: refetchDigitalProducts,
        isLoading: isLoadingPlans,
        isRefetching: isRefetchingDigitalProducts,
    } = useQuery(
        ['digitalProducts', currentPage, productsPerPage],
        fetchDigitalProducts,
        {
            onSuccess: (response) => {
                console.log("Fetched products:", response.data);
                console.log("Total products:", response.total);
                setDigitalProducts(response.data);
                setTotalProducts(response.total);
                setIsLoadingData(false);
            },
            onError: () => {
                console.error("Failed to fetch digital products");
                setIsLoadingData(false);
            },
        }
    );

    useEffect(() => {
        setIsLoadingData(true);
        refetchDigitalProducts();
    }, [currentPage, refetchDigitalProducts]);

    const handlePaginationChange = async (newPage) => {
        setIsLoadingData(true);
        const response = await fetch(
            `/api/search-digital-products?search=${inputValue}&page=${newPage}&limit=${productsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setDigitalProducts(data.data);
            setTotalProducts(data.total);
            setCurrentPage(data.current_page);
            setIsLoadingData(false);
        } else {
            console.error("Error fetching paginated results");
            setIsLoadingData(false);
        }
    };

    const handleDeleteTypeChange = useCallback((newValue) => {
        setDeleteType(newValue);
    }, []);

    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const openDigitalProductModal = useCallback(() => {
        setIsDigitalModalActive(true);
    }, []);

    const closeDigitalProductModal = useCallback(async () => {
        setIsDigitalModalActive(false);
        shopify.toast.show(t("digtal_product_listing.digital_product_added_successfully"));
        await refetchDigitalProducts();
    }, [t, shopify, refetchDigitalProducts]);

    const handleInputChange = async (value) => {
        setInputValue(value);

        if (value.length > 2) {
            setLoading(true);

            try {
                const response = await fetch(
                    `/api/search-digital-products?search=${encodeURIComponent(
                        value
                    )}&page=1&limit=10`,
                    {
                        method: "GET",
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setOptions(
                        data.data.map((item) => ({
                            label: item.associatedProduct.title,
                            value: item.associatedProduct.title,
                        }))
                    );
                } else {
                    console.error("Error fetching search results");
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setOptions([]);
        }
    };

    const updateSelection = useCallback(
        (selected) => {
            if (!selected || selected.length === 0) {
                return;
            }

            const selectedValue = selected[0];
            const matchedOption = options.find(
                (option) => option.label === selectedValue
            );

            if (matchedOption) {
                setSelectedOptions([selectedValue]);
                setInputValue(matchedOption.label);
                setOptions([matchedOption]);
            }
        },
        [options]
    );

    const handleEditDigitalProduct = useCallback(async (digitalProduct) => {
        console.log("Edit: ");
        console.log(digitalProduct);
        setDigitalProduct(digitalProduct);
        setIsEditDigitalModalActive(true);
    }, []);

    const closeEditDigitalProductModal = useCallback(async () => {
        setIsEditDigitalModalActive(false);
        shopify.toast.show(t("digtal_product_listing.digital_product_updated_successfully"));
        await refetchDigitalProducts();
    }, [t, shopify, refetchDigitalProducts]);

    const openDuplicateModal = useCallback((digitalProduct) => {
        setDigitalProductToDuplicate(digitalProduct);
        setIsDuplicateModalActive(true);
    }, []);

    const closeDuplicateModal = useCallback(async () => {
        setIsDuplicateModalActive(false);
        setDigitalProductToDuplicate(null);
        await refetchDigitalProducts();
    }, [refetchDigitalProducts]);

    // const fetchDigitalData = async () => {
    //     try {
    //         const response = await fetch('/api/get-digital-data');
    //         if (response.ok) {
    //             const data = await response.json();
    //             setDigitalProducts(data.digitalProducts);
    //             setIsLoadingData(false);
    //         } else {
    //             console.error('Failed to fetch digital data');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching digital data:', error);
    //     }
    // };

    useEffect(() => {
        // fetchDigitalData();
    }, []);

    const handleDeleteDigitalProduct = useCallback(
        async (digitalProduct) => {
            // try {
            //     await deleteDigitalProduct({ id: digitalProduct.id })
            //     refetch()
            // } catch (error) {
            //     console.log(error)
            // }
            setIsDeleting(true);

            const response = await fetch(
                `/api/delete-digital-product/${digitalProduct.id}/${deleteType}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                }
            );
            // console.log(response)
            if (response.ok) {
                setIsDeleting(false);
                shopify.toast.show(t("digtal_product_listing.digital_product_deleted_successfully"));
                await refetchDigitalProducts();
            } else {
                // Error
                shopify.toast.show(t("digtal_product_listing.digital_product_deleted_failed"), { isError: true, duration: 9999999 });
            }
        },
        [deleteType]
    );

    useEffect(() => {
        if (store) {
            const productLimit =
                store.plan.limits.digital_products === "unlimited"
                    ? Infinity
                    : Number(store.plan.limits.digital_products);
            setDigitalProductsLimit(productLimit);
            const license_tracking_enabled =
                store?.setting?.track_license_codes ?? false;
            setLicenseTrackingEnabled(license_tracking_enabled);
        }
    }, [store]);

    const handleCreateDigitalProduct = useCallback(() => {
        if (
            store.digital_products_limit <= 0 &&
            Number.isFinite(digitalProductsLimit)
        ) {
            setIsLimitExceededModalActive(true);
        } else {
            navigate("/createDigitalProduct");

        }
    }, [digitalProducts.length, digitalProductsLimit]);

    const handleUploadProductCSV = useCallback(() => {
        if (
            store.digital_products_limit <= 0 &&
            Number.isFinite(digitalProductsLimit)
        ) {
            setIsLimitExceededModalActive(true);
        } else {
            toggleActive();
        }
    }, [digitalProductsLimit]);

    const handleImportFromSendOwl = useCallback(() => {
        setIsSendOwlImportModalActive(true);
    }, []);

    const closeLimitExceededModal = useCallback(() => {
        setIsLimitExceededModalActive(false);
    }, []);

    const handleSendOwlImportComplete = useCallback((result) => {
        // Refresh the digital products list after successful import
        refetchDigitalProducts();
        shopify.toast.show(result.message);
    }, [refetchDigitalProducts, shopify]);

    const handlePricing = () => navigate("/pricing", { replace: true });

    const handleSave = async (files, autoFulfill) => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("auto_fulfill", autoFulfill ? "1" : "0");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                if (data.total_errors > 0 || data.total_skipped > 0) {
                    shopify.toast.show(data.message, {
                        duration: 5000
                    });

                    if (data.errors && data.errors.length > 0) {
                        const errorList = data.errors.join('\n\n');
                        alert("⚠️ Upload Errors:\n\n" + errorList + "\n\nPlease fix these rows and try again.");
                    }

                    if (data.skipped && data.skipped.length > 0) {
                        const skippedList = data.skipped.join('\n');
                        console.log("Skipped Rows:\n" + skippedList);
                    }
                } else {
                    shopify.toast.show(t("digtal_product_listing.file_uploaded_successfully"));
                }

                if (data.total_imported > 0) {
                    await refetchDigitalProducts();
                }

                toggleActive();
                setFiles([]);
                setAutoFulfill(false);
            } else {
                shopify.toast.show(
                    data.message || t("digtal_product_listing.failed_to_upload_file"),
                    { isError: true, duration: 5000 }
                );

                if (data.errors && data.errors.length > 0) {
                    const errorList = data.errors.join('\n\n');
                    alert("❌ Upload Failed:\n\n" + errorList);
                }
            }
        } catch (error) {
            console.error("Error uploading file:", error.message);
            shopify.toast.show(
                `${t("digtal_product_listing.error_uploading_file")} ${error.message}`,
                { isError: true, duration: 9999999 }
            );
        } finally {
            setSaving(false);
        }
    };


    const handleFileSelect = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "text/csv";
        input.onchange = (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleDropZoneDrop(Array.from(e.target.files));
            }
        };
        input.click();
    };

    const emptStateMarkup = hasEmptyDigitalProducts && (
        <div>
            <InlineStack align="end">
          </InlineStack>
            <EmptyState
                heading={t(
                    "digtal_product_listing.create_a_digital_product_to_get_started"
                )}
                // action={{ content: "Create Digital Product", icon: PlusIcon, onAction: openDigitalProductModal }}
                action={{
                    content: t("digtal_product_listing.create_digital_product"),
                    icon: PlusIcon,
                    onAction: () => {
                        handleCreateDigitalProduct();
                    },
                }}
                // secondaryAction={{
                //     content: t("digtal_product_listing.upload_csv"),
                //     icon: PlusIcon,
                //     onAction: () => {
                //         handleUploadProductCSV();
                //     },
                // }}
                image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
            >
                {t(
                    "digtal_product_listing.create_your_first_digital_product_and_start_selling_it_right_away"
                )}
            </EmptyState>


        </div>
    );

    const digitalProductModalMarkup = isDigitalModalActive && (
        <DigitalProductsModal
            shopId={1}
            isActive={isDigitalModalActive}
            onClose={closeDigitalProductModal}
        />
    );

    const editDigitalProductModalMarkup = isEditDigitalModalActive && (
        <EditDigitalProductModal
            shopId={1}
            isActive={isEditDigitalModalActive}
            onClose={closeEditDigitalProductModal}
            digitalProduct={digitalProduct}
        />
    );

    const duplicateModalMarkup = isDuplicateModalActive && (
        <DuplicateDigitalProductModal
            shopId={1}
            isActive={isDuplicateModalActive}
            onClose={closeDuplicateModal}
            digitalProduct={digitalProductToDuplicate}
        />
    );

    const sendOwlImportModalMarkup = (
        <SendOwlImportModal
            active={isSendOwlImportModalActive}
            setActive={setIsSendOwlImportModalActive}
            onImportComplete={handleSendOwlImportComplete}
        />
    );


    const handleClearSearch = () => {
        setInputValue("");
        setSelectedOptions([]);
        setIsLoadingData(true);
        setCurrentPage(1);

        fetch(`/api/digital-products?page=1&limit=${productsPerPage}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setDigitalProducts(data.data);
                setTotalProducts(data.total);
                setIsLoadingData(false);
            })
            .catch(() => {
                setIsLoadingData(false);
                console.error("Error fetching products");
            });
    };

    const handleSearch = async () => {
        setIsLoadingData(true);
        setCurrentPage(1);
        const response = await fetch(
            `/api/search-digital-products?search=${inputValue}&page=1&limit=${productsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setDigitalProducts(data.data);
            setTotalProducts(data.total);
            setCurrentPage(data.current_page);
            setIsLoadingData(false);
        } else {
            console.error("Error fetching search results");
            setIsLoadingData(false);
        }
    };

    const textField = (
        <Autocomplete.TextField
            onChange={handleInputChange}
            value={inputValue}
            autoComplete="off"
            placeholder={t("digtal_product_listing.search_by_product_name")}
            clearButton
            onClearButtonClick={handleClearSearch}
        />
    );

    return (
        <>
            {digitalProductModalMarkup}
            {editDigitalProductModalMarkup}
            {duplicateModalMarkup}
            {sendOwlImportModalMarkup}

            <Page
                title={t("digtal_product_listing.digital_products")}
                secondaryActions={<LanguageSelector />}
            >
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ padding: "0" }}>
                {/* <Text variant="headingLg" as="h5">
                    {t("digtal_product_listing.digital_products")}
                </Text> */}
                {/* <div style={{ marginTop: "10px" }}></div> */}

                {showSetupGuide && (
                    <IntroVideoCard
                        video_link="https://www.youtube.com/watch?v=5mN31GRSy5o"
                        title={t(
                            "digtal_product_listing.digital_product_setup_guide"
                        )}
                        description={t(
                            "digtal_product_listing.watch_our_quick_video_guide"
                        )}
                        onCancel={handleDismissSetupGuide}
                    />
                )}

                {isLoadingData && (
                    <Layout>
                        <Layout.Section>
                            <Card>
                                <BlockStack gap="300">
                                    <InlineStack gap="200">
                                        <div style={{ width: "91%" }}>
                                            <Autocomplete
                                                options={options}
                                                selected={selectedOptions}
                                                onSelect={updateSelection}
                                                textField={textField}
                                                loading={loading}
                                            />
                                        </div>

                                        <div style={{ width: "7%" }}>
                                            <Button
                                                variant="primary"
                                                onClick={handleSearch}
                                                primary
                                            >
                                                Search
                                            </Button>
                                        </div>
                                    </InlineStack>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100%",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <div style={{ width: "15%" }}>
                                            <Text as="p" variant="bodyMd">
                                                {t(
                                                    "digtal_product_listing.items_per_page"
                                                )}
                                            </Text>
                                        </div>
                                        <div style={{ width: "35%" }}>
                                            <Select
                                                options={perPageOptions}
                                                value={Number(productsPerPage)}
                                                onChange={handleProductsPerPageChange}
                                            />
                                        </div>
                                        <div style={{ width: "50%" }}></div>
                                    </div>
                                    <div style={{ marginTop: "10px" }}></div>
                                    <SkeletonBodyText />
                                </BlockStack>
                            </Card>
                        </Layout.Section>
                    </Layout>
                )}
                {!isLoadingData && (
                    <Layout>
                        <Layout.Section>
                            <Card>
                                <div style={{
                                    display: "flex",
                                    gap: "8px",
                                    flexDirection: window.innerWidth <= 768 ? "column" : "row"
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <Autocomplete
                                            options={options}
                                            selected={selectedOptions}
                                            onSelect={updateSelection}
                                            textField={textField}
                                            loading={loading}
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={handleSearch}
                                        fullWidth={window.innerWidth <= 768}
                                    >
                                        {t("digtal_product_listing.search")}
                                    </Button>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                        marginTop: "10px",
                                        flexWrap: window.innerWidth <= 768 ? "wrap" : "nowrap",
                                        gap: window.innerWidth <= 768 ? "8px" : "0"
                                    }}
                                >
                                    <div style={{ width: window.innerWidth <= 768 ? "100%" : "15%" }}>
                                        <Text as="p" variant="bodyMd">
                                            {t("digtal_product_listing.items_per_page")}
                                        </Text>
                                    </div>
                                    <div style={{ width: window.innerWidth <= 768 ? "100%" : "35%" }}>
                                        <Select
                                            options={perPageOptions}
                                            value={String(productsPerPage)}
                                            onChange={handleProductsPerPageChange}
                                        />
                                    </div>
                                    {window.innerWidth > 768 && <div style={{ width: "50%" }}></div>}
                                </div>
                                <div>
                                    {window.innerWidth <= 768 ? (
                                        <div style={{
                                            marginTop: "16px",
                                            marginBottom: "16px"
                                        }}>
                                            <BlockStack gap="200">
                                                <Button
                                                    variant="secondary"
                                                    icon={ImportIcon}
                                                    onClick={handleImportFromSendOwl}
                                                    fullWidth
                                                >
                                                    {t("sendowl_import.import_from_sendOwl")}
                                                </Button>
                                                {/* <Button
                                                    variant="secondary"
                                                    icon={PlusIcon}
                                                    onClick={handleUploadProductCSV}
                                                    fullWidth
                                                >
                                                    {t("digtal_product_listing.upload_products_via_csv")}
                                                </Button> */}
                                                <Button
                                                    variant="primary"
                                                    icon={PlusIcon}
                                                    onClick={handleCreateDigitalProduct}
                                                    fullWidth
                                                >
                                                    {t("digtal_product_listing.create_new_digital_product")}
                                                </Button>
                                            </BlockStack>
                                        </div>
                                    ) : (
                                        <div style={{
                                            display: "flex",
                                            gap: "8px",
                                            justifyContent: "flex-end",
                                            marginTop: "16px"
                                        }}>
                                            {/* <Button
                                                variant="secondary"
                                                icon={ImportIcon}
                                                onClick={handleImportFromSendOwl}
                                            >
                                                {t("sendowl_import.import_from_sendOwl")}
                                            </Button> */}
                                            {/* <Button
                                                variant="secondary"
                                                icon={PlusIcon}
                                                onClick={handleUploadProductCSV}
                                            >
                                                {t("digtal_product_listing.upload_products_via_csv")}
                                            </Button> */}
                                            <Button
                                                variant="primary"
                                                icon={PlusIcon}
                                                onClick={handleCreateDigitalProduct}
                                            >
                                                {t("digtal_product_listing.create_new_digital_product")}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <ResourceList
                                    emptyState={emptStateMarkup}
                                    resourceName={{
                                        singular: t("digtal_product_listing.digital_product"),
                                        plural: t("digtal_product_listing.digital_productss"),
                                    }}
                                    items={digitalProducts}
                                    loading={false}
                                    showHeader
                                    renderItem={(item) => {
                                        return (
                                            <ResourceItem id={item.id}>
                                                <DigitalProductItem
                                                    digitalProduct={item}
                                                    isDeleting={isDeleting}
                                                    onDelete={(digitalProduct) => {
                                                        setDeleteType(1);
                                                        setProductToDelete(digitalProduct);
                                                        setIsConfirmDeleteModalActive(true);
                                                    }}
                                                    onEdit={(digitalProduct) =>
                                                        handleEditDigitalProduct(digitalProduct)
                                                    }
                                                    onDuplicate={openDuplicateModal}
                                                    navigate={navigate}
                                                    editUrl={getShopifyAdminUrl(`/editDigitalProduct/${item.id}`)}
                                                    setProductToDelete={setProductToDelete}
                                                    licenseTrackingEnabled={licenseTrackingEnabled}
                                                />
                                            </ResourceItem>
                                        );
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    <Pagination
                                        hasPrevious={currentPage > 1}
                                        onPrevious={() =>
                                            handlePaginationChange(
                                                currentPage - 1
                                            )
                                        }
                                        hasNext={
                                            digitalProducts.length ===
                                            productsPerPage &&
                                            totalProducts >
                                            currentPage * productsPerPage
                                        }
                                        onNext={() =>
                                            handlePaginationChange(
                                                currentPage + 1
                                            )
                                        }
                                        labels={{
                                            next: "Next",
                                            previous: "Previous",
                                        }}
                                        disabled={isLoadingData}
                                    />
                                </div>
                                <div
                                    style={{
                                        marginTop: "8px",
                                        textAlign: "center",
                                    }}
                                >
                                    <Text tone="subdued" variant="bodySm">
                                        {t("digtal_product_listing.showing")}{" "}
                                        {(currentPage - 1) * productsPerPage +
                                            1}
                                        –
                                        {Math.min(
                                            currentPage * productsPerPage,
                                            totalProducts
                                        )}{" "}
                                        {t("digtal_product_listing.of")}{" "}
                                        {totalProducts}{" "}
                                        {t("digtal_product_listing.products")}
                                    </Text>
                                </div>
                            </Card>
                            <Modal
                                open={active}
                                onClose={toggleActive}
                                title={t(
                                    "digtal_product_listing.upload_csv_products"
                                )}
                                primaryAction={{
                                    content: t("digtal_product_listing.save"),
                                    onAction: () =>
                                        handleSave(files, autoFulfill),
                                    loading: saving,
                                }}
                                secondaryActions={[
                                    {
                                        content: t(
                                            "digtal_product_listing.cancel"
                                        ),
                                        onAction: toggleActive,
                                    },
                                ]}
                            >
                                <Modal.Section>
                                    <BlockStack gap="400">
                                        <DropZone
                                            label={t(
                                                "digtal_product_listing.drag_and_drop_your_csv_files"
                                            )}
                                            accept="text/csv"
                                            onDrop={handleDropZoneDrop}
                                            allowMultiple={false}
                                        >
                                            <DropZone.FileUpload actionTitle={t("digtal_product_listing.add_files")} />
                                        </DropZone>

                                        {files.length > 0 && (
                                            <div>
                                                <Text
                                                    as={"p"}
                                                    variant={"bodyMd"}
                                                >
                                                    {t(
                                                        "digtal_product_listing.uploaded_file"
                                                    )}{" "}
                                                    {files[0].name}
                                                </Text>
                                            </div>
                                        )}

                                        <div style={{ marginTop: "10px" }}>
                                            <Text as={"p"} variant={"bodyMd"}>
                                                {t(
                                                    "digtal_product_listing.upload_a_csv_file_to_quickly_add_multiple_digital_products_to_digitally"
                                                )}{" "}
                                                <a
                                                    href="/digitally_upload_template.csv"
                                                    download
                                                >
                                                    {t(
                                                        "digtal_product_listing.download_the_csv_template_here"
                                                    )}
                                                </a>
                                                .
                                            </Text>
                                        </div>
                                    </BlockStack>
                                </Modal.Section>
                                <Modal.Section>
                                    <Checkbox
                                        checked={autoFulfill}
                                        label={t(
                                            "digtal_product_listing.auto_fulfill_this_product_on_shopify_orders"
                                        )}
                                        onChange={handleAutoFulfillCheckbox}
                                    />
                                    <div style={{ marginLeft: 25 }}>
                                        <Text as={"p"} variant={"bodyMd"}>
                                            {t(
                                                "createdigitalproduct.automatically_fulfill_the"
                                            )}
                                        </Text>
                                    </div>
                                </Modal.Section>
                            </Modal>

                            <Modal
                                open={isLimitExceededModalActive}
                                onClose={closeLimitExceededModal}
                                title="Limit Exceeded"
                                primaryAction={{
                                    content: t("digtal_product_listing.close"),
                                    onAction: closeLimitExceededModal,
                                }}
                            >
                                <Modal.Section>
                                    <LegacyStack vertical>
                                        <LegacyStack.Item>
                                            <Banner tone="warning">
                                                <Text variant="bodyMd" as="p">
                                                    {t(
                                                        "digtal_product_listing.you_have_reached_the_current_plan_limit_for_digital_products"
                                                    )}
                                                </Text>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                ></div>
                                                <Button
                                                    variant="primary"
                                                    onClick={handlePricing}
                                                >
                                                    {t(
                                                        "digtal_product_listing.upgrade_now"
                                                    )}
                                                </Button>
                                            </Banner>
                                        </LegacyStack.Item>
                                    </LegacyStack>
                                </Modal.Section>
                            </Modal>

                            <Modal
                                open={isConfirmDeleteModalActive}
                                onClose={() =>
                                    setIsConfirmDeleteModalActive(false)
                                }
                                title={t(
                                    "digtal_product_listing.confirm_delete"
                                )}
                                primaryAction={{
                                    destructive: true,
                                    disabled: isDeleting,
                                    content: t("digtal_product_listing.delete"),
                                    onAction: async () => {
                                        if (productToDelete) {
                                            await handleDeleteDigitalProduct(
                                                productToDelete
                                            );
                                            setProductToDelete(null);
                                        }
                                        setIsConfirmDeleteModalActive(false);
                                    },
                                }}
                            >
                                <Modal.Section>
                                    <Text variant="bodyMd" as="p">
                                        {t(
                                            "digtal_product_listing.are_you_sure_you_want_to_delete_this_digital_product"
                                        )}
                                    </Text>

                                    <BlockStack>
                                        <RadioButton
                                            label={t(
                                                "digtal_product_listing.only_digital_product"
                                            )}
                                            helpText={t(
                                                "digtal_product_listing.delete_digital_product_and_keep_content"
                                            )}
                                            checked={deleteType == 1}
                                            id="1"
                                            name="deleteType"
                                            onChange={() =>
                                                handleDeleteTypeChange(1)
                                            }
                                        />
                                        <RadioButton
                                            label={t(
                                                "digtal_product_listing.both_digital_product_and_content"
                                            )}
                                            helpText={t(
                                                "digtal_product_listing.delete_digital_product_and_content"
                                            )}
                                            checked={deleteType == 2}
                                            id="2"
                                            name="deleteType"
                                            onChange={() =>
                                                handleDeleteTypeChange(2)
                                            }
                                        />
                                    </BlockStack>
                                </Modal.Section>
                            </Modal>
                        </Layout.Section>
                    </Layout>
                )}
                    </div>
                </div>
                <div style={{ paddingBottom: "80px" }}></div>
            </Page>
        </>
    );
};

const DigitalProductItem = (props) => {
    const {
        digitalProduct,
        navigate,
        editUrl,
        setProductToDelete,
        isDeleting,
        licenseTrackingEnabled,
        onDuplicate,
    } = props;
    const productImage =
        digitalProduct.associatedProduct.images[0]?.originalSrc ??
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081";
    const shopify = useAppBridge();

    const [isLicenseModalActive, setIsLicenseModalActive] = useState(false);
    const [selectedLicenses, setSelectedLicenses] = useState([]);
    const [usedLicenses, setUsedLicenses] = useState([]);
    const [loadingUsedLicenses, setLoadingUsedLicenses] = useState(false);
    const [exportingLicenseId, setExportingLicenseId] = useState(null);
    const licensesPerPage = 10;
    const [licensePages, setLicensePages] = useState({});
    const [showFileModal, setShowFileModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showLicenseModal, setShowLicenseModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const { t } = useTranslation();

    // const fileRows = digitalProduct.attached_files.map(file => [file.fileName]);
    const fileRows = (digitalProduct.attached_files || []).map(file => [
        <PolarisLink url={file.url} key={file.url}>
            <Text
                variant="bodyMd"
                as="p"
                fontWeight="bold"
            >
                {file.fileName}
            </Text>
        </PolarisLink>
    ]);
    const customLinkRows = (digitalProduct?.custom_links || []).map(link => [link.title, link.redirect_url]);
    const licenseRows = (digitalProduct?.licenses || []).map(license => [license.title, license.license_type, license.codes_remaining]);
    const videoRows = (digitalProduct?.attached_videos || []).map(video => [video.title, video.provider]);

    //const handleEdit = () => props.navigate("/editDigitalProduct", { state: { id: digitalProduct.id } });
    const handleEdit = () =>
        props.navigate(`/editDigitalProduct/${digitalProduct.id}`);

    const totalRemainingCodes =
        digitalProduct?.licenses?.reduce((total, license) => {
            if (license.codes_remaining !== -1) {
                return total + license.codes_remaining;
            }
            return total;
        }, 0) ?? 0;

    const hasUnlimitedCodes =
        digitalProduct?.licenses?.some(
            (license) => license.codes_remaining === -1
        ) ?? false;

    let remainingKeysText;
    if (hasUnlimitedCodes) {
        remainingKeysText =
            totalRemainingCodes > 0
                ? `${totalRemainingCodes} ${t(
                    "digtal_product_listing.some_unlimited"
                )}`
                : t("digtal_product_listing.unlimited");
    } else {
        remainingKeysText = totalRemainingCodes;
    }

    const fetchUsedLicenses = async (digitalProductId) => {
        setLoadingUsedLicenses(true);
        try {
            const response = await fetch(
                `/api/get-used-licenses?digital_product_id=${digitalProductId}`
            );
            const data = await response.json();

            if (response.ok) {
                setUsedLicenses(data.used_licenses);
            } else {
                console.error(
                    "Failed to fetch used licenses:",
                    data?.error || "Unknown error"
                );
                setUsedLicenses([]);
            }
        } catch (error) {
            console.error("Error fetching used licenses:", error);
            setUsedLicenses([]);
        } finally {
            setLoadingUsedLicenses(false);
        }
    };

    const handlePageChange = (licenseId, direction) => {
        setLicensePages((prev) => {
            const currentPage = prev[licenseId] || 1;
            const nextPage =
                direction === "next"
                    ? currentPage + 1
                    : Math.max(1, currentPage - 1);
            return { ...prev, [licenseId]: nextPage };
        });
    };

    const exportUsedLicensesAsCSV = async (licenseId, digitalProductId) => {
        setExportingLicenseId(licenseId);

        try {
            const response = await fetch(
                `/api/export-used-licenses?license_id=${licenseId}&digital_product_id=${digitalProductId}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to export CSV");
            }

            const rows = data.used_licenses;

            if (rows.length === 0) {
                alert("No used licenses found to export.");
                return;
            }

            const csvHeader = ["License Key", "Order ID", "Customer Email"];
            const csvRows = rows.map((row) =>
                [row.license_key, row.order_id, row.customer_email].join(",")
            );
            const csvContent = [csvHeader.join(","), ...csvRows].join("\n");

            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `license_keys_used_${licenseId}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting CSV:", error);
            alert("Failed to export license data. Please try again.");
        } finally {
            setExportingLicenseId(null);
        }
    };

    return (


<InlineStack blockAlign="center" align="space-between">
            <InlineStack gap="400" blockAlign="center">
                <Thumbnail size="medium" source={productImage} />

                <BlockStack>
                    <InlineStack gap="400">
                        <Text variant="headingSm" as="h3" fontWeight="bold">
                            <PolarisLink
                                url={editUrl}
                                external
                                monochrome
                                rel="noopener noreferrer"
                            >
                                {digitalProduct.associatedProduct.title}
                            </PolarisLink>
                        </Text>
                        {digitalProduct.status === 1 ? (
                            <Badge tone="success">
                                {t("digtal_product_listing.active")}
                            </Badge>
                        ) : (
                            <Badge tone="warning">
                                {t("digtal_product_listing.draft")}
                            </Badge>
                        )}
                        {licenseTrackingEnabled &&
                            digitalProduct.content_type.includes("license") &&
                            digitalProduct.licenses &&
                            digitalProduct.licenses.length > 0 && (
                                <Badge tone="warning">
                                    {t(
                                        "digtal_product_listing.remaining_keys/codes"
                                    )}{" "}
                                    &nbsp;
                                    {remainingKeysText}
                                </Badge>
                            )}
                    </InlineStack>

                    <div>
                        {digitalProduct.associatedProduct.variants &&
                            digitalProduct.associatedProduct.variants.length > 0 ? (
                            digitalProduct.associatedProduct.variants.length ===
                                1 ? (
                                <Text variant="bodyMd" as="p">
                                    {
                                        digitalProduct.associatedProduct
                                            .variants[0].title
                                    }
                                </Text>
                            ) : (
                                <Text variant="bodyMd" as="p">
                                    {t("digtal_product_listing.all_variants")} (
                                    {
                                        digitalProduct.associatedProduct
                                            .variants.length
                                    }
                                    )
                                </Text>
                            )
                        ) : (
                            <Text variant="bodyLg" as="h6">
                                {t(
                                    "digtal_product_listing.no_variants_available"
                                )}
                            </Text>
                        )}
                    </div>



                    {digitalProduct.content_type.includes("files") && (
                        <div onClick={() => setShowFileModal(true)}>
                            <Text variant="bodyMd" as="p" color="subdued">
                                {digitalProduct.attached_files.length}{" "}
                                {digitalProduct.attached_files.length > 1
                                    ? t("digtal_product_listing.files")
                                    : t("digtal_product_listing.file")}
                                {digitalProduct.attached_files.length == 1
                                    ? ` - (${digitalProduct.attached_files[0].fileName})`
                                    : ''}
                            </Text>
                        </div>
                    )}

                    {digitalProduct.content_type.includes("videos") &&
                        digitalProduct.attached_videos.length > 0 && (
                            <div onClick={() => setShowVideoModal(true)}>
                                <Text variant="bodyMd" as="p" color="subdued">
                                    {digitalProduct.attached_videos.length}{" "}
                                    {digitalProduct.attached_videos.length === 1 ? t("digtal_product_listing.video") : t("digtal_product_listing.videos")}
                                </Text>
                            </div>
                        )}

                    {digitalProduct.content_type.includes("license") &&
                        digitalProduct.licenses &&
                        digitalProduct.licenses.length > 0 && (
                            <div onClick={() => { setShowLicenseModal(true) }}>
                                <Text variant="bodyMd" as="p" color="subdued">
                                    {digitalProduct.licenses.length}{" "}
                                    {digitalProduct.licenses.length > 1
                                        ? t("digtal_product_listing.licenses")
                                        : t("digtal_product_listing.license")}
                                </Text>
                            </div>
                        )}


                    {digitalProduct.content_type.includes("custom_link") &&
                        digitalProduct.custom_links &&
                        digitalProduct.custom_links.length > 0 && (
                            <div onClick={() => setShowLinkModal(true)}>
                                <Text variant="bodyMd" as="p" color="subdued">
                                    {digitalProduct.custom_links.length}{" "}
                                    {digitalProduct.custom_links.length > 1
                                        ? t("digtal_product_listing.custom_links")
                                        : t("digtal_product_listing.custom_link")}
                                </Text>
                            </div>
                        )}

                    {digitalProduct.content_type.includes("manual_delivery") && (
                        <div>
                            <Text variant="bodyMd" as="p" color="subdued">
                                {t("digtal_product_listing.manual_delivery")}
                            </Text>
                        </div>
                    )}

                    <Modal
                        open={showFileModal}
                        onClose={() => setShowFileModal(false)}
                        title={t("digtal_product_listing.files")}
                        secondaryActions={[
                            {
                                content: t("digtal_product_listing.ok"),
                                onAction: () => setShowFileModal(false),
                            },
                        ]}
                    >
                        <Modal.Section>
                            <TextContainer>
                                <DataTable
                                  columnContentTypes={[
                                    'text'
                                  ]}
                                  headings={[
                                    t("digtal_product_listing.filename")
                                  ]}
                                  rows={fileRows}
                                />
                            </TextContainer>
                        </Modal.Section>
                    </Modal>

                    <Modal
                        open={showLinkModal}
                        onClose={() => setShowLinkModal(false)}
                        title={t("digtal_product_listing.custom_links")}
                        secondaryActions={[
                            {
                                content: t("digtal_product_listing.ok"),
                                onAction: () => setShowLinkModal(false),
                            },
                        ]}
                    >
                        <Modal.Section>
                            <TextContainer>
                                <DataTable
                                  columnContentTypes={[
                                    'text'
                                  ]}
                                  headings={[
                                    t("digtal_product_listing.title"),
                                    t("digtal_product_listing.url")
                                  ]}
                                  rows={customLinkRows}
                                />
                            </TextContainer>
                        </Modal.Section>
                    </Modal>

                    <Modal
                        open={showLicenseModal}
                        onClose={() => setShowLicenseModal(false)}
                        title={t("digtal_product_listing.licenses")}
                        secondaryActions={[
                            {
                                content: t("digtal_product_listing.ok"),
                                onAction: () => setShowLicenseModal(false),
                            },
                        ]}
                    >
                        <Modal.Section>
                            <TextContainer>
                                <DataTable
                                    columnContentTypes={[
                                    'text'
                                  ]}
                                  headings={[
                                    t("digtal_product_listing.title"),
                                    t("digtal_product_listing.license_type"),
                                    t("digtal_product_listing.code_remaining")
                                  ]}
                                  rows={licenseRows}
                                />
                            </TextContainer>
                        </Modal.Section>
                    </Modal>

                    <Modal
                        open={showVideoModal}
                        onClose={() => setShowVideoModal(false)}
                        title="Videos"
                        secondaryActions={[
                            {
                                content: "OK",
                                onAction: () => setShowVideoModal(false),
                            },
                        ]}
                    >
                        <Modal.Section>
                            <TextContainer>
                                <DataTable
                                    columnContentTypes={[
                                        'text'
                                    ]}
                                    headings={[
                                        'TITLE',
                                        'PROVIDER'
                                    ]}
                                    rows={videoRows}
                                />
                            </TextContainer>
                        </Modal.Section>
                    </Modal>
                </BlockStack>
            </InlineStack>

            <ButtonGroup>
                {/* <Button
                    icon={EditIcon}
                    variant="secondary"
                    disabled={props.isDeleting}
                    loading={props.isDeleting}
                    onClick={() => props.onEdit(digitalProduct)}
                >
                    Edit
                </Button> */}
                <Button
                    variant="secondary"
                    icon={EditIcon}
                    onClick={handleEdit}
                    disabled={digitalProduct.is_disabled === 1}
                >
                    {t("digtal_product_listing.edit")}
                    {/* Edit */}
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => onDuplicate(digitalProduct)}
                    disabled={digitalProduct.is_disabled === 1}
                >
                    {t("digtal_product_listing.duplicate")}
                </Button>
                {licenseTrackingEnabled &&
                    digitalProduct.content_type.includes("license") &&
                    digitalProduct.licenses &&
                    digitalProduct.licenses.length > 0 && (
                        <Button
                            onClick={() => {
                                setSelectedLicenses(digitalProduct.licenses);
                                setIsLicenseModalActive(true);
                                fetchUsedLicenses(digitalProduct.id);
                            }}
                        >
                            {t("digtal_product_listing.keys_codes")}
                        </Button>
                    )}

                <Button
                    icon={DeleteIcon}
                    variant="primary"
                    tone="critical"
                    disabled={isDeleting || digitalProduct.is_disabled === 1}
                    loading={isDeleting}
                    onClick={() => {
                        setProductToDelete(digitalProduct);
                        props.onDelete(digitalProduct);
                    }}
                >
                    {t("digtal_product_listing.delete")}
                    {/* {t("digtal_product_listing.delete")} */}
                </Button>
            </ButtonGroup>

            <Modal
                open={isLicenseModalActive}
                onClose={() => setIsLicenseModalActive(false)}
                title={t("digtal_product_listing.license_details")}
                primaryAction={{
                    content: t("digtal_product_listing.close"),
                    onAction: () => setIsLicenseModalActive(false),
                }}
            >
                <Modal.Section>
                    {selectedLicenses.length > 0 ? (
                        selectedLicenses.map((license, index) => {
                            const filteredUsed = usedLicenses.filter(
                                (ul) => ul.license_id === license.id
                            );
                            const currentPage = licensePages[license.id] || 1;
                            const totalItems = filteredUsed.length;
                            const startIdx =
                                (currentPage - 1) * licensesPerPage;
                            const endIdx = startIdx + licensesPerPage;
                            const paginatedItems = filteredUsed.slice(
                                startIdx,
                                endIdx
                            );

                            return (
                                <div
                                    key={index}
                                    style={{ marginBottom: "10px" }}
                                >
                                    <InlineGrid columns="1fr auto">
                                        <Text variant="headingSm" as="h3">
                                            {t(
                                                "digtal_product_listing.license_title"
                                            )}
                                            : {license.title}
                                        </Text>
                                        <Text variant="bodyMd" as="p">
                                            {t(
                                                "digtal_product_listing.remaining_codes"
                                            )}
                                            :{" "}
                                            {license.codes_remaining === -1
                                                ? t(
                                                    "digtal_product_listing.unlimited"
                                                )
                                                : license.codes_remaining}
                                        </Text>
                                    </InlineGrid>

                                    <div style={{ marginTop: "20px" }}></div>
                                    <InlineGrid columns="1fr auto">
                                        <Text variant="headingSm" as="h3">
                                            {t(
                                                "digtal_product_listing.all_used_keys_codes"
                                            )}
                                        </Text>
                                        {!loadingUsedLicenses &&
                                            paginatedItems.length > 0 ? (
                                            <Button
                                                onClick={() =>
                                                    exportUsedLicensesAsCSV(
                                                        license.id,
                                                        digitalProduct.id
                                                    )
                                                }
                                                loading={
                                                    exportingLicenseId ===
                                                    license.id
                                                }
                                            >
                                                {t(
                                                    "digtal_product_listing.export_as_csv"
                                                )}
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                    </InlineGrid>

                                    <div style={{ marginTop: "10px" }}></div>
                                    {loadingUsedLicenses ? (
                                        <div style={{ marginTop: "10px" }}>
                                            <Spinner size="small" />
                                        </div>
                                    ) : (
                                        <>
                                            {paginatedItems.length > 0 ? (
                                                <div>
                                                    <IndexTable
                                                        selectable={false}
                                                        resourceName={{
                                                            singular: "license",
                                                            plural: "licenses",
                                                        }}
                                                        itemCount={
                                                            paginatedItems.length
                                                        }
                                                        headings={[
                                                            {
                                                                title: t(
                                                                    "digtal_product_listing.code_key"
                                                                ),
                                                            },
                                                            {
                                                                title: t(
                                                                    "digtal_product_listing.order_id"
                                                                ),
                                                            },
                                                            {
                                                                title: t(
                                                                    "digtal_product_listing.customer_email"
                                                                ),
                                                            },
                                                        ]}
                                                    >
                                                        {paginatedItems.map(
                                                            (ul, i) => (
                                                                <IndexTable.Row
                                                                    id={i.toString()}
                                                                    key={i}
                                                                >
                                                                    <IndexTable.Cell>
                                                                        {
                                                                            ul.license_key
                                                                        }
                                                                    </IndexTable.Cell>
                                                                    <IndexTable.Cell>
                                                                        {
                                                                            ul.order_id
                                                                        }
                                                                    </IndexTable.Cell>
                                                                    <IndexTable.Cell>
                                                                        {
                                                                            ul.customer_email
                                                                        }
                                                                    </IndexTable.Cell>
                                                                </IndexTable.Row>
                                                            )
                                                        )}
                                                    </IndexTable>

                                                    <div
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Pagination
                                                                hasPrevious={
                                                                    currentPage >
                                                                    1
                                                                }
                                                                onPrevious={() =>
                                                                    handlePageChange(
                                                                        license.id,
                                                                        "prev"
                                                                    )
                                                                }
                                                                hasNext={
                                                                    endIdx <
                                                                    totalItems
                                                                }
                                                                onNext={() =>
                                                                    handlePageChange(
                                                                        license.id,
                                                                        "next"
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <Text
                                                            variant="bodySm"
                                                            tone="subdued"
                                                            alignment="center"
                                                            as="p"
                                                        >
                                                            {t(
                                                                "digtal_product_listing.page"
                                                            )}{" "}
                                                            {currentPage}{" "}
                                                            {t(
                                                                "digtal_product_listing.of"
                                                            )}{" "}
                                                            {Math.ceil(
                                                                t(
                                                                    "digtal_product_listing.totalitems_licensesperpage"
                                                                )
                                                            )}
                                                        </Text>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Text
                                                    variant="bodyMd"
                                                    tone="subdued"
                                                >
                                                    {t(
                                                        "digtal_product_listing.no_used_licenses_found_for_this_license"
                                                    )}
                                                </Text>
                                            )}
                                        </>
                                    )}

                                    <Divider
                                        style={{
                                            marginTop: "10px",
                                            marginBottom: "10px",
                                        }}
                                        borderColor="border-inverse"
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <Text variant="bodyMd" as="p">
                            {t("digtal_product_listing.no_licenses_available")}
                        </Text>
                    )}
                </Modal.Section>
            </Modal>
        </InlineStack>


    );
};

export default DigitalProductsPage;
