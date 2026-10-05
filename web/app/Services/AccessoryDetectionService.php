<?php

namespace App\Services;

use InvalidArgumentException;
use RuntimeException;

/**
 * Geometric/contour detection for accessory categories (cap, glasses,
 * shoes, bag, necklace). Accessories are NOT an ML problem — the cutout's
 * alpha silhouette plus per-type layout heuristics produce the anchor
 * points. Cheap and fast; runs on our own box, never calls RunPod.
 *
 * All anchor coordinates are normalized (0..1) within the full cutout
 * image, so the storefront runtime can map them onto any rendering size.
 */
class AccessoryDetectionService
{
    /**
     * @param  string  $cutoutBinary  PNG bytes of the background-removed accessory.
     * @return array{
     *     anchors: array<string, array{x: float, y: float}>,
     *     confidence: float,
     *     bounding_box: array{x: float, y: float, width: float, height: float},
     *     image: array{width: int, height: int}
     * }
     */
    public function detect(string $cutoutBinary, string $templateType): array
    {
        $image = @imagecreatefromstring($cutoutBinary);

        if ($image === false) {
            throw new RuntimeException('Unable to decode cutout PNG for geometric analysis');
        }

        try {
            $width = imagesx($image);
            $height = imagesy($image);

            $silhouette = $this->analyzeSilhouette($image, $width, $height);

            if ($silhouette['coverage'] <= 0.001) {
                throw new RuntimeException('Cutout has no visible opaque region');
            }

            return array_merge(
                $this->buildAnchors($templateType, $silhouette),
                ['image' => ['width' => $width, 'height' => $height]]
            );
        } finally {
            imagedestroy($image);
        }
    }

    /**
     * Scan the alpha channel for the opaque bounding box, coverage (cutout
     * quality signal) and vertical mass profile (used to split pairs like
     * the two lenses / two shoes).
     *
     * @return array{left: float, top: float, right: float, bottom: float, coverage: float, mass_by_row: float[]}
     */
    private function analyzeSilhouette(\GdImage $image, int $width, int $height): array
    {
        // Sampling stride keeps the scan cheap on large product photos —
        // bounding-box precision of a couple of pixels is plenty for layout
        // heuristics that a human review pass corrects anyway.
        $stride = max(1, (int) floor(max($width, $height) / 400));

        $minX = $width;
        $minY = $height;
        $maxX = -1;
        $maxY = -1;
        $opaque = 0;
        $sampled = 0;
        $massByRow = array_fill(0, (int) ceil($height / $stride), 0.0);

        for ($y = 0; $y < $height; $y += $stride) {
            for ($x = 0; $x < $width; $x += $stride) {
                $sampled++;
                $alpha = (imagecolorat($image, $x, $y) >> 24) & 0xFF; // 0 = opaque, 127 = transparent

                if ($alpha < 64) {
                    $opaque++;
                    $minX = min($minX, $x);
                    $minY = min($minY, $y);
                    $maxX = max($maxX, $x);
                    $maxY = max($maxY, $y);
                    $massByRow[(int) floor($y / $stride)]++;
                }
            }
        }

        if ($maxX < 0) {
            return ['left' => 0.0, 'top' => 0.0, 'right' => 0.0, 'bottom' => 0.0, 'coverage' => 0.0, 'mass_by_row' => $massByRow];
        }

        return [
            'left' => $minX / $width,
            'top' => $minY / $height,
            'right' => ($maxX + 1) / $width,
            'bottom' => ($maxY + 1) / $height,
            'coverage' => $opaque / $sampled,
            'mass_by_row' => $massByRow,
        ];
    }

