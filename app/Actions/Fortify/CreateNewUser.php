<?php

namespace App\Actions\Fortify;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'institution_name' => ['required', 'string', 'max:255'],
            'institution_address' => ['required', 'string', 'max:500'],
            'domain_prefix' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique(Tenant::class, 'slug'),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input) {
            $owner = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => Hash::make($input['password']),
                'role' => 'owner'
            ]);

            $slug = $input['domain_prefix'];
            $domainSuffix = config('tenant.domain_suffix', '.parkify.test');
            $domainSuffix = str_starts_with($domainSuffix, '.') ? $domainSuffix : '.' . $domainSuffix;

            $tenant = Tenant::create([
                'slug' => $slug,
                'domain' => $slug . $domainSuffix,
                'name' => $input['institution_name'],
                'institution_name' => $input['institution_name'],
                'institution_address' => $input['institution_address'],
                'status' => 'pending',
                'database_name' => 'parkify_' . $slug,
                'host' => env('DB_HOST', 'localhost'),
                'port' => env('DB_PORT', 3306),
                'username' => env('DB_USERNAME', 'root'),
                'password' => env('DB_PASSWORD', ''),
                'is_active' => false,
                'owner_user_id' => $owner->id,
                'requested_by_user_id' => $owner->id,
                'requested_at' => now(),
            ]);

            $tenant->users()->attach($owner->id, ['role' => 'owner']);

            return $owner;
        });
    }
}
