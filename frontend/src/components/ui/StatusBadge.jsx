import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'VERIFIED_COMPATIBLE':
      case 'LOCKED_V1':
      case 'LOCKED_V2':
      case 'FUNDED':
      case 'DELIVERED':
      case 'COMPLETED':
      case 'ACCEPTED':
      case 'PICKUP_CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING_VERIFICATION':
      case 'PENDING_APPROVAL':
      case 'PENDING_V2':
      case 'PENDING':
      case 'FORMING':
      case 'FORMED':
      case 'NEGOTIATING':
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DRYING_REVIEW':
      case 'FLAGGED':
      case 'REJECTED':
      case 'ABSENT_AT_PICKUP':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'IN_BATCH':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'DRAFT':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.replace(/_/g, ' ');
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeClass()}`}>
      {formatText(status)}
    </span>
  );
};
