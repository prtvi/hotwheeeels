import './CarShowcase.css';

import { validSpec } from '../functions.js';

export default function ShowcaseItem(props) {
	const { label, value, itemSizeClass } = props;
	const className = `row-item ${itemSizeClass}`;

	if (!validSpec(value)) return null;

	let valueField = value || '-';
	if (typeof value === 'boolean') valueField = value ? 'Yes' : 'No';

	if (label === 'Acquired date')
		valueField = new Date(value).toDateString().slice(3);

	if (label === 'Featured link') {
		valueField = (
			<span className="pf-400">
				🔗{' '}
				<a
					className="pf-400"
					href={value}
					rel="noreferrer"
					target="_blank"
				>
					{value.slice(12, 26)}...
				</a>
			</span>
		);
	}

	if (label === 'Collection #/250') valueField = `${value}/250`;

	return (
		<div className={className}>
			<span className="label pf-300">{label}</span>
			<span className="value pf-400">{valueField}</span>
		</div>
	);
}
