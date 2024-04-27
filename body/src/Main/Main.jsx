import React from 'react';
import Fuse from 'fuse.js';

import './Main.css';
import Skeleton from '../Utils/Skeleton.jsx';
import Modal from '../Utils/Modal.jsx';
import Toolbar from './Toolbar.jsx';
import Cars from '../CarShowcase/Cars.jsx';
import { getEngineUrl, makeRequest } from '../App.js';

function getResultsFromFuse(fuse, inputText) {
	return fuse
		.search(inputText)
		.sort((a, b) => {
			if (a.score > b.score) return 1;
			if (a.score < b.score) return -1;
			return 0;
		})
		.map(i => i.item);
}

function getResultsFromFilter(allItems, inputText) {
	return allItems.filter(item =>
		item.carName.toLowerCase().includes(inputText.toLowerCase())
	);
}

export default function Main(props) {
	const { visitorMode } = props;

	// modal
	const [isModalOpen, setModalOpen] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('Add a new car');
	const [modalContent, setModalContent] = React.useState(<></>);

	// all results from api call && results to show on UI
	const [allResults, setAllResults] = React.useState([]);
	const [resultsForView, setResultsForView] = React.useState([]);

	const [searchInput, setSearchInput] = React.useState('');

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
	const handleSearchInput = e => {
		setResultsForView(() => {
			if (e === undefined) return allResults;

			let res = getResultsFromFilter(allResults, e.target.value);
			if (res.length === 0)
				res = getResultsFromFuse(fuse, e.target.value);
			if (res.length === 0) res = [];
			return res;
		});
	};

	const clearInput = function () {
		document.querySelector('.input-cross').classList.add('hidden');
		setSearchInput('');
		handleSearchInput();
	};

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

	if (allResults.length === 0) {
		return (
			<>
				{getToolbar()}
				<Skeleton />
			</>
		);
	}

	if (resultsForView.length === 0) {
		return (
			<>
				{getToolbar()}

				<div className="message-box">
					<span className="pf-400 result-msg">
						No matches were found
					</span>
					<button className="btn reload pf-300" onClick={clearInput}>
						Go back
					</button>
				</div>
			</>
		);
	}

	return (
		<>
			{getToolbar()}

			<Cars
				list={resultsForView}
				setModalOpen={setModalOpen}
				setModalContent={setModalContent}
				setModalTitle={setModalTitle}
				visitorMode={visitorMode}
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
