<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\UpdateSettingsRequest;
use App\Http\Resources\SettingsResource;
use App\Models\Setting;

/**
 * İşletme bilgilerini günceller — /api/v1/admin/settings.
 */
class SettingsController extends Controller
{
    public function show(): SettingsResource
    {
        return new SettingsResource(Setting::get('site'));
    }

    public function update(UpdateSettingsRequest $request): SettingsResource
    {
        $setting = Setting::put('site', $request->toSettingsValue());

        return new SettingsResource($setting->value);
    }
}
