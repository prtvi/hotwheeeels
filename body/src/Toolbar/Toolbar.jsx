import React from 'react';
import './Toolbar.css';

export default function Toolbar(props) {
	const { onSearch, openModal, initAddCarForm, nCars } = props;
	const nCarsText = nCars === 1 ? `${nCars} car` : `${nCars} cars`;

	const showCar = function () {
		initAddCarForm();
		openModal();
	};

	return (
		<div className="toolbar">
			<div className="row1">
				<div className="row1-child">
					<input
						className="pf-300"
						type="text"
						name="search"
						placeholder="🔍  Search for cars"
						onChange={onSearch}
					/>
				</div>

				<div className="row1-child">
					<button className="btn pf-300" onClick={showCar}>
						+ 🚘
					</button>
				</div>
			</div>

			<div className="row2">
				<div className="row2-child">
					<span className="ncars pf-200">{nCarsText}</span>
				</div>
			</div>
		</div>
	);
}
