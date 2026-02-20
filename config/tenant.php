<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Multi-Tenant Configuration
    |--------------------------------------------------------------------------
    */

    'mode' => env('TENANT_MODE', 'database'),

    'connection' => [
        'driver' => 'mysql',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
        'prefix_indexes' => true,
        'strict' => true,
        'engine' => 'InnoDB',
    ],

    'main_domains' => [
        env('APP_URL', 'http://parkify.test'),
        'parkify.test',
        'parkify.test:8000',
        'localhost',
        'localhost:8000',
    ],

    'domain_suffix' => "." . env('TENANT_DOMAIN_SUFFIX', 'parkify.test'),

];
