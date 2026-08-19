import { Routes as ReactRouterRoutes, Route } from "react-router-dom";

/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.globEager(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @return {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `pages`
 */
export default function Routes({ pages }) {
  const routes = useRoutes(pages);
  const routeComponents = routes.map(({ path, component: Component }) => (
    <Route key={path} path={path} element={<Component />} />
  ));

  const NotFound = routes.find(({ path }) => path === "/notFound").component;

  return (
    <ReactRouterRoutes>
      {routeComponents}
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
  );
}

function useRoutes(pages) {
    const routes = Object.keys(pages)
        .map((key) => {
            let path = key
                .replace("./pages", "")
                .replace(/\.(t|j)sx?$/, "")
                /**
                 * Replace /index with /
                 */
                .replace(/\/index$/i, "/")
                /**
                 * Only lowercase the first letter. This allows the developer to use camelCase
                 * dynamic paths while ensuring their standard routes are normalized to lowercase.
                 */
                .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
                /**
                 * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
                 */
                .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

            if (path.endsWith("/") && path !== "/") {
                path = path.substring(0, path.length - 1);
            }

            if (!pages[key].default) {
                console.warn(`${key} doesn't export a default React component`);
            }

            return {
                path,
                component: pages[key].default,
            };
        })
        .filter((route) => route.component);

    // Add special route for SingleOrder with dynamic parameter
    // const singleOrderPage = pages['./pages/SingleOrder.jsx'];
    // if (singleOrderPage && singleOrderPage.default) {
    //     routes.push({
    //         path: '/singleOrder/:id',
    //         component: singleOrderPage.default,
    //     });
    // }

    // Automatically add dynamic routes for pages that follow naming conventions
    // Pages ending with certain patterns get automatic dynamic routes
    const autoDynamicPatterns = [
        { pattern: /^Single(.+)\.jsx$/, route: (match) => `/${match[1].toLowerCase()}/:id` },
        { pattern: /^(.+)Page\.jsx$/, route: (match) => `/${match[1].toLowerCase()}Page/:id` },
    ];

    // Manual dynamic routes (for specific cases)
    const manualDynamicRoutes = {
        // Add specific routes here
    };

    // Add manual dynamic routes
    Object.keys(manualDynamicRoutes).forEach(fileName => {
        const fullPath = `./pages/${fileName}`;
        const page = pages[fullPath];

        if (page && page.default) {
            routes.push({
                path: manualDynamicRoutes[fileName],
                component: page.default,
            });
        }
    });

    // Add automatic dynamic routes based on filename patterns
    Object.keys(pages).forEach(key => {
        const fileName = key.replace('./pages/', '');

        autoDynamicPatterns.forEach(({ pattern, route }) => {
            const match = fileName.match(pattern);
            if (match && pages[key].default) {
                routes.push({
                    path: route(match),
                    component: pages[key].default,
                });
            }
        });
    });

    return routes;
}
