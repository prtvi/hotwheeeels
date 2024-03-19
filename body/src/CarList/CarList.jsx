import React from 'react';
import './CarList.css';
import Car from './Car.jsx';

export default function CarList(props) {
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
