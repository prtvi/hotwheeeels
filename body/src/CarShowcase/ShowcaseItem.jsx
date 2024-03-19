import React from 'react';
import './CarShowcase.css';

const validSpec = function (value) {
	let valueField = value || '-';
	if (typeof value === 'boolean') valueField = value ? 'Yes' : 'No';

	if (valueField === '-') return false;
	return true;
};

export { validSpec };

export default function ShowcaseItem(props) {
	const { label, value, itemSizeClass } = props;
	const className = `row-item ${itemSizeClass}`;

	if (!validSpec(value)) return null;

	let valueField = value || '-';
	if (typeof value === 'boolean') valueField = value ? 'Yes' : 'No';

	return (
		<div className={className}>
			<span className="label pf-300">{label}</span>
			<span className="value pf-400">{valueField}</span>
		</div>
	);
}
