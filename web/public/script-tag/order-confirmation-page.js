async function load() {
    if (Shopify.digitallyAdded) {
        return;
    }

    Shopify.digitallyAdded = true;

    // const orderId = Shopify.checkout.order_id
    const currentURL = window.location.href;
    const checkoutToken = window.Shopify.Checkout.token;
    const orderToken = currentURL.match(/\/orders\/([^\/\?]+)/)?.[1];

    const scriptUrl = new URL(document.currentScript.src);
    const serverUrl = scriptUrl.origin;

    // add loading overlay

    const sidebar = document.querySelector(".sidebar")
    const overlay = document.createElement("div")
    overlay.style.position = "absolute"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100%"
    overlay.style.height = "100%"
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
    overlay.style.zIndex = "99999"
    overlay.style.justifyContent = "center"
    overlay.style.alignContent = "center"
    overlay.style.display = "flex"
    overlay.style.alignItems = "center"

    overlay.innerHTML = "<p>Your order is loading.<br />Please wait...<p>"
    overlay.style.color = "white"
    overlay.style.fontWeight = "bold"
    overlay.style.fontSize = "24px"
    overlay.style.textAlign = "center"

    //sidebar.appendChild(overlay)

    const token = checkoutToken || orderToken;
    renderDownloadButton(token);
    // try {
    //     const result = await fetch(`${serverUrl}/files/downloads/${orderId}?shop=${Shopify.shop}`)
    //     const json = await result.json()
    //
    //     if (json.error) {
    //         //overlay.remove()
    //         console.log("[Digitally] Error:", json.error)
    //         return
    //     }
    //
    //     const digitalProducts = json.digitalProducts
    //     console.log(digitalProducts)
    //
    //     if (!digitalProducts.length || digitalProducts.length === 0) {
    //         //overlay.remove()
    //         return
    //     }
    //
    //     renderDownloadButton(json.download);
    //
    //
    //
    //     /*
    //     const productNodes = document.querySelectorAll(".order-summary__section--product-list .product-table .product")
    //
    //     for (const productNode of productNodes) {
    //         const productId = productNode.getAttribute("data-product-id")
    //         const digitalProduct = digitalProducts.find(digitalProduct => digitalProduct.associatedProduct.id === 'gid://shopify/Product/' + productId)
    //         const files = digitalProduct?.files
    //
    //         if (digitalProduct && files.length) {
    //             const tr = document.createElement("tr")
    //             productNode.insertAdjacentElement('afterend', tr);
    //
    //             const td = document.createElement('td');
    //             td.setAttribute('colspan', '6');
    //
    //             const div = document.createElement("div")
    //             div.setAttribute("style", "display: flex !important; flex-direction: column; gap: 4px; margin-top: 8px; margin-bottom: 24px;")
    //
    //             td.appendChild(div)
    //             tr.appendChild(td)
    //
    //             for (const [index, file] of files.entries()) {
    //                 const isLastElement = index === files.length - 1
    //                 const div2 = document.createElement("div")
    //                 div2.setAttribute("style", `display: flex !important; justify-content: space-between !important; align-items: center, gap: 16px !important; padding-top: 6px; padding-bottom: 6px; ${!isLastElement ? "border-bottom: 1px solid rgba(172, 172, 172, 0.34);" : ""}`)
    //
    //                 const pFileName = document.createElement("p")
    //                 pFileName.setAttribute("style", "text-align: start; font-weight: 600; font-size: 12px;")
    //                 pFileName.textContent = file.file.fileName
    //
    //                 const a = document.createElement("a")
    //                 a.setAttribute("style", "white-space: nowrap")
    //                 a.setAttribute('target', '_blank')
    //                 a.href = file.file.url
    //                 a.textContent = "Download"
    //                 a.download = file.file.fileName
    //
    //
    //                 div2.appendChild(pFileName)
    //                 div2.appendChild(a)
    //                 div.appendChild(div2)
    //             }
    //         }
    //     }*/
    // } catch (error) {
    //     console.log("[Digitally] Error:", error)
    // }

    //overlay.remove()

    function renderDownloadButton(token) {
        const downloadUrl = `https://digitally.conversionproplus.com/file/${token}/download`;

        Shopify.Checkout.OrderStatus.addContentBox(
            `<h2>Download Files</h2>`,
            `<p>Your downloads files are ready for downloads. Click below button to access download page.</p>`,
            `<a target="_blank" class="btn btn--size-small" href="${downloadUrl}">Download Files</a>`
        );
    }
}

load()



// (function () {
//     const currentURL = window.location.href;
//     const checkoutToken = window.Shopify.Checkout.token;
//     // Matches both order token and order id from the URL
//     const orderToken = currentURL.match(/\/orders\/([^\/\?]+)/)?.[1];
//     const shop = window.Shopify.shop;
//     const locale = window.Shopify.locale;
//     const baseUrl = 'https://api.digitaldownloadsapp.com/v1/orders/TOKEN';
//     const pollingDelay = 3000;
//     const requestsLimit = 10;
//     let requestsCount = 0;
//
//     const apiUrl = new URL(baseUrl.replace('TOKEN', orderToken || checkoutToken));
//     apiUrl.search = new URLSearchParams({ shopify_domain: shop, locale: locale, poll: true }).toString();
//
//     function renderDownloadButton(order) {
//         Shopify.Checkout.OrderStatus.addContentBox(
//             `<h2>${order.status_page.title}</h2>`,
//             `<p>${order.status_page.description}</p>`,
//             `<a target="_blank" class="btn btn--size-small" href="${order.download_url}">${order.status_page.action}</a>`
//         );
//     }
//
//     function pollOrderStatus() {
//         if (requestsCount >= requestsLimit) return;
//         setTimeout(loadDigitalOrder, pollingDelay);
//     }
//
//     function loadDigitalOrder() {
//         requestsCount++;
//         fetch(apiUrl)
//             .then(response => response.json())
//             .then(order => {
//                 if (order.error) {
//                     switch (order.error) {
//                         case 'Order not found':
//                             pollOrderStatus();
//                             break;
//                     }
//                 } else {
//                     if (!order.status_page.enabled) return;
//
//                     switch (order.status) {
//                         case 'delivered':
//                             renderDownloadButton(order);
//                             break;
//                         case 'processing':
//                             pollOrderStatus();
//                             break;
//                     }
//                 }
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     }
//
//     loadDigitalOrder();
// })();
