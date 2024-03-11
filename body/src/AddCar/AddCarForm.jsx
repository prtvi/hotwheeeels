import React from 'react';
import './AddCarForm.css';

export default function AddCarForm() {
	const [isGift, setIfGift] = React.useState(false);

	const checkIfGift = function (e) {
		if (e.target.checked) setIfGift(true);
		else setIfGift(false);
	};

	return (
		<div className="add-new-car-form">
			<form action="" method="post">
				<div className="form-content">
					<div className="ii-small-container">
						<div className="input-item ii-small pf-300">
							<label htmlFor="car-name">Car name:</label>
							<input
								type="text"
								name="car-name"
								id="car-name"
								placeholder="(as per the card)"
								required
							/>
						</div>

						<div className="input-item ii-small pf-300">
							<label htmlFor="brand">Brand:</label>
							<input
								type="text"
								name="brand"
								id="brand"
								placeholder="hotwheels, matchbox etc"
								required
							/>
						</div>
					</div>

					<div className="ii-small-container">
						<div className="input-item ii-small pf-300">
							<label htmlFor="price">Price:</label>
							<input
								type="number"
								name="price"
								id="price"
								required
								placeholder="₹"
							/>
						</div>

						<div className="input-item ii-small pf-300">
							<label htmlFor="purchase-date">
								Purchase date:
							</label>
							<input
								type="date"
								name="purchase-date"
								id="purchase-date"
							/>
						</div>
					</div>

					<div className="ii-small-container">
						<div className="input-item ii-small pf-300">
							<label htmlFor="purchased-from">
								Purchased from:
							</label>
							<input
								type="text"
								name="purchased-from"
								id="purchased-from"
								placeholder="store name"
							/>
						</div>

						<div className="input-item ii-small pf-300">
							<label htmlFor="order-number">Order number:</label>
							<input
								type="text"
								name="order-number"
								id="order-number"
								placeholder="(if any)"
							/>
						</div>
					</div>

					<div className="ii-small-container">
						<div className="input-item ii-small pf-300">
							<label htmlFor="is-gift">Is a gift:</label>
							<input
								type="checkbox"
								name="is-gift"
								id="is-gift"
								onChange={checkIfGift}
							/>
						</div>

						<div className="input-item ii-small pf-300">
							<label htmlFor="card-available">
								Card available:
							</label>
							<input
								type="checkbox"
								name="card-available"
								id="card-available"
							/>
						</div>
					</div>

					{isGift ? (
						<div className="input-item ii-small pf-300">
							<label htmlFor="gift-from">Gift from:</label>
							<input
								type="text"
								name="gift-from"
								id="gift-from"
								placeholder="name"
							/>
						</div>
					) : (
						<></>
					)}

					<div className="input-item ii-large pf-300">
						<label htmlFor="image">Upload an image:</label>
						<input
							type="file"
							name="image"
							id="image"
							accept="image/*"
							required
						/>
					</div>

					<div className="input-item ii-large pf-300">
						<label htmlFor="notes">Attach notes:</label>
						<textarea
							name="notes"
							id="notes"
							cols="20"
							rows="3"
						></textarea>
					</div>

					<div className="input-item ii-large button-box">
						<button className="btn" type="submit">
							Save
						</button>
						<button className="btn" type="reset">
							Clear all
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
