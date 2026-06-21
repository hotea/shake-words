import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, random} from 'remotion';

const COLORS = {
	ink900: '#0a120e',
	ink800: '#121e18',
	ink700: '#1c2e24',
	jade: '#7cc4a0',
	jadeBright: '#a0e0c0',
	jadeDeep: '#5a9a7a',
	jadeDim: 'rgba(124, 196, 160, 0.12)',
	bamboo: '#b8a472',
	bambooBright: '#d4c49a',
	bambooDim: 'rgba(184, 164, 114, 0.12)',
	rice: '#e8e4d8',
	riceMuted: '#c8c2b2',
	border: 'rgba(124, 196, 160, 0.18)',
	cinnabar: '#c8392e',
};

const DirectionArrow: React.FC<{
	direction: string;
	arrow: string;
	label: string;
	x: number;
	y: number;
	delay: number;
	frame: number;
	fps: number;
}> = ({direction, arrow, label, x, y, delay, frame, fps}) => {
	const s = spring({
		fps,
		frame: frame - delay,
		config: {damping: 15, stiffness: 100, mass: 0.6},
	});

	const opacity = interpolate(s, [0, 1], [0, 1]);
	const scale = interpolate(s, [0, 1], [0.5, 1]);

	return (
		<div style={{
			position: 'absolute',
			left: x,
			top: y,
			transform: `translate(-50%, -50%) scale(${scale})`,
			opacity,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: 4,
		}}>
			<span style={{fontSize: 48, color: COLORS.bambooBright, fontFamily: '"Noto Serif SC", serif'}}>{arrow}</span>
			<span style={{fontSize: 16, color: COLORS.rice, fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.1em'}}>{label}</span>
		</div>
	);
};

const OptionCard: React.FC<{
	text: string;
	x: number;
	y: number;
	delay: number;
	frame: number;
	fps: number;
	isCorrect?: boolean;
	correctDelay?: number;
}> = ({text, x, y, delay, frame, fps, isCorrect, correctDelay}) => {
	const s = spring({
		fps,
		frame: frame - delay,
		config: {damping: 14, stiffness: 90, mass: 0.7},
	});

	const opacity = interpolate(s, [0, 1], [0, 1]);
	const translateY = interpolate(s, [0, 1], [40, 0]);

	// Correct highlight
	const highlightFrame = correctDelay ? frame - correctDelay : 999;
	const highlightOpacity = interpolate(highlightFrame, [0, 10], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const borderColor = isCorrect && highlightFrame > 0
		? `rgba(124, 196, 160, ${0.3 + highlightOpacity * 0.5})`
		: COLORS.border;
	const bg = isCorrect && highlightFrame > 0
		? `rgba(124, 196, 160, ${highlightOpacity * 0.12})`
		: 'rgba(10, 18, 14, 0.75)';

	return (
		<div style={{
			position: 'absolute',
			left: x,
			top: y,
			transform: `translate(-50%, -50%) translateY(${translateY}px)`,
			opacity,
			width: 220,
			padding: '16px 12px',
			background: bg,
			border: `1.5px solid ${borderColor}`,
			borderRadius: 10,
			textAlign: 'center',
		}}>
			<div style={{
				fontSize: 16,
				color: COLORS.rice,
				fontFamily: '"Noto Serif SC", serif',
				letterSpacing: '0.03em',
				lineHeight: 1.5,
			}}>
				{text}
			</div>
		</div>
	);
};

export const SceneQuiz: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Section title
	const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Word card
	const wordSpring = spring({
		fps,
		frame: frame - 10,
		config: {damping: 14, stiffness: 80},
	});
	const wordOpacity = interpolate(wordSpring, [0, 1], [0, 1]);
	const wordScale = interpolate(wordSpring, [0, 1], [0.8, 1]);

	// Circle ring
	const ringScale = interpolate(frame, [5, 35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Center head icon
	const headOpacity = interpolate(frame, [20, 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: COLORS.ink900}}>
			{/* Section title */}
			<div style={{
				position: 'absolute',
				top: 60,
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: titleOpacity,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 14,
					color: COLORS.bamboo,
					letterSpacing: '0.4em',
					fontFamily: '"Cormorant Garamond", serif',
					marginBottom: 8,
				}}>
					WORD QUIZ
				</div>
				<div style={{
					fontSize: 36,
					color: COLORS.rice,
					letterSpacing: '0.1em',
					fontFamily: '"Noto Serif SC", serif',
				}}>
					四向选择 · 背单词
				</div>
			</div>

			{/* Word card */}
			<div style={{
				position: 'absolute',
				top: 150,
				left: '50%',
				transform: `translateX(-50%) scale(${wordScale})`,
				opacity: wordOpacity,
				padding: '16px 40px',
				background: COLORS.ink800,
				border: `1px solid ${COLORS.border}`,
				borderRadius: 10,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 48,
					fontWeight: 700,
					color: COLORS.rice,
					fontFamily: '"Noto Serif SC", serif',
					letterSpacing: '0.05em',
				}}>
					eloquent
				</div>
				<div style={{
					fontSize: 18,
					color: COLORS.riceMuted,
					fontFamily: '"Cormorant Garamond", serif',
					fontStyle: 'italic',
					marginTop: 4,
				}}>
					/ˈeləkwənt/
				</div>
			</div>

			{/* Circle ring container */}
			<div style={{
				position: 'absolute',
				top: 280,
				left: '50%',
				transform: `translateX(-50%) scale(${ringScale})`,
				width: 600,
				height: 600,
			}}>
				{/* Outer decorative ring */}
				<div style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					border: `1px dashed ${COLORS.border}`,
					opacity: 0.4,
				}} />

				{/* Inner glow ring */}
				<div style={{
					position: 'absolute',
					inset: '10%',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(184, 164, 114, 0.06), transparent 70%)',
				}} />

				{/* Center head icon */}
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: headOpacity,
					width: 140,
					height: 140,
					borderRadius: '50%',
					background: COLORS.ink800,
					border: `1px solid ${COLORS.border}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
					<span style={{fontSize: 56, color: COLORS.rice, fontFamily: '"Noto Serif SC", serif'}}>頭</span>
				</div>

				{/* Direction arrows */}
				<DirectionArrow direction="up" arrow="↑" label="上" x={300} y={60} delay={35} frame={frame} fps={fps} />
				<DirectionArrow direction="down" arrow="↓" label="下" x={300} y={540} delay={40} frame={frame} fps={fps} />
				<DirectionArrow direction="left" arrow="←" label="左" x={60} y={300} delay={45} frame={frame} fps={fps} />
				<DirectionArrow direction="right" arrow="→" label="右" x={540} y={300} delay={50} frame={frame} fps={fps} />

				{/* Option cards */}
				<OptionCard text="雄辩的" x={300} y={120} delay={55} frame={frame} fps={fps} isCorrect correctDelay={90} />
				<OptionCard text="沉默的" x={300} y={480} delay={60} frame={frame} fps={fps} />
				<OptionCard text="模糊的" x={110} y={300} delay={65} frame={frame} fps={fps} />
				<OptionCard text="优雅的" x={490} y={300} delay={70} frame={frame} fps={fps} />
			</div>

			{/* Correct feedback */}
			{frame > 90 && (
				<div style={{
					position: 'absolute',
					bottom: 60,
					left: '50%',
					transform: 'translateX(-50%)',
					opacity: interpolate(frame, [90, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					padding: '10px 30px',
					background: COLORS.jadeDim,
					border: `1px solid ${COLORS.jade}`,
					borderRadius: 8,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
				}}>
					<span style={{fontSize: 20, color: COLORS.jade, fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.15em'}}>
						✓ 回答正确
					</span>
				</div>
			)}
		</AbsoluteFill>
	);
};
