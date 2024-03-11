import React from 'react';
import './Car.css';

export default function Car(props) {
	const car = props.car;

	const showCar = function (e) {
		props.showCar(car);
		props.openModal();
	};

	return (
		<div className="car" onClick={showCar}>
			<img src={car.imgSrc} alt="hot wheels car" />
			<span className="car-name pf-200">{car.carName}</span>
		</div>
	);
}
