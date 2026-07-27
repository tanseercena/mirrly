import React, { useState } from 'react';
import {
    Modal,
    TextContainer,
    Button,
    InlineStack,
    BlockStack,
    Spinner,
    Badge,
    Icon
} from '@shopify/polaris';
import { EmailIcon, ViewIcon } from '@shopify/polaris-icons';

export function EmailPreviewModal({
    isOpen,
    onClose,
    productId,
    productName,
    authenticatedFetch
}) {
    const [emailData, setEmailData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpen = async () => {
        setLoading(true);
        setError(null);
        setEmailData(null);

        try {
            const response = await authenticatedFetch(`/api/digital-product/${productId}/preview-update-email`);
            const data = await response.json();

            if (data.success) {
                setEmailData(data);
            } else {
                setError(data.message || 'Failed to generate email preview');
            }
        } catch (err) {
            setError('Network error: Failed to load email preview');
            console.error('Error loading email preview:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmailData(null);
        setError(null);
        onClose();
    };

    // Auto-load when modal opens
    React.useEffect(() => {
        if (isOpen && productId) {
            handleOpen();
        }
    }, [isOpen, productId]);

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title={
                <InlineStack gap="tight" align="center" blockAlign="center">
                    <Icon source={EmailIcon} />
                    <div style={{ fontSize: '20px', fontWeight: '600' }}>Email Preview</div>
                    {productName && (
                        <Badge tone="info">{productName}</Badge>
                    )}
                </InlineStack>
            }
            large
            primaryAction={{
                content: 'Close',
                onAction: handleClose,
            }}
            secondaryActions={[
                {
                    content: 'Refresh Preview',
                    onAction: handleOpen,
                    disabled: loading,
                    icon: ViewIcon,
                },
            ]}
        >
            <Modal.Section>
                {loading ? (
                    <BlockStack gap="loose" alignment="center">
                        <Spinner size="large" />
                        <TextContainer>
                            <p>Generating email preview...</p>
                        </TextContainer>
                    </BlockStack>
                ) : error ? (
                    <TextContainer>
                        <p style={{ color: '#bf0711' }}>{error}</p>
                    </TextContainer>
                ) : emailData ? (
                    <div>
                        {/* Email Subject */}
                        <div style={{
                            marginBottom: '16px',
                            padding: '12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '4px',
                            border: '1px solid #e1e3e5'
                        }}>
                            <InlineStack gap="tight" blockAlign="start">
                                <TextContainer>
                                    <p style={{
                                        fontWeight: '600',
                                        color: '#202223',
                                        margin: '0 0 4px 0'
                                    }}>
                                        Subject: {emailData.subject}
                                    </p>
                                </TextContainer>
                            </InlineStack>
                        </div>

                        {/* Email Preview Frame */}
                        <div style={{
                            border: '1px solid #e1e3e5',
                            borderRadius: '4px',
                            backgroundColor: '#ffffff',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                backgroundColor: '#f6f6f7',
                                padding: '8px 12px',
                                borderBottom: '1px solid #e1e3e5',
                                fontSize: '12px',
                                color: '#6d7175',
                                fontWeight: '500'
                            }}>
                                Email Preview
                            </div>
                            <div
                                style={{
                                    height: '500px',
                                    overflow: 'auto',
                                    padding: '0'
                                }}
                            >
                                <iframe
                                    srcDoc={emailData.html}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                        display: 'block'
                                    }}
                                    title="Email Preview"
                                    sandbox="allow-same-origin"
                                />
                            </div>
                        </div>

                        {/* Preview Notice */}
                        <div style={{
                            marginTop: '12px',
                            padding: '8px 12px',
                            backgroundColor: '#f0f9ff',
                            borderRadius: '4px',
                            border: '1px solid #bfdbfe'
                        }}>
                            <TextContainer>
                                <p style={{
                                    margin: '0',
                                    fontSize: '12px',
                                    color: '#1e40af'
                                }}>
                                    <strong>Preview Mode:</strong> This is a sample email with test data.
                                    License keys shown are samples and will be different in actual emails.
                                </p>
                            </TextContainer>
                        </div>
                    </div>
                ) : null}
            </Modal.Section>
        </Modal>
    );
}
