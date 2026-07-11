'use client';

import { motion } from 'motion/react';
import type { HTMLAttributes } from 'react';

interface ArrowDownIconProps extends HTMLAttributes<HTMLSpanElement> {
	size?: number;
}

export function ArrowDownIcon({
	size = 28,
	className,
	...props
}: ArrowDownIconProps) {
	return (
		<span
			className={`inline-flex items-center justify-center ${className ?? ''}`}
			{...props}
		>
			<motion.svg
				aria-hidden='true'
				width={size}
				height={size}
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				whileHover={{ y: 3 }}
			>
				<path d='M12 5v14' />
				<path d='m19 12-7 7-7-7' />
			</motion.svg>
		</span>
	);
}
