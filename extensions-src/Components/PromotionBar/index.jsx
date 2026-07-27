import { useEffect, useRef, useState } from 'react'

import './style.css'
import { ThreeDots } from 'react-loader-spinner'
import { CountdownTimer } from '../ExitDiscountOffer/components/CountdownTimer'
import Countdown, { zeroPad } from 'react-countdown'

export const PromotionBar = ({
    shop,
    options,
    id,
    moneyFormat,
    currency,
    showLastTime,
    lastHour,
    lastMinute,
    lastSecond
}) => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [validated, setValidated] = useState(true)
    const [showBar, setShowBar] = useState(true)

    const nameRef = useRef()
    const emailRef = useRef()
    const inputRef = useRef()

    const barStyles = {
        color: options?.textColor,
        textAlign: 'center',
        fontSize: 14
    }

    const ctaButtonStyles = {
        backgroundColor: options?.ctaButtonBackgroundColor,
        color: options?.ctaButtonTextColor
    }

    const ctaTarget = options?.ctaOpenNewTab ? '_blank' : '_self'

    const leadButtonStyles = {
        backgroundColor: options?.leadButtonBackgroundColor,
        color: options?.leadButtonTextColor
    }

    // const countdownTime = Date.now() + (options?.countDownHours * 60 * 60 * 1000) + (options?.countDownMinutes * 60 * 1000) + (options?.countDownSeconds * 1000)
    const countdownTime = showLastTime ? Date.now() + (lastHour * 60 * 60 * 1000) + (lastMinute * 60 * 1000) + (lastSecond * 1000) : Date.now() + (options?.countDownHours * 60 * 60 * 1000) + (options?.countDownMinutes * 60 * 1000) + (options?.countDownSeconds * 1000)

    const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <strong>Countdown Completed!</strong>
        } else {
            return (<CountdownTimer
                hours={zeroPad(hours)}
                minutes={zeroPad(minutes)}
                seconds={zeroPad(seconds)}
                backgroundColor={options?.countDownTimerBackgroundColor}
                textColor={options?.countDownTimerTextColor}
                type="promotion_bar"
            />)
        }
    }

    const saveTimeToLocalStorage = (time) => {
        const totalMilliseconds =
            time.days * 24 * 60 * 60 * 1000 +
            time.hours * 60 * 60 * 1000 +
            time.minutes * 60 * 1000 +
            time.seconds * 1000 +
            time.milliseconds
        localStorage.setItem('pushyPBCountdownStarted', 1)
        localStorage.setItem('pushyPBLastCountdown', totalMilliseconds)
        localStorage.setItem('pushyPBCountdownTimestamp', Date.now().toString())

    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const reValidate = () => {
        setValidated(true)
    }

    const submit = () => {
        setIsLoading(true)
        if (
            !nameRef.current.value ||
            !emailRef.current.value ||
            !validateEmail(emailRef.current.value)
        ) {
            setValidated(false)
            setIsLoading(false)
            return
        }

        let form = new FormData()
        form.append('name', nameRef.current.value)
        form.append('email', emailRef.current.value)
        form.append('api-token', localStorage.getItem('pushyApiToken'))
        form.append('shop', shop)

        fetch(`${process.env.API_URL}/${shop}/leads/create`, {
            method: 'POST',
            body: form,
        }).then((resp) => {

            setIsLoading(false)
            setIsFormSubmitted(true)
        })
    }

    useEffect(() => {
        if (options?.type === 'lead') {
            if (options?.leadShowNameField) {
                nameRef.current.addEventListener('input', reValidate)
            }
            emailRef.current.addEventListener('input', reValidate)
        }
    }, [])

    return (
        <>
            {showBar && (
                <div id="pushy-promotion-bar" style={{ position: 'relative' }}>

                    <div className="pushy-promotion-bar-container">

                        {options?.type === 'headline' && (
                            <div className="pushy-promotion-bar-text" style={barStyles}>
                                <p>{options?.headlineText}</p>
                            </div>
                        )}

                        {options?.type === 'cta' && (
                            <div className="pushy-promotion-bar-cta" style={barStyles}>
                                <div className="pushy-promotion-bar-text">
                                    <p>{options?.headlineText}</p>
                                </div>
                                <a href={`${process.env.API_URL}/${shop}/${id}/clicks?redirect=${options?.ctaLink}&api-token=${localStorage.getItem('pushyApiToken')}&shop=${shop}`}
                                   className="pushy-promotion-bar-cta-button" target={ctaTarget}
                                   style={ctaButtonStyles}>
                                    {options?.ctaText}
                                </a>
                            </div>
                        )}

                        {options?.type === 'countdown' && (
                            <div className="pushy-promotion-bar-cta" style={barStyles}>
                                <div className="pushy-promotion-bar-text" style={{ marginRight: '1em' }}>
                                    <p>{options?.headlineText}</p>
                                </div>

                                <Countdown
                                    date={countdownTime}
                                    renderer={countdownRenderer}
                                    zeroPadTime={2}
                                    intervalDelay={0}
                                    onTick={(time) => saveTimeToLocalStorage(time)}
                                />

                                {options?.countDownDisplayCta && (
                                    <a href={`${process.env.API_URL}/${shop}/${id}/clicks?redirect=${options?.ctaLink}&api-token=${localStorage.getItem('pushyApiToken')}&shop=${shop}`}
                                       className="pushy-promotion-bar-cta-button" target={ctaTarget}
                                       style={ctaButtonStyles}>
                                        {options?.ctaText}
                                    </a>)}
                            </div>
                        )}

                        {options?.type === 'lead' && (
                            <div className="pushy-promotion-bar-lead" style={barStyles}>
                                {!isFormSubmitted && (<>
                                    <div className="pushy-promotion-bar-text">
                                        <p>{options?.headlineText}</p>
                                    </div>
                                    <form className="pushy-promotion-bar-form">
                                        <div className="pushy-promotion-bar-lead-input-wrapper">
                                            {options?.leadShowNameField && (
                                                <input type="text"
                                                       className="pushy-promotion-bar-lead-input pushy-promotion-bar-lead-input-name"
                                                       placeholder="Enter your name" ref={nameRef}/>
                                            )}
                                            <input type="text" className="pushy-promotion-bar-lead-input"
                                                   placeholder="Enter your email" ref={emailRef}/>
                                        </div>
                                        <button type="button" onClick={submit}
                                                className="pushy-promotion-bar-lead-button"
                                                style={leadButtonStyles} disabled={isLoading}>
                                            {!isLoading && options?.leadButtonText}
                                            {isLoading && (<ThreeDots
                                                height="9"
                                                width="40"
                                                color={options?.leadButtonTextColor}
                                                ariaLabel="three-dots-loading"
                                                radius="30"
                                                wrapperStyle={{ justifyContent: 'center' }}
                                                wrapperClass=""
                                                visible={true}
                                            />)}
                                        </button>
                                    </form>
                                </>)}

                                {isFormSubmitted && (<>
                                    <div className="pushy-promotion-bar-text" style={barStyles}>
                                        <p>{options?.leadThanksText}</p>
                                    </div>
                                </>)}
                            </div>
                        )}


                        <div className="close" onClick={() => setShowBar(false)}>
                            <img src={'https://pushy.conversionproplus.com/images/closeBtn.png'}/>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}
