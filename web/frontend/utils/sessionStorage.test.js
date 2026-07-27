/**
 * Session Storage Test Utility
 * Use this to test the sessionStorage implementation for card visibility
 */

import {
    getDismissedCards,
    isCardDismissed,
    dismissCard,
    showCard,
    resetAllCards
} from './sessionStorage.js';

// Test Functions
export const testSessionStorage = () => {
    console.log('=== Session Storage Card Visibility Test ===\n');

    // Test 1: Initial state should be empty
    console.log('Test 1: Initial state');
    resetAllCards();
    const initialCards = getDismissedCards();
    console.log('Initial dismissed cards:', initialCards);
    console.log('✓ Should be empty object:', Object.keys(initialCards).length === 0 ? 'PASS' : 'FAIL');

    // Test 2: Dismissing a card
    console.log('\nTest 2: Dismissing a card');
    dismissCard('dashboard_discount_card');
    const afterDismiss = getDismissedCards();
    console.log('After dismissing dashboard_discount_card:', afterDismiss);
    console.log('✓ Card should be dismissed:', isCardDismissed('dashboard_discount_card') === true ? 'PASS' : 'FAIL');

    // Test 3: Multiple cards
    console.log('\nTest 3: Dismissing multiple cards');
    dismissCard('dashboard_setup_card');
    dismissCard('plans_discount_card');
    const multipleCards = getDismissedCards();
    console.log('After dismissing multiple cards:', multipleCards);
    console.log('✓ Should have 3 dismissed cards:', Object.keys(multipleCards).length === 3 ? 'PASS' : 'FAIL');

    // Test 4: Showing a card
    console.log('\nTest 4: Showing a card');
    showCard('dashboard_discount_card');
    const afterShow = getDismissedCards();
    console.log('After showing dashboard_discount_card:', afterShow);
    console.log('✓ Card should be visible:', isCardDismissed('dashboard_discount_card') === false ? 'PASS' : 'FAIL');

    // Test 5: Reset all cards
    console.log('\nTest 5: Resetting all cards');
    resetAllCards();
    const afterReset = getDismissedCards();
    console.log('After reset:', afterReset);
    console.log('✓ Should be empty object:', Object.keys(afterReset).length === 0 ? 'PASS' : 'FAIL');

    console.log('\n=== All Tests Complete ===');
};

// Run tests in browser console:
// import { testSessionStorage } from './utils/sessionStorage.test.js';
// testSessionStorage();
