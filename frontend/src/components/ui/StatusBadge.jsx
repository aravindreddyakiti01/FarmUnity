import React from 'react';

export const StatusBadge = ({ status, label }) => {
  const normalized = (status || '').toUpperCase().trim();

  // Define semantic tone based on business status
  let dotColor = 'bg-stone-400';
  let badgeClasses = 'bg-stone-100 text-stone-700 border-stone-200';
  let displayLabel = label || status || 'Pending';

  if (
    normalized.includes('VERIFIED') ||
    normalized.includes('AGREED') ||
    normalized.includes('CONFIRMED') ||
    normalized.includes('LOCKED') ||
    normalized.includes('DELIVERED') ||
    normalized.includes('SETTLED') ||
    normalized.includes('FUNDED') ||
    normalized.includes('ACTIVE') ||
    normalized.includes('COMPLETED')
  ) {
    dotColor = 'bg-green-600';
    badgeClasses = 'bg-green-50 text-green-800 border-green-200';
  } else if (
    normalized.includes('PENDING') ||
    normalized.includes('FORMING') ||
    normalized.includes('DRAFT') ||
    normalized.includes('PROPOSED')
  ) {
    dotColor = 'bg-amber-500';
    badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (
    normalized.includes('FAILED') ||
    normalized.includes('CANCELLED') ||
    normalized.includes('SHORTFALL') ||
    normalized.includes('DISPUTED') ||
    normalized.includes('REJECTED')
  ) {
    dotColor = 'bg-red-500';
    badgeClasses = 'bg-red-50 text-red-800 border-red-200';
  }

  // Format readable text
  if (!label && status) {
    displayLabel = status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${badgeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {displayLabel}
    </span>
  );
};
