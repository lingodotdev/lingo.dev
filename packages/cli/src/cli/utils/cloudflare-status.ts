export interface CloudflareStatusResponse {
  status: {
    indicator: 'none' | 'minor' | 'major' | 'critical';
    description: string;
  };
}

export async function checkCloudflareStatus(): Promise<CloudflareStatusResponse | null> {
  try {
    const response = await fetch('https://www.cloudflarestatus.com/api/v2/status.json', {
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
  }
  return null;
}

export function formatCloudflareStatusMessage(status: CloudflareStatusResponse): string {
  if (status.status.indicator === 'none') {
    return '';
  }
  return `Cloudflare is experiencing ${status.status.indicator} issues: ${status.status.description}. This may be affecting the API connection.`;
}
