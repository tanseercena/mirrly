import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useContext,
} from "react";
import {
    Page,
    Layout,
    Card,
    Banner,
    TextField,
    List,
    RadioButton,
    Badge,
    Button,
    Frame,
    Spinner,
    Text,
    Checkbox,
    InlineStack,
        SkeletonPage,
    SkeletonBodyText,
    BlockStack,
    Thumbnail,
    InlineGrid,
    Divider,
    Box,
    Collapsible,
    Toast
} from "@shopify/polaris";
import { useLocation, useNavigate } from "react-router-dom";
import EmailEditor from "react-email-editor";
import { useAppBridge, SaveBar } from "@shopify/app-bridge-react";
import { AppContext } from "../components/providers/AppProvider";
import { Knob } from "../components/Knob";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LanguageSelector from "../components/LanguageSelector";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ClipboardIcon,
} from "@shopify/polaris-icons";

const WarningIcon = () => (
    <svg
        width="20"
        height="20"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 500 500"
        xmlSpace="preserve"
        fill="#000000"
    >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
            <style type="text/css">
                {`.st0{fill:#FFFFFF;stroke:#FFFFFF;stroke-width:10;stroke-miterlimit:10;}
          .st1{fill:#808080;}
          .st2{fill:#F25238;}
          .st3{fill:#BF321B;}
          .st4{fill:#FFA99C;}`}
            </style>
            <g id="border">
                <path
                    className="st0"
                    d="M411.8,374.9h-7.4V192.7h0C403,118.5,334.4,58.7,250,58.7S97,118.5,95.7,192.7h0v182.2h-7.4l-7,66.4h337.7 L411.8,374.9z"
                ></path>
            </g>
            <g
                id="object"
                xmlnsCc="http://creativecommons.org/ns#"
                xmlnsDc="http://purl.org/dc/elements/1.1/"
                xmlnsInkscape="http://www.inkscape.org/namespaces/inkscape"
                xmlnsRdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlnsSodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                xmlnsSvg="http://www.w3.org/2000/svg"
            >
                <g>
                    <polygon
                        className="st1"
                        points="418.9,441.3 81.1,441.3 88.2,374.9 411.8,374.9 "
                    ></polygon>
                    <path
                        className="st2"
                        d="M404.3,192.7C403,118.5,334.4,58.7,250,58.7S97,118.5,95.7,192.7h0v182.2h308.8L404.3,192.7L404.3,192.7z"
                    ></path>
                    <path
                        className="st3"
                        d="M362.6,222.9c-1-61.9-51-111.9-112.6-111.9S138.4,161,137.4,222.9h0v152h225.2L362.6,222.9L362.6,222.9z"
                    ></path>
                    <path
                        className="st4"
                        d="M319.2,354.6h15.1c4.7,0,8.5-3.8,8.5-8.5V215.9c0-4.7-3.8-8.5-8.5-8.5h-15.1c-4.7,0-8.5,3.8-8.5,8.5v130.2 C310.7,350.8,314.5,354.6,319.2,354.6z"
                    ></path>
                </g>
            </g>
        </g>
    </svg>
);

