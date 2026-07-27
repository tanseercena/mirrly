<?php

namespace App\Console;

use App\Console\Commands\ResetMonthlyLimitsForStores;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        ResetMonthlyLimitsForStores::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('app:reset-monthly-limits-for-stores')->daily();
        $schedule->command('app:send-inventory-threshold-email')->daily();
        $schedule->command('app:process-pending-order-resends')->everyTwoMinutes()->withoutOverlapping();
        $schedule->command('webhook:process-pending-orders')->everyFiveMinutes()->withoutOverlapping();
        $schedule->command('gift:process-scheduled-emails')->everyMinute()->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
