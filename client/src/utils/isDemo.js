export function isDemoUser() {
  return localStorage.getItem('accessToken') === 'demo';
}
