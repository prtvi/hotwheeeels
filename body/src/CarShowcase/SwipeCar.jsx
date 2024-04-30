import React from 'react';
import './CarShowcase.css';

import { getSessionItem } from '../functions.js';

export default function SwipeCar(props) {
	const { carName, nItems, showCar } = props;

	const left = function () {
		const currCarIdx = getSessionItem('carIdx', Number);

		let idx = 0;
		if (currCarIdx - 1 <= 0) idx = 0;
		else idx = currCarIdx - 1;

		showCar(idx);
	};

	const right = function () {
		const currCarIdx = getSessionItem('carIdx', Number);

		let idx = 0;
		if (currCarIdx + 1 >= nItems) idx = nItems - 1;
		else idx = currCarIdx + 1;

		showCar(idx);
	};

	const currCarIdx = getSessionItem('carIdx', Number);

	return (
		<div className="swipe-car">
			<span
				className={`arrow-left ${currCarIdx <= 0 ? 'disabled' : ''}`}
				onClick={left}
			>
				&#10094;
			</span>

			<span className="pf-300">{carName}</span>

			<span
				className={`arrow-right ${
					currCarIdx >= nItems - 1 ? 'disabled' : ''
				}`}
				onClick={right}
			>
				&#10095;
			</span>
		</div>
	);
}
