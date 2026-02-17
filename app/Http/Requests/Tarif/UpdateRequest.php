<?php

namespace App\Http\Requests\Tarif;

use App\Models\Tarif;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | MAIN PRICE
            |--------------------------------------------------------------------------
            */
            'harga_awal' => 'required|numeric|min:0',

            /*
            |--------------------------------------------------------------------------
            | INTERVAL
            |--------------------------------------------------------------------------
            */
            'interval_menit' => 'nullable|integer|min:1',
            'harga_lanjutan' => 'nullable|numeric|min:0',

            /*
            |--------------------------------------------------------------------------
            | PROGRESSIVE
            |--------------------------------------------------------------------------
            */
            'progressive_rules' => 'nullable|json',

            /*
            |--------------------------------------------------------------------------
            | LIMITER
            |--------------------------------------------------------------------------
            */
            'maksimal_per_hari' => 'nullable|numeric|min:0',

            /**
             * |--------------------------------------------------------------------------
             * | TIME BASED
             * |--------------------------------------------------------------------------
             */
            'berlaku_dari' => 'nullable|regex:/^\d{2}:\d{2}(:\d{2})?$/',
            'berlaku_sampai' => 'nullable|regex:/^\d{2}:\d{2}(:\d{2})?$/',

            /*
            |--------------------------------------------------------------------------
            | STATUS
            |--------------------------------------------------------------------------
            */
            'is_active' => 'boolean',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            $start = $this->berlaku_dari;
            $end   = $this->berlaku_sampai;

            if ($start && !$end) {
                $validator->errors()->add('berlaku_sampai', 'Harus diisi jika berlaku_dari diisi.');
            }

            if ($end && !$start) {
                $validator->errors()->add('berlaku_dari', 'Harus diisi jika berlaku_sampai diisi.');
            }

            if (!$start || !$end) {
                return;
            }

            if ($start === $end) {
                $validator->errors()->add('berlaku_sampai', 'Range waktu tidak boleh sama.');
                return;
            }

            $tarifId = $this->route('tarif_parkir'); // pastikan route model binding pakai {tarif}
            $tarif = Tarif::findOrFail($tarifId);

            $query = Tarif::where('area_parkir_id', $tarif->area_parkir_id)
                ->where('jenis_kendaraan', $tarif->jenis_kendaraan)
                ->where('rule_type', $tarif->rule_type)
                ->where('is_active', true)
                ->where('id', '!=', $tarifId);

            if ($start < $end) {

                $query->where(function ($q) use ($start, $end) {
                    $q->where('berlaku_dari', '<', $end)
                        ->where('berlaku_sampai', '>', $start);
                });
            } else {

                $query->where(function ($q) use ($start, $end) {
                    $q->where(function ($q2) use ($start) {
                        $q2->where('berlaku_dari', '>=', $start);
                    })->orWhere(function ($q2) use ($end) {
                        $q2->where('berlaku_sampai', '<=', $end);
                    });
                });
            }

            if ($query->exists()) {
                $validator->errors()->add(
                    'berlaku_dari',
                    'Range waktu bertabrakan dengan tarif lain.'
                );
            }
        });
    }
}
