<?php

namespace App\Console\Commands;

use App\Models\LogAktivitas;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ArchiveLogAktivitas extends Command
{
    protected $signature = 'log:archive-aktivitas
        {--days=90 : Archive logs older than this many days}
        {--batch=1000 : Number of rows processed per batch}
        {--dry-run : Show what would be archived without writing or deleting}';

    protected $description = 'Archive old activity logs to CSV and delete them from the database.';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $batchSize = (int) $this->option('batch');
        $dryRun = (bool) $this->option('dry-run');

        if ($days <= 0) {
            $this->error('Option --days must be a positive integer.');
            return self::FAILURE;
        }

        if ($batchSize <= 0) {
            $this->error('Option --batch must be a positive integer.');
            return self::FAILURE;
        }

        $cutoff = Carbon::now()->subDays($days);
        $query = LogAktivitas::where('created_at', '<', $cutoff)->orderBy('id');
        $total = (clone $query)->count();

        if ($total === 0) {
            $this->info('No log records to archive.');
            return self::SUCCESS;
        }

        $this->info("Found {$total} log records older than {$days} days.");

        if ($dryRun) {
            $this->line('Dry run: no files will be written and no records will be deleted.');
            return self::SUCCESS;
        }

        $dir = 'log-archive';
        Storage::makeDirectory($dir);

        $timestamp = Carbon::now()->format('Ymd_His');
        $filename = "{$dir}/log_aktivitas_{$timestamp}.csv";
        $path = Storage::path($filename);

        $handle = fopen($path, 'wb');
        if ($handle === false) {
            $this->error('Failed to open archive file for writing.');
            return self::FAILURE;
        }

        fputcsv($handle, [
            'id',
            'user_id',
            'role',
            'action',
            'description',
            'target_type',
            'target_id',
            'ip_address',
            'created_at',
            'updated_at',
        ]);

        $processed = 0;
        $query->chunkById($batchSize, function ($logs) use (&$processed, $handle) {
            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->id,
                    $log->user_id,
                    $log->role,
                    $log->action,
                    $log->description,
                    $log->target_type,
                    $log->target_id,
                    $log->ip_address,
                    optional($log->created_at)->toDateTimeString(),
                    optional($log->updated_at)->toDateTimeString(),
                ]);
            }

            $ids = $logs->pluck('id')->all();
            if (!empty($ids)) {
                LogAktivitas::whereIn('id', $ids)->delete();
            }

            $processed += count($ids);
        });

        fclose($handle);

        $this->info("Archived and deleted {$processed} log records to {$filename}.");

        return self::SUCCESS;
    }
}
