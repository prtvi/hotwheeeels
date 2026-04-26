import './Forms.css';

import {
	getFormContentDom,
	getFormRowItemsForUpdate,
	getConfigValue,
} from '../functions.js';

export default function UpdateCarForm(props) {
	const { car } = props;
	const rowsToShow = getFormRowItemsForUpdate(
		getConfigValue('formItems', []),
		car,
	);

	return (
		<form id="update-car-form">
			<div className="form-content">{getFormContentDom(rowsToShow)}</div>
		</form>
	);
}
