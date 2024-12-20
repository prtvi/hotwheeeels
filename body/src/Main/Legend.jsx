import React from 'react';
import SVG from '../Utils/SVG.jsx';
import config from '../config.json';
import { getResultsPerPage } from '../functions.js';
import './Main.css';

export default function Legend(props) {
	const { filter } = props;
	const scs = Object.entries(config.segmentClasses).filter(i => i[1].avlbl);

	const [isLegendOpen, setLegendOpen] = React.useState(false);
	const [segmentClass, setSegmentClass] = React.useState('');

	let orientation = 'vertical';
	if (getResultsPerPage() === config.resultsPerPage)
		orientation = 'horizontal';

	const handleFilter = function (e) {
		const ct = e.currentTarget;

		// filter based on selection
		let selectedSegmentClass = ct.getAttribute('title');
		if (ct.classList.contains('active')) selectedSegmentClass = '';

		// rm active from all legend-items
		const legendItems = document.querySelectorAll('.legend-item');
		Array.from(legendItems).forEach(l => l.classList.remove('active'));

		filter(selectedSegmentClass);
		setSegmentClass(selectedSegmentClass);

		// add active selected legend item
		ct.classList.add('active');
	};

	const toggleLegend = () => setLegendOpen(curr => !curr);

	const getLegendItemsDom = () => (
		<div className="legend-items">
			{scs.map((sc, i) => (
				<div
					key={i}
					title={sc[0]}
					className={`legend-item ${
						sc[0] === segmentClass ? 'active' : ''
					}`}
					onClick={handleFilter}
				>
					<div
						className="color"
						style={{
							backgroundColor: sc[1].color,
						}}
					></div>
					<div className="value pf-200">{sc[1].label}</div>
				</div>
			))}
		</div>
	);

	const getDom = () =>
		orientation === 'vertical' ? (
			<>
				<div className="legend-opener" onClick={toggleLegend}>
					{isLegendOpen ? (
						<SVG name="cancel" />
					) : (
						<SVG name="filter" />
					)}

					<div
						className={`badge ${segmentClass ? 'active' : ''}`}
					></div>
				</div>

				{isLegendOpen ? getLegendItemsDom() : <></>}
			</>
		) : (
			getLegendItemsDom()
		);

	return getDom();
}
