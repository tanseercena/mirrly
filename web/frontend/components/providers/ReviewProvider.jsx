import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

// Create the Review Context
const ReviewContext = createContext(null);

// Review response codes from Shopify
export const REVIEW_RESPONSE_CODES = {
  SUCCESS: 'success',
  ALREADY_OPEN: 'already-open',
  ALREADY_REVIEWED: 'already-reviewed',
  ANNUAL_LIMIT_REACHED: 'annual-limit-reached',
  CANCELLED: 'cancelled',
  COOLDOWN_PERIOD: 'cooldown-period',
  MERCHANT_INELIGIBLE: 'merchant-ineligible',
  MOBILE_APP: 'mobile-app',
  OPEN_IN_PROGRESS: 'open-in-progress',
  RECENTLY_INSTALLED: 'recently-installed',
};

/**
 * Review Provider Component
 * Manages the Shopify review modal state and logic
 */
export const ReviewProvider = ({ children }) => {
    const app = useAppBridge();
    const [isEligible, setIsEligible] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reviewStats, setReviewStats] = useState(null);
    const [lastCheckReason, setLastCheckReason] = useState(null);

    /**
     * Check if the current store is eligible for review modal
     * @param {string} triggerContext - 'dashboard', 'first_order', etc.
     * @returns {Promise<boolean>}
     */
    const checkEligibility = useCallback(async (triggerContext = 'dashboard') => {
        if (isLoading) {
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/review/check-eligibility?trigger_context=${triggerContext}`);

            if (response.ok) {
                const data = await response.json();

                if (data.eligible) {
                    setIsEligible(true);
                    setLastCheckReason('eligible');
                    return true;
                } else {
                    setIsEligible(false);
                    setLastCheckReason(data.reason);
                    return false;
                }
            } else {
                console.error('Error checking review eligibility:', response.statusText);
                setIsEligible(false);
                return false;
            }
        } catch (error) {
            console.error('Error checking review eligibility:', error);
            setIsEligible(false);
            return false;
        } finally {
            setIsLoading(false);
            setHasChecked(true);
        }
    }, [isLoading]);

    /**
     * Check eligibility for first order trigger
     * @returns {Promise<boolean>}
     */
    const checkFirstOrderEligibility = useCallback(async () => {
        if (isLoading) {
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/review/check-first-order');

            if (response.ok) {
                const data = await response.json();

                if (data.eligible) {
                    setIsEligible(true);
                    setLastCheckReason('first_order_eligible');
                    return true;
                } else {
                    setIsEligible(false);
                    setLastCheckReason(data.reason);
                    return false;
                }
            } else {
                console.error('Error checking first order eligibility:', response.statusText);
                setIsEligible(false);
                return false;
            }
        } catch (error) {
            console.error('Error checking first order eligibility:', error);
            setIsEligible(false);
            return false;
        } finally {
            setIsLoading(false);
            setHasChecked(true);
        }
    }, [isLoading]);

    /**
     * Request the review modal using Shopify's Reviews API
     * This should only be called after checking eligibility
     * @param {string} triggerContext - The context in which the modal was triggered
     * @returns {Promise<object>}
     */
    const requestReview = useCallback(async (triggerContext = 'dashboard') => {
        if (!app) {
            console.error('App Bridge not available');
            return { success: false, code: 'no-app-bridge', message: 'App Bridge not available' };
        }

        try {
            // Request the review modal using Shopify's Reviews API
            const result = await app.reviews.request();

            // Log the result to the backend
            const logResponse = await fetch('/api/review/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    response: {
                        success: result.success,
                        code: result.code || null,
                        message: result.message || null,
                    },
                    trigger_context: triggerContext,
                }),
            });

            if (logResponse.ok) {
                const logData = await logResponse.json();
                console.log('Review request logged successfully:', logData);
            }

            // Update local state
            setIsEligible(false);

            return result;
        } catch (error) {
            console.error('Error requesting review:', error);

            // Log the error to the backend
            try {
                const logResponse = await fetch('/api/review/log', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        response: {
                            success: false,
                            code: 'exception',
                            message: error.message || 'Unknown error',
                        },
                        trigger_context: triggerContext,
                    }),
                });

                if (logResponse.ok) {
                    console.log('Review error logged successfully');
                }
            } catch (logError) {
                console.error('Failed to log review error:', logError);
            }

            return { success: false, code: 'exception', message: error.message };
        }
    }, [app]);

    /**
     * Fetch review request statistics
     * @returns {Promise<object>}
     */
    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch('/api/review/stats');

            if (response.ok) {
                const data = await response.json();
                setReviewStats(data.stats);
                return data.stats;
            } else {
                console.error('Error fetching review stats:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error fetching review stats:', error);
            return null;
        }
    }, []);

    /**
     * Check eligibility and automatically request review if eligible
     * This is a convenience method that combines both steps
     * @param {string} triggerContext
     * @returns {Promise<boolean>}
     */
    const checkAndRequest = useCallback(async (triggerContext = 'dashboard') => {
        const eligible = await checkEligibility(triggerContext);

        if (eligible) {
            const result = await requestReview(triggerContext);
            return result.success;
        }

        return false;
    }, [checkEligibility, requestReview]);

    // Value object to be provided to consumers
    const value = {
        isEligible,
        hasChecked,
        isLoading,
        reviewStats,
        lastCheckReason,
        checkEligibility,
        checkFirstOrderEligibility,
        requestReview,
        checkAndRequest,
        fetchStats,
    };

    return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
};

/**
 * Hook to use the Review Context
 * @returns {object} Review context value
 */
export const useReview = () => {
    const context = useContext(ReviewContext);

    if (!context) {
        throw new Error('useReview must be used within a ReviewProvider');
    }

    return context;
};

export default ReviewContext;
