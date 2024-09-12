import React from 'react';
import config from '../config.json';
import './Main.css';

export default function Legend(props) {
	const { filter } = props;

	const scColorRef = config.segmentClassColorRef;
	const segmentClasses = config.segmentClasses;

	const handleFilter = function (e) {
		const ct = e.currentTarget;
		const clearFilterBtn = document.querySelector('.clear-filter');

		// clear filter on legend item selection
		if (ct.classList.contains('active')) return clearFilter();

		// filter based on selection
		// rm active from all legend-items
		const legendItems = document.querySelectorAll('.legend-item');
		Array.from(legendItems).forEach(l => l.classList.remove('active'));

		// add active to clear btn and selected legend item
		clearFilterBtn.classList.add('active');
		ct.classList.add('active');

		// filter
		const segmentClass = ct.getAttribute('title');
		filter(segmentClass);
	};

	const clearFilter = function () {
		const legendItems = document.querySelectorAll('.legend-item');
		Array.from(legendItems).forEach(l => l.classList.remove('active'));
		filter('');
	};

	return (
		<div className="legend-items">
			<div className="legend-item clear-filter" onClick={clearFilter}>
				<span>&#9587;</span>
			</div>

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
