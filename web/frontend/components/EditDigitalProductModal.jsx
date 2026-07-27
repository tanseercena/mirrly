import prettyBytes from "pretty-bytes"

import {
    Button,
    DropZone,
    InlineStack,
    Icon,
    Modal,
    Text,
    BlockStack,
    Checkbox,
    Tabs,
    IndexTable,
    useIndexResourceState,
    Link,
    TextField,
} from "@shopify/polaris"

import {
  XSmallIcon
} from '@shopify/polaris-icons';

// import { InvalidRecordError } from "@gadget-client/digitally"
import { useState, useEffect, useCallback } from "react"
import { useAppBridge } from "@shopify/app-bridge-react"
import { ProductPicker } from "./index"
// import { createDigitalProduct } from "../api";

const MAX_FILE_BYTE = 1073741824 // 100mo

const EditDigitalProductModal = (props) => {
    const shopify = useAppBridge()
    const [orders, setOrders] = useState([]);

    // File schema: { name: string, size: number }
    const [files, setFiles] = useState([])
    const [filterValue, setFilterValue] = useState("");
    const [product, setProduct] = useState(props.digitalProduct.associatedProduct)
    const [isSaving, setIsSaving] = useState(false)
    const [autoFulfill, setAutoFulfill] = useState(props.digitalProduct.auto_fulfill);
    const [digitalProduct, setDigitalProduct] = useState(props.digitalProduct)
    const [oldFiles, setOldFiles] = useState(props.digitalProduct.files)
    const [selectedMainTab, setSelectedMainTab] = useState(0);

    const mainTabs = [
        { id: 'existingFiles', content: 'From Existing Files' },
        { id: 'newFile', content: 'Add New File' }
    ];

    const handleTabChange = useCallback(selectedMainTabIndex => {
        setSelectedMainTab(selectedMainTabIndex);
    }, []);

    const canSave = !isSaving && ((files.length || oldFiles.length) && product)

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('/api/get-files');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.files);
                    console.log("Files fetched successfully:", data.files);
                } else {
                    shopify.toast.show('Failed to fetch files', { isError: true, duration: 9999999 });
                }
            } catch (error) {
                console.error('Error fetching files:', error);
                shopify.toast.show('Failed to fetch files', { isError: true, duration: 9999999 });
            }
        };

        fetchFiles();
    }, []);

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(orders);

    const rowMarkup = orders.map(({ id, fileName, mimeType, byteSize, totalProducts }) => (
        <IndexTable.Row id={id} key={id} selected={selectedResources.includes(id)}>
            <IndexTable.Cell>
                <Link url="#">
                    {fileName}
                </Link>
            </IndexTable.Cell>
            <IndexTable.Cell>{mimeType}</IndexTable.Cell>
            <IndexTable.Cell>{prettyBytes(byteSize)}</IndexTable.Cell>
        </IndexTable.Row>
    ));

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFiles((files) => [...files, ...acceptedFiles]),
        [files],
    )

    const handleAutoFulfillCheckbox = useCallback((value) => {
        setAutoFulfill(value);
    }, [autoFulfill]);

    const handleDeleteFileAtIndex = useCallback((index) => {
        setFiles((files) => {
            let newFiles = [...files]
            newFiles.splice(index, 1)
            return newFiles
        })
    }, [files])

    const handleDeleteExistingFileAtIndex = useCallback((index) => {
        let deleteFile = digitalProduct.files[index];
        console.log("Delete this FILE: ")
        console.log(deleteFile);


        let newFiles = [...digitalProduct.files];
        newFiles.splice(index, 1)
        setOldFiles(newFiles);
        digitalProduct.files.splice(index, 1);

        const response = fetch(`/api/delete-file/${deleteFile.id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })

    }, [digitalProduct])

    const handleProductSelection = useCallback(product => {
        setProduct(product)
    }, [])

    const handleSave = useCallback(async () => {
        const validFiles = files.filter(file => file.size <= MAX_FILE_BYTE)

        if (!validFiles.length && !oldFiles.length) {
            shopify.toast.show("Please upload at least 1 valid file", { isError: true, duration: 9999999 })
            return
        }

        if ((validFiles.length + oldFiles.length) > 10) {
            shopify.toast.show("Cannot save more than 10 files", { isError: true, duration: 9999999 })
            return
        }


        setIsSaving(true)

        try {
            // const result = await createDigitalProduct(
            //     props.shopId,
            //     product.id,
            //     validFiles
            // )

            var formData = new FormData();
            validFiles.forEach(file => {
                formData.append('files[]', file);
            });
            // formData.append('files', validFiles);
            formData.append("product", JSON.stringify(product));
            formData.append("old_files", JSON.stringify(oldFiles));
            formData.append('auto_fulfill', autoFulfill ? '1' : '0');

            const response = await fetch('/api/update-digital-product/' + digitalProduct.id, {
                method: 'POST',
                // headers: {
                //     Accept: 'application/json',
                //     'Content-Type': 'application/json',
                // },
                // body: JSON.stringify({
                //     product: product,
                //     files: validFiles
                // }),
                body: formData
            })
            console.log(response);
            if (response.ok) {
                setIsSaving(false)

                const data = await response.json();
                if (data.error) {
                    if (data.type === 'exists') {
                        shopify.toast.show("Digital product already exists", { isError: true, duration: 9999999 })
                    } else {
                        shopify.toast.show("Something wrong happened, please try later", { isError: true, duration: 9999999 })
                    }
                } else {
                    setIsSaving(false)
                    props.onClose()
                }

            } else {
                shopify.toast.show("Something wrong happened, please try later", {isError: true, duration: 3000})
            }
        } catch (error) {
            // if (error instanceof InvalidRecordError) {
            //     shopify.toast.show("Digital product already exists", { isError: true, duration: 9999999 })
            // } else {
            shopify.toast.show("Something wrong happened, please try later", {isError: true, duration: 3000})
            // }
        }

        setIsSaving(false)
    }, [product, files, autoFulfill, digitalProduct, oldFiles])


    return (
        <>

            <Modal
                open={props.isActive}
                onClose={props.onClose}
                title={isSaving ? "Please wait while uploading..." : "Edit digital product"}
                loading={isSaving}
                primaryAction={{
                    content: "Update",
                    onAction: handleSave,
                    disabled: !canSave
                }}
            >
                <Modal.Section>
                    <ProductPicker
                        isEdit={true}
                        product={product}
                        onProductSelection={handleProductSelection}
                        onReset={() => handleProductSelection(null)}
                    />
                </Modal.Section>

                <Modal.Section>
                    <Tabs tabs={mainTabs} selected={selectedMainTab} onSelect={handleTabChange}>
                        {selectedMainTab === 0 && (
                            <>
                                <div style={{ margin: '5px', padding: '5px' }}>
                                    <TextField
                                        value={filterValue}
                                        onChange={(newValue) => setFilterValue(newValue)}
                                        autoComplete="off"
                                        placeholder="Filter files"
                                    />
                                </div>
                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={orders.length}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    headings={[
                                        { title: 'File' },
                                        { title: 'File type' },
                                        { title: 'File size' },
                                    ]}
                                >
                                    {rowMarkup}
                                </IndexTable>

                                <div style={{ marginTop: "30px" }}>
                                    {files.length > 0 && (
                                        <BlockStack gap="200">
                                            {files.map((file, index) => {
                                                const exceedMaxSize = file.size > MAX_FILE_BYTE

                                                return (
                                                    <InlineStack key={index} gap="200" blockAlign="center">
                                                        <Button icon={<Icon source={XSmallIcon} />} onClick={() => {
                                                            handleDeleteFileAtIndex(index)
                                                        }}></Button>

                                                        <BlockStack>
                                                            <Text variant="bodyMd" as="p" fontWeight="bold"
                                                                color={exceedMaxSize ? "critical" : ""}>{file.name}</Text>
                                                            <Text variant="bodySm" as="p"
                                                                color={exceedMaxSize ? "critical" : "subdued"}>{prettyBytes(file.size)} {exceedMaxSize ? "(File too big, it will be ignored)" : ""}</Text>
                                                        </BlockStack>
                                                    </InlineStack>
                                                )
                                            })}
                                        </BlockStack>
                                    )}

                                    {oldFiles.length > 0 && (
                                        <BlockStack gap="200">
                                            {oldFiles.map((file, index) => {
                                                const exceedMaxSize = file.file.byteSize > MAX_FILE_BYTE

                                                return (
                                                    <InlineStack key={index} gap="200" blockAlign="center">
                                                        <Button icon={<Icon source={XSmallIcon} />} onClick={() => {
                                                            handleDeleteExistingFileAtIndex(index)
                                                        }}></Button>

                                                        <BlockStack>
                                                            <Text variant="bodyMd" as="p" fontWeight="bold"
                                                                color={exceedMaxSize ? "critical" : ""}>{file.file.fileName}</Text>
                                                            <Text variant="bodySm" as="p"
                                                                color={exceedMaxSize ? "critical" : "subdued"}>{prettyBytes(file.file.byteSize)} {exceedMaxSize ? "(File too big, it will be ignored)" : ""}</Text>
                                                        </BlockStack>
                                                    </InlineStack>
                                                )
                                            })}
                                        </BlockStack>
                                    )}
                                </div>
                            </>
                        )}
                        {selectedMainTab === 1 && (
                            <BlockStack gap="400">
                                <DropZone
                                    label="Drag and drop your files (10 files max / 1GB max per file)"
                                    onDrop={handleDropZoneDrop}
                                >
                                    <DropZone.FileUpload />
                                </DropZone>

                                {files.length > 0 && (
                                    <BlockStack gap="200">
                                        {files.map((file, index) => {
                                            const exceedMaxSize = file.size > MAX_FILE_BYTE

                                            return (
                                                <InlineStack key={index} gap="200" blockAlign="center">
                                                    <Button icon={<Icon source={XSmallIcon} />} onClick={() => {
                                                        handleDeleteFileAtIndex(index)
                                                    }}></Button>

                                                    <BlockStack>
                                                        <Text variant="bodyMd" as="p" fontWeight="bold"
                                                            color={exceedMaxSize ? "critical" : ""}>{file.name}</Text>
                                                        <Text variant="bodySm" as="p"
                                                            color={exceedMaxSize ? "critical" : "subdued"}>{prettyBytes(file.size)} {exceedMaxSize ? "(File too big, it will be ignored)" : ""}</Text>
                                                    </BlockStack>
                                                </InlineStack>
                                            )
                                        })}
                                    </BlockStack>
                                )}

                                {oldFiles.length > 0 && (
                                    <BlockStack gap="200">
                                        {oldFiles.map((file, index) => {
                                            const exceedMaxSize = file.file.byteSize > MAX_FILE_BYTE

                                            return (
                                                <InlineStack key={index} gap="200" blockAlign="center">
                                                    <Button icon={<Icon source={XSmallIcon} />} onClick={() => {
                                                        handleDeleteExistingFileAtIndex(index)
                                                    }}></Button>

                                                    <BlockStack>
                                                        <Text variant="bodyMd" as="p" fontWeight="bold"
                                                            color={exceedMaxSize ? "critical" : ""}><a target="_blank" href={file.file.url}>{file.file.fileName}</a></Text>
                                                        <Text variant="bodySm" as="p"
                                                            color={exceedMaxSize ? "critical" : "subdued"}>{prettyBytes(file.file.byteSize)} {exceedMaxSize ? "(File too big, it will be ignored)" : ""}</Text>
                                                    </BlockStack>
                                                </InlineStack>
                                            )
                                        })}
                                    </BlockStack>
                                )}

                            </BlockStack>
                        )}
                    </Tabs>
                </Modal.Section>
                <Modal.Section>
                    <Checkbox
                        checked={autoFulfill}
                        label="Auto-fulfill this product on Shopify orders"
                        onChange={handleAutoFulfillCheckbox}
                    />
                    <div style={{ marginLeft: 25 }}>
                        <Text as={'p'} variant={'bodyMd'}>
                            Automatically fulfill the matching product on Shopify orders, when the digital product
                            is
                            delivered. Useful if no physical goods need to be shipped separately.
                        </Text>
                    </div>
                </Modal.Section>
            </Modal>
        </>
    )
}

export default EditDigitalProductModal
