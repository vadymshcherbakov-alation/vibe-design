'use client';
import type { ReactNode } from 'react';

export function PreviewBox({ children }: { children: ReactNode }) {
  return (
    <div className="preview-box not-prose rounded-lg border bg-white p-6">
      {children}
    </div>
  );
}
