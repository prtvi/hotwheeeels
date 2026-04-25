import AddCarForm from '../Forms/AddCarForm.jsx';
import './Main.css';

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

	const nCarsText = nCars === 1 ? `car` : `cars`;

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
		document.querySelector('.trow2')?.classList.toggle('hidden');
		e.currentTarget.classList.toggle('active');
	}

	function toggleSortBtn(sortOrder) {
		if (sortOrder.dataset.sort === 'asc') {
			sortOrder.dataset.sort = 'desc';
			sortOrder.innerHTML = '&#11014;';
		} else {
			sortOrder.dataset.sort = 'asc';
			sortOrder.innerHTML = '&#11015;';
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
		<div className="garage-toolbar">
			<div className="garage-topbar">
				<div className="garage-topbar-left">
					<div className="page-label">{'// GARAGE'}</div>
					<h2 className="garage-title">COLLECTION</h2>
					<p className="garage-sub">
						Showing <b>{nCars}</b> {nCarsText}
					</p>
				</div>
				<div className="garage-topbar-right">
					<div className="search-box">
						<span className="search-icon" aria-hidden="true">
							⌕
						</span>
						<input
							className="garage-search-input pf-300"
							type="text"
							name="search"
							value={searchInput}
							placeholder="SEARCH COLLECTION..."
							onChange={onSearchHandler}
						/>
						<span
							className="pf-300 input-cross hidden"
							onClick={clearInput}
							role="button"
							tabIndex={0}
							onKeyDown={e => {
								if (e.key === 'Enter' || e.key === ' ') clearInput();
							}}
						>
							&#10006;
						</span>
					</div>
					<div className="garage-topbar-actions">
						{!visitorMode ? (
							<button
								type="button"
								className="ds-btn ds-btn--sm garage-add-btn"
								onClick={setModalContentForForm}
							>
								+ 🚘
							</button>
						) : null}
						<button
							type="button"
							className="garage-chevron toggle-options"
							onClick={toggleOptions}
							aria-label="Show sort and filter options"
						>
							<span className="pf-300" aria-hidden="true">
								&#10094;
							</span>
						</button>
					</div>
				</div>
			</div>

			<div className="trow trow2 hidden garage-sort-row">
				{!visitorMode ? (
					<div className="trow-child keep-left">
						<span className="pf-200">{nCarsText}</span>
					</div>
				) : null}

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

				<div
					className="trow-child sort-order"
					onClick={handleSort}
					role="presentation"
				>
					<span className="pf-300" data-sort="asc">
						&#11015;
					</span>
				</div>
			</div>
		</div>
	);
}
