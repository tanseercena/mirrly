import { useCallback } from "react";
import { AppProvider } from "@shopify/polaris";

import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import "../../responsive-spacing-fix.css";
import { useTranslation } from "react-i18next";

function AppBridgeLink({ url, children, external, ...rest }) {
    
    const handleClick = useCallback(() => {
        navigate(url);
    }, [url]);

    const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

    if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
        return (
            <a {...rest} href={url} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return (
        <a {...rest} onClick={handleClick}>
            {children}
        </a>
    );
}

/**
 * Sets up the AppProvider from Polaris.
 * @desc PolarisProvider passes a custom link component to Polaris.
 * The Link component handles navigation within an embedded app.
 * Prefer using this vs any other method such as an anchor.
 * Use it by importing Link from Polaris, e.g:
 *
 * ```
 * import {Link} from '@shopify/polaris'
 *
 * function MyComponent() {
 *  return (
 *    <div><Link url="/tab2">Tab 2</Link></div>
 *  )
 * }
 * ```
 *
 * PolarisProvider also passes translations to Polaris.
 *
 */
export function PolarisProvider({ children }) {
    const { t } = useTranslation();
    return (
        // <AppProvider i18n={translations} linkComponent={AppBridgeLink}>
        //   {children}
        // </AppProvider>
        // <AppProvider
        //     i18n={{
        //         Polaris: {
        //             ResourceList: {
        //                 showing:
        //                     t("digtal_product_listing.showing") +
        //                     " {itemsCount} {resource}",
        //             },
        //             DropZone: {
        //         FileUpload: {
        //             actionTitle: t("digtal_product_listing.add_files"),
        //             actionHint: t("digtal_product_listing.add_files"),
        //         },
        //     },
        //         },
        //     }}
        //     linkComponent={AppBridgeLink}
        // >
        //     {children}
        // </AppProvider>

        <AppProvider
            i18n={{
                Polaris: {
                    ResourceList: {
                        showing:
                            t("digtal_product_listing.showing") +
                            " {itemsCount} {resource}",
                    },
                },
            }}
            linkComponent={AppBridgeLink}
        >
            {children}
        </AppProvider>
    );
}
