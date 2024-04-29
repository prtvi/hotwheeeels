import React from 'react';
import './CarShowcase.css';

import { getSessionItem } from '../functions.js';

export default function SwipeCar(props) {
	const { carName, nItems, showCar } = props;

	const back = function () {
		const curr = getSessionItem('carIdx', Number);

		let idx = 0;
		if (curr - 1 <= 0) idx = 0;
		else idx = curr - 1;

		showCar(idx);
	};

	const forward = function () {
		const curr = getSessionItem('carIdx', Number);

		let idx = 0;
		if (curr + 1 >= nItems) idx = nItems - 1;
		else idx = curr + 1;

		showCar(idx);
	};

	return (
		<div className="swipe-car">
			<span className="left" onClick={back}>
				&#10094;
			</span>

			<span>{carName}</span>

			<span className="right" onClick={forward}>
				&#10095;
			</span>
		</div>
	);
}
