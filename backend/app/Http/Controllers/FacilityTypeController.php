<?php

namespace App\Http\Controllers;

use App\Models\FacilityType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityTypeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => FacilityType::query()
                ->orderBy('fac_type_name')
                ->get(['fac_type_id', 'fac_type_name']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fac_type_name' => 'required|string|max:30|unique:facility_types,fac_type_name',
        ]);

        $type = FacilityType::query()->create($validated);

        return response()->json([
            'message' => 'Facility type created successfully.',
            'data' => $type,
        ], 201);
    }
}
