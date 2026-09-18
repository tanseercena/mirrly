<?php

namespace App\Console\Commands;

use App\Models\TrySession;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PruneExpiredRecordings extends Command
{
    protected $signature = 'app:prune-expired-recordings';

    protected $description = 'Delete try-on recordings (files + references) past their retention period';

    public function handle()
    {
        $expired = TrySession::whereNotNull('recording_path')
            ->where('recording_expires_at', '<', now())
            ->limit(500)
            ->get();

        foreach ($expired as $session) {
            Storage::disk('local')->deleteDirectory($session->recording_path);
            $session->update(['recording_path' => null, 'recording_expires_at' => null]);
            $this->info("Pruned recordings for session #{$session->id}");
        }

        $this->info(count($expired) . ' session recording(s) pruned.');

        return self::SUCCESS;
    }
}
