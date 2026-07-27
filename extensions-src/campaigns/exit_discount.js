import { createRoot } from "react-dom/client";
import { ExitDiscountOffer } from "../Components";
import { pushyCampaigns, pushyMobileCheck, pushyEl, pushyAccountData, pushyRecordImpression, pushyCheckImpressionsUsage, pushyCheckLeadsUsage, pushyCheckDiscountsUsage, pushyCheckOrdersUsage, pushyPreviewType, pushyIsPreviewMode } from "../bootstrap";
const pushyExitDisountsEl = document.getElementById("pushy-exit-discounts");

let pushyShowLastCountdownTime = false;
let pushyLastCoutdownHour = null
let pushyLastCoutdownMinute = null
let pushyLastCoutdownSecond = null
let pushyRestartCountdown = false;

const pushyRenderExitDiscountOffer = (campaigns) => {

    if (!pushyIsPreviewMode) {
        if (localStorage.getItem("pushyCountdownFirstStarted")) {
            if (new Date(localStorage.getItem("pushyCountdownFirstStarted")) < new Date(Date.now() - campaigns?.exit_discount?.options?.showAgainAfter * 24 * 60 * 60 * 1000)) {
                localStorage.removeItem('pushyCountdownStarted')
                localStorage.setItem('pushyCountdownFirstStarted', new Date().toISOString());
                pushyRestartCountdown = true;
            } else {
                if (!campaigns?.exit_discount?.options?.keepShowing) {
                    return;
                }
            }
        } else {
            localStorage.setItem('pushyCountdownFirstStarted', new Date().toISOString())
        }

        if (localStorage.getItem("pushyCountdownStarted")) {
            const elapsedTime = Date.now() - parseInt(localStorage.getItem('pushyCountdownTimestamp'));
            const remainingTime = localStorage.getItem('pushyLastCountdown') - elapsedTime;

            if (remainingTime > 0) {
                pushyLastCoutdownHour = Math.floor(remainingTime / (60 * 60 * 1000));
                pushyLastCoutdownMinute = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
                pushyLastCoutdownSecond = Math.floor((remainingTime % (60 * 1000)) / 1000);

                pushyShowLastCountdownTime = true;
            } else {
                if (!pushyRestartCountdown) {
                    return;
                }
            }
        }
    }

    pushyAccountData.then(account => {
        if (pushyCheckImpressionsUsage(account) && pushyCheckDiscountsUsage(account) && pushyCheckOrdersUsage(account)) {
            setTimeout(() => {
                pushyRecordImpression(pushyEl?.dataset?.shop, campaigns?.exit_discount?.id);
                const root = createRoot(pushyExitDisountsEl);
                if (account?.can?.collect_leads) {
                    if (!pushyCheckLeadsUsage(account)) {
                        campaigns.exit_discount.options.collectLeads = false;
                    }
                } else {
                    campaigns.exit_discount.options.collectLeads = false;
                }

                root.render(
                    <ExitDiscountOffer
                        shop={pushyEl?.dataset.shop}
                        options={campaigns?.exit_discount?.options}
                        campaignId={campaigns?.exit_discount?.id}
                        currency={pushyEl?.dataset?.shop_currency}
                        moneyFormat={pushyEl?.dataset?.shop_money_format}
                        customerId={pushyEl?.dataset?.customer_id}
                        showLastTime={pushyShowLastCountdownTime}
                        lastHour={pushyLastCoutdownHour}
                        lastMinute={pushyLastCoutdownMinute}
                        lastSecond={pushyLastCoutdownSecond}
                    />
                );
            }, 2000);
        }
    })

}

pushyCampaigns.then(campaigns => {
    if (campaigns?.exit_discount?.status == 1 || pushyPreviewType == 'exit_discount') {
        if (!pushyMobileCheck()) {
            pushyRenderExitDiscountOffer(campaigns);
        } else {
            if (campaigns?.exit_discount?.options?.showOnMobile) {
                pushyRenderExitDiscountOffer(campaigns);
            }
        }
    }
});
