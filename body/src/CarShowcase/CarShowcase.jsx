import React from 'react';
import './CarShowcase.css';
import { validSpec } from './ShowcaseItem.jsx';
import ShowcaseItem from './ShowcaseItem.jsx';
import Carousel from '../Utils/Carousel.jsx';
import EditCarDetails from './EditCarDetails.jsx';
import config from '../config.json';

const getRowsToShow = function (specs, car) {
	const rows = [];
	const allRowItems = [];
	const largeItemIdxs = [];

	for (let i = 0; i < specs.length; i++) {
		const spec = specs[i];

		if (spec.forFormOnly) continue;

		const valid = validSpec(car[spec.key]);

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

export default function CarShowcase(props) {
	const { car, showMsg } = props;
	const rowsForView = getRowsToShow(config.formItems, car);

	return (
		<div className="car-view">
			<Carousel images={car.imgs} />

			<EditCarDetails carId={car.carId} showMsg={showMsg} />

			<div className="details">
				{rowsForView.map((row, rowIdx) => {
					let itemSizeClass = 'ri-small';
					if (row.length === 1) itemSizeClass = 'ri-large';

					return (
						<div className="row" key={rowIdx}>
							{row.map(ri => {
								return (
									<ShowcaseItem
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
