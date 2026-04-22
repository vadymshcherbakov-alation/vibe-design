'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function NewDocumentTemplateRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const hubId = params.hubId as string;

  useEffect(() => {
    // Generate a new template ID and redirect to the editor
    const newTemplateId = `document-template-${Date.now()}`;
    router.push(`/app/settings/custom_templates/document_hubs/${hubId}/templates/${newTemplateId}`);
  }, [router, hubId]);

  return null; // This page just redirects
}