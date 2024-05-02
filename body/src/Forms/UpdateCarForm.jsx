import './Forms.css';
import config from '../config.json';

import { getFormContentDom, getFormRowItemsForUpdate } from '../functions.js';

export default function UpdateCarForm(props) {
	const { car } = props;
	const rowsToShow = getFormRowItemsForUpdate(config.formItems, car);

	return (
		<form id="update-car-form">
			<div className="form-content">{getFormContentDom(rowsToShow)}</div>
		</form>
	);
}
