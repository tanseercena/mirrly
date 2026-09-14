// Shopify storefront cart helper for the try-on flow. The try-on session id
// rides along as a line-item property so orders can be attributed back to a
// session via cart_token → order webhook matching server-side.

export async function addVariantToCart(
  variantId: string,
  quantity: number,
  tryonSessionId?: string | null
): Promise<void> {
  const res = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        {
          id: Number(variantId),
          quantity,
          ...(tryonSessionId
            ? { properties: { _mirrly_tryon_session: tryonSessionId } }
            : {}),
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`cart add failed: ${res.status}`);

  // Lets themes (and our own widget) react without a page reload.
  window.dispatchEvent(new CustomEvent('mirrly:cart-added', { detail: { variantId } }));
}
