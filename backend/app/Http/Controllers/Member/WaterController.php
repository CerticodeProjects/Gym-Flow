<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\WaterIntakeEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WaterController extends Controller
{
    /**
     * GET /api/v1/member/water?date_key=2026-10-07
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $dateKey = $request->query('date_key', now()->format('Y-m-d'));

        $entries = $user->waterIntakeEntries()
            ->where('date_key', $dateKey)
            ->orderBy('logged_at', 'desc')
            ->get();

        $totalMl = $entries->sum('amount_ml');

        return response()->json([
            'date_key'   => $dateKey,
            'total_ml'   => $totalMl,
            'entries'    => $entries,
        ]);
    }

    /**
     * POST /api/v1/member/water
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount_ml' => ['required', 'integer', 'min:1'],
            'logged_at' => ['sometimes', 'date'],
            'date_key'  => ['sometimes', 'string', 'size:10'],
        ]);

        $loggedAt = isset($validated['logged_at']) ? new \DateTime($validated['logged_at']) : now();
        $dateKey = $validated['date_key'] ?? $loggedAt->format('Y-m-d');

        $entry = $request->user()->waterIntakeEntries()->create([
            'amount_ml' => $validated['amount_ml'],
            'logged_at' => $loggedAt,
            'date_key'  => $dateKey,
        ]);

        return response()->json($entry, 201);
    }
}
