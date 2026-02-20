<?php

namespace App\Jobs;

use App\Models\LogAktivitas as ModelsLogAktivitas;
use App\Models\Tenant;
use App\Services\TenantDatabaseManager;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class LogAktivitas implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $userId,
        public string $role,
        public string $action,
        public string $description,
        public ?string $targetType = null,
        public ?int $targetId = null,
        public ?string $ipAddress = null,
        public ?int $tenantId = null,
    )
    {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Restore tenant context if exists
        if ($this->tenantId) {
            $tenant = Tenant::find($this->tenantId);
            if ($tenant) {
                app()->instance(Tenant::class, $tenant);
                TenantDatabaseManager::configure($tenant);
            }
        }

        ModelsLogAktivitas::create([
            'user_id' => $this->userId,
            'role' => $this->role,
            'action' => $this->action,
            'description' => $this->description,
            'target_type' => $this->targetType,
            'target_id' => $this->targetId,
            'ip_address' => $this->ipAddress,
        ]);
    }
}
