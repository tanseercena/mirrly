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
                '30 Orders per month',
                '5GB File Storage',
                '100 MB per file',
                '5 files per product',
                '20 Digital Products',
                // '1 Digital Lottery',
                'File Delivery',
                'License Keys',
                'Custom Links',
            ],
            'limits' => [
                'orders' => 30,
                'file_storage' => '5368709120',
                'max_file_size' => '104857600',
                'digital_products' => 20,
                // 'digital_lotteries' => 1,
                'impressions' => 500,
                'leads' => 0,
                'cart_adds' => 'unlimited',
                'discounts' => 5,
            ],
            'can' => [
                'collect_leads' => false,
                'use_sales_popups' => true,
                'use_exit_discounts' => true,
                'use_sticky_cart_bars' => true,
                'use_countdowns' => false,
            ]
        ]);

        Plan::create([
            'name' => 'pro',
            'monthly_charge' => 7.99,
            'yearly_charge' => 76.99,
            'features' => [
                '100 Orders per month',
                '15GB File Storage',
                '500 MB per file',
                '20 files per product',
                '50 Digital Products',
                // '10 Digital Lotteries',
                'Auto Fulfill Orders',
                'Sample Files on Product Page',
                'File Delivery',
                'License Keys',
                'Custom Links',
                'Email Template Editing',
            ],
            'limits' => [
                'orders' => 100,
                'file_storage' => '16107200000',
                'max_file_size' => '524288000',
                'digital_products' => 50,
                // 'digital_lotteries' => 10,
                'impressions' => 10000,
                'leads' => 250,
                'cart_adds' => 'unlimited',
                'discounts' => 150,
            ],
            'can' => [
                'collect_leads' => true,
                'use_sales_popups' => true,
                'use_exit_discounts' => true,
                'use_sticky_cart_bars' => true,
                'use_countdowns' => true,
            ]
        ]);

        Plan::create([
            'name' => 'plus',
            'monthly_charge' => 12.99,
            'yearly_charge' => 124.99,
            'features' => [
                '500 Orders',
                '30GB File Storage',
                '1GB per file',
                '50 files per product',
                '100 Digital Products',
                // '50 Digital Lotteries',
                'Auto Fulfill Orders',
                'Sample Files on Product Page',
                'File Delivery',
                'License Keys',
                'License Tracking',
                'Custom Links',
                'Email Template Editing',
            ],
            'limits' => [
                'orders' => 500,
                'file_storage' => '32212254720',
                'max_file_size' => '1073741824',
                'digital_products' => 100,
                // 'digital_lotteries' => 50,
                'impressions' => 100000,
                'leads' => 1000,
                'cart_adds' => 'unlimited',
                'discounts' => 500,
            ],
            'can' => [
                'collect_leads' => true,
                'use_sales_popups' => true,
                'use_exit_discounts' => true,
                'use_sticky_cart_bars' => true,
                'use_countdowns' => true,
            ]
        ]);

        Plan::create([
            'name' => 'unlimited',
            'monthly_charge' => 24.99,
            'yearly_charge' => 239.99,
            'features' => [
                'Unlimited Orders',
                'Unlimited File Storage',
                '2GB per file (can be increased up to 10 GB on request)',
                '100 files per product',
                'Unlimited Digital Products',
                // 'Unlimited Digital Lotteries',
                'Auto Fulfill Orders',
                'Sample Files on Product Page',
                'File Delivery',
                'License Keys',
                'License Tracking',
                'Custom Links',
                'Email Template Editing',
            ],
            'limits' => [
                'orders' => 'unlimited',
                'file_storage' => 'unlimited',
                'max_file_size' => '2147483648',
                'digital_products' => 'unlimited',
                // 'digital_lotteries' => 'unlimited',
                'impressions' => 'unlimited',
                'leads' => 'unlimited',
                'cart_adds' => 'unlimited',
                'discounts' => 'unlimited',
            ],
            'can' => [
                'collect_leads' => true,
                'use_sales_popups' => true,
                'use_exit_discounts' => true,
                'use_sticky_cart_bars' => true,
                'use_countdowns' => true,
            ]
        ]);
    }
}