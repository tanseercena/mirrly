import Countdown, { zeroPad } from "react-countdown";
import { CountdownTimer } from "../CountdownTimer";
import {
    useEffect,
    useRef,
    useState,
    useLayoutEffect,
    useCallback,
} from "react";
import { Bars } from "react-loader-spinner";
import copy from "copy-to-clipboard";

import "./style.css";

export const ExitModal = ({
    options,
    close,
    shop,
    currency,
    campaignId,
    moneyFormat,
    customerId,
    showLastTime,
    lastHour,
    lastMinute,
    lastSecond
}) => {
    const [discountCode, setDiscountCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(true);


    const acceptButtonStyles = {
        backgroundColor: options.buttonBackgroundColor,
        color: options.buttonTextColor,
    };

    // const countdownTime = Date.now() + (options?.countDownHours * 60 * 60 * 1000) + (options?.countDownMinutes * 60 * 1000) + (options?.countDownSeconds * 1000)
    const countdownTime = showLastTime ? Date.now() + (lastHour * 60 * 60 * 1000) + (lastMinute * 60 * 1000) + (lastSecond * 1000) : Date.now() + (options?.countDownHours * 60 * 60 * 1000) + (options?.countDownMinutes * 60 * 1000) + (options?.countDownSeconds * 1000)

    const closeRef = useRef();
    const acceptRef = useRef();
    const copyRef = useRef();
    const inputRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();

    const saveTimeToLocalStorage = (time) => {
        const totalMilliseconds =
            time.days * 24 * 60 * 60 * 1000 +
            time.hours * 60 * 60 * 1000 +
            time.minutes * 60 * 1000 +
            time.seconds * 1000 +
            time.milliseconds;
        localStorage.setItem("pushyCountdownStarted", 1);
        localStorage.setItem("pushyLastCountdown", totalMilliseconds);
        localStorage.setItem('pushyCountdownTimestamp', Date.now().toString());

    };

    const copyDiscount = () => {
        copy(inputRef.current.value);
        let tempDiscountCode = discountCode;
        setDiscountCode("CODE COPIED!");

        setTimeout(() => {
            close();
        }, 2000);
    };

    const reValidate = () => {
        setValidated(true);
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const createDiscount = () => {
        setIsLoading(true);

        if (options.collectLeads) {
            if (
                !nameRef.current.value ||
                !emailRef.current.value ||
                !validateEmail(emailRef.current.value)
            ) {
                setValidated(false);
                setIsLoading(false);
                return;
            }
        }

        let form = new FormData();
        form.append("discount_type", options.discountType);
        form.append("discount_amount", options.discountAmount);
        form.append("discount_percentage", options.discountPercentage);
        form.append("campaign_id", campaignId);
        form.append("customer_id", customerId);
        form.append('api-token', localStorage.getItem('pushyApiToken'));
        form.append('shop', shop);
        if (options.collectLeads) {
            form.append("name", nameRef.current.value);
            form.append("email", emailRef.current.value);
        }
        fetch(`${process.env.API_URL}/${shop}/discounts/create`, {
            method: "POST",
            body: form,
        }).then((resp) =>
            resp.json().then((response) => {
                setDiscountCode(
                    response?.data?.discountCodeBasicCreate?.codeDiscountNode
                        ?.discount?.codes?.edges[0]?.node?.code
                );
                setIsLoading(false);
                copyRef.current.addEventListener("click", copyDiscount);
            })
        );
    };

    useEffect(() => {
        closeRef.current.addEventListener("click", () => close());
        acceptRef.current.addEventListener("click", createDiscount);
        if (options?.collectLeads) {
            nameRef.current.addEventListener("input", reValidate);
            emailRef.current.addEventListener("input", reValidate);
        }
    }, []);

    const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <strong>Discount offer has expired</strong>;
        } else {
            return (<CountdownTimer
                hours={zeroPad(hours)}
                minutes={zeroPad(minutes)}
                seconds={zeroPad(seconds)}
                backgroundColor={options?.countDownTimerBackgroundColor}
                textColor={options?.countDownTimerTextColor}
                type="exit_discount"
            />)
        }
    };

    return (
        <div className="pushy-exit-discounts">
            <h4 className="pushy-exit-discounts-title">
                WAIT, HOW ABOUT
                <strong>
                    {options?.discountType == "percentage" &&
                        ` ${options?.discountPercentage}% `}
                    {options?.discountType == "fixed" &&
                        ` ${moneyFormat.replace(
                            "{{amount}}",
                            options?.discountAmount
                        )}`}{" "}
                </strong>
                OFF 🎉?
            </h4>
            <h6 className="pushy-exit-discounts-subtitle">
                We'd hate to see you go!
            </h6>
            <p>
                Complete your purchase now and get
                {options?.discountType == "percentage" &&
                    ` ${options?.discountPercentage}% `}
                {options?.discountType == "fixed" &&
                    ` ${moneyFormat.replace(
                        "{{amount}}",
                        options?.discountAmount
                    )}`}{" "}
                off.
            </p>
            {!discountCode && (
                <>
                    <Countdown
                        date={countdownTime}
                        renderer={countdownRenderer}
                        zeroPadTime={2}
                        intervalDelay={0}
                        onTick={(time) => saveTimeToLocalStorage(time)}
                    />
                    <p className="warning">
                        This is a one time offer, so take advantage of the
                        discount now!
                    </p>
                </>
            )}

            {options.collectLeads && (
                <>
                    {!discountCode && (
                        <div>
                            <form>
                                <input
                                    placeholder="Your name"
                                    type="text"
                                    className="form-input"
                                    ref={nameRef}
                                />
                                <input
                                    placeholder="Your email"
                                    type="email"
                                    className="form-input"
                                    ref={emailRef}
                                />
                            </form>
                        </div>
                    )}
                </>
            )}

            {!validated && (
                <p className="warning">
                    <strong>
                        Please enter your name and valid email to continue.
                    </strong>
                </p>
            )}

            {!discountCode && (
                <button ref={acceptRef} style={acceptButtonStyles}>
                    {!isLoading && "Accept discount offer!"}
                    {isLoading && (
                        <Bars color={options.buttonTextColor} height={40} />
                    )}
                </button>
            )}

            {discountCode && (
                <>
                    <h6 className="pushy-exit-discounts-discount">
                        Your discount code:
                    </h6>
                    <input
                        type="text"
                        value={discountCode}
                        readOnly={true}
                        ref={inputRef}
                        className="discount-box"
                    />
                    <p className="cancel" ref={copyRef}>
                        Click here to copy code
                    </p>
                </>
            )}

            {!discountCode && (
                <p className="cancel" ref={closeRef}>
                    No Thanks
                </p>
            )}
        </div>

    );
};
