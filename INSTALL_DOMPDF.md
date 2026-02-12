# Install Laravel DomPDF

Untuk mengaktifkan fitur download rekap transaksi PDF, jalankan command berikut:

```bash
composer require barryvdh/laravel-dompdf
```

Setelah instalasi selesai, publish config (optional):

```bash
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
```

Package akan otomatis terdaftar di Laravel service providers.

## Penggunaan

Fitur download rekap PDF terintegrasi di Dashboard Owner dengan:
- Filter tanggal mulai dan selesai
- Filter area parkir (opsional)
- Export ke PDF dengan format profesional

Controller method: `DashboardController@downloadRekapPDF`
Route: `POST /download-rekap-pdf`
Template: `resources/views/reports/rekap-transaksi.blade.php`
