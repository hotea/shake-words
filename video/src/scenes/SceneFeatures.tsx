import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const COLORS = {
	ink900: '#0a120e',
	ink800: '#121e18',
	ink700: '#1c2e24',
	jade: '#7cc4a0',
	jadeBright: '#a0e0c0',
	jadeDim: 'rgba(124, 196, 160, 0.12)',
	bamboo: '#b8a472',
	bambooBright: '#d4c49a',
	bambooDim: 'rgba(184, 164, 114, 0.12)',
	rice: '#e8e4d8',
	riceMuted: '#c8c2b2',
	border: 'rgba(124, 196, 160, 0.18)',
};

const FEATURES = [
	{icon: '視', title: 'AI 视觉交互', desc: '头部动作实时识别，抬头点头即选答案'},
	{icon: '頸', title: '颈椎友好', desc: '答题即颈部运动，学习中自然放松'},
	{icon: '詩', title: '双内容体系', desc: '英语词书 + 古诗古文，同一动作两种收获'},
	{icon: '憶', title: '间隔重复', desc: 'SM-2 算法调度，在遗忘临界点复习'},
	{icon: '計', title: '学习追踪', desc: '正确率、连续记录，量化每次进步'},
	{icon: '隱', title: '隐私至上', desc: '本地识别不上传，进度可随时导出删除'},
];

const FeatureCard: React.FC<{
	icon: string;
	title: string;
	desc: string;
	index: number;
	frame: number;
	fps: number;
}> = ({icon, title, desc, index, frame, fps}) => {
	const col = index % 3;
	const row = Math.floor(index / 3);
	const delay = 15 + index * 8;

	const s = spring({
		fps,
		frame: frame - delay,
		config: {damping: 14, stiffness: 80, mass: 0.7},
	});

	const opacity = interpolate(s, [0, 1], [0, 1]);
	const translateY = interpolate(s, [0, 1], [40, 0]);

	const accentColor = index % 3 === 1 ? COLORS.bamboo : COLORS.jade;
	const accentDim = index % 3 === 1 ? COLORS.bambooDim : COLORS.jadeDim;

	return (
		<div style={{
			opacity,
			transform: `translateY(${translateY}px)`,
			width: 340,
			padding: 28,
			background: COLORS.ink800,
			border: `1px solid ${COLORS.border}`,
			borderRadius: 10,
		}}>
			{/* Icon */}
			<div style={{
				width: 52,
				height: 52,
				borderRadius: 8,
				background: accentDim,
				border: `1px solid ${accentColor}30`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				marginBottom: 18,
				fontSize: 28,
				color: accentColor,
				fontFamily: '"Noto Serif SC", serif',
			}}>
				{icon}
			</div>

			<div style={{
				fontSize: 18,
				color: COLORS.rice,
				fontFamily: '"Noto Serif SC", serif',
				letterSpacing: '0.15em',
				marginBottom: 8,
			}}>
				{title}
			</div>

			<div style={{
				fontSize: 14,
				color: COLORS.riceMuted,
				fontFamily: '"Noto Serif SC", serif',
				lineHeight: 1.8,
			}}>
				{desc}
			</div>
		</div>
	);
};

export const SceneFeatures: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Section title
	const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
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
					FEATURES
				</div>
				<div style={{
					fontSize: 36,
					color: COLORS.rice,
					letterSpacing: '0.1em',
					fontFamily: '"Noto Serif SC", serif',
				}}>
					核心特性
				</div>
			</div>

			{/* Feature cards grid */}
			<div style={{
				position: 'absolute',
				top: 160,
				left: '50%',
				transform: 'translateX(-50%)',
				display: 'flex',
				flexWrap: 'wrap',
				gap: 20,
				width: 1080,
				justifyContent: 'center',
			}}>
				{FEATURES.map((feature, i) => (
					<FeatureCard
						key={i}
						icon={feature.icon}
						title={feature.title}
						desc={feature.desc}
						index={i}
						frame={frame}
						fps={fps}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};
