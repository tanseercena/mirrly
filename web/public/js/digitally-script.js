(function () {
    let scriptName = "digitally-script.js";
    let jQuery;
    let jqueryPath = "//ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
    let jqueryVersion = "3.6.0";
    // let baseUrl = 'https://digitally.test';
    let baseUrl = 'https://digitally.conversionproplus.com';
    let settings = null;
    let scriptTag;

    let translations = {};
    let currentLocale = 'en';


    function t(key, replacements = {}) {
        let text = translations[key] || key;
        Object.keys(replacements).forEach(placeholder => {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        });

        return text;
    }

    function getPlural(count) {
        return count !== 1 ? 's' : '';
    }

    function initjQuery() {
        jQuery = window.jQuery.noConflict(true);
        main();
    }

    var allScripts = document.getElementsByTagName('script');
    var targetScripts = [];
    for (var i in allScripts) {
        var name = allScripts[i].src;
        if (name && name.indexOf(scriptName) > 0)
            targetScripts.push(allScripts[i]);
    }

    scriptTag = targetScripts[targetScripts.length - 1];

    function loadScript(src, onLoad) {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", src);

        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    onLoad();
                }
            };
        } else {
            script_tag.onload = onLoad;
        }
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    }

    function getScriptTag() {
        var allScripts = document.getElementsByTagName('script');
        var targetScripts = [];
        for (var i in allScripts) {
            var name = allScripts[i].src;
            if (name && name.indexOf(scriptName) > 0)
                targetScripts.push(allScripts[i]);
        }

        return targetScripts[targetScripts.length - 1];
    }

    function loadCss(href) {
        var link_tag = document.createElement('link');
        link_tag.setAttribute("type", "text/css");
        link_tag.setAttribute("rel", "stylesheet");
        link_tag.setAttribute("href", href);
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
    }

    if (window.jQuery === undefined || window.jQuery.fn.jquery !== jqueryVersion) {
        loadScript(jqueryPath, initjQuery);
    } else {
        initjQuery();
    }

    function main() {
        jQuery(document).ready(function ($) {
            showDownloadButtonAndMessage();
            handleVariantChange();
            handleHomeVariantChange();
            handleQuickAddModal();
        });
    }

    function handleProductRestriction(data, $modal) {
        if (data.isProductRestricted) {
            jQuery('.country-restriction-message, .digitally-restriction-modal').remove();

            const restrictionTitle = data.restrictionTitle || t('access_restricted');
            const restrictionMessage = data.restrictionMessage || t('product_not_available');

            const $restrictionModal = jQuery('<div></div>')
                .addClass('digitally-restriction-modal')
                .css({
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    color: '#fff',
                    fontSize: '18px',
                    textAlign: 'center',
                    padding: '20px'
                })
                .html(`
                    <div style="background:#f44336; padding:25px 40px; border-radius:8px; max-width:400px;">
                        ⚠️ <strong>${restrictionTitle}</strong>
                        <p style="margin-top:10px;">
                            ${restrictionMessage}
                        </p>
                    </div>
                `)

            jQuery('body').append($restrictionModal);

            const addToCartSelectors = $modal ?
                '.quick-add-modal [name="add"], .quick-add-modal .add-to-cart, .quick-add-modal .add_to_cart_button, .quick-add-modal .product-form__submit' :
                '[name="add"], .add-to-cart, .add_to_cart_button, .product-form__submit, button[type="submit"]';
            jQuery(addToCartSelectors).prop('disabled', true).addClass('disabled').css('opacity', '0.5');

            const quantitySelectors = $modal ?
                '.quick-add-modal .quantity, .quick-add-modal .quantity-selector' :
                '.quantity, .quantity-selector, .product-form__quantity';
            jQuery(quantitySelectors).hide();

            jQuery('#DownloadSampleFilesButton').hide();

            setTimeout(() => {
                $restrictionModal.remove();
                window.history.back();
            }, 3000);

            return true;
        }

        return false;
    }

    function getShop() {
        let shop = jQuery("#cpp-shop").val() || '';
        if (shop === '') {
            shop = Shopify.shop || '';
        }
        if (shop === '') {
            shop = scriptTag.src.split("shop=")[1] || '';
        }
        if (shop === '') {
            scriptTag = getScriptTag();
            shop = scriptTag.src.split("shop=")[1];
        }
        return shop;
    }

    function getLocale() {
        if (window.Shopify && window.Shopify.locale) {
            return window.Shopify.locale;
        }

        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
            return htmlLang.split('-')[0];
        }

        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang ? browserLang.split('-')[0] : 'en';
    }

    function cleanupEventListeners(quantitySelector, addToCartSelector, plusButtonSelector, drawerPlusCartButton, drawerQuantityInput, modalQuantitySelector, modalAddToCartSelector, modalPlusButtonSelector) {
        jQuery(quantitySelector).off('change keyup input');
        jQuery(plusButtonSelector).off('click');
        jQuery(document).off('click', addToCartSelector);
        jQuery(document).off('click', drawerPlusCartButton);
        jQuery(document).off('change', drawerQuantityInput);
        jQuery(document).off('input', drawerQuantityInput);
        jQuery(modalQuantitySelector).off('change keyup input');
        jQuery(modalPlusButtonSelector).off('click');
        jQuery(document).off('click', modalAddToCartSelector);
    }

    function showDownloadButtonAndMessage() {
        let pageType = jQuery("#digitally-page-type").val();
        let productId = '';
        let variantId = '';

        // Check if quick add modal is open
        const $modal = jQuery('.quick-add-modal[open]');
        if ($modal.length && pageType === 'collection') {
            productId = $modal.find('input[name="product-id"]').val();
            variantId = $modal.find('input[name="id"]').val() || getSelectedVariantId();
        } else if (pageType === 'index') {
            productId = jQuery("input[name='product-id']").val();
            variantId = jQuery("input[name='id']").val();
        } else if (pageType === 'product') {
            productId = jQuery("#digitally-product-id").val();
            variantId = getSelectedVariantId();
        } else {
            return; // Exit if no valid page type
        }

        if (!productId || !variantId) {
            console.warn("Missing productId or variantId");
            return;
        }

        currentLocale = getLocale();

        jQuery.ajax(baseUrl + '/api/' + getShop() + '/retrieve-product-details/' + productId, {
            data: {
                variant_id: variantId,
                locale: currentLocale
            },
            method: 'GET'
        })
            .done(function (data) {
                if (data.translations) {
                    translations = data.translations;
                }

                jQuery('#DownloadSampleFilesButton').remove();
                jQuery('.product-message').remove();
                jQuery('.license-out-of-stock').remove();
                jQuery('.license-limit-notification').remove();
                jQuery(".digitally-code-remaining").remove();
                jQuery('.country-restriction-message').remove();

                if ($modal.length) {
                    const modalAddToCartBtn = jQuery('.quick-add-modal [name="add"], .quick-add-modal .add-to-cart, .quick-add-modal .add_to_cart_button');
                    modalAddToCartBtn.prop('disabled', false).removeAttr('disabled').removeClass('disabled').css('opacity', '1');
                } else {
                    const addToCartBtn = jQuery('[name="add"], .add-to-cart, .add_to_cart_button, .product-form__submit');
                    addToCartBtn.prop('disabled', false).removeAttr('disabled').removeClass('disabled').css('opacity', '1');
                    jQuery('.quantity, .quantity-selector, .product-form__quantity').show();
                }

                const isRestricted = handleProductRestriction(data, $modal.length ? $modal : null);

                if (!isRestricted) {
                    if (data.hasSampleFiles) {
                        addDownloadButton($modal.length ? $modal : null);
                    }

                    if (data.productMessage && data.productMessage.is_product_message_enabled) {
                        addProductMessage(data.productMessage.product_message, $modal.length ? $modal : null);
                    }

                    if (data.licenseTrackingEnabled && data.licenseTracking && data.licenseTracking.limit_cart_quantity &&
                        typeof data.licenseTracking.codes_remaining !== 'undefined' && data.licenseTracking.codes_remaining != -1) {
                        const selectors = data.licenseTracking.selectors || {};
                        addVariantRemainingCodes(data.licenseTracking.codes_remaining, $modal.length ? $modal : null);

                        cleanupEventListeners(
                            selectors.quantityInput || 'input[name="quantity"], [name="quantity"]',
                            selectors.addToCartButton || '[name="add"], .add-to-cart, .add_to_cart_button',
                            selectors.plusButton || 'form [data-action="increase-quantity"], .quantity-up, .plus',
                            selectors.drawerPlusCartButton || '#CartDrawer-Form .quantity__button[name="plus"]',
                            selectors.drawerQuantityInput || '.quantity__input',
                            selectors.modalQuantityInput || '.quick-add-modal input[name="quantity"], .quick-add-modal [name="quantity"]',
                            selectors.modalAddToCartButton || '.quick-add-modal [name="add"], .quick-add-modal .add-to-cart, .quick-add-modal .add_to_cart_button',
                            selectors.modalPlusButton || '.quick-add-modal [data-action="increase-quantity"], .quick-add-modal .quantity-up, .quick-add-modal .plus'
                        );

                        limitQuantityBasedOnLicenses(
                            data.licenseTracking.codes_remaining,
                            selectors.quantityInput || 'input[name="quantity"], [name="quantity"]',
                            selectors.addToCartButton || '[name="add"], .add-to-cart, .add_to_cart_button',
                            selectors.plusButton || 'form [data-action="increase-quantity"], .quantity-up, .plus',
                            selectors.modalQuantityInput || '.quick-add-modal input[name="quantity"], .quick-add-modal [name="quantity"]',
                            selectors.modalAddToCartButton || '.quick-add-modal [name="add"], .quick-add-modal .add-to-cart, .quick-add-modal .add_to_cart_button',
                            selectors.modalPlusButton || '.quick-add-modal [data-action="increase-quantity"], .quick-add-modal .quantity-up, .quick-add-modal .plus'
                        );

                        addCartMonitoring(data);
                    }
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error("Error checking for product details:", textStatus, errorThrown);
            });
    }

    function addDownloadButton($modal) {
        let buttonContainer = $modal ? $modal.find('.product-form__buttons') : jQuery('.product-form__buttons');
        jQuery('#DownloadSampleFilesButton').remove();
        let variant_id = getSelectedVariantId();

        let downloadButton = jQuery('<button></button>')
            .attr('id', 'DownloadSampleFilesButton')
            .attr('type', 'button')
            .addClass('product-form__submit button button--full-width button--secondary')
            .text(t('download_sample_files'))
            .css({
                'margin-top': '15px',
                'margin-bottom': '15px',
            })
            .on('click', function () {
                let productId = $modal ? $modal.find('input[name="product-id"]').val() : jQuery("#digitally-product-id").val();
                let downloadUrl = baseUrl + '/sample/' + productId + '/download/' + variant_id;
                window.open(downloadUrl, '_blank');
            });

        buttonContainer.append(downloadButton);
    }

    function addProductMessage(message, $modal) {
        const $priceWrapper = $modal ?
            $modal.find(".product__price, .price-wrapper, .product-price, .price-container, .price__container") :
            jQuery(".product__price, .price-wrapper, .product-price, .price-container, .price__container");

        let productMessageDiv = jQuery('<div></div>')
            .addClass('product-message')
            .text(message)
            .css({
                'color': '#333',
                'font-size': '14px',
                'text-align': 'left',
                'width': '100%',
                'box-sizing': 'border-box',
            });

        if ($priceWrapper.length) {
            $priceWrapper.before(productMessageDiv);
        }
    }

    function addVariantRemainingCodes(codes, $modal) {
        const $priceWrapper = $modal ?
            $modal.find(".product__price, .price-wrapper, .product-price, .price-container, .price__container") :
            jQuery(".product__price, .price-wrapper, .product-price, .price-container, .price__container");

        let codeRemDiv = jQuery('<input type="hidden" value="'+codes+'">')
            .addClass('digitally-code-remaining');

        if ($priceWrapper.length) {
            $priceWrapper.before(codeRemDiv);
        }
    }

    function getSelectedVariantId() {
        let pageType = jQuery("#digitally-page-type").val();
        const $modal = jQuery('.quick-add-modal[open]');

        if ($modal.length && pageType === 'collection') {
            const variantId = $modal.find('input[name="id"]').val();
            if (variantId) return variantId;

            // Fallback to JSON data in variant-selects
            const variantJsonScript = $modal.find('variant-selects script[type="application/json"]').first();
            if (variantJsonScript.length) {
                try {
                    const variants = JSON.parse(variantJsonScript.text());
                    const selectedVariant = $modal.find('input[name="Color"]:checked').val() || variants[0].option1;
                    const variant = variants.find(v => v.option1 === selectedVariant);
                    return variant ? variant.id.toString() : null;
                } catch (e) {
                    console.error("Error parsing variant JSON:", e);
                }
            }
            return null;
        }

        if (pageType === 'index') {
            return jQuery("input[name='id']").val();
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('variant')) {
            return urlParams.get('variant');
        }

        const variantInput = jQuery('input[name="id"], select[name="id"], [data-product-select], [data-variant-id]').first();
        if (variantInput.length && variantInput.val()) {
            return variantInput.val();
        }

        if (window.meta && window.meta.product && window.meta.selected_variant) {
            return window.meta.selected_variant.id;
        }

        const productJson = getProductJson();
        if (productJson && productJson.variants && productJson.variants.length > 0) {
            return productJson.variants[0].id;
        }

        return null;
    }

    function getProductJson() {
        const jsonScripts = document.querySelectorAll('script[type="application/json"]');
        for (let i = 0; i < jsonScripts.length; i++) {
            try {
                const json = JSON.parse(jsonScripts[i].textContent);
                if (json && json.id && json.variants) {
                    return json;
                }
            } catch (e) {}
        }

        if (window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product) {
            return window.ShopifyAnalytics.meta.product;
        }

        return null;
    }

    function limitQuantityBasedOnLicenses(codesRemaining, quantitySelector, addToCartSelector, plusButtonSelector, modalQuantitySelector, modalAddToCartSelector, modalPlusButtonSelector) {
        validateAvailableLicenses(true);

        function validateAvailableLicenses(initialLoad = false) {
            checkCurrentCartQuantity(function(cartQuantity) {
                const actualAvailable = Math.max(0, codesRemaining - cartQuantity);
                const quantityInput = jQuery(quantitySelector);
                const modalQuantityInput = jQuery(modalQuantitySelector);

                // Handle product page quantity input
                if (quantityInput.length) {
                    quantityInput.attr('max', actualAvailable);

                    const currentVal = parseInt(quantityInput.val()) || 1;
                    if (currentVal > actualAvailable) {
                        quantityInput.val(actualAvailable > 0 ? actualAvailable : 1);

                        if (!initialLoad) {
                            const message = cartQuantity > 0 ?
                                t('licenses_in_cart', {
                                    count: actualAvailable,
                                    plural: getPlural(actualAvailable),
                                    cartCount: cartQuantity
                                }) :
                                t('only_licenses_available', {
                                    count: actualAvailable,
                                    plural: getPlural(actualAvailable)
                                });
                            showLicenseNotification(message, quantitySelector);
                        }
                    }

                    const addToCartBtn = jQuery(addToCartSelector);
                    if (actualAvailable <= 0) {
                        addToCartBtn.prop('disabled', true);
                        addToCartBtn.attr('disabled', 'disabled');
                        addToCartBtn.addClass('disabled');

                        const message = cartQuantity > 0 ?
                            t('all_licenses_in_cart', { count: cartQuantity }) :
                            t('out_of_license_codes');
                        jQuery('.license-out-of-stock').remove();
                        addToCartBtn.before(`<div class="license-out-of-stock" style="color: red; margin-bottom: 10px;">${message}</div>`);

                        if (!initialLoad) {
                            showLicenseNotification(message, quantitySelector);
                        }
                    } else {
                        addToCartBtn.prop('disabled', false);
                        addToCartBtn.removeAttr('disabled');
                        addToCartBtn.removeClass('disabled');
                        jQuery('.license-out-of-stock').remove();
                    }
                }

                // Handle modal quantity input
                if (modalQuantityInput.length) {
                    modalQuantityInput.attr('max', actualAvailable);

                    const currentVal = parseInt(modalQuantityInput.val()) || 1;
                    if (currentVal > actualAvailable) {
                        modalQuantityInput.val(actualAvailable > 0 ? actualAvailable : 1);

                        if (!initialLoad) {
                            const message = cartQuantity > 0 ?
                                t('licenses_in_cart', {
                                    count: actualAvailable,
                                    plural: getPlural(actualAvailable),
                                    cartCount: cartQuantity
                                }) :
                                t('only_licenses_available', {
                                    count: actualAvailable,
                                    plural: getPlural(actualAvailable)
                                });
                            showLicenseNotification(message, modalQuantitySelector);
                        }
                    }

                    const modalAddToCartBtn = jQuery(modalAddToCartSelector);
                    if (actualAvailable <= 0) {
                        modalAddToCartBtn.prop('disabled', true);
                        modalAddToCartBtn.attr('disabled', 'disabled');
                        modalAddToCartBtn.addClass('disabled');

                        const message = cartQuantity > 0 ?
                            t('all_licenses_in_cart', { count: cartQuantity }) :
                            t('out_of_license_codes');
                        jQuery('.license-out-of-stock').remove();
                        modalAddToCartBtn.before(`<div class="license-out-of-stock" style="color: red; margin-bottom: 10px;">${message}</div>`);

                        if (!initialLoad) {
                            showLicenseNotification(message, modalQuantitySelector);
                        }
                    } else {
                        modalAddToCartBtn.prop('disabled', false);
                        modalAddToCartBtn.removeAttr('disabled');
                        modalAddToCartBtn.removeClass('disabled');
                        jQuery('.license-out-of-stock').remove();
                    }
                }
            });
        }

        const quantityInput = jQuery(quantitySelector);
        quantityInput.on('change keyup input', function() {
            validateAvailableLicenses();
        });

        jQuery(plusButtonSelector).on('click', function(e) {
            setTimeout(function() {
                validateAvailableLicenses();
            }, 100);
        });

        const modalQuantityInput = jQuery(modalQuantitySelector);
        modalQuantityInput.on('change keyup input', function() {
            validateAvailableLicenses();
        });

        jQuery(modalPlusButtonSelector).on('click', function(e) {
            setTimeout(function() {
                validateAvailableLicenses();
            }, 100);
        });

        jQuery(document).on('click', addToCartSelector, function(e) {
            const addToCartBtn = jQuery(this);

            if (addToCartBtn.data('validated') === true) {
                addToCartBtn.data('validated', false);
                return true;
            }

            if (addToCartBtn.data('processing')) {
                e.preventDefault();
                return false;
            }

            e.preventDefault();
            e.stopPropagation();
            addToCartBtn.data('processing', true);

            checkCurrentCartQuantity(function(cartQuantity) {
                const actualAvailable = Math.max(0, codesRemaining - cartQuantity);
                const requestedQuantity = parseInt(quantityInput.val()) || 1;

                if (requestedQuantity > actualAvailable) {
                    addToCartBtn.data('processing', false);
                    const message = cartQuantity > 0 ?
                        t('licenses_in_cart', {
                            count: actualAvailable,
                            plural: getPlural(actualAvailable),
                            cartCount: cartQuantity
                        }) :
                        t('only_licenses_available', {
                            count: actualAvailable,
                            plural: getPlural(actualAvailable)
                        });
                    showLicenseNotification(message, quantitySelector);
                    quantityInput.val(actualAvailable > 0 ? actualAvailable : 1);
                } else if (actualAvailable <= 0) {
                    addToCartBtn.data('processing', false);
                    showLicenseNotification(t('no_licenses_available'), quantitySelector);
                } else {
                    addToCartBtn.data('processing', false);
                    addToCartBtn.data('validated', true);
                    addToCartBtn.trigger('click');
                }
            });

            return false;
        });

        jQuery(document).on('click', modalAddToCartSelector, function(e) {
            const modalAddToCartBtn = jQuery(this);

            if (modalAddToCartBtn.data('validated') === true) {
                modalAddToCartBtn.data('validated', false);
                return true;
            }

            if (modalAddToCartBtn.data('processing')) {
                e.preventDefault();
                return false;
            }

            e.preventDefault();
            e.stopPropagation();
            modalAddToCartBtn.data('processing', true);

            checkCurrentCartQuantity(function(cartQuantity) {
                const actualAvailable = Math.max(0, codesRemaining - cartQuantity);
                const requestedQuantity = parseInt(modalQuantityInput.val()) || 1;

                if (requestedQuantity > actualAvailable) {
                    modalAddToCartBtn.data('processing', false);
                    const message = cartQuantity > 0 ?
                        t('licenses_in_cart', {
                            count: actualAvailable,
                            plural: getPlural(actualAvailable),
                            cartCount: cartQuantity
                        }) :
                        t('only_licenses_available', {
                            count: actualAvailable,
                            plural: getPlural(actualAvailable)
                        });
                    showLicenseNotification(message, modalQuantitySelector);
                    modalQuantityInput.val(actualAvailable > 0 ? actualAvailable : 1);
                } else if (actualAvailable <= 0) {
                    modalAddToCartBtn.data('processing', false);
                    showLicenseNotification(t('no_licenses_available'), modalQuantitySelector);
                } else {
                    modalAddToCartBtn.data('processing', false);
                    modalAddToCartBtn.data('validated', true);
                    // Use AJAX to add to cart
                    const form = modalAddToCartBtn.closest('form');
                    const formData = new FormData(form[0]);
                    jQuery.ajax({
                        url: '/cart/add.js',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function() {
                            // Trigger cart drawer update
                            jQuery(document).trigger('ajaxCart.afterCartLoad');
                            // Close modal
                            jQuery('.quick-add-modal[open]').removeAttr('open');
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.error('Error adding to cart:', textStatus, errorThrown);
                            showLicenseNotification(t('error_adding_to_cart'), modalQuantitySelector);
                        }
                    });
                }
            });

            return false;
        });
    }

    function checkCurrentCartQuantity(callback) {
        let productId = jQuery("#digitally-product-id").val();
        let variantId = getSelectedVariantId();

        let pageType = jQuery("#digitally-page-type").val();
        if (pageType == 'index') {
            productId = jQuery("input[name='product-id']").val();
            variantId = jQuery("input[name='id']").val();
        } else if (pageType == 'collection') {
            const $modal = jQuery('.quick-add-modal[open]');
            productId = $modal.find('input[name="product-id"]').val();
            variantId = $modal.find('input[name="id"]').val() || getSelectedVariantId();
        }

        jQuery.getJSON('/cart.js', function(cart) {
            let quantityInCart = 0;

            cart.items.forEach(function(item) {
                if (item.product_id.toString() === productId.toString() &&
                    item.variant_id.toString() === variantId.toString()) {
                    quantityInCart += item.quantity;
                }
            });

            callback(quantityInCart);
        })
            .fail(function() {
                callback(0);
            });
    }

    function showLicenseNotification(message, selector) {
        jQuery('.license-limit-notification').remove();

        const notification = jQuery('<div class="license-limit-notification" style="background-color: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 4px;">' + message + '</div>');

        const quantityContainer = jQuery(selector).closest('div');
        if (quantityContainer.length) {
            quantityContainer.after(notification);
        } else {
            const addToCartBtn = jQuery(selector.includes('quick-add-modal') ? '.quick-add-modal [name="add"], .quick-add-modal .add-to-cart, .quick-add-modal .add_to_cart_button' : '[name="add"], .add-to-cart, .add_to_cart_button');
            if (addToCartBtn.length) {
                addToCartBtn.before(notification);
            } else {
                jQuery('form[action="/cart/add"]').append(notification);
            }
        }

        setTimeout(function() {
            notification.fadeOut(500, function() {
                jQuery(this).remove();
            });
        }, 5000);
    }

    function handleVariantChange() {
        let lastUrl = location.href;

        window.addEventListener('popstate', function() {
            checkUrlChange();
        });

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(this, arguments);
            checkUrlChange();
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            checkUrlChange();
        };

        function checkUrlChange() {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                const oldUrl = lastUrl;
                lastUrl = currentUrl;

                const oldUrlObj = new URL(oldUrl);
                const newUrlObj = new URL(currentUrl);

                const oldVariant = oldUrlObj.searchParams.get('variant');
                const newVariant = newUrlObj.searchParams.get('variant');

                if (oldVariant !== newVariant) {
                    console.log(`Variant changed from ${oldVariant} to ${newVariant}`);
                    showDownloadButtonAndMessage();
                }
            }
        }

        jQuery('select[name="id"], .single-option-selector').on('change', function() {
            setTimeout(showDownloadButtonAndMessage, 100);
        });
    }

    function handleHomeVariantChange() {
        jQuery(document).on('change', 'input[name="id"]', function() {
            setTimeout(showDownloadButtonAndMessage, 100);
        });
    }

    function handleQuickAddModal() {
        // Handle quick add button click
        jQuery(document).on('click', '.quick-add__submit, [data-quick-add-button]', function(e) {
            const $this = jQuery(this);
            const productId = $this.data('product-id') || $this.closest('.card-product, .product-card').find('input[name="product-id"]').val();
            const modal = jQuery('.quick-add-modal');

            if (productId && modal.length) {
                modal.find('#digitally-product-id').val(productId);
                // Wait for modal to open and DOM to update
                setTimeout(function() {
                    // Ensure initial variant is fetched
                    const $modal = jQuery('.quick-add-modal[open]');
                    if ($modal.length) {
                        const variantId = $modal.find('input[name="id"]').val() || getSelectedVariantId();
                        if (variantId) {
                            showDownloadButtonAndMessage();
                        } else {
                            console.warn("Initial variant ID not found in modal");
                        }
                    }
                }, 300); // Increased delay to ensure modal DOM is ready
            }
        });

        // Handle variant change in modal
        jQuery(document).on('change', '.quick-add-modal input[name="Color"]', function() {
            const $modal = jQuery(this).closest('.quick-add-modal');
            const variantId = $modal.find('input[name="id"]').val();
            if (variantId) {
                setTimeout(showDownloadButtonAndMessage, 100);
            }
        });

        // Observe modal opening
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'open') {
                    const $modal = jQuery(mutation.target);
                    if ($modal.is('.quick-add-modal') && $modal.attr('open') !== undefined) {
                        const productId = $modal.find('input[name="product-id"]').val();
                        $modal.find('#digitally-product-id').val(productId);
                        const variantId = $modal.find('input[name="id"]').val() || getSelectedVariantId();
                        if (productId && variantId) {
                            setTimeout(showDownloadButtonAndMessage, 100);
                        }
                    }
                }
            });
        });

        jQuery('.quick-add-modal').each(function() {
            observer.observe(this, { attributes: true });
        });
    }

    function addCartMonitoring(data) {
        if (data.licenseTrackingEnabled && data.licenseTracking &&
            data.licenseTracking.limit_cart_quantity &&
            typeof data.licenseTracking.codes_remaining !== 'undefined' &&
            data.licenseTracking.codes_remaining != -1) {
            const selectors = data.licenseTracking.selectors || {};
            monitorCartDrawerQuantityChanges(
                data.licenseTracking.codes_remaining,
                selectors.drawerPlusCartButton || '#CartDrawer-Form .quantity__button[name="plus"]',
                selectors.drawerQuantityInput || '.quantity__input'
            );
        }
    }

    function monitorCartDrawerQuantityChanges(codesRemaining, drawerPlusCartButton, drawerQuantityInput) {
        document.addEventListener('click', function(e) {
            if (e.target.matches(drawerPlusCartButton) || e.target.closest(drawerPlusCartButton)) {
                const plusButton = e.target.matches(drawerPlusCartButton) ?
                    e.target : e.target.closest(drawerPlusCartButton);

                let quantityInput;
                const quantityWrapper = plusButton.closest('.quantity');
                if (quantityWrapper) {
                    quantityInput = quantityWrapper.querySelector(drawerQuantityInput);
                }
                if (!quantityInput) {
                    quantityInput = plusButton.parentNode.querySelector(drawerQuantityInput);
                }
                if (!quantityInput) {
                    return;
                }

                let productId = quantityInput.getAttribute('data-product-id') ||
                    quantityInput.dataset.productId ||
                    quantityInput.getAttribute('data-quantity-product-id');
                let variantId = quantityInput.getAttribute('data-variant-id') ||
                    quantityInput.dataset.variantId ||
                    quantityInput.getAttribute('data-quantity-variant-id');
                const digitallyProductId = document.getElementById("digitally-product-id")?.value;
                const currentVariantId = getSelectedVariantId();

                if ((productId && digitallyProductId && productId.toString() === digitallyProductId.toString()) ||
                    (variantId && currentVariantId && variantId.toString() === currentVariantId.toString())) {
                    e.preventDefault();
                    e.stopPropagation();

                    checkCurrentCartQuantity(function(cartQuantity) {
                        if (cartQuantity >= codesRemaining) {
                            const message = t('cannot_add_more', {
                                count: codesRemaining,
                                plural: getPlural(codesRemaining)
                            });
                            document.querySelectorAll('.cart-license-limit-notification').forEach(el => el.remove());

                            const notification = document.createElement('div');
                            notification.className = 'cart-license-limit-notification';
                            notification.style.cssText = 'background-color: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 4px; text-align: center;';
                            notification.textContent = message;

                            const cartContainer = document.querySelector('.cart-items');
                            if (cartContainer) {
                                cartContainer.prepend(notification);
                            } else {
                                document.body.appendChild(notification);
                                notification.style.cssText += 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
                            }

                            setTimeout(function() {
                                notification.style.opacity = '0';
                                notification.style.transition = 'opacity 0.5s';
                                setTimeout(() => notification.remove(), 500);
                            }, 5000);
                        } else {
                            const currentQty = parseInt(quantityInput.value);
                            quantityInput.value = currentQty + 1;
                            const event = new Event('change', { bubbles: true });
                            quantityInput.dispatchEvent(event);

                            const form = plusButton.closest('form');
                            if (form) {
                                const submitButton = form.querySelector('[type="submit"]');
                                if (submitButton) {
                                    submitButton.click();
                                } else {
                                    const customEvent = new CustomEvent('quantity:update');
                                    document.dispatchEvent(customEvent);
                                }
                            }
                        }
                    });

                    return false;
                }
            }
        }, true);

        document.addEventListener('change', function(e) {
            if (e.target.matches(drawerQuantityInput) || e.target.closest(drawerQuantityInput)) {
                const quantityInput = e.target.matches(drawerQuantityInput) ?
                    e.target : e.target.closest(drawerQuantityInput);

                let productId = quantityInput.getAttribute('data-product-id') ||
                    quantityInput.dataset.productId ||
                    quantityInput.getAttribute('data-quantity-product-id');
                let variantId = quantityInput.getAttribute('data-variant-id') ||
                    quantityInput.dataset.variantId ||
                    quantityInput.getAttribute('data-quantity-variant-id');
                const digitallyProductId = document.getElementById("digitally-product-id")?.value;
                const currentVariantId = getSelectedVariantId();

                if ((productId && digitallyProductId && productId.toString() === digitallyProductId.toString()) ||
                    (variantId && currentVariantId && variantId.toString() === currentVariantId.toString())) {
                    const previousValue = quantityInput.dataset.previousValue || quantityInput.defaultValue || "1";
                    const newValue = quantityInput.value;

                    if (parseInt(newValue) > parseInt(previousValue)) {
                        e.preventDefault();
                        const form = quantityInput.closest('form');
                        if (form) {
                            const originalSubmit = form.onsubmit;
                            form.onsubmit = function(e) {
                                e.preventDefault();
                                return false;
                            };
                            setTimeout(() => {
                                form.onsubmit = originalSubmit;
                            }, 500);
                        }

                        checkCurrentCartQuantity(function(cartQuantity) {
                            const requestedDifference = parseInt(newValue) - parseInt(previousValue);
                            const potentialNewQuantity = cartQuantity + requestedDifference;

                            if (potentialNewQuantity > codesRemaining) {
                                const maxAllowed = Math.max(codesRemaining - cartQuantity + parseInt(previousValue), parseInt(previousValue));
                                quantityInput.value = maxAllowed;

                                const message = t('cannot_add_more', {
                                    count: codesRemaining,
                                    plural: getPlural(codesRemaining)
                                });
                                document.querySelectorAll('.cart-license-limit-notification').forEach(el => el.remove());

                                const notification = document.createElement('div');
                                notification.className = 'cart-license-limit-notification';
                                notification.style.cssText = 'background-color: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 4px; text-align: center;';
                                notification.textContent = message;

                                const cartContainer = document.querySelector('.cart-items');
                                if (cartContainer) {
                                    cartContainer.prepend(notification);
                                } else {
                                    document.body.appendChild(notification);
                                    notification.style.cssText += 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
                                }

                                setTimeout(function() {
                                    notification.style.opacity = '0';
                                    notification.style.transition = 'opacity 0.5s';
                                    setTimeout(() => notification.remove(), 500);
                                }, 5000);

                                const event = new Event('change', { bubbles: true });
                                quantityInput.dispatchEvent(event);
                            } else {
                                quantityInput.dataset.previousValue = newValue;
                                const form = quantityInput.closest('form');
                                if (form) {
                                    const submitButton = form.querySelector('[type="submit"]');
                                    if (submitButton) {
                                        submitButton.click();
                                    }
                                }
                            }
                        });
                    }

                    quantityInput.dataset.previousValue = quantityInput.value;
                }
            }
        }, true);

        document.addEventListener('input', function(e) {
            if (e.target.matches(drawerQuantityInput)) {
                e.target.dataset.currentTypingValue = e.target.value;
            }
        });

        document.querySelectorAll(drawerQuantityInput).forEach(input => {
            input.dataset.previousValue = input.value;
        });
    }
})();
