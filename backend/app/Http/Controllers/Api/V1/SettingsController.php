<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SettingsResource;
use App\Models\Setting;

class SettingsController extends Controller
{
    /** İşletme bilgileri — telefon, adres, çalışma saatleri, sosyal medya. */
    public function show(): SettingsResource
    {
        return new SettingsResource(Setting::get('site'));
    }
}
