export default function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch (err) {
    return true;
  }
}
