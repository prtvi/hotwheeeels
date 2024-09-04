import React from 'react';
import config from '../config.json';
import './Main.css';

export default function Legend(props) {
	const { filter } = props;

	const scColorRef = config.segmentClassColorRef;
	const segmentClasses = config.segmentClasses;

	const handleFilter = function (e) {
		const ct = e.currentTarget;

		if (ct.classList.contains('active')) {
			ct.classList.remove('active');
			filter('');
			return;
		}

		const legendItems = document.querySelectorAll('.legend-item');
		Array.from(legendItems).forEach(l => l.classList.remove('active'));

		ct.classList.add('active');
		const segmentClass = ct.getAttribute('title');

		filter(segmentClass);
	};

	return (
		<div className="legend-items">
			{segmentClasses.map((sc, i) => (
				<div
					className="legend-item"
					key={i}
					title={sc.className}
					onClick={handleFilter}
				>
					<div
						className="color"
						style={{
							backgroundColor: scColorRef[sc.className],
						}}
					></div>
					<div className="value pf-200">{sc.label}</div>
				</div>
			))}
		</div>
	);
}
