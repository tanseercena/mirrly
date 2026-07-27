<?php

return [
    /*
    |--------------------------------------------------------------------------
    | License Generation Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for license generation system including Redis-based
    | reservation for high concurrency scenarios.
    |
    */

    // Feature flag for Redis-based license generation
    // Set to true to enable Redis reservation system
    // Set to false to use original implementation (rollback)
    'use_redis_generation' => env('USE_REDIS_LICENSE_GENERATION', false),

    // Redis connection name (from config/cache.php)
    // Uses 'cache' connection by default
    'redis_connection' => env('LICENSES_REDIS_CONNECTION', 'cache'),

    // Reservation TTL in seconds
    // How long a reserved key stays in Redis before auto-cleanup
    // This should be longer than the maximum expected transaction time
    'reservation_ttl' => env('LICENSES_RESERVATION_TTL', 30),

    // Pool reload threshold
    // When pool count falls below this percentage, trigger warning
    'pool_warning_threshold' => env('LICENSES_POOL_WARNING_THRESHOLD', 100),

    // Enable detailed logging for license generation
    'enable_detailed_logging' => env('LICENSES_ENABLE_DETAILED_LOGGING', true),
];
