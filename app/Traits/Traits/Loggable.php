<?php

namespace App\Traits\Traits;

use App\Jobs\LogAktivitas as JobsLogAktivitas;
use App\Models\LogAktivitas;
use Illuminate\Support\Facades\Auth;

trait Loggable
{
    protected static function bootLoggable()
    {
        static::created(function($model) {
            self::logActivity('create', $model, "Membuat data pada {$model->getTable()}");
        });
        static::updated(function($model) {
            self::logActivity('updated', $model, "Memperbarui data pada {$model->getTable()}");
        });
        static::deleted(function($model) {
            self::logActivity('deleted', $model, "Menghapus data pada {$model->getTable()}");
        });
    }

    protected static function logActivity(string $action, $model, string $description): void
    {
        if(!Auth::check()) return;

        JobsLogAktivitas::dispatch(
            userId: Auth::id(),
            role: Auth::user()->role,
            action: $action,
            description: $description,
            targetType: get_class($model),
            targetId: $model->id,
            ipAddress: request()->ip(),
        );
    }
}
