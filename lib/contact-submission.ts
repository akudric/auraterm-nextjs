'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';

export function useContactSubmission(source?: string, onSuccessClose?: () => void) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const submitting = useRef(false);
  const closeSuccess = useCallback(() => {
    setSuccessOpen(false);
    onSuccessClose?.();
  }, [onSuccessClose]);

  useEffect(() => {
    if (!successOpen) return;
    const timer = setTimeout(closeSuccess, 3000);
    return () => clearTimeout(timer);
  }, [successOpen, closeSuccess]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (source) data.set('source', source);
    submitting.current = true;
    setLoading(true);
    setStatus('Slanje…');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || 'Slanje nije uspjelo. Pokušajte ponovno.');
      }
      form.reset();
      setStatus('Poslano! Javit ćemo se uskoro.');
      setSuccessOpen(true);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Slanje nije uspjelo. Pokušajte ponovno.');
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return { onSubmit, status, loading, successOpen, closeSuccess };
}
