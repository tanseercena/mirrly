import { useEffect } from 'react';
import { Button, Text } from '@shopify/polaris';
import './CustomModal.css';

const CustomModal = ({
    open = false,
    onClose,
    title,
    primaryAction,
    secondaryActions,
    loading = false,
    children,
    size = 'medium' // small, medium, large
}) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.classList.add('custom-modal-open');
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
        } else {
            document.body.classList.remove('custom-modal-open');
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        return () => {
            document.body.classList.remove('custom-modal-open');
            document.body.style.position = '';
            document.body.style.top = '';
        };
    }, [open]);

    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handlePrimaryAction = () => {
        if (primaryAction?.onAction && !primaryAction.disabled) {
            primaryAction.onAction();
        }
    };

    return (
        <div className="custom-modal-backdrop" onClick={handleBackdropClick}>
            <div className={`custom-modal-container custom-modal-${size}`} role="dialog" aria-modal="true" aria-labelledby="custom-modal-title">
                {/* Header */}
                <div className="custom-modal-header">
                    <Text variant="headingMd" as="h2" id="custom-modal-title">
                        {title}
                    </Text>
                    <button
                        className="custom-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                        disabled={loading}
                        type="button"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="custom-modal-body">
                    {loading ? (
                        <div className="custom-modal-loading">
                            <div className="custom-modal-spinner"></div>
                            <Text variant="bodyMd" as="p">
                                Please wait...
                            </Text>
                        </div>
                    ) : (
                        children
                    )}
                </div>

                {/* Footer */}
                {(primaryAction || secondaryActions) && (
                    <div className="custom-modal-footer">
                        <div className="custom-modal-actions">
                            {secondaryActions?.map((action, index) => (
                                <Button
                                    key={index}
                                    variant={action.variant || 'secondary'}
                                    tone={action.tone}
                                    onClick={action.onAction}
                                    disabled={loading || action.disabled}
                                >
                                    {action.content}
                                </Button>
                            ))}
                            {primaryAction && (
                                <Button
                                    variant={primaryAction.variant || 'primary'}
                                    tone={primaryAction.tone}
                                    onClick={handlePrimaryAction}
                                    disabled={loading || primaryAction.disabled}
                                >
                                    {primaryAction.content}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CustomModalSection = ({ children, className = '' }) => {
    return (
        <div className={`custom-modal-section ${className}`}>
            {children}
        </div>
    );
};

export default CustomModal;