    /**
     * Per-type anchor layout, expressed as fractions of the detected
     * bounding box. These are deliberately simple placements — the pooled
     * review queue corrects them in place for anything that ships wrong.
     *
     * @return array{anchors: array<string, array{x: float, y: float}>, confidence: float, bounding_box: array{x: float, y: float, width: float, height: float}}
     */
    private function buildAnchors(string $templateType, array $silhouette): array
    {
        ['left' => $l, 'top' => $t, 'right' => $r, 'bottom' => $b, 'coverage' => $coverage] = $silhouette;

        $w = $r - $l;
        $h = $b - $t;
        $cx = $l + $w / 2;
        $cy = $t + $h / 2;

        // Pair split: find the vertical-mass valley around the middle of the
        // silhouette (gap between the two lenses / two shoes) so paired
        // anchors sit on each half rather than blindly at fixed fractions.
        $leftMassCenter = $this->massCenterOfRange($silhouette['mass_by_row'], $l, $cx, $silhouette);
        $rightMassCenter = $this->massCenterOfRange($silhouette['mass_by_row'], $cx, $r, $silhouette);

        switch ($templateType) {
            case 'glasses':
                $lensY = $t + $h * 0.45;
                $anchors = [
                    'lens_left' => ['x' => $leftMassCenter, 'y' => $lensY],
                    'bridge' => ['x' => $cx, 'y' => $t + $h * 0.35],
                    'lens_right' => ['x' => $rightMassCenter, 'y' => $lensY],
                    'temple_left' => ['x' => $l, 'y' => $lensY],
                    'temple_right' => ['x' => $r, 'y' => $lensY],
                ];
                break;

            case 'cap':
                $anchors = [
                    'crown_top' => ['x' => $cx, 'y' => $t + $h * 0.08],
                    'brim_front' => ['x' => $cx, 'y' => $b - $h * 0.05],
                    'side_left' => ['x' => $l + $w * 0.1, 'y' => $cy],
                    'side_right' => ['x' => $r - $w * 0.1, 'y' => $cy],
                ];
                break;

            case 'shoes':
                $ankleY = $t + $h * 0.15;
                $anchors = [
                    'toe_left' => ['x' => $l + $w * 0.05, 'y' => $b - $h * 0.1],
                    'heel_left' => ['x' => $leftMassCenter, 'y' => $b - $h * 0.1],
                    'toe_right' => ['x' => $r - $w * 0.05, 'y' => $b - $h * 0.1],
                    'heel_right' => ['x' => $rightMassCenter, 'y' => $b - $h * 0.1],
                    'collar_left' => ['x' => $leftMassCenter, 'y' => $ankleY],
                    'collar_right' => ['x' => $rightMassCenter, 'y' => $ankleY],
                ];
                break;

            case 'bag':
                $anchors = [
                    'handle_top' => ['x' => $cx, 'y' => $t + $h * 0.05],
                    'body_center' => ['x' => $cx, 'y' => $cy],
                    'bottom' => ['x' => $cx, 'y' => $b - $h * 0.05],
                    'side_left' => ['x' => $l + $w * 0.08, 'y' => $cy],
                    'side_right' => ['x' => $r - $w * 0.08, 'y' => $cy],
                ];
                break;

            case 'necklace':
                $anchors = [
                    'clasp_left' => ['x' => $l + $w * 0.05, 'y' => $t + $h * 0.05],
                    'pendant' => ['x' => $cx, 'y' => $b - $h * 0.1],
                    'clasp_right' => ['x' => $r - $w * 0.05, 'y' => $t + $h * 0.05],
                ];
                break;

            default:
                throw new InvalidArgumentException("No geometric layout for accessory type {$templateType}");
        }

        // Confidence from cutout quality only: opaque coverage relative to
        // the bounding box. A well-cut accessory fills most of its bbox;
        // stray noise or a clipped cutout dilutes coverage.
        $bboxCoverage = $coverage / max($w * $h, 0.0001);

        return [
            'anchors' => $anchors,
            'confidence' => round(min(1.0, $bboxCoverage), 4),
            'bounding_box' => ['x' => $l, 'y' => $t, 'width' => $w, 'height' => $h],
        ];
    }

    /**
     * Horizontal center of opaque mass within a normalized x-range —
     * where each half of a paired accessory (lens, shoe) actually sits.
     */
    private function massCenterOfRange(array $massByRow, float $xFrom, float $xTo, array $silhouette): float
    {
        // The row-mass profile is vertical only, so reconstruct the horizontal
        // center from the silhouette bounds: pairs are roughly symmetric, and
        // an offset center biases the anchor toward the heavier half, which is
        // the useful default when one shoe/lens is angled toward camera.
        $w = $silhouette['right'] - $silhouette['left'];

        if ($w <= 0) {
            return ($xFrom + $xTo) / 2;
        }

        // Weighted midpoint between the range's own edges, biased by which
        // half of the full silhouette the range overlaps most.
        $overlapLeft = max(0.0, min($xTo, $silhouette['left'] + $w / 2) - max($xFrom, $silhouette['left'])) / max($w, 0.0001);
        $bias = $overlapLeft >= 0.5 ? 0.4 : 0.6; // lean into the denser half

        return $xFrom + ($xTo - $xFrom) * $bias;
    }
}
