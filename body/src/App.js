import React from 'react';
import axios from 'axios';
import './App.css';

import config from './config.json';

import Fuse from 'fuse.js';
import Marquee from './Utils/Marquee.jsx';
import Modal from './Utils/Modal.jsx';
import Message from './Utils/Message.jsx';

import AddCarForm from './AddCar/AddCarForm.jsx';
import CarList from './CarList/CarList.jsx';
import CarView from './CarView/CarView.jsx';
import Toolbar from './Toolbar/Toolbar.jsx';

const sortDescending = (a, b) => {
	if (a.score > b.score) return 1;
	if (a.score < b.score) return -1;
	return 0;
};

export default function App() {
	// modal
	const [isModalOpen, setModalOpen] = React.useState(false);
	const handleModalClose = () => setModalOpen(false);
	const handleModalOpen = () => setModalOpen(true);

	// modal content
	const [modalContent, setModalContent] = React.useState(<AddCarForm />);
	const [modalTitle, setModalTitle] = React.useState('Add a new car');

	// all results from api call
	const [allResults, setAllResults] = React.useState([]);
	// results to show on UI
	const [resultsForView, setResultsForView] = React.useState([]);

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
	const setModalContentForCarView = function (car) {
		setModalContent(() => <CarView car={car} />);
		setModalTitle(`#${car.carNum} ${car.carName}`);
	};

	React.useEffect(() => {
		async function fetchData() {
			const res = await axios.get(`${config.engineURL}/get_all`);
			// console.log(res);

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

			<Marquee direction="left" />

			<Toolbar
				onSearch={handleSearchInput}
				openModal={handleModalOpen}
				initAddCarForm={setModalContentForAddCarForm}
			/>

			<CarList
				list={resultsForView}
				openModal={handleModalOpen}
				showCar={setModalContentForCarView}
			/>

			<Marquee direction="right" />

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
