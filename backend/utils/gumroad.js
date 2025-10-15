import axios from 'axios';

/**
 * Verify a Gumroad license key for a given product.
 * Works with or without an access token.
 * Returns { valid: boolean, uses: number | null, purchaser_email?: string }
 */
export async function verifyGumroadLicense({ licenseKey, productId }) {
  if (!licenseKey || !productId) {
    return { valid: false, uses: null };
  }

  const token = process.env.GUMROAD_ACCESS_TOKEN?.trim();

  try {
    // Prefer authenticated API if token is present
    const url = token
      ? 'https://api.gumroad.com/v2/licenses/verify'
      : 'https://api.gumroad.com/v2/licenses/verify';

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const { data } = await axios.post(
      url,
      {
        product_id: productId,
        license_key: licenseKey,
        increment_uses_count: true,
      },
      {
        headers,
        timeout: 12000,
      }
    );

    const valid = !!(data && data.success === true && data.purchase?.license_key);
    const uses = valid ? data.purchase.uses || 0 : null;
    const purchaser_email = valid ? data.purchase.email : undefined;

    return { valid, uses, purchaser_email };
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'unknown error';
    console.warn('[gumroad] license check failed:', msg);
    return { valid: false, uses: null };
  }
}
