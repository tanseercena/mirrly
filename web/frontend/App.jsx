import { BrowserRouter, Link } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { useTranslation } from "react-i18next";
import {
    QueryProvider,
    PolarisProvider,
} from "./components";
import {
    AppProvider,
} from "./components";
import { ReviewProvider } from "./components/providers/ReviewProvider.jsx";

export default function App() {
    // Any .tsx or .jsx files in /pages will become a route
    // See documentation for <Routes /> for more info
    const pages = import.meta.globEager(
        "./pages/**/!(*.test.[jt]sx)*.([jt]sx)"
    );
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
                            <Link to="/library">{t("sidebar.library")}</Link>
                            <Link to="/EmailTemplates">{t("email_templates.title")}</Link>
                            <Link to="/analytics">{t("sidebar.analytics")}</Link>
                            <Link to="/plans">{t("sidebar.plans")}</Link>
                        </NavMenu>
                        <AppProvider>
                            <Routes pages={pages} />
                        </AppProvider>
                    </QueryProvider>
                </ReviewProvider>
            </BrowserRouter>
        </PolarisProvider>
    );
}
