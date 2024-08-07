import './Main.css';
import AddCarForm from '../Forms/AddCarForm.jsx';

export default function Toolbar(props) {
	const {
		searchInput,
		setSearchInput,
		onSearch,
		clearInput,
		setModalOpen,
		setModalContent,
		setModalTitle,
		nCars,
		visitorMode,
		setSortParams,
	} = props;

	const nCarsText = nCars === 1 ? `${nCars} car` : `${nCars} cars`;

	const onSearchHandler = function (e) {
		const ele = document.querySelector('.input-cross');

		if (e.currentTarget.value.length > 0) ele.classList.remove('hidden');
		else ele.classList.add('hidden');

		setSearchInput(e.currentTarget.value);
		onSearch(e);
	};

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

	function toggleOptions(e) {
		document.querySelector('.trow2').classList.toggle('hidden');
		e.currentTarget.classList.toggle('active');

		if (!visitorMode)
			document.querySelector('.trow.pseudo').classList.toggle('hidden');
	}

	function toggleSortBtn(sortOrder) {
		if (sortOrder.dataset.sort === 'asc') {
			sortOrder.dataset.sort = 'desc';
			sortOrder.textContent = '⬆';
		} else {
			sortOrder.dataset.sort = 'asc';
			sortOrder.textContent = '⬇';
		}
	}

	function handleSort(e) {
		const sortBy = document.querySelector('#sortBy');
		const sortOrder = document.querySelector('.sort-order span');

		if (e.currentTarget !== sortBy) toggleSortBtn(sortOrder);

		setSortParams({
			sortBy: sortBy.value,
			sortOrder: sortOrder.dataset.sort,
		});
	}

	return (
		<div className="toolbar">
			<div className="trow trow1">
				<div className="trow-child input-child">
					<input
						className="pf-300"
						type="text"
						name="search"
						value={searchInput}
						placeholder="🔍  Search"
						onChange={onSearchHandler}
					/>
					<span
						className="pf-300 input-cross hidden"
						onClick={clearInput}
					>
						✖️
					</span>
				</div>

				{visitorMode ? (
					<>
						<div className="trow-child">
							<span className="pf-200">{nCarsText}</span>
						</div>
						<div
							className="trow-child toggle-options"
							onClick={toggleOptions}
						>
							<span>&#10094;</span>
						</div>
					</>
				) : (
					<>
						<div className="trow-child">
							<button
								className="btn pf-300"
								onClick={setModalContentForForm}
							>
								+ 🚘
							</button>
						</div>
						<div
							className="trow-child toggle-options"
							onClick={toggleOptions}
						>
							<span>&#10094;</span>
						</div>
					</>
				)}
			</div>

			{/* show pseudo trow in auth mode, hide this when options are toggled and show ncars text in trow2 */}
			{visitorMode ? (
				<></>
			) : (
				<div className="trow pseudo">
					<div className="trow-child">
						<span className="pf-200">{nCarsText}</span>
					</div>
				</div>
			)}

			<div className="trow trow2 hidden">
				{visitorMode ? (
					<></>
				) : (
					<div className="trow-child keep-left">
						<span className="pf-200">{nCarsText}</span>
					</div>
				)}

				<div className="trow-child">
					<label htmlFor="sortBy" className="pf-200 sort-by-label">
						Sort by
					</label>
				</div>

				<div className="trow-child">
					<select
						id="sortBy"
						defaultValue="acquiredDate"
						onChange={handleSort}
					>
						<option value="acquiredDate">Acquired date</option>
						<option value="carName">Car name</option>
					</select>
				</div>

				<div className="trow-child sort-order" onClick={handleSort}>
					<span className="pf-300" data-sort="asc">
						{'⬇'}
					</span>
				</div>
			</div>
		</div>
	);
}
