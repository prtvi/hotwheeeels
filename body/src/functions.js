import React from 'react';
import axios from 'axios';
import ShowcaseItem from './CarShowcase/ShowcaseItem.jsx';
import FormItem from './Forms/FormItem.jsx';

import config from './config.json';

/**
 * return the engine url based on the env
 * @returns {String} engine url
 */
function getEngineUrl() {
	return config.ENV === 'prod' ? config.engineURL : config.engineURLDev;
}

/**
 * makes a GET/POST request based on params
 * GET call if requestBody is not passed
 * @param {String} url absolute url
 * @param {Object} headers headers for request
 * @param {Object} requestBody request body
 * @returns {Object} response body
 */
async function makeRequest(url, headers, requestBody) {
	try {
		if (requestBody === undefined) return await axios.get(url, headers);
		else return await axios.post(url, requestBody, headers);
	} catch (error) {
		return error;
	}
}

/**
 * returns results array based on the match using 'includes' method
 * @param {Array} allItems input array over which the search is applied
 * @param {String} fieldName field in the car object to look for
 * @param {String} inputText input text to match
 * @returns {Array} results array
 */
function getResultsFromFilter(allItems, fieldName, inputText) {
	return allItems.filter(item =>
		item[fieldName].toLowerCase().includes(inputText.toLowerCase())
	);
}

/**
 * returns results array based on fuzzy search
 * @param {Fuse} fuse Fuse instance
 * @param {String} inputText input text to fuzzy match
 * @returns {Array} results array
 */
function getResultsFromFuse(fuse, inputText) {
	return fuse
		.search(inputText)
		.sort((a, b) => {
			if (a.score > b.score) return 1;
			if (a.score < b.score) return -1;
			return 0;
		})
		.map(i => i.item);
}

/**
 * returns results array based on the match using === check
 * @param {Array} allItems input array over which the search is applied
 * @param {String} fieldName field in the car object to look for
 * @param {String} inputText input text to match
 * @returns {Array} results array
 */
function getResultsFromFilterStrict(allItems, fieldName, inputText) {
	return allItems.filter(
		item => item[fieldName].toLowerCase() === inputText.toLowerCase()
	);
}

/**
 * checks if the input value is valid to be shown on the UI
 * @param {String} value to be checked
 * @returns {Boolean}
 */
function validSpec(value) {
	let valueField = value || '-';
	if (typeof value === 'boolean') valueField = value ? 'Yes' : 'No';

	if (valueField === '-') return false;
	return true;
}

/**
 * makes request with form content, text only
 * @param {HTMLFormElement} form
 * @param {String} url url to hit with form data
 * @param {Object} headers headers to attach to the request
 * @returns api response
 */
async function postFormTextData(form, url, headers) {
	const formData = new FormData(form);
	const formDataJson = {};
	formData.forEach((value, key) => (formDataJson[key] = value));

	const response = await makeRequest(url, headers, formDataJson);
	return response;
}

/**
 * makes request with image data
 * @param {File} fileInput
 * @param {String} url
 * @param {Number | String} carId
 * @param {Object} headers
 * @returns api response
 */
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

/**
 * returns all valid rows that can be shown for CarShowcase
 * @param {Array} specs all specifications from config
 * @param {Object} car React Car dom object
 * @returns {Array} array of all valid rows
 */
function getRowItemsForShowcase(specs, car) {
	const rows = [];
	const allRowItems = [];
	const largeItemIdxs = [];

	for (let i = 0; i < specs.length; i++) {
		const spec = specs[i];

		if (spec.forFormOnly) continue;

		const valid = validSpec(car[spec.key]);

		if (spec.viewSize === 'large' && valid) {
			largeItemIdxs.push(i);
			continue;
		}

		if (valid) allRowItems.push(spec);
	}

	for (let i = 0; i < allRowItems.length; i += 2)
		rows.push(allRowItems.slice(i, i + 2));

	for (let i = 0; i < largeItemIdxs.length; i++)
		rows.push([specs[largeItemIdxs[i]]]);

	return rows;
}

/**
 * returns all valid rows for add car form
 * @param {Array} specs all specifications from config
 * @returns {Array} array of all valid rows
 */
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

		// get all row items together
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

