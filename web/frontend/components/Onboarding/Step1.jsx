import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Page,
    Card,
    Button,
    Text,
    InlineStack,
    Frame,
    Grid,
    ButtonGroup,
    BlockStack,
    Link,
    SkeletonPage,
    Layout,
    LegacyCard,
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
    IndexTable,
    useIndexResourceState,
    Tag,
    LegacyStack,
    Toast,
    EmptyState,
    RadioButton,
    Banner,
    DatePicker,
    Popover,
    Box,
    ProgressBar,
    Pagination,
    Spinner,
    Autocomplete,
    List,
    FormLayout,
} from "@shopify/polaris";
import { XSmallIcon, CalendarIcon } from "@shopify/polaris-icons";
import prettyBytes from "pretty-bytes";
import { AppContext } from "../providers/AppProvider";
import { PopoverPicker } from "../PopoverPicker.jsx";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LanguageSelector from "../LanguageSelector.jsx";
import { ChatIcon } from "@shopify/polaris-icons";
const MAX_FILE_BYTE = 1073741824;
const MAX_SAMPLE_FILE_BYTE = 10485760;
const MAX_SAMPLE_FILES = 5;

// Enhanced Step1 - Product Selection and Configuration Wizard
const Step1 = ({ onComplete }) => {
    const navigate = useNavigate();

    const [modalActive, setModalActive] = useState(true);
    const [selectedProductType, setSelectedProductType] = useState("");
    const [currentSubStep, setCurrentSubStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [showProductSelection, setShowProductSelection] = useState(true);
    const [showCongratulations, setShowCongratulations] = useState(false);
    const [saving, setSaving] = useState(false);
    const [finishOnboarding, setFinishOnboarding] = useState(false);
    const { t } = useTranslation();
    const { store } = React.useContext(AppContext);
    const shopify = useAppBridge();

    const [selected, setSelected] = useState("active");
    //
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
    const [filterLicenseValue, setFilterLicenseValue] = useState("");
    const [filterCustomValue, setFilterCustomValue] = useState("");
    const [selectedMainTab, setSelectedMainTab] = useState(0);
    const [selectedLicenseIds, setSelectedLicenseIds] = useState([]);
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

    const [toast, setToast] = useState({
        showToast: false,
        toastContent: "",
        isError: false,
    });
    const [title, setTitle] = useState("");
    const [redirectURL, setRedirectURL] = useState("");
    const [linkDetail, setLinkDetail] = useState("");
    const [licenseTitle, setLicenseTitle] = useState("");
    const [value, setValue] = useState("automated");
    const [prefix, setPrefix] = useState("");
    const [codeLength, setCodeLength] = useState("");
    const [suffix, setSuffix] = useState("");
    const [totalCodes, setTotalCodes] = useState("");
    const [contentType, setContentType] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [saving, setSaving] = useState(false);
    const [userPlan, setUserPlan] = useState("free");
    const [fileStorageLimit, setFileStorageLimit] = useState(null);
    const [currentFileStorage, setCurrentFileStorage] = useState(0);
    const [fileSizeLimit, setFileSizeLimit] = useState("No limit");
    const [digitalProducts, setDigitalProducts] = useState([]);
    const [digitalProductsLimit, setDigitalProductsLimit] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
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
    const [sendKeyToMultipleCustomers, setSendKeyToMultipleCustomers] =
        useState(false);
    const [deliverKeysInSequence, setDeliverKeysInSequence] = useState(false);
    const [perUnitNoDelivery, setPerUnitNoDelivery] = useState(1);

    const [defaultTemplateId, setDefaultTemplateId] = useState(null);
    const app = useAppBridge();
    const APP_ID = "78b2cf9c2a9c63431defd44ad600ee8f";
    const EXTENSION_HANDLE = "digitally";

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
    const [active, setActive] = useState(true);
    const handlePdfClose = useCallback(() => setActive(!active), [active]);

    // Product type configurations
    const productTypeConfigs = {
        file: {
            title: t("onboarding.files_setup"),
            description: "Configure your downloadable files",
            steps: [
                {
                    id: "upload",
                    title: t("onboarding.choose_shopify_product"),
                },
            ],
        },
        license: {
            title: t("onboarding.onboarding_key_codes_creation"),
            description: "Configure your license key distribution",
            steps: [
                {
                    id: "upload",
                    title: t("onboarding.choose_shopify_product"),
                },
                {
                    id: "generation",
                    title: t("onboarding.create_keys_codes"),

                },

            ],
        },
        pdf: {
            title: t("onboarding.onboarding_pdf_with_stamping_setup"),
            description: "Configure PDF watermarking and stamping",
            steps: [
                {
                    id: "upload",
                    title: t("onboarding.choose_shopify_product"),

                },
                {
                    id: "stamping",
                    title: t("onboarding.create_choose_pdf_stamping_template"),

                },

            ],
        },
        links: {
            title: "Onboarding: Custom Links Setup",
            description: "Configure protected link delivery",
            steps: [
                {
                    id: "upload",
                    title: t("onboarding.choose_shopify_product"),
                    // description: "Set up your custom links",
                },
                {
                    id: "content",
                    title: t("onboarding.add_custom_link"),

                },

            ],
        },
        mixedContent: {
            title: t("onboarding.onboarding_attached_content"),
            description: "Configure protected link delivery",
            steps: [
                {
                    id: "upload",
                    title: t("onboarding.choose_shopify_product"),

                },

            ],
        },
        notSure: {
            title: t("onboarding.onboarding_not_sure_contact_support"),

            steps: [
                {
                    id: "notsure",
                    title: t("onboarding.contact_our_support"),
                    description: t(
                        "onboarding.click_below_button_to_start_chat_with_our_support_and_discuss_about_your_product"
                    ),
                },
            ],
        },
    };

    const CheckmarkIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#00a047"
                strokeWidth="2"
            />
            <path
                d="M7 12l3 3 7-7"
                fill="none"
                stroke="#00a047"
                strokeWidth="2"
            />
        </svg>
    );

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
        {
            key: "mixedContent",
            icon: "./images/mixed-content.png",
            title: t("onboarding.mixed_delivery"),
            desc1: t("onboarding.combine_files_codes_or_qr"),
            desc2: t("onboarding.link_etc"),
        },
        {
            key: "notSure",
            icon: "./images/question-mark-11795.png",
            title: t("onboarding.not_sure"),
            desc1: t("onboarding.yet_need_help_deciding"),
            desc2: t("onboarding.via_chat_widget"),
        },
    ];

    const handleProductTypeSelect = (type) => {
        setSelectedProductType(type);
        setShowProductSelection(false);

        if (type === "notSure") {
            // For "notSure", skip to the last step or show special content
            setCurrentSubStep(0);
        } else {
            // For other product types, start from the first step
            setCurrentSubStep(0);
        }

        setFormData({});
    };

    const handleBack = () => {
        if (showCongratulations) {
            setShowCongratulations(false);
            setCurrentSubStep(
                productTypeConfigs[selectedProductType].steps.length - 1
            );
        } else if (currentSubStep > 0) {
            setCurrentSubStep(currentSubStep - 1);
        } else {
            setShowProductSelection(true);
            setSelectedProductType("");
        }
    };

    const handleNext = () => {

        // Your existing handleNext logic
        const config = productTypeConfigs[selectedProductType];
        if (currentSubStep < config.steps.length - 1) {
            setCurrentSubStep(currentSubStep + 1);
        }
    };

    const handleNotSure = useCallback(async () => {
        // Call onComplete callback
        if (onComplete) {
            onComplete({
                productType: selectedProductType,
                config: productTypeConfigs[selectedProductType],
                formData: formData,
                finishOnboarding: true,
                type: selectedProductType,
                data: {
                    ...formData,
                    completedSteps: currentSubStep + 1,
                    totalSteps:
                        productTypeConfigs[selectedProductType].steps.length,
                },
            });
        }

        // Call finish-onboarding API
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
            console.log("Onboarding completed successfully");
        } catch (error) {
            console.error("Error finishing onboarding:", error);
        }
    }, [
        onComplete,
        selectedProductType,
        formData,
        currentSubStep,
        productTypeConfigs,
    ]);

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

    function isNodeWithinPopover(node) {
        return datePickerRef?.current
            ? nodeContainsDescendant(datePickerRef.current, node)
            : false;
    }

    const handlePdfStampingEnabledChange = () => {
        setIsPdfStampingEnabled(true);
    };

    const handleTemplateChoiceChange = (newTemplateChoice) => {
        setTemplateChoice(newTemplateChoice);
    };

    const toggleCustomTemplateModal = () => {
        setIsPDFModalOpen(!isPDFModalOpen);
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
                setToast({
                    showToast: true,
                    toastContent: t(
                        "createdigitalproduct.pdf_template_saved_successfully"
                    ),
                    isError: false,
                });
            } else {
                throw new Error("Failed to save PDF template");
            }
        } catch (error) {
            console.error("Error saving template:", error);
            setToast({
                showToast: true,
                toastContent: t(
                    "createdigitalproduct.failed_to_save_pdf_template_please_try_again"
                ),
                isError: true,
            });
        } finally {
            setIsPDFModalOpen(false);
        }
    };

    useEffect(() => {
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
            }
        };

        fetchPdfTemplates();
    }, []);

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

    const handleLicenseTabChange = useCallback((selectedLicenseTabIndex) => {
        setSelectedLicenseTab(selectedLicenseTabIndex);
    }, []);

    const handleManualLicenseTabChange = useCallback(
        (selectedManualLicenseTabIndex) => {
            setSelectedManualLicenseTab(selectedManualLicenseTabIndex);
        },
        []
    );

    const handleCustomTabChange = useCallback((selectedCustomTabIndex) => {
        setSelectedCustomTab(selectedCustomTabIndex);
    }, []);

    const mainTabs = [
        {
            id: "existingFiles",
            content: t("createdigitalproduct.from_existing_files"),
        },
        { id: "newFile", content: t("createdigitalproduct.add_new_file") },
    ];

    const licenseTabs = [
        {
            id: "existingLicenses",
            content: t("createdigitalproduct.from_existing_licenses"),
        },
        {
            id: "newLicense",
            content: t("createdigitalproduct.add_new_license"),
        },
    ];

    const manualLicenseTabs = [
        { id: "uploadCsv", content: t("createdigitalproduct.upload_csv") },
        {
            id: "pasteKeys",
            content: t("createdigitalproduct.paste_keys_codes"),
        },
    ];

    const customTabs = [
        {
            id: "existingCustoms",
            content: t("createdigitalproduct.from_existing_customs"),
        },
        { id: "newCustom", content: t("createdigitalproduct.add_new_custom") },
    ];

    const handleExpirationDaysChange = (value) => {
        const numericValue = parseInt(value, 10);

        if (numericValue < 1) {
            setExpirationDays(1);
        } else {
            setExpirationDays(numericValue);
        }
    };

    const handleProductMessagehange = (value) => {
        setProductMessage(value);
    };

    function handleInputValueChange() {
        console.log("handleInputValueChange");
    }

    function handleOnClose({ relatedTarget }) {
        setVisible(false);
    }

    function handleMonthChange(month, year) {
        setDate({ month, year });
    }

    function handleDateSelection({ end: newSelectedDate }) {
        setSelectedDate(newSelectedDate);
        setVisible(false);
    }

    useEffect(() => {
        if (selectedDate) {
            setDate({
                month: selectedDate.getMonth(),
                year: selectedDate.getFullYear(),
            });
        }
    }, [selectedDate]);

    const handleDownloadExpirationEnabledChange = (checked) => {
        setIsDownloadExpirationEnabled(checked);
    };

    const handleProductMessageEnabledChange = (checked) => {
        setIsProductMessageEnabled(checked);
    };

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

    const handleEnableThemeExtension = () => {
        // const redirect = Redirect.create(app);
        // redirect.dispatch(Redirect.Action.ADMIN_PATH, {
        //     path: `/themes/current/editor?context=apps&activateAppId=${APP_ID}/${EXTENSION_HANDLE}`,
        //     newContext: true,
        // });

        open(`shopify://admin/themes/current/editor?context=apps&activateAppId=${APP_ID}/${EXTENSION_HANDLE}`, '_top');
    };

    const handleSelectChange = (value) => {
        setSelected(value);
    };

    const handleAutoFulfillCheckbox = (checked) => {
        setAutoFulfill(checked);
    };

    const handleDownloadLimitChange = (newValue) => {
        setDownloadLimit(newValue);
    };

    const handleDownloadLimitEnabledChange = (checked) => {
        setIsDownloadLimitEnabled(checked);
    };

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

    const toggleLicenseInput = () => {
        // if (selectedLicenseTab === 1) {
        const newLicense = {
            title: licenseTitle,
            licenseType: value,
            prefix: prefix,
            codeLength: codeLength,
            suffix: suffix,
            totalCodes: totalCodes,
            licenseFiles: selectedManualLicenseTab === 0 ? licenseFiles : [],
            pasteKeysValue:
                selectedManualLicenseTab === 1 ? pasteKeysValue : "",
            qrCodeEnabled: qrCodeEnabled,
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
        setSendKeyToMultipleCustomers(false);
        setDeliverKeysInSequence(false);
        setPerUnitNoDelivery(1);
        // }
        handleContentTypeChange("license");
        setIsLicenseModalOpen(!isLicenseModalOpen);
    };

    const toggleCustomLink = () => {
        // if (selectedCustomTab === 1) {
        const newCustom = {
            title: title,
            redirectURL: redirectURL,
            linkDetail: linkDetail,
        };

        setNewCustoms((prevCustoms) => [...prevCustoms, newCustom]);

        // setTitle("");
        // setRedirectURL("");
        // setLinkDetail("");
        // }

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
            }
        };

        fetchCurrentFiles();
    }, []);

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
                setToast({
                    showToast: true,
                    toastContent: `File storage limit exceeded. Maximum allowed is ${prettyBytes(
                        fileStorageLimit
                    )}`,
                    isError: true,
                });
                return;
            }

            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setCurrentFileStorage((prev) => prev + totalNewFilesSize);
        },
        [fileStorageLimit, currentFileStorage]
    );

    const handleSampleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) => {
            const updatedFiles = [...sampleFiles, ...acceptedFiles];
            const validFiles = updatedFiles.filter(
                (file) => file.size <= MAX_SAMPLE_FILE_BYTE
            );
            const limitedFiles = validFiles.slice(0, MAX_SAMPLE_FILES);
            setSampleFiles(limitedFiles);

            if (validFiles.length > MAX_SAMPLE_FILES) {
                setToast({
                    showToast: true,
                    toastContent: `${t(
                        "createdigitalproduct.you_can_only_upload_a_maximum_of"
                    )} ${MAX_SAMPLE_FILES} ${t("createdigitalproduct.files")}.`,
                    isError: true,
                });
            }
        },
        [sampleFiles]
    );

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
                type: 'product',
                action: 'select',
                multiple: false,
                selectionIds: selectedProduct ? [selectedProduct.id] : []
            });

            if (selected && selected.length > 0) {
                setSelectedProduct(selected[0]);
            }
        } catch (error) {
            console.error('Resource picker error:', error);
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
            }
        },
        [setFiles, setOrders]
    );

    const handleDeleteSampleFileAtIndex = useCallback(
        (index) => {
            setSampleFiles((files) => {
                let newFiles = [...files];
                newFiles.splice(index, 1);
                return newFiles;
            });
        },
        [sampleFiles]
    );

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

    const handleTagInputChange = useCallback((value) => {
        setTagInputValue(value);
    }, []);

    const handleTagInputSubmit = useCallback(() => {
        if (tagInputValue.trim() !== "") {
            setTags((prevTags) => [...prevTags, tagInputValue.trim()]);
            setTagInputValue("");
        }
    }, [tagInputValue]);

    const removeTag = useCallback(
        (tag) => () => {
            setTags((prevTags) => prevTags.filter((t) => t !== tag));
        },
        []
    );

    const tagMarkup = tags.map((tag) => (
        <div key={tag}>
            <Tag onRemove={removeTag(tag)}>{tag}</Tag>
        </div>
    ));

    const options = [
        { label: t("digtal_product_listing.draft"), value: "draft" },
        { label: t("digtal_product_listing.active"), value: "active" },
    ];

    const resourceName = {
        singular: "file",
        plural: "files",
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(orders);

    const rowMarkup = orders.map(({ id, fileName, mimeType, byteSize }) => (
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
        </IndexTable.Row>
    ));

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

    const handleToggleLicenseSelection = (licenseId) => {
        setSelectedLicenseIds((prev) => {
            if (prev.includes(licenseId)) {
                return prev.filter((id) => id !== licenseId);
            } else {
                return [...prev, licenseId];
            }
        });
    };

    // Check if all licenses on current page are selected
    useEffect(() => {
        const allCurrentPageSelected =
            licenses.length > 0 &&
            licenses.every((license) =>
                selectedLicenseIds.includes(license.id)
            );
        setSelectAll(allCurrentPageSelected);
    }, [licenses, selectedLicenseIds]);

    const handleSelectAll = () => {
        if (selectAll) {
            // Deselect all licenses on current page
            setSelectedLicenseIds((prev) =>
                prev.filter(
                    (id) => !licenses.some((license) => license.id === id)
                )
            );
        } else {
            // Select all licenses on current page
            const currentPageIds = licenses.map((license) => license.id);
            setSelectedLicenseIds((prev) => {
                const newSelection = [...prev];
                currentPageIds.forEach((id) => {
                    if (!newSelection.includes(id)) {
                        newSelection.push(id);
                    }
                });
                return newSelection;
            });
        }
        setSelectAll(!selectAll);
    };

    const handleToggleCustomSelection = (customId) => {
        const newSelectedCustomIds = [...selectedCustomIds];
        if (newSelectedCustomIds.includes(customId)) {
            const index = newSelectedCustomIds.indexOf(customId);
            newSelectedCustomIds.splice(index, 1);
        } else {
            newSelectedCustomIds.push(customId);
        }
        setSelectedCustomIds(newSelectedCustomIds);
        setSelectAllForCustom(
            customs.every((custom) => newSelectedCustomIds.includes(custom.id))
        );
    };

    const handleSelectAllForCustom = () => {
        const allCustomIds = customs.map((custom) => custom.id);
        if (selectAllForCustom) {
            setSelectedCustomIds([]);
        } else {
            setSelectedCustomIds(allCustomIds);
        }
        setSelectAllForCustom(!selectAllForCustom);
    };

    const handlePricing = () => navigate("/pricing");

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const response = await fetch("/api/user-plan");
                const data = await response.json();
                setUserPlan(data.plan);
            } catch (error) {
                console.error("Failed to fetch user plan:", error);
            }
        };

        fetchUserPlan();
    }, []);

    const isLicenseActionDisabled = () => {
        // if (selectedLicenseTab === 0) {
        //     return selectedLicenseIds.length === 0;
        // }

        // if (selectedLicenseTab === 1) {
        const isTitleEmpty = !licenseTitle;
        if (value === "automated") {
            return (
                isTitleEmpty || !prefix || !codeLength || !suffix || !totalCodes
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
        // }

        return false;
    };

    useEffect(() => {
        if (store) {
            const storageLimit =
                store.file_storage === "unlimited"
                    ? Infinity
                    : Number(store.file_storage);
            setFileStorageLimit(storageLimit);
            setFileSizeLimit(store.per_file_limit);
            setIsLoading(false);
        }
    }, [store]);

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/get-files?page=${currentPageFiles}&limit=${itemsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                setOrders(data.files);
                setTotalFiles(data.total);
            } else {
                setToast({
                    showToast: true,
                    toastContent: t(
                        "createdigitalproduct.failed_to_fetch_files"
                    ),
                    isError: true,
                });
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            setToast({
                showToast: true,
                toastContent: t("createdigitalproduct.failed_to_fetch_files"),
                isError: true,
            });
        } finally {
            setIsLoading(false);
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
                setToast({
                    showToast: true,
                    toastContent: t(
                        "createdigitalproduct.failed_to_fetch_licenses"
                    ),
                    isError: true,
                });
            }
        } catch (error) {
            console.error("Error fetching licenses:", error);
            setToast({
                showToast: true,
                toastContent: t(
                    "createdigitalproduct.failed_to_fetch_licenses"
                ),
                isError: true,
            });
        } finally {
            setIsLoading(false);
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
                setToast({
                    showToast: true,
                    toastContent: t(
                        "createdigitalproduct.failed_to_fetch_custom_links"
                    ),
                    isError: true,
                });
            }
        } catch (error) {
            console.error("Error fetching custom links:", error);
            setToast({
                showToast: true,
                toastContent: t(
                    "createdigitalproduct.failed_to_fetch_custom_links"
                ),
                isError: true,
            });
        } finally {
            setIsLoading(false);
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

    useEffect(() => {
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
    }, [store]);

    const closeLimitExceededModal = () => {
        setIsLimitExceededModalActive(false);
        navigate("/digitalProducts");
    };

    const handleOnboardingComplete = useCallback(async () => {
        // Call onComplete callback
        if (onComplete) {
            onComplete({
                productType: selectedProductType,
                config: productTypeConfigs[selectedProductType],
                formData: formData,
                finishOnboarding: true,
                type: selectedProductType,
                data: {
                    ...formData,
                    completedSteps: currentSubStep + 1,
                    totalSteps:
                        productTypeConfigs[selectedProductType].steps.length,
                },
            });
        }

        // Call finish-onboarding API
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
            console.log("Onboarding completed successfully");
        } catch (error) {
            console.error("Error finishing onboarding:", error);
        }
    }, [
        onComplete,
        selectedProductType,
        formData,
        currentSubStep,
        productTypeConfigs,
    ]);

