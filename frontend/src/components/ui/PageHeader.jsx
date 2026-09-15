import React from 'react';

export const PageHeader = ({
  title,
  description,
  action,
  breadcrumbs = [],
}) => {
  return (
    <div className="mb-6 pb-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {b.href ? (
                  <a href={b.href} className="hover:text-stone-900 transition-colors">
                    {b.label}
                  </a>
                ) : (
                  <span className="text-stone-700 font-medium">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-stone-600 mt-1 max-w-3xl">{description}</p>
        )}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};
