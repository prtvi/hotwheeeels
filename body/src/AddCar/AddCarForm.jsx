import React from 'react';
import './AddCarForm.css';
import FormItem from './FormItem.jsx';
import formItems from '../formItems.json';

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

export default function AddCarForm() {
	const rowsToShow = getRowsToShow2(formItems);

	return (
		<div className="add-new-car-form">
			<form action="" method="post">
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
