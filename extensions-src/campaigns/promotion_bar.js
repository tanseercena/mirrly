require('../vendor/promotion_bar')

import { createRoot } from 'react-dom/client'
import { PromotionBar } from '../Components'
import {
    pushyAccountData,
    pushyCampaigns,
    pushyCheckImpressionsUsage,
    pushyCheckLeadsUsage,
    pushyEl,
    pushyIsPreviewMode,
    pushyMobileCheck,
    pushyPreviewType,
    pushyRecordImpression
} from '../bootstrap'

const pushyPromotionBarEl = document.getElementById('pushy-promotion-bar')

let pushyShowLastCountdownTime = false
let pushyLastCoutdownHour = null
let pushyLastCoutdownMinute = null
let pushyLastCoutdownSecond = null
let pushyRestartCountdown = false

const pushyRenderPromotionBar = (campaigns) => {

    if (campaigns?.promotion_bar?.options?.type === 'countdown' && !pushyIsPreviewMode) {
        if (localStorage.getItem('pushyPBCountdownFirstStarted')) {
            if (new Date(localStorage.getItem('pushyPBCountdownFirstStarted')) < new Date(Date.now() - campaigns?.promotion_bar?.options?.showAgainAfter * 24 * 60 * 60 * 1000)) {
                localStorage.removeItem('pushyPBCountdownStarted')
                localStorage.setItem('pushyPBCountdownFirstStarted', new Date().toISOString())
                pushyRestartCountdown = true
            }
        } else {
            localStorage.setItem('pushyPBCountdownFirstStarted', new Date().toISOString())
        }

        if (localStorage.getItem('pushyPBCountdownStarted')) {
            const elapsedTime = Date.now() - parseInt(localStorage.getItem('pushyPBCountdownTimestamp'))
            const remainingTime = localStorage.getItem('pushyPBLastCountdown') - elapsedTime

            if (remainingTime > 0) {
                pushyLastCoutdownHour = Math.floor(remainingTime / (60 * 60 * 1000))
                pushyLastCoutdownMinute = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000))
                pushyLastCoutdownSecond = Math.floor((remainingTime % (60 * 1000)) / 1000)

                pushyShowLastCountdownTime = true
            } else {
                if (!pushyRestartCountdown) {
                    return
                }
            }
        }
    }

    pushyAccountData.then(account => {
        if (pushyCheckImpressionsUsage(account) && pushyCheckLeadsUsage(account)) {
            pushyRecordImpression(pushyEl?.dataset?.shop, campaigns?.promotion_bar?.id)
            const root = createRoot(pushyPromotionBarEl)
            root.render(
                <PromotionBar shop={pushyEl?.dataset?.shop}
                              options={campaigns?.promotion_bar?.options}
                              id={campaigns?.promotion_bar.id}
                              moneyFormat={pushyEl?.dataset?.shop_money_format}
                              currency={pushyEl?.dataset?.shop_currency}
                              showLastTime={pushyShowLastCountdownTime}
                              lastHour={pushyLastCoutdownHour}
                              lastMinute={pushyLastCoutdownMinute}
                              lastSecond={pushyLastCoutdownSecond}
                />
            )
        }
    })
}

pushyCampaigns.then(campaigns => {
    // console.log(campaigns?.promotion_bar?.options);
    if (campaigns?.promotion_bar?.status == 1 || pushyPreviewType == 'promotion_bar') {
        if (!pushyMobileCheck()) {
            pushyRenderPromotionBar(campaigns)
        } else {
            if (campaigns?.promotion_bar?.options?.showOnMobile) {
                pushyRenderPromotionBar(campaigns)
            }
        }
        jQuery(function () {
            jQuery('#pushy-promotion-bar').topBarPromoter({
                barBg: campaigns?.promotion_bar?.options?.backgroundColor,
                height: 'auto',
                responsive: true,
                // closeBtn: `${process.env.APP_URL}images/closeBtn.png`,
                closeBtn: `https://pushy.conversionproplus.com/images/closeBtn.png`,
                openBtn: false,
                closeBtnTopPos: 20,
                closeBtnRightPos: 14
            })
        })
    }
})



