import { createRoot } from "react-dom/client";
import { SalesPopups } from "../Components";
import { pushyCampaigns, pushyMobileCheck, pushyEl, pushyAccountData, pushyRecordImpression, pushyCheckImpressionsUsage, pushyCheckOrdersUsage, pushyPreviewType } from "../bootstrap";
const pushySalesPopEl = document.getElementById("pushy-sales-popups");

const renderPushySalesPops = (campaigns) => {
    pushyAccountData.then(account => {
        if (pushyCheckImpressionsUsage(account) && pushyCheckOrdersUsage(account)) {
            const root = createRoot(pushySalesPopEl);
            root.render(
                <SalesPopups
                    shop={pushyEl?.dataset?.shop}
                    options={
                        campaigns?.sales_popup?.options
                    }
                    campaignId={campaigns?.sales_popup?.id}
                    currency={pushyEl?.dataset?.shop_currency}
                    moneyFormat={
                        pushyEl?.dataset?.shop_money_format
                    }
                    customerId={pushyEl?.dataset?.customer_id}
                />
            );
        }
    })
}

pushyCampaigns.then(campaigns => {
    if (campaigns?.sales_popup?.status == 1 || pushyPreviewType == 'sales_popup') {
        if (!pushyMobileCheck()) {
            renderPushySalesPops(campaigns);
        } else {
            if (campaigns?.sales_popup?.options?.showOnMobile) {
                renderPushySalesPops(campaigns);
            }
        }
    }
});

