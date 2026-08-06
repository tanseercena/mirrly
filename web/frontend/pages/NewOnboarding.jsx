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

    // Step 2: Product scope selection
    const [productScope, setProductScope] = useState("all"); // "all" or "specific"
    const [selectedProductsOrCollections, setSelectedProductsOrCollections] = useState([]);
    const [productCount, setProductCount] = useState(0);

    // Step 3: Theme embed setup
    const [isThemeEmbedActive, setIsThemeEmbedActive] = useState(false);
    const [isCheckingEmbedStatus, setIsCheckingEmbedStatus] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [themeType, setThemeType] = useState("os2"); // "os2" or "vintage"

    // Step 4: Live test
    const [liveTestProduct, setLiveTestProduct] = useState(null);
    const [collectionProducts, setCollectionProducts] = useState([]); // Products from selected collections
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [testFeedback, setTestFeedback] = useState(null); // 'positive' or 'negative'
    const [showPhotoTip, setShowPhotoTip] = useState(false);

    // Step 5: Plan selection
    const [selectedPlan, setSelectedPlan] = useState("starter"); // Default to starter plan

    const totalSteps = 5;

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
    // const [filterLicenseValue, setFilterLicenseValue] = useState("");
    // const [filterCustomValue, setFilterCustomValue] = useState("");
    const [selectedMainTab, setSelectedMainTab] = useState(1);
    const [tagInputValue, setTagInputValue] = useState("");
    const [tags, setTags] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);
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
    const [isNewUserChecked, setIsNewUserChecked] = useState(false);
    const [isUserPlanLoaded, setIsUserPlanLoaded] = useState(false);
    const [isLimitExceededModalActive, setIsLimitExceededModalActive] =
        useState(false);
    const itemsPerPage = 10;
    const [productMessage, setProductMessage] = useState("");
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
    //const formattedValue = selectedDate.toISOString().slice(0, 10);
    const [progress, setProgress] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchOptions, setSearchOptions] = useState([]);
    const [selectedLicenseOptions, setSelectedLicenseOptions] = useState([]);
    const [inputLicenseValue, setInputLicenseValue] = useState("");
    const [searchLicenseOptions, setSearchLicenseOptions] = useState([]);

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
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [previewFile, setPreviewFile] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [googleDriveLink, setGoogleDriveLink] = useState("");


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


    useEffect(() => {
        // Check new user status on initial load (needed for step 1)
        checkNewUsers();
    }, []);


    const templateOptions = [
        { label: t("createdigitalproduct.select_custom_template"), value: "" },
    ];

    const handleRadioButtonChange = useCallback((newValue) => {
        setValue(newValue);
    }, []);

    const handleTabChange = useCallback((selectedMainTabIndex) => {
        setSelectedMainTab(selectedMainTabIndex);
    }, []);



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

    const toggleFileUpload = () => {
        handleContentTypeChange("files");
        setIsModalOpen(!isModalOpen);
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
            } else if (type === "googleDrive") {
                setGoogleDriveLink(null);
            }
        },
        [setFiles, setGoogleDriveLink]
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
    //     });

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

    const isMixedContentActionDisabled = () => {
        // For mixed content, user needs to provide files
        const hasFiles = files.length > 0 || googleDriveLink;

        // Mixed content requires at least files
        return !hasFiles;
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
    }, [store]);

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
            tags: tags || [],
            qrCodeEnabled: qrCodeEnabled || false,
            qrCodePrintOnPDF: qrCodePrintOnPDF || false,
            giftCardEnabled: giftCardEnabled || false,
            giftCardPropertyName: giftCardPropertyName || "",
            sendKeyToMultipleCustomers: sendKeyToMultipleCustomers || false,
            deliverKeysInSequence: deliverKeysInSequence || false,
            perUnitNoDelivery: perUnitNoDelivery || 1,

            //value: value || "automated",

            //totalCodes: totalCodes || "",
            // Excluding complex objects that might cause initialization issues
        };
    }, [
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

        // customs,     // API-populated - exclude from change detection
        tags,
        qrCodeEnabled,
        qrCodePrintOnPDF,
        giftCardEnabled,
        giftCardPropertyName,
        sendKeyToMultipleCustomers,
        deliverKeysInSequence,
        perUnitNoDelivery,
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
        setContentType(initialData.contentType || []);
        setAutoFulfill(initialData.autoFulfill || false);
        setDownloadLimit(initialData.downloadLimit || "");
        setIsDownloadLimitEnabled(initialData.isDownloadLimitEnabled || false);
        setFiles(initialData.files || []);
        setSampleFiles(initialData.sampleFiles || []);
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

        //setValue(initialData.value || "automated");

        //setTotalCodes(initialData.totalCodes || "");

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
        validFiles = files.filter((file) => file.size <= fileSizeLimit);

        if (
            contentType.includes("files") &&
            !validFiles.length &&
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
            validFiles.length > 50 &&
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

                if (googleDriveLink) {
                    const isFolder = googleDriveLink.includes("/folders/");
                    if (isFolder) {
                        formData.append("google_drive_url", googleDriveLink);
                    } else {
                        formData.append("google_drive_url", googleDriveLink);
                    }
                }
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

            //const statusValue = selected === "draft" ? 0 : 1;
            formData.append("status", statusValue);

            // Build content_type array
            let finalContentType = [...contentType];
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

        selectedProduct,
        //prefix,
        emailTemplateId,
        emailTemplateType,
        pasteKeysValue,
        sendKeyToMultipleCustomers,
        selected,
        //suffix,
        tagInputValue,
        tags,
        //totalCodes,
        qrCodeEnabled,
        qrCodePrintOnPDF,
        giftCardEnabled,
        giftCardPropertyName,
        giftDeliveryPropertyName,
        sendKeyToMultipleCustomers,
        deliverKeysInSequence,
        //value,
        sampleFiles,
        downloadLimit,
        isDownloadLimitEnabled,
        expirationType,
        expirationDays,
        selectedDate,
        isDownloadExpirationEnabled,
        productMessage,
        isProductMessageEnabled,
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
    )} ${fileSizeLimit
        ? `(${t("createdigitalproduct.max")} ${formatFileSizeLimit(
            fileSizeLimit
        )} ${t("createdigitalproduct.per_file")})`
        : t("createdigitalproduct.no_limit_per_file")
        }`;

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

            // Call finish-onboarding API when moving to step 5 (final step)
            if (nextStep === 5) {
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

    // Step 2: ResourcePicker handlers
    const handleResourcePickerOpen = async () => {
        try {
            const selected = await shopify.resourcePicker({
                type: 'collection',
                action: 'select',
                multiple: true,
            });

            if (selected && selected.length > 0) {
                const selectedItems = selected.map((item) => ({
                    id: item.id,
                    title: item.title,
                    type: item.type, // 'product' or 'collection'
                }));
                setSelectedProductsOrCollections(selectedItems);

                const collectionIds = selectedItems.map((item) => item.id);

                const response = await fetch("/api/collections/product-count", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        collectionIds,
                    }),
                });

                const data = await response.json();

                console.log("Backend Response:", data);

                setProductCount(data.total ?? 0);

                setSelectedProductType("specific");
            }
        } catch (error) {
            console.error('Resource picker error:', error);
            // User cancelled the picker
        }
    };

    const handleRemoveSelection = async (id) => {
        const updated = selectedProductsOrCollections.filter((item) => item.id !== id);
        setSelectedProductsOrCollections(updated);

        if (updated.length === 0) {
            setProductCount(0);
            setSelectedProductType(null); // Disable continue button if no items
        } else {
            // Recalculate product count from remaining collections
            const collectionIds = updated.map((item) => item.id);
            try {
                const response = await fetch("/api/collections/product-count", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        collectionIds,
                    }),
                });
                const data = await response.json();
                setProductCount(data.total ?? 0);
            } catch (error) {
                console.error('Failed to recalculate product count:', error);
                setProductCount(0);
            }
        }
    };

    // Step 3: Theme embed handlers
    const handleOpenThemeEditor = () => {
        // Deep link to theme editor with app embed pre-activated
        const appEmbedUuid = process.env.SHOPIFY_APP_EMBED_UUID || "your-app-embed-uuid";
        const blockHandle = "mirrly-try-on"; // Replace with actual block handle
        const themeEditorUrl = `/admin/themes/current/editor?context=apps&template=product&activateAppId=${appEmbedUuid}/${blockHandle}`;
        window.open(themeEditorUrl, '_blank');

        // Start polling for embed status after opening theme editor
        const pollInterval = setInterval(checkThemeEmbedStatus, 3000);
        setTimeout(() => clearInterval(pollInterval), 60000); // Stop after 1 minute
    };

    const handleCopySnippet = () => {
        const snippet = `{% render 'mirrly-try-on' %}`;
        navigator.clipboard.writeText(snippet);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const checkThemeEmbedStatus = async () => {
        setIsCheckingEmbedStatus(true);
        try {
            // API call to check if theme embed is active
            const response = await fetch('/api/check-theme-embed', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setIsThemeEmbedActive(data.isActive || false);
        } catch (error) {
            console.error('Error checking theme embed status:', error);
        } finally {
            setIsCheckingEmbedStatus(false);
        }
    };

    // Check embed status when entering step 3
    useEffect(() => {
        if (currentStep === 3) {
            checkThemeEmbedStatus();
        }
    }, [currentStep]);

    // Fetch products from selected collections for Step 4 dropdown
    useEffect(() => {
        const fetchCollectionProducts = async () => {
            if (selectedProductsOrCollections.length === 0) {
                setCollectionProducts([]);
                setLiveTestProduct(null);
                return;
            }

            setIsLoadingProducts(true);

            try {
                const collectionIds = selectedProductsOrCollections.map(item => item.id);

                const response = await fetch("/api/collections/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ collectionIds }),
                });

                const data = await response.json();

                if (data.products) {
                    setCollectionProducts(data.products);

                    // Use functional state update to avoid stale closure
                    setLiveTestProduct(prevProduct => {
                        if (data.products.length === 0) {
                            return null;
                        }
                        // Check if previous product is still in the new list
                        const isPrevProductValid = data.products.some(p => p.id === prevProduct?.id);
                        return isPrevProductValid ? prevProduct : data.products[0];
                    });
                } else {
                    setCollectionProducts([]);
                    setLiveTestProduct(null);
                }
            } catch (error) {
                console.error("Failed to fetch collection products:", error);
                setCollectionProducts([]);
                setLiveTestProduct(null);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchCollectionProducts();
    }, [selectedProductsOrCollections]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProductDropdownOpen) {
                const dropdown = document.querySelector('.step4-custom-dropdown');
                if (dropdown && !dropdown.contains(event.target)) {
                    setIsProductDropdownOpen(false);
                    setProductSearchQuery('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProductDropdownOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isProductDropdownOpen) {
            const searchInput = document.querySelector('.step4-search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }, [isProductDropdownOpen]);


    const stepProgress = (currentStep / totalSteps) * 100;

    // Show page loader until all essential data is loaded
    // On step 1, only require essential data. Defer other calls until step 2+
    const isInitialLoadComplete =
        isStoreLoaded &&
        isNewUserChecked &&
        (currentStep > 1 ? (
            isUserPlanLoaded
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

                        @keyframes pulse {
                            0%, 100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                            50% {
                                opacity: 0.5;
                                transform: scale(1.2);
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
                            flex: 1 1 0;
                            min-width: 0;
                        }

                        .onboarding-image-col {
                            flex: 1 1 0;
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

                        .onboarding-video {
                            width: 100%;
                            border-radius: 8px;
                            overflow: hidden;
                        }

                        .onboarding-video video {
                            width: 100%;
                            height: auto;
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
                            background-color: #088395;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            padding: 12px 28px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            transition: all 0.2s ease;
                            white-space: nowrap;
                        }

                        .onboarding-next-btn:hover:not(:disabled) {
                            background-color: #09637E;
                            transform: translateY(-1px);
                        }

                        .onboarding-next-btn:disabled {
                            background-color: #cccccc;
                            opacity: 0.6;
                            cursor: not-allowed;
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
                                gap: 16px;
                               
                            }

                            .onboarding-footer > div:first-child {
                                justify-content: center;
                            }

                            .onboarding-next-btn {
                                width: 100%;
                                justify-content: center;
                            }
                        }

                        /* ── Feature items responsive styles ── */
                        @media (max-width: 480px) {
                            .onboarding-content > div > div > div > div > div > div[style*="flex-direction: column"] > div {
                                gap: "16px";
                            }
                        }

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
                            font-size: 14px;
                            font-weight: 500;
                            color: #303030;
                            white-space: nowrap;
                        }

                        .ob2-step-badge {
                            background: none;
                            border: none;
                            padding: 0;
                            font-size: 14px;
                            font-weight: 600;
                            color: #088395;
                            cursor: default;
                        }

                        /* ── Wrapper padding for responsive spacing ── */
                        .onboarding-step-1-wrapper {
                            padding: 0;
                            max-width: 1600px;
                            margin: 0 auto;
                        }
                        .onboarding-step-1-wrapper > div {
                            max-width: none;
                        }
                    `}
                </style>

                <div className="onboarding-step-1-wrapper">
                    <Page>
                        <Card className="fade-in-step">

                            {/* ── Step breadcrumb ── */}
                            <Box paddingInline="600" paddingBlockStart="800" paddingBlockEnd="800">
                                <div className="ob2-steps">

                                    {/* Step 1 – active */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--active">1</div>
                                        <span className="ob2-step-label">
                                            <button className="ob2-step-badge">
                                                {t("onboarding.Welcome")}
                                            </button>
                                        </span>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--inactive">2</div>
                                        <span className="ob2-step-label">{t("onboarding.Product_Type")}</span>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--inactive">3</div>
                                        <span className="ob2-step-label">{t("onboarding.Choose_Product")}</span>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--inactive">4</div>
                                        <span className="ob2-step-label">{t("onboarding.Live_Test")}</span>
                                    </div>

                                    {/* Step 5 */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--inactive">5</div>
                                        <span className="ob2-step-label">{t("onboarding.congratulations")}</span>
                                    </div>

                                </div>
                            </Box>

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
                                                            {t("onboarding.Mirrly_Onboarding_title")}
                                                        </span>
                                                    </Text>
                                                    {/* */}
                                                    {/* <Badge size="large"> */}
                                                    <span style={{ color: "#088395" }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#7AB2B2" stroke="#7AB2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" /></svg>

                                                        {/* {t("onboarding.Deliveries")} */}

                                                    </span>
                                                    {/* </Badge> */}

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
                                                        {t("onboarding.Lets_get_your_Mirrly_products_ready")}
                                                    </span>
                                                </Text>
                                            </BlockStack>

                                            {/* Subtitle  */}
                                            <Text as="p" variant="headingLg" tone="magic">
                                                <span style={{ color: "#7AB2B2" }}>
                                                    {t("onboarding.Mirrly_Onboarding_Subtitle")}
                                                </span>
                                            </Text>


                                            {/* Feature items */}
                                            <div style={{ marginTop: "32px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
                                                    {/* Feature 1 */}
                                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "28px" }}>
                                                        <div style={{
                                                            width: "64px",
                                                            height: "64px",
                                                            borderRadius: "50%",
                                                            backgroundColor: "#E0F2F1",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#09637E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                                                <path d="m9 12 2 2 4-4" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <Text variant="headingLg" as="h3" fontWeight="bold" tone="magic">
                                                                <span style={{ color: "#09637E" }}>{t("onboarding.step1_no_api_keys")}</span>
                                                            </Text>
                                                            <Text as="p" variant="headingMd" tone="subdued">
                                                                <span style={{ color: "#7AB2B2" }}>{t("onboarding.step1_ai_engine_builtin")}</span>
                                                            </Text>
                                                        </div>
                                                    </div>

                                                    {/* Feature 2 */}
                                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "28px" }}>
                                                        <div style={{
                                                            width: "64px",
                                                            height: "64px",
                                                            borderRadius: "50%",
                                                            backgroundColor: "#E0F2F1",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#09637E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <Text variant="headingLg" as="h3" fontWeight="bold" tone="magic">
                                                                <span style={{ color: "#09637E" }}>{t("onboarding.step1_works_instantly")}</span>
                                                            </Text>
                                                            <Text as="p" variant="headingMd" tone="subdued">
                                                                <span style={{ color: "#7AB2B2" }}>{t("onboarding.step1_go_live_quickly")}</span>
                                                            </Text>
                                                        </div>
                                                    </div>

                                                    {/* Feature 3 */}
                                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "28px" }}>
                                                        <div style={{
                                                            width: "64px",
                                                            height: "64px",
                                                            borderRadius: "50%",
                                                            backgroundColor: "#E0F2F1",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#09637E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect width="3" height="3" x="3" y="3" rx="1" />
                                                                <rect width="3" height="3" x="17" y="17" rx="1" />
                                                                <path d="m7 7 10 10" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <Text variant="headingLg" as="h3" fontWeight="bold" tone="magic">
                                                                <span style={{ color: "#09637E" }}>{t("onboarding.step1_you_control")}</span>
                                                            </Text>
                                                            <Text as="p" variant="headingMd" tone="subdued">
                                                                <span style={{ color: "#7AB2B2" }}>{t("onboarding.step1_enable_apparel")}</span>
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Language selector */}
                                            {/* 
                                        <div style={{ maxWidth: "80px", marginLeft: "40px" }}>
                                            <LanguageSelector />
                                        </div>
                                        */}

                                        </BlockStack>
                                    </Box>
                                </div>

                                {/* Right: illustration */}


                                <div className="onboarding-image-col">
                                    <Card>
                                        <div style={{ padding: "16px" }}>
                                            {/* LIVE TRY-ON Badge */}
                                            <div style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "8px 16px",
                                                borderRadius: "20px",
                                                backgroundColor: "#E0F2F1",
                                                marginBottom: "16px"
                                            }}>
                                                <div style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#09637E",
                                                    animation: "pulse 2s infinite"
                                                }}></div>
                                                <Text variant="bodyMd" as="span" fontWeight="bold" tone="magic">
                                                    <span style={{ color: "#09637E" }}>{t("onboarding.step1_live_try_on_badge")}</span>
                                                </Text>
                                            </div>

                                            {/* Video Container */}
                                            <div className="onboarding-video" style={{
                                                width: "100%",
                                                borderRadius: "8px",
                                                overflow: "hidden"
                                            }}>
                                                <video width="100%" height="auto" controls src="/images/onboarding_video.mp4"></video>
                                            </div>
                                        </div>
                                    </Card>
                                </div>


                            </div>

                            {/* ── Footer: left text + right button ── */}
                            <BlockStack gap="100">
                                <Box padding="400">
                                    <div className="onboarding-footer" style={{ alignItems: "center" }}>

                                        {/* Left side: Lightbulb icon with text */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: "#E0F2F1",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#09637E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M9 18h6" />
                                                    <path d="M10 22h4" />
                                                    <path d="M12 2a7 7 0 0 0-7 7c0 2 0 3 2 4.5V15a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.5c2-1.5 2-2.5 2-4.5a7 7 0 0 0-7-7z" />
                                                </svg>
                                            </div>
                                            <Text as="p" variant="bodyMd" tone="subdued">
                                                <span style={{ color: "#7AB2B2" }}>
                                                    {t("onboarding.step1_realtime_live")}{" "}
                                                    <span style={{ color: "#088395", fontWeight: 600 }}>{t("onboarding.step1_instant_tryon")}</span>
                                                </span>
                                            </Text>
                                        </div>

                                        {/* Right side: Get started button */}
                                        <button
                                            className="onboarding-next-btn"

                                            onClick={handleNext}
                                        >
                                            {t("onboarding.step1_get_started")}
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

    if (currentStep === 2) {
        return (
            <>
                <style>
                    {`
                        /* ── Step 2 Modern Polaris Design ── */

                        /* Main container */
                        .step2-container {
                            background-color: #F6F6F7;
                            min-height: 100vh;
                            padding: 24px;
                        }

                        /* White rounded container */
                        .step2-main-card {
                            background-color: #FFFFFF;
                            border-radius: 16px;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
                            overflow: hidden;
                        }

                        /* Two column layout */
                        .step2-layout {
                            display: grid;
                            grid-template-columns: 55fr 45fr;
                            gap: 40px;
                            padding: 40px;
                        }

                        /* Left column */
                        .step2-left-col {
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                        }

                        /* Right column */
                        .step2-right-col {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }

                        /* Heading */
                        .step2-heading {
                            font-size: 36px;
                            font-weight: 700;
                            color: #12324B;
                            line-height: 1.2;
                            letter-spacing: -0.8px;
                            margin-bottom: 16px;
                        }

                        /* Description */
                        .step2-description {
                            font-size: 15px;
                            color: #667085;
                            line-height: 1.5;
                            max-width: 520px;
                            margin-bottom: 20px;
                        }

                        /* Option card base */
                        .step2-option-card {
                            display: flex;
                            align-items: center;
                            gap: 16px;
                            padding: 16px;
                            background-color: #FFFFFF;
                            border-radius: 12px;
                            border: 2px solid #DCE3EA;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            position: relative;
                        }

                        .step2-option-card:hover {
                            border-color: #0F8B8D;
                            box-shadow: 0 4px 12px rgba(15, 139, 141, 0.1);
                        }

                        .step2-option-card.selected {
                            border-color: #0F8B8D;
                            background-color: #FFFFFF;
                            box-shadow: 0 4px 16px rgba(15, 139, 141, 0.15);
                        }

                        /* Radio button */
                        .step2-radio {
                            width: 24px;
                            height: 24px;
                            border: 2px solid #DCE3EA;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                            transition: all 0.2s ease;
                        }

                        .step2-option-card.selected .step2-radio {
                            border-color: #0F8B8D;
                            background-color: #0F8B8D;
                        }

                        .step2-radio-inner {
                            width: 8px;
                            height: 8px;
                            background-color: white;
                            border-radius: 50%;
                            opacity: 0;
                            transition: all 0.2s ease;
                        }

                        .step2-option-card.selected .step2-radio-inner {
                            opacity: 1;
                        }

                        /* Card content */
                        .step2-card-content {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        }

                        /* Card title */
                        .step2-card-title {
                            font-size: 18px;
                            font-weight: 600;
                            color: #12324B;
                            letter-spacing: -0.3px;
                            margin-bottom: 2px;
                        }

                        /* Card description */
                        .step2-card-desc {
                            font-size: 14px;
                            color: #667085;
                            line-height: 1.4;
                        }

                        /* Recommended badge */
                        .step2-badge {
                            display: inline-flex;
                            align-items: center;
                            padding: 4px 12px;
                            background-color: #DDF8EA;
                            color: #1F8A4D;
                            border-radius: 16px;
                            font-size: 13px;
                            font-weight: 600;
                            margin-left: 8px;
                        }

                        /* Icon container */
                        .step2-icon-container {
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            background-color: #EAF6FD;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                            position: relative;
                        }

                        /* Sparkle decorations */
                        .step2-sparkle {
                            position: absolute;
                            width: 6px;
                            height: 6px;
                            background-color: #0F8B8D;
                            border-radius: 50%;
                            opacity: 0.3;
                        }

                        .step2-sparkle-1 {
                            top: -3px;
                            right: 6px;
                        }

                        .step2-sparkle-2 {
                            bottom: 4px;
                            right: -2px;
                        }

                        .step2-sparkle-3 {
                            top: 8px;
                            right: -5px;
                            width: 4px;
                            height: 4px;
                        }

                        /* Browse button */
                        .step2-browse-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 12px 20px;
                            background-color: #0F8B8D;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            margin-top: 8px;
                        }

                        .step2-browse-btn:hover {
                            background-color: #0C7778;
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(15, 139, 141, 0.2);
                        }

                        .step2-browse-btn:active {
                            transform: translateY(0);
                        }

                        /* Statistics card */
                        .step2-stats-card {
                            background-color: #FFFFFF;
                            border: 1px solid #DCE3EA;
                            border-radius: 16px;
                            padding: 24px;
                        }

                        .step2-stats-header {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            margin-bottom: 20px;
                        }

                        .step2-stats-icon {
                            width: 32px;
                            height: 32px;
                            color: #0F8B8D;
                        }

                        .step2-stats-title {
                            font-size: 16px;
                            font-weight: 600;
                            color: #12324B;
                        }

                        .step2-stats-number {
                            font-size: 56px;
                            font-weight: 700;
                            color: #0F8B8D;
                            line-height: 1;
                            margin-bottom: 8px;
                        }

                        .step2-stats-label {
                            font-size: 18px;
                            color: #667085;
                            margin-left: 4px;
                        }

                        .step2-stats-note {
                            font-size: 14px;
                            color: #667085;
                            margin-top: 8px;
                        }

                        /* Includes section */
                        .step2-includes {
                            margin-top: 20px;
                            padding-top: 20px;
                            border-top: 1px solid #E8E8E8;
                        }

                        .step2-includes-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 12px;
                        }

                        .step2-include-item {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            font-size: 14px;
                            color: #12324B;
                            margin-bottom: 8px;
                        }

                        .step2-check-icon {
                            width: 18px;
                            height: 18px;
                            color: #1F8A4D;
                            flex-shrink: 0;
                        }

                        /* Info alert */
                        .step2-info-alert {
                            background-color: #EAF6FD;
                            border-radius: 12px;
                            padding: 16px;
                            display: flex;
                            align-items: flex-start;
                            gap: 12px;
                        }

                        .step2-info-icon {
                            width: 20px;
                            height: 20px;
                            color: #0F8B8D;
                            flex-shrink: 0;
                            margin-top: 2px;
                        }

                        .step2-info-text {
                            font-size: 14px;
                            color: #12324B;
                            line-height: 1.4;
                        }

                        /* Warning alert */
                        .step2-warning-alert {
                            background-color: #FFF7E6;
                            border-radius: 12px;
                            padding: 16px;
                            display: flex;
                            align-items: flex-start;
                            gap: 12px;
                        }

                        .step2-warning-icon {
                            width: 20px;
                            height: 20px;
                            color: #B56A00;
                            flex-shrink: 0;
                            margin-top: 2px;
                        }

                        .step2-warning-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 2px;
                        }

                        .step2-warning-text {
                            font-size: 14px;
                            color: #667085;
                            line-height: 1.4;
                        }

                        /* Selected items list */
                        .step2-selected-list {
                            margin-top: 16px;
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                        }

                        .step2-selected-item {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 12px 16px;
                            background-color: #F6F6F7;
                            border-radius: 8px;
                            border: 1px solid #E8E8E8;
                        }

                        .step2-item-title {
                            font-size: 14px;
                            color: #12324B;
                        }

                        .step2-remove-btn {
                            background: none;
                            border: none;
                            color: #667085;
                            cursor: pointer;
                            padding: 4px;
                            border-radius: 4px;
                            transition: all 0.2s ease;
                        }

                        .step2-remove-btn:hover {
                            background-color: #E8E8E8;
                            color: #D03030;
                        }

                        /* Footer navigation */
                        .step2-footer {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 24px 40px;
                            border-top: 1px solid #E8E8E8;
                            background-color: #FFFFFF;
                            flex-wrap: wrap;
                            gap: 16px;
                        }

                        .step2-prev-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 12px 20px;
                            background-color: white;
                            color: #12324B;
                            border: 1px solid #DCE3EA;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        }

                        .step2-prev-btn:hover:not(:disabled) {
                            background-color: #F6F6F7;
                            border-color: #0F8B8D;
                        }

                        .step2-prev-btn:disabled {
                            opacity: 0.5;
                            cursor: not-allowed;
                        }

                        .step2-progress {
                            display: flex;
                            align-items: center;
                            gap: 16px;
                        }

                        .step2-dots {
                            display: flex;
                            gap: 6px;
                        }

                        .step2-dot {
                            width: 32px;
                            height: 5px;
                            border-radius: 3px;
                            background-color: #E8E8E8;
                        }

                        .step2-dot.active {
                            background-color: #0F8B8D;
                        }

                        .step2-progress-label {
                            font-size: 16px;
                            font-weight: 600;
                            color: #0F8B8D;
                        }

                        .step2-continue-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 12px 28px;
                            background-color: #0F8B8D;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        }

                        .step2-continue-btn:hover:not(:disabled) {
                            background-color: #0C7778;
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(15, 139, 141, 0.2);
                        }

                        .step2-continue-btn:disabled {
                            background-color: #E8E8E8;
                            color: #A0A0A0;
                            cursor: not-allowed;
                        }

                        /* Breadcrumb */
                        .step2-breadcrumb {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            padding: 24px 40px 0;
                            flex-wrap: wrap;
                        }

                        .step2-breadcrumb-item {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px 16px;
                            background-color: #F6F6F7;
                            border-radius: 20px;
                        }

                        .step2-breadcrumb-circle {
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            font-weight: 600;
                        }

                        .step2-breadcrumb-circle.done {
                            background-color: #0F8B8D;
                            color: white;
                        }

                        .step2-breadcrumb-circle.active {
                            background-color: white;
                            color: #0F8B8D;
                            border: 2px solid #0F8B8D;
                        }

                        .step2-breadcrumb-circle.inactive {
                            background-color: white;
                            color: #A0A0A0;
                            border: 2px solid #E8E8E8;
                        }

                        .step2-breadcrumb-label {
                            font-size: 14px;
                            font-weight: 500;
                            color: #667085;
                            white-space: nowrap;
                        }

                        .step2-breadcrumb-item.active .step2-breadcrumb-label {
                            color: #0F8B8D;
                            font-weight: 600;
                        }

                        .step2-breadcrumb-badge {
                            background-color: #0F8B8D;
                            color: white;
                            padding: 2px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            font-weight: 600;
                        }

                        /* Mobile responsive */
                        @media (max-width: 1024px) {
                            .step2-layout {
                                grid-template-columns: 1fr;
                                gap: 32px;
                            }

                            .step2-right-col {
                                order: 2;
                            }

                            .step2-heading {
                                font-size: 32px;
                            }
                        }

                        @media (max-width: 768px) {
                            .step2-container {
                                padding: 16px;
                            }

                            .step2-layout {
                                padding: 24px;
                                gap: 24px;
                            }

                            .step2-heading {
                                font-size: 28px;
                            }

                            .step2-description {
                                font-size: 14px;
                            }

                            .step2-option-card {
                                padding: 16px;
                                flex-direction: column;
                                align-items: flex-start;
                                gap: 12px;
                            }

                            .step2-card-content {
                                flex-direction: column;
                                align-items: flex-start;
                                gap: 12px;
                            }

                            .step2-icon-container {
                                align-self: flex-end;
                            }

                            .step2-footer {
                                padding: 20px 24px;
                                flex-direction: column;
                                align-items: stretch;
                            }

                            .step2-prev-btn,
                            .step2-continue-btn {
                                justify-content: center;
                                width: 100%;
                            }

                            .step2-progress {
                                justify-content: center;
                            }

                            .step2-breadcrumb {
                                padding: 16px 24px 0;
                            }
                        }

                        @media (max-width: 480px) {
                            .step2-heading {
                                font-size: 24px;
                            }

                            .step2-stats-number {
                                font-size: 42px;
                            }

                            .step2-option-card {
                                padding: 14px;
                            }

                            .step2-card-title {
                                font-size: 16px;
                            }

                            .step2-card-desc {
                                font-size: 13px;
                            }
                        }

                        /* Spinner animation */
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }

                        .step2-spinner {
                            width: 16px;
                            height: 16px;
                            border: 2px solid rgba(255, 255, 255, 0.3);
                            border-top-color: white;
                            border-radius: 50%;
                            animation: spin 0.8s linear infinite;
                        }
                    `}
                </style>

                <div className="step2-container">
                    <div className="step2-main-card">

                        {/* Breadcrumb */}
                        <div className="step2-breadcrumb">
                            <div className="step2-breadcrumb-item">
                                <div className="step2-breadcrumb-circle done">✓</div>
                                <span className="step2-breadcrumb-label">{t("onboarding.Welcome")}</span>
                            </div>
                            <div className="step2-breadcrumb-item active">
                                <div className="step2-breadcrumb-circle active">2</div>
                                <span className="step2-breadcrumb-label">
                                    <span className="step2-breadcrumb-badge">{t("onboarding.Product_Type")}</span>
                                </span>
                            </div>
                            <div className="step2-breadcrumb-item">
                                <div className="step2-breadcrumb-circle inactive">3</div>
                                <span className="step2-breadcrumb-label">{t("onboarding.Choose_Product")}</span>
                            </div>
                            <div className="step2-breadcrumb-item">
                                <div className="step2-breadcrumb-circle inactive">4</div>
                                <span className="step2-breadcrumb-label">{t("onboarding.Live_Test")}</span>
                            </div>
                            <div className="step2-breadcrumb-item">
                                <div className="step2-breadcrumb-circle inactive">5</div>
                                <span className="step2-breadcrumb-label">{t("onboarding.complete")}</span>
                            </div>
                        </div>

                        {/* Main layout */}
                        <div className="step2-layout">

                            {/* Left column */}
                            <div className="step2-left-col">
                                <h1 className="step2-heading">
                                    {t("onboarding.step2_heading")}
                                </h1>
                                <p className="step2-description">
                                    {t("onboarding.step2_description")}
                                </p>

                                {/* Option Card 1: All apparel */}
                                <div
                                    className={`step2-option-card ${productScope === "all" ? "selected" : ""}`}
                                    onClick={() => {
                                        setProductScope("all");
                                        setSelectedProductType("all");
                                    }}
                                >
                                    <div className="step2-radio">
                                        <div className="step2-radio-inner"></div>
                                    </div>
                                    <div className="step2-card-content">
                                        <div>
                                            <div className="step2-card-title">
                                                {t("onboarding.step2_all_apparel_title")}
                                                <span className="step2-badge">{t("onboarding.recommended")}</span>
                                            </div>
                                            <div className="step2-card-desc">
                                                {t("onboarding.step2_all_apparel_desc")}
                                            </div>
                                        </div>
                                        <div className="step2-icon-container">
                                            {/* Shirt icon */}
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F8B8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                                            </svg>
                                            <div className="step2-sparkle step2-sparkle-1"></div>
                                            <div className="step2-sparkle step2-sparkle-2"></div>
                                            <div className="step2-sparkle step2-sparkle-3"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Option Card 2: Specific collections */}
                                <div
                                    className={`step2-option-card ${productScope === "specific" ? "selected" : ""}`}
                                    onClick={() => {
                                        setProductScope("specific");
                                        setSelectedProductType("specific");
                                    }}
                                >
                                    <div className="step2-radio">
                                        <div className="step2-radio-inner"></div>
                                    </div>
                                    <div className="step2-card-content">
                                        <div>
                                            <div className="step2-card-title">
                                                {t("onboarding.step2_specific_title")}
                                            </div>
                                            <div className="step2-card-desc">
                                                {t("onboarding.step2_specific_desc")}
                                            </div>
                                        </div>
                                        <div className="step2-icon-container">
                                            {/* Folder icon */}
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F8B8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                            </svg>
                                            <div className="step2-sparkle step2-sparkle-1"></div>
                                            <div className="step2-sparkle step2-sparkle-2"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Browse button (only show when specific is selected) */}
                                {productScope === "specific" && (
                                    <button
                                        className="step2-browse-btn"
                                        onClick={handleResourcePickerOpen}
                                    >
                                        {/* Search icon */}
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.35-4.35" />
                                        </svg>
                                        {t("onboarding.step2_browse_button")}
                                    </button>
                                )}

                                {/* Selected items list (when specific is selected) */}
                                {productScope === "specific" && selectedProductsOrCollections.length > 0 && (
                                    <div className="step2-selected-list">
                                        {selectedProductsOrCollections.map((item) => (
                                            <div key={item.id} className="step2-selected-item">
                                                <span className="step2-item-title">{item.title}</span>
                                                <button
                                                    className="step2-remove-btn"
                                                    onClick={() => handleRemoveSelection(item.id)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right column */}
                            <div className="step2-right-col">
                                {/* Statistics card */}
                                <div className="step2-stats-card">
                                    <div className="step2-stats-header">
                                        {/* Shirt icon */}
                                        <svg className="step2-stats-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                                        </svg>
                                        <span className="step2-stats-title">{t("onboarding.step2_stats_title")}</span>
                                    </div>
                                    <div>
                                        <span className="step2-stats-number">
                                            {productScope === "all" ? "—" : (productCount > 0 ? productCount : "0")}
                                        </span>
                                        <span className="step2-stats-label">{t("onboarding.step2_stats_label")}</span>
                                    </div>
                                    <div className="step2-stats-note">
                                        {t("onboarding.step2_stats_note")}
                                    </div>

                                    {/* Includes section */}
                                    <div className="step2-includes">
                                        <div className="step2-includes-title">{t("onboarding.step2_includes_title")}</div>
                                        <div className="step2-include-item">
                                            {/* Check icon */}
                                            <svg className="step2-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <path d="m9 11 3 3L22 4" />
                                            </svg>
                                            {t("onboarding.step2_includes_model_images")}
                                        </div>
                                        <div className="step2-include-item">
                                            {/* Check icon */}
                                            <svg className="step2-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <path d="m9 11 3 3L22 4" />
                                            </svg>
                                            {t("onboarding.step2_includes_apparel")}
                                        </div>
                                    </div>
                                </div>

                                {/* Info alert */}
                                <div className="step2-info-alert">
                                    {/* Info icon */}
                                    <svg className="step2-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 16v-4" />
                                        <path d="M12 8h.01" />
                                    </svg>
                                    <span className="step2-info-text">
                                        {t("onboarding.step2_info_text")}
                                    </span>
                                </div>

                                {/* Warning alert (only show when zero products and specific is selected) */}
                                {productScope === "specific" && selectedProductsOrCollections.length > 0 && productCount === 0 && (
                                    <div className="step2-warning-alert">
                                        {/* Warning icon */}
                                        <svg className="step2-warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                            <line x1="12" y1="9" x2="12" y2="13" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                        <div>
                                            <div className="step2-warning-title">{t("onboarding.step2_no_products_matched")}</div>
                                            <div className="step2-warning-text">
                                                {t("onboarding.step2_try_different")}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer navigation */}
                        <div className="step2-footer">
                            <button
                                className="step2-prev-btn"
                                onClick={handleBack}
                                disabled={currentStep === 4 || isFinishingOnboarding}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                {t("onboarding.Previous")}
                            </button>

                            <div className="step2-progress">
                                <div className="step2-dots">
                                    <div className="step2-dot active"></div>
                                    <div className="step2-dot active"></div>
                                    <div className="step2-dot"></div>
                                    <div className="step2-dot"></div>
                                    <div className="step2-dot"></div>
                                </div>
                                <span className="step2-progress-label">2/5</span>
                            </div>

                            <button
                                className="step2-continue-btn"
                                disabled={!selectedProductType || isFinishingOnboarding}
                                onClick={handleNext}
                            >
                                {isFinishingOnboarding ? (
                                    <>
                                        <div className="step2-spinner"></div>
                                        {t("settings.email_content.loading")}
                                    </>
                                ) : (
                                    <>
                                        {t("onboarding.Continue")}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (currentStep === 3) {
        return (
            <>
                <style>
                    {`
                        /* ── Step 3 Premium Polaris Design ── */

                        /* Main container */
                        .step3-container {
                            background-color: #F6F6F7;
                            min-height: 100vh;
                            padding: 24px;
                        }

                        /* White rounded container */
                        .step3-main-card {
                            background-color: #FFFFFF;
                            border-radius: 16px;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
                            overflow: hidden;
                        }

                        /* Two column layout */
                        .step3-layout {
                            display: grid;
                            grid-template-columns: 48fr 52fr;
                            gap: 32px;
                            padding: 40px;
                        }

                        /* Left column */
                        .step3-left-col {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                        }

                        /* Right column */
                        .step3-right-col {
                            display: flex;
                            flex-direction: column;
                            gap: 24px;
                        }

                        /* Heading */
                        .step3-heading {
                            font-size: 36px;
                            font-weight: 700;
                            color: #12324B;
                            line-height: 1.2;
                            letter-spacing: -0.8px;
                            margin-bottom: 16px;
                        }

                        /* Description */
                        .step3-description {
                            font-size: 15px;
                            color: #667085;
                            line-height: 1.5;
                            margin-bottom: 20px;
                        }

                        /* Theme detection card - success */
                        .step3-theme-card {
                            background-color: #ECFDF5;
                            border-radius: 12px;
                            padding: 20px;
                            display: flex;
                            align-items: flex-start;
                            gap: 16px;
                            border: 1px solid #D7F9D6;
                        }

                        /* Theme detection card - warning (vintage) */
                        .step3-theme-card.warning {
                            background-color: #FFF7E6;
                            border-color: #FFE7B3;
                        }

                        .step3-theme-icon {
                            width: 24px;
                            height: 24px;
                            color: #1F8A4D;
                            flex-shrink: 0;
                        }

                        .step3-theme-card.warning .step3-theme-icon {
                            color: #B56A00;
                        }

                        .step3-theme-content {
                            flex: 1;
                        }

                        .step3-theme-title {
                            font-size: 16px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 4px;
                        }

                        .step3-theme-desc {
                            font-size: 14px;
                            color: #667085;
                            line-height: 1.4;
                        }

                        /* Section title */
                        .step3-section-title {
                            font-size: 18px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 8px;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        }

                        /* Recommended badge */
                        .step3-badge {
                            display: inline-flex;
                            align-items: center;
                            padding: 4px 12px;
                            background-color: #DDF8EA;
                            color: #1F8A4D;
                            border-radius: 16px;
                            font-size: 12px;
                            font-weight: 600;
                        }

                        /* Section description */
                        .step3-section-desc {
                            font-size: 14px;
                            color: #667085;
                            line-height: 1.5;
                            margin-bottom: 20px;
                        }

                        /* Primary button */
                        .step3-primary-btn {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            padding: 14px 24px;
                            background-color: #0F8B8D;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            text-decoration: none;
                        }

                        .step3-primary-btn:hover:not(:disabled) {
                            background-color: #0C7778;
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(15, 139, 141, 0.2);
                        }

                        .step3-primary-btn:active:not(:disabled) {
                            transform: translateY(0);
                        }

                        .step3-primary-btn:disabled {
                            background-color: #E8E8E8;
                            color: #A0A0A0;
                            cursor: not-allowed;
                        }

                        /* Help text with lock icon */
                        .step3-help-text {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            margin-top: 12px;
                        }

                        .step3-lock-icon {
                            width: 16px;
                            height: 16px;
                            color: #667085;
                        }

                        .step3-help-text span {
                            font-size: 13px;
                            color: #667085;
                        }

                        /* Divider */
                        .step3-divider {
                            height: 1px;
                            background-color: #E8E8E8;
                            margin: 24px 0;
                        }

                        /* Manual install section - Vintage Theme */
                        .step3-manual-section {
                            padding: 32px 40px 24px;
                            border-top: 1px solid #E8E8E8;
                        }

                        .step3-manual-layout {
                            display: grid;
                            grid-template-columns: 48fr 52fr;
                            gap: 32px;
                            align-items: start;
                        }

                        .step3-manual-left {
                            display: flex;
                            flex-direction: column;
                            gap: 12px;
                        }

                        .step3-manual-right {
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                        }

                        .step3-manual-title {
                            font-size: 16px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 0;
                        }

                        .step3-manual-desc {
                            font-size: 14px;
                            color: #667085;
                            line-height: 1.5;
                            margin: 0;
                        }

                        /* Code snippet card */
                        .step3-snippet-card {
                            background-color: #F8FAFC;
                            border: 1px solid #DCE3EA;
                            border-radius: 12px;
                            padding: 20px;
                            position: relative;
                        }

                        .step3-snippet {
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                            font-size: 13px;
                            color: #12324B;
                            line-height: 1.6;
                            background: none;
                            border: none;
                            padding: 0;
                            margin: 0;
                            width: 100%;
                        }

                        .step3-copy-btn {
                            position: absolute;
                            top: 16px;
                            right: 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 6px;
                            padding: 8px 12px;
                            background-color: white;
                            color: #667085;
                            border: 1px solid #DCE3EA;
                            border-radius: 6px;
                            font-size: 13px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        }

                        .step3-copy-btn:hover {
                            background-color: #F6F6F7;
                            border-color: #0F8B8D;
                            color: #0F8B8D;
                        }

                        .step3-copy-btn.copied {
                            background-color: #ECFDF5;
                            border-color: #1F8A4D;
                            color: #1F8A4D;
                        }

                        /* Recommendation section with learn more link */
                        .step3-manual-recommendation {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 16px;
                            padding: 0 4px;
                        }

                        .step3-manual-recommend-text {
                            font-size: 13px;
                            color: #667085;
                            line-height: 1.5;
                            flex: 1;
                        }

                        .step3-manual-learn-link {
                            display: flex;
                            align-items: center;
                            gap: 4px;
                            font-size: 13px;
                            font-weight: 500;
                            color: #088395;
                            text-decoration: none;
                            white-space: nowrap;
                            transition: color 0.2s ease;
                        }

                        .step3-manual-learn-link:hover {
                            color: #09637E;
                        }

                        .step3-manual-learn-link svg {
                            flex-shrink: 0;
                        }

                        /* Manual section copy button */
                        .step3-manual-copy-btn {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            padding: 10px 20px;
                            background-color: white;
                            color: #088395;
                            border: 1.5px solid #088395;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            width: fit-content;
                        }

                        .step3-manual-copy-btn:hover {
                            background-color: #088395;
                            color: white;
                        }

                        .step3-manual-copy-btn.copied {
                            background-color: #ECFDF5;
                            border-color: #1F8A4D;
                            color: #1F8A4D;
                        }

                        .step3-manual-copy-btn.copied:hover {
                            background-color: #1F8A4D;
                            color: white;
                        }

                        /* Product preview image */
                        .step3-preview-image {
                            width: 100%;
                            max-width: 600px;
                            height: auto;
                            display: block;
                            border-radius: 12px;
                            object-fit: contain;
                        }

                        .step3-preview-content {
                            padding: 20px;
                        }

                        .step3-preview-title {
                            font-size: 18px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 8px;
                        }

                        .step3-preview-price {
                            font-size: 20px;
                            font-weight: 700;
                            color: #12324B;
                            margin-bottom: 16px;
                        }

                        /* Color selector mock */
                        .step3-color-selector {
                            display: flex;
                            gap: 8px;
                            margin-bottom: 12px;
                        }

                        .step3-color-dot {
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            border: 2px solid #E8E8E8;
                        }

                        .step3-color-dot.active {
                            border-color: #0F8B8D;
                            box-shadow: 0 0 0 2px white, 0 0 0 4px #0F8B8D;
                        }

                        /* Size selector mock */
                        .step3-size-selector {
                            display: flex;
                            gap: 8px;
                            margin-bottom: 16px;
                        }

                        .step3-size-btn {
                            width: 36px;
                            height: 36px;
                            border: 1px solid #DCE3EA;
                            border-radius: 6px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 13px;
                            font-weight: 500;
                            color: #12324B;
                            background-color: white;
                        }

                        .step3-size-btn.active {
                            background-color: #12324B;
                            color: white;
                            border-color: #12324B;
                        }

                        /* Add to cart button mock */
                        .step3-atc-btn {
                            width: 100%;
                            padding: 14px;
                            background-color: #12324B;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 15px;
                            font-weight: 600;
                            margin-bottom: 12px;
                        }

                        /* Try-on button mock */
                        .step3-tryon-btn {
                            width: 100%;
                            padding: 14px;
                            background: linear-gradient(135deg, #0F8B8D 0%, #0C7778 100%);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 15px;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            position: relative;
                        }

                        /* Annotation */
                        .step3-annotation {
                            position: absolute;
                            top: -50px;
                            right: -20px;
                            background-color: white;
                            padding: 8px 12px;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
                            font-size: 12px;
                            font-weight: 600;
                            color: #0F8B8D;
                            white-space: nowrap;
                            z-index: 10;
                        }

                        .step3-annotation::before {
                            content: '';
                            position: absolute;
                            bottom: -8px;
                            left: 20px;
                            width: 0;
                            height: 0;
                            border-left: 8px solid transparent;
                            border-right: 8px solid transparent;
                            border-top: 8px solid white;
                        }

                        .step3-arrow {
                            position: absolute;
                            top: -35px;
                            right: 10px;
                            width: 40px;
                            height: 40px;
                        }

                        /* Embed status card */
                        .step3-embed-card {
                            background-color: #ECFDF5;
                            border-radius: 12px;
                            padding: 16px 20px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            border: 1px solid #D7F9D6;
                        }

                        .step3-embed-card.pending {
                            background-color: #FFF7E6;
                            border-color: #FFE7B3;
                        }

                        .step3-embed-left {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        }

                        .step3-embed-icon {
                            width: 20px;
                            height: 20px;
                            color: #1F8A4D;
                        }

                        .step3-embed-card.pending .step3-embed-icon {
                            color: #B56A00;
                        }

                        .step3-embed-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #12324B;
                        }

                        .step3-embed-desc {
                            font-size: 13px;
                            color: #667085;
                        }

                        .step3-refresh-btn {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 8px;
                            background-color: white;
                            border: 1px solid #DCE3EA;
                            border-radius: 6px;
                            color: #667085;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        }

                        .step3-refresh-btn:hover {
                            border-color: #0F8B8D;
                            color: #0F8B8D;
                        }

                        .step3-refresh-btn svg {
                            width: 18px;
                            height: 18px;
                        }

                        .step3-refresh-btn.spinning svg {
                            animation: spin 1s linear infinite;
                        }

                        /* Footer navigation */
                        .step3-footer {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 24px 40px;
                            border-top: 1px solid #E8E8E8;
                            background-color: #FFFFFF;
                            flex-wrap: wrap;
                            gap: 16px;
                        }

                        .step3-prev-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 12px 20px;
                            background-color: white;
                            color: #12324B;
                            border: 1px solid #DCE3EA;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        }

                        .step3-prev-btn:hover:not(:disabled) {
                            background-color: #F6F6F7;
                            border-color: #0F8B8D;
                        }

                        .step3-prev-btn:disabled {
                            opacity: 0.5;
                            cursor: not-allowed;
                        }

                        .step3-progress {
                            display: flex;
                            align-items: center;
                            gap: 16px;
                        }

                        .step3-dots {
                            display: flex;
                            gap: 6px;
                        }

                        .step3-dot {
                            width: 32px;
                            height: 5px;
                            border-radius: 3px;
                            background-color: #E8E8E8;
                        }

                        .step3-dot.active {
                            background-color: #0F8B8D;
                        }

                        .step3-progress-label {
                            font-size: 16px;
                            font-weight: 600;
                            color: #0F8B8D;
                        }

                        .step3-continue-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 12px 28px;
                            background-color: #0F8B8D;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        }

                        .step3-continue-btn:hover:not(:disabled) {
                            background-color: #0C7778;
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(15, 139, 141, 0.2);
                        }

                        .step3-continue-btn:disabled {
                            background-color: #E8E8E8;
                            color: #A0A0A0;
                            cursor: not-allowed;
                        }

                        /* Breadcrumb */
                        .step3-breadcrumb {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            padding: 24px 40px 0;
                            flex-wrap: wrap;
                        }

                        .step3-breadcrumb-item {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px 16px;
                            background-color: #F6F6F7;
                            border-radius: 20px;
                        }

                        .step3-breadcrumb-circle {
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            font-weight: 600;
                        }

                        .step3-breadcrumb-circle.done {
                            background-color: #0F8B8D;
                            color: white;
                        }

                        .step3-breadcrumb-circle.active {
                            background-color: white;
                            color: #0F8B8D;
                            border: 2px solid #0F8B8D;
                        }

                        .step3-breadcrumb-circle.inactive {
                            background-color: white;
                            color: #A0A0A0;
                            border: 2px solid #E8E8E8;
                        }

                        .step3-breadcrumb-label {
                            font-size: 14px;
                            font-weight: 500;
                            color: #667085;
                            white-space: nowrap;
                        }

                        .step3-breadcrumb-item.active .step3-breadcrumb-label {
                            color: #0F8B8D;
                            font-weight: 600;
                        }

                        .step3-breadcrumb-badge {
                            background-color: #0F8B8D;
                            color: white;
                            padding: 2px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            font-weight: 600;
                        }

                        /* Spinner animation */
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }

                        .step3-spinner {
                            width: 16px;
                            height: 16px;
                            border: 2px solid rgba(255, 255, 255, 0.3);
                            border-top-color: white;
                            border-radius: 50%;
                            animation: spin 0.8s linear infinite;
                        }

                        /* Mobile responsive */
                        @media (max-width: 1024px) {
                            .step3-layout {
                                grid-template-columns: 1fr;
                                gap: 32px;
                            }

                            .step3-right-col {
                                order: 2;
                            }

                            .step3-heading {
                                font-size: 32px;
                            }
                        }

                        @media (max-width: 768px) {
                            .step3-container {
                                padding: 16px;
                            }

                            .step3-layout {
                                padding: 24px;
                                gap: 24px;
                            }

                            .step3-heading {
                                font-size: 28px;
                            }

                            .step3-description {
                                font-size: 14px;
                            }

                            .step3-footer {
                                padding: 20px 24px;
                                flex-direction: column;
                                align-items: stretch;
                            }

                            .step3-prev-btn,
                            .step3-continue-btn {
                                justify-content: center;
                                width: 100%;
                            }

                            .step3-progress {
                                justify-content: center;
                            }

                            .step3-breadcrumb {
                                padding: 16px 24px 0;
                            }

                            .step3-preview-image {
                                max-width: 500px;
                            }

                            /* Manual section responsive */
                            .step3-manual-section {
                                padding: 24px;
                            }

                            .step3-manual-layout {
                                grid-template-columns: 1fr;
                                gap: 20px;
                            }

                            .step3-manual-recommendation {
                                flex-direction: column;
                                align-items: flex-start;
                                gap: 8px;
                            }
                        }

                        @media (max-width: 480px) {
                            .step3-heading {
                                font-size: 24px;
                            }

                            .step3-theme-card {
                                flex-direction: column;
                                gap: 12px;
                            }

                            .step3-annotation {
                                display: none;
                            }

                            .step3-arrow {
                                display: none;
                            }
                        }
                    `}
                </style>

                <div className="step3-container">
                    <div className="step3-main-card">

                        {/* Breadcrumb */}
                        <div className="step3-breadcrumb">
                            <div className="step3-breadcrumb-item">
                                <div className="step3-breadcrumb-circle done">✓</div>
                                <span className="step3-breadcrumb-label">{t("onboarding.Welcome")}</span>
                            </div>
                            <div className="step3-breadcrumb-item">
                                <div className="step3-breadcrumb-circle done">✓</div>
                                <span className="step3-breadcrumb-label">{t("onboarding.Product_Type")}</span>
                            </div>
                            <div className="step3-breadcrumb-item active">
                                <div className="step3-breadcrumb-circle active">3</div>
                                <span className="step3-breadcrumb-label">
                                    <span className="step3-breadcrumb-badge">{t("onboarding.Theme_App_Embed")}</span>
                                </span>
                            </div>
                            <div className="step3-breadcrumb-item">
                                <div className="step3-breadcrumb-circle inactive">4</div>
                                <span className="step3-breadcrumb-label">{t("onboarding.Live_Test")}</span>
                            </div>
                            <div className="step3-breadcrumb-item">
                                <div className="step3-breadcrumb-circle inactive">5</div>
                                <span className="step3-breadcrumb-label">{t("onboarding.complete")}</span>
                            </div>
                        </div>

                        {/* Main layout */}
                        <div className="step3-layout">

                            {/* Left column */}
                            <div className="step3-left-col">
                                <h1 className="step3-heading">
                                    {t("onboarding.step3_heading")}
                                </h1>
                                <p className="step3-description">
                                    {t("onboarding.step3_description")}
                                </p>

                                {/* Theme Detection Card */}
                                {themeType === "os2" ? (
                                    <div className="step3-theme-card">
                                        <svg className="step3-theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <path d="m9 11 3 3L22 4" />
                                        </svg>
                                        <div className="step3-theme-content">
                                            <div className="step3-theme-title">{t("onboarding.os2_theme_detected")}</div>
                                            <div className="step3-theme-desc">{t("onboarding.os2_theme_desc")}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="step3-theme-card warning">
                                        <svg className="step3-theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                            <line x1="12" y1="9" x2="12" y2="13" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                        <div className="step3-theme-content">
                                            <div className="step3-theme-title">{t("onboarding.vintage_theme_detected")}</div>
                                            <div className="step3-theme-desc">{t("onboarding.vintage_theme_desc")}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Automatic Install Section */}
                                {themeType === "os2" && (
                                    <>
                                        <div className="step3-section-title">
                                            {t("onboarding.add_to_theme_automatic_title")}
                                            <span className="step3-badge">{t("onboarding.recommended")}</span>
                                        </div>
                                        <p className="step3-section-desc">
                                            {t("onboarding.add_to_theme_automatic_desc")}
                                        </p>
                                        <button
                                            className="step3-primary-btn"
                                            onClick={handleOpenThemeEditor}
                                            disabled={isThemeEmbedActive}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                            {t("onboarding.add_to_theme_automatically")}
                                        </button>
                                        <div className="step3-help-text">
                                            <svg className="step3-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                                            </svg>
                                            <span>{t("onboarding.opens_theme_editor_help")}</span>
                                        </div>
                                    </>
                                )}

                            </div>

                            {/* Right column */}
                            <div className="step3-right-col">
                                {/* Product Preview */}
                                <img
                                    src="/images/step3_imgPreview.jpg"
                                    alt="Product preview"
                                    className="step3-preview-image"
                                />

                                {/* Embed Status Card */}
                                <div className={`step3-embed-card ${isThemeEmbedActive ? '' : 'pending'}`}>
                                    <div className="step3-embed-left">
                                        {isThemeEmbedActive ? (
                                            <svg className="step3-embed-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <path d="m9 11 3 3L22 4" />
                                            </svg>
                                        ) : (
                                            <svg className="step3-embed-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                        )}
                                        <div>
                                            <div className="step3-embed-title">
                                                {t("onboarding.embed_status_prefix")}: {isThemeEmbedActive ? t("onboarding.embed_status_confirmed") : t("onboarding.embed_status_not_confirmed")}
                                            </div>
                                            <div className="step3-embed-desc">
                                                {isThemeEmbedActive
                                                    ? t("onboarding.embed_status_active")
                                                    : t("onboarding.embed_status_checking")}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className={`step3-refresh-btn ${isCheckingEmbedStatus ? 'spinning' : ''}`}
                                        onClick={checkThemeEmbedStatus}
                                        disabled={isCheckingEmbedStatus}
                                        title={t("onboarding.refresh_status")}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                            <path d="M3 3v5h5" />
                                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                            <path d="M16 16h5v5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Manual Install Section - Vintage Theme */}
                        <div className="step3-manual-section">
                            <div className="step3-manual-layout">
                                {/* Left side - Heading and description */}
                                <div className="step3-manual-left">
                                    <div className="step3-manual-title">
                                        {themeType === "vintage" ? t("onboarding.manual_install_required") : t("onboarding.using_vintage_theme")}
                                    </div>
                                    <p className="step3-manual-desc">
                                        {t("onboarding.manual_install_desc")}
                                    </p>
                                    {/* Copy Snippet Button */}
                                    <button
                                        className={`step3-manual-copy-btn ${copySuccess ? 'copied' : ''}`}
                                        onClick={handleCopySnippet}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                        {copySuccess ? t("onboarding.copied") : t("onboarding.copy_snippet")}
                                    </button>
                                </div>

                                {/* Right side - Code snippet card */}
                                <div className="step3-manual-right">
                                    {/* Code Snippet Card */}
                                    <div className="step3-snippet-card">
                                        <code className="step3-snippet">
                                            {"{% render 'mirrly-try-on' %}"}
                                        </code>
                                        <button
                                            className={`step3-copy-btn ${copySuccess ? 'copied' : ''}`}
                                            onClick={handleCopySnippet}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                            </svg>
                                            {copySuccess ? t("onboarding.copied") : t("onboarding.copy")}
                                        </button>
                                    </div>

                                    {/* Recommendation with learn more link */}
                                    <div className="step3-manual-recommendation">
                                        <span className="step3-manual-recommend-text">
                                            {t("onboarding.manual_install_recommendation")}
                                        </span>
                                        <a
                                            href="https://help.shopify.com/en/manual/online-store/themes/os2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="step3-manual-learn-link"
                                        >
                                            {t("onboarding.learn_more")}
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer navigation */}
                        <div className="step3-footer">
                            <button
                                className="step3-prev-btn"
                                onClick={handleBack}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                {t("onboarding.Previous")}
                            </button>

                            <div className="step3-progress">
                                <div className="step3-dots">
                                    <div className="step3-dot active"></div>
                                    <div className="step3-dot active"></div>
                                    <div className="step3-dot active"></div>
                                    <div className="step3-dot"></div>
                                    <div className="step3-dot"></div>
                                </div>
                                <span className="step3-progress-label">3/5</span>
                            </div>

                            <button
                                className="step3-continue-btn"
                                onClick={handleNext}
                            >
                                {t("onboarding.Continue")}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (currentStep === 4) {
        // Step 4: Live Test
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

                        /* ── Step 4 Layout ── */
                        .step4-layout {
                            display: grid;
                            grid-template-columns: 46fr 54fr;
                            gap: 36px;
                            padding: 24px;
                            max-width: 1600px;
                            margin: 0 auto;
                        }

                        .step4-left-col {
                            display: flex;
                            flex-direction: column;
                            gap: 24px;
                        }

                        .step4-right-col {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }

                        /* ── Main Heading ── */
                        .step4-heading {
                            font-size: 32px;
                            font-weight: 700;
                            color: #12324B;
                            letter-spacing: -0.8px;
                            line-height: 1.2;
                            margin: 0;
                        }

                        .step4-sparkle-icon {
                            width: 18px;
                            height: 18px;
                            color: #0F8B8D;
                            flex-shrink: 0;
                            margin-left: 7px;
                            
                        }

                        /* ── Description ── */
                        .step4-description {
                            font-size: 14px;
                            color: #667085;
                            line-height: 1.5;
                            margin: 0;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }

                        /* ── Info Card ── */
                        .step4-info-card {
                            background-color: #ECF8FF;
                            border-radius: 12px;
                            padding: 16px;
                            display: flex;
                            align-items: flex-start;
                            gap: 12px;
                            border: 1px solid #B3D9EA;
                        }

                        .step4-info-icon {
                            width: 20px;
                            height: 20px;
                            color: #0F8B8D;
                            flex-shrink: 0;
                        }

                        .step4-info-content {
                            flex: 1;
                        }

                        .step4-info-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 3px;
                        }

                        .step4-info-desc {
                            font-size: 13px;
                            color: #667085;
                            line-height: 1.4;
                        }

                        /* ── Product Selector ── */
                        .step4-product-section {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }

                        .step4-section-title {
                            font-size: 15px;
                            font-weight: 600;
                            color: #12324B;
                        }

                        .step4-product-selector {
                            position: relative;
                        }

                        .step4-product-dropdown {
                            width: 100%;
                            padding: 12px 14px;
                            padding-right: 40px;
                            border: 1px solid #DCE3EA;
                            border-radius: 10px;
                            font-size: 14px;
                            color: #12324B;
                            background-color: white;
                            cursor: pointer;
                            transition: all 0.2s;
                            appearance: none;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                        }

                        .step4-product-dropdown:hover {
                            border-color: #0F8B8D;
                        }

                        .step4-product-dropdown:focus {
                            outline: none;
                            border-color: #0F8B8D;
                            box-shadow: 0 0 0 3px rgba(15, 139, 141, 0.1);
                        }

                        /* ── Custom Dropdown Styles ── */
                        .step4-custom-dropdown {
                            position: relative;
                        }

                        .step4-dropdown-trigger {
                            width: 100%;
                            padding: 10px 14px;
                            padding-right: 40px;
                            border: 1px solid #DCE3EA;
                            border-radius: 10px;
                            font-size: 14px;
                            color: #12324B;
                            background-color: white;
                            cursor: pointer;
                            transition: all 0.2s;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            min-height: 56px;
                            text-align: left;
                        }

                        .step4-dropdown-trigger:hover:not(:disabled) {
                            border-color: #0F8B8D;
                        }

                        .step4-dropdown-trigger:focus {
                            outline: none;
                            border-color: #0F8B8D;
                            box-shadow: 0 0 0 3px rgba(15, 139, 141, 0.1);
                        }

                        .step4-dropdown-trigger:disabled {
                            opacity: 0.6;
                            cursor: not-allowed;
                        }

                        .step4-dropdown-loading,
                        .step4-dropdown-empty {
                            color: #667085;
                            font-size: 14px;
                        }

                        .step4-dropdown-thumb {
                            width: 36px;
                            height: 36px;
                            border-radius: 8px;
                            object-fit: cover;
                            flex-shrink: 0;
                            background-color: #F8F9FA;
                        }

                        .step4-dropdown-thumb--placeholder {
                            width: 36px;
                            height: 36px;
                            color: #9CA3AF;
                            padding: 6px;
                            background-color: #F8F9FA;
                            border-radius: 8px;
                        }

                        .step4-dropdown-title {
                            flex: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 14px;
                            color: #12324B;
                        }

                        .step4-dropdown-chevron {
                            position: absolute;
                            right: 14px;
                            top: 50%;
                            transform: translateY(-50%);
                            pointer-events: none;
                            color: #667085;
                            width: 18px;
                            height: 18px;
                            transition: transform 0.2s;
                        }

                        .step4-dropdown-chevron--open {
                            transform: translateY(-50%) rotate(180deg);
                        }

                        .step4-dropdown-menu {
                            position: absolute;
                            top: calc(100% + 4px);
                            left: 0;
                            right: 0;
                            background: white;
                            border: 1px solid #E5E7EB;
                            border-radius: 10px;
                            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                            max-height: 300px;
                            overflow-y: auto;
                            z-index: 1000;
                        }

                        .step4-dropdown-option {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            padding: 10px 14px;
                            cursor: pointer;
                            transition: background-color 0.15s;
                            border-bottom: 1px solid #F3F4F6;
                        }

                        .step4-dropdown-option:last-child {
                            border-bottom: none;
                        }

                        .step4-dropdown-option:hover {
                            background-color: #F8F9FA;
                        }

                        .step4-dropdown-option--selected {
                            background-color: #F0F9FF;
                        }

                        .step4-dropdown-check {
                            width: 18px;
                            height: 18px;
                            color: #0F8B8D;
                            flex-shrink: 0;
                            margin-left: auto;
                        }

                        /* Search Input Styles */
                        .step4-dropdown-search {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 10px 14px;
                            border-bottom: 1px solid #E5E7EB;
                            position: sticky;
                            top: 0;
                            background: white;
                            z-index: 1;
                        }

                        .step4-search-icon {
                            width: 16px;
                            height: 16px;
                            color: #9CA3AF;
                            flex-shrink: 0;
                        }

                        .step4-search-input {
                            flex: 1;
                            border: none;
                            outline: none;
                            font-size: 14px;
                            color: #12324B;
                            background: transparent;
                            min-width: 0;
                        }

                        .step4-search-input::placeholder {
                            color: #9CA3AF;
                        }

                        .step4-search-clear {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 18px;
                            height: 18px;
                            border: none;
                            background: none;
                            cursor: pointer;
                            color: #9CA3AF;
                            padding: 0;
                            flex-shrink: 0;
                        }

                        .step4-search-clear:hover {
                            color: #667085;
                        }

                        .step4-dropdown-no-results {
                            padding: 16px 14px;
                            text-align: center;
                            color: #9CA3AF;
                            font-size: 13px;
                        }

                        .step4-dropdown-arrow {
                            position: absolute;
                            right: 14px;
                            top: 50%;
                            transform: translateY(-50%);
                            pointer-events: none;
                            color: #667085;
                            width: 18px;
                            height: 18px;
                        }

                        /* ── Empty State ── */
                        .step4-empty-state {
                            background-color: #F8F9FA;
                            border-radius: 10px;
                            padding: 10px;
                            text-align: center;
                        }

                        .step4-empty-icon {
                            width: 20px;
                            height: 20px;
                            color: #667085;
                            margin-bottom: 10px;
                        }

                        .step4-empty-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 4px;
                        }

                        .step4-empty-desc {
                            font-size: 12px;
                            color: #667085;
                            line-height: 1.4;
                        }

                        /* ── Try It Now Button ── */
                        .step4-try-button {
                            width: 100%;
                            padding: 16px 22px;
                            font-size: 16px;
                            font-weight: 600;
                            border-radius: 10px;
                            border: none;
                            cursor: pointer;
                            transition: all 0.2s;
                            background-color: #0F8B8D;
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                        }

                        .step4-try-button:hover:not(:disabled) {
                            background-color: #0C7778;
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(15, 139, 141, 0.2);
                        }

                        .step4-try-button:disabled {
                            background-color: #DCE3EA;
                            color: #667085;
                            cursor: not-allowed;
                            transform: none;
                            box-shadow: none;
                        }

                        .step4-try-button-icon {
                            width: 20px;
                            height: 20px;
                        }

                        /* ── Tips Card ── */
                        .step4-tips-card {
                            background-color: #F0F7FF;
                            border-radius: 12px;
                            padding: 16px;
                            border: 1px solid #DCE3EA;
                        }

                        .step4-tips-header {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            margin-bottom: 12px;
                        }

                        .step4-tips-icon {
                            width: 18px;
                            height: 18px;
                            color: #0F8B8D;
                        }

                        .step4-tips-icon-wrapper {
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            background-color: #E0F2F1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                        }

                        .step4-tips-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #12324B;
                        }

                        .step4-tips-list {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                        }

                        .step4-tips-item {
                            display: flex;
                            align-items: flex-start;
                            gap: 8px;
                            font-size: 13px;
                            color: #667085;
                            line-height: 1.5;
                            margin-bottom: 6px;
                        }

                        .step4-tips-item:last-child {
                            margin-bottom: 0;
                        }

                        .step4-check-icon {
                            width: 14px;
                            height: 14px;
                            color: #1F8A4D;
                            flex-shrink: 0;
                            margin-top: 2px;
                        }

                        /* ── Preview Card ── */
                        .step4-preview-card {
                            background-color: white;
                            border: 1px solid #DCE3EA;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                        }

                        .step4-preview-header {
                            background-color: #F8F9FA;
                            padding: 16px 20px;
                            border-bottom: 1px solid #DCE3EA;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        }

                        .step4-preview-title {
                            font-size: 15px;
                            font-weight: 600;
                            color: #12324B;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }

                        .step4-status-indicator {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            font-size: 13px;
                            color: #1F8A4D;
                        }

                        .step4-status-dot {
                            width: 8px;
                            height: 8px;
                            background-color: #1F8A4D;
                            border-radius: 50%;
                            animation: pulse 2s ease-in-out infinite;
                        }

                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }

                        .step4-preview-image {
                            width: 100%;
                            height: 320px;
                            object-fit: cover;
                            display: block;
                            position: relative;
                        }

                        .step4-preview-placeholder {
                            width: 100%;
                            height: 320px;
                            background: linear-gradient(135deg, #F8F9FA 0%, #EAF6FD 100%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .step4-preview-placeholder-inner {
                            text-align: center;
                            color: #667085;
                        }

                        /* ── Floating Actions ── */
                        .step4-floating-actions {
                            position: absolute;
                            top: 16px;
                            right: 16px;
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                        }

                        .step4-floating-btn {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            background-color: white;
                            border: 1px solid #DCE3EA;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            transition: all 0.2s;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        }

                        .step4-floating-btn:hover {
                            border-color: #0F8B8D;
                            transform: translateY(-2px);
                        }

                        .step4-floating-btn svg {
                            width: 18px;
                            height: 18px;
                            color: #667085;
                        }

                        /* ── Live Status Badge ── */
                        .step4-live-status {
                            position: absolute;
                            bottom: 16px;
                            left: 50%;
                            transform: translateX(-50%);
                            background-color: rgba(18, 50, 75, 0.85);
                            backdrop-filter: blur(8px);
                            padding: 10px 16px;
                            border-radius: 24px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            color: white;
                            font-size: 14px;
                            font-weight: 500;
                        }

                        .step4-live-status-dot {
                            width: 8px;
                            height: 8px;
                            background-color: #4CAF50;
                            border-radius: 50%;
                            animation: pulse 1.5s ease-in-out infinite;
                        }

                        /* ── Feedback Section ── */
                        .step4-feedback-section {
                            padding: 20px;
                            border-top: 1px solid #DCE3EA;
                            background-color: #F8F9FA;
                        }

                        .step4-feedback-title {
                            font-size: 15px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 12px;
                        }

                        .step4-feedback-buttons {
                            display: flex;
                            gap: 12px;
                        }

                        .step4-feedback-btn {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            padding: 12px 16px;
                            border-radius: 10px;
                            border: 1.5px solid #DCE3EA;
                            background-color: white;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 14px;
                            font-weight: 500;
                            color: #667085;
                        }

                        .step4-feedback-btn:hover {
                            border-color: #0F8B8D;
                            background-color: #F0F7FF;
                        }

                        .step4-feedback-btn.positive.selected {
                            background-color: #ECFDF5;
                            border-color: #1F8A4D;
                            color: #1F8A4D;
                        }

                        .step4-feedback-btn.negative.selected {
                            background-color: #FFF7E6;
                            border-color: #B56A00;
                            color: #B56A00;
                        }

                        .step4-feedback-btn svg {
                            width: 18px;
                            height: 18px;
                        }

                        /* ── Camera Modal ── */
                        .step4-camera-iframe {
                            width: 100%;
                            height: 500px;
                            border: none;
                            border-radius: 12px;
                            background-color: #f5f5f5;
                        }

                        /* ── Responsive Design ── */
                        @media (max-width: 1024px) {
                            .step4-layout {
                                grid-template-columns: 1fr;
                                gap: 32px;
                            }

                            .step4-right-col {
                                order: 2;
                            }
                        }

                        @media (max-width: 768px) {
                            .step4-layout {
                                padding: 24px;
                                gap: 24px;
                            }

                            .step4-heading {
                                font-size: 32px;
                            }

                            .step4-preview-image {
                                height: 280px;
                            }

                            .step4-preview-placeholder {
                                height: 280px;
                            }
                        }

                        @media (max-width: 480px) {
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

                            .step4-layout {
                                padding: 16px;
                            }

                            .step4-heading {
                                font-size: 28px;
                            }

                            .step4-feedback-buttons {
                                flex-direction: column;
                            }
                        }

                        /* ── Wrapper padding for responsive spacing ── */
                        .onboarding-step-4-wrapper {
                            padding: 0;
                            max-width: 100%;
                        }

                        /* Override Polaris Page and Card width constraints for Step 4 */
                        .onboarding-step-4-wrapper > div {
                            max-width: 1600px !important;
                        }

                        .onboarding-step-4-wrapper .Polari-Card {
                            max-width: 100% !important;
                        }

                        @media (max-width: 495px) {
                            .onboarding-step-4-wrapper {
                                padding: 0;
                            }

                            .ob2-steps {
                                padding: 0 8px;
                            }
                        }
                    `}
                </style>

                <div className="onboarding-step-4-wrapper">
                    <Page>
                        <Card>
                            {/* ── Step breadcrumb ── */}
                            <Box paddingInline="600" paddingBlockEnd="400">
                                <div className="ob2-steps">

                                    {/* Step 1 – done */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--done">✓</div>
                                        <span className="ob2-step-label">{t("onboarding.Welcome")}</span>
                                    </div>

                                    {/* Step 2 – done */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--done">✓</div>
                                        <span className="ob2-step-label">{t("onboarding.Product_Type")}</span>
                                    </div>

                                    {/* Step 3 – done */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--done">✓</div>
                                        <span className="ob2-step-label">{t("onboarding.Theme_App_Embed")}</span>
                                    </div>

                                    {/* Step 4 – active */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--active">4</div>
                                        <span className="ob2-step-label">
                                            <button className="ob2-step-badge">
                                                {t("onboarding.Live_Test")}
                                            </button>
                                        </span>
                                    </div>

                                    {/* Step 5 */}
                                    <div className="ob2-step-pill">
                                        <div className="ob2-step-circle ob2-step-circle--inactive">5</div>
                                        <span className="ob2-step-label">{t("onboarding.congratulations")}</span>
                                    </div>

                                </div>
                            </Box>

                            {/* ── Main Layout ── */}
                            <div className="step4-layout">

                                {/* ── Left Column ── */}
                                <div className="step4-left-col">
                                    {/* Main Heading */}
                                    <h1 className="step4-heading">
                                        {t("onboarding.live_test_title")}
                                        <svg className="step4-sparkle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                        </svg>
                                    </h1>

                                    {/* Description with Sparkle */}
                                    <p className="step4-description">
                                        {t("onboarding.live_test_description")}
                                    </p>

                                    {/* Info Card */}
                                    <div className="step4-info-card">
                                        <svg className="step4-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                            <circle cx="12" cy="13" r="3" />
                                        </svg>
                                        <div className="step4-info-content">
                                            <div className="step4-info-title">{t("onboarding.live_test_info_title")}</div>
                                            <div className="step4-info-desc">{t("onboarding.live_test_info_desc")}</div>
                                        </div>
                                    </div>

                                    {/* Product Selector */}
                                    <div className="step4-product-section">
                                        <div className="step4-section-title">{t("onboarding.select_product_to_test")}</div>
                                        <div className="step4-product-selector">
                                            {/* Custom Product Dropdown */}
                                            <div className="step4-custom-dropdown">
                                                <button
                                                    type="button"
                                                    className="step4-dropdown-trigger"
                                                    onClick={() => !isLoadingProducts && collectionProducts.length > 0 && setIsProductDropdownOpen(!isProductDropdownOpen)}
                                                    disabled={isLoadingProducts || collectionProducts.length === 0}
                                                >
                                                    {isLoadingProducts ? (
                                                        <span className="step4-dropdown-loading">{t("onboarding.loading_products")}</span>
                                                    ) : liveTestProduct ? (
                                                        <>
                                                            {liveTestProduct.image?.src ? (
                                                                <img
                                                                    src={liveTestProduct.image.src}
                                                                    alt={liveTestProduct.title}
                                                                    className="step4-dropdown-thumb"
                                                                />
                                                            ) : (
                                                                <svg className="step4-dropdown-thumb step4-dropdown-thumb--placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                                                                    <path d="m9 22 1-7" />
                                                                    <path d="m16 22-1-7" />
                                                                </svg>
                                                            )}
                                                            <span className="step4-dropdown-title">{liveTestProduct.title}</span>
                                                        </>
                                                    ) : collectionProducts.length === 0 ? (
                                                        <span className="step4-dropdown-empty">{t("onboarding.no_product_available")}</span>
                                                    ) : null}
                                                    <svg className={`step4-dropdown-chevron ${isProductDropdownOpen ? 'step4-dropdown-chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="m6 9 6 6 6-6" />
                                                    </svg>
                                                </button>

                                                {/* Dropdown Menu */}
                                                {isProductDropdownOpen && (
                                                    <div className="step4-dropdown-menu">
                                                        {/* Search Input */}
                                                        <div className="step4-dropdown-search">
                                                            <svg className="step4-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="11" cy="11" r="8" />
                                                                <path d="m21 21-4.35-4.35" />
                                                            </svg>
                                                            <input
                                                                type="text"
                                                                className="step4-search-input"
                                                                placeholder={t("onboarding.search_products_placeholder")}
                                                                value={productSearchQuery}
                                                                onChange={(e) => setProductSearchQuery(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            {productSearchQuery && (
                                                                <button
                                                                    className="step4-search-clear"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setProductSearchQuery('');
                                                                    }}
                                                                >
                                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M18 6 6 18" />
                                                                        <path d="m6 6 12 12" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Filtered Products */}
                                                        {collectionProducts
                                                            .filter(product =>
                                                                product.title.toLowerCase().includes(productSearchQuery.toLowerCase())
                                                            )
                                                            .map((product) => (
                                                            <div
                                                                key={product.id}
                                                                className={`step4-dropdown-option ${liveTestProduct?.id === product.id ? 'step4-dropdown-option--selected' : ''}`}
                                                                onClick={() => {
                                                                    setLiveTestProduct(product);
                                                                    setIsProductDropdownOpen(false);
                                                                    setProductSearchQuery('');
                                                                }}
                                                            >
                                                                {product.image?.src ? (
                                                                    <img
                                                                        src={product.image.src}
                                                                        alt={product.title}
                                                                        className="step4-dropdown-thumb"
                                                                    />
                                                                ) : (
                                                                    <svg className="step4-dropdown-thumb step4-dropdown-thumb--placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                                                                        <path d="m9 22 1-7" />
                                                                        <path d="m16 22-1-7" />
                                                                    </svg>
                                                                )}
                                                                <span className="step4-dropdown-title">{product.title}</span>
                                                                {liveTestProduct?.id === product.id && (
                                                                    <svg className="step4-dropdown-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M20 6L9 17l-5-5" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        ))}

                                                        {/* No Results Message */}
                                                        {collectionProducts.filter(product =>
                                                            product.title.toLowerCase().includes(productSearchQuery.toLowerCase())
                                                        ).length === 0 && (
                                                            <div className="step4-dropdown-no-results">
                                                                {t("onboarding.no_products_found")}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Try It Now Button */}
                                    <button
                                        className="step4-try-button"
                                        onClick={() => setIsCameraModalOpen(true)}
                                        disabled={!liveTestProduct}
                                    >
                                        <svg className="step4-try-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                            <circle cx="12" cy="13" r="3" />
                                        </svg>
                                        {t("onboarding.try_it_now")}
                                    </button>

                                    {/* Tips Card */}
                                    <div className="step4-tips-card">
                                        <div className="step4-tips-header">
                                            <div className="step4-tips-icon-wrapper">
                                                <svg className="step4-tips-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                                                    <path d="M9 18h6" />
                                                    <path d="M10 22h4" />
                                                </svg>
                                            </div>
                                            <span className="step4-tips-title">{t("onboarding.tips_title")}</span>
                                        </div>
                                        <ul className="step4-tips-list">
                                            <li className="step4-tips-item">
                                                <svg className="step4-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                    <path d="m9 11 3 3L22 4" />
                                                </svg>
                                                {t("onboarding.tip_1")}
                                            </li>
                                            <li className="step4-tips-item">
                                                <svg className="step4-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                    <path d="m9 11 3 3L22 4" />
                                                </svg>
                                                {t("onboarding.tip_2")}
                                            </li>
                                            <li className="step4-tips-item">
                                                <svg className="step4-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                    <path d="m9 11 3 3L22 4" />
                                                </svg>
                                                {t("onboarding.tip_3")}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* ── Right Column ── */}
                                <div className="step4-right-col">
                                    {/* Preview Card */}
                                    <div className="step4-preview-card">
                                        <div className="step4-preview-header">
                                            <div className="step4-preview-title">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                                    <circle cx="12" cy="13" r="3" />
                                                </svg>
                                                {t("onboarding.live_try_on")}
                                            </div>
                                            <div className="step4-status-indicator">
                                                <div className="step4-status-dot"></div>
                                                {t("onboarding.ready")}
                                            </div>
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                            <div className="step4-preview-placeholder" style={{ display: 'flex' }}>
                                                <div className="step4-preview-placeholder-inner">
                                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#DCE3EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                                                    </svg>
                                                    <div style={{ marginTop: '12px', fontSize: '14px' }}>{t("onboarding.product_preview")}</div>
                                                </div>
                                            </div>

                                            {/* Live Status Badge (visible during processing) */}
                                            {isCameraModalOpen && (
                                                <div className="step4-live-status">
                                                    <div className="step4-live-status-dot"></div>
                                                    {t("onboarding.working_on_your_look")}
                                                </div>
                                            )}

                                            {/* Floating Actions */}
                                            <div className="step4-floating-actions">
                                                <button
                                                    className="step4-floating-btn"
                                                    onClick={() => {
                                                        // Refresh functionality if needed
                                                    }}
                                                    title={t("onboarding.refresh")}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                                        <path d="M21 3v5h-5" />
                                                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                                        <path d="M8 16H3v5" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="step4-floating-btn"
                                                    onClick={() => {
                                                        // Switch to next product if available
                                                        if (collectionProducts.length > 1) {
                                                            const currentIndex = collectionProducts.findIndex(p => p.id === liveTestProduct?.id);
                                                            const nextIndex = (currentIndex + 1) % collectionProducts.length;
                                                            setLiveTestProduct(collectionProducts[nextIndex]);
                                                        }
                                                    }}
                                                    title={t("onboarding.change_apparel")}
                                                    disabled={collectionProducts.length <= 1}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                                                        <path d="m9 22 1-7" />
                                                        <path d="m16 22-1-7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Feedback Section */}
                                        <div className="step4-feedback-section">
                                            <div className="step4-feedback-title">{t("onboarding.how_did_it_go")}</div>
                                            <div className="step4-feedback-buttons">
                                                <button
                                                    className={`step4-feedback-btn positive ${testFeedback === 'positive' ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setTestFeedback('positive');
                                                        setShowPhotoTip(false);
                                                    }}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                                    </svg>
                                                    {t("onboarding.looks_great")}
                                                </button>
                                                <button
                                                    className={`step4-feedback-btn negative ${testFeedback === 'negative' ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setTestFeedback('negative');
                                                        setShowPhotoTip(true);
                                                    }}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                                                    </svg>
                                                    {t("onboarding.needs_better_photo")}
                                                </button>
                                            </div>
                                            {showPhotoTip && (
                                                <div style={{ marginTop: '16px', fontSize: '13px', color: '#667085', lineHeight: '1.5' }}>
                                                    💡 {t("onboarding.photo_tip_message")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* ── Camera Modal ── */}
                            {isCameraModalOpen && (
                                <Modal
                                    open={isCameraModalOpen}
                                    onClose={() => setIsCameraModalOpen(false)}
                                    title={t("onboarding.live_test_camera_title")}
                                    large
                                >
                                    <Modal.Section>
                                        <div style={{ width: "100%", height: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <iframe
                                                src={`/api/try-on-session?product_id=${liveTestProduct?.id || ''}`}
                                                className="step4-camera-iframe"
                                                title={t("onboarding.live_test_camera")}
                                            />
                                        </div>
                                    </Modal.Section>
                                </Modal>
                            )}

                            {/* ── Footer navigation ── */}
                            <Box padding="600" paddingBlockStart="400">
                                <div className="ob2-footer">

                                    {/* Previous */}
                                    <button
                                        className="ob2-btn ob2-btn-prev"
                                        onClick={handleBack}
                                    >
                                        <span>‹</span>
                                        {t("onboarding.Previous")}
                                    </button>

                                    {/* Progress */}
                                    <div className="ob2-progress">
                                        <div className="ob2-dots">
                                            <div className="ob2-dot ob2-dot--active" />
                                            <div className="ob2-dot ob2-dot--active" />
                                            <div className="ob2-dot ob2-dot--active" />
                                            <div className="ob2-dot ob2-dot--active" />
                                            <div className="ob2-dot ob2-dot--inactive" />
                                        </div>
                                        <span className="ob2-progress-label">4/5</span>
                                    </div>

                                    {/* Continue */}
                                    <button
                                        className="ob2-btn ob2-btn-next"
                                        onClick={handleNext}
                                    >
                                        {t("onboarding.Continue")}
                                    </button>

                                </div>
                            </Box>

                        </Card>
                    </Page>
                </div>
            </>
        );
    }

    if (currentStep === 5) {
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

                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }

                        @keyframes pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
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

                        /* ── Main two-column layout ── */
                        .step5-layout {
                            display: grid;
                            grid-template-columns: 34fr 66fr;
                            gap: 24px;
                            max-width: 1400px;
                            margin: 0 auto;
                            animation: slideUp 0.4s ease-out;
                            align-items: stretch;
                        }

                        /* ── Left column ── */
                        .step5-left-col {
                            display: flex;
                            flex-direction: column;
                            gap: 24px;
                        }

                        .step5-left-col > .Card,
                        .step5-right-col > .Card {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                        }

                        /* ── Celebration section ── */
                        .step5-celebration {
                            text-align: center;
                            padding: 16px 20px;
                        }

                        .step5-celebration-emoji {
                            font-size: 32px;
                            margin-bottom: 8px;
                            animation: bounceIn 0.6s ease-out;
                        }

                        .step5-celebration-title {
                            font-size: 18px;
                            font-weight: 700;
                            color: #12324B;
                            line-height: 1.2;
                            letter-spacing: -0.6px;
                            margin-bottom: 8px;
                        }

                        .step5-celebration-desc {
                            font-size: 13px;
                            color: #667085;
                            line-height: 1.4;
                        }

                        /* ── Summary card ── */
                        .step5-summary-card {
                            background: white;
                            border-radius: 16px;
                            padding: 24px;
                            margin-top:8px;
                            border: 1px solid #DCE3EA;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
                        }

                        .step5-card-title {
                            font-size: 18px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 20px;
                            letter-spacing: -0.3px;
                        }

                        .step5-summary-row {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            padding: 12px 0;
                            border-bottom: 1px solid #F0F2F5;
                        }

                        .step5-summary-row:last-child {
                            border-bottom: none;
                        }

                        .step5-summary-icon {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                        }

                        .step5-summary-icon.teal {
                            background-color: #E0F2F1;
                        }

                        .step5-summary-icon.blue {
                            background-color: #EAF6FD;
                        }

                        .step5-summary-icon.purple {
                            background-color: #F3E8FF;
                        }

                        .step5-summary-content {
                            flex: 1;
                        }

                        .step5-summary-label {
                            font-size: 14px;
                            font-weight: 600;
                            color: #12324B;
                        }

                        .step5-summary-desc {
                            font-size: 13px;
                            color: #667085;
                            margin-top: 2px;
                        }

                        .step5-summary-badge {
                            padding: 4px 12px;
                            border-radius: 16px;
                            font-size: 12px;
                            font-weight: 600;
                            white-space: nowrap;
                        }

                        .step5-summary-badge.success {
                            background-color: #DDF8EA;
                            color: #1F8A4D;
                        }

                        .step5-summary-badge.active {
                            background-color: #DDF8EA;
                            color: #1F8A4D;
                        }

                        .step5-summary-badge.completed {
                            background-color: #E0F2F1;
                            color: #088395;
                        }

                        /* ── Ready card ── */
                        .step5-ready-card {
                            background: linear-gradient(135deg, #ECF8FF 0%, #E0F2F1 100%);
                            border-radius: 16px;
                            padding: 12px;
                            margin-top: 10px;
                            border: 1px solid #B8E4E9;
                        }

                        .step5-ready-content {
                            display: flex;
                            align-items: flex-start;
                            gap: 10px;
                        }

                        .step5-ready-icon {
                            width: 33px;
                            height: 33px;
                            border-radius: 50%;
                            background-color: #0F8B8D;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                        }

                        .step5-ready-text {
                            flex: 1;
                        }

                        .step5-ready-title {
                            font-size: 17px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 4px;
                        }

                        .step5-ready-desc {
                            font-size: 15px;
                            color: #667085;
                            line-height: 1.4;
                        }

                        /* ── Right column ── */
                        .step5-right-col {
                            display: flex;
                            flex-direction: column;
                        }

                        .step5-heading {
                            font-size: 24px;
                            font-weight: 700;
                            color: #12324B;
                            line-height: 1.2;
                            letter-spacing: -0.8px;
                            margin-bottom: 12px;
                        }

                        .step5-subheading {
                            font-size: 15px;
                            color: #667085;
                            line-height: 1.5;
                            margin-bottom: 32px;
                        }

                        /* ── Billing toggle ── */
                        .step5-billing-toggle {
                            display: inline-flex;
                            background-color: #F0F2F5;
                            border-radius: 10px;
                            padding: 4px;
                            margin-bottom: 32px;
                        }

                        .step5-toggle-option {
                            padding: 10px 24px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            color: #667085;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            border: none;
                            background: transparent;
                        }

                        .step5-toggle-option:hover {
                            color: #12324B;
                        }

                        .step5-toggle-option.active {
                            background-color: white;
                            color: #0F8B8D;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        }

                        .step5-toggle-discount {
                            background-color: #DDF8EA;
                            color: #1F8A4D;
                            padding: 2px 8px;
                            border-radius: 12px;
                            font-size: 11px;
                            margin-left: 4px;
                        }

                        /* ── Plan cards ── */
                        .step5-plan-cards {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 16px;
                            margin-bottom: 24px;
                        }

                        .step5-plan-card {
                            background: white;
                            border: 2px solid #DCE3EA;
                            border-radius: 16px;
                            padding: 24px;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                        }

                        .step5-plan-card:hover {
                            border-color: #0F8B8D;
                            box-shadow: 0 4px 16px rgba(15, 139, 141, 0.12);
                            transform: translateY(-2px);
                        }

                        .step5-plan-card.selected {
                            border-color: #0F8B8D;
                            box-shadow: 0 4px 20px rgba(15, 139, 141, 0.2);
                        }

                        .step5-plan-badge {
                            position: absolute;
                            top: -10px;
                            left: 50%;
                            transform: translateX(-50%);
                            padding: 4px 12px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: 600;
                            white-space: nowrap;
                        }

                        .step5-plan-badge.recommended {
                            background-color: #E0F2F1;
                            color: #088395;
                            border: 1px solid #B8E4E9;
                        }

                        .step5-plan-badge.popular {
                            background-color: #DDF8EA;
                            color: #1F8A4D;
                            border: 1px solid #B8E4E9;
                        }

                        .step5-plan-name {
                            font-size: 18px;
                            font-weight: 600;
                            color: #12324B;
                            margin-bottom: 8px;
                        }

                        .step5-plan-price {
                            font-size: 28px;
                            font-weight: 700;
                            color: #0F8B8D;
                            margin-bottom: 4px;
                        }

                        .step5-plan-subtitle {
                            font-size: 13px;
                            font-weight: 500;
                            color: #667085;
                            margin-bottom: 12px;
                        }

                        .step5-plan-features {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                            flex: 1;
                        }

                        .step5-plan-feature {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            font-size: 13px;
                            color: #667085;
                        }

                        .step5-plan-feature svg {
                            width: 16px;
                            height: 16px;
                            color: #1F8A4D;
                            flex-shrink: 0;
                        }

                        .step5-plan-bottom {
                            margin-top: 16px;
                            padding-top: 16px;
                            border-top: 1px solid #F0F2F5;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .step5-plan-selected {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            color: #088395;
                            font-weight: 600;
                            font-size: 14px;
                        }

                        .step5-plan-radio {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            color: #667085;
                            font-size: 14px;
                            font-weight: 500;
                        }

                        .step5-radio-circle {
                            width: 20px;
                            height: 20px;
                            border: 2px solid #DCE3EA;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.2s ease;
                        }

                        .step5-plan-card.selected .step5-radio-circle {
                            border-color: #0F8B8D;
                            background-color: #0F8B8D;
                        }

                        .step5-radio-inner {
                            width: 8px;
                            height: 8px;
                            background-color: white;
                            border-radius: 50%;
                            opacity: 0;
                            transition: all 0.2s ease;
                        }

                        .step5-plan-card.selected .step5-radio-inner {
                            opacity: 1;
                        }

                        /* ── Bottom message ── */
                        .step5-bottom-message {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            padding: 16px;
                            background-color: #F8F9FA;
                            border-radius: 12px;
                            margin-bottom: 24px;
                        }

                        .step5-bottom-message svg {
                            width: 16px;
                            height: 16px;
                            color: #667085;
                        }

                        .step5-bottom-message-text {
                            font-size: 14px;
                            color: #667085;
                        }

                        /* ── Footer navigation ── */
                        .step5-footer {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding-top: 24px;
                            border-top: 1px solid #DCE3EA;
                        }

                        .step5-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-size: 15px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            border: none;
                        }

                        .step5-btn-prev {
                            background-color: white;
                            color: #12324B;
                            border: 1.5px solid #DCE3EA;
                        }

                        .step5-btn-prev:hover:not(:disabled) {
                            background-color: #F8F9FA;
                            border-color: #C1C8CD;
                        }

                        .step5-btn-prev:disabled {
                            opacity: 0.5;
                            cursor: not-allowed;
                        }

                        .step5-btn-dashboard {
                            background-color: #0F8B8D;
                            color: white;
                            padding: 12px 28px;
                        }

                        .step5-btn-dashboard:hover {
                            background-color: #0C7778;
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(15, 139, 141, 0.25);
                        }

                        /* ── Progress dots ── */
                        .step5-progress {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }

                        .step5-dot {
                            width: 32px;
                            height: 5px;
                            border-radius: 3px;
                            background-color: #0F8B8D;
                        }

                        .step5-progress-label {
                            font-size: 14px;
                            font-weight: 600;
                            color: #0F8B8D;
                        }

                        /* ── Responsive ── */
                        @media (max-width: 1024px) {
                            .step5-layout {
                                grid-template-columns: 1fr;
                                gap: 32px;
                            }

                            .step5-plan-cards {
                                grid-template-columns: repeat(2, 1fr);
                            }
                        }

                        @media (max-width: 768px) {
                            .step5-celebration-emoji {
                                font-size: 48px;
                            }

                            .step5-celebration-title {
                                font-size: 24px;
                            }

                            .step5-heading {
                                font-size: 28px;
                            }

                            .step5-plan-cards {
                                grid-template-columns: 1fr;
                            }

                            .step5-footer {
                                flex-direction: column;
                                gap: 16px;
                            }

                            .step5-btn {
                                width: 100%;
                                justify-content: center;
                            }

                            .step5-progress {
                                justify-content: center;
                            }
                        }

                        /* ── Wrapper padding ── */
                        .onboarding-step-5-wrapper {
                            padding: 0;
                            max-width: 100%;
                            overflow-x: hidden;
                        }

                        /* ── Card container width ── */
                        .onboarding-step-5-wrapper .Card {
                            max-width: 100%;
                        }
                    `}
                </style>

                <div className="onboarding-step-5-wrapper">
                    <Page fullWidth>
                        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
                            <Card>
                                <div style={{ padding: "24px" }}>

                                    {/* Step breadcrumb */}
                                    <Box paddingBlockEnd="400">
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
                                                <span className="ob4-step-label">{t("onboarding.Theme_App_Embed")}</span>
                                            </div>

                                            {/* Step 4 – done */}
                                            <div className="ob4-step-pill">
                                                <div className="ob4-step-circle ob4-step-circle--done">✓</div>
                                                <span className="ob4-step-label">{t("onboarding.Live_Test")}</span>
                                            </div>

                                            {/* Step 5 – active */}
                                            <div className="ob4-step-pill">
                                                <div className="ob4-step-circle ob4-step-circle--active">5</div>
                                                <span className="ob4-step-label">
                                                    <button className="ob4-step-badge">
                                                        {t("onboarding.congratulations")}
                                                    </button>
                                                </span>
                                            </div>

                                        </div>
                                    </Box>

                                    {/* Main two-column layout */}
                                    <div className="step5-layout">

                                        {/* Left Column */}
                                        <div className="step5-left-col">

                                            {/* Left Column Card */}
                                            <Card>
                                                <div style={{ padding: "0px" }}>
                                                    {/* Celebration Section */}
                                                    <div className="step5-celebration">
                                                        <div className="step5-celebration-emoji">🎉</div>
                                                        <h1 className="step5-celebration-title">
                                                            {t("onboarding.You_all_set_up_and_ready_to_go")}
                                                        </h1>
                                                        <p className="step5-celebration-desc">
                                                            {t("onboarding.step5_celebration_desc")}
                                                        </p>
                                                    </div>

                                                    {/* Setup Summary Card */}
                                                    <div className="step5-summary-card">
                                                        <h3 className="step5-card-title">{t("onboarding.setup_summary")}</h3>

                                                        {/* Products enabled */}
                                                        <div className="step5-summary-row">
                                                            <div className="step5-summary-icon teal">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#088395" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                                                </svg>
                                                            </div>
                                                            <div className="step5-summary-content">
                                                                <div className="step5-summary-label">
                                                                    {productCount === 1 ? t("onboarding.product_enabled") : t("onboarding.products_enabled")}
                                                                </div>
                                                                <div className="step5-summary-desc">
                                                                    {productCount} {productCount === 1 ? t("onboarding.product_enabled") : t("onboarding.products_enabled")}
                                                                </div>
                                                            </div>
                                                            <span className="step5-summary-badge active">{t("onboarding.active")}</span>
                                                        </div>

                                                        {/* Theme app embed */}
                                                        <div className="step5-summary-row">
                                                            <div className="step5-summary-icon blue">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#088395" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="16 18 22 12 16 6" />
                                                                    <polyline points="8 6 2 12 8 18" />
                                                                </svg>
                                                            </div>
                                                            <div className="step5-summary-content">
                                                                <div className="step5-summary-label">{t("onboarding.theme_embed_status")}</div>
                                                                <div className="step5-summary-desc">
                                                                    {t("onboarding.try-on_live_discription")}
                                                                </div>
                                                            </div>
                                                            <span className="step5-summary-badge success">{t("onboarding.active")}</span>
                                                        </div>

                                                        {/* Live test completed */}
                                                        <div className="step5-summary-row">
                                                            <div className="step5-summary-icon purple">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#088395" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                                                    <circle cx="12" cy="13" r="3" />
                                                                </svg>
                                                            </div>
                                                            <div className="step5-summary-content">
                                                                <div className="step5-summary-label">{t("onboarding.Live_Test")}</div>
                                                                <div className="step5-summary-desc">
                                                                    {liveTestProduct ? liveTestProduct.title : t("onboarding.live_test_title")}
                                                                </div>
                                                            </div>
                                                            <span className="step5-summary-badge completed">{t("onboarding.test_completed")}</span>
                                                        </div>
                                                    </div>

                                                    {/* Ready Card */}
                                                    <div className="step5-ready-card">
                                                        <div className="step5-ready-content">
                                                            <div className="step5-ready-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <circle cx="12" cy="12" r="10" />
                                                                    <path d="M12 16v-4" />
                                                                    <path d="M12 8h.01" />
                                                                </svg>
                                                            </div>
                                                            <div className="step5-ready-text">
                                                                <div className="step5-ready-title">{t("onboarding.you_are_ready_go")}</div>
                                                                <div className="step5-ready-desc">
                                                                    {t("onboarding.you_are_ready_go_desc")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>

                                        {/* Right Column */}
                                        <div className="step5-right-col">
                                            <Card>
                                                <div style={{ padding: "0px" }}>
                                                    <h1 className="step5-heading">{t("onboarding.choose_your_plan")}</h1>
                                                    <p className="step5-subheading">{t("onboarding.plan_selection_subtitle")}</p>

                                                    {/* Billing Toggle */}
                                                    <div className="step5-billing-toggle">
                                                        <button
                                                            className={`step5-toggle-option ${true ? 'active' : ''}`}
                                                            onClick={() => { }}
                                                        >
                                                            {t("plans.monthly.title")}
                                                        </button>
                                                        <button
                                                            className={`step5-toggle-option ${false ? 'active' : ''}`}
                                                            onClick={() => { }}
                                                        >
                                                            {t("plans.yearly.title")}
                                                            <span className="step5-toggle-discount">{t("onboarding.save_20_percent")}</span>
                                                        </button>
                                                    </div>

                                                    {/* Plan Cards */}
                                                    <div className="step5-plan-cards">

                                                        {/* Starter Plan */}
                                                        <div
                                                            className={`step5-plan-card ${selectedPlan === "starter" ? "selected" : ""}`}
                                                            onClick={() => setSelectedPlan("starter")}
                                                        >
                                                            {selectedPlan === "starter" && (
                                                                <div className="step5-plan-badge recommended">{t("onboarding.recommended")}</div>
                                                            )}
                                                            <div className="step5-plan-name">{t("onboarding.starter_plan")}</div>
                                                            <div className="step5-plan-price">{t("onboarding.starter_price")}</div>
                                                            <div className="step5-plan-subtitle">{t("onboarding.starter_sessions")}</div>
                                                            <div className="step5-plan-features">
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.all_core_features")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.up_to_50_sessions")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.standard_quality")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.email_support")}
                                                                </div>
                                                            </div>
                                                            <div className="step5-plan-bottom">
                                                                {selectedPlan === "starter" ? (
                                                                    <div className="step5-plan-selected">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                                            <polyline points="22 4 12 14.01 9 11.01" />
                                                                        </svg>
                                                                        {t("onboarding.selected")}
                                                                    </div>
                                                                ) : (
                                                                    <div className="step5-plan-radio">
                                                                        <div className="step5-radio-circle">
                                                                            <div className="step5-radio-inner"></div>
                                                                        </div>
                                                                        {t("onboarding.choose_plan_btn")}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Growth Plan */}
                                                        <div
                                                            className={`step5-plan-card ${selectedPlan === "growth" ? "selected" : ""}`}
                                                            onClick={() => setSelectedPlan("growth")}
                                                        >
                                                            <div className="step5-plan-badge popular">{t("onboarding.popular")}</div>
                                                            <div className="step5-plan-name">{t("onboarding.growth_plan")}</div>
                                                            <div className="step5-plan-price">{t("onboarding.growth_price")}</div>
                                                            <div className="step5-plan-subtitle">{t("onboarding.growth_sessions")}</div>
                                                            <div className="step5-plan-features">
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.all_core_features")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.up_to_500_sessions")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.high_quality")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.priority_support")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.usage_analytics")}
                                                                </div>
                                                            </div>
                                                            <div className="step5-plan-bottom">
                                                                {selectedPlan === "growth" ? (
                                                                    <div className="step5-plan-selected">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                                            <polyline points="22 4 12 14.01 9 11.01" />
                                                                        </svg>
                                                                        {t("onboarding.selected")}
                                                                    </div>
                                                                ) : (
                                                                    <div className="step5-plan-radio">
                                                                        <div className="step5-radio-circle">
                                                                            <div className="step5-radio-inner"></div>
                                                                        </div>
                                                                        {t("onboarding.choose_plan_btn")}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Scale Plan */}
                                                        <div
                                                            className={`step5-plan-card ${selectedPlan === "scale" ? "selected" : ""}`}
                                                            onClick={() => setSelectedPlan("scale")}
                                                        >
                                                            <div className="step5-plan-name">{t("onboarding.scale_plan")}</div>
                                                            <div className="step5-plan-price">{t("onboarding.scale_price")}</div>
                                                            <div className="step5-plan-subtitle">{t("onboarding.unlimited_sessions")}</div>
                                                            <div className="step5-plan-features">
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.all_core_features")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.unlimited_sessions_short")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.highest_quality")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.priority_support")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.usage_analytics")}
                                                                </div>
                                                                <div className="step5-plan-feature">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                    {t("onboarding.early_access_features")}
                                                                </div>
                                                            </div>
                                                            <div className="step5-plan-bottom">
                                                                {selectedPlan === "scale" ? (
                                                                    <div className="step5-plan-selected">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                                            <polyline points="22 4 12 14.01 9 11.01" />
                                                                        </svg>
                                                                        {t("onboarding.selected")}
                                                                    </div>
                                                                ) : (
                                                                    <div className="step5-plan-radio">
                                                                        <div className="step5-radio-circle">
                                                                            <div className="step5-radio-inner"></div>
                                                                        </div>
                                                                        {t("onboarding.choose_plan_btn")}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                        </svg>
                                                        <span style={{ fontSize: '13px', color: '#667085' }}>{t("onboarding.free_trial_note")}</span>
                                                    </div>

                                                </div>
                                            </Card>

                                        </div>
                                    </div>


                                    {/* Footer Navigation */}
                                    <div className="step5-footer">

                                        {/* Previous Button */}
                                        <button
                                            className="step5-btn step5-btn-prev"
                                            onClick={handleBack}
                                            disabled={currentStep === 1}
                                        >
                                            <span>←</span>
                                            {t("onboarding.Previous")}
                                        </button>

                                        {/* Progress Indicator */}
                                        <div className="step5-progress">
                                            <div className="step5-dot"></div>
                                            <div className="step5-dot"></div>
                                            <div className="step5-dot"></div>
                                            <div className="step5-dot"></div>
                                            <div className="step5-dot"></div>
                                            <span className="step5-progress-label">5/5</span>
                                        </div>

                                        {/* Go to Dashboard Button */}
                                        <button
                                            className="step5-btn step5-btn-dashboard"
                                            onClick={async () => {
                                                // Set onboarding completed flag
                                                try {
                                                    await fetch("/api/complete-onboarding", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            selectedPlan: selectedPlan,
                                                            productsEnabled: productCount,
                                                            themeEmbedActive: isThemeEmbedActive,
                                                            testCompleted: testFeedback !== null,
                                                        }),
                                                    });
                                                    console.log("Onboarding completed successfully");
                                                } catch (error) {
                                                    console.error("Error completing onboarding:", error);
                                                }

                                                sessionStorage.setItem("onboardingJustCompleted", "true");
                                                sessionStorage.setItem("selectedPlan", selectedPlan);
                                                navigate("/");
                                            }}
                                        >
                                            {t("onboarding.go_to_dashboard")}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                                                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                                            </svg>
                                        </button>

                                    </div>

                                </div>
                            </Card>
                        </div>
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
                                    {t("onboarding.Continue")}
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
