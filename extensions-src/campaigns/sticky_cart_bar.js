import { createRoot } from "react-dom/client";
import { StickyCartBar } from "../Components";
import { pushyCampaigns, pushyMobileCheck, pushyEl, pushyAccountData, pushyRecordImpression, pushyCheckImpressionsUsage, pushyCheckLeadsUsage, pushyCheckOrdersUsage, pushyCheckCartAddsUsage, pushyPreviewType } from "../bootstrap";
const pushyStickyCartEl = document.getElementById("pushy-sticky-cart-bar");

const pushyRenderStickyAddToCartBar = (campaigns) => {

    pushyAccountData.then(account => {
        if (pushyCheckImpressionsUsage(account) && pushyCheckOrdersUsage(account) && pushyCheckCartAddsUsage(account)) {
            fetch(`${window.Shopify.routes.root}products/${pushyStickyCartEl?.dataset?.product}.js`)
                .then((response) => response.json())
                .then((data) => {
                    pushyRecordImpression(pushyEl?.dataset?.shop, campaigns?.sticky_cart_bar?.id);
                    const root = createRoot(pushyStickyCartEl);
                    root.render(
                        <StickyCartBar
                            shop={pushyEl?.dataset?.shop}
                            options={
                                campaigns?.sticky_cart_bar
                                    ?.options
                            }
                            campaignId={
                                campaigns?.sticky_cart_bar?.id
                            }
                            product={data}
                            productPrice={
                                pushyStickyCartEl?.dataset
                                    ?.product_price
                            }
                            moneyFormat={
                                pushyEl?.dataset
                                    ?.shop_money_format
                            }
                            currency={
                                pushyEl?.dataset
                                    ?.shop_currency
                            }
                            customerId={
                                pushyEl?.dataset?.customer_id
                            }
                        />
                    );
                })
        }
    })
}

pushyCampaigns.then(campaigns => {
    if (campaigns?.sticky_cart_bar?.status == 1 || pushyPreviewType == 'sticky_cart_bar') {
        if (!pushyMobileCheck()) {
            pushyRenderStickyAddToCartBar(campaigns);
        } else {
            if (campaigns?.sticky_cart_bar?.options?.showOnMobile) {
                pushyRenderStickyAddToCartBar(campaigns);
            }
        }
    }
});
