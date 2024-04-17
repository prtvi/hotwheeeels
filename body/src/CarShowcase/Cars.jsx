import React from 'react';
import './CarShowcase.css';
import CarShowcase from './CarShowcase';

function Car(props) {
	const { car, setModalOpen, setModalContent, setModalTitle, visitorMode } =
		props;

	const showCarHandler = function (e) {
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
	};

	return (
		<div className="card" onClick={showCarHandler}>
			<div className="card-img-container">
				<img src={car.imgs[0]} alt="car" />
			</div>
			<div className="card-name-container">
				<span className="pif-200">{car.carName}</span>
			</div>
		</div>
	);
}

export default function Cars(props) {
	const { list, setModalOpen, setModalContent, setModalTitle, visitorMode } =
		props;

	return (
		<div className="car-list">
			{list.map((car, i) => (
				<Car
					key={i}
					car={car}
					setModalOpen={setModalOpen}
					setModalContent={setModalContent}
					setModalTitle={setModalTitle}
					visitorMode={visitorMode}
				/>
			))}
		</div>
	);
}
