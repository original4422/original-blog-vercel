'use client';

import { motion } from 'motion/react';
import type { HTMLAttributes } from 'react';

interface SquareArrowLeftIconProps extends HTMLAttributes<HTMLSpanElement> {
	size?: number;
}

export function SquareArrowLeftIcon({
	size = 28,
	className,
	...props
}: SquareArrowLeftIconProps) {
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
				whileHover={{ x: -2 }}
			>
				<rect width='18' height='18' x='3' y='3' rx='2' />
				<path d='m12 8-4 4 4 4' />
				<path d='M16 12H8' />
			</motion.svg>
		</span>
	);
}
