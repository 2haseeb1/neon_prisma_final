// Remove this line: No enum used anymore
// import { ServiceStatus } from '@prisma/client';

/**
 * Convert API input to normalized internal format.
 */
export function mapStatusFromApi(status: string): string {
  const normalized = status.toLowerCase().replace('_', '-');

  if (['pending', 'in-progress', 'done'].includes(normalized)) {
    return normalized;
  }

  throw new Error(`Invalid status value: ${status}`);
}


export function mapStatusToApi(status: string): string {
  return status.toLowerCase().replace('_', '-');
}

