import React from 'react';
import './CarShowcase.css';
import './CarShowcaseModal.css';
import Carousel from './Carousel.jsx';
import EditCarDetails from '../Forms/EditCarDetails.jsx';
import UpdateCarForm from '../Forms/UpdateCarForm.jsx';
import config from '../config.json';

import {
	getRowItemsForShowcase,
	getShowcaseDom,
	getSessionItem,
} from '../functions.js';

function segmentTypeLabel(segmentClass) {
	if (!Array.isArray(segmentClass) || !segmentClass.length) return 'COLLECTION';
	const segs = config.segmentClasses;
	const labels = segmentClass
		.map(s => segs[s]?.label)
		.filter(Boolean);
	return labels.length
		? labels.join(' · ').toUpperCase()
		: 'COLLECTION';
}

function firstTagLabel(segmentClass) {
	if (!Array.isArray(segmentClass) || !segmentClass.length) return '1:64';
	const k = segmentClass[0];
	return (config.segmentClasses[k]?.label || k || '1:64').toUpperCase();
}

function isHeadSwipe(el) {
	if (!React.isValidElement(el) || !el.type) return false;
	const t = el.type;
	return t.displayName === 'SwipeCar' || t.name === 'SwipeCar';
}

function CarShowcase(props) {
	const {
		car,
		setModalContent,
		setModalTitle,
		setModalOpen,
		visitorMode,
		onClose,
		headSlot,
	} = props;
	const rowsForView = getRowItemsForShowcase(config.formItems, car);

	const [mode, setMode] = React.useState('');
	const [shareCopied, setShareCopied] = React.useState(false);

	const showNav = isHeadSwipe(headSlot);
	const slotText = (() => {
		const idx = getSessionItem('carIdx', Number);
		if (typeof idx !== 'number' || Number.isNaN(idx)) return null;
		return `#${String(idx + 1).padStart(3, '0')}`;
	})();

	const copyCarShareLink = React.useCallback(async () => {
		const url = `${config.bodyURL}/?car_id=${car.carId}&src=shareicon`;
		try {
			await navigator.clipboard.writeText(url);
			setShareCopied(true);
			window.setTimeout(() => setShareCopied(false), 1800);
		} catch {
			// Clipboard may be blocked; fall back to prompt
			window.prompt('Copy link', url);
		}
	}, [car.carId]);

	return (
		<div className="cs-modal car-showcase">
			<div className="cs-modal__box">
				<div className="cs-modal__image">
					<Carousel images={car.imgs} carId={car.carId} />
					{slotText ? (
						<div className="cs-slot">{slotText}</div>
					) : null}
					<div
						className="cs-seg-tag"
						title={firstTagLabel(car.segmentClass)}
					>
						{firstTagLabel(car.segmentClass)}
					</div>
				</div>

				<div className="cs-modal__info">
					{typeof onClose === 'function' ? (
						<button
							type="button"
							className="cs-close"
							aria-label="Close"
							onClick={onClose}
						>
							×
						</button>
					) : null}
					<button
						type="button"
						className="cs-share"
						aria-label={shareCopied ? 'Link copied' : 'Copy share link'}
						title={shareCopied ? 'Copied' : 'Copy share link'}
						onClick={copyCarShareLink}
					>
						{shareCopied ? '✓' : '↗'}
					</button>

					{!visitorMode ? (
						<EditCarDetails
							carId={car.carId}
							setModalContent={setModalContent}
							setModalTitle={setModalTitle}
							setModalOpen={setModalOpen}
							mode={mode}
							setMode={setMode}
						/>
					) : null}

					<p className="cs-type-label">{segmentTypeLabel(car.segmentClass)}</p>
					<h2 className="cs-title">{car.carName}</h2>
					{car.brand ? (
						<p className="cs-brand">
							{String(car.brand).toUpperCase()}
						</p>
					) : null}

					<div className="cs-divider" />

					{mode === 'edit' ? (
						<UpdateCarForm car={car} />
					) : (
						<div className="cs-modal-fields car-showcase-details">
							{getShowcaseDom(rowsForView, car)}
						</div>
					)}

					{showNav && mode !== 'edit' ? (
						<div className="cs-nav">{headSlot}</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
CarShowcase.displayName = 'CarShowcase';
export default CarShowcase;
