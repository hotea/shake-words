import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

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
	rice: '#e8e4d8',
	riceMuted: '#c8c2b2',
	border: 'rgba(124, 196, 160, 0.18)',
};

const POEM = {
	title: '静夜思',
	author: '李白',
	dynasty: '唐',
	lines: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
	linesPunctuated: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'],
};

export const ScenePoetry: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Section title
	const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Poem card
	const cardSpring = spring({
		fps,
		frame: frame - 10,
		config: {damping: 14, stiffness: 80},
	});
	const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
	const cardY = interpolate(cardSpring, [0, 1], [30, 0]);

	// Characters fill in one by one
	// Total chars: 20, fill from frame 40 to 120
	const totalChars = POEM.lines.join('').length;

	const getCharOpacity = (charIndex: number) => {
		const fillStart = 40 + charIndex * 4;
		return interpolate(frame, [fillStart, fillStart + 8], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
	};

	const getCharScale = (charIndex: number) => {
		const fillStart = 40 + charIndex * 4;
		const s = spring({
			fps,
			frame: frame - fillStart,
			config: {damping: 12, stiffness: 120, mass: 0.5},
		});
		return interpolate(s, [0, 1], [0.3, 1]);
	};

	// Target character (blinking question mark) at index 9 (霜)
	const targetIndex = 9;
	const targetPulse = interpolate(frame, [0, 15, 30], [0.8, 1.2, 0.8], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Four options appear
	const optionsOpacity = interpolate(frame, [80, 100], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Correct answer flash
	const correctFlash = interpolate(frame, [110, 120], [0, 1], {
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
					POETRY PUZZLE
				</div>
				<div style={{
					fontSize: 36,
					color: COLORS.rice,
					letterSpacing: '0.1em',
					fontFamily: '"Noto Serif SC", serif',
				}}>
					逐字拼诗 · 古典传承
				</div>
			</div>

			{/* Poem card */}
			<div style={{
				position: 'absolute',
				top: 150,
				left: '50%',
				transform: `translateX(-50%) translateY(${cardY}px)`,
				opacity: cardOpacity,
				width: 700,
				padding: '30px 40px',
				background: COLORS.ink800,
				border: `1px solid ${COLORS.border}`,
				borderRadius: 12,
			}}>
				{/* Title */}
				<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					marginBottom: 20,
				}}>
					<span style={{
						fontSize: 24,
						color: COLORS.bambooBright,
						fontFamily: '"Noto Serif SC", serif',
						letterSpacing: '0.15em',
					}}>
						{POEM.title}
					</span>
					<span style={{
						fontSize: 14,
						color: COLORS.riceMuted,
						fontFamily: '"Noto Serif SC", serif',
					}}>
						{POEM.dynasty}·{POEM.author}
					</span>
				</div>

				{/* Poem lines with character-by-character fill */}
				<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
					{POEM.lines.map((line, lineIdx) => {
						const offset = POEM.lines.slice(0, lineIdx).join('').length;
						return (
							<div key={lineIdx} style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
								{line.split('').map((char, charIdx) => {
									const flatIndex = offset + charIdx;
									const isTarget = flatIndex === targetIndex;
									const charOpacity = getCharOpacity(flatIndex);
									const charScale = getCharScale(flatIndex);

									if (isTarget && frame < 110) {
										// Show blinking question mark
										return (
											<span key={charIdx} style={{
												display: 'inline-flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: '1.3em',
												height: '1.5em',
												background: COLORS.jadeDim,
												border: `1px solid ${COLORS.jade}`,
												borderRadius: 4,
												transform: `scale(${targetPulse})`,
												fontSize: 22,
												color: COLORS.jadeBright,
												fontFamily: '"Noto Serif SC", serif',
											}}>
												?
											</span>
										);
									}

									return (
										<span key={charIdx} style={{
											fontSize: 22,
											color: isTarget && correctFlash > 0 ? COLORS.jadeBright : COLORS.rice,
											fontFamily: '"Noto Serif SC", serif',
											letterSpacing: '0.06em',
											opacity: isTarget ? Math.max(charOpacity, correctFlash) : charOpacity,
											transform: `scale(${isTarget ? 1 : charScale})`,
											textShadow: isTarget && correctFlash > 0 ? `0 0 20px rgba(124, 196, 160, 0.4)` : 'none',
										}}>
											{char}
										</span>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>

			{/* Four direction options */}
			<div style={{
				position: 'absolute',
				bottom: 80,
				left: '50%',
				transform: 'translateX(-50%)',
				opacity: optionsOpacity,
				display: 'flex',
				gap: 20,
			}}>
				{[
					{dir: '↑ 上', text: '霜', isCorrect: true},
					{dir: '← 左', text: '雪', isCorrect: false},
					{dir: '↓ 下', text: '露', isCorrect: false},
					{dir: '→ 右', text: '雾', isCorrect: false},
				].map((opt, i) => {
					const optDelay = 80 + i * 5;
					const optSpring = spring({
						fps,
						frame: frame - optDelay,
						config: {damping: 14, stiffness: 90},
					});
					const optOpacity = interpolate(optSpring, [0, 1], [0, 1]);
					const optY = interpolate(optSpring, [0, 1], [20, 0]);

					const isHighlighted = opt.isCorrect && correctFlash > 0;

					return (
						<div key={i} style={{
							opacity: optOpacity,
							transform: `translateY(${optY}px)`,
							width: 140,
							padding: '14px 10px',
							background: isHighlighted ? COLORS.jadeDim : COLORS.ink800,
							border: `1.5px solid ${isHighlighted ? COLORS.jade : COLORS.border}`,
							borderRadius: 10,
							textAlign: 'center',
							boxShadow: isHighlighted ? `0 0 20px rgba(124, 196, 160, 0.3)` : 'none',
						}}>
							<div style={{
								fontSize: 12,
								color: COLORS.bambooBright,
								fontFamily: '"Noto Serif SC", serif',
								marginBottom: 6,
								letterSpacing: '0.1em',
							}}>
								{opt.dir}
							</div>
							<div style={{
								fontSize: 32,
								color: isHighlighted ? COLORS.jadeBright : COLORS.rice,
								fontFamily: '"Noto Serif SC", serif',
							}}>
								{opt.text}
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
