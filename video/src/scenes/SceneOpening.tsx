import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

// Design system colors matching the website
const COLORS = {
	ink900: '#0a120e',
	ink800: '#121e18',
	ink700: '#1c2e24',
	jade: '#7cc4a0',
	jadeBright: '#a0e0c0',
	jadeDeep: '#5a9a7a',
	jadeDim: 'rgba(124, 196, 160, 0.12)',
	jadeGlow: 'rgba(124, 196, 160, 0.25)',
	bamboo: '#b8a472',
	bambooBright: '#d4c49a',
	rice: '#e8e4d8',
	riceMuted: '#c8c2b2',
	border: 'rgba(124, 196, 160, 0.18)',
};

export const SceneOpening: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Background radial glow fade in
	const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Main title spring
	const titleSpring = spring({
		fps,
		frame,
		config: {damping: 12, stiffness: 80, mass: 0.8},
	});

	const titleScale = interpolate(titleSpring, [0, 1], [0.3, 1]);
	const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

	// Subtitle fade in
	const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const subtitleY = interpolate(frame, [30, 50], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Tag line fade in
	const tagOpacity = interpolate(frame, [45, 65], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Decorative circle pulse
	const circleScale = interpolate(frame, [10, 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: COLORS.ink900}}>
			{/* Background glow */}
			<AbsoluteFill style={{opacity: bgOpacity}}>
				<div style={{
					position: 'absolute',
					top: '20%',
					left: '15%',
					width: 800,
					height: 600,
					background: 'radial-gradient(ellipse, rgba(124, 196, 160, 0.08), transparent 60%)',
				}} />
				<div style={{
					position: 'absolute',
					bottom: '10%',
					right: '10%',
					width: 600,
					height: 500,
					background: 'radial-gradient(ellipse, rgba(184, 164, 114, 0.06), transparent 60%)',
				}} />
			</AbsoluteFill>

			{/* Decorative circle */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${circleScale})`,
				width: 700,
				height: 700,
				borderRadius: '50%',
				border: `1px dashed ${COLORS.border}`,
				opacity: 0.3,
			}} />

			{/* Main title */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -55%) scale(${titleScale})`,
				opacity: titleOpacity,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 160,
					fontWeight: 900,
					color: COLORS.rice,
					letterSpacing: '0.08em',
					fontFamily: '"Noto Serif SC", "ZCOOL XiaoWei", Georgia, serif',
					textShadow: `0 0 60px ${COLORS.jadeGlow}`,
				}}>
					晃晃学
				</div>
			</div>

			{/* English subtitle */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, ${subtitleY + 60}px)`,
				opacity: subtitleOpacity,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 36,
					color: COLORS.bambooBright,
					letterSpacing: '0.12em',
					fontFamily: '"Cormorant Garamond", Georgia, serif',
					opacity: 0.85,
				}}>
					Learn · by · Shaking · Your · Head
				</div>
			</div>

			{/* Tag line */}
			<div style={{
				position: 'absolute',
				bottom: 180,
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: tagOpacity,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 22,
					color: COLORS.riceMuted,
					letterSpacing: '0.2em',
					fontFamily: '"Noto Serif SC", Georgia, serif',
				}}>
					摇头学词诵诗 · AI 视觉交互学习
				</div>
			</div>

			{/* Top decorative line */}
			<div style={{
				position: 'absolute',
				top: 120,
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: tagOpacity,
				display: 'flex',
				alignItems: 'center',
				gap: 20,
			}}>
				<div style={{width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.bamboo})`}} />
				<span style={{
					fontSize: 12,
					color: COLORS.bamboo,
					letterSpacing: '0.4em',
					fontFamily: '"Cormorant Garamond", Georgia, serif',
				}}>
					AI · VISION · INTERACTION
				</span>
				<div style={{width: 60, height: 1, background: `linear-gradient(90deg, ${COLORS.bamboo}, transparent)`}} />
			</div>
		</AbsoluteFill>
	);
};
