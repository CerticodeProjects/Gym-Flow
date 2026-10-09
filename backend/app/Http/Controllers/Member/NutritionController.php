<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\NutritionEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NutritionController extends Controller
{
    /**
     * GET /api/v1/member/nutrition?date_key=2026-10-07
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $dateKey = $request->query('date_key', now()->format('Y-m-d'));

        $entries = $user->nutritionEntries()
            ->where('date_key', $dateKey)
            ->orderBy('logged_at', 'desc')
            ->get();

        $totalCalories = $entries->sum('calories');
        $totalProtein = $entries->sum('protein_g');
        $totalCarbs = $entries->sum('carbs_g');
        $totalFat = $entries->sum('fat_g');

        return response()->json([
            'date_key'        => $dateKey,
            'total_calories'  => (int) $totalCalories,
            'total_protein_g' => (float) $totalProtein,
            'total_carbs_g'   => (float) $totalCarbs,
            'total_fat_g'     => (float) $totalFat,
            'entries'         => $entries,
        ]);
    }

    /**
     * POST /api/v1/member/nutrition
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'food_name'    => ['required', 'string', 'max:255'],
            'calories'     => ['required', 'integer', 'min:0'],
            'protein_g'    => ['sometimes', 'numeric', 'min:0'],
            'carbs_g'      => ['sometimes', 'numeric', 'min:0'],
            'fat_g'        => ['sometimes', 'numeric', 'min:0'],
            'serving_size' => ['sometimes', 'nullable', 'string', 'max:100'],
            'meal_type'    => ['sometimes', 'string', 'in:breakfast,lunch,dinner,snack'],
            'source'       => ['sometimes', 'string', 'in:manual,barcode,ai_scanner'],
            'barcode'      => ['sometimes', 'nullable', 'string', 'max:100'],
            'logged_at'    => ['sometimes', 'date'],
            'date_key'     => ['sometimes', 'string', 'size:10'],
        ]);

        $loggedAt = isset($validated['logged_at']) ? new \DateTime($validated['logged_at']) : now();
        $dateKey = $validated['date_key'] ?? $loggedAt->format('Y-m-d');

        $entry = $request->user()->nutritionEntries()->create(array_merge($validated, [
            'logged_at' => $loggedAt,
            'date_key'  => $dateKey,
        ]));

        return response()->json($entry, 201);
    }

    /**
     * DELETE /api/v1/member/nutrition/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $entry = $request->user()->nutritionEntries()->find($id);

        if (! $entry) {
            return response()->json(['message' => 'Nutrition entry not found.'], 404);
        }

        $entry->delete();

        return response()->json(['message' => 'Nutrition entry removed.']);
    }
}
