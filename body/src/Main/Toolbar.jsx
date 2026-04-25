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

	// Sort UI disabled (search-only)

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
					</div>
				</div>
			</div>
		</div>
	);
}
