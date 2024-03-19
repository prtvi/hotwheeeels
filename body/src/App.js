import React from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import config from './config.json';

// import Marquee from './Utils/Marquee.jsx';
import Modal from './Utils/Modal.jsx';
import Message from './Utils/Message.jsx';

import AddCarForm from './Forms/AddCarForm.jsx';
import CarList from './CarList/CarList.jsx';
import CarShowcase from './CarShowcase/CarShowcase.jsx';
import Toolbar from './Toolbar/Toolbar.jsx';

const sortDescending = (a, b) => {
	if (a.score > b.score) return 1;
	if (a.score < b.score) return -1;
	return 0;
};

export default function App() {
	const maxModalHeight = 700;
	const minModalHeight = 200;

	// modal
	const [isModalOpen, setModalOpen] = React.useState(false);
	const handleModalClose = () => {
		setModalOpen(false);
		window.location.href = window.location.href;
	};
	const handleModalOpen = () => setModalOpen(true);

	// modal content
	const [modalContent, setModalContent] = React.useState(<AddCarForm />);
	const [modalTitle, setModalTitle] = React.useState('Add a new car');
	const [modalHeight, setModalHeight] = React.useState(maxModalHeight);

	// all results from api call
	const [allResults, setAllResults] = React.useState([]);
	// results to show on UI
	const [resultsForView, setResultsForView] = React.useState([]);

	const setModalContentForMessage = function (msg) {
		setModalContent(() => <Message closeModal={handleModalClose} />);
		setModalTitle(msg);
		setModalHeight(minModalHeight);
	};
	const setModalContentForAddCarForm = function () {
		setModalContent(() => (
			<AddCarForm showMsg={setModalContentForMessage} />
		));
		setModalTitle('Add a new car');
		setModalHeight(maxModalHeight);
	};
	const setModalContentForCarShowcase = function (car) {
		setModalContent(() => (
			<CarShowcase car={car} showMsg={setModalContentForMessage} />
		));
		setModalTitle(car.carName);
		setModalHeight(maxModalHeight);
	};

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
		keys: ['carName'],
		includeScore: true,
	});

	// searchbox
	const handleSearchInput = e => {
		setResultsForView(() => {
			let res = fuse
				.search(e.target.value)
				.sort(sortDescending)
				.map(i => i.item);

			if (res.length === 0) res = allResults;

			return res;
		});
	};

	return (
		<div className="App">
			<h1 className="pf-600">🛞 Hot Wheeeeeeeels 🚗</h1>

			{/* <Marquee direction="left" /> */}

			<Toolbar
				onSearch={handleSearchInput}
				openModal={handleModalOpen}
				initAddCarForm={setModalContentForAddCarForm}
			/>

			<CarList
				list={resultsForView}
				openModal={handleModalOpen}
				showCar={setModalContentForCarShowcase}
			/>

			{/* <Marquee direction="right" /> */}

			<Modal
				modalTitle={modalTitle}
				height={modalHeight}
				isOpen={isModalOpen}
				closeModal={handleModalClose}
			>
				{modalContent}
			</Modal>
		</div>
	);
}
