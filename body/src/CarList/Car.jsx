import React from 'react';
import './Car.css';

// card on the home page
export default function Car(props) {
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
