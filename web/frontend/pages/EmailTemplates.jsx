import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
    Page,
    EmptyState,
    Layout,
    Card,
    TextField,
    Modal,
    Button,
    Frame,
    Spinner,
    RadioButton,
    Text,
    SkeletonPage,
    SkeletonBodyText,
    BlockStack,
    InlineStack,
    DataTable,
    Thumbnail,
    InlineGrid,
    Banner,
    Select,
    Divider
} from '@shopify/polaris';
import EmailEditor from 'react-email-editor';
import { useAppBridge } from "@shopify/app-bridge-react"
import { AppContext } from '../components/providers/AppProvider'
import { EditIcon, DeleteIcon, PlusIcon, DuplicateIcon } from '@shopify/polaris-icons'; // Added DuplicateIcon
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { useNavigate } from "react-router-dom";


const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="10" fill="none" stroke="green" strokeWidth="2" />
        <path d="M7 12l3 3 7-7" fill="none" stroke="green" strokeWidth="2" />
    </svg>
);

const WhiteCheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="2" />
        <path d="M7 12l3 3 7-7" fill="none" stroke="white" strokeWidth="2" />
    </svg>
);



export default function EmailTemplates() {

    const shopify = useAppBridge()
    const { store, refetchStore } = useContext(AppContext)
    const navigate = useNavigate()
    const emailEditorRef = useRef(null);

    // Inject responsive grid CSS
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            
            .responsive-template-grid {
                display: grid !important;
                grid-template-columns: repeat(1, 1fr) !important;
                gap: 1rem !important;
            }
            @media (min-width: 768px) {
                .responsive-template-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            @media (min-width: 1024px) {
                .responsive-template-grid {
                    grid-template-columns: repeat(3, 1fr) !important;
                }
            }
            @media (min-width: 1280px) {
                .responsive-template-grid {
                    grid-template-columns: repeat(4, 1fr) !important;
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('<p>Hello {first_name},</p><p>Thanks for your order #{order_name}.</p>');
    const [saving, setSaving] = useState(false);
    const [existingUnlayerJson, setExistingUnlayerJson] = useState(null)
    const [isLoadingEmailTemplates, setIsLoadingEmailTemplates] = useState(true)
    const [templateType, setTemplateType] = useState('default')
    const [emailTemplates, setEmailTemplates] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isConfirmDeleteModalActive, setIsConfirmDeleteModalActive] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [templateToDelete, setTemplateToDelete] = useState(null);
    
    // New States for Duplication
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [templateToDuplicate, setTemplateToDuplicate] = useState(null);
    const [duplicateTemplateName, setDuplicateTemplateName] = useState('');
    const [isDuplicating, setIsDuplicating] = useState(false);

    const { t } = useTranslation()
    const [selectedTemplate, setSelectedTemplate] = useState(t("email_templates.clean_minimal"))
    const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
    const [templateToTranslate, setTemplateToTranslate] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [templateTranslations, setTemplateTranslations] = useState({});
    const [selectedTranslationId, setSelectedTranslationId] = useState('');
    const [isFetchingTranslations, setIsFetchingTranslations] = useState(false);
    const [showUpgradeBanner, setShowUpgradeBanner] = useState(() => {
        return sessionStorage.getItem('emailTemplatesUpgradeBannerDismissed') !== 'true';
    });

    useEffect(() => {
        if (store.finish_onboarding === 0) {
            refetchStore();
        }
    }, [refetchStore, store.finish_onboarding]);

    useEffect(() => {
        shopify.loading(isLoadingEmailTemplates);
    }, [isLoadingEmailTemplates, shopify]);


    const fetchEmailTemplate = async (page = 1) => {
        // refetchStore();
        try {
            const response = await fetch(`/api/get-email-templates?page=${page}`);
            const data = await response.json();
            setEmailTemplates(data?.templates)
            setIsLoadingEmailTemplates(false)
            setCurrentPage(data.current_page)
            setLastPage(data.last_page)
        } catch (error) {
            console.error('Failed to fetch email template:', error);
        }
    };

    const handlePricing = () => navigate("/pricing");

    useEffect(() => {
        fetchEmailTemplate(currentPage);
    }, [currentPage]);


    const handleNext = () => {
        if (currentPage < lastPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const updateTemplate = async (id) => {
        navigate("/EditTemplate", { state: { id: id } })
    };


    const toggleToast = useCallback(
        () => setShowToast((showToast) => !showToast),
        []
    )

    const handleAddTemplate = () => {
        navigate('/AddTemplate', {
            state: {
                selectedTemplate: selectedTemplate
            }
        })
    }

    const handleDeleteTemplate = useCallback(async (template) => {

        setIsDeleting(true)

        const response = await fetch(`/api/delete-email-template/${template.id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        // console.log(response)
        if (response.ok) {
            setIsDeleting(false)
            shopify.toast.show(t("settings.email_content.email_template_deleted_successfully"));
            fetchEmailTemplate(currentPage)

        } else {
            // Error
            shopify.toast.show(t("settings.email_content.failed_to_delete_email_template"), { isError: true, duration: 9999999 });
        }


    }, [])

    const toggleTemplateModal = () => {
        setIsTemplateModalOpen(!isTemplateModalOpen)
    };

    const handleSelectedTemplate = (value) => {
        setSelectedTemplate(value);
    };

    // --- Duplication Handlers ---
    const openDuplicateModal = (template) => {
        setTemplateToDuplicate(template);
        // Set default name to Original Name + (Copy)
        setDuplicateTemplateName(template.title); 
        setIsDuplicateModalOpen(true);
    };

    const closeDuplicateModal = () => {
        setIsDuplicateModalOpen(false);
        setTemplateToDuplicate(null);
        setDuplicateTemplateName('');
    };

    const handleDuplicateTemplate = async () => {
        if (!duplicateTemplateName.trim() || !templateToDuplicate) return;
        
        setIsDuplicating(true);

        try {
            // NOTE: Ensure this API endpoint exists in your backend.
            // It should accept the ID and the new Title.
            const response = await fetch(`/api/duplicate-email-template/${templateToDuplicate.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: duplicateTemplateName }),
            });

            const data = await response.json();

            if (response.ok) {
                shopify.toast.show(t("email_templates.template_duplicated_successfully"));
                fetchEmailTemplate(currentPage); // Refresh the list
                closeDuplicateModal();
            } else {
                shopify.toast.show(data.message || t("email_templates.failed_to_duplicate_template"), { isError: true });
            }
        } catch (error) {
            console.error('Error duplicating template:', error);
            shopify.toast.show(t("email_templates.failed_to_duplicate_template"), { isError: true });
        } finally {
            setIsDuplicating(false);
        }
    };
    // -----------------------------

    const LANGUAGE_OPTIONS = [
        { label: "Spanish", value: "es" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Danish", value: "da" },
        { label: "Portuguese", value: "pt" },
        { label: "Dutch", value: "nl" },
        { label: "Swedish", value: "sv" },
        { label: "Chinese", value: "zh" },
    ];

    const handleCreateTranslation = async () => {
        if (!templateToTranslate || !selectedLanguage) return;

        const response = await fetch(
            `/api/email-templates/${templateToTranslate.id}/translate`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language: selectedLanguage }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            shopify.toast.show(t("email_templates.translation_created"));
            navigate("/EditTemplate", {
                state: {
                    id: data.id,
                    isTranslation: true,
                    language: selectedLanguage,
                },
            });
        } else {
            shopify.toast.show(data.message || t("email_templates.translation_failed"), {
                isError: true,
            });
        }
    };

    const handleDeleteTranslation = async (translationId, templateId) => {
        try {
            const response = await fetch(
                `/api/email-templates/translation/${translationId}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                shopify.toast.show(
                    t("email_templates.translation_deleted_successfully")
                );

                const res = await fetch(
                    `/api/email-templates/${templateId}/translations`
                );
                const data = await res.json();

                setTemplateTranslations(prev => ({
                    ...prev,
                    [templateId]: data.translations || []
                }));
            } else {
                throw new Error("Delete failed");
            }
        } catch (error) {
            console.error(error);
            shopify.toast.show(
                t("email_templates.failed_to_delete_translation"),
                { isError: true, duration: 9999999 }
            );
        }
    };

    const loadingMarkup = (isLoadingEmailTemplates) && (
        <SkeletonPage title={t("email_templates.skeleton_title")} primaryAction fullWidth>
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
        {
            !isLoadingEmailTemplates ?
              
                    <Page
                        title={t("email_templates.title")}
                        primaryAction={
                                        <Button disabled={store && store?.plan && store?.plan?.name == 'free' && emailTemplates.length > 0} variant="primary" onClick={toggleTemplateModal} textAlign="end">
                                            {t("email_templates.add_new_template")}
                                        </Button>
                        }
                        secondaryActions={
                            <LanguageSelector />
                        }
                    >
                  
                  
                    {store && store?.plan && store?.plan?.name == 'free' && emailTemplates.length > 0 && showUpgradeBanner && (
                        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                            <Banner tone="warning" title={t("settings.email_content.upgrade_your_plan")} onDismiss={() => {
                                setShowUpgradeBanner(false);
                                sessionStorage.setItem('emailTemplatesUpgradeBannerDismissed', 'true');
                            }}>
                                <Text variant="bodyMd" as="p">
                                    {t("settings.email_content.upgrade_unlock_more_email_templates")}
                                </Text>
                                <div style={{ marginTop: "5px" }}></div>
                                <Button variant="primary" onClick={handlePricing}>{t("settings.email_content.upgrade_now")}</Button>
                            </Banner>
                        </div>
                    )}

                    {
                        emailTemplates?.length > 0
                            ?
                            <BlockStack gap="400">
                                <DataTable
                                    columnContentTypes={[
                                        'text',
                                        'text',
                                        'text',
                                        'text',
                                        'text',
                                        'text'

                                    ]}
                                    headings={[
                                        t("email_templates.id"),
                                        t("email_templates.name"),
                                        t("email_templates.created_at"),
                                        t("email_templates.default_template"),
                                        t("email_templates.status"),
                                        t("email_templates.action")
                                    ]}

                                    pagination={{
                                        hasNext: currentPage < lastPage,
                                        hasPrevious: currentPage > 1,
                                        onNext: handleNext,
                                        onPrevious: handlePrevious
                                    }}

                                    rows={emailTemplates.map(template => [
                                        template.id,
                                        template.title,
                                        template.created_at,
                                        template.is_default ? t("email_templates.yes") : t("email_templates.no"),
                                        template.template_status === "in_review" ? t("email_templates.in_review") : template.template_status === "published" ? t("email_templates.published") : t("email_templates.not_approved"),
                                        <InlineStack gap="200">
                                            <Button
                                                variant="secondary"
                                                icon={PlusIcon}
                                                onClick={async () => {
                                                    setTemplateToTranslate(template);
                                                    setIsTranslateModalOpen(true);
                                                    setIsFetchingTranslations(true);

                                                    try {
                                                        const response = await fetch(`/api/email-templates/${template.id}/translations`);
                                                        const data = await response.json();

                                                        setTemplateTranslations(prev => ({
                                                            ...prev,
                                                            [template.id]: data.success ? data.translations : []
                                                        }));
                                                    } catch (error) {
                                                        console.error("Failed to fetch translations:", error);
                                                        setTemplateTranslations(prev => ({ ...prev, [template.id]: [] }));
                                                    } finally {
                                                        setIsFetchingTranslations(false);
                                                    }
                                                }}
                                                >
                                                {t("email_templates.translate")}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                icon={EditIcon}
                                                onClick={() => { updateTemplate(template.id) }}
                                            >
                                                {t("email_templates.edit")}
                                            </Button>
                                            {/* DUPLICATE BUTTON ADDED HERE */}
                                            <Button
                                                variant="secondary"
                                                icon={DuplicateIcon}
                                                onClick={() => openDuplicateModal(template)}
                                            >
                                                {t("digtal_product_listing.duplicate")}
                                            </Button>
                                            <Button
                                                icon={DeleteIcon}
                                                variant="primary"
                                                tone="critical"
                                                loading={isDeleting}
                                                disabled={isDeleting}
                                                onClick={() => {
                                                    setTemplateToDelete(template);
                                                    setIsConfirmDeleteModalActive(true);
                                                }}>
                                                {t("email_templates.delete")}
                                            </Button>
                                        </InlineStack>

                                    ])}
                                />
                            </BlockStack>
                            :
                            <Card>
                                <EmptyState
                                    heading={t("email_templates.manage_email_templates")}
                                    action={{ content: t("email_templates.add_template"), onAction: toggleTemplateModal }}
                                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                                >
                                    <p>{t("email_templates.create_a_new")}</p>
                                </EmptyState>
                            </Card>
                    }

                    <Modal
                        open={isTranslateModalOpen}
                        onClose={() => setIsTranslateModalOpen(false)}
                        title={t("email_templates.translate_template")}
                        size="small"
                    >
                        <Modal.Section>
                            {isFetchingTranslations ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                    <Spinner accessibilityLabel="Loading translations" size="large" />
                                </div>
                            ) : (
                                <>
                                    {templateToTranslate && templateTranslations[templateToTranslate.id]?.length > 0 && (
                                        <>
                                            <Text variant="headingMd" as="h3">
                                                {t("email_templates.existing_translations")}
                                            </Text>

                                            <div style={{ marginTop: '12px', overflowX: 'auto' }}>
                                                <DataTable
                                                    columnContentTypes={['text', 'text', 'text', 'text']}
                                                    headings={[
                                                        t("email_templates.name"),
                                                        t("email_templates.select_language"),
                                                        t("email_templates.status"),
                                                        t("email_templates.action"),
                                                    ]}
                                                    rows={templateTranslations[templateToTranslate.id].map(tr => [
                                                        tr.title,
                                                        tr.language.toUpperCase(),
                                                        tr.template_status === "in_review" ? t("email_templates.in_review") : tr.template_status === "published" ? t("email_templates.published") : t("email_templates.not_approved"),
                                                        <InlineStack gap="200" blockAlign="center">
                                                            <Button
                                                                variant="secondary"
                                                                size="slim"
                                                                onClick={() => {
                                                                    navigate("/EditTemplate", {
                                                                        state: {
                                                                            id: tr.id,
                                                                            isTranslation: true,
                                                                            language: tr.language,
                                                                        },
                                                                    });
                                                                }}
                                                            >
                                                                {t("email_templates.edit")}
                                                            </Button>
                                                            

                                                            

                                                            <Button
                                                                variant="primary"
                                                                tone="critical"
                                                                size="slim"
                                                                onClick={() =>
                                                                    handleDeleteTranslation(tr.id, templateToTranslate.id)
                                                                }
                                                            >
                                                                {t("email_templates.delete")}
                                                            </Button>
                                                        </InlineStack>
                                                    ])}
                                                />
                                            </div>
                                            <Divider />
                                        </>
                                    )}
                                </>
                            )}

                            <div style={{ marginTop: 15 }}></div>
                            <Text variant="headingMd" as="h3">
                                {t("email_templates.create_translation")}
                            </Text>

                            <Select
                                label={t("email_templates.select_language")}
                                labelInline
                                options={LANGUAGE_OPTIONS.filter(
                                    opt =>
                                    !templateTranslations[templateToTranslate?.id]?.some(
                                        tr => tr.language === opt.value
                                    )
                                )}
                                value={selectedLanguage}
                                onChange={setSelectedLanguage}
                            />

                            <div style={{ marginTop: 12 }}>
                                <Button variant="primary" onClick={handleCreateTranslation} fullWidth>
                                    {t("email_templates.create_translation")}
                                </Button>
                            </div>
                        </Modal.Section>
                    </Modal>

                    {/* DUPLICATE MODAL ADDED HERE */}
                    <Modal
                        open={isDuplicateModalOpen}
                        onClose={closeDuplicateModal}
                        title={t("digtal_product_listing.duplicate")}
                        primaryAction={{
                            content: t("digtal_product_listing.duplicate"),
                            onAction: handleDuplicateTemplate,
                            loading: isDuplicating,
                        }}
                        secondaryActions={[
                            {
                                content: t("email_templates.cancel"),
                                onAction: closeDuplicateModal,
                            }
                        ]}
                    >
                        <Modal.Section>
                            <TextField
                                label={t("email_templates.template_title")}
                                value={duplicateTemplateName}
                                onChange={setDuplicateTemplateName}
                                autoComplete="off"
                                helpText={
                                <>
                                    {!duplicateTemplateName && (
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
                        </Modal.Section>
                    </Modal>

                    <Modal
                        size="large"
                        open={isTemplateModalOpen}
                        onClose={toggleTemplateModal}
                        title={t("email_templates.choose_email_template")}
                        primaryAction={{ content: t("email_templates.choose"), onAction: handleAddTemplate }}
                        secondaryActions={[{ content: t("email_templates.cancel"), onAction: toggleTemplateModal }]}
                    >

                        <Modal.Section>
                            <div className="responsive-template-grid">

                                <div style={{
                                    position: "relative",
                                    padding: '8px 12px',
                                    border: '1px solid lightgray',
                                    borderRadius: '.75rem',
                                    backgroundColor: selectedTemplate === 'clean-minimal' ? '#f1f1f1' : 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleSelectedTemplate('clean-minimal')}
                                >

                                    {
                                        selectedTemplate === 'clean-minimal' ?
                                            <span style={{ position: "absolute", right: '12px', top: '8px', zIndex: 1 }}>
                                                <CheckmarkIcon />
                                            </span>
                                            : ''
                                    }

                                    <div>
                                        <img style={{ width: "100%", height: 'auto', display: 'block' }} src="/images/clean-minimal.png" alt={t("email_templates.clean_minimal_")} />
                                    </div>

                                    <div style={{ marginTop: "8px" }}>
                                        <Text variant="headingMd" as="h6">{t("email_templates.clean_minimal_")}</Text>
                                    </div>

                                    <div style={{ marginTop: "4px" }}>
                                        <Text variant="bodySm">{t("email_templates.clean_minimal_desc")}</Text>
                                    </div>

                                    <div style={{ marginTop: "8px" }}>
                                        <InlineStack gap="200">
                                            {selectedTemplate === 'clean-minimal' ?
                                                <Button variant="primary" size="slim" fullWidth>{t("email_templates.selected")}</Button>
                                                :
                                                <Button size="slim" fullWidth onClick={(e) => { e.stopPropagation(); handleSelectedTemplate('clean-minimal'); }}>{t("email_templates.select")}</Button>
                                            }
                                        </InlineStack>
                                    </div>
                                </div>

                                <div style={{
                                    position: "relative",
                                    borderRadius: '.75rem',
                                    border: '1px solid lightgray',
                                    padding: '8px 12px',
                                    backgroundColor: selectedTemplate === 'modern-blue' ? '#f1f1f1' : 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleSelectedTemplate('modern-blue')}
                                >

                                    {
                                        selectedTemplate === 'modern-blue' ?
                                            <span style={{ position: "absolute", right: '12px', top: '8px', zIndex: 1 }}>
                                                <CheckmarkIcon />
                                            </span>
                                            : ''
                                    }

                                    <div>
                                        <img style={{ width: "100%", height: 'auto', display: 'block' }} src="/images/modern-blue.png" alt={t("email_templates.modern_blue")} />
                                    </div>

                                    <div style={{ marginTop: "8px" }}>
                                        <Text variant="headingMd" as="h6">{t("email_templates.modern_blue")}</Text>
                                    </div>

                                    <div style={{ marginTop: "4px" }}>
                                        <Text variant="bodySm">{t("email_templates.modern_blue_desc")}</Text>
                                    </div>

                                    <div style={{ marginTop: "8px" }}>
                                        <InlineStack gap="200">
                                            {selectedTemplate === 'modern-blue' ?
                                                <Button variant="primary" size="slim" fullWidth>{t("email_templates.selected")}</Button>
                                                :
                                                <Button size="slim" fullWidth onClick={(e) => { e.stopPropagation(); handleSelectedTemplate('modern-blue'); }}>{t("email_templates.select")}</Button>
                                            }
                                        </InlineStack>
                                    </div>
                                </div>

                                <div style={{
                                    position: "relative",
                                    borderRadius: '.75rem',
                                    border: '1px solid lightgray',
                                    padding: '8px 12px',
                                    backgroundColor: selectedTemplate === 'minimal-dark' ? '#f1f1f1' : 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleSelectedTemplate('minimal-dark')}
                                >
                                    {
                                        selectedTemplate === 'minimal-dark' ?
                                            <span style={{ position: "absolute", right: '12px', top: '8px', zIndex: 1 }}>
                                                <WhiteCheckmarkIcon />
                                            </span>
                                            : ''
                                    }

                                    <div>
                                        <img style={{ width: "100%", height: 'auto', display: 'block' }} src="/images/minimal-dark.png" alt={t("email_templates.minimal_dark")} />
                                    </div>

                                    <div style={{ marginTop: "8px" }}>
                                        <Text variant="headingMd" as="h6">{t("email_templates.minimal_dark")}</Text>
                                    </div>

                                    <div style={{ marginTop: "4px" }}>
                                        <Text variant="bodySm">{t("email_templates.minimal_dark_desc")}</Text>
                                    </div>

                                    <div style={{ marginTop: "8px" }}>
                                        <InlineStack gap="200">
                                            {selectedTemplate === 'minimal-dark' ?
                                                <Button variant="primary" size="slim" fullWidth>{t("email_templates.selected")}</Button>
                                                :
                                                <Button size="slim" fullWidth onClick={(e) => { e.stopPropagation(); handleSelectedTemplate('minimal-dark'); }}>{t("email_templates.select")}</Button>
                                            }
                                        </InlineStack>
                                    </div>
                                </div>

                                <div style={{
                                    position: "relative",
                                    border: '1px solid lightgray',
                                    borderRadius: '.75rem',
                                    padding: '8px 12px',
                                    backgroundColor: selectedTemplate === 'vibrant-orange' ? '#f1f1f1' : 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleSelectedTemplate('vibrant-orange')}
                                >
                                    {
                                        selectedTemplate === 'vibrant-orange' ?
                                            <span style={{ position: "absolute", right: '12px', top: '8px', zIndex: 1 }}>
                                                <CheckmarkIcon />
                                            </span>
                                            : ''
                                    }

                                    <div>
                                        <img style={{ width: "100%", height: 'auto', display: 'block' }} src="/images/vibrant-orange.png" alt={t("email_templates.vibrant_orange")} />
                                    </div>

                                    <div style={{ marginTop: "8px" }}>
                                        <Text variant="headingMd" as="h6">{t("email_templates.vibrant_orange")}</Text>
                                    </div>

                                    <div style={{ marginTop: "4px" }}>
                                        <Text variant="bodySm">{t("email_templates.vibrant_orange_desc")}</Text>
                                    </div>

                                    <div style={{ marginTop: "8px" }}>
                                        <InlineStack gap="200">
                                            {selectedTemplate === 'vibrant-orange' ?
                                                <Button variant="primary" size="slim" fullWidth>{t("email_templates.selected")}</Button>
                                                :
                                                <Button size="slim" fullWidth onClick={(e) => { e.stopPropagation(); handleSelectedTemplate('vibrant-orange'); }}>{t("email_templates.select")}</Button>
                                            }
                                        </InlineStack>
                                    </div>
                                </div>
                            </div>
                        </Modal.Section>
                    </Modal>

                    {templateToDelete && (
                        <Modal
                            open={isConfirmDeleteModalActive}
                            onClose={() => setIsConfirmDeleteModalActive(false)}
                            title={t("email_templates.confirm_delete")}
                            primaryAction={{
                                destructive: true,
                                disabled: isDeleting || templateToDelete.is_default,
                                content: `${t("email_templates.delete")}`,
                                onAction: async () => {
                                    await handleDeleteTemplate(templateToDelete);
                                    setIsConfirmDeleteModalActive(false);
                                },
                            }}
                        >
                            <Modal.Section>
                                <Text variant="bodyMd" as="p">
                                    {t("email_templates.confirm_delete_desc")}
                                </Text>
                                {templateToDelete.is_default ?  (
                                    <>
                                        <div style={{marginTop: "10px"}}></div>
                                        <Text variant="bodyMd" as="p">
                                            {t('email_templates.email_template_default_delete_msg')}
                                        </Text>
                                    </>
                                ) : ''}
                            </Modal.Section>
                        </Modal>
                    )}
                   

                </Page>
            
            : ''
        }
    </>
};