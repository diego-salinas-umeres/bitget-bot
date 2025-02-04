import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY!;
const API_SECRET = process.env.API_SECRET!;
const PASSPHRASE = process.env.PASSPHRASE!;

export function generateHeaders(
    method: string,
    path: string,
    body: string = '',
    queryString: string = ''
): Record<string, string>{

    const timestamp = Date.now().toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;
    const prehash = timestamp + method.toUpperCase() + fullPath + body;
    const hmac = crypto.createHmac('sha256', API_SECRET);
    const signature = hmac.update(prehash).digest('base64');

    return {
        'Content-Type': 'application/json',
        'ACCESS-KEY': API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': PASSPHRASE,
        locale: 'en-US',
    };
}