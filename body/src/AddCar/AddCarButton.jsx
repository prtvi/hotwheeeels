import React from 'react';
import './AddCarButton.css';

export default function AddCarButton(props) {
	return (
		<div className="add-car-button">
			<button
				className="btn pf-300"
				type="button"
				onClick={props.handleOpen}
			>
				+ 🚘
			</button>
		</div>
	);
}
