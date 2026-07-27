import './style.css'

import { useEffect, useState } from 'react'

export const PopupComponent = ({
    shop,
    campaignId,
    topLine,
    bottomLine,
    time,
    showTimeAgo,
    showVerified,
    productUrl,
    productImage,
    productName,
    productId,
    // icon,
    // iconBackgroundColor,
    theme,
    customerId,
}) => {
    const [bottomLineRender, setBottomLineRender] = useState(<></>)
    const [topLineRender, setTopLineRender] = useState(<></>)

    const splitString = (inputString) => {
        // console.log(inputString);
        inputString = inputString.replace(/(?:\r\n|\r|\n)/g, '')
        // console.log(inputString);
        // console.log(inputString.match(regex)[0]);
        const regex = /<strong>.*?<\/strong>/
        const strongContent = inputString.match(regex)[0]
        const firstPart = inputString.replace(strongContent, '').trim()

        return [firstPart, strongContent]
    }

    useEffect(() => {
        let tempBottomLine = bottomLine.replace(
            productName,
            `<strong>${productName}</strong>`
        )
        if (tempBottomLine.includes(`<strong>${productName}</strong>`)) {
            setBottomLineRender(
                <>
                    <span>{splitString(tempBottomLine)[0]} </span>
                    <span>
                        <strong style={{ fontWeight: 600 }}>
                            {splitString(tempBottomLine)[1]
                                .replace('<strong>', '')
                                .replace('</strong>', '')}
                        </strong>
                    </span>
                </>
            )
        } else {
            setBottomLineRender(<span>{bottomLine}</span>)
        }

        let tempTopLine = topLine.replace(
            productName,
            `<strong>${productName}</strong>`
        )
        if (tempTopLine.includes(`<strong>${productName}</strong>`)) {
            setTopLineRender(
                <>
                    <span>{splitString(tempTopLine)[0]} </span>
                    <span>
                        <strong style={{ fontWeight: 600 }}>
                            {splitString(tempTopLine)[1]
                                .replace('<strong>', '')
                                .replace('</strong>', '')}
                        </strong>
                    </span>
                </>
            )
        } else {
            setTopLineRender(<span>{topLine}</span>)
        }
    }, [])
    return (
        <span>
            <a
                href={
                    productUrl == '#'
                        ? productUrl
                        : `${process.env.API_URL}/${shop}/${campaignId}/clicks?redirect=${productUrl}&product=${productId}&customer_id=${customerId}&api-token=${localStorage.getItem('pushyApiToken')}&shop=${shop}`
                }
                target={productUrl == '#' ? '_self' : '_blank'}
                role="dialog"
                className="pushy-salespop-wrapper"
                style={{
                    fontFamily: 'inherit !important',
                    borderWidth: 0,
                    borderColor: '#000',
                    textDecoration: 'none',
                }}
            >
                <div className="pushy-salespop">
                    <div className="pushy-salespop-container">
                        <div className="pushy-salespop-image-wrapper">
                            <img
                                src={
                                    productImage
                                        ? productImage
                                        : 'https://pushy.conversionproplus.com/images/shopify.png'
                                }
                                width={80}
                                height={80}
                            />
                        </div>
                        <div className="pushy-salespop-content-wrapper">
                            <p className="pushy-salespop-content">
                                <span className="pushy-salespop-content-text">
                                    <span className="pushy-salespop-content-text-topline">
                                        {topLineRender}
                                        <br/>
                                    </span>
                                    <span className="pushy-salespop-content-text-bottom-line">
                                        {bottomLineRender}
                                    </span>
                                </span>

                                <span className="pushy-salespop-content-meta">
                                    <small>
                                        {showTimeAgo && (
                                            <>
                                                <span id="time">{time}</span>{' '}
                                                &nbsp;
                                            </>
                                        )}

                                        {showVerified && (
                                            <span>
                                                <i className="fa fa-check-circle"></i>{' '}
                                                Verified by{' '}
                                                <a
                                                    className="poweredby"
                                                    href="https://apps.shopify.com/pushy"
                                                    target="_blank"
                                                >
                                                    ⚡️ Pushy
                                                </a>
                                            </span>
                                        )}
                                    </small>
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="custom-close"></div>
                </div>
            </a>
        </span>
    )
}
