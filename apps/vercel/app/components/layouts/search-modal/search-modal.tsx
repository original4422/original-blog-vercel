'use client';

import { pageContent } from '@original/content';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchItem {
	type: 'post' | 'project';
	title: string;
	summary: string;
	tags: string[];
	publishedAt: string;
	url: string;
}

type Status = 'idle' | 'loading' | 'error' | 'success';

let cachedItems: SearchItem[] | null = null;
let fuseInstance: import('fuse.js').default<SearchItem> | null = null;

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
	const router = useRouter();
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<SearchItem[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [status, setStatus] = useState<Status>('idle');
	const [isComposing, setIsComposing] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);
	const previousOverflow = useRef<string>('');
	const searchVersionRef = useRef(0);

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		setReducedMotion(mq.matches);
		const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		previousActiveElement.current = document.activeElement as HTMLElement;
		previousOverflow.current = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const focusTimer = setTimeout(() => inputRef.current?.focus(), 0);
		const controller = new AbortController();

		if (!cachedItems) {
			setStatus('loading');
			fetch('/api/search-index', { signal: controller.signal })
				.then((res) => {
					if (!res.ok) throw new Error();
					return res.json();
				})
				.then((data: { items: SearchItem[] }) => {
					cachedItems = data.items;
					setResults(cachedItems.slice(0, 5));
					setStatus('success');
				})
				.catch((err) => {
					if (err.name !== 'AbortError') setStatus('error');
				});
		} else {
			setResults(cachedItems.slice(0, 5));
			setStatus('success');
		}

		return () => {
			clearTimeout(focusTimer);
			controller.abort();
			document.body.style.overflow = previousOverflow.current;
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen && previousActiveElement.current) {
			previousActiveElement.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		if (!cachedItems || status !== 'success' || isComposing) return;

		if (!query.trim()) {
			setResults(cachedItems.slice(0, 5));
			setSelectedIndex(0);
			return;
		}

		const version = ++searchVersionRef.current;
		const items = cachedItems;

		const runSearch = async () => {
			if (!fuseInstance) {
				const Fuse = (await import('fuse.js')).default;
				fuseInstance = new Fuse(items, {
					keys: [
						{ name: 'title', weight: 0.6 },
						{ name: 'tags', weight: 0.25 },
						{ name: 'summary', weight: 0.15 },
					],
					threshold: 0.4,
					ignoreLocation: true,
				});
			}
			if (version !== searchVersionRef.current) return;
			const matched = fuseInstance.search(query).map((r) => r.item);
			setResults(matched.slice(0, 10));
			setSelectedIndex(0);
		};

		runSearch();
	}, [query, status, isComposing]);

	const navigateTo = useCallback(
		(url: string) => {
			router.push(url);
			onClose();
			setQuery('');
			setResults([]);
		},
		[router, onClose],
	);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
				return;
			}

			if (isComposing) return;

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (results.length > 0) {
					setSelectedIndex((prev) => (prev + 1) % results.length);
				}
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (results.length > 0) {
					setSelectedIndex(
						(prev) => (prev - 1 + results.length) % results.length,
					);
				}
			} else if (e.key === 'Enter') {
				e.preventDefault();
				const selected = results[selectedIndex];
				if (selected) navigateTo(selected.url);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, results, selectedIndex, isComposing, onClose, navigateTo]);

	useEffect(() => {
		const el = document.getElementById(`search-option-${selectedIndex}`);
		el?.scrollIntoView({ block: 'nearest' });
	}, [selectedIndex]);

	const dur = reducedMotion ? 0 : undefined;
	const showListbox = status === 'success';

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						key='backdrop'
						className='fixed inset-0 bg-black/50 z-50'
						onClick={onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: dur ?? 0.15 }}
					/>
					<div className='fixed inset-0 z-50 flex items-start justify-center pt-[20vh] max-sm:pt-0'>
						<motion.div
							role='dialog'
							aria-modal='true'
							aria-label={pageContent.search.label}
							className='bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-sm:mx-0 max-sm:h-screen max-sm:rounded-none max-sm:max-w-none'
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{
								opacity: 1,
								scale: 1,
								transition: { duration: dur ?? 0.15 },
							}}
							exit={{
								opacity: 0,
								scale: 0.95,
								transition: { duration: dur ?? 0.1 },
							}}
							onClick={(e) => e.stopPropagation()}
						>
							<div className='p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-gray-400 shrink-0'
									aria-hidden='true'
								>
									<circle cx='11' cy='11' r='8' />
									<path d='m21 21-4.3-4.3' />
								</svg>
								<input
									ref={inputRef}
									type='text'
									placeholder={pageContent.search.placeholder}
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onCompositionStart={() => setIsComposing(true)}
									onCompositionEnd={() => setIsComposing(false)}
									onKeyDown={(e) => {
										if (e.key === 'Tab') {
											e.preventDefault();
										}
									}}
									className='flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600'
									role='combobox'
									aria-label={pageContent.search.label}
									aria-expanded={showListbox}
									aria-controls='search-results'
									aria-activedescendant={
										showListbox && results.length > 0
											? `search-option-${selectedIndex}`
											: undefined
									}
									aria-autocomplete='list'
								/>
								<kbd className='border border-gray-300 dark:border-gray-700 rounded px-1.5 py-0.5 text-xs text-gray-400 select-none shrink-0'>
									ESC
								</kbd>
							</div>

							{status === 'loading' && (
								<div className='p-8 text-center text-sm text-gray-400'>
									{pageContent.search.loading}
								</div>
							)}

							{status === 'error' && (
								<div className='p-8 text-center text-sm text-gray-400'>
									{pageContent.search.unavailable}
								</div>
							)}

							{showListbox && (
								<div
									className='max-h-80 overflow-y-auto p-2'
									role='listbox'
									id='search-results'
								>
									{results.length > 0 ? (
										<>
											<div className='px-2 py-1 text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1'>
												CONTENT
											</div>
											{results.map((item, index) => (
												<a
													key={`${item.type}-${item.url}`}
													href={item.url}
													id={`search-option-${index}`}
													role='option'
													aria-selected={index === selectedIndex}
													onClick={(e) => {
														e.preventDefault();
														navigateTo(item.url);
													}}
													onMouseEnter={() => setSelectedIndex(index)}
													className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-150 ease-in-out relative overflow-hidden ${
														index === selectedIndex
															? 'bg-gray-100 dark:bg-gray-900 translate-x-[2px]'
															: ''
													}`}
												>
													{index === selectedIndex && (
														<div className='absolute left-0 top-0 bottom-0 w-[3px] bg-primary-500' />
													)}
													<span className='text-sm text-gray-900 dark:text-gray-100 truncate flex-1'>
														{item.title}
													</span>
													<span className='text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-4'>
														{item.publishedAt
															? item.publishedAt.slice(0, 10)
															: 'Project'}
													</span>
												</a>
											))}
										</>
									) : (
										<div className='p-8 text-center text-sm text-gray-400'>
											{pageContent.search.noResults}
										</div>
									)}
								</div>
							)}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}
