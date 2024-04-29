import React from 'react';
import Message from '../Utils/Message.jsx';
import Loader from '../Utils/Loader.jsx';
import './Forms.css';
import config from '../config.json';

import {
	showCurrentMode,
	showEditComponents,
	getEngineUrl,
	makeRequest,
	postFormTextData,
	postImageData,
	getAuthHeaders,
} from '../functions.js';

export default function EditCarDetails(props) {
	const {
		carId,
		setModalContent,
		setModalTitle,
		setModalOpen,
		mode,
		setMode,
	} = props;

	const [editMessage, setEditMessage] = React.useState('');

	const [responses, setResponses] = React.useState([]);
	const [formSubmitted, setFormSubmitted] = React.useState(false);

	const headers = getAuthHeaders();

	const closeModal = () => setModalOpen(false);
	const setModalContentForMessage = function (msg) {
		setModalContent(() => <Message closeModal={closeModal} />);
		setModalTitle(msg);
	};

	async function deleteCar(carId) {
		setFormSubmitted(true);
		setModalTitle('Submitting ...');

		const res = await makeRequest(
			`${getEngineUrl()}/api/auth/delete_car`,
			headers,
			{ car_id: carId }
		);

		setResponses(() => [res]);

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

		setFormSubmitted(true);
		setModalTitle('Submitting ...');

		const engineUrl = getEngineUrl();
		const urlText = `${engineUrl}/api/auth/update_car?car_id=${carId}`;
		const textFormRes = await postFormTextData(form, urlText, headers);

		if (fileInput.files.length > 0) {
			const urlImage = `${engineUrl}/api/auth/image_upload?car_id=${carId}`;
			const imageFormRes = await postImageData(
				fileInput,
				urlImage,
				carId,
				headers
			);

			setResponses(() => [textFormRes, imageFormRes]);

			if (textFormRes.status === 200 && imageFormRes.status === 200)
				setModalContentForMessage(`The car has been updated!`);
			else
				setModalContentForMessage(
					'Some error occurred! Try again in some time'
				);
			return;
		}

		setResponses(() => [textFormRes]);

		if (textFormRes.status === 200)
			setModalContentForMessage(`Car has been updated!`);
		else
			setModalContentForMessage(
				'Some error occurred! Try again in some time'
			);
	}

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
				<span className="edit-comp icon">
					{formSubmitted && responses.length === 0 ? (
						<Loader width={'5px'} height={'5px'} />
					) : (
						<></>
					)}
				</span>

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
