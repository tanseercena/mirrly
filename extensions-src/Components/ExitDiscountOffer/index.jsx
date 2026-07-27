import { useExitIntent } from "use-exit-intent";
import swal from "@sweetalert/with-react";
import { ExitModal } from "./components/ExitModal";
import { useLayoutEffect, useState } from "react";

import "./style.css";

export const ExitDiscountOffer = ({
    shop,
    options,
    campaignId,
    currency,
    moneyFormat,
    customerId,
    showLastTime,
    lastHour,
    lastMinute,
    lastSecond
}) => {
    // const [options, setOptions] = useState({});

    const { registerHandler } = useExitIntent();

    const close = () => {
        swal.close();
    };

    registerHandler({
        id: "openModal",
        handler: () => {
            swal({
                button: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
                content: (
                    <ExitModal
                        options={options}
                        close={close}
                        shop={shop}
                        currency={currency}
                        campaignId={campaignId}
                        moneyFormat={moneyFormat}
                        customerId={customerId}
                        showLastTime={showLastTime}
                        lastHour={lastHour}
                        lastMinute={lastMinute}
                        lastSecond={lastSecond}
                    />
                ),
            });
        },
        desktop: {
            triggerOnIdle: false,
            useBeforeUnload: true,
            triggerOnMouseLeave: true,
            delayInSecondsToTrigger: 0,
        },
        mobile: {
            triggerOnIdle: false,
            delayInSecondsToTrigger: 1,
        },
    });
    return <></>;
};
