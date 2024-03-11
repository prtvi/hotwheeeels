import React from 'react';
import './Toolbar.css';

export default function Toolbar(props) {
	const { onSearch, openModal, initAddCarForm } = props;

	const showCar = function () {
		initAddCarForm();
		openModal();
	};

	return (
		<div className="search-and-add">
			<div className="search-box">
				<input
					className="pf-300"
					type="text"
					name="search"
					placeholder="🔍 Search for cars"
					onChange={onSearch}
				/>
			</div>

			<div className="add-car-button">
				<button className="btn pf-300" type="button" onClick={showCar}>
					+ 🚘
				</button>
			</div>
		</div>
	);
}
