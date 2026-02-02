<?php

namespace App\Traits\Traits;

trait EnumToString
{
    public function __toString(): string
    {
        return $this->value;
    }
}
