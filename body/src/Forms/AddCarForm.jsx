import React from 'react';
import axios from 'axios';
import './Forms.css';
import FormItem from './FormItem.jsx';
import config from '../config.json';

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
			<div className="row" key={rowIdx}>
				{row.map(ri => (
					<FormItem
						key={ri.key}
						spec={ri}
						itemSizeClass={`ri-${ri.viewSize}`}
					/>
				))}
			</div>
		);
	});
}

export default function AddCarForm(props) {
	const { showMsg } = props;
	const rowsToShow = getFormRowItems(config.formItems);

	async function handleFormSubmit(e) {
		e.preventDefault();
		const ts = Date.now();

		// post form text data
		const formData = new FormData(e.currentTarget);
		const formDataJson = {};
		formData.forEach((value, key) => (formDataJson[key] = value));
		const result = await axios.post(
			`${config.engineURL}/api/add_car?car_id=${ts}`,
			formDataJson
		);

		// post form image data
		const imgFormData = new FormData();
		const fileInput = document.getElementsByName('imgs')[0];
		Array.from(fileInput.files).forEach((file, i) =>
			imgFormData.append(`img_${ts}_${i}`, file)
		);

		const result1 = await axios.post(
			`${config.engineURL}/api/image_upload?car_id=${ts}`,
			imgFormData
		);

		if (result.status === 200 && result1.status === 200)
			showMsg(
				`${formDataJson.carName} has been added to your collection!`
			);
		else showMsg('Some error occurred! Try again in some time');
	}

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
