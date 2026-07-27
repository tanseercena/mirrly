import "./style.css";

export const CountdownTimer = ({ hours, minutes, seconds, backgroundColor, textColor, type }) => {

    let countdownStyles = {
        backgroundColor: backgroundColor
    }

    let countdownTextStyles = {
        color: textColor
    }

    let countdownColonStyles = {
        color: backgroundColor
    }

    switch (type) {
        case "exit_discount":
            countdownStyles.width = 90;
            countdownStyles.height = 100;
            countdownStyles.fontSize = 15;
            countdownTextStyles.fontSize = 40;
            countdownTextStyles.paddingBottom = 9;
            countdownColonStyles.fontSize = 48;
            break;
        case "promotion_bar":
            countdownStyles.width = 50;
            countdownStyles.height = 40;
            countdownStyles.fontSize = 15;
            countdownTextStyles.fontSize = 20;
            countdownTextStyles.paddingBottom = 0;
            countdownColonStyles.fontSize = 38;
            break;
    }


    return (
        <div className="pushy-exit-discounts-countdown-wrapper">
            <div className="pushy-exit-discounts-countdown" style={countdownStyles}>
                <span className="pushy-exit-discounts-countdown-data" style={countdownTextStyles}>
                    {hours}
                </span>
            </div>
            <div className="colon" style={countdownColonStyles}>:</div>
            <div className="pushy-exit-discounts-countdown" style={countdownStyles}>
                <span className="pushy-exit-discounts-countdown-data" style={countdownTextStyles}>
                    {minutes}
                </span>
            </div>
            <div className="colon" style={countdownColonStyles}>:</div>
            <div className="pushy-exit-discounts-countdown" style={countdownStyles}>
                <span className="pushy-exit-discounts-countdown-data" style={countdownTextStyles}>
                    {seconds}
                </span>
            </div>
        </div>
    );
};
