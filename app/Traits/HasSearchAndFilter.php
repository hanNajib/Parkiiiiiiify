<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

trait HasSearchAndFilter
{
    public function scopeSearch($query)
    {
        $keyword =  trim(request()->query('s', ''));

        if (!$keyword) return $query;

        $words = preg_split('/\s+/', $keyword);
        $columns = $this->searchable ?? $this->getFillable();

        if (empty($columns)) return $query;

        return $query->where(function($q) use ($columns, $words) {
            foreach($words as $word) {
                $word = strtolower($word);

                $q->where(function($sub) use ($word, $columns) {
                    foreach($columns as $col) {
                        if(Str::contains($col, '.')) {
                            [$relation, $relCol] = explode('.', $col, 2);
                            $sub->orWhereHas($relation, fn($r) => $r->whereRaw("LOWER($relCol) LIKE ?", ["%$word%"]));
                        } else {
                            $sub->orWhereRaw("LOWER($col) LIKE ?", ["%$word%"]);
                        }
                    }
                });
            }
        });
    }

    public function scopeFilter($query) {
        $filters = request()->query();
        $filterable = $this->filterable ?? [];
        
        foreach($filters as $param => $value) {
            if(!isset($filterable[$param]) ||  is_null($value) || $value === '') {
                continue;
            }

            $column = $filterable[$param];

            if(str_contains($column, '.')) {
                [$relation, $relationColumn] = explode('.', $column, 2);
                $query->whereHas($relation, fn($q) => $q->where($relationColumn, $value));
            } else {
                $query->where($column, $value);
            }
        }

        return $query;
    }
}
