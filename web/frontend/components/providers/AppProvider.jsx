import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { Crisp } from "crisp-sdk-web";
import { PageLoader } from "../PageLoader.jsx";

export const AppContext = createContext();

export function AppProvider({ children }) {
    const navigate = useNavigate();
    const [usage] = useState({});
    const [limits] = useState({});
    const [can] = useState({});
    const [plan] = useState({});
    const [store, setStore] = useState({});
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [showReviewBanner, setShowReviewBanner] = useState(false);
    const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
    const [primaryLocale, setPrimaryLocale] = useState('en');
    const [currentLanguage, setCurrentLanguage] = useState('en');



    const isThreeDaysAgo = (dateString) => {
        const inputDate = new Date(dateString);
        const threeDaysAgo = new Date();

        // set the date to 3 days ago
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        return inputDate < threeDaysAgo;
    };

useEffect(() => {
    Crisp.configure("a272e134-5dc6-4e68-8c3c-4205ade6a98d");

    // Make $crisp available globally for the chat button
    window.$crisp = window.$crisp || [];
    window.$crisp.push(["set", "container:id", "a272e134-5dc6-4e68-8c3c-4205ade6a98d"]);

    // Crisp renders as an <iframe> — CSS in your app can't reach inside it.
    // We must directly style the iframe element itself via MutationObserver.
    const moveCrispToTopRight = () => {
        // Target the Crisp iframe wrapper div
        const crispBox = document.getElementById("crisp-chatbox");
        if (crispBox) {
            // Hide on mobile, show on desktop
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                crispBox.style.setProperty("display", "none", "important");
            } else {
                crispBox.style.setProperty("bottom", "auto", "important");
                crispBox.style.setProperty("top", "20px", "important");
                crispBox.style.setProperty("right", "20px", "important");
                crispBox.style.setProperty("left", "auto", "important");

                // Also target all iframes inside it
                const iframes = crispBox.querySelectorAll("iframe");
                iframes.forEach((iframe) => {
                    iframe.style.setProperty("bottom", "auto", "important");
                    iframe.style.setProperty("top", "0px", "important");
                });
            }

            return true; // found it, stop observing
        }
        return false;
    };

    // Handle window resize to toggle Crisp visibility
    const handleResize = () => {
        const crispBox = document.getElementById("crisp-chatbox");
        if (crispBox) {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                crispBox.style.setProperty("display", "none", "important");
            } else {
                crispBox.style.setProperty("display", "block", "important");
            }
        }
    };

    window.addEventListener('resize', handleResize);

    // Try immediately in case Crisp already loaded
    if (!moveCrispToTopRight()) {
        // Watch for Crisp to appear in the DOM
        const observer = new MutationObserver(() => {
            if (moveCrispToTopRight()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Cleanup
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

    // const {
    //     usageResponse,
    //     refetch: refetchUsage,
    //     isLoading: isLoadingUsage,
    //     isRefetching: isRefetchingUsage,
    // } = useAppQuery({
    //     url: "/api/usage",
    //     reactQueryOptions: {
    //         onSuccess: (response) => {
    //             setUsage(response.data.usage);
    //             setLimits(response.data.limits);
    //             setCan(response.data.can);
    //             setPlan(response.data.plan);
    //
    //             if (response.data.limits.impressions != "unlimited") {
    //                 if (
    //                     (response.data.usage.impressions /
    //                         response.data.limits.impressions) *
    //                     100 >=
    //                     90
    //                 ) {
    //                     setShowUpgradeBanner(true);
    //                 }
    //
    //                 if (
    //                     (response.data.usage.discounts /
    //                         response.data.limits.discounts) *
    //                     100 >=
    //                     90
    //                 ) {
    //                     setShowUpgradeBanner(true);
    //                 }
    //
    //                 if (
    //                     (response.data.usage.leads /
    //                         response.data.limits.leads) *
    //                     100 >=
    //                     90
    //                 ) {
    //                     setShowUpgradeBanner(true);
    //                 }
    //
    //                 if (
    //                     (response.data.usage.cart_adds /
    //                         response.data.limits.cart_adds) *
    //                     100 >=
    //                     90
    //                 ) {
    //                     setShowUpgradeBanner(true);
    //                 }
    //
    //                 if (
    //                     (response.data.usage.orders /
    //                         response.data.limits.orders) *
    //                     100 >=
    //                     90
    //                 ) {
    //                     setShowUpgradeBanner(true);
    //                 }
    //             }
    //
    //             setIsLoadingData(false);
    //         },
    //     },
    // });

    const refetchStore = async () => {
        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('API timeout after 30 seconds')), 30000);
            });

            const fetchPromise = fetch("/api/store");

            const response = await Promise.race([fetchPromise, timeoutPromise]);

            if (!response.ok) {
                const responseData = await response.json();
                // Check if this is an error response from the middleware
                if (responseData.error === 'authentication_required' && responseData.redirect) {
                    console.log("Authentication required, redirecting...");

                    // Extract shop from URL parameters
                    const urlParams = new URLSearchParams(window.location.search);
                    let shop = urlParams.get('shop');

                    // If shop is not in URL, try to extract from host parameter
                    if (!shop) {
                        const host = urlParams.get('host');
                        if (host) {
                            // Decode host and extract shop domain
                            const decodedHost = atob(host);
                            // Extract shop from URL like admin.shopify.com/store/digitally-test-store
                            const shopMatch = decodedHost.match(/\/store\/([^\/]+)/);
                            if (shopMatch) {
                                shop = `${shopMatch[1]}.myshopify.com`;
                            }
                        }
                    }

                    // Fallback to a default shop if we still don't have it
                    if (!shop) {
                        shop = 'unknown-shop.myshopify.com';
                    }

                    // Build the auth URL
                    const authUrl = `${window.location.origin}${responseData.url}`;

                    console.log("Redirecting to auth:", authUrl);

                    // Break out of iframe and redirect to auth
                    window.top.location.href = authUrl;
                    return;
                }else{
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const responseData = await response.json();

            // Check if this is an error response from the middleware
            if (responseData.error === 'authentication_required' && responseData.redirect) {
                console.log("Authentication required, redirecting...");

                // Extract shop from URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                let shop = urlParams.get('shop');

                // If shop is not in URL, try to extract from host parameter
                if (!shop) {
                    const host = urlParams.get('host');
                    if (host) {
                        // Decode host and extract shop domain
                        const decodedHost = atob(host);
                        // Extract shop from URL like admin.shopify.com/store/digitally-test-store
                        const shopMatch = decodedHost.match(/\/store\/([^\/]+)/);
                        if (shopMatch) {
                            shop = `${shopMatch[1]}.myshopify.com`;
                        }
                    }
                }

                // Fallback to a default shop if we still don't have it
                if (!shop) {
                    shop = 'unknown-shop.myshopify.com';
                }

                // Build the auth URL
                const authUrl = `${window.location.origin}${responseData.url}`;

                console.log("Redirecting to auth:", authUrl);

                // Break out of iframe and redirect to auth
                window.top.location.href = authUrl;
                return;
            }

            if (responseData.data) {
                if (isThreeDaysAgo(responseData.data.updated_at)) {
                    setShowReviewBanner(true);
                }
                setStore(responseData.data);
                const savedLocale = responseData.data.primary_locale || 'en';
                setPrimaryLocale(savedLocale);
                setCurrentLanguage(savedLocale);

                // Change i18next language to match saved preference
                if (savedLocale) {
                    import('i18next').then(i18nextModule => {
                        i18nextModule.default.changeLanguage(savedLocale);
                    });
                }

                if (responseData.data.email) {
                    Crisp.user.setEmail(responseData.data.email);
                }

                if (responseData.data.name) {
                    Crisp.user.setNickname(responseData.data.name);
                }

                Crisp.session.setData({
                    store_id: responseData.data.id ?? '',
                    shopify_domain: responseData.data.shopify_domain ?? '',
                    plan: responseData.data.plan?.name ?? '',
                });

                if(!responseData.data.finish_onboarding) {
                    navigate("/NewOnboarding");
                }
            }

            console.log('AppProvider: Data loaded, setting isLoadingData to false');
            setIsLoadingData(false);
        } catch (error) {
            console.error("Store API error:", error);
            console.error("Error details:", {
                message: error.message,
                stack: error.stack,
            });

            // Check if it's a timeout error
            if (error.message && error.message.includes('timeout')) {
                console.error("Store endpoint is taking too long to respond. This could be due to:");
                console.error("1. Database connection issues");
                console.error("2. Slow queries");
                console.error("3. Shopify API delays");
                console.error("4. Server performance issues");
            }

            // Still set loading to false on error so the page can render
            // You can add error state handling here if needed
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        refetchStore();
    }, []);

    return (
        <>
            {isLoadingData ? (
                <PageLoader />
            ) : (
                <AppContext.Provider
                    value={{
                        usage,
                        limits,
                        can,
                        store,
                        refetchStore,
                        showReviewBanner,
                        setShowReviewBanner,
                        showUpgradeBanner,
                        plan,
                        primaryLocale,
                        currentLanguage,
                        setCurrentLanguage
                    }}
                >
                    {children}
                </AppContext.Provider>
            )}
        </>
    );
}
