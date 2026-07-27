import { createRoot } from "react-dom/client";
import {onLCP, onINP, onCLS} from 'web-vitals';
import App from "./App";
import {initI18n} from "./utils/i18nUtils";

onLCP(lcp => {
    console.log('web vitals - LCP in seconds:', lcp.value / 1000);
    console.log('web vitals - LCP details:', lcp.entries);
}, {reportAllChanges: true});

onINP(inp => {
    console.log('web vitals - INP in seconds:', inp.value / 1000);
    console.log('web vitals - INP details:', inp.entries);
}, {reportAllChanges: true});

onCLS(cls => {
    console.log('web vitals - CLS in seconds:', cls.value / 1000);
    console.log('web vitals - CLS details:', cls.entries);
}, {reportAllChanges: true});

const root = createRoot(document.getElementById("app"));
// root.render(<App />);
initI18n().then(() => {
    root.render(
        <App/>
    );
});
