'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDocumentHubPage() {
  const router = useRouter();

  useEffect(() => {
    // Generate a new hub ID and redirect to the editor
    const newHubId = `document-hub-${Date.now()}`;
    router.push(`/app/settings/custom_templates/document_hubs/${newHubId}`);
  }, [router]);

  return null; // This page just redirects
}