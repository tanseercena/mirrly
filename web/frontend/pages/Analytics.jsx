
import {
    Page,
    Layout,
    Card,
    DataTable,
    Text,
    TextContainer,
    InlineStack,
    SkeletonPage,
    SkeletonBodyText,
    BlockStack,
    Pagination,
    Select
} from '@shopify/polaris';
import { LineChart, BarChart } from '@shopify/polaris-viz';
import { useAppBridge } from "@shopify/app-bridge-react";
import './Analytics.css';
import { AppContext } from "../components/providers/AppProvider";
import { useTranslation } from "react-i18next";
import React, { useCallback, useContext, useState, useEffect } from "react";

import i18next from "i18next";
import LanguageSelector from '../components/LanguageSelector.jsx';
const Analytics = () => {
    // Inject responsive CSS
   

    const shopify = useAppBridge();
    const [downloadsData, setDownloadsData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [geoInsights, setGeoInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const productsPerPage = 10;
    const { refetchStore,store } = useContext(AppContext)
    const { t } = useTranslation()

    useEffect(() => {
        if (store.finish_onboarding === 0) {
            refetchStore(); 
        }
    }, [refetchStore, store.finish_onboarding]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const downloadsResponse = await fetch('/api/downloads');
                const downloads = await downloadsResponse.json();
                console.log('Downloads:', downloads);
                setDownloadsData(downloads);

                const topProductsResponse = await fetch(`/api/top-products?page=${currentPage}&limit=${productsPerPage}`);
                const topProducts = await topProductsResponse.json();
                console.log('Top Products Response:', topProducts);
                setTopProducts(topProducts.data);
                setTotalProducts(topProducts.total);

                const geoInsightsResponse = await fetch('/api/geo-insights');
                const geoInsights = await geoInsightsResponse.json();
                console.log('Geographical Insights:', geoInsights);
                setGeoInsights(geoInsights);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    const downloadChartData = [
        {
            name: t("analytics.downloads"),
            data: downloadsData.map(data => ({
                key: data.month,
                value: data.downloads,
            })),
        },
    ];

    const geoChartData = [
        {
            name: t("analytics.downloads_by_country"),
            data: geoInsights.map(data => ({
                key: data.country,
                value: data.downloads,
            })),
        },
    ];

    const totalDownloads = downloadsData.reduce((total, data) => total + data.downloads, 0);
    const highestMonth = downloadsData.length > 0
        ? downloadsData.reduce((prev, current) => (prev.downloads > current.downloads) ? prev : current).month
        : t("analytics.n/a");
    const highestDownloads = downloadsData.length > 0
        ? Math.max(...downloadsData.map(data => data.downloads))
        : 0;

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalProducts / productsPerPage)) {
            setCurrentPage(newPage);
        }
    };

    const sortedTopProducts = topProducts.sort((a, b) => b.downloads - a.downloads);

    if (loading) {
        return (
            <SkeletonPage title={t("analytics.title")} primaryAction>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <BlockStack gap="300">
                                <Text variant="headingMd" as="h2">
                                    {t("analytics.title")}
                                </Text>
                                <SkeletonBodyText />
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </SkeletonPage>
        );
    }

    return (
        
        <Page
            title={t("analytics.title")}
            primaryAction={
               <LanguageSelector/>
            }
        >
            <Layout>
                <Layout.Section oneHalf>
                    <Card title={t("analytics.download_over_time")}  sectioned>
                        <LineChart data={downloadChartData} isAnimated />
                    </Card>
                </Layout.Section>

                <Layout.Section oneHalf>
                    <Card title={t("analytics.top_performing_products")} sectioned>
                        <DataTable
                            columnContentTypes={["text", "numeric"]}
                            headings={[t("analytics.product_name"), t("analytics.downloads")]}
                            rows={sortedTopProducts.map(product => [
                                product.name,
                                product.downloads,
                            ])}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Pagination
                                hasPrevious={currentPage > 1}
                                onPrevious={() => handlePageChange(currentPage - 1)}
                                hasNext={currentPage < Math.ceil(totalProducts / productsPerPage)}
                                onNext={() => handlePageChange(currentPage + 1)}
                                labels={{ next: t("analytics.next"), previous: t("analytics.previous") }}
                            />
                        </div>
                    </Card>
                </Layout.Section>

                <Layout.Section oneThird>
                    <Card title={t("analytics.geographical_insights")} sectioned>
                        <BarChart data={geoChartData} isAnimated />
                    </Card>
                </Layout.Section>

                <Layout.Section oneThird>
                    <Card title={t("analytics.download_summary")} sectioned>
                        <TextContainer>
                            <Text variant="headingMd" as="h6">{t("analytics.total_downloads")} {totalDownloads}</Text>
                            <p>{t("analytics.highest_month")} {highestMonth} ({highestDownloads} {t("analytics.downloads_lower_case")})</p>
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
            <div style={{ paddingBottom: "10px" }}></div>
        </Page>
       
    );
};

export default Analytics;
