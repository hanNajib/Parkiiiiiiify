<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rekap Transaksi Parkir</title>
    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @font-face {
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            src: url("{{ public_path('fonts/Outfit-Regular.ttf') }}") format('truetype');
        }

        @font-face {
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 600;
            src: url("{{ public_path('fonts/Outfit-SemiBold.ttf') }}") format('truetype');
        }

        @font-face {
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 700;
            src: url("{{ public_path('fonts/Outfit-Bold.ttf') }}") format('truetype');
        }

        body {
            font-family: 'Outfit', 'DejaVu Sans', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #1f2937;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #374151;
            padding-bottom: 15px;
        }

        .header h1 {
            font-size: 20px;
            color: #111827;
            margin-bottom: 3px;
            font-weight: bold;
        }

        .header p {
            font-size: 10px;
            color: #6b7280;
        }

        .info-box {
            background: #f9fafb;
            border: 2px dashed #d1d5db;
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 20px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }

        .info-row:last-child {
            margin-bottom: 0;
        }

        .info-label {
            font-weight: 600;
            color: #374151;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }

        .summary-card {
            background: #f3f4f6;
            border-left: 4px solid #374151;
            padding: 12px;
            border-radius: 4px;
        }

        .summary-label {
            font-size: 9px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .summary-value {
            font-size: 16px;
            font-weight: bold;
            color: #111827;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 10px;
            table-layout: auto;
        }

        table thead {
            background: #374151;
            color: white;
        }

        table th {
            padding: 8px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
        }

        table tbody tr {
            border-bottom: 1px solid #e5e7eb;
        }

        table tbody tr:nth-child(even) {
            background: #f9fafb;
        }

        table tbody tr:hover {
            background: #f3f4f6;
        }

        table td {
            padding: 7px 6px;
        }

        .col-fit {
            width: 1%;
            white-space: nowrap;
        }

        .col-area {
            width: auto;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-success {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-primary {
            background: #dbeafe;
            color: #1e3a8a;
        }

        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #111827;
            margin: 20px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px dashed #d1d5db;
        }

        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px dashed #d1d5db;
            text-align: center;
            font-size: 9px;
            color: #9ca3af;
        }

        .stat-table {
            margin-top: 15px;
        }

        .stat-table td {
            padding: 6px 8px;
        }

        .currency {
            font-weight: 600;
            color: #111827;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>REKAP TRANSAKSI PARKIR</h1>
        <p>Laporan Transaksi Parkir</p>
    </div>

    <div class="info-box">
        <div class="info-row">
            <span class="info-label">Periode:</span>
            <span>{{ date('d/m/Y', strtotime($startDate)) }} - {{ date('d/m/Y', strtotime($endDate)) }}</span>
        </div>
        @if ($area)
            <div class="info-row">
                <span class="info-label">Area Parkir:</span>
                <span>{{ $area->nama }} ({{ $area->lokasi }})</span>
            </div>
        @else
            <div class="info-row">
                <span class="info-label">Area Parkir:</span>
                <span>Semua Area</span>
            </div>
        @endif
        <div class="info-row">
            <span class="info-label">Tanggal Cetak:</span>
            <span>{{ $generatedAt->format('d/m/Y H:i:s') }}</span>
        </div>
    </div>

    <div class="summary-grid">
        <div class="summary-card">
            <div class="summary-label">Total Transaksi</div>
            <div class="summary-value">{{ number_format($totalTransactions) }}</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Total Pendapatan</div>
            <div class="summary-value currency">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Rata-rata Durasi</div>
            <div class="summary-value">{{ round($avgDurasi ?? 0) }} menit</div>
        </div>
    </div>

    <h2 class="section-title">Ringkasan Per Area</h2>
    <table class="stat-table">
        <thead>
            <tr>
                <th class="col-area">Area Parkir</th>
                <th class="text-center col-fit">Jumlah</th>
                <th class="text-right col-fit">Pendapatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($byArea as $item)
                <tr>
                    <td class="col-area">{{ $item['nama'] }}</td>
                    <td class="text-center col-fit">{{ number_format($item['count']) }}</td>
                    <td class="text-right currency col-fit">Rp {{ number_format($item['revenue'], 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2 class="section-title">Ringkasan Per Jenis Kendaraan</h2>
    <table class="stat-table">
        <thead>
            <tr>
                <th class="col-area">Jenis Kendaraan</th>
                <th class="text-center col-fit">Jumlah</th>
                <th class="text-right col-fit">Pendapatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($byVehicleType as $item)
                <tr>
                    <td class="col-area" style="text-transform: capitalize;">{{ $item['type'] }}</td>
                    <td class="text-center col-fit">{{ number_format($item['count']) }}</td>
                    <td class="text-right currency col-fit">Rp {{ number_format($item['revenue'], 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2 class="section-title">Detail Transaksi</h2>
    <table>
        <thead>
            <tr>
                <th class="col-fit">No</th>
                <th class="col-fit">Tanggal</th>
                <th class="col-fit">Plat Nomor</th>
                <th class="col-fit">Jenis</th>
                <th class="col-area">Area</th>
                <th class="text-center col-fit">Durasi</th>
                <th class="text-right col-fit">Biaya</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transaksi as $index => $trx)
                <tr>
                    <td class="col-fit">{{ $index + 1 }}</td>
                    <td class="col-fit">{{ $trx->waktu_keluar ? date('d/m/y H:i', strtotime($trx->waktu_keluar)) : '-' }}</td>
                    <td class="col-fit"><strong>{{ $trx->kendaraan->plat_nomor ?? '-' }}</strong></td>
                    <td class="col-fit" style="text-transform: capitalize;">{{ $trx->kendaraan->jenis_kendaraan ?? '-' }}</td>
                    <td class="col-area">{{ $trx->areaParkir->nama ?? '-' }}</td>
                    <td class="text-center col-fit">{{ $trx->durasi ?? 0 }} mnt</td>
                    <td class="text-right currency col-fit">Rp {{ number_format($trx->total_biaya ?? 0, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr style="background: #f3f4f6; font-weight: bold; border-top: 2px solid #374151;">
                <td colspan="6" class="text-right" style="padding: 10px;">TOTAL</td>
                <td class="text-right currency" style="padding: 10px;">Rp
                    {{ number_format($totalRevenue, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Terima kasih atas kepercayaan Anda</p>
        <p>Dicetak pada: {{ $generatedAt->format('d F Y, H:i:s') }}</p>
    </div>
</body>

</html>
