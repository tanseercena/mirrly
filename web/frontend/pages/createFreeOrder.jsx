import React, {useState, useCallback, useEffect} from "react";
import {
    Page,
    Card,
    Button,
    Text,
    InlineStack,
    BlockStack,
    Link,
    InlineGrid,
    Thumbnail,
    TextField,
        Banner,
} from "@shopify/polaris";
import { AppContext } from "../components/providers/AppProvider.jsx";
import {useAppBridge} from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector.jsx";

const CreateFreeOrder = () => {
    const navigate = useNavigate();
    const { store } = React.useContext(AppContext);
    const shopify = useAppBridge();
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");
    const [createInShopify, setCreateInShopify] = useState(true);
    const [saving, setSaving] = useState(false);
    const [validating, setValidating] = useState(false);
    const [permissionRequesting, setPermissionRequesting] = useState(false);
    const [hasOrderRequiredScopes, setHasOrderRequiredScopes] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
        const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleProductPicker = async () => {
        try {
            const selected = await shopify.resourcePicker({
                type: 'product',
                action: 'select',
                multiple: true,
                selectionIds: selectedProduct.map(product => product.id)
            });

            if (selected && selected.length > 0) {
                setValidating(true);

                try {
                    const response = await fetch("/api/validate-product-selection", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            products: selected
                        }),
                    });

                    const data = await response.json();

                    if (response.ok && data.valid) {
                        setSelectedProduct(selected);
                    } else {
                        // Check if the message contains the specific error about non-digital products
                        let errorMessage = data.message || t("create_free_order.invalid_product_selection_please_select_only_digital_products");
                        if (errorMessage.includes("Some selected products are not digital products:")) {
                            const productNames = errorMessage.replace("Some selected products are not digital products:", "").trim();
                            errorMessage = t("create_free_order.some_selected_products_are_not_digital_products") + " " + productNames;
                        }
                        shopify.toast.show(errorMessage, { isError: true, duration: 9999999 });
                        setSelectedProduct([]);
                    }
                } catch (error) {
                    console.error("Error validating product:", error);
                    shopify.toast.show(t("create_free_order.error_validating_product_please_try_again"), { isError: true, duration: 9999999 });
                    setSelectedProduct([]);
                } finally {
                    setValidating(false);
                }
            }
        } catch (error) {
            console.error('Resource picker error:', error);
        }
    };

    const handleEmailChange = (newValue) => {
        setEmail(newValue);
    };

    const handleNotesChange = (newValue) => {
        setNotes(newValue);
    };


    const handleSave = async () => {
        if (!selectedProduct || !email.trim()) {
            shopify.toast.show(t("create_free_order.please_select_a_product_and_enter_a_valid_email"), { isError: true, duration: 9999999 });
            return;
        }
        setSaving(true);

        const productsWithVariants = selectedProduct.map(product => ({
            id: product.id,
            title: product.title,
            variants: product.variants || []
        }));

        const requestBody = {
            product: productsWithVariants,
            email: email,
            notes: notes.trim() || null,
            create_in_shopify: createInShopify,
        };

        try {
            const response = await fetch("/api/free-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                shopify.toast.show(t("create_free_order.order_saved_successfully"));

                setSelectedProduct([]);
                setEmail("");
                setNotes("");
            } else {
                throw new Error(data.message || t("create_free_order.failed_to_save_order"));
            }
        } catch (error) {
            console.error("Error saving order:", error);
            shopify.toast.show(error.message || t("create_free_order.an_error_occurred_while_saving_the_order"), { isError: true, duration: 9999999 });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        checkAppPermissions().then(permissions => {
            setHasOrderRequiredScopes(permissions.includes('write_orders'));
        });
    }, []);

    async function checkAppPermissions() {
        const response = await fetch('/api/check-permissions');
        const data = await response.json();
        return data.scopes || [];
    }

    const requestCustomerWritePermission = async (scope) => {
        setPermissionRequesting(true);

        const scopes = [scope];

        const response = await fetch(`/api/request-permissions?scopes=${scopes.join(',')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        // const redirect = Redirect.create(app);
        //
        // redirect.dispatch(
        //     Redirect.Action.REMOTE,
        //     decodeURIComponent(data.url)
        // );
        open(data.url, '_top');
    };

    return (
        <div className="create-free-order-container">
        <Page
            backAction={{
                content: "Orders",
                onAction: () => navigate('/orders')
            }}
            title={t('create_free_order.create_a_test_order')}
            secondaryActions={
                <LanguageSelector/>
            }
            compactTitle
            primaryAction={{
                content: t('create_free_order.create_test_order'),
                onAction: handleSave,
                disabled: !selectedProduct || !email.trim() || !hasOrderRequiredScopes || validating,
                loading: saving
            }}
        >
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
                <div style={{ width: isMobile ? '100%' : '64%' }}>
                    <BlockStack gap="400">
                        <Card>
                            <BlockStack gap="300">
                                <Text variant="headingMd" as="h6">
                                    {t("create_free_order.products")}
                                </Text>
                                <Banner>
                                    <p>
                                        {t("create_free_order.select_products_for_this_order_customers_get_access_to_the_files_attached_to_the_products_you_have_selected_manage_products")}
                                    </p>
                                </Banner>
                                {selectedProduct.length > 0 ? (
                                    <div style={{ marginTop: "10px" }}>
                                        <InlineGrid columns="1fr auto" style={{ marginBottom: "10px" }}>
                                            <div>
                                                {selectedProduct.map((product) => (
                                                    <div style={{ marginTop: "10px" }} key={product.id}>
                                                        <InlineStack>
                                                            <div>
                                                                <Thumbnail
                                                                    source={product.images[0]?.originalSrc ?? 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081'}
                                                                    alt={product.title}
                                                                    size="large"
                                                                />
                                                            </div>
                                                            <div style={{ marginLeft: '20px' }}>
                                                                <div>
                                                                    <Link url="#">
                                                                        <Text variant="headingMd" as="h6">
                                                                            {product.title}
                                                                        </Text>
                                                                    </Link>
                                                                    {product.variants.length > 1 ? (
                                                                        <Text variant="bodyLg" as="p">
                                                                            {t("create_free_order.all_variants")} ({product.variants.length})
                                                                        </Text>
                                                                    ) : (
                                                                        product.variants.map((variant) => (
                                                                            <Text key={variant.id} variant="bodyLg" as="h6">
                                                                                {variant.title}
                                                                            </Text>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </InlineStack>
                                                    </div>
                                                ))}
                                            </div>
                                            <div onClick={toggleProductPicker}>
                                                <Link url="#">
                                                    <Text variant="bodyLg" as="p">
                                                        {t("create_free_order.edit_products")}
                                                    </Text>
                                                </Link>
                                            </div>
                                        </InlineGrid>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ flex: '78%' }}>
                                            <TextField
                                                value={selectedProduct.map(product => product.title).join(", ")}
                                                onFocus={toggleProductPicker}
                                                placeholder={t("create_free_order.search_shopify_products")}
                                                fullWidth
                                                readOnly
                                                disabled={validating}
                                            />
                                        </div>
                                        <div style={{ flex: '22%', marginLeft: '1rem' }}>
                                            <Button
                                                onClick={toggleProductPicker}
                                                disabled={validating}
                                                loading={validating}
                                            >
                                                {t("create_free_order.browse_products")}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </BlockStack>
                        </Card>
                        <Card>
                            <Text variant="headingMd" as="h6">
                                {t("create_free_order.customer")}
                            </Text>
                            <div style={{ marginTop: "10px" }}></div>
                            <TextField
                                label={t("create_free_order.email")}
                                value={email}
                                onChange={handleEmailChange}
                                autoComplete="off"
                                placeholder="john@doe.com"
                            />
                        </Card>
                        <Card>
                            <Text variant="headingMd" as="h6">
                                {t("create_free_order.notes")}
                            </Text>
                            <div style={{ marginTop: "10px" }}></div>
                            <TextField
                                value={notes}
                                onChange={handleNotesChange}
                                autoComplete="off"
                                placeholder={t("create_free_order.add_any_additional_notes_here")}
                                multiline={4}
                            />
                        </Card>
                    </BlockStack>
                </div>

                <div style={{ width: isMobile ? '100%' : '34%' }}>
                    <BlockStack gap="400">
                        <Card>
                            <Text variant="headingMd" as="h6">
                                {t("create_free_order.shopify_order_creation")}
                            </Text>
                            <div style={{ marginTop: "5px" }}></div>
                            {!hasOrderRequiredScopes && (
                                <Banner
                                    title={t("create_free_order.additional_permissions_required")}
                                    status="warning"
                                    action={{
                                        content: t("create_free_order.request_permissions"),
                                        onAction: () => requestCustomerWritePermission('write_orders'),
                                        loading: permissionRequesting,
                                    }}
                                >
                                    <p>
                                        {t("create_free_order.to_create_test_order_this_app_needs_permission_to_create_an_order")}
                                    </p>
                                </Banner>
                            )}

                            <div style={{ marginTop: "5px" }}></div>

                            <Text variant="bodyLg" as="p" color="subdued">
                                {t("create_free_order.order_will_be_created_in_shopify")}
                            </Text>
                        </Card>
                    </BlockStack>
                </div>
            </div>

                    </Page>
        </div>
    );
};

export default CreateFreeOrder;
