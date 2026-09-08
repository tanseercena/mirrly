<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Plan::truncate();

        Plan::create([
            'name' => 'Free',
            'monthly_charge' => 0.00,
            'yearly_charge' => 0.00,
            'features' => [
                'Unlimited try-on sessions',
                '7-day analytics history',
                '30 seconds session ',
                'Standard try-on button',
                'Chat Support',
                
            ],
            'limits' => [
                'sessions' => '',
                'session_rate' => 0.90,
            ],
            'can' => [
               
            ]
        ]);

        Plan::create([
            'name' => 'Growth',
            'monthly_charge' => 79.00,
            'yearly_charge' => 63.00,
            'features' => [
                '90-day analytics history',
                '30 seconds session',
                'High quality',
                'Custom try-on button',
                'Chat Support',
                'Email notifications',
                
            ],
            'limits' => [
                'sessions' => 90,
                'session_rate' => 0.80,
            ],
            'can' => [
                
            ]
        ]);

        Plan::create([
            'name' => 'Scale',
            'monthly_charge' => 199.00,
            'yearly_charge' => 159.00,
            'features' => [
                'Unlimited analytics history',
                '30 seconds session ',
                'Custom try-on button',
                'Chat Support (Priority)',
                'Email notifications',
                
                
            ],
            'limits' => [
                'sessions' => 250,
                'session_rate' => 0.75,
            ],
            'can' => [
                
            ]
        ]);

        // Plan::create([
        //     'name' => 'unlimited',
        //     'monthly_charge' => 24.99,
        //     'yearly_charge' => 239.99,
        //     'features' => [
        //         'Unlimited Orders',
        //         'Unlimited File Storage',
        //         '2GB per file (can be increased up to 10 GB on request)',
        //         '100 files per product',
        //         'Unlimited Digital Products',
        //         // 'Unlimited Digital Lotteries',
        //         'Auto Fulfill Orders',
        //         'Sample Files on Product Page',
        //         'File Delivery',
        //         'License Keys',
        //         'License Tracking',
        //         'Custom Links',
        //         'Email Template Editing',
        //     ],
        //     'limits' => [
        //         'orders' => 'unlimited',
        //         'file_storage' => 'unlimited',
        //         'max_file_size' => '2147483648',
        //         'digital_products' => 'unlimited',
        //         // 'digital_lotteries' => 'unlimited',
        //         'impressions' => 'unlimited',
        //         'leads' => 'unlimited',
        //         'cart_adds' => 'unlimited',
        //         'discounts' => 'unlimited',
        //     ],
        //     'can' => [
        //         'collect_leads' => true,
        //         'use_sales_popups' => true,
        //         'use_exit_discounts' => true,
        //         'use_sticky_cart_bars' => true,
        //         'use_countdowns' => true,
        //     ]
        // ]);
    }
}