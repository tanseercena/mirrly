/* Early data fetching for the dashboard.

   The dashboard's API calls used to start only after React mounted, which
   put them at the end of a long serial waterfall (HTML -> JS bundles ->
   i18n -> render -> fetch). index.html now starts them via an inline
   script (window.__earlyApi) at HTML-parse time; this module reuses those
   promises and starts any missing ones at script-eval time.

   prefetchJSON(url) shares the warmed request with whoever asks first
   (the initial mount); later calls hit the network like a plain fetch, so
   revisiting a page/filter always gets fresh data. All promises resolve to
   { ok, status, data } with data already parsed (null when the body isn't
   JSON), so the shared result can be read more than once safely. */

import { defaultAnalyticsQuery } from "./analyticsRange.js";

// [perf] diagnostics — remove once LCP tuning is done
console.debug('[perf] JS eval at ' + Math.round(performance.now()) + 'ms');

/* Plain fetch returning { ok, status, data } with the body already parsed
   (null when the body isn't JSON). Always hits the network. */
export const fetchJSON = (url) =>
    fetch(url).then(async (response) => {
        let data = null;
        try {
            data = await response.json();
        } catch {
            // Empty or non-JSON body — leave data null
        }
        return { ok: response.ok, status: response.status, data };
    });

export const prefetchJSON = (url) => {
    const shared = pending.get(url);
    if (shared) {
        pending.delete(url);
        return shared;
    }
    return fetchJSON(url);
};

// Fallback for when index.html didn't seed __earlyApi (e.g. a stale cached
// HTML). Mirrors the route-aware warm list of the inline script: store on
// every route, page-specific requests on their routes.
const bootUrls = ['/api/store'];
if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const rangeQuery = '?' + defaultAnalyticsQuery();
    if (path === "/") {
        bootUrls.push(
            '/api/subscription',
            '/api/sessions/recent',
            '/api/sessions/analytics' + rangeQuery
        );
    }
    if (path.indexOf("/products") === 0) {
        let perPage = '25';
        try {
            const stored = window.sessionStorage.getItem('products_per_page');
            if (['10', '25', '50', '100'].includes(stored)) perPage = stored;
        } catch {
            // storage unavailable — default stands
        }
        // Must mirror pages/Products.jsx's first request
        bootUrls.push('/api/products?page=1&per_page=' + perPage + '&status=all');
    }
    if (path.indexOf("/sessions") === 0) {
        // Must mirror pages/Sessions.jsx's first requests
        bootUrls.push(
            '/api/sessions/analytics' + rangeQuery,
            '/api/sessions/product-performance' + rangeQuery
        );
    }
    if (path.indexOf("/plans") === 0) {
        // Must mirror pages/Plans.jsx's first requests
        bootUrls.push('/api/plans', '/api/subscription');
    }
}

const pending = new Map(
    Object.entries((typeof window !== "undefined" && window.__earlyApi) || {})
);

// Start (or report) the boot requests. Entries seeded from index.html are
// already in flight — attach timing logs without consuming them; the page
// components consume them later via prefetchJSON().
for (const url of bootUrls) {
    if (!pending.has(url)) {
        pending.set(url, fetchJSON(url));
    }
    pending
        .get(url)
        .then(() =>
            console.debug(
                '[perf] ' + url.replace('/api/', '') + ' ready at ' + Math.round(performance.now()) + 'ms'
            )
        )
        .catch(() => {});
}
