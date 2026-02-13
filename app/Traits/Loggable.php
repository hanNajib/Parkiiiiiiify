<?php

namespace App\Traits;

use App\Jobs\LogAktivitas as LogActivityJob;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait Loggable
{
    protected static function bootLoggable(): void
    {
        static::created(function($model) {
            $name = $model->name ?? $model->getTable();
            self::logActivity('created', $model, "Membuat {$name} baru");
        });
        
        static::updated(function($model) {
            $name = $model->name ?? $model->getTable();
            self::logActivity('updated', $model, "Memperbarui {$name}");
        });
        
        static::deleted(function($model) {
            $name = $model->name ?? $model->getTable();
            self::logActivity('deleted', $model, "Menghapus {$name}");
        });
    }

    protected static function logActivity(string $action, $model, string $description): void
    {
        if (!Auth::check()) return;

        try {
            LogActivityJob::dispatch(
                userId: Auth::id(),
                role: Auth::user()->role,
                action: $action,
                description: $description,
                targetType: get_class($model),
                targetId: $model->id,
                ipAddress: request()->ip(),
            );
        } catch (\Exception $e) {
            Log::error('Failed to dispatch activity log', [
                'action' => $action,
                'model' => get_class($model),
                'error' => $e->getMessage(),
            ]);
        }
    }
}
