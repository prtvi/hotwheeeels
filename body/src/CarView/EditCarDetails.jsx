import React from 'react';
import axios from 'axios';
import './EditCarDetails.css';

import config from '../config.json';

function showEditComponents(show) {
	const editComponentGroups = document.querySelectorAll('.edit-comp-group');
	const editCarContainer = document.querySelector('.edit-car-details');

	if (show) {
		Array.from(editComponentGroups).forEach(c => c.classList.add('active'));
		editCarContainer.classList.add('edit');
	} else {
		Array.from(editComponentGroups).forEach(c =>
			c.classList.remove('active')
		);
		editCarContainer.classList.remove('edit');

		// always show the edit and delete icons
		editComponentGroups[0].classList.add('active');
	}
}

function showCurrentMode(e) {
	const mainAction = document.querySelectorAll('.main-action');
	Array.from(mainAction).forEach(m => m.classList.remove('active'));

	if (e) e.currentTarget.classList.add('active');
}

export default function EditCarDetails(props) {
	const { carId, showMsg } = props;

	async function deleteCar(carId) {
		const res = await axios.get(
			`${config.engineURL}/api/delete_car?carId=${carId}`
		);

		if (res.status === 200) showMsg('Car has been deleted');
		else showMsg('Something went wrong, try again later');
	}

	const [editMessage, setEditMessage] = React.useState('');
	const [mode, setMode] = React.useState('edit');

	const handleEditClick = function (e) {
		showCurrentMode(e);
		showEditComponents(true);
		setEditMessage('Save changes?');
		setMode('edit');
	};

	const handleDeleteClick = function (e) {
		showCurrentMode(e);
		showEditComponents(true);
		setEditMessage('Delete this car?');
		setMode('delete');
	};

	const closeEditMode = function () {
		showCurrentMode(null);
		showEditComponents(false);
		setMode('');
	};

	const confirmAction = function () {
		if (mode === 'edit') return;
		else if (mode === 'delete') deleteCar(carId);
		else return;
	};

	return (
		<div className="edit-car-details">
			<div className="edit-comp-group active">
				<span
					className="edit-comp icon main-action edit"
					title="Edit car details"
					onClick={handleEditClick}
				>
					✏️
				</span>
				<span
					className="edit-comp icon main-action delete"
					title="Delete this car"
					onClick={handleDeleteClick}
				>
					🗑️
				</span>
			</div>

			<div className="edit-comp-group">
				<span className="edit-comp msg">{editMessage}</span>
			</div>

			<div className="edit-comp-group">
				<span
					className="edit-comp icon final-action confirm-btn"
					onClick={confirmAction}
				>
					✅
				</span>
				<span
					className="edit-comp icon final-action cancel-btn"
					onClick={closeEditMode}
				>
					❌
				</span>
			</div>
		</div>
	);
}
