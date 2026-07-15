'use client';

import { pageContent } from '@original/content';
import Fuse from 'fuse.js';
import { ArrowUpRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { withBasePath } from '@/data/site';

type SearchItem = {
  title: string;
  summary: string;
  tags: string[];
  url: string;
  type: 'post' | 'project';
};

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (items.length > 0) return;
    setLoading(true);
    fetch(withBasePath('/search-index.json'))
      .then((response) => {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json() as Promise<SearchItem[]>;
      })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open, items.length]);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['title', 'summary', 'tags'],
        threshold: 0.34,
        ignoreLocation: true,
      }),
    [items],
  );
  const results = query.trim()
    ? fuse
        .search(query)
        .map(({ item }) => item)
        .slice(0, 8)
    : items.slice(0, 6);

  return (
    <>
      <button
        className="search-trigger"
        type="button"
        aria-label="搜索（Command K）"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Search aria-hidden="true" />
        <span className="search-shortcut">⌘K</span>
      </button>

      {open && (
        <div className="search-layer">
          <button
            className="search-backdrop"
            type="button"
            aria-label="关闭搜索"
            onClick={close}
          />
          <section
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="全站搜索"
          >
            <div className="search-input-row">
              <Search aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={pageContent.search.placeholder}
                aria-label={pageContent.search.label}
              />
              <button type="button" onClick={close} aria-label="关闭搜索">
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="search-results" aria-live="polite">
              {loading && (
                <p className="search-state">{pageContent.search.loading}</p>
              )}
              {!loading && results.length === 0 && (
                <p className="search-state">{pageContent.search.noResults}</p>
              )}
              {results.map((item) => (
                <Link
                  key={`${item.type}-${item.url}`}
                  href={item.url}
                  onClick={close}
                  className="search-result"
                >
                  <span>
                    <small>
                      {item.type === 'post' ? 'Article' : 'Project'}
                    </small>
                    <strong>{item.title}</strong>
                    <em>{item.summary}</em>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
            <footer className="search-footer">
              <span>↑↓ 浏览</span>
              <span>ESC 关闭</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
