<?php

namespace App\Http\Controllers;

use App\Helpers\Shopify;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CollectionController extends Controller
{
    public function productCount(Request $request)
    {
        $collectionIds = $request->input('collectionIds', []);

        if (empty($collectionIds)) {
            return response()->json([
                'total' => 0,
            ]);
        }

        try {
            $session = $request->get('shopifySession');
            $shop = $session->getShop();
            $accessToken = $session->getAccessToken();

            // Build GraphQL query to fetch productsCount for all collections
            // We use the nodes query to fetch multiple collections by their IDs
            $query = <<<QUERY
            query GetCollectionsProductsCount(\$ids: [ID!]!) {
              nodes(ids: \$ids) {
                ... on Collection {
                  id
                  productsCount {
                    count
                  }
                }
              }
            }
            QUERY;

            $variables = [
                'ids' => $collectionIds,
            ];

            $responseBody = Shopify::queryOrException($shop, $accessToken, [
                'query' => $query,
                'variables' => $variables,
            ]);

            $total = 0;
            if (isset($responseBody['data']['nodes'])) {
                foreach ($responseBody['data']['nodes'] as $node) {
                    if (isset($node['productsCount']['count'])) {
                        $total += (int) $node['productsCount']['count'];
                    }
                }
            }

            return response()->json([
                'total' => $total,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch collection product counts: ' . $e->getMessage());
            return response()->json([
                'total' => 0,
                'error' => 'Failed to fetch product counts',
            ], 500);
        }
    }

    public function getProducts(Request $request)
    {
        $collectionIds = $request->input('collectionIds', []);

        if (empty($collectionIds)) {
            return response()->json([
                'products' => [],
            ]);
        }

        try {
            $session = $request->get('shopifySession');
            $shop = $session->getShop();
            $accessToken = $session->getAccessToken();

            // Build GraphQL query to fetch products from all collections
            // Using collections query with products connection
            $query = <<<QUERY
            query GetCollectionsProducts(\$ids: [ID!]!) {
              nodes(ids: \$ids) {
                ... on Collection {
                  id
                  products(first: 50) {
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
                  }
                }
              }
            }
            QUERY;

            $variables = [
                'ids' => $collectionIds,
            ];

            $responseBody = Shopify::queryOrException($shop, $accessToken, [
                'query' => $query,
                'variables' => $variables,
            ]);

            $products = [];
            $seenIds = []; // Track seen product IDs to remove duplicates

            if (isset($responseBody['data']['nodes'])) {
                foreach ($responseBody['data']['nodes'] as $node) {
                    if (isset($node['products']['edges'])) {
                        foreach ($node['products']['edges'] as $edge) {
                            $product = $edge['node'];
                            $productId = $product['id'];

                            // Skip if we've already seen this product
                            if (!isset($seenIds[$productId])) {
                                $seenIds[$productId] = true;
                                $products[] = [
                                    'id' => $product['id'],
                                    'title' => $product['title'],
                                    'image' => [
                                        'src' => $product['featuredImage']['url'] ?? null,
                                    ],
                                ];
                            }
                        }
                    }
                }
            }

            return response()->json([
                'products' => $products,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch collection products: ' . $e->getMessage());
            return response()->json([
                'products' => [],
                'error' => 'Failed to fetch products',
            ], 500);
        }
    }
}