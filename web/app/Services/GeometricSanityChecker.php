<?php

namespace App\Services;

/**
 * Cross-check for ML landmark detections on clothing. Runs ALONGSIDE the
 * model on every clothing detection — never instead of it. A detection
 * that fails sanity doesn't get rejected; it loses score and routes to
 * needs_review (try-on is never blocked on review status).
 *
 * Checks are physical-plausibility heuristics on normalized anchor
 * coordinates: symmetric shoulders, hem below shoulders, plausible
 * aspect ratio. Missing anchors simply skip their check.
 */
class GeometricSanityChecker
{
    /** Max normalized y-difference between a horizontal anchor pair. */
    private const PAIR_LEVEL_TOLERANCE = 0.12;

    /** Plausible width/height ratio of the garment's own anchor extent. */
    private const ASPECT_RANGES = [
        'top' => [0.5, 1.6],
        'jacket' => [0.5, 1.5],
        'dress' => [0.3, 1.0],
        'pants' => [0.3, 1.1],
        'shorts' => [0.4, 1.6],
        'skirt' => [0.4, 1.8],
    ];

    /**
     * @param  array<string, array{x: float, y: float}>  $anchors
     * @return array{passed: bool, score: float, reasons: string[]}
     */
    public function check(array $anchors, string $templateType): array
    {
        $reasons = [];
        $checks = 0;
        $passed = 0;

        // Horizontal pairs must be level (shoulders at the same height, etc.).
        foreach (['shoulder_left' => 'shoulder_right', 'waist_left' => 'waist_right'] as $a => $b) {
            if (isset($anchors[$a], $anchors[$b])) {
                $checks++;
                if (abs($anchors[$a]['y'] - $anchors[$b]['y']) <= self::PAIR_LEVEL_TOLERANCE) {
                    $passed++;
                } else {
                    $reasons[] = "{$a}/{$b} not level";
                }
            }
        }

        // Any hem pair must sit below the shoulder/waist pair that defines
        // the top of the garment.
        foreach (['hem_left' => 'hem_right'] as $a => $b) {
            if (!isset($anchors[$a], $anchors[$b])) {
                continue;
            }

            $hemY = min($anchors[$a]['y'], $anchors[$b]['y']);
            $checks++;

            $topY = $this->topmostPairY($anchors, ['shoulder_left', 'shoulder_right', 'waist_left', 'waist_right']);
            if ($topY !== null && $hemY > $topY) {
                $passed++;
            } else {
                $reasons[] = 'hem not below shoulders/waist';
            }
        }

        // Aspect ratio of the anchor spread vs the garment type.
        if (isset(self::ASPECT_RANGES[$templateType])) {
            $extent = $this->anchorExtent($anchors);
            if ($extent !== null) {
                $checks++;
                [$min, $max] = self::ASPECT_RANGES[$templateType];
                $aspect = $extent['width'] / max($extent['height'], 0.0001);
                if ($aspect >= $min && $aspect <= $max) {
                    $passed++;
                } else {
                    $reasons[] = sprintf('aspect ratio %.2f outside [%.2f, %.2f]', $aspect, $min, $max);
                }
            }
        }

        // No checks applicable (sparse anchors) counts as neutral-pass — the
        // sanity check must not veto a detection purely for having few points.
        if ($checks === 0) {
            return ['passed' => true, 'score' => 0.7, 'reasons' => ['no applicable checks']];
        }

        return [
            'passed' => $passed === $checks,
            'score' => round($passed / $checks, 4),
            'reasons' => $reasons,
        ];
    }

    /**
     * @param  string[]  $names
     */
    private function topmostPairY(array $anchors, array $names): ?float
    {
        $ys = [];
        foreach ($names as $name) {
            if (isset($anchors[$name])) {
                $ys[] = $anchors[$name]['y'];
            }
        }

        return $ys ? min($ys) : null;
    }

    private function anchorExtent(array $anchors): ?array
    {
        if (count($anchors) < 2) {
            return null;
        }

        $xs = array_column($anchors, 'x');
        $ys = array_column($anchors, 'y');

        return [
            'width' => max($xs) - min($xs),
            'height' => max($ys) - min($ys),
        ];
    }
}
