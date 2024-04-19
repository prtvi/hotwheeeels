import React from 'react';
import Message from '../Utils/Message.jsx';
import './Forms.css';
import config from '../config.json';
import { postFormTextData, postImageData } from './AddCarForm.jsx';
import { getEngineUrl, makeRequest } from '../App.js';

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
	const {
		carId,
		setModalContent,
		setModalTitle,
		setModalOpen,
		mode,
		setMode,
	} = props;

	const closeModal = () => setModalOpen(false);
	const setModalContentForMessage = function (msg) {
		setModalContent(() => <Message closeModal={closeModal} />);
		setModalTitle(msg);
	};

	async function deleteCar(carId) {
		const res = await makeRequest(
			`${getEngineUrl()}/api/delete_car?car_id=${carId}`
		);

		if (res.status === 200)
			setModalContentForMessage('Car has been deleted');
		else setModalContentForMessage('Something went wrong, try again later');
	}

	async function updateCar(carId) {
		const form = document.getElementById('update-car-form');
		const fileInput = document.getElementsByName('imgs')[0];

		if (fileInput.files.length > config.maxFileUploadLimit) {
			alert(`You can upload only ${config.maxFileUploadLimit} pictures`);
			return;
		}

		const urlText = `${getEngineUrl()}/api/update_car?car_id=${carId}`;
		const textFormRes = await postFormTextData(form, urlText);

		if (fileInput.files.length > 0) {
			const urlImage = `${getEngineUrl()}/api/image_upload?car_id=${carId}`;
			const imageFormRes = await postImageData(
				fileInput,
				urlImage,
				carId
			);

			if (textFormRes.status === 200 && imageFormRes.status === 200)
				setModalContentForMessage(`The car has been updated!`);
			else
				setModalContentForMessage(
					'Some error occurred! Try again in some time'
				);
			return;
		}

		if (textFormRes.status === 200)
			setModalContentForMessage(`Car has been updated!`);
		else
			setModalContentForMessage(
				'Some error occurred! Try again in some time'
			);
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
