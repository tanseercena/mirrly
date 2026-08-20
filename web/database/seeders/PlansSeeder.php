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
            'name' => 'free',
            'monthly_charge' => 0.00,
            'yearly_charge' => 0.00,
            'features' => [
                'All core features',
                'Up to 50 sessions / month',
                'Standard quality',
                'Email support',
                
            ],
            'limits' => [
                'session' => 50,
                
            ],
            'can' => [
               
            ]
        ]);

        Plan::create([
            'name' => 'Growth',
            'monthly_charge' => 79.00,
            'yearly_charge' => 63.00,
            'features' => [
                'All core features',
                'Up to 500 sessions / month',
                'High quality',
                'Priority support',
                'Usage analytics',
                
            ],
            'limits' => [
                'sessions' => 500,
                
            ],
            'can' => [
                
            ]
        ]);

        Plan::create([
            'name' => 'Scale',
            'monthly_charge' => 199.00,
            'yearly_charge' => 159.00,
            'features' => [
                'All core features',
                'Unlimited sessions',
                'Highest quality',
                'Priority support',
                'Usage analytics',
                'Early access to new features',
                
            ],
            'limits' => [
                'session' => 'unlimited',
                
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