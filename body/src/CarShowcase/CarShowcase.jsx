import React from 'react';
import './CarShowcase.css';
import Carousel from './Carousel.jsx';
import EditCarDetails from '../Forms/EditCarDetails.jsx';
import UpdateCarForm from '../Forms/UpdateCarForm.jsx';
import config from '../config.json';

import { getRowItemsForShowcase, getShowcaseDom } from '../functions.js';

export default function CarShowcase(props) {
	const { car, setModalContent, setModalTitle, setModalOpen, visitorMode } =
		props;
	const rowsForView = getRowItemsForShowcase(config.formItems, car);

	const [mode, setMode] = React.useState('');

	return (
		<div className="car-showcase">
			<Carousel images={car.imgs} carId={car.carId} />

			{!visitorMode ? (
				<EditCarDetails
					carId={car.carId}
					setModalContent={setModalContent}
					setModalTitle={setModalTitle}
					setModalOpen={setModalOpen}
					mode={mode}
					setMode={setMode}
				/>
			) : (
				<></>
			)}

			<div className="details">
				{mode === 'edit' ? (
					<UpdateCarForm car={car} />
				) : (
					getShowcaseDom(rowsForView, car)
				)}
			</div>
		</div>
	);
}
