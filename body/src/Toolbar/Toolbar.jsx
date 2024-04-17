import React from 'react';
import './Toolbar.css';
import AddCarForm from '../Forms/AddCarForm.jsx';

export default function Toolbar(props) {
	const {
		onSearch,
		setModalOpen,
		setModalContent,
		setModalTitle,
		nCars,
		visitorMode,
	} = props;

	const nCarsText = nCars === 1 ? `${nCars} car` : `${nCars} cars`;

	const setModalContentForForm = function () {
		setModalContent(() => (
			<AddCarForm
				setModalContent={setModalContent}
				setModalTitle={setModalTitle}
				setModalOpen={setModalOpen}
			/>
		));
		setModalTitle('Add a new car');
		setModalOpen(true);
	};

	const reload = () => window.location.reload();

	return (
		<div className="toolbar">
			<div className="row1">
				<div className="row1-child">
					<input
						className="pf-300"
						type="text"
						name="search"
						placeholder="🔍  Search for cars"
						onChange={onSearch}
					/>
				</div>

				{!visitorMode ? (
					<div className="row1-child">
						<button
							className="btn pf-300"
							onClick={setModalContentForForm}
						>
							+ 🚘
						</button>
					</div>
				) : (
					<div className="row1-child ncars">
						<span className="pf-200">{nCarsText}</span>
					</div>
				)}
			</div>

			{!visitorMode ? (
				<div className="row2">
					<div className="row2-child">
						<button
							className="btn"
							title="refresh data"
							onClick={reload}
						>
							🔄
						</button>
					</div>

					<div className="row2-child">
						<span className="pf-200">{nCarsText}</span>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
