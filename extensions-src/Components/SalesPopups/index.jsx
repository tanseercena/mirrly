import { useEffect, useLayoutEffect, useState } from 'react'
import { Bounce, Flip, Slide, toast, ToastContainer, Zoom, } from 'react-toastify'
import { PopupComponent } from './PopupComponent'
import { shuffle } from '../../helpers'
import moment from 'moment'

import 'react-toastify/dist/ReactToastify.min.css'

export const SalesPopups = ({
    shop,
    options,
    campaignId,
    currency,
    moneyFormat,
    customerId,
}) => {
    const [orders, setOrders] = useState([])
    const [stack, setStack] = useState([])
    const [isToastShowing, setIsToastShowing] = useState(false)
    const [shownFirstToast, setShownFirstToast] = useState(false)
    const [stackIndex, setStackIndex] = useState(0)

    // let stackIndex = 0;
    let showAlerts = true

    document.addEventListener(
        'visibilitychange',
        () => {
            if (document.hidden) {
                showAlerts = false
            } else {
                showAlerts = true
            }
        },
        false
    )

    const setTransitionType = () => {
        switch (options?.transitionType) {
            case 'bounce':
                return Bounce
                break
            case 'zoom':
                return Zoom
                break
            case 'slide':
                return Slide
                break
            case 'flip':
                return Flip
                break
            default:
                return Slide
        }
    }

    const showToast = () => {
        if (document.visibilityState == 'visible') {
            fetch(
                `${process.env.API_URL}/${shop}/${campaignId}/impressions?api-token=${localStorage.getItem('pushyApiToken')}&shop=${shop}`,
                {
                    method: 'POST',
                }
            )

            // toast.dismiss();

            // if (!stack[stackIndex]) {
            //     stackIndex = 0;
            // }

            let topLine = options?.topLine
                .replace('{name}', stack[stackIndex]?.name)
                .replace('{location}', stack[stackIndex]?.location)
                .replace('{product}', stack[stackIndex]?.product_name)
            let bottomLine = options?.bottomLine
                .replace('{product}', stack[stackIndex]?.product_name)
                .replace('{name}', stack[stackIndex]?.name)
                .replace('{location}', stack[stackIndex]?.location)

            if (showAlerts) {
                stack[stackIndex] &&
                toast(
                    <PopupComponent
                        shop={shop}
                        campaignId={campaignId}
                        topLine={topLine}
                        bottomLine={bottomLine}
                        time={stack[stackIndex]?.time}
                        showTimeAgo={options?.showTimeAgo}
                        showVerified={options?.showVerifiedBadge}
                        productUrl={stack[stackIndex]?.product_url}
                        productImage={stack[stackIndex]?.product_image}
                        theme={options?.theme}
                        productName={stack[stackIndex]?.product_name}
                        productId={stack[stackIndex]?.product_id}
                        customerId={customerId}
                        // icon={options?.icon}
                        // iconColor={options?.iconColor}
                    />
                )

                stackIndex == stack.length
                    ? setStackIndex(0)
                    : setStackIndex(stackIndex + 1)
            }
        }
    }

    useEffect(() => {
        // console.log(orders);
        let stack = []
        orders.forEach((o) => {
            let order = o?.order
            let location = order?.location?.country
                ? order?.location?.country
                : 'Nearby'
            let name = order?.customer?.name
                ? order?.customer?.name
                : 'Someone'
            let time = moment(order?.createdAt).fromNow()
            order?.products?.edges?.forEach((p) => {
                let product = p?.product
                stack.push({
                    product_id: product?.product?.id,
                    product_name: product?.name,
                    product_url: product?.product?.onlineStoreUrl
                        ? product?.product?.onlineStoreUrl
                        : product?.product?.onlineStorePreviewUrl,
                    product_image:
                    product?.product?.images?.edges[0]?.image?.url,
                    location,
                    name,
                    time,
                })
            })
        })
        setStack(shuffle(stack))
        // console.log(stack);
    }, [orders])

    useLayoutEffect(() => {
        if (Object.keys(options).length !== 0) {
            // console.log(options);
            if (options?.dataSource === 'automatic') {
                fetch(`${process.env.API_URL}/${shop}/orders?api-token=${localStorage.getItem('pushyApiToken')}&shop=${shop}`).then(
                    (resp) =>
                        resp.json().then((response) => {
                            // console.log(response?.data?.orders?.edges);
                            setOrders(response?.data?.orders?.edges)
                        })
                )
            } else {
                let stack = []
                options?.manualOrdersList.forEach((data) => {
                    stack.push({
                        product_name: data.product,
                        location: data.location,
                        name: data.name,
                        product_url: '#',
                    })
                })
                setStack(shuffle(stack))
            }
        }
    }, [])

    useEffect(() => {
        if (stack?.length > 0) {
            if (!shownFirstToast) {
                setTimeout(() => {
                    showToast()
                    setShownFirstToast(true)
                    setIsToastShowing(true)
                }, options?.timeToFirstPopup * 1000)
            }
        }
    }, [stack])

    useEffect(() => {
        if (shownFirstToast) {
            setInterval(() => {
                setIsToastShowing(false)
                toast.dismiss()
            }, options?.popupDuration * 1000)
        }
    }, [shownFirstToast])

    useEffect(() => {
        if (stack?.length > 0) {
            if (!isToastShowing) {
                setTimeout(() => {
                    showToast()
                    setIsToastShowing(true)
                }, options?.timeBetweenPopups * 1000)
            }
        }
    }, [isToastShowing])

    return (
        <>
            <ToastContainer
                // position={options.popupPosition}
                // position="top-right"
                position="bottom-left"
                autoClose={false}
                hideProgressBar={true}
                pauseOnFocusLoss={true}
                newestOnTop={true}
                rtl={false}
                pauseOnHover
                closeButton={options?.showCloseButton}
                transition={setTransitionType()}
                closeOnClick={false}
                draggable={false}
                // theme={options?.theme}
            />
        </>
    )
}
