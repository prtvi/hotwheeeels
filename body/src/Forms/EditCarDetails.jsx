import React from 'react';
import axios from 'axios';
import './Forms.css';
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
	const { carId, showMsg, mode, setMode } = props;

	async function deleteCar(carId) {
		const res = await axios.get(
			`${config.engineURL}/api/delete_car?car_id=${carId}`
		);

		if (res.status === 200) showMsg('Car has been deleted');
		else showMsg('Something went wrong, try again later');
	}

	async function updateCar(carId) {
		const form = document.getElementById('update-car-form');
		// post form text data
		const formData = new FormData(form);
		const formDataJson = {};
		formData.forEach((value, key) => (formDataJson[key] = value));
		const result = await axios.post(
			`${config.engineURL}/api/update_car?car_id=${carId}`,
			formDataJson
		);

		// post form image data
		const imgFormData = new FormData();
		const fileInput = document.getElementsByName('imgs')[0];

		if (fileInput.files.length > 0) {
			Array.from(fileInput.files).forEach((file, i) =>
				imgFormData.append(`img_${carId}_${i}`, file)
			);

			const result1 = await axios.post(
				`${config.engineURL}/api/image_upload?car_id=${carId}`,
				imgFormData
			);

			if (result.status === 200 && result1.status === 200)
				showMsg(`${formDataJson.carName} has been updated!`);
			else showMsg('Some error occurred! Try again in some time');
			return;
		}

		if (result.status === 200)
			showMsg(`${formDataJson.carName} has been updated!`);
		else showMsg('Some error occurred! Try again in some time');
	}

	const [editMessage, setEditMessage] = React.useState('');

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
		if (mode === 'edit') updateCar(carId);
		else if (mode === 'delete') deleteCar(carId);
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
				<span className="edit-comp pf-300 msg">{editMessage}</span>
			</div>

			<div className="edit-comp-group">
				<span
					className="edit-comp icon final-action confirm-btn"
					title="Confirm action"
					onClick={confirmAction}
				>
					✅
				</span>
				<span
					className="edit-comp icon final-action cancel-btn"
					title="Cancel action"
					onClick={closeEditMode}
				>
					❌
				</span>
			</div>
		</div>
	);
}
