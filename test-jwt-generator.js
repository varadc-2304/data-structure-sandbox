const crypto = require('crypto');

// Your JWT secret (same as in Supabase secrets)
const JWT_SECRET = 'your-jwt-secret-here'; // Replace with actual secret

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function createJWT(payload) {
  // JWT Header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // Create signature
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${data}.${signature}`;
}

// Sample user data
const userData = {
  id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
  email: 'test@example.com',
  name: 'Test User',
  prn: 'PRN001',
  department: 'Computer Science',
  course: 'B.Tech',
  grad_year: '2024',
  role: 'student',
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expires in 1 hour
  iat: Math.floor(Date.now() / 1000), // Issued now
  iss: 'test-system'
};

const jwt = createJWT(userData);
console.log('Generated JWT:', jwt);
console.log('\nUse this in your Postman request body:');
console.log(JSON.stringify({ encrypted_token: jwt }, null, 2));