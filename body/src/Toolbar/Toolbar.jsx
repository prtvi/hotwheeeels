import React from 'react';
import './Toolbar.css';

export default function Toolbar(props) {
	const { onSearch, openModal, initAddCarForm } = props;

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
		</div>
	);
}
