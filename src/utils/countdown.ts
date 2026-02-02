/**
 * Returns a human-readable countdown string until the given date.
 */
export function getCountdownText(until: Date): string {
  const now = new Date();
  const diffMs = until.getTime() - now.getTime();

  if (diffMs <= 0) return 'Leaving soon';

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `Leaving in ${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `Leaving in ${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `Leaving in ${minutes}m`;
  }
  return 'Leaving in < 1m';
}

/** True if the profile is leaving in less than 24 hours (and still in the future). */
export function isLeavingInLessThan24Hours(until: Date): boolean {
  const diffMs = until.getTime() - Date.now();
  return diffMs > 0 && diffMs < 24 * 60 * 60 * 1000;
}
