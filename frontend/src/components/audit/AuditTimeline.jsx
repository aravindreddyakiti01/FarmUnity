import React from 'react';
import { History, ArrowRight, Shield, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const AuditTimeline = ({ logs = [] }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
        <History className="w-10 h-10 mx-auto mb-2 text-gray-300" />
        No audit logs recorded for this entity yet.
      </div>
    );
  }

  const getEventBadgeColor = (eventType) => {
    if (eventType.includes('PASS') || eventType.includes('LOCKED') || eventType.includes('DELIVERED') || eventType.includes('SETTLEMENT')) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    if (eventType.includes('FAIL') || eventType.includes('SUSPENDED') || eventType.includes('ABSENT') || eventType.includes('SHORTFALL')) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (eventType.includes('FUNDED') || eventType.includes('AMENDMENT') || eventType.includes('PROPOSED')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="flow-root bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-600" /> Complete Cryptographic Audit Trail
      </h3>

      <ul className="-mb-8">
        {logs.map((log, idx) => (
          <li key={log.id || idx}>
            <div className="relative pb-8">
              {idx !== logs.length - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center ring-8 ring-white text-green-600">
                    <Clock className="w-4 h-4" />
                  </span>
                </div>
                <div className="flex-1 min-w-0 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getEventBadgeColor(log.eventType)}`}>
                        {log.eventType}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        [{log.entityType} #{log.entityId}]
                      </span>
                    </div>
                    <time className="text-[11px] text-gray-400">
                      {log.timestamp ? format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm:ss') : 'N/A'}
                    </time>
                  </div>

                  <p className="text-sm text-gray-800 font-medium mt-2">{log.details}</p>

                  {(log.previousState || log.newState) && (
                    <div className="mt-2 text-xs flex items-center gap-2 font-mono text-gray-600 bg-white px-2.5 py-1 rounded border border-gray-200 inline-flex">
                      <span className="text-gray-400">{log.previousState || 'INIT'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-bold text-gray-900">{log.newState}</span>
                    </div>
                  )}

                  <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
                    <User className="w-3 h-3" /> Actor: {log.actorRole} {log.actorId ? `(ID: ${log.actorId})` : '(System)'}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
