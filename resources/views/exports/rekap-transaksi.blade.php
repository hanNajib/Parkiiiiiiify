@php
    $startDate = \Carbon\Carbon::parse($startDate)->format('d/m/Y');
    $endDate = \Carbon\Carbon::parse($endDate)->format('d/m/Y');
@endphp

<table>
    <thead>
        <tr>
            <td colspan="8" style="font-size: 16px; font-weight: bold; text-align: center;">
                REKAP TRANSAKSI PARKIR
            </td>
        </tr>
        <tr>
            <td colspan="8" style="text-align: center;">
                Periode: {{ $startDate }} s/d {{ $endDate }}
                @if($area)
                    | Area: {{ $area->nama }}
                @endif
            </td>
        </tr>
        <tr></tr>
        <tr>
            <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">No Transaksi</th>
            <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Plat Nomor</th>
            <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Jenis Kendaraan</th>
            <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Area</th>
            <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Waktu Masuk</th>
            <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Waktu Keluar</th>
            <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Durasi</th>
            <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Biaya</th>
        </tr>
    </thead>
    <tbody>
        @foreach($transaksi as $trx)
            @php
                $durationHours = intdiv($trx->durasi ?? 0, 60);
                $durationMins = ($trx->durasi ?? 0) % 60;
            @endphp
            <tr>
                <td style="border: 1px solid #ccc;">TRX{{ str_pad($trx->id, 5, '0', STR_PAD_LEFT) }}</td>
                <td style="border: 1px solid #ccc;">{{ $trx->kendaraan->plat_nomor ?? '-' }}</td>
                <td style="border: 1px solid #ccc;">{{ ucfirst($trx->kendaraan->jenis_kendaraan ?? '-') }}</td>
                <td style="border: 1px solid #ccc;">{{ $trx->areaParkir->nama ?? '-' }}</td>
                <td style="border: 1px solid #ccc;">{{ \Carbon\Carbon::parse($trx->waktu_masuk)->format('d/m/Y H:i') }}</td>
                <td style="border: 1px solid #ccc;">{{ $trx->waktu_keluar ? \Carbon\Carbon::parse($trx->waktu_keluar)->format('d/m/Y H:i') : '-' }}</td>
                <td style="border: 1px solid #ccc;">{{ $durationHours }}j {{ $durationMins }}m</td>
                <td style="border: 1px solid #ccc; text-align: right;">Rp {{ number_format($trx->total_biaya ?? 0, 0, ',', '.') }}</td>
            </tr>
        @endforeach
        <tr>
            <td colspan="7" style="border: 1px solid #000; font-weight: bold; text-align: right; background-color: #f0f0f0;">TOTAL</td>
            <td style="border: 1px solid #000; font-weight: bold; text-align: right; background-color: #f0f0f0;">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</td>
        </tr>
    </tbody>
</table>

<table style="margin-top: 20px;">
    <thead>
        <tr>
            <td colspan="3" style="font-weight: bold; font-size: 12px;">RINGKASAN</td>
        </tr>
        <tr></tr>
        <tr>
            <td style="font-weight: bold;">Total Transaksi:</td>
            <td style="text-align: right;">{{ $totalTransactions }}</td>
            <td></td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Total Pendapatan:</td>
            <td style="text-align: right;">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</td>
            <td></td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Rata-rata Per Transaksi:</td>
            <td style="text-align: right;">Rp {{ number_format($totalRevenue / ($totalTransactions ?: 1), 0, ',', '.') }}</td>
            <td></td>
        </tr>
    </thead>
</table>

@if(count($byArea) > 0)
    <table style="margin-top: 20px;">
        <thead>
            <tr>
                <td colspan="3" style="font-weight: bold; font-size: 12px;">PENDAPATAN BERDASARKAN AREA</td>
            </tr>
            <tr>
                <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Area</th>
                <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0; text-align: right;">Transaksi</th>
                <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0; text-align: right;">Pendapatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($byArea as $areaData)
                <tr>
                    <td style="border: 1px solid #ccc;">{{ $areaData['nama'] }}</td>
                    <td style="border: 1px solid #ccc; text-align: right;">{{ $areaData['count'] }}</td>
                    <td style="border: 1px solid #ccc; text-align: right;">Rp {{ number_format($areaData['revenue'], 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif

@if(count($byVehicleType) > 0)
    <table style="margin-top: 20px;">
        <thead>
            <tr>
                <td colspan="3" style="font-weight: bold; font-size: 12px;">PENDAPATAN BERDASARKAN JENIS KENDARAAN</td>
            </tr>
            <tr>
                <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0;">Jenis</th>
                <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0; text-align: right;">Transaksi</th>
                <th style="border: 1px solid #000; font-weight: bold; background-color: #e0e0e0; text-align: right;">Pendapatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($byVehicleType as $vehicleData)
                <tr>
                    <td style="border: 1px solid #ccc;">{{ ucfirst($vehicleData['type']) }}</td>
                    <td style="border: 1px solid #ccc; text-align: right;">{{ $vehicleData['count'] }}</td>
                    <td style="border: 1px solid #ccc; text-align: right;">Rp {{ number_format($vehicleData['revenue'], 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
