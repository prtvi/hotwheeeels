import React from 'react';
import './CarView.css';
import { validSpec } from './CarViewSpec.jsx';
import CarViewSpec from './CarViewSpec.jsx';
import config from '../config.json';

const getRowsToShow = function (specs, car) {
	const rows = [];
	const allRowItems = [];
	const largeItemIdxs = [];

	for (let i = 0; i < specs.length; i++) {
		const spec = specs[i];

		if (spec.forFormOnly) continue;

		const valid = validSpec(car[spec.key]);
		// console.log(valid ? 'true ------' : 'false', car[spec.key], spec.key);

		if (spec.viewSize === 'large' && valid) {
			largeItemIdxs.push(i);
			continue;
		}

		if (valid) allRowItems.push(spec);
	}

	for (let i = 0; i < allRowItems.length; i += 2)
		rows.push(allRowItems.slice(i, i + 2));

	for (let i = 0; i < largeItemIdxs.length; i++)
		rows.push([specs[largeItemIdxs[i]]]);

	return rows;
};

export default function CarView(props) {
	const { car } = props;
	const rowsForView = getRowsToShow(config.formItems, car);

	return (
		<div className="car-view">
			<div className="image">
				<img src={car.imgSrc} alt="car" />
			</div>

			<div className="details">
				{rowsForView.map((row, rowIdx) => {
					let itemSizeClass = 'ri-small';
					if (row.length === 1) itemSizeClass = 'ri-large';

					return (
						<div className="row" key={rowIdx}>
							{row.map(ri => {
								return (
									<CarViewSpec
										key={ri.key}
										label={ri.label}
										value={car[ri.key]}
										itemSizeClass={itemSizeClass}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
}
