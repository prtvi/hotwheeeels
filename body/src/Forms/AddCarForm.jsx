import React from 'react';
import './Forms.css';
import Message from '../Utils/Message.jsx';
import Loader from '../Utils/Loader.jsx';
import config from '../config.json';

import {
	getEngineUrl,
	postFormTextData,
	postImageData,
	getFormRowItems,
	getFormContentDom,
} from '../functions.js';

export default function AddCarForm(props) {
	const { setModalContent, setModalTitle, setModalOpen } = props;
	const rowsToShow = getFormRowItems(config.formItems);

	const closeModal = () => setModalOpen(false);
	const setModalContentForMessage = function (msg) {
		setModalContent(() => <Message closeModal={closeModal} />);
		setModalTitle(msg);
	};

	const [responses, setResponses] = React.useState([]);
	const [formSubmitted, setFormSubmitted] = React.useState(false);

	async function handleFormSubmit(e) {
		e.preventDefault();
		const carId = Date.now();
		const fileInput = document.getElementsByName('imgs')[0];

		if (fileInput.files.length > config.maxFileUploadLimit) {
			alert(`You can upload only ${config.maxFileUploadLimit} pictures`);
			return;
		}

		setFormSubmitted(true);
		setModalTitle('Submitting ...');

		const engineUrl = getEngineUrl();
		const urlText = `${engineUrl}/api/auth/add_car?car_id=${carId}`;
		const urlImage = `${engineUrl}/api/auth/image_upload?car_id=${carId}`;

		const headers = { headers: { token: sessionStorage.getItem('token') } };

		const textFormRes = await postFormTextData(
			e.currentTarget,
			urlText,
			headers
		);
		const imageFormRes = await postImageData(
			fileInput,
			urlImage,
			carId,
			headers
		);

		setResponses(() => [textFormRes, imageFormRes]);

		if (textFormRes.status === 200 && imageFormRes.status === 200)
			setModalContentForMessage(
				`A new car has been added to your collection!`
			);
		else
			setModalContentForMessage(
				'Some error occurred! Try again in some time'
			);
	}

	if (formSubmitted && responses.length === 0) return <Loader />;

	return (
		<div className="add-car-form">
			<form onSubmit={handleFormSubmit} id="add-car-form">
				<div className="form-content">
					{getFormContentDom(rowsToShow)}
				</div>
			</form>
		</div>
	);
}
