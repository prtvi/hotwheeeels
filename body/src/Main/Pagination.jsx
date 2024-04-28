import React from 'react';
import './Main.css';
import config from '../config.json';

export default function Pagination(props) {
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
			<div>
				<span className="left" onClick={back}>
					⬅️
				</span>
			</div>

			<div>
				<span className="pf-200 pagination-text">
					{start} - {end} of {length}
				</span>
			</div>

			<div>
				<span className="right" onClick={forward}>
					➡️
				</span>
			</div>
		</div>
	);
}
