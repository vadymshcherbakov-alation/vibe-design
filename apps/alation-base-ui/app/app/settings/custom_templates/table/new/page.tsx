'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTableTemplatePage() {
  const router = useRouter();

  useEffect(() => {
    // Generate a new template ID and redirect to the editor
    const newTemplateId = `table-template-${Date.now()}`;
    router.push(`/app/settings/custom_templates/table/${newTemplateId}`);
  }, [router]);

  return null; // This page just redirects
}