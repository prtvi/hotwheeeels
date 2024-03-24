import React from 'react';
import './Toolbar.css';
import config from '../config.json';

function getOptionsToShow(formItems) {
	const filters = [];
	const sort = [];

	for (let i = 0; i < formItems.length; i++) {
		const fi = formItems[i];

		if (fi.forFilter) filters.push(fi);
		if (fi.forSort) sort.push(fi);
	}

	return { filters, sort };
}

export default function Toolbar(props) {
	const { onSearch, openModal, initAddCarForm } = props;

	const showCar = function () {
		initAddCarForm();
		openModal();
	};

	const options = getOptionsToShow(config.formItems);

	const [sortAsc, setsortAsc] = React.useState(true);
	const toggleSort = () => setsortAsc(t => !t);

	const changePlaceholderOnOptionChange = function (e) {
		const placeholderValue =
			options.filters.find(val => val.key === e.target.value)
				.placeholder || 'yes/no';

		const input = document.querySelector('input#filter-by-value');
		input.setAttribute('placeholder', placeholderValue);
	};

	const toggleOptions = () =>
		document.querySelector('.row2').classList.toggle('hidden');

	return (
		<div className="toolbar">
			<div className="row1">
				<div className="row1-child">
					<input
						className="pf-300"
						type="text"
						name="search"
						placeholder="🔍  Search for cars"
						onChange={onSearch}
					/>
				</div>

				<div className="row1-child">
					<button className="btn pf-300" onClick={showCar}>
						+ 🚘
					</button>
				</div>

				<div className="row1-child">
					<button onClick={toggleOptions} className="btn pf-300">
						🚦
					</button>
				</div>
			</div>

			<div className="row2 hidden">
				<div className="row2-child">
					<label className="pf-200" htmlFor="filter-by">
						Filter by
					</label>

					<div className="row2-child-input">
						<select
							onChange={changePlaceholderOnOptionChange}
							id="filter-by"
						>
							{options.filters.map((f, i) => (
								<option key={i} value={f.key}>
									{f.label}
								</option>
							))}
						</select>

						<input
							type="text"
							id="filter-by-value"
							className="pf-300"
							placeholder="filter by"
						/>
					</div>
				</div>

				<div className="row2-child">
					<label className="pf-200" htmlFor="sort-by">
						Sort by
					</label>

					<div className="row2-child-input">
						<select id="sort-by">
							{options.sort.map((f, i) => (
								<option key={i} value={f.key}>
									{f.label}
								</option>
							))}
						</select>

						<span onClick={toggleSort}>
							{sortAsc ? '⬇️' : '⬆️'}{' '}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
