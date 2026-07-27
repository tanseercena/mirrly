import {
    Button,
    Modal,
    Text,
    BlockStack,
    Checkbox,
    EmptyState,
    Spinner,
    Badge,
    Card,
    InlineStack,
    Icon,
    TextField,
    DropZone,
    DataTable,
} from "@shopify/polaris"

import {
    ProductIcon,
} from '@shopify/polaris-icons';

import { useState, useEffect, useCallback } from "react"
import { useAppBridge } from "@shopify/app-bridge-react"
import { useTranslation } from "react-i18next"

const SendOwlImportModal = ({ active, setActive, onImportComplete }) => {
    const shopify = useAppBridge()
    const { t } = useTranslation()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [importing, setImporting] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedProducts, setSelectedProducts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [configError, setConfigError] = useState(null)
    const [apiKey, setApiKey] = useState('')
    const [apiSecret, setApiSecret] = useState('')
    const [csvFile, setCsvFile] = useState(null)
    const [showCredentialsForm, setShowCredentialsForm] = useState(false)
    const [skipFileDownloads, setSkipFileDownloads] = useState(false)
    const [showAvailableProducts, setShowAvailableProducts] = useState(false)



    const handleSelectionChange = useCallback((selected) => {
        setSelectedProducts(selected)
    }, [])

    const clearSelection = useCallback(() => {
        setSelectedProducts([])
    }, [])

    // Handle file drop
    const handleDropZoneDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0 && acceptedFiles[0].name.endsWith('.csv')) {
            setCsvFile(acceptedFiles[0])
            shopify.toast.show(`${t("sendowl_import.csv_file")} "${acceptedFiles[0].name}" ${t("sendowl_import.upload_success")}`)
        } else {
            shopify.toast.show(t("sendowl_import.invalid_csv"), { isError: true, duration: 9999999 })
        }
    }, [])

    // Remove uploaded file
    const handleRemoveFile = useCallback(() => {
        setCsvFile(null)
    }, [])

    // Validate and use SendOwl credentials
    const useCredentials = useCallback(() => {

        // Allow proceeding if CSV is uploaded, even without credentials


        if (!apiKey.trim() || !apiSecret.trim()) {
            shopify.toast.show(t("sendowl_import.missing_api"), { isError: true, duration: 9999999 })
            return false
        }
        setShowAvailableProducts(true)
        setShowCredentialsForm(false)
        // Now fetch products with provided credentials
        loadProducts(1, false)
        return true
    }, [apiKey, apiSecret, csvFile])

    // Fetch SendOwl products - renamed to avoid conflicts
    const loadProducts = useCallback(async (page = 1, append = false) => {
        if (loading) return

        setLoading(true)
        setConfigError(null)

        console.log('loadProducts called with csvFile:', csvFile?.name, 'csvFile size:', csvFile?.size)

        try {
            let response

            if (csvFile) {
                console.log('Using CSV file upload approach')
                // Use CSV file upload instead of API
                const formData = new FormData()
                formData.append('csv_file', csvFile)
                formData.append('api_key', apiKey.trim())
                formData.append('api_secret', apiSecret.trim())

                response = await fetch('/api/sendowl/products', {
                    method: 'POST',
                    body: formData
                })
            } else {
                console.log('Using API approach')
                // Use API
                response = await fetch('/api/sendowl/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page: page,
                        api_key: apiKey.trim(),
                        api_secret: apiSecret.trim()
                    })
                })
            }

            const data = await response.json()

            if (data.error) {
                setConfigError(data.message)
                return
            }

            const newProducts = (data.products || []).map(item => item.product || item)

            if (append) {
                setProducts(prev => [...prev, ...newProducts])
            } else {
                setProducts(newProducts)
            }

            // Check if there are more products to load (only for API, not CSV)
            const hasMoreProducts = csvFile ? false : newProducts.length === 50 // SendOwl API returns max 50 per page
            setHasMore(hasMoreProducts)

        } catch (error) {
            console.error('Error fetching SendOwl products:', error)
            shopify.toast.show(csvFile ?  t("sendowl_import.csv_process_fail") : t("sendowl_import.fetch_fail"), { isError: true, duration: 9999999 })
        } finally {
            setLoading(false)
        }
    }, [fetch, loading, apiKey, apiSecret, csvFile])

    // Load more products
    const loadMoreProducts = useCallback(() => {
        if (hasMore && !loading) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            loadProducts(nextPage, true)
        }
    }, [currentPage, hasMore, loading, loadProducts])

    // Initial load when modal opens
    useEffect(() => {
        if (active && products.length === 0) {
            // Show credentials form first
            setShowCredentialsForm(true)
        }
    }, [active])

    // Handle import
    const handleImport = useCallback(async () => {
        if (selectedProducts.length === 0) {
            shopify.toast.show(t("sendowl_import.no_product_selected"), { isError: true, duration: 9999999 })
            return
        }

        const productsToImport = selectedProducts

        setImporting(true)

        try {
            let response

            if (csvFile) {
                // Use CSV file upload for import as well
                const formData = new FormData()
                formData.append('csv_file', csvFile)
                formData.append('selected_products', JSON.stringify(productsToImport))
                formData.append('api_key', apiKey.trim())
                formData.append('api_secret', apiSecret.trim())
                formData.append('skip_file_downloads', skipFileDownloads)

                response = await fetch('/api/sendowl/import', {
                    method: 'POST',
                    body: formData
                })
            } else {
                // Use API
                response = await fetch('/api/sendowl/import', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        selected_products: productsToImport,
                        api_key: apiKey.trim(),
                        api_secret: apiSecret.trim(),
                        skip_file_downloads: skipFileDownloads
                    })
                })
            }

            const result = await response.json()

            if (result.error) {
                shopify.toast.show(result.message, { isError: true, duration: 9999999 })
            } else {
                shopify.toast.show(result.message)

                // Call parent callback if provided
                if (onImportComplete) {
                    onImportComplete(result)
                }

                // Close modal after successful import
                setTimeout(() => {
                    setActive(false)
                    clearSelection()
                    setProducts([])
                    setCurrentPage(1)
                    setCsvFile(null)
                }, 2000)
            }

        } catch (error) {
            console.error('Error importing products:', error)
            shopify.toast.show(t("sendowl_import.import_fail"), { isError: true, duration: 9999999 })
        } finally {
            setImporting(false)
        }
    }, [selectedProducts, fetch, onImportComplete, setActive, clearSelection, apiKey, apiSecret, csvFile])

    // Reset state when modal closes
    const handleClose = useCallback(() => {
        setActive(false)
        clearSelection()
        setProducts([])
        setCurrentPage(1)
        setConfigError(null)
        setCsvFile(null)
        setSkipFileDownloads(false)
    }, [setActive, clearSelection])

    

    
    const emptyStateMarkup = configError ? (
        <EmptyState
            heading={t("sendowl_import.sendOwl_not_configured")}
            action={{
                content: t("sendowl_import.go_to_settings"),
                onAction: () => {
                    // You could redirect to settings page here
                    shopify.toast.show(t("sendowl_import.api_not_configured"), { isError: true, duration: 9999999 })
                }
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
            <p>{configError}</p>
            <p>{t("sendowl_import.add_api_in_settings")}</p>
        </EmptyState>
    ) : !loading && products.length === 0 ? (
        <EmptyState
            heading="No products found"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
            <p>{t("sendowl_import.no_products_found")}</p>
        </EmptyState>
    ) : null

    return (
        <>
            <Modal
                open={active}
                onClose={handleClose}
                title={t("sendowl_import.import_products_from_sendOwl")}
                size="large"
                primaryAction={{
                    content: importing ? 'Importing...' : `Import ${selectedProducts.length} Product${selectedProducts.length !== 1 ? 's' : ''}`,
                    onAction: handleImport,
                    loading: importing,
                    disabled: selectedProducts.length === 0 || importing,
                }}
                secondaryActions={[
                    {
                        content: t("sendowl_import.cancel"),
                        onAction: handleClose,
                        disabled: importing,
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack gap="300">
                        <Text variant="bodyMd" as="p">
                            {t("sendowl_import.select_products")}{" "}
                            {t("sendowl_import.auto_link_variants")}

                        </Text>

                        {showCredentialsForm && (
                            <Card>
                                <BlockStack gap="300">
                                    <div>
                                        <Text variant="headingMd" as="h3">
                                        {t("sendowl_import.configure_api")}
                                    </Text>
                                    <Text as="p" variant="bodyMd">
                                       {t("sendowl_import.enter_api_info")}
                                    </Text>
                                    </div>

                                    <TextField
                                        label={t("sendowl_import.api_key")}
                                        type="text"
                                        value={apiKey}
                                        onChange={setApiKey}
                                        placeholder={t("sendowl_import.enter_api_key")}
                                        autoComplete="off"
                                    />

                                    <TextField
                                        label={t("sendowl_import.api_secret")}
                                        type="password"
                                        value={apiSecret}
                                        onChange={setApiSecret}
                                        placeholder={t("sendowl_import.enter_api_secret")}
                                        autoComplete="off"
                                    />

                                    <div>
                                        <BlockStack gap="200">

                                       <div>
                                         <Text variant="bodyMd" as="p" fontWeight="medium">
                                            {t("sendowl_import.upload_csv_optional")}
                                        </Text>
                                        <Text variant="bodyMd" as="p" tone="subdued">
                                            {t("sendowl_import.csv_tip")}
                                        </Text>
                                       </div>
                                        {!csvFile ? (
                                            <DropZone onDrop={handleDropZoneDrop} accept=".csv">
                                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                                    <Text variant="bodyMd" as="p">
                                                         {t("sendowl_import.drop_csv")}
                                                    </Text>
                                                </div>
                                            </DropZone>
                                        ) : (
                                            <div style={{
                                                marginTop: '0.5rem',
                                                padding: '0.75rem',
                                                border: '1px solid #e1e3e5',
                                                borderRadius: '4px',
                                                backgroundColor: '#f8f9fa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div>
                                                    <Text variant="bodySm" as="p" fontWeight="medium">
                                                        {csvFile.name}
                                                    </Text>
                                                    <Text variant="bodySm" as="p" tone="subdued">
                                                        {(csvFile.size / 1024).toFixed(1)} KB
                                                    </Text>
                                                </div>
                                                <Button
                                                    variant="plain"
                                                    onClick={handleRemoveFile}
                                                    size="small"
                                                >
                                                    {t("sendowl_import.remove")}
                                                </Button>
                                            </div>
                                        )}
                                        </BlockStack>

                                    </div>

                                    <InlineStack gap="2">
                                        <Button
                                            variant="primary"
                                            onClick={useCredentials}
                                       disabled={!apiKey.trim() || !apiSecret.trim()}
                                        >
                                             {t("sendowl_import.connect")}
                                        </Button>
                                        {/* <Button
                                            variant="plain"
                                            onClick={() => setShowCredentialsForm(false)}
                                        >
                                            Cancel
                                        </Button> */}
                                    </InlineStack>

                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        fontSize: '0.875rem'
                                    }}>
                                        <Text variant="bodyMd" as="p">
                                            <strong>{t("sendowl_import.find_api_title")}</strong><br />
                                            {t("sendowl_import.step_1")}<br />
                                            {t("sendowl_import.step_2")}<br />
                                            {t("sendowl_import.step_3")}<br />
                                          {t("sendowl_import.step_4")}
                                        </Text>
                                    </div>
                                </BlockStack>
                            </Card>
                        )}

                        {configError && !showCredentialsForm && (
                            <Card>
                                <BlockStack gap="2">
                                    <Text tone="critical">
                                        <strong> {t("sendowl_import.config_required")}</strong> {configError}
                                    </Text>
                                    <Text as="p" variant="bodySm">
                                        {t("sendowl_import.config_reminder")}
                                    </Text>
                                    <Button
                                        variant="plain"
                                        onClick={() => setShowCredentialsForm(true)}
                                    >
                                        {t("sendowl_import.configure_api_credentials")}
                                    </Button>
                                </BlockStack>
                            </Card>
                        )}

                        {!configError && showAvailableProducts &&  (
                            <Card>
                                <BlockStack gap="4">
                                    <InlineStack align="space-between">
                                        <Text variant="headingSm" as="h3">
                                            {t("sendowl_import.available_products")}({products.length})
                                        </Text>
                                        {selectedProducts.length > 0 && (
                                            <Badge tone="info">
                                                {selectedProducts.length} {t("sendowl_import.selected")}
                                            </Badge>
                                        )}
                                    </InlineStack>

                                    {emptyStateMarkup || (
                                        <>
                                            {/* Custom product list with manual selection */}
                                            <div style={{ border: '1px solid #e1e3e5', borderRadius: '8px', overflow: 'hidden' }}>
                                                {/* Header with select all */}
                                                <div style={{
                                                    padding: '12px 16px',
                                                    backgroundColor: '#fbfbfb',
                                                    borderBottom: '1px solid #e1e3e5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}>
                                                    <Checkbox
                                                        label={t("sendowl_import.select_all")}
                                                        checked={selectedProducts.length === products.length && products.length > 0}
                                                        indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                                                        onChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedProducts([...products])
                                                            } else {
                                                                setSelectedProducts([])
                                                            }
                                                        }}
                                                    />
                                                    <Text variant="bodySm" fontWeight="medium">
                                                        {selectedProducts.length} {t("sendowl_import.of")} {products.length} {t("sendowl_import.selected")}
                                                    </Text>
                                                </div>

                                                {/* Product list */}
                                                   <Card>
  <DataTable
    columnContentTypes={['text', 'text', 'text', 'text', 'text']}
    headings={[t("sendowl_import.select"), t("sendowl_import.product_name"), t("sendowl_import.price"), t("sendowl_import.shopify_id"), t("sendowl_import.status")]}
    rows={products.map((product) => {
      const { id, name, price, shopify_variant_id } = product;
      const isSelected = selectedProducts.some(p => p.id === id);

      return [
        <Checkbox
          label=""
          labelHidden
          checked={isSelected}
          onChange={(checked) => {
            if (checked) {
              setSelectedProducts([...selectedProducts, product]);
            } else {
              setSelectedProducts(selectedProducts.filter(p => p.id !== id));
            }
          }}
        />,
        name,
        price ? `$${price}` : 'N/A',
        shopify_variant_id || 'N/A',
        shopify_variant_id ? (
          <Badge tone="success"> {t("sendowl_import.ready_to_import")}</Badge>
        ) : (
          <Badge tone="attention"> {t("sendowl_import.no_shopify_variant")}</Badge>
        ),
      ];
    })}
  />
</Card>
                                            </div>

                                            {hasMore && !loading && (
                                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                                    <Button
                                                        onClick={loadMoreProducts}
                                                        disabled={loading}
                                                        variant="plain"
                                                    >
                                                        {t("sendowl_import.load_more")}
                                                    </Button>
                                                </div>
                                            )}

                                            {loading && (
                                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                                    <Spinner size="small" />
                                                    <Text variant="bodySm" as="p">{t("sendowl_import.loading")}</Text>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </BlockStack>
                            </Card>
                        )}

                        {selectedProducts.length > 0 && (
                            <Card>
                                <BlockStack gap="3">
                                    <Checkbox
                                        label={t("sendowl_import.skip_files")}
                                        checked={skipFileDownloads}
                                        onChange={setSkipFileDownloads}
                                        helpText={t("sendowl_import.skip_files_tip")}
                                    />
                                </BlockStack>
                            </Card>
                        )}

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                        }}>
                            <Text variant="bodySm" as="p">
                                <strong>{t("sendowl_import.how_it_works")}</strong>
                            </Text>
                            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                                <li>{t("sendowl_import.fetch_test_order")}</li>
                                <li>{t("sendowl_import.link_variants")}</li>
                                <li>{t("sendowl_import.store_files")}</li>
                                <li>{t("sendowl_import.valid_variants_only")}</li>
                            </ul>
                        </div>
                    </BlockStack>
                </Modal.Section>
            </Modal>
        </>
    )
}

export default SendOwlImportModal
