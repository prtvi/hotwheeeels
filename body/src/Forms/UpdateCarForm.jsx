import React from 'react';
import './Forms.css';
import FormItem from './FormItem.jsx';
import config from '../config.json';

function getFormRowItems(specs, car) {
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

export default function UpdateCarForm(props) {
	const { car } = props;
	const rowsToShow = getFormRowItems(config.formItems, car);

	return (
		<div className="update-car-form">
			<form id="update-car-form">
				<div className="form-content">
					{rowsToShow.map((row, rowIdx) => {
						return (
							<div className="form-row" key={rowIdx}>
								{row.map(ri => (
									<FormItem
										key={ri.key}
										spec={ri}
										viewSize={ri.viewSize}
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
