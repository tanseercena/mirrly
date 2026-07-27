import React, { useState, useEffect } from "react";
import {
    InlineStack,
    Text,
    Tabs,
        SkeletonPage,
    Layout,
    Card,
    BlockStack,
    Banner,
    SkeletonBodyText,
    Modal,
    useIndexResourceState,
    IndexTable,
    LegacyCard,
    Checkbox,
    Select,
    Page,
} from "@shopify/polaris";
import PricingCard from "./PricingCard";
import { AppContext } from "../components/providers/AppProvider.jsx";
import {useAppBridge} from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { useNavigate } from "react-router-dom";
import { isCardDismissed, dismissCard } from "../utils/sessionStorage.js";
const Pricing = () => {
    // Inject responsive CSS
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
           
            @media (max-width: 768px) {
                .pricing-page-container {
                    padding-left: 0px;
                    padding-right: 0px;
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const DIGITAL_PRODUCTS_API = "/api/get-digital-products";
    const DIGITAL_LOTTERIES_API = "/api/get-digital-lotteries";
    const { store, refetchStore } = React.useContext(AppContext);
    const navigate = useNavigate();
    const shopify = useAppBridge();
        const app = useAppBridge();
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [subscription, setSubscription] = useState(null);
        const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isBillingInProgress, setIsBillingInProgress] = useState(false);
    const [installationDate, setInstallationDate] = useState(null);
    const [digitalProducts, setDigitalProducts] = useState([]);
    const [digitalLotteries, setDigitalLotteries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tabSelected, setTabSelected] = useState(0);
    const [selectedTabId, setSelectedTabId] = useState("digital_products");
    const [selectAllForLottery, setSelectAllForLottery] = useState(false);
    const [selectedLotteryIds, setSelectedLotteryIds] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [selectAllForProducts, setSelectAllForProducts] = useState(false);
    const [downgradeMessage, setDowngradeMessage] = useState(null);
    const [showDiscountBanner, setShowDiscountBanner] = useState(!isCardDismissed('plans_discount_card'));
    const { t } = useTranslation();

    const handleDismissBanner = () => {
        setShowDiscountBanner(false);
        dismissCard('plans_discount_card');
    };

    const [mainTabs, setMainTabs] = useState([
        {
            id: "digital_products",
            content: t("plans.digital_products_uppercase_first_letter"),
            panelID: "digital_products",
        },
        {
            id: "digital_lotteries",
            content: t("plans.digital_lotteries"),
            panelID: "digital_lotteries_uppercase_first_letter",
        },
    ]);

    useEffect(() => {
        fetchSubscriptions();
        fetchPlans();
    }, []);

    useEffect(() => {
        if (store.finish_onboarding === 0) {
            refetchStore();
        }
    }, [refetchStore, store.finish_onboarding]);

    useEffect(() => {
        shopify.loading(isLoadingData);
    }, [isLoadingData, shopify]);
    const fetchSubscriptions = async () => {
        try {
            const response = await fetch("/api/subscription");
            if (!response.ok) {
                throw new Error(`${t("plans.failed_to_fetch_subscriptions")}`);
            }
            const data = await response.json();
            setSubscription(data.data.subscription);

            const createdAt = store?.created_at;
            setInstallationDate(createdAt);

            if (data.data.subscription && data.data.subscription.interval) {
                setSelectedTabIndex(
                    data.data.subscription.interval === "monthly" ? 0 : 1
                );
            }
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            shopify.toast.show(`${t("plans.error_fetching_subscriptions")}`);
            setIsErrorToast(true);
            setShowToast(true);
        } finally {
            setIsLoadingData(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const response = await fetch("/api/plans");
            if (!response.ok) {
                throw new Error(`${t("plans.failed_to_fetch_plans")}`);
            }
            const data = await response.json();
            setPlans(data.data);
        } catch (error) {
            console.error("Error fetching plans:", error);
            shopify.toast.show(`${t("plans.error_fetching_plans")}`, { isError: true, duration: 9999999 });
        } finally {
            setIsLoadingData(false);
        }
    };

    // const handleTabChange = (index) => {
    //     const selectedId = mainTabs[index].id; // Assuming each tab has an `id`
    //     setTabSelected(index);
    //     setSelectedTabId(selectedId); // Set the selected tab ID dynamically
    // };

    const handleTabChange = (index) => {
        setSelectedTabIndex(index);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [digitalProductsRes, digitalLotteriesRes] =
                    await Promise.all([
                        fetch(DIGITAL_PRODUCTS_API),
                        fetch(DIGITAL_LOTTERIES_API),
                    ]);

                if (digitalProductsRes.ok) {
                    const productsData = await digitalProductsRes.json();
                    console.log("Digital Products:", productsData.data);
                    setDigitalProducts(productsData.data);
                }

                if (digitalLotteriesRes.ok) {
                    const lotteriesData = await digitalLotteriesRes.json();
                    setDigitalLotteries(lotteriesData.data);
                }
            } catch (error) {
                shopify.toast.show(`${t("plans.error_fetching_data")}`, { isError: true, duration: 9999999 });
            }
        };

        fetchData();
    }, []);

    const totalDigitalProducts = digitalProducts.length;
    const totalDigitalLotteries = digitalLotteries.length;

    // Toggle Select All for Products
    const handleSelectAllForProducts = () => {
        if (selectAllForProducts) {
            // Deselect all products
            setSelectedProductIds([]);
            setSelectAllForProducts(false);
        } else {
            // Select only up to the allowed limit
            const limit = selectedPlan.limits.digital_products;
            const productIdsToSelect = digitalProducts
                .map((product) => product.id)
                .slice(0, limit); // Ensure we respect the limit
            setSelectedProductIds(productIdsToSelect);
            setSelectAllForProducts(true);
        }
    };

    // Toggle individual product selection
    const handleToggleProductSelection = (productId) => {
        // Check if the product is already selected
        const isSelected = selectedProductIds.includes(productId);

        if (isSelected) {
            // Deselect the product
            setSelectedProductIds((prevSelected) =>
                prevSelected.filter((id) => id !== productId)
            );
        } else {
            // Add the product only if within the allowed limit
            if (
                selectedProductIds.length < selectedPlan.limits.digital_products
            ) {
                setSelectedProductIds((prevSelected) => [
                    ...prevSelected,
                    productId,
                ]);
            } else {
                shopify.toast.show(
                    `${t("plans.you_can_select")} ${
                        selectedPlan.limits.digital_products
                    } ${t("plans.digital_products")}`
                , { isError: true, duration: 9999999 });
            }
        }
    };

    const handleSelectAllForLottery = () => {
        const allowedLimit = selectedPlan.limits.digital_lotteries;
        const allLotteryIds = digitalLotteries.map((lottery) => lottery.id);

        if (selectAllForLottery) {
            // Deselect all if currently all are selected
            setSelectedLotteryIds([]);
            setSelectAllForLottery(false);
        } else {
            // Select up to the allowed limit
            const limitedSelection = allLotteryIds.slice(0, allowedLimit);
            setSelectedLotteryIds(limitedSelection);
            setSelectAllForLottery(
                limitedSelection.length === allLotteryIds.length
            );
        }
    };

    const handleToggleLotterySelection = (lotteryId) => {
        const allowedLimit = selectedPlan.limits.digital_lotteries;
        const newSelectedLotteryIds = [...selectedLotteryIds];

        if (newSelectedLotteryIds.includes(lotteryId)) {
            // Remove the lottery from the selected list
            const index = newSelectedLotteryIds.indexOf(lotteryId);
            newSelectedLotteryIds.splice(index, 1);
        } else {
            // Add the lottery if the limit is not exceeded
            if (newSelectedLotteryIds.length < allowedLimit) {
                newSelectedLotteryIds.push(lotteryId);
            } else {
                shopify.toast.show(
                    `${t("plans.you_can_select")} ${
                        selectedPlan.limits.digital_lotteries
                    } ${t("plans.digital_lotteries")}`
                , { isError: true, duration: 9999999 });
            }
        }

        setSelectedLotteryIds(newSelectedLotteryIds);
        setSelectAllForLottery(
            newSelectedLotteryIds.length === digitalLotteries.length
        );
        console.log(
            "Selected Lotteries:",
            newSelectedLotteryIds.map((id) =>
                digitalLotteries.find((lottery) => lottery.id === id)
            )
        );
    };

    const isSelectionValid = () => {
        let validProducts = true; // Default to true if products are not relevant
        let validLotteries = true; // Default to true if lotteries are not relevant

        if (totalDigitalProducts > selectedPlan.limits.digital_products) {
            validProducts =
                selectedProductIds.length ===
                selectedPlan.limits.digital_products;
        }

        if (totalDigitalLotteries > selectedPlan.limits.digital_lotteries) {
            validLotteries =
                selectedLotteryIds.length ===
                selectedPlan.limits.digital_lotteries;
        }

        return validProducts && validLotteries;
    };

    const handleProceedWithChanges = async () => {
        setIsBillingInProgress(true);
        const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
        const selectedProductsToKeepEnabled = digitalProducts.filter(
            (product) => selectedProductIds.includes(product.id)
        );
        const selectedLotteriesToKeepEnabled = digitalLotteries.filter(
            (lottery) => selectedLotteryIds.includes(lottery.id)
        );

        const payload = {
            productIds: selectedProductsToKeepEnabled.map(
                (product) => product.id
            ),
            lotteryIds: selectedLotteriesToKeepEnabled.map(
                (lottery) => lottery.id
            ),
        };

        try {
            if (
                payload.productIds.length > 0 ||
                payload.lotteryIds.length > 0
            ) {
                const response = await fetch(
                    "/api/digital-products-lotteries/disabled",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `${t("plans.failed_to_disable_selected_items")}`
                    );
                }

                const data = await response.json();
                console.log(data);
            }

            const isOverLimit =
                digitalProducts.filter(
                    (product) =>
                        selectedResources.includes(product.id) &&
                        product.is_disabled === 0
                ).length >= selectedPlan.limits.digital_products ||
                digitalLotteries.filter(
                    (lottery) =>
                        selectedLotteryIds.includes(lottery.id) &&
                        lottery.is_disabled === 0
                ).length >= selectedPlan.limits.digital_lotteries;

            if (isOverLimit) {
                let isFreePlan = selectedPlan.id === 1;

                try {
                    isFreePlan = false;
                    if (isFreePlan) {
                        const response = await fetch("/api/billing/free", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                storeId: store.id,
                                planId: selectedPlan.id,
                            }),
                        });

                        if (!response.ok) {
                            throw new Error(
                                `${t(
                                    "plans.failed_error_to_create_free_subscription"
                                )}`
                            );
                        }

                        shopify.toast.show(
                            `${t("plans.free_plan_switch_notify")}`
                        );

                        setTimeout(() => {
                            navigate("/");
                        }, 1000);
                    } else {
                        const response = await fetch("/api/billing", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id: selectedPlan.id,
                                interval:
                                    selectedTabIndex === 0
                                        ? "monthly"
                                        : "yearly",
                            }),
                        });

                        if (!response.ok) {
                            throw new Error(`${t("plans.billing_initiation")}`);
                        }

                        const data = await response.json();
                        if (data.confirmationUrl) {
                            open(data.confirmationUrl, '_top');
                            //window.location.href = data.confirmationUrl;
                            fetchSubscriptions();
                            fetchPlans();
                        }
                    }
                } catch (error) {
                    // console.error('Error initiating billing:', error);
                    // shopify.toast.("Error initiating billing");
                    // setIsErrorToast(true);
                    // setShowToast(true);
                } finally {
                    setIsBillingInProgress(false);
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error(`${t("plans.error_disabling_selected")}`, error);
        }
    };

    const generateDowngradeMessage = (exceededItems) => {
        const messages = [];

        exceededItems.forEach((item) => {
            const { type, total, limit } = item;
            const exceededCount = total - limit;

            if (exceededCount > 0) {
                messages.push(
                    `${t("plans.you_currently")} ${total} ${type}${t(
                        "plans.,_but_your"
                    )} ${limit}${t("._you_need")} ${exceededCount} ${t(
                        "plans.to_stay_within"
                    )}`
                );
            }
        });

        if (messages.length > 0) {
            return `${t("plans.to_proceed_with")} \n\n${messages.join("\n")}`;
        }

        return "";
    };

    const initiateBilling = async (planId, interval) => {
        const currentPlan = store.plan;
        const selected_Plan = plans.find((plan) => plan.id === planId);
        setSelectedPlanId(planId);
        setSelectedPlan(selected_Plan);

        const isDowngrade = currentPlan.id > selected_Plan.id;
        const isUpgrade = currentPlan.id < selected_Plan.id;

        // if (isDowngrade) {
        //     const exceededDigitalProducts = totalDigitalProducts > selectedPlan.limits.digital_products;
        //     const exceededDigitalLotteries = totalDigitalLotteries > selectedPlan.limits.digital_lotteries;
        //
        //     if (exceededDigitalProducts || exceededDigitalLotteries) {
        //         setIsModalOpen(true);
        //
        //         let message = '';
        //         if (exceededDigitalProducts && exceededDigitalLotteries) {
        //             message += ` You need to select which items you would like to keep below the limits. You can keep ${selectedPlan.limits.digital_products} digital products, but ${totalDigitalProducts - selectedPlan.limits.digital_products} will need to be disabled. You can keep ${selectedPlan.limits.digital_lotteries} digital lotteries, but ${totalDigitalLotteries - selectedPlan.limits.digital_lotteries} will need to be disabled.`;
        //         } else if (exceededDigitalProducts) {
        //             message += ` You need to select which items you would like to keep. You can keep ${selectedPlan.limits.digital_products} digital products, but ${totalDigitalProducts - selectedPlan.limits.digital_products} will need to be disabled.`;
        //         } else if (exceededDigitalLotteries) {
        //             message += ` You need to select which items you would like to keep. You can keep ${selectedPlan.limits.digital_lotteries} digital lotteries, but ${totalDigitalLotteries - selectedPlan.limits.digital_lotteries} will need to be disabled.`;
        //         }
        //
        //         if (exceededDigitalProducts && exceededDigitalLotteries) {
        //             setMainTabs([
        //                 { id: 'digital_products', content: 'Digital Products', panelID: 'digital_products' },
        //                 { id: 'digital_lotteries', content: 'Digital Lotteries', panelID: 'digital_lotteries' }
        //             ]);
        //         } else if (exceededDigitalProducts) {
        //             setMainTabs([
        //                 { id: 'digital_products', content: 'Digital Products', panelID: 'digital_products' }
        //             ]);
        //         } else if (exceededDigitalLotteries) {
        //             setMainTabs([
        //                 { id: 'digital_lotteries', content: 'Digital Lotteries', panelID: 'digital_lotteries' }
        //             ]);
        //         }
        //         setTabSelected(mainTabs[0]?.id || ''); // Default to the first tab ID
        //
        //         setDowngradeMessage(message);
        //         return;
        //     }
        // }

        if (isDowngrade) {
            const exceededItems = [];

            // Check limits dynamically for digital products
            if (totalDigitalProducts > selected_Plan.limits.digital_products) {
                exceededItems.push({
                    type: "digital products",
                    total: totalDigitalProducts,
                    limit: selected_Plan.limits.digital_products,
                });
            }

            // Check limits dynamically for digital lotteries
            if (
                totalDigitalLotteries > selected_Plan.limits.digital_lotteries
            ) {
                exceededItems.push({
                    type: "digital lotteries",
                    total: totalDigitalLotteries,
                    limit: selected_Plan.limits.digital_lotteries,
                });
            }

            // You can add more checks here for other product types in the future, for example:
            // if (totalEvents > selectedPlan.limits.events) { ... }

            // If there are exceeded limits, show the modal with a message
            if (exceededItems.length > 0) {
                setIsModalOpen(true);
                const message = generateDowngradeMessage(exceededItems);

                // Dynamically build tabs based on exceeded items
                const tabs = exceededItems.map((item) => ({
                    id: item.type.replace(/\s+/g, "_"), // Generate a unique ID based on the item type
                    content: item.type.replace(/^\w/, (c) => c.toUpperCase()), // Capitalize the first letter of the type
                    panelID: item.type.replace(/\s+/g, "_"), // Panel ID (same as tab ID)
                }));

                setMainTabs(tabs); // Update the tabs state
                setTabSelected(0); // Set the first tab as selected by default
                setSelectedTabId(exceededItems[0].type.replace(/\s+/g, "_"));

                setDowngradeMessage(message); // Set the downgrade message
                return;
            }
        }

        setIsBillingInProgress(true);

        if (isUpgrade) {
            await fetch("/api/plans/upgrade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ storeId: store.id }),
            });
        }

        let isFreePlan = planId === 1;

        try {
            isFreePlan = false;
            if (isFreePlan) {
                const response = await fetch("/api/billing/free", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ storeId: store.id, planId }),
                });

                if (!response.ok) {
                    throw new Error(
                        `${t("plans.failed_error_to_create_free_subscription")}`
                    );
                }

                shopify.toast.show(`${t("plans.free_plan_switch_notify")}`);

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                const response = await fetch("/api/billing", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: planId, interval }),
                });

                if (!response.ok) {
                    throw new Error(`${t("plans.billing_initiation")}`);
                }

                const data = await response.json();
                if (data.confirmationUrl) {
                    open(data.confirmationUrl, '_top');

                    fetchSubscriptions();
                    fetchPlans();
                }
            }
        } catch (error) {
            // console.error('Error initiating billing:', error);
            // shopify.toast.("Error initiating billing");
            // setIsErrorToast(true);
            // setShowToast(true);
        } finally {
            setIsBillingInProgress(false);
        }
    };

    const handleMainTabChange = (selectedTabIndex) => {
        setTabSelected(selectedTabIndex);
    };

    const resourceName = {
        singular: "digitalProduct",
        plural: "digitalProducts",
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(digitalProducts);

    const rowMarkup = digitalProducts.map(({ id, associatedProduct }) => {
        return (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
            >
                <IndexTable.Cell>{id}</IndexTable.Cell>
                <IndexTable.Cell>
                    {associatedProduct
                        ? associatedProduct.title
                        : t("plans.product_not_available")}
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    });

    const getContentForTab = (selectedTabId) => {
        const contentMapping = {
            digital_products: (
                <>
                    <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "left",
                                        padding: "0.5rem",
                                        borderBottom: "2px solid #ddd",
                                    }}
                                >
                                    <Checkbox
                                        checked={selectAllForProducts}
                                        onChange={() =>
                                            handleSelectAllForProducts()
                                        }
                                    />
                                </th>
                                <th
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "left",
                                        padding: "0.5rem",
                                        borderBottom: "2px solid #ddd",
                                    }}
                                >
                                    Id
                                </th>
                                <th
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "left",
                                        padding: "0.5rem",
                                        borderBottom: "2px solid #ddd",
                                    }}
                                >
                                    Products
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {digitalProducts.map((product) => (
                                <tr key={product.id}>
                                    <td
                                        style={{
                                            padding: "0.5rem",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedProductIds.includes(
                                                product.id
                                            )}
                                            onChange={() => {
                                                if (
                                                    selectedProductIds.length >=
                                                        selectedPlan.limits
                                                            .digital_products &&
                                                    !selectedProductIds.includes(
                                                        product.id
                                                    )
                                                ) {
                                                    shopify.toast.show(
                                                        `${t(
                                                            "plans.you_can_select"
                                                        )} ${
                                                            selectedPlan.limits
                                                                .digital_products
                                                        } ${t(
                                                            "plans.digital_products"
                                                        )}`
                                                    ,{ isError: true, duration: 9999999 });
                                                    return;
                                                }
                                                handleToggleProductSelection(
                                                    product.id
                                                );
                                            }}
                                        />
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.5rem",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {product.id}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.5rem",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {product.associatedProduct.title}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: "10px" }}>
                        {selectedProductIds.length > 0 && (
                            <Text variant="headingMd" as="h6">
                                {selectedProductIds.length}{" "}
                                {t("plans.selected")}
                            </Text>
                        )}
                    </div>
                </>
            ),
            digital_lotteries: (
                <>
                    <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "left",
                                        padding: "0.5rem",
                                        borderBottom: "2px solid #ddd",
                                    }}
                                >
                                    <Checkbox
                                        checked={selectAllForLottery}
                                        onChange={() =>
                                            handleSelectAllForLottery()
                                        }
                                    />
                                </th>
                                <th
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "left",
                                        padding: "0.5rem",
                                        borderBottom: "2px solid #ddd",
                                    }}
                                >
                                    {t("plans.id")}
                                </th>
                                <th
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "left",
                                        padding: "0.5rem",
                                        borderBottom: "2px solid #ddd",
                                    }}
                                >
                                    {t("plans.lotteries")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {digitalLotteries.map((lottery) => (
                                <tr key={lottery.id}>
                                    <td
                                        style={{
                                            padding: "0.5rem",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedLotteryIds.includes(
                                                lottery.id
                                            )}
                                            onChange={() => {
                                                if (
                                                    selectedLotteryIds.length >=
                                                        selectedPlan.limits
                                                            .digital_lotteries &&
                                                    !selectedLotteryIds.includes(
                                                        lottery.id
                                                    )
                                                ) {
                                                    shopify.toast.show(
                                                        `${t(
                                                            "plans.you_can_select"
                                                        )} ${
                                                            selectedPlan.limits
                                                                .digital_lotteries
                                                        } ${t(
                                                            "plans.digital_lotteries"
                                                        )}`
                                                    ,{ isError: true, duration: 9999999 });
                                                    return;
                                                }
                                                handleToggleLotterySelection(
                                                    lottery.id
                                                );
                                            }}
                                        />
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.5rem",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {lottery.id}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.5rem",
                                            textAlign: "left",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {lottery.product
                                            ? lottery.product.title
                                            : t("plans.lottery_not_available")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: "10px" }}>
                        {selectedLotteryIds.length > 0 && (
                            <Text variant="headingMd" as="h6">
                                {selectedLotteryIds.length}{" "}
                                {t("plans.selected")}
                            </Text>
                        )}
                    </div>
                </>
            ),
        };

        // Return the mapped content based on the selected tab ID
        return (
            contentMapping[selectedTabId] || (
                <Text variant="bodyLg" as="p">
                    {t("plans.no_content_available")}
                </Text>
            )
        );
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const tabs = [
        { id: "monthly", content: t("plans.monthly.title") },
        { id: "yearly", content: t("plans.yearly_20%") },
    ];

    const loadingMarkup = isLoadingData && (
        <SkeletonPage title={t("plans.loading_pricing")} primaryAction>
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="300">
                            <SkeletonBodyText />
                            <SkeletonBodyText />
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    return (
        <>
            {loadingMarkup}
            {!isLoadingData && plans && plans.length > 0 && (
                <div>
                <Page
                    title={
                        <Text variant="heading2xl" as="h3">
                            {t("plans.title")}
                        </Text>
                    }
                    subtitle={
                        <Text variant="headingLg" as="h5">
                            {t("plans.sub_title")}
                        </Text>
                    }
                    primaryAction={<LanguageSelector />}
                    fullWidth
                >
                    <div style={{ paddingBottom: '80px' }}>
                        {showDiscountBanner && subscription && subscription.interval !== 'yearly' && (
                            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
                                <div style={{ width: "100%" }}>
                                    <Banner
                                        title={t("plans.lifetime_20%")}
                                        tone="info"
                                        onDismiss={handleDismissBanner}
                                    >
                                        <p>
                                            {t("plans.upgrade_to_a_yearly")}{" "}
                                            <strong>20%</strong>{" "}
                                            {t("plans.off_for_life")}
                                        </p>
                                    </Banner>
                                </div>
                            </div>
                        )}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                padding: "0 20px",
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: "330px",
                                }}
                            >
                                {" "}
                                {/* Constrain max width */}
                                <BlockStack>
                                    <Tabs
                                        tabs={tabs}
                                        selected={selectedTabIndex}
                                        fitted
                                        onSelect={handleTabChange}
                                    ></Tabs>
                                </BlockStack>
                            </div>
                        </div>

                        <Layout>
                            <Layout.Section>
                                {/* <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Tabs
                                        tabs={tabs}
                                        selected={selectedTabIndex}
                                        fitted
                                        onSelect={handleTabChange}
                                    ></Tabs>
                                </div> */}
                            </Layout.Section>
                        </Layout>

                        <div style={{ marginTop: "15px" }}>
                            <InlineStack
                                align="center"
                                gap={600}
                                blockAlign="start"
                            >
                                {plans.map((plan, index) => (
                                    <PricingCard
                                        key={index}
                                        id={plan.id}
                                        title={plan.name}
                                        features={plan.features}
                                        price={
                                            selectedTabIndex === 0
                                                ? `$${plan.monthly_charge}`
                                                : `$${plan.yearly_charge}`
                                        }
                                        frequency={
                                            selectedTabIndex === 0
                                                ? "month"
                                                : "year"
                                        }
                                        button={{
                                            content: t(
                                                "plans.monthly.free.choose_plan"
                                            ),
                                            props: {
                                                variant: "primary",
                                                onClick: () =>
                                                    initiateBilling(
                                                        plan.id,
                                                        selectedTabIndex === 0
                                                            ? "monthly"
                                                            : "yearly"
                                                    ),
                                            },
                                        }}
                                        subscription={subscription}
                                        isBillingInProgress={isBillingInProgress}
                                        installationDate={installationDate}
                                        planSelected={plan.plan_selected}
                                    />
                                ))}
                            </InlineStack>
                        </div>

                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "30px",
                                marginBottom: "10px",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <p>
                                <strong>{t("plans.existing_discount")}</strong>{" "}
                                {t("plans.existing_discount_desc")}
                            </p>
                        </div>

                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "10px",
                                marginBottom: "30px",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <p>
                                <strong>{t("plans.usage_based_charges")} </strong>
                                {t("plans.usage_based_charges_desc")}
                            </p>
                        </div>
                    </div>
                </Page>
            </div>
            )}
            {isModalOpen && (
                <Modal
                    open={isModalOpen}
                    onClose={isBillingInProgress ? null : closeModal}
                    title={t("plans.limit_exceeded")}
                    primaryAction={{
                        content: isBillingInProgress
                            ? t("plans.processing")
                            : t("plans.proceed_with_changes"),
                        onAction: handleProceedWithChanges,
                        disabled: isBillingInProgress || !isSelectionValid(),
                    }}
                    secondaryActions={[
                        {
                            content: t("plans.cancel"),
                            onAction: closeModal,
                            disabled: isBillingInProgress,
                        },
                    ]}
                >
                    <Modal.Section>
                        {downgradeMessage && (
                            <Text variant="bodySm" as="p" color="warning">
                                {downgradeMessage}
                            </Text>
                        )}
                        <div style={{ marginTop: "10px" }}></div>
                        <Tabs
                            tabs={mainTabs}
                            selected={tabSelected}
                            onSelect={(index) => {
                                const selectedTabId = mainTabs[index].id; // Get the tab ID
                                setTabSelected(index);
                                setSelectedTabId(selectedTabId); // Ensure that the tab ID is passed to the function
                            }}
                        >
                            <Card sectioned>
                                {getContentForTab(selectedTabId)}{" "}
                                {/* Pass selectedTabId here */}
                            </Card>
                        </Tabs>
                    </Modal.Section>
                </Modal>
            )}
        </>
    );
};

export default Pricing;
