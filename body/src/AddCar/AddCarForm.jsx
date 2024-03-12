import React from 'react';
import axios from 'axios';
import './AddCarForm.css';
import FormItem from './FormItem.jsx';
import config from '../config.json';

function getRowsToShow2(specs) {
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

const engineURL = config.engineURL;

export default function AddCarForm() {
	const rowsToShow = getRowsToShow2(config.formItems);

	async function handleFormSubmit(e) {
		e.preventDefault();

		const button = document.getElementById('loading-button');
		button.disabled = true;
		button.classList.add('button-loader');

		const ts = Date.now();

		// post form text data
		const formData = new FormData(e.currentTarget);
		const formDataJson = {};
		formData.forEach((value, key) => (formDataJson[key] = value));
		const result = await axios.post(
			`${engineURL}/add_car?req_id=${ts}`,
			formDataJson
		);
		// console.log(result.status);

		// post form image data
		const imgFormData = new FormData();
		const file = document.getElementsByName('imgSrc')[0];
		imgFormData.append('imgSrc', file.files[0]);
		const result1 = await axios.post(
			`${engineURL}/image_upload?req_id=${ts}`,
			imgFormData
		);
		// console.log(result1.status);

		if (result.status === 200 && result1.status === 200) {
			button.disabled = false;
			button.classList.remove('button-loader');
		}
	}

	return (
		<div className="add-new-car-form">
			<form onSubmit={handleFormSubmit}>
				<div className="form-content">
					{rowsToShow.map((row, rowIdx) => {
						let itemSizeClass = 'ii-small'; // small class will allow two items to occupy the row
						if (row.length === 1) itemSizeClass = 'ii-large'; // large class if the row size is 1, will occupy entire row

						return (
							<div className="form-row" key={rowIdx}>
								{row.map(ri => (
									<FormItem
										key={ri.key}
										spec={ri}
										itemSizeClass={itemSizeClass}
									/>
								))}
							</div>
						);
					})}
				</div>
			</form>
		</div>
	);
}
