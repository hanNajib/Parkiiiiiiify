<?php

namespace App\Http\Requests\Tarif;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Tarif;

class StoreRequest extends FormRequest
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
            | BASIC
            |--------------------------------------------------------------------------
            */
            'area_parkir_id' => 'required|exists:area_parkir,id',
            'rule_type' => 'required|in:flat,interval,progressive',
            'jenis_kendaraan' => 'required|in:motor,mobil,lainnya',

            /*
            |--------------------------------------------------------------------------
            | PRICE
            |--------------------------------------------------------------------------
            */
            'harga_awal' => 'required_if:rule_type,flat,interval,progressive|numeric|min:0',
            'interval_menit' => 'required_if:rule_type,interval|nullable|integer|min:1',
            'harga_lanjutan' => 'nullable|numeric|min:0',

            /*
            |--------------------------------------------------------------------------
            | PROGRESSIVE
            |--------------------------------------------------------------------------
            */
            'progressive_rules' => 'required_if:rule_type,progressive|json|nullable',

            /*
            |--------------------------------------------------------------------------
            | LIMITER
            |--------------------------------------------------------------------------
            */
            'maksimal_per_hari' => 'nullable|numeric|min:0',

            /*
            |--------------------------------------------------------------------------
            | TIME
            |--------------------------------------------------------------------------
            */
            'berlaku_dari' => 'nullable|regex:/^\d{2}:\d{2}(:\d{2})?$/',
            'berlaku_sampai' => 'nullable|regex:/^\d{2}:\d{2}(:\d{2})?$/',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            $start = $this->berlaku_dari;
            $end   = $this->berlaku_sampai;

            /*
            |--------------------------------------------------------------------------
            | VALIDASI DASAR TIME
            |--------------------------------------------------------------------------
            */

            if ($start && !$end) {
                $validator->errors()->add('berlaku_sampai', 'Harus diisi jika berlaku_dari diisi.');
                return;
            }

            if ($end && !$start) {
                $validator->errors()->add('berlaku_dari', 'Harus diisi jika berlaku_sampai diisi.');
                return;
            }

            if (!$start || !$end) {
                return;
            }

            if ($start === $end) {
                $validator->errors()->add('berlaku_sampai', 'Range waktu tidak boleh sama.');
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | CEGAH OVERLAP
            |--------------------------------------------------------------------------
            */

            $query = Tarif::where('area_parkir_id', $this->area_parkir_id)
                ->where('jenis_kendaraan', $this->jenis_kendaraan)
                ->where('rule_type', $this->rule_type)
                ->where('is_active', true)
                ->whereNotNull('berlaku_dari')
                ->whereNotNull('berlaku_sampai');

            if ($start < $end) {

                $query->where(function ($q) use ($start, $end) {
                    $q->where('berlaku_dari', '<', $end)
                        ->where('berlaku_sampai', '>', $start);
                });
            } else {

                $query->where(function ($q) use ($start, $end) {

                    $q->where(function ($q2) use ($start) {
                        $q2->where('berlaku_dari', '>=', $start);
                    })

                        ->orWhere(function ($q2) use ($end) {
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
