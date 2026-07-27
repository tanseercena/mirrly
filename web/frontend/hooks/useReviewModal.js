import { useState, useEffect, useRef } from "react";
import { useReview } from "../components/providers/ReviewProvider";

/**
 * Custom hook to manage the Shopify Review Modal display logic
 *
 * This hook handles:
 * - Detecting mobile devices (reviews not supported on mobile)
 * - Timing the review modal check (not on app open, but after navigation)
 * - Calling the review API at the appropriate moment
 * - Preventing duplicate requests
 *
 * @param {Object} options - Configuration options
 * @param {number} options.delay - Delay in milliseconds before checking eligibility (default: 3000ms)
 * @param {string} options.triggerContext - The context triggering the review (default: 'dashboard')
 * @param {boolean} options.enabled - Whether the hook is enabled (default: true)
 * @returns {Object} - { shouldShowReview, requestReview, hasRequested, isChecking }
 */
export const useReviewModal = (options = {}) => {

    const {
        delay = 3000, // 3 seconds default delay
        triggerContext = 'dashboard',
        enabled = true,
    } = options;

    const {
        checkAndRequest,
        isEligible,
        isLoading,
        hasChecked,
    } = useReview();

    const [shouldShowReview, setShouldShowReview] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const timeoutRef = useRef(null);
    const hasTriggeredRef = useRef(false);

    /**
     * Detect if the user is on a mobile device
     * Shopify doesn't show review modals on mobile
     */
    const isMobile = () => {
        if (typeof window === 'undefined') return false;

        // Check user agent
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

        // Also check screen width as a fallback
        const isMobileWidth = window.innerWidth <= 768;

        return mobileRegex.test(userAgent) || isMobileWidth;
    };

    /**
     * Trigger the review modal check and request
     * This should be called after the delay has passed
     */
    const triggerReview = async () => {

        if (hasTriggeredRef.current || hasRequested) {
            return;
        }

        // Prevent mobile
        if (isMobile()) {
            setHasRequested(true);
            return;
        }


        hasTriggeredRef.current = true;
        setIsChecking(true);

        try {
            // Check eligibility and request review if eligible
            const success = await checkAndRequest(triggerContext);


            if (success) {
                setShouldShowReview(true);
            }

            setHasRequested(true);
        } catch (error) {
        } finally {
            setIsChecking(false);
        }
    };

    /**
     * Manually request the review modal
     * This can be called from a button or other user action
     * Note: Shopify recommends against triggering on button click due to rate limiting
     */
    const requestReview = async () => {
        await triggerReview();
    };

    /**
     * Reset the hook state (useful for testing or special cases)
     */
    const reset = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        hasTriggeredRef.current = false;
        setHasRequested(false);
        setShouldShowReview(false);
        setIsChecking(false);
    };

    // Set up the delayed check when the component mounts
    useEffect(() => {
        if (!enabled || hasRequested) {
            return;
        }

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }


        // Set a new timeout to check after the delay
        timeoutRef.current = setTimeout(() => {
            triggerReview();
        }, delay);

        // Cleanup on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, delay, triggerContext]);

    return {
        shouldShowReview,
        requestReview,
        hasRequested,
        isChecking: isChecking || isLoading,
        isEligible,
        reset,
    };
};

export default useReviewModal;
