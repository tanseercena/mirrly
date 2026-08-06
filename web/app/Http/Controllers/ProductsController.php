<?php

namespace App\Http\Controllers;

use App\Helpers\Shopify;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductsController extends Controller
{
    /**
     * Fetch ALL products from the store with pagination
     * Returns products in the same format as getProducts in CollectionController
     */
    public function getAllProducts(Request $request)
    {
        try {
            $session = $request->get('shopifySession');
            $shop = $session->getShop();
            $accessToken = $session->getAccessToken();

            $allProducts = [];
            $hasNextPage = true;
            $cursor = null;

            // GraphQL query to fetch all products with pagination
            while ($hasNextPage) {
                $afterCursor = $cursor ? ', after: "' . $cursor . '"' : '';

                $query = <<<QUERY
                query GetAllProducts(\$num: Int!) {
                  products(first: \$num$afterCursor) {
                    edges {
                      node {
                        id
                        title
                        featuredImage {
                          url
                          altText
                        }
                      }
                    }
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                  }
                }
                QUERY;

                $variables = [
                    'num' => 50, // Fetch 50 products per page
                ];

                $responseBody = Shopify::queryOrException($shop, $accessToken, [
                    'query' => $query,
                    'variables' => $variables,
                ]);

                if (isset($responseBody['data']['products']['edges'])) {
                    foreach ($responseBody['data']['products']['edges'] as $edge) {
                        $product = $edge['node'];
                        $allProducts[] = [
                            'id' => $product['id'],
                            'title' => $product['title'],
                            'image' => [
                                'src' => $product['featuredImage']['url'] ?? null,
                            ],
                        ];
                    }
                }

                // Check if there are more products to fetch
                $pageInfo = $responseBody['data']['products']['pageInfo'] ?? null;
                $hasNextPage = $pageInfo['hasNextPage'] ?? false;
                $cursor = $pageInfo['endCursor'] ?? null;
            }

            return response()->json([
                'products' => $allProducts,
                'total' => count($allProducts),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch all products: ' . $e->getMessage());
            return response()->json([
                'products' => [],
                'total' => 0,
                'error' => 'Failed to fetch products',
            ], 500);
        }
    }
}
