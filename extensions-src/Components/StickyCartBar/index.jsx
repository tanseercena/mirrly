import { useEffect, useLayoutEffect, useState } from "react";

import "./style.css";

export const StickyCartBar = ({
    shop,
    options,
    campaignId,
    product,
    productPrice,
    moneyFormat,
    currency,
    customerId,
}) => {
    const [showBar, setShowBar] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isbuttonHovered, setIsButtonHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
    const [variant, setVaraint] = useState({});
    const [price, setPrice] = useState("");
    const [isInCart, setIsInCart] = useState(false);

    const onScroll = () => {
        // Get the current scroll position
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

        // Calculate the document height and viewport height
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const viewportHeight = window.innerHeight;

        // Calculate the scroll percentage
        const scrollPercent = (scrollTop / (docHeight - viewportHeight)) * 100;

        // Check if the user has scrolled at least 10% of the screen
        if (scrollPercent >= 20 && scrollPercent <= 95) {
            // Do something when the user has scrolled at least 10% of the screen
            setShowBar(true);
        } else {
            setShowBar(false);
        }
    };

    window.addEventListener("scroll", onScroll);

    const barStyles = {
        backgroundColor: options.backgroundColor,
        color: options.textColor,
        display: showBar ? "flex" : "none",
    };

    const quantityStyles = {
        borderColor: options.textColor,
    };
    const selectStyles = {
        backgroundColor: options.textColor,
        color: options.backgroundColor,
    };

    const buttonStyles = {
        backgroundColor: isbuttonHovered
            ? options.backgroundColor
            : options.textColor,
        color: isbuttonHovered
            ? options.textColor
            : options.backgroundColor,
        borderColor: options.textColor,
    };

    const loaderStyles = {
        borderTopColor: isbuttonHovered
            ? options.textColor
            : options.backgroundColor,
    };

    const addToCart = async () => {
        setIsLoading(true);
        if (quantity < 1) {
            setIsLoading(false);
            setDisplayErrorMessage(true);
            checkInCart();
        } else {
            let form = new FormData();
            form.append("customer_id", customerId ? customerId : 0);
            fetch(
                `${process.env.API_URL}/${shop}/${campaignId}/cart_adds`,
                {
                    method: "POST",
                    body: form,
                }
            );
            let payload;
            if (isInCart) {
                const updates = {};
                updates[variant.id] = quantity;
                payload = {
                    updates,
                    id: variant.id,
                };
            } else {
                payload = {
                    id: variant.id,
                    quantity: quantity,
                };
            }
            try {
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                const url = isInCart
                    ? `${window.Shopify.routes.root}cart/update.js`
                    : `${window.Shopify.routes.root}cart/add.js`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    setIsLoading(false);
                    checkInCart();
                }
            } catch (error) {
                setIsLoading(false);
                checkInCart();
            }
        }
    };

    const formatPrice = (price, currencyCode) => {
        const formattedPrice = (price / 100).toLocaleString(undefined, {
            style: "currency",
            currency: currencyCode,
        });

        return formattedPrice.replace(currency, "").trimStart();
    };

    const checkInCart = () => {
        setIsLoading(true);
        try {
            fetch(`${window.Shopify.routes.root}cart.js`)
                .then((response) => response.json())
                .then((data) => {
                    setIsLoading(false);
                    let inCart = data.items.find(
                        (item) => item.id == variant.id
                    );
                    if (inCart) {
                        setIsInCart(true);
                        setQuantity(inCart.quantity);
                        setDisplayErrorMessage(false);
                    } else {
                        setIsInCart(false);
                        setQuantity(1);
                        setDisplayErrorMessage(false);
                    }
                });
        } catch (error) { }
    };

    useEffect(() => {
        if (quantity > 0) {
            setDisplayErrorMessage(false);
        }
    }, [quantity]);

    useEffect(() => {
        checkInCart();

        if (variant.price) {
            if (moneyFormat.includes("{{amount_with_comma_separator}}")) {
                setPrice(
                    moneyFormat.replace(
                        "{{amount_with_comma_separator}}",
                        formatPrice(variant.price, currency)
                    )
                );
            } else {
                setPrice(
                    moneyFormat.replace(
                        "{{amount}}",
                        formatPrice(variant.price, currency)
                    )
                );
            }
        }
    }, [variant]);

    useLayoutEffect(() => {
        setVaraint(product.variants[0]);
        // console.log(productPrice);
        // console.log(moneyFormat);
        // console.log(currency);
        // console.log(moneyFormat.replace("{{amount}}", productPrice));
        // setPrice(moneyFormat.replace("{{amount}}", productPrice));
    }, []);

    return (
        <>
            <div className="pushy-stcky-add-to-cart-bar" style={barStyles}>
                <div className="pushy-sticky-add-to-cart-bar-info">
                    <p>{product.title}</p>
                    {product.variants.length > 1 && (
                        <select
                            style={selectStyles}
                            onChange={(e) =>
                                setVaraint(
                                    product.variants.find(
                                        (variant) =>
                                            variant.id == e.target.value
                                    )
                                )
                            }
                        >
                            {product.variants.map((variant) => (
                                <option key={variant.id} value={variant.id}>
                                    {variant.public_title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="pushy-sticky-add-to-cart-bar-meta">
                    {options.showProductPrice && (
                        <div className="pushy-sticky-add-to-cart-bar-price">
                            <p>
                                {price
                                    ? price
                                    : moneyFormat.replace(
                                        "{{amount}}",
                                        productPrice
                                    )}
                            </p>
                            {/* {displayErrorMessage && (
                                <p style={{ color: "red" }}>
                                    Quantity is zero (0)
                                </p>
                            )} */}
                        </div>
                    )}

                    <div
                        className="pushy-sticky-add-to-cart-bar-actions"
                        style={{ flexDirection: "column" }}
                    >
                        <div className="pushy-sticky-add-to-cart-bar-actions-button">
                            <div className="pushy-sticky-add-to-cart-bar-quantity">
                                <button
                                    className="minus"
                                    onClick={() =>
                                        quantity > 0 &&
                                        setQuantity(Number(quantity) - 1)
                                    }
                                    style={quantityStyles}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    style={quantityStyles}
                                />
                                <button
                                    className="plus"
                                    onClick={() =>
                                        setQuantity(Number(quantity) + 1)
                                    }
                                    style={quantityStyles}
                                >
                                    +
                                </button>
                            </div>

                            <div className="pushy-sticky-add-to-cart-bar-buttons">
                                <button
                                    style={buttonStyles}
                                    onMouseEnter={() =>
                                        setIsButtonHovered(!isbuttonHovered)
                                    }
                                    onMouseLeave={() => {
                                        setIsButtonHovered(!isbuttonHovered);
                                    }}
                                    onClick={addToCart}
                                >
                                    {isLoading ? (
                                        <div
                                            className="pushy-sticky-add-to-cart-bar-loader"
                                            style={loaderStyles}
                                        ></div>
                                    ) : isInCart ? (
                                        "Update cart"
                                    ) : (
                                        "Add to cart"
                                    )}
                                </button>
                            </div>
                        </div>

                        {isInCart && (
                            <a
                                className="pushy-sticky-add-to-cart-bar-link"
                                href={`${window.Shopify.routes.root}cart`}
                            >
                                View cart & checkout
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
