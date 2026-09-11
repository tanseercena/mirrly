import { lazy, Suspense } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { useTranslation } from "react-i18next";
// Import providers directly (not via the ./components barrel) so the modal
// and card components the barrel re-exports stay out of the entry chunk.
import { PolarisProvider } from "./components/providers/PolarisProvider.jsx";
import { QueryProvider } from "./components/providers/QueryProvider.jsx";
import { AppProvider } from "./components/providers/AppProvider.jsx";
import { ReviewProvider } from "./components/providers/ReviewProvider.jsx";
import { PageLoader } from "./components/PageLoader.jsx";
// The dashboard is the landing route, so it stays in the entry chunk;
// every other page becomes its own lazy chunk to keep first paint light.
import IndexPage from "./pages/index.jsx";

// Any .tsx or .jsx files in /pages will become a route
// See documentation for <Routes /> for more info
const pageLoaders = import.meta.glob(
    "./pages/**/!(*.test.[jt]sx)*.([jt]sx)"
);
const pages = Object.fromEntries(
    Object.entries(pageLoaders).map(([key, loader]) => [
        key,
        key === "./pages/index.jsx" ? IndexPage : lazy(loader),
    ])
);

// Warm the landing route's chunk immediately: the lazy route component only
// renders inside AppProvider's store gate, so without this the chunk download
// starts only after /api/store resolves. The second import() of the same
// module resolves from cache.
if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const warmKey = [
        ["/products", "./pages/Products.jsx"],
        ["/sessions", "./pages/Sessions.jsx"],
        ["/plans", "./pages/Plans.jsx"],
        ["/settings", "./pages/Settings.jsx"],
        ["/NewOnboarding", "./pages/NewOnboarding.jsx"],
    ].find(([prefix]) => path.indexOf(prefix) === 0);
    if (warmKey) pageLoaders[warmKey[1]]?.();
}

export default function App() {
    const { t } = useTranslation();
    return (
        <PolarisProvider>
            <BrowserRouter>
                <ReviewProvider>
                    <QueryProvider>
                        <NavMenu>
                            <Link to="/products">{t("sidebar.digital_products")}</Link>
                            {/* <Link to="/DigitalLottery">{t("sidebar.digital_lottery")}</Link> */}
                            <Link to="/settings">{t("sidebar.settings")}</Link>
                            <Link to="/sessions">{t("sidebar.sessions")}</Link>
                            <Link to="/plans">{t("sidebar.plans")}</Link>
                        </NavMenu>
                        <AppProvider>
                            <Suspense fallback={<PageLoader />}>
                                <Routes pages={pages} />
                            </Suspense>
                        </AppProvider>
                    </QueryProvider>
                </ReviewProvider>
            </BrowserRouter>
        </PolarisProvider>
    );
}
