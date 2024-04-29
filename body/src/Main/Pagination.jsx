import React from 'react';
import './Main.css';
import config from '../config.json';

export default function Pagination(props) {
	// length is the result for view array length, after search/filter
	const { length, currPage, setCurrPage } = props;

	const resultsPerPage = config.resultsPerPage;
	const nPages = Math.ceil(length / resultsPerPage);

	const back = function () {
		if (currPage - 1 === 0) setCurrPage(1);
		else setCurrPage(c => c - 1);
	};

	const forward = function () {
		if (currPage + 1 >= nPages) setCurrPage(nPages);
		else setCurrPage(c => c + 1);
	};

	const start = resultsPerPage * (currPage - 1) + 1;
	const end = Math.min(resultsPerPage * currPage, length);

	return (
		<div className="pagination">
			<span className="left" onClick={back}>
				&#10094;
			</span>

			<span className="pf-200 pagination-text">
				{start} - {end} of {length}
			</span>

			<span className="right" onClick={forward}>
				&#10095;
			</span>
		</div>
	);
}
