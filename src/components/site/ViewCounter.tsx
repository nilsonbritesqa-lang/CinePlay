'use client';

import { useEffect } from 'react';

interface ViewCounterProps {
  postId: string;
  slug: string;
}

export function ViewCounter({ postId, slug }: ViewCounterProps) {
  useEffect(() => {
    if (!postId && !slug) return;

    const storageKey = `cineplay_viewed_${postId || slug}`;
    const alreadyViewed = sessionStorage.getItem(storageKey);

    if (!alreadyViewed) {
      sessionStorage.setItem(storageKey, 'true');
      fetch('/api/posts/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, slug }),
      }).catch(err => {
        console.warn('Erro ao contabilizar visualização:', err);
      });
    }
  }, [postId, slug]);

  return null;
}
