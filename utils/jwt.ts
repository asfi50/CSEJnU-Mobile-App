export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return true;
    
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return true;
    
    const expiry = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    return true;
  }
}
