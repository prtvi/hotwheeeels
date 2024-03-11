import React from 'react';
import './App.css';

import CarList from './CarList/CarList.jsx';
import Marquee from './Marquee.jsx';
import AddCarForm from './AddCar/AddCarForm.jsx';
import Modal from './Modal.jsx';
import Toolbar from './Toolbar/Toolbar.jsx';
import CarView from './CarList/CarView.jsx';

import Fuse from 'fuse.js';
import list from './data.json';

const fuse = new Fuse(list, {
	keys: ['carName'],
	includeScore: true,
});

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

	const setModalContentForAddCarForm = function () {
		setModalContent(() => <AddCarForm />);
		setModalTitle('Add a new car');
	};
	const setModalContentForCarView = function (car) {
		setModalContent(() => <CarView car={car} />);
		setModalTitle(car.carName);
	};

	// searchbox
	const [searchText, setSearchText] = React.useState('');
	const handleSearchInput = e => setSearchText(e.target.value);

	let results = fuse
		.search(searchText)
		.sort(sortDescending)
		.map(i => i.item);

	if (results.length === 0) results = list;

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
				list={results}
				openModal={handleModalOpen}
				showCar={setModalContentForCarView}
			/>

			<Marquee direction="right" />

			<Modal
				modalTitle={modalTitle}
				isOpen={isModalOpen}
				onClose={handleModalClose}
			>
				{modalContent}
			</Modal>
		</div>
	);
}