function AddTemplate() {
    const shopify = useAppBridge();
    const { store, refetchStore } = useContext(AppContext);
        const location = useLocation();
    const navigate = useNavigate();
    const emailEditorRef = useRef(null);

    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [existingUnlayerJson, setExistingUnlayerJson] = useState(null);
    const [isErrorToast, setIsErrorToast] = useState(false);
    const [isLoadingEmailTemplate, setIsLoadingEmailTemplate] = useState(true);
    const [subject, setSubject] = useState("");
    const [status, setStatus] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [updatedEmailSubject, setUpdatedEmailSubject] = useState();
    const [enableCustomLinkButton, setEnableCustomLinkButton] = useState(false);
    const [customLinkButtonText, setCustomLinkButtonText] = useState("");
    const [linkDetected, setLinkDetected] = useState(false);
    const [defaultUnlayerJson, setDefaultUnlayerJson] = useState({});
    const [fromEmail, setFromEmail] = useState("");
    const [sendTextEmailOnly, setSendTextEmailOnly] = useState(false);
    const [showFiles, setShowFiles] = useState(true);
    const [showCustomLinks, setShowCustomLinks] = useState(true);
    const [showLicenseKeys, setShowLicenseKeys] = useState(true);
    const [showProductQty, setShowProductQty] = useState(false);
    const { t } = useTranslation();
    const [downloadButtonText, setDownloadButtonText] = useState(
        t("email_templates.download")
    );
    const [title, setTitle] = useState("Untitled Template");
    const [productNameColor, setProductNameColor] = useState("");
    const [expandedTags, setExpandedTags] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [templateUsedFor, setTemplateUsedFor] = useState("general");
    const [selectedTemplate, setSelectedTemplate] = useState(
        location?.state?.selectedTemplate || "clean-minimal"
    );

    // SaveBar state
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [isInitialDataCaptured, setIsInitialDataCaptured] = useState(false);
    const [editorContent, setEditorContent] = useState("");

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Function to capture current data state including email editor content
    const captureCurrentData = useCallback(() => {
        const unlayer = emailEditorRef.current?.editor;
        const currentEditorContent = unlayer ? JSON.stringify(unlayer.design) : "";

        return {
            title: title || "Untitled Template",
            subject: subject || "",
            fromEmail: fromEmail || "",
            updatedEmailSubject: updatedEmailSubject || "",
            enableCustomLinkButton: enableCustomLinkButton || false,
            customLinkButtonText: customLinkButtonText || "",
            downloadButtonText: downloadButtonText || t("email_templates.download"),
            productNameColor: productNameColor || "",
            sendTextEmailOnly: sendTextEmailOnly || false,
            showFiles: showFiles || false,
            showCustomLinks: showCustomLinks || false,
            showLicenseKeys: showLicenseKeys || false,
            showProductQty: showProductQty || false,
            templateUsedFor: templateUsedFor || "general",
            editorContent: currentEditorContent,
        };
    }, [
        title,
        subject,
        fromEmail,
        updatedEmailSubject,
        enableCustomLinkButton,
        customLinkButtonText,
        downloadButtonText,
        productNameColor,
        sendTextEmailOnly,
        showFiles,
        showCustomLinks,
        showLicenseKeys,
        showProductQty,
        templateUsedFor,
    ]);

    // Function to check if data has changed
    const hasDataChanged = useCallback(() => {
        const currentData = captureCurrentData();
        return JSON.stringify(currentData) !== JSON.stringify(initialData);
    }, [captureCurrentData, initialData]);

    // Function to handle discard changes
    const handleDiscardChanges = useCallback(() => {
        setTitle(initialData.title || "Untitled Template");
        setSubject(initialData.subject || "");
        setFromEmail(initialData.fromEmail || "");
        setUpdatedEmailSubject(initialData.updatedEmailSubject || "");
        setEnableCustomLinkButton(initialData.enableCustomLinkButton || false);
        setCustomLinkButtonText(initialData.customLinkButtonText || "");
        setDownloadButtonText(initialData.downloadButtonText || t("email_templates.download"));
        setProductNameColor(initialData.productNameColor || "");
        setSendTextEmailOnly(initialData.sendTextEmailOnly || false);
        setShowFiles(initialData.showFiles || false);
        setShowCustomLinks(initialData.showCustomLinks || false);
        setShowLicenseKeys(initialData.showLicenseKeys || false);
        setShowProductQty(initialData.showProductQty || false);
        setTemplateUsedFor(initialData.templateUsedFor || "general");

        // Reset editor content if available
        if (initialData.editorContent && emailEditorRef.current?.editor) {
            try {
                const design = JSON.parse(initialData.editorContent);
                emailEditorRef.current.editor.loadDesign(design);
            } catch (error) {
                console.error("Error resetting editor content:", error);
            }
        }

        setHasUnsavedChanges(false);
        shopify.saveBar.hide('add-template-savebar');
    }, [initialData, shopify, t]);

    // Check if form is valid for SaveBar visibility (same as primaryAction disabled condition)
    const isFormValid = title && subject && downloadButtonText && (!enableCustomLinkButton || customLinkButtonText);

    // Function to get current editor content
    const getCurrentEditorContent = useCallback(() => {
        const unlayer = emailEditorRef.current?.editor;
        return unlayer ? JSON.stringify(unlayer.design) : "";
    }, []);

    // Effect to show SaveBar based on form validity (always show when form is valid)
    useEffect(() => {
        if (isInitialDataCaptured) {
            const currentEditorContent = getCurrentEditorContent();
            const editorChanged = currentEditorContent !== (initialData.editorContent || "");
            const formDataChanged = hasDataChanged();
            const changed = editorChanged || formDataChanged;

            setHasUnsavedChanges(changed);

            // Always show SaveBar when form is valid, regardless of changes
            if (isFormValid) {
                shopify.saveBar.show('add-template-savebar');
            } else {
                shopify.saveBar.hide('add-template-savebar');
            }
        }
    }, [hasDataChanged, getCurrentEditorContent, isInitialDataCaptured, isFormValid, initialData.editorContent, shopify]);

    // Set initial data after component loads
    useEffect(() => {
        if (!isLoadingEmailTemplate && !isInitialDataCaptured) {
            const initial = captureCurrentData();
            setInitialData(initial);
            setIsInitialDataCaptured(true);
        }
    }, [isLoadingEmailTemplate, captureCurrentData, isInitialDataCaptured]);

    const mergeTagsData = [
        {
            tag: '{{single_file_download_link}}',
            title: t("email_templates.single_download_file_link"),
            description: t("email_templates.single_download_file_link_description"),
            category: t("email_templates.digital_products"),
            example: t("email_templates.single_download_file_link_example")
        },
        {
            tag: "{{download_links}}",
            title: t("email_templates.file_download_links"),
            description: t("email_templates.files_download_links_des"),
            category: t("email_templates.digital_products"),
            example: t("email_templates.file_download_links_example"),
        },
        {
            tag: "{{single_video_download_link}}",
            title: t("email_templates.single_video_download_link"),
            description: t("email_templates.single_video_download_link_des"),
            category: t("email_templates.digital_products"),
            example: t("email_templates.single_video_download_link_example"),
        },
        {
            tag: "{{videos_links}}",
            title: t("email_templates.videos_download_links"),
            description: t("email_templates.videos_download_links_des"),
            category: t("email_templates.digital_products"),
            example: t("email_templates.videos_download_links_example"),
        },
        {
            tag: "{{license_keys}}",
            title: t("email_templates.license_key_code"),
            description: t("email_templates.license_key_code_des"),
            category: t("email_templates.license_management"),
            example: t("email_templates.license_key_code_example"),
        },
        {
            tag: "{{custom_links}}",
            title: t("email_templates.custom_links"),
            description: t("email_templates.custom_links_des"),
            category: t("email_templates.custom_link"),
            example: t("email_templates.custom_links_example"),
        },
        {
            tag: "{{download_page_button}}",
            title: t("email_templates.download_page_button"),
            description: t("email_templates.download_page_button_des"),
            category: t("email_templates.navigation"),
            example: t("email_templates.download_page_button_example"),
        },
        {
            tag: "{{first_name}}",
            title: t("email_templates.customer_first_name"),
            description: t("email_templates.customer_first_name_des"),
            category: t("email_templates.customer_info"),
            example: t("email_templates.customer_first_name_example"),
        },
        {
            tag: "{{last_name}}",
            title: t("email_templates.customer_last_name"),
            description: t("email_templates.customer_last_name_des"),
            category: t("email_templates.customer_info"),
            example: t("email_templates.customer_last_name_example"),
        },
        {
            tag: "{{order_name}}",
            title: t("email_templates.order_id"),
            description: t("email_templates.order_id_des"),
            category: t("email_templates.order_info"),
            example: t("email_templates.order_info_example"),
        },
        {
            tag: "{{single_license_key}}",
            title: t("email_templates.multiline_keys_codes"),
            description: t("email_templates.multiline_keys_codes_des"),
            category: t("email_templates.license_management"),
            example: t("email_templates.license_management_example"),
        },
        {
            tag: "{{one_key_code}}",
            title: t("email_templates.single_key_code_only"),
            description: t("email_templates.single_key_code_only_des"),
            category: t("email_templates.license_management"),
            example: t("email_templates.single_key_code_only_example"),
        },
        {
            tag: '{{first_product_name}}',
            title: t("email_templates.product_name"),
            description: t("email_templates.first_product_name_description"),
            category: t("email_templates.product_info"),
            example: t("email_templates.first_product_name_example")
        },
        {
            tag: '{{first_product_price}}',
            title: t("email_templates.product_price"),
            description: t("email_templates.first_product_price_description"),
            category: t("email_templates.product_info"),
            example: t("email_templates.first_product_price_example")
        },
        {
            tag: '{{first_product_image}}',
            title: t("email_templates.product_image"),
            description: t("email_templates.first_product_image_description"),
            category: t("email_templates.product_info"),
            example: t("email_templates.first_product_image_example")
        },
        {
            tag: '{{qr_code}}',
            title: t("email_templates.display_qr_code"),
            description: t("email_templates.qr_code_description"),
            category: t("email_templates.license_management"),
            example: t("email_templates.qr_code_example")
        },
        {
            tag: '{{order.PROPERTY_REPLACE_HERE}}',
            title: t("email_templates.dynamic_order_property"),
            description: t("email_templates.dynamic_order_property_description"),
            category: t("email_templates.order_info"),
            example: t("email_templates.dynamic_order_property_example")
        }
    ];

    const toggleExpanded = (index) => {
        setExpandedTags((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setToastMessage(t("email_templates.merge_tag_copied") || "Merge tag copied to clipboard");
            setIsErrorToast(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }).catch((err) => {
            console.error("Failed to copy:", err);
            setToastMessage(t("email_templates.failed_to_copy") || "Failed to copy");
            setIsErrorToast(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        });
    };

    // const getCategoryColor = (category) => {
    //     const colors = {
    //         t("email_templates.digital_products"): 'success',
    //         t("email_templates.license_management"): 'info',
    //         t("email_templates.custom_link"): 'warning',
    //         t("email_templates.navigation"): 'critical',
    //         t("email_templates.customer_info"): 'attention',
    //         t("email_templates.order_info"): 'subdued'
    //     };
    //     return colors[category] || 'subdued';
    // };
    const getCategoryColor = (category) => {
        const colors = {
            [t("email_templates.digital_products")]: "success",
            [t("email_templates.license_management")]: "info",
            [t("email_templates.custom_link")]: "warning",
            [t("email_templates.navigation")]: "magic",
            [t("email_templates.customer_info")]: "attention",
            [t("email_templates.order_info")]: "subdued",
        };
        return colors[category] || "subdued";
    };

    const apiEndpoint = process.env.SHOPIFY_API_KEY?.endsWith("fb15d")
        ? "https://digitally.test"
        : "https://digitally.conversionproplus.com";

    const cleanMinimal = {
        counters: {
            u_row: 6,
            u_column: 6,
            u_content_image: 1,
            u_content_heading: 1,
            u_content_text: 8,
            u_content_button: 1,
            u_content_divider: 4,
        },
        body: {
            rows: [
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "image",
                                    values: {
                                        containerPadding: "40px 20px",
                                        src: {
                                            url:
                                                apiEndpoint +
                                                "/images/logoipsum-temp1.svg",
                                            width: 150,
                                            height: 60,
                                        },
                                        textAlign: "center",
                                        altText: "Company Logo",
                                        action: {
                                            name: "web",
                                            values: {
                                                href: "",
                                                target: "_blank",
                                            },
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_image_1",
                                            htmlClassNames: "u_content_image",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "heading",
                                    values: {
                                        containerPadding: "0px",
                                        headingType: "h1",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "26px",
                                        textAlign: "center",
                                        lineHeight: "140%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_heading_1",
                                            htmlClassNames: "u_content_heading",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "Your order is ready",
                                        color: "#333333",
                                        fontWeight: 300,
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "",
                                padding: "0px",
                                border: {},
                                borderRadius: "0px",
                                _meta: {
                                    htmlID: "u_column_1",
                                    htmlClassNames: "u_column",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "#ffffff",
                        columnsBackgroundColor: "#ffffff",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        hideMobile: false,
                        noStackMobile: false,
                        _meta: {
                            htmlID: "u_row_1",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "20px",
                                        textAlign: "center",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "16px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_1",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p style="margin: 0px;">Order: <strong>{{order_name}}</strong></p>\n<p style="margin: 10px 0px 0px;">Customer: <strong>{{first_name}} {{last_name}}</strong></p>',
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "#f5f5f5",
                                padding: "20px",
                                border: {},
                                borderRadius: "6px",
                                _meta: {
                                    htmlID: "u_column_2",
                                    htmlClassNames: "u_column",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        hideMobile: false,
                        noStackMobile: false,
                        _meta: {
                            htmlID: "u_row_2",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 20px 20px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "16px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_2",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "<p>Hello {{first_name}},</p>\n<p>Thank you for your purchase. Your digital products are ready and available below.</p>",
                                    },
                                },
                                {
                                    type: "button",
                                    values: {
                                        containerPadding: "0px 20px 40px",
                                        href: {
                                            name: "web",
                                            values: {
                                                href: "",
                                                target: "_blank",
                                            },
                                        },
                                        buttonColors: {
                                            color: "#FFFFFF",
                                            backgroundColor: "#5d87ff",
                                            hoverColor: "#FFFFFF",
                                            hoverBackgroundColor: "#3e73ff",
                                        },
                                        size: {
                                            autoWidth: false,
                                            width: "100%",
                                        },
                                        fontSize: "16px",
                                        textAlign: "center",
                                        lineHeight: "120%",
                                        padding: "12px 25px",
                                        border: {},
                                        borderRadius: "4px",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_button_1",
                                            htmlClassNames: "u_content_button",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{download_page_button}}",
                                        calculatedWidth: 149,
                                        calculatedHeight: 42,
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 20px 15px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "18px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "filesCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="margin: 0px; line-height: 160%; font-weight: 500;">Files</h2>',
                                    },
                                },
                                {
                                    type: "divider",
                                    values: {
                                        containerPadding: "0px 20px",
                                        width: "100%",
                                        border: {
                                            borderTopWidth: "1px",
                                            borderTopStyle: "solid",
                                            borderTopColor: "#EEEEEE",
                                        },
                                        textAlign: "center",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "files_divider",
                                            htmlClassNames: "u_content_divider",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "15px 20px 30px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "14px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_4",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{download_links}}",
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 20px 15px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "18px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "licenseCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="margin: 0px; line-height: 160%; font-weight: 500;">License Keys</h2>',
                                    },
                                },
                                {
                                    type: "divider",
                                    values: {
                                        containerPadding: "0px 20px",
                                        width: "100%",
                                        border: {
                                            borderTopWidth: "1px",
                                            borderTopStyle: "solid",
                                            borderTopColor: "#EEEEEE",
                                        },
                                        textAlign: "center",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "license_divider",
                                            htmlClassNames: "u_content_divider",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "15px 20px 30px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "14px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_6",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{license_keys}}",
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 20px 15px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "18px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "linksCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="margin: 0px; line-height: 160%; font-weight: 500;">Custom Links</h2>',
                                    },
                                },
                                {
                                    type: "divider",
                                    values: {
                                        containerPadding: "0px 20px",
                                        width: "100%",
                                        border: {
                                            borderTopWidth: "1px",
                                            borderTopStyle: "solid",
                                            borderTopColor: "#EEEEEE",
                                        },
                                        textAlign: "center",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "link_divider",
                                            htmlClassNames: "u_content_divider",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "15px 20px 30px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "14px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_8",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{custom_links}}",
                                    },
                                },
                                {
                                    type: "divider",
                                    values: {
                                        containerPadding: "0px 20px",
                                        width: "100%",
                                        border: {
                                            borderTopWidth: "1px",
                                            borderTopStyle: "solid",
                                            borderTopColor: "#EEEEEE",
                                        },
                                        textAlign: "center",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_divider_4",
                                            htmlClassNames: "u_content_divider",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "",
                                padding: "30px 0px",
                                border: {},
                                borderRadius: "0px",
                                _meta: {
                                    htmlID: "u_column_3",
                                    htmlClassNames: "u_column",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        hideMobile: false,
                        noStackMobile: false,
                        _meta: {
                            htmlID: "u_row_3",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "30px 20px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "14px",
                                        color: "#333333",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_9",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p>If you have any questions about your purchase, please contact our support team.</p>\n<p style="margin-bottom: 0px;">Regards,<br>[Your Company Name]</p>',
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "",
                                padding: "0px",
                                border: {},
                                borderRadius: "0px",
                                _meta: {
                                    htmlID: "u_column_4",
                                    htmlClassNames: "u_column",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        hideMobile: false,
                        noStackMobile: false,
                        _meta: {
                            htmlID: "u_row_4",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "30px 20px",
                                        textAlign: "center",
                                        fontFamily: {
                                            label: "Inter",
                                            value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "12px",
                                        color: "#777777",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_10",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "<p>&copy; 2025 [Your Company Name]</p>\n<p>This email was sent to you because you made a purchase on [Your Website].</p>",
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "",
                                padding: "0px",
                                border: {},
                                borderRadius: "0px",
                                _meta: {
                                    htmlID: "u_column_5",
                                    htmlClassNames: "u_column",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "#f5f5f5",
                        columnsBackgroundColor: "#f5f5f5",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        hideMobile: false,
                        noStackMobile: false,
                        _meta: {
                            htmlID: "u_row_5",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
            ],
            values: {
                textColor: "#333333",
                backgroundColor: "#ffffff",
                backgroundImage: {
                    url: "",
                    fullWidth: true,
                    repeat: "no-repeat",
                    size: "custom",
                    position: "center",
                },
                contentWidth: "600px",
                contentAlign: "center",
                fontFamily: {
                    label: "Inter",
                    value: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
                },
                preheaderText: "",
                linkStyle: {
                    body: true,
                    linkColor: "#0000ee",
                    linkHoverColor: "#0000ee",
                    linkUnderline: true,
                    linkHoverUnderline: true,
                },
                _meta: {
                    htmlID: "u_body",
                    htmlClassNames: "u_body",
                },
            },
        },
        schemaVersion: 16,
    };

    const modernBlue = {
        counters: {
            u_row: 5,
            u_column: 5,
            u_content_image: 1,
            u_content_heading: 1,
            u_content_text: 10,
            u_content_button: 1,
            u_content_divider: 3,
        },
        body: {
            rows: [
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "image",
                                    values: {
                                        containerPadding: "30px",
                                        src: {
                                            url:
                                                apiEndpoint +
                                                "/images/logoipsum-temp1.svg",
                                            width: 140,
                                            height: 60,
                                        },
                                        textAlign: "center",
                                        altText: "Company Logo",
                                        action: {
                                            name: "web",
                                            values: {
                                                href: "",
                                                target: "_blank",
                                            },
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_image_1",
                                            htmlClassNames: "u_content_image",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "heading",
                                    values: {
                                        containerPadding: "10px",
                                        headingType: "h1",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                        fontSize: "26px",
                                        textAlign: "center",
                                        lineHeight: "140%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_heading_1",
                                            htmlClassNames: "u_content_heading",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "Your Digital Purchase Is Ready",
                                        color: "#ffffff",
                                        fontWeight: 300,
                                        letterSpacing: "1px",
                                    },
                                },
                            ],
                            values: {
                                _meta: {
                                    htmlID: "u_column_1",
                                    htmlClassNames: "u_column",
                                },
                                border: {},
                                padding: "0px",
                                backgroundColor: "#2c5282",
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        _meta: {
                            htmlID: "u_row_1",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_1",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p style="font-size: 18px; margin-bottom: 25px;">Hi {{first_name}} {{last_name}},</p>\n<p>Thanks for your order <strong>{{order_name}}</strong>. Your digital products are ready for download!</p>',
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "button",
                                    values: {
                                        containerPadding: "25px 0px",
                                        href: {
                                            name: "web",
                                            values: {
                                                href: "",
                                                target: "_blank",
                                            },
                                        },
                                        buttonColors: {
                                            color: "#FFFFFF",
                                            backgroundColor: "#2c5282",
                                            hoverColor: "#FFFFFF",
                                            hoverBackgroundColor: "#3e4a89",
                                        },
                                        size: {
                                            autoWidth: true,
                                            width: "100%",
                                        },
                                        textAlign: "center",
                                        lineHeight: "120%",
                                        padding: "12px 22px",
                                        border: {},
                                        borderRadius: "4px",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_button_1",
                                            htmlClassNames: "u_content_button",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<span style="font-size: 14px; line-height: 16.8px;">{{download_page_button}}</span>',
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                        fontWeight: "bold",
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_2",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 6px; margin: 10px 0 30px 0;">\n  <tr>\n    <td style="padding: 20px;">\n      <p style="font-size: 16px; margin: 0 0 15px 0; color: #2c5282;"><strong>Order Summary</strong></p>\n      <p style="margin: 5px 0; font-size: 15px;">Order: <strong>{{order_name}}</strong></p>\n      <p style="margin: 5px 0; font-size: 15px;">Customer: <strong>{{first_name}} {{last_name}}</strong></p>\n    </td>\n  </tr>\n</table>',
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "filesCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2  style="color: #2c5282; font-size: 20px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">Files</h2>',
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 20px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "files_divider",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{download_links}}",
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "licenseCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2  style="color: #2c5282; font-size: 20px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">License Keys</h2>',
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 20px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "license_divider",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{license_keys}}",
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "linksCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="color: #2c5282; font-size: 20px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">Custom Links</h2>',
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 20px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "link_divider",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{custom_links}}",
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_9",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p>Need help with your purchase? Our support team is here for you. Simply reply to this email or contact us through our support portal.</p>\n<p style="margin-bottom: 0;">Cheers,<br><strong>[Your Company Name] Team</strong></p>',
                                        color: "#333333",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "6px",
                                    },
                                },
                            ],
                            values: {
                                _meta: {
                                    htmlID: "u_column_2",
                                    htmlClassNames: "u_column",
                                },
                                border: {},
                                padding: "30px",
                                borderRadius: "8px",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "20px",
                        hideDesktop: false,
                        _meta: {
                            htmlID: "u_row_2",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "20px",
                                        textAlign: "center",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_10",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "<p>&copy; 2025 [Your Company Name]. All rights reserved.</p>\n<p>This email was sent to you because you made a purchase on [Your Website].</p>",
                                        color: "#718096",
                                        fontFamily: {
                                            label: "Segoe UI",
                                            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                        },
                                        fontSize: "12px",
                                    },
                                },
                            ],
                            values: {
                                _meta: {
                                    htmlID: "u_column_3",
                                    htmlClassNames: "u_column",
                                },
                                border: {},
                                padding: "0px",
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        _meta: {
                            htmlID: "u_row_3",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
            ],
            values: {
                backgroundColor: "#f0f4f8",
                backgroundImage: {
                    url: "",
                    fullWidth: true,
                    repeat: "no-repeat",
                    size: "custom",
                    position: "center",
                },
                contentWidth: "600px",
                fontFamily: {
                    label: "Segoe UI",
                    value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                },
                linkStyle: {
                    body: true,
                    linkColor: "#0000ee",
                    linkHoverColor: "#0000ee",
                    linkUnderline: true,
                    linkHoverUnderline: true,
                },
                textColor: "#333333",
                _meta: {
                    htmlID: "u_body",
                    htmlClassNames: "u_body",
                },
            },
        },
        schemaVersion: 16,
    };

    const minimalDark = {
        counters: {
            u_row: 5,
            u_column: 5,
            u_content_image: 1,
            u_content_heading: 1,
            u_content_text: 8,
            u_content_button: 1,
            u_content_divider: 3,
        },
        body: {
            rows: [
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "image",
                                    values: {
                                        containerPadding: "40px 20px",
                                        src: {
                                            url:
                                                apiEndpoint +
                                                "/images/logoipsum-temp1.svg",
                                            width: 160,
                                            height: 60,
                                        },
                                        textAlign: "center",
                                        altText: "Company Logo",
                                        action: {
                                            name: "web",
                                            values: {
                                                href: "",
                                                target: "_blank",
                                            },
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_image_1",
                                            htmlClassNames: "u_content_image",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "heading",
                                    values: {
                                        containerPadding: "0px",
                                        headingType: "h1",
                                        fontFamily: {
                                            label: "Helvetica",
                                            value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        },
                                        fontSize: "28px",
                                        textAlign: "center",
                                        lineHeight: "140%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_heading_1",
                                            htmlClassNames: "u_content_heading",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "Download Your Purchase",
                                        color: "#ffffff",
                                        fontWeight: 300,
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "#1e1e1e",
                                padding: "0px",
                                border: {},
                                borderRadius: "0px",
                                _meta: {
                                    htmlID: "u_column_1",
                                    htmlClassNames: "u_column",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        _meta: {
                            htmlID: "u_row_1",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_1",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p style="font-size: 16px; line-height: 160%;"><span style="font-size: 16px; line-height: 25.6px; color: #e0e0e0;">Hello {{first_name}} {{last_name}},</span></p>\n<p style="font-size: 14px; line-height: 160%;"><span style="font-size: 14px; line-height: 22.4px; color: #e0e0e0;">Your order <strong style="color: #bb86fc;">{{order_name}}</strong> is ready. We\'ve prepared everything for you below.</span></p>',
                                        fontFamily: {
                                            label: "Helvetica",
                                            value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "button",
                                    values: {
                                        containerPadding: "25px 0px 35px",
                                        href: {
                                            name: "web",
                                            values: {
                                                href: "",
                                                target: "_blank",
                                            },
                                        },
                                        buttonColors: {
                                            color: "#FFFFFF",
                                            backgroundColor: "#bb86fc",
                                            hoverColor: "#FFFFFF",
                                            hoverBackgroundColor: "#9a67e0",
                                        },
                                        size: {
                                            autoWidth: true,
                                            width: "100%",
                                        },
                                        fontSize: "14px",
                                        textAlign: "center",
                                        lineHeight: "120%",
                                        padding: "12px 24px",
                                        border: {},
                                        borderRadius: "4px",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_button_1",
                                            htmlClassNames: "u_content_button",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<span style="font-weight: 600;">{{download_page_button}}</span>',
                                        fontFamily: {
                                            label: "Helvetica",
                                            value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        },
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "15px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "filesCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="margin: 0 0 15px 0; line-height: 140%; text-align: left;"><span style="font-size: 18px; line-height: 25.2px; color: #bb86fc; font-weight: 500;">Files</span></h2>\n<div style="padding: 0 0 10px 0; line-height: 160%;"><span style="color: #e0e0e0;">{{download_links}}</span></div>',
                                        fontFamily: {
                                            label: "Helvetica",
                                            value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        },
                                        backgroundColor: "#2d2d2d",
                                        borderRadius: "4px",
                                    },
                                },
                                {
                                    type: "divider",
                                    values: {
                                        containerPadding: "10px",
                                        width: "100%",
                                        border: {
                                            borderTopWidth: "0px",
                                            borderTopStyle: "solid",
                                            borderTopColor: "#BBBBBB",
                                        },
                                        textAlign: "center",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "files_divider",
                                            htmlClassNames: "u_content_divider",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "15px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "licenseCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="margin: 0 0 15px 0; line-height: 140%; text-align: left;"><span style="font-size: 18px; line-height: 25.2px; color: #bb86fc; font-weight: 500;">License Keys</span></h2>\n<div style="padding: 0 0 10px 0; line-height: 160%;"><span style="color: #e0e0e0;">{{license_keys}}</span></div>',
                                        fontFamily: {
                                            label: "Helvetica",
                                            value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        },
                                        backgroundColor: "#2d2d2d",
                                        borderRadius: "4px",
                                    },
                                },
                                {
                                    type: "divider",
                                    values: {
                                        containerPadding: "10px",
                                        width: "100%",
                                        border: {
                                            borderTopWidth: "0px",
                                            borderTopStyle: "solid",
                                            borderTopColor: "#BBBBBB",
                                        },
                                        textAlign: "center",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "license_divider",
                                            htmlClassNames: "u_content_divider",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "15px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "linksCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="margin: 0 0 15px 0; line-height: 140%; text-align: left;"><span style="font-size: 18px; line-height: 25.2px; color: #bb86fc; font-weight: 500;">Custom Links</span></h2>\n<div style="padding: 0 0 10px 0; line-height: 160%;"><span style="color: #e0e0e0;">{{custom_links}}</span></div>',
                                        fontFamily: {
                                            label: "Helvetica",
                                            value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        },
                                        backgroundColor: "#2d2d2d",
                                        borderRadius: "4px",
                                    },
                                },
                                {
                                    type: "divider",
                                    values: {
                                        containerPadding: "15px",
                                        width: "100%",
                                        border: {
                                            borderTopWidth: "0px",
                                            borderTopStyle: "solid",
                                            borderTopColor: "#BBBBBB",
                                        },
                                        textAlign: "center",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "link_divider",
                                            htmlClassNames: "u_content_divider",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 20px",
                                        textAlign: "left",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_5",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p style="border-top: 1px solid #333333; font-size: 14px; line-height: 160%;"><span style="font-size: 14px; line-height: 22.4px; color: #e0e0e0;">Questions about your purchase? Contact our support team anytime.</span></p>\n<p style="font-size: 14px; line-height: 160%; margin-bottom: 0;"><span style="font-size: 14px; line-height: 22.4px; color: #e0e0e0;">Regards,<br /><strong>[Your Company Name] Team</strong></span></p>',
                                        fontFamily: {
                                            label: "Helvetica",
                                            value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        },
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "#1e1e1e",
                                padding: "30px",
                                border: {},
                                borderRadius: "4px",
                                _meta: {
                                    htmlID: "u_column_2",
                                    htmlClassNames: "u_column",
                                },
                                width: "600px",
                                maxWidth: "600px",
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "20px 0px",
                        hideDesktop: false,
                        _meta: {
                            htmlID: "u_row_2",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "20px",
                                        textAlign: "center",
                                        lineHeight: "140%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_6",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p style="font-size: 12px; line-height: 140%;"><span style="font-size: 12px; line-height: 16.8px; color: #757575;">&copy; 2025 [Your Company Name]</span></p>\n<p style="font-size: 12px; line-height: 140%;"><span style="font-size: 12px; line-height: 16.8px; color: #757575;">This email was sent to you because you made a purchase on [Your Website].</span></p>',
                                        fontFamily: {
                                            label: "Helvetica",
                                            value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        },
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "",
                                padding: "0px",
                                border: {},
                                borderRadius: "0px",
                                _meta: {
                                    htmlID: "u_column_3",
                                    htmlClassNames: "u_column",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        _meta: {
                            htmlID: "u_row_3",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
            ],
            values: {
                backgroundColor: "#121212",
                backgroundImage: {
                    url: "",
                    fullWidth: true,
                    repeat: "no-repeat",
                    size: "custom",
                    position: "center",
                },
                contentWidth: "600px",
                fontFamily: {
                    label: "Helvetica",
                    value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                },
                linkStyle: {
                    body: true,
                    linkColor: "#0000ee",
                    linkHoverColor: "#0000ee",
                    linkUnderline: true,
                    linkHoverUnderline: true,
                },
                textColor: "#e0e0e0",
                _meta: {
                    htmlID: "u_body",
                    htmlClassNames: "u_body",
                },
            },
        },
        schemaVersion: 16,
    };

    const vibrantOrange = {
        counters: {
            u_row: 6,
            u_column: 6,
            u_content_image: 1,
            u_content_heading: 1,
            u_content_text: 11,
            u_content_button: 1,
            u_content_divider: 3,
        },
        body: {
            rows: [
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "image",
                                    values: {
                                        containerPadding: "0px",
                                        src: {
                                            url:
                                                apiEndpoint +
                                                "/images/logoipsum-temp1.svg",
                                            width: 180,
                                            height: 70,
                                        },
                                        textAlign: "center",
                                        altText: "Company Logo",
                                        action: {
                                            name: "web",
                                            values: {
                                                href: "",
                                                target: "_blank",
                                            },
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_image_1",
                                            htmlClassNames: "u_content_image",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                    },
                                },
                                {
                                    type: "heading",
                                    values: {
                                        containerPadding: "10px 0px",
                                        headingType: "h1",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "24px",
                                        textAlign: "center",
                                        lineHeight: "140%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_heading_1",
                                            htmlClassNames: "u_content_heading",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "YOUR DIGITAL PRODUCTS ARE READY!",
                                        color: "#ff5003",
                                        fontWeight: 700,
                                        letterSpacing: "0.5px",
                                        textTransform: "uppercase",
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "",
                                padding: "30px 20px",
                                border: {},
                                borderRadius: "0px",
                                _meta: {
                                    htmlID: "u_column_1",
                                    htmlClassNames: "u_column",
                                },
                                backgroundImage: {
                                    url: "",
                                    fullWidth: true,
                                    repeat: "no-repeat",
                                    size: "custom",
                                    position: "center",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        hideMobile: false,
                        noStackMobile: false,
                        _meta: {
                            htmlID: "u_row_1",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                        gradient: {
                            colors: ["#ff7e1a", "#ff5003"],
                            direction: "135deg",
                            stops: ["0%", "100%"],
                        },
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 15px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "18px",
                                        color: "#444444",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_1",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p>Hey {{first_name}}!</p>\n<p>Thank you for your order <strong style="color: #ff5003;">{{order_name}}</strong>. Your purchase is complete, and your digital products are available for immediate download.</p>',
                                    },
                                },
                                {
                                    type: "button",
                                    values: {
                                        containerPadding: "25px 15px 35px",
                                        href: {
                                            name: "web",
                                            values: {
                                                href: "",
                                                target: "_blank",
                                            },
                                        },
                                        buttonColors: {
                                            color: "#FFFFFF",
                                            backgroundColor: "#ff5003",
                                            hoverColor: "#FFFFFF",
                                            hoverBackgroundColor: "#ff7e1a",
                                        },
                                        size: {
                                            autoWidth: true,
                                            width: "100%",
                                        },
                                        fontSize: "16px",
                                        textAlign: "center",
                                        lineHeight: "120%",
                                        padding: "14px 30px",
                                        border: {},
                                        borderRadius: "8px",
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_button_1",
                                            htmlClassNames: "u_content_button",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{download_page_button}}",
                                        calculatedWidth: 149,
                                        calculatedHeight: 42,
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 15px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "16px",
                                        color: "#444444",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_2",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff9f2; border-left: 4px solid #ff7e1a; padding: 15px; margin-bottom: 30px;">\n<tr>\n<td>\n<p style="margin: 0 0 5px 0; font-size: 16px;">Order: <strong>{{order_name}}</strong></p>\n<p style="margin: 0 0 5px 0; font-size: 16px;">Customer: <strong>{{first_name}} {{last_name}}</strong></p>\n</td>\n</tr>\n</table>',
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 15px 10px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "20px",
                                        color: "#ff5003",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "filesCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="padding: 0 0 8px 0; border-bottom: 2px solid #ffebda; margin: 0;">Files</h2>',
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 15px 25px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "14px",
                                        color: "#444444",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "files_divider",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{download_links}}",
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 15px 10px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "20px",
                                        color: "#ff5003",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "licenseCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="padding: 0 0 8px 0; border-bottom: 2px solid #ffebda; margin: 0;">License Keys</h2>',
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 15px 25px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "14px",
                                        color: "#444444",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "license_divider",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{license_keys}}",
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "0px 15px 10px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "20px",
                                        color: "#ff5003",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "linksCont",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<h2 style="padding: 0 0 8px 0; border-bottom: 2px solid #ffebda; margin: 0;">Custom Links</h2>',
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "10px 15px 25px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "14px",
                                        color: "#444444",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "link_divider",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "{{custom_links}}",
                                    },
                                },
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "15px",
                                        textAlign: "left",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "14px",
                                        color: "#444444",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_9",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: '<p>Need help getting started? Our team is ready to assist you with any questions about your purchase.</p>\n<p style="margin-bottom: 0;">Happy downloading!<br><strong style="color: #ff5003;">[Your Company Name] Team</strong></p>',
                                        backgroundColor: "#fff9f2",
                                        borderRadius: "6px",
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "#ffffff",
                                padding: "30px",
                                border: {},
                                borderRadius: "0px 0px 8px 8px",
                                _meta: {
                                    htmlID: "u_column_2",
                                    htmlClassNames: "u_column",
                                },
                                boxShadow: {
                                    color: "rgba(0,0,0,0.08)",
                                    offsetX: "0px",
                                    offsetY: "6px",
                                    blurRadius: "15px",
                                    spreadRadius: "0px",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        hideMobile: false,
                        noStackMobile: false,
                        _meta: {
                            htmlID: "u_row_2",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: "text",
                                    values: {
                                        containerPadding: "30px 20px",
                                        textAlign: "center",
                                        fontFamily: {
                                            label: "Open Sans",
                                            value: "'Open Sans', Arial, sans-serif",
                                        },
                                        fontSize: "12px",
                                        color: "#888888",
                                        lineHeight: "160%",
                                        linkStyle: {
                                            inherit: true,
                                            linkColor: "#0000ee",
                                            linkHoverColor: "#0000ee",
                                            linkUnderline: true,
                                            linkHoverUnderline: true,
                                        },
                                        hideDesktop: false,
                                        displayCondition: null,
                                        _meta: {
                                            htmlID: "u_content_text_10",
                                            htmlClassNames: "u_content_text",
                                        },
                                        selectable: true,
                                        draggable: true,
                                        duplicatable: true,
                                        deletable: true,
                                        hideable: true,
                                        text: "<p>&copy; 2025 [Your Company Name]. All rights reserved.</p>\n<p>You received this email because you made a purchase on [Your Website].</p>",
                                    },
                                },
                            ],
                            values: {
                                backgroundColor: "",
                                padding: "0px",
                                border: {},
                                borderRadius: "0px",
                                _meta: {
                                    htmlID: "u_column_3",
                                    htmlClassNames: "u_column",
                                },
                            },
                        },
                    ],
                    values: {
                        displayCondition: null,
                        columns: false,
                        backgroundColor: "",
                        columnsBackgroundColor: "",
                        backgroundImage: {
                            url: "",
                            fullWidth: true,
                            repeat: "no-repeat",
                            size: "custom",
                            position: "center",
                        },
                        padding: "0px",
                        hideDesktop: false,
                        hideMobile: false,
                        noStackMobile: false,
                        _meta: {
                            htmlID: "u_row_3",
                            htmlClassNames: "u_row",
                        },
                        selectable: true,
                        draggable: true,
                        duplicatable: true,
                        deletable: true,
                        hideable: true,
                    },
                },
            ],
            values: {
                textColor: "#444444",
                backgroundColor: "#fff9f2",
                backgroundImage: {
                    url: "",
                    fullWidth: true,
                    repeat: "no-repeat",
                    size: "custom",
                    position: "center",
                },
                contentWidth: "600px",
                contentAlign: "center",
                fontFamily: {
                    label: "Open Sans",
                    value: "'Open Sans', Arial, sans-serif",
                },
                preheaderText: "",
                lineHeight: "160%",
                linkStyle: {
                    body: true,
                    linkColor: "#0000ee",
                    linkHoverColor: "#0000ee",
                    linkUnderline: true,
                    linkHoverUnderline: true,
                },
                _meta: {
                    htmlID: "u_body",
                    htmlClassNames: "u_body",
                },
            },
        },
        schemaVersion: 16,
    };

    const loadTemplate = () => {
        switch (selectedTemplate) {
            case "vibrant-orange":
                setDefaultUnlayerJson(vibrantOrange);
                break;

            case "minimal-dark":
                setDefaultUnlayerJson(minimalDark);
                break;

            case "clean-minimal":
                setDefaultUnlayerJson(cleanMinimal);
                break;

            case "modern-blue":
                setDefaultUnlayerJson(modernBlue);
                break;

            default:
                break;
        }

        setIsLoadingEmailTemplate(false);
        // emailEditorRef.current?.editor.loadDesign(design)
    };

    useEffect(() => {
        loadTemplate();
    }, []);

    useEffect(() => {
        shopify.loading(isLoadingEmailTemplate);
    }, [isLoadingEmailTemplate, shopify]);

    function containsLink(html) {
        const links = [];

        // Remove DOCTYPE, <head>, <meta>, <xml>, and xmlns sections to avoid false positives
        const cleanedHtml = html
            .replace(/<!DOCTYPE[^>]*>/gi, "")
            .replace(/<head[\s\S]*?<\/head>/gi, "")
            .replace(/<meta[^>]*>/gi, "")
            .replace(/<\?xml[^>]*>/gi, "")
            .replace(/xmlns(:\w+)?="[^"]*"/gi, "")
            .replace(
                /<o:OfficeDocumentSettings>[\s\S]*?<\/o:OfficeDocumentSettings>/gi,
                ""
            );

        // Match <a href="..."> links
        const anchorTagWithHrefRegex = /<a\s+[^>]*href=["']([^"']+)["']/gi;
        let match;
        while ((match = anchorTagWithHrefRegex.exec(cleanedHtml)) !== null) {
            links.push(match[1]);
        }

        // Match visible full URLs (not inside tags or attributes)
        const visibleTextUrlRegex = /(?<!["'=])\bhttps?:\/\/[^\s"'<>]+/gi;
        const visibleTextMatches = cleanedHtml.match(visibleTextUrlRegex);
        if (visibleTextMatches) {
            links.push(...visibleTextMatches);
        }

        // Match www.* style visible text URLs
        const wwwTextUrlRegex = /(?<!["'=])\bwww\.[^\s"'<>]+/gi;
        const wwwTextMatches = cleanedHtml.match(wwwTextUrlRegex);
        if (wwwTextMatches) {
            links.push(...wwwTextMatches);
        }

        // Match domain names without protocol or www (robust approach)
        const allTextMatches = cleanedHtml.match(/\b[a-zA-Z0-9][a-zA-Z0-9-]{0,61}\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*[^\s"\'<>]*/gi) || [];

        // Filter out non-domains and files
        const domainMatches = allTextMatches.filter(match => {
            // Skip if starts with http:// or https:// (already caught above)
            if (match.startsWith('http://') || match.startsWith('https://')) return false;

            // Skip if starts with www. (already caught above)
            if (match.startsWith('www.')) return false;

            // Skip if it's an HTML attribute (starts with = or is inside quotes)
            if (match.startsWith('=') || match.startsWith('"') || match.startsWith("'")) return false;

            // Extract the core domain for validation
            const domainPart = match.split('/')[0].split('?')[0].split('#')[0];

            // Must contain at least one dot and valid TLD (support multi-level subdomains)
            if (!domainPart.match(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/)) return false;

            // Skip if it's a file with extension (check both domain part and full URL path)
            const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'css', 'js', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'tar', 'gz'];

            // Check domain part
            const lastDotIndex = domainPart.lastIndexOf('.');
            if (lastDotIndex > -1) {
                const extension = domainPart.substring(lastDotIndex + 1).toLowerCase();
                if (fileExtensions.includes(extension)) return false;
            }

            // Check full URL path for file extensions
            const urlPath = match;
            const pathMatch = urlPath.match(/\/([^\/]+)\.([a-zA-Z0-9]+)(?:\?|#|$)/);
            if (pathMatch) {
                const pathExtension = pathMatch[2].toLowerCase();
                if (fileExtensions.includes(pathExtension)) return false;
            }

            return true;
        });

        if (domainMatches.length > 0) {
            links.push(...domainMatches);
        }

        // Match any <a> tag (even if no href)
        const anyAnchorTagRegex = /<a(\s|>)/gi;
        // const hasATag = anyAnchorTagRegex.test(cleanedHtml);

        // Filter out known irrelevant domains (optional, for extra safety)
        const ignoreDomains = ["w3.org", "schemas.microsoft.com", "ogp.me"];
        const filteredLinks = links.filter((link) => {
            const lower = link.toLowerCase();
            return !ignoreDomains.some((domain) => lower.includes(domain));
        });

        return filteredLinks?.length > 0 ? true : false;
    }

    const processEmailHTML = (html) => {
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find all elements with font-size styles
        const elementsWithFontSize = doc.querySelectorAll('[style*="font-size"]');

        elementsWithFontSize.forEach(element => {
            const style = element.getAttribute('style');
            const fontSizeMatch = style.match(/font-size:\s*([^;]+)/);

            if (fontSizeMatch) {
                const fontSize = fontSizeMatch[1];

                // Apply font-size to all child text elements
                const childTextElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, td, th, li');
                childTextElements.forEach(child => {
                    const existingStyle = child.getAttribute('style') || '';
                    if (!existingStyle.includes('font-size')) {
                        child.setAttribute('style', `${existingStyle}; font-size: ${fontSize} !important;`);
                    }
                });
            }
        });

        return doc.documentElement.outerHTML;
    };

    const handleSave = useCallback(
        (is_default = false) => {
            setSaving(true);
            const unlayer = emailEditorRef.current?.editor;

            unlayer?.exportHtml(async (data) => {
                const options = {
                    sendTextEmailOnly: sendTextEmailOnly,
                    showFiles: showFiles,
                    showCustomLinks: showCustomLinks,
                    showLicenseKeys: showLicenseKeys,
                    showProductQty: showProductQty,
                };

                try {
                    const response = await fetch("/api/save-email-template", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            unlayer_json: data?.design,
                            html: processEmailHTML(data?.html),
                            title: title,
                            is_default: is_default,
                            type: selectedTemplate,
                            status: status,
                            subject: subject,
                            updated_email_subject: updatedEmailSubject,
                            enable_custom_link_button: enableCustomLinkButton,
                            custom_link_button_text: customLinkButtonText,
                            product_name_color: productNameColor,
                            template_status: linkDetected
                                ? "in_review"
                                : "published",
                            fromEmail: fromEmail,
                            options: options,
                            template_used_for: templateUsedFor,
                        }),
                    });

                    if (response.ok) {
                        shopify.toast.show(t("settings.email_content.email_template_added_successfully"));
                        setSaving(false);

                        // Update initial data and hide SaveBar
                        const updatedData = captureCurrentData();
                        setInitialData(updatedData);
                        setHasUnsavedChanges(false);
                        shopify.saveBar.hide('add-template-savebar');

                        //await refetchStore();
                        navigate("/EmailTemplates");
                    } else {
                        shopify.toast.show(t("email_templates.failed_to_update"), { isError: true, duration: 9999999 });
                        setSaving(false);
                    }
                } catch (error) {
                    console.error("Error updating email template:", error);
                    shopify.toast.show(t("email_templates.failed_to_update"), { isError: true, duration: 9999999 });
                    setSaving(false);
                }
            });
        },
        [
            title,
            status,
            subject,
            updatedEmailSubject,
            enableCustomLinkButton,
            customLinkButtonText,
            downloadButtonText,
            linkDetected,
            productNameColor,
            fromEmail,
            templateUsedFor
        ]
    );

    // SaveBar action handlers
    const handleSaveBarSave = useCallback(async () => {
        await handleSave(false);
    }, [handleSave]);

    const handleSaveBarDiscard = useCallback(() => {
        handleDiscardChanges();
    }, [handleDiscardChanges]);

    const toggleToast = useCallback(
        () => setShowToast((showToast) => !showToast),
        []
    );

    const handleTemplateStatus = useCallback(() => {
        setStatus((value) => !value);
    }, []);

    const handleTitle = useCallback((value) => setTitle(value), []);

    const handleSubject = useCallback((value) => setSubject(value), []);

    const handleUpdatedEmailSubject = useCallback(
        (value) => setUpdatedEmailSubject(value),
        []
    );

    const handleCustomLinkButton = useCallback(
        (value) => setEnableCustomLinkButton(value),
        []
    );

    const handleCustomLinkButtonText = useCallback(
        (value) => setCustomLinkButtonText(value),
        []
    );

    const handleDownloadButtonText = useCallback(
        (value) => setDownloadButtonText(value),
        []
    );

    const handleProductNameColor = useCallback(
        (value) => setProductNameColor(value),
        []
    );


    const handleSelectedTemplate = (value) => {
        setSelectedTemplate(value);
    };

    const toastMarkup = showToast && (
        <Toast
            content={toastMessage}
            onDismiss={toggleToast}
            error={isErrorToast}
        />
    );

    const loadingMarkup = isLoadingEmailTemplate && (
        <SkeletonPage
            title={t("email_templates.untitled")}
            primaryAction
            fullWidth
        >
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="300">
                            <SkeletonBodyText />
                            <SkeletonBodyText />
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    return (
        <Frame>
            {toastMarkup}
            {loadingMarkup}

            {/* SaveBar Component */}
            <SaveBar id="add-template-savebar">
                <button
                    variant="primary"
                    onClick={handleSaveBarSave}
                    disabled={saving || !isFormValid}
                >
                    {saving ? t("email_templates.saving") || 'Saving...' : t("email_templates.save")}
                </button>
                <button onClick={handleSaveBarDiscard}>
                    Discard
                </button>
            </SaveBar>

            {!isLoadingEmailTemplate ? (
                <Page
                    title={title}
                    backAction={{
                        content: t("email_templates.back_to"),
                        onAction: async () => {
                            if (hasUnsavedChanges) {
                                await shopify.saveBar.leaveConfirmation();
                            }
                            navigate("/EmailTemplates");
                        },
                    }}
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
                            <Button
                                onClick={() => handleSave(true)}
                                disabled={
                                    !title ||
                                    !subject ||
                                    !updatedEmailSubject ||
                                    !downloadButtonText ||
                                    (enableCustomLinkButton &&
                                        !customLinkButtonText)
                                }
                            >
                                {t("email_templates.make_default_template")}
                            </Button>
                        </div>
                    }
                    fullWidth
                >
                    <BlockStack gap="400">
                        {linkDetected ? (
                            <Banner
                                title={
                                    <InlineStack blockAlign="center" gap="200">
                                        <WarningIcon />
                                        <Text as="span">
                                            {t("email_templates.link_detected")}
                                        </Text>
                                    </InlineStack>
                                }
                                tone="warning"
                            >
                                <Text variant="headingMd" as="h6">
                                    {t("email_templates.we_have_detected")}
                                </Text>
                            </Banner>
                        ) : (
                            ""
                        )}

                        <InlineStack gap="400">
                            {showSettings ? (
                                <div
                                    style={{
                                        maxWidth: isMobile ? "100%" : "350px",
                                        minWidth: isMobile ? "100%" : "350px",
                                        width: isMobile ? "100%" : "auto",
                                    }}
                                >
                                    <Card>
                                        <BlockStack gap="400">
                                            <Text variant="headingMd" as="h6">
                                                {t(
                                                    "email_templates.template_settings"
                                                )}
                                            </Text>
                                        </BlockStack>

                                        <div
                                            style={{
                                                marginTop: "10px",
                                            }}
                                        >
                                            <BlockStack>
                                                <TextField
                                                    label={t(
                                                        "email_templates.template_title"
                                                    )}
                                                    value={title}
                                                    onChange={handleTitle}
                                                    autoComplete="off"
                                                    helpText={
                                                        <>
                                                            {!title && (
                                                                <span
                                                                    style={{
                                                                        color: "red",
                                                                        display:
                                                                            "block",
                                                                    }}
                                                                >
                                                                    {t(
                                                                        "email_templates.this_field"
                                                                    )}
                                                                </span>
                                                            )}
                                                        </>
                                                    }
                                                />
                                            </BlockStack>

                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                }}
                                            >
                                                <BlockStack gap="400">
                                                    <TextField
                                                        label={t(
                                                            "email_templates.email_from_name"
                                                        )}
                                                        value={
                                                            fromEmail != ""
                                                                ? fromEmail
                                                                : store?.name ??
                                                                  ""
                                                        }
                                                        onChange={(value) =>
                                                            setFromEmail(value)
                                                        }
                                                        autoComplete="off"
                                                        placeholder={t(
                                                            "email_templates.from_email_name"
                                                        )}
                                                    />
                                                </BlockStack>
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                }}
                                            >
                                                <BlockStack>
                                                    <TextField
                                                        label={t(
                                                            "email_templates.email_subject"
                                                        )}
                                                        value={subject}
                                                        onChange={handleSubject}
                                                        autoComplete="off"
                                                        helpText={
                                                            <>
                                                                <Text as="span">
                                                                    <span>
                                                                        <strong>
                                                                            &#123;order_name&#125;
                                                                            &
                                                                            &#123;product_name&#125;
                                                                            &
                                                                            &#123;first_name&#125;
                                                                            &
                                                                            &#123;last_name&#125;
                                                                        </strong>{" "}
                                                                        {t(
                                                                            "settings.email_content.variables_available"
                                                                        )}
                                                                    </span>
                                                                </Text>

                                                                {!subject && (
                                                                    <span
                                                                        style={{
                                                                            color: "red",
                                                                            display:
                                                                                "block",
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            "email_templates.this_field"
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </>
                                                        }
                                                    />
                                                </BlockStack>
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                }}
                                            >
                                                <BlockStack>
                                                    <TextField
                                                        label={t(
                                                            "email_templates.updated_email_subject"
                                                        )}
                                                        value={
                                                            updatedEmailSubject
                                                        }
                                                        onChange={
                                                            handleUpdatedEmailSubject
                                                        }
                                                        autoComplete="off"
                                                        helpText={
                                                            <>
                                                                <Text as="span">
                                                                    <span>
                                                                        <strong>
                                                                            &#123;order_name&#125;
                                                                            &
                                                                            &#123;product_name&#125;
                                                                        </strong>{" "}
                                                                        {t(
                                                                            "settings.email_content.variables_available"
                                                                        )}
                                                                    </span>
                                                                </Text>
                                                            </>
                                                        }
                                                    />
                                                </BlockStack>
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                }}
                                            >
                                                <Checkbox
                                                    checked={
                                                        enableCustomLinkButton
                                                    }
                                                    onChange={(newValue, _) =>
                                                        handleCustomLinkButton(
                                                            newValue
                                                        )
                                                    }
                                                    label={t(
                                                        "email_templates.show_custom_link"
                                                    )}
                                                />

                                                {enableCustomLinkButton ? (
                                                    <BlockStack>
                                                        <TextField
                                                            label={t(
                                                                "email_templates.custom_link_button_text"
                                                            )}
                                                            value={
                                                                customLinkButtonText
                                                            }
                                                            onChange={
                                                                handleCustomLinkButtonText
                                                            }
                                                            autoComplete="off"
                                                            helpText={
                                                                !customLinkButtonText ? (
                                                                    <span
                                                                        style={{
                                                                            color: "red",
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            "email_templates.this_field"
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                        />
                                                    </BlockStack>
                                                ) : (
                                                    ""
                                                )}
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                }}
                                            >
                                                <BlockStack>
                                                    <TextField
                                                        label={t(
                                                            "settings.email_content.template_product_color"
                                                        )}
                                                        value={
                                                            productNameColor
                                                        }
                                                        onChange={
                                                            handleProductNameColor
                                                        }
                                                        autoComplete="off"
                                                        helpText={t(
                                                            "settings.email_content.enter_hex_color_for_product_name"
                                                        )}
                                                    />
                                                </BlockStack>
                                            </div>

                                        </div>

                                        <div
                                            style={{
                                                marginTop: "10px",
                                                marginBottom: "10px",
                                            }}
                                        ></div>

                                        <Card>
                                            <BlockStack gap="400">
                                                <Text
                                                    variant="headingMd"
                                                    as="h6"
                                                >
                                                    {t(
                                                        "email_templates.options"
                                                    )}
                                                </Text>
                                            </BlockStack>

                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                }}
                                            >
                                                <Checkbox
                                                    label={t(
                                                        "email_templates.send_only_text_email"
                                                    )}
                                                    checked={sendTextEmailOnly}
                                                    onChange={(value) =>
                                                        setSendTextEmailOnly(
                                                            value
                                                        )
                                                    }
                                                />
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Checkbox
                                                        label={t(
                                                            "email_templates.show_files_downloads"
                                                        )}
                                                        checked={showFiles}
                                                        onChange={(value) =>
                                                            setShowFiles(value)
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Checkbox
                                                        label={t(
                                                            "email_templates.show_custom_links"
                                                        )}
                                                        checked={
                                                            showCustomLinks
                                                        }
                                                        onChange={(value) =>
                                                            setShowCustomLinks(
                                                                value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Checkbox
                                                        label={t(
                                                            "email_templates.show_license_keys"
                                                        )}
                                                        checked={
                                                            showLicenseKeys
                                                        }
                                                        onChange={(value) =>
                                                            setShowLicenseKeys(
                                                                value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Checkbox
                                                        label={t(
                                                            "email_templates.show_product_quantity"
                                                        )}
                                                        checked={showProductQty}
                                                        onChange={(value) =>
                                                            setShowProductQty(
                                                                value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                    marginBottom: "10px",
                                                }}
                                            ></div>

                                            <Card>
                                                <BlockStack gap="400">
                                                    <Text
                                                        variant="headingMd"
                                                        as="h6"
                                                    >
                                                        {t("email_templates.dynamic_template_option")}
                                                    </Text>
                                                </BlockStack>

                                                <BlockStack gap="200">
                                                    <RadioButton
                                                        label={t("email_templates.general")}
                                                        checked={templateUsedFor === "general"}
                                                        id="general"
                                                        name="templateUsedFor"
                                                        onChange={() =>
                                                            setTemplateUsedFor("general")
                                                        }
                                                    />
                                                    <RadioButton
                                                        label={t("email_templates.for_files_only")}
                                                        checked={templateUsedFor === "files_only"}
                                                        id="files_only"
                                                        name="templateUsedFor"
                                                        onChange={() =>
                                                            setTemplateUsedFor("files_only")
                                                        }
                                                    />
                                                    <RadioButton
                                                        label={t("email_templates.for_keys_codes_only")}
                                                        checked={templateUsedFor === "keys_only"}
                                                        id="keys_only"
                                                        name="templateUsedFor"
                                                        onChange={() =>
                                                            setTemplateUsedFor("keys_only")
                                                        }
                                                    />
                                                    <RadioButton
                                                        label={t("email_templates.for_custom_links_only")}
                                                        checked={templateUsedFor === "custom_links_only"}
                                                        id="custom_links_only"
                                                        name="templateUsedFor"
                                                        onChange={() =>
                                                            setTemplateUsedFor("custom_links_only")
                                                        }
                                                    />
                                                </BlockStack>
                                            </Card>
                                        </Card>


                                        <div
                                    style={{
                                         marginTop: "10px",
                                         marginBottom: "10px",
                                        maxWidth: "400px",
                                        minWidth: "280px",
                                        "@media (min-width: 768px)": {
                                            maxWidth: "550px",
                                            minWidth: "400px",
                                        },
                                    }}
                                >
                                            <Card>
                                                <Box padding="4">
                                                    <BlockStack gap="4">
                                                        <Text
                                                            variant="headingMd"
                                                            as="h2"
                                                        >
                                                            {t(
                                                                "email_templates.merge_tags"
                                                            )}
                                                        </Text>
                                                        <Text
                                                            variant="bodyMd"
                                                            color="subdued"
                                                        >
                                                            {t(
                                                                "email_templates.merge_tags_des"
                                                            )}
                                                        </Text>
                                                    </BlockStack>
                                                </Box>
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                ></div>
                                                <Divider />
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                ></div>
                                                <Box padding="2">
                                                    <BlockStack gap="200">
                                                        {mergeTagsData.map(
                                                            (
                                                                tagData,
                                                                index
                                                            ) => (
                                                                <Card
                                                                    key={index}
                                                                    subdued
                                                                >
                                                                    <Box padding="3">
                                                                        <BlockStack gap="200">
                                                                            <InlineStack
                                                                                align="space-between"
                                                                                blockAlign="center"
                                                                            >
                                                                                <InlineStack
                                                                                    gap="200"
                                                                                    blockAlign="center"
                                                                                >
                                                                                    <Badge
                                                                                        tone={getCategoryColor(
                                                                                            tagData.category
                                                                                        )}
                                                                                        size="small"
                                                                                    >
                                                                                        {
                                                                                            tagData.category
                                                                                        }
                                                                                    </Badge>
                                                                                </InlineStack>
                                                                                <Button
                                                                                    variant="tertiary"
                                                                                    size="micro"
                                                                                    icon={
                                                                                        expandedTags[
                                                                                            index
                                                                                        ]
                                                                                            ? ChevronUpIcon
                                                                                            : ChevronDownIcon
                                                                                    }
                                                                                    onClick={() =>
                                                                                        toggleExpanded(
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                    accessibilityLabel={`${
                                                                                        expandedTags[
                                                                                            index
                                                                                        ]
                                                                                            ? "Collapse"
                                                                                            : "Expand"
                                                                                    } ${
                                                                                        tagData.title
                                                                                    }`}
                                                                                />
                                                                            </InlineStack>

                                                                            <InlineStack
                                                                                align="space-between"
                                                                                blockAlign="start"
                                                                            >
                                                                                <BlockStack gap="200">
                                                                                    <Text
                                                                                        variant="headingSm"
                                                                                        as="h3"
                                                                                    >
                                                                                        {
                                                                                            tagData.title
                                                                                        }
                                                                                    </Text>
                                                                                    <Button
                                                                                        variant="tertiary"
                                                                                        size="micro"
                                                                                        textAlign="left"
                                                                                        onClick={() =>
                                                                                            copyToClipboard(
                                                                                                tagData.tag
                                                                                            )
                                                                                        }
                                                                                        icon={
                                                                                            ClipboardIcon
                                                                                        }
                                                                                    >
                                                                                        <Text
                                                                                            variant="bodyMd"
                                                                                            fontWeight="medium"
                                                                                            color="success"
                                                                                            as="span"
                                                                                            style={{
                                                                                                wordBreak: "break-all",
                                                                                                whiteSpace: "normal",
                                                                                                overflowWrap: "break-word"
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                tagData.tag
                                                                                            }
                                                                                        </Text>
                                                                                    </Button>
                                                                                </BlockStack>
                                                                            </InlineStack>

                                                                            <Collapsible
                                                                                open={
                                                                                    expandedTags[
                                                                                        index
                                                                                    ]
                                                                                }
                                                                                id={`merge-tag-${index}`}
                                                                                transition={{
                                                                                    duration:
                                                                                        "200ms",
                                                                                    timingFunction:
                                                                                        "ease-in-out",
                                                                                }}
                                                                            >
                                                                                <BlockStack gap="400">
                                                                                    <Divider />
                                                                                    <Text variant="bodyMd">
                                                                                        {
                                                                                            tagData.description
                                                                                        }
                                                                                    </Text>
                                                                                    <Box
                                                                                        background="bg-surface-secondary"
                                                                                        padding="3"
                                                                                        borderRadius="2"
                                                                                    >
                                                                                        <BlockStack gap="200">
                                                                                            <Text
                                                                                                variant="bodyMd"
                                                                                                fontWeight="semibold"
                                                                                            >
                                                                                                {t(
                                                                                                    "email_templates.example_output"
                                                                                                )}
                                                                                            </Text>
                                                                                            <Text
                                                                                                variant="bodyMd"
                                                                                                color="subdued"
                                                                                                fontFamily="mono"
                                                                                            >
                                                                                                {tagData.example
                                                                                                    .split(
                                                                                                        "\n"
                                                                                                    )
                                                                                                    .map(
                                                                                                        (
                                                                                                            line,
                                                                                                            i
                                                                                                        ) => (
                                                                                                            <div
                                                                                                                key={
                                                                                                                    i
                                                                                                                }
                                                                                                            >
                                                                                                                {line ||
                                                                                                                    " "}
                                                                                                            </div>
                                                                                                        )
                                                                                                    )}
                                                                                            </Text>
                                                                                        </BlockStack>
                                                                                    </Box>
                                                                                </BlockStack>
                                                                            </Collapsible>
                                                                        </BlockStack>
                                                                    </Box>
                                                                </Card>
                                                            )
                                                        )}
                                                    </BlockStack>
                                                </Box>
                                            </Card>
                                        </div>
                                    </Card>
                                </div>
                            ) : (
                                ""
                            )}

                            <EmailEditor
                                ref={emailEditorRef}
                                minHeight="100vh"
                                onLoad={() => {
                                    if (defaultUnlayerJson) {
                                        emailEditorRef.current?.editor.loadDesign(
                                            defaultUnlayerJson
                                        );
                                        emailEditorRef.current?.editor.addEventListener(
                                            "design:updated",
                                            () => {
                                                emailEditorRef.current?.editor.exportHtml(
                                                    (data) => {
                                                        const _linkDetected =
                                                            containsLink(
                                                                data?.html
                                                            );

                                                        if (_linkDetected) {
                                                            setLinkDetected(
                                                                true
                                                            );
                                                        } else {
                                                            setLinkDetected(
                                                                false
                                                            );
                                                        }
                                                    }
                                                );
                                            }
                                        );
                                    }
                                }}
                                onReady={() => {
                                    setShowSettings(true);
                                }}
                                options={{
                                    displayMode: 'email',
                                    mergeTags: {
                                        single_file_download_link: {
                                            name: t("email_templates.single_download_file_link"),
                                            value: "{{single_file_download_link}}",
                                        },
                                        download_links: {
                                            name: t("email_templates.file_download_links"),
                                            value: "{{download_links}}",
                                        },
                        single_video_download_link: {
                            name: t("email_templates.single_video_download_link"),
                            value: "{{single_video_download_link}}",
                        },
                        video_links: {
                            name: t("email_templates.videos_download_links"),
                            value: "{{videos_links}}",
                        },
                                        license_keys: {
                                            name: t("email_templates.license_key_code"),
                                            value: "{{license_keys}}",
                                        },
                                        custom_links: {
                                            name: t("email_templates.custom_links"),
                                            value: "{{custom_links}}",
                                        },
                                        download_page_button: {
                                            name: t("email_templates.download_page_button"),
                                            value: "{{download_page_button}}",
                                        },
                                        first_name: {
                                            name: t("email_templates.customer_first_name"),
                                            value: "{{first_name}}",
                                        },
                                        last_name: {
                                            name: t("email_templates.customer_last_name"),
                                            value: "{{last_name}}",
                                        },
                                        order_name: {
                                            name: t("email_templates.order_id"),
                                            value: "{{order_name}}",
                                        },
                                        single_license_key: {
                                            name: t("email_templates.multiline_keys_codes"),
                                            value: "{{single_license_key}}",
                                        },
                                        one_key_code: {
                                            name: t("email_templates.single_key_code_only"),
                                            value: "{{one_key_code}}",
                                        },
                                        first_product_name: {name: t("email_templates.product_name"), value: '{{first_product_name}}'},
                                        first_product_price: {name: t("email_templates.product_price"), value: '{{first_product_price}}'},
                                        first_product_image: {name: t("email_templates.product_image"), value: '{{first_product_image}}'},
                                        qr_code: {name: t("email_templates.display_qr_code"), value: '{{qr_code}}'},
                                        order_dynamic_property: {name: t("email_templates.dynamic_order_property"), value: '{{order.PROPERTY_REPLACE_HERE}}'}
                                    },
                                    mergeTagsConfig: {
                                        sort: false,
                                    },
                                }}
                            />
                        </InlineStack>
                    </BlockStack>
                </Page>
            ) : (
                ""
            )}
        </Frame>
    );
}

export default AddTemplate;
