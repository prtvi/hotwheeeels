import React from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import config from './config.json';

import Modal from './Utils/Modal.jsx';
import Toolbar from './Toolbar/Toolbar.jsx';
import Cars from './CarShowcase/Cars.jsx';

export default function Main(props) {
	// modal
	const [isModalOpen, setModalOpen] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('Add a new car');
	const [modalContent, setModalContent] = React.useState(<></>);

	// all results from api call && results to show on UI
	const [allResults, setAllResults] = React.useState([]);
	const [resultsForView, setResultsForView] = React.useState([]);

	React.useEffect(() => {
		async function fetchData() {
			const res = await axios.get(`${config.engineURL}/api/get_all`);

			if (res.status === 200) {
				setAllResults(() => res.data);
				setResultsForView(() => res.data);
			}
		}

		fetchData();
	}, []);

	const fuse = new Fuse(allResults, {
		keys: ['carName', 'brand', 'carType'],
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
			if (res.length === 0) res = allResults;
			return res;
		});
	};

	return (
		<>
			<Toolbar
				onSearch={handleSearchInput}
				nCars={resultsForView.length}
				setModalOpen={setModalOpen}
				setModalContent={setModalContent}
				setModalTitle={setModalTitle}
			/>

			<Cars
				list={resultsForView}
				setModalOpen={setModalOpen}
				setModalContent={setModalContent}
				setModalTitle={setModalTitle}
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
