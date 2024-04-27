import React from 'react';
import './Main.css';
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
	const [searchInput, setSearchInput] = React.useState('');

	const onSearchHandler = function (e) {
		const ele = document.querySelector('.input-cross');

		if (e.currentTarget.value.length > 0) ele.classList.remove('hidden');
		else ele.classList.add('hidden');

		setSearchInput(e.currentTarget.value);
		onSearch(e);
	};

	const clearInput = () => setSearchInput('');

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
				<div className="row1-child input-child">
					<input
						className="pf-300"
						type="text"
						name="search"
						value={searchInput}
						placeholder="🔍  Search cars"
						onChange={onSearchHandler}
					/>
					<span
						className="pf-300 input-cross hidden"
						onClick={clearInput}
					>
						x
					</span>
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
