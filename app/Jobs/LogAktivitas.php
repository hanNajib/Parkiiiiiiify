<?php

namespace App\Jobs;

use App\Models\LogAktivitas as ModelsLogAktivitas;
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
    )
    {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
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
