import React from 'react';
import './CarList.css';
import Car from './Car';

export default function CarList(props) {
	return (
		<div className="car-list">
			{props.list.map((car, i) => (
				<Car
					key={i}
					car={car}
					openModal={props.openModal}
					showCar={props.showCar}
				/>
			))}
		</div>
	);
}
