import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const COLORS = {
	ink900: '#0a120e',
	ink800: '#121e18',
	jade: '#7cc4a0',
	jadeBright: '#a0e0c0',
	jadeDim: 'rgba(124, 196, 160, 0.12)',
	jadeGlow: 'rgba(124, 196, 160, 0.25)',
	bamboo: '#b8a472',
	bambooBright: '#d4c49a',
	rice: '#e8e4d8',
	riceMuted: '#c8c2b2',
	border: 'rgba(124, 196, 160, 0.18)',
};

export const SceneEnding: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Background glow
	const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Main title spring
	const titleSpring = spring({
		fps,
		frame: frame - 10,
		config: {damping: 12, stiffness: 80, mass: 0.8},
	});
	const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);
	const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

	// Subtitle
	const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const subtitleY = interpolate(frame, [25, 45], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// CTA button
	const ctaSpring = spring({
		fps,
		frame: frame - 40,
		config: {damping: 14, stiffness: 100},
	});
	const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);
	const ctaScale = interpolate(ctaSpring, [0, 1], [0.9, 1]);

	// URL
	const urlOpacity = interpolate(frame, [50, 70], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Decorative ring
	const ringScale = interpolate(frame, [5, 35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: COLORS.ink900}}>
			{/* Background glow */}
			<AbsoluteFill style={{opacity: bgOpacity}}>
				<div style={{
					position: 'absolute',
					top: '30%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 900,
					height: 600,
					background: `radial-gradient(ellipse, ${COLORS.jadeGlow}, transparent 60%)`,
				}} />
			</AbsoluteFill>

			{/* Decorative ring */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${ringScale})`,
				width: 600,
				height: 600,
				borderRadius: '50%',
				border: `1px dashed ${COLORS.border}`,
				opacity: 0.25,
			}} />

			{/* Main CTA title */}
			<div style={{
				position: 'absolute',
				top: '38%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${titleScale})`,
				opacity: titleOpacity,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 72,
					fontWeight: 700,
					color: COLORS.rice,
					letterSpacing: '0.15em',
					fontFamily: '"Noto Serif SC", "ZCOOL XiaoWei", Georgia, serif',
					textShadow: `0 0 40px ${COLORS.jadeGlow}`,
				}}>
					摇一摇，头脑清明
				</div>
			</div>

			{/* Subtitle */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, ${subtitleY}px)`,
				opacity: subtitleOpacity,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 22,
					color: COLORS.riceMuted,
					letterSpacing: '0.1em',
					fontFamily: '"Noto Serif SC", serif',
					lineHeight: 1.8,
				}}>
					给自己 10 分钟，背 20 个单词，同时把颈椎也活动一遍
				</div>
			</div>

			{/* CTA Button */}
			<div style={{
				position: 'absolute',
				top: '62%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${ctaScale})`,
				opacity: ctaOpacity,
			}}>
				<div style={{
					padding: '16px 48px',
					background: `linear-gradient(135deg, ${COLORS.jade}, ${COLORS.jadeBright})`,
					borderRadius: 10,
					fontSize: 24,
					fontWeight: 600,
					color: COLORS.ink900,
					fontFamily: '"Noto Serif SC", serif',
					letterSpacing: '0.2em',
					boxShadow: `0 4px 20px ${COLORS.jadeGlow}`,
				}}>
					立即开始
				</div>
			</div>

			{/* URL */}
			<div style={{
				position: 'absolute',
				bottom: 100,
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: urlOpacity,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 20,
					color: COLORS.bambooBright,
					letterSpacing: '0.15em',
					fontFamily: '"Cormorant Garamond", Georgia, serif',
				}}>
					https://shakewords.wyld.cc/
				</div>
			</div>

			{/* Brand */}
			<div style={{
				position: 'absolute',
				bottom: 50,
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: urlOpacity,
				textAlign: 'center',
			}}>
				<div style={{
					fontSize: 14,
					color: COLORS.riceMuted,
					letterSpacing: '0.2em',
					fontFamily: '"Noto Serif SC", serif',
					opacity: 0.6,
				}}>
					晃晃学 · ShakeWords
				</div>
			</div>
		</AbsoluteFill>
	);
};
