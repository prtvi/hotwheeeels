import React from 'react';
import Fuse from 'fuse.js';

import Skeleton from './Utils/Skeleton.jsx';
import Modal from './Utils/Modal.jsx';
import Toolbar from './Toolbar/Toolbar.jsx';
import Cars from './CarShowcase/Cars.jsx';
import { getEngineUrl, makeRequest } from './App.js';

export default function Main(props) {
	const { visitorMode } = props;

	// modal
	const [isModalOpen, setModalOpen] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('Add a new car');
	const [modalContent, setModalContent] = React.useState(<></>);

	// all results from api call && results to show on UI
	const [allResults, setAllResults] = React.useState([]);
	const [resultsForView, setResultsForView] = React.useState([]);

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

	const getResultsFromFuse = function (inputText) {
		return fuse
			.search(inputText)
			.sort((a, b) => {
				if (a.score > b.score) return 1;
				if (a.score < b.score) return -1;
				return 0;
			})
			.map(i => i.item);
	};

	// searchbox
	const handleSearchInput = e => {
		setResultsForView(() => {
			let res = getResultsFromFuse(e.target.value);
			if (res.length === 0) res = [];
			return res;
		});
	};

	if (allResults.length === 0)
		return (
			<>
				<Toolbar
					onSearch={handleSearchInput}
					nCars={resultsForView.length}
					setModalOpen={setModalOpen}
					setModalContent={setModalContent}
					setModalTitle={setModalTitle}
					visitorMode={visitorMode}
				/>
				<Skeleton />
			</>
		);

	if (resultsForView.length === 0) {
		const reload = () => window.location.reload();

		return (
			<>
				<Toolbar
					onSearch={handleSearchInput}
					nCars={resultsForView.length}
					setModalOpen={setModalOpen}
					setModalContent={setModalContent}
					setModalTitle={setModalTitle}
					visitorMode={visitorMode}
				/>
				<div className="message-box">
					<span className="pf-400 result-msg">
						No matches were found
					</span>
					<button className="btn reload pf-300" onClick={reload}>
						Go back
					</button>
				</div>
			</>
		);
	}

	return (
		<>
			<Toolbar
				onSearch={handleSearchInput}
				nCars={resultsForView.length}
				setModalOpen={setModalOpen}
				setModalContent={setModalContent}
				setModalTitle={setModalTitle}
				visitorMode={visitorMode}
			/>

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
