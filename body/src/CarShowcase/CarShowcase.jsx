import React from 'react';
import './CarShowcase.css';
import { validSpec } from './ShowcaseItem.jsx';
import ShowcaseItem from './ShowcaseItem.jsx';
import Carousel from './Carousel.jsx';
import EditCarDetails from '../Forms/EditCarDetails.jsx';
import UpdateCarForm from '../Forms/UpdateCarForm.jsx';
import config from '../config.json';

const getRowsForShowcase = function (specs, car) {
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

const getShowcaseDom = function (rowsForView, car) {
	return rowsForView.map((row, rowIdx) => {
		return (
			<div className="row" key={rowIdx}>
				{row.map(ri => {
					return (
						<ShowcaseItem
							key={ri.key}
							label={ri.label}
							value={car[ri.key]}
							itemSizeClass={`ri-${ri.viewSize}`}
						/>
					);
				})}
			</div>
		);
	});
};

export default function CarShowcase(props) {
	const { car, showMsg } = props;
	const rowsForView = getRowsForShowcase(config.formItems, car);

	const [mode, setMode] = React.useState('');

	return (
		<div className="car-showcase">
			<Carousel images={car.imgs} />

			<EditCarDetails
				carId={car.carId}
				showMsg={showMsg}
				mode={mode}
				setMode={setMode}
			/>

			<div className="details">
				{mode === 'edit' ? (
					<UpdateCarForm car={car} />
				) : (
					getShowcaseDom(rowsForView, car)
				)}
			</div>
		</div>
	);
}
