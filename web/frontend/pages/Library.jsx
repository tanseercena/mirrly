import React, { useState, useContext, useEffect, useCallback } from "react";

import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Layout,
    DataTable,
    Page,
    Button,
    Tabs,
    Modal,
    BlockStack,
    DropZone,
    InlineStack,
    Icon,
    Link,
    EmptyState,
    Card,
    TextField,
    RadioButton,
    Divider,
    Pagination,
    Spinner,
    LegacyStack,
    FormLayout,
    Select,
    Checkbox,
    ButtonGroup,
    Autocomplete,
    Banner,
    Box,
} from "@shopify/polaris";
import prettyBytes from "pretty-bytes";
import { useAppBridge } from "@shopify/app-bridge-react";
import { AppContext } from "../components/providers/AppProvider.jsx";
import { XSmallIcon } from "@shopify/polaris-icons";
import { mockDelete } from "vi-fetch";
import { PopoverPicker } from "../components/PopoverPicker.jsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";
import "./Styles.css";
import LanguageSelector from "../components/LanguageSelector.jsx";

const MAX_FILE_BYTE = 1073741824;

function Library() {
    const rows = [
        ["Emerald Silk Gown", "$875.00", 124689, 140, "$122,500.00"],
        ["Mauve Cashmere Scarf", "$230.00", 124533, 83, "$19,090.00"],
        [
            "Navy Merino Wool Blazer with khaki chinos and yellow belt",
            "$445.00",
            124518,
            32,
            "$14,240.00",
        ],
    ];

    const navigate = useNavigate();
    const [color, setColor] = useState("#aabbcc");
    const { store,refetchStore } = React.useContext(AppContext);
    const shopify = useAppBridge();
    const [files, setFiles] = useState([]);
    const [orders, setOrders] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [customs, setCustoms] = useState([]);
        const [showModal, setShowModal] = useState(false);
    const [showLicenseModal, setShowLicenseModal] = useState(false);
    const [showCustomLinkModal, setShowCustomLinkModal] = useState(false);
    const [tabSelected, setTabSelected] = useState(0);
    const [selectedManualLicenseTab, setSelectedManualLicenseTab] = useState(0);
    const [showAddContentModal, setShowAddContentModal] = useState(false);
    const [title, setTitle] = useState("");
    const [redirectURL, setRedirectURL] = useState("");
    const [linkDetail, setLinkDetail] = useState("");
    const [licenseTitle, setLicenseTitle] = useState("");
    const [value, setValue] = useState("automated");
    const [prefix, setPrefix] = useState("");
    const [codeLength, setCodeLength] = useState("");
    const [suffix, setSuffix] = useState("");
    const [totalCodes, setTotalCodes] = useState("");
    const [licenseFiles, setLicenseFiles] = useState([]);
    const [loadLicenseFile, setLoadLicenseFile] = useState(null);
    const [modalActive, setModalActive] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [modalItemActive, setModalItemActive] = useState(false);
    const [modalLoadActive, setModalLoadActive] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ type: "", id: null });
    const [loadLicenseId, setLoadLicenseId] = useState(null);
    const [currentPageFiles, setCurrentPageFiles] = useState(1);
    const [currentPageLicenses, setCurrentPageLicenses] = useState(1);
    const [currentPageCustoms, setCurrentPageCustoms] = useState(1);
    const [currentPagePDFs, setCurrentPagePDFs] = useState(1);
    const [totalFiles, setTotalFiles] = useState(0);
    const [totalLicenses, setTotalLicenses] = useState(0);
    const [totalCustoms, setTotalCustoms] = useState(0);
    const [totalPDFs, setTotalPDFs] = useState(0);
    const itemsPerPage = 10;
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fileSizeLimit, setFileSizeLimit] = useState("No limit");
    const [qrCodeEnabled, setQrCodeEnabled] = useState(false);
    const [oneKeyDelivery, setOneKeyDelivery] = useState(false);
    const [qrCodePrintOnPDF, setQRCodePrintOnPDF] = useState(false);
    const [giftCardEnabled, setGiftCardEnabled] = useState(false);
    const [giftCardPropertyName, setGiftCardPropertyName] = useState("");
    const [giftDeliveryPropertyName, setGiftDeliveryPropertyName] = useState("");
    const [sendKeyToMultipleCustomers, setSendKeyToMultipleCustomers] =
        useState(false);
    const [deliverKeysInSequence, setDeliverKeysInSequence] = useState(false);
    const [pasteKeysValue, setPasteKeysValue] = useState("");
    const [isSavingFiles, setIsSavingFiles] = useState(false);
    const [isSavingCustomLink, setIsSavingCustomLink] = useState(false);
    const [isSavingLicense, setIsSavingLicense] = useState(false);
    const [isSavingPDFTemplate, setIsSavingPDFTemplate] = useState(false);

    const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
    const [textSize, setTextSize] = useState("12");
    const [textColor, setTextColor] = useState("#000000");
    const [alignment, setAlignment] = useState("left");
    const [font, setFont] = useState("arial");
    const [pageSize, setPageSize] = useState("A4");
    const [pageLayout, setPageLayout] = useState("portrait");
    const [verticalAdjustment, setVerticalAdjustment] = useState("");
    const [pagesToStamp, setPagesToStamp] = useState("");
    const [stampText, setStampText] = useState("");
    const [allowPrinting, setAllowPrinting] = useState(false);
    const [allowCopy, setAllowCopy] = useState(false);
    const [passwordProtect, setPasswordProtect] = useState(false);
    const [templateTitle, setTemplateTitle] = useState("");
    const [previewFile, setPreviewFile] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [pdfTemplates, setPdfTemplates] = useState([]);
    const [pdfDeleteModal, setPdfDeleteModal] = useState(false);
    const [templateIdToDelete, setTemplateIdToDelete] = useState(null);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [licenseToEdit, setLicenseToEdit] = useState(null);
    const [isCustomLinkEditing, setIsCustomLinkEditing] = useState(false);
    const [customLinkToEdit, setCustomLinkToEdit] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchOptions, setSearchOptions] = useState([]);
    const [selectedLicenseOptions, setSelectedLicenseOptions] = useState([]);
    const [inputLicenseValue, setInputLicenseValue] = useState("");
    const [searchLicenseOptions, setSearchLicenseOptions] = useState([]);
    const [selectedCustomLinkOptions, setSelectedCustomLinkOptions] = useState(
        []
    );
    const [inputCustomLinkValue, setInputCustomLinkValue] = useState("");
    const [searchCustomLinkOptions, setSearchCustomLinkOptions] = useState([]);
    const [selectedPDFOptions, setSelectedPDFOptions] = useState([]);
    const [inputPDFValue, setInputPDFValue] = useState("");
    const [searchPDFOptions, setSearchPDFOptions] = useState([]);
    // Videos state
    const [videos, setVideos] = useState([]);
    const [currentPageVideos, setCurrentPageVideos] = useState(1);
    const [totalVideos, setTotalVideos] = useState(0);
    const [selectedVideoOptions, setSelectedVideoOptions] = useState([]);
    const [inputVideoValue, setInputVideoValue] = useState("");
    const [searchVideoOptions, setSearchVideoOptions] = useState([]);
    // Add Video functionality state
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [videoOptions, setVideoOptions] = useState([]);
    const [vimeoVideoOptions, setVimeoVideoOptions] = useState([]);
    const [wistiaVideoOptions, setWistiaVideoOptions] = useState([]);
    const [vimeoVideosRecord, setVimeoVideosRecord] = useState([]);
    const [wistiaVideosRecord, setWistiaVideosRecord] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [perUnitNoDelivery, setPerUnitNoDelivery] = useState(1);

    const { t } = useTranslation();
    const mainTabs = [
        {
            id: "files-1",
            content: t("digtal_product_listing.files"),
            panelID: "files-content-1",
        },
        {
            id: "license-key-lists-1",
            content: t("library.license_key_lists"),
            panelID: "license-key-lists-content-1",
        },
        {
            id: "custom-links-1",
            content: t("library.custom_links"),
            panelID: "custom-links-content-1",
        },
        {
            id: "psf-stampings-1",
            content: t("library.pdf_stamp_templates"),
            panelID: "pdf-stampings-content-1",
        },
        {
            id: "streaming-videos-1",
            content: t("library.videos"),
            panelID: "streaming-videos-content-1",
        },
    ];

    const manualLicenseTabs = [
        { id: "uploadCsv", content: t("createdigitalproduct.upload_csv") },
        {
            id: "pasteKeys",
            content: t("createdigitalproduct.paste_keys_codes"),
        },
    ];

    const handlePasteKeysChange = (newValue) => {
        setPasteKeysValue(newValue);
    };

    const handleManualLicenseTabChange = useCallback(
        (selectedManualLicenseTabIndex) => {
            setSelectedManualLicenseTab(selectedManualLicenseTabIndex);
        },
        []
    );

    const toggleCustomTemplateModal = () => {
        setEditingTemplate(null);
        setIsPDFModalOpen(!isPDFModalOpen);
    };

    const handlePreviewFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPreviewFile(file);
        } else if (file) {
            // Show error toast or alert for invalid file type
            alert('Please select a valid PDF file');
            event.target.value = ''; // Clear the input
        }
    };

    const handlePreviewTemplate = async () => {
        if (!previewFile) {
            alert('Please select a PDF file first');
            return;
        }

        setIsPreviewLoading(true);

        try {
            const formData = new FormData();
            formData.append('pdf_file', previewFile);
            formData.append('text_size', textSize);
            formData.append('text_color', textColor);
            formData.append('alignment', alignment);
            formData.append('font', font);
            formData.append('page_size', pageSize);
            formData.append('page_layout', pageLayout);
            formData.append('vertical_adjustment', verticalAdjustment);
            formData.append('pages_to_stamp', pagesToStamp);
            formData.append('stamp_text', stampText);
            formData.append('allow_printing', allowPrinting);
            formData.append('allow_copying', allowCopy);
            formData.append('password_protect', passwordProtect);

            const response = await fetch('/api/preview-pdf-template', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'preview.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const errorData = await response.json();
                alert('Error generating preview: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Preview error:', error);
            alert('Error generating preview. Please try again.');
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const handleSaveTemplate = async () => {
        setIsSavingPDFTemplate(true);
        const pdfTemplateData = {
            text_size: textSize,
            text_color: textColor,
            alignment,
            font,
            page_size: pageSize,
            page_layout: pageLayout,
            vertical_adjustment: verticalAdjustment,
            pages_to_stamp: pagesToStamp,
            stamp_text: stampText,
            allow_printing: allowPrinting,
            allow_copying: allowCopy,
            password_protect: passwordProtect,
        };

        const url = editingTemplate
            ? `/api/update-pdf-template/${editingTemplate.id}`
            : "/api/save-pdf-template";
        const method = editingTemplate ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pdf_stamping: pdfTemplateData,
                    title: templateTitle,
                }),
            });

            if (response.ok) {
                setStampText("");
                setAllowPrinting(false);
                setAllowCopy(false);
                setTemplateTitle("");
                const fetchResponse = await fetch("/api/get-pdf-with-products");
                const data = await fetchResponse.json();

                if (data.success) {
                    setPdfTemplates(data.pdf_stampings);
                    shopify.toast.show(
                        editingTemplate
                            ? t(
                                  "createdigitalproduct.pdf_template_updated_successfully"
                              )
                            : t("library.pdf_template_added_successfully")
                    );
                } else {
                    throw new Error("Failed to fetch updated templates");
                }
            } else {
                throw new Error("Failed to save PDF template");
            }
        } catch (error) {
            console.error("Error saving template:", error);
            shopify.toast.show(t("createdigitalproduct.failed_to_save_pdf_template_please_try_again"), { isError: true, duration: 9999999 });
        } finally {
            setIsSavingPDFTemplate(false);
            setIsPDFModalOpen(false);
            setEditingTemplate(null);
        }
    };
    useEffect(() => {
        if (store.finish_onboarding === 0) {
            refetchStore();
        }
    }, [refetchStore, store.finish_onboarding]);
    const fetchPdfTemplates = async () => {
        // refetchStore();
        setIsLoadingData(true);
        try {
            const response = await fetch(
                `/api/get-pdf-with-products?page=${currentPagePDFs}&limit=${itemsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                setPdfTemplates(data.pdf_stampings);
                setTotalPDFs(data.total);
            } else {
                shopify.toast.show(t("library.failed_to_fetch_templates"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
            shopify.toast.show(t("library.failed_to_fetch_templates"), { isError: true, duration: 9999999 });
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchPdfTemplates();
    }, [currentPagePDFs]);

    // Fetch videos from Vimeo and Wistia on mount
    useEffect(() => {
        if (store?.setting?.vimeo_integration?.vimeo_integration_enabled && store?.setting?.vimeo_integration?.token_data) {
            fetchVimeoVideos();
        }
    }, [store]);

    useEffect(() => {
        if (store?.setting?.wistia_integration?.wistia_integration_enabled && store?.setting?.wistia_integration?.token_data) {
            fetchWistiaVideos();
        }
    }, [store]);

    const handlePDFPageChange = (newPage) => {
        setCurrentPagePDFs(newPage);
    };

    const openDeleteConfirmationModal = (templateId) => {
        setTemplateIdToDelete(templateId);
        setPdfDeleteModal(true);
    };

    const deletePdfTemplate = async () => {
        try {
            const response = await fetch(
                `/api/delete-pdf-template/${templateIdToDelete}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setPdfTemplates((prevTemplates) =>
                    prevTemplates.filter(
                        (template) => template.id !== templateIdToDelete
                    )
                );
                shopify.toast.show(t("library.pdf_template_deleted_successfully"));
            } else {
                shopify.toast.show(t("library.failed_to_delete_the_pdf_template"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error deleting template:", error);
            shopify.toast.show(t("library.failed_to_delete_the_pdf_template_Please_try_again"), { isError: true, duration: 9999999 });
        } finally {
            setPdfDeleteModal(false);
        }
    };

    const handleEdit = (templateData) => {
        setIsPDFModalOpen(true);

        setEditingTemplate(templateData);
        setTemplateTitle(templateData.title);
        setTextSize(templateData.pdf_stamping.text_size);
        setTextColor(templateData.pdf_stamping.text_color);
        setAlignment(templateData.pdf_stamping.alignment);
        setFont(templateData.pdf_stamping.font);
        setPageSize(templateData.pdf_stamping.page_size);
        setPageLayout(templateData.pdf_stamping.page_layout);
        setVerticalAdjustment(templateData.pdf_stamping.vertical_adjustment);
        setPagesToStamp(templateData.pdf_stamping.pages_to_stamp);
        setStampText(templateData.pdf_stamping.stamp_text);
        setAllowPrinting(templateData.pdf_stamping.allow_printing);
        setAllowCopy(templateData.pdf_stamping.allow_copying);
        setPasswordProtect(templateData.pdf_stamping.password_protect);
    };

    const toggleModal = useCallback(
        () => setModalActive((active) => !active),
        []
    );
    const toggleItemModal = useCallback(
        () => setModalItemActive((active) => !active),
        []
    );
    const toggleLoadLicenseModal = useCallback(
        () => setModalLoadActive((active) => !active),
        []
    );

    const handleTitleChange = (newValue) => {
        setTitle(newValue);
    };

    const handleLinkDetailChange = (newValue) => {
        setLinkDetail(newValue);
    };

    const handleRedirectURLChange = (newValue) => {
        setRedirectURL(newValue);
    };

    const handleLicenseTitleChange = (newValue) => {
        setLicenseTitle(newValue);
    };

    const handlePrefixChange = (newValue) => {
        setPrefix(newValue);
    };

    const handleCodeLengthChange = (newValue) => {
        // Prevent negative values, minimum value is 1
        const value = parseInt(newValue);
        if (newValue === '' || (value >= 1 && !isNaN(value))) {
            setCodeLength(newValue);
        }
    };

    const handleSuffixChange = (newValue) => {
        setSuffix(newValue);
    };

    const handleTotalCodesChange = (newValue) => {
        // Prevent negative values, minimum value is 1
        const value = parseInt(newValue);
        if (newValue === '' || (value >= 1 && !isNaN(value))) {
            setTotalCodes(newValue);
        }
    };

    const handleOneKeyDelivery = (checked) => {
        setOneKeyDelivery(checked);
    };

    const handleQRCode = (checked) => {
        setQrCodeEnabled(checked);
    };

    const handlePerUnitNoDeliveryChange = (newValue) => {
        setPerUnitNoDelivery(newValue);
    };

    const handleGiftCardEnabled = (value) => setGiftCardEnabled(value);

    const handleQRCodePrintOnPDF = useCallback((newCheckedState) => {
        setQRCodePrintOnPDF(newCheckedState);
    }, []);

    const handleGiftCardPropertyNameChange = (value) => setGiftCardPropertyName(value);

    const handleGiftDeliveryPropertyNameChange = (value) => setGiftDeliveryPropertyName(value);

    const handleSendKeyToMultipleCustomers = (checked) => {
        setSendKeyToMultipleCustomers(checked);
    };

    const handleDeliverKeysInSequence = (checked) => {
        setDeliverKeysInSequence(checked);
    };

    const handleRadioButtonChange = useCallback((newValue) => {
        setValue(newValue);
    }, []);

    const handleLicenseDropZoneDrop = (files) => {
        const file = files[0];
        setLicenseFiles(file);
    };

    const handLoadleLicenseDropZoneDrop = (files) => {
        const file = files[0];
        setLoadLicenseFile(file);
    };

    const handleDeleteFileLoad = () => {
        setLoadLicenseFile(null);
    };

    const loadLicenseCsv = async () => {
        const formData = new FormData();
        formData.append("licenseFile", loadLicenseFile);
        formData.append("license_id", loadLicenseId);

        try {
            const response = await fetch("/api/load-license-csv-codes", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setLoadLicenseFile(null);
                toggleLoadLicenseModal();
                shopify.toast.show(t("library.keys_codes_loaded_to_license_successfully"));
            } else {
                shopify.toast.show(t("library.failed_to_load_keys_codes_to_license"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error load license:", error);
            shopify.toast.show(t("library.failed_to_load_keys_codes_to_license"), { isError: true, duration: 9999999 });
        }
    };

    const handleLicenseDeleteFile = () => {
        setLicenseFiles({ name: "", size: 0 });
    };

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) => {
            setFiles((files) => [...files, ...acceptedFiles]);
        },
        []
    );

    const handleDeleteFile = async (id) => {
        try {
            await fetch(`/api/delete-files/${id}`, { method: "DELETE" });
            setOrders(orders.filter((order) => order.id !== id));
            shopify.toast.show(t("library.file_deleted_successfully"));
        } catch (error) {
            console.error("Error deleting file:", error);
            shopify.toast.show(t("library.failed_to_delete_file"), { isError: true, duration: 9999999 });
        }
    };

    const confirmDelete = () => {
        if (fileToDelete) {
            handleDeleteFile(fileToDelete);
            setFileToDelete(null);
            toggleModal();
        }
    };

    const showDeleteModal = (id) => {
        setFileToDelete(id);
        toggleModal();
    };

    const isLicenseActionDisabled = () => {
        const isTitleEmpty = !licenseTitle;
        if (value === "automated") {
            return isTitleEmpty || !totalCodes;
        }
        if (value === "manual") {
            if (selectedManualLicenseTab === 0) {
                return isTitleEmpty || licenseFiles.length === 0;
            }
            if (selectedManualLicenseTab === 1) {
                return isTitleEmpty || !pasteKeysValue?.trim();
            }
        }

        return false;
    };

    const handleSaveFiles = async () => {
        setIsSavingFiles(true);
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files[]", file);
        });

        try {
            const response = await fetch("/api/save-files", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const fetchResponse = await fetch("/api/get-files");
                if (fetchResponse.ok) {
                    const data = await fetchResponse.json();
                    setOrders(data.files);
                } else {
                    shopify.toast.show(t("createdigitalproduct.failed_to_fetch_files"), { isError: true, duration: 9999999 });
                }
                setFiles([]);
                setShowModal(false);
                shopify.toast.show(t("library.files_saved_successfully"));
            } else {
                shopify.toast.show(t("library.failed_to_save_files"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error saving files:", error);
            shopify.toast.show(t("library.failed_to_save_files"), { isError: true, duration: 9999999 });
        } finally {
            setIsSavingFiles(false);
        }
    };

    const handleEditClick = (license) => {
        setLicenseToEdit(license);

        setLicenseTitle(license.title);
        setValue(license.license_type);
        setQrCodeEnabled(license.qr_code_enabled);
        setOneKeyDelivery(license.one_key_delivery);
        setQRCodePrintOnPDF(license.print_qr_code_on_pdf);
        setGiftCardEnabled(license.gift_card_enabled);
        setGiftCardPropertyName(license.gift_card_property_name);
        setGiftDeliveryPropertyName(license.gift_delivery_property_name);
        setDeliverKeysInSequence(license.deliver_keys_in_sequence);
        setPerUnitNoDelivery(license.per_unit_no_delivery || 1);

        if (license.license_type === "automated") {
            setPrefix(license.prefix);
            setCodeLength(license.code_length);
            setSuffix(license.suffix);
            setTotalCodes(license.total_codes);
        } else if (license.license_type === "manual") {
            if (license.manual_codes_type === "csv" && license.file) {
                setLicenseFiles(JSON.parse(license.file));
            } else if (license.manual_codes_type === "paste_text") {
                setPasteKeysValue(license.codes_text || "");
            }
            setSendKeyToMultipleCustomers(license.send_without_repeating);
        }

        setIsEditing(true);

        setShowLicenseModal(true);
    };

    const handleSaveLicenses = async () => {
        setIsSavingLicense(true);
        const formData = new FormData();

        formData.append("licenseTitle", licenseTitle);
        formData.append("licenseType", value);
        formData.append("prefix", prefix ? prefix : "");
        formData.append("codeLength", codeLength);
        formData.append("suffix", suffix ? suffix : "");
        formData.append("totalCodes", totalCodes);
        formData.append("qrCodeEnabled", qrCodeEnabled ? "1" : "0");
        formData.append("oneKeyDelivery", oneKeyDelivery ? "1" : "0");
        formData.append("qrCodePrintOnPDF", qrCodePrintOnPDF ? "1" : "0");
        formData.append("giftCardEnabled", giftCardEnabled ? "1" : "0");
        formData.append("perUnitNoDelivery", perUnitNoDelivery || 1);
        formData.append("giftCardPropertyName", giftCardPropertyName ? giftCardPropertyName : "");
        formData.append("giftDeliveryPropertyName", giftDeliveryPropertyName ? giftDeliveryPropertyName : "");

        if (value === "manual") {
            const manual_codes_type =
                selectedManualLicenseTab === 0 ? "csv" : "paste_text";
            formData.append("manual_codes_type", manual_codes_type);

            if (manual_codes_type === "paste_text") {
                if (!pasteKeysValue.trim()) {
                    setIsSavingLicense(false);
                    shopify.toast.show(t("library.please_paste_your_license_keys_before_saving"), { isError: true, duration: 9999999 });
                    return;
                }
                formData.append("codes_text", pasteKeysValue.trim());
            }

            if (manual_codes_type === "csv") {
                if (
                    licenseFiles instanceof File ||
                    (licenseFiles && licenseFiles.name.endsWith(".csv"))
                ) {
                } else {
                    if (!(licenseFiles instanceof File)) {
                        setIsSavingLicense(false);
                        shopify.toast.show(t("library.please_upload_a_valid_csv_file"), { isError: true, duration: 9999999 });
                        return;
                    }

                    if (
                        licenseFiles.size === 0 ||
                        !licenseFiles.name.endsWith(".csv")
                    ) {
                        setIsSavingLicense(false);
                        shopify.toast.show(t("library.please_upload_a_valid_csv_file_for_manual_license_list"), { isError: true, duration: 9999999 });
                        return;
                    }
                }

                if (licenseFiles instanceof File) {
                    formData.append("licenseFile", licenseFiles);
                    formData.append("licenseFileUploaded", "yes");
                } else {
                    formData.append("licenseFileUploaded", "no");
                }

                formData.append(
                    "deliverKeysInSequence",
                    deliverKeysInSequence ? "1" : "0"
                );
            }
            formData.append(
                "sendKeyToMultipleCustomers",
                sendKeyToMultipleCustomers ? "1" : "0"
            );
        }

        try {
            const response = await fetch(
                isEditing
                    ? `/api/update-license/${licenseToEdit.id}`
                    : "/api/save-licenses",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                setLicenseTitle("");
                setPrefix("");
                setCodeLength("");
                setSuffix("");
                setQrCodeEnabled(false);
                setOneKeyDelivery(false);
                setQRCodePrintOnPDF(false);
                setGiftCardEnabled(false);
                setGiftCardPropertyName("");
                setGiftDeliveryPropertyName("");
                setTotalCodes("");
                setValue("automated");
                const fetchResponse = await fetch(
                    "/api/get-licenses-with-products"
                );
                if (fetchResponse.ok) {
                    const data = await fetchResponse.json();
                    setLicenses(data.licenses);
                } else {
                    shopify.toast.show(t("createdigitalproduct.failed_to_fetch_licenses"), { isError: true, duration: 9999999 });
                }
                setShowLicenseModal(false);
                shopify.toast.show(
                    isEditing
                        ? t("library.license_updated_successfully")
                        : t("library.license_saved_successfully")
                );
            } else {
                shopify.toast.show(t("library.failed_to_save_licenses"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error saving licenses:", error);
            shopify.toast.show(t("library.failed_to_save_licenses"), { isError: true, duration: 9999999 });
        } finally {
            setIsSavingLicense(false);
        }
    };

    const handleEditCustomLink = (link) => {
        setCustomLinkToEdit(link);

        setTitle(link.title);
        setRedirectURL(link.redirect_url);
        setLinkDetail(link.link_details);

        setIsCustomLinkEditing(true);
        setShowCustomLinkModal(true);
    };

    const handleSaveCustomLink = async () => {
        if (!title || !redirectURL) {
            shopify.toast.show(t("library.title_and_redirect_url_are_required"), { isError: true, duration: 9999999 });
            return;
        }

        setIsSavingCustomLink(true);
        try {
            const response = await fetch(
                isCustomLinkEditing
                    ? `/api/update-custom-link/${customLinkToEdit.id}`
                    : "/api/save-custom-link",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: title,
                        redirect_url: redirectURL,
                        link_details: linkDetail,
                    }),
                }
            );

            if (response.ok) {
                setRedirectURL("");
                setTitle("");
                setLinkDetail("");
                const fetchResponse = await fetch(
                    "/api/get-customs-with-products"
                );
                if (fetchResponse.ok) {
                    const data = await fetchResponse.json();
                    setCustoms(data.custom_links);
                } else {
                    shopify.toast.show(t("library.failed_to_fetch_customs"), { isError: true, duration: 9999999 });
                }
                setShowCustomLinkModal(false);
                shopify.toast.show(
                    isCustomLinkEditing
                        ? t("library.custom_link_updated_successfully")
                        : t("library.custom_link_saved_successfully")
                );
            } else {
                shopify.toast.show(t("library.failed_to_save_custom_link"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error saving custom link:", error);
            shopify.toast.show(t("library.failed_to_save_custom_link"), { isError: true, duration: 9999999 });
        } finally {
            setIsSavingCustomLink(false);
        }
    };


    const handleDeleteFileAtIndex = useCallback(
        (index) => {
            setFiles((files) => {
                let newFiles = [...files];
                newFiles.splice(index, 1);
                return newFiles;
            });
        },
        [files]
    );

    const fetchFiles = async () => {
        setIsLoadingData(true);
        try {
            const response = await fetch(
                `/api/get-files-with-products?page=${currentPageFiles}&limit=${itemsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                setOrders(data.files);
                setTotalFiles(data.total);
            } else {
                shopify.toast.show("Failed to fetch files", { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            shopify.toast.show(t("library.failed_to_fetch_files"), { isError: true, duration: 9999999 });
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [currentPageFiles]);

    const handleFilePageChange = async (newPage) => {
        setIsLoading(true);
        const response = await fetch(
            `/api/search-file?search=${inputValue}&page=${newPage}&limit=${itemsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setOrders(data.files);
            setTotalFiles(data.total);
            setCurrentPageFiles(newPage);
            setIsLoading(false);
        } else {
            console.error("Error fetching paginated results");
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setInputValue("");
        setSelectedOptions([]);
        setIsLoading(true);
        setCurrentPageFiles(1);

        fetch(`/api/search-file?page=1&limit=${itemsPerPage}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setOrders(data.files);
                setTotalFiles(data.total);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                console.error("Error fetching files");
            });
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setCurrentPageFiles(1);
        const response = await fetch(
            `/api/search-file?search=${inputValue}&page=1&limit=${itemsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setOrders(data.files);
            setTotalFiles(data.total);
            setCurrentPageFiles(1);
            setIsLoading(false);
        } else {
            console.error("Error fetching search results");
            setIsLoading(false);
        }
    };

    const fetchLicenses = async () => {
        setIsLoadingData(true);
        try {
            const response = await fetch(
                `/api/get-licenses-with-products?page=${currentPageLicenses}&limit=${itemsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                setLicenses(data.licenses);
                setTotalLicenses(data.total);
            } else {
                shopify.toast.show(t("createdigitalproduct.failed_to_fetch_licenses"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching licenses:", error);
            shopify.toast.show(t("createdigitalproduct.failed_to_fetch_licenses"), { isError: true, duration: 9999999 });
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchLicenses();
    }, [currentPageLicenses]);

    const handleLicensePageChange = async (newPage) => {
        setIsLoading(true);
        const response = await fetch(
            `/api/search-license?search=${inputLicenseValue}&page=${newPage}&limit=${itemsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setLicenses(data.licenses);
            setTotalLicenses(data.total);
            setCurrentPageLicenses(newPage);
            setIsLoading(false);
        } else {
            console.error("Error fetching paginated results");
            setIsLoading(false);
        }
    };

    const fetchCustomLinks = async () => {
        setIsLoadingData(true);
        try {
            const response = await fetch(
                `/api/get-customs-with-products?page=${currentPageCustoms}&limit=${itemsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                setCustoms(data.custom_links);
                setTotalCustoms(data.total);
            } else {
                shopify.toast.show(t("createdigitalproduct.failed_to_fetch_custom_links"), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching custom links:", error);
            shopify.toast.show(t("createdigitalproduct.failed_to_fetch_custom_links"), { isError: true, duration: 9999999 });
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchCustomLinks();
    }, [currentPageCustoms]);

    const handleCustomPageChange = async (newPage) => {
        setIsLoading(true);

        const response = await fetch(
            `/api/search-custom-link?search=${encodeURIComponent(
                inputCustomLinkValue
            )}&page=${newPage}&limit=${itemsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setCustoms(data.customLinks);
            setTotalCustoms(data.total);
            setCurrentPageCustoms(newPage);
            setIsLoading(false);
        } else {
            console.error("Error fetching paginated custom links");
            setIsLoading(false);
        }
    };

    // Videos functionality
    const fetchVideos = async () => {
        setIsLoadingData(true);
        try {
            const response = await fetch(
                `/api/videos?page=${currentPageVideos}&search=${encodeURIComponent(inputVideoValue)}`
            );
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.videos) {
                    if (data.videos.data) {
                        setVideos(data.videos.data);
                        setTotalVideos(data.videos.total || 0);
                    } else if (Array.isArray(data.videos)) {
                        setVideos(data.videos);
                        setTotalVideos(data.videos.length);
                    } else {
                        setVideos([]);
                        setTotalVideos(0);
                    }
                } else {
                    setVideos([]);
                    setTotalVideos(0);
                }
            } else {
                shopify.toast.show(t("library.failed_to_fetch_videos"), { isError: true });
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            shopify.toast.show(t("library.failed_to_fetch_videos"), { isError: true });
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [currentPageVideos]);

    const handleVideoPageChange = async (newPage) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/videos?search=${encodeURIComponent(inputVideoValue)}&page=${newPage}`
            );
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.videos) {
                    if (data.videos.data) {
                        setVideos(data.videos.data);
                        setTotalVideos(data.videos.total || 0);
                    } else if (Array.isArray(data.videos)) {
                        setVideos(data.videos);
                        setTotalVideos(data.videos.length);
                    } else {
                        setVideos([]);
                        setTotalVideos(0);
                    }
                }
                setCurrentPageVideos(newPage);
            } else {
                console.error("Error fetching videos");
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setIsLoading(false);
        }
    };

    const handleVideoSearch = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/videos?search=${encodeURIComponent(inputVideoValue)}&page=1`
            );
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.videos) {
                    if (data.videos.data) {
                        setVideos(data.videos.data);
                        setTotalVideos(data.videos.total || 0);
                    } else if (Array.isArray(data.videos)) {
                        setVideos(data.videos);
                        setTotalVideos(data.videos.length);
                    } else {
                        setVideos([]);
                        setTotalVideos(0);
                    }
                }
                setCurrentPageVideos(1);
            } else {
                console.error("Error searching videos");
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error searching videos:", error);
            setIsLoading(false);
        }
    };

    const handleDeleteVideo = async (id) => {
        try {
            const response = await fetch(`/api/videos/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setVideos(videos.filter((video) => video.id !== id));
                shopify.toast.show(t("library.video_deleted_successfully"));
                // Refetch videos to update pagination
                fetchVideos();
            } else {
                shopify.toast.show(t("library.failed_to_delete_video"), { isError: true });
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            shopify.toast.show(t("library.failed_to_delete_video"), { isError: true });
        }
    };

    const formatDuration = (seconds) => {
        const totalSeconds = Math.floor(Number(seconds));
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchVimeoVideos = async () => {
        try {
            setLoadingVideos(true);
            const response = await fetch('/api/vimeo/videos', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setVimeoVideosRecord(data.videos);
                const formattedOptions = data.videos.map(video => ({
                    label: `${video.name} - ${formatDuration(video.duration)}`,
                    value: video.uri.split('/').pop(),
                    title: video.name
                }));
                setVimeoVideoOptions(formattedOptions);
            }

        } catch (error) {
            console.error('Vimeo fetch failed:', error);
        } finally {
            setLoadingVideos(false);
        }
    };

    const fetchWistiaVideos = async () => {
        try {
            setLoadingVideos(true);
            const response = await fetch('/api/wistia/videos', {
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });

            const data = await response.json();

            if (data.success) {
                setWistiaVideosRecord(data.videos);
                const formattedOptions = data.videos.map(video => ({
                    label: `${video.name} — ${formatDuration(video.duration)}`,
                    value: video.hashed_id
                }));
                setWistiaVideoOptions(formattedOptions);
            }

        } catch (error) {
            console.error('Wistia fetch failed', error);
        } finally {
            setLoadingVideos(false);
        }
    };

    const handleAccountChange = (value) => {
        setLoadingVideos(true);
        setSelectedAccount(value);
        setSelectedVideo('');

        if (value === 'vimeo') {
            setVideoOptions(vimeoVideoOptions);
            setLoadingVideos(false);
            if (vimeoVideoOptions.length === 0) {
                shopify.toast.show(t("library.no_videos_available_for_vimeo"), { isError: true });
            }
        }

        if (value === 'wistia') {
            setVideoOptions(wistiaVideoOptions);
            setLoadingVideos(false);
            if (wistiaVideoOptions.length === 0) {
                shopify.toast.show(t("library.no_videos_available_for_wistia"), { isError: true });
            }
        }
    };

    const toggleVideo = async () => {
        if (!selectedVideo) return;

        let selectedRecord;
        if (selectedAccount === 'vimeo') {
            selectedRecord = vimeoVideosRecord.find(
                video => video.uri.split('/').pop() === selectedVideo
            );
        }

        if (selectedAccount === 'wistia') {
            selectedRecord = wistiaVideosRecord.find(
                video => video.hashed_id === selectedVideo
            );
        }

        if (!selectedRecord) return;

        const videoData = {
            title: selectedRecord.name,
            provider_video_id: String(selectedAccount === 'vimeo'
                ? selectedRecord.uri.split('/').pop()
                : (selectedRecord.id || selectedRecord.hashed_id)),
            hashed_id: selectedAccount === 'wistia' ? (selectedRecord.hashed_id || null) : null,
            thumbnail: selectedAccount === 'vimeo'
                ? selectedRecord.pictures?.base_link
                : selectedRecord.thumbnail?.url,
            duration: formatDuration(selectedRecord.duration),
            provider: selectedAccount
        };
        console.log(videoData);
        try {
            const response = await fetch('/api/videos/save', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(videoData)
            });

            const data = await response.json();

            if (data.success) {
                shopify.toast.show(t("library.video_added_successfully"));
                setShowVideoModal(false);
                setShowAddContentModal(false);
                setSelectedVideo('');
                // Refresh videos list
                fetchVideos();
            } else if (response.status === 409) {
                shopify.toast.show(data.message || t("library.video_already_exists"), { isError: true });
            } else {
                shopify.toast.show(data.message || t("library.failed_to_add_video"), { isError: true });
            }
        } catch (error) {
            console.error('Error saving video:', error);
            shopify.toast.show(t("library.failed_to_add_video"), { isError: true });
        }
    };
    const getFileName = (file) => {
        if (!file) return "";
        try {
            const fileInfo = JSON.parse(file);
            return fileInfo.name;
        } catch (error) {
            console.error("Error parsing file JSON:", error);
            return "";
        }
    };

    const handleMainTabChange = (selectedTabIndex) => {
        setTabSelected(selectedTabIndex);
    };

    const resourceName = {
        singular: "order",
        plural: "orders",
    };

    // const resourceNameForLicense = {
    //     singular: 'license',
    //     plural: 'licenses',
    // };

    // const resourceNameForCustom = {
    //     singular: 'custom',
    //     plural: 'customs',
    // };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(orders);

    // const { selectedResourcesForLicense, allResourcesSelectedForLicense, handleSelectionChangeForLicense } =
    //     useIndexResourceState(licenses);

    // const { selectedResourcesForCustom, allResourcesSelectedForCustom, handleSelectionChangeForCustom } =
    //     useIndexResourceState(customs);

    const exceedMaxSizeForLicense = licenseFiles.size > MAX_FILE_BYTE;

    const rowMarkup = orders.map(
        ({ id, fileName, mimeType, byteSize, totalProducts, totalOrders }) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
            >
                <IndexTable.Cell>
                    <Link url="#">{fileName}</Link>
                </IndexTable.Cell>
                <IndexTable.Cell>{mimeType}</IndexTable.Cell>
                <IndexTable.Cell>{prettyBytes(byteSize)}</IndexTable.Cell>
                <IndexTable.Cell>
                    <a href="#" style={{ color: "black" }}>
                        {totalProducts} products
                    </a>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <a href="#" style={{ color: "black" }}>
                        {totalOrders} orders
                    </a>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Button
                        onClick={() => showDeleteModal(id)}
                        variant="primary"
                        tone="critical"
                    >
                        {t("digtal_product_listing.delete")}
                    </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    );

    // const rowMarkupForLicense = licenses.map(({ id, title, license_type, prefix, code_length, suffix, total_codes, file }) => (
    //     <IndexTable.Row id={id} key={id} selected={selectedResources.includes(id)}>
    //         <IndexTable.Cell>{title}</IndexTable.Cell>
    //         <IndexTable.Cell>{license_type}</IndexTable.Cell>
    //         <IndexTable.Cell>{prefix}</IndexTable.Cell>
    //         <IndexTable.Cell>{code_length}</IndexTable.Cell>
    //         <IndexTable.Cell>{suffix}</IndexTable.Cell>
    //         <IndexTable.Cell>{total_codes}</IndexTable.Cell>
    //         <IndexTable.Cell>
    //             <Link url="#">
    //                 {getFileName(file)}
    //             </Link>
    //         </IndexTable.Cell>
    //     </IndexTable.Row>
    // ));

    // const rowMarkupForCustom = customs.map(({ id, title, redirect_url, link_details }) => (
    //     <IndexTable.Row id={id} key={id} selected={selectedResources.includes(id)}>
    //         <IndexTable.Cell>{title}</IndexTable.Cell>
    //         <IndexTable.Cell>{redirect_url}</IndexTable.Cell>
    //         <IndexTable.Cell>{link_details}</IndexTable.Cell>
    //     </IndexTable.Row>
    // ));

    useEffect(() => {
        if (store) {
            setFileSizeLimit(store.per_file_limit);
        }
    }, [store]);

    const formatFileSizeLimit = (bytes) => {
        if (bytes >= 1024 * 1024 * 1024) {
            return `${Math.floor(bytes / (1024 * 1024 * 1024))} GB`;
        } else if (bytes >= 1024 * 1024) {
            return `${Math.floor(bytes / (1024 * 1024))} MB`;
        } else if (bytes >= 1024) {
            return `${Math.floor(bytes / 1024)} KB`;
        } else {
            return `${bytes} bytes`;
        }
    };

    const fileLabelText = `${t(
        "library.drag_and_drop_your_files_10_files_max"
    )} ${fileSizeLimit
        ? `${t("createdigitalproduct.max")} ${formatFileSizeLimit(
            fileSizeLimit
        )} ${t("createdigitalproduct.per_file")}`
        : t("createdigitalproduct.no_limit_per_file")
        })`;

    const handleInputChange = async (value) => {
        setInputValue(value);

        if (value.length > 2) {
            setLoading(true);

            try {
                const response = await fetch(
                    `/api/search-file?search=${encodeURIComponent(
                        value
                    )}&page=1&limit=10`,
                    {
                        method: "GET",
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setSearchOptions(
                        data.files.map((item) => ({
                            label: item.fileName,
                            value: item.fileName,
                        }))
                    );
                } else {
                    console.error("Error fetching search results");
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchOptions([]);
        }
    };

    const handleInputLicenseChange = async (value) => {
        setInputLicenseValue(value);

        if (value.length > 2) {
            setLoading(true);

            try {
                const response = await fetch(
                    `/api/search-license?search=${encodeURIComponent(
                        value
                    )}&page=1&limit=10`,
                    {
                        method: "GET",
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setSearchLicenseOptions(
                        data.licenses.map((item) => ({
                            label: item.title,
                            value: item.title,
                        }))
                    );
                } else {
                    console.error("Error fetching search results");
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchLicenseOptions([]);
        }
    };

    const handleInputCustomLinkChange = async (value) => {
        setInputCustomLinkValue(value);

        if (value.length > 2) {
            setLoading(true);

            try {
                const response = await fetch(
                    `/api/search-custom-link?search=${encodeURIComponent(
                        value
                    )}&page=1&limit=10`,
                    {
                        method: "GET",
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setSearchCustomLinkOptions(
                        data.customLinks.map((item) => ({
                            label: item.title,
                            value: item.title,
                        }))
                    );
                } else {
                    console.error("Error fetching search results");
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchCustomLinkOptions([]);
        }
    };

    const handleInputPDFChange = async (value) => {
        setInputPDFValue(value);

        if (value.length > 2) {
            setLoading(true);

            try {
                const response = await fetch(
                    `/api/search-pdf?search=${encodeURIComponent(
                        value
                    )}&page=1&limit=10`,
                    {
                        method: "GET",
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setSearchPDFOptions(
                        data.pdfs.map((item) => ({
                            label: item.title,
                            value: item.title,
                        }))
                    );
                } else {
                    console.error("Error fetching search results");
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchPDFOptions([]);
        }
    };

    const handleInputVideoChange = async (value) => {
        setInputVideoValue(value);

        if (value.length > 2) {
            setLoading(true);

            try {
                const response = await fetch(
                    `/api/videos?search=${encodeURIComponent(value)}&page=1`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.videos) {
                        const videosList = data.videos.data || data.videos;
                        if (Array.isArray(videosList)) {
                            const options = videosList.map((video) => ({
                                label: video.title,
                                value: video.id.toString(),
                            }));
                            setSearchVideoOptions(options);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchVideoOptions([]);
        }
    };

    const updateVideoSelection = useCallback(
        (selected) => {
            if (!selected || selected.length === 0) {
                return;
            }

            const selectedValue = selected[0];
            const matchedOption = searchVideoOptions.find(
                (option) => option.label === selectedValue
            );

            if (matchedOption) {
                setSelectedVideoOptions([selectedValue]);
                setInputVideoValue(matchedOption.label);
                setSearchVideoOptions([matchedOption]);
            }
        },
        [searchVideoOptions]
    );

    const handleNavigation = useCallback(() => {
            shopify.saveBar.hide('edit-digital-product-savebar');
            navigate("/settings/integrations");
        }, [navigate]);

    const updateSelection = useCallback(
        (selected) => {
            if (!selected || selected.length === 0) {
                return;
            }

            const selectedValue = selected[0];
            const matchedOption = searchOptions.find(
                (option) => option.label === selectedValue
            );

            if (matchedOption) {
                setSelectedOptions([selectedValue]);
                setInputValue(matchedOption.label);
                setSearchOptions([matchedOption]);
            }
        },
        [searchOptions]
    );

    const updateLicenseSelection = useCallback(
        (selected) => {
            if (!selected || selected.length === 0) {
                return;
            }

            const selectedValue = selected[0];
            const matchedOption = searchLicenseOptions.find(
                (option) => option.label === selectedValue
            );

            if (matchedOption) {
                setSelectedLicenseOptions([selectedValue]);
                setInputLicenseValue(matchedOption.label);
                setSearchLicenseOptions([matchedOption]);
            }
        },
        [searchLicenseOptions]
    );

    const updateCustomLinkSelection = useCallback(
        (selected) => {
            if (!selected || selected.length === 0) {
                return;
            }

            const selectedValue = selected[0];
            const matchedOption = searchCustomLinkOptions.find(
                (option) => option.label === selectedValue
            );

            if (matchedOption) {
                setSelectedCustomLinkOptions([selectedValue]);
                setInputCustomLinkValue(matchedOption.label);
                setSearchCustomLinkOptions([matchedOption]);
            }
        },
        [searchCustomLinkOptions]
    );

    const updatePDFSelection = useCallback(
        (selected) => {
            if (!selected || selected.length === 0) {
                return;
            }

            const selectedValue = selected[0];
            const matchedOption = searchPDFOptions.find(
                (option) => option.label === selectedValue
            );

            if (matchedOption) {
                setSelectedPDFOptions([selectedValue]);
                setInputPDFValue(matchedOption.label);
                setSearchPDFOptions([matchedOption]);
            }
        },
        [searchPDFOptions]
    );

    const handleClearLicenseSearch = () => {
        setInputLicenseValue("");
        setSelectedLicenseOptions([]);
        setIsLoading(true);
        setCurrentPageLicenses(1);

        fetch(`/api/search-license?page=1&limit=${itemsPerPage}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setLicenses(data.licenses);
                setTotalLicenses(data.total);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                console.error("Error fetching licenses");
            });
    };

    const handleLicenseSearch = async () => {
        setIsLoading(true);
        setCurrentPageLicenses(1);
        const response = await fetch(
            `/api/search-license?search=${inputLicenseValue}&page=1&limit=${itemsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setLicenses(data.licenses);
            setTotalLicenses(data.total);
            setCurrentPageLicenses(1);
            setIsLoading(false);
        } else {
            console.error("Error fetching search results");
            setIsLoading(false);
        }
    };

    const handleClearCustomLinkSearch = () => {
        setInputCustomLinkValue("");
        setSelectedCustomLinkOptions([]);
        setIsLoading(true);
        setCurrentPageCustoms(1);

        fetch(`/api/search-custom-link?page=1&limit=${itemsPerPage}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setCustoms(data.customLinks);
                setTotalCustoms(data.total);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                console.error("Error fetching custom links");
            });
    };

    const handleCustomLinkSearch = async () => {
        setIsLoading(true);
        setCurrentPageCustoms(1);

        const response = await fetch(
            `/api/search-custom-link?search=${encodeURIComponent(
                inputCustomLinkValue
            )}&page=1&limit=${itemsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setCustoms(data.customLinks);
            setTotalCustoms(data.total);
            setCurrentPageCustoms(1);
            setIsLoading(false);
        } else {
            console.error("Error fetching custom link search results");
            setIsLoading(false);
        }
    };

    const handleClearPDFSearch = () => {
        setInputPDFValue("");
        setSelectedPDFOptions([]);
        setIsLoading(true);
        setCurrentPagePDFs(1);

        fetch(`/api/search-pdf?page=1&limit=${itemsPerPage}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setPdfTemplates(data.pdfs);
                setTotalPDFs(data.total);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                console.error("Error fetching PDFs");
            });
    };

    const handlePDFSearch = async () => {
        setIsLoading(true);
        setCurrentPagePDFs(1);

        const response = await fetch(
            `/api/search-pdf?search=${encodeURIComponent(
                inputPDFValue
            )}&page=1&limit=${itemsPerPage}`,
            {
                method: "GET",
            }
        );

        const data = await response.json();
        if (response.ok) {
            setPdfTemplates(data.pdfs);
            setTotalPDFs(data.total);
            setCurrentPagePDFs(1);
            setIsLoading(false);
        } else {
            console.error("Error fetching pdf search results");
            setIsLoading(false);
        }
    };

    const textField = (
        <Autocomplete.TextField
            onChange={handleInputChange}
            value={inputValue}
            autoComplete="off"
            placeholder={t("library.search_by_file_name")}
            clearButton
            onClearButtonClick={handleClearSearch}
        />
    );

    const textFieldForLicense = (
        <Autocomplete.TextField
            onChange={handleInputLicenseChange}
            value={inputLicenseValue}
            autoComplete="off"
            placeholder={t("createdigitalproduct.search_by_license_title")}
            clearButton
            onClearButtonClick={handleClearLicenseSearch}
        />
    );

    const textFieldForCustomLink = (
        <Autocomplete.TextField
            onChange={handleInputCustomLinkChange}
            value={inputCustomLinkValue}
            autoComplete="off"
            placeholder={t("editdigitalproduct.search_by_custom_link_title")}
            clearButton
            onClearButtonClick={handleClearCustomLinkSearch}
        />
    );

    const textFieldForPDF = (
        <Autocomplete.TextField
            onChange={handleInputPDFChange}
            value={inputPDFValue}
            autoComplete="off"
            placeholder={t("library.search_by_Pdf_title")}
            clearButton
            onClearButtonClick={handleClearPDFSearch}
        />
    );

    const videoTextField = (
        <Autocomplete.TextField
            onChange={handleInputVideoChange}
            value={inputVideoValue}
            autoComplete="off"
            placeholder={t("library.search_videos_by_title")}
            clearButton
            onClearButtonClick={() => {
                setInputVideoValue("");
                setSelectedVideoOptions([]);
                fetchVideos();
            }}
        />
    );

    const videoResourceName = {
        singular: "video",
        plural: "videos",
    };

    return (
        <div className="library-page-container">
        <Page
            title={t("library.content_library")}
            primaryAction={
                <Button
                    variant="primary"
                    onClick={() => setShowAddContentModal(true)}
                >
                    {t("library.add_content")}
                </Button>
            }
            secondaryActions={
               <LanguageSelector/>
            }
        >

            <Modal
                open={showAddContentModal}
                onClose={() => setShowAddContentModal(false)}
                title={t("library.add_content_l")}
                primaryAction={{
                    content: t("createdigitalproduct.close"),
                    onAction: () => setShowAddContentModal(false),
                }}
            >
                <Modal.Section>
                    <BlockStack gap="300">
                        <div
                            style={{
                                marginTop: "10px",
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "20px",
                            }}
                        >
                            <Card>
                                <BlockStack gap="300">
                                    <div
                                        style={{
                                            width: "24px",
                                            height: "30px",
                                            marginLeft: "62px",
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M4.843 9.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.043 2.043 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.244 2.244 0 0 1 3.173 3.172l-2.286 2.286a.817.817 0 1 1-1.155-1.155l2.25-2.25a.75.75 0 1 0-1.06-1.061l-2.25 2.25a2.317 2.317 0 0 0 3.275 3.277l2.286-2.286a3.744 3.744 0 0 0-5.294-5.294l-5.015 5.015Z"
                                            />
                                        </svg>
                                    </div>
                                    <Button
                                        size="large"
                                        onClick={() => {
                                            setShowAddContentModal(false);
                                            setShowModal(true);
                                        }}
                                    >
                                        {t("createdigitalproduct.add_files")}
                                    </Button>
                                </BlockStack>
                            </Card>

                            <div>
                                <Card>
                                    <BlockStack gap="300">
                                        <div
                                            style={{
                                                width: "24px",
                                                height: "30px",
                                                marginLeft: "62px",
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                width="100%"
                                                height="100%"
                                            >
                                                <path d="M10 7.75a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.85 2.75a4.35 4.35 0 0 0-4.35 4.35 3.401 3.401 0 0 0 2.5 3.28v3.435a2 2 0 0 0 .481 1.302l1.07 1.247a2 2 0 0 0 2.746.277l1.309-1.018a2.002 2.002 0 0 0 .376-2.776 2.004 2.004 0 0 0 .002-2.463 3.401 3.401 0 0 0 2.516-3.284 4.35 4.35 0 0 0-4.35-4.35h-2.3Zm2.835 11.69a.5.5 0 0 0-.042-.82l-.637-.397a.5.5 0 0 1 .041-.872l.582-.29a.5.5 0 0 0 .13-.802l-.613-.613a.5.5 0 0 1-.146-.353v-.793a.5.5 0 0 1 .5-.5h.6a1.9 1.9 0 0 0 1.9-1.9 2.85 2.85 0 0 0-2.85-2.85h-2.3a2.85 2.85 0 0 0-2.85 2.85c0 1.05.85 1.9 1.9 1.9h.1a.5.5 0 0 1 .5.5v4.315a.5.5 0 0 0 .12.325l1.07 1.248a.5.5 0 0 0 .686.07l1.31-1.019Z"
                                                />
                                            </svg>
                                        </div>
                                        <Button
                                            size="large"
                                            onClick={() => {
                                                setShowAddContentModal(false);
                                                setShowLicenseModal(true);
                                            }}
                                        >
                                            {t("library.license_key_list")}
                                        </Button>
                                    </BlockStack>
                                </Card>

                            </div>
                            <div>
                                <Card>
                                    <BlockStack gap="300">
                                        <div
                                            style={{
                                                width: "24px",
                                                height: "30px",
                                                marginLeft: "62px",
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M15.842 4.175a3.746 3.746 0 0 0-5.298 0l-2.116 2.117a3.75 3.75 0 0 0 .01 5.313l.338.336a.75.75 0 1 0 1.057-1.064l-.339-.337a2.25 2.25 0 0 1-.005-3.187l2.116-2.117a2.246 2.246 0 1 1 3.173 3.18l-1.052 1.047a.75.75 0 0 0 1.058 1.064l1.052-1.047a3.746 3.746 0 0 0 .006-5.305Zm-11.664 11.67a3.75 3.75 0 0 0 5.304 0l2.121-2.121a3.75 3.75 0 0 0 0-5.303l-.362-.362a.75.75 0 0 0-1.06 1.06l.362.362a2.25 2.25 0 0 1 0 3.182l-2.122 2.122a2.25 2.25 0 1 1-3.182-3.182l1.07-1.07a.75.75 0 1 0-1.062-1.06l-1.069 1.069a3.75 3.75 0 0 0 0 5.303Z"
                                                />
                                            </svg>
                                        </div>
                                        <Button
                                            size="large"
                                            onClick={() => {
                                                setShowAddContentModal(false);
                                                setShowCustomLinkModal(true);
                                            }}
                                        >
                                            {t(
                                                "createdigitalproduct.custom_link"
                                            )}
                                        </Button>
                                    </BlockStack>
                                </Card>

                            </div>
                            <div>
                                <Card>
                                    <BlockStack gap="300">
                                        <div
                                            style={{
                                                width: "24px",
                                                height: "30px",
                                                marginLeft: "62px",
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M16 6V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6h-2zm-1 0H5V5h10v1zM5 15V7h10v8H5z"
                                                />
                                            </svg>
                                        </div>
                                        <Button
                                            size="large"
                                            onClick={() => {
                                                setShowAddContentModal(false);
                                                toggleCustomTemplateModal();
                                            }}
                                        >
                                            {t("library.add_pdf_stamping")}
                                        </Button>
                                    </BlockStack>
                                </Card>

                            </div>
                            <Card>
                                                            <BlockStack gap="300">
                                                                <div
                                                                    style={{
                                                                        width: "24px",
                                                                        height: "30px",
                                                                        marginLeft: "62px",
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        width="20"
                                                                        height="20"
                                                                        fill="currentColor" >
                                                                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                        <polygon points="10,8 16,12 10,16" fill="currentColor" /> </svg>
                                                                </div>
                                                                <Button
                                                                    size="large"
                                                                    onClick={() => setShowVideoModal(true)}
                                                                >
                                                                    {t("library.add_video")}
                                                                </Button>
                                                            </BlockStack>
                                                        </Card>
                        </div>
                    </BlockStack>
                </Modal.Section>
            </Modal>

            <Modal
                            open={showVideoModal}
                            onClose={() => {
                                setShowVideoModal(false);
                                setShowAddContentModal(false);
                            }}
                            title={t("library.add_new_video")}
                            size="large"
                            primaryAction={{
                                size: "large",
                                content: t("library.add_video"),
                                onAction: toggleVideo,
                                disabled: !selectedVideo
                            }}
                            secondaryActions={[
                                {
                                    content: t("digtal_product_listing.cancel"),
                                    onAction: () => {
                                        setShowVideoModal(false);
                                        setShowAddContentModal(false);
                                    },
                                },
                            ]}
                        >
                            <Modal.Section>
                                <Box paddingInline="400" paddingBlock="300">
                                    <BlockStack gap={300}>
                                        <Text as="p">
                                            {t("library.video_description")}
                                        </Text>
                                        <BlockStack gap={100}>
                                            <Text fontWeight="semibold" as="p">
                                                {t("library.select_video_provider")}
                                            </Text>
                                            <Card>
                                                <BlockStack gap={200}>
                                                    {!store?.setting?.vimeo_integration?.token_data && !store?.setting?.wistia_integration?.token_data ?
                                                        <Banner status="warning">
                                                            <p>
                                                                {t("library.no_video_provider_connected")}
                                                            </p>
                                                        </Banner>
                                                        :
                                                        <InlineStack gap={500}>
                                                            {store?.setting?.vimeo_integration?.token_data && store?.setting?.vimeo_integration?.vimeo_integration_enabled ?
                                                                <RadioButton
                                                                    label={<Text>Vimeo</Text>}
                                                                    checked={selectedAccount === 'vimeo'}
                                                                    id="vimeo"
                                                                    name="provider"
                                                                    onChange={() => handleAccountChange('vimeo')}
                                                                /> :
                                                                <Banner status="info">
                                                                    <p>
                                                                        {t("library.enable_vimeo_streaming")}
                                                                    </p>
                                                                </Banner>
                                                            }
                                                            {store?.setting?.wistia_integration?.token_data && store?.setting?.wistia_integration?.wistia_integration_enabled ?
                                                                <RadioButton
                                                                    label={
                                                                        <Text>
                                                                            Wistia
                                                                        </Text>
                                                                    }
                                                                    checked={selectedAccount === 'wistia'}
                                                                    id="wistia"
                                                                    name="provider"
                                                                    onChange={() => handleAccountChange('wistia')}
                                                                /> :
                                                                <Banner status="info">
                                                                    <p>
                                                                        {t("library.enable_wistia_streaming")}
                                                                    </p>
                                                                </Banner>
                                                            }
                                                        </InlineStack>
                                                    }
                                                    <InlineStack gap={100}>
                                                        <Text>
                                                            {t("library.connected_providers_info")}
                                                        </Text>
                                                        <Text fontWeight="semibold">
                                                            {t("library.settings_arrow")}
                                                        </Text>
                                                        <div style={{
                                                            fontWeight: 'bold'
                                                        }}>
                                                            <Link onClick={handleNavigation} removeUnderline>
                                                                {t("library.video_streaming")}
                                                            </Link>
                                                        </div>
                                                    </InlineStack>
                                                </BlockStack>
                                            </Card>
                                        </BlockStack>
                                        <Select
                                            label={<Text variant="headingMd" as="h6">{t("library.select_video")}</Text>}
                                            options={videoOptions}
                                            onChange={(value) => {
                                                setSelectedVideo(value);
                                            }}
                                            value={selectedVideo}
                                            disabled={loadingVideos || !videoOptions.length}
                                            placeholder={loadingVideos ? t("library.loading_videos") : t("library.select_a_video")}
                                        />
                                    </BlockStack>
                                </Box>
                            </Modal.Section>
                        </Modal>
              <Modal
                                open={showModal}
                                onClose={() => setShowModal(false)}
                                title={t("createdigitalproduct.add_files")}
                                primaryAction={{
                                    content: t(
                                        "createdigitalproduct.add_files"
                                    ),
                                    onAction: handleSaveFiles,
                                    disabled: files.length === 0 || isSavingFiles,
                                    loading: isSavingFiles,
                                }}
                                secondaryActions={[
                                    {
                                        content: t(
                                            "digtal_product_listing.cancel"
                                        ),
                                        onAction: () => setShowModal(false),
                                    },
                                ]}
                            >
                                <Modal.Section>
                                    <BlockStack gap="400">
                                        <DropZone
                                            label={fileLabelText}
                                            onDrop={handleDropZoneDrop}
                                        >
                                             <DropZone.FileUpload actionTitle={t("createdigitalproduct.add_files")}/>
                                        </DropZone>
                                        {files.length > 0 && (
                                            <BlockStack gap="200">
                                                {files.map((file, index) => {
                                                    const exceedMaxSize =
                                                        file.size >
                                                        fileSizeLimit;

                                                    return (
                                                        <InlineStack
                                                            key={index}
                                                            gap="200"
                                                            blockAlign="center"
                                                        >
                                                            <Button
                                                                icon={
                                                                    <Icon
                                                                        source={
                                                                            XSmallIcon
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() => {
                                                                    handleDeleteFileAtIndex(
                                                                        index
                                                                    );
                                                                }}
                                                            ></Button>

                                                            <BlockStack>
                                                                <Text
                                                                    variant="bodyMd"
                                                                    as="p"
                                                                    fontWeight="bold"
                                                                    color={
                                                                        exceedMaxSize
                                                                            ? "critical"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {file.name}
                                                                </Text>
                                                                <Text
                                                                    variant="bodySm"
                                                                    as="p"
                                                                    color={
                                                                        exceedMaxSize
                                                                            ? "critical"
                                                                            : "subdued"
                                                                    }
                                                                >
                                                                    {prettyBytes(
                                                                        file.size
                                                                    )}{" "}
                                                                    {exceedMaxSize
                                                                        ? t(
                                                                              "createdigitalproduct.file_too_big_it_will_be_ignored"
                                                                          )
                                                                        : ""}
                                                                </Text>
                                                            </BlockStack>
                                                        </InlineStack>
                                                    );
                                                })}
                                            </BlockStack>
                                        )}
                                    </BlockStack>
                                </Modal.Section>
                            </Modal>

                             <Modal
                                    open={showLicenseModal}
                                    onClose={() => setShowLicenseModal(false)}
                                    title={
                                        isEditing
                                            ? t("library.edit_license_Key_Code")
                                            : t(
                                                  "createdigitalproduct.add_license_key_code"
                                              )
                                    }
                                    primaryAction={{
                                        content: isEditing
                                            ? t("library.update_license_Code")
                                            : t("library.add_license_code"),
                                        onAction: handleSaveLicenses,
                                        disabled: isLicenseActionDisabled() || isSavingLicense,
                                        loading: isSavingLicense,
                                    }}
                                    secondaryActions={[
                                        {
                                            content: t(
                                                "digtal_product_listing.cancel"
                                            ),
                                            onAction: () =>
                                                setShowLicenseModal(false),
                                        },
                                    ]}
                                >
                                    <Modal.Section>
                                        <TextField
                                            label={t(
                                                "library.title_seen_by_customer"
                                            )}
                                            value={licenseTitle}
                                            onChange={handleLicenseTitleChange}
                                            autoComplete="off"
                                        />
                                        <div style={{ marginTop: "30px" }}>
                                            <Text variant="headingMd" as="h6">
                                                {t(
                                                    "library.license_key_list_type"
                                                )}
                                            </Text>
                                            <BlockStack gap="200">
                                                <RadioButton
                                                    label={t(
                                                        "createdigitalproduct.automated_key_list"
                                                    )}
                                                    helpText={t(
                                                        "createdigitalproduct.license_keys_auto_generate_info"
                                                    )}
                                                    checked={
                                                        value === "automated"
                                                    }
                                                    id="automated"
                                                    name="keyList"
                                                    onChange={() =>
                                                        handleRadioButtonChange(
                                                            "automated"
                                                        )
                                                    }
                                                />
                                                <RadioButton
                                                    label={t(
                                                        "createdigitalproduct.manual_key_list"
                                                    )}
                                                    helpText={t(
                                                        "createdigitalproduct.license_keys_are_assigned_from_a_manually_imported_or_generated_list"
                                                    )}
                                                    checked={value === "manual"}
                                                    id="manual"
                                                    name="keyList"
                                                    onChange={() =>
                                                        handleRadioButtonChange(
                                                            "manual"
                                                        )
                                                    }
                                                />
                                            </BlockStack>
                                        </div>
                                        <div style={{ marginTop: "15px" }}>
                                            <Divider />
                                        </div>
                                        {value === "automated" && (
                                            <div>
                                                <div
                                                    style={{
                                                        marginTop: "15px",
                                                    }}
                                                >
                                                    <Text
                                                        variant="headingMd"
                                                        as="h6"
                                                    >
                                                        {t(
                                                            "createdigitalproduct.automated_key_list"
                                                        )}
                                                    </Text>
                                                    <div
                                                        style={{
                                                            color: "gray",
                                                        }}
                                                    >
                                                        <Text
                                                            variant="bodyLg"
                                                            as="p"
                                                        >
                                                            {t(
                                                                "createdigitalproduct.license_keys_auto_generate_format_info"
                                                            )}
                                                        </Text>
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "15px",
                                                    }}
                                                >
                                                    <Text
                                                        variant="headingMd"
                                                        as="h6"
                                                    >
                                                        {t(
                                                            "createdigitalproduct.edit_license_key_format"
                                                        )}
                                                    </Text>
                                                    <div
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <InlineStack gap="400">
                                                            <div
                                                                style={{
                                                                    width: "22%",
                                                                }}
                                                            >
                                                                <TextField
                                                                    label={t(
                                                                        "createdigitalproduct.prefix"
                                                                    )}
                                                                    value={
                                                                        prefix
                                                                    }
                                                                    onChange={
                                                                        handlePrefixChange
                                                                    }
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div
                                                                style={{
                                                                    width: "22%",
                                                                }}
                                                            >
                                                                <TextField
                                                                    label={t(
                                                                        "createdigitalproduct.code_length"
                                                                    )}
                                                                    min="1"
                                                                    value={
                                                                        codeLength
                                                                    }
                                                                    onChange={
                                                                        handleCodeLengthChange
                                                                    }
                                                                    type="number"
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div
                                                                style={{
                                                                    width: "22%",
                                                                }}
                                                            >
                                                                <TextField
                                                                    label={t(
                                                                        "createdigitalproduct.suffix"
                                                                    )}
                                                                    value={
                                                                        suffix
                                                                    }
                                                                    onChange={
                                                                        handleSuffixChange
                                                                    }
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div
                                                                style={{
                                                                    width: "22%",
                                                                }}
                                                            >
                                                                <TextField
                                                                    label={t(
                                                                        "createdigitalproduct.total_codes"
                                                                    )}
                                                                    value={
                                                                        totalCodes
                                                                    }
                                                                    min="1"
                                                                    onChange={
                                                                        handleTotalCodesChange
                                                                    }
                                                                    autoComplete="off"
                                                                    type="number"
                                                                    placeholder="8"
                                                                />
                                                            </div>
                                                        </InlineStack>
                                                    </div>
                                                    <div
                                                        style={{
                                                            color: "gray",
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <Text
                                                            variant="bodyLg"
                                                            as="p"
                                                        >
                                                            {t(
                                                                "createdigitalproduct.your_license_keys_will_appear_as"
                                                            )}
                                                            FWUE2TEX
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {value === "manual" && (
                                            <>
                                                <Tabs
                                                    tabs={manualLicenseTabs}
                                                    selected={
                                                        selectedManualLicenseTab
                                                    }
                                                    onSelect={
                                                        handleManualLicenseTabChange
                                                    }
                                                >
                                                    {selectedManualLicenseTab ===
                                                        0 && (
                                                        <>
                                                            <div
                                                                style={{
                                                                    marginLeft:
                                                                        "15px",
                                                                    marginRight:
                                                                        "15px",
                                                                    marginTop:
                                                                        "5px",
                                                                }}
                                                            >
                                                                <BlockStack spacing="loose">
                                                                    <DropZone
                                                                        label={t(
                                                                            "library.sample_csv"
                                                                        )}
                                                                        onDrop={
                                                                            handleLicenseDropZoneDrop
                                                                        }
                                                                        accept=".csv"
                                                                        multiple={
                                                                            false
                                                                        }
                                                                    >
                                                                          <DropZone.FileUpload actionTitle={t("createdigitalproduct.add_files")}/>
                                                                    </DropZone>

                                                                    {licenseFiles.size >
                                                                        0 && (
                                                                        <BlockStack gap="200">
                                                                            <InlineStack
                                                                                gap="200"
                                                                                blockAlign="center"
                                                                            >
                                                                                <Button
                                                                                    icon={
                                                                                        <Icon
                                                                                            source={
                                                                                                XSmallIcon
                                                                                            }
                                                                                        />
                                                                                    }
                                                                                    onClick={
                                                                                        handleLicenseDeleteFile
                                                                                    }
                                                                                />
                                                                                <BlockStack>
                                                                                    <Text
                                                                                        variation="strong"
                                                                                        fontWeight="bold"
                                                                                        color={
                                                                                            exceedMaxSizeForLicense
                                                                                                ? "critical"
                                                                                                : ""
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            licenseFiles.name
                                                                                        }
                                                                                    </Text>
                                                                                    <Text
                                                                                        variation="subdued"
                                                                                        color={
                                                                                            exceedMaxSizeForLicense
                                                                                                ? "critical"
                                                                                                : "subdued"
                                                                                        }
                                                                                    >
                                                                                        {prettyBytes(
                                                                                            licenseFiles.size
                                                                                        )}{" "}
                                                                                        {exceedMaxSizeForLicense &&
                                                                                            t(
                                                                                                "createdigitalproduct.file_too_big_it_will_be_ignored"
                                                                                            )}
                                                                                    </Text>
                                                                                </BlockStack>
                                                                            </InlineStack>
                                                                        </BlockStack>
                                                                    )}
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            as={
                                                                                "p"
                                                                            }
                                                                            variant={
                                                                                "bodyMd"
                                                                            }
                                                                        >
                                                                            {t(
                                                                                "createdigitalproduct.ready_to_upload_your_license"
                                                                            )}{" "}
                                                                            <a
                                                                                href="/license.csv"
                                                                                download
                                                                            >
                                                                                {t(
                                                                                    "createdigitalproduct.get_the_template_here"
                                                                                )}
                                                                            </a>{" "}
                                                                            {t(
                                                                                "createdigitalproduct.to_get_started"
                                                                            )}
                                                                        </Text>
                                                                    </div>
                                                                </BlockStack>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "20px",
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    label={t(
                                                                        "createdigitalproduct.deliver_keys_codes_in_sequence_order"
                                                                    )}
                                                                    checked={
                                                                        deliverKeysInSequence
                                                                    }
                                                                    onChange={
                                                                        handleDeliverKeysInSequence
                                                                    }
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                    {selectedManualLicenseTab ===
                                                        1 && (
                                                        <div
                                                            style={{
                                                                marginLeft:
                                                                    "15px",
                                                                marginRight:
                                                                    "15px",
                                                                marginTop:
                                                                    "5px",
                                                            }}
                                                        >
                                                            <TextField
                                                                label={t(
                                                                    "createdigitalproduct.paste_keys_codes"
                                                                )}
                                                                value={
                                                                    pasteKeysValue
                                                                }
                                                                onChange={
                                                                    handlePasteKeysChange
                                                                }
                                                                multiline={4}
                                                                placeholder={t(
                                                                    "createdigitalproduct.paste_your_license_keys_or_codes_here"
                                                                )}
                                                                autoComplete="off"
                                                                helpText={t(
                                                                    "createdigitalproduct.paste_your_license_keys_each_line"
                                                                )}
                                                            />
                                                        </div>
                                                    )}
                                                </Tabs>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                ></div>
                                                <Checkbox
                                                    label={t(
                                                        "createdigitalproduct.send_key_code_multiple_customers"
                                                    )}
                                                    checked={
                                                        sendKeyToMultipleCustomers
                                                    }
                                                    onChange={
                                                        handleSendKeyToMultipleCustomers
                                                    }
                                                />
                                            </>
                                        )}

                                        <div style={{ marginTop: "20px" }}>
                                            <Checkbox
                                                label={t(
                                                    "createdigitalproduct.delivery_single_key"
                                                )}
                                                checked={oneKeyDelivery}
                                                onChange={handleOneKeyDelivery}
                                            />
                                        </div>

                                        <div style={{ marginTop: "20px" }}>
                                            <Checkbox
                                                label={t(
                                                    "createdigitalproduct.deliver_as_qr_code"
                                                )}
                                                checked={qrCodeEnabled}
                                                onChange={handleQRCode}
                                            />
                                        </div>
                                        <div style={{marginTop: "20px"}}>
                                            <Checkbox
                                                label={t("createdigitalproduct.deliver_as_gift_card_send_key_code_to_gift_recipient")}
                                                checked={giftCardEnabled}
                                                onChange={handleGiftCardEnabled}
                                            />
                                        </div>

                                        {qrCodeEnabled && (
                                            <div style={{ marginTop: "0px" }}>
                                                <Checkbox
                                                    label={t("createdigitalproduct.print_qr_code_on_pdf")}
                                                    checked={qrCodePrintOnPDF}
                                                    onChange={handleQRCodePrintOnPDF}
                                                />
                                            </div>
                                        )}

                                        {giftCardEnabled && (
                                            <>
                                                <div style={{marginTop: "10px"}}>
                                                    <TextField
                                                        label={t("createdigitalproduct.email_property_name")}
                                                        value={giftCardPropertyName}
                                                        onChange={handleGiftCardPropertyNameChange}
                                                        autoComplete="off"
                                                        placeholder={t("library.enter_email_property_name")}
                                                        helpText={t("library.email_property_name_help")}
                                                    />
                                                </div>
                                                <div style={{marginTop: "10px"}}>
                                                    <TextField
                                                        label={t("createdigitalproduct.delivery_time_property_name")}
                                                        value={giftDeliveryPropertyName}
                                                        onChange={handleGiftDeliveryPropertyNameChange}
                                                        autoComplete="off"
                                                        placeholder={t("library.enter_gift_delivery_property_name")}
                                                        helpText={t("library.gift_delivery_property_name_help")}
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div style={{ marginTop: "20px" }}>
                                            <TextField
                                                label={t("createdigitalproduct.deliver_no_of_keys_codes_per_unit")}
                                                value={perUnitNoDelivery || 1}
                                                onChange={handlePerUnitNoDeliveryChange}
                                                autoComplete="off"
                                                type="number"
                                                placeholder="1"
                                                min="1"
                                            />
                                        </div>
                                    </Modal.Section>
                                </Modal>


                                 <Modal
                                    open={showCustomLinkModal}
                                    onClose={() =>
                                        setShowCustomLinkModal(false)
                                    }
                                    title={
                                        isCustomLinkEditing
                                            ? t("library.edit_custom_link")
                                            : t(
                                                  "createdigitalproduct.add_custom_link"
                                              )
                                    }
                                    primaryAction={{
                                        content: isCustomLinkEditing
                                            ? t("library.update_custom_link")
                                            : t(
                                                  "createdigitalproduct.add_custom_link"
                                              ),
                                        onAction: handleSaveCustomLink,
                                        disabled:
                                            !title.trim() ||
                                            !redirectURL.trim() ||
                                            isSavingCustomLink,
                                        loading: isSavingCustomLink,
                                    }}
                                    secondaryActions={[
                                        {
                                            content: t(
                                                "digtal_product_listing.cancel"
                                            ),
                                            onAction: () =>
                                                setShowCustomLinkModal(false),
                                        },
                                    ]}
                                >
                                    <Modal.Section>
                                        <TextField
                                            label={t(
                                                "library.title_seen_by_customer"
                                            )}
                                            value={title}
                                            onChange={handleTitleChange}
                                            autoComplete="off"
                                        />

                                        <div style={{ marginTop: "10px" }}>
                                            <TextField
                                                label={t(
                                                    "createdigitalproduct.redirects_to_url"
                                                )}
                                                value={redirectURL}
                                                type="url"
                                                onChange={
                                                    handleRedirectURLChange
                                                }
                                                autoComplete="off"
                                                placeholder="https://example.com/file.pdf"
                                            />
                                        </div>

                                        <div style={{ marginTop: "10px" }}>
                                            <TextField
                                                label={t(
                                                    "createdigitalproduct.link_details_optional"
                                                )}
                                                value={linkDetail}
                                                onChange={
                                                    handleLinkDetailChange
                                                }
                                                autoComplete="off"
                                                multiline={4}
                                                placeholder={t(
                                                    "createdigitalproduct.enter_additional_link_details_here"
                                                )}
                                            />
                                            <Text
                                                variant="bodyMd"
                                                as="p"
                                                color="subdued"
                                            >
                                                {t(
                                                    "createdigitalproduct.if_you_have_logins_details_or_other_details_about_link_then_add_here"
                                                )}
                                            </Text>
                                        </div>
                                    </Modal.Section>
                                </Modal>


                                 <Modal
                                    size="large"
                                    open={isPDFModalOpen}
                                    onClose={toggleCustomTemplateModal}
                                    title={
                                        editingTemplate
                                            ? t(
                                                  "library.edit_pdf_stamping_template"
                                              )
                                            : t("library.add_pdf_stamping")
                                    }
                                    primaryAction={{
                                        content: editingTemplate
                                            ? t("editdigitalproduct.update")
                                            : t("createdigitalproduct.add"),
                                        onAction: handleSaveTemplate,
                                        disabled:
                                            templateTitle.trim() === "" ||
                                            stampText.trim() === "" ||
                                            isSavingPDFTemplate,
                                        loading: isSavingPDFTemplate,
                                    }}
                                    secondaryActions={[
                                        {
                                            content: isPreviewLoading ? "Generating..." : "Preview",
                                            onAction: handlePreviewTemplate,
                                            disabled: !previewFile || isPreviewLoading,
                                            loading: isPreviewLoading,
                                        },
                                        {
                                            content: t(
                                                "digtal_product_listing.cancel"
                                            ),
                                            onAction: toggleCustomTemplateModal,
                                        },
                                    ]}
                                >
                                    <Modal.Section>
                                        <LegacyStack
                                            wrap={false}
                                            alignment="leading"
                                            spacing="loose"
                                        >
                                            <LegacyStack.Item fill>
                                                <FormLayout>
                                                    <FormLayout.Group condensed>
                                                        <Select
                                                            label={t(
                                                                "createdigitalproduct.text_size"
                                                            )}
                                                            options={[
                                                                {
                                                                    label: "2",
                                                                    value: "2",
                                                                },
                                                                {
                                                                    label: "4",
                                                                    value: "4",
                                                                },
                                                                {
                                                                    label: "6",
                                                                    value: "6",
                                                                },
                                                                {
                                                                    label: "8",
                                                                    value: "8",
                                                                },
                                                                {
                                                                    label: "10",
                                                                    value: "10",
                                                                },
                                                                {
                                                                    label: "12",
                                                                    value: "12",
                                                                },
                                                                {
                                                                    label: "14",
                                                                    value: "14",
                                                                },
                                                                {
                                                                    label: "16",
                                                                    value: "16",
                                                                },
                                                                {
                                                                    label: "18",
                                                                    value: "18",
                                                                },
                                                                {
                                                                    label: "20",
                                                                    value: "20",
                                                                },
                                                            ]}
                                                            value={textSize}
                                                            onChange={
                                                                setTextSize
                                                            }
                                                        />

                                                        {/* <Layout> */}
                                                        <div>
                                                            <Text
                                                                variant="bodySm"
                                                                as="p"
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.text_color"
                                                                )}
                                                            </Text>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    marginTop:
                                                                        "5px",
                                                                }}
                                                            >
                                                                <PopoverPicker
                                                                    color={
                                                                        textColor
                                                                    }
                                                                    onChange={
                                                                        setTextColor
                                                                    }
                                                                />
                                                                <div
                                                                    style={{
                                                                        width: "-webkit-fill-available",
                                                                    }}
                                                                >
                                                                    <TextField
                                                                        // label="Text Color"
                                                                        value={
                                                                            textColor
                                                                        }
                                                                        onChange={
                                                                            setTextColor
                                                                        }
                                                                        autoComplete="off"
                                                                        placeholder={t("library.enter_text_color")}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* </Layout> */}
                                                    </FormLayout.Group>
                                                </FormLayout>
                                            </LegacyStack.Item>
                                        </LegacyStack>
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <LegacyStack
                                            wrap={false}
                                            alignment="leading"
                                            spacing="loose"
                                        >
                                            <LegacyStack.Item fill>
                                                <FormLayout>
                                                    <FormLayout.Group condensed>
                                                        <Select
                                                            label={t(
                                                                "createdigitalproduct.alignment"
                                                            )}
                                                            options={[
                                                                {
                                                                    label: t(
                                                                        "createdigitalproduct.left"
                                                                    ),
                                                                    value: "left",
                                                                },
                                                                {
                                                                    label: t(
                                                                        "createdigitalproduct.center"
                                                                    ),
                                                                    value: "center",
                                                                },
                                                                {
                                                                    label: t(
                                                                        "createdigitalproduct.right"
                                                                    ),
                                                                    value: "right",
                                                                },
                                                            ]}
                                                            value={alignment}
                                                            onChange={
                                                                setAlignment
                                                            }
                                                        />
                                                        <Select
                                                            label={t(
                                                                "createdigitalproduct.font"
                                                            )}
                                                            options={[
                                                                {
                                                                    label: "Arial",
                                                                    value: "arial",
                                                                },
                                                                {
                                                                    label: "Times New Roman",
                                                                    value: "times",
                                                                },
                                                                {
                                                                    label: "Courier",
                                                                    value: "courier",
                                                                },
                                                                {
                                                                    label: "Sans Serif",
                                                                    value: "sans-serif",
                                                                },
                                                            ]}
                                                            value={font}
                                                            onChange={setFont}
                                                        />
                                                    </FormLayout.Group>
                                                </FormLayout>
                                            </LegacyStack.Item>
                                        </LegacyStack>
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <LegacyStack
                                            wrap={false}
                                            alignment="leading"
                                            spacing="loose"
                                        >
                                            <LegacyStack.Item fill>
                                                <FormLayout>
                                                    <FormLayout.Group condensed>
                                                        <Select
                                                            label={t(
                                                                "createdigitalproduct.page_size"
                                                            )}
                                                            options={[
                                                                {
                                                                    label: "A4",
                                                                    value: "A4",
                                                                },
                                                                {
                                                                    label: "Letter",
                                                                    value: "Letter",
                                                                },
                                                            ]}
                                                            value={pageSize}
                                                            onChange={
                                                                setPageSize
                                                            }
                                                        />
                                                        <Select
                                                            label={t(
                                                                "createdigitalproduct.page_layout"
                                                            )}
                                                            options={[
                                                                {
                                                                    label: "Portrait",
                                                                    value: "portrait",
                                                                },
                                                                {
                                                                    label: "Landscape",
                                                                    value: "landscape",
                                                                },
                                                            ]}
                                                            value={pageLayout}
                                                            onChange={
                                                                setPageLayout
                                                            }
                                                        />
                                                    </FormLayout.Group>
                                                </FormLayout>
                                            </LegacyStack.Item>
                                        </LegacyStack>
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <LegacyStack
                                            wrap={false}
                                            alignment="leading"
                                            spacing="loose"
                                        >
                                            <LegacyStack.Item fill>
                                                <FormLayout>
                                                    <FormLayout.Group condensed>
                                                        <TextField
                                                            label={t(
                                                                "createdigitalproduct.vertical_adjustment_margin_from_bottom"
                                                            )}
                                                            type="number"
                                                            value={
                                                                verticalAdjustment
                                                            }
                                                            onChange={
                                                                setVerticalAdjustment
                                                            }
                                                            autoComplete="off"
                                                            placeholder={t("library.example_number")}
                                                        />
                                                        <TextField
                                                            label={t(
                                                                "createdigitalproduct.pages_to_stamp"
                                                            )}
                                                            value={pagesToStamp}
                                                            onChange={
                                                                setPagesToStamp
                                                            }
                                                            autoComplete="off"
                                                            placeholder={t("library.example_numbers")}
                                                        />
                                                    </FormLayout.Group>
                                                </FormLayout>
                                            </LegacyStack.Item>
                                        </LegacyStack>
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <TextField
                                            label={t(
                                                "createdigitalproduct.stamp_text"
                                            )}
                                            multiline={4}
                                            value={stampText}
                                            onChange={setStampText}
                                            autoComplete="off"
                                            placeholder={t("library.stamp_text_placeholder")}
                                        />
                                        <div style={{ marginTop: "10px" }}>
                                            <Text as="p" variant="bodyMd">
                                                {t(
                                                    "createdigitalproduct.pdf_options"
                                                )}
                                            </Text>
                                        </div>
                                        <div style={{ marginTop: "5px" }}>
                                            <Checkbox
                                                checked={allowPrinting}
                                                onChange={setAllowPrinting}
                                                label={t(
                                                    "createdigitalproduct.allow_printing"
                                                )}
                                            />
                                        </div>
                                        <div style={{ marginTop: "5px" }}>
                                            <Checkbox
                                                checked={allowCopy}
                                                onChange={setAllowCopy}
                                                label={t(
                                                    "createdigitalproduct.allow_contents_to_be_copied_to_clipboard"
                                                )}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                marginTop: "5px",
                                                display: "none",
                                            }}
                                        >
                                            <Checkbox
                                                checked={passwordProtect}
                                                onChange={setPasswordProtect}
                                                label={t(
                                                    "createdigitalproduct.password_protect_pdf"
                                                )}
                                            />
                                        </div>
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <TextField
                                            label={t(
                                                "createdigitalproduct.template_title"
                                            )}
                                            value={templateTitle}
                                            onChange={setTemplateTitle}
                                            autoComplete="off"
                                            placeholder={t(
                                                "createdigitalproduct.enter_a_title_for_your_pdf_template"
                                            )}
                                        />
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <div>
                                            <Text as="h3" variant="headingMd">
                                                {t("library.preview_template")}
                                            </Text>
                                            <div style={{ marginTop: "5px" }}>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handlePreviewFileChange}
                                                    style={{ display: 'none' }}
                                                    id="preview-pdf-input-library"
                                                />
                                                <Button onClick={() => document.getElementById('preview-pdf-input-library').click()}>
                                                    {t("library.choose_pdf_for_preview")}
                                                </Button>
                                                {previewFile && (
                                                    <Text as="span" variant="bodySm" tone="subdued" style={{ marginLeft: '10px' }}>
                                                        {previewFile.name}
                                                    </Text>
                                                )}
                                            </div>
                                            <div style={{ marginTop: "5px" }}>
                                                <Text as="p" variant="bodySm" tone="subdued">
                                                    {t("library.select_pdf_to_preview")}
                                                </Text>
                                            </div>
                                        </div>
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <Text as="h3" variant="headingMd">
                                            {t(
                                                "createdigitalproduct.stamping_variables"
                                            )}
                                        </Text>
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <Text as="p" variant="bodyLg">
                                            {t(
                                                "library.pdf_stamping_uses_liquid_templating_see_the"
                                            )}{" "}
                                            <strong
                                                style={{
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                {t("library.reference_guide")}
                                            </strong>{" "}
                                            {t(
                                                "library.for_all_the_options_below_are_the_most_commonly_used_stamping_variables"
                                            )}
                                        </Text>
                                        <div
                                            style={{ marginTop: "10px" }}
                                        ></div>
                                        <Text as="p" variant="bodyLg">
                                            <code
                                                style={{ color: "#D5006D" }}
                                            >{`{{order.receiver_name}}`}</code>{" "}
                                            {t("library.for_receiver_name")}
                                        </Text>
                                        <Text as="p" variant="bodyLg">
                                            <code
                                                style={{ color: "#D5006D" }}
                                            >{`{{order.receiver_email}}`}</code>{" "}
                                            {t("library.for_receiver_email")}
                                        </Text>
                                        <Text as="p" variant="bodyLg">
                                            <code
                                                style={{ color: "#D5006D" }}
                                            >{`{{order.id}}`}</code>{" "}
                                            {t("library.for_the_order_id")}
                                        </Text>
                                        <Text as="p" variant="bodyLg">
                                            <code
                                                style={{ color: "#D5006D" }}
                                            >{`{{product.name}}`}</code>{" "}
                                            {t(
                                                "library.for_the_stamped_product_name"
                                            )}
                                        </Text>
                                    </Modal.Section>
                                </Modal>



            <Modal
                open={modalActive}
                onClose={toggleModal}
                title={t("library.confirm_deletion")}
                primaryAction={{
                    destructive: true,
                    content: t("digtal_product_listing.delete"),
                    onAction: confirmDelete,
                }}
                secondaryActions={[
                    {
                        content: t("digtal_product_listing.cancel"),
                        onAction: toggleModal,
                    },
                ]}
            >
                <Modal.Section>
                    <Text variant="bodyLg" as="p">
                        {t("library.are_you_sure_you_want_to_delete_this_file")}
                    </Text>
                </Modal.Section>
            </Modal>

            <Tabs
                tabs={mainTabs}
                selected={tabSelected}
                onSelect={handleMainTabChange}
            >
                <LegacyCard sectioned>
                    {getContentForTab(tabSelected)}
                </LegacyCard>
            </Tabs>
        </Page>
        </div>
    );


    function getContentForTab(selectedTab) {
        const handleDeleteLicense = async (id) => {
            try {
                await fetch(`/api/delete-licenses/${id}`, { method: "DELETE" });
                setLicenses(licenses.filter((license) => license.id !== id));
                shopify.toast.show(t("library.license_deleted_successfully"));
            } catch (error) {
                console.error("Error deleting license:", error);
                shopify.toast.show(t("library.failed_to_delete_license"), { isError: true, duration: 9999999 });
            }
        };

        const handleDeleteCustom = async (id) => {
            try {
                await fetch(`/api/delete-customs/${id}`, { method: "DELETE" });
                setCustoms(customs.filter((custom) => custom.id !== id));
                shopify.toast.show(t("library.custom_link_deleted_successfully"));
            } catch (error) {
                console.error("Error deleting custom link:", error);
                shopify.toast.show(t("library.failed_to_delete_custom_link"), { isError: true, duration: 9999999 });
            }
        };

        const confirmItemDelete = () => {
            if (itemToDelete.type === "license") {
                handleDeleteLicense(itemToDelete.id);
            } else if (itemToDelete.type === "custom") {
                handleDeleteCustom(itemToDelete.id);
            } else if (itemToDelete.type === "video") {
                handleDeleteVideo(itemToDelete.id);
            }
            setItemToDelete({ type: "", id: null });
            toggleItemModal();
        };

        const showDeleteItemModal = (type, id) => {
            setItemToDelete({ type, id });
            toggleItemModal();
        };

        const showLoadLicensesModal = (id) => {
            setLoadLicenseId((prev) => id);
            toggleLoadLicenseModal();
        };

        switch (selectedTab) {
            case 0:
                if (orders.length === 0) {
                    return (
                        <EmptyState
                            heading={t("library.no_files_found")}
                            image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
                        >
                            <p>{t("library.try_to_add_new_file")}</p>
                        </EmptyState>
                    );
                } else {
                    return (
                        <>
                            <div style={{ margin: "5px", padding: "5px" }}>
                                <InlineStack gap="200">
                                    <div style={{ width: "91%" }}>
                                        <Autocomplete
                                            options={searchOptions}
                                            selected={selectedOptions}
                                            onSelect={updateSelection}
                                            textField={textField}
                                            loading={loading}
                                        />
                                    </div>

                                    <div style={{ width: "7%" }}>
                                        <Button
                                            variant="primary"
                                            onClick={handleSearch}
                                            primary
                                        >
                                            {t("createdigitalproduct.search")}
                                        </Button>
                                    </div>
                                </InlineStack>
                            </div>
                            <IndexTable
                                resourceName={resourceName}
                                itemCount={orders.length}
                                selectedItemsCount={
                                    allResourcesSelected
                                        ? "All"
                                        : selectedResources.length
                                }
                                onSelectionChange={handleSelectionChange}
                                headings={[
                                    { title: t("createdigitalproduct.file") },
                                    {
                                        title: t(
                                            "createdigitalproduct.file_type"
                                        ),
                                    },
                                    {
                                        title: t(
                                            "createdigitalproduct.file_size"
                                        ),
                                    },
                                    { title: t("library.orders") },
                                    { title: t("library.attached_to") },
                                    { title: t("library.actions") },
                                ]}
                            >
                                {rowMarkup}
                            </IndexTable>
                            {isLoadingData && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    <Spinner size="small" />
                                </div>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <Pagination
                                    hasPrevious={currentPageFiles > 1}
                                    onPrevious={() =>
                                        setCurrentPageFiles(
                                            currentPageFiles - 1
                                        )
                                    }
                                    hasNext={
                                        totalFiles >
                                        currentPageFiles * itemsPerPage
                                    }
                                    onNext={() =>
                                        setCurrentPageFiles(
                                            currentPageFiles + 1
                                        )
                                    }
                                    labels={{
                                        next: "Next",
                                        previous: "Previous",
                                    }}
                                />
                            </div>
                        </>
                    );
                }
            case 1:
                if (licenses.length === 0) {
                    return (
                        <EmptyState
                            heading={t("library.no_licenses_found")}
                            image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
                        >
                            <p>{t("library.try_to_add_new_license")}</p>
                        </EmptyState>
                    );
                } else {
                    return (
                        // <IndexTable
                        //     resourceName={resourceNameForLicense}
                        //     itemCount={licenses.length}
                        //     selectedItemsCount={
                        //         allResourcesSelectedForLicense ? 'All' : selectedResourcesForLicense.length
                        //     }
                        //     onSelectionChange={handleSelectionChangeForLicense}
                        //     headings={[
                        //         { title: 'Title' },
                        //         { title: 'License Type' },
                        //         { title: 'Prefix' },
                        //         { title: 'Code Length' },
                        //         { title: 'Suffix' },
                        //         { title: 'Total Codes' },
                        //         { title: 'File' }
                        //     ]}
                        // >
                        //     {rowMarkupForLicense}
                        // </IndexTable>
                        <div>
                            <Modal
                                open={modalLoadActive}
                                onClose={toggleLoadLicenseModal}
                                title="Replenish more Licenses to existing csv."
                                primaryAction={{
                                    content: t("library.load_now"),
                                    onAction: loadLicenseCsv,
                                }}
                                secondaryActions={[
                                    {
                                        content: t(
                                            "digtal_product_listing.cancel"
                                        ),
                                        onAction: toggleLoadLicenseModal,
                                    },
                                ]}
                            >
                                <Modal.Section>
                                    <Text variant="bodyLg" as="p">
                                        {t(
                                            "library.load_more_keys_codes_to_your_license"
                                        )}
                                    </Text>
                                    <BlockStack spacing="loose">
                                        <DropZone
                                            label={t(
                                                "library.add_keys_codes_csv_file"
                                            )}
                                            onDrop={
                                                handLoadleLicenseDropZoneDrop
                                            }
                                            accept=".csv"
                                            allowMultiple={false}
                                        >
                                            <DropZone.FileUpload actionTitle={t("createdigitalproduct.add_files")}/>
                                        </DropZone>

                                        {loadLicenseFile && (
                                            <BlockStack gap="200">
                                                <InlineStack
                                                    gap="200"
                                                    blockAlign="center"
                                                >
                                                    <Button
                                                        icon={
                                                            <Icon
                                                                source={
                                                                    XSmallIcon
                                                                }
                                                            />
                                                        }
                                                        onClick={() => {
                                                            handleDeleteFileLoad();
                                                        }}
                                                    ></Button>

                                                    <BlockStack>
                                                        <Text
                                                            variant="bodyMd"
                                                            as="p"
                                                            fontWeight="bold"
                                                        >
                                                            {
                                                                loadLicenseFile.name
                                                            }
                                                        </Text>
                                                    </BlockStack>
                                                </InlineStack>
                                            </BlockStack>
                                        )}
                                    </BlockStack>
                                </Modal.Section>
                            </Modal>

                            <DataTable
                                columnContentTypes={[
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                ]}
                                headings={[
                                    t("createdigitalproduct.add_files_lg"),
                                    t("createdigitalproduct.license_type"),
                                    t("library.codes_remaining"),
                                    t("createdigitalproduct.file"),
                                    t("library.attached_to"),
                                    t("library.orders"),
                                    t("library.actions"),
                                ]}
                                rows={licenses.map((license) => [
                                    license.title,
                                    license.license_type,
                                    license.codes_remaining,

                                    <span>
                                        {getFileName(license.file) && (
                                            <Link
                                                url={
                                                    JSON.parse(license.file)
                                                        .url ?? "#"
                                                }
                                            >
                                                {getFileName(license.file)}
                                            </Link>
                                        )}
                                    </span>,
                                    <span>
                                        {license.totalProducts} products
                                    </span>,
                                    <span>{license.totalOrders} orders</span>,

                                    <ButtonGroup>
                                        <div
                                            style={{
                                                display: "flex",
                                            }}
                                        >
                                            {license.license_type == "manual" &&
                                                license.manual_codes_type ==
                                                "csv" && (
                                                    <Button
                                                        onClick={() =>
                                                            showLoadLicensesModal(
                                                                license.id
                                                            )
                                                        }
                                                    >
                                                        {t("library.load_licenses")}
                                                    </Button>
                                                )}
                                            <div
                                                style={{
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                <Button
                                                    onClick={() =>
                                                        handleEditClick(license)
                                                    }
                                                >
                                                    {t(
                                                        "digtal_product_listing.edit"
                                                    )}
                                                </Button>
                                            </div>
                                            <div
                                                style={{
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                <Button
                                                    onClick={() =>
                                                        showDeleteItemModal(
                                                            "license",
                                                            license.id
                                                        )
                                                    }
                                                    variant="primary"
                                                    tone="critical"
                                                >
                                                    {t(
                                                        "digtal_product_listing.delete"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* </div> */}
                                    </ButtonGroup>,
                                ])}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <Pagination
                                    hasPrevious={currentPageLicenses > 1}
                                    onPrevious={() =>
                                        setCurrentPageLicenses(
                                            currentPageLicenses - 1
                                        )
                                    }

                                    hasNext={
                                        totalLicenses >
                                        currentPageLicenses * itemsPerPage
                                    }

                                    onNext={() =>
                                        setCurrentPageLicenses(
                                            currentPageLicenses + 1
                                        )
                                    }
                                />
                            </div>
                            {isLoadingData && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    <Spinner size="small" />
                                </div>
                            )}
                            <Modal
                                open={modalItemActive}
                                onClose={toggleItemModal}
                                title={t("library.confirm_deletion")}
                                primaryAction={{
                                    destructive: true,
                                    content: t("digtal_product_listing.delete"),
                                    onAction: confirmItemDelete,
                                }}
                                secondaryActions={[
                                    {
                                        content: t("digtal_product_listing.cancel"),
                                        onAction: toggleItemModal,
                                    },
                                ]}
                            >
                                <Modal.Section>
                                    <Text variant="bodyLg" as="p">
                                        {t("library.are_you_sure_you_want_to_delete_this_license")}
                                    </Text>
                                </Modal.Section>
                            </Modal>
                        </div>
                    );
                }
            case 2:
                if (customs.length === 0) {
                    return (
                        <EmptyState
                            heading={t("library.no_customs_found")}
                            image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
                        >
                            <p>{t("library.try_to_add_new_custom")}</p>
                        </EmptyState>
                    );
                } else {
                    return (
                        // <IndexTable
                        //     resourceName={resourceNameForCustom}
                        //     itemCount={customs.length}
                        //     selectedItemsCount={
                        //         allResourcesSelectedForCustom ? 'All' : selectedResourcesForCustom.length
                        //     }
                        //     onSelectionChange={handleSelectionChangeForCustom}
                        //     headings={[
                        //         { title: 'Title' },
                        //         { title: 'Redirect Url' },
                        //         { title: 'Link Detail' },
                        //     ]}
                        // >
                        //     {rowMarkupForCustom}
                        // </IndexTable>
                        <div>
                            <Modal
                                open={modalItemActive}
                                onClose={toggleItemModal}
                                title={t("library.confirm_deletion")}
                                primaryAction={{
                                    destructive: true,
                                    content: t("digtal_product_listing.delete"),
                                    onAction: confirmItemDelete,
                                }}
                                secondaryActions={[
                                    {
                                        content: t(
                                            "digtal_product_listing.cancel"
                                        ),
                                        onAction: toggleItemModal,
                                    },
                                ]}
                            >
                                <Modal.Section>
                                    <Text variant="bodyLg" as="p">
                                        {t(
                                            "library.are_you_sure_you_want_to_delete_this_custom_link"
                                        )}
                                    </Text>
                                </Modal.Section>
                            </Modal>

                            <DataTable
                                columnContentTypes={[
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                ]}
                                headings={[
                                    t("createdigitalproduct.title"),
                                    t("library.attached_to"),
                                    t("library.orders"),
                                    t("library.actions"),
                                ]}
                                rows={customs.map((link) => [
                                    link.title,
                                    <span>{link.totalProducts} products</span>,
                                    <span>{link.totalOrders} orders</span>,

                                    <ButtonGroup>
                                        <div
                                            style={{
                                                display: "flex",
                                            }}
                                        >
                                            <Button
                                                onClick={() =>
                                                    handleEditCustomLink(link)
                                                }
                                            >
                                                {t(
                                                    "digtal_product_listing.edit"
                                                )}
                                            </Button>
                                            <div
                                                style={{
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                <Button
                                                    onClick={() =>
                                                        showDeleteItemModal(
                                                            "custom",
                                                            link.id
                                                        )
                                                    }
                                                    variant="primary"
                                                    tone="critical"
                                                >
                                                    {t(
                                                        "digtal_product_listing.delete"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </ButtonGroup>,
                                ])}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <Pagination
                                    hasPrevious={currentPageCustoms > 1}
                                    onPrevious={() =>
                                        setCurrentPageCustoms(
                                            currentPageCustoms - 1
                                        )
                                    }
                                    hasNext={
                                        totalCustoms >
                                        currentPageCustoms * itemsPerPage
                                    }

                                    onNext={() =>
                                        setCurrentPageCustoms(
                                            currentPageCustoms + 1
                                        )
                                    }
                                />
                            </div>

                            {isLoadingData && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    <Spinner size="small" />
                                </div>
                            )}
                        </div>
                    );
                }
            case 3:
                if (pdfTemplates.length === 0) {
                    return (
                        <EmptyState
                            heading={t("library.no_pdf_stamping_found")}
                            image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
                        >
                            <p>{t("library.try_to_add_new_pdf_stamping")}</p>
                        </EmptyState>
                    );
                } else {
                    return (
                        <div>
                            <Modal
                                open={pdfDeleteModal}
                                onClose={() => setPdfDeleteModal(false)}
                                title={t("library.confirm_deletion")}
                                primaryAction={{
                                    destructive: true,
                                    content: t("digtal_product_listing.delete"),
                                    onAction: deletePdfTemplate,
                                }}
                                secondaryActions={[
                                    {
                                        content: t(
                                            "digtal_product_listing.cancel"
                                        ),
                                        onAction: () =>
                                            setPdfDeleteModal(false),
                                    },
                                ]}
                            >
                                <Modal.Section>
                                    <Text variant="bodyLg" as="p">
                                        {t(
                                            "library.are_you_sure_you_want_to_delete_this_pdf_template"
                                        )}
                                    </Text>
                                </Modal.Section>
                            </Modal>
                            <DataTable
                                columnContentTypes={[
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                ]}
                                headings={[
                                    t("createdigitalproduct.title"),
                                    t("createdigitalproduct.font"),
                                    t("createdigitalproduct.text_color"),
                                    t("createdigitalproduct.page_layout"),
                                    t("library.attached_to"),
                                    t("library.actions"),
                                ]}
                                rows={pdfTemplates.map((template) => [
                                    template.title,
                                    template.pdf_stamping.font,
                                    template.pdf_stamping.text_color,
                                    template.pdf_stamping.page_layout,
                                    <span>
                                        {" "}
                                        {template.totalProducts} products
                                    </span>,
                                    <ButtonGroup>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleEdit(template)}
                                        >
                                            {t("digtal_product_listing.edit")}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                openDeleteConfirmationModal(
                                                    template.id
                                                )
                                            }
                                            variant="primary"
                                            tone="critical"
                                        >
                                            {t("digtal_product_listing.delete")}
                                        </Button>
                                    </ButtonGroup>,
                                ])}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <Pagination
                                    hasPrevious={currentPagePDFs > 1}
                                    onPrevious={() =>
                                        setCurrentPagePDFs(
                                            currentPagePDFs - 1
                                        )
                                    }
                                    hasNext={
                                        totalPDFs >
                                        currentPagePDFs * itemsPerPage
                                    }
                                    onNext={() =>
                                        setCurrentPagePDFs(
                                            currentPagePDFs + 1
                                        )
                                    }
                                />
                            </div>

                            {isLoadingData && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    <Spinner size="small" />
                                </div>
                            )}
                        </div>
                    );
                }
            case 4:
                if (videos.length === 0) {
                    return (
                        <EmptyState
                            heading={t("library.no_streaming_videos_found")}
                            image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
                        >
                            <p>{t("library.add_videos_from_vimeo_wistia")}</p>
                        </EmptyState>
                    );
                } else {
                    return (
                        <>
                            <div style={{ margin: "5px", padding: "5px" }}>
                                <InlineStack gap="200">
                                    <div style={{ width: "91%" }}>
                                        <Autocomplete
                                            options={searchVideoOptions}
                                            selected={selectedVideoOptions}
                                            onSelect={updateVideoSelection}
                                            textField={videoTextField}
                                            loading={loading}
                                        />
                                    </div>

                                    <div style={{ width: "7%" }}>
                                        <Button
                                            variant="primary"
                                            onClick={handleVideoSearch}
                                        >
                                            {t("createdigitalproduct.search")}
                                        </Button>
                                    </div>
                                </InlineStack>
                            </div>
                            <IndexTable
                                resourceName={videoResourceName}
                                itemCount={videos.length}
                                headings={[
                                    { title: t("library.thumbnail") },
                                    { title: t("library.title") },
                                    { title: t("library.duration") },
                                    { title: t("library.provider") },
                                    { title: t("library.attached_to") },
                                    { title: t("library.actions") },
                                ]}
                            >
                                {videos.map((video, index) => (
                                    <IndexTable.Row
                                        id={video.id}
                                        key={video.id}
                                        position={index}
                                    >
                                        <IndexTable.Cell>
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                style={{
                                                    width: '60px',
                                                    height: '40px',
                                                    borderRadius: '4px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>
                                            <div style={{ maxWidth: 420 }}>
                                                <Text
                                                    truncate
                                                    variant="bodyMd"
                                                    as="span"
                                                    fontWeight="medium"
                                                    title={video.title}
                                                >
                                                    {video.title}
                                                </Text>
                                            </div>
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>
                                            <Text variant="bodyMd" as="span">
                                                {video.duration}
                                            </Text>
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>
                                            {video.provider?.toUpperCase()}
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>
                                            {video.totalProducts ?? 0} {video.totalProducts === 1 ? t("library.product") : t("library.products")}
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>
                                            <Button
                                                size="slim"
                                                variant="primary"
                                                tone="critical"
                                                onClick={() => {
                                                    setItemToDelete({ type: "video", id: video.id });
                                                    toggleItemModal();
                                                }}
                                            >
                                                {t("library.delete")}
                                            </Button>
                                        </IndexTable.Cell>
                                    </IndexTable.Row>
                                ))}
                            </IndexTable>
                            {isLoadingData && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    <Spinner size="small" />
                                </div>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <Pagination
                                    hasPrevious={currentPageVideos > 1}
                                    onPrevious={() => handleVideoPageChange(currentPageVideos - 1)}
                                    hasNext={totalVideos > currentPageVideos * itemsPerPage}
                                    onNext={() => handleVideoPageChange(currentPageVideos + 1)}
                                    labels={{
                                        next: "Next",
                                        previous: "Previous",
                                    }}
                                />
                            </div>
                            <Modal
                                open={modalItemActive}
                                onClose={toggleItemModal}
                                title={t("library.confirm_deletion")}
                                primaryAction={{
                                    destructive: true,
                                    content: t("digtal_product_listing.delete"),
                                    onAction: confirmItemDelete,
                                }}
                                secondaryActions={[
                                    {
                                        content: t("digtal_product_listing.cancel"),
                                        onAction: toggleItemModal,
                                    },
                                ]}
                            >
                                <Modal.Section>
                                    <Text variant="bodyLg" as="p">
                                        {t("library.are_you_sure_you_want_to_delete_this_video")}
                                    </Text>
                                </Modal.Section>
                            </Modal>
                        </>
                    );
                }
            default:
                return (
                    <Text variant="bodyLg" as="p">
                        {t("library.no_content_available")}
                    </Text>
                );
        }
    }
}

export default Library;
