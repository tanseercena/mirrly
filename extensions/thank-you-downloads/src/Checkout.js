import {
    extension,
    Button,
    BlockStack,
    Text,
    View,
    Heading,
    Divider,
    Spinner
} from "@shopify/ui-extensions/checkout";

// Fetch function to check if digital products exist
const checkDigitalProducts = async (checkoutToken) => {
    // const checkProductsApi = `https://digitally.test/api/check-digital-products`;
    const checkProductsApi = `https://digitally.conversionproplus.com/api/check-digital-products`;
    const response = await fetch(checkProductsApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkout_token: checkoutToken.current }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch digital products');
    }

    const data = await response.json();
    return data.hasDigitalProducts; // This should return true/false
};

// Common render function
const renderContent = async (root, api, token, shop, isPreviewMode, currentSettings) => {
    const downloadUrl = isPreviewMode ? '#' : `https://digitally.conversionproplus.com/file/${token.current}/download`;
    const title = currentSettings?.download_block_title || 'Download Digital Assets' + (isPreviewMode ? ' (Preview)' : '');
    const description = currentSettings?.download_block_description || 'Your digital assets are ready for downloads. Click below button to access download page.';
    const buttonText = currentSettings?.download_block_button || 'Download Your Digital Assets';

    // Find or create a dedicated container for this component
    let container = root.children.find((child) => child.props && child.props.id === 'download-block-container');
    if (!container) {
        container = root.createComponent(View, {id: 'download-block-container'});
        root.appendChild(container);
    }

    // Clear only your container's children
    container.children.forEach(child => container.removeChild(child));

    // Create new content
    const content = root.createComponent(View, {
        padding: 'base',
        border: 'base',
        borderRadius: 'base',
        background: 'subdued',
    }, [
        root.createComponent(BlockStack, {spacing: 'base'}, [
            root.createComponent(Heading, {level: 2}, title),
            root.createComponent(Divider, {}),
            root.createComponent(Text, {}, description),
            root.createComponent(Divider, {}),
            root.createComponent(Button, {to: downloadUrl}, buttonText),
        ]),
    ]);

    // Append new content to the container
    container.appendChild(content);
};

// Render wrapper function with polling check
const renderWithCheck = async (root, api, token, shop, isPreviewMode, currentSettings) => {
    const downloadWaitingText = currentSettings?.download_block_waiting_text || 'Please wait while we fetch your digital assets (if any).';
    const loadingMessage = root.createComponent(View, { padding: 'base' }, [
        root.createComponent(Text, {}, downloadWaitingText),
        root.createComponent(Spinner, { size: 'large' }),
    ]);
    root.appendChild(loadingMessage);
    root.mount();

    const pollingInterval = 10000; // 10 seconds
    const maxAttempts = 30; // Maximum 30 attempts (300 seconds total)
    let attempts = 0;

    const pollForDigitalProducts = async () => {
        try {
            const hasDigitalProducts = await checkDigitalProducts(token);
            if(!hasDigitalProducts && !isPreviewMode) {
                return false;
            }
            root.removeChild(loadingMessage);
            if (hasDigitalProducts || isPreviewMode) {
                renderContent(root, api, token, shop, isPreviewMode, currentSettings);
            }
            return true; // Stop polling if successful
        } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
                root.removeChild(loadingMessage);
                console.error('Max attempts reached. Error checking digital products:', error);
                return true; // Stop polling after max attempts
            }
            return false; // Continue polling
        }
    };

    // Poll every second until success or max attempts
    while (attempts < maxAttempts) {
        const shouldStop = await pollForDigitalProducts();
        if (shouldStop) break;
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
    }
};

// Choose an extension target
const thankYouBlock = extension("purchase.thank-you.block.render", (root, {checkoutToken, api, shop, extension, settings}) => {
    const isPreviewMode = extension?.editor?.type === 'checkout';
    if (isPreviewMode) {
        renderContent(root, api, checkoutToken, shop.myshopifyDomain, isPreviewMode, settings.current);

        settings.subscribe((newSettings) => {
            renderContent(root, api, checkoutToken, shop.myshopifyDomain, isPreviewMode, newSettings);
        });
    } else {
        renderWithCheck(root, api, checkoutToken, shop.myshopifyDomain, isPreviewMode, settings.current);
    }
});
export {thankYouBlock};

const orderDetailsBlock = extension("customer-account.order-status.block.render", (root, {checkoutToken, api, shop, extension, settings}) => {
    const isPreviewMode = extension?.editor?.type === 'checkout';
    if (isPreviewMode) {
        renderContent(root, api, checkoutToken, shop.myshopifyDomain, isPreviewMode, settings.current);

        settings.subscribe((newSettings) => {
            renderContent(root, api, checkoutToken, shop.myshopifyDomain, isPreviewMode, newSettings);
        });
    } else {
        renderWithCheck(root, api, checkoutToken, shop.myshopifyDomain, isPreviewMode, settings.current);
    }
});
export {orderDetailsBlock};
