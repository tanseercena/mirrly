/* Shared date-range helpers for the /api/sessions/analytics endpoints.
   Used by the dashboard page and by utils/prefetch.js so both build
   byte-identical request URLs — the prefetched request must be the same
   one the page asks for on first mount. */

/* Default "Last 30 days" window */
export const defaultRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    return { start, end };
};

/* Local-date YYYY-MM-DD (no UTC shifting) */
export const toISODate = (d) =>
    d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

/* Query string for the default analytics window ("from=...&to=...") */
export const defaultAnalyticsQuery = () => {
    const { start, end } = defaultRange();
    return new URLSearchParams({
        from: toISODate(start),
        to: toISODate(end),
    }).toString();
};
