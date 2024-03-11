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

		if (spec.viewSize === 'large') {
			largeItemIdxs.push(i);
			continue;
		}

		allRowItems.push(spec);
	}

	for (let i = 0; i < allRowItems.length; i += 2)
		rows.push(allRowItems.slice(i, i + 2));

	for (let i = 0; i < largeItemIdxs.length; i++)
		rows.push([specs[largeItemIdxs[i]]]);

	return rows;
}

export default function AddCarForm() {
	const rowsToShow = getRowsToShow2(formItems);

	return (
		<div className="add-new-car-form">
			<form action="" method="post">
				<div className="form-content">
					{rowsToShow.map((row, rowIdx) => {
						let itemSizeClass = 'ii-small';
						if (row.length === 1) itemSizeClass = 'ii-large';

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
