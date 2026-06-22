export function toast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
  }
}
