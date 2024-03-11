import React from 'react';
import './CarView.css';

export default function CarView(props) {
	const car = props.car;

	return (
		<div className="car-view">
			<div className="image">
				<img src={car.imgSrc} alt="hot wheels car" />
			</div>

			<div className="details">
				<div className="row">
					<div>
						<span className="label pf-300">Name</span>
						<span className="value pf-400">{car.carName}</span>
					</div>
					<div>
						<span className="label pf-300">Brand</span>
						<span className="value pf-400">{car.brand}</span>
					</div>
				</div>

				<div className="row">
					<div>
						<span className="label pf-300">Price</span>
						<span className="value pf-400">₹{car.price}</span>
					</div>
					<div>
						<span className="label pf-300">Purchase date</span>
						<span className="value pf-400">{car.purchaseDate}</span>
					</div>
				</div>

				<div className="row">
					<div>
						<span className="label pf-300">Purchased from</span>
						<span className="value pf-400">
							{car.purchasedFrom}
						</span>
					</div>
					<div>
						<span className="label pf-300">Order number</span>
						<span className="value pf-400">{car.orderNumber}</span>
					</div>
				</div>

				<div className="row">
					<div>
						<span className="label pf-300">Card available</span>
						<span className="value pf-400">
							{car.cardAvailable ? 'Yes' : 'No'}
						</span>
					</div>

					<div>
						<span className="label pf-300">Gift</span>
						<span className="value pf-400">
							{car.isGift ? 'Yes' : 'No'}
						</span>
					</div>

					{car.isGift ? (
						<div>
							<span className="label pf-300">Gifted by</span>
							<span className="value pf-400">{car.giftFrom}</span>
						</div>
					) : (
						<></>
					)}
				</div>

				<div className="row">
					<div className="single-item">
						<span className="label pf-300">Notes</span>
						<span className="value pf-400">{car.notes}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
