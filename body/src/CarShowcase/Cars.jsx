import React from 'react';
import './CarShowcase.css';

function Car(props) {
	const { car, openModal, showCar } = props;

	const showCarHandler = function (e) {
		showCar(car);
		openModal();
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
	const { list, openModal, showCar } = props;

	return (
		<div className="car-list">
			{list.map((car, i) => (
				<Car
					key={i}
					car={car}
					openModal={openModal}
					showCar={showCar}
				/>
			))}
		</div>
	);
}
