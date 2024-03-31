import React from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import config from './config.json';

import Modal from './Utils/Modal.jsx';
import Message from './Utils/Message.jsx';

import Toolbar from './Toolbar/Toolbar.jsx';
import Cars from './CarShowcase/Cars.jsx';
import AddCarForm from './Forms/AddCarForm.jsx';
import CarShowcase from './CarShowcase/CarShowcase.jsx';

export default function App() {
	// modal
	const [isModalOpen, setModalOpen] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('Add a new car');
	const [modalContent, setModalContent] = React.useState(<AddCarForm />);

	const handleModalClose = () => {
		setModalOpen(false);
		window.location.reload();
	};
	const handleModalOpen = () => setModalOpen(true);
	const setModalContentForMessage = function (msg) {
		setModalContent(() => <Message closeModal={handleModalClose} />);
		setModalTitle(msg);
	};
	const setModalContentForAddCarForm = function () {
		setModalContent(() => (
			<AddCarForm showMsg={setModalContentForMessage} />
		));
		setModalTitle('Add a new car');
	};
	const setModalContentForCarShowcase = function (car) {
		setModalContent(() => (
			<CarShowcase car={car} showMsg={setModalContentForMessage} />
		));
		setModalTitle(car.carName);
	};

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
		<div className="App">
			<h1 className="pf-600">🛞 Hot Wheeeels 🚗</h1>

			<Toolbar
				onSearch={handleSearchInput}
				openModal={handleModalOpen}
				initAddCarForm={setModalContentForAddCarForm}
			/>

			<Cars
				list={resultsForView}
				openModal={handleModalOpen}
				showCar={setModalContentForCarShowcase}
			/>

			<Modal
				modalTitle={modalTitle}
				isOpen={isModalOpen}
				closeModal={handleModalClose}
			>
				{modalContent}
			</Modal>
		</div>
	);
}
