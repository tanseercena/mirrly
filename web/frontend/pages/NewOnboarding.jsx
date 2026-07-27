//s vr
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Page,
    Card,
    Layout,
    Button,
    Text,
    InlineStack,
    Box,
    BlockStack,
    Link,
    SkeletonPage,
    SkeletonBodyText,
    InlineGrid,
    Badge,
    Thumbnail,
    Select,
    Checkbox,
    Divider,
    TextField,
    Modal,
    DropZone,
    Icon,
    Tabs,
    LegacyStack,
    RadioButton,
    Banner,
    ProgressBar,
    Autocomplete,
    List,
    FormLayout,
} from "@shopify/polaris";
import {
    XSmallIcon,
    CheckSmallIcon,
    CalendarIcon,
} from "@shopify/polaris-icons";
import prettyBytes from "pretty-bytes";
import { AppContext } from "../components/providers/AppProvider.jsx";
import { PopoverPicker } from "../components/PopoverPicker.jsx";
import { useAppBridge } from "@shopify/app-bridge-react";
import { SaveBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";

import LanguageSelector from "../components/LanguageSelector.jsx";
import { PageLoader } from "../components/PageLoader.jsx";
const MAX_FILE_BYTE = 1073741824;
const MAX_SAMPLE_FILE_BYTE = 10485760;
const MAX_SAMPLE_FILES = 5;
//e cr
export default function NewOnboarding() {
    // const authenticatedFetch = useAuthenticatedFetch();
    const [currentStep, setCurrentStep] = useState(1);
    // const [language, setLanguage] = useState("english");
    // const [selectedCard, setSelectedCard] = useState(null);
    // const [selectedColor, setSelectedColor] = useState("yellow");
    // const [message, setMessage] = useState("Happy Birthday");
    // const [makeGift, setMakeGift] = useState(false);
    // const [selectedCategory, setSelectedCategory] = useState(null);
    // const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [themeExtensionActivated, setThemeExtensionActivated] =
        useState(false);
    const [selectedProductType, setSelectedProductType] = useState(null);

    const totalSteps = 4;

    //s cr
    const { store } = React.useContext(AppContext);
    const shopify = useAppBridge();
    const navigate = useNavigate();
    const [selected, setSelected] = useState("active");
    const [autoFulfill, setAutoFulfill] = useState(false);
    const [downloadLimit, setDownloadLimit] = useState("");
    const [isDownloadLimitEnabled, setIsDownloadLimitEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [files, setFiles] = useState([]);
    const [sampleFiles, setSampleFiles] = useState([]);
    const [licenseFiles, setLicenseFiles] = useState([]);
    const [attachedLicenseFile, setAttachedLicenseFile] = useState(null);
    const [licenses, setLicenses] = useState([]);
    const [customs, setCustoms] = useState([]);
    const [orders, setOrders] = useState([]);
    // const [filterLicenseValue, setFilterLicenseValue] = useState("");
    // const [filterCustomValue, setFilterCustomValue] = useState("");
    const [selectedFileIds, setSelectedFileIds] = useState([]); // Track selected file IDs across all pages
    const [selectedFileDetails, setSelectedFileDetails] = useState([]); // Track full details of selected files
    const [selectedMainTab, setSelectedMainTab] = useState(0);
    const [selectedLicenseIds, setSelectedLicenseIds] = useState([]);
    const [licenseKeysPerUnit, setLicenseKeysPerUnit] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [selectedLicenseTab, setSelectedLicenseTab] = useState(0);
    const [selectedManualLicenseTab, setSelectedManualLicenseTab] = useState(0);
    const [selectedCustomIds, setSelectedCustomIds] = useState([]);
    const [selectAllForCustom, setSelectAllForCustom] = useState(false);
    const [selectedCustomTab, setSelectedCustomTab] = useState(0);
    const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
    const [isCustomLinkModalOpen, setIsCustomLinkModalOpen] = useState(false);
    const [tagInputValue, setTagInputValue] = useState("");
    const [tags, setTags] = useState([]);
    // Add state to track all licenses across all pages
    const [allLicenses, setAllLicenses] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [redirectURL, setRedirectURL] = useState("");
    const [linkDetail, setLinkDetail] = useState("");
    const [licenseTitle, setLicenseTitle] = useState("");
    const [value, setValue] = useState("automated");
    const [prefix, setPrefix] = useState("");
    const [codeLength, setCodeLength] = useState("");
    const [suffix, setSuffix] = useState("");
    const [licensePreview, setLicensePreview] = useState('FWUE2TEX');
    const [totalCodes, setTotalCodes] = useState("");
    const [contentType, setContentType] = useState([]);
    const [saving, setSaving] = useState(false);
    const [userPlan, setUserPlan] = useState("free");
    const [fileStorageLimit, setFileStorageLimit] = useState(null);
    const [currentFileStorage, setCurrentFileStorage] = useState(0);
    const [fileSizeLimit, setFileSizeLimit] = useState("No limit");
    const [digitalProducts, setDigitalProducts] = useState([]);
    const [digitalProductsLimit, setDigitalProductsLimit] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // For ongoing loading operations
    const [isFinishingOnboarding, setIsFinishingOnboarding] = useState(false); // For finish-onboarding API call

    // Track loading states for all essential data
    const [isStoreLoaded, setIsStoreLoaded] = useState(false);
    const [isPdfTemplatesLoaded, setIsPdfTemplatesLoaded] = useState(false);
    const [isNewUserChecked, setIsNewUserChecked] = useState(false);
    const [isUserPlanLoaded, setIsUserPlanLoaded] = useState(false);
    const [isEmailTemplatesLoaded, setIsEmailTemplatesLoaded] = useState(false);
    const [isCurrentFilesLoaded, setIsCurrentFilesLoaded] = useState(false);
    const [isLimitExceededModalActive, setIsLimitExceededModalActive] =
        useState(false);
    const [currentPageFiles, setCurrentPageFiles] = useState(1);
    const [currentPageLicenses, setCurrentPageLicenses] = useState(1);
    const [currentPageCustoms, setCurrentPageCustoms] = useState(1);
    const [totalFiles, setTotalFiles] = useState(0);
    const [totalLicenses, setTotalLicenses] = useState(0);
    const [totalCustoms, setTotalCustoms] = useState(0);
    const itemsPerPage = 10;
    const [productMessage, setProductMessage] = useState("");
    const [newLicenses, setNewLicenses] = useState([]);
    const [newCustoms, setNewCustoms] = useState([]);
    const [qrCodeEnabled, setQrCodeEnabled] = useState(false);
    const [qrCodePrintOnPDF, setQRCodePrintOnPDF] = useState(false);
    const [giftCardEnabled, setGiftCardEnabled] = useState(false);
    const [giftCardPropertyName, setGiftCardPropertyName] = useState("");
    const [giftDeliveryPropertyName, setGiftDeliveryPropertyName] =
        useState("");
    const [sendKeyToMultipleCustomers, setSendKeyToMultipleCustomers] =
        useState(false);
    const [deliverKeysInSequence, setDeliverKeysInSequence] = useState(false);
    const [perUnitNoDelivery, setPerUnitNoDelivery] = useState(1);
    const { t } = useTranslation();
    const [defaultTemplateId, setDefaultTemplateId] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const app = useAppBridge();
    const APP_ID = "78b2cf9c2a9c63431defd44ad600ee8f";
    const EXTENSION_HANDLE = "digitally";
    const [isMobile, setIsMobile] = useState(false);

    // SaveBar state
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [isInitialDataCaptured, setIsInitialDataCaptured] = useState(false);
    const [isManualDeliveryEnabled, setIsManualDeliveryEnabled] =
        useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function nodeContainsDescendant(rootNode, descendant) {
        if (rootNode === descendant) {
            return true;
        }
        let parent = descendant.parentNode;
        while (parent != null) {
            if (parent === rootNode) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }

    const [visible, setVisible] = useState(false);
    const [expirationType, setExpirationType] = useState("days");
    const [expirationDays, setExpirationDays] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDownloadExpirationEnabled, setIsDownloadExpirationEnabled] =
        useState(false);
    const [isProductMessageEnabled, setIsProductMessageEnabled] =
        useState(false);
    const [{ month, year }, setDate] = useState({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
    });
    const datePickerRef = useRef(null);
    const formattedValue = selectedDate.toISOString().slice(0, 10);
    const [progress, setProgress] = useState(0);
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

    const [emailTemplateType, setEmailTemplateType] = useState("");
    const [emailTemplateId, setEmailTemplateId] = useState();
    const [emailTemplates, setEmailTemplates] = useState();
    const [pasteKeysValue, setPasteKeysValue] = useState("");

    const [isPdfStampingEnabled, setIsPdfStampingEnabled] = useState(false);
    const [templateChoice, setTemplateChoice] = useState("default");
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
    const [PDFTemplateId, setPDFTemplateId] = useState(null);
    const [pdfTemplates, setPdfTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [previewFile, setPreviewFile] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [googleDriveLink, setGoogleDriveLink] = useState("");

    // function isNodeWithinPopover(node) {
    //     return datePickerRef?.current
    //         ? nodeContainsDescendant(datePickerRef.current, node)
    //         : false;
    // }

    const handlePdfStampingEnabledChange = (checked) => {
        setIsPdfStampingEnabled(checked);
    };

    const handleTemplateChoiceChange = (newTemplateChoice) => {
        setTemplateChoice(newTemplateChoice);
    };

    const checkNewUsers = async () => {
        try {
            const response = await fetch("/api/check-new-user");
            const data = await response.json();
            setIsNewUser(data.isNewUser);
            if (data.isNewUser) {
                setEmailTemplateType("default");
            }
        } catch (error) {
            console.error("Failed to fetch user plan:", error);
        } finally {
            setIsNewUserChecked(true);
        }
    };

    // const handleEmailTemplateCustom = () => {
    //     setEmailTemplateType("custom");
    //     if (emailTemplates?.length > 0) {
    //         setEmailTemplateId(emailTemplates[0].id);
    //     }
    // };

    const toggleCustomTemplateModal = () => {
        setIsPDFModalOpen(!isPDFModalOpen);
    };

    const handlePreviewFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setPreviewFile(file);
        } else if (file) {
            // Show error toast or alert for invalid file type
            alert("Please select a valid PDF file");
            event.target.value = ""; // Clear the input
        }
    };

    const handlePreviewTemplate = async () => {
        if (!previewFile) {
            alert("Please select a PDF file first");
            return;
        }

        setIsPreviewLoading(true);

        try {
            const formData = new FormData();
            formData.append("pdf_file", previewFile);
            formData.append("text_size", textSize);
            formData.append("text_color", textColor);
            formData.append("alignment", alignment);
            formData.append("font", font);
            formData.append("page_size", pageSize);
            formData.append("page_layout", pageLayout);
            formData.append("vertical_adjustment", verticalAdjustment);
            formData.append("pages_to_stamp", pagesToStamp);
            formData.append("stamp_text", stampText);
            formData.append("allow_printing", allowPrinting);
            formData.append("allow_copying", allowCopy);
            formData.append("password_protect", passwordProtect);

            const response = await fetch("/api/preview-pdf-template", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "preview.pdf";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const errorData = await response.json();
                alert(
                    "Error generating preview: " +
                        (errorData.message || "Unknown error")
                );
            }
        } catch (error) {
            console.error("Preview error:", error);
            alert("Error generating preview. Please try again.");
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const handleSaveTemplate = async () => {
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

        try {
            const response = await fetch("/api/save-pdf-template", {
                method: "POST",
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
                const data = await response.json();

                const pdfTemplateId = String(data.template.id);
                const newTemplateTitle = data.template.title;

                setPDFTemplateId(pdfTemplateId);
                setSelectedTemplate(pdfTemplateId);

                setPdfTemplates((prevTemplates) => [
                    ...prevTemplates,
                    { id: pdfTemplateId, title: newTemplateTitle },
                ]);

                console.log("PDF Template saved:", data);
                shopify.toast.show(
                    t("createdigitalproduct.pdf_template_saved_successfully")
                );
            } else {
                throw new Error("Failed to save PDF template");
            }
        } catch (error) {
            console.error("Error saving template:", error);
            shopify.toast.show(
                t(
                    "createdigitalproduct.failed_to_save_pdf_template_please_try_again"
                ),
                { isError: true, duration: 9999999 }
            );
        } finally {
            setIsPDFModalOpen(false);
        }
    };

    useEffect(() => {
        // Check new user status on initial load (needed for step 1)
        checkNewUsers();

        // Only fetch PDF templates after user moves past step 1
        if (currentStep <= 1) return;

        const fetchPdfTemplates = async () => {
            try {
                const response = await fetch("/api/get-pdf-template");
                const data = await response.json();

                if (data.success) {
                    setPdfTemplates(data.data);
                } else {
                    console.log(
                        "Failed to fetch templates, no success flag in response."
                    );
                }
            } catch (error) {
                console.error("Error fetching PDF templates:", error);
            } finally {
                setIsPdfTemplatesLoaded(true);
            }
        };

        fetchPdfTemplates();
    }, [currentStep]);

    const handleTemplateChange = (value) => {
        setSelectedTemplate(String(value));
        setPDFTemplateId(String(value));
    };

    const templateOptions = [
        { label: t("createdigitalproduct.select_custom_template"), value: "" },
        ...pdfTemplates.map((template) => ({
            label: template.title,
            value: String(template.id),
        })),
    ];

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
        setCodeLength(newValue);
    };

    const handleSuffixChange = (newValue) => {
        setSuffix(newValue);
    };

    const handleTotalCodesChange = (newValue) => {
        setTotalCodes(newValue);
    };

    const handlePasteKeysChange = (newValue) => {
        setPasteKeysValue(newValue);
    };

    const handleQRCode = (checked) => {
        setQrCodeEnabled(checked);
    };

    const handleGiftCardEnabled = (value) => setGiftCardEnabled(value);

    const handleQRCodePrintOnPDF = useCallback((newCheckedState) => {
        setQRCodePrintOnPDF(newCheckedState);
    }, []);

    const handleGiftCardPropertyNameChange = (value) =>
        setGiftCardPropertyName(value);

    const handleGiftDeliveryPropertyNameChange = (value) =>
        setGiftDeliveryPropertyName(value);

    const handleSendKeyToMultipleCustomers = (checked) => {
        setSendKeyToMultipleCustomers(checked);
    };

    const handleDeliverKeysInSequence = (checked) => {
        setDeliverKeysInSequence(checked);
    };

    const handlePerUnitNoDeliveryChange = (newValue) => {
        setPerUnitNoDelivery(newValue);
    };

    const handleRadioButtonChange = useCallback((newValue) => {
        setValue(newValue);
    }, []);

    const handleTabChange = useCallback((selectedMainTabIndex) => {
        setSelectedMainTab(selectedMainTabIndex);
    }, []);

    // const handleLicenseTabChange = useCallback((selectedLicenseTabIndex) => {
    //     setSelectedLicenseTab(selectedLicenseTabIndex);
    // }, []);

    const handleManualLicenseTabChange = useCallback(
        (selectedManualLicenseTabIndex) => {
            setSelectedManualLicenseTab(selectedManualLicenseTabIndex);
        },
        []
    );

    const generateLicensePreview = useCallback(() => {
        if (!prefix && !codeLength && !suffix) {
            return 'FWUE2TEX';
        }

        const prefixText = prefix || '';
        const suffixText = suffix || '';
        const length = parseInt(codeLength) || 6;

        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomCode = '';
        for (let i = 0; i < length; i++) {
            randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return `${prefixText}${randomCode}${suffixText}`;
    }, [prefix, codeLength, suffix]);

    useEffect(() => {
        if (value === "automated") {
            const preview = generateLicensePreview();
            setLicensePreview(preview);
        }
    }, [prefix, codeLength, suffix, value, generateLicensePreview]);

    // const handleCustomTabChange = useCallback((selectedCustomTabIndex) => {
    //     setSelectedCustomTab(selectedCustomTabIndex);
    // }, []);

    const mainTabs = [
        { id: "newFile", content: t("createdigitalproduct.add_new_file") },
        {
            id: "googleDrive",
            content: t("createdigitalproduct.google_drive_file"),
        },
    ];

    // const licenseTabs = [
    //     {
    //         id: "existingLicenses",
    //         content: t("createdigitalproduct.from_existing_licenses"),
    //     },
    //     {
    //         id: "newLicense",
    //         content: t("createdigitalproduct.add_new_license"),
    //     },
    // ];

    const manualLicenseTabs = [
        { id: "uploadCsv", content: t("createdigitalproduct.upload_csv") },
        {
            id: "pasteKeys",
            content: t("createdigitalproduct.paste_keys_codes"),
        },
    ];

    // const customTabs = [
    //     {
    //         id: "existingCustoms",
    //         content: t("createdigitalproduct.from_existing_customs"),
    //     },
    //     { id: "newCustom", content: t("createdigitalproduct.add_new_custom") },
    // ];

    const handleGoogleDriveLinkChange = (newValue) => {
        setGoogleDriveLink(newValue);
    };

    // const handleExpirationDaysChange = (value) => {
    //     const numericValue = parseInt(value, 10);

    //     if (numericValue < 1) {
    //         setExpirationDays(1);
    //     } else {
    //         setExpirationDays(numericValue);
    //     }
    // };

    // const handleProductMessagehange = (value) => {
    //     setProductMessage(value);
    // };

    // function handleInputValueChange() {
    //     console.log("handleInputValueChange");
    // }

    // function handleOnClose({ relatedTarget }) {
    //     setVisible(false);
    // }

    // function handleMonthChange(month, year) {
    //     setDate({ month, year });
    // }

    // function handleDateSelection({ end: newSelectedDate }) {
    //     setSelectedDate(newSelectedDate);
    //     setVisible(false);
    // }

    useEffect(() => {
        if (selectedDate) {
            setDate({
                month: selectedDate.getMonth(),
                year: selectedDate.getFullYear(),
            });
        }
    }, [selectedDate]);

    // const handleDownloadExpirationEnabledChange = (checked) => {
    //     setIsDownloadExpirationEnabled(checked);
    // };

    // const handleProductMessageEnabledChange = (checked) => {
    //     setIsProductMessageEnabled(checked);
    // };

    function formatDateForDB(date, isEndOfDay = false) {
        let hours = isEndOfDay
            ? "23"
            : date.getHours().toString().padStart(2, "0");
        let minutes = isEndOfDay
            ? "59"
            : date.getMinutes().toString().padStart(2, "0");
        let seconds = isEndOfDay
            ? "59"
            : date.getSeconds().toString().padStart(2, "0");

        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    // const handleSelectChange = (value) => {
    //     setSelected(value);
    // };

    // const handleEmailTemplateChange = (value) => {
    //     setEmailTemplateId(value);
    // };

    const handleAutoFulfillCheckbox = (checked) => {
        setAutoFulfill(checked);
    };

    // const handleDownloadLimitChange = (newValue) => {
    //     setDownloadLimit(newValue);
    // };

    // const handleDownloadLimitEnabledChange = (checked) => {
    //     setIsDownloadLimitEnabled(checked);
    // };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleLicenseModal = () => {
        setIsLicenseModalOpen(!isLicenseModalOpen);
    };

    const toggleCustomLinkModal = () => {
        setIsCustomLinkModalOpen(!isCustomLinkModalOpen);
    };

    const toggleFileUpload = () => {
        handleContentTypeChange("files");
        setIsModalOpen(!isModalOpen);
    };

    // const handleManualDeliveryEnabledChange = (checked) => {
    //     setIsManualDeliveryEnabled(checked);
    //     if (checked) {
    //         setContentType(["manual_delivery"]);
    //     } else {
    //         setContentType([]);
    //     }
    // };

    const toggleLicenseInput = () => {
        // In onboarding flow, we're always creating new licenses (no tabs)
        const newLicense = {
            title: licenseTitle,
            licenseType: value,
            prefix: prefix,
            codeLength: codeLength,
            suffix: suffix,
            totalCodes: totalCodes,
            licenseFiles:
                selectedManualLicenseTab === 0 ? licenseFiles : [],
            pasteKeysValue:
                selectedManualLicenseTab === 1 ? pasteKeysValue : "",
            qrCodeEnabled: qrCodeEnabled,
            qrCodePrintOnPDF: qrCodePrintOnPDF,
            giftCardEnabled: giftCardEnabled,
            giftCardPropertyName: giftCardPropertyName,
            giftDeliveryPropertyName: giftDeliveryPropertyName,
            sendKeyToMultipleCustomers: sendKeyToMultipleCustomers,
            deliverKeysInSequence: deliverKeysInSequence,
            manual_codes_type:
                selectedManualLicenseTab === 0 ? "csv" : "paste_text",
            perUnitNoDelivery: perUnitNoDelivery,
        };

        setNewLicenses((prevLicenses) => [...prevLicenses, newLicense]);

        setLicenseTitle("");
        setValue("");
        setPrefix("");
        setCodeLength("");
        setSuffix("");
        setTotalCodes("");
        setPasteKeysValue("");
        setLicenseFiles([]);
        setQrCodeEnabled(false);
        setQRCodePrintOnPDF(false);
        setGiftCardEnabled(false);
        setGiftCardPropertyName("");
        setGiftDeliveryPropertyName("");
        setSendKeyToMultipleCustomers(false);
        setDeliverKeysInSequence(false);
        setPerUnitNoDelivery(1);

        handleContentTypeChange("license");
        setIsLicenseModalOpen(!isLicenseModalOpen);
    };

    const toggleCustomLink = () => {
        const newCustom = {
            title: title,
            redirectURL: redirectURL,
            linkDetail: linkDetail,
        };

        setNewCustoms((prevCustoms) => [...prevCustoms, newCustom]);

        setTitle("");
        setRedirectURL("");
        setLinkDetail("");

        handleContentTypeChange("custom_link");
        setIsCustomLinkModalOpen(!isCustomLinkModalOpen);
    };

    const handleContentTypeChange = (type) => {
        setContentType((prev) => {
            // If the type is already in the array, do nothing
            if (prev.includes(type)) {
                return prev;
            }
            // Otherwise, add the type to the array
            return [...prev, type];
        });
    };

    useEffect(() => {
        // Only fetch files after user moves past step 1
        if (currentStep <= 1) return;

        const fetchCurrentFiles = async () => {
            try {
                const response = await fetch("/api/get-files");
                if (response.ok) {
                    const data = await response.json();
                    const totalByteSize = data.files.reduce(
                        (acc, file) => acc + file.byteSize,
                        0
                    );
                    setCurrentFileStorage(totalByteSize);
                } else {
                    console.error(
                        "Failed to fetch files:",
                        response.statusText
                    );
                }
            } catch (error) {
                console.error("Error fetching files:", error);
            } finally {
                setIsCurrentFilesLoaded(true);
            }
        };

        fetchCurrentFiles();
    }, [currentStep]);

    const handleDropZoneDrop = useCallback(
        (dropFiles) => {
            const newFiles = Array.from(dropFiles);
            const totalNewFilesSize = newFiles.reduce(
                (acc, file) => acc + file.size,
                0
            );

            if (
                fileStorageLimit !== Infinity &&
                currentFileStorage + totalNewFilesSize > fileStorageLimit
            ) {
                shopify.toast.show(
                    `File storage limit exceeded. Maximum allowed is ${prettyBytes(
                        fileStorageLimit
                    )}`,
                    { isError: true, duration: 9999999 }
                );
                return;
            }

            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setCurrentFileStorage((prev) => prev + totalNewFilesSize);
            handleContentTypeChange("files");
        },
        [fileStorageLimit, currentFileStorage]
    );

    // const handleSampleDropZoneDrop = useCallback(
    //     (_dropFiles, acceptedFiles, _rejectedFiles) => {
    //         const updatedFiles = [...sampleFiles, ...acceptedFiles];
    //         const validFiles = updatedFiles.filter(
    //             (file) => file.size <= MAX_SAMPLE_FILE_BYTE
    //         );
    //         const limitedFiles = validFiles.slice(0, MAX_SAMPLE_FILES);
    //         setSampleFiles(limitedFiles);

    //         if (validFiles.length > MAX_SAMPLE_FILES) {
    //             shopify.toast.show(
    //                 `${t(
    //                     "createdigitalproduct.you_can_only_upload_a_maximum_of"
    //                 )} ${MAX_SAMPLE_FILES} ${t("createdigitalproduct.files")}.`,
    //                 { isError: true, duration: 9999999 }
    //             );
    //         }
    //     },
    //     [sampleFiles]
    // );

    const handleLicenseDropZoneDrop = (files) => {
        const file = files[0];
        // setLicenseFiles(file);
        setAttachedLicenseFile((prev) => file);
        // setLicenseFiles(prevFiles => [...prevFiles, file]);
        setLicenseFiles((prevFiles) => [file]);
    };

    const toggleProductPicker = async () => {
        try {
            const selected = await shopify.resourcePicker({
                type: "product",
                action: "select",
                multiple: false,
                selectionIds: selectedProduct ? [selectedProduct.id] : [],
            });

            if (selected && selected.length > 0) {
                setSelectedProduct(selected[0]);
            }
        } catch (error) {
            console.error("Resource picker error:", error);
        }
    };
    const handleDeleteFileAtIndex = useCallback(
        (index, type) => {
            if (type === "files") {
                setFiles((files) => {
                    let newFiles = [...files];
                    newFiles.splice(index, 1);
                    return newFiles;
                });
            } else if (type === "orders") {
                setOrders((orders) => {
                    let newOrders = [...orders];
                    newOrders.splice(index, 1);
                    return newOrders;
                });
            } else if (type === "googleDrive") {
                setGoogleDriveLink(null);
            }
        },
        [setFiles, setOrders, setGoogleDriveLink]
    );

    // const handleDeleteSampleFileAtIndex = useCallback(
    //     (index) => {
    //         setSampleFiles((files) => {
    //             let newFiles = [...files];
    //             newFiles.splice(index, 1);
    //             return newFiles;
    //         });
    //     },
    //     [sampleFiles]
    // );

    const handleDeleteNewLinkAtIndex = (index) => {
        // Create a copy of the current state
        let updatedLinks = [...newCustoms];
        // Remove the element at the specified index
        updatedLinks.splice(index, 1);
        // Update the state with the new array
        setNewCustoms(updatedLinks);
    };

    const handleDeleteSelectedLinkAtIndex = (index) => {
        // Create a copy of the current state
        let updatedLinks = [...selectedCustomIds];
        // Remove the element at the specified index
        updatedLinks.splice(index, 1);
        // Update the state with the new array
        setSelectedCustomIds(updatedLinks);
    };

    const handleLicenseDeleteFile = () => {
        // setLicenseFiles({ name: '', size: 0 });
        setAttachedLicenseFile(null);
        setLicenseFiles([]);
    };

    const handleDeleteNewLicenseAtIndex = (index) => {
        // Create a copy of the current state
        let updatedLicenses = [...newLicenses];
        // Remove the element at the specified index
        updatedLicenses.splice(index, 1);
        // Update the state with the new array
        setNewLicenses(updatedLicenses);
    };

    const handleDeleteExistingLicenseAtIndex = (index) => {
        let deleteLicense = selectedLicenseIds[index];
        // Create a copy of the current state
        let updatedLicenses = [...selectedLicenseIds];
        // Remove the element at the specified index
        updatedLicenses.splice(index, 1);
        // Update the state with the new array
        setSelectedLicenseIds(updatedLicenses);
    };

    // const handleTagInputChange = useCallback((value) => {
    //     setTagInputValue(value);
    // }, []);

    // const handleTagInputSubmit = useCallback(() => {
    //     if (tagInputValue.trim() !== "") {
    //         setTags((prevTags) => [...prevTags, tagInputValue.trim()]);
    //         setTagInputValue("");
    //     }
    // }, [tagInputValue]);

    const removeTag = useCallback(
        (tag) => () => {
            setTags((prevTags) => prevTags.filter((t) => t !== tag));
        },
        []
    );

    // const tagMarkup = tags.map((tag) => (
    //     <div key={tag}>
    //         <Tag onRemove={removeTag(tag)}>{tag}</Tag>
    //     </div>
    // ));

    // const options = [
    //     { label: t("digtal_product_listing.draft"), value: "draft" },
    //     { label: t("digtal_product_listing.active"), value: "active" },
    // ];

    // const resourceName = {
    //     singular: "file",
    //     plural: "files",
    // };

    // Simple selection state management
    // const toggleFileSelection = (fileId) => {
    //     setSelectedFileIds((prev) => {
    //         const fileDetails = orders.find((order) => order.id === fileId);

    //         if (prev.includes(fileId)) {
    //             // Remove from selection
    //             setSelectedFileDetails((prevDetails) =>
    //                 prevDetails.filter((detail) => detail.id !== fileId)
    //             );
    //             return prev.filter((id) => id !== fileId);
    //         } else {
    //             // Add to selection
    //             if (fileDetails) {
    //                 setSelectedFileDetails((prevDetails) => [
    //                     ...prevDetails,
    //                     fileDetails,
    //                 ]);
    //             }
    //             return [...prev, fileId];
    //         }
    //     });
    // };

    // const toggleCurrentPageSelection = () => {
    //     const currentPageIds = orders.map((order) => order.id);
    //     const allCurrentPageSelected = currentPageIds.every((id) =>
    //         selectedFileIds.includes(id)
    //     );

    //     if (allCurrentPageSelected) {
    //         // Remove all current page items from selection
    //         setSelectedFileIds((prev) =>
    //             prev.filter((id) => !currentPageIds.includes(id))
    //         );
    //         setSelectedFileDetails((prev) =>
    //             prev.filter((detail) => !currentPageIds.includes(detail.id))
    //         );
    //     } else {
    //         // Add all current page items to selection
    //         const newIds = currentPageIds.filter(
    //             (id) => !selectedFileIds.includes(id)
    //         );
    //         const newDetails = orders.filter(
    //             (order) => !selectedFileIds.includes(order.id)
    //         );

    //         setSelectedFileIds((prev) => [...prev, ...newIds]);
    //         setSelectedFileDetails((prev) => [...prev, ...newDetails]);
    //     }
    // };

    // Calculate selection state for current page
    console.log("Current orders:", orders); // Debug log
    const currentPageSelectedIds = orders
        .map((order) => order.id)
        .filter((id) => selectedFileIds.includes(id));
    const allCurrentPageSelected =
        orders.length > 0 &&
        orders.every((order) => selectedFileIds.includes(order.id));

    // Clear selections when switching away from existing files tab
    useEffect(() => {
        if (selectedMainTab !== 0) {
            setSelectedFileIds([]);
            setSelectedFileDetails([]);
        }
        // Load files when switching to existing files tab (deferred until step 2)
        if (currentStep > 1 && selectedMainTab === 0 && orders.length === 0) {
            fetchFiles();
        }
    }, [selectedMainTab, currentStep]);

    const dismissToast = useCallback(() => {
        setToast((prevToast) => ({
            ...prevToast,
            showToast: false,
        }));
    }, []);

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

    // const updateSelection = useCallback(
    //     (selected) => {
    //         if (!selected || selected.length === 0) {
    //             return;
    //         }

    //         const selectedValue = selected[0];
    //         const matchedOption = searchOptions.find(
    //             (option) => option.label === selectedValue
    //         );

    //         if (matchedOption) {
    //             setSelectedOptions([selectedValue]);
    //             setInputValue(matchedOption.label);
    //             setSearchOptions([matchedOption]);
    //         }
    //     },
    //     [searchOptions]
    // );

    // const updateLicenseSelection = useCallback(
    //     (selected) => {
    //         if (!selected || selected.length === 0) {
    //             return;
    //         }

    //         const selectedValue = selected[0];
    //         const matchedOption = searchLicenseOptions.find(
    //             (option) => option.label === selectedValue
    //         );

    //         if (matchedOption) {
    //             setSelectedLicenseOptions([selectedValue]);
    //             setInputLicenseValue(matchedOption.label);
    //             setSearchLicenseOptions([matchedOption]);
    //         }
    //     },
    //     [searchLicenseOptions]
    // );

    // const updateCustomLinkSelection = useCallback(
    //     (selected) => {
    //         if (!selected || selected.length === 0) {
    //             return;
    //         }

    //         const selectedValue = selected[0];
    //         const matchedOption = searchCustomLinkOptions.find(
    //             (option) => option.label === selectedValue
    //         );

    //         if (matchedOption) {
    //             setSelectedCustomLinkOptions([selectedValue]);
    //             setInputCustomLinkValue(matchedOption.label);
    //             setSearchCustomLinkOptions([matchedOption]);
    //         }
    //     },
    //     [searchCustomLinkOptions]
    // );

    // const getFileName = (file) => {
    //     if (!file) return "";
    //     try {
    //         const fileInfo = JSON.parse(file);
    //         return fileInfo.name;
    //     } catch (error) {
    //         console.error("Error parsing file JSON:", error);
    //         return "";
    //     }
    // };

    // const handleToggleLicenseSelection = (licenseId) => {
    //     const newSelectedLicenseIds = [...selectedLicenseIds];
    //     if (newSelectedLicenseIds.includes(licenseId)) {
    //         const index = newSelectedLicenseIds.indexOf(licenseId);
    //         newSelectedLicenseIds.splice(index, 1);
    //     } else {
    //         newSelectedLicenseIds.push(licenseId);
    //     }
    //     setSelectedLicenseIds(newSelectedLicenseIds);
    //     setSelectAll(licenses.every(license => newSelectedLicenseIds.includes(license.id)));
    // };

    // const handleToggleLicenseSelection = (licenseId) => {
    //     setSelectedLicenseIds((prev) => {
    //         if (prev.includes(licenseId)) {
    //             return prev.filter((id) => id !== licenseId);
    //         } else {
    //             return [...prev, licenseId];
    //         }
    //     });
    // };

    // Check if all licenses on current page are selected
    useEffect(() => {
        const allCurrentPageSelected =
            licenses.length > 0 &&
            licenses.every((license) =>
                selectedLicenseIds.includes(license.id)
            );
        setSelectAll(allCurrentPageSelected);
    }, [licenses, selectedLicenseIds]);

    // const handleSelectAll = () => {
    //     const allLicenseIds = licenses.map(license => license.id);
    //     if (selectAll) {
    //         setSelectedLicenseIds([]);
    //     } else {
    //         setSelectedLicenseIds(allLicenseIds);
    //     }
    //     setSelectAll(!selectAll);
    // };

    // const handleSelectAll = () => {
    //     if (selectAll) {
    //         // Deselect all licenses on current page
    //         setSelectedLicenseIds((prev) =>
    //             prev.filter(
    //                 (id) => !licenses.some((license) => license.id === id)
    //             )
    //         );
    //     } else {
    //         // Select all licenses on current page
    //         const currentPageIds = licenses.map((license) => license.id);
    //         setSelectedLicenseIds((prev) => {
    //             const newSelection = [...prev];
    //             currentPageIds.forEach((id) => {
    //                 if (!newSelection.includes(id)) {
    //                     newSelection.push(id);
    //                 }
    //             });
    //             return newSelection;
    //         });
    //     }
    //     setSelectAll(!selectAll);
    // };

    // const handleToggleCustomSelection = (customId) => {
    //     const newSelectedCustomIds = [...selectedCustomIds];
    //     if (newSelectedCustomIds.includes(customId)) {
    //         const index = newSelectedCustomIds.indexOf(customId);
    //         newSelectedCustomIds.splice(index, 1);
    //     } else {
    //         newSelectedCustomIds.push(customId);
    //     }
    //     setSelectedCustomIds(newSelectedCustomIds);
    //     setSelectAllForCustom(
    //         customs.every((custom) => newSelectedCustomIds.includes(custom.id))
    //     );
    // };

    // const handleSelectAllForCustom = () => {
    //     const allCustomIds = customs.map((custom) => custom.id);
    //     if (selectAllForCustom) {
    //         setSelectedCustomIds([]);
    //     } else {
    //         setSelectedCustomIds(allCustomIds);
    //     }
    //     setSelectAllForCustom(!selectAllForCustom);
    // };

    const handlePricing = () => navigate("/pricing");

    useEffect(() => {
        // Only fetch user plan after user moves past step 1
        if (currentStep <= 1) return;

        const fetchUserPlan = async () => {
            try {
                const response = await fetch("/api/user-plan");
                const data = await response.json();
                setUserPlan(data.plan);
            } catch (error) {
                console.error("Failed to fetch user plan:", error);
            } finally {
                setIsUserPlanLoaded(true);
            }
        };

        fetchUserPlan();
    }, [currentStep]);

    useEffect(() => {
        // Only fetch email templates after user moves past step 1
        if (currentStep <= 1) return;

        const getEmailTemplates = async () => {
            try {
                const response = await fetch("/api/get-custom-templates");
                const data = await response.json();
                // setUserPlan(data.plan);
                setEmailTemplates(data.templates);
                if (data.templates.length === 1) {
                    setEmailTemplateId(data.templates[0].id);
                }
                setDefaultTemplateId(data.defaultTemplateId);
            } catch (error) {
                console.error("Failed to fetch user plan:", error);
            } finally {
                setIsEmailTemplatesLoaded(true);
            }
        };

        getEmailTemplates();
    }, [currentStep]);

    const isLicenseActionDisabled = () => {
        // In onboarding flow, we're always creating new licenses
        const isTitleEmpty = !licenseTitle?.trim();
        if (value === "automated") {
            return (
                isTitleEmpty ||
                !prefix?.trim() ||
                !codeLength?.trim() ||
                !suffix?.trim() ||
                !totalCodes?.trim()
            );
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

    const isCustomLinksActionDisabled = () => {
        // Check if there's at least one custom link with all required fields
        // First check the input fields (for links being filled but not yet added)
        const inputFieldsFilled =
            title?.trim() && redirectURL?.trim();

        // Check if any link in the array has all required fields
        const hasValidLinkInArray = newCustoms.some(
            (link) =>
                link.title?.trim() &&
                link.redirectURL?.trim()
        );

        // Button is disabled if neither input fields are filled nor there's a valid link in array
        return !inputFieldsFilled && !hasValidLinkInArray;
    };

    const isMixedContentActionDisabled = () => {
        // For mixed content, user needs to provide at least ONE of:
        // 1. Files (uploaded or Google Drive link)
        // 2. Licenses (with proper validation using isLicenseActionDisabled)
        // 3. Custom links (with proper validation using isCustomLinksActionDisabled)

        const hasFiles = files.length > 0 || googleDriveLink;
        const hasLicenses = !isLicenseActionDisabled();
        const hasCustomLinks = !isCustomLinksActionDisabled();

        // Mixed content requires at least one of the three options
        return !hasFiles && !hasLicenses && !hasCustomLinks;
    };

    useEffect(() => {
        if (store) {
            const storageLimit =
                store.file_storage === "unlimited"
                    ? Infinity
                    : Number(store.file_storage);
            setFileStorageLimit(storageLimit);
            setFileSizeLimit(store.per_file_limit);
            setIsStoreLoaded(true);
        }
    }, [store]);

    // Initial load of files when store is available and tab is 0 (deferred until step 2)
    useEffect(() => {
        if (currentStep <= 1) return;
        if (store && selectedMainTab === 0 && orders.length === 0) {
            fetchFiles();
        }
    }, [store, selectedMainTab, currentStep]);

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/get-files?page=${currentPageFiles}&limit=${itemsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                console.log("Files loaded:", data.files); // Debug log
                setOrders(data.files);
                setTotalFiles(data.total);

                // Update selected file details with current page data
                setSelectedFileDetails((prevDetails) => {
                    // Remove any details that are from the current page to avoid duplicates
                    const currentPageIds = data.files.map((f) => f.id);
                    const otherPageDetails = prevDetails.filter(
                        (detail) => !currentPageIds.includes(detail.id)
                    );

                    // Add current page details for selected files
                    const currentPageSelectedDetails = data.files.filter(
                        (file) => selectedFileIds.includes(file.id)
                    );

                    return [...otherPageDetails, ...currentPageSelectedDetails];
                });
            } else {
                shopify.toast.show(
                    t("createdigitalproduct.failed_to_fetch_files"),
                    { isError: true, duration: 9999999 }
                );
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            shopify.toast.show(
                t("createdigitalproduct.failed_to_fetch_files"),
                { isError: true, duration: 9999999 }
            );
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchFiles();
    // }, [currentPageFiles]);

    // const handleFilePageChange = async (newPage) => {
    //     setIsPageLoading(true);
    //     const response = await fetch(
    //         `/api/search-file?search=${inputValue}&page=${newPage}&limit=${itemsPerPage}`,
    //         {
    //             method: "GET",
    //         }
    //     );

    //     const data = await response.json();
    //     if (response.ok) {
    //         setOrders(data.files);
    //         setTotalFiles(data.total);
    //         setCurrentPageFiles(newPage);
    //         setIsPageLoading(false);
    //     } else {
    //         console.error("Error fetching paginated results");
    //         setIsPageLoading(false);
    //     }
    // };

    const handleClearSearch = () => {
        setInputValue("");
        setSelectedOptions([]);
        setSelectedFileIds([]); // Clear selections when clearing search
        setSelectedFileDetails([]); // Clear file details
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

    // const handleSearch = async () => {
    //     setSelectedFileIds([]); // Clear selections when performing new search
    //     setSelectedFileDetails([]); // Clear file details
    //     setIsLoading(true);
    //     setCurrentPageFiles(1);
    //     const response = await fetch(
    //         `/api/search-file?search=${inputValue}&page=1&limit=${itemsPerPage}`,
    //         {
    //             method: "GET",
    //         }
    //     );

    //     const data = await response.json();
    //     if (response.ok) {
    //         setOrders(data.files);
    //         setTotalFiles(data.total);
    //         setCurrentPageFiles(1);
    //         setIsLoading(false);
    //     } else {
    //         console.error("Error fetching search results");
    //         setIsLoading(false);
    //     }
    // };

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

    // const handleLicenseSearch = async () => {
    //     setIsLoading(true);
    //     setCurrentPageLicenses(1);
    //     const response = await fetch(
    //         `/api/search-license?search=${inputLicenseValue}&page=1&limit=${itemsPerPage}`,
    //         {
    //             method: "GET",
    //         }
    //     );

    //     const data = await response.json();
    //     if (response.ok) {
    //         setLicenses(data.licenses);
    //         setTotalLicenses(data.total);
    //         setCurrentPageLicenses(1);
    //         setIsLoading(false);
    //     } else {
    //         console.error("Error fetching search results");
    //         setIsLoading(false);
    //     }
    // };

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

    // const handleCustomLinkSearch = async () => {
    //     setIsLoading(true);
    //     setCurrentPageCustoms(1);

    //     const response = await fetch(
    //         `/api/search-custom-link?search=${encodeURIComponent(
    //             inputCustomLinkValue
    //         )}&page=1&limit=${itemsPerPage}`,
    //         {
    //             method: "GET",
    //         }
    //     );

    //     const data = await response.json();
    //     if (response.ok) {
    //         setCustoms(data.customLinks);
    //         setTotalCustoms(data.total);
    //         setCurrentPageCustoms(1);
    //         setIsLoading(false);
    //     } else {
    //         console.error("Error fetching custom link search results");
    //         setIsLoading(false);
    //     }
    // };

    const fetchLicenses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/get-licenses-with-products?page=${currentPageLicenses}&limit=${itemsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                setLicenses(data.licenses);
                setTotalLicenses(data.total);

                // Add this effect to update the select all state when the page changes
                // This will check if all items on the new page are selected
                const allCurrentPageSelected =
                    data.licenses.length > 0 &&
                    data.licenses.every((license) =>
                        selectedLicenseIds.includes(license.id)
                    );
                setSelectAll(allCurrentPageSelected);

                // Update all licenses if this is new data (your existing code)
                setAllLicenses((prev) => {
                    const existingIds = new Set(prev.map((l) => l.id));
                    const newLicenses = data.licenses.filter(
                        (l) => !existingIds.has(l.id)
                    );
                    return [...prev, ...newLicenses];
                });
            } else {
                shopify.toast.show(
                    t("createdigitalproduct.failed_to_fetch_licenses"),
                    { isError: true, duration: 9999999 }
                );
            }
        } catch (error) {
            console.error("Error fetching licenses:", error);
            shopify.toast.show(
                t("createdigitalproduct.failed_to_fetch_licenses"),
                { isError: true, duration: 9999999 }
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch licenses after user moves past step 1
        if (currentStep <= 1) return;
        fetchLicenses();
    }, [currentPageLicenses, currentStep]);

    // const handleLicensePageChange = async (newPage) => {
    //     setIsPageLoading(true);
    //     const response = await fetch(
    //         `/api/search-license?search=${inputLicenseValue}&page=${newPage}&limit=${itemsPerPage}`,
    //         {
    //             method: "GET",
    //         }
    //     );

    //     const data = await response.json();
    //     if (response.ok) {
    //         setLicenses(data.licenses);
    //         setTotalLicenses(data.total);
    //         setCurrentPageLicenses(newPage);
    //         setIsPageLoading(false);
    //     } else {
    //         console.error("Error fetching paginated results");
    //         setIsPageLoading(false);
    //     }
    // };

    const fetchCustomLinks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/get-customs-with-products?page=${currentPageCustoms}&limit=${itemsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                setCustoms(data.custom_links);
                setTotalCustoms(data.total);
            } else {
                shopify.toast.show(
                    t("createdigitalproduct.failed_to_fetch_custom_links"),
                    { isError: true, duration: 9999999 }
                );
            }
        } catch (error) {
            console.error("Error fetching custom links:", error);
            shopify.toast.show(
                t("createdigitalproduct.failed_to_fetch_custom_links"),
                { isError: true, duration: 9999999 }
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch custom links after user moves past step 1
        if (currentStep <= 1) return;
        fetchCustomLinks();
    }, [currentPageCustoms, currentStep]);

    // const handleCustomPageChange = async (newPage) => {
    //     setIsPageLoading(true);

    //     const response = await fetch(
    //         `/api/search-custom-link?search=${encodeURIComponent(
    //             inputCustomLinkValue
    //         )}&page=${newPage}&limit=${itemsPerPage}`,
    //         {
    //             method: "GET",
    //         }
    //     );

    //     const data = await response.json();
    //     if (response.ok) {
    //         setCustoms(data.customLinks);
    //         setTotalCustoms(data.total);
    //         setCurrentPageCustoms(newPage);
    //         setIsPageLoading(false);
    //     } else {
    //         console.error("Error fetching paginated custom links");
    //         setIsPageLoading(false);
    //     }
    // };

    useEffect(() => {
        // Only fetch digital products after user moves past step 1
        if (currentStep <= 1) return;

        const fetchData = async () => {
            try {
                const productsResponse = await fetch("/api/get-digital-data");

                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    setDigitalProducts(productsData.digitalProducts);
                    setDigitalProductsLimit(store.digital_products_limit);
                    setIsLoading(false);

                    // if (productsData.digitalProducts.length >= store.digital_products_limit) {
                    //     setIsLimitExceededModalActive(true);
                    //     return;
                    // }
                } else {
                    console.error("Failed to fetch digital data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [store, currentStep]);

    // const closeLimitExceededModal = () => {
    //     setIsLimitExceededModalActive(false);
    //     navigate("/digitalProducts");
    // };

    // Function to capture current data state - simplified to avoid circular dependencies
    const captureCurrentData = useCallback(() => {
        return {
            title: title || "",
            selectedProduct: selectedProduct || null,
            selected: selected || "active",
            contentType: contentType || [],
            isManualDeliveryEnabled: isManualDeliveryEnabled || false,
            emailTemplateType: emailTemplateType || "default",
            emailTemplateId: emailTemplateId || null,
            isDownloadExpirationEnabled: isDownloadExpirationEnabled || false,
            expirationType: expirationType || "days",
            expirationDays: expirationDays || "",
            selectedDate: selectedDate || new Date(),
            // PDF stamping settings
            isPdfStampingEnabled: isPdfStampingEnabled || false,
            templateChoice: templateChoice || "none",
            PDFTemplateId: PDFTemplateId || null,
            // Product message settings
            isProductMessageEnabled: isProductMessageEnabled || false,
            productMessage: productMessage || "",
            autoFulfill: autoFulfill || false,
            downloadLimit: downloadLimit || "",
            isDownloadLimitEnabled: isDownloadLimitEnabled || false,
            // Exclude API-populated data from change detection to prevent SaveBar showing on load
            // files: files || [],        // API-populated - exclude from change detection
            // sampleFiles: sampleFiles || [], // API-populated - exclude from change detection
            // licenses: licenses || [],      // API-populated - exclude from change detection
            newLicenses: newLicenses || [], // User-added - keep this
            customs: customs || [], // API-populated - exclude from change detection
            newCustoms: newCustoms || [], // User-added - keep this
            tags: tags || [],
            qrCodeEnabled: qrCodeEnabled || false,
            qrCodePrintOnPDF: qrCodePrintOnPDF || false,
            giftCardEnabled: giftCardEnabled || false,
            giftCardPropertyName: giftCardPropertyName || "",
            sendKeyToMultipleCustomers: sendKeyToMultipleCustomers || false,
            deliverKeysInSequence: deliverKeysInSequence || false,
            perUnitNoDelivery: perUnitNoDelivery || 1,
            redirectURL: redirectURL || "",
            linkDetail: linkDetail || "",
            licenseTitle: licenseTitle || "",
            value: value || "automated",
            prefix: prefix || "",
            codeLength: codeLength || "",
            suffix: suffix || "",
            totalCodes: totalCodes || "",
            // Excluding complex objects that might cause initialization issues
        };
    }, [
        title,
        selectedProduct,
        selected,
        contentType,
        isManualDeliveryEnabled,
        emailTemplateType,
        emailTemplateId,
        isDownloadExpirationEnabled,
        expirationType,
        expirationDays,
        selectedDate,
        isPdfStampingEnabled,
        templateChoice,
        PDFTemplateId,
        isProductMessageEnabled,
        productMessage,
        autoFulfill,
        downloadLimit,
        isDownloadLimitEnabled,
        // Removed API-populated variables from dependencies to prevent false changes
        // files,        // API-populated - exclude from change detection
        // sampleFiles, // API-populated - exclude from change detection
        // licenses,    // API-populated - exclude from change detection
        newLicenses,
        // customs,     // API-populated - exclude from change detection
        newCustoms,
        tags,
        qrCodeEnabled,
        qrCodePrintOnPDF,
        giftCardEnabled,
        giftCardPropertyName,
        sendKeyToMultipleCustomers,
        deliverKeysInSequence,
        perUnitNoDelivery,
        redirectURL,
        linkDetail,
        licenseTitle,
        value,
        prefix,
        codeLength,
        suffix,
        totalCodes,
    ]);

    // Function to handle discard changes
    const handleDiscardChanges = useCallback(() => {
        // Reset only tracked fields to initial data
        setSelectedProduct(initialData.selectedProduct || null);
        setSelected(initialData.selected || "active");
        setEmailTemplateType(initialData.emailTemplateType || "default");
        setEmailTemplateId(initialData.emailTemplateId || null);
        setIsDownloadExpirationEnabled(
            initialData.isDownloadExpirationEnabled || false
        );
        setExpirationType(initialData.expirationType || "days");
        setExpirationDays(initialData.expirationDays || "");
        setSelectedDate(initialData.selectedDate || new Date());
        // PDF stamping settings
        setIsPdfStampingEnabled(initialData.isPdfStampingEnabled || false);
        setTemplateChoice(initialData.templateChoice || "none");
        setPDFTemplateId(initialData.PDFTemplateId || null);
        setIsProductMessageEnabled(
            initialData.isProductMessageEnabled || false
        );
        setProductMessage(initialData.productMessage || "");
        setTitle(initialData.title || "");
        setContentType(initialData.contentType || []);
        setAutoFulfill(initialData.autoFulfill || false);
        setDownloadLimit(initialData.downloadLimit || "");
        setIsDownloadLimitEnabled(initialData.isDownloadLimitEnabled || false);
        setFiles(initialData.files || []);
        setSampleFiles(initialData.sampleFiles || []);
        setLicenses(initialData.licenses || []);
        setNewLicenses(initialData.newLicenses || []);
        setCustoms(initialData.customs || []);
        setNewCustoms(initialData.newCustoms || []);
        setTags(initialData.tags || []);
        setQrCodeEnabled(initialData.qrCodeEnabled || false);
        setQRCodePrintOnPDF(initialData.qrCodePrintOnPDF || false);
        setGiftCardEnabled(initialData.giftCardEnabled || false);
        setGiftCardPropertyName(initialData.giftCardPropertyName || "");
        setSendKeyToMultipleCustomers(
            initialData.sendKeyToMultipleCustomers || false
        );
        setDeliverKeysInSequence(initialData.deliverKeysInSequence || false);
        setIsManualDeliveryEnabled(
            initialData.isManualDeliveryEnabled || false
        );
        setPerUnitNoDelivery(initialData.perUnitNoDelivery || 1);
        setRedirectURL(initialData.redirectURL || "");
        setLinkDetail(initialData.linkDetail || "");
        setLicenseTitle(initialData.licenseTitle || "");
        setValue(initialData.value || "automated");
        setPrefix(initialData.prefix || "");
        setCodeLength(initialData.codeLength || "");
        setSuffix(initialData.suffix || "");
        setTotalCodes(initialData.totalCodes || "");

        setHasUnsavedChanges(false);
        try {
            //shopify.saveBar.hide("create-digital-product-savebar");
        } catch (error) {
            // SaveBar not set up in onboarding flow - ignore error
        }
    }, [initialData, shopify]);

    // Function to check if data has changed
    const hasDataChanged = useCallback(() => {
        const currentData = captureCurrentData();
        return JSON.stringify(currentData) !== JSON.stringify(initialData);
    }, [captureCurrentData, initialData]);

    // Effect to monitor changes and update SaveBar
    useEffect(() => {
        console.log("Insitan Data Capture: ", isInitialDataCaptured);
        if (isInitialDataCaptured) {
            const changed = hasDataChanged();
            setHasUnsavedChanges(changed);
            console.log("Changed: " + changed);

            if (changed) {
                try {
                    //shopify.saveBar.show("create-digital-product-savebar");
                } catch (error) {
                    // SaveBar not set up in onboarding flow - ignore error
                }
            } else {
                try {
                    //shopify.saveBar.hide("create-digital-product-savebar");
                } catch (error) {
                    // SaveBar not set up in onboarding flow - ignore error
                }
            }
        }
    }, [hasDataChanged, isInitialDataCaptured, shopify]);

    // Capture initial data immediately on mount (before any API data is loaded)
    useEffect(() => {
        // Capture initial state when component first mounts
        if (!isInitialDataCaptured) {
            const initial = captureCurrentData();
            console.log("Capturing initial data on mount:", initial);
            setInitialData(initial);
            setIsInitialDataCaptured(true);
        }
    }, [isInitialDataCaptured]);

    const handleSave = useCallback(async () => {
        setSaving(true);
        // setProgress(0); // Reset progress

        if (
            isPdfStampingEnabled &&
            templateChoice === "custom" &&
            !PDFTemplateId
        ) {
            shopify.toast.show(
                t("createdigitalproduct.please_save_the_pdf_template_first"),
                { isError: true, duration: 9999999 }
            );
            setSaving(false);
            return;
        }

        let validFiles = [];
        let selectedValidFiles = [];
        //if (selectedMainTab === 0) {
        // Use our selection state which contains all selected files from all pages
        selectedValidFiles = selectedFileIds;
        //} else {
        validFiles = files.filter((file) => file.size <= fileSizeLimit);
        //}

        // For onboarding flow: prepare license data directly without relying on state
        let onboardingLicenseData = null;
        if (selectedProductType === "license" && selectedProduct && licenseTitle?.trim()) {
            // Validate required fields based on license type
            const isValidAutomated = value === "automated" && prefix?.trim() && codeLength?.trim() && suffix?.trim() && totalCodes?.trim();
            const isValidManual = value === "manual" && (
                (selectedManualLicenseTab === 0 && licenseFiles.length > 0) ||
                (selectedManualLicenseTab === 1 && pasteKeysValue?.trim())
            );

            if ((value === "automated" && isValidAutomated) || (value === "manual" && isValidManual)) {
                onboardingLicenseData = {
                    title: licenseTitle,
                    licenseType: value,
                    prefix: prefix || "",
                    codeLength: codeLength || "",
                    suffix: suffix || "",
                    totalCodes: totalCodes || "",
                    licenseFiles: licenseFiles,
                    pasteKeysValue: pasteKeysValue || "",
                    qrCodeEnabled: qrCodeEnabled,
                    qrCodePrintOnPDF: qrCodePrintOnPDF,
                    giftCardEnabled: giftCardEnabled,
                    giftCardPropertyName: giftCardPropertyName || "",
                    giftDeliveryPropertyName: giftDeliveryPropertyName || "",
                    sendKeyToMultipleCustomers: sendKeyToMultipleCustomers,
                    deliverKeysInSequence: deliverKeysInSequence,
                    manual_codes_type: selectedManualLicenseTab === 0 ? "csv" : "paste_text",
                    perUnitNoDelivery: perUnitNoDelivery || 1,
                };
                // Update state for display purposes
                setNewLicenses([onboardingLicenseData]);
                handleContentTypeChange("license");
                console.log("Onboarding license data created:", onboardingLicenseData);
            } else {
                console.log("License validation failed - incomplete form data");
                console.log("License type:", value, "Automated valid:", isValidAutomated, "Manual valid:", isValidManual);
            }
        } else {
            console.log("License not created - selectedProductType:", selectedProductType, "hasTitle:", !!licenseTitle?.trim(), "hasProduct:", !!selectedProduct);
        }

        // For onboarding flow: prepare custom link data directly without relying on state
        let onboardingCustomLinkData = null;
        if (selectedProductType === "links" && selectedProduct && title?.trim() && redirectURL?.trim()) {
            onboardingCustomLinkData = {
                title: title,
                redirectURL: redirectURL,
                linkDetail: linkDetail || "",
            };
            // Update state for display purposes
            setNewCustoms([onboardingCustomLinkData]);
            handleContentTypeChange("custom_link");
            console.log("Onboarding custom link data created:", onboardingCustomLinkData);
        } else {
            console.log("Custom link not created - selectedProductType:", selectedProductType, "hasTitle:", !!title?.trim(), "hasRedirectURL:", !!redirectURL?.trim(), "hasProduct:", !!selectedProduct);
        }

        if (
            contentType.includes("files") &&
            !validFiles.length &&
            !selectedValidFiles.length &&
            !googleDriveLink
        ) {
            shopify.toast.show(
                t("createdigitalproduct.please_select_valid_files"),
                { isError: true, duration: 9999999 }
            );
            setSaving(false);
            return;
        }

        if (
            validFiles.length + selectedValidFiles.length > 50 &&
            contentType.includes("files")
        ) {
            shopify.toast.show(
                t("createdigitalproduct.you_can_select_a_maximum_of_50_files"),
                { isError: true, duration: 9999999 }
            );
            setSaving(false);
            return;
        }

        try {
            var formData = new FormData();

            if (contentType.includes("files")) {
                validFiles.forEach((fileId) => {
                    formData.append("files[]", fileId);
                });

                //if (selectedMainTab === 0) {
                selectedValidFiles.forEach((fileId) => {
                    formData.append("selectedFiles[]", fileId);
                });
                //}

                if (googleDriveLink) {
                    const isFolder = googleDriveLink.includes("/folders/");
                    if (isFolder) {
                        formData.append("google_drive_url", googleDriveLink);
                    } else {
                        formData.append("google_drive_url", googleDriveLink);
                    }
                }
            }

            if (contentType.includes("license") || onboardingLicenseData) {
                console.log("Processing licenses - contentType:", contentType, "hasOnboardingData:", !!onboardingLicenseData);

                let selectedLicenses = [];
                selectedLicenses = allLicenses
                    .filter((license) =>
                        selectedLicenseIds.includes(license.id)
                    )
                    .map((license) => license.id);

                selectedLicenses.forEach((licenseId) => {
                    formData.append("selectedLicenses[]", licenseId);
                    formData.append(`licenseKeysPerUnit[${licenseId}]`, licenseKeysPerUnit[licenseId] || 1);
                });

                // Combine existing newLicenses with onboarding license data
                const allLicensesToProcess = [...newLicenses];
                if (onboardingLicenseData) {
                    allLicensesToProcess.push(onboardingLicenseData);
                }

                console.log("Total licenses to process:", allLicensesToProcess.length);

                allLicensesToProcess.forEach((license, index) => {
                    formData.append(`licenses[${index}][title]`, license.title);
                    formData.append(
                        `licenses[${index}][licenseType]`,
                        license.licenseType
                    );
                    formData.append(
                        `licenses[${index}][prefix]`,
                        license.prefix
                    );
                    formData.append(
                        `licenses[${index}][codeLength]`,
                        license.codeLength
                    );
                    formData.append(
                        `licenses[${index}][suffix]`,
                        license.suffix
                    );
                    formData.append(
                        `licenses[${index}][totalCodes]`,
                        license.totalCodes
                    );
                    formData.append(
                        `licenses[${index}][qrCodeEnabled]`,
                        license.qrCodeEnabled ? "1" : "0"
                    );
                    formData.append(
                        `licenses[${index}][qrCodePrintOnPDF]`,
                        license.qrCodePrintOnPDF ? "1" : "0"
                    );
                    formData.append(
                        `licenses[${index}][giftCardEnabled]`,
                        license.giftCardEnabled ? "1" : "0"
                    );
                    formData.append(
                        `licenses[${index}][giftCardPropertyName]`,
                        license.giftCardPropertyName
                    );
                    formData.append(
                        `licenses[${index}][giftDeliveryPropertyName]`,
                        license.giftDeliveryPropertyName
                    );
                    formData.append(
                        `licenses[${index}][manual_codes_type]`,
                        license.manual_codes_type
                    );
                    formData.append(
                        `licenses[${index}][perUnitNoDelivery]`,
                        license.perUnitNoDelivery
                    );

                    if (license.manual_codes_type === "paste_text") {
                        formData.append(
                            `licenses[${index}][pasteKeysValue]`,
                            license.pasteKeysValue
                        );
                    }

                    if (license.manual_codes_type === "csv") {
                        license.licenseFiles.forEach((file, fileIndex) => {
                            formData.append(
                                `licenses[${index}][licenseFiles][${fileIndex}]`,
                                file
                            );
                        });
                        formData.append(
                            `licenses[${index}][deliverKeysInSequence]`,
                            license.deliverKeysInSequence ? "1" : "0"
                        );
                    }
                    formData.append(
                        `licenses[${index}][sendKeyToMultipleCustomers]`,
                        license.sendKeyToMultipleCustomers ? "1" : "0"
                    );
                });
            }

            // Send custom links if there are any newly created or selected ones
            if (newCustoms.length > 0 || selectedCustomIds.length > 0 || onboardingCustomLinkData) {
                let selectedCustomLinks = [];
                selectedCustomLinks = customs
                    .filter((link) => selectedCustomIds.includes(link.id))
                    .map((link) => link.id);

                selectedCustomLinks.forEach((linkId) => {
                    formData.append("selectedCustomLinks[]", linkId);
                });

                // Combine existing newCustoms with onboarding custom link data
                const allCustomLinksToProcess = [...newCustoms];
                if (onboardingCustomLinkData) {
                    allCustomLinksToProcess.push(onboardingCustomLinkData);
                }

                allCustomLinksToProcess.forEach((link, index) => {
                    formData.append(`customLinks[${index}][title]`, link.title);
                    formData.append(
                        `customLinks[${index}][redirectURL]`,
                        link.redirectURL
                    );
                    formData.append(
                        `customLinks[${index}][linkDetail]`,
                        link.linkDetail
                    );
                });
            }

            if (sampleFiles.length) {
                sampleFiles.forEach((file) => {
                    if (file instanceof File) {
                        formData.append("sampleFiles[]", file);
                    }
                });
            }

            formData.append(
                "is_manual_delivery_enabled",
                isManualDeliveryEnabled ? "1" : "0"
            );

            formData.append(
                "is_download_limit_enabled",
                isDownloadLimitEnabled ? "1" : "0"
            );
            if (isDownloadLimitEnabled) {
                formData.append("download_limit", downloadLimit);
            }

            formData.append(
                "is_product_message_enabled",
                isProductMessageEnabled ? "1" : "0"
            );
            if (isProductMessageEnabled) {
                formData.append("product_message", productMessage);
            }

            formData.append("product", JSON.stringify(selectedProduct));
            formData.append("auto_fulfill", autoFulfill ? "1" : "0");
            formData.append(
                "download_expiration",
                isDownloadExpirationEnabled ? "1" : "0"
            );
            formData.append("expiration_type", expirationType);
            if (expirationType === "days") {
                formData.append("expiration_value", expirationDays);
            } else if (expirationType === "specific-date") {
                const formattedDate = formatDateForDB(selectedDate);
                formData.append("expiration_value", formattedDate);
            }

            formData.append(
                "enable_pdf_stamping",
                isPdfStampingEnabled ? "1" : "0"
            );
            formData.append("templateChoice", templateChoice);
            if (isPdfStampingEnabled) {
                if (templateChoice === "default") {
                    formData.append("default_pdf_template", "1");
                } else if (templateChoice === "custom") {
                    formData.append("default_pdf_template", "0");
                    formData.append("pdf_template_id", PDFTemplateId);
                }
            }

            const statusValue = selected === "draft" ? 0 : 1;
            formData.append("status", statusValue);

            // Build content_type array, adding license or custom_link if we have onboarding data
            let finalContentType = [...contentType];
            if (onboardingLicenseData && !finalContentType.includes("license")) {
                finalContentType.push("license");
            }
            if (onboardingCustomLinkData && !finalContentType.includes("custom_link")) {
                finalContentType.push("custom_link");
            }
            formData.append("content_type", finalContentType.join(", "));

            formData.append("shop", store.shopify_domain);

            formData.append("email_template_type", emailTemplateType);
            let templateId = "";
            //if(isNewUser) {
            templateId =
                emailTemplateType === "custom"
                    ? emailTemplateId
                    : defaultTemplateId;
            //}

            // if(emailTemplateType === 'custom') {
            //     formData.append('email_template_id', emailTemplateId)
            // }
            formData.append("email_template_id", templateId);

            const xhr = new XMLHttpRequest();

            // Track progress
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentCompleted = Math.round(
                        (event.loaded * 100) / event.total
                    );
                    setProgress(percentCompleted);
                }
            };

            // Set up the request
            xhr.open("POST", "/api/save-digital-product", true);

            // Handle the response
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    console.log("Backend Response:", response);
                    if (response.error) {
                        setSaving(false);
                        setProgress(0);
                        if (response.type === "exists") {
                            shopify.toast.show(
                                t(
                                    "editdigitalproduct.digital_product_already_exists_for_selected_shopify_product"
                                ),
                                { isError: true, duration: 9999999 }
                            );
                        } else {
                            shopify.toast.show(
                                t(
                                    "editdigitalproduct.error_saving_digital_product"
                                ),
                                { isError: true, duration: 9999999 }
                            );
                        }
                    } else {
                        shopify.toast.show(
                            t(
                                "createdigitalproduct.digital_product_saved_successfully"
                            )
                        );
                        // Update initial data and hide SaveBar
                        const updatedData = captureCurrentData();
                        setInitialData(updatedData);
                        setHasUnsavedChanges(false);
                        try {
                            //shopify.saveBar.hide("create-digital-product-savebar");
                        } catch (error) {
                            // SaveBar not set up in onboarding flow - ignore error
                        }
                        // Redirect or further actions after success
                        // setTimeout(() => {
                        //     navigate("/digitalProducts");
                        // }, 1000);
                    }
                } else {
                    shopify.toast.show(
                        t(
                            "createdigitalproduct.failed_to_save_digital_product_please_try_again_later"
                        ),
                        { isError: true, duration: 9999999 }
                    );
                }
                setSaving(false);
                setProgress(0); // Reset progress after completion
            };

            console.log(templateChoice);

            // Handle errors
            xhr.onerror = () => {
                shopify.toast.show(
                    t(
                        "createdigitalproduct.an_unexpected_error_occurred_please_try_again_later"
                    ),
                    { isError: true, duration: 9999999 }
                );
                setSaving(false);
                setProgress(0);
            };

            // Send the request
            xhr.send(formData);

            /* const response = await fetch('/api/save-digital-product', {
                 method: 'POST',
                 body: formData
             });

             if (response.ok) {
                 const data = await response.json();
                 if (data.error) {
                     setSaving(false);
                     if (data.type === 'exists') {
                         shopify.toast.show("Digital product already exists for selected Shopify product.", { isError: true, duration: 9999999 });
                     } else {
                         shopify.toast.show("Error saving digital product.", { isError: true, duration: 9999999 });
                     }
                 } else {
                     shopify.toast.show("Digital product saved successfully.");
                     setTimeout(() => {
                         navigate("/");
                     }, 1000);
                 }
             } else {
                 shopify.toast.show("Failed to save digital product. Please try again later.", { isError: true, duration: 9999999 });
                 setSaving(false);
             } */
        } catch (error) {
            console.error("Error saving digital product:", error);
            shopify.toast.show(
                t(
                    "createdigitalproduct.an_unexpected_error_occurred_please_try_again_later"
                ),
                { isError: true, duration: 9999999 }
            );
            setSaving(false);
            setProgress(0);
        }
    }, [
        autoFulfill,
        contentType,
        files,
        licenseTitle,
        orders,
        selectedProduct,
        prefix,
        emailTemplateId,
        emailTemplateType,
        pasteKeysValue,
        redirectURL,
        sendKeyToMultipleCustomers,
        linkDetail,
        selected,
        selectedMainTab,
        suffix,
        tagInputValue,
        tags,
        title,
        totalCodes,
        qrCodeEnabled,
        qrCodePrintOnPDF,
        giftCardEnabled,
        giftCardPropertyName,
        giftDeliveryPropertyName,
        sendKeyToMultipleCustomers,
        deliverKeysInSequence,
        value,
        selectedFileIds,
        sampleFiles,
        downloadLimit,
        isDownloadLimitEnabled,
        expirationType,
        expirationDays,
        selectedDate,
        isDownloadExpirationEnabled,
        productMessage,
        isProductMessageEnabled,
        selectedLicenseIds,
        newLicenses,
        selectedCustomIds,
        newCustoms,
        perUnitNoDelivery,
        isPdfStampingEnabled,
        templateChoice,
        PDFTemplateId,
    ]);

    const handleCreateNewProduct = useCallback(async () => {
        await handleSave();
        navigate("/EmailTemplates");
    }, [navigate, handleSave]);

    // SaveBar action handlers
    // const handleSaveBarSave = async () => {
    //     await handleSave();
    // };

    // const handleSaveBarDiscard = () => {
    //     handleDiscardChanges();
    // };

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
        "createdigitalproduct.drag_and_drop_your_files"
    )} ${
        fileSizeLimit
            ? `(${t("createdigitalproduct.max")} ${formatFileSizeLimit(
                  fileSizeLimit
              )} ${t("createdigitalproduct.per_file")})`
            : t("createdigitalproduct.no_limit_per_file")
    }`;

    const exceedMaxSizeForLicense = licenseFiles.size > MAX_FILE_BYTE;



    const steps = [
        {
            title: "Welcome to Tickelo!",
            description:
                "Your ultimate lottery and ticket management solution. Let's get you set up in just a few steps.",
            image: "/images/bg_onboarding.png",
        },
        {
            title: "Sell Tickets",
            description:
                "Sell digital tickets directly through your store. Track sales and manage orders all in one place.",
            image: "/images/bg_onboarding.png",
        },
        {
            title: "Pick Winners",
            description:
                "Automated or manual winner selection. Send confirmation emails and manage your lottery results.",
            image: "/images/bg_onboarding.png",
        },
    ];

    const handleNext = async () => {
        if (currentStep < totalSteps) {
            const nextStep = currentStep + 1;

            // Call finish-onboarding API when moving to step 3
            if (nextStep === 3) {
                setIsFinishingOnboarding(true);
                try {
                    await fetch("/api/finish-onboarding", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            finishOnboarding: true,
                        }),
                    });
                    console.log("Onboarding finish marked successfully");
                } catch (error) {
                    console.error("Error finishing onboarding:", error);
                } finally {
                    setIsFinishingOnboarding(false);
                }
            }

            setCurrentStep(nextStep);
        } else {
            handleFinish();
        }
    };

    const handleSkipOnboarding = async () => {
        try {
            await fetch("/api/finish-onboarding", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    finishOnboarding: true,
                }),
            });
            console.log("Onboarding skipped successfully");
            navigate("/");
        } catch (error) {
            console.error("Error skipping onboarding:", error);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = () => {
        navigate("/");
    };


    const stepProgress = (currentStep / totalSteps) * 100;

    // Show page loader until all essential data is loaded
    // On step 1, only require essential data. Defer other calls until step 2+
    const isInitialLoadComplete =
        isStoreLoaded &&
        isNewUserChecked &&
        (currentStep > 1 ? (
            isUserPlanLoaded &&
            isPdfTemplatesLoaded &&
            isEmailTemplatesLoaded &&
            isCurrentFilesLoaded
        ) : true);

    if (!isInitialLoadComplete) {
        return <PageLoader />;
    }

 if (currentStep === 1) {
        return (
            <>
                <style>
                    {`
                        @keyframes fadeInUp {
                            from {
                                opacity: 0;
                                transform: translateY(30px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        .fade-in-step {
                            animation: fadeInUp 1s ease-out forwards;
                            opacity: 0;
                        }

                        /* ── Layout overrides ── */
                        .onboarding-layout {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 0;
                        }

                        .onboarding-content {
                            flex: 1 1 320px;
                            min-width: 0;
                        }

                        .onboarding-image-col {
                            flex: 1 1 320px;
                            min-width: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .onboarding-image-col img {
                            width: 100%;
                            max-width: 100%;
                            height: auto;
                            border-radius: 8px;
                            display: block;
                        }

                        /* ── Heading responsive sizing ── */
                        .onboarding-heading {
                            font-size: clamp(22px, 4vw, 36px) !important;
                            line-height: 1.2;
                            word-break: break-word;
                        }

                        /* ── Footer bar ── */
                        .onboarding-footer {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            flex-wrap: wrap;
                            gap: 12px;
                            padding: 16px;
                        }

                        /* ── Progress indicator ── */
                        .progress-wrapper {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            flex-wrap: wrap;
                        }

                        .progress-dots {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        }

                        .progress-dot {
                            width: 32px;
                            height: 5px;
                            border-radius: 3px;
                            transition: background-color 0.3s;
                        }

                        .progress-dot--active {
                            background-color: #088395;
                        }

                        .progress-dot--inactive {
                            background-color: #e0e0e0;
                        }

                        .progress-label {
                            font-size: 16px;
                            font-weight: 600;
                            color: #088395;
                            white-space: nowrap;
                        }

                        /* ── Next button ── */
                        .onboarding-next-btn {
                            background-color: white;
                            color: #303030;
                            border: 1.5px solid #d0d0d0;
                            border-radius: 8px;
                            padding: 12px 24px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            transition: background-color 0.2s, border-color 0.2s;
                            white-space: nowrap;
                        }

                        .onboarding-next-btn:hover {
                            background-color: #f5f5f5;
                            border-color: #a0a0a0;
                        }

                        /* ── Breakpoint: tablet (≤ 768px) ── */
                        @media (max-width: 768px) {
                            .onboarding-image-col {
                                order: -1; /* image on top on small screens */
                            }

                            .progress-dot {
                                width: 24px !important;
                                height: 4px !important;
                            }

                            .progress-label {
                                font-size: 14px;
                            }
                        }

                        /* ── Breakpoint: mobile (≤ 480px) ── */
                        @media (max-width: 480px) {
                            .onboarding-layout {
                                flex-direction: column;
                            }

                            .onboarding-content,
                            .onboarding-image-col {
                                flex: 1 1 100%;
                            }

                            .progress-dot {
                                width: 20px !important;
                                height: 3px !important;
                            }

                            .onboarding-next-btn {
                                padding: 10px 16px;
                                font-size: 14px;
                                width: 100%;
                                justify-content: center;
                            }

                            .onboarding-footer {
                                flex-direction: column;
                                align-items: stretch;
                                text-align: center;
                            }

                            .progress-wrapper {
                                justify-content: center;
                            }
                        }

                        /* ── Wrapper padding for responsive spacing ── */
                        .onboarding-step-1-wrapper {
                            padding: 0;
                        }
                    `}
                </style>

                <div className="onboarding-step-1-wrapper">
                <Page>
                    <Card className="fade-in-step">

                        {/* ── Two-column layout ── */}
                        <div className="onboarding-layout">

                            {/* Left: text content */}
                            <div className="onboarding-content">
                                <Box padding="400">
                                    <BlockStack gap="600">

                                        {/* Heading group */}
                                        <BlockStack>
                                            <InlineStack
                                                align="start"
                                                blockAlign="center"
                                                gap="200"
                                                wrap="wrap"
                                            >
                                                <Text
                                                    variant="heading3xl"
                                                    as="h2"
                                                    fontWeight="bold"
                                                >
                                                    <span
                                                        className="onboarding-heading"
                                                        style={{ color: "#09637E" }}
                                                    >
                                                        {t("onboarding.Welcome_to")}
                                                    </span>
                                                </Text>
                                                <Badge size="large">
                                                    <span style={{ color: "#088395" }}>
                                                        {t("onboarding.Deliveries")}
                                                    </span>
                                                </Badge>
                                            </InlineStack>

                                            <Text
                                                variant="heading3xl"
                                                as="h2"
                                                fontWeight="bold"
                                            >
                                                <span
                                                    className="onboarding-heading"
                                                    style={{ color: "#09637E" }}
                                                >
                                                    {t("onboarding.Digitally_Digital_Products")}
                                                </span>
                                            </Text>
                                        </BlockStack>

                                        {/* Subtitle */}
                                        <Text as="p" variant="headingMd" tone="magic">
                                            <span style={{ color: "#7AB2B2" }}>
                                                {t("onboarding.Lets_get_your_digital_products_ready")}
                                            </span>
                                        </Text>

                                        {/* Language selector */}
                                        <div style={{ maxWidth: "80px", marginLeft: "40px" }}>
                                            <LanguageSelector />
                                        </div>

                                    </BlockStack>
                                </Box>
                            </div>

                            {/* Right: illustration */}
                            <div className="onboarding-image-col">
                                <img
                                    src="/images/on.png"
                                    alt="Onboarding illustration"
                                />
                            </div>
                        </div>

                        {/* ── Footer: progress + next button ── */}
                        <BlockStack gap="100">
                            <Box padding="400">
                                <div className="onboarding-footer">

                                    {/* Spacer (keeps Next button right-aligned on desktop) */}
                                    <div aria-hidden="true" />

                                    {/* Progress dots */}
                                    <div className="progress-wrapper">
                                        <div className="progress-dots">
                                            <div className="progress-dot progress-dot--active" />
                                            <div className="progress-dot progress-dot--inactive" />
                                            <div className="progress-dot progress-dot--inactive" />
                                            <div className="progress-dot progress-dot--inactive" />
                                        </div>
                                        <span className="progress-label">1/4</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        {/* Skip Onboarding */}
                                        <button
                                            className="onboarding-next-btn"
                                            onClick={handleSkipOnboarding}
                                            style={{
                                                backgroundColor: "white",
                                                color: "#303030",
                                                border: "1.5px solid #d0d0d0",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#f5f5f5";
                                                e.currentTarget.style.borderColor = "#a0a0a0";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "white";
                                                e.currentTarget.style.borderColor = "#d0d0d0";
                                            }}
                                        >
                                            {t("onboarding.Skip_Onboarding")}
                                        </button>

                                        {/* Next button */}
                                        <button
                                            className="onboarding-next-btn"
                                            onClick={handleNext}
                                        >
                                            {t("onboarding.Next_→")}
                                        </button>
                                    </div>

                                </div>
                            </Box>
                        </BlockStack>

                    </Card>
                </Page>
                </div>
            </>
        );
    }

   if (currentStep === 2) {
        const productTypes = [
            {
                key: "file",
                icon: "./images/file_icon.png",
                title: t("onboarding.files"),
                desc1: t("onboarding.pdf_zip_e_book_software_etc"),
            },
            {
                key: "license",
                icon: "./images/License.png",
                title: t("onboarding.keys_codes"),
                desc1: t("onboarding.license_keys_codes_serials"),
            },
            {
                key: "pdf",
                icon: "./images/pdf-file.png",
                title: t("onboarding.pdf_with_stamping"),
                desc1: t("onboarding.watermark_stamp_user_info"),
            },
            {
                key: "links",
                icon: "./images/link_icon.png",
                title: t("onboarding.custom_links"),
                desc1: t("onboarding.send_protected_access_or"),
            },
        ];

        return (
            <>
                <style>
                    {`
                        /* ── Step breadcrumb bar ── */
                        .ob2-steps {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            flex-wrap: wrap;
                        }

                        .ob2-step-pill {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            padding: 6px 12px;
                            border-radius: 20px;
                            background-color: #f5f5f5;
                            border: 1px solid #e0e0e0;
                        }

                        .ob2-step-circle {
                            width: 22px;
                            height: 22px;
                            border-radius: 50%;
                            border: 1.5px solid #09637E;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            font-size: 12px;
                            flex-shrink: 0;
                        }

                        .ob2-step-circle--done {
                            background-color: #088395;
                            color: white;
                        }

                        .ob2-step-circle--active {
                            background-color: white;
                            color: #088395;
                        }

                        .ob2-step-circle--inactive {
                            background-color: white;
                            color: #088395;
                        }

                        .ob2-step-label {
                            font-weight: 500;
                            font-size: 13px;
                            white-space: nowrap;
                        }

                        .ob2-step-badge {
                            background-color: #088395;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            padding: 4px 10px;
                            font-size: 12px;
                            font-weight: 500;
                            cursor: default;
                            white-space: nowrap;
                        }

                        /* ── Two-column layout ── */
                        .ob2-layout {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 0;
                        }

                        .ob2-col-left {
                            flex: 1 1 280px;
                            min-width: 0;
                        }

                        .ob2-col-right {
                            flex: 1 1 280px;
                            min-width: 0;
                        }

                        /* ── Heading ── */
                        .ob2-heading {
                            color: #088395;
                            font-size: clamp(24px, 4vw, 46px) !important;
                            line-height: 1.2;
                            word-break: break-word;
                        }

                        /* ── Product grid ── */
                        .ob2-grid {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 8px;
                            max-height: 400px;
                            overflow-y: auto;
                            padding-right: 8px;
                        }

                        /* ── Product card ── */
                        .ob2-card {
                            border-radius: 12px;
                            padding: 16px 12px;
                            text-align: center;
                            cursor: pointer;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 8px;
                            min-height: 110px;
                            position: relative;
                            overflow: hidden;
                            margin-top: 10px;
                            background-color: white;
                        }

                        .ob2-card--selected {
                            border: 2px solid #088395;
                            box-shadow: 0 6px 18px rgba(8, 131, 149, 0.15);
                        }

                        .ob2-card--unselected {
                            border: 1px solid #e8e8e8;
                            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
                        }

                        .ob2-card--unselected:hover {
                            border-color: #088395;
                            transform: translateY(-2px);
                            box-shadow: 0 8px 20px rgba(8, 131, 149, 0.12);
                        }

                        .ob2-card-check {
                            position: absolute;
                            top: 8px;
                            right: 8px;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background-color: #088395;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            animation: scaleIn 0.3s ease-out;
                        }

                        .ob2-icon-wrap {
                            width: 48px;
                            height: 48px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.3s ease;
                            flex-shrink: 0;
                        }

                        .ob2-icon-wrap--selected {
                            background: linear-gradient(135deg, #088395 0%, #06667a 100%);
                        }

                        .ob2-icon-wrap--unselected {
                            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
                        }

                        .ob2-card-title {
                            font-size: 14px;
                            font-weight: 700;
                            line-height: 1.3;
                            letter-spacing: -0.2px;
                        }

                        .ob2-card-title--selected { color: #088395; }
                        .ob2-card-title--unselected { color: #1a1a1a; }

                        .ob2-card-desc {
                            font-size: 11px;
                            font-weight: 400;
                            line-height: 1.4;
                            color: #666666;
                            max-width: 150px;
                        }

                        /* ── Footer bar ── */
                        .ob2-footer {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            flex-wrap: wrap;
                            gap: 12px;
                            width: 100%;
                        }

                        /* ── Shared nav button base ── */
                        .ob2-btn {
                            border-radius: 8px;
                            padding: 12px 24px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            transition: all 0.2s;
                            white-space: nowrap;
                        }

                        .ob2-btn-prev {
                            background-color: white;
                            color: #303030;
                            border: 1.5px solid #d0d0d0;
                        }

                        .ob2-btn-prev:hover:not(:disabled) {
                            background-color: #f5f5f5;
                            border-color: #a0a0a0;
                        }

                        .ob2-btn-prev:disabled {
                            opacity: 0.5;
                            cursor: not-allowed;
                        }

                        .ob2-btn-next {
                            background-color: #088395;
                            color: white;
                            border: none;
                            padding: 12px 28px;
                        }

                        .ob2-btn-next:hover:not(:disabled) {
                            background-color: #09637E;
                            transform: translateY(-1px);
                        }

                        .ob2-btn-next:disabled {
                            background-color: #cccccc;
                            opacity: 0.6;
                            cursor: not-allowed;
                        }

                        /* ── Spinner animation ── */
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }

                        /* ── Progress dots ── */
                        .ob2-progress {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            flex-wrap: wrap;
                            justify-content: center;
                        }

                        .ob2-dots {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        }

                        .ob2-dot {
                            width: 32px;
                            height: 5px;
                            border-radius: 3px;
                        }

                        .ob2-dot--active  { background-color: #09637E; }
                        .ob2-dot--inactive { background-color: #e0e0e0; }

                        .ob2-progress-label {
                            font-size: 16px;
                            font-weight: 600;
                            color: #09637E;
                            white-space: nowrap;
                        }

                        /* ── Tablet (≤ 768px) ── */
                        @media (max-width: 768px) {
                            .ob2-dot {
                                width: 24px !important;
                                height: 4px !important;
                            }
                        }

                        /* ── Mobile (≤ 480px) ── */
                        @media (max-width: 480px) {
                            .ob2-layout {
                                flex-direction: column;
                            }

                            .ob2-col-left,
                            .ob2-col-right {
                                flex: 1 1 100%;
                            }

                            .ob2-grid {
                                grid-template-columns: repeat(2, 1fr);
                                max-height: none;
                            }

                            .ob2-footer {
                                flex-direction: column;
                                align-items: stretch;
                            }

                            .ob2-btn {
                                width: 100%;
                                justify-content: center;
                            }

                            .ob2-progress {
                                justify-content: center;
                            }

                            .ob2-dot {
                                width: 20px !important;
                                height: 3px !important;
                            }
                        }

                        /* ── Very small screens (≤ 360px) ── */
                        @media (max-width: 360px) {
                            .ob2-grid {
                                grid-template-columns: 1fr;
                            }

                            .ob2-steps {
                                gap: 6px;
                            }

                            .ob2-step-pill {
                                padding: 4px 8px;
                            }

                            .ob2-step-label,
                            .ob2-step-badge {
                                font-size: 11px;
                            }
                        }

                        /* ── Extra small screens (≤ 495px) - Add side padding ── */
                        /* ── Wrapper padding for responsive spacing ── */
                        .onboarding-step-2-wrapper {
                            padding: 0;
                        }

                        @media (max-width: 495px) {
                            .onboarding-step-2-wrapper {
                                padding: 0;
                            }

                            .ob2-steps {
                                padding: 0 8px;
                            }
                        }

                        @keyframes scaleIn {
                            from { transform: scale(0); opacity: 0; }
                            to   { transform: scale(1); opacity: 1; }
                        }
                    `}
                </style>

                <div className="onboarding-step-2-wrapper">
                <Page>
                    <Card>
                        <BlockStack gap="500">

                            {/* ── Step breadcrumb ── */}
                            <Box paddingInline="600" paddingBlockEnd="400">
                                <div className="ob2-steps">

                                    {/* Step 1 – done */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--done">✓</div>
                                        <span className="ob2-step-label">{t("onboarding.Welcome")}</span>
                                    </div>

                                    {/* Step 2 – active */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--active">2</div>
                                        <span className="ob2-step-label">
                                            <button className="ob2-step-badge">
                                                {t("onboarding.Product_Type")}
                                            </button>
                                        </span>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--inactive">3</div>
                                        <span className="ob2-step-label">{t("onboarding.Choose_Product")}</span>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--inactive">4</div>
                                        <span className="ob2-step-label">{t("onboarding.congratulations")}</span>
                                    </div>

                                </div>
                            </Box>

                            {/* ── Two-column body ── */}
                            <div className="ob2-layout">

                                {/* Left: heading */}
                                <div className="ob2-col-left">
                                    <Box padding="600" paddingBlockEnd="500">
                                        <Text as="h1" variant="heading2xl" fontWeight="bold">
                                            <span className="ob2-heading">
                                                {t("onboarding.What_kind_of_products_will_you_be_selling")}
                                            </span>
                                        </Text>
                                    </Box>
                                </div>

                                {/* Right: product type grid */}
                                <div className="ob2-col-right">
                                    <Box padding="500">
                                        <div
                                            style={{
                                                borderRadius: "16px",
                                                padding: "20px",
                                                background: "linear-gradient(135deg, #ffffff 0%, #f8fbfb 100%)",
                                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                            }}
                                        >
                                            <div className="ob2-grid">
                                                {productTypes.map((type) => {
                                                    const isSelected = selectedProductType === type.key;
                                                    return (
                                                        <div
                                                            key={type.key}
                                                            className={`ob2-card ${isSelected ? "ob2-card--selected" : "ob2-card--unselected"}`}
                                                            onClick={() => setSelectedProductType(type.key)}
                                                        >
                                                            {/* Checkmark badge */}
                                                            {isSelected && (
                                                                <div className="ob2-card-check">
                                                                    <svg
                                                                        width="12"
                                                                        height="12"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="white"
                                                                        strokeWidth="3"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                    </svg>
                                                                </div>
                                                            )}

                                                            {/* Icon */}
                                                            <div className={`ob2-icon-wrap ${isSelected ? "ob2-icon-wrap--selected" : "ob2-icon-wrap--unselected"}`}>
                                                                <img
                                                                    src={type.icon}
                                                                    alt={type.title}
                                                                    style={{
                                                                        width: "26px",
                                                                        height: "26px",
                                                                        objectFit: "contain",
                                                                        filter: isSelected ? "brightness(0) invert(1)" : "none",
                                                                        transition: "all 0.3s ease",
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Title */}
                                                            <div className={`ob2-card-title ${isSelected ? "ob2-card-title--selected" : "ob2-card-title--unselected"}`}>
                                                                {type.title}
                                                            </div>

                                                            {/* Description */}
                                                            <div className="ob2-card-desc">{type.desc1}</div>

                                                            {type.desc2 && (
                                                                <div
                                                                    className="ob2-card-desc"
                                                                    style={{ color: "#888888", marginTop: "-2px" }}
                                                                >
                                                                    {type.desc2}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Box>
                                </div>

                            </div>

                            {/* ── Footer navigation ── */}
                            <Box padding="600" paddingBlockStart="400">
                                <div className="ob2-footer">

                                    {/* Previous */}
                                    <button
                                        className="ob2-btn ob2-btn-prev"
                                        onClick={handleBack}
                                        disabled={currentStep === 4 || isFinishingOnboarding}
                                    >
                                        <span>‹</span>
                                        {t("onboarding.Previous")}
                                    </button>

                                    {/* Progress */}
                                    <div className="ob2-progress">
                                        <div className="ob2-dots">
                                            <div className="ob2-dot ob2-dot--active" />
                                            <div className="ob2-dot ob2-dot--active" />
                                            <div className="ob2-dot ob2-dot--inactive" />
                                            <div className="ob2-dot ob2-dot--inactive" />
                                        </div>
                                        <span className="ob2-progress-label">2/4</span>
                                    </div>

                                    {/* Right Side Buttons */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            alignItems: "center",
                                        }}
                                    >
                                        {/* Skip Onboarding */}
                                        <button
                                            className="ob2-btn ob2-btn-skip"
                                            onClick={handleSkipOnboarding}
                                            disabled={isFinishingOnboarding}
                                            style={{
                                                backgroundColor: "white",
                                                color: "#303030",
                                                border: "1.5px solid #d0d0d0",
                                                opacity: isFinishingOnboarding ? 0.6 : 1,
                                                cursor: isFinishingOnboarding ? "not-allowed" : "pointer"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isFinishingOnboarding) {
                                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                                    e.currentTarget.style.borderColor = "#a0a0a0";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "white";
                                                e.currentTarget.style.borderColor = "#d0d0d0";
                                            }}
                                        >
                                            {t("onboarding.Skip_Onboarding")}
                                        </button>

                                        {/* Next */}
                                        <button
                                            className="ob2-btn ob2-btn-next"
                                            disabled={!selectedProductType || isFinishingOnboarding}
                                            onClick={handleNext}
                                        >
                                            {isFinishingOnboarding ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className="spinner" style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        border: '2px solid rgba(255,255,255,0.3)',
                                                        borderTop: '2px solid white',
                                                        borderRadius: '50%',
                                                        animation: 'spin 0.8s linear infinite'
                                                    }}></span>
                                                    {t("settings.email_content.loading")}
                                                </span>
                                            ) : (
                                                t("onboarding.Next_→")
                                            )}
                                        </button>
                                    </div>

                                </div>
                            </Box>

                        </BlockStack>
                    </Card>
                </Page>
                </div>
            </>
        );
    }

    if (currentStep === 3) {
        // Get product types for display
        const productTypes = [
            {
                key: "file",
                title: t("onboarding.files"),
                icon: "📁",
            },
            {
                key: "license",
                title: t("onboarding.keys_codes"),
                icon: "🔑",
            },
            {
                key: "pdf",
                title: t("onboarding.pdf_with_stamping"),
                icon: "📑",
            },
            {
                key: "links",
                title: t("onboarding.custom_links"),
                icon: "🔗",
            },
            // {
            //     key: "mixedContent",
            //     title: t("onboarding.mixed_delivery"),
            //     icon: "📦",
            // },
            // {
            //     key: "notSure",
            //     title: t("onboarding.not_sure"),
            //     icon: "💬",
            // },
        ];

        const selectedType = productTypes.find(
            (type) => type.key === selectedProductType
        );

        return (
            <>
                <style>
                    {`
                        /* ── Wrapper padding for responsive spacing ── */
                        .onboarding-step-3-wrapper {
                            padding: 0;
                        }
                    `}
                </style>
                <div className="onboarding-step-3-wrapper">
                <Page>
                <div style={{}}>
                    <Card className="onboarding-step-3-card">
                        <BlockStack gap="500">
                            {/* Header */}
                            {/* Step Instructions */}
                            <Box paddingInline="600" paddingBlockEnd="400">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {/* Step 1 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #e0e0e0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "22px",
                                                height: "22px",
                                                borderRadius: "50%",
                                                backgroundColor: "#088395",
                                                border: "1.5px solid #09637E",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                fontSize: "12px",
                                                color: "white",
                                            }}
                                        >
                                            ✓
                                        </div>
                                        <span
                                            style={{
                                                fontWeight: "500",
                                                fontSize: "13px",
                                            }}
                                        >
                                            {t("onboarding.Welcome")}
                                        </span>
                                    </div>

                                    {/* Step 2 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #e0e0e0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "22px",
                                                height: "22px",
                                                borderRadius: "50%",
                                                backgroundColor: "#088395",
                                                border: "1.5px solid #09637E",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                fontSize: "12px",
                                                color: "white",
                                            }}
                                        >
                                            ✓
                                        </div>
                                        <span
                                            style={{
                                                fontWeight: "500",
                                                fontSize: "13px",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {t("onboarding.Product_Type")}
                                        </span>
                                    </div>

                                    {/* Step 3 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #e0e0e0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "22px",
                                                height: "22px",
                                                borderRadius: "50%",
                                                backgroundColor: "white",
                                                border: "1.5px solid #09637E",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                fontSize: "12px",
                                                color: "#088395",
                                            }}
                                        >
                                            3
                                        </div>
                                        <span
                                            style={{
                                                fontWeight: "500",
                                                fontSize: "13px",
                                            }}
                                        >
                                            <button
                                                style={{
                                                    backgroundColor: "#088395",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    padding: "4px 10px",
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    cursor: "pointer",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {t("onboarding.Create_Product")}
                                            </button>
                                        </span>
                                    </div>

                                    {/* Step 4 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #e0e0e0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "22px",
                                                height: "22px",
                                                borderRadius: "50%",
                                                backgroundColor: "white",
                                                border: "1.5px solid #09637E",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                fontSize: "12px",
                                                color: "#088395",
                                            }}
                                        >
                                            4
                                        </div>
                                        <span
                                            style={{
                                                fontWeight: "500",
                                                fontSize: "13px",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {t("onboarding.congratulations")}
                                        </span>
                                    </div>
                                </div>
                            </Box>

                            {/* Selected Product Display */}

                            {/* Mock Configuration Section - Replace with real code */}
                            <Box padding="600" paddingBlockStart="0">
                                <div
                                    style={{
                                        maxWidth: "800px",
                                        margin: "0 auto",
                                    }}
                                >
                                    {/* Product-specific mock content */}

                                    {selectedProductType === "file" && (
                                        <div>
                                            <BlockStack gap="400">
                                                <Card>
                                                    <BlockStack gap="300">
                                                        <Text
                                                            variant="headingMd"
                                                            as="h6"
                                                        >
                                                            {t(
                                                                "createdigitalproduct.when_this_shopify_product_is_purchased"
                                                            )}
                                                        </Text>
                                                        {selectedProduct ? (
                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <InlineGrid
                                                                    columns="1fr auto"
                                                                    style={{
                                                                        marginBottom:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <InlineStack>
                                                                            <div>
                                                                                <Thumbnail
                                                                                    source={
                                                                                        selectedProduct
                                                                                            ?.images[0]
                                                                                            ?.originalSrc ??
                                                                                        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                                                                                    }
                                                                                    alt={
                                                                                        selectedProduct?.title
                                                                                    }
                                                                                    size="large"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft:
                                                                                        "20px",
                                                                                }}
                                                                            >
                                                                                <div>
                                                                                    <Link url="#">
                                                                                        <Text
                                                                                            variant="headingMd"
                                                                                            as="h6"
                                                                                        >
                                                                                            {
                                                                                                selectedProduct?.title
                                                                                            }
                                                                                        </Text>
                                                                                    </Link>
                                                                                    {selectedProduct
                                                                                        ?.variants
                                                                                        ?.length >
                                                                                    1 ? (
                                                                                        <Text
                                                                                            variant="bodyLg"
                                                                                            as="p"
                                                                                        >
                                                                                            {t(
                                                                                                "digtal_product_listing.all_variants"
                                                                                            )}

                                                                                            (
                                                                                            {
                                                                                                selectedProduct
                                                                                                    .variants
                                                                                                    .length
                                                                                            }

                                                                                            )
                                                                                        </Text>
                                                                                    ) : (
                                                                                        selectedProduct.variants.map(
                                                                                            (
                                                                                                variant,
                                                                                                index
                                                                                            ) => (
                                                                                                <Text
                                                                                                    key={
                                                                                                        variant.id
                                                                                                    }
                                                                                                    variant="bodyLg"
                                                                                                    as="h6"
                                                                                                >
                                                                                                    {
                                                                                                        variant.title
                                                                                                    }
                                                                                                </Text>
                                                                                            )
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </InlineStack>
                                                                    </div>
                                                                    <div
                                                                        onClick={
                                                                            toggleProductPicker
                                                                        }
                                                                    >
                                                                        <Link url="#">
                                                                            <Text
                                                                                variant="bodyLg"
                                                                                as="p"
                                                                            >
                                                                                {t(
                                                                                    "createdigitalproduct.edit_product"
                                                                                )}
                                                                            </Text>
                                                                        </Link>
                                                                    </div>
                                                                </InlineGrid>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        flex: "78%",
                                                                    }}
                                                                >
                                                                    <TextField
                                                                        value={
                                                                            selectedProduct
                                                                                ? selectedProduct.title
                                                                                : ""
                                                                        }
                                                                        onFocus={
                                                                            toggleProductPicker
                                                                        }
                                                                        placeholder={t(
                                                                            "createdigitalproduct.search_shopify_products"
                                                                        )}
                                                                        fullWidth
                                                                        readOnly
                                                                    />
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        flex: "22%",
                                                                        marginLeft:
                                                                            "1rem",
                                                                    }}
                                                                >
                                                                    <Button
                                                                        onClick={
                                                                            toggleProductPicker
                                                                        }
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.browse_products"
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <Text
                                                                as={"p"}
                                                                variant={
                                                                    "bodyMd"
                                                                }
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.select_shopify_product_or_specific_product"
                                                                )}
                                                            </Text>
                                                        </div>
                                                    </BlockStack>
                                                </Card>
                                                {!isManualDeliveryEnabled && (
                                                    <Card>
                                                        <BlockStack gap="300">
                                                            <Text
                                                                variant="headingMd"
                                                                as="h6"
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.provide_the_following_content_to_the_customer"
                                                                )}
                                                            </Text>

                                                            {contentType &&
                                                                contentType.includes(
                                                                    "files"
                                                                ) && (
                                                                    <BlockStack gap="200">
                                                                        {files.length >
                                                                            0 &&
                                                                            files.map(
                                                                                (
                                                                                    file,
                                                                                    index
                                                                                ) => {
                                                                                    const exceedMaxSize =
                                                                                        file.size >
                                                                                        fileSizeLimit;

                                                                                    return (
                                                                                        <InlineGrid columns="1fr auto">
                                                                                            <div>
                                                                                                <InlineStack>
                                                                                                    <div>
                                                                                                        <Card>
                                                                                                            <BlockStack gap="300">
                                                                                                                <div
                                                                                                                    style={{
                                                                                                                        width: "24px",
                                                                                                                        height: "24px",
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
                                                                                                            </BlockStack>
                                                                                                        </Card>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        style={{
                                                                                                            marginLeft:
                                                                                                                "20px",
                                                                                                        }}
                                                                                                    >
                                                                                                        <div>
                                                                                                            <BlockStack gap="200">
                                                                                                                <Link url="#">
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
                                                                                                                        {
                                                                                                                            file.name
                                                                                                                        }
                                                                                                                    </Text>
                                                                                                                </Link>
                                                                                                                <Text
                                                                                                                    variant="bodySm"
                                                                                                                    as="p"
                                                                                                                    color={
                                                                                                                        exceedMaxSize
                                                                                                                            ? "critical"
                                                                                                                            : "subdued"
                                                                                                                    }
                                                                                                                >
                                                                                                                    {file.type.toUpperCase()}{" "}
                                                                                                                    -{" "}
                                                                                                                    {prettyBytes(
                                                                                                                        file.size
                                                                                                                    )}
                                                                                                                    {exceedMaxSize &&
                                                                                                                        t(
                                                                                                                            "createdigitalproduct.file_too_big_it_will_be_ignored"
                                                                                                                        )}
                                                                                                                </Text>
                                                                                                            </BlockStack>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </InlineStack>
                                                                                            </div>
                                                                                            <div>
                                                                                                <Button
                                                                                                    icon={
                                                                                                        <Icon
                                                                                                            source={
                                                                                                                XSmallIcon
                                                                                                            }
                                                                                                        />
                                                                                                    }
                                                                                                    onClick={() =>
                                                                                                        handleDeleteFileAtIndex(
                                                                                                            index,
                                                                                                            "files"
                                                                                                        )
                                                                                                    }
                                                                                                ></Button>
                                                                                            </div>
                                                                                        </InlineGrid>
                                                                                    );
                                                                                }
                                                                            )}

                                                                        {googleDriveLink && (
                                                                            <InlineGrid columns="1fr auto">
                                                                                <div>
                                                                                    <InlineStack>
                                                                                        <div>
                                                                                            <Card>
                                                                                                <BlockStack gap="300">
                                                                                                    <div
                                                                                                        style={{
                                                                                                            width: "24px",
                                                                                                            height: "24px",
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
                                                                                                </BlockStack>
                                                                                            </Card>
                                                                                        </div>
                                                                                        <div
                                                                                            style={{
                                                                                                marginLeft:
                                                                                                    "20px",
                                                                                            }}
                                                                                        >
                                                                                            <BlockStack gap="200">
                                                                                                <Link
                                                                                                    url={
                                                                                                        googleDriveLink
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        googleDriveLink
                                                                                                    }
                                                                                                </Link>
                                                                                            </BlockStack>
                                                                                        </div>
                                                                                    </InlineStack>
                                                                                </div>
                                                                                <div>
                                                                                    <Button
                                                                                        icon={
                                                                                            <Icon
                                                                                                source={
                                                                                                    XSmallIcon
                                                                                                }
                                                                                            />
                                                                                        }
                                                                                        onClick={() =>
                                                                                            handleDeleteFileAtIndex(
                                                                                                null,
                                                                                                "googleDrive"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Delete
                                                                                    </Button>
                                                                                </div>
                                                                            </InlineGrid>
                                                                        )}

                                                                        <div>
                                                                            {selectedFileDetails
                                                                                .filter(
                                                                                    (
                                                                                        file
                                                                                    ) =>
                                                                                        file.url
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        file,
                                                                                        index
                                                                                    ) => {
                                                                                        const isSelected =
                                                                                            selectedFileIds.includes(
                                                                                                file.id
                                                                                            );

                                                                                        return (
                                                                                            <InlineGrid columns="1fr auto">
                                                                                                <div>
                                                                                                    <InlineStack>
                                                                                                        <div>
                                                                                                            <Card>
                                                                                                                <BlockStack gap="300">
                                                                                                                    <div
                                                                                                                        style={{
                                                                                                                            width: "24px",
                                                                                                                            height: "24px",
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
                                                                                                                </BlockStack>
                                                                                                            </Card>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            style={{
                                                                                                                marginLeft:
                                                                                                                    "20px",
                                                                                                            }}
                                                                                                        >
                                                                                                            <div>
                                                                                                                <BlockStack gap="200">
                                                                                                                    <Link url="#">
                                                                                                                        <Text
                                                                                                                            variant="bodyMd"
                                                                                                                            as="p"
                                                                                                                            fontWeight="bold"
                                                                                                                            color={
                                                                                                                                isSelected
                                                                                                                                    ? "critical"
                                                                                                                                    : ""
                                                                                                                            }
                                                                                                                        >
                                                                                                                            {
                                                                                                                                file.fileName
                                                                                                                            }
                                                                                                                        </Text>
                                                                                                                    </Link>
                                                                                                                    <Text
                                                                                                                        variant="bodySm"
                                                                                                                        as="p"
                                                                                                                        color={
                                                                                                                            isSelected
                                                                                                                                ? "critical"
                                                                                                                                : "subdued"
                                                                                                                        }
                                                                                                                    >
                                                                                                                        {file.mimeType.toUpperCase()}{" "}
                                                                                                                        -{" "}
                                                                                                                        {prettyBytes(
                                                                                                                            file.byteSize
                                                                                                                        )}
                                                                                                                    </Text>
                                                                                                                </BlockStack>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </InlineStack>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <Button
                                                                                                        icon={
                                                                                                            <Icon
                                                                                                                source={
                                                                                                                    XSmallIcon
                                                                                                                }
                                                                                                            />
                                                                                                        }
                                                                                                        onClick={() =>
                                                                                                            handleDeleteFileAtIndex(
                                                                                                                index,
                                                                                                                "orders"
                                                                                                            )
                                                                                                        }
                                                                                                    ></Button>
                                                                                                </div>
                                                                                            </InlineGrid>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                        </div>

                                                                        {saving && (
                                                                            <div>
                                                                                <Text
                                                                                    as={
                                                                                        "h5"
                                                                                    }
                                                                                >
                                                                                    {t(
                                                                                        "createdigitalproduct.files_are_uploading_please_wait"
                                                                                    )}
                                                                                </Text>
                                                                                <ProgressBar
                                                                                    progress={
                                                                                        progress
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </BlockStack>
                                                                )}

                                                            {selectedProduct ? (
                                                                <div>
                                                                    <Modal.Section>
                                                                        <Tabs
                                                                            tabs={
                                                                                mainTabs
                                                                            }
                                                                            selected={
                                                                                selectedMainTab
                                                                            }
                                                                            onSelect={
                                                                                handleTabChange
                                                                            }
                                                                        >
                                                                            {selectedMainTab ===
                                                                                0 && (
                                                                                <BlockStack gap="400">
                                                                                    <DropZone
                                                                                        label={
                                                                                            fileLabelText
                                                                                        }
                                                                                        onDrop={
                                                                                            handleDropZoneDrop
                                                                                        }
                                                                                    >
                                                                                        <DropZone.FileUpload
                                                                                            actionTitle={t(
                                                                                                "createdigitalproduct.add_files"
                                                                                            )}
                                                                                        />
                                                                                    </DropZone>

                                                                                    {files.length >
                                                                                        0 && (
                                                                                        <BlockStack gap="200">
                                                                                            {files.map(
                                                                                                (
                                                                                                    file,
                                                                                                    index
                                                                                                ) => {
                                                                                                    const exceedMaxSize =
                                                                                                        file.size >
                                                                                                        fileSizeLimit;

                                                                                                    return (
                                                                                                        <InlineStack
                                                                                                            key={
                                                                                                                index
                                                                                                            }
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
                                                                                                                onClick={() =>
                                                                                                                    handleDeleteFileAtIndex(
                                                                                                                        index,
                                                                                                                        "files"
                                                                                                                    )
                                                                                                                }
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
                                                                                                                    {
                                                                                                                        file.name
                                                                                                                    }
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
                                                                                                }
                                                                                            )}
                                                                                        </BlockStack>
                                                                                    )}
                                                                                </BlockStack>
                                                                            )}
                                                                            {selectedMainTab ===
                                                                                1 && (
                                                                                <>
                                                                                    <div
                                                                                        style={{
                                                                                            padding:
                                                                                                "16px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t(
                                                                                                "createdigitalproduct.google_drive_file_folder_link"
                                                                                            )}
                                                                                            value={
                                                                                                googleDriveLink
                                                                                            }
                                                                                            onChange={
                                                                                                handleGoogleDriveLinkChange
                                                                                            }
                                                                                            placeholder={t("createdigitalproduct.enter_google_drive_file_or_folder_link")}
                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop:
                                                                                                    "5px",
                                                                                            }}
                                                                                        ></div>
                                                                                        <Text
                                                                                            variant="bodySm"
                                                                                            tone="subdued"
                                                                                            style={{
                                                                                                marginTop:
                                                                                                    "8px",
                                                                                            }}
                                                                                        >
                                                                                            {t(
                                                                                                "createdigitalproduct.google_drive_help_text"
                                                                                            )}
                                                                                        </Text>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </Tabs>
                                                                    </Modal.Section>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <Text
                                                                        variant="bodyLg"
                                                                        as="p"
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.add_shopify_product_to_attached_content"
                                                                        )}
                                                                    </Text>
                                                                </div>
                                                            )}
                                                        </BlockStack>
                                                    </Card>
                                                )}
                                                {/* <Card>
                                                    {userPlan === "free" && (
                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <Banner
                                                                tone="warning"
                                                                title={t(
                                                                    "editdigitalproduct.upgrade_your_plan"
                                                                )}
                                                            >
                                                                <Text
                                                                    variant="bodyMd"
                                                                    as="p"
                                                                >
                                                                    {t(
                                                                        "createdigitalproduct.upgrade_to_paid_plan_to_enable_auto_fulfill"
                                                                    )}
                                                                </Text>
                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            "5px",
                                                                    }}
                                                                ></div>
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={
                                                                        handlePricing
                                                                    }
                                                                >
                                                                    {t(
                                                                        "createdigitalproduct.upgrade_now"
                                                                    )}
                                                                </Button>
                                                            </Banner>
                                                        </div>
                                                    )}
                                                    <div
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    ></div>

                                                    <Text
                                                        variant="headingMd"
                                                        as="h6"
                                                    >
                                                        {t(
                                                            "createdigitalproduct.auto_fulfill_optional"
                                                        )}
                                                    </Text>
                                                    <div
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                autoFulfill
                                                            }
                                                            label={t(
                                                                "createdigitalproduct.auto_fulfill_this_product_on_shopify_orders"
                                                            )}
                                                            onChange={
                                                                handleAutoFulfillCheckbox
                                                            }
                                                            disabled={
                                                                userPlan ===
                                                                "free"
                                                            }
                                                        />
                                                        <div
                                                            style={{
                                                                marginLeft: 25,
                                                            }}
                                                        >
                                                            <Text
                                                                as={"p"}
                                                                variant={
                                                                    "bodyMd"
                                                                }
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.automatically_fulfill_the"
                                                                )}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </Card> */}
                                            </BlockStack>
                                        </div>
                                    )}



                                    {selectedProductType === "license" && (
                                        <div
                                            style={{
                                                backgroundColor: "white",
                                                borderRadius: "8px",
                                                padding: "24px",
                                            }}
                                        >
                                            <BlockStack gap="400">
                                                <Card>
                                                    <BlockStack gap="300">
                                                        <Text
                                                            variant="headingMd"
                                                            as="h6"
                                                        >
                                                            {t(
                                                                "createdigitalproduct.when_this_shopify_product_is_purchased"
                                                            )}
                                                        </Text>
                                                        {selectedProduct ? (
                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <InlineGrid
                                                                    columns="1fr auto"
                                                                    style={{
                                                                        marginBottom:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <InlineStack>
                                                                            <div>
                                                                                <Thumbnail
                                                                                    source={
                                                                                        selectedProduct
                                                                                            ?.images[0]
                                                                                            ?.originalSrc ??
                                                                                        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                                                                                    }
                                                                                    alt={
                                                                                        selectedProduct?.title
                                                                                    }
                                                                                    size="large"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft:
                                                                                        "20px",
                                                                                }}
                                                                            >
                                                                                <div>
                                                                                    <Link url="#">
                                                                                        <Text
                                                                                            variant="headingMd"
                                                                                            as="h6"
                                                                                        >
                                                                                            {
                                                                                                selectedProduct?.title
                                                                                            }
                                                                                        </Text>
                                                                                    </Link>
                                                                                    {selectedProduct
                                                                                        ?.variants
                                                                                        ?.length >
                                                                                    1 ? (
                                                                                        <Text
                                                                                            variant="bodyLg"
                                                                                            as="p"
                                                                                        >
                                                                                            {t(
                                                                                                "digtal_product_listing.all_variants"
                                                                                            )}

                                                                                            (
                                                                                            {
                                                                                                selectedProduct
                                                                                                    .variants
                                                                                                    .length
                                                                                            }

                                                                                            )
                                                                                        </Text>
                                                                                    ) : (
                                                                                        selectedProduct.variants.map(
                                                                                            (
                                                                                                variant,
                                                                                                index
                                                                                            ) => (
                                                                                                <Text
                                                                                                    key={
                                                                                                        variant.id
                                                                                                    }
                                                                                                    variant="bodyLg"
                                                                                                    as="h6"
                                                                                                >
                                                                                                    {
                                                                                                        variant.title
                                                                                                    }
                                                                                                </Text>
                                                                                            )
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </InlineStack>
                                                                    </div>
                                                                    <div
                                                                        onClick={
                                                                            toggleProductPicker
                                                                        }
                                                                    >
                                                                        <Link url="#">
                                                                            <Text
                                                                                variant="bodyLg"
                                                                                as="p"
                                                                            >
                                                                                {t(
                                                                                    "createdigitalproduct.edit_product"
                                                                                )}
                                                                            </Text>
                                                                        </Link>
                                                                    </div>
                                                                </InlineGrid>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        flex: "78%",
                                                                    }}
                                                                >
                                                                    <TextField
                                                                        value={
                                                                            selectedProduct
                                                                                ? selectedProduct.title
                                                                                : ""
                                                                        }
                                                                        onFocus={
                                                                            toggleProductPicker
                                                                        }
                                                                        placeholder={t(
                                                                            "createdigitalproduct.search_shopify_products"
                                                                        )}
                                                                        fullWidth
                                                                        readOnly
                                                                    />
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        flex: "22%",
                                                                        marginLeft:
                                                                            "1rem",
                                                                    }}
                                                                >
                                                                    <Button
                                                                        onClick={
                                                                            toggleProductPicker
                                                                        }
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.browse_products"
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <Text
                                                                as={"p"}
                                                                variant={
                                                                    "bodyMd"
                                                                }
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.select_shopify_product_or_specific_product"
                                                                )}
                                                            </Text>
                                                        </div>
                                                    </BlockStack>
                                                </Card>
                                                {!isManualDeliveryEnabled && (
                                                    <Card>
                                                        <BlockStack gap="300">
                                                            <Text
                                                                variant="headingMd"
                                                                as="h6"
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.provide_the_following_content_to_the_customer"
                                                                )}
                                                            </Text>

                                                            {contentType &&
                                                                contentType.includes(
                                                                    "license"
                                                                ) && (
                                                                    <BlockStack gap="200">
                                                                        {newLicenses.length >
                                                                            0 && (
                                                                            <>
                                                                                {newLicenses.map(
                                                                                    (
                                                                                        license,
                                                                                        index
                                                                                    ) => {
                                                                                        return (
                                                                                            <div
                                                                                                style={{
                                                                                                    marginTop:
                                                                                                        "10px",
                                                                                                }}
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                            >
                                                                                                <Text
                                                                                                    variant="headingMd"
                                                                                                    as="h6"
                                                                                                >
                                                                                                    {t(
                                                                                                        "createdigitalproduct.license_keys_codes"
                                                                                                    )}
                                                                                                </Text>
                                                                                                <BlockStack spacing="tight">
                                                                                                    <Text
                                                                                                        variant="bodyLg"
                                                                                                        as="p"
                                                                                                    >
                                                                                                        {t(
                                                                                                            "createdigitalproduct.title"
                                                                                                        )}

                                                                                                        :{" "}
                                                                                                        {
                                                                                                            license.title
                                                                                                        }
                                                                                                    </Text>
                                                                                                    <Text
                                                                                                        variant="bodyLg"
                                                                                                        as="p"
                                                                                                    >
                                                                                                        {t(
                                                                                                            "createdigitalproduct.license_type"
                                                                                                        )}

                                                                                                        :{" "}
                                                                                                        {license.licenseType ===
                                                                                                        "automated"
                                                                                                            ? "Automated"
                                                                                                            : "Manual"}
                                                                                                    </Text>
                                                                                                    {license.licenseType ===
                                                                                                        "automated" && (
                                                                                                        <BlockStack gap="200">
                                                                                                            <InlineGrid columns="1fr auto">
                                                                                                                <Text
                                                                                                                    variant="bodyLg"
                                                                                                                    as="p"
                                                                                                                >
                                                                                                                    {t(
                                                                                                                        "createdigitalproduct.prefix"
                                                                                                                    )}

                                                                                                                    :{" "}
                                                                                                                    {
                                                                                                                        license.prefix
                                                                                                                    }

                                                                                                                    ,
                                                                                                                    {t(
                                                                                                                        "createdigitalproduct.code_length"
                                                                                                                    )}

                                                                                                                    :{" "}
                                                                                                                    {
                                                                                                                        license.codeLength
                                                                                                                    }

                                                                                                                    ,
                                                                                                                    {t(
                                                                                                                        "createdigitalproduct.suffix"
                                                                                                                    )}

                                                                                                                    :{" "}
                                                                                                                    {
                                                                                                                        license.suffix
                                                                                                                    }

                                                                                                                    ,
                                                                                                                    {t(
                                                                                                                        "createdigitalproduct.total_length"
                                                                                                                    )}

                                                                                                                    :{" "}
                                                                                                                    {
                                                                                                                        license.totalCodes
                                                                                                                    }
                                                                                                                </Text>
                                                                                                                <div>
                                                                                                                    <Button
                                                                                                                        icon={
                                                                                                                            <Icon
                                                                                                                                source={
                                                                                                                                    XSmallIcon
                                                                                                                                }
                                                                                                                            />
                                                                                                                        }
                                                                                                                        onClick={() =>
                                                                                                                            handleDeleteNewLicenseAtIndex(
                                                                                                                                index
                                                                                                                            )
                                                                                                                        }
                                                                                                                    ></Button>
                                                                                                                </div>
                                                                                                            </InlineGrid>
                                                                                                        </BlockStack>
                                                                                                    )}
                                                                                                    {license.licenseType ===
                                                                                                        "manual" && (
                                                                                                        <>
                                                                                                            {license.manual_codes_type ==
                                                                                                                "csv" &&
                                                                                                                license.licenseFiles &&
                                                                                                                license.licenseFiles.map(
                                                                                                                    (
                                                                                                                        file,
                                                                                                                        index
                                                                                                                    ) => (
                                                                                                                        <BlockStack
                                                                                                                            key={
                                                                                                                                index
                                                                                                                            }
                                                                                                                            gap="200"
                                                                                                                        >
                                                                                                                            <InlineGrid columns="1fr auto">
                                                                                                                                <div>
                                                                                                                                    <InlineStack>
                                                                                                                                        <Card>
                                                                                                                                            <BlockStack gap="300">
                                                                                                                                                <div
                                                                                                                                                    style={{
                                                                                                                                                        width: "24px",
                                                                                                                                                        height: "24px",
                                                                                                                                                    }}
                                                                                                                                                >
                                                                                                                                                    <svg
                                                                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                        viewBox="0 0 20 20"
                                                                                                                                                    >
                                                                                                                                                        <path
                                                                                                                                                            fillRule="evenodd"
                                                                                                                                                            d="M4.843 9.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.043 2.043 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.244 2.244 0 0 1 3.173 3.172l-2.286 2.286a.817.817 0 1 1-1.155-1.155l2.25-2.25a.75.75 0 1 0-1.06-1.061l-2.25 2.25a2.317 2.317 0 0 0 3.275 3.277l2.286-2.286a3.744 3.744 0 0 0-5.294-5.294l-5.015 5.015Z"
                                                                                                                                                        />
                                                                                                                                                    </svg>
                                                                                                                                                </div>
                                                                                                                                            </BlockStack>
                                                                                                                                        </Card>
                                                                                                                                        <div
                                                                                                                                            style={{
                                                                                                                                                marginLeft:
                                                                                                                                                    "20px",
                                                                                                                                            }}
                                                                                                                                        >
                                                                                                                                            <BlockStack gap="200">
                                                                                                                                                <Link
                                                                                                                                                    url="#"
                                                                                                                                                    target="_blank"
                                                                                                                                                    rel="noopener noreferrer"
                                                                                                                                                >
                                                                                                                                                    <Text
                                                                                                                                                        variant="bodyMd"
                                                                                                                                                        as="p"
                                                                                                                                                        fontWeight="bold"
                                                                                                                                                        color={
                                                                                                                                                            exceedMaxSizeForLicense
                                                                                                                                                                ? "critical"
                                                                                                                                                                : ""
                                                                                                                                                        }
                                                                                                                                                    >
                                                                                                                                                        {
                                                                                                                                                            file.name
                                                                                                                                                        }
                                                                                                                                                    </Text>
                                                                                                                                                </Link>
                                                                                                                                                <Text
                                                                                                                                                    variant="bodySm"
                                                                                                                                                    as="p"
                                                                                                                                                    color={
                                                                                                                                                        exceedMaxSizeForLicense
                                                                                                                                                            ? "critical"
                                                                                                                                                            : "subdued"
                                                                                                                                                    }
                                                                                                                                                >
                                                                                                                                                    {prettyBytes(
                                                                                                                                                        file.size
                                                                                                                                                    )}
                                                                                                                                                    {exceedMaxSizeForLicense &&
                                                                                                                                                        t(
                                                                                                                                                            "createdigitalproduct.file_too_big_it_will_be_ignored"
                                                                                                                                                        )}
                                                                                                                                                </Text>
                                                                                                                                            </BlockStack>
                                                                                                                                        </div>
                                                                                                                                    </InlineStack>
                                                                                                                                </div>
                                                                                                                                <div>
                                                                                                                                    <Button
                                                                                                                                        icon={
                                                                                                                                            <Icon
                                                                                                                                                source={
                                                                                                                                                    XSmallIcon
                                                                                                                                                }
                                                                                                                                            />
                                                                                                                                        }
                                                                                                                                        onClick={() =>
                                                                                                                                            handleDeleteNewLicenseAtIndex(
                                                                                                                                                index
                                                                                                                                            )
                                                                                                                                        }
                                                                                                                                    />
                                                                                                                                </div>
                                                                                                                            </InlineGrid>
                                                                                                                        </BlockStack>
                                                                                                                    )
                                                                                                                )}

                                                                                                            {license.manual_codes_type ==
                                                                                                                "paste_text" && (
                                                                                                                <BlockStack
                                                                                                                    key={
                                                                                                                        index
                                                                                                                    }
                                                                                                                    gap="200"
                                                                                                                >
                                                                                                                    <InlineGrid columns="1fr auto">
                                                                                                                        <div>
                                                                                                                            <Text
                                                                                                                                variant="bodyLg"
                                                                                                                                as="p"
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.paste_keys_codes"
                                                                                                                                )}

                                                                                                                                :{" "}
                                                                                                                                {
                                                                                                                                    license.pasteKeysValue
                                                                                                                                }
                                                                                                                            </Text>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <Button
                                                                                                                                icon={
                                                                                                                                    <Icon
                                                                                                                                        source={
                                                                                                                                            XSmallIcon
                                                                                                                                        }
                                                                                                                                    />
                                                                                                                                }
                                                                                                                                onClick={() =>
                                                                                                                                    handleDeleteNewLicenseAtIndex(
                                                                                                                                        index
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    </InlineGrid>
                                                                                                                </BlockStack>
                                                                                                            )}
                                                                                                        </>
                                                                                                    )}
                                                                                                </BlockStack>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </>
                                                                        )}
                                                                        <>
                                                                            {selectedLicenseIds.map(
                                                                                (
                                                                                    selectedLicenseId,
                                                                                    index
                                                                                ) => {
                                                                                    const selectedLicense =
                                                                                        allLicenses.find(
                                                                                            (
                                                                                                license
                                                                                            ) =>
                                                                                                license.id ===
                                                                                                selectedLicenseId
                                                                                        );
                                                                                    if (
                                                                                        !selectedLicense
                                                                                    )
                                                                                        return null;

                                                                                    return (
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop:
                                                                                                    "10px",
                                                                                            }}
                                                                                            key={
                                                                                                selectedLicense.id
                                                                                            }
                                                                                        >
                                                                                            <Text
                                                                                                variant="headingMd"
                                                                                                as="h6"
                                                                                            >
                                                                                                {t(
                                                                                                    "createdigitalproduct.license_keys_codes"
                                                                                                )}
                                                                                            </Text>
                                                                                            <BlockStack spacing="tight">
                                                                                                <Text
                                                                                                    variant="bodyLg"
                                                                                                    as="p"
                                                                                                >
                                                                                                    {t(
                                                                                                        "createdigitalproduct.title"
                                                                                                    )}

                                                                                                    :{" "}
                                                                                                    {
                                                                                                        selectedLicense.title
                                                                                                    }
                                                                                                </Text>
                                                                                                <Text
                                                                                                    variant="bodyLg"
                                                                                                    as="p"
                                                                                                >
                                                                                                    {t(
                                                                                                        "digtal_product_listing.active"
                                                                                                    )}

                                                                                                    :{" "}
                                                                                                    {selectedLicense.license_type ===
                                                                                                    "automated"
                                                                                                        ? "Automated"
                                                                                                        : "Manual"}
                                                                                                </Text>
                                                                                                <Text
                                                                                                    variant="bodyLg"
                                                                                                    as="p"
                                                                                                >
                                                                                                    {t(
                                                                                                        "createdigitalproduct.codes_remaining"
                                                                                                    )}

                                                                                                    :{" "}
                                                                                                    {
                                                                                                        selectedLicense.codes_remaining
                                                                                                    }
                                                                                                </Text>
                                                                                                {selectedLicense.license_type ===
                                                                                                    "automated" && (
                                                                                                    <BlockStack gap="200">
                                                                                                        <InlineGrid columns="1fr auto">
                                                                                                            <Text
                                                                                                                variant="bodyLg"
                                                                                                                as="p"
                                                                                                            >
                                                                                                                {t(
                                                                                                                    "createdigitalproduct.prefix"
                                                                                                                )}

                                                                                                                :{" "}
                                                                                                                {
                                                                                                                    selectedLicense.prefix
                                                                                                                }

                                                                                                                ,
                                                                                                                {t(
                                                                                                                    "createdigitalproduct.code_length"
                                                                                                                )}

                                                                                                                :{" "}
                                                                                                                {
                                                                                                                    selectedLicense.code_length
                                                                                                                }

                                                                                                                ,
                                                                                                                {t(
                                                                                                                    "createdigitalproduct.suffix"
                                                                                                                )}

                                                                                                                :{" "}
                                                                                                                {
                                                                                                                    selectedLicense.suffix
                                                                                                                }

                                                                                                                ,
                                                                                                                {t(
                                                                                                                    "createdigitalproduct.total_length"
                                                                                                                )}{" "}
                                                                                                                {
                                                                                                                    selectedLicense.total_codes
                                                                                                                }
                                                                                                            </Text>
                                                                                                            <div>
                                                                                                                <Button
                                                                                                                    icon={
                                                                                                                        <Icon
                                                                                                                            source={
                                                                                                                                XSmallIcon
                                                                                                                            }
                                                                                                                        />
                                                                                                                    }
                                                                                                                    onClick={() =>
                                                                                                                        handleDeleteExistingLicenseAtIndex(
                                                                                                                            index
                                                                                                                        )
                                                                                                                    }
                                                                                                                ></Button>
                                                                                                            </div>
                                                                                                        </InlineGrid>
                                                                                                    </BlockStack>
                                                                                                )}
                                                                                                {selectedLicense.license_type ===
                                                                                                    "manual" && (
                                                                                                    <>
                                                                                                        {selectedLicense.manual_codes_type ==
                                                                                                            "csv" &&
                                                                                                            selectedLicense.file && (
                                                                                                                <BlockStack gap="200">
                                                                                                                    <InlineGrid columns="1fr auto">
                                                                                                                        <div>
                                                                                                                            <InlineStack>
                                                                                                                                <Card>
                                                                                                                                    <BlockStack gap="300">
                                                                                                                                        <div
                                                                                                                                            style={{
                                                                                                                                                width: "24px",
                                                                                                                                                height: "24px",
                                                                                                                                            }}
                                                                                                                                        >
                                                                                                                                            <svg
                                                                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                viewBox="0 0 20 20"
                                                                                                                                            >
                                                                                                                                                <path
                                                                                                                                                    fillRule="evenodd"
                                                                                                                                                    d="M4.843 9.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.043 2.043 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.244 2.244 0 0 1 3.173 3.172l-2.286 2.286a.817.817 0 1 1-1.155-1.155l2.25-2.25a.75.75 0 1 0-1.06-1.061l-2.25 2.25a2.317 2.317 0 0 0 3.275 3.277l2.286-2.286a3.744 3.744 0 0 0-5.294-5.294l-5.015 5.015Z"
                                                                                                                                                />
                                                                                                                                            </svg>
                                                                                                                                        </div>
                                                                                                                                    </BlockStack>
                                                                                                                                </Card>
                                                                                                                                <div
                                                                                                                                    style={{
                                                                                                                                        marginLeft:
                                                                                                                                            "20px",
                                                                                                                                    }}
                                                                                                                                >
                                                                                                                                    <BlockStack gap="200">
                                                                                                                                        <Link
                                                                                                                                            url={
                                                                                                                                                JSON.parse(
                                                                                                                                                    selectedLicense.file
                                                                                                                                                )
                                                                                                                                                    .url ||
                                                                                                                                                "#"
                                                                                                                                            }
                                                                                                                                            target="_blank"
                                                                                                                                            rel="noopener noreferrer"
                                                                                                                                        >
                                                                                                                                            <Text
                                                                                                                                                variant="bodyMd"
                                                                                                                                                as="p"
                                                                                                                                                fontWeight="bold"
                                                                                                                                                color={
                                                                                                                                                    exceedMaxSizeForLicense
                                                                                                                                                        ? "critical"
                                                                                                                                                        : ""
                                                                                                                                                }
                                                                                                                                            >
                                                                                                                                                {
                                                                                                                                                    JSON.parse(
                                                                                                                                                        selectedLicense.file
                                                                                                                                                    )
                                                                                                                                                        .name
                                                                                                                                                }
                                                                                                                                            </Text>
                                                                                                                                        </Link>
                                                                                                                                        <Text
                                                                                                                                            variant="bodySm"
                                                                                                                                            as="p"
                                                                                                                                            color={
                                                                                                                                                exceedMaxSizeForLicense
                                                                                                                                                    ? "critical"
                                                                                                                                                    : "subdued"
                                                                                                                                            }
                                                                                                                                        >
                                                                                                                                            {prettyBytes(
                                                                                                                                                JSON.parse(
                                                                                                                                                    selectedLicense.file
                                                                                                                                                )
                                                                                                                                                    .size
                                                                                                                                            )}
                                                                                                                                            {exceedMaxSizeForLicense &&
                                                                                                                                                t(
                                                                                                                                                    "createdigitalproduct.file_too_big_it_will_be_ignored"
                                                                                                                                                )}
                                                                                                                                        </Text>
                                                                                                                                    </BlockStack>
                                                                                                                                </div>
                                                                                                                            </InlineStack>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <Button
                                                                                                                                icon={
                                                                                                                                    <Icon
                                                                                                                                        source={
                                                                                                                                            XSmallIcon
                                                                                                                                        }
                                                                                                                                    />
                                                                                                                                }
                                                                                                                                onClick={() =>
                                                                                                                                    handleDeleteExistingLicenseAtIndex(
                                                                                                                                        index
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    </InlineGrid>
                                                                                                                </BlockStack>
                                                                                                            )}

                                                                                                        {selectedLicense.manual_codes_type ==
                                                                                                            "paste_text" && (
                                                                                                            <BlockStack gap="200">
                                                                                                                <InlineGrid columns="1fr auto">
                                                                                                                    <div>
                                                                                                                        <Text
                                                                                                                            variant="bodyLg"
                                                                                                                            as="p"
                                                                                                                        >
                                                                                                                            {t(
                                                                                                                                "createdigitalproduct.paste_keys_codes"
                                                                                                                            )}

                                                                                                                            :{" "}
                                                                                                                            {
                                                                                                                                selectedLicense.codes_text
                                                                                                                            }
                                                                                                                        </Text>
                                                                                                                    </div>
                                                                                                                    <div>
                                                                                                                        <Button
                                                                                                                            icon={
                                                                                                                                <Icon
                                                                                                                                    source={
                                                                                                                                        XSmallIcon
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            }
                                                                                                                            onClick={() =>
                                                                                                                                handleDeleteExistingLicenseAtIndex(
                                                                                                                                    index
                                                                                                                                )
                                                                                                                            }
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </InlineGrid>
                                                                                                            </BlockStack>
                                                                                                        )}
                                                                                                    </>
                                                                                                )}
                                                                                            </BlockStack>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </>
                                                                    </BlockStack>
                                                                )}

                                                            {selectedProduct ? (
                                                                <div>
                                                                    <Card>
                                                                        <div
                                                                            style={{
                                                                                marginLeft:
                                                                                    "23px",
                                                                                marginRight:
                                                                                    "23px",
                                                                                marginTop:
                                                                                    "5px",
                                                                            }}
                                                                        >
                                                                            <TextField
                                                                                label={t(
                                                                                    "createdigitalproduct.title"
                                                                                )}
                                                                                value={
                                                                                    licenseTitle
                                                                                }
                                                                                onChange={
                                                                                    handleLicenseTitleChange
                                                                                }
                                                                                autoComplete="off"
                                                                            />
                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "30px",
                                                                                }}
                                                                            >
                                                                                <Text
                                                                                    variant="headingMd"
                                                                                    as="h6"
                                                                                >
                                                                                    {t(
                                                                                        "createdigitalproduct.license_keys_codes_type"
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
                                                                                            value ===
                                                                                            "automated"
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
                                                                                        checked={
                                                                                            value ===
                                                                                            "manual"
                                                                                        }
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
                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "15px",
                                                                                }}
                                                                            >
                                                                                <Divider />
                                                                            </div>
                                                                            {value ===
                                                                                "automated" && (
                                                                                <div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "15px",
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
                                                                                            marginTop:
                                                                                                "15px",
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
                                                                                                marginTop:
                                                                                                    "10px",
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
                                                                                                        value={
                                                                                                            codeLength
                                                                                                        }
                                                                                                        onChange={
                                                                                                            handleCodeLengthChange
                                                                                                        }
                                                                                                        min={1}
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
                                                                                                marginTop:
                                                                                                    "10px",
                                                                                            }}
                                                                                        >
                                                                                            <Text
                                                                                                variant="bodyLg"
                                                                                                as="p"
                                                                                            >
                                                                                                {t(
                                                                                                    "createdigitalproduct.your_license_keys_will_appear_as"
                                                                                                )}
                                                                                                <Text
                                                                                                    variant="bodyLg"
                                                                                                    as="span"
                                                                                                    fontWeight="bold"
                                                                                                    style={{
                                                                                                        fontFamily: "monospace",
                                                                                                        backgroundColor: "#f0f0f0",
                                                                                                        padding: "4px 8px",
                                                                                                        borderRadius: "4px",
                                                                                                        marginLeft: "8px",
                                                                                                    }}
                                                                                                >
                                                                                                    {licensePreview}
                                                                                                </Text>
                                                                                            </Text>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {value ===
                                                                                "manual" && (
                                                                                <>
                                                                                    <Tabs
                                                                                        tabs={
                                                                                            manualLicenseTabs
                                                                                        }
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
                                                                                                                "createdigitalproduct.upload_csv"
                                                                                                            )}
                                                                                                            onDrop={
                                                                                                                handleLicenseDropZoneDrop
                                                                                                            }
                                                                                                            accept=".csv"
                                                                                                            allowMultiple={
                                                                                                                false
                                                                                                            }
                                                                                                        >
                                                                                                            <DropZone.FileUpload
                                                                                                                actionTitle={t(
                                                                                                                    "digtal_product_listing.add_files"
                                                                                                                )}
                                                                                                            />
                                                                                                        </DropZone>

                                                                                                        {attachedLicenseFile && (
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
                                                                                                                                attachedLicenseFile.name
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
                                                                                                                                attachedLicenseFile.size
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
                                                                                                            "10px",
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
                                                                                                    multiline={
                                                                                                        4
                                                                                                    }
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
                                                                                            marginTop:
                                                                                                "0px",
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
                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "0px",
                                                                                }}
                                                                            >
                                                                                <Checkbox
                                                                                    label={t(
                                                                                        "createdigitalproduct.deliver_as_qr_code"
                                                                                    )}
                                                                                    checked={
                                                                                        qrCodeEnabled
                                                                                    }
                                                                                    onChange={
                                                                                        handleQRCode
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "0px",
                                                                                }}
                                                                            >
                                                                                <Checkbox
                                                                                    label={t("createdigitalproduct.deliver_as_gift_card_send_key_code_to_gift_recipient")}
                                                                                    checked={
                                                                                        giftCardEnabled
                                                                                    }
                                                                                    onChange={
                                                                                        handleGiftCardEnabled
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            {qrCodeEnabled && (
                                                                                <div
                                                                                    style={{
                                                                                        marginTop:
                                                                                            "0px",
                                                                                    }}
                                                                                >
                                                                                    <Checkbox
                                                                                        label={t(
                                                                                            "createdigitalproduct.print_qr_code_on_pdf"
                                                                                        )}
                                                                                        checked={
                                                                                            qrCodePrintOnPDF
                                                                                        }
                                                                                        onChange={
                                                                                            handleQRCodePrintOnPDF
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                            {giftCardEnabled && (
                                                                                <>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("createdigitalproduct.email_property_name")}
                                                                                            value={
                                                                                                giftCardPropertyName
                                                                                            }
                                                                                            onChange={
                                                                                                handleGiftCardPropertyNameChange
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("createdigitalproduct.enter_email_property_name")}
                                                                                            helpText={t("createdigitalproduct.specify_property_name_email_address")}
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "10px",
                                                                                        }}
                                                                                    >
                                                                                        <TextField
                                                                                            label={t("createdigitalproduct.delivery_time_property_name")}
                                                                                            value={
                                                                                                giftDeliveryPropertyName
                                                                                            }
                                                                                            onChange={
                                                                                                handleGiftDeliveryPropertyNameChange
                                                                                            }
                                                                                            autoComplete="off"
                                                                                            placeholder={t("createdigitalproduct.enter_gift_delivery_property_name")}
                                                                                            helpText={t("createdigitalproduct.specify_property_name_datetime_picker")}
                                                                                        />
                                                                                    </div>
                                                                                </>
                                                                            )}

                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "20px",
                                                                                }}
                                                                            >
                                                                                <TextField
                                                                                    label={t(
                                                                                        "createdigitalproduct.deliver_no_of_keys_codes_per_unit"
                                                                                    )}
                                                                                    value={
                                                                                        perUnitNoDelivery ||
                                                                                        1
                                                                                    }
                                                                                    onChange={
                                                                                        handlePerUnitNoDeliveryChange
                                                                                    }
                                                                                    autoComplete="off"
                                                                                    type="number"
                                                                                    placeholder="1"
                                                                                    min="1"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <Text
                                                                        variant="bodyLg"
                                                                        as="p"
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.add_shopify_product_to_attached_content"
                                                                        )}
                                                                    </Text>
                                                                </div>
                                                            )}
                                                        </BlockStack>
                                                    </Card>
                                                )}

                                            </BlockStack>
                                        </div>
                                    )}

                                    {selectedProductType === "pdf" && (
                                        <div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: isMobile
                                                        ? "column"
                                                        : "row",
                                                    gap: "16px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: isMobile
                                                            ? "100%"
                                                            : "64%",
                                                    }}
                                                >
                                                    <BlockStack gap="400">
                                                        <Card>
                                                            <BlockStack gap="300">
                                                                <Text
                                                                    variant="headingMd"
                                                                    as="h6"
                                                                >
                                                                    {t(
                                                                        "createdigitalproduct.when_this_shopify_product_is_purchased"
                                                                    )}
                                                                </Text>
                                                                {selectedProduct ? (
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        <InlineGrid
                                                                            columns="1fr auto"
                                                                            style={{
                                                                                marginBottom:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <InlineStack>
                                                                                    <div>
                                                                                        <Thumbnail
                                                                                            source={
                                                                                                selectedProduct
                                                                                                    .images[0]
                                                                                                    ?.originalSrc ??
                                                                                                "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                                                                                            }
                                                                                            alt={
                                                                                                selectedProduct.title
                                                                                            }
                                                                                            size="large"
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            marginLeft:
                                                                                                "20px",
                                                                                        }}
                                                                                    >
                                                                                        <div>
                                                                                            <Link url="#">
                                                                                                <Text
                                                                                                    variant="headingMd"
                                                                                                    as="h6"
                                                                                                >
                                                                                                    {
                                                                                                        selectedProduct.title
                                                                                                    }
                                                                                                </Text>
                                                                                            </Link>
                                                                                            {selectedProduct
                                                                                                .variants
                                                                                                .length >
                                                                                            1 ? (
                                                                                                <Text
                                                                                                    variant="bodyLg"
                                                                                                    as="p"
                                                                                                >
                                                                                                    {t(
                                                                                                        "digtal_product_listing.all_variants"
                                                                                                    )}

                                                                                                    (
                                                                                                    {
                                                                                                        selectedProduct
                                                                                                            .variants
                                                                                                            .length
                                                                                                    }

                                                                                                    )
                                                                                                </Text>
                                                                                            ) : (
                                                                                                selectedProduct.variants.map(
                                                                                                    (
                                                                                                        variant,
                                                                                                        index
                                                                                                    ) => (
                                                                                                        <Text
                                                                                                            key={
                                                                                                                variant.id
                                                                                                            }
                                                                                                            variant="bodyLg"
                                                                                                            as="h6"
                                                                                                        >
                                                                                                            {
                                                                                                                variant.title
                                                                                                            }
                                                                                                        </Text>
                                                                                                    )
                                                                                                )
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </InlineStack>
                                                                            </div>
                                                                            <div
                                                                                onClick={
                                                                                    toggleProductPicker
                                                                                }
                                                                            >
                                                                                <Link url="#">
                                                                                    <Text
                                                                                        variant="bodyLg"
                                                                                        as="p"
                                                                                    >
                                                                                        {t(
                                                                                            "createdigitalproduct.edit_product"
                                                                                        )}
                                                                                    </Text>
                                                                                </Link>
                                                                            </div>
                                                                        </InlineGrid>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        style={{
                                                                            display:
                                                                                "flex",
                                                                            alignItems:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                flex: "78%",
                                                                            }}
                                                                        >
                                                                            <TextField
                                                                                value={
                                                                                    selectedProduct
                                                                                        ? selectedProduct.title
                                                                                        : ""
                                                                                }
                                                                                onFocus={
                                                                                    toggleProductPicker
                                                                                }
                                                                                placeholder={t(
                                                                                    "createdigitalproduct.search_shopify_products"
                                                                                )}
                                                                                fullWidth
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                flex: "22%",
                                                                                marginLeft:
                                                                                    "1rem",
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                onClick={
                                                                                    toggleProductPicker
                                                                                }
                                                                            >
                                                                                {t(
                                                                                    "createdigitalproduct.browse_products"
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <Text
                                                                        as={"p"}
                                                                        variant={
                                                                            "bodyMd"
                                                                        }
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.select_shopify_product_or_specific_product"
                                                                        )}
                                                                    </Text>
                                                                </div>
                                                            </BlockStack>
                                                        </Card>
                                                        {!isManualDeliveryEnabled && (
                                                            <Card>
                                                                <BlockStack gap="300">
                                                                    <Text
                                                                        variant="headingMd"
                                                                        as="h6"
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.provide_the_following_content_to_the_customer"
                                                                        )}
                                                                    </Text>

                                                                    {contentType &&
                                                                        contentType.includes(
                                                                            "files"
                                                                        ) && (
                                                                            <BlockStack gap="200">
                                                                                {files.length >
                                                                                    0 &&
                                                                                    files.map(
                                                                                        (
                                                                                            file,
                                                                                            index
                                                                                        ) => {
                                                                                            const exceedMaxSize =
                                                                                                file.size >
                                                                                                fileSizeLimit;

                                                                                            return (
                                                                                                <InlineGrid columns="1fr auto">
                                                                                                    <div>
                                                                                                        <InlineStack>
                                                                                                            <div>
                                                                                                                <Card>
                                                                                                                    <BlockStack gap="300">
                                                                                                                        <div
                                                                                                                            style={{
                                                                                                                                width: "24px",
                                                                                                                                height: "24px",
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
                                                                                                                    </BlockStack>
                                                                                                                </Card>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    marginLeft:
                                                                                                                        "20px",
                                                                                                                }}
                                                                                                            >
                                                                                                                <div>
                                                                                                                    <BlockStack gap="200">
                                                                                                                        <Link url="#">
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
                                                                                                                                {
                                                                                                                                    file.name
                                                                                                                                }
                                                                                                                            </Text>
                                                                                                                        </Link>
                                                                                                                        <Text
                                                                                                                            variant="bodySm"
                                                                                                                            as="p"
                                                                                                                            color={
                                                                                                                                exceedMaxSize
                                                                                                                                    ? "critical"
                                                                                                                                    : "subdued"
                                                                                                                            }
                                                                                                                        >
                                                                                                                            {file.type.toUpperCase()}{" "}
                                                                                                                            -{" "}
                                                                                                                            {prettyBytes(
                                                                                                                                file.size
                                                                                                                            )}
                                                                                                                            {exceedMaxSize &&
                                                                                                                                t(
                                                                                                                                    "createdigitalproduct.file_too_big_it_will_be_ignored"
                                                                                                                                )}
                                                                                                                        </Text>
                                                                                                                    </BlockStack>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </InlineStack>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <Button
                                                                                                            icon={
                                                                                                                <Icon
                                                                                                                    source={
                                                                                                                        XSmallIcon
                                                                                                                    }
                                                                                                                />
                                                                                                            }
                                                                                                            onClick={() =>
                                                                                                                handleDeleteFileAtIndex(
                                                                                                                    index,
                                                                                                                    "files"
                                                                                                                )
                                                                                                            }
                                                                                                        ></Button>
                                                                                                    </div>
                                                                                                </InlineGrid>
                                                                                            );
                                                                                        }
                                                                                    )}

                                                                                {googleDriveLink && (
                                                                                    <InlineGrid columns="1fr auto">
                                                                                        <div>
                                                                                            <InlineStack>
                                                                                                <div>
                                                                                                    <Card>
                                                                                                        <BlockStack gap="300">
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    width: "24px",
                                                                                                                    height: "24px",
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
                                                                                                        </BlockStack>
                                                                                                    </Card>
                                                                                                </div>
                                                                                                <div
                                                                                                    style={{
                                                                                                        marginLeft:
                                                                                                            "20px",
                                                                                                    }}
                                                                                                >
                                                                                                    <BlockStack gap="200">
                                                                                                        <Link
                                                                                                            url={
                                                                                                                googleDriveLink
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                googleDriveLink
                                                                                                            }
                                                                                                        </Link>
                                                                                                    </BlockStack>
                                                                                                </div>
                                                                                            </InlineStack>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Button
                                                                                                icon={
                                                                                                    <Icon
                                                                                                        source={
                                                                                                            XSmallIcon
                                                                                                        }
                                                                                                    />
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    handleDeleteFileAtIndex(
                                                                                                        null,
                                                                                                        "googleDrive"
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                Delete
                                                                                            </Button>
                                                                                        </div>
                                                                                    </InlineGrid>
                                                                                )}

                                                                                <div>
                                                                                    {selectedFileDetails
                                                                                        .filter(
                                                                                            (
                                                                                                file
                                                                                            ) =>
                                                                                                file.url
                                                                                        )
                                                                                        .map(
                                                                                            (
                                                                                                file,
                                                                                                index
                                                                                            ) => {
                                                                                                const isSelected =
                                                                                                    selectedFileIds.includes(
                                                                                                        file.id
                                                                                                    );

                                                                                                return (
                                                                                                    <InlineGrid columns="1fr auto">
                                                                                                        <div>
                                                                                                            <InlineStack>
                                                                                                                <div>
                                                                                                                    <Card>
                                                                                                                        <BlockStack gap="300">
                                                                                                                            <div
                                                                                                                                style={{
                                                                                                                                    width: "24px",
                                                                                                                                    height: "24px",
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
                                                                                                                        </BlockStack>
                                                                                                                    </Card>
                                                                                                                </div>
                                                                                                                <div
                                                                                                                    style={{
                                                                                                                        marginLeft:
                                                                                                                            "20px",
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <div>
                                                                                                                        <BlockStack gap="200">
                                                                                                                            <Link url="#">
                                                                                                                                <Text
                                                                                                                                    variant="bodyMd"
                                                                                                                                    as="p"
                                                                                                                                    fontWeight="bold"
                                                                                                                                    color={
                                                                                                                                        isSelected
                                                                                                                                            ? "critical"
                                                                                                                                            : ""
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    {
                                                                                                                                        file.fileName
                                                                                                                                    }
                                                                                                                                </Text>
                                                                                                                            </Link>
                                                                                                                            <Text
                                                                                                                                variant="bodySm"
                                                                                                                                as="p"
                                                                                                                                color={
                                                                                                                                    isSelected
                                                                                                                                        ? "critical"
                                                                                                                                        : "subdued"
                                                                                                                                }
                                                                                                                            >
                                                                                                                                {file.mimeType.toUpperCase()}{" "}
                                                                                                                                -{" "}
                                                                                                                                {prettyBytes(
                                                                                                                                    file.byteSize
                                                                                                                                )}
                                                                                                                            </Text>
                                                                                                                        </BlockStack>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </InlineStack>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <Button
                                                                                                                icon={
                                                                                                                    <Icon
                                                                                                                        source={
                                                                                                                            XSmallIcon
                                                                                                                        }
                                                                                                                    />
                                                                                                                }
                                                                                                                onClick={() =>
                                                                                                                    handleDeleteFileAtIndex(
                                                                                                                        index,
                                                                                                                        "orders"
                                                                                                                    )
                                                                                                                }
                                                                                                            ></Button>
                                                                                                        </div>
                                                                                                    </InlineGrid>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </div>

                                                                                {saving && (
                                                                                    <div>
                                                                                        <Text
                                                                                            as={
                                                                                                "h5"
                                                                                            }
                                                                                        >
                                                                                            {t(
                                                                                                "createdigitalproduct.files_are_uploading_please_wait"
                                                                                            )}
                                                                                        </Text>
                                                                                        <ProgressBar
                                                                                            progress={
                                                                                                progress
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </BlockStack>
                                                                        )}

                                                                    {selectedProduct ? (
                                                                        <div>
                                                                            <Card>
                                                                                <Tabs
                                                                                    tabs={
                                                                                        mainTabs
                                                                                    }
                                                                                    selected={
                                                                                        selectedMainTab
                                                                                    }
                                                                                    onSelect={
                                                                                        handleTabChange
                                                                                    }
                                                                                >
                                                                                    {selectedMainTab ===
                                                                                        0 && (
                                                                                        <BlockStack gap="400">
                                                                                            <DropZone
                                                                                                label={
                                                                                                    fileLabelText
                                                                                                }
                                                                                                onDrop={
                                                                                                    handleDropZoneDrop
                                                                                                }
                                                                                            >
                                                                                                <DropZone.FileUpload
                                                                                                    actionTitle={t(
                                                                                                        "digtal_product_listing.add_files"
                                                                                                    )}
                                                                                                />
                                                                                            </DropZone>

                                                                                            {files.length >
                                                                                                0 && (
                                                                                                <BlockStack gap="200">
                                                                                                    {files.map(
                                                                                                        (
                                                                                                            file,
                                                                                                            index
                                                                                                        ) => {
                                                                                                            const exceedMaxSize =
                                                                                                                file.size >
                                                                                                                fileSizeLimit;

                                                                                                            return (
                                                                                                                <InlineStack
                                                                                                                    key={
                                                                                                                        index
                                                                                                                    }
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
                                                                                                                        onClick={() =>
                                                                                                                            handleDeleteFileAtIndex(
                                                                                                                                index,
                                                                                                                                "files"
                                                                                                                            )
                                                                                                                        }
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
                                                                                                                            {
                                                                                                                                file.name
                                                                                                                            }
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
                                                                                                        }
                                                                                                    )}
                                                                                                </BlockStack>
                                                                                            )}
                                                                                        </BlockStack>
                                                                                    )}
                                                                                    {selectedMainTab ===
                                                                                        1 && (
                                                                                        <>
                                                                                            <div
                                                                                                style={{
                                                                                                    padding:
                                                                                                        "16px",
                                                                                                }}
                                                                                            >
                                                                                                <TextField
                                                                                                    label={t(
                                                                                                        "createdigitalproduct.google_drive_file_folder_link"
                                                                                                    )}
                                                                                                    value={
                                                                                                        googleDriveLink
                                                                                                    }
                                                                                                    onChange={
                                                                                                        handleGoogleDriveLinkChange
                                                                                                    }
                                                                                                    placeholder={t("createdigitalproduct.enter_google_drive_file_or_folder_link")}
                                                                                                />
                                                                                                <div
                                                                                                    style={{
                                                                                                        marginTop:
                                                                                                            "5px",
                                                                                                    }}
                                                                                                ></div>
                                                                                                <Text
                                                                                                    variant="bodySm"
                                                                                                    tone="subdued"
                                                                                                    style={{
                                                                                                        marginTop:
                                                                                                            "8px",
                                                                                                    }}
                                                                                                >
                                                                                                    {t(
                                                                                                        "createdigitalproduct.google_drive_help_text"
                                                                                                    )}
                                                                                                </Text>
                                                                                            </div>
                                                                                        </>
                                                                                    )}
                                                                                </Tabs>
                                                                            </Card>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <Text
                                                                                variant="bodyLg"
                                                                                as="p"
                                                                            >
                                                                                {t(
                                                                                    "createdigitalproduct.add_shopify_product_to_attached_content"
                                                                                )}
                                                                            </Text>
                                                                        </div>
                                                                    )}
                                                                </BlockStack>
                                                            </Card>
                                                        )}

                                                    </BlockStack>
                                                </div>

                                                <div
                                                    style={{
                                                        width: isMobile
                                                            ? "100%"
                                                            : "34%",
                                                    }}
                                                >
                                                    <BlockStack gap="400">
                                                        <Card>
                                                            {userPlan ===
                                                                "free" && (
                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <Banner
                                                                        tone="warning"
                                                                        title={t(
                                                                            "editdigitalproduct.upgrade_your_plan"
                                                                        )}
                                                                    >
                                                                        <Text
                                                                            variant="bodyMd"
                                                                            as="p"
                                                                        >
                                                                            {t(
                                                                                "createdigitalproduct.upgrade_to_paid_plan_to_enable_advanced_features_like_pdf_stamping"
                                                                            )}
                                                                        </Text>
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "5px",
                                                                            }}
                                                                        ></div>
                                                                        <Button
                                                                            variant="primary"
                                                                            onClick={
                                                                                handlePricing
                                                                            }
                                                                        >
                                                                            {t(
                                                                                "createdigitalproduct.upgrade_now"
                                                                            )}
                                                                        </Button>
                                                                    </Banner>
                                                                </div>
                                                            )}
                                                            <Text
                                                                variant="headingMd"
                                                                as="h6"
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.pdf_stamping_settings"
                                                                )}
                                                            </Text>
                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "10px",
                                                                }}
                                                            ></div>
                                                            <Checkbox
                                                                label={t(
                                                                    "createdigitalproduct.enable_pdf_stamping"
                                                                )}
                                                                checked={
                                                                    isPdfStampingEnabled
                                                                }
                                                                onChange={
                                                                    handlePdfStampingEnabledChange
                                                                }
                                                                disabled={
                                                                    userPlan ===
                                                                    "free"
                                                                }
                                                            />
                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "5px",
                                                                }}
                                                            ></div>
                                                            {isPdfStampingEnabled && (
                                                                <LegacyStack
                                                                    vertical
                                                                >
                                                                    <RadioButton
                                                                        label={t(
                                                                            "createdigitalproduct.use_default_template"
                                                                        )}
                                                                        id="default-template"
                                                                        name="template"
                                                                        checked={
                                                                            templateChoice ===
                                                                            "default"
                                                                        }
                                                                        onChange={() =>
                                                                            handleTemplateChoiceChange(
                                                                                "default"
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            userPlan ===
                                                                            "free"
                                                                        }
                                                                    />
                                                                    <RadioButton
                                                                        label={t(
                                                                            "createdigitalproduct.use_custom_template"
                                                                        )}
                                                                        id="custom-template"
                                                                        name="template"
                                                                        checked={
                                                                            templateChoice ===
                                                                            "custom"
                                                                        }
                                                                        onChange={() =>
                                                                            handleTemplateChoiceChange(
                                                                                "custom"
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            userPlan ===
                                                                            "free"
                                                                        }
                                                                    />
                                                                    {templateChoice ===
                                                                        "custom" && (
                                                                        <>
                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "10px",
                                                                                }}
                                                                            >
                                                                                <Button
                                                                                    variant="primary"
                                                                                    onClick={
                                                                                        toggleCustomTemplateModal
                                                                                    }
                                                                                >
                                                                                    {t(
                                                                                        "createdigitalproduct.add_custom_template"
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "10px",
                                                                                }}
                                                                            ></div>
                                                                            <Select
                                                                                label={t(
                                                                                    "createdigitalproduct.select_a_pdf_template"
                                                                                )}
                                                                                options={
                                                                                    templateOptions
                                                                                }
                                                                                value={String(
                                                                                    selectedTemplate
                                                                                )}
                                                                                onChange={
                                                                                    handleTemplateChange
                                                                                }
                                                                            />
                                                                        </>
                                                                    )}
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            variant="bodySm"
                                                                            as="p"
                                                                            color="subdued"
                                                                        >
                                                                            {t(
                                                                                "createdigitalproduct.choose_whether_to_use_the_default_template_or_add"
                                                                            )}
                                                                        </Text>
                                                                    </div>
                                                                </LegacyStack>
                                                            )}
                                                            <Modal
                                                                size="large"
                                                                open={
                                                                    isPDFModalOpen
                                                                }
                                                                onClose={
                                                                    toggleCustomTemplateModal
                                                                }
                                                                title={t(
                                                                    "createdigitalproduct.pdf_stamping_template"
                                                                )}
                                                                primaryAction={{
                                                                    content: t(
                                                                        "createdigitalproduct.add"
                                                                    ),
                                                                    onAction:
                                                                        handleSaveTemplate,
                                                                    disabled:
                                                                        templateTitle.trim() ===
                                                                            "" ||
                                                                        stampText.trim() ===
                                                                            "",
                                                                }}
                                                                secondaryActions={[
                                                                    {
                                                                        content:
                                                                            isPreviewLoading
                                                                                ? "Generating..."
                                                                                : "Preview",
                                                                        onAction:
                                                                            handlePreviewTemplate,
                                                                        disabled:
                                                                            !previewFile ||
                                                                            isPreviewLoading,
                                                                        loading:
                                                                            isPreviewLoading,
                                                                    },
                                                                    {
                                                                        content:
                                                                            t(
                                                                                "digtal_product_listing.cancel"
                                                                            ),
                                                                        onAction:
                                                                            toggleCustomTemplateModal,
                                                                    },
                                                                ]}
                                                            >
                                                                <Modal.Section>
                                                                    <LegacyStack
                                                                        wrap={
                                                                            false
                                                                        }
                                                                        alignment="leading"
                                                                        spacing="loose"
                                                                    >
                                                                        <LegacyStack.Item
                                                                            fill
                                                                        >
                                                                            <FormLayout>
                                                                                <FormLayout.Group
                                                                                    condensed
                                                                                >
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
                                                                                        value={
                                                                                            textSize
                                                                                        }
                                                                                        onChange={
                                                                                            setTextSize
                                                                                        }
                                                                                    />
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
                                                                                                    placeholder={t("createdigitalproduct.enter_text_color_eg_ff5733")}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </FormLayout.Group>
                                                                            </FormLayout>
                                                                        </LegacyStack.Item>
                                                                    </LegacyStack>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <LegacyStack
                                                                        wrap={
                                                                            false
                                                                        }
                                                                        alignment="leading"
                                                                        spacing="loose"
                                                                    >
                                                                        <LegacyStack.Item
                                                                            fill
                                                                        >
                                                                            <FormLayout>
                                                                                <FormLayout.Group
                                                                                    condensed
                                                                                >
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
                                                                                        value={
                                                                                            alignment
                                                                                        }
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
                                                                                        value={
                                                                                            font
                                                                                        }
                                                                                        onChange={
                                                                                            setFont
                                                                                        }
                                                                                    />
                                                                                </FormLayout.Group>
                                                                            </FormLayout>
                                                                        </LegacyStack.Item>
                                                                    </LegacyStack>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <LegacyStack
                                                                        wrap={
                                                                            false
                                                                        }
                                                                        alignment="leading"
                                                                        spacing="loose"
                                                                    >
                                                                        <LegacyStack.Item
                                                                            fill
                                                                        >
                                                                            <FormLayout>
                                                                                <FormLayout.Group
                                                                                    condensed
                                                                                >
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
                                                                                        value={
                                                                                            pageSize
                                                                                        }
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
                                                                                        value={
                                                                                            pageLayout
                                                                                        }
                                                                                        onChange={
                                                                                            setPageLayout
                                                                                        }
                                                                                    />
                                                                                </FormLayout.Group>
                                                                            </FormLayout>
                                                                        </LegacyStack.Item>
                                                                    </LegacyStack>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <LegacyStack
                                                                        wrap={
                                                                            false
                                                                        }
                                                                        alignment="leading"
                                                                        spacing="loose"
                                                                    >
                                                                        <LegacyStack.Item
                                                                            fill
                                                                        >
                                                                            <FormLayout>
                                                                                <FormLayout.Group
                                                                                    condensed
                                                                                >
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
                                                                                        placeholder="e.g. 5"
                                                                                    />
                                                                                    <TextField
                                                                                        label={t(
                                                                                            "createdigitalproduct.pages_to_stamp"
                                                                                        )}
                                                                                        value={
                                                                                            pagesToStamp
                                                                                        }
                                                                                        onChange={
                                                                                            setPagesToStamp
                                                                                        }
                                                                                        autoComplete="off"
                                                                                        placeholder="e.g. 1, 2 or all"
                                                                                    />
                                                                                </FormLayout.Group>
                                                                            </FormLayout>
                                                                        </LegacyStack.Item>
                                                                    </LegacyStack>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <TextField
                                                                        label={t(
                                                                            "createdigitalproduct.stamp_text"
                                                                        )}
                                                                        multiline={
                                                                            4
                                                                        }
                                                                        value={
                                                                            stampText
                                                                        }
                                                                        onChange={
                                                                            setStampText
                                                                        }
                                                                        autoComplete="off"
                                                                        placeholder="Prepared exclusively for {order.receiver_email}. Order: {order.id}"
                                                                    />
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            as="p"
                                                                            variant="bodyMd"
                                                                        >
                                                                            {t(
                                                                                "createdigitalproduct.pdf_options"
                                                                            )}
                                                                        </Text>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "5px",
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                allowPrinting
                                                                            }
                                                                            onChange={
                                                                                setAllowPrinting
                                                                            }
                                                                            label={t(
                                                                                "createdigitalproduct.allow_printing"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "5px",
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                allowCopy
                                                                            }
                                                                            onChange={
                                                                                setAllowCopy
                                                                            }
                                                                            label={t(
                                                                                "createdigitalproduct.allow_contents_to_be_copied_to_clipboard"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "5px",
                                                                            display:
                                                                                "none",
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            checked={
                                                                                passwordProtect
                                                                            }
                                                                            onChange={
                                                                                setPasswordProtect
                                                                            }
                                                                            label={t(
                                                                                "createdigitalproduct.password_protect_pdf"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <TextField
                                                                        label={t(
                                                                            "createdigitalproduct.template_title"
                                                                        )}
                                                                        value={
                                                                            templateTitle
                                                                        }
                                                                        onChange={
                                                                            setTemplateTitle
                                                                        }
                                                                        autoComplete="off"
                                                                        placeholder={t(
                                                                            "createdigitalproduct.enter_a_title_for_your_pdf_template"
                                                                        )}
                                                                    />
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <div>
                                                                        <Text
                                                                            as="h3"
                                                                            variant="headingMd"
                                                                        >
                                                                            Preview
                                                                            Template
                                                                        </Text>
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "5px",
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="file"
                                                                                accept=".pdf"
                                                                                onChange={
                                                                                    handlePreviewFileChange
                                                                                }
                                                                                style={{
                                                                                    display:
                                                                                        "none",
                                                                                }}
                                                                                id="preview-pdf-input"
                                                                            />
                                                                            <Button
                                                                                onClick={() =>
                                                                                    document
                                                                                        .getElementById(
                                                                                            "preview-pdf-input"
                                                                                        )
                                                                                        .click()
                                                                                }
                                                                            >
                                                                                Choose
                                                                                PDF
                                                                                for
                                                                                Preview
                                                                            </Button>
                                                                            {previewFile && (
                                                                                <Text
                                                                                    as="span"
                                                                                    variant="bodySm"
                                                                                    tone="subdued"
                                                                                    style={{
                                                                                        marginLeft:
                                                                                            "10px",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        previewFile.name
                                                                                    }
                                                                                </Text>
                                                                            )}
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "5px",
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                as="p"
                                                                                variant="bodySm"
                                                                                tone="subdued"
                                                                            >
                                                                                Select
                                                                                a
                                                                                PDF
                                                                                file
                                                                                to
                                                                                preview
                                                                                how
                                                                                your
                                                                                template
                                                                                will
                                                                                look
                                                                                when
                                                                                applied
                                                                            </Text>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <Text
                                                                        as="h3"
                                                                        variant="headingMd"
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.stamping_variables"
                                                                        )}
                                                                    </Text>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.below_are_the_available_stamping_variables"
                                                                        )}
                                                                    </Text>
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    ></div>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{`{order.receiver_name}`}</code>{" "}
                                                                        {t(
                                                                            "createdigitalproduct.receiver_name_customer_name"
                                                                        )}
                                                                    </Text>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{`{order.receiver_email}`}</code>{" "}
                                                                        {t(
                                                                            "createdigitalproduct.receiver_email_customer_email"
                                                                        )}
                                                                    </Text>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{`{order.id}`}</code>{" "}
                                                                        {t(
                                                                            "createdigitalproduct.order_id_pdf"
                                                                        )}
                                                                    </Text>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{`{order.date}`}</code>{" "}
                                                                        {t(
                                                                            "createdigitalproduct.order_date"
                                                                        )}
                                                                    </Text>
                                                                    <Text
                                                                        as="p"
                                                                        variant="bodyLg"
                                                                    >
                                                                        <code
                                                                            style={{
                                                                                color: "#D5006D",
                                                                            }}
                                                                        >{`{product.name}`}</code>{" "}
                                                                        {t(
                                                                            "createdigitalproduct.stamped_product_name"
                                                                        )}
                                                                    </Text>
                                                                </Modal.Section>
                                                            </Modal>
                                                        </Card>
                                                    </BlockStack>
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: isMobile
                                                        ? "20px"
                                                        : "10px",
                                                }}
                                            ></div>
                                        </div>
                                    )}

                                    {selectedProductType === "links" && (
                                        <div>
                                            <BlockStack gap="400">
                                                <Card>
                                                    <BlockStack gap="300">
                                                        <Text
                                                            variant="headingMd"
                                                            as="h6"
                                                        >
                                                            {t(
                                                                "createdigitalproduct.when_this_shopify_product_is_purchased"
                                                            )}
                                                        </Text>
                                                        {selectedProduct ? (
                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <InlineGrid
                                                                    columns="1fr auto"
                                                                    style={{
                                                                        marginBottom:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <InlineStack>
                                                                            <div>
                                                                                <Thumbnail
                                                                                    source={
                                                                                        selectedProduct
                                                                                            ?.images[0]
                                                                                            ?.originalSrc ??
                                                                                        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                                                                                    }
                                                                                    alt={
                                                                                        selectedProduct?.title
                                                                                    }
                                                                                    size="large"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft:
                                                                                        "20px",
                                                                                }}
                                                                            >
                                                                                <div>
                                                                                    <Link url="#">
                                                                                        <Text
                                                                                            variant="headingMd"
                                                                                            as="h6"
                                                                                        >
                                                                                            {
                                                                                                selectedProduct?.title
                                                                                            }
                                                                                        </Text>
                                                                                    </Link>
                                                                                    {selectedProduct
                                                                                        ?.variants
                                                                                        ?.length >
                                                                                    1 ? (
                                                                                        <Text
                                                                                            variant="bodyLg"
                                                                                            as="p"
                                                                                        >
                                                                                            {t(
                                                                                                "digtal_product_listing.all_variants"
                                                                                            )}

                                                                                            (
                                                                                            {
                                                                                                selectedProduct
                                                                                                    .variants
                                                                                                    .length
                                                                                            }

                                                                                            )
                                                                                        </Text>
                                                                                    ) : (
                                                                                        selectedProduct.variants.map(
                                                                                            (
                                                                                                variant,
                                                                                                index
                                                                                            ) => (
                                                                                                <Text
                                                                                                    key={
                                                                                                        variant.id
                                                                                                    }
                                                                                                    variant="bodyLg"
                                                                                                    as="h6"
                                                                                                >
                                                                                                    {
                                                                                                        variant.title
                                                                                                    }
                                                                                                </Text>
                                                                                            )
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </InlineStack>
                                                                    </div>
                                                                    <div
                                                                        onClick={
                                                                            toggleProductPicker
                                                                        }
                                                                    >
                                                                        <Link url="#">
                                                                            <Text
                                                                                variant="bodyLg"
                                                                                as="p"
                                                                            >
                                                                                {t(
                                                                                    "createdigitalproduct.edit_product"
                                                                                )}
                                                                            </Text>
                                                                        </Link>
                                                                    </div>
                                                                </InlineGrid>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        flex: "78%",
                                                                    }}
                                                                >
                                                                    <TextField
                                                                        value={
                                                                            selectedProduct
                                                                                ? selectedProduct.title
                                                                                : ""
                                                                        }
                                                                        onFocus={
                                                                            toggleProductPicker
                                                                        }
                                                                        placeholder={t(
                                                                            "createdigitalproduct.search_shopify_products"
                                                                        )}
                                                                        fullWidth
                                                                        readOnly
                                                                    />
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        flex: "22%",
                                                                        marginLeft:
                                                                            "1rem",
                                                                    }}
                                                                >
                                                                    <Button
                                                                        onClick={
                                                                            toggleProductPicker
                                                                        }
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.browse_products"
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <Text
                                                                as={"p"}
                                                                variant={
                                                                    "bodyMd"
                                                                }
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.select_shopify_product_or_specific_product"
                                                                )}
                                                            </Text>
                                                        </div>
                                                    </BlockStack>
                                                </Card>
                                                {!isManualDeliveryEnabled && (
                                                    <Card>
                                                        <BlockStack gap="300">
                                                            <Text
                                                                variant="headingMd"
                                                                as="h6"
                                                            >
                                                                {t(
                                                                    "createdigitalproduct.provide_the_following_content_to_the_customer"
                                                                )}
                                                            </Text>

                                                            {contentType &&
                                                                contentType.includes(
                                                                    "custom_link"
                                                                ) && (
                                                                    <BlockStack gap="300">
                                                                        {newCustoms.length >
                                                                            0 && (
                                                                            <>
                                                                                {newCustoms.map(
                                                                                    (
                                                                                        link,
                                                                                        index
                                                                                    ) => {
                                                                                        return (
                                                                                            <BlockStack gap="200">
                                                                                                <InlineGrid columns="1fr auto">
                                                                                                    <div
                                                                                                        style={{
                                                                                                            marginTop:
                                                                                                                "10px",
                                                                                                        }}
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                    >
                                                                                                        <Text
                                                                                                            variant="headingMd"
                                                                                                            as="h6"
                                                                                                        >
                                                                                                            {t(
                                                                                                                "createdigitalproduct.custom_link"
                                                                                                            )}
                                                                                                        </Text>
                                                                                                        <BlockStack gap="200">
                                                                                                            <Text
                                                                                                                variant="bodyLg"
                                                                                                                as="p"
                                                                                                            >
                                                                                                                {t(
                                                                                                                    "createdigitalproduct.title"
                                                                                                                )}

                                                                                                                :{" "}
                                                                                                                {
                                                                                                                    link.title
                                                                                                                }
                                                                                                            </Text>
                                                                                                            <Text
                                                                                                                variant="bodyLg"
                                                                                                                as="p"
                                                                                                            >
                                                                                                                Link:{" "}
                                                                                                                <Link
                                                                                                                    url="#"
                                                                                                                    target="_blank"
                                                                                                                    rel="noopener noreferrer"
                                                                                                                >
                                                                                                                    {
                                                                                                                        link.redirectURL
                                                                                                                    }
                                                                                                                </Link>
                                                                                                            </Text>
                                                                                                            <Text
                                                                                                                variant="bodyLg"
                                                                                                                as="p"
                                                                                                            >
                                                                                                                {t(
                                                                                                                    "createdigitalproduct.link_detail"
                                                                                                                )}

                                                                                                                :{" "}
                                                                                                                {
                                                                                                                    link.linkDetail
                                                                                                                }
                                                                                                            </Text>
                                                                                                        </BlockStack>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <Button
                                                                                                            icon={
                                                                                                                <Icon
                                                                                                                    source={
                                                                                                                        XSmallIcon
                                                                                                                    }
                                                                                                                />
                                                                                                            }
                                                                                                            onClick={() =>
                                                                                                                handleDeleteNewLinkAtIndex(
                                                                                                                    index
                                                                                                                )
                                                                                                            }
                                                                                                        ></Button>
                                                                                                    </div>
                                                                                                </InlineGrid>
                                                                                            </BlockStack>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </>
                                                                        )}
                                                                        <>
                                                                            {selectedCustomIds.map(
                                                                                (
                                                                                    selectedCustomId,
                                                                                    index
                                                                                ) => {
                                                                                    const selectedCustom =
                                                                                        customs.find(
                                                                                            (
                                                                                                custom
                                                                                            ) =>
                                                                                                custom.id ===
                                                                                                selectedCustomId
                                                                                        );
                                                                                    if (
                                                                                        !selectedCustom
                                                                                    )
                                                                                        return null;

                                                                                    return (
                                                                                        <BlockStack gap="200">
                                                                                            <InlineGrid columns="1fr auto">
                                                                                                <div
                                                                                                    style={{
                                                                                                        marginTop:
                                                                                                            "10px",
                                                                                                    }}
                                                                                                    key={
                                                                                                        selectedCustom.id
                                                                                                    }
                                                                                                >
                                                                                                    <Text
                                                                                                        variant="headingMd"
                                                                                                        as="h6"
                                                                                                    >
                                                                                                        {t(
                                                                                                            "createdigitalproduct.custom_link"
                                                                                                        )}
                                                                                                    </Text>
                                                                                                    <BlockStack gap="200">
                                                                                                        <Text
                                                                                                            variant="bodyLg"
                                                                                                            as="p"
                                                                                                        >
                                                                                                            {t(
                                                                                                                "createdigitalproduct.title"
                                                                                                            )}

                                                                                                            :{" "}
                                                                                                            {
                                                                                                                selectedCustom.title
                                                                                                            }
                                                                                                        </Text>
                                                                                                        <Text
                                                                                                            variant="bodyLg"
                                                                                                            as="p"
                                                                                                        >
                                                                                                            {t(
                                                                                                                "createdigitalproduct.link"
                                                                                                            )}

                                                                                                            :{" "}
                                                                                                            <Link
                                                                                                                url="#"
                                                                                                                target="_blank"
                                                                                                                rel="noopener noreferrer"
                                                                                                            >
                                                                                                                {
                                                                                                                    selectedCustom.redirect_url
                                                                                                                }
                                                                                                            </Link>
                                                                                                        </Text>
                                                                                                        <Text
                                                                                                            variant="bodyLg"
                                                                                                            as="p"
                                                                                                        >
                                                                                                            {t(
                                                                                                                "createdigitalproduct.link_detail"
                                                                                                            )}

                                                                                                            :{" "}
                                                                                                            {
                                                                                                                selectedCustom.link_details
                                                                                                            }
                                                                                                        </Text>
                                                                                                    </BlockStack>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <Button
                                                                                                        icon={
                                                                                                            <Icon
                                                                                                                source={
                                                                                                                    XSmallIcon
                                                                                                                }
                                                                                                            />
                                                                                                        }
                                                                                                        onClick={() =>
                                                                                                            handleDeleteSelectedLinkAtIndex(
                                                                                                                index
                                                                                                            )
                                                                                                        }
                                                                                                    ></Button>
                                                                                                </div>
                                                                                            </InlineGrid>
                                                                                        </BlockStack>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </>
                                                                    </BlockStack>
                                                                )}

                                                            {selectedProduct ? (
                                                                <div>
                                                                    <div>
                                                                        <Card>
                                                                            <div
                                                                                style={{
                                                                                    marginLeft:
                                                                                        "23px",
                                                                                    marginRight:
                                                                                        "23px",
                                                                                    marginTop:
                                                                                        "5px",
                                                                                }}
                                                                            >
                                                                                <TextField
                                                                                    label={t(
                                                                                        "createdigitalproduct.title"
                                                                                    )}
                                                                                    value={
                                                                                        title
                                                                                    }
                                                                                    onChange={
                                                                                        handleTitleChange
                                                                                    }
                                                                                    autoComplete="off"
                                                                                />

                                                                                <div
                                                                                    style={{
                                                                                        marginTop:
                                                                                            "10px",
                                                                                    }}
                                                                                >
                                                                                    <TextField
                                                                                        label={t(
                                                                                            "createdigitalproduct.redirects_to_url"
                                                                                        )}
                                                                                        value={
                                                                                            redirectURL
                                                                                        }
                                                                                        onChange={
                                                                                            handleRedirectURLChange
                                                                                        }
                                                                                        autoComplete="off"
                                                                                        placeholder="https://example.com/file.pdf"
                                                                                    />
                                                                                </div>

                                                                                <div
                                                                                    style={{
                                                                                        marginTop:
                                                                                            "10px",
                                                                                    }}
                                                                                >
                                                                                    <TextField
                                                                                        label={t(
                                                                                            "createdigitalproduct.link_details_optional"
                                                                                        )}
                                                                                        value={
                                                                                            linkDetail
                                                                                        }
                                                                                        onChange={
                                                                                            handleLinkDetailChange
                                                                                        }
                                                                                        autoComplete="off"
                                                                                        multiline={
                                                                                            4
                                                                                        }
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
                                                                            </div>
                                                                        </Card>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <Text
                                                                        variant="bodyLg"
                                                                        as="p"
                                                                    >
                                                                        {t(
                                                                            "createdigitalproduct.add_shopify_product_to_attached_content"
                                                                        )}
                                                                    </Text>
                                                                </div>
                                                            )}
                                                        </BlockStack>
                                                    </Card>
                                                )}

                                            </BlockStack>
                                        </div>
                                    )}


                                </div>
                            </Box>

                            {/* Footer Navigation */}
                            <Box padding={isMobile ? "400" : "600"} paddingBlockStart={isMobile ? "300" : "400"}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: isMobile ? "column" : "row",
                                        alignItems: "center",
                                        justifyContent: isMobile ? "center" : "space-between",
                                        width: "100%",
                                        gap: isMobile ? "16px" : "0",
                                    }}
                                >
                                    {/* Previous Button */}
                                    <button
                                        disabled={currentStep === 4}
                                        style={{
                                            backgroundColor: "white",
                                            color: currentStep === 4 ? "#a0a0a0" : "#303030",
                                            border: "1.5px solid #d0d0d0",
                                            borderRadius: "8px",
                                            padding: isMobile ? "10px 20px" : "12px 24px",
                                            fontSize: isMobile ? "14px" : "15px",
                                            fontWeight: "500",
                                            cursor: currentStep === 4 ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            transition: "all 0.2s",
                                            opacity: currentStep === 4 ? 0.5 : 1,
                                            width: isMobile ? "100%" : "auto",
                                            justifyContent: "center",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (currentStep !== 4) {
                                                e.currentTarget.style.backgroundColor =
                                                    "#f5f5f5";
                                                e.currentTarget.style.borderColor =
                                                    "#a0a0a0";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                                "white";
                                            e.currentTarget.style.borderColor =
                                                "#d0d0d0";
                                        }}
                                        onClick={handleBack}
                                    >
                                        <span>‹</span>
                                        {t("onboarding.Previous")}
                                    </button>

                                    {/* Progress Indicator */}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: isMobile ? "column" : "row",
                                            alignItems: "center",
                                            gap: isMobile ? "6px" : "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: isMobile ? "4px" : "6px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: isMobile ? "24px" : "32px",
                                                    height: isMobile ? "4px" : "5px",
                                                    backgroundColor: "#09637E",
                                                    borderRadius: "3px",
                                                }}
                                            ></div>
                                            <div
                                                style={{
                                                    width: isMobile ? "24px" : "32px",
                                                    height: isMobile ? "4px" : "5px",
                                                    backgroundColor: "#09637E",
                                                    borderRadius: "3px",
                                                }}
                                            ></div>
                                            <div
                                                style={{
                                                    width: isMobile ? "24px" : "32px",
                                                    height: isMobile ? "4px" : "5px",
                                                    backgroundColor: "#09637E",
                                                    borderRadius: "3px",
                                                }}
                                            ></div>

                                            <div
                                                style={{
                                                    width: isMobile ? "24px" : "32px",
                                                    height: isMobile ? "4px" : "5px",
                                                    backgroundColor: "#e0e0e0",
                                                    borderRadius: "3px",
                                                }}
                                            ></div>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: isMobile ? "14px" : "16px",
                                                fontWeight: "600",
                                                color: "#09637E",
                                            }}
                                        >
                                            3/4
                                        </div>
                                    </div>

                                    {/* Next Button */}
                                    <button
                                            disabled={
                                                !selectedProduct ||
                                                (selectedProductType === "file" &&
                                                    files.length === 0 &&
                                                    !googleDriveLink) ||
                                                (selectedProductType ===
                                                    "license" &&
                                                    isLicenseActionDisabled()) ||
                                                (selectedProductType === "pdf" &&
                                                    (!isPdfStampingEnabled ||
                                                        (files.length === 0 &&
                                                            !googleDriveLink))) ||
                                                (selectedProductType === "links" &&
                                                    isCustomLinksActionDisabled()) ||
                                                (selectedProductType ===
                                                    "mixedContent" &&
                                                    isMixedContentActionDisabled())
                                            }
                                            style={{
                                                backgroundColor:
                                                    !selectedProduct ||
                                                    (selectedProductType ===
                                                        "file" &&
                                                        files.length === 0 &&
                                                        !googleDriveLink) ||
                                                    (selectedProductType ===
                                                        "license" &&
                                                        isLicenseActionDisabled()) ||
                                                    (selectedProductType ===
                                                        "pdf" &&
                                                        (!isPdfStampingEnabled ||
                                                            (files.length === 0 &&
                                                                !googleDriveLink))) ||
                                                    (selectedProductType ===
                                                        "links" &&
                                                        isCustomLinksActionDisabled()) ||
                                                    (selectedProductType ===
                                                        "mixedContent" &&
                                                        isMixedContentActionDisabled())
                                                        ? "#cccccc"
                                                        : "#088395",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "8px",
                                                padding: isMobile ? "10px 24px" : "12px 28px",
                                                fontSize: isMobile ? "14px" : "15px",
                                                fontWeight: "500",
                                                cursor:
                                                    !selectedProduct ||
                                                    (selectedProductType ===
                                                        "file" &&
                                                        files.length === 0 &&
                                                        !googleDriveLink) ||
                                                    (selectedProductType ===
                                                        "license" &&
                                                        isLicenseActionDisabled()) ||
                                                    (selectedProductType ===
                                                        "pdf" &&
                                                        (!isPdfStampingEnabled ||
                                                            (files.length === 0 &&
                                                                !googleDriveLink))) ||
                                                    (selectedProductType ===
                                                        "links" &&
                                                        isCustomLinksActionDisabled()) ||
                                                    (selectedProductType ===
                                                        "mixedContent" &&
                                                        isMixedContentActionDisabled())
                                                        ? "not-allowed"
                                                        : "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                transition: "all 0.2s",
                                                opacity:
                                                    !selectedProduct ||
                                                    (selectedProductType ===
                                                        "file" &&
                                                        files.length === 0 &&
                                                        !googleDriveLink) ||
                                                    (selectedProductType ===
                                                        "license" &&
                                                        isLicenseActionDisabled()) ||
                                                    (selectedProductType ===
                                                        "pdf" &&
                                                        (!isPdfStampingEnabled ||
                                                            (files.length === 0 &&
                                                                !googleDriveLink))) ||
                                                    (selectedProductType ===
                                                        "links" &&
                                                        isCustomLinksActionDisabled()) ||
                                                    (selectedProductType ===
                                                        "mixedContent" &&
                                                        isMixedContentActionDisabled())
                                                        ? 0.6
                                                        : 1,
                                                width: isMobile ? "100%" : "auto",
                                                justifyContent: "center",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (
                                                    selectedProduct &&
                                                    ((selectedProductType ===
                                                        "file" &&
                                                        (files.length > 0 ||
                                                            googleDriveLink)) ||
                                                        (selectedProductType ===
                                                            "license" &&
                                                            !isLicenseActionDisabled()) ||
                                                        (selectedProductType ===
                                                            "pdf" &&
                                                            isPdfStampingEnabled &&
                                                            (files.length > 0 ||
                                                                googleDriveLink)) ||
                                                        (selectedProductType ===
                                                            "links" &&
                                                            !isCustomLinksActionDisabled()) ||
                                                        (selectedProductType ===
                                                            "mixedContent" &&
                                                            !isMixedContentActionDisabled()) ||
                                                        selectedProductType ===
                                                            "notSure")
                                                ) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "#09637E";
                                                    e.currentTarget.style.transform =
                                                        "translateY(-1px)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (
                                                    selectedProduct &&
                                                    ((selectedProductType ===
                                                        "file" &&
                                                        (files.length > 0 ||
                                                            googleDriveLink)) ||
                                                        (selectedProductType ===
                                                            "license" &&
                                                            !isLicenseActionDisabled()) ||
                                                        (selectedProductType ===
                                                            "pdf" &&
                                                            isPdfStampingEnabled &&
                                                            (files.length > 0 ||
                                                                googleDriveLink)) ||
                                                        (selectedProductType ===
                                                            "links" &&
                                                            !isCustomLinksActionDisabled()) ||
                                                        (selectedProductType ===
                                                            "mixedContent" &&
                                                            !isMixedContentActionDisabled()) ||
                                                        selectedProductType ===
                                                            "notSure")
                                                ) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "#088395";
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                }
                                            }}
                                            onClick={async () => {
                                                await handleSave();
                                                handleNext();
                                            }}
                                        >
                                            {t("onboarding.Next_→")}
                                        </button>
                                </div>
                            </Box>
                        </BlockStack>
                    </Card>
                </div>
            </Page>
            </div>
        </>
        );
    }

   if (currentStep === 4) {
        return (
            <>
                <style>
                    {`
                        @keyframes bounceIn {
                            0%   { opacity: 0; transform: scale(0.3); }
                            50%  { opacity: 1; transform: scale(1.05); }
                            70%  { transform: scale(0.9); }
                            100% { transform: scale(1); }
                        }

                        /* ── Step breadcrumb ── */
                        .ob4-steps {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            flex-wrap: wrap;
                        }

                        .ob4-step-pill {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            padding: 6px 12px;
                            border-radius: 20px;
                            background-color: #f5f5f5;
                            border: 1px solid #e0e0e0;
                        }

                        .ob4-step-circle {
                            width: 22px;
                            height: 22px;
                            border-radius: 50%;
                            border: 1.5px solid #09637E;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            font-size: 12px;
                            flex-shrink: 0;
                        }

                        .ob4-step-circle--done {
                            background-color: #088395;
                            color: white;
                        }

                        .ob4-step-circle--active {
                            background-color: white;
                            color: #088395;
                        }

                        .ob4-step-label {
                            font-weight: 500;
                            font-size: 13px;
                            white-space: nowrap;
                        }

                        .ob4-step-badge {
                            background-color: #088395;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            padding: 4px 10px;
                            font-size: 12px;
                            font-weight: 500;
                            cursor: default;
                            white-space: nowrap;
                        }

                        /* ── Confetti emoji ── */
                        .ob4-confetti {
                            font-size: clamp(40px, 8vw, 60px);
                            margin-top: 40px;
                            margin-bottom: 20px;
                            display: block;
                            animation: bounceIn 0.6s ease-out;
                        }

                        /* ── Quick-start cards grid ── */
                        .ob4-cards {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 16px;
                        }

                        .ob4-card {
                            border: 1.5px solid #e0e0e0;
                            border-radius: 12px;
                            padding: 24px;
                            background-color: white;
                            cursor: pointer;
                            transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
                        }

                        .ob4-card:hover {
                            border-color: #ff9980;
                            transform: translateY(-4px);
                            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                        }

                        .ob4-card-icon {
                            font-size: clamp(28px, 5vw, 40px);
                            margin-bottom: 12px;
                            display: block;
                        }

                        /* ── Footer bar ── */
                        .ob4-footer {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            flex-wrap: wrap;
                            gap: 12px;
                            width: 100%;
                        }

                        /* ── Shared nav button base ── */
                        .ob4-btn {
                            border-radius: 8px;
                            padding: 12px 24px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            transition: all 0.2s;
                            white-space: nowrap;
                        }

                        .ob4-btn-prev {
                            background-color: white;
                            color: #303030;
                            border: 1.5px solid #d0d0d0;
                        }

                        .ob4-btn-prev:hover:not(:disabled) {
                            background-color: #f5f5f5;
                            border-color: #a0a0a0;
                        }

                        .ob4-btn-prev:disabled {
                            opacity: 0.5;
                            cursor: not-allowed;
                        }

                        .ob4-btn-dashboard {
                            background-color: #088395;
                            color: white;
                            border: none;
                            padding: 12px 32px;
                            font-weight: 600;
                        }

                        .ob4-btn-dashboard:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(255, 153, 128, 0.4);
                        }

                        /* ── Progress dots ── */
                        .ob4-progress {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            flex-wrap: wrap;
                            justify-content: center;
                        }

                        .ob4-dots {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        }

                        .ob4-dot {
                            width: 32px;
                            height: 5px;
                            border-radius: 3px;
                            background-color: #09637E;
                        }

                        .ob4-progress-label {
                            font-size: 16px;
                            font-weight: 600;
                            color: #09637E;
                            white-space: nowrap;
                        }

                        /* ── Tablet (≤ 768px) ── */
                        @media (max-width: 768px) {
                            .ob4-cards {
                                grid-template-columns: repeat(2, 1fr);
                            }

                            .ob4-dot {
                                width: 24px !important;
                                height: 4px !important;
                            }
                        }

                        /* ── Mobile (≤ 480px) ── */
                        @media (max-width: 480px) {
                            .ob4-cards {
                                grid-template-columns: 1fr;
                            }

                            .ob4-footer {
                                flex-direction: column;
                                align-items: stretch;
                            }

                            .ob4-btn {
                                width: 100%;
                                justify-content: center;
                            }

                            .ob4-progress {
                                justify-content: center;
                            }

                            .ob4-dot {
                                width: 20px !important;
                                height: 3px !important;
                            }
                        }

                        /* ── Very small screens (≤ 360px) ── */
                        @media (max-width: 360px) {
                            .ob4-steps {
                                gap: 6px;
                            }

                            .ob4-step-pill {
                                padding: 4px 8px;
                            }

                            .ob4-step-label,
                            .ob4-step-badge {
                                font-size: 11px;
                            }
                        }

                        /* ── Wrapper padding for responsive spacing ── */
                        .onboarding-step-4-wrapper {
                            padding: 0;
                        }

                        /* ── Extra small screens (≤ 495px) - Add side padding ── */
                        @media (max-width: 495px) {
                            .onboarding-step-4-wrapper {
                                padding: 0;
                            }

                            .ob4-steps {
                                padding: 0 8px;
                            }
                        }
                    `}
                </style>

                <div className="onboarding-step-4-wrapper">
                <Page>
                    <Card>
                        <BlockStack gap="500">

                            {/* ── Congratulations hero ── */}
                            <Box padding="600">
                                <div style={{ textAlign: "center" }}>

                                    {/* Step breadcrumb */}
                                    <Box paddingInline="600" paddingBlockEnd="400">
                                        <div className="ob4-steps">

                                            {/* Step 1 – done */}
                                            <div className="ob4-step-pill">
                                                <div className="ob4-step-circle ob4-step-circle--done">✓</div>
                                                <span className="ob4-step-label">{t("onboarding.Welcome")}</span>
                                            </div>

                                            {/* Step 2 – done */}
                                            <div className="ob4-step-pill">
                                                <div className="ob4-step-circle ob4-step-circle--done">✓</div>
                                                <span className="ob4-step-label">{t("onboarding.Product_Type")}</span>
                                            </div>

                                            {/* Step 3 – done */}
                                            <div className="ob4-step-pill">
                                                <div className="ob4-step-circle ob4-step-circle--done">✓</div>
                                                <span className="ob4-step-label">{t("onboarding.Create_Product")}</span>
                                            </div>

                                            {/* Step 4 – active */}
                                            <div className="ob4-step-pill">
                                                <div className="ob4-step-circle ob4-step-circle--active">4</div>
                                                <span className="ob4-step-label">
                                                    <button className="ob4-step-badge">
                                                        {t("onboarding.congratulations")}
                                                    </button>
                                                </span>
                                            </div>

                                        </div>
                                    </Box>

                                    {/* Confetti */}
                                    <span className="ob4-confetti">🎉</span>

                                    {/* Heading */}
                                    <Text as="h1" variant="heading2xl" fontWeight="bold">
                                        {t("onboarding.congratulations")}
                                    </Text>

                                    {/* Subheading */}
                                    <div style={{ marginTop: "16px" }}>
                                        <Text as="p" variant="headingLg" tone="subdued">
                                            {t("onboarding.You_all_set_up_and_ready_to_go")}
                                        </Text>
                                    </div>

                                </div>
                            </Box>

                            {/* ── What's next cards ── */}
                            <Box padding="600" paddingBlockStart="400">
                                <div style={{ marginBottom: "24px" }}>
                                    <Text as="h2" variant="headingLg" fontWeight="semibold">
                                        {t("onboarding.What_next")}
                                    </Text>
                                </div>

                                <div className="ob4-cards">

                                    {/* Card 1 – Edit Delivery Email */}
                                    <div
                                        className="ob4-card"
                                        onClick={handleCreateNewProduct}
                                    >
                                        <span className="ob4-card-icon">✉️</span>
                                        <Text as="h3" variant="headingMd" fontWeight="semibold">
                                            {t("settings.email_content.Customize_Email_Design")}
                                        </Text>
                                    </div>

                                    {/* Card 2 – Read Documentation */}
                                    <div
                                        className="ob4-card"
                                        onClick={() =>
                                            window.open(
                                                "https://conversionproplus.com/guide",
                                                "_blank",
                                                "noopener,noreferrer"
                                            )
                                        }
                                    >
                                        <span className="ob4-card-icon">📚</span>
                                        <Text as="h3" variant="headingMd" fontWeight="semibold">
                                            {t("onboarding.Read_Documentation")}
                                        </Text>
                                    </div>

                                    {/* Card 3 – Get Support */}
                                    <div
                                        className="ob4-card"
                                        onClick={() => window.$crisp.push(["do", "chat:open"])}
                                    >
                                        <span className="ob4-card-icon">💬</span>
                                        <Text as="h3" variant="headingMd" fontWeight="semibold">
                                            {t("onboarding.Get_Support")}
                                        </Text>
                                    </div>

                                </div>
                            </Box>

                            {/* ── Footer navigation ── */}
                            <Box padding="600" paddingBlockStart="400">
                                <div className="ob4-footer">

                                    {/* Previous */}
                                    <button
                                        className="ob4-btn ob4-btn-prev"
                                        onClick={handleBack}
                                        disabled={currentStep === 4}
                                    >
                                        <span>‹</span>
                                        {t("onboarding.Previous")}
                                    </button>

                                    {/* Progress – all 4 active */}
                                    <div className="ob4-progress">
                                        <div className="ob4-dots">
                                            <div className="ob4-dot" />
                                            <div className="ob4-dot" />
                                            <div className="ob4-dot" />
                                            <div className="ob4-dot" />
                                        </div>
                                        <span className="ob4-progress-label">4/4</span>
                                    </div>

                                    {/* Go to Dashboard */}
                                    <button
                                        className="ob4-btn ob4-btn-dashboard"
                                        onClick={() => {
                                            sessionStorage.setItem("onboardingJustCompleted", "true");
                                            navigate("/");
                                        }}
                                    >
                                        {t("onboarding.Go_to_Dashboard")}
                                        <span>🚀</span>
                                    </button>

                                </div>
                            </Box>

                        </BlockStack>
                    </Card>
                </Page>
                </div>
            </>
        );
    }

 return (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f8ebeb",
            padding: "10px",
        }}
    >
        <div style={{ maxWidth: "600px", width: "100%" }}>
            <Card padding="0">  {/* ← zero out Polaris Card's built-in padding */}
                <div style={{ padding: "40px 48px" }}>  {/* ← top/bottom: 40px, sides: 48px */}
                    <div style={{ marginBottom: "32px" }}>
                        <ProgressBar progress={progress} size="small" />
                    </div>

                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "32px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "24px",
                                fontWeight: "600",
                                marginBottom: "16px",
                                color: "#202223",
                            }}
                        >
                            {steps[currentStep - 1].title}
                        </div>
                        <Text variant="bodyL" as="p" tone="subdued">
                            {steps[currentStep - 1].description}
                        </Text>
                    </div>

                    {steps[currentStep - 1].image && (
                        <div
                            style={{
                                marginBottom: "32px",
                                textAlign: "center",
                            }}
                        >
                            <img
                                src={steps[currentStep - 1].image}
                                alt={steps[currentStep - 1].title}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "12px",
                            marginTop: "32px",
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <Button
                                fullWidth
                                onClick={handleBack}
                                variant="secondary"
                                disabled={currentStep === 1}
                            >
                                {t("onboarding.Previous")}
                            </Button>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Button
                                fullWidth
                                onClick={handleNext}
                                variant="primary"
                            >
                                {currentStep === totalSteps
                                    ? "Get Started"
                                    : "Next"}
                            </Button>
                        </div>
                    </div>

                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                        <Text variant="bodySm" as="p" tone="subdued">
                            Step {currentStep} of {totalSteps}
                        </Text>
                    </div>
                </div>
            </Card>
        </div>
    </div>
);
}
