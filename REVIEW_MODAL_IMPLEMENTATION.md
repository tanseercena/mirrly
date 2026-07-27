# Shopify Review Modal Implementation Guide

This document provides a complete guide for the Shopify Review Modal feature implementation.

## Overview

The Shopify Review Modal feature prompts merchants to leave reviews at strategic moments in their app workflow. The implementation follows Shopify's best practices and rate limits.

## Features Implemented

### 1. Database Schema
- **Table**: `review_requests`
- **Tracks**: When modal was shown, response codes, trigger context
- **Relationships**: Belongs to Store

### 2. Backend Components

#### ReviewService (`web/app/Services/ReviewService.php`)
- Checks eligibility based on multiple criteria
- Enforces rate limits (60-day cooldown, 3 times per year)
- Logs all review request attempts

#### ReviewController (`web/app/Http/Controllers/ReviewController.php`)
- API endpoints for eligibility checks
- Logs review request results
- Provides review statistics

#### API Routes (`web/routes/web.php`)
```php
Route::controller(ReviewController::class)->prefix('review')->group(function () {
    Route::get('/check-eligibility', 'checkEligibility');
    Route::get('/check-first-order', 'checkFirstOrderEligibility');
    Route::get('/stats', 'getStats');
    Route::post('/log', 'logRequest');
});
```

### 3. Frontend Components

#### ReviewProvider (`web/frontend/components/providers/ReviewProvider.jsx`)
- Context provider for review modal state
- Integrates with Shopify's Reviews API
- Handles eligibility checking and modal requests

#### useReviewModal Hook (`web/frontend/hooks/useReviewModal.js`)
- Custom hook for managing review modal logic
- Handles mobile detection
- Manages timing and delays
- Prevents duplicate requests

## Installation Steps

### 1. Run Migration

```bash
cd web
php artisan migrate
```

### 2. Add Environment Variable

Add to your `.env` file:

```env
# Review Modal Configuration
# Date format: Y-m-d (e.g., 2026-04-20)
# Users who installed before this date are considered 'old users' and eligible for review modal
REVIEW_OLD_USER_DATE=2026-04-20
```

### 3. Clear Configuration Cache

```bash
php artisan config:clear
php artisan cache:clear
```

### 4. Build Frontend

```bash
cd web/frontend
npm install
npm run build
```

## How It Works

### Eligibility Rules

#### For New Users (installed on or after REVIEW_OLD_USER_DATE):
1. **24-hour minimum**: Must be installed for at least 24 hours
2. **First order trigger**: Shows when first order is created (after 24h)
3. **60-day cooldown**: Can only show once every 60 days
4. **Annual limit**: Maximum 3 times per year

#### For Old Users (installed before REVIEW_OLD_USER_DATE):
1. **Immediately eligible**: Subject to 60-day cooldown and annual limit
2. **No 24-hour waiting period**

### Rate Limits & Restrictions

The following are enforced by both Shopify AND our backend:

- ✅ **60-day cooldown**: Once per 60 days per merchant
- ✅ **Annual limit**: Max 3 times per year per merchant
- ✅ **24-hour minimum**: Never shows within 24 hours of installation
- ❌ **Never on mobile**: Review modal not supported on mobile devices
- ❌ **Not if already reviewed**: Checks if merchant already reviewed
- ❌ **Not if ineligible**: Respects Shopify's eligibility checks

### Trigger Contexts

1. **dashboard**: Shown on main dashboard page
   - Delay: 5 seconds after page load
   - File: `web/frontend/pages/index.jsx`

2. **first_order**: Shown when viewing orders after first order
   - Delay: 3 seconds after page load
   - File: `web/frontend/pages/Orders.jsx`

## Testing

### Development Store Testing

**Important**: Shopify's Review API bypasses rate limits in development stores. Use a development store to test the implementation without worrying about limits.

#### Test Scenario 1: New User - First Order

1. Create a fresh development store
2. Install the app
3. Create a digital product
4. Wait 24 hours (or manually update `created_at` in database)
5. Create a test order
6. Visit the Orders page
7. Review modal should appear after 3 seconds

#### Test Scenario 2: Old User - Dashboard

1. Use an existing store (installed before REVIEW_OLD_USER_DATE)
2. Ensure no review request in last 60 days
3. Visit the dashboard
4. Review modal should appear after 5 seconds

#### Test Scenario 3: 60-Day Cooldown

1. Check database for recent review request
2. Try to trigger review modal
3. Should not show (cooldown active)

### Testing Endpoints

#### Check Eligibility
```bash
curl -X GET "https://your-app.com/api/review/check-eligibility?trigger_context=dashboard" \
  -H "X-Shopify-Access-Token: your-token"
```

#### Get Statistics
```bash
curl -X GET "https://your-app.com/api/review/stats" \
  -H "X-Shopify-Access-Token: your-token"
```

