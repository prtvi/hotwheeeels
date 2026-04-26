import React from 'react';
import './Utils.css';

export default function Marquee(props) {
	const { direction } = props;
	const [text, setText] = React.useState('🚗💨');

	const shuffle = React.useCallback(
		function () {
			if (text === '🚗💨') setText('🚗');
			else setText('🚗💨');
		},
		[text],
	);

	React.useEffect(() => {
		const r = Math.random() * (2000 - 500) + 500;
		setTimeout(() => shuffle(), Math.floor(r));
	}, [shuffle]);

	return (
		<div className="marquee-container">
			<marquee className={'pf-400 ' + direction} direction="left">
				{text}
			</marquee>
		</div>
	);
}
