/**
 * Secure cryptographic utilities for authentication
 */

/**
 * Verify JWT token signature using HMAC-SHA256
 * @param token - JWT token to verify
 * @param secret - Secret key for verification
 * @returns Promise<boolean> - True if signature is valid
 */
export async function verifyJWTSignature(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;
    
    // Create HMAC-SHA256 signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    const expectedSignatureBase64 = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return signature === expectedSignatureBase64;
  } catch (error) {
    console.error('JWT signature verification failed:', error);
    return false;
  }
}

/**
 * Decode JWT payload safely
 * @param token - JWT token to decode
 * @returns Decoded payload or null if invalid
 */
export function decodeJWTPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('JWT payload decode failed:', error);
    return null;
  }
}

/**
 * Hash password using PBKDF2
 * @param password - Plain text password
 * @param salt - Salt for hashing (optional, will generate if not provided)
 * @returns Promise<{hash: string, salt: string}> - Hashed password and salt
 */
export async function hashPassword(password: string, salt?: string): Promise<{hash: string, salt: string}> {
  const encoder = new TextEncoder();
  
  // Generate salt if not provided
  if (!salt) {
    const saltArray = new Uint8Array(16);
    crypto.getRandomValues(saltArray);
    salt = btoa(String.fromCharCode(...saltArray));
  }
  
  // Import password as key
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derive key using PBKDF2
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000, // 100k iterations for security
      hash: 'SHA-256'
    },
    passwordKey,
    256 // 256 bits
  );
  
  const hash = btoa(String.fromCharCode(...new Uint8Array(derivedKey)));
  
  return { hash, salt };
}

/**
 * Verify password against hash
 * @param password - Plain text password to verify
 * @param hash - Stored hash
 * @param salt - Salt used for hashing
 * @returns Promise<boolean> - True if password is correct
 */
export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  try {
    const { hash: computedHash } = await hashPassword(password, salt);
    return computedHash === hash;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

/**
 * Generate a secure random token
 * @param length - Token length in bytes (default: 32)
 * @returns Base64 encoded token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}