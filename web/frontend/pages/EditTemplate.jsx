import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
    Page,
    Layout,
    Card,
    TextField,
    Banner,
    Button,
    Frame,
    Spinner,
    Text,
    Badge,
    Checkbox,
    RadioButton,
    InlineStack,
        SkeletonPage,
    SkeletonBodyText,
    BlockStack,
    Modal,
    Thumbnail,
    InlineGrid,
    Box, Divider, Collapsible
} from '@shopify/polaris';
import { useLocation, useNavigate } from 'react-router-dom';
import EmailEditor from 'react-email-editor';
import { useAppBridge, SaveBar } from "@shopify/app-bridge-react"
import { AppContext } from '../components/providers/AppProvider'
import { Knob } from '../components/Knob';
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LanguageSelector from "../components/LanguageSelector";
import {ChevronDownIcon, ChevronUpIcon, ClipboardIcon} from "@shopify/polaris-icons";


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
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
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
                    <polygon className="st1" points="418.9,441.3 81.1,441.3 88.2,374.9 411.8,374.9 "></polygon>
                    <path className="st2" d="M404.3,192.7C403,118.5,334.4,58.7,250,58.7S97,118.5,95.7,192.7h0v182.2h308.8L404.3,192.7L404.3,192.7z"></path>
                    <path className="st3" d="M362.6,222.9c-1-61.9-51-111.9-112.6-111.9S138.4,161,137.4,222.9h0v152h225.2L362.6,222.9L362.6,222.9z"></path>
                    <path className="st4" d="M319.2,354.6h15.1c4.7,0,8.5-3.8,8.5-8.5V215.9c0-4.7-3.8-8.5-8.5-8.5h-15.1c-4.7,0-8.5,3.8-8.5,8.5v130.2 C310.7,350.8,314.5,354.6,319.2,354.6z"></path>
                </g>
            </g>
        </g>
    </svg>
);



