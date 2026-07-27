# Session Storage Card Visibility Implementation

## Overview
This implementation fixes the issue where cards that were closed with "X" would remain hidden even after page refreshes during the same browser session. The solution uses browser `sessionStorage` to track dismissed cards, which automatically clears when the browser is closed.

## Changes Made

### 1. Created Session Storage Utility
**File:** `web/frontend/utils/sessionStorage.js`

This utility provides functions to manage card visibility:
- `getDismissedCards()` - Get all dismissed cards from sessionStorage
- `isCardDismissed(cardId)` - Check if a specific card is dismissed
- `dismissCard(cardId)` - Mark a card as dismissed (hidden)
- `showCard(cardId)` - Mark a card as visible (not dismissed)
- `resetAllCards()` - Reset all cards to visible state
- `useCardVisibility(cardId)` - React hook for managing card visibility state

### 2. Updated Components

#### Dashboard Page (`web/frontend/pages/index.jsx`)
- **Card:** Discount banner with "20% off" offer
- **Card ID:** `dashboard_discount_card`
- **Changes:**
  - Replaced server-side `store?.dismissed_banners?.offer` with `isCardDismissed('dashboard_discount_card')`
  - Removed API call to `/api/dismiss-banner`
  - Now uses `dismissCard('dashboard_discount_card')` to hide the banner

#### App Setup Card (`web/frontend/components/AppSetupCard.jsx`)
- **Card:** Setup guide card with setup steps
- **Card ID:** `dashboard_setup_card`
- **Changes:**
  - Updated initial state to use `!isCardDismissed('dashboard_setup_card')`
  - Added `dismissCard('dashboard_setup_card')` in the onDismiss handler

#### Review Banner (`web/frontend/components/ReviewBanner.jsx`)
- **Card:** Review banner asking for app feedback
- **Card ID:** `dashboard_review_banner`
- **Changes:**
  - Replaced server-side `store?.dismissed_banners?.review` with `isCardDismissed('dashboard_review_banner')`
  - Removed API call to `/api/dismiss-banner`
  - Now uses `dismissCard('dashboard_review_banner')` to hide the banner
  - Fixed unused variable issue in `saveFeedback` function

#### Pricing Page (`web/frontend/pages/Pricing.jsx`)
- **Card:** Discount banner promoting yearly plans with "20% off"
- **Card ID:** `plans_discount_card`
- **Changes:**
  - Updated initial state to use `!isCardDismissed('plans_discount_card')`
  - Added `dismissCard('plans_discount_card')` in the handleDismissBanner function

#### Digital Products Page (`web/frontend/pages/DigitalProducts.jsx`)
- **Card:** Setup video guide card
- **Card ID:** `digital_products_setup_guide`
- **Changes:**
  - Updated initial state to use `!isCardDismissed('digital_products_setup_guide')`
  - Added `dismissCard('digital_products_setup_guide')` in the handleDismissSetupGuide function

#### Digital Lottery Page (`web/frontend/pages/DigitalLottery.jsx`)
- **Card:** Setup video guide card
- **Card ID:** `digital_lottery_setup_guide`
- **Changes:**
  - Updated initial state to use `!isCardDismissed('digital_lottery_setup_guide')`
  - Added `dismissCard('digital_lottery_setup_guide')` in the handleDismissSetupGuide function

## Card IDs Reference

All dismissed cards are stored in sessionStorage under the key `digitally_dismissed_cards` with the following structure:

```javascript
{
  "dashboard_discount_card": false,      // Dashboard discount banner
  "dashboard_setup_card": false,         // Dashboard setup guide
  "dashboard_review_banner": false,      // Dashboard review banner
  "plans_discount_card": false,          // Pricing page discount banner
  "digital_products_setup_guide": false, // Digital products setup guide
  "digital_lottery_setup_guide": false   // Digital lottery setup guide
}
```

**Note:** A value of `false` means the card is dismissed (hidden), while `true` or absence means it's visible.

## Behavior

### Before
- Cards were dismissed permanently (stored in database)
- Cards remained hidden even after browser restart
- Required server-side API calls to manage dismissal state

### After
- Cards are dismissed for the current browser session only
- Cards reappear when browser is closed and reopened
- No server-side API calls needed for dismissal state
- sessionStorage is automatically cleared when browser closes

## Testing

To test the implementation:

1. **Close a card:** Click the "X" button on any card
2. **Refresh the page:** The card should remain hidden
3. **Navigate to other pages:** The card should remain hidden
4. **Close browser and reopen:** All cards should be visible again

## Benefits

1. **Better UX:** Users can dismiss cards they don't need during their session
2. **Fresh Start:** Users see all cards again when they return the next day
3. **No Server Load:** No database calls for managing dismissal state
4. **Privacy:** Dismissal state is local to the user's browser session
5. **Automatic Cleanup:** sessionStorage is cleared when browser closes

## Backward Compatibility

This implementation removes the dependency on server-side `dismissed_banners` storage, but the server-side endpoints (`/api/dismiss-banner`) remain unchanged and can still be used if needed for other purposes.
