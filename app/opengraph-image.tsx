import { ImageResponse } from 'next/og';

export const alt = 'original — Blog & Projects';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
	return new ImageResponse(
		<div
			style={{
				alignItems: 'stretch',
				background: '#050505',
				color: 'white',
				display: 'flex',
				fontFamily: 'serif',
				height: '100%',
				padding: '72px',
				position: 'relative',
				width: '100%',
			}}
		>
			<div
				style={{
					background: '#de1d8d',
					borderRadius: '999px',
					filter: 'blur(2px)',
					height: '340px',
					opacity: 0.8,
					position: 'absolute',
					right: '-40px',
					top: '-120px',
					width: '340px',
				}}
			/>
			<div
				style={{
					border: '1px solid #353535',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '54px',
					width: '100%',
				}}
			>
				<div
					style={{
						color: '#de1d8d',
						display: 'flex',
						fontFamily: 'sans-serif',
						fontSize: 24,
						letterSpacing: '0.18em',
						textTransform: 'uppercase',
					}}
				>
					Personal digital garden
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div
						style={{
							display: 'flex',
							fontSize: 108,
							fontWeight: 700,
							letterSpacing: '-0.06em',
						}}
					>
						original
					</div>
					<div
						style={{
							color: '#b5b5b5',
							display: 'flex',
							fontFamily: 'sans-serif',
							fontSize: 34,
						}}
					>
						Blog · Projects · Notes
					</div>
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
