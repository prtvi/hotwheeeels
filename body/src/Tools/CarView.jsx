import React from 'react';
import './CarView.css';
import { validSpec } from './CarViewSpec.jsx';
import CarViewSpec from './CarViewSpec.jsx';

const CarViewSpecs = [
	['Name', 'carName'],
	['Brand', 'brand'],
	['Price ₹', 'price'],
	['Color', 'color'],
	['Purchase date', 'purchaseDate'],
	['Purchased from', 'purchasedFrom'],
	['Order number', 'orderNumber'],
	['Card available', 'cardAvailable'],
	['Gift', 'isGift'],
	['Gifted by', 'giftedBy'],
	['Notes', 'notes'],
];

const getRowsToShow = function (specs, car) {
	const rows = [];
	let row = [];

	specs.forEach((spec, i) => {
		if (validSpec(car[spec[1]])) row.push(spec);

		if (row.length === 2) {
			rows.push(row);
			row = [];
		} else if (row.length > 0 && i === specs.length - 1) {
			rows.push(row);
		}
	});

	return rows;
};

export default function CarView(props) {
	const { car } = props;

	const rowsForView = getRowsToShow(CarViewSpecs, car);

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
							{row.map(rowItem => {
								return (
									<CarViewSpec
										key={rowItem[0] + rowItem[1]}
										label={rowItem[0]}
										value={car[rowItem[1]]}
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