const handleSave = useCallback(async (additionalData = {}) => {
    setSaving(true);
    setProgress(0); // Reset progress

    if (
        isPdfStampingEnabled &&
        templateChoice === "custom" &&
        !PDFTemplateId
    ) {
        setToast({
            showToast: true,
            toastContent: t(
                "createdigitalproduct.please_save_the_pdf_template_first"
            ),
            isError: true,
        });
        setSaving(false);
        setShowCongratulations(true);
        return;
    }

    let validFiles = [];
    let selectedValidFiles = [];
    //if (selectedMainTab === 0) {
    selectedValidFiles = orders
        .filter((order) => {
            const isSelected = selectedResources.includes(order.id);
            return isSelected && order.url;
        })
        .map((order) => order.id);
    //} else {
    validFiles = files.filter((file) => file.size <= fileSizeLimit);
    //}

    if (
        !validFiles.length &&
        !selectedValidFiles.length &&
        (contentType.includes("files") || (additionalData.contentTypes && additionalData.contentTypes.includes("files")))
    ) {
        setToast({
            showToast: true,
            toastContent: t(
                "createdigitalproduct.please_select_valid_files"
            ),
            isError: true,
        });
        setSaving(false);
        setShowCongratulations(true);
        return;
    }

    if (
        validFiles.length + selectedValidFiles.length > 50 &&
        (contentType.includes("files") || (additionalData.contentTypes && additionalData.contentTypes.includes("files")))
    ) {
        setToast({
            showToast: true,
            toastContent: t(
                "createdigitalproduct.you_can_select_a_maximum_of_50_files"
            ),
            isError: true,
        });
        setSaving(false);
        setShowCongratulations(true);
        return;
    }

    try {
        var formData = new FormData();

        // Handle content type - include additional content types from step actions
        const finalContentType = [...contentType, ...(additionalData.contentTypes || [])];
        const uniqueContentType = [...new Set(finalContentType)]; // Remove duplicates

        if (uniqueContentType.includes("files")) {
            validFiles.forEach((fileId) => {
                formData.append("files[]", fileId);
            });

            //if (selectedMainTab === 0) {
            selectedValidFiles.forEach((fileId) => {
                formData.append("selectedFiles[]", fileId);
            });
            //}
        }

        if (uniqueContentType.includes("license")) {
            let selectedLicenses = [];
            selectedLicenses = allLicenses
                .filter((license) =>
                    selectedLicenseIds.includes(license.id)
                )
                .map((license) => license.id);

            selectedLicenses.forEach((licenseId) => {
                formData.append("selectedLicenses[]", licenseId);
            });

            // Use combined licenses (existing + additional from step)
            const allNewLicenses = [...newLicenses, ...(additionalData.newLicenses || [])];
            allNewLicenses.forEach((license, index) => {
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

        if (uniqueContentType.includes("custom_link")) {
            let selectedCustomLinks = [];
            selectedCustomLinks = customs
                .filter((link) => selectedCustomIds.includes(link.id))
                .map((link) => link.id);

            selectedCustomLinks.forEach((linkId) => {
                formData.append("selectedCustomLinks[]", linkId);
            });

            // Use combined custom links (existing + additional from step)
            const allNewCustoms = [...newCustoms, ...(additionalData.newCustoms || [])];
            allNewCustoms.forEach((link, index) => {
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
            // if (templateChoice === "default") {
                // formData.append("default_pdf_template", "1");
            // } else if (templateChoice === "custom") {
                formData.append("default_pdf_template", "0");
                formData.append("pdf_template_id", PDFTemplateId);
            // }
        }

        const statusValue = selected === "draft" ? 0 : 1;
        formData.append("status", statusValue);
        formData.append("content_type", uniqueContentType.join(", "));
        formData.append("shop", store.shopify_domain);

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
                if (response.error) {
                    setSaving(false);
                    setShowCongratulations(true);
                    setProgress(0);
                    if (response.type === "exists") {
                        setToast({
                            showToast: true,
                            toastContent: t(
                                "editdigitalproduct.digital_product_already_exists_for_selected_shopify_product"
                            ),
                            isError: true,
                        });
                    } else {
                        setToast({
                            showToast: true,
                            toastContent: t(
                                "editdigitalproduct.error_saving_digital_product"
                            ),
                            isError: true,
                        });
                    }
                } else {
                    setToast({
                        showToast: true,
                        toastContent: t(
                            "createdigitalproduct.digital_product_saved_successfully"
                        ),
                        isError: false,
                    });
                    // handleOnboardingComplete();
                    // Redirect or further actions after success
                    // setTimeout(() => {
                                        // }, 1000);
                }
            } else {
                setToast({
                    showToast: true,
                    toastContent: t(
                        "createdigitalproduct.failed_to_save_digital_product_please_try_again_later"
                    ),
                    isError: true,
                });
            }
            setSaving(false);
            setShowCongratulations(true);
            setProgress(0); // Reset progress after completion
        };

        console.log(templateChoice);

        // Handle errors
        xhr.onerror = () => {
            setToast({
                showToast: true,
                toastContent: t(
                    "createdigitalproduct.an_unexpected_error_occurred_please_try_again_later"
                ),
                isError: true,
            });
            setSaving(false);
            setShowCongratulations(true);
            setProgress(0);
        };

        // Send the request
        xhr.send(formData);
    } catch (error) {
        console.error("Error saving digital product:", error);
        setToast({
            showToast: true,
            toastContent: t(
                "createdigitalproduct.an_unexpected_error_occurred_please_try_again_later"
            ),
            isError: true,
        });
        setSaving(false);
        setShowCongratulations(true);
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
    deliverKeysInSequence,
    value,
    selectedResources,
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

    const textField = (
        <Autocomplete.TextField
            onChange={handleInputChange}
            value={inputValue}
            autoComplete="off"
            placeholder={t("createdigitalproduct.search_by_product_name")}
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
            placeholder={t("createdigitalproduct.search_by_custom_link_title")}
            clearButton
            onClearButtonClick={handleClearCustomLinkSearch}
        />
    );

    const updateFormData = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const isLastStep =
        selectedProductType &&
        currentSubStep ===
            productTypeConfigs[selectedProductType].steps.length - 1;

    // Render product selection screen
    const renderProductSelection = () => (
        <Modal.Section>
            <BlockStack gap="500">
                <Grid>
                    {productTypes.map((product) => (
                        <Grid.Cell
                            key={product.key}
                            columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                        >
                            <div
                                style={{
                                    position: "relative",
                                    padding: "12px",
                                    border: `2px solid ${
                                        selectedProductType === product.key
                                            ? "#008060"
                                            : "#e1e3e5"
                                    }`,
                                    borderRadius: "12px",
                                    backgroundColor:
                                        selectedProductType === product.key
                                            ? "#f6f6f7"
                                            : "white",
                                    boxShadow:
                                        selectedProductType === product.key
                                            ? "0 4px 12px rgba(0, 128, 96, 0.15)"
                                            : "0 1px 3px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    // Add hover effect to indicate clickability
                                    ...(selectedProductType !== product.key && {
                                        ":hover": {
                                            borderColor: "#c4c4c4",
                                            boxShadow:
                                                "0 2px 8px rgba(0, 0, 0, 0.15)",
                                        },
                                    }),
                                }}
                                onClick={() =>
                                    setSelectedProductType(product.key)
                                }

                            >
                                {selectedProductType === product.key && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            right: "12px",
                                            top: "12px",
                                        }}
                                    >
                                        <CheckmarkIcon />
                                    </span>
                                )}

                                <InlineStack gap="300" align="start">
                                    <div style={{ flexShrink: 0 }}>
                                        <img
                                            width="43px"
                                            src={product.icon}
                                            alt={product.title}
                                            onError={(e) => {
                                                // Fallback to emoji if image fails to load
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display =
                                                    "block";
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: "none",
                                                fontSize: "43px",
                                                width: "43px",
                                                height: "43px",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {product.key === "file"
                                                ? "📁"
                                                : product.key === "license"
                                                ? "🔑"
                                                : product.key === "pdf"
                                                ? "📄"
                                                : product.key === "ticket"
                                                ? "🎫"
                                                : "🔗"}
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <BlockStack gap="100">
                                            <Text variant="headingMd" as="h3">
                                                {product.title}
                                            </Text>
                                            <BlockStack>
                                                <Text variant="bodySm" as="p">
                                                    {product.desc1}
                                                </Text>
                                                {/* <Text variant="bodySm" as="p">
                    {product.desc2}
                </Text> */}
                                            </BlockStack>
                                        </BlockStack>
                                    </div>
                                </InlineStack>
                            </div>
                        </Grid.Cell>
                    ))}
                </Grid>
            </BlockStack>
        </Modal.Section>
    );

    // Render configuration steps
    const renderConfigurationStep = () => {
        const config = productTypeConfigs[selectedProductType];
        const currentStep = config.steps[currentSubStep];
        const progress = ((currentSubStep + 1) / config.steps.length) * 100;

        return (
            <Modal.Section>
                <BlockStack gap="400">
                    {/* Only show step progress for product types other than "notSure" */}
                    {selectedProductType !== "notSure" && (
                        <div>
                            <Text variant="headingMd" as="h3">
                                {/* {config.title} - Step {currentSubStep + 1} of{" "}
                    {config.steps.length} */}
                                {t("onboarding.step")} {currentSubStep + 1}{" "}
                                {t("onboarding.of")} {config.steps.length}
                            </Text>
                            <Box paddingBlockStart="200">
                                <ProgressBar progress={progress} size="small" />
                            </Box>
                        </div>
                    )}

                    <Card sectioned>
                        <BlockStack gap="100">
                            <Text variant="headingMd" as="h6">
                                {currentStep.title}
                            </Text>
                            <Text variant="bodySm" as="p">
                                {currentStep.description}
                            </Text>

                            {renderStepContent(
                                selectedProductType,
                                currentStep.id
                            )}
                        </BlockStack>
                    </Card>
                </BlockStack>
            </Modal.Section>
        );
    };

    // Render specific content for each step
    const renderStepContent = (productType, stepId) => {
        switch (`${productType}-${stepId}`) {
            case "file-upload":
                return (
                    <BlockStack gap="400">

                        <BlockStack gap="300">
                            {selectedProduct ? (
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >
                                    <InlineGrid
                                        columns="1fr auto"
                                        style={{
                                            marginBottom: "10px",
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
                                                        marginLeft: "20px",
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
                                                            .variants.length >
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
                                        <div onClick={toggleProductPicker}>
                                            <Link url="#">
                                                <Text variant="bodyLg" as="p">
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
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ flex: "75%" }}>
                                        <TextField
                                            value={
                                                selectedProduct
                                                    ? selectedProduct.title
                                                    : ""
                                            }
                                            onFocus={toggleProductPicker}
                                            placeholder={t(
                                                "createdigitalproduct.search_shopify_products"
                                            )}
                                            fullWidth
                                            readOnly
                                        />
                                    </div>
                                    <div
                                        style={{
                                            flex: "25%",
                                            marginLeft: "1rem",
                                        }}
                                    >
                                        <Button onClick={toggleProductPicker}>
                                            {t(
                                                "createdigitalproduct.browse_products"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <Text variant="headingMd" as="h6">
                                    Attach files
                                </Text>
                            </div>
                        </BlockStack>

                        <BlockStack gap="300">
                            {contentType && contentType.includes("files") && (
                                <BlockStack gap="200">
                                    {files.length > 0 &&
                                        files.map((file, index) => {
                                            const exceedMaxSize =
                                                file.size > fileSizeLimit;

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

                                                            onClick={() =>
                                                                handleDeleteFileAtIndex(
                                                                    index,
                                                                    "files"
                                                                )
                                                            }
                                                        >
                                                            <Icon
  source={XSmallIcon}
  tone="base"
/>
                                                        </Button>
                                                    </div>
                                                </InlineGrid>
                                            );
                                        })}

                                    <div>
                                        {orders
                                            .filter(
                                                (order) =>
                                                    selectedResources.includes(
                                                        order.id
                                                    ) && order.url
                                            )
                                            .map((order, index) => {
                                                const isSelected =
                                                    selectedResources.includes(
                                                        order.id
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
                                                                                        order.fileName
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
                                                                                {order.mimeType.toUpperCase()}{" "}
                                                                                -{" "}
                                                                                {prettyBytes(
                                                                                    order.byteSize
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
                                            })}
                                    </div>

                                    {saving && (
                                        <div>
                                            <Text as={"h5"}>
                                                {t(
                                                    "createdigitalproduct.files_are_uploading_please_wait"
                                                )}
                                            </Text>
                                            <ProgressBar progress={progress} />
                                        </div>
                                    )}
                                </BlockStack>
                            )}

                            <BlockStack gap="400">
                                <DropZone
                                    label={fileLabelText}
                                    onDrop={(files) => {
                                        handleDropZoneDrop(files);
                                        // Trigger upload immediately after files are added
                                        toggleFileUpload();
                                    }}
                                >
                                    <DropZone.FileUpload
                                        actionTitle={t(
                                            "digtal_product_listing.add_files"
                                        )}
                                    />
                                </DropZone>


                            </BlockStack>
                        </BlockStack>
                    </BlockStack>
                );

            case "pdf-upload":
                return (
                    <BlockStack gap="400">
                        <BlockStack gap="300">
                            {selectedProduct ? (
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >
                                    <InlineGrid
                                        columns="1fr auto"
                                        style={{
                                            marginBottom: "10px",
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
                                                        marginLeft: "20px",
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
                                                            .variants.length >
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
                                        <div onClick={toggleProductPicker}>
                                            <Link url="#">
                                                <Text variant="bodyLg" as="p">
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
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ flex: "75%" }}>
                                        <TextField
                                            value={
                                                selectedProduct
                                                    ? selectedProduct.title
                                                    : ""
                                            }
                                            onFocus={toggleProductPicker}
                                            placeholder={t(
                                                "createdigitalproduct.search_shopify_products"
                                            )}
                                            fullWidth
                                            readOnly
                                        />
                                    </div>
                                    <div
                                        style={{
                                            flex: "25%",
                                            marginLeft: "1rem",
                                        }}
                                    >
                                        <Button onClick={toggleProductPicker}>
                                            {t(
                                                "createdigitalproduct.browse_products"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <Text as={"p"} variant={"bodyMd"}>
                                    {t(
                                        "createdigitalproduct.select_shopify_product_or_specific_product"
                                    )}
                                </Text>
                            </div>
                        </BlockStack>

                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h6">
                                Attach files
                            </Text>

                            {contentType && contentType.includes("files") && (
                                <BlockStack gap="200">
                                    {files.length > 0 &&
                                        files.map((file, index) => {
                                            const exceedMaxSize =
                                                file.size > fileSizeLimit;

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

                                                            onClick={() =>
                                                                handleDeleteFileAtIndex(
                                                                    index,
                                                                    "files"
                                                                )
                                                            }
                                                        >
                                                            <Icon
  source={XSmallIcon}
  tone="base"
/>
                                                        </Button>
                                                    </div>
                                                </InlineGrid>
                                            );
                                        })}

                                    <div>
                                        {orders
                                            .filter(
                                                (order) =>
                                                    selectedResources.includes(
                                                        order.id
                                                    ) && order.url
                                            )
                                            .map((order, index) => {
                                                const isSelected =
                                                    selectedResources.includes(
                                                        order.id
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
                                                                                        order.fileName
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
                                                                                {order.mimeType.toUpperCase()}{" "}
                                                                                -{" "}
                                                                                {prettyBytes(
                                                                                    order.byteSize
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
                                            })}
                                    </div>

                                    {saving && (
                                        <div>
                                            <Text as={"h5"}>
                                                {t(
                                                    "createdigitalproduct.files_are_uploading_please_wait"
                                                )}
                                            </Text>
                                            <ProgressBar progress={progress} />
                                        </div>
                                    )}
                                </BlockStack>
                            )}

                            <BlockStack gap="400">
                                <DropZone
                                    accept=".pdf"
                                    label={fileLabelText}
                                    onDrop={(files) => {
                                        handleDropZoneDrop(files);
                                        // Trigger upload immediately after files are added
                                        toggleFileUpload();
                                    }}
                                >
                                    <DropZone.FileUpload
                                        actionTitle={t(
                                            "digtal_product_listing.add_files"
                                        )}
                                    />
                                </DropZone>


                            </BlockStack>
                        </BlockStack>
                    </BlockStack>
                );

            case "pdf-stamping":
                return (
                    <BlockStack>
                        {userPlan === "free" && (
                            <div style={{ marginTop: "10px" }}>
                                <Banner
                                    tone="warning"
                                    title={t(
                                        "editdigitalproduct.upgrade_your_plan"
                                    )}
                                >
                                    <Text variant="bodyMd" as="p">
                                        {t(
                                            "createdigitalproduct.upgrade_to_paid_plan_to_enable_advanced_features_like_pdf_stamping"
                                        )}
                                    </Text>
                                    <div
                                        style={{
                                            marginTop: "5px",
                                        }}
                                    ></div>
                                    <Button
                                        variant="primary"
                                        onClick={handlePricing}
                                    >
                                        {t("createdigitalproduct.upgrade_now")}
                                    </Button>
                                </Banner>
                            </div>
                        )}



                        <LegacyStack vertical>


                            <>
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >
                                    <Button
                                        disabled={userPlan === "free"}
                                        variant="primary"
                                        onClick={toggleCustomTemplateModal}
                                    >
                                        {t(
                                            "createdigitalproduct.add_custom_template"
                                        )}
                                    </Button>
                                </div>
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                ></div>
                                <Select
                                    label={t(
                                        "createdigitalproduct.select_a_pdf_template"
                                    )}
                                    options={templateOptions}
                                    value={String(selectedTemplate)}
                                    onChange={handleTemplateChange}
                                />
                            </>

                            <div
                                style={{
                                    marginTop: "10px",
                                }}
                            >
                                <Text variant="bodySm" as="p" color="subdued">
                                    {t(
                                        "createdigitalproduct.choose_whether_to_use_the_default_template_or_add"
                                    )}
                                </Text>
                            </div>
                        </LegacyStack>

                        <Modal
                            size="large"
                            open={isPDFModalOpen}
                            onClose={toggleCustomTemplateModal}
                            title={t(
                                "createdigitalproduct.pdf_stamping_template"
                            )}
                            primaryAction={{
    content: t("createdigitalproduct.add"),
    onAction: () => {
        handleSaveTemplate();
        handlePdfStampingEnabledChange();
    },
    disabled:
        templateTitle.trim() === "" ||
        stampText.trim() === "",
}}
                            secondaryActions={[
                                {
                                    content: t("digtal_product_listing.cancel"),
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
                                                    ]}
                                                    value={textSize}
                                                    onChange={setTextSize}
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
                                                            display: "flex",
                                                            marginTop: "5px",
                                                        }}
                                                    >
                                                        <PopoverPicker
                                                            color={textColor}
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
                                                                placeholder="Enter text color (e.g. #FF5733)"
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
                                        marginTop: "10px",
                                    }}
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
                                                    onChange={setAlignment}
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
                                                    ]}
                                                    value={font}
                                                    onChange={setFont}
                                                />
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </LegacyStack.Item>
                                </LegacyStack>
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
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
                                                    onChange={setPageSize}
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
                                                    onChange={setPageLayout}
                                                />
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </LegacyStack.Item>
                                </LegacyStack>
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
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
                                                    value={verticalAdjustment}
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
                                                    value={pagesToStamp}
                                                    onChange={setPagesToStamp}
                                                    autoComplete="off"
                                                    placeholder="e.g. 1, 2 or all"
                                                />
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </LegacyStack.Item>
                                </LegacyStack>
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                ></div>
                                <TextField
                                    label={t("createdigitalproduct.stamp_text")}
                                    multiline={4}
                                    value={stampText}
                                    onChange={setStampText}
                                    autoComplete="off"
                                    placeholder="Prepared exclusively for {order.receiver_email}. Order: {order.id}"
                                />
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >
                                    <Text as="p" variant="bodyMd">
                                        {t("createdigitalproduct.pdf_options")}
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
                                    style={{
                                        marginTop: "10px",
                                    }}
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
                                    style={{
                                        marginTop: "10px",
                                    }}
                                ></div>
                                <Text as="h3" variant="headingMd">
                                    {t(
                                        "createdigitalproduct.stamping_variables"
                                    )}
                                </Text>
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                ></div>
                                <Text as="p" variant="bodyLg">
                                    {t(
                                        "createdigitalproduct.below_are_the_available_stamping_variables"
                                    )}
                                </Text>
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                ></div>
                                <Text as="p" variant="bodyLg">
                                    <code
                                        style={{
                                            color: "#D5006D",
                                        }}
                                    >{`{order.receiver_name}`}</code>{" "}
                                    {t(
                                        "createdigitalproduct.receiver_name_customer_name"
                                    )}
                                </Text>
                                <Text as="p" variant="bodyLg">
                                    <code
                                        style={{
                                            color: "#D5006D",
                                        }}
                                    >{`{order.receiver_email}`}</code>{" "}
                                    {t(
                                        "createdigitalproduct.receiver_email_customer_email"
                                    )}
                                </Text>
                                <Text as="p" variant="bodyLg">
                                    <code
                                        style={{
                                            color: "#D5006D",
                                        }}
                                    >{`{order.id}`}</code>{" "}
                                    {t("createdigitalproduct.order_id_pdf")}
                                </Text>
                                <Text as="p" variant="bodyLg">
                                    <code
                                        style={{
                                            color: "#D5006D",
                                        }}
                                    >{`{order.date}`}</code>{" "}
                                    {t("createdigitalproduct.order_date")}
                                </Text>
                                <Text as="p" variant="bodyLg">
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
                    </BlockStack>


                );



            case "license-upload":
                return (
                    <BlockStack gap="400">
                        <BlockStack gap="300">
                            {selectedProduct ? (
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >
                                    <InlineGrid
                                        columns="1fr auto"
                                        style={{
                                            marginBottom: "10px",
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
                                                        marginLeft: "20px",
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
                                                            .variants.length >
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
                                        <div onClick={toggleProductPicker}>
                                            <Link url="#">
                                                <Text variant="bodyLg" as="p">
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
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ flex: "75%" }}>
                                        <TextField
                                            value={
                                                selectedProduct
                                                    ? selectedProduct.title
                                                    : ""
                                            }
                                            onFocus={toggleProductPicker}
                                            placeholder={t(
                                                "createdigitalproduct.search_shopify_products"
                                            )}
                                            fullWidth
                                            readOnly
                                        />
                                    </div>
                                    <div
                                        style={{
                                            flex: "25%",
                                            marginLeft: "1rem",
                                        }}
                                    >
                                        <Button onClick={toggleProductPicker}>
                                            {t(
                                                "createdigitalproduct.browse_products"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <Text as={"p"} variant={"bodyMd"}>

                                  {t('onboarding.trigger_license_delivery')}
                                </Text>
                            </div>
                        </BlockStack>
                    </BlockStack>
                );

            case "license-generation":
                return (
                    <div>
                        <BlockStack gap="300">
                            {contentType && contentType.includes("license") && (
                                <BlockStack gap="200">
                                    {newLicenses.length > 0 && (
                                        <>
                                            {newLicenses.map(
                                                (license, index) => {
                                                    return (
                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "10px",
                                                            }}
                                                            key={index}
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
                                                                                />
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
                                            (selectedLicenseId, index) => {
                                                const selectedLicense =
                                                    allLicenses.find(
                                                        (license) =>
                                                            license.id ===
                                                            selectedLicenseId
                                                    );
                                                if (!selectedLicense)
                                                    return null;

                                                return (
                                                    <div
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                        key={selectedLicense.id}
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
                                                                            />
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

                            {/* Direct License Keys Form */}

                            <div>
                                <BlockStack gap="300">
                                    {/* License Form Fields */}
                                    <div
                                        style={{
                                            marginLeft: "23px",
                                            marginRight: "23px",
                                            marginTop: "5px",
                                        }}
                                    >
                                        <TextField
                                            label={t(
                                                "createdigitalproduct.title"
                                            )}
                                            value={licenseTitle}
                                            onChange={handleLicenseTitleChange}
                                            autoComplete="off"
                                        />
                                        <div
                                            style={{
                                                marginTop: "30px",
                                            }}
                                        >
                                            <Text variant="headingMd" as="h6">
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
                                        <div
                                            style={{
                                                marginTop: "15px",
                                            }}
                                        >
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
                                                        marginTop: "0px",
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
                                        <div style={{ marginTop: "0px" }}>
                                            <Checkbox
                                                label={t(
                                                    "createdigitalproduct.deliver_as_qr_code"
                                                )}
                                                checked={qrCodeEnabled}
                                                onChange={handleQRCode}
                                            />
                                        </div>

                                        <div style={{ marginTop: "10px" }}>
                                            <TextField
                                                label={t(
                                                    "createdigitalproduct.deliver_no_of_keys_codes_per_unit"
                                                )}
                                                value={perUnitNoDelivery || 1}
                                                onChange={
                                                    handlePerUnitNoDeliveryChange
                                                }
                                                autoComplete="off"
                                                type="number"
                                                placeholder="1"
                                                min="1"
                                            />
                                        </div>

                                        {/* Add License Button */}
                                        {/* <InlineStack align="end">
                            <div style={{ marginTop: "20px" }}>
                            <Button
                                variant="primary"
                                size="large"
                                onClick={toggleLicenseInput}
                                disabled={isLicenseActionDisabled()}
                            >
                                {t("createdigitalproduct.add_key_code")}
                            </Button>
                        </div>
                        </InlineStack> */}
                                    </div>
                                </BlockStack>
                            </div>
                        </BlockStack>
                    </div>
                );



            case "links-upload":
                return (
                    <BlockStack gap="300">
                        {selectedProduct ? (
                            <div
                                style={{
                                    marginTop: "10px",
                                }}
                            >
                                <InlineGrid
                                    columns="1fr auto"
                                    style={{
                                        marginBottom: "10px",
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
                                                    alt={selectedProduct.title}
                                                    size="large"
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    marginLeft: "20px",
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
                                                    {selectedProduct.variants
                                                        .length > 1 ? (
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
                                    <div onClick={toggleProductPicker}>
                                        <Link url="#">
                                            <Text variant="bodyLg" as="p">
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
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ flex: "75%" }}>
                                    <TextField
                                        value={
                                            selectedProduct
                                                ? selectedProduct.title
                                                : ""
                                        }
                                        onFocus={toggleProductPicker}
                                        placeholder={t(
                                            "createdigitalproduct.search_shopify_products"
                                        )}
                                        fullWidth
                                        readOnly
                                    />
                                </div>
                                <div
                                    style={{
                                        flex: "25%",
                                        marginLeft: "1rem",
                                    }}
                                >
                                    <Button onClick={toggleProductPicker}>
                                        {t(
                                            "createdigitalproduct.browse_products"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div>
                            <Text as={"p"} variant={"bodyMd"}>
                                {t('onboarding.trigger_custom_link_delivery')}
                            </Text>
                        </div>
                    </BlockStack>
                );

            case "links-content":
                return (
                    <div>
                        <BlockStack gap="300">
                            {contentType &&
                                contentType.includes("custom_link") && (
                                    <BlockStack gap="300">
                                        {newCustoms.length > 0 && (
                                            <>
                                                {newCustoms.map(
                                                    (link, index) => {
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
                                                (selectedCustomId, index) => {
                                                    const selectedCustom =
                                                        customs.find(
                                                            (custom) =>
                                                                custom.id ===
                                                                selectedCustomId
                                                        );
                                                    if (!selectedCustom)
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

                            <div>
                                <BlockStack gap="300">
                                    {/* Custom Link Form Fields */}
                                    <div
                                        style={{
                                            marginLeft: "23px",
                                            marginRight: "23px",
                                            marginTop: "5px",
                                        }}
                                    >
                                        <TextField
                                            label={t(
                                                "createdigitalproduct.title"
                                            )}
                                            value={title}
                                            onChange={handleTitleChange}
                                            autoComplete="off"
                                        />

                                        <div
                                            style={{
                                                marginTop: "10px",
                                            }}
                                        >
                                            <TextField
                                                label={t(
                                                    "createdigitalproduct.redirects_to_url"
                                                )}
                                                value={redirectURL}
                                                onChange={
                                                    handleRedirectURLChange
                                                }
                                                autoComplete="off"
                                                placeholder="https://example.com/file.pdf"
                                            />
                                        </div>

                                        <div
                                            style={{
                                                marginTop: "10px",
                                            }}
                                        >
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


                                    </div>
                                </BlockStack>
                            </div>
                        </BlockStack>
                    </div>
                );



            case "mixedContent-upload":
                return (
                    <div>
                        <BlockStack gap="400">
                            <BlockStack gap="300">
                                {selectedProduct ? (
                                    <div
                                        style={{
                                            marginTop: "10px",
                                        }}
                                    >
                                        <InlineGrid
                                            columns="1fr auto"
                                            style={{
                                                marginBottom: "10px",
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
                                                            marginLeft: "20px",
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
                                                                .length > 1 ? (
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
                                            <div onClick={toggleProductPicker}>
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
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div style={{ flex: "75%" }}>
                                            <TextField
                                                value={
                                                    selectedProduct
                                                        ? selectedProduct.title
                                                        : ""
                                                }
                                                onFocus={toggleProductPicker}
                                                placeholder={t(
                                                    "createdigitalproduct.search_shopify_products"
                                                )}
                                                fullWidth
                                                readOnly
                                            />
                                        </div>
                                        <div
                                            style={{
                                                flex: "25%",
                                                marginLeft: "1rem",
                                            }}
                                        >
                                            <Button
                                                onClick={toggleProductPicker}
                                            >
                                                {t(
                                                    "createdigitalproduct.browse_products"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Text as={"p"} variant={"bodyMd"}>
                                        {t('onboarding.trigger_file_or_key_delivery')}

                                    </Text>
                                </div>
                            </BlockStack>

                            <BlockStack gap="300">
                                <Text variant="headingMd" as="h6">
                                    {t(
                                        "createdigitalproduct.provide_the_following_content_to_the_customer"
                                    )}
                                </Text>

                                {contentType &&
                                    contentType.includes("files") && (
                                        <BlockStack gap="200">
                                            {files.length > 0 &&
                                                files.map((file, index) => {
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

                                                                    onClick={() =>
                                                                        handleDeleteFileAtIndex(
                                                                            index,
                                                                            "files"
                                                                        )
                                                                    }
                                                                >
                                                                    <Icon
  source={XSmallIcon}
  tone="base"
/>
                                                                </Button>
                                                            </div>
                                                        </InlineGrid>
                                                    );
                                                })}

                                            <div>
                                                {orders
                                                    .filter(
                                                        (order) =>
                                                            selectedResources.includes(
                                                                order.id
                                                            ) && order.url
                                                    )
                                                    .map((order, index) => {
                                                        const isSelected =
                                                            selectedResources.includes(
                                                                order.id
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
                                                                                                order.fileName
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
                                                                                        {order.mimeType.toUpperCase()}{" "}
                                                                                        -{" "}
                                                                                        {prettyBytes(
                                                                                            order.byteSize
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
                                                    })}
                                            </div>

                                            {saving && (
                                                <div>
                                                    <Text as={"h5"}>
                                                        {t(
                                                            "createdigitalproduct.files_are_uploading_please_wait"
                                                        )}
                                                    </Text>
                                                    <ProgressBar
                                                        progress={progress}
                                                    />
                                                </div>
                                            )}
                                        </BlockStack>
                                    )}

                                {contentType &&
                                    contentType.includes("license") && (
                                        <BlockStack gap="200">
                                            {newLicenses.length > 0 && (
                                                <>
                                                    {newLicenses.map(
                                                        (license, index) => {
                                                            return (
                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            "10px",
                                                                    }}
                                                                    key={index}
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
                                                                                                        <Button></Button>
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
                                                                (license) =>
                                                                    license.id ===
                                                                    selectedLicenseId
                                                            );
                                                        if (!selectedLicense)
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

                                {contentType &&
                                    contentType.includes("custom_link") && (
                                        <BlockStack gap="300">
                                            {newCustoms.length > 0 && (
                                                <>
                                                    {newCustoms.map(
                                                        (link, index) => {
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
                                                                (custom) =>
                                                                    custom.id ===
                                                                    selectedCustomId
                                                            );
                                                        if (!selectedCustom)
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
                                                    height: "24px",
                                                    marginLeft: "54px",
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
                                                onClick={toggleModal}
                                            >
                                                {t(
                                                    "createdigitalproduct.add_files"
                                                )}
                                            </Button>
                                        </BlockStack>

                                        <Modal
                                            open={isModalOpen}
                                            onClose={toggleModal}
                                            title={t(
                                                "createdigitalproduct.add_files_lg"
                                            )}
                                            primaryAction={{
                                                content: t(
                                                    "createdigitalproduct.add"
                                                ),
                                                onAction: toggleFileUpload,
                                            }}
                                            secondaryActions={[
                                                {
                                                    content: t(
                                                        "digtal_product_listing.cancel"
                                                    ),
                                                    onAction: toggleModal,
                                                },
                                            ]}
                                        >
                                            <Modal.Section>
                                                <BlockStack gap="400">
                                                    <DropZone
                                                        label={fileLabelText}
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

                                                    {files.length > 0 && (
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
                                            </Modal.Section>
                                        </Modal>
                                    </Card>
                                    <div>
                                        <Card>
                                            <BlockStack gap="300">
                                                <div
                                                    style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        marginLeft: "54px",
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
                                                    onClick={toggleLicenseModal}
                                                >
                                                    {t(
                                                        "createdigitalproduct.license_keys_codes"
                                                    )}
                                                </Button>
                                            </BlockStack>
                                            <Modal
                                                size="large"
                                                open={isLicenseModalOpen}
                                                onClose={toggleLicenseModal}
                                                title={t(
                                                    "createdigitalproduct.add_license_key_code"
                                                )}
                                                primaryAction={{
                                                    size: "large",
                                                    content: t(
                                                        "createdigitalproduct.add_key_code"
                                                    ),
                                                    onAction:
                                                        toggleLicenseInput,
                                                    disabled:
                                                        isLicenseActionDisabled(),
                                                }}
                                                secondaryActions={[
                                                    {
                                                        size: "large",
                                                        content: t(
                                                            "digtal_product_listing.cancel"
                                                        ),
                                                        onAction:
                                                            toggleLicenseModal,
                                                    },
                                                ]}
                                            >
                                                <Modal.Section>
                                                    <div
                                                        style={{
                                                            marginLeft: "23px",
                                                            marginRight: "23px",
                                                            marginTop: "5px",
                                                        }}
                                                    >
                                                        <TextField
                                                            label={t(
                                                                "createdigitalproduct.title"
                                                            )}
                                                            value={licenseTitle}
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
                                                                            FWUE2TEX
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {value === "manual" && (
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
                                                                            "10px",
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
                                                                    "20px",
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
                                                </Modal.Section>
                                            </Modal>
                                        </Card>
                                    </div>
                                    <div>
                                        <Card>
                                            <BlockStack gap="300">
                                                <div
                                                    style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        marginLeft: "54px",
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
                                                    onClick={
                                                        toggleCustomLinkModal
                                                    }
                                                >
                                                    {t(
                                                        "createdigitalproduct.custom_link"
                                                    )}
                                                </Button>
                                            </BlockStack>

                                            <Modal
                                                open={isCustomLinkModalOpen}
                                                onClose={toggleCustomLinkModal}
                                                title={t(
                                                    "createdigitalproduct.add_custom_link"
                                                )}
                                                primaryAction={{
                                                    size: "large",
                                                    content: t(
                                                        "createdigitalproduct.add_custom_link"
                                                    ),
                                                    onAction: toggleCustomLink,
                                                    disabled:
                                                        !title.trim() ||
                                                        !redirectURL.trim(),
                                                }}
                                                secondaryActions={[
                                                    {
                                                        size: "large",
                                                        content: t(
                                                            "digtal_product_listing.cancel"
                                                        ),
                                                        onAction:
                                                            toggleCustomLinkModal,
                                                    },
                                                ]}
                                            >
                                                <Modal.Section>
                                                    <div
                                                        style={{
                                                            marginLeft: "23px",
                                                            marginRight: "23px",
                                                            marginTop: "5px",
                                                        }}
                                                    >
                                                        <TextField
                                                            label={t(
                                                                "createdigitalproduct.title"
                                                            )}
                                                            value={title}
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
                                                    </div>
                                                </Modal.Section>
                                            </Modal>
                                        </Card>
                                    </div>
                                </div>
                            </BlockStack>
                        </BlockStack>
                    </div>
                );



            case "notSure-notsure":
                return (
                    <div
                        style={{
                            marginTop: "10px",
                        }}
                    >
                        <Button
                            onClick={() =>
                                window.$crisp.push(["do", "chat:open"])
                            }
                        >
                            {t("onboarding.chat_with_us")}
                        </Button>
                    </div>
                );

            default:
                return (
                    <div>
                        <style>
                            {`
                .Polaris-Modal-CloseButton,
                .Polaris-Modal-Header__CloseButton,
                [aria-label="Close"],
                .Polaris-Modal .Polaris-Button[aria-label="Close"],
                .Polaris-Button.Polaris-Button--pressable.Polaris-Button--variantTertiary.Polaris-Button--sizeMedium.Polaris-Button--textAlignCenter.Polaris-Button--iconOnly,
                .Polaris-Button--iconOnly {
                    display: none !important;
                }
                .Polaris-Modal-Header {
                    padding-right: 0 !important;
                }
                `}
                        </style>
                        <BlockStack gap="300">
                            <Text variant="bodyMd" as="p">
                                Configuration for {productType} - {stepId}
                            </Text>
                            <TextField
                                label="Additional Notes"
                                value={formData[`${stepId}_notes`] || ""}
                                onChange={(value) =>
                                    updateFormData(`${stepId}_notes`, value)
                                }
                                multiline={3}
                                placeholder="Add any notes for this configuration..."
                            />
                        </BlockStack>
                    </div>
                );
        }
    };

    // Modal content logic
    const getModalContent = () => {
        if (showCongratulations) return handleOnboardingComplete();
        if (showProductSelection) return renderProductSelection();
        return renderConfigurationStep();
    };

    const getModalTitle = () => {
        if (showCongratulations) return "Setup Complete";
        if (showProductSelection)
            return t(
                "onboarding.onboarding_what_type_of_digital_product_do_you_want_to_sell"
            );
        return productTypeConfigs[selectedProductType]?.title;
    };

    // Helper function to check if current step is valid
    const isCurrentStepValid = () => {
        if (showProductSelection || showCongratulations) return true;

        const config = productTypeConfigs[selectedProductType];
        const currentStep = config.steps[currentSubStep];

        // Validation rules for each step type
        switch (`${selectedProductType}-${currentStep.id}`) {
            case "file-upload":
                return selectedProduct && files.length > 0;

            case "pdf-upload":
                return selectedProduct && files.length > 0;

            case "file-settings":
                return selectedProduct;

            case "pdf-stamping":
                return true;

            case "license-upload":
                return selectedProduct;

            case "license-generation":
                return !isLicenseActionDisabled();

            case "links-link-config":
                return (
                    selectedProduct &&
                    formData.customUrl &&
                    formData.customUrl.trim().length > 0
                );

            case "mixedContent-upload":
                return (
                    (selectedProduct && files.length > 0) ||
                    (title.trim() && redirectURL.trim() && selectedProduct) ||
                    (!isLicenseActionDisabled() && selectedProduct)
                );

            case "mixedContent-settings":
                return true;

            case "links-content":
                return title.trim() && redirectURL.trim();

            case "notSure-notsure":
                return true;

            // case "mixedContent-upload":
            //     return true;

            default:
                // For unknown steps, require product selection at minimum
                return selectedProduct;
        }
    };


    const getPrimaryAction = () => {
        if (showCongratulations) {
            return {
                content: "Complete Setup",
                onAction: () => {
                    setModalActive(false);
                    navigate("/digitalProducts");
                },
            };
        }

        if (showProductSelection) {
            return {
                content: t("onboarding.continue"),
                onAction: () => handleProductTypeSelect(selectedProductType),
                disabled: !selectedProductType,
            };
        }

        // Special case: if it's the last step AND user selected "Not Sure"
        if (isLastStep && selectedProductType === "notSure") {
            return {
                content: t("onboarding.next"),
                onAction: handleNotSure,
            };
        }

        // Regular last step behavior for all other product types
     if (isLastStep) {
    return {
        content: saving
            ? t("onboarding.saving")
            : t("onboarding.save_configuration"),
        onAction: () => {
            const currentConfig = productTypeConfigs[selectedProductType];
            const currentStep = currentConfig?.steps[currentSubStep];
            const stepId = currentStep?.id;

            let additionalData = {};

            if (selectedProductType === 'links' && stepId === 'content') {
                const newCustom = {
                    title: title,
                    redirectURL: redirectURL,
                    linkDetail: linkDetail,
                };

                additionalData.newCustoms = [newCustom];
                additionalData.contentTypes = ['custom_link'];

                // Update state for UI (but don't wait for it)
                setNewCustoms((prevCustoms) => [...prevCustoms, newCustom]);
                setIsCustomLinkModalOpen(!isCustomLinkModalOpen);
            }

            if (selectedProductType === 'license' && stepId === 'generation') {
                const newLicense = {
                    title: licenseTitle,
                    licenseType: value,
                    prefix: prefix,
                    codeLength: codeLength,
                    suffix: suffix,
                    totalCodes: totalCodes,
                    licenseFiles: selectedManualLicenseTab === 0 ? licenseFiles : [],
                    pasteKeysValue: selectedManualLicenseTab === 1 ? pasteKeysValue : "",
                    qrCodeEnabled: qrCodeEnabled,
                    sendKeyToMultipleCustomers: sendKeyToMultipleCustomers,
                    deliverKeysInSequence: deliverKeysInSequence,
                    manual_codes_type: selectedManualLicenseTab === 0 ? "csv" : "paste_text",
                    perUnitNoDelivery: perUnitNoDelivery,
                };

                additionalData.newLicenses = [newLicense];
                additionalData.contentTypes = ['license'];

                // Update state for UI (but don't wait for it)
                setNewLicenses((prevLicenses) => [...prevLicenses, newLicense]);

                // Clear the form fields
                setLicenseTitle("");
                setValue("");
                setPrefix("");
                setCodeLength("");
                setSuffix("");
                setTotalCodes("");
                setPasteKeysValue("");
                setLicenseFiles([]);
                setQrCodeEnabled(false);
                setSendKeyToMultipleCustomers(false);
                setDeliverKeysInSequence(false);
                setPerUnitNoDelivery(1);

                setIsLicenseModalOpen(!isLicenseModalOpen);
            }

            // Call handleSave with the additional data
            handleSave(additionalData);
        },
        disabled: saving || !isCurrentStepValid(),
    };
}

        // Default: not the last step
        return {
            content: t("onboarding.next_step"),
            onAction: handleNext, // This now includes step-specific actions
            disabled: !isCurrentStepValid(),
        };
    };
    const getSecondaryActions = () => {
        if (showCongratulations) {
            return [
                {
                    content: t("onboarding.back_to_setup"),
                    onAction: handleBack,
                },
            ];
        }

        if (showProductSelection) {
            return []; // No secondary actions when showing product selection
        }

        return [
            {
                content: t("onboarding.back"),
                onAction: handleBack,
            },
        ];
    };

    return (
        <div style={{ height: "600px" }}>
            <style>
                {`
        .Polaris-Modal-CloseButton,
        .Polaris-Modal-Header__CloseButton,
        [aria-label="Close"],
        .Polaris-Modal .Polaris-Button[aria-label="Close"],
        .Polaris-Button.Polaris-Button--pressable.Polaris-Button--variantTertiary.Polaris-Button--sizeMedium.Polaris-Button--textAlignCenter.Polaris-Button--iconOnly,
        .Polaris-Button--iconOnly {
            display: none !important;
        }
        .Polaris-Modal-Header {
            padding-right: 0 !important;
        }
        `}
            </style>
            <Frame>
                <Modal
                    open={modalActive}
                    instant
                    onClose={() => {}}
                    title={getModalTitle()}
                    primaryAction={getPrimaryAction()}
                    secondaryActions={getSecondaryActions()}
                >
                    {getModalContent()}
                </Modal>
            </Frame>
        </div>
    );
};

export default Step1;