## Monitoring & Analytics

### Review Request Data

The `review_requests` table tracks:
- `shown_at`: When the modal was shown
- `response_code`: Shopify's response (success, cooldown-period, etc.)
- `response_message`: Detailed message
- `success`: Whether the modal was actually shown
- `trigger_context`: Where it was triggered from

### Useful Queries

```sql
-- Check how many times review was shown this year per store
SELECT
    store_id,
    COUNT(*) as requests_this_year,
    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_shows
FROM review_requests
WHERE shown_at >= YEAR(CURDATE())
GROUP BY store_id;

-- Find stores that have never seen the review modal
SELECT s.id, s.shopify_domain, s.created_at
FROM stores s
LEFT JOIN review_requests r ON s.id = r.store_id
WHERE r.id IS NULL;

-- Check most recent review request per store
SELECT
    s.shopify_domain,
    r.shown_at,
    r.response_code,
    r.trigger_context
FROM review_requests r
JOIN stores s ON r.store_id = s.id
WHERE r.shown_at = (
    SELECT MAX(shown_at)
    FROM review_requests r2
    WHERE r2.store_id = r.store_id
);
```

## Configuration Options

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `REVIEW_OLD_USER_DATE` | Cutoff date for "old user" status | `2026-04-20` | `2026-04-20` |

### Hook Options

```javascript
useReviewModal({
    delay: 5000,              // Delay in milliseconds before checking
    triggerContext: 'dashboard', // Context for the request
    enabled: true,            // Whether the hook is enabled
});
```

## Response Codes

| Code | Description | Action |
|------|-------------|--------|
| `success` | Modal shown successfully | None required |
| `already-open` | Modal already open | Wait and retry |
| `already-reviewed` | Already reviewed | Don't show again |
| `annual-limit-reached` | 3 shows this year | Wait until next year |
| `cancelled` | User cancelled | Can retry later |
| `cooldown-period` | Shown within 60 days | Wait 60 days |
| `merchant-ineligible` | Not eligible | Don't show |
| `mobile-app` | On mobile device | Don't show on mobile |
| `open-in-progress` | Opening in progress | Wait |
| `recently-installed` | < 24 hours since install | Wait 24 hours |

## Troubleshooting

### Modal Not Showing?

1. **Check if on mobile**: Modal doesn't show on mobile devices
2. **Check 24-hour rule**: Must be installed for at least 24 hours
3. **Check 60-day cooldown**: May have been shown recently
4. **Check annual limit**: Maximum 3 shows per year
5. **Check database logs**: Review `review_requests` table

### Check Eligibility Manually

```bash
# Check eligibility for dashboard
php artisan tinker
>>> $store = App\Models\Store::first();
>>> app('App\Services\ReviewService')->checkEligibility($store, 'dashboard');
```

### View Logs

```bash
tail -f web/storage/logs/laravel.log | grep -i review
```

## Best Practices

### DO ✅
- Show after user has received value (e.g., successful order)
- Use appropriate delays (3-5 seconds)
- Test in development stores first
- Monitor the review_requests table

### DON'T ❌
- Trigger on app open (too early)
- Trigger on button clicks (rate limits)
- Interrupt setup/onboarding
- Trigger on error states
- Show on mobile devices

## Files Created/Modified

### Created Files
1. `web/database/migrations/2024_04_20_000001_create_review_requests_table.php`
2. `web/app/Models/ReviewRequest.php`
3. `web/app/Services/ReviewService.php`
4. `web/app/Http/Controllers/ReviewController.php`
5. `web/frontend/components/providers/ReviewProvider.jsx`
6. `web/frontend/hooks/useReviewModal.js`
7. `REVIEW_MODAL_IMPLEMENTATION.md`

### Modified Files
1. `web/app/Models/Store.php` - Added reviewRequests relationship
2. `web/config/app.php` - Added review_old_user_date config
3. `web/routes/web.php` - Added review routes
4. `web/.env.example` - Added REVIEW_OLD_USER_DATE
5. `web/frontend/App.jsx` - Wrapped with ReviewProvider
6. `web/frontend/pages/index.jsx` - Added review modal hook
7. `web/frontend/pages/Orders.jsx` - Added review modal hook

## Support

For issues or questions:
1. Check Laravel logs: `web/storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Review database records in `review_requests` table
4. Test with Shopify development store (bypasses rate limits)

## References

- [Shopify Reviews API Documentation](https://shopify.dev/docs/api/app-home/apis/user-interface-and-interactions/reviews-api)
- [Shopify App Bridge Reviews](https://shopify.dev/docs/apps/app-bridge/api-reference/reviews)

## Notes

- The implementation respects all Shopify rate limits and restrictions
- All review requests are logged for analytics and debugging
- The system automatically handles mobile detection
- Development stores bypass rate limits for easier testing
- The feature is production-ready and follows Shopify's guidelines
