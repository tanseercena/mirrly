import { Banner, Modal, Text, TextField } from '@shopify/polaris';
import React, { useContext, useState } from 'react';
import { AppContext } from './providers/AppProvider';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { useTranslation } from "react-i18next";
import { isCardDismissed, dismissCard } from "../utils/sessionStorage.js";

export function ReviewBanner() {
    const { showReviewBanner, setShowReviewBanner, store } = useContext(AppContext);
    const [ratingSelected, setRatingSelected] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const { t } = useTranslation();

    if (isCardDismissed('dashboard_review_banner')) {
        return null;
    }

    function handleChange(value) {
        setRating(value);

        if (value === 5) {
            window.open(
                'https://apps.shopify.com/digitally-digital-products#modal-show=WriteReviewModal',
                '_blank'
            );
            dismissReviewBanner();
        } else {
            setRatingSelected(true);
        }
    }

    async function dismissReviewBanner() {
        setShowReviewBanner(false);
        dismissCard('dashboard_review_banner');
    }

    async function saveFeedback() {
        setIsSaving(true);

        await fetch('/api/send-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rating,
                feedback
            }),
        });

        setIsSaving(false);
        setRatingSelected(false);
        dismissReviewBanner();
    }

    return (
        <>
            <Modal
                open={ratingSelected && rating < 5}
                onClose={() => setRatingSelected(false)}
                title={t("dashboard.provide_feedback")}
                primaryAction={{
                    content: t("dashboard.submit_feedback"),
                    onAction: saveFeedback,
                    loading: isSaving
                }}
            >
                <Modal.Section>
                    <TextField
                        label={t("dashboard.your_feedback")}
                        value={feedback}
                        onChange={setFeedback}
                        multiline={4}
                        autoComplete="off"
                    />
                </Modal.Section>
            </Modal>

            {showReviewBanner && (
                <Banner
                    title={t("dashboard.enjoyed_app")}
                    tone="warning"
                    onDismiss={dismissReviewBanner}
                >
                    <Text as="p">
                        {t("dashboard.take_moment")}
                    </Text>
                    <Rating
                        style={{ maxWidth: 250 }}
                        value={rating}
                        onChange={handleChange}
                    />
                </Banner>
            )}
        </>
    );
}

export default ReviewBanner;
