/**
 * Utility to perform a quick HEAD request to verify the URL
 */
export async function validateAudioUrl(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
  
      const response = await fetch(url, { 
        method: 'HEAD', 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (err) {
      console.warn('URL validation failed:', err);
      return false;
    }
  }