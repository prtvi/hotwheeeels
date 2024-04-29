import React from 'react';
import Fuse from 'fuse.js';

import './Main.css';
import CarShowcase from '../CarShowcase/CarShowcase.jsx';
import Skeleton from '../Utils/Skeleton.jsx';
import NoResults from '../Utils/NoResults.jsx';
import Modal from '../Utils/Modal.jsx';
import Toolbar from './Toolbar.jsx';
import Cars from '../CarShowcase/Cars.jsx';
import Pagination from './Pagination.jsx';
import config from '../config.json';

import {
	getEngineUrl,
	makeRequest,
	getResultsFromFuse,
	getResultsFromFilter,
} from '../functions.js';

export default function Main(props) {
	const { visitorMode } = props;

	// modal
	const [isModalOpen, setModalOpen] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('Add a new car');
	const [modalContent, setModalContent] = React.useState(<></>);

	// all results from api call && results to show on UI
	const [allResults, setAllResults] = React.useState([]);
	const [resultsForView, setResultsForView] = React.useState([]);

	// search input
	const [searchInput, setSearchInput] = React.useState('');

	// pagination
	const resultsPerPage = config.resultsPerPage;
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
				const headers = {
					headers: { token: sessionStorage.getItem('token') },
				};

				const url = `${getEngineUrl()}/api/auth/get_all`;
				res = await makeRequest(url, headers);
			}

			if (res.status === 200) {
				setAllResults(() => res.data);
				setResultsForView(() => res.data);
			}
		}

		fetchData();
	}, [visitorMode]);

	const fuse = new Fuse(allResults, {
		keys: ['carName'],
		includeScore: true,
	});

	// searchbox
	function handleSearchInput(e) {
		setResultsForView(() => {
			if (e === undefined) return allResults;

			let res = getResultsFromFilter(allResults, e.target.value);
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

	if (allResults.length === 0) return getTempComponents(<Skeleton />);
	if (resultsForView.length === 0)
		return getTempComponents(<NoResults clearInput={clearInput} />);

	const paginationList = resultsForView.slice(
		resultsPerPage * (currPage - 1),
		resultsPerPage * currPage
	);

	function showCar(index) {
		const car = paginationList[index];

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
	}

	return (
		<>
			{getToolbar()}

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
