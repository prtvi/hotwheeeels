import React from 'react';
import './Car.css';

export default function Car(props) {
	const { car, openModal, showCar } = props;

	const showCarHandler = function (e) {
		showCar(car);
		openModal();
	};

	return (
		<div className="car" onClick={showCarHandler}>
			<img src={car.imgSrc} alt="car" />
			<span className="car-name pf-200">{car.carName}</span>
		</div>
	);
}