/**
 * returns all valid rows for update car form
 * @param {Array} specs all specifications from config
 * @returns {Array} array of all valid rows
 */
function getFormRowItemsForUpdate(specs, car) {
	const rows = [];
	const allRowItems = [];
	const largeItemIdxs = [];

	for (let i = 0; i < specs.length; i++) {
		const spec = specs[i];

		// add the currValue key into the spec object and empty the defaultValue
		spec['currValue'] = car[spec.key];
		spec['defaultValue'] = '';

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
	// rm the last btn component (length-1)
	for (let i = 0; i < largeItemIdxs.length - 1; i++)
		rows.push([specs[largeItemIdxs[i]]]);

	// rows: [[r0, r1], [r2, r3], ..., [r19], [r20]]
	return rows;
}

/**
 * returns array of ShowcaseItem
 * @param {Array} rowsForView array of rows to be showcased
 * @param {Object} car React Car object
 * @returns {Array}
 */
function getShowcaseDom(rowsForView, car) {
	return rowsForView.map((row, rowIdx) => {
		return (
			<div className="row" key={rowIdx}>
				{row.map(ri => {
					return (
						<ShowcaseItem
							key={ri.key}
							label={ri.label}
							value={car[ri.key]}
							itemSizeClass={`ri-${ri.viewSize}`}
						/>
					);
				})}
			</div>
		);
	});
}

/**
 * return array of FormItem
 * @param {Array} rowItems array of rows to be rendered for form
 * @returns {Array}
 */
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

/**
 * hides/unhides the EditCarDetails component
 * @param {Boolean} show whether to show/hide the editCar component
 */
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

/**
 * to show current mode in EditCarDetails
 * @param {Event} e html event
 */
function showCurrentMode(e) {
	const mainAction = document.querySelectorAll('.main-action');
	Array.from(mainAction).forEach(m => m.classList.remove('active'));

	if (e) e.currentTarget.classList.add('active');
}

/**
 * render incorrect password
 */
function showIncorrectPass() {
	const ele = document.querySelector('.login-message');
	ele.classList.remove('hidden');
	setTimeout(() => ele.classList.add('hidden'), 1500);
}

function getAuthHeaders() {
	return { headers: { token: getSessionItem('token', String) } };
}

function setSessionStorage(key, value) {
	sessionStorage.setItem(key, value);
}

function removeSessionItem(key) {
	sessionStorage.removeItem(key);
}

function getSessionItem(key, dataType) {
	const value = sessionStorage.getItem(key);

	switch (dataType) {
		case Number:
			return +value;
		case String:
			return value;
		default:
			return value;
	}
}

function sortHandler(params, list) {
	if (params.sortBy === 'carName') {
		if (params.sortOrder === 'asc')
			return list.sort((a, b) => a.carName.localeCompare(b.carName));
		else return list.sort((a, b) => b.carName.localeCompare(a.carName));
	} else {
		if (params.sortOrder === 'asc')
			return list.sort(
				(a, b) => new Date(a.acquiredDate) - new Date(b.acquiredDate)
			);
		else
			return list.sort(
				(a, b) => new Date(b.acquiredDate) - new Date(a.acquiredDate)
			);
	}
}

function getResultsPerPage() {
	if (window.screen.height > window.screen.width)
		return config.resultsPerPageVertical;

	return config.resultsPerPage;
}

async function logUrl() {
	if (!config.logRequests || config.ENV === 'dev') return;

	const sp = new URLSearchParams(window.location.search);
	if (sp.has('auth')) return;

	const src = sp.get('src');
	const url = window.location.href;

	await makeRequest(
		getEngineUrl() + '/api/capture_website_visit',
		getAuthHeaders(),
		{ url, src }
	);
}

export {
	getEngineUrl,
	makeRequest,
	getResultsFromFuse,
	getResultsFromFilter,
	getResultsFromFilterStrict,
	validSpec,
	getRowItemsForShowcase,
	getShowcaseDom,
	postFormTextData,
	postImageData,
	getFormRowItems,
	getFormContentDom,
	showEditComponents,
	showCurrentMode,
	showIncorrectPass,
	getFormRowItemsForUpdate,
	getAuthHeaders,
	setSessionStorage,
	removeSessionItem,
	getSessionItem,
	sortHandler,
	getResultsPerPage,
	logUrl,
};
