import React from 'react';
import {Composition} from 'remotion';
import {ShakeWordsIntro} from './ShakeWordsIntro';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="ShakeWordsIntro"
				component={ShakeWordsIntro}
				durationInFrames={660}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};
