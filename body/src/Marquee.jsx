import React from 'react';
import { useState, useEffect } from 'react';

export default function Marquee(props) {
	const [text, setText] = useState('🚗💨');

	const shuffle = function () {
		if (text === '🚗💨') setText('🚗');
		else setText('🚗💨');
	};

	useEffect(() => {
		const r = Math.random() * (2000 - 500) + 500;
		setTimeout(() => shuffle(), Math.floor(r));
	}, [shuffle]);

	return (
		<div>
			<marquee className={'pf-400 ' + props.direction} direction="left">
				{text}
			</marquee>
		</div>
	);
}
