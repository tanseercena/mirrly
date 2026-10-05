<?php

namespace App\Services;

use App\Models\GarmentAsset;
use App\Models\Product;

/**
 * Maps a product to one try-on template type.
 *
 * Shopify's own product_type/tags are authoritative when they name a
 * category; otherwise a keyword pass over product_type, tags and title
 * acts as the "small classifier" fallback. Returns null when nothing
 * indicates a try-on-able category — such products simply get no rig.
 */
class GarmentTypeClassifier
{
    /**
     * Keyword → template type. More specific types are matched first so
     * e.g. "sunglasses" resolves to glasses and "sweatpants" to pants
     * rather than being caught by a broader keyword. Word-boundary
     * matching keeps "sweatshirt" from matching "shirt".
     */
    private const KEYWORDS = [
        'glasses' => ['glasses', 'sunglasses', 'eyewear', 'spectacles', 'shades'],
        'shoes' => ['shoes', 'sneakers', 'boots', 'sandals', 'heels', 'slippers', 'loafers', 'oxfords', 'footwear', 'flats', 'pumps'],
        'cap' => ['cap', 'hat', 'beanie', 'fedora', 'bucket hat', 'visor', 'headwear'],
        'bag' => ['bag', 'backpack', 'purse', 'handbag', 'tote', 'satchel', 'clutch', 'wallet', 'pouch'],
        'necklace' => ['necklace', 'pendant', 'choker', 'neck chain'],
        'shorts' => ['shorts'],
        'skirt' => ['skirt'],
        'dress' => ['dress', 'gown', 'sundress', 'kaftan', 'caftan', 'jumpsuit', 'romper'],
        'jacket' => ['jacket', 'coat', 'blazer', 'parka', 'cardigan', 'windbreaker', 'bomber', 'anorak', 'puffer'],
        'pants' => ['pants', 'trousers', 'jeans', 'leggings', 'joggers', 'sweatpants', 'chinos'],
        'top' => ['t-shirt', 'tshirt', 'shirt', 'blouse', 'top', 'sweater', 'hoodie', 'sweatshirt', 'tank', 'polo', 'pullover', 'tunic'],
    ];

    /**
     * @return array{template_type: string, category: string}|null
     *         category is 'clothing' (ML model path) or 'accessory'
     *         (geometric path), or null when the product isn't try-on-able.
     */
    public function classify(Product $product): ?array
    {
        $haystack = $this->buildHaystack($product);

        if ($haystack === '') {
            return null;
        }

        foreach (self::KEYWORDS as $templateType => $keywords) {
            foreach ($keywords as $keyword) {
                if ($this->contains($haystack, $keyword)) {
                    return [
                        'template_type' => $templateType,
                        'category' => in_array($templateType, GarmentAsset::CLOTHING_TYPES, true)
                            ? 'clothing'
                            : 'accessory',
                    ];
                }
            }
        }

        return null;
    }

    private function buildHaystack(Product $product): string
    {
        $parts = [
            $product->product_type ?? '',
        ];

        $tags = $product->shopify_product['tags'] ?? [];
        $parts[] = is_array($tags) ? implode(' ', $tags) : (string) $tags;

        // Title as a last-ditch signal — merchants often name the garment
        // ("Leather Biker Jacket") even when product_type and tags are empty.
        $parts[] = $product->title ?? '';

        return mb_strtolower(implode(' ', array_filter($parts)));
    }

    private function contains(string $haystack, string $keyword): bool
    {
        // Multi-word keywords ("bucket hat") can't use word boundaries
        // reliably across odd merchant spellings — plain substring is fine
        // because they are specific enough.
        if (str_contains($keyword, ' ')) {
            return str_contains($haystack, $keyword);
        }

        // Allow the merchant's plural ("t-shirts", "tees") without a
        // keyword for every singular/plural pair.
        $pluralSuffix = str_ends_with($keyword, 's') ? '' : 's?';

        return preg_match('/\b' . preg_quote($keyword, '/') . $pluralSuffix . '\b/u', $haystack) === 1;
    }
}
