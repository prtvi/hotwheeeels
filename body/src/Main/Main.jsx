import React from 'react';
import Fuse from 'fuse.js';

import './Main.css';
import CarShowcase from '../CarShowcase/CarShowcase.jsx';
import Skeleton from '../Utils/Skeleton.jsx';
import NoResults from '../Utils/NoResults.jsx';
import Modal from '../Utils/Modal.jsx';
import Toolbar from './Toolbar.jsx';
import Legend from './Legend.jsx';
import Cars from '../CarShowcase/Cars.jsx';
import SwipeCar from '../CarShowcase/SwipeCar.jsx';
import Pagination from './Pagination.jsx';
import config from '../config.json';

import {
	getEngineUrl,
	makeRequest,
	getResultsFromFuse,
	getResultsFromFilter,
	getResultsFromFilterStrict,
	getAuthHeaders,
	setSessionStorage,
	sortHandler,
	getResultsPerPage,
} from '../functions.js';

export default function Main(props) {
	const { visitorMode } = props;

	// modal
	const [isModalOpen, setModalOpen] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('Add a new car');
	const [modalContent, setModalContent] = React.useState(<></>);

	// all results to store all results from api call
	// results for view to only render based on search/filter
	const [allResults, setAllResults] = React.useState([]);
	const [resultsForView, setResultsForView] = React.useState([]);

	// search input
	const [searchInput, setSearchInput] = React.useState('');

	// sorting
	const [sortParams, setSortParams] = React.useState({
		sortBy: 'acquiredDate',
		sortOrder: 'asc',
	});

	// pagination
	const [currPage, setCurrPage] = React.useState(1);

	React.useEffect(() => {
		async function fetchData() {
			let res;

			if (visitorMode) {
				// visitor flow
				const url = `${getEngineUrl()}/api/get_all`;
				res = await makeRequest(url);
			} else {
				// auth flow
				const headers = getAuthHeaders();

				const url = `${getEngineUrl()}/api/auth/get_all`;
				res = await makeRequest(url, headers);
			}

			if (res.status === 200) {
				setAllResults(() => res.data);
				setResultsForView(() => res.data);

				showRequestedCar(res.data);
			}
		}

		fetchData();
		setSessionStorage('carIdx', 0);
		// eslint-disable-next-line
	}, [visitorMode]);

	const fuse = new Fuse(allResults, {
		keys: config.fuseSearchParams,
		includeScore: true,
	});

	// searchbox
	function handleSearchInput(e) {
		setResultsForView(() => {
			if (e === undefined) return allResults;

			let res = getResultsFromFilter(
				allResults,
				'carName',
				e.target.value
			);

			if (res.length === 0)
				res = getResultsFromFuse(fuse, e.target.value);
			if (res.length === 0) res = [];
			return res;
		});

		setCurrPage(1);
	}

	function clearInput() {
		document.querySelector('.input-cross').classList.add('hidden');
		setSearchInput('');
		handleSearchInput();
	}

	function getToolbar() {
		return (
			<Toolbar
				searchInput={searchInput}
				setSearchInput={setSearchInput}
				onSearch={handleSearchInput}
				clearInput={clearInput}
				nCars={resultsForView.length}
				setModalOpen={setModalOpen}
				setModalContent={setModalContent}
				setModalTitle={setModalTitle}
				visitorMode={visitorMode}
				setSortParams={setSortParams}
			/>
		);
	}

	function getTempComponents(temp) {
		return (
			<>
				{getToolbar()}
				{temp}
			</>
		);
	}

	function showCar(index) {
		// pick car only from pagination list
		const car = paginationList[index];
		setSessionStorage('carIdx', index);

		// set car id in url
		window.history.pushState(null, '', `?car_id=${car.carId}&src=urlpop`);

		setModalContent(() => (
			<CarShowcase
				car={car}
				setModalOpen={setModalOpen}
				setModalContent={setModalContent}
				setModalTitle={setModalTitle}
				visitorMode={visitorMode}
			/>
		));

		setModalTitle(
			<SwipeCar
				carName={car.carName}
				nItems={paginationList.length}
				showCar={showCar}
			/>
		);
		setModalOpen(true);
	}

	function showRequestedCar(allCars) {
		const searchParams = new URLSearchParams(window.location.search);
		if (!searchParams.has('car_id')) return;

		const carId = searchParams.get('car_id');

		for (let i = 0; i < allCars.length; i++) {
			const car = allCars[i];

			if (car.carId === carId) {
				setModalContent(() => (
					<CarShowcase
						car={car}
						setModalOpen={setModalOpen}
						setModalContent={setModalContent}
						setModalTitle={setModalTitle}
						visitorMode={visitorMode}
					/>
				));

				setModalTitle(car.carName);
				setModalOpen(true);
				break;
			}
		}
	}

	function filterBasedOnSegmentClass(segmentClass) {
		let res = [];
		if (segmentClass === '') res = allResults;
		else
			res = getResultsFromFilterStrict(
				allResults,
				'segmentClass',
				segmentClass
			);

		setResultsForView(() => res);
		setCurrPage(1);
	}

	// sort entire list and then truncate results for view array and render only a portion of it based on curr page
	const sortedList = sortHandler(sortParams, resultsForView);
	const resultsPerPage = getResultsPerPage();
	const paginationList = sortedList.slice(
		resultsPerPage * (currPage - 1),
		resultsPerPage * currPage
	);

	if (allResults.length === 0) return getTempComponents(<Skeleton />);
	if (resultsForView.length === 0)
		return getTempComponents(<NoResults clearInput={clearInput} />);

	return (
		<>
			{getToolbar()}

			<Legend filter={filterBasedOnSegmentClass} />

			<Cars list={paginationList} showCar={showCar} />

			<Pagination
				length={resultsForView.length}
				currPage={currPage}
				setCurrPage={setCurrPage}
			/>

			<Modal
				modalTitle={modalTitle}
				isOpen={isModalOpen}
				setModalOpen={setModalOpen}
			>
				{modalContent}
			</Modal>
		</>
	);
}
