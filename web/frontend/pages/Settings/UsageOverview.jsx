import React, { useEffect, useState, useContext } from "react";
import SettingSideBar from "../../components/SettingSideBar";
import {
    Card,
    Text,
    ProgressBar,
    BlockStack,
    InlineStack,
    Divider,
    SkeletonBodyText,
    InlineGrid,
    Link,
    Page,
    Layout,
    Select, SkeletonPage,Button
} from "@shopify/polaris";
// import {AppContext} from "../components/providers/AppProvider.jsx";
import { AppContext } from "../../components/providers/AppProvider";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LanguageSelector from "../../components/LanguageSelector";
import {useNavigate} from "react-router-dom";
const UsageOverview = () => {
    const navigate = useNavigate();
    const { store, refetchStore } = useContext(AppContext);
    const [planData, setPlanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation()


    const fetchData = async () => {
        try {
            setLoading(true);
            const plansResponse = await fetch("/api/current-plan");
            const data = await plansResponse.json();
            console.log(t("settings.usage_overview.fetched_planed_data"), data);
            setPlanData(data.plan);
        } catch (err) {
            setError(err.message);
            console.error(t("settings.usage_overview.error_fetching_data"), err.message);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     const currentPlanName = store.plan.name;
    //     if (currentPlanName) {
    //         refetchStore();
    //         fetchData();
    //     }
    // }, [store.plan.name, refetchStore]);

    useEffect(() => {
        fetchData();
    }, []);

    const handlePricing = () => navigate("/pricing", { replace: true });

    if (loading) {
        return (
            <Page
                title={t("settings.title")}
                primaryAction={
                    <LanguageSelector/>
                }
            >
                <Layout>
                    <Layout.Section variant="oneThird">
                        <Card>
                                                                           <SkeletonBodyText />
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card sectioned>
                            <SkeletonPage title={t("settings.usage_overview.title")}>
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
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    const {
        orders: ordersLimit,
        file_storage: fileStorageLimit,
        max_file_size: mbPerFileLimit,
        digital_products: digitalProductsLimit,
        // digital_lotteries: digitalLotteriesLimit,
    } = planData.limits || {};
    const {
        orders_per_month,
        file_storage_limit,
        per_file_limit,
        digital_products_limit,
        // digital_lotteries_limit,
    } = store;

    const isUnlimited = (limit) => limit === "unlimited" || limit === -1;

    const calculateUsage = (limit, remaining) => {
        if (isUnlimited(limit)) {
            return 0;
        }
        return limit - remaining;
    };

    const formatStorageSize = (bytes) => {
        if (bytes >= 1024 * 1024 * 1024) {
            return `${Math.floor(bytes / (1024 * 1024 * 1024))} GB`;
        } else if (bytes >= 1024 * 1024) {
            return `${Math.floor(bytes / (1024 * 1024))} MB`;
        } else if (bytes >= 1024) {
            return `${Math.floor(bytes / 1024)} KB`;
        } else {
            return `${bytes} bytes`;
        }
    };

    const fileStorageUsed = calculateUsage(
        fileStorageLimit,
        file_storage_limit
    );
    const fileStorageUsedFormatted = formatStorageSize(fileStorageUsed);
    const fileStorageLimitFormatted = isUnlimited(fileStorageLimit)
        ? t("settings.usage_overview.unlimited")
        : formatStorageSize(fileStorageLimit);

    const fileSizeUsed = calculateUsage(mbPerFileLimit, per_file_limit);
    const fileSizeUsedFormatted = formatStorageSize(fileSizeUsed);
    const fileSizeLimitFormatted = isUnlimited(mbPerFileLimit)
        ? t("settings.usage_overview.unlimited")
        : formatStorageSize(mbPerFileLimit);

    const renderProgressBar = (
        label,
        usage,
        limit,
        formattedUsage,
        formattedLimit
    ) => {
        const isLimitUnlimited = isUnlimited(limit);
        const isUsageUnlimited = isUnlimited(usage);

        if (isLimitUnlimited && isUsageUnlimited) {
            return (
                <>
                    <Text variant="headingSm" as="h6">
                        {label}
                    </Text>
                    <div style={{ marginTop: "5px" }}></div>

                    <InlineStack gap="300">
                        <div style={{ width: "12%" }}>
                            <Text variant="bodySm" as="p">
                                {t("settings.usage_overview.unlimited")}
                            </Text>
                        </div>
                        {/* <div style={{ width: "86%" }}>
                            <ProgressBar progress={0} />
                        </div> */}
                        <div style={{ width: "100%" }}>
                            <ProgressBar progress={0} />
                        </div>
                    </InlineStack>
                    <div style={{ marginTop: "20px" }}></div>
                    <Divider />
                </>
            );
        }

        if (isLimitUnlimited || isUsageUnlimited) {
            return (
                <>
                    <Text variant="headingSm" as="h6">
                        {label}
                    </Text>
                    <div style={{ marginTop: "5px" }}></div>

                    <InlineStack gap="300">
                        <div style={{ width: "12%" }}>
                            <Text variant="bodySm" as="p">
                                {t("settings.usage_overview.unlimited")}
                            </Text>
                        </div>
                        <div style={{ width: "100%" }}>
                            <ProgressBar progress={0} />
                        </div>
                    </InlineStack>
                    <div style={{ marginTop: "20px" }}></div>
                    <Divider />
                </>
            );
        }

        const progress = Math.min((usage / limit) * 100, 100);
        return (
            <>
                <Text variant="headingSm" as="h6">
                    {label}
                </Text>
                <div style={{ marginTop: "5px" }}></div>

                <InlineStack gap="300">
                    <div style={{ width: "12%" }}>
                        <Text variant="bodySm" as="p">
                            {formattedUsage} {t("settings.usage_overview.of")} {formattedLimit}
                        </Text>
                    </div>
                    <div style={{ width: "100%" }}>
                        <ProgressBar progress={progress} />
                    </div>
                </InlineStack>

                <div style={{ marginTop: "20px" }}></div>
                <Divider />
            </>
        );
    };

    const capitalize = (planName) => {
        return planName.charAt(0).toUpperCase() + planName.slice(1);
    };

    const getTranslatedPlanName = (planName) => {
        const translatedKey = `settings.usage_overview.plan_${planName}`;
        return t(translatedKey);
    };

    const formatDate = (dateString) => {
        const months = [
            t("settings.usage_overview.january"),
            t("settings.usage_overview.february"),
            t("settings.usage_overview.march"),
            t("settings.usage_overview.april"),
            t("settings.usage_overview.may"),
            t("settings.usage_overview.june"),
            t("settings.usage_overview.july"),
            t("settings.usage_overview.august"),
            t("settings.usage_overview.september"),
            t("settings.usage_overview.october"),
            t("settings.usage_overview.november"),
            t("settings.usage_overview.december"),
        ];

        // Extract year, month, and day from the string
        const [year, month, day] = dateString.split("T")[0].split("-");

        // Convert month to index (subtract 1 since Laravel months are 1-12)
        const monthName = months[parseInt(month) - 1];

        // Remove leading zero from day if present
        const dayWithoutLeading = parseInt(day).toString();

        return `${monthName} ${dayWithoutLeading}, ${year}`;
    };

    const ordersUsed = calculateUsage(ordersLimit, orders_per_month);
    const digitalProductsUsed = calculateUsage(
        digitalProductsLimit,
        digital_products_limit
    );
    // const digitalLotteriesUsed = calculateUsage(
    //     digitalLotteriesLimit,
    //     digital_lotteries_limit
    // );

    return (
        <div
            style={{
                marginBottom: "5px",
            }}
        >
            <Page
                title={t("settings.title")}
                primaryAction={
                   <LanguageSelector/>
                }
            >
                <Layout>
                    <Layout.Section variant="oneThird">
                        <Card>
                            <SettingSideBar />
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card sectioned>
                            <div>

                                {/* {!loading && ( */}

                                    <Page
                                        title={t("settings.usage_overview.title")}
                                        subtitle={
                                            store?.subscription?.plan
                                                ?.name &&
                                            store?.subscription
                                                ?.next_reset_date && (
                                                <Text
                                                    variant="bodySm"
                                                    as="p"
                                                    color="subdued"
                                                >
                                                    {getTranslatedPlanName(
                                                        store.subscription
                                                            .plan.name
                                                    )}{" "}
                                                    {t("settings.usage_overview.plan_until")}{" "}
                                                    {formatDate(
                                                        store.subscription
                                                            .next_reset_date
                                                    )}
                                                </Text>
                                            )
                                        }
                                        primaryAction={
                                            store?.subscription?.plan
                                                ?.name === "unlimited" &&
                                                store?.subscription?.status ===
                                                "active" ? (
                                                <div
                                                    onClick={handlePricing}
                                                >
                                                   <Button variant="primary"> {t("settings.usage_overview.go_to_plans")}</Button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={handlePricing}
                                                >
                                                     <Button variant="primary"> {t("settings.usage_overview.upgrade_plan")}</Button>
                                                </div>
                                            )
                                        }
                                    >
                                        {/* <InlineGrid columns="1fr auto"> */}
                                        {/* <div>
                                    <Text variant="headingLg" as="h5">
                                        Usage Overview
                                    </Text>
                                    {store?.subscription?.plan?.name &&
                                        store?.subscription
                                            ?.next_reset_date && (
                                            <Text
                                                variant="bodySm"
                                                as="p"
                                                color="subdued"
                                            >
                                                {capitalize(
                                                    store.subscription.plan.name
                                                )}{" "}
                                                Plan - until{" "}
                                                {formatDate(
                                                    store.subscription
                                                        .next_reset_date
                                                )}
                                            </Text>
                                        )}
                                </div> */}

                                        {/* {store?.subscription?.plan?.name ===
                                    "unlimited" &&
                                store?.subscription?.status === "active" ? (
                                    <div onClick={handlePricing}>
                                        <Link url="#">Go To Plans</Link>
                                    </div>
                                ) : (
                                    <div onClick={handlePricing}>
                                        <Link url="#">Upgrade Plan</Link>
                                    </div>
                                )} */}
                                        {/* </InlineGrid> */}

                                        {/* <div style={{ marginTop: "25px" }}></div> */}
                                        <Text as={"p"}>
                                            {t("settings.usage_overview.track_your_app_usage")}
                                        </Text>

                                        <div
                                            style={{ marginTop: "20px" }}
                                        ></div>

                                        <div
                                            style={{
                                                width: "full",
                                            }}
                                        >
                                            <BlockStack>
                                                {renderProgressBar(
                                                    t("settings.usage_overview.orders_per_month"),
                                                    ordersUsed,
                                                    ordersLimit,
                                                    ordersUsed,
                                                    ordersLimit
                                                )}
                                                {renderProgressBar(
                                                    t("settings.usage_overview.digital_products"),
                                                    digitalProductsUsed,
                                                    digitalProductsLimit,
                                                    digitalProductsUsed,
                                                    digitalProductsLimit
                                                )}
                                                {/* {renderProgressBar(
                                                    t("settings.usage_overview.digital_lotteries"),
                                                    digitalLotteriesUsed,
                                                    digitalLotteriesLimit,
                                                    digitalLotteriesUsed,
                                                    digitalLotteriesLimit
                                                )} */}
                                                {renderProgressBar(
                                                    t("settings.usage_overview.storage"),
                                                    fileStorageUsed,
                                                    fileStorageLimit,
                                                    fileStorageUsedFormatted,
                                                    fileStorageLimitFormatted
                                                )}
                                                {/*{renderProgressBar('File Size Limit', fileSizeUsed, mbPerFileLimit, fileSizeUsedFormatted, fileSizeLimitFormatted)}*/}
                                            </BlockStack>
                                        </div>
                                    </Page>

                                {/* )} */}
                            </div>
                        </Card>
                        <div
            style={{
                marginBottom: "16px",
            }}
        ></div>
                    </Layout.Section>
                </Layout>
            </Page>
        </div>
    );
};

export default UsageOverview;
