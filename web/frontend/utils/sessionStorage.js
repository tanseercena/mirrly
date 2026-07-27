import React from 'react';

/**
 * Session Storage utility for managing card visibility
 * Cards will be hidden for the current browser session only
 * When browser is closed and reopened, all cards will be visible again
 */

const STORAGE_KEY = 'digitally_dismissed_cards';

/**
 * Get all dismissed cards from sessionStorage
 * @returns {Object} Object with card IDs as keys and boolean values
 */
export const getDismissedCards = () => {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error reading from sessionStorage:', error);
    }
    return {};
};

/**
 * Check if a specific card is dismissed
 * @param {string} cardId - The ID of the card to check
 * @returns {boolean} True if card is dismissed (hidden), false if visible
 */
export const isCardDismissed = (cardId) => {
    const dismissedCards = getDismissedCards();
    return dismissedCards[cardId] === false;
};

/**
 * Mark a card as dismissed (hidden)
 * @param {string} cardId - The ID of the card to dismiss
 */
export const dismissCard = (cardId) => {
    try {
        const dismissedCards = getDismissedCards();
        dismissedCards[cardId] = false;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dismissedCards));
    } catch (error) {
        console.error('Error writing to sessionStorage:', error);
    }
};

/**
 * Mark a card as visible (not dismissed)
 * @param {string} cardId - The ID of the card to show
 */
export const showCard = (cardId) => {
    try {
        const dismissedCards = getDismissedCards();
        dismissedCards[cardId] = true;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dismissedCards));
    } catch (error) {
        console.error('Error writing to sessionStorage:', error);
    }
};

/**
 * Reset all cards to visible state
 */
export const resetAllCards = () => {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error resetting sessionStorage:', error);
    }
};

/**
 * Hook to manage card visibility state
 * @param {string} cardId - The ID of the card
 * @returns {[boolean, Function]} Array with isVisible state and dismiss function
 */
export const useCardVisibility = (cardId) => {
    const [isVisible, setIsVisible] = React.useState(
        !isCardDismissed(cardId)
    );

    const dismiss = () => {
        dismissCard(cardId);
        setIsVisible(false);
    };

    return [isVisible, dismiss];
};
