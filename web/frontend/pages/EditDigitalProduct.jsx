import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Page,
    Card,
    Button,
    Text,
    InlineStack,
    ButtonGroup,
    BlockStack,
    Link,
    InlineGrid,
    Badge,
    Thumbnail,
    Select,
    Checkbox,
    SkeletonPage,
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText,
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
        EmptyState,
    Banner,
    RadioButton,
    Box,
    Popover,
    DatePicker,
    ProgressBar,
    Pagination,
    Spinner,
    Autocomplete,
    List,
    FormLayout,
} from "@shopify/polaris";
import { CalendarIcon, XSmallIcon } from "@shopify/polaris-icons";
import prettyBytes from "pretty-bytes";
import { AppContext } from "../components/providers/AppProvider.jsx";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { PopoverPicker } from "../components/PopoverPicker.jsx";
import { useAppBridge } from "@shopify/app-bridge-react";
import { SaveBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { EmailPreviewModal } from "../components/EmailPreviewModal.jsx";
const MAX_FILE_BYTE = 1073741824;
const MAX_SAMPLE_FILE_BYTE = 10485760;
const MAX_SAMPLE_FILES = 5;

const EditDigitalProduct = () => {
    const { id } = useParams();
    const { store } = React.useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const shopify = useAppBridge();
    const [isDigitalProductFetched, setIsDigitalProductFetched] =
        useState(false);
    const [selected, setSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [autoFulfill, setAutoFulfill] = useState(false);
    const [downloadLimit, setDownloadLimit] = useState("");
    const [isDownloadLimitEnabled, setIsDownloadLimitEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [sampleFiles, setSampleFiles] = useState([]);
    const [oldSampleFiles, setOldSampleFiles] = useState([]);
    const [licenseFiles, setLicenseFiles] = useState([]);
    const [attachedLicenseFile, setAttachedLicenseFile] = useState(null);
    const [licenses, setLicenses] = useState([]);
    const [customs, setCustoms] = useState([]);
    const [digitalProduct, setDigitalProduct] = useState({});
    const [oldFiles, setOldFiles] = useState([]);
    const [oldVideos, setOldVideos] = useState([]);
    const [orders, setOrders] = useState([]);
    const [filterLicenseValue, setFilterLicenseValue] = useState("");
    const [filterCustomValue, setFilterCustomValue] = useState("");
    const [selectedFileIds, setSelectedFileIds] = useState([]); // Track selected file IDs across all pages
    const [selectedFileDetails, setSelectedFileDetails] = useState([]); // Track full details of selected files
    const [selectedMainTab, setSelectedMainTab] = useState(0);
    const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
    const [selectedLicenseIds, setSelectedLicenseIds] = useState([]);
    const [selectedLicensesKeys, setSelectedLicensesKeys] = useState([]);
    const [licenseKeysPerUnit, setLicenseKeysPerUnit] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [selectedLicenseTab, setSelectedLicenseTab] = useState(0);
    const [selectedManualLicenseTab, setSelectedManualLicenseTab] = useState(0);
    const [selectedCustomIds, setSelectedCustomIds] = useState([]);
    const [selectedCustomLinks, setSelectedCustomLinks] = useState([]);
    const [selectAllForCustom, setSelectAllForCustom] = useState(false);
    const [selectedCustomTab, setSelectedCustomTab] = useState(0);
    const [isCustomLinkModalOpen, setIsCustomLinkModalOpen] = useState(false);
    const [isEmailPreviewModalOpen, setIsEmailPreviewModalOpen] = useState(false);
    const [tagInputValue, setTagInputValue] = useState("");
    const [tags, setTags] = useState([]);
         const { t } = useTranslation();
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
    const [saving, setSaving] = useState(false);
    const [userPlan, setUserPlan] = useState("free");
    const [fileSizeLimit, setFileSizeLimit] = useState("No limit");
    const [fileStorageLimit, setFileStorageLimit] = useState(null);
    const [currentFileStorage, setCurrentFileStorage] = useState(0);
    const [currentPageFiles, setCurrentPageFiles] = useState(1);
    const [currentPageLicenses, setCurrentPageLicenses] = useState(1);
    const [currentPageCustoms, setCurrentPageCustoms] = useState(1);
    const [totalFiles, setTotalFiles] = useState(0);
    const [totalLicenses, setTotalLicenses] = useState(0);
    const [totalCustoms, setTotalCustoms] = useState(0);
    const itemsPerPage = 10;
    const [productMessage, setProductMessage] = useState("");
    const [isProductMessageEnabled, setIsProductMessageEnabled] =
        useState(false);
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
    const [newLicenses, setNewLicenses] = useState([]);
    const [newCustoms, setNewCustoms] = useState([]);
    const [qrCodeEnabled, setQrCodeEnabled] = useState(false);
    const [oneKeyDelivery,setOneKeyDelivery] = useState(false);
    const [qrCodePrintOnPDF, setQRCodePrintOnPDF] = useState(false);
    const [giftCardEnabled, setGiftCardEnabled] = useState(false);
    const [giftCardPropertyName, setGiftCardPropertyName] = useState("");
    const [giftDeliveryPropertyName, setGiftDeliveryPropertyName] = useState("");
    const [sendKeyToMultipleCustomers, setSendKeyToMultipleCustomers] = useState(false);
    const [deliverKeysInSequence, setDeliverKeysInSequence] = useState(false);
    const [pasteKeysValue, setPasteKeysValue] = useState("");
    const [perUnitNoDelivery, setPerUnitNoDelivery] = useState(1);
    const [emailTemplateType, setEmailTemplateType] = useState("");
    const [emailTemplateId, setEmailTemplateId] = useState(null);
    const [emailTemplates, setEmailTemplates] = useState();
    const [defaultTemplateId, setDefaultTemplateId] = useState();
    const [sendingUpdateEmails, setSendingUpdateEmails] = useState(false);
    const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [videoOptions, setVideoOptions] = useState([]);
        const [vimeoVideoOptions, setVimeoVideoOptions] = useState([]);
        const [vimeoVideosRecord, setVimeoVideosRecord] = useState([]);
        const [wistiaVideosRecord, setWistiaVideosRecord] = useState([]);
        const [wistiaVideoOptions, setWistiaVideoOptions] = useState([]);
        const [newProviderVideo, setNewProviderVideo] = useState([]);
        const [selectedVideos, setSelectedVideos] = useState([]);
        const [selectedVideo, setSelectedVideo] = useState('');
        const [loadingVideos, setLoadingVideos] = useState(false);
        const [selectedVideoTab, setSelectedVideoTab] = useState(0);
        const [existingVideos, setExistingVideos] = useState([]);
        const [selectedExistingVideos, setSelectedExistingVideos] = useState([]);
        const [currentVideosPage, setCurrentVideosPage] = useState(1);
        const [totalVideos, setTotalVideos] = useState(0);
        const [loadingExistingVideos, setLoadingExistingVideos] = useState(false);
        const [videoInputValue, setVideoInputValue] = useState('');
        const [videoSearchOptions, setVideoSearchOptions] = useState([]);
        const [videoSelectedOptions, setVideoSelectedOptions] = useState([]);
    const app = useAppBridge();
    const APP_ID = "78b2cf9c2a9c63431defd44ad600ee8f";
    const EXTENSION_HANDLE = "digitally";
    const [isMobile, setIsMobile] = useState(false);
    const [isManualDeliveryEnabled, setIsManualDeliveryEnabled] = useState(false);
    const [licensePreview, setLicensePreview] = useState('FWUE2TEX');
    const [isOrderAttributeTriggerEnabled, setIsOrderAttributeTriggerEnabled] = useState(false);
    const [orderAttributeName, setOrderAttributeName] = useState("");
    const [orderAttributeValue, setOrderAttributeValue] = useState("");
    const [isGlobalOrderAttributeTrigger, setIsGlobalOrderAttributeTrigger] = useState(false);

    // SaveBar state
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [isInitialDataCaptured, setIsInitialDataCaptured] = useState(false);
    // Track initial loading state for each data source
    const [initialLoadState, setInitialLoadState] = useState({
        digitalProduct: false,
        files: false,
        licenses: false,
        customLinks: false
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
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
    const [{ month, year }, setDate] = useState({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
    });
    const datePickerRef = useRef(null);
    const formattedValue = selectedDate.toISOString().slice(0, 10);

    const [isPdfStampingEnabled, setIsPdfStampingEnabled] = useState(false);
    const [templateChoice, setTemplateChoice] = useState("default");
    const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
    const [textSize, setTextSize] = useState("12");
    const [textColor, setTextColor] = useState("");
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
    const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
    const [customerCount, setCustomerCount] = useState(null);
    const [googleDriveLink, setGoogleDriveLink] = useState("");

    function isNodeWithinPopover(node) {
        return datePickerRef?.current
            ? nodeContainsDescendant(datePickerRef.current, node)
            : false;
    }
    const [progress, setProgress] = useState(0);

    const handlePdfStampingEnabledChange = (checked) => {
        setIsPdfStampingEnabled(checked);
    };

    const handleTemplateChoiceChange = (newTemplateChoice) => {
        setTemplateChoice(newTemplateChoice);
    };

    const toggleCustomTemplateModal = () => {
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

    const handleEnableThemeExtension = () => {
        // const redirect = Redirect.create(app);
        // redirect.dispatch(Redirect.Action.ADMIN_PATH, {
        //     path: `/themes/current/editor?context=apps&activateAppId=${APP_ID}/${EXTENSION_HANDLE}`,
        //     newContext: true,
        // });
        open(`shopify://admin/themes/current/editor?context=apps&activateAppId=${APP_ID}/${EXTENSION_HANDLE}`, '_top');
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
                shopify.toast.show(t(
                        "createdigitalproduct.pdf_template_saved_successfully"
                    ));
            } else {
                throw new Error("Failed to save PDF template");
            }
        } catch (error) {
            console.error("Error saving template:", error);
            shopify.toast.show(t(
                    "createdigitalproduct.failed_to_save_pdf_template_please_try_again"
                ), { isError: true, duration: 9999999 });
        } finally {
            setIsPDFModalOpen(false);
        }
    };

    const fetchCustomerCount = async (productId) => {
        try {
            const res = await fetch(
                `/api/digital-product/${productId}/customers-count`
            );
            const data = await res.json();

            console.log("API Response:", data);

            if (data.success) {
                setCustomerCount(data.count);
            } else {
                console.error("API returned failure:", data);
            }
        } catch (err) {
            console.error("Failed to fetch customer count:", err);
        }

        setSendingUpdateEmails(false);
    };

    useEffect(() => {
        console.log("Digital Product:", digitalProduct);
        if (digitalProduct?.id) {
            fetchCustomerCount(digitalProduct.id);
        }
    }, [digitalProduct]);

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

    const handlePasteKeysChange = (newValue) => {
        setPasteKeysValue(newValue);
    };

    const handleOneKeyDelivery = (checked) => {
        setOneKeyDelivery(checked);
    };
    const handleQRCode = (checked) => {
        setQrCodeEnabled(checked);
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
        {
            id: "googleDrive",
            content: t("createdigitalproduct.google_drive_file"),
        },
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

    const videoTabs = [
            {
                id: "existingVideos",
                content: t("digtal_product_listing.from_existing_videos"),
            },
            { id: "newVideo", content: t("digtal_product_listing.add_new_video") },
        ];

        const handleVideoTabChange = useCallback((selectedTabIndex) => {
            setSelectedVideoTab(selectedTabIndex);
        }, []);

    const toggleVideoModal = () => {
        setIsVideoModalOpen(!isVideoModalOpen);
    };

    const toggleVideo = () => {
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

        const newVideo = {
            title: selectedRecord.name,
            duration: formatVideoDuration(selectedRecord.duration),
            value: selectedAccount === 'vimeo'
                ? selectedRecord.uri.split('/').pop()
                : selectedRecord.hashed_id,
            hashed_id: selectedAccount === 'wistia' ? (selectedRecord.hashed_id || null) : null,
            thumbnail: selectedAccount === 'vimeo'
                ? selectedRecord.pictures?.base_link
                : selectedRecord.thumbnail?.url,
            provider: selectedAccount
        };
        setNewProviderVideo(prev => {

            const existsInNew = prev.some(v =>
                (v.value || v.provider_video_id) === newVideo.value ||
                (selectedAccount === 'wistia' && v.hashed_id && v.hashed_id === newVideo.hashed_id)
            );

            const existsInExisting = selectedExistingVideos.some(v =>
                (v.value || v.provider_video_id) === newVideo.value ||
                (selectedAccount === 'wistia' && v.hashed_id && v.hashed_id === newVideo.hashed_id)
            );

            const existsInOld = oldVideos.some(v =>
                (v.value || v.provider_video_id) === newVideo.value ||
                (selectedAccount === 'wistia' && v.hashed_id && v.hashed_id === newVideo.hashed_id)
            );
            if (existsInNew || existsInExisting || existsInOld) {
                shopify.toast.show(t("library.video_already_exists_in_selection"), { isError: true });
                return prev;
            }
            return [...prev, newVideo];
        });
        setSelectedVideo('');
        setIsVideoModalOpen(false);
        handleContentTypeChange("videos");
    };

    const formatVideoDuration = (seconds) => {
        if (!seconds) return "0 sec";

        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs} hr ${mins} min`;
        }

        if (mins > 0) {
            return `${mins} min ${secs} sec`;
        }

        return `${secs} sec`;
    };

    useEffect(() => {
            setSelectedVideos(newProviderVideo);
        }, [newProviderVideo]);

    useEffect(() => {
            fetchExistingVideos(currentVideosPage, videoInputValue);
        }, [currentVideosPage, videoInputValue]);

    const handleDeleteOldVideo = async (videoId, videoValue) => {
            setOldVideos(prev =>
                prev.filter(v => v.value !== videoValue)
            );

            try {
                const response = await fetch(`/api/delete-product-video/${videoId}/${id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    console.log('Video detached successfully');
                }
            } catch (error) {
                console.error('Error detaching video:', error);
            }
        };

        const handleDeleteNewVideo = (videoValue) => {
            setNewProviderVideo(prev =>
                prev.filter(video => video.value !== videoValue)
            );

            setSelectedExistingVideos(prev =>
                prev.filter(video => video.value !== videoValue)
            );
        };

        const handleDeleteExistingVideo = (videoValue) => {
            setSelectedExistingVideos(prev =>
                prev.filter(video => video.value !== videoValue)
            );

            setNewProviderVideo(prev =>
                prev.filter(video => video.value !== videoValue)
            );
        };

        const addSelectedExistingVideos = () => {
            const videosToAdd = existingVideos.filter(video =>
                selectedVideoResources.includes(video.id) &&
                !selectedExistingVideos.some(existingVideo => existingVideo.value === video.value || (video.provider === 'wistia' && existingVideo.hashed_id && video.hashed_id && existingVideo.hashed_id === video.hashed_id)) &&
                !newProviderVideo.some(newVideo => newVideo.value === video.value || (video.provider === 'wistia' && newVideo.hashed_id && video.hashed_id && newVideo.hashed_id === video.hashed_id)) &&
                !oldVideos.some(oldVideo => oldVideo.value === video.value || (video.provider === 'wistia' && oldVideo.hashed_id && video.hashed_id && oldVideo.hashed_id === video.hashed_id))
            );

            if (videosToAdd.length === 0 && selectedVideoResources.length > 0) {
                shopify.toast.show(t("library.videos_already_exist_in_selection"), { isError: true });
            } else {
                setSelectedExistingVideos(prev => [...prev, ...videosToAdd]);
                setIsVideoModalOpen(false);
                handleContentTypeChange("videos");
            }
        };

        useEffect(() => {
            if (isVideoModalOpen && selectedVideoTab === 0) {
                fetchExistingVideos(currentVideosPage, videoInputValue);
            }
        }, [isVideoModalOpen, selectedVideoTab]);

    const formatDuration = (seconds) => {
        const totalSeconds = Math.floor(seconds);

        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                    label: `${video.name}  -  ${formatDuration(video.duration)}`,
                    value: video.uri.split('/').pop(),
                    thumbnail: video.thumbnail
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

    const handleVideoInputChange = async (value) => {
        setVideoInputValue(value);

        if (value.length > 2) {
            setLoadingExistingVideos(true);

            try {
                const response = await fetch(
                    `/api/videos?search=${encodeURIComponent(value)}&page=1&perPage=10`,
                    {
                        method: "GET",
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );

                const data = await response.json();

                if (data.success) {
                    if (data.videos && data.videos.data) {
                        setExistingVideos(Array.isArray(data.videos.data) ? data.videos.data : []);
                        setTotalVideos(data.videos.total || 0);
                        setCurrentVideosPage(data.videos.current_page || 1);
                    } else if (data.videos && Array.isArray(data.videos)) {
                        setExistingVideos(data.videos);
                        setTotalVideos(data.videos.length);
                    } else {
                        setExistingVideos([]);
                        setTotalVideos(0);
                    }

                    // Update search options for autocomplete
                    if (data.videos && (data.videos.data || Array.isArray(data.videos))) {
                        const videosList = data.videos.data || data.videos;
                        const options = videosList.map((video) => ({
                            label: video.title,
                            value: video.id.toString(),
                        }));
                        setVideoSearchOptions(options);
                    }
                } else {
                    setExistingVideos([]);
                    setTotalVideos(0);
                    setVideoSearchOptions([]);
                }
            } catch (error) {
                console.error('Error searching videos:', error);
                setExistingVideos([]);
                setTotalVideos(0);
                setVideoSearchOptions([]);
            } finally {
                setLoadingExistingVideos(false);
            }
        } else {
            setVideoSearchOptions([]);
        }
    };

    const fetchExistingVideos = async (page = 1, search = '') => {
        try {
            setLoadingExistingVideos(true);

            const response = await fetch(`/api/videos?page=${page}&search=${encodeURIComponent(search)}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            if (data.videos) {
                console.log("Videos fetched!");
            }

            if (data.success) {
                if (data.videos && data.videos.data) {
                    setExistingVideos(Array.isArray(data.videos.data) ? data.videos.data : []);
                    setTotalVideos(data.videos.total || 0);
                    setCurrentVideosPage(data.videos.current_page || 1);
                } else if (data.videos && Array.isArray(data.videos)) {
                    setExistingVideos(data.videos);
                    setTotalVideos(data.videos.length);
                    setCurrentVideosPage(1);
                } else {
                    if (data.data && Array.isArray(data.data)) {
                        setExistingVideos(data.data);
                        setTotalVideos(data.total || data.data.length);
                        setCurrentVideosPage(data.current_page || 1);
                    } else {
                        setExistingVideos([]);
                        setTotalVideos(0);
                    }
                }
            } else {
                setExistingVideos([]);
                setTotalVideos(0);
            }
            setLoadingExistingVideos(false);
        } catch (error) {
            console.error('Failed to fetch existing videos:', error);
            setExistingVideos([]);
            setTotalVideos(0);
            setLoadingExistingVideos(false);
        }
    };

    const handleVideoSearch = async () => {
        setLoadingExistingVideos(true);
        setCurrentVideosPage(1);
        try {
            const response = await fetch(
                `/api/videos?search=${encodeURIComponent(videoInputValue)}&page=1&perPage=10`,
                {
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                // Handle paginated response
                if (data.videos && data.videos.data) {
                    setExistingVideos(Array.isArray(data.videos.data) ? data.videos.data : []);
                    setTotalVideos(data.videos.total || 0);
                    setCurrentVideosPage(data.videos.current_page || 1);
                } else if (data.videos && Array.isArray(data.videos)) {
                    setExistingVideos(data.videos);
                    setTotalVideos(data.videos.length);
                } else if (data.data && Array.isArray(data.data)) {
                    setExistingVideos(data.data);
                    setTotalVideos(data.total || data.data.length);
                    setCurrentVideosPage(data.current_page || 1);
                } else {
                    setExistingVideos([]);
                    setTotalVideos(0);
                }

                // Update search options for autocomplete
                if (data.videos && (data.videos.data || Array.isArray(data.videos))) {
                    const videosList = data.videos.data || data.videos;
                    const options = videosList.map((video) => ({
                        label: video.title,
                        value: video.id.toString(),
                    }));
                    setVideoSearchOptions(options);
                }
            } else {
                setExistingVideos([]);
                setTotalVideos(0);
                setVideoSearchOptions([]);
            }
        } catch (error) {
            console.error("Error fetching video search results:", error);
            setExistingVideos([]);
            setTotalVideos(0);
            setVideoSearchOptions([]);
        } finally {
            setLoadingExistingVideos(false);
        }
    };

    const updateVideoSelection = useCallback(
            (selected) => {
                if (!selected || selected.length === 0) {
                    return;
                }

                const selectedValue = selected[0];
                const matchedOption = videoSearchOptions.find(
                    (option) => option.label === selectedValue
                );

                if (matchedOption) {
                    setVideoSelectedOptions([selectedValue]);
                    setVideoInputValue(matchedOption.label);
                    setVideoSearchOptions([matchedOption]);
                }
            },
            [videoSearchOptions]
        );

    const handleVideoPageChange = async (newPage) => {
        setLoadingExistingVideos(true);
        const response = await fetch(
            `/api/videos?search=${encodeURIComponent(videoInputValue)}&page=${newPage}&perPage=10`,
            {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();
        if (data.success) {
            if (data.videos && data.videos.data) {
                setExistingVideos(Array.isArray(data.videos.data) ? data.videos.data : []);
                setTotalVideos(data.videos.total || 0);
                setCurrentVideosPage(data.videos.current_page || 1);
            } else if (data.videos && Array.isArray(data.videos)) {
                setExistingVideos(data.videos);
                setTotalVideos(data.videos.length);
            } else {
                setExistingVideos([]);
                setTotalVideos(0);
            }
        } else {
            setExistingVideos([]);
            setTotalVideos(0);
        }
        setLoadingExistingVideos(false);
    };

    const handleClearVideoSearch = () => {
        setVideoInputValue("");
        setVideoSelectedOptions([]);
        setLoadingExistingVideos(true);
        setCurrentVideosPage(1);
        fetchExistingVideos(1, '');
    };

    const videoTextField = (
            <Autocomplete.TextField
                onChange={handleVideoInputChange}
                value={videoInputValue}
                autoComplete="off"
                placeholder={t("library.search_videos_by_title")}
                clearButton
                onClearButtonClick={handleClearVideoSearch}
            />
        );

    useEffect(() => {
            if (store?.setting?.vimeo_integration?.vimeo_integration_enabled && store?.setting?.vimeo_integration?.token_data) {
                fetchVimeoVideos()
            }
        }, [store]);

        useEffect(() => {
            if (store?.setting?.wistia_integration?.wistia_integration_enabled && store?.setting?.wistia_integration?.token_data) {
                fetchWistiaVideos()
            }
        }, [store]);

    const videoResourceName = {
        singular: "video",
        plural: "videos",
    };

    const { selectedResources: selectedVideoResources, allResourcesSelected: allVideoResourcesSelected, handleSelectionChange: handleVideoSelectionChange } =
            useIndexResourceState(existingVideos);

    const videoRowMarkup = existingVideos.map((video, index) => (
            <IndexTable.Row
                id={video.id}
                key={video.id}
                selected={selectedVideoResources.includes(video.id)}
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
                    <div style={{ maxWidth: 320 }}>
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
                    <Badge status={video.provider === 'vimeo' ? 'info' : 'success'}>
                        {video.provider?.toUpperCase()}
                    </Badge>
                </IndexTable.Cell>
            </IndexTable.Row>
        ));

    const handleGoogleDriveLinkChange = (newValue) => {
        setGoogleDriveLink(newValue);
        shopify.saveBar.show('create-digital-product-savebar');
    };

    const handleExpirationDaysChange = (value) => {
        const numericValue = parseInt(value, 10);

        if (numericValue < 1) {
            setExpirationDays(1);
        } else {
            setExpirationDays(numericValue);
        }
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

    useEffect(() => {
        const getEmailTemplates = async () => {
            try {
                const response = await fetch("/api/get-custom-templates");
                const data = await response.json();
                // setUserPlan(data.plan);
                setEmailTemplates(data.templates);
                console.log(data.templates.length);
                if (data.templates.length === 1) {
                    setEmailTemplateId(data.templates[0].id);
                }
                setDefaultTemplateId(data.defaultTemplateId);
            } catch (error) {
                console.error("Failed to fetch user plan:", error);
            }
        };

        getEmailTemplates();
    }, [emailTemplateId]);

    const inputId = 'quantity-input';

    useEffect(() => {
        const input = document.querySelector(`#${inputId} input[type="number"]`);

        if (input) {
            const handleWheel = (e) => {
                // Prevent the default behavior FIRST
                e.preventDefault();
                e.stopPropagation();
                // Then blur the input
                e.target.blur();
            };

            // passive: false is crucial for preventDefault to work
            input.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                input.removeEventListener('wheel', handleWheel);
            };
        }
    }, []);

    const handleDownloadExpirationEnabledChange = (checked) => {
        setIsDownloadExpirationEnabled(checked);
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

    const handleAutoFulfillCheckbox = useCallback(() => {
        setAutoFulfill((prev) => !prev);
    }, []);

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
        if (selectedLicenseTab === 1) {
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
                oneKeyDelivery: oneKeyDelivery,
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
            setOneKeyDelivery(false);
            setQRCodePrintOnPDF(false);
            setGiftCardEnabled(false);
            setGiftCardPropertyName("");
            setGiftDeliveryPropertyName("");
            setSendKeyToMultipleCustomers(false);
            setDeliverKeysInSequence(false);
            setPerUnitNoDelivery(1);
        }
        handleContentTypeChange("license");
        setIsLicenseModalOpen(!isLicenseModalOpen);
    };

    const isCustomLinkFormValid = () => {
        // Only validate when on "Add New Custom Link" tab (tab 1)
        if (selectedCustomTab !== 1) {
            return true; // Always enable button for existing custom links tab
        }
        // Check if title and redirectURL are filled (linkDetail is optional)
        return title?.trim() && redirectURL?.trim();
    };

    const toggleCustomLink = () => {
        if (selectedCustomTab === 1) {
            const newCustom = {
                title: title,
                redirectURL: redirectURL,
                linkDetail: linkDetail,
            };

            setNewCustoms((prevCustoms) => [...prevCustoms, newCustom]);

            setTitle("");
            setRedirectURL("");
            setLinkDetail("");
        }

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

    const handleToggleLicenseSelection = (id) => {
        // Find the license object by ID
        const newLicense = licenses.find((license) => license.id === id);

        // Update selectedLicenseIds
        setSelectedLicenseIds((prevSelected) => {
            if (prevSelected.includes(id)) {
                // If the license is already selected, remove it
                return prevSelected.filter((selectedId) => selectedId !== id);
            } else {
                // If the license is not selected, add it
                return [...prevSelected, id];
            }
        });

        // Update selectedLicensesKeys
        setSelectedLicensesKeys((prevLicenses) => {
            if (prevLicenses.some((license) => license.id === id)) {
                // If the license is already in the list, remove it
                // Remove from keys_per_unit map when deselected
                setLicenseKeysPerUnit(current => {
                    const updated = { ...current };
                    delete updated[id];
                    return updated;
                });
                return prevLicenses.filter((license) => license.id !== id);
            } else {
                // If the license is not in the list, add it
                // Set default value of 1 when selected
                setLicenseKeysPerUnit(current => ({
                    ...current,
                    [id]: 1
                }));
                return [...prevLicenses, newLicense];
            }
        });
    };

    const handleSelectAll = () => {
        const allLicenseIds = licenses.map((license) => license.id);

        if (selectAll) {
            // Unselect all: Clear both selectedLicenseIds and selectedLicensesKeys
            setSelectedLicenseIds([]);
            setSelectedLicensesKeys([]);
        } else {
            // Select all: Set selectedLicenseIds to all IDs and selectedLicensesKeys to all license objects
            setSelectedLicenseIds(allLicenseIds);
            setSelectedLicensesKeys(licenses);
        }

        // Toggle the selectAll state
        setSelectAll(!selectAll);
    };

    const handleNavigation = useCallback(() => {
        shopify.saveBar.hide('edit-digital-product-savebar');
        navigate("/settings/integrations");
    }, [navigate]);

    useEffect(() => {
        fetchCustomLinks();
    }, [currentPageCustoms]);

    const handleToggleCustomSelection = (id) => {
        // Find the custom link object by ID
        const newCustomLink = customs.find((custom) => custom.id === id);

        // Update selectedCustomIds
        setSelectedCustomIds((prevSelected) => {
            if (prevSelected.includes(id)) {
                // If the custom link is already selected, remove it
                return prevSelected.filter((selectedId) => selectedId !== id);
            } else {
                // If the custom link is not selected, add it
                return [...prevSelected, id];
            }
        });

        // Update selectedCustomLinks
        setSelectedCustomLinks((prevLinks) => {
            if (prevLinks.some((link) => link.id === id)) {
                // If the custom link is already in the list, remove it
                return prevLinks.filter((link) => link.id !== id);
            } else {
                // If the custom link is not in the list, add it
                return [...prevLinks, newCustomLink];
            }
        });
    };

    const handleSelectAllForCustom = () => {
        const allCustomIds = customs.map((custom) => custom.id);

        if (selectAllForCustom) {
            // Unselect all: Clear both selectedCustomIds and selectedCustomLinks
            setSelectedCustomIds([]);
            setSelectedCustomLinks([]);
        } else {
            // Select all: Set selectedCustomIds to all IDs and selectedCustomLinks to all custom link objects
            setSelectedCustomIds(allCustomIds);
            setSelectedCustomLinks(customs);
        }

        // Toggle the selectAllForCustom state
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

                // Mark files as loaded on first load
                setInitialLoadState(prev => {
                    if (!prev.files) {
                        return { ...prev, files: true };
                    }
                    return prev;
                });

                // Update selected file details with current page data
                setSelectedFileDetails(prevDetails => {
                    // Remove any details that are from the current page to avoid duplicates
                    const currentPageIds = data.files.map(f => f.id);
                    const otherPageDetails = prevDetails.filter(detail => !currentPageIds.includes(detail.id));

                    // Add current page details for selected files
                    const currentPageSelectedDetails = data.files.filter(file => selectedFileIds.includes(file.id));

                    return [...otherPageDetails, ...currentPageSelectedDetails];
                });
            } else {
                shopify.toast.show(t(
                        "createdigitalproduct.failed_to_fetch_files"
                    ), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            shopify.toast.show(t(
                        "createdigitalproduct.failed_to_fetch_files"
                    ), { isError: true, duration: 9999999 });
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

    const handleSearch = async () => {
        setSelectedFileIds([]); // Clear selections when performing new search
        setSelectedFileDetails([]); // Clear file details
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

                // Mark licenses as loaded on first load
                setInitialLoadState(prev => {
                    if (!prev.licenses) {
                        return { ...prev, licenses: true };
                    }
                    return prev;
                });
            } else {
                shopify.toast.show(t(
                        "createdigitalproduct.failed_to_fetch_licenses"
                    ), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching licenses:", error);
            shopify.toast.show(t(
                    "createdigitalproduct.failed_to_fetch_licenses"
                ), { isError: true, duration: 9999999 });
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

                // Mark custom links as loaded on first load
                setInitialLoadState(prev => {
                    if (!prev.customLinks) {
                        return { ...prev, customLinks: true };
                    }
                    return prev;
                });
            } else {
                shopify.toast.show(t(
                        "createdigitalproduct.failed_to_fetch_custom_links"
                    ), { isError: true, duration: 9999999 });
            }
        } catch (error) {
            console.error("Error fetching custom links:", error);
            shopify.toast.show(t(
                        "createdigitalproduct.failed_to_fetch_custom_links"
                    ), { isError: true, duration: 9999999 });
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
                shopify.toast.show(`${t(
                                          "createdigitalproduct.file_storage_limit_exceeded_maximum_allowed_is"
                                      )} ${prettyBytes(fileStorageLimit)}`, { isError: true, duration: 9999999 });
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
                shopify.toast.show(`${t(
                        "createdigitalproduct.you_can_only_upload_a_maximum_of"
                    )} ${MAX_SAMPLE_FILES} ${t(
                        "createdigitalproduct.files"
                    )}.`, { isError: true, duration: 9999999 });
            }
        },
        [sampleFiles]
    );

    const handleLicenseDropZoneDrop = (files) => {
        const file = files[0];
        // setLicenseFiles(file);
        setAttachedLicenseFile((prev) => file);
        //setLicenseFiles(prevFiles => [...prevFiles, file]);
        setLicenseFiles((prevFiles) => [file]);
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
                const fileToRemove = selectedFileDetails[index];
                if (fileToRemove) {
                    setSelectedFileDetails(prevDetails =>
                        prevDetails.filter(detail => detail.id !== fileToRemove.id)
                    );
                    setSelectedFileIds(prevIds =>
                        prevIds.filter(id => id !== fileToRemove.id)
                    );
                }
            } else if (type === "googleDrive") {
                setGoogleDriveLink(null);
            }
        },
        [setFiles, setOrders, setGoogleDriveLink, selectedFileDetails]
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

    const handleDeleteLinkAtIndex = (index) => {
        let deleteLink = selectedCustomLinks[index];
        // Create a copy of the current state
        let updatedLinks = [...selectedCustomLinks];
        // Remove the element at the specified index
        updatedLinks.splice(index, 1);
        // Update the state with the new array
        setSelectedCustomLinks(updatedLinks);

        // const id = location.state?.id;

        const response = fetch(
            `/api/delete-product-link/${deleteLink.id}/${id}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            }
        );
    };

    const handleLicenseDeleteFile = () => {
        //setLicenseFiles({ name: '', size: 0 });
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
        let deleteLicense = selectedLicensesKeys[index];
        // Remove from keys_per_unit map
        setLicenseKeysPerUnit(current => {
            const updated = { ...current };
            delete updated[deleteLicense.id];
            return updated;
        });
        // Create a copy of the current state
        let updatedLicenses = [...selectedLicensesKeys];
        // Remove the element at the specified index
        updatedLicenses.splice(index, 1);
        // Update the state with the new array
        setSelectedLicensesKeys(updatedLicenses);

        // const id = location.state?.id;

        const response = fetch(
            `/api/delete-product-license/${deleteLicense.id}/${id}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            }
        );
    };

    const handleKeysPerUnitChange = (licenseId, value) => {
        setLicenseKeysPerUnit(prev => ({
            ...prev,
            [licenseId]: value || 1
        }));
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
        singular: "order",
        plural: "orders",
    };

    // Simple selection state management
    const toggleFileSelection = (fileId) => {
        setSelectedFileIds(prev => {
            const fileDetails = selectedFileDetails.find(detail => detail.id === fileId) ||
                           orders.find(order => order.id === fileId);

            if (prev.includes(fileId)) {
                // Remove from selection
                setSelectedFileDetails(prevDetails =>
                    prevDetails.filter(detail => detail.id !== fileId)
                );
                return prev.filter(id => id !== fileId);
            } else {
                // Add to selection
                if (fileDetails) {
                    setSelectedFileDetails(prevDetails =>
                        [...prevDetails, fileDetails]
                    );
                }
                return [...prev, fileId];
            }
        });
    };

    const toggleCurrentPageSelection = () => {
        const currentPageIds = orders.map(order => order.id);
        const allCurrentPageSelected = currentPageIds.every(id => selectedFileIds.includes(id));

        if (allCurrentPageSelected) {
            // Remove all current page items from selection
            setSelectedFileIds(prev => prev.filter(id => !currentPageIds.includes(id)));
            setSelectedFileDetails(prev =>
                prev.filter(detail => !currentPageIds.includes(detail.id))
            );
        } else {
            // Add all current page items to selection
            const newIds = currentPageIds.filter(id => !selectedFileIds.includes(id));
            const newDetails = orders.filter(order => !selectedFileIds.includes(order.id));

            setSelectedFileIds(prev => [...prev, ...newIds]);
            setSelectedFileDetails(prev => [...prev, ...newDetails]);
        }
    };

    // Calculate selection state for current page
    const currentPageSelectedIds = orders.map(order => order.id).filter(id => selectedFileIds.includes(id));
    const allCurrentPageSelected = orders.length > 0 && orders.every(order => selectedFileIds.includes(order.id));

    const handleProductMessagehange = (value) => {
        setProductMessage(value);
    };

    const handleProductMessageEnabledChange = (checked) => {
        setIsProductMessageEnabled(checked);
    };

    const handleManualDeliveryEnabledChange = (checked) => {
        setIsManualDeliveryEnabled(checked);
        if (checked) {
            setContentType(['manual_delivery']);
        } else {
            setContentType([]);
        }
    };

    const handleOrderAttributeTriggerEnabledChange = (checked) => {
        setIsOrderAttributeTriggerEnabled(checked);
        if (!checked) {
            setOrderAttributeName("");
            setOrderAttributeValue("");
            setIsGlobalOrderAttributeTrigger(false);
        }
    };

    const handleGlobalOrderAttributeTriggerChange = (checked) => {
        setIsGlobalOrderAttributeTrigger(checked);
    };

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

    const handleDeleteExistingFileAtIndex = async (index) => {
            let deleteFile = digitalProduct.attached_files[index];

            const response = await fetch(`/api/delete-file/${deleteFile.id}/${digitalProduct.id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if(response.ok) {
                let newFiles = [...digitalProduct.attached_files];
                newFiles.splice(index, 1);
                setOldFiles(newFiles);
                digitalProduct.attached_files.splice(index, 1);

                // Also remove from selected file states to prevent re-attachment
                setSelectedFileIds(prev => prev.filter(id => id !== deleteFile.id));
                setSelectedFileDetails(prev => prev.filter(detail => detail.id !== deleteFile.id));
            }
    };

    const handleDeleteExistingSampleFileAtIndex = useCallback(
        (index) => {
            let deleteFile = digitalProduct.sample_files[index];

            let newFiles = [...digitalProduct.sample_files];
            newFiles.splice(index, 1);
            setOldSampleFiles(newFiles);
            digitalProduct.sample_files.splice(index, 1);

            const response = fetch(`/api/delete-sample-file/${deleteFile.id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
        },
        [digitalProduct]
    );

    useEffect(() => {
        // const id = location.state?.id;
        console.log("Fetching digital product with ID:", id);

        if (id && !isDigitalProductFetched) {
            const fetchDigitalProductById = async () => {
                try {
                    const response = await fetch(
                        `/api/get-digital-product/${id}`
                    );
                    console.log("API response:", response);
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Fetched data:", data);

                        const cleanContentType = Array.isArray(data.digitalProduct.content_type)
                            ? data.digitalProduct.content_type.filter(type => type && type.trim() !== '')
                            : [];

                        setDigitalProduct(data.digitalProduct);
                        setSelected(
                            data.digitalProduct.status === 1
                                ? "active"
                                : "draft"
                        );
                        setAutoFulfill(data.digitalProduct.auto_fulfill);

                        setContentType(cleanContentType);

                        setDownloadLimit(data.digitalProduct.download_limit);
                        setIsDownloadLimitEnabled(
                            data.digitalProduct.is_download_limit_enabled ||
                                false
                        );
                        setProductMessage(data.digitalProduct.product_message);
                        setIsProductMessageEnabled(
                            data.digitalProduct.is_product_message_enabled ||
                                false
                        );
                        setIsManualDeliveryEnabled(
                            data.digitalProduct.is_manual_delivery_enabled ||
                                false
                        );
                        setIsOrderAttributeTriggerEnabled(
                            data.digitalProduct.is_order_attribute_trigger_enabled ||
                                false
                        );
                        setOrderAttributeName(
                            data.digitalProduct.order_attribute_name || ""
                        );
                        setOrderAttributeValue(
                            data.digitalProduct.order_attribute_value || ""
                        );
                        setIsGlobalOrderAttributeTrigger(
                            data.digitalProduct.is_global_order_attribute_trigger || false
                        );

                        if (data.digitalProduct.download_expiration === 1) {
                            setIsDownloadExpirationEnabled(true);
                            setExpirationType(
                                data.digitalProduct.expiration_type
                            );
                            if (
                                data.digitalProduct.expiration_type ===
                                "specific-date"
                            ) {
                                setSelectedDate(
                                    new Date(
                                        data.digitalProduct.expiration_value
                                    )
                                );
                            } else {
                                setExpirationDays(
                                    data.digitalProduct.expiration_value
                                );
                            }
                        }

                        if (data.digitalProduct.enable_pdf_stamping) {
                            setIsPdfStampingEnabled(true);
                            setPDFTemplateId(
                                data.digitalProduct.pdf_template_id || null
                            );
                            setTemplateChoice(
                                data.digitalProduct.default_pdf_template === 1
                                    ? "default"
                                    : "custom"
                            );

                            if (
                                data.digitalProduct.default_pdf_template === 0
                            ) {
                                setSelectedTemplate(
                                    String(data.digitalProduct.pdf_template_id)
                                        ? String(
                                              data.digitalProduct
                                                  .pdf_template_id
                                          )
                                        : ""
                                );
                                setTextSize(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.text_size
                                );
                                setTextColor(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.text_color
                                );
                                setAlignment(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.alignment
                                );
                                setFont(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.font
                                );
                                setPageSize(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.page_size
                                );
                                setPageLayout(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.page_layout
                                );
                                setVerticalAdjustment(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.vertical_adjustment
                                );
                                setPagesToStamp(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.pages_to_stamp
                                );
                                setStampText(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.stamp_text
                                );
                                setAllowPrinting(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.allow_printing
                                );
                                setAllowCopy(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.allow_copying
                                );
                                setPasswordProtect(
                                    data.digitalProduct.pdf_template
                                        .pdf_stamping.password_protect
                                );
                                setTemplateTitle(
                                    data.digitalProduct.pdf_template.title
                                );
                            }
                        }

                        if (data.digitalProduct.custom_links) {
                            setSelectedCustomIds(
                                data.digitalProduct.custom_links.map(
                                    (link) => link.id
                                )
                            );
                            setSelectedCustomLinks(
                                data.digitalProduct.custom_links
                            );
                        }

                        if (data.digitalProduct.licenses) {
                            const licenseIds = data.digitalProduct.licenses.map(
                                (license) => license.id
                            );
                            setSelectedLicenseIds(licenseIds); // Set all IDs at once
                            setSelectedLicensesKeys(
                                data.digitalProduct.licenses
                            );
                            // Initialize licenseKeysPerUnit with pivot values from backend
                            const keysPerUnitMap = {};
                            data.digitalProduct.licenses.forEach((license) => {
                                keysPerUnitMap[license.id] = license.pivot?.keys_per_unit || 1;
                            });
                            setLicenseKeysPerUnit(keysPerUnitMap);
                        }

                        if (data.digitalProduct.attached_videos) {
                            setOldVideos([...data.digitalProduct.attached_videos]);
                        }

                        setOldFiles([...data.digitalProduct.attached_files]);
                        setOldSampleFiles(data.digitalProduct.sample_files);

                        // Pre-select existing attached files first
                        let existingFileIds = [];
                        if (data.digitalProduct.attached_files && data.digitalProduct.attached_files.length > 0) {
                            existingFileIds = data.digitalProduct.attached_files.map(file => file.id);
                            setSelectedFileIds(existingFileIds);
                            setSelectedFileDetails(data.digitalProduct.attached_files);
                        }

                        // Capture initial data after pre-selection is complete
                        const initialDataFromAPI = {
                            title: data.digitalProduct.title || "",
                            selected: data.digitalProduct.status === 1 ? "active" : "draft",
                            contentType: cleanContentType,
                            emailTemplateType: data.digitalProduct.email_template_type || "default",
                            emailTemplateId: String(data.digitalProduct.email_template_id) || null,
                            isDownloadExpirationEnabled: data.digitalProduct.download_expiration === 1,
                            expirationType: data.digitalProduct.expiration_type || "days",
                            expirationDays: data.digitalProduct.expiration_type === "days" ? data.digitalProduct.expiration_value : "",
                            selectedDate: data.digitalProduct.expiration_type === "specific-date" ? new Date(data.digitalProduct.expiration_value) : new Date(),
                            // PDF stamping settings
                            isPdfStampingEnabled: !!data.digitalProduct.enable_pdf_stamping,
                            templateChoice: data.digitalProduct.default_pdf_template === 1 ? "default" : "custom",
                            PDFTemplateId: data.digitalProduct.pdf_template_id || null,
                            // Product message settings
                            isProductMessageEnabled: !!data.digitalProduct.is_product_message_enabled,
                            productMessage: data.digitalProduct.product_message || "",
                            autoFulfill: !!data.digitalProduct.auto_fulfill,
                            isManualDeliveryEnabled: !!data.digitalProduct.is_manual_delivery_enabled,
                            isOrderAttributeTriggerEnabled: !!data.digitalProduct.is_order_attribute_trigger_enabled,
                            orderAttributeName: data.digitalProduct.order_attribute_name || "",
                            orderAttributeValue: data.digitalProduct.order_attribute_value || "",
                            isGlobalOrderAttributeTrigger: !!data.digitalProduct.is_global_order_attribute_trigger,
                            downloadLimit: data.digitalProduct.download_limit || "",
                            isDownloadLimitEnabled: data.digitalProduct.is_download_limit_enabled === 1,
                            files: [], // Will be updated as user interacts
                            sampleFiles: data.digitalProduct.sample_files || [],
                            licenses: data.digitalProduct.licenses || [],
                            newLicenses: [],
                            customs: data.digitalProduct.custom_links || [],
                            newCustoms: [],
                            tags: data.digitalProduct.tags ? data.digitalProduct.tags.split(',') : [],
                            qrCodeEnabled: !!data.digitalProduct.qr_code_enabled,
                            oneKeyDelivery: !!data.digitalProduct.one_key_delivery,
                            qrCodePrintOnPDF: !!data.digitalProduct.qr_code_print_on_pdf,
                            giftCardEnabled: !!data.digitalProduct.gift_card_enabled,
                            giftCardPropertyName: data.digitalProduct.gift_card_property_name || "",
                            sendKeyToMultipleCustomers: !!data.digitalProduct.send_key_to_multiple_customers,
                            deliverKeysInSequence: !!data.digitalProduct.deliver_keys_in_sequence,
                            perUnitNoDelivery: data.digitalProduct.per_unit_no_delivery || 1,
                            redirectURL: data.digitalProduct.redirect_url || "",
                            linkDetail: data.digitalProduct.link_detail || "",
                            licenseTitle: "",
                            value: "automated",
                            prefix: "",
                            codeLength: "",
                            suffix: "",
                            totalCodes: "",
                            // IMPORTANT: Include pre-selected file IDs in initial data
                            selectedFileIds: existingFileIds,
                            selectedFileDetails: data.digitalProduct.attached_files || [],
                        };

                        // Mark digital product as loaded
                        setInitialLoadState(prev => ({ ...prev, digitalProduct: true }));

                        console.log("Capturing initial data from API response:", initialDataFromAPI);
                        // Don't set initial data here anymore - wait for all data to load
                        // setInitialData(initialDataFromAPI);
                        // setIsInitialDataCaptured(true);

                        setIsLoading(false);
                        setIsDigitalProductFetched(true);
                        setEmailTemplateType(
                            data.digitalProduct.email_template_type
                        );
                        setEmailTemplateId(
                            String(data.digitalProduct.email_template_id)
                        );
                    } else {
                        console.error(
                            "Failed to fetch Digital Product by ID:",
                            response.status,
                            response.statusText
                        );
                    }
                } catch (error) {
                    console.error(
                        "Error fetching Digital Product by ID:",
                        error
                    );
                }
            };

            fetchDigitalProductById();
        } else {
            console.log("No ID found in location.state");
        }
    }, [id, isDigitalProductFetched]);

    const handleSelectChange = useCallback((value) => {
        setSelected(value);
        setDigitalProduct((prevProduct) => ({
            ...prevProduct,
            status: value === "active" ? 1 : 0,
        }));
    }, []);

    const handleEmailTemplateChange = (value) => {
        setEmailTemplateId(value);
    };

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

    const handleSendUpdateEmails = async () => {
        if (digitalProduct?.id) {
            setSendingUpdateEmails(true);
            await fetchCustomerCount(digitalProduct.id);
        }
        setIsSendEmailModalOpen(true);
    };

    const handleConfirmSendEmails = async () => {
        setUpdateEmailLoading(true);
        try {
            const res = await fetch(
                `/api/digital-product/${digitalProduct.id}/resend-update`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();

            if (data.success) {
                shopify.toast.show(t(
                        "editdigitalproduct.update_emails_are_scheduled_for_delivery"
                    ));
            } else {
                shopify.toast.show(
                        data.message ||
                        t("editdigitalproduct.failed_to_create_resend_job"),
                    { isError: true, duration: 9999999 }
                );
            }
        } catch (err) {
            console.error(err);
            shopify.toast.show(t(
                    "editdigitalproduct.something_went_wrong_while_creating_resend_job"
                ), { isError: true, duration: 9999999 });
        }

        setIsSendEmailModalOpen(false);
        setUpdateEmailLoading(false);
    };

    const handleCancelSendEmails = () => {
        setIsSendEmailModalOpen(false);
    };

    const handlePreviewEmail = () => {
        setIsEmailPreviewModalOpen(true);
    };

    // Function to capture current data state - simplified to avoid circular dependencies
    const captureCurrentData = useCallback(() => {
        return {
            title: title || "",
            selected: selected || "active",
            contentType: contentType || [],
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
            isManualDeliveryEnabled: isManualDeliveryEnabled || false,
            isOrderAttributeTriggerEnabled: isOrderAttributeTriggerEnabled || false,
            orderAttributeName: orderAttributeName || "",
            orderAttributeValue: orderAttributeValue || "",
            isGlobalOrderAttributeTrigger: isGlobalOrderAttributeTrigger || false,
            downloadLimit: downloadLimit || "",
            isDownloadLimitEnabled: isDownloadLimitEnabled || false,
            files: files || [],
            sampleFiles: sampleFiles || [],
            licenses: licenses || [],
            newLicenses: newLicenses || [],
            customs: customs || [],
            newCustoms: newCustoms || [],
            tags: tags || [],
            qrCodeEnabled: qrCodeEnabled || false,
            oneKeyDelivery: oneKeyDelivery || false,
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
            // IMPORTANT: Include selectedFileIds and selectedFileDetails in data comparison
            selectedFileIds: selectedFileIds || [],
            selectedFileDetails: selectedFileDetails || [],
            // Video tracking
            oldVideos: oldVideos || [],
            selectedVideos: selectedVideos || [],
            selectedExistingVideos: selectedExistingVideos || [],
            licenseKeysPerUnit: licenseKeysPerUnit || {},
            // Excluding complex objects that might cause initialization issues
        };
    }, [
        title,
        selected,
        contentType,
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
        isManualDeliveryEnabled,
        downloadLimit,
        isDownloadLimitEnabled,
        files,
        sampleFiles,
        licenses,
        newLicenses,
        customs,
        newCustoms,
        tags,
        qrCodeEnabled,
        oneKeyDelivery,
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
        isOrderAttributeTriggerEnabled,
        orderAttributeName,
        orderAttributeValue,
        isGlobalOrderAttributeTrigger,
        selectedFileIds,  // Add this to track file selection changes
        selectedFileDetails,  // Add this to track file selection changes
        licenseKeysPerUnit,  // Track keys_per_unit changes
        // Video tracking dependencies
        oldVideos,
        selectedVideos,
        selectedExistingVideos,
    ]);

    // Function to check if data has changed
    const hasDataChanged = useCallback(() => {
        const currentData = captureCurrentData();
        return JSON.stringify(currentData) !== JSON.stringify(initialData);
    }, [captureCurrentData, initialData]);

    // Function to handle discard changes
    const handleDiscardChanges = useCallback(() => {
        // Reset only tracked fields to initial data
        setSelected(initialData.selected || "active");
        setEmailTemplateType(initialData.emailTemplateType || "default");
        setEmailTemplateId(initialData.emailTemplateId || null);
        setIsDownloadExpirationEnabled(initialData.isDownloadExpirationEnabled || false);
        setExpirationType(initialData.expirationType || "days");
        setExpirationDays(initialData.expirationDays || "");
        setSelectedDate(initialData.selectedDate || new Date());
        // PDF stamping settings
        setIsPdfStampingEnabled(initialData.isPdfStampingEnabled || false);
        setTemplateChoice(initialData.templateChoice || "none");
        setPDFTemplateId(initialData.PDFTemplateId || null);
        // Product message settings
        setIsProductMessageEnabled(initialData.isProductMessageEnabled || false);
        setProductMessage(initialData.productMessage || "");
        setTitle(initialData.title || "");
        setContentType(initialData.contentType || []);
        setAutoFulfill(initialData.autoFulfill || false);
        setIsManualDeliveryEnabled(initialData.isManualDeliveryEnabled || false);
        setIsOrderAttributeTriggerEnabled(initialData.isOrderAttributeTriggerEnabled || false);
        setOrderAttributeName(initialData.orderAttributeName || "");
        setOrderAttributeValue(initialData.orderAttributeValue || "");
        setIsGlobalOrderAttributeTrigger(initialData.isGlobalOrderAttributeTrigger || false);
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
        setOneKeyDelivery(initialData.oneKeyDelivery || false);
        setQRCodePrintOnPDF(initialData.qrCodePrintOnPDF || false);
        setGiftCardEnabled(initialData.giftCardEnabled || false);
        setGiftCardPropertyName(initialData.giftCardPropertyName || "");
        setSendKeyToMultipleCustomers(initialData.sendKeyToMultipleCustomers || false);
        setDeliverKeysInSequence(initialData.deliverKeysInSequence || false);
        setPerUnitNoDelivery(initialData.perUnitNoDelivery || 1);
        setRedirectURL(initialData.redirectURL || "");
        setLinkDetail(initialData.linkDetail || "");
        setLicenseTitle(initialData.licenseTitle || "");
        setValue(initialData.value || "automated");
        setPrefix(initialData.prefix || "");
        setCodeLength(initialData.codeLength || "");
        setSuffix(initialData.suffix || "");
        setTotalCodes(initialData.totalCodes || "");

        // Reset file selection states
        setSelectedFileIds(initialData.selectedFileIds || []);
        setSelectedFileDetails(initialData.selectedFileDetails || []);
        setLicenseKeysPerUnit(initialData.licenseKeysPerUnit || {});

        // Reset video states
        setOldVideos(initialData.oldVideos || []);
        setSelectedVideos(initialData.selectedVideos || []);
        setSelectedExistingVideos(initialData.selectedExistingVideos || []);

        setHasUnsavedChanges(false);
        shopify.saveBar.hide('edit-digital-product-savebar');
    }, [initialData, shopify]);

    // Effect to monitor changes and update SaveBar
    useEffect(() => {
        if (isInitialDataCaptured) {
            const changed = hasDataChanged();
            setHasUnsavedChanges(changed);
            console.log("Changed: " + changed);

            if (changed) {
                shopify.saveBar.show('edit-digital-product-savebar');
            } else {
                shopify.saveBar.hide('edit-digital-product-savebar');
            }
        }
    }, [hasDataChanged, isInitialDataCaptured, shopify]);

    // Fallback: If API data wasn't captured, capture after 3 seconds
    useEffect(() => {
        if (!isInitialDataCaptured && isDigitalProductFetched) {
            const timer = setTimeout(() => {
                if (!isInitialDataCaptured) {
                    console.log("Fallback: capturing initial data after timeout");
                    const initial = captureCurrentData();
                    setInitialData(initial);
                    setIsInitialDataCaptured(true);
                }
            }, 3000); // Longer fallback to ensure API data is loaded

            return () => clearTimeout(timer);
        }
    }, [isInitialDataCaptured, isDigitalProductFetched, captureCurrentData]);

    // Monitor when all data sources are loaded and capture initial data
    useEffect(() => {
        const allLoaded = Object.values(initialLoadState).every(loaded => loaded === true);

        if (allLoaded && !isInitialDataCaptured) {
            console.log("All data sources loaded, capturing initial data");
            const initial = captureCurrentData();
            setInitialData(initial);
            setIsInitialDataCaptured(true);
        }
    }, [initialLoadState, isInitialDataCaptured, captureCurrentData]);

    const handleUpdate = useCallback(async () => {
        setSaving(true);
        setProgress(0); // Reset progress

        if (
            isPdfStampingEnabled &&
            templateChoice === "custom" &&
            !PDFTemplateId
        ) {
            shopify.toast.show(t(
                    "createdigitalproduct.please_save_the_pdf_template_first"
                ), { isError: true, duration: 9999999 });
            setSaving(false);
            return;
        }

        let validFiles = [];
        let selectedValidFiles = [];
        //if (selectedMainTab === 0) {
        // Use our cross-page selection state which contains all selected files from all pages
        selectedValidFiles = selectedFileIds;
        //} else {
        validFiles = files.filter((file) => file.size <= fileSizeLimit);
        //}

        if (
            ((!validFiles.length &&
            !selectedValidFiles.length &&
            digitalProduct.attached_files?.length == 0) && !selectedValidFiles) &&
            contentType.includes("files") &&
            !googleDriveLink
        ) {
            shopify.toast.show(t(
                    "createdigitalproduct.please_select_valid_files"
                ), { isError: true, duration: 9999999 });
            setSaving(false);
            return;
        }

        if (
            validFiles.length + selectedValidFiles.length > fileLimitByPlan &&
            contentType.includes("files")
        ) {
            shopify.toast.show(`${t("createdigitalproduct.you_can_select_a_maximum_of")} ${fileLimitByPlan} ${t("createdigitalproduct.files")}`, { isError: true, duration: 9999999 });
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

            if (contentType.includes("license")) {
                let selectedLicenses = [];
                // selectedLicenses = licenses
                //     .filter(license => selectedLicenseIds.includes(license.id))
                //     .map(license => license.id);
                selectedLicenses = selectedLicensesKeys.map(
                    (license) => license.id
                );

                console.log("Keys Per Units: ", licenseKeysPerUnit);
                selectedLicenses.forEach((licenseId) => {
                    formData.append("selectedLicenses[]", licenseId);
                    formData.append(`licenseKeysPerUnit[${licenseId}]`, licenseKeysPerUnit[licenseId] || 1);
                });

                newLicenses.forEach((license, index) => {
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
                        `licenses[${index}][oneKeyDelivery]`,
                        license.oneKeyDelivery ? "1" : "0"
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

                    formData.append(`licenses[${index}][giftCardEnabled]`, license.giftCardEnabled ? "1" : "0");
                    formData.append(`licenses[${index}][giftCardPropertyName]`, license.giftCardPropertyName);
                    formData.append(
                        `licenses[${index}][giftDeliveryPropertyName]`,
                        license.giftDeliveryPropertyName
                    );

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

            if (contentType.includes("custom_link")) {
                let selectedCustomLinks = [];
                selectedCustomLinks = customs
                    .filter((link) => selectedCustomIds.includes(link.id))
                    .map((link) => link.id);

                selectedCustomLinks.forEach((linkId) => {
                    formData.append("selectedCustomLinks[]", linkId);
                });

                newCustoms.forEach((link, index) => {
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

            if (selectedExistingVideos.length) {
                formData.append("selected_existing_videos", JSON.stringify(selectedExistingVideos.map(video => video.id)));
            }

            if (contentType.includes("videos")) {

                if (selectedVideos.length) {
                    formData.append("videos", JSON.stringify(selectedVideos));
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
                "is_download_limit_enabled",
                isDownloadLimitEnabled ? "1" : "0"
            );
            formData.append("download_limit", downloadLimit);

            formData.append(
                "is_product_message_enabled",
                isProductMessageEnabled ? "1" : "0"
            );
            if (isProductMessageEnabled) {
                formData.append("product_message", productMessage);
            }
            formData.append("is_manual_delivery_enabled", isManualDeliveryEnabled ? "1" : "0");

            formData.append("is_order_attribute_trigger_enabled", isOrderAttributeTriggerEnabled ? "1" : "0");
            if (isOrderAttributeTriggerEnabled) {
                formData.append("order_attribute_name", orderAttributeName);
                formData.append("order_attribute_value", orderAttributeValue);
                formData.append("is_global_order_attribute_trigger", isGlobalOrderAttributeTrigger ? "1" : "0");
            }

            formData.append(
                "product",
                JSON.stringify(digitalProduct.associatedProduct)
            );
            formData.append(
                "old_files",
                JSON.stringify(
                    digitalProduct.attached_files.map((file) => file.id)
                )
            );
            formData.append(
                "old_videos",
                JSON.stringify(oldVideos.map((video) => video.id))
            );
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

            formData.append("status", digitalProduct.status);
            formData.append("content_type", contentType.join(", "));
            formData.append("shop", store.shopify_domain);

            formData.append("email_template_type", emailTemplateType);

            let templateId = '';
            if(emailTemplateType == 'custom') {
                templateId = emailTemplateId;
            }
            if(emailTemplateType == 'default') {
                templateId = defaultTemplateId;
            }

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
            xhr.open(
                "POST",
                `/api/update-digital-product/${digitalProduct.id}`,
                true
            );

            // Handle the response
            xhr.onload = () => {
                setSaving(false);
                setProgress(0);
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    if (data.error) {
                        if (data.type === "exists") {
                            shopify.toast.show(t(
                                    "createdigitalproduct.digital_product_already_exists_for_selected_shopify_product"
                                ), { isError: true, duration: 9999999 });
                        } else {
                            shopify.toast.show(t(
                                    "createdigitalproduct.error_saving_digital_product"
                                ), { isError: true, duration: 9999999 });
                        }
                    } else {
                        shopify.toast.show(t(
                                "createdigitalproduct.digital_product_saved_successfully"
                            ));

                        // Update initial data and hide SaveBar
                        //const updatedData = captureCurrentData();
                        //setInitialData(updatedData);
                        setHasUnsavedChanges(false);
                        shopify.saveBar.hide('edit-digital-product-savebar');
                        setTimeout(() => {
                            navigate("/digitalProducts");
                        }, 1000);
                    }
                } else {
                    shopify.toast.show(t(
                            "createdigitalproduct.failed_to_save_digital_product_please_try_again_later"
                        ), { isError: true, duration: 9999999 });
                }
                setProgress(0); // Reset progress after completion
            };

            // Handle errors
            xhr.onerror = () => {
                shopify.toast.show(t(
                        "createdigitalproduct.an_unexpected_error_occurred_please_try_again_later"
                    ), { isError: true, duration: 9999999 });
                setSaving(false);
                setProgress(0);
            };

            // Send the request
            xhr.send(formData);

            /*
            const response = await fetch(`/api/update-digital-product/${digitalProduct.id}`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setSaving(false);
                const data = await response.json();
                if (data.error) {
                    if (data.type === 'exists') {
                        shopify.toast.show("Digital product already exists for selected Shopify product.", { isError: true, duration: 9999999 });
                    } else {
                        shopify.toast.show("Error saving digital product.", { isError: true, duration: 9999999 });
                    }
                } else {
                    shopify.toast.show("Digital product saved successfully.");
                    // Update initial data and hide SaveBar
                    const updatedData = captureCurrentData();
                    setInitialData(updatedData);
                    setHasUnsavedChanges(false);
                    shopify.saveBar.hide('edit-digital-product-savebar');
                    setTimeout(() => {
                        navigate("/digitalProducts");
                    }, 1000);
                }
            } else {
                shopify.toast.show("Failed to save digital product. Please try again later.", { isError: true, duration: 9999999 });
                setSaving(false);
            }
            */
        } catch (error) {
            console.error("Error saving digital product:", error);
            shopify.toast.show(t(
                    "createdigitalproduct.an_unexpected_error_occurred_please_try_again_later"
                ), { isError: true, duration: 9999999 });
            setSaving(false);
        }
    }, [
        contentType,
        isManualDeliveryEnabled,
        emailTemplateType,
        emailTemplateId,
        digitalProduct,
        fetch,
        files,
        autoFulfill,
        oldFiles,
        digitalProduct.id,
        navigate,
        digitalProduct.associatedProduct,
        expirationType,
        expirationDays,
        selectedDate,
        sendKeyToMultipleCustomers,
        isDownloadExpirationEnabled,
        selectedLicenseIds,
        newLicenses,
        pasteKeysValue,
        selectedCustomIds,
        newCustoms,
        selectedLicensesKeys,
        selectedCustomLinks,
        qrCodeEnabled,
        oneKeyDelivery,
        qrCodePrintOnPDF,
        deliverKeysInSequence,
        perUnitNoDelivery,
        isPdfStampingEnabled,
        templateChoice,
        PDFTemplateId,
        oldVideos,
        selectedVideos,
        selectedExistingVideos,
        giftCardEnabled,
        giftCardPropertyName,
        selectedFileIds,
        isDownloadLimitEnabled,
        downloadLimit,
        isProductMessageEnabled,
        productMessage,
        sampleFiles,
        googleDriveLink,
        customs,
        isOrderAttributeTriggerEnabled,
        orderAttributeName,
        orderAttributeValue,
        isGlobalOrderAttributeTrigger,
        licenseKeysPerUnit,
        store.shopify_domain,
        defaultTemplateId,
        fileSizeLimit,
        shopify,
        t
    ]);

    // SaveBar action handlers
    const handleSaveBarSave = useCallback(async () => {
        await handleUpdate();
    }, [handleUpdate]);

    const handleSaveBarDiscard = useCallback(() => {
        handleDiscardChanges();
    }, [handleDiscardChanges]);

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

    // Get file limit based on user's plan
    const getFileLimitByPlan = (plan) => {
        const planLimits = {
            'free': 5,
            'pro': 20,
            'plus': 50,
            'unlimited': 100
        };
        return planLimits[plan] || 5;
    };

    const fileLimitByPlan = getFileLimitByPlan(userPlan);

   const fileLabelText = `${t(
        "editdigitalproduct.drag_and_drop_your_files"
    )} ( ${fileLimitByPlan} ${t("createdigitalproduct.files_max")} / ${
        fileSizeLimit
            ? `${t("createdigitalproduct.max")} ${formatFileSizeLimit(
                  fileSizeLimit
              )} ${t('createdigitalproduct.per_file')}`
            : t("createdigitalproduct.no_limit_per_file")
    })`;

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
               placeholder={t("editdigitalproduct.search_by_custom_link_title")}
               clearButton
               onClearButtonClick={handleClearCustomLinkSearch}
           />
       );


    const loadingMarkup = isLoading && (
        <SkeletonPage
                            title={t("editdigitalproduct.edit_digital_product")}
                            primaryAction
                        >
                            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
                                <div style={{ width: isMobile ? '100%' : '64%' }}>
                                    <BlockStack gap="400">
                                        <Card padding="400">
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t(
                                                        "createdigitalproduct.when_this_shopify_product_is_purchased"
                                                    )}
                                                </Text>
                                                <SkeletonBodyText />
                                            </BlockStack>
                                        </Card>
                                        <Card padding="200">
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t(
                                                        "createdigitalproduct.provide_the_following_content_to_the_customer"
                                                    )}
                                                </Text>
                                                <SkeletonBodyText />
                                            </BlockStack>
                                        </Card>
                                        <Card padding="0">
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t(
                                                        "createdigitalproduct.auto_fulfill_optional"
                                                    )}
                                                </Text>
                                                <SkeletonBodyText />
                                            </BlockStack>
                                        </Card>
                                        <Card padding="0">
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t("createdigitalproduct.sample_files")}
                                                </Text>
                                                <SkeletonBodyText />
                                            </BlockStack>
                                        </Card>
                                    </BlockStack>
                                </div>

                                <div style={{ width: isMobile ? '100%' : '34%' }}>
                                    <BlockStack gap={400}>
                                        <Card subdued>
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t(
                                                        "createdigitalproduct.digital_product_status"
                                                    )}
                                                </Text>
                                                <SkeletonBodyText lines={2} />

                                                <SkeletonBodyText lines={1} />
                                            </BlockStack>
                                        </Card>
                                        <Card subdued>
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t(
                                                        "createdigitalproduct.download_limits"
                                                    )}
                                                </Text>
                                                <SkeletonBodyText lines={2} />

                                                <SkeletonBodyText lines={1} />
                                            </BlockStack>
                                        </Card>
                                        <Card subdued>
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t(
                                                        "createdigitalproduct.download_expiration"
                                                    )}
                                                </Text>
                                                <SkeletonBodyText lines={2} />

                                                <SkeletonBodyText lines={1} />
                                            </BlockStack>
                                        </Card>
                                        <Card subdued>
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t(
                                                        "createdigitalproduct.pdf_stamping_settings"
                                                    )}
                                                </Text>
                                                <SkeletonBodyText lines={2} />

                                                <SkeletonBodyText lines={1} />
                                            </BlockStack>
                                        </Card>
                                        <Card subdued>
                                            <BlockStack gap={200}>
                                                <Text
                                                    as="h3"
                                                    variant="headingSm"
                                                    fontWeight="medium"
                                                >
                                                    {t(
                                                        "createdigitalproduct.product_page_message"
                                                    )}
                                                </Text>
                                                <SkeletonBodyText lines={2} />

                                                <SkeletonBodyText lines={1} />
                                            </BlockStack>
                                        </Card>
                                    </BlockStack>
                                </div>
                            </div>
                        </SkeletonPage>
    );

    return (
        <>
            {loadingMarkup}

            {/* SaveBar Component */}
            <SaveBar id="edit-digital-product-savebar">
                <button
                    variant="primary"
                    onClick={handleSaveBarSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleSaveBarDiscard}>
                    Discard
                </button>
            </SaveBar>

            {!isLoading && (
                <>
                        <Page
                            backAction={{
                                content: t("createdigitalproduct.digital_products"),
                                onAction: async () => {
                                    if (hasUnsavedChanges) {
                                        await shopify.saveBar.leaveConfirmation();
                                    }
                                    navigate("/digitalProducts");
                                },
                            }}
                            title={
                                digitalProduct
                                    ? digitalProduct.associatedProduct?.title
                                    : t("editdigitalproduct.edit_digital_product")
                            }
                            titleMetadata={
                                digitalProduct &&
                                (digitalProduct.status === 1 ? (
                                   <Badge tone="success">
                                                          {t("digtal_product_listing.active")}
                                                      </Badge>
                                ) : (
                                   <Badge tone="warning">
                                                          {t("digtal_product_listing.draft")}
                                                      </Badge>
                                ))
                            }
                            compactTitle
                            // primaryAction={{
                            //      content: t("editdigitalproduct.update"),
                            //     onAction: handleUpdate,
                            // }}

                            secondaryActions={
                                                  <div
                                                      style={{
                                                          display: "flex",
                                                          justifyContent: "end",
                                                          gap: "8px",
                                                          alignItems: "center",
                                                      }}
                                                  >
                                                      <LanguageSelector />
                                                      {digitalProduct && digitalProduct.status === 1 && (
                                                  <Button
                                                      onClick={handleSendUpdateEmails}
                                                      loading={sendingUpdateEmails}
                                                  >
                                                      {t("editdigitalproduct.send_update_emails")}
                                                  </Button>
                                              )}
                                          </div>
                                      }
                >
                     <Modal
                                            open={isSendEmailModalOpen}
                                            onClose={handleCancelSendEmails}
                                            title={`${t(
                                                "editdigitalproduct.send_update_email_to"
                                            )} ${
                                                customerCount !== null ? customerCount : "..."
                                            } ${t("editdigitalproduct.customers")}`}
                                            primaryAction={{
                                                content: t("editdigitalproduct.send_update_emails"),
                                                onAction: handleConfirmSendEmails,
                                                disabled:
                                                    customerCount == null || customerCount == 0,
                                                loading: updateEmailLoading,
                                            }}
                                            secondaryActions={[
                                                {
                                                    content: "Preview Email",
                                                    onAction: handlePreviewEmail,
                                                    disabled:
                                                        customerCount == null || customerCount == 0,
                                                },
                                                {
                                                    content: t("digtal_product_listing.cancel"),
                                                    onAction: handleCancelSendEmails,
                                                },
                                            ]}
                                        >
                                            <Modal.Section>
                                                <TextContainer>
                                                    <p>
                                                        {t(
                                                            "editdigitalproduct.are_you_sure_you_want_to_send_an_update_email_to_all_customers_that_have_purchased_this_digital_product"
                                                        )}
                                                    </p>
                                                </TextContainer>
                                            </Modal.Section>
                                        </Modal>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
                        <div style={{ width: isMobile ? '100%' : '64%' }}>
                           <BlockStack gap="400">
                                                           <Card>
                                                               <BlockStack gap="300">
                                                                   <Text variant="headingMd" as="h6">
                                                                       {t(
                                                                           "createdigitalproduct.when_this_shopify_product_is_purchased"
                                                                       )}
                                                                   </Text>
                                                                   <div style={{ marginTop: "10px" }}>
                                                                       <InlineGrid
                                                                           columns="1fr auto"
                                                                           style={{ marginBottom: "10px" }}
                                                                       >
                                                                           <div>
                                                                               <InlineStack>
                                                                                   <div>
                                                                                       <Thumbnail
                                                                                           source={
                                                                                               digitalProduct
                                                                                                   .associatedProduct
                                                                                                   ?.images[0]
                                                                                                   ?.originalSrc ??
                                                                                               "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                                                                                           }
                                                                                           alt={
                                                                                               digitalProduct
                                                                                                   .associatedProduct
                                                                                                   ?.title
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
                                                                                                       digitalProduct
                                                                                                           .associatedProduct
                                                                                                           ?.title
                                                                                                   }
                                                                                               </Text>
                                                                                           </Link>
                                                                                           {digitalProduct
                                                                                               .associatedProduct
                                                                                               ?.variants ? (
                                                                                               digitalProduct
                                                                                                   .associatedProduct
                                                                                                   ?.variants
                                                                                                   .length ===
                                                                                               1 ? (
                                                                                                   <Text
                                                                                                       variant="bodyLg"
                                                                                                       as="p"
                                                                                                   >
                                                                                                       {
                                                                                                           digitalProduct
                                                                                                               .associatedProduct
                                                                                                               ?.variants[0]
                                                                                                               .title
                                                                                                       }
                                                                                                   </Text>
                                                                                               ) : digitalProduct
                                                                                                     .associatedProduct
                                                                                                     ?.variants
                                                                                                     .length ===
                                                                                                 digitalProduct
                                                                                                     .associatedProduct
                                                                                                     ?.totalVariants ? (
                                                                                                   <Text
                                                                                                       variant="bodyLg"
                                                                                                       as="p"
                                                                                                   >
                                                                                                       {t(
                                                                                                           "digtal_product_listing.all_variants"
                                                                                                       )}
                                                                                                       (
                                                                                                       {
                                                                                                           digitalProduct
                                                                                                               .associatedProduct
                                                                                                               ?.variants
                                                                                                               .length
                                                                                                       }
                                                                                                       )
                                                                                                   </Text>
                                                                                               ) : (
                                                                                                   digitalProduct.associatedProduct?.variants.map(
                                                                                                       (
                                                                                                           variant
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
                                                                                               )
                                                                                           ) : (
                                                                                               <Text
                                                                                                   variant="bodyLg"
                                                                                                   as="p"
                                                                                               >
                                                                                                   {t(
                                                                                                       "digtal_product_listing.no_variants_available"
                                                                                                   )}
                                                                                               </Text>
                                                                                           )}
                                                                                       </div>
                                                                                   </div>
                                                                               </InlineStack>
                                                                           </div>
                                                                           {/* <div onClick={toggleProductPicker}>
                                                                               <Link url="#">
                                                                                   <Text variant="bodyLg" as="p">
                                                                                       Edit product
                                                                                   </Text>
                                                                               </Link>
                                                                           </div> */}
                                                                       </InlineGrid>
                                                                   </div>

                                                                   <div>
                                                                       <Text variant="bodyMd" as="p">
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
                                                                        <Text variant="headingMd" as="h6">
                                                                            {t(
                                                                                "createdigitalproduct.provide_the_following_content_to_the_customer"
                                                                            )}
                                                                        </Text>

                                                                        <div>
                                                                            {contentType &&
                                                                                contentType.includes(
                                                                                    "files"
                                                                                ) && (
                                                                                    <>
                                                                                        {files?.length > 0 && (
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
                                                                                            </BlockStack>
                                                                                        )}

                                                                                         <div style={{ marginTop: '8px' }}></div>

                                                                                        {googleDriveLink && (
                                                                                                                                                        <InlineGrid columns="1fr auto">
                                                                                                                                                            <div>
                                                                                                                                                                <InlineStack>
                                                                                                                                                                    <div>
                                                                                                                                                                        <Card>
                                                                                                                                                                            <BlockStack gap="300">
                                                                                                                                                                                <div style={{ width: "24px", height: "24px" }}>
                                                                                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                                                                                                                                        <path
                                                                                                                                                                                            fill-rule="evenodd"
                                                                                                                                                                                            d="M4.843 9.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.043 2.043 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.244 2.244 0 0 1 3.173 3.172l-2.286 2.286a.817.817 0 1 1-1.155-1.155l2.25-2.25a.75.75 0 1 0-1.06-1.061l-2.25 2.25a2.317 2.317 0 0 0 3.275 3.277l2.286-2.286a3.744 3.744 0 0 0-5.294-5.294l-5.015 5.015Z"
                                                                                                                                                                                        />
                                                                                                                                                                                    </svg>
                                                                                                                                                                                </div>
                                                                                                                                                                            </BlockStack>
                                                                                                                                                                        </Card>
                                                                                                                                                                    </div>
                                                                                                                                                                    <div style={{ marginLeft: "20px" }}>
                                                                                                                                                                        <BlockStack gap="200">
                                                                                                                                                                            <Link url={googleDriveLink}>
                                                                                                                                                                                {googleDriveLink}
                                                                                                                                                                            </Link>
                                                                                                                                                                        </BlockStack>
                                                                                                                                                                    </div>
                                                                                                                                                                </InlineStack>
                                                                                                                                                            </div>
                                                                                                                                                            <div>
                                                                                                                                                                <Button
                                                                                                                                                                    icon={<Icon source={XSmallIcon} />}
                                                                                                                                                                    onClick={() => handleDeleteFileAtIndex(null, "googleDrive")}
                                                                                                                                                                >
                                                                                                                                                                    Delete
                                                                                                                                                                </Button>
                                                                                                                                                            </div>
                                                                                                                                                        </InlineGrid>
                                                                                                                                                    )}

                                                                                    <div style={{ marginTop: '8px' }}></div>

                                                                                    <BlockStack gap="200">
                                                                                        {selectedFileDetails
                                                                                            .filter(
                                                                                                (file) =>
                                                                                                    file.url && !oldFiles.some(oldFile => oldFile.id === file.id)
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
                                                                                    </BlockStack>

                                                                                    <div style={{ marginTop: '8px' }}></div>

                                                                                    {digitalProduct
                                                                                            .attached_files
                                                                                            ?.length > 0 && (
                                                                                            <BlockStack gap="200">
                                                                                                {digitalProduct.attached_files.map(
                                                                                                    (
                                                                                                        file,
                                                                                                        index
                                                                                                    ) => {
                                                                                                        const exceedMaxSize =
                                                                                                            file.byteSize >
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
                                                                                                                                    <Link
                                                                                                                                        url={
                                                                                                                                            file.url
                                                                                                                                        }
                                                                                                                                    >
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
                                                                                                                                                file.fileName
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
                                                                                                                                        {`${file.mimeType.toUpperCase()} - ${prettyBytes(
                                                                                                                                            file.byteSize
                                                                                                                                        )}`}{" "}
                                                                                                                                        {exceedMaxSize
                                                                                                                                            ? t(
                                                                                                                                                    "createdigitalproduct.file_too_big_it_will_be_ignored"
                                                                                                                                                )
                                                                                                                                            : ""}
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
                                                                                                                            handleDeleteExistingFileAtIndex(
                                                                                                                                index
                                                                                                                            )
                                                                                                                        }
                                                                                                                    ></Button>
                                                                                                                </div>
                                                                                                            </InlineGrid>
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                            </BlockStack>
                                                                                        )}
                                                                                    {(files.length + selectedFileIds.length) > 0 && (
                                                                                      <div
                                                                                        style={{
                                                                                          textAlign: "right",
                                                                                          marginRight: "20px"
                                                                                        }}
                                                                                      >
                                                                                        <Text as="p" variant="bodyMd" fontWeight="semibold">
                                                                                          {t("editdigitalproduct.total_files")} {files.length + selectedFileIds.length}
                                                                                        </Text>
                                                                                      </div>
                                                                                    )}

                                                                                        {saving && (
                                                                                            <div>
                                                                                                <Text as={"h5"}>
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
                                                                                    </>
                                                                                )}

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
                                                                                                                            ? t("createdigitalproduct.automated")
                                                                                                                            : t("createdigitalproduct.manual")}
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
                                                                                            {selectedLicensesKeys.map(
                                                                                                (
                                                                                                    selectedLicense,
                                                                                                    index
                                                                                                ) => {
                                                                                                    // const selectedLicense = licenses.find((license) => license.id === selectedLicenseId);
                                                                                                    // if (!selectedLicense) return null;

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
                                                                                                                    "editdigitalproduct.license_key_code"
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
                                                                                                                <div style={{ marginTop: "8px" }}>
                                                                                                                    <TextField
                                                                                                                        label={t("sendowl_import.keys_per_unit")}
                                                                                                                        type="number"
                                                                                                                        value={licenseKeysPerUnit[selectedLicense.id] || 1}
                                                                                                                        onChange={(value) => handleKeysPerUnitChange(selectedLicense.id, value)}
                                                                                                                        min={1}
                                                                                                                        autoComplete="off"
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <Text
                                                                                                                    variant="bodyLg"
                                                                                                                    as="p"
                                                                                                                >
                                                                                                                    {t(
                                                                                                                        "createdigitalproduct.license_type"
                                                                                                                    )}

                                                                                                                    :{" "}
                                                                                                                    {selectedLicense.license_type ===
                                                                                                                    "automated"
                                                                                                                       ? t("createdigitalproduct.automated")
                                                                                        : t("createdigitalproduct.manual")}
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
                                                                                                                                )}

                                                                                                                                :{" "}
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
                                                                                            {selectedCustomLinks.map(
                                                                                                (
                                                                                                    selectedCustom,
                                                                                                    index
                                                                                                ) => {
                                                                                                    // const selectedCustom = customs.find((custom) => custom.id === selectedCustomId);
                                                                                                    // if (!selectedCustom) return null;

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
                                                                                                                            handleDeleteLinkAtIndex(
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

                                                                            {contentType &&
                                                                                contentType.includes(
                                                                                    "videos"
                                                                                ) && (
                                                                                    <BlockStack gap="300">
                                                                                        {/* Old Videos from Database */}
                                                                                        {oldVideos.length > 0 && (
                                                                                            <BlockStack gap="200">
                                                                                                {oldVideos.map((video) => (
                                                                                                    <BlockStack key={video.value} gap={200}>
                                                                                                        <InlineGrid columns="1fr auto">
                                                                                                            <div>
                                                                                                                <InlineStack gap="300">
                                                                                                                    <img
                                                                                                                        src={video.thumbnail}
                                                                                                                        alt={video.title}
                                                                                                                        style={{
                                                                                                                            width: "80px",
                                                                                                                            maxHeight: "60px",
                                                                                                                            borderRadius: "8px"
                                                                                                                        }}
                                                                                                                    />
                                                                                                                    <BlockStack gap="100">
                                                                                                                        <div
                                                                                                                            style={{
                                                                                                                                maxWidth: "350px",
                                                                                                                                minWidth: 0,
                                                                                                                                overflow: "hidden"
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            <Text
                                                                                                                                as="span"
                                                                                                                                title={video.title}
                                                                                                                                style={{
                                                                                                                                    display: "block",
                                                                                                                                    whiteSpace: "nowrap",
                                                                                                                                    overflow: "hidden",
                                                                                                                                    textOverflow: "ellipsis"
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <strong>{t("digtal_product_listing.title_with_colon")}</strong> {video.title}
                                                                                                                            </Text>
                                                                                                                        </div>
                                                                                                                        <Text><strong>{t("digtal_product_listing.duration_with_colon")}</strong> {(video.duration)}</Text>
                                                                                                                    </BlockStack>
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
                                                                                                                        handleDeleteOldVideo(
                                                                                                                            video.id,
                                                                                                                            video.value
                                                                                                                        )
                                                                                                                    }
                                                                                                                ></Button>
                                                                                                            </div>
                                                                                                        </InlineGrid>
                                                                                                    </BlockStack>
                                                                                                ))}
                                                                                            </BlockStack>
                                                                                        )}

                                                                                        {selectedExistingVideos.length > 0 && (
                                                                                            <BlockStack gap="200">
                                                                                                {selectedExistingVideos.map((video) => (
                                                                                                    <BlockStack key={video.value} gap={200}>
                                                                                                        <InlineGrid columns="1fr auto">
                                                                                                            <div>
                                                                                                                <InlineStack gap="300">
                                                                                                                    <img
                                                                                                                        src={video.thumbnail}
                                                                                                                        alt={video.title}
                                                                                                                        style={{
                                                                                                                            width: "80px",
                                                                                                                            maxHeight: "60px",
                                                                                                                            borderRadius: "8px"
                                                                                                                        }}
                                                                                                                    />
                                                                                                                    <BlockStack gap="100">
                                                                                                                        <div
                                                                                                                            style={{
                                                                                                                                maxWidth: "350px",
                                                                                                                                minWidth: 0,
                                                                                                                                overflow: "hidden"
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            <Text
                                                                                                                                as="span"
                                                                                                                                title={video.title}
                                                                                                                                style={{
                                                                                                                                    display: "block",
                                                                                                                                    whiteSpace: "nowrap",
                                                                                                                                    overflow: "hidden",
                                                                                                                                    textOverflow: "ellipsis"
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <strong>{t("digtal_product_listing.title_with_colon")}</strong> {video.title}
                                                                                                                            </Text>
                                                                                                                        </div>
                                                                                                                        <Text><strong>{t("digtal_product_listing.duration_with_colon")}</strong> {(video.duration)}</Text>
                                                                                                                    </BlockStack>
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
                                                                                                                        handleDeleteExistingVideo(
                                                                                                                            video.value
                                                                                                                        )
                                                                                                                    }
                                                                                                                ></Button>
                                                                                                            </div>
                                                                                                        </InlineGrid>
                                                                                                    </BlockStack>
                                                                                                ))}
                                                                                            </BlockStack>
                                                                                        )}

                                                                                        {newProviderVideo.filter(v =>
                                                                                            !oldVideos.some(ov => ov.value === v.value) &&
                                                                                            !selectedExistingVideos.some(sev => sev.value === v.value)
                                                                                        ).length > 0 && (
                                                                                                <BlockStack gap="200">
                                                                                                    {newProviderVideo
                                                                                                        .filter(video =>
                                                                                                            !oldVideos.some(ov => ov.value === video.value) &&
                                                                                                            !selectedExistingVideos.some(sev => sev.value === video.value)
                                                                                                        )
                                                                                                        .map((video) => (
                                                                                                            <BlockStack key={video.value} gap={200}>
                                                                                                                <InlineGrid columns="1fr auto">
                                                                                                                    <div>
                                                                                                                        <InlineStack gap="300">
                                                                                                                            <img
                                                                                                                                src={video.thumbnail}
                                                                                                                                alt={video.title}
                                                                                                                                style={{
                                                                                                                                    width: "80px",
                                                                                                                                    maxHeight: "60px",
                                                                                                                                    borderRadius: "8px"
                                                                                                                                }}
                                                                                                                            />
                                                                                                                            <BlockStack gap="100">
                                                                                                                                <div
                                                                                                                                    style={{
                                                                                                                                        maxWidth: "350px",
                                                                                                                                        minWidth: 0,
                                                                                                                                        overflow: "hidden"
                                                                                                                                    }}
                                                                                                                                >
                                                                                                                                    <Text
                                                                                                                                        as="span"
                                                                                                                                        title={video.title}
                                                                                                                                        style={{
                                                                                                                                            display: "block",
                                                                                                                                            whiteSpace: "nowrap",
                                                                                                                                            overflow: "hidden",
                                                                                                                                            textOverflow: "ellipsis"
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        <strong>{t("digtal_product_listing.title_with_colon")}</strong> {video.title}
                                                                                                                                    </Text>
                                                                                                                                </div>
                                                                                                                                <Text><strong>{t("digtal_product_listing.duration_with_colon")}</strong> {(video.duration)}</Text>
                                                                                                                            </BlockStack>
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
                                                                                                                                handleDeleteNewVideo(
                                                                                                                                    video.value
                                                                                                                                )
                                                                                                                            }
                                                                                                                        ></Button>
                                                                                                                    </div>
                                                                                                                </InlineGrid>
                                                                                                            </BlockStack>
                                                                                                        ))}
                                                                                                </BlockStack>
                                                                                            )}
                                                                                    </BlockStack>
                                                                                )}
                                                                        </div>

                                                                        <div
                                                                            className="responsive-cards-grid"
                                                                            style={{
                                                                                marginTop: "10px",
                                                                            }}
                                                                        >
                                                                            <Card>
                                                                                <BlockStack gap="300">
                                                                                    <div
                                                                                        style={{
                                                                                            width: "24px",
                                                                                            height: "24px",
                                                                                            margin: "0 auto",
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
                                                                                        "editdigitalproduct.add_files_l"
                                                                                    )}
                                                                                    primaryAction={{
                                                                                        content: t(
                                                                                            "createdigitalproduct.add"
                                                                                        ),
                                                                                        onAction:
                                                                                            toggleFileUpload,
                                                                                    }}
                                                                                    secondaryActions={[
                                                                                        {
                                                                                            content: t(
                                                                                                "digtal_product_listing.cancel"
                                                                                            ),
                                                                                            onAction:
                                                                                                toggleModal,
                                                                                        },
                                                                                    ]}
                                                                                >
                                                                                    <Modal.Section>
                                                                                        <Tabs
                                                                                            tabs={mainTabs}
                                                                                            selected={
                                                                                                selectedMainTab
                                                                                            }
                                                                                            onSelect={
                                                                                                handleTabChange
                                                                                            }
                                                                                        >
                                                                                            {selectedMainTab ===
                                                                                                0 && (
                                                                                                <>
                                                                                                    <div
                                                                                                        style={{
                                                                                                            margin: "5px",
                                                                                                            padding:
                                                                                                                "5px",
                                                                                                        }}
                                                                                                    >
                                                                                                        <InlineStack gap="200">
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    width: "84%",
                                                                                                                }}
                                                                                                            >
                                                                                                                <Autocomplete
                                                                                                                    options={
                                                                                                                        searchOptions
                                                                                                                    }
                                                                                                                    selected={
                                                                                                                        selectedOptions
                                                                                                                    }
                                                                                                                    onSelect={
                                                                                                                        updateSelection
                                                                                                                    }
                                                                                                                    textField={
                                                                                                                        textField
                                                                                                                    }
                                                                                                                    loading={
                                                                                                                        loading
                                                                                                                    }
                                                                                                                />
                                                                                                            </div>

                                                                                                            <div
                                                                                                                style={{
                                                                                                                    width: "7%",
                                                                                                                }}
                                                                                                            >
                                                                                                                <Button
                                                                                                                    variant="primary"
                                                                                                                    onClick={
                                                                                                                        handleSearch
                                                                                                                    }
                                                                                                                    primary
                                                                                                                >
                                                                                                                    {t(
                                                                                                                        "createdigitalproduct.search"
                                                                                                                    )}
                                                                                                                </Button>
                                                                                                            </div>
                                                                                                        </InlineStack>
                                                                                                    </div>
                                                                                                    <div style={{ marginBottom: '16px' }}>
                                                                                            <InlineStack gap="400">
                                                                                                <Button
                                                                                                    onClick={toggleCurrentPageSelection}
                                                                                                    variant="secondary"
                                                                                                    disabled={orders.length === 0}
                                                                                                >
                                                                                                    {allCurrentPageSelected ? t('createdigitalproduct.deselect_all_on_this_page') : t('createdigitalproduct.select_all_on_this_page')}
                                                                                                </Button>
                                                                                                <Button
                                                                                                    onClick={() => {
                                                                                                        setSelectedFileIds([]);
                                                                                                        setSelectedFileDetails([]);
                                                                                                    }}
                                                                                                    variant="secondary"
                                                                                                    tone="critical"
                                                                                                    disabled={selectedFileIds.length === 0}
                                                                                                >
                                                                                                    {t('createdigitalproduct.clear_all_selections')} ({selectedFileIds.length} {t('sendowl_import.total')})
                                                                                                </Button>
                                                                                            </InlineStack>
                                                                                            <div style={{ marginTop: '8px' }}>
                                                                                                <Text variant="bodySm" tone="subdued">
                                                                                                    {currentPageSelectedIds.length} {t('sendowl_import.of')} {orders.length} {t('sendowl_import.selected_on_this_page')} • {selectedFileIds.length} {t('sendowl_import.total_selected_across_all_pages')}
                                                                                                </Text>
                                                                                            </div>
                                                                                        </div>
                                                                                        <Card>
                                                                                            {orders.length > 0 ? (
                                                                                                <div style={{ padding: '16px 0' }}>
                                                                                                    {orders.map(({ id, fileName, mimeType, byteSize }) => (
                                                                                                        <div key={id} style={{
                                                                                                            display: 'flex',
                                                                                                            alignItems: 'center',
                                                                                                            padding: '12px 16px',
                                                                                                            borderBottom: '1px solid #f1f3f5'
                                                                                                        }}>
                                                                                                            <div style={{ marginRight: '16px' }}>
                                                                                                                <Checkbox
                                                                                                                    checked={selectedFileIds.includes(id)}
                                                                                                                    onChange={() => toggleFileSelection(id)}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
                                                                                                                <Text variant="bodyMd">{fileName}</Text>
                                                                                                                <Text variant="bodyMd" tone="subdued">{mimeType}</Text>
                                                                                                                <Text variant="bodyMd" tone="subdued">{prettyBytes(byteSize)}</Text>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                                                                                    <Text variant="bodyMd" tone="subdued">{t('library.no_files_found')}</Text>
                                                                                                </div>
                                                                                            )}
                                                                                        </Card>
                                                                                                    {isLoading && (
                                                                                                        <div
                                                                                                            style={{
                                                                                                                display:
                                                                                                                    "flex",
                                                                                                                justifyContent:
                                                                                                                    "center",
                                                                                                                marginTop:
                                                                                                                    "20px",
                                                                                                            }}
                                                                                                        >
                                                                                                            <Spinner size="small" />
                                                                                                        </div>
                                                                                                    )}
                                                                                                    <div
                                                                                                        style={{
                                                                                                            display:
                                                                                                                "flex",
                                                                                                            justifyContent:
                                                                                                                "center",
                                                                                                            marginTop:
                                                                                                                "20px",
                                                                                                        }}
                                                                                                    >
                                                                                                        <Pagination
                                                                                                            hasPrevious={
                                                                                                                currentPageFiles >
                                                                                                                1
                                                                                                            }
                                                                                                            onPrevious={() =>
                                                                                                                handleFilePageChange(
                                                                                                                    currentPageFiles -
                                                                                                                        1
                                                                                                                )
                                                                                                            }
                                                                                                            hasNext={
                                                                                                                totalFiles >
                                                                                                                currentPageFiles *
                                                                                                                    itemsPerPage
                                                                                                            }
                                                                                                            onNext={() =>
                                                                                                                handleFilePageChange(
                                                                                                                    currentPageFiles +
                                                                                                                        1
                                                                                                                )
                                                                                                            }
                                                                                                            labels={{
                                                                                                                next: "Next",
                                                                                                                previous:
                                                                                                                    "Previous",
                                                                                                            }}
                                                                                                        />
                                                                                                    </div>
                                                                                                </>
                                                                                            )}
                                                                                            {selectedMainTab ===
                                                                                                1 && (
                                                                                                <BlockStack gap="400">
                                                                                                    <DropZone
                                                                                                        label={
                                                                                                            fileLabelText
                                                                                                        }
                                                                                                        onDrop={
                                                                                                            handleDropZoneDrop
                                                                                                        }
                                                                                                    >
                                                                                                        <DropZone.FileUpload actionTitle={t("createdigitalproduct.add_files")} />
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
                                                                                            {selectedMainTab === 2 && (
                                                                                                            <>
                                                                                                                <div style={{ padding: "16px" }}>
                                                                                                                    <TextField
                                                                                                                        label={t("createdigitalproduct.google_drive_file_folder_link")}
                                                                                                                        value={googleDriveLink}
                                                                                                                        onChange={handleGoogleDriveLinkChange}
                                                                                                                        placeholder={t("createdigitalproduct.enter_google_drive_file_or_folder_link")}
                                                                                                                    />
                                                                                                                    <div style={{marginTop: "5px"}}></div>
                                                                                                                    <Text variant="bodySm" tone="subdued" style={{ marginTop: "8px" }}>
                                                                                                                        {t("createdigitalproduct.google_drive_help_text")}
                                                                                                                    </Text>
                                                                                                                </div>
                                                                                                            </>
                                                                                                        )}
                                                                                        </Tabs>
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
                                                                                                marginLeft:
                                                                                                    "54px",
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
                                                                                            onClick={
                                                                                                toggleLicenseModal
                                                                                            }
                                                                                        >
                                                                                            {t(
                                                                                                "createdigitalproduct.license_keys_codes"
                                                                                            )}
                                                                                        </Button>
                                                                                    </BlockStack>
                                                                                    <Modal
                                                                                        size="large"
                                                                                        open={
                                                                                            isLicenseModalOpen
                                                                                        }
                                                                                        onClose={
                                                                                            toggleLicenseModal
                                                                                        }
                                                                                        title={t(
                                                                                            "createdigitalproduct.add_license_key_code"
                                                                                        )}
                                                                                        primaryAction={{
                                                                                            size: "large",
                                                                                            content:
                                                                                                t("createdigitalproduct.add_key_code"),
                                                                                            onAction:
                                                                                                toggleLicenseInput,
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
                                                                                            <Tabs
                                                                                                tabs={
                                                                                                    licenseTabs
                                                                                                }
                                                                                                selected={
                                                                                                    selectedLicenseTab
                                                                                                }
                                                                                                onSelect={
                                                                                                    handleLicenseTabChange
                                                                                                }
                                                                                            >
                                                                                                {selectedLicenseTab ===
                                                                                                    0 && (
                                                                                                    <>
                                                                                                        <div
                                                                                                            style={{
                                                                                                                marginLeft:
                                                                                                                    "15px",
                                                                                                                marginRight:
                                                                                                                    "15px",
                                                                                                            }}
                                                                                                        >
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    margin: "5px",
                                                                                                                    padding:
                                                                                                                        "5px",
                                                                                                                }}
                                                                                                            >
                                                                                                                <InlineStack gap="200">
                                                                                                                    <div
                                                                                                                        style={{
                                                                                                                            width: "92%",
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Autocomplete
                                                                                                                            options={
                                                                                                                                searchLicenseOptions
                                                                                                                            }
                                                                                                                            selected={
                                                                                                                                selectedLicenseOptions
                                                                                                                            }
                                                                                                                            onSelect={
                                                                                                                                updateLicenseSelection
                                                                                                                            }
                                                                                                                            textField={
                                                                                                                                textFieldForLicense
                                                                                                                            }
                                                                                                                            loading={
                                                                                                                                loading
                                                                                                                            }
                                                                                                                        />
                                                                                                                    </div>

                                                                                                                    <div
                                                                                                                        style={{
                                                                                                                            width: "7%",
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Button
                                                                                                                            variant="primary"
                                                                                                                            onClick={
                                                                                                                                handleLicenseSearch
                                                                                                                            }
                                                                                                                            primary
                                                                                                                        >
                                                                                                                            {t(
                                                                                                                                "createdigitalproduct.search"
                                                                                                                            )}
                                                                                                                        </Button>
                                                                                                                    </div>
                                                                                                                </InlineStack>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    marginTop:
                                                                                                                        "10ox",
                                                                                                                }}
                                                                                                            >
                                                                                                                <table
                                                                                                                    style={{
                                                                                                                        width: "100%",
                                                                                                                        borderCollapse:
                                                                                                                            "collapse",
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <thead>
                                                                                                                        <tr>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <Checkbox
                                                                                                                                    checked={
                                                                                                                                        selectAll
                                                                                                                                    }
                                                                                                                                    onChange={() =>
                                                                                                                                        handleSelectAll()
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </th>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.title"
                                                                                                                                )}
                                                                                                                            </th>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.license_type"
                                                                                                                                )}
                                                                                                                            </th>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.codes_remaining"
                                                                                                                                )}
                                                                                                                            </th>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.file"
                                                                                                                                )}
                                                                                                                            </th>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.total_codes"
                                                                                                                                )}
                                                                                                                            </th>
                                                                                                                        </tr>
                                                                                                                    </thead>
                                                                                                                    <tbody>
                                                                                                                        {licenses.map(
                                                                                                                            (
                                                                                                                                license
                                                                                                                            ) => (
                                                                                                                                <tr
                                                                                                                                    key={
                                                                                                                                        license.id
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        <Checkbox
                                                                                                                                            checked={selectedLicenseIds.includes(
                                                                                                                                                license.id
                                                                                                                                            )}
                                                                                                                                            onChange={() =>
                                                                                                                                                handleToggleLicenseSelection(
                                                                                                                                                    license.id
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            license.title
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            license.license_type
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            license.codes_remaining
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        {getFileName(
                                                                                                                                            license.file
                                                                                                                                        ) && (
                                                                                                                                            <a
                                                                                                                                                href="#"
                                                                                                                                                style={{
                                                                                                                                                    color: "blue",
                                                                                                                                                    textDecoration:
                                                                                                                                                        "underline",
                                                                                                                                                }}
                                                                                                                                                target="_blank"
                                                                                                                                                rel="noopener noreferrer"
                                                                                                                                            >
                                                                                                                                                {getFileName(
                                                                                                                                                    license.file
                                                                                                                                                )}
                                                                                                                                            </a>
                                                                                                                                        )}
                                                                                                                                    </td>
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            license.codes_text
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                            )
                                                                                                                        )}
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                                <div
                                                                                                                    style={{
                                                                                                                        marginTop:
                                                                                                                            "10px",
                                                                                                                    }}
                                                                                                                >
                                                                                                                    {selectedLicenseIds.length >
                                                                                                                        0 && (
                                                                                                                        <Text
                                                                                                                            variant="headingMd"
                                                                                                                            as="h6"
                                                                                                                        >
                                                                                                                            {
                                                                                                                                selectedLicenseIds.length
                                                                                                                            }{" "}
                                                                                                                            {t(
                                                                                                                                "createdigitalproduct.selected"
                                                                                                                            )}
                                                                                                                        </Text>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {isLoading && (
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    display:
                                                                                                                        "flex",
                                                                                                                    justifyContent:
                                                                                                                        "center",
                                                                                                                    marginTop:
                                                                                                                        "20px",
                                                                                                                }}
                                                                                                            >
                                                                                                                <Spinner size="small" />
                                                                                                            </div>
                                                                                                        )}
                                                                                                        <div
                                                                                                            style={{
                                                                                                                display:
                                                                                                                    "flex",
                                                                                                                justifyContent:
                                                                                                                    "center",
                                                                                                                marginTop:
                                                                                                                    "20px",
                                                                                                            }}
                                                                                                        >
                                                                                                            <Pagination
                                                                                                                hasPrevious={
                                                                                                                    currentPageLicenses >
                                                                                                                    1
                                                                                                                }
                                                                                                                onPrevious={() =>
                                                                                                                    handleLicensePageChange(
                                                                                                                        currentPageLicenses -
                                                                                                                            1
                                                                                                                    )
                                                                                                                }
                                                                                                                hasNext={
                                                                                                                    totalLicenses >
                                                                                                                    currentPageLicenses *
                                                                                                                        itemsPerPage
                                                                                                                }
                                                                                                                onNext={() =>
                                                                                                                    handleLicensePageChange(
                                                                                                                        currentPageLicenses +
                                                                                                                            1
                                                                                                                    )
                                                                                                                }
                                                                                                                labels={{
                                                                                                                    next: "Next",
                                                                                                                    previous:
                                                                                                                        "Previous",
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </>
                                                                                                )}
                                                                                                {selectedLicenseTab ===
                                                                                                    1 && (
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
                                                                                                                    "editdigitalproduct.License_key_code_type"
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
                                                                                                                                    onWheel={(e) => e.currentTarget.blur()}
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style={{
                                                                                                                                    width: "22%",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <TextField
                                                                                                                                    label={t("createdigitalproduct.suffix")}
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
                                                                                                                                        "editdigitalproduct.total_codes"
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
                                                                                                                                    onWheel={(e) => e.currentTarget.blur()}
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
                                                                                                                                    color: "#2c5282",
                                                                                                                                    display: "inline-block"
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
                                                                                                                                        label="Upload CSV"
                                                                                                                                        onDrop={
                                                                                                                                            handleLicenseDropZoneDrop
                                                                                                                                        }
                                                                                                                                        accept=".csv"
                                                                                                                                        allowMultiple={
                                                                                                                                            false
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        <DropZone.FileUpload actionTitle={t("digtal_product_listing.add_files")} />
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
                                                                                                                                                "editdigitalproduct.ready_to_upload_your_license"
                                                                                                                                            )}{" "}
                                                                                                                                            <a
                                                                                                                                                href="/license.csv"
                                                                                                                                                download
                                                                                                                                            >
                                                                                                                                                {t(
                                                                                                                                                    "editdigitalproduct.get_the_template_here"
                                                                                                                                                )}
                                                                                                                                            </a>{" "}
                                                                                                                                            {t(
                                                                                                                                                "editdigitalproduct.to_get_started"
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
                                                                                                                                        "editdigitalproduct.deliver_keys_codes_in_sequence_order"
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
                                                                                                                                    "editdigitalproduct.paste_your_license_keys_or_codes_here"
                                                                                                                                )}
                                                                                                                                autoComplete="off"
                                                                                                                                helpText={t(
                                                                                                                                    "editdigitalproduct.paste_your_license_keys_each_line"
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
                                                                                                                        "editdigitalproduct.send_key_code_to_multiple_customers"
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
                                                                                                                    "createdigitalproduct.delivery_single_key"
                                                                                                                )}
                                                                                                                checked={
                                                                                                                    oneKeyDelivery
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleOneKeyDelivery
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
                                                                                                                label={t(
                                                                                                                    "editdigitalproduct.deliver_as_qr_code"
                                                                                                                )}
                                                                                                                checked={
                                                                                                                    qrCodeEnabled
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleQRCode
                                                                                                                }
                                                                                                            />
                                                                                                        </div>

                                                                                                        <div style={{marginTop: "0px"}}>
                                                                                                            <Checkbox
                                                                                                                label={t("editdigitalproduct.deliver_as_gift_card_send_key_code_to_gift_recipient")}
                                                                                                                checked={giftCardEnabled}
                                                                                                                onChange={handleGiftCardEnabled}
                                                                                                            />
                                                                                                        </div>

                                                                                                        {qrCodeEnabled && (
                                                                                                                <div style={{ marginTop: "0px" }}>
                                                                                                                    <Checkbox
                                                                                                                        label={t("editdigitalproduct.print_qr_code_on_pdf")}
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
                                                                                                                       placeholder={t("createdigitalproduct.enter_email_property_name")}
                                                                                                helpText={t("createdigitalproduct.specify_property_name_email_address")}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div style={{marginTop: "10px"}}>
                                                                                                                    <TextField
                                                                                                                       label={t("createdigitalproduct.delivery_time_property_name")}
                                                                                                                        value={giftDeliveryPropertyName}
                                                                                                                        onChange={handleGiftDeliveryPropertyNameChange}
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
                                                                                                                    "editdigitalproduct.deliver_no_of_keys_codes_per_unit"
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
                                                                                                                onWheel={(e) => e.currentTarget.blur()}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </Tabs>
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
                                                                                                marginLeft:
                                                                                                    "54px",
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
                                                                                        open={
                                                                                            isCustomLinkModalOpen
                                                                                        }
                                                                                        onClose={
                                                                                            toggleCustomLinkModal
                                                                                        }
                                                                                        title={t(
                                                                                            "editdigitalproduct.add_custom_link"
                                                                                        )}
                                                                                        primaryAction={{
                                                                                            size: "large",
                                                                                            content: t(
                                                                                                "editdigitalproduct.add_custom_link"
                                                                                            ),
                                                                                            onAction:
                                                                                                toggleCustomLink,
                                                                                            disabled: !isCustomLinkFormValid(),
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
                                                                                            <Tabs
                                                                                                tabs={
                                                                                                    customTabs
                                                                                                }
                                                                                                selected={
                                                                                                    selectedCustomTab
                                                                                                }
                                                                                                onSelect={
                                                                                                    handleCustomTabChange
                                                                                                }
                                                                                            >
                                                                                                {selectedCustomTab ===
                                                                                                    0 && (
                                                                                                    <>
                                                                                                        <div
                                                                                                            style={{
                                                                                                                marginLeft:
                                                                                                                    "15px",
                                                                                                                marginRight:
                                                                                                                    "15px",
                                                                                                            }}
                                                                                                        >
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    margin: "5px",
                                                                                                                    padding:
                                                                                                                        "5px",
                                                                                                                }}
                                                                                                            >
                                                                                                                <InlineStack gap="200">
                                                                                                                    <div
                                                                                                                        style={{
                                                                                                                            width: "87%",
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Autocomplete
                                                                                                                            options={
                                                                                                                                searchCustomLinkOptions
                                                                                                                            }
                                                                                                                            selected={
                                                                                                                                selectedCustomLinkOptions
                                                                                                                            }
                                                                                                                            onSelect={
                                                                                                                                updateCustomLinkSelection
                                                                                                                            }
                                                                                                                            textField={
                                                                                                                                textFieldForCustomLink
                                                                                                                            }
                                                                                                                            loading={
                                                                                                                                isLoading
                                                                                                                            }
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                    <div
                                                                                                                        style={{
                                                                                                                            width: "7%",
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Button
                                                                                                                            variant="primary"
                                                                                                                            onClick={
                                                                                                                                handleCustomLinkSearch
                                                                                                                            }
                                                                                                                            primary
                                                                                                                        >
                                                                                                                            {t(
                                                                                                                                "createdigitalproduct.search"
                                                                                                                            )}
                                                                                                                        </Button>
                                                                                                                    </div>
                                                                                                                </InlineStack>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    marginTop:
                                                                                                                        "10ox",
                                                                                                                }}
                                                                                                            >
                                                                                                                <table
                                                                                                                    style={{
                                                                                                                        width: "100%",
                                                                                                                        borderCollapse:
                                                                                                                            "collapse",
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <thead>
                                                                                                                        <tr>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <Checkbox
                                                                                                                                    checked={
                                                                                                                                        selectAllForCustom
                                                                                                                                    }
                                                                                                                                    onChange={() =>
                                                                                                                                        handleSelectAllForCustom()
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </th>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.title"
                                                                                                                                )}
                                                                                                                            </th>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.redirect_url"
                                                                                                                                )}
                                                                                                                            </th>
                                                                                                                            <th
                                                                                                                                style={{
                                                                                                                                    fontWeight:
                                                                                                                                        "bold",
                                                                                                                                    textAlign:
                                                                                                                                        "left",
                                                                                                                                    padding:
                                                                                                                                        "0.5rem",
                                                                                                                                    borderBottom:
                                                                                                                                        "2px solid #ddd",
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {t(
                                                                                                                                    "createdigitalproduct.link_detail"
                                                                                                                                )}
                                                                                                                            </th>
                                                                                                                        </tr>
                                                                                                                    </thead>
                                                                                                                    <tbody>
                                                                                                                        {customs.map(
                                                                                                                            (
                                                                                                                                link
                                                                                                                            ) => (
                                                                                                                                <tr
                                                                                                                                    key={
                                                                                                                                        link.id
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        <Checkbox
                                                                                                                                            checked={selectedCustomIds.includes(
                                                                                                                                                link.id
                                                                                                                                            )}
                                                                                                                                            onChange={() =>
                                                                                                                                                handleToggleCustomSelection(
                                                                                                                                                    link.id
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            link.title
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        <a
                                                                                                                                            href="#"
                                                                                                                                            style={{
                                                                                                                                                color: "blue",
                                                                                                                                                textDecoration:
                                                                                                                                                    "underline",
                                                                                                                                            }}
                                                                                                                                            target="_blank"
                                                                                                                                            rel="noopener noreferrer"
                                                                                                                                        >
                                                                                                                                            {
                                                                                                                                                link.redirect_url
                                                                                                                                            }
                                                                                                                                        </a>
                                                                                                                                    </td>
                                                                                                                                    <td
                                                                                                                                        style={{
                                                                                                                                            padding:
                                                                                                                                                "0.5rem",
                                                                                                                                            textAlign:
                                                                                                                                                "left",
                                                                                                                                            borderBottom:
                                                                                                                                                "1px solid #ddd",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        {
                                                                                                                                            link.link_details
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                            )
                                                                                                                        )}
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                                <div
                                                                                                                    style={{
                                                                                                                        marginTop:
                                                                                                                            "10px",
                                                                                                                    }}
                                                                                                                >
                                                                                                                    {selectedCustomIds.length >
                                                                                                                        0 && (
                                                                                                                        <Text
                                                                                                                            variant="headingMd"
                                                                                                                            as="h6"
                                                                                                                        >
                                                                                                                            {
                                                                                                                                selectedCustomIds.length
                                                                                                                            }{" "}
                                                                                                                            {t(
                                                                                                                                "createdigitalproduct.selected"
                                                                                                                            )}
                                                                                                                        </Text>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {isLoading && (
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    display:
                                                                                                                        "flex",
                                                                                                                    justifyContent:
                                                                                                                        "center",
                                                                                                                    marginTop:
                                                                                                                        "20px",
                                                                                                                }}
                                                                                                            >
                                                                                                                <Spinner size="small" />
                                                                                                            </div>
                                                                                                        )}
                                                                                                        <div
                                                                                                            style={{
                                                                                                                display:
                                                                                                                    "flex",
                                                                                                                justifyContent:
                                                                                                                    "center",
                                                                                                                marginTop:
                                                                                                                    "20px",
                                                                                                            }}
                                                                                                        >
                                                                                                            <Pagination
                                                                                                                hasPrevious={
                                                                                                                    currentPageCustoms >
                                                                                                                    1
                                                                                                                }
                                                                                                                onPrevious={() =>
                                                                                                                    handleCustomPageChange(
                                                                                                                        currentPageCustoms -
                                                                                                                            1
                                                                                                                    )
                                                                                                                }
                                                                                                                hasNext={
                                                                                                                    totalCustoms >
                                                                                                                    currentPageCustoms *
                                                                                                                        itemsPerPage
                                                                                                                }
                                                                                                                onNext={() =>
                                                                                                                    handleCustomPageChange(
                                                                                                                        currentPageCustoms +
                                                                                                                            1
                                                                                                                    )
                                                                                                                }
                                                                                                                labels={{
                                                                                                                    next: "Next",
                                                                                                                    previous:
                                                                                                                        "Previous",
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </>
                                                                                                )}
                                                                                                {selectedCustomTab ===
                                                                                                    1 && (
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
                                                                                                )}
                                                                                            </Tabs>
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
                                                                                                                                                marginLeft:
                                                                                                                                                    "60px",
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
                                                                                                                                            onClick={
                                                                                                                                                toggleVideoModal
                                                                                                                                            }
                                                                                                                                        >
                                                                                                                                            {t("library.video_streaming")}
                                                                                                                                        </Button>
                                                                                                                                    </BlockStack>
                                                                                                                                    <Modal
                                                                                                                                        open={
                                                                                                                                            isVideoModalOpen
                                                                                                                                        }
                                                                                                                                        onClose={
                                                                                                                                            toggleVideoModal
                                                                                                                                        }
                                                                                                                                        title={
                                                                                                                                            <InlineStack gap={200}>
                                                                                                                                                <Text variant="headingMd" as="h6">
                                                                                                                                                    {t("library.video_streaming")}
                                                                                                                                                </Text>
                                                                                                                                                <Text as="p" tone="subdued" fontWeight="medium">
                                                                                                                                                    {store?.setting?.vimeo_integration?.vimeo_integration_enabled && !store?.setting?.wistia_integration?.wistia_integration_enabled ? "( Vimeo )" : ""}
                                                                                                                                                    {store?.setting?.wistia_integration?.wistia_integration_enabled && !store?.setting?.vimeo_integration?.vimeo_integration_enabled ? "( Wistia )" : ""}
                                                                                                                                                    {store?.setting?.vimeo_integration?.vimeo_integration_enabled && store?.setting?.wistia_integration?.wistia_integration_enabled ? "( Vimeo / Wistia )" : ""}
                                                                                                                                                </Text>
                                                                                                                                            </InlineStack>
                                                                                                                                        }
                                                                                                                                        primaryAction={{
                                                                                                                                            size: "large",
                                                                                                                                            content: selectedVideoTab === 0 ? t("digtal_product_listing.add") : t("library.add_video"),
                                                                                                                                            onAction: selectedVideoTab === 0 ? addSelectedExistingVideos : toggleVideo,
                                                                                                                                            disabled: selectedVideoTab === 0 ? selectedVideoResources.length === 0 : !selectedVideo
                                                                                                                                        }}
                                                                                                                                        secondaryActions={[
                                                                                                                                            {
                                                                                                                                                size: "large",
                                                                                                                                                content: t(
                                                                                                                                                    "digtal_product_listing.cancel"
                                                                                                                                                ),
                                                                                                                                                onAction:
                                                                                                                                                    toggleVideoModal,
                                                                                                                                            },
                                                                                                                                        ]}
                                                                                                                                    >
                                                                                                                                        <Tabs
                                                                                                                                            tabs={videoTabs}
                                                                                                                                            selected={selectedVideoTab}
                                                                                                                                            onSelect={handleVideoTabChange}
                                                                                                                                        >
                                                                                                                                            {selectedVideoTab === 0 && (
                                                                                                                                                <>
                                                                                                                                                    <div
                                                                                                                                                        style={{
                                                                                                                                                            margin: "5px",
                                                                                                                                                            padding:
                                                                                                                                                                "5px",
                                                                                                                                                        }}
                                                                                                                                                    >
                                                                                                                                                        <InlineStack gap="200">
                                                                                                                                                            <div
                                                                                                                                                                style={{
                                                                                                                                                                    width: "84%",
                                                                                                                                                                }}
                                                                                                                                                            >
                                                                                                                                                                <Autocomplete
                                                                                                                                                                    options={
                                                                                                                                                                        videoSearchOptions
                                                                                                                                                                    }
                                                                                                                                                                    selected={
                                                                                                                                                                        videoSelectedOptions
                                                                                                                                                                    }
                                                                                                                                                                    onSelect={
                                                                                                                                                                        updateVideoSelection
                                                                                                                                                                    }
                                                                                                                                                                    textField={
                                                                                                                                                                        videoTextField
                                                                                                                                                                    }
                                                                                                                                                                    loading={
                                                                                                                                                                        loadingExistingVideos
                                                                                                                                                                    }
                                                                                                                                                                />
                                                                                                                                                            </div>

                                                                                                                                                            <div
                                                                                                                                                                style={{
                                                                                                                                                                    width: "7%",
                                                                                                                                                                }}
                                                                                                                                                            >
                                                                                                                                                                <Button
                                                                                                                                                                    variant="primary"
                                                                                                                                                                    onClick={
                                                                                                                                                                        handleVideoSearch
                                                                                                                                                                    }
                                                                                                                                                                    primary
                                                                                                                                                                >
                                                                                                                                                                    {t(
                                                                                                                                                                        "createdigitalproduct.search"
                                                                                                                                                                    )}
                                                                                                                                                                </Button>
                                                                                                                                                            </div>
                                                                                                                                                        </InlineStack>
                                                                                                                                                    </div>
                                                                                                                                                    <IndexTable
                                                                                                                                                        resourceName={
                                                                                                                                                            videoResourceName
                                                                                                                                                        }
                                                                                                                                                        itemCount={
                                                                                                                                                            existingVideos.length
                                                                                                                                                        }
                                                                                                                                                        selectedItemsCount={
                                                                                                                                                            allVideoResourcesSelected
                                                                                                                                                                ? "All"
                                                                                                                                                                : selectedVideoResources.length
                                                                                                                                                        }
                                                                                                                                                        onSelectionChange={
                                                                                                                                                            handleVideoSelectionChange
                                                                                                                                                        }
                                                                                                                                                        headings={[
                                                                                                                                                            {
                                                                                                                                                                title: t("library.thumbnail")
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                title: t("library.title")
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                title: t("library.duration")
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                title: t("library.provider")
                                                                                                                                                            },
                                                                                                                                                        ]}
                                                                                                                                                    >
                                                                                                                                                        {
                                                                                                                                                            videoRowMarkup
                                                                                                                                                        }
                                                                                                                                                    </IndexTable>
                                                                                                                                                    {loadingExistingVideos && (
                                                                                                                                                        <div
                                                                                                                                                            style={{
                                                                                                                                                                display:
                                                                                                                                                                    "flex",
                                                                                                                                                                justifyContent:
                                                                                                                                                                    "center",
                                                                                                                                                                marginTop:
                                                                                                                                                                    "20px",
                                                                                                                                                            }}
                                                                                                                                                        >
                                                                                                                                                            <Spinner size="small" />
                                                                                                                                                        </div>
                                                                                                                                                    )}
                                                                                                                                                    <div
                                                                                                                                                        style={{
                                                                                                                                                            display:
                                                                                                                                                                "flex",
                                                                                                                                                            justifyContent:
                                                                                                                                                                "center",
                                                                                                                                                            marginTop:
                                                                                                                                                                "20px",
                                                                                                                                                        }}
                                                                                                                                                    >
                                                                                                                                                        <Pagination
                                                                                                                                                            hasPrevious={
                                                                                                                                                                currentVideosPage >
                                                                                                                                                                1
                                                                                                                                                            }
                                                                                                                                                            onPrevious={() =>
                                                                                                                                                                handleVideoPageChange(
                                                                                                                                                                    currentVideosPage -
                                                                                                                                                                    1
                                                                                                                                                                )
                                                                                                                                                            }
                                                                                                                                                            hasNext={
                                                                                                                                                                totalVideos >
                                                                                                                                                                currentVideosPage *
                                                                                                                                                                10
                                                                                                                                                            }
                                                                                                                                                            onNext={() =>
                                                                                                                                                                handleVideoPageChange(
                                                                                                                                                                    currentVideosPage +
                                                                                                                                                                    1
                                                                                                                                                                )
                                                                                                                                                            }
                                                                                                                                                            labels={{
                                                                                                                                                                next: "Next",
                                                                                                                                                                previous:
                                                                                                                                                                    "Previous",
                                                                                                                                                            }}
                                                                                                                                                        />
                                                                                                                                                    </div>
                                                                                                                                                </>
                                                                                                                                            )}

                                                                                                                                            {selectedVideoTab === 1 && (
                                                                                                                                                <>
                                                                                                                                                    <Box paddingInline="400" paddingBlock="300">
                                                                                                                                                        <BlockStack gap={300}>
                                                                                                                                                            <Text as="p">
                                                                                                                                                                {t("digtal_product_listing.video_description")}
                                                                                                                                                            </Text>
                                                                                                                                                            <BlockStack gap={100}>
                                                                                                                                                                <Text fontWeight="semibold" as="p">
                                                                                                                                                                    {t("digtal_product_listing.select_video_provider")}
                                                                                                                                                                </Text>
                                                                                                                                                                <Card>
                                                                                                                                                                    <BlockStack gap={200}>
                                                                                                                                                                        {!store?.setting?.vimeo_integration?.token_data && !store?.setting?.wistia_integration?.token_data ?
                                                                                                                                                                            <Banner status="warning">
                                                                                                                                                                                <p>
                                                                                                                                                                                    {t("digtal_product_listing.no_video_provider_connected")}
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
                                                                                                                                                                                            {t("digtal_product_listing.enable_vimeo_streaming")}
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
                                                                                                                                                                                            {t("digtal_product_listing.enable_wistia_streaming")}
                                                                                                                                                                                        </p>
                                                                                                                                                                                    </Banner>
                                                                                                                                                                                }
                                                                                                                                                                            </InlineStack>
                                                                                                                                                                        }
                                                                                                                                                                        <InlineStack gap={100}>
                                                                                                                                                                            <Text>
                                                                                                                                                                                {t("digtal_product_listing.connected_providers_info")}
                                                                                                                                                                            </Text>
                                                                                                                                                                            <Text fontWeight="semibold">
                                                                                                                                                                                {t("digtal_product_listing.settings_arrow")}
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
                                                                                                                                                                placeholder={loadingVideos ? t("digtal_product_listing.loading_videos") : t("digtal_product_listing.select_a_video")}
                                                                                                                                                            />
                                                                                                                                                        </BlockStack>
                                                                                                                                                    </Box>
                                                                                                                                                </>
                                                                                                                                            )}
                                                                                                                                        </Tabs>
                                                                                                                                    </Modal>
                                                                                                                                </Card>
                                                                                                                            </div>
                                                                        </div>
                                                                    </BlockStack>
                                                                </Card>
                                                           )}
                                                           <Card>
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
                                                                                   "createdigitalproduct.upgrade_to_paid_plan_to_enable_auto_fulfill"
                                                                               )}
                                                                           </Text>
                                                                           <div
                                                                               style={{ marginTop: "5px" }}
                                                                           ></div>
                                                                           <Button
                                                                               variant="primary"
                                                                               onClick={handlePricing}
                                                                           >
                                                                               {t(
                                                                                   "createdigitalproduct.upgrade_now"
                                                                               )}
                                                                           </Button>
                                                                       </Banner>
                                                                   </div>
                                                               )}
                                                               <div style={{ marginTop: "10px" }}></div>

                                                               <Text variant="headingMd" as="h6">
                                                                   {t(
                                                                       "createdigitalproduct.auto_fulfill_optional"
                                                                   )}
                                                               </Text>
                                                               <div style={{ marginTop: "10px" }}>
                                                                   <Checkbox
                                                                       checked={autoFulfill}
                                                                       label={t(
                                                                           "createdigitalproduct.auto_fulfill_this_product_on_shopify_orders"
                                                                       )}
                                                                       onChange={handleAutoFulfillCheckbox}
                                                                       disabled={userPlan === "free"}
                                                                   />
                                                                   <div style={{ marginLeft: 25 }}>
                                                                       <Text as={"p"} variant={"bodyMd"}>
                                                                           {t(
                                                                               "createdigitalproduct.automatically_fulfill_the"
                                                                           )}
                                                                       </Text>
                                                                   </div>
                                                               </div>
                                                           </Card>

                                                           <Card>
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
                                                                                   "createdigitalproduct.upgrade_to_paid_plan_to_add_samples_for_to_your_digital_product"
                                                                               )}
                                                                           </Text>
                                                                           <div
                                                                               style={{ marginTop: "5px" }}
                                                                           ></div>
                                                                           <Button
                                                                               variant="primary"
                                                                               onClick={handlePricing}
                                                                           >
                                                                               {t(
                                                                                   "createdigitalproduct.upgrade_now"
                                                                               )}
                                                                           </Button>
                                                                       </Banner>
                                                                   </div>
                                                               )}
                                                               <div style={{ marginTop: "10px" }}></div>

                                                               <Text variant="headingMd" as="h6">
                                                                  {t(
                                                                                   "createdigitalproduct.sample_files"
                                                                               )}
                                                               </Text>
                                                               <div style={{ marginTop: "10px" }}></div>

                                                                   <Banner>
                                                                       <p>
                                                                           {t(
                                                                               "editdigitalproduct.enable_sample_file_button_in_theme"
                                                                           )}
                                                                           <Link
                                                                               onClick={
                                                                                   handleEnableThemeExtension
                                                                               }
                                                                               style={{
                                                                                   cursor: "pointer",
                                                                               }}
                                                                           >
                                                                               {t(
                                                                                   "createdigitalproduct.click_here_to_enable_now"
                                                                               )}
                                                                           </Link>
                                                                       </p>
                                                                   </Banner>

                                                               <div style={{ marginTop: "10px" }}>
                                                                   <Text variant="bodySm" as="p">
                                                                       {t(
                                                                           "createdigitalproduct.provide_sample_files_to_give_your_customers_a_preview"
                                                                       )}
                                                                   </Text>
                                                               </div>
                                                               <div style={{ marginTop: "10px" }}>
                                                                   <DropZone
                                                                       label={t(
                                                                           "editdigitalproduct.drag_and_drop_your_files_5_files_max"
                                                                       )}
                                                                       onDrop={handleSampleDropZoneDrop}
                                                                       disabled={userPlan === "free"}
                                                                   >
                                                                     <DropZone.FileUpload actionTitle={t("createdigitalproduct.add_files")} />
                                                                   </DropZone>

                                                                   {sampleFiles.length > 0 && (
                                                                       <BlockStack gap="200">
                                                                           {sampleFiles.map(
                                                                               (sampleFile, index) => {
                                                                                   const exceedMaxSize =
                                                                                       sampleFile.size >
                                                                                       MAX_SAMPLE_FILE_BYTE;

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
                                                                                               onClick={() =>
                                                                                                   handleDeleteSampleFileAtIndex(
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
                                                                                                       sampleFile.name
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
                                                                                                       sampleFile.size
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

                                                                   {digitalProduct?.sample_files?.length >
                                                                       0 && (
                                                                       <BlockStack gap="200">
                                                                           {digitalProduct.sample_files.map(
                                                                               (sampleFile, index) => {
                                                                                   const exceedMaxSize =
                                                                                       sampleFile.file
                                                                                           .byteSize &&
                                                                                       sampleFile.file
                                                                                           .byteSize >
                                                                                           MAX_SAMPLE_FILE_BYTE;

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
                                                                                               onClick={() =>
                                                                                                   handleDeleteExistingSampleFileAtIndex(
                                                                                                       index
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
                                                                                                       sampleFile
                                                                                                           .file
                                                                                                           .fileName
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
                                                                                                       sampleFile
                                                                                                           .file
                                                                                                           .byteSize
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
                                                               </div>
                                                           </Card>
                                                       </BlockStack>
                        </div>

                        <div style={{ width: isMobile ? '100%' : '34%' }}>
                            <BlockStack gap="400">
                             <Card>
                                                                 <BlockStack gap="300">
                                                                     <Text variant="headingMd" as="h6">
                                                                         {t(
                                                                             "createdigitalproduct.digital_product_status"
                                                                         )}
                                                                     </Text>
                                                                     <Select
                                                                         options={options}
                                                                         onChange={handleSelectChange}
                                                                         value={selected}
                                                                     />
                                                                     <Text variant="bodyLg" as="h6">
                                                                         {t(
                                                                             "createdigitalproduct.select_shopify_product"
                                                                         )}
                                                                     </Text>
                                                                     <Text variant="bodyLg" as="h6">
                                                                         {t(
                                                                             "createdigitalproduct.add_files_license_custom_link"
                                                                         )}
                                                                     </Text>
                                                                     <Text variant="bodyLg" as="h6">
                                                                         {t(
                                                                             "createdigitalproduct.save_digital_product"
                                                                         )}
                                                                     </Text>
                                                                     <Text variant="bodyLg" as="h6">
                                                                         {t(
                                                                             "createdigitalproduct.begin_delivery"
                                                                         )}
                                                                     </Text>
                                                                 </BlockStack>
                                                             </Card>
                                                             <Card>
                                                                <BlockStack gap="200">
                                                                    <Text variant="headingMd" as="h6">
                                                                        {t("createdigitalproduct.manual_order_delivery")}
                                                                    </Text>
                                                                    <Checkbox
                                                                        checked={isManualDeliveryEnabled}
                                                                        label={t("createdigitalproduct.enable_manual_delivery")}
                                                                        onChange={handleManualDeliveryEnabledChange}
                                                                    />
                                                                    <div style={{ marginTop: "10px" }}>
                                                                        <Text variant="bodySm" as="p" color="subdued">
                                                                            {t("createdigitalproduct.manual_delivery_info_text")}
                                                                        </Text>
                                                                    </div>
                                                                </BlockStack>
                                                            </Card>

                                    <Card>
                                    {userPlan === "free" && (
                                        <div style={{ marginTop: "10px" }}>
                                            <Banner
                                                tone="warning"
                                                title={t(
                                                                                 "editdigitalproduct.upgrade_your_plan"
                                                                             )}
                                            >
                                                <Text variant="bodyMd" as="p">
                                                    {t("createdigitalproduct.upgrade_to_a_paid_plan_to_set_product_page_message")}

                                                </Text>
                                                <div
                                                    style={{ marginTop: "5px" }}
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
                                    <Text variant="headingMd" as="h6">
                                        {t("createdigitalproduct.email_template")}
                                    </Text>
                                    <div style={{ marginTop: "5px" }}></div>
                                    <BlockStack gap="300">
                                        <RadioButton
                                            label={t("createdigitalproduct.use_default_template")}
                                            id="use-default-template"
                                            name="template-type"
                                            checked={
                                                emailTemplateType === "default"
                                            }
                                            onChange={() =>
                                                setEmailTemplateType("default")
                                            }
                                            disabled={userPlan === "free"}
                                        />

                                        <RadioButton
                                            label={t("createdigitalproduct.use_custom_template")}
                                            id="use-custom-template"
                                            name="template-type"
                                            checked={emailTemplateType === "custom"}
                                            onChange={() => {
                                                setEmailTemplateType("custom");
                                                if (emailTemplates?.length > 0) {
                                                    setEmailTemplateId(
                                                        emailTemplates[0].id
                                                    );
                                                }
                                            }}
                                            disabled={userPlan === "free"}
                                        />

                                        <RadioButton
                                            label={t("createdigitalproduct.dynamic_template")}
                                            id="use-dynamic-template"
                                            name="template-type"
                                            checked={emailTemplateType === "dynamic"}
                                            onChange={() =>
                                                setEmailTemplateType("dynamic")
                                            }
                                            disabled={userPlan === "free"}
                                        />
                                    </BlockStack>

                                    {emailTemplateType === "dynamic" && (
                                        <div style={{ marginTop: "5px", marginLeft: "30px" }}>
                                            <Text variant="bodyMd" as="p" tone="subdued">
                                                {t("createdigitalproduct.dynamic_template_description")}
                                            </Text>
                                        </div>
                                    )}

                                        {emailTemplateType === "custom" && (
                                            <>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Select
                                                        options={emailTemplates?.map(
                                                            (temp) => ({
                                                                label: temp.title,
                                                                value: String(temp.id),
                                                            })
                                                        )}
                                                        onChange={handleEmailTemplateChange}
                                                        value={emailTemplateId}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                ></div>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => navigate('/EmailTemplates')}
                                                >
                                                    {t(
                                                        "settings.email_content.go_to_email_templates"
                                                    )}
                                                </Button>
                                            </>
                                        )}

                                    <div style={{ marginTop: "5px" }}></div>
                                    {/*{isProductMessageEnabled && (
                                    <BlockStack vertical>
                                        <TextField
                                            label="Message Content"
                                            value={productMessage}
                                            onChange={handleProductMessagehange}
                                            autoComplete="off"
                                            multiline={4}
                                            disabled={userPlan === 'free'}
                                        />
                                        <div style={{ marginTop: "10px" }}></div>
                                        <div>
                                            <Text variant="bodySm" as="p" color="subdued">
                                                Add a custom message to inform customers about what they will receive with their digital product. This message will appear on the product page.
                                            </Text>
                                            <Text variant="bodySm" as="p" color="subdued">
                                                Examples:
                                                <List type="bullet">
                                                    <List.Item>This is a digital product. You will receive files, links, or license keys after purchase.</List.Item>
                                                    <List.Item>Includes a free ebook with your purchase!</List.Item>
                                                    <List.Item>Digital delivery: You will receive your product via email.</List.Item>
                                                    <List.Item>After purchase, you will get instant access to downloadable files.</List.Item>
                                                </List>
                                            </Text>

                                        </div>
                                    </BlockStack>
                                )}*/}
                                </Card>

                                                             <div style={{ display: "none" }}>
                                                                 <Card>
                                                                     <BlockStack gap="300">
                                                                         <Text variant="headingMd" as="h6">
                                                                             {t("editdigitalproduct.tags")}
                                                                         </Text>
                                                                         <TextField
                                                                             value={tagInputValue}
                                                                             onChange={handleTagInputChange}
                                                                             onBlur={handleTagInputSubmit}
                                                                             autoComplete="off"
                                                                             placeholder={t(
                                                                                 "editdigitalproduct.course_software_bundle"
                                                                             )}
                                                                         />
                                                                         <LegacyStack spacing="tight">
                                                                             {tagMarkup}
                                                                         </LegacyStack>
                                                                     </BlockStack>
                                                                 </Card>
                                                             </div>

                                                             <Card>
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
                                                                                     "createdigitalproduct.upgrade_to_paid_plan_to_set_download_limits"
                                                                                 )}
                                                                             </Text>
                                                                             <div
                                                                                 style={{ marginTop: "5px" }}
                                                                             ></div>
                                                                             <Button
                                                                                 variant="primary"
                                                                                 onClick={handlePricing}
                                                                             >
                                                                                 {t(
                                                                                     "createdigitalproduct.upgrade_now"
                                                                                 )}
                                                                             </Button>
                                                                         </Banner>
                                                                     </div>
                                                                 )}
                                                                 <div style={{ marginTop: "10px" }}></div>
                                                                 <Text variant="headingMd" as="h6">
                                                                     {t(
                                                                         "createdigitalproduct.download_limits"
                                                                     )}
                                                                 </Text>
                                                                 <div style={{ marginTop: "10px" }}></div>
                                                                 <Checkbox
                                                                     checked={isDownloadLimitEnabled}
                                                                     label={t(
                                                                         "createdigitalproduct.limit_customer_download_access"
                                                                     )}
                                                                     onChange={
                                                                         handleDownloadLimitEnabledChange
                                                                     }
                                                                     disabled={userPlan === "free"}
                                                                 />
                                                                 {isDownloadLimitEnabled && (
                                                                     <>
                                                                         <div style={{ marginTop: "10px" }}>
                                                                             <TextField
                                                                                 label={t(
                                                                                     "createdigitalproduct.total_no_of_downloads_each_file"
                                                                                 )}
                                                                                 value={downloadLimit}
                                                                                 onChange={
                                                                                     handleDownloadLimitChange
                                                                                 }
                                                                                 autoComplete="off"
                                                                                 type="number"
                                                                                 disabled={
                                                                                     userPlan === "free"
                                                                                 }
                                                                                 id={inputId}
                                                                             />
                                                                         </div>
                                                                         <div style={{ marginTop: "10px" }}>
                                                                             <Text
                                                                                 variant="bodySm"
                                                                                 as="p"
                                                                                 color="subdued"
                                                                             >
                                                                                 {t(
                                                                                     "createdigitalproduct.control_how_many_times_each"
                                                                                 )}
                                                                             </Text>
                                                                         </div>
                                                                     </>
                                                                 )}
                                                             </Card>

                                 <Card>
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
                                                                                        "createdigitalproduct.upgrade_to_paid_plan_to_set_expiration_dates_for_downloads"
                                                                                    )}
                                                                                </Text>
                                                                                <div
                                                                                    style={{ marginTop: "5px" }}
                                                                                ></div>
                                                                                <Button
                                                                                    variant="primary"
                                                                                    onClick={handlePricing}
                                                                                >
                                                                                    {t(
                                                                                        "createdigitalproduct.upgrade_now"
                                                                                    )}
                                                                                </Button>
                                                                            </Banner>
                                                                        </div>
                                                                    )}
                                                                    <div style={{ marginTop: "10px" }}></div>
                                                                    <Text variant="headingMd" as="h6">
                                                                        {t(
                                                                            "createdigitalproduct.download_expiration"
                                                                        )}
                                                                    </Text>
                                                                    <div style={{ marginTop: "10px" }}></div>
                                                                    <Checkbox
                                                                        label={t(
                                                                            "createdigitalproduct.set_download_expiration"
                                                                        )}
                                                                        checked={isDownloadExpirationEnabled}
                                                                        onChange={
                                                                            handleDownloadExpirationEnabledChange
                                                                        }
                                                                        disabled={userPlan === "free"}
                                                                    />
                                                                    <div style={{ marginTop: "5px" }}></div>
                                                                    {isDownloadExpirationEnabled && (
                                                                        <LegacyStack vertical>
                                                                            <RadioButton
                                                                                label={t(
                                                                                    "createdigitalproduct.expire_after_days"
                                                                                )}
                                                                                id="expire-after-days"
                                                                                name="expiration"
                                                                                checked={
                                                                                    expirationType === "days"
                                                                                }
                                                                                onChange={() =>
                                                                                    setExpirationType("days")
                                                                                }
                                                                                disabled={userPlan === "free"}
                                                                            />
                                                                            {expirationType === "days" && (
                                                                                <TextField
                                                                                    label={t(
                                                                                        "createdigitalproduct.number_of_days"
                                                                                    )}
                                                                                    value={expirationDays}
                                                                                    onChange={
                                                                                        handleExpirationDaysChange
                                                                                    }
                                                                                    autoComplete="off"
                                                                                    type="number"
                                                                                    min="1"
                                                                                    step="1"
                                                                                    inputMode="numeric"
                                                                                    disabled={
                                                                                        userPlan === "free"
                                                                                    }
                                                                                    onWheel={(e) => e.currentTarget.blur()}
                                                                                />
                                                                            )}

                                                                            <RadioButton
                                                                                label={t(
                                                                                    "createdigitalproduct.expire_after_specific_date"
                                                                                )}
                                                                                id="expire-after-date"
                                                                                name="expiration"
                                                                                checked={
                                                                                    expirationType ===
                                                                                    "specific-date"
                                                                                }
                                                                                onChange={() =>
                                                                                    setExpirationType(
                                                                                        "specific-date"
                                                                                    )
                                                                                }
                                                                                disabled={userPlan === "free"}
                                                                            />
                                                                            {expirationType ===
                                                                                "specific-date" && (
                                                                                <BlockStack
                                                                                    inlineAlign="center"
                                                                                    gap="400"
                                                                                >
                                                                                    <Box
                                                                                        minWidth="276px"
                                                                                        padding={{ xs: 200 }}
                                                                                    >
                                                                                        <Popover
                                                                                            active={visible}
                                                                                            autofocusTarget="none"
                                                                                            preferredAlignment="left"
                                                                                            fullWidth
                                                                                            preferInputActivator={
                                                                                                false
                                                                                            }
                                                                                            preferredPosition="below"
                                                                                            preventCloseOnChildOverlayClick
                                                                                            onClose={
                                                                                                handleOnClose
                                                                                            }
                                                                                            activator={
                                                                                                <TextField
                                                                                                    role="combobox"
                                                                                                    label={t(
                                                                                                        "createdigitalproduct.expire_on"
                                                                                                    )}
                                                                                                    prefix={
                                                                                                        <Icon
                                                                                                            source={
                                                                                                                CalendarIcon
                                                                                                            }
                                                                                                        />
                                                                                                    }
                                                                                                    value={
                                                                                                        formattedValue
                                                                                                    }
                                                                                                    onFocus={() =>
                                                                                                        setVisible(
                                                                                                            true
                                                                                                        )
                                                                                                    }
                                                                                                    onChange={
                                                                                                        handleInputValueChange
                                                                                                    }
                                                                                                    autoComplete="off"
                                                                                                    disabled={
                                                                                                        userPlan ===
                                                                                                        "free"
                                                                                                    }
                                                                                                />
                                                                                            }
                                                                                        >
                                                                                            <Card
                                                                                                ref={
                                                                                                    datePickerRef
                                                                                                }
                                                                                            >
                                                                                                <DatePicker
                                                                                                    month={
                                                                                                        month
                                                                                                    }
                                                                                                    year={year}
                                                                                                    selected={
                                                                                                        selectedDate
                                                                                                    }
                                                                                                    onMonthChange={
                                                                                                        handleMonthChange
                                                                                                    }
                                                                                                    onChange={
                                                                                                        handleDateSelection
                                                                                                    }
                                                                                                    disabled={
                                                                                                        userPlan ===
                                                                                                        "free"
                                                                                                    }
                                                                                                />
                                                                                            </Card>
                                                                                        </Popover>
                                                                                    </Box>
                                                                                </BlockStack>
                                                                            )}
                                                                            <div style={{ marginTop: "10px" }}>
                                                                                <Text
                                                                                    variant="bodySm"
                                                                                    as="p"
                                                                                    color="subdued"
                                                                                >
                                                                                    {t(
                                                                                        "editdigitalproduct.define_expiration_description"
                                                                                    )}
                                                                                </Text>
                                                                            </div>
                                                                        </LegacyStack>
                                                                    )}
                                                                </Card>

                               <Card>
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
                                                                                   style={{ marginTop: "5px" }}
                                                                               ></div>
                                                                               <Button
                                                                                   variant="primary"
                                                                                   onClick={handlePricing}
                                                                               >
                                                                                   {t(
                                                                                       "createdigitalproduct.upgrade_now"
                                                                                   )}
                                                                               </Button>
                                                                           </Banner>
                                                                       </div>
                                                                   )}
                                                                   <div style={{ marginTop: "10px" }}></div>
                                                                   <Text variant="headingMd" as="h6">
                                                                       {t(
                                                                           "createdigitalproduct.pdf_stamping_settings"
                                                                       )}
                                                                   </Text>
                                                                   <div style={{ marginTop: "10px" }}></div>
                                                                   <Checkbox
                                                                       label={t(
                                                                           "createdigitalproduct.enable_pdf_stamping"
                                                                       )}
                                                                       checked={isPdfStampingEnabled}
                                                                       onChange={
                                                                           handlePdfStampingEnabledChange
                                                                       }
                                                                       disabled={userPlan === "free"}
                                                                   />
                                                                   <div style={{ marginTop: "5px" }}></div>
                                                                   {isPdfStampingEnabled && (
                                                                       <LegacyStack vertical>
                                                                           <RadioButton
                                                                               label={t(
                                                                                   "createdigitalproduct.use_default_template"
                                                                               )}
                                                                               id="default-template"
                                                                               name="template"
                                                                               checked={
                                                                                   templateChoice === "default"
                                                                               }
                                                                               onChange={() =>
                                                                                   handleTemplateChoiceChange(
                                                                                       "default"
                                                                                   )
                                                                               }
                                                                               disabled={userPlan === "free"}
                                                                           />
                                                                           <RadioButton
                                                                               label={t(
                                                                                   "createdigitalproduct.use_custom_template"
                                                                               )}
                                                                               id="custom-template"
                                                                               name="template"
                                                                               checked={
                                                                                   templateChoice === "custom"
                                                                               }
                                                                               onChange={() =>
                                                                                   handleTemplateChoiceChange(
                                                                                       "custom"
                                                                                   )
                                                                               }
                                                                               disabled={userPlan === "free"}
                                                                           />
                                                                           {templateChoice === "custom" && (
                                                                               <>
                                                                                   <div
                                                                                       style={{
                                                                                           marginTop: "10px",
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
                                                                                           marginTop: "10px",
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
                                                                           <div style={{ marginTop: "10px" }}>
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
                                                                       open={isPDFModalOpen}
                                                                       onClose={toggleCustomTemplateModal}
                                                                       title={t(
                                                                           "createdigitalproduct.pdf_stamping_template"
                                                                       )}
                                                                       primaryAction={{
                                                                           content: t(
                                                                               "createdigitalproduct.add"
                                                                           ),
                                                                           onAction: handleSaveTemplate,
                                                                           disabled:
                                                                               templateTitle.trim() === "" ||
                                                                               stampText.trim() === "",
                                                                       }}
                                                                       secondaryActions={[
                                                                           {
                                                                               content: isPreviewLoading ? t("createdigitalproduct.generating") : t("createdigitalproduct.preview"),
                                                                               onAction: handlePreviewTemplate,
                                                                               disabled: !previewFile || isPreviewLoading,
                                                                               loading: isPreviewLoading,
                                                                           },
                                                                           {
                                                                               content: t(
                                                                                   "digtal_product_listing.cancel"
                                                                               ),
                                                                               onAction:
                                                                                   toggleCustomTemplateModal,
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
                                                                                               value={textSize}
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
                                                                               style={{ marginTop: "10px" }}
                                                                           ></div>
                                                                           <LegacyStack
                                                                               wrap={false}
                                                                               alignment="leading"
                                                                               spacing="loose"
                                                                           >
                                                                               <LegacyStack.Item fill>
                                                                                   <FormLayout>
                                                                                       <FormLayout.Group
                                                                                           condensed
                                                                                       >
                                                                                           <Select
                                                                                               label="Alignment"
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
                                                                                               value={font}
                                                                                               onChange={
                                                                                                   setFont
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
                                                                               style={{ marginTop: "10px" }}
                                                                           ></div>
                                                                           <LegacyStack
                                                                               wrap={false}
                                                                               alignment="leading"
                                                                               spacing="loose"
                                                                           >
                                                                               <LegacyStack.Item fill>
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
                                                                                               onWheel={(e) => e.currentTarget.blur()}
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
                                                                               placeholder="Prepared exclusively for {order.receiver_email}. Order: {order.id}"
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
                                                                                   onChange={
                                                                                       setPasswordProtect
                                                                                   }
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
                                                                                   Preview Template
                                                                               </Text>
                                                                               <div style={{ marginTop: "5px" }}>
                                                                                   <input
                                                                                       type="file"
                                                                                       accept=".pdf"
                                                                                       onChange={handlePreviewFileChange}
                                                                                       style={{ display: 'none' }}
                                                                                       id="preview-pdf-input-edit"
                                                                                   />
                                                                                   <Button onClick={() => document.getElementById('preview-pdf-input-edit').click()}>
                                                                                       {t("settings.pdf_stamping_security.choose_pdf_for_preview")}
                                                                                   </Button>
                                                                                   {previewFile && (
                                                                                       <Text as="span" variant="bodySm" tone="subdued" style={{ marginLeft: '10px' }}>
                                                                                           {previewFile.name}
                                                                                       </Text>
                                                                                   )}
                                                                               </div>
                                                                               <div style={{ marginTop: "5px" }}>
                                                                                   <Text as="p" variant="bodySm" tone="subdued">
                                                                                       {t("settings.pdf_stamping_security.select_pdf_to_preview")}
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
                                                                                   "createdigitalproduct.below_are_the_available_stamping_variables"
                                                                               )}
                                                                           </Text>
                                                                           <div
                                                                               style={{ marginTop: "10px" }}
                                                                           ></div>
                                                                           <Text as="p" variant="bodyLg">
                                                                               <code
                                                                                   style={{ color: "#D5006D" }}
                                                                               >{`{order.receiver_name}`}</code>{" "}
                                                                               {t(
                                                                                   "createdigitalproduct.receiver_name_customer_name"
                                                                               )}
                                                                           </Text>
                                                                           <Text as="p" variant="bodyLg">
                                                                               <code
                                                                                   style={{ color: "#D5006D" }}
                                                                               >{`{order.receiver_email}`}</code>{" "}
                                                                               {t(
                                                                                   "createdigitalproduct.receiver_email_customer_email"
                                                                               )}
                                                                           </Text>
                                                                           <Text as="p" variant="bodyLg">
                                                                               <code
                                                                                   style={{ color: "#D5006D" }}
                                                                               >{`{order.id}`}</code>{" "}
                                                                               {t(
                                                                                   "createdigitalproduct.order_id_pdf"
                                                                               )}
                                                                           </Text>
                                                                           <Text as="p" variant="bodyLg">
                                                                               <code
                                                                                   style={{ color: "#D5006D" }}
                                                                               >{`{order.date}`}</code>{" "}
                                                                               {t(
                                                                                   "createdigitalproduct.order_date"
                                                                               )}
                                                                           </Text>
                                                                           <Text as="p" variant="bodyLg">
                                                                               <code
                                                                                   style={{ color: "#D5006D" }}
                                                                               >{`{product.name}`}</code>{" "}
                                                                               {t(
                                                                                   "createdigitalproduct.stamped_product_name"
                                                                               )}
                                                                           </Text>
                                                                       </Modal.Section>
                                                                   </Modal>
                                                               </Card>

                                                            <Card>
                                                                {userPlan === "free" && (
                                                                    <div style={{ marginTop: "10px" }}>
                                                                        <Banner
                                                                            tone="warning"
                                                                            title={t("editdigitalproduct.upgrade_your_plan")}
                                                                        >
                                                                            <Text variant="bodyMd" as="p">
                                                                                {t("createdigitalproduct.upgrade_to_paid_plan_to_enable_order_attribute_trigger")}
                                                                            </Text>
                                                                            <div
                                                                                style={{ marginTop: "5px" }}
                                                                            ></div>
                                                                            <Button
                                                                                variant="primary"
                                                                                onClick={() => navigate('/plans')}
                                                                            >
                                                                                {t("createdigitalproduct.upgrade_now")}
                                                                            </Button>
                                                                        </Banner>
                                                                    </div>
                                                                )}
                                                                <BlockStack gap="200">
                                                                    <Text variant="headingMd" as="h6">
                                                                        {t("createdigitalproduct.order_attribute_trigger_delivery")}
                                                                    </Text>
                                                                    <Checkbox
                                                                        checked={isOrderAttributeTriggerEnabled}
                                                                        label={t("createdigitalproduct.enable_order_attribute_trigger")}
                                                                        onChange={handleOrderAttributeTriggerEnabledChange}
                                                                        disabled={userPlan === "free"}
                                                                    />
                                                                    {isOrderAttributeTriggerEnabled && userPlan !== "free" && (
                                                                        <BlockStack gap="200">
                                                                            <TextField
                                                                                label={t("createdigitalproduct.attribute_name")}
                                                                                value={orderAttributeName}
                                                                                onChange={setOrderAttributeName}
                                                                                placeholder={t("createdigitalproduct.attribute_name_placeholder")}
                                                                                autoComplete="off"
                                                                            />
                                                                            <div style={{ marginTop: "-5px" }}>
                                                                                <Text variant="bodySm" as="p" color="subdued">
                                                                                    {t("createdigitalproduct.attribute_name_help_text")}
                                                                                </Text>
                                                                            </div>
                                                                            <TextField
                                                                                label={t("createdigitalproduct.attribute_value")}
                                                                                value={orderAttributeValue}
                                                                                onChange={setOrderAttributeValue}
                                                                                placeholder={t("createdigitalproduct.attribute_value_placeholder")}
                                                                                autoComplete="off"
                                                                            />
                                                                            <div style={{ marginTop: "-5px" }}>
                                                                                <Text variant="bodySm" as="p" color="subdued">
                                                                                    {t("createdigitalproduct.attribute_value_help_text")}
                                                                                </Text>
                                                                            </div>
                                                                            <div style={{ marginTop: "10px" }}>
                                                                                <Checkbox
                                                                                    checked={isGlobalOrderAttributeTrigger}
                                                                                    label={t("createdigitalproduct.global_trigger")}
                                                                                    onChange={handleGlobalOrderAttributeTriggerChange}
                                                                                />
                                                                                <div style={{ marginTop: "5px" }}>
                                                                                    <Text variant="bodySm" as="p" color="subdued">
                                                                                        {t("createdigitalproduct.global_trigger_help_text")}
                                                                                    </Text>
                                                                                </div>
                                                                            </div>
                                                                        </BlockStack>
                                                                    )}
                                                                    <div style={{ marginTop: "10px" }}>
                                                                        <Text variant="bodySm" as="p" color="subdued">
                                                                            {t("createdigitalproduct.order_attribute_trigger_info_text")}
                                                                        </Text>
                                                                    </div>
                                                                </BlockStack>
                                                            </Card>

                                <Card>
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
                                                                                       "createdigitalproduct.upgrade_to_paid_plan_to_set_product_page_message"
                                                                                   )}
                                                                               </Text>
                                                                               <div
                                                                                   style={{ marginTop: "5px" }}
                                                                               ></div>
                                                                               <Button
                                                                                   variant="primary"
                                                                                   onClick={handlePricing}
                                                                               >
                                                                                   {t(
                                                                                       "createdigitalproduct.upgrade_now"
                                                                                   )}
                                                                               </Button>
                                                                           </Banner>
                                                                       </div>
                                                                   )}
                                                                   <div style={{ marginTop: "10px" }}></div>
                                                                   <Text variant="headingMd" as="h6">
                                                                       {t(
                                                                           "createdigitalproduct.product_page_message"
                                                                       )}
                                                                   </Text>
                                                                   <div style={{ marginTop: "5px" }}></div>
                                                                   <Checkbox
                                                                       label={t(
                                                                           "createdigitalproduct.show_a_custom_message"
                                                                       )}
                                                                       checked={isProductMessageEnabled}
                                                                       onChange={
                                                                           handleProductMessageEnabledChange
                                                                       }
                                                                       disabled={userPlan === "free"}
                                                                   />
                                                                   <div style={{ marginTop: "5px" }}></div>
                                                                   {isProductMessageEnabled && (
                                                                       <BlockStack vertical>
                                                                           <TextField
                                                                               label={t(
                                                                                   "createdigitalproduct.message_content"
                                                                               )}
                                                                               value={productMessage}
                                                                               onChange={
                                                                                   handleProductMessagehange
                                                                               }
                                                                               autoComplete="off"
                                                                               multiline={4}
                                                                               disabled={userPlan === "free"}
                                                                           />
                                                                           <div
                                                                               style={{ marginTop: "10px" }}
                                                                           ></div>
                                                                           <div>
                                                                               <Text
                                                                                   variant="bodySm"
                                                                                   as="p"
                                                                                   color="subdued"
                                                                               >
                                                                                   {t(
                                                                                       "createdigitalproduct.add_a_custom_message"
                                                                                   )}
                                                                               </Text>
                                                                               <Text
                                                                                   variant="bodySm"
                                                                                   as="p"
                                                                                   color="subdued"
                                                                               >
                                                                                   {t(
                                                                                       "createdigitalproduct.examples"
                                                                                   )}
                                                                                   <List type="bullet">
                                                                                       <List.Item>
                                                                                           {t(
                                                                                               "createdigitalproduct.this_is_a_digital_product"
                                                                                           )}
                                                                                       </List.Item>
                                                                                       <List.Item>
                                                                                           {t(
                                                                                               "createdigitalproduct.includes_a_free_ebook_with_your_purchase"
                                                                                           )}
                                                                                       </List.Item>
                                                                                       <List.Item>
                                                                                           {t(
                                                                                               "createdigitalproduct.digital_delivery"
                                                                                           )}
                                                                                       </List.Item>
                                                                                       <List.Item>
                                                                                           {t(
                                                                                               "createdigitalproduct.after_purchase_you_will_get_instant_access"
                                                                                           )}
                                                                                       </List.Item>
                                                                                   </List>
                                                                               </Text>
                                                                           </div>
                                                                       </BlockStack>
                                                                   )}
                                                               </Card>

                            </BlockStack>
                        </div>
                    </div>

                    <div style={{ marginTop: isMobile ? "20px" : "0px" }}></div>


                        <EmailPreviewModal
                            isOpen={isEmailPreviewModalOpen}
                            onClose={() => setIsEmailPreviewModalOpen(false)}
                            productId={digitalProduct.id}
                            productName={digitalProduct.associatedProduct?.title}
                            authenticatedFetch={fetch}
                        />
                        <div style={{ paddingBottom: "10px" }}></div>
                    </Page>

            </>
            )}
        </>
    );
};

export default EditDigitalProduct;