function EditTemplate() {

    const shopify = useAppBridge()
    const { store, refetchStore } = useContext(AppContext)
        const emailEditorRef = useRef(null);
    const location = useLocation()
    const navigate = useNavigate()

    const [saving, setSaving] = useState(false);
    const [existingUnlayerJson, setExistingUnlayerJson] = useState(null)
    const [isLoadingEmailTemplate, setIsLoadingEmailTemplate] = useState(true)
    const [template, setTemplate] = useState()
    const [title, setTitle] = useState('Untitled Template')
    const [subject, setSubject] = useState('')
    const [status, setStatus] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [updatedEmailSubject, setUpdatedEmailSubject] = useState()
    const [enableCustomLinkButton, setEnableCustomLinkButton] = useState(false)
    const [customLinkButtonText, setCustomLinkButtonText] = useState('')
    const [linkDetected, setLinkDetected] = useState(false)
    const [fromEmail, setFromEmail] = useState('')
    const [sendTextEmailOnly, setSendTextEmailOnly] = useState(false)
    const [showFiles, setShowFiles] = useState(true)
    const [showCustomLinks, setShowCustomLinks] = useState(true)
    const [showLicenseKeys, setShowLicenseKeys] = useState(true)
    const [showProductQty, setShowProductQty] = useState(false)
    const { t } = useTranslation();
    const [downloadButtonText, setDownloadButtonText] = useState(t("email_templates.download"))
    const [expandedTags, setExpandedTags] = useState({});
    const [productNameColor, setProductNameColor] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [templateUsedFor, setTemplateUsedFor] = useState("general");
    const { id, isTranslation, language } = location.state || {};

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

    // Inject responsive CSS

    // const mergeTagsData = [
    //     {
    //         tag: '{{download_links}}',
    //         title: 'Files Download Links',
    //         description: 'Replaces with all downloadable files for digital products in the order. Shows file name and type. Clicking downloads the file.',
    //         category: 'Digital Products',
    //         example: 'File1.pdf (PDF)\nSoftware.zip (ZIP)'
    //     },
    //     {
    //         tag: '{{license_keys}}',
    //         title: 'License Keys/Codes',
    //         description: 'Replaces with all product license keys or codes from the order.',
    //         category: 'License Management',
    //         example: 'Product A: ABC123XYZ\nProduct B: DEF456UVW'
    //     },
    //     {
    //         tag: '{{custom_links}}',
    //         title: 'Custom Links',
    //         description: 'Replaces with all custom links associated with products in the order.',
    //         category: 'Custom Link',
    //         example: 'Setup Guide: https://example.com/setup\nSupport: https://example.com/help'
    //     },
    //     {
    //         tag: '{{download_page_button}}',
    //         title: 'Download Page Button',
    //         description: 'Creates a button linking to a download page showing all order products with their files, license keys, and custom links.',
    //         category: 'Navigation',
    //         example: '[Download Your Products] button'
    //     },
    //     {
    //         tag: '{{first_name}}',
    //         title: 'Customer First Name',
    //         description: 'Replaces with the customer\'s first name from the order.',
    //         category: 'Customer Info',
    //         example: 'John'
    //     },
    //     {
    //         tag: '{{last_name}}',
    //         title: 'Customer Last Name',
    //         description: 'Replaces with the customer\'s last name from the order.',
    //         category: 'Customer Info',
    //         example: 'Doe'
    //     },
    //     {
    //         tag: '{{order_name}}',
    //         title: 'Order ID',
    //         description: 'Replaces with the order identification number.',
    //         category: 'Order Info',
    //         example: '#1001'
    //     },
    //     {
    //         tag: '{{single_license_key}}',
    //         title: 'Multi-line Keys/Codes',
    //         description: 'Shows license keys organized by product. Single product shows one key per line. Multiple products show product name followed by their keys.',
    //         category: 'License Management',
    //         example: 'Single: XXXXXXX\nMultiple:\nMy First Product\nXXXXXXXXX\nMy Other Product\nAAAAAAAAA\nBBBBBBBBB'
    //     },
    //     {
    //         tag: '{{one_key_code}}',
    //         title: 'Single Key/Code Only',
    //         description: 'Shows only one license key or code. If multiple keys exist, displays the first one only.',
    //         category: 'License Management',
    //         example: 'XXXXXXX'
    //     }
    // ];
    const mergeTagsData = [
        {
            tag: '{{single_file_download_link}}',
            title: t("email_templates.single_download_file_link"),
            description: t("email_templates.single_download_file_link_description"),
            category: t("email_templates.digital_products"),
            example: t("email_templates.single_download_file_link_example")
        },
        {
            tag: '{{download_links}}',
            title: t('email_templates.file_download_links'),
            description: t('email_templates.files_download_links_des'),
            category: t("email_templates.digital_products"),
            example: t('email_templates.file_download_links_example'),
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
            tag: '{{license_keys}}',
            title: t("email_templates.license_key_code"),
            description: t("email_templates.license_key_code_des"),
            category: t("email_templates.license_management"),
            example: t("email_templates.license_key_code_example"),
        },
        {
            tag: '{{custom_links}}',
            title: t('email_templates.custom_links'),
            description: t('email_templates.custom_links_des'),
            category: t("email_templates.custom_link"),
            example: t('email_templates.custom_links_example'),
        },
        {
            tag: '{{download_page_button}}',
            title: t('email_templates.download_page_button'),
            description: t('email_templates.download_page_button_des'),
            category: t("email_templates.navigation"),
            example: t('email_templates.download_page_button_example'),
        },
        {
            tag: '{{first_name}}',
            title: t("email_templates.customer_first_name"),
            description: t("email_templates.customer_first_name_des"),
            category: t("email_templates.customer_info"),
            example: t("email_templates.customer_first_name_example"),
        },
        {
            tag: '{{last_name}}',
            title: t("email_templates.customer_last_name"),
            description: t("email_templates.customer_last_name_des"),
            category: t("email_templates.customer_info"),
            example: t("email_templates.customer_last_name_example"),
        },
        {
            tag: '{{order_name}}',
            title: t("email_templates.order_id"),
            description: t("email_templates.order_id_des"),
            category: t("email_templates.order_info"),
            example: t("email_templates.order_info_example")
        },
        {
            tag: '{{single_license_key}}',
            title: t("email_templates.multiline_keys_codes"),
            description: t("email_templates.multiline_keys_codes_des"),
            category: t("email_templates.license_management"),
            example: t("email_templates.license_management_example")
        },
        {
            tag: '{{one_key_code}}',
            title: t("email_templates.single_key_code_only"),
            description: t("email_templates.single_key_code_only_des"),
            category: t("email_templates.license_management"),
            example: t("email_templates.single_key_code_only_example")
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
        setExpandedTags(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            shopify.toast.show(t("email_templates.merge_tag_copied") || "Merge tag copied to clipboard");
        }).catch((err) => {
            console.error("Failed to copy:", err);
            shopify.toast.show(t("email_templates.failed_to_copy") || "Failed to copy", { isError: true, duration: 9999999 });
        });
    };

    // const getCategoryColor = (category) => {
    //     const colors = {
    //         'Digital Products': 'success',
    //         'License Management': 'info',
    //         'Custom Link': 'warning',
    //         'Navigation': 'critical',
    //         'Customer Info': 'attention',
    //         'Order Info': 'subdued'
    //     };
    //     return colors[category] || 'subdued';
    // };
    const getCategoryColor = (category) => {
    const colors = {
        [t("email_templates.digital_products")]: 'success',
        [t("email_templates.license_management")]: 'info',
        [t("email_templates.custom_link")]: 'warning',
        [t("email_templates.navigation")]: "magic",
        [t("email_templates.customer_info")]: 'attention',
        [t("email_templates.order_info")]: 'subdued'
    };
    return colors[category] || 'subdued';
};

    // Function to capture current data state including email editor content
    const captureCurrentData = useCallback(() => {
        const unlayer = emailEditorRef.current?.editor;
        const currentEditorContent = unlayer ? JSON.stringify(unlayer.design) : "";
        return {
            title,
            subject,
            updatedEmailSubject,
            customLinkButtonText,
            enableCustomLinkButton,
            downloadButtonText,
            productNameColor,
            fromEmail,
            sendTextEmailOnly,
            showFiles,
            showCustomLinks,
            showLicenseKeys,
            showProductQty,
            templateUsedFor,
            editorContent: currentEditorContent,
        };
    }, [
        title,
        subject,
        updatedEmailSubject,
        customLinkButtonText,
        enableCustomLinkButton,
        downloadButtonText,
        productNameColor,
        fromEmail,
        sendTextEmailOnly,
        showFiles,
        showCustomLinks,
        showLicenseKeys,
        showProductQty,
        templateUsedFor,
    ]);

    // Function to check if form data has changed
    const hasDataChanged = useCallback(() => {
        return (
            title !== (initialData.title || "") ||
            subject !== (initialData.subject || "") ||
            updatedEmailSubject !== (initialData.updatedEmailSubject || "") ||
            customLinkButtonText !== (initialData.customLinkButtonText || "") ||
            enableCustomLinkButton !== (initialData.enableCustomLinkButton || false) ||
            downloadButtonText !== (initialData.downloadButtonText || "") ||
            productNameColor !== (initialData.productNameColor || "") ||
            fromEmail !== (initialData.fromEmail || "") ||
            sendTextEmailOnly !== (initialData.sendTextEmailOnly || false) ||
            showFiles !== (initialData.showFiles !== false) ||
            showCustomLinks !== (initialData.showCustomLinks !== false) ||
            showLicenseKeys !== (initialData.showLicenseKeys !== false) ||
            showProductQty !== (initialData.showProductQty !== false) ||
            templateUsedFor !== (initialData.templateUsedFor || "general")
        );
    }, [
        title,
        subject,
        updatedEmailSubject,
        customLinkButtonText,
        enableCustomLinkButton,
        downloadButtonText,
        productNameColor,
        fromEmail,
        sendTextEmailOnly,
        showFiles,
        showCustomLinks,
        showLicenseKeys,
        showProductQty,
        initialData,
        templateUsedFor,
    ]);

    // Function to discard changes and reset to initial data
    const handleDiscardChanges = useCallback(async () => {
        try {
            if (existingUnlayerJson) {
                emailEditorRef.current?.editor.loadDesign(existingUnlayerJson);
            }

            setTitle(initialData.title || "");
            setSubject(initialData.subject || "");
            setUpdatedEmailSubject(initialData.updatedEmailSubject || "");
            setCustomLinkButtonText(initialData.customLinkButtonText || "");
            setEnableCustomLinkButton(initialData.enableCustomLinkButton || false);
            setDownloadButtonText(initialData.downloadButtonText || "");
            setProductNameColor(initialData.productNameColor || "");
            setFromEmail(initialData.fromEmail || "");
            setSendTextEmailOnly(initialData.sendTextEmailOnly || false);
            setShowFiles(initialData.showFiles !== false);
            setShowCustomLinks(initialData.showCustomLinks !== false);
            setShowLicenseKeys(initialData.showLicenseKeys !== false);
            setShowProductQty(initialData.showProductQty !== false);
            setTemplateUsedFor(initialData.templateUsedFor || "general");
        } catch (error) {
            console.error("Error resetting editor content:", error);
        }

        setHasUnsavedChanges(false);
        shopify.saveBar.hide('edit-template-savebar');
    }, [initialData, shopify, existingUnlayerJson]);

    // Check if form is valid for SaveBar visibility (same as primaryAction disabled condition)
    const isFormValid = title && subject && downloadButtonText && (!enableCustomLinkButton || customLinkButtonText);

    // Function to get current editor content
    const getCurrentEditorContent = useCallback(() => {
        const unlayer = emailEditorRef.current?.editor;
        return unlayer ? JSON.stringify(unlayer.design) : "";
    }, []);

    // Set initial data after component loads
    useEffect(() => {
        if (!isLoadingEmailTemplate && !isInitialDataCaptured) {
            const initial = captureCurrentData();
            setInitialData(initial);
            setIsInitialDataCaptured(true);
        }
    }, [isLoadingEmailTemplate, captureCurrentData, isInitialDataCaptured]);

    const LANGUAGE_NAMES = {
        sv: 'Swedish',
        fr: 'French',
        es: 'Spanish',
        de: 'German',
        pt: 'Portuguese',
        nl: 'Dutch',
        da: 'Danish',
        zh: 'Chinese',
    };


    useEffect(() => {
        const fetchEmailTemplate = async () => {
            try {
                const url = isTranslation
                    ? `/api/get-template-translation/${id}`
                    : `/api/get-single-template/${id}`;
                const response = await fetch(url);
                const data = await response.json();
                setTemplate(data?.template)
                setExistingUnlayerJson(data?.template?.unlayer_json);
                setIsLoadingEmailTemplate(false)
                setTitle(data?.template?.title)
                setSubject(data?.template?.subject)
                setStatus(data?.template?.status)
                setCustomLinkButtonText(data?.template?.custom_link_button_text)
                setEnableCustomLinkButton(data?.template?.enable_custom_link_button)
                setUpdatedEmailSubject(data?.template?.updated_email_subject)
                setProductNameColor(data?.template?.product_name_color)
                setFromEmail(data?.template?.from_email)
                setSendTextEmailOnly(data?.template?.options?.sendTextEmailOnly ?? false)
                setShowFiles(data?.template?.options?.showFiles ?? true)
                setShowCustomLinks(data?.template?.options?.showCustomLinks ?? true)
                setShowLicenseKeys(data?.template?.options?.showLicenseKeys ?? true)
                setShowProductQty(data?.template?.options?.showProductQty ?? false)
                setTemplateUsedFor(data?.template?.template_used_for ?? "general")

            } catch (error) {
                console.error('Failed to fetch email template:', error);
            }
        };

        fetchEmailTemplate();
    }, [id, isTranslation, language]);

    useEffect(() => {
        shopify.loading(isLoadingEmailTemplate);
    }, [isLoadingEmailTemplate, shopify]);

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
                shopify.saveBar.show('edit-template-savebar');
            } else {
                shopify.saveBar.hide('edit-template-savebar');
            }
        }
    }, [hasDataChanged, getCurrentEditorContent, isInitialDataCaptured, isFormValid, initialData.editorContent, shopify]);

    useEffect(() => {
        if (!fromEmail && store?.name) {
            setFromEmail(store.name);
        }
    }, [store]);

    // const handleSave = useCallback( () => {
    // 	setSaving(true)
    // 	const unlayer = emailEditorRef.current?.editor;
    //   unlayer?.exportHtml(async (data) => {
    //    try {
    //           const response = await fetch(`/api/edit-template/${location.state.id}`, {
    //               method: 'PUT',
    //               headers: {
    //                   'Content-Type': 'application/json',
    //               },
    //               body: JSON.stringify({
    //                   unlayer_json: data?.design,
    //                   html: data?.html,
    //                   title: title
    //               }),
    //           });

    //           if (response.ok) {
    //            setShowToast(true);
    //            setToastMessage('Email template updated!');
    //            setSaving(false);

    //            await refetchStore();

    //        } else {
    //            setShowToast(true);
    //            setToastMessage('Failed to update email template.');
    //            setSaving(false)
    //        }


    //       } catch (error) {
    //           console.error('Failed to fetch email template:', error);
    //       }
    //   });

    //  }, [title]);

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

    const handleSave = useCallback((is_default = false) => {

        setSaving(true);

        const unlayer = emailEditorRef.current?.editor;

        const options = {
            sendTextEmailOnly,
            showFiles,
            showCustomLinks,
            showLicenseKeys,
            showProductQty
        };

        const isTranslation = location.state?.isTranslation === true;

        const apiUrl = isTranslation
            ? `/api/edit-template-translation/${location.state.id}`
            : `/api/edit-template/${location.state.id}`;

        unlayer?.exportHtml(async (data) => {
            try {
                const payload = {
                    unlayer_json: data?.design,
                    html: processEmailHTML(data?.html),
                    title,
                    subject,
                    updated_email_subject: updatedEmailSubject,
                    enable_custom_link_button: enableCustomLinkButton,
                    custom_link_button_text: customLinkButtonText,
                    download_button_text: downloadButtonText,
                    product_name_color: productNameColor,
                    fromEmail,
                    options,
                    status,
                    template_used_for: templateUsedFor
                };

                if (!isTranslation) {
                    payload.is_default = is_default === true ? true : template?.is_default;
                    payload.template_status = linkDetected ? "in_review" : "published";
                }

                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    shopify.toast.show(
                        t("settings.email_content.email_template_updated_successfully")
                    );

                    setSaving(false);
                    setInitialData(captureCurrentData());
                    setHasUnsavedChanges(false);
                    shopify.saveBar.hide('edit-template-savebar');
                    navigate('/EmailTemplates');

                } else {
                    throw new Error('Save failed');
                }

            } catch (error) {
                console.error(error);
                shopify.toast.show(
                    t("email_templates.failed_to_update"),
                    { isError: true, duration: 9999999 }
                );
                setSaving(false);
            }
        });

    }, [
        title,
        subject,
        updatedEmailSubject,
        customLinkButtonText,
        enableCustomLinkButton,
        downloadButtonText,
        productNameColor,
        fromEmail,
        status,
        sendTextEmailOnly,
        showFiles,
        showCustomLinks,
        showLicenseKeys,
        showProductQty,
        linkDetected,
        captureCurrentData,
        location.state,
        template,
        templateUsedFor
    ]);

    const handleTemplateStatus = useCallback(
        () => {
            setStatus((value) => !value)
        },
        []
    )

    const handleTitle = useCallback(
        (value) => setTitle(value),
        []
    )

    const handleSubject = useCallback(
        (value) => setSubject(value),
        []
    )

    const handleUpdatedEmailSubject = useCallback(
        (value) => setUpdatedEmailSubject(value),
        []
    )

    const handleCustomLinkButton = useCallback(
        (value) => setEnableCustomLinkButton(value),
        []
    )

    const handleCustomLinkButtonText = useCallback(
        (value) => setCustomLinkButtonText(value),
        []
    )

    const handleDownloadButtonText = useCallback(
        (value) => setDownloadButtonText(value),
        []
    )

    const handleProductNameColor = useCallback(
        (value) => setProductNameColor(value),
        []
    );

    // SaveBar action handlers
    const handleSaveBarSave = useCallback(async () => {
        await handleSave(false);
    }, [handleSave]);

    const handleSaveBarDiscard = useCallback(() => {
        handleDiscardChanges();
    }, [handleDiscardChanges]);

    function containsLink(html) {
        const links = [];

        // Remove DOCTYPE, <head>, <meta>, <xml>, and xmlns sections to avoid false positives
        const cleanedHtml = html
            .replace(/<!DOCTYPE[^>]*>/gi, '')
            .replace(/<head[\s\S]*?<\/head>/gi, '')
            .replace(/<meta[^>]*>/gi, '')
            .replace(/<\?xml[^>]*>/gi, '')
            .replace(/xmlns(:\w+)?="[^"]*"/gi, '')
            .replace(/<o:OfficeDocumentSettings>[\s\S]*?<\/o:OfficeDocumentSettings>/gi, '');

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
        const ignoreDomains = ['w3.org', 'schemas.microsoft.com', 'ogp.me'];
        const filteredLinks = links.filter(link => {
            const lower = link.toLowerCase();
            return !ignoreDomains.some(domain => lower.includes(domain));
        });


        return filteredLinks?.length > 0 ? true : false

    }

    const loadingMarkup = (isLoadingEmailTemplate) && (
        <SkeletonPage title={t("email_templates.untitled_template")} primaryAction fullWidth>
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
    )

    return <>
        {loadingMarkup}
        <SaveBar id="edit-template-savebar">
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
        {
            !isLoadingEmailTemplate ?

                <Page
                    title={ isTranslation ? `${title} (${LANGUAGE_NAMES[language] || language})` : title }
                    backAction={{
                        content: t("email_templates.back_to"),
                        onAction: async () => {
                            if (hasUnsavedChanges) {
                                await shopify.saveBar.leaveConfirmation();
                            }
                            navigate('/EmailTemplates');
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
                                disabled={template?.is_default || (!title || !subject || !updatedEmailSubject || !downloadButtonText || (enableCustomLinkButton && !customLinkButtonText))}
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
                        <Text as="span">{t("email_templates.link_detected")}</Text>
                    </InlineStack>
                }
                tone="warning"
            >
                <Text variant="headingMd" as="h6">
                    {t("email_templates.we_have_detected")}
                </Text>
            </Banner>
        ) : ''}


        <InlineStack gap="400">
            {
                showSettings ?
                <div
                                    style={{
                                        maxWidth: isMobile ? "100%" : "320px",
                                        minWidth: isMobile ? "100%" : "320px",
                                        width: isMobile ? "100%" : "auto",
                                    }}
                                >

                    <Card>
                        <BlockStack gap="400">
                            <Text variant="headingMd" as="h6">{t("email_templates.template_settings")}</Text>
                        </BlockStack>

                        <div
                            style={{
                                marginTop:
                                    "10px",
                            }}
                        >
                            <BlockStack>
                                <TextField
                                    label={t("email_templates.template_title")}
                                    value={title}
                                    onChange={handleTitle}
                                    autoComplete="off"
                                    helpText={
                                        <>
                                            {!title && (
                                                <span style={{ color: 'red', display: 'block' }}>{t("email_templates.this_field")}</span>
                                            )}
                                        </>
                                    }
                                />
                            </BlockStack>

                            <div
                                style={{
                                    marginTop:
                                        "10px",
                                }}
                            >
                                <BlockStack gap="400">
                                    <TextField
                                        label={t("email_templates.email_from_name")}
                                        value={fromEmail}
                                        onChange={setFromEmail}
                                        autoComplete="off"
                                    />
                                </BlockStack>
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        "10px",
                                }}
                            >
                                <BlockStack>
                                    <TextField
                                        label={t("email_templates.email_subject")}
                                        value={subject}
                                        onChange={handleSubject}
                                        autoComplete="off"
                                        helpText={
                                            <>
                                                <Text as="span">
                                                    <span><strong>&#123;order_name&#125; & &#123;product_name&#125; & &#123;first_name&#125; & &#123;last_name&#125;</strong> {t("settings.email_content.variables_available")}</span>
                                                </Text>

                                                {!subject && (
                                                    <span style={{ color: 'red', display: 'block' }}>{t("email_templates.this_field")}</span>
                                                )}
                                            </>
                                        }
                                    />
                                </BlockStack>
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        "10px",
                                }}
                            >
                                <BlockStack>
                                    <TextField
                                        label={t("email_templates.updated_email_subject")}
                                        value={updatedEmailSubject}
                                        onChange={handleUpdatedEmailSubject}
                                        autoComplete="off"
                                        helpText={
                                            <>
                                                <Text as="span">
                                                    <span><strong>&#123;order_name&#125; & &#123;product_name&#125;</strong> {t("settings.email_content.variables_available")}</span>
                                                </Text>
                                            </>
                                        }
                                    />
                                </BlockStack>
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        "10px",
                                }}
                            >
                                <Checkbox
                                    checked={enableCustomLinkButton}
                                    onChange={(newValue, _) => handleCustomLinkButton(newValue)}
                                    label={t("email_templates.show_custom_link")}
                                />

                                {
                                    enableCustomLinkButton ?
                                        <BlockStack>
                                            <TextField
                                                label={t("email_templates.custom_link_button_text")}
                                                value={customLinkButtonText}
                                                onChange={handleCustomLinkButtonText}
                                                autoComplete="off"
                                                helpText={
                                                    !customLinkButtonText ? (<span style={{ color: 'red' }}>{t("email_templates.this_field")}</span>) : ''
                                                }
                                            />
                                        </BlockStack>
                                        : ''
                                }
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
                                        helpText={t("settings.email_content.enter_hex_color_for_product_name")}
                                    />
                                </BlockStack>
                            </div>


                        </div>

                        <div style={{ marginTop: "10px", marginBottom: "10px" }} ></div>
                        <Card>
                            <BlockStack gap="400">
                                <Text variant="headingMd" as="h6">{t("email_templates.options")}</Text>
                            </BlockStack>

                            <div
                                style={{
                                    marginTop:
                                        "10px",
                                }}
                            >
                                <Checkbox
                                    label={t("email_templates.send_only_text_email")}
                                    checked={
                                        sendTextEmailOnly
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setSendTextEmailOnly(value)
                                    }
                                />
                                <div
                                    style={{
                                        marginTop:
                                            "10px",
                                    }}
                                >
                                    <Checkbox
                                        label={t("email_templates.show_files_downloads")}
                                        checked={
                                            showFiles
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            setShowFiles(value)
                                        }
                                    />
                                </div>
                                <div
                                    style={{
                                        marginTop:
                                            "10px",
                                    }}
                                >
                                    <Checkbox
                                        label={t("email_templates.show_custom_links")}
                                        checked={
                                            showCustomLinks
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            setShowCustomLinks(value)
                                        }
                                    />
                                </div>
                                <div
                                    style={{
                                        marginTop:
                                            "10px",
                                    }}
                                >
                                    <Checkbox
                                        label={t("email_templates.show_license_keys")}
                                        checked={
                                            showLicenseKeys
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            setShowLicenseKeys(value)
                                        }
                                    />
                                </div>
                                <div
                                    style={{
                                        marginTop:
                                            "10px",
                                    }}
                                >
                                    <Checkbox
                                        label={t("email_templates.show_product_quantity")}
                                        checked={
                                            showProductQty
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            setShowProductQty(value)
                                        }
                                    />
                                </div>
                            </div>
                            <Card>
                                <BlockStack gap="400">
                                    <Text variant="headingMd" as="h6">{t("email_templates.dynamic_template_option")}</Text>
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

                        <div style={{ marginTop: "10px", marginBottom: "10px" }} ></div>

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
                            {/* <Card> */}
                                <Box padding="4">
                                    <BlockStack gap="4">
                                        <Text variant="headingMd" as="h2">
                                            {/* Email Merge Tags */}
                                            {t("email_templates.merge_tags")}
                                        </Text>
                                        <Text variant="bodyMd" color="subdued">
                                           {t("email_templates.merge_tags_des")}
                                        </Text>
                                    </BlockStack>
                                </Box>
                                <div style={{ marginTop: "10px" }} ></div>
                                <Divider />
                                <div style={{ marginTop: "10px" }} ></div>
                                <Box padding="2">
                                    <BlockStack gap="200">
                                        {mergeTagsData.map((tagData, index) => (
                                            <Card key={index} subdued>
                                                <Box padding="3">
                                                    <BlockStack gap="200">
                                                        <InlineStack align="space-between" blockAlign="center">
                                                            <InlineStack gap="200" blockAlign="center">
                                                                <Badge tone={getCategoryColor(tagData.category)} size="small">
                                                                    {tagData.category}
                                                                </Badge>
                                                            </InlineStack>
                                                            <Button
                                                                variant="tertiary"
                                                                size="micro"
                                                                icon={expandedTags[index] ? ChevronUpIcon : ChevronDownIcon}
                                                                onClick={() => toggleExpanded(index)}
                                                                accessibilityLabel={`${expandedTags[index] ? 'Collapse' : 'Expand'} ${tagData.title}`}
                                                            />
                                                        </InlineStack>

                                                        <InlineStack align="space-between" blockAlign="start">
                                                            <BlockStack gap="200">
                                                                <Text variant="headingSm" as="h3">
                                                                    {tagData.title}
                                                                </Text>
                                                                <Button
                                                                    variant="tertiary"
                                                                    size="micro"
                                                                    textAlign="left"
                                                                    onClick={() => copyToClipboard(tagData.tag)}
                                                                    icon={ClipboardIcon}
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
                                                                        {tagData.tag}
                                                                    </Text>
                                                                </Button>
                                                            </BlockStack>
                                                        </InlineStack>

                                                        <Collapsible
                                                            open={expandedTags[index]}
                                                            id={`merge-tag-${index}`}
                                                            transition={{ duration: '200ms', timingFunction: 'ease-in-out' }}
                                                        >
                                                            <BlockStack gap="400">
                                                                <Divider />
                                                                <Text variant="bodyMd">
                                                                    {tagData.description}
                                                                </Text>
                                                                <Box background="bg-surface-secondary" padding="3" borderRadius="2">
                                                                    <BlockStack gap="200">
                                                                        <Text variant="bodyMd" fontWeight="semibold">
                                                                            {t("email_templates.example_output")}
                                                                        </Text>
                                                                        <Text variant="bodyMd" color="subdued" fontFamily="mono">
                                                                            {tagData.example.split('\n').map((line, i) => (
                                                                                <div key={i}>{line || ' '}</div>
                                                                            ))}
                                                                        </Text>
                                                                    </BlockStack>
                                                                </Box>
                                                            </BlockStack>
                                                        </Collapsible>
                                                    </BlockStack>
                                                </Box>
                                            </Card>
                                        ))}
                                    </BlockStack>
                                </Box>
                            {/* </Card> */}
                        </div>

                    </Card>
                </div>
                    : ''
            }

            <EmailEditor
                ref={emailEditorRef}
                minHeight="100vh"
                options={{
                    displayMode: 'email',
                    mergeTags: {
                        single_file_download_link: { name: t("email_templates.single_download_file_link"), value: "{{single_file_download_link}}" },
                        download_links: { name: t('email_templates.file_download_links'), value: '{{download_links}}' },
                        single_video_download_link: {
                            name: t("email_templates.single_video_download_link"),
                            value: "{{single_video_download_link}}",
                        },
                        video_links: {
                            name: t("email_templates.videos_download_links"),
                            value: "{{videos_links}}",
                        },
                        license_keys: { name: t("email_templates.license_key_code"), value: '{{license_keys}}' },
                        custom_links: { name: t("email_templates.custom_links"), value: '{{custom_links}}' },
                        download_page_button: { name: t("email_templates.download_page_button"), value: '{{download_page_button}}' },
                        first_name: { name: t("email_templates.customer_first_name"), value: '{{first_name}}' },
                        last_name: { name: t("email_templates.customer_last_name"), value: '{{last_name}}' },
                        order_name: { name: t("email_templates.order_id"), value: '{{order_name}}' },
                        single_license_key: {name: t("email_templates.multiline_keys_codes"), value: '{{single_license_key}}'},
                        one_key_code: {name: t("email_templates.single_key_code_only"), value: '{{one_key_code}}'},
                        first_product_name: {name: t("email_templates.product_name"), value: '{{first_product_name}}'},
                        first_product_price: {name: t("email_templates.product_price"), value: '{{first_product_price}}'},
                        first_product_image: {name: t("email_templates.product_image"), value: '{{first_product_image}}'},
                        qr_code: {name: t("email_templates.display_qr_code"), value: '{{qr_code}}'},
                        order_dynamic_property: {name: t("email_templates.dynamic_order_property"), value: '{{order.PROPERTY_REPLACE_HERE}}'}
                    },
                    mergeTagsConfig: {
                        sort: false
                    }
                }}
                onLoad={() => {
                    if (existingUnlayerJson) {
                        emailEditorRef.current?.editor.loadDesign(existingUnlayerJson)

                        emailEditorRef.current?.editor.addEventListener('design:updated', () => {
                            emailEditorRef.current?.editor.exportHtml((data) => {

                                const _linkDetected = containsLink(data?.html);

                                if (_linkDetected) {
                                    setLinkDetected(true)
                                } else {
                                    setLinkDetected(false)
                                }
                            })
                        })
                    }
                }}

                onReady={() => {
                    setShowSettings(true)
                    let _linkDetected = containsLink(template?.html)
                    if (_linkDetected) {
                        setLinkDetected(true)
                    } else {
                        setLinkDetected(false)
                    }
                }}
            />
        </InlineStack>
    </BlockStack>
			</Page >

			: ''
	  	}

	</>
};

export default EditTemplate
