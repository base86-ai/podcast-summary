import axios from 'axios';


/**
* Verify a Gumroad license key for a given product.
* Lightweight server-side validation that doesn't require your access token.
* Returns { valid: boolean, uses: number | null, purchaser_email?: string }
*/
export async function verifyGumroadLicense({ licenseKey, productId }) {
if (!licenseKey || !productId) {
return { valid: false, uses: null };
}
try {
const url = 'https://api.gumroad.com/v2/licenses/verify';
const { data } = await axios.post(url, {
product_id: productId,
license_key: licenseKey,
increment_uses_count: true
}, { timeout: 12000 });


const valid = !!(data && data.success === true && data.purchase && data.purchase.license_key);
const uses = valid ? (data.purchase.uses || 0) : null;
const purchaser_email = valid ? data.purchase.email : undefined;
return { valid, uses, purchaser_email };
} catch (err) {
// If Gumroad is down or rate limited, fail closed.
return { valid: false, uses: null };
}
}