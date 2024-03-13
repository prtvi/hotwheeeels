import React from 'react';
import './Car.css';

export default function Car(props) {
	const { car, openModal, showCar } = props;

	const showCarHandler = function (e) {
		showCar(car);
		openModal();
	};

	return (
		<div className="car-card" onClick={showCarHandler}>
			<div className="car-image-div">
				<img src={car.imgs[0]} alt="car" />
			</div>
			<div className="car-name-div">
				<span className="pif-200">{car.carName}</span>
			</div>
		</div>
	);
}
