import React from 'react';
import './Forms.css';
import FormItem from './FormItem.jsx';
import Message from '../Utils/Message.jsx';
import Loader from '../Utils/Loader.jsx';
import config from '../config.json';
import { getEngineUrl, makeRequest } from '../App.js';

async function postFormTextData(form, url, headers) {
	const formData = new FormData(form);
	const formDataJson = {};
	formData.forEach((value, key) => (formDataJson[key] = value));

	const response = await makeRequest(url, headers, formDataJson);
	return response;
}

async function postImageData(fileInput, url, carId, headers) {
	const imgFormData = new FormData();
	Array.from(fileInput.files).forEach((file, i) => {
		// create new file object to rename file on upload
		const fnparts = file.name.split('.');
		const ext = fnparts[fnparts.length - 1].toLowerCase();

		const blob = file.slice(0, file.size);
		const newFile = new File([blob], `img_${carId}_${i}.${ext}`);

		imgFormData.append('imgs', newFile);
	});

	const response = await makeRequest(url, headers, imgFormData);
	return response;
}

export { postFormTextData, postImageData };

function getFormRowItems(specs) {
	const rows = [];
	const allRowItems = [];
	const largeItemIdxs = [];

	for (let i = 0; i < specs.length; i++) {
		const spec = specs[i];

		// fields that need to occupy the entire row, push their indexes
		if (spec.viewSize === 'large') {
			largeItemIdxs.push(i);
			continue;
		}

		// get all valid row items together
		allRowItems.push(spec);
	}

	// push row items as set of 2 items together [r0, r1]
	for (let i = 0; i < allRowItems.length; i += 2)
		rows.push(allRowItems.slice(i, i + 2));

	// get all the large items using the indexes and push them as a single element in the row unlike small elements, rows: [[r0, r1], ... [r18], [r19]]
	for (let i = 0; i < largeItemIdxs.length; i++)
		rows.push([specs[largeItemIdxs[i]]]);

	// rows: [[r0, r1], [r2, r3], ..., [r19], [r20]]
	return rows;
}

function getFormContentDom(rowItems) {
	return rowItems.map((row, rowIdx) => {
		return (
			<div className="form-row" key={rowIdx}>
				{row.map(ri => (
					<FormItem key={ri.key} spec={ri} viewSize={ri.viewSize} />
				))}
			</div>
		);
	});
}

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
