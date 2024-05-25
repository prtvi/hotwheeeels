import './Main.css';
import { getResultsPerPage } from '../functions.js';

export default function Pagination(props) {
	// length is the result for view array length, after search/filter
	const { length, currPage, setCurrPage } = props;

	const resultsPerPage = getResultsPerPage();
	const nPages = Math.ceil(length / resultsPerPage);

	const left = function () {
		if (currPage - 1 === 0) setCurrPage(1);
		else setCurrPage(c => c - 1);
	};

	const right = function () {
		if (currPage + 1 >= nPages) setCurrPage(nPages);
		else setCurrPage(c => c + 1);
	};

	const start = resultsPerPage * (currPage - 1) + 1;
	const end = Math.min(resultsPerPage * currPage, length);

	return (
		<div className="pagination">
			<span
				className={`arrow-left ${currPage <= 1 ? 'disabled' : ''}`}
				onClick={left}
			>
				&#10094;
			</span>

			<span className="pf-300 pagination-text">
				{start} - {end} of {length}
			</span>

			<span
				className={`arrow-right ${
					currPage >= nPages ? 'disabled' : ''
				}`}
				onClick={right}
			>
				&#10095;
			</span>
		</div>
	);
}
