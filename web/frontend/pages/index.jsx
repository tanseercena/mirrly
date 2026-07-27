import { useContext, useState, lazy, Suspense, useEffect } from "react";
import {
    Layout,
    Page,
    Banner,
    Button,
    SkeletonBodyText,
    SkeletonDisplayText,
    Card,
    InlineGrid,
    BlockStack,
    ButtonGroup,
    Text
} from "@shopify/polaris";
import { AppContext } from "../components/providers/AppProvider.jsx";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../components/PageLoader.jsx";
import { isCardDismissed, dismissCard } from "../utils/sessionStorage.js";
import useReviewModal from "../hooks/useReviewModal.js";

const ReviewBanner = lazy(() => import("../components/ReviewBanner.jsx"));
const AppSetupCard = lazy(() => import("../components/AppSetupCard.jsx"));
const UsageOverview = lazy(() => import("../components/UsageOverviewCom.jsx"));


const ComponentSkeleton = () => (
    <div style={{ padding: '0px' }}>
        <SkeletonBodyText lines={5} />
    </div>
);

const BookingCardSkeleton = () => (
    <Card>
        <InlineGrid columns="1fr auto">
            <BlockStack gap="400">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
                <div style={{ height: "44px" }}></div>
            </BlockStack>
            <div style={{ width: "140px", height: "140px", background: "#f1f2f4", borderRadius: "4px" }}></div>
        </InlineGrid>
    </Card>
);
import "./index.css";

const IndexPage = () => {
    const navigate = useNavigate();
    const { isLoadingData, store } = useContext(AppContext);
    const { t } = useTranslation();

    const handlePricing = () => navigate("/pricing");

    // Shopify Review Modal Hook - triggers after 5 seconds on dashboard
    const { hasRequested: hasRequestedReview } = useReviewModal({
        delay: 5000,
        triggerContext: 'dashboard',
        enabled: true,
    });

    console.log('[Dashboard] Component mounted - useReviewModal hook initialized');

    const [showOfferBanner, setShowOfferBanner] = useState(
        !isCardDismissed('dashboard_discount_card')
    );
    const [showReviewBanner, setShowReviewBanner] = useState(
        !isCardDismissed('dashboard_review_banner')
    );
    const [showSetupCard, setShowSetupCard] = useState(
        !isCardDismissed('dashboard_setup_card')
    );
    const [subscription, setSubscription] = useState(null);
    const [bookingCardLoading, setBookingCardLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await fetch("/api/subscription");
                if (response.ok) {
                    const data = await response.json();
                    setSubscription(data.data.subscription);
                }
            } catch (error) {
                console.error("Error fetching subscription:", error);
            }
        };
        fetchSubscription();

        // Simulate loading for booking card
        const timer = setTimeout(() => setBookingCardLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    const dismissOfferBanner = () => {
        setShowOfferBanner(false);
        dismissCard('dashboard_discount_card');
    };

    if (isLoadingData) {
        return <PageLoader />;
    }

    return (
        
           
                <Page
                    title={t('dashboard.title')}
                    primaryAction={<LanguageSelector homepage />}
                >
                    <Layout>
                        {showOfferBanner && subscription && subscription.interval !== 'yearly' && (
                        <Layout.Section>
                            
                                <Banner
                                    title={t('dashboard.discount_banner')}
                                    tone="info"
                                    onDismiss={dismissOfferBanner}
                                >
                                    <p>
                                        {t('dashboard.discount_banner_desc')}{" "}
                                        <strong>20%</strong>{" "}
                                        {t('dashboard.discount_banner_desc_2')}
                                    </p>
                                    <div style={{ marginTop: "5px" }} />
                                    <Button variant="primary" onClick={handlePricing}>
                                        {t('dashboard.choose_plan')}
                                    </Button>
                                </Banner>
                           
                        </Layout.Section>
                        )}

                        {showReviewBanner && (
                        <Layout.Section>
                            
                                <Suspense fallback={<ComponentSkeleton />}>
                                    <ReviewBanner />
                                </Suspense>
                            
                        </Layout.Section>
                        )}

                        {showSetupCard && (
                        <Layout.Section>
                           
                                <Suspense fallback={<ComponentSkeleton />}>
                                    <AppSetupCard />
                                </Suspense>
                          
                        </Layout.Section>
                        )}

                        <Layout.Section>
                            
                                <Suspense fallback={<ComponentSkeleton />}>
                                    <UsageOverview />
                                </Suspense>
                          
                        </Layout.Section>

                        <Layout.Section>
                           
                                {bookingCardLoading ? (
                                    <BookingCardSkeleton />
                                ) : (
                                    <Card>
                                        <InlineGrid columns="1fr auto">
                                            <BlockStack gap="400" padding="400">
                                                <Text variant="headingMd" as="h5">
                                                    {t("dashboard.booking_card_heading")}
                                                </Text>
                                                <Text as="p">
                                                    {t("dashboard.booking_card_desc")}
                                                </Text>
                                                <ButtonGroup gap="300">
                                                    <Button
                                                        onClick={() => window.open("https://digitally-cpp.youcanbook.me/", "_blank")}
                                                    >
                                                        {t("dashboard.booking_card_button")}
                                                    </Button>
                                                </ButtonGroup>
                                            </BlockStack>
                                            <img
                                                src="/images/book-call-qr.png"
                                                alt={t("dashboard.book_a_call")}
                                                style={{maxWidth: "140px", marginRight: "1rem"}}
                                            />
                                        </InlineGrid>
                                    </Card>
                                )}
                            
                        </Layout.Section>
                    </Layout>
                    <div style={{ paddingBottom: "10px" }}></div>
                </Page>
           
        
    );
};

export default IndexPage;
