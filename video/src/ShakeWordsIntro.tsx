import React from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile} from 'remotion';
import {SceneOpening} from './scenes/SceneOpening';
import {SceneQuiz} from './scenes/SceneQuiz';
import {ScenePoetry} from './scenes/ScenePoetry';
import {SceneFeatures} from './scenes/SceneFeatures';
import {SceneEnding} from './scenes/SceneEnding';

import scene1Audio from './audio/scene1.mp3';
import scene2Audio from './audio/scene2.mp3';
import scene3Audio from './audio/scene3.mp3';
import scene4Audio from './audio/scene4.mp3';
import scene5Audio from './audio/scene5.mp3';

// 1920x1080 @ 30fps, total 660 frames = 22 seconds
// Scene 1: Opening       0 - 90   (0s - 3s)
// Scene 2: Quiz Demo     90 - 240 (3s - 8s)
// Scene 3: Poetry Demo   240 - 390 (8s - 13s)
// Scene 4: Features      390 - 540 (13s - 18s)
// Scene 5: Ending        540 - 660 (18s - 22s)

export const ShakeWordsIntro: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#0a120e'}}>
			<Sequence from={0} durationInFrames={90}>
				<SceneOpening />
				<Audio src={scene1Audio} volume={0.9} />
			</Sequence>
			<Sequence from={90} durationInFrames={150}>
				<SceneQuiz />
				<Audio src={scene2Audio} volume={0.9} />
			</Sequence>
			<Sequence from={240} durationInFrames={150}>
				<ScenePoetry />
				<Audio src={scene3Audio} volume={0.9} />
			</Sequence>
			<Sequence from={390} durationInFrames={150}>
				<SceneFeatures />
				<Audio src={scene4Audio} volume={0.9} />
			</Sequence>
			<Sequence from={540}>
				<SceneEnding />
				<Audio src={scene5Audio} volume={0.9} />
			</Sequence>
		</AbsoluteFill>
	);
};
