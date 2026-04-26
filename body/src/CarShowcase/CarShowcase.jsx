import React from 'react';
import './CarShowcase.css';
import './CarShowcaseModal.css';
import Carousel from './Carousel.jsx';
import EditCarDetails from '../Forms/EditCarDetails.jsx';
import UpdateCarForm from '../Forms/UpdateCarForm.jsx';

import {
	getRowItemsForShowcase,
	getShowcaseDom,
	getSessionItem,
	getConfigValue,
} from '../functions.js';

function segmentTypeLabel(segment) {
	if (!Array.isArray(segment) || !segment.length) return 'COLLECTION';
	const segs = getConfigValue('segments', {});
	const labels = segment.map(s => segs[s]?.label).filter(Boolean);
	return labels.length ? labels.join(' · ').toUpperCase() : 'COLLECTION';
}

function firstTagLabel(segment) {
	if (!Array.isArray(segment) || !segment.length) return '1:64';
	const k = segment[0];
	return (
		getConfigValue('segments', {})[k]?.label ||
		k ||
		'1:64'
	).toUpperCase();
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
	const rowsForView = getRowItemsForShowcase(
		getConfigValue('formItems', []),
		car,
	);

	const [mode, setMode] = React.useState('');
	const [shareCopied, setShareCopied] = React.useState(false);
	const [isMobile, setIsMobile] = React.useState(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia?.('(max-width: 768px)')?.matches ?? false;
	});

	React.useEffect(() => {
		if (typeof window === 'undefined' || !window.matchMedia) return;
		const mq = window.matchMedia('(max-width: 768px)');
		const onChange = e => setIsMobile(Boolean(e.matches));
		if (mq.addEventListener) mq.addEventListener('change', onChange);
		else mq.addListener(onChange);
		return () => {
			if (mq.removeEventListener)
				mq.removeEventListener('change', onChange);
			else mq.removeListener(onChange);
		};
	}, []);

	const showNav = isHeadSwipe(headSlot);
	const slotText = (() => {
		const idx = getSessionItem('carIdx', Number);
		if (typeof idx !== 'number' || Number.isNaN(idx)) return null;
		return `#${String(idx + 1).padStart(3, '0')}`;
	})();

	const copyCarShareLink = React.useCallback(async () => {
		const url = `${getConfigValue('bodyURL', window.location.origin)}/?car_id=${car.carId}&src=shareicon`;
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
				<div className="cs-modal__topbar" aria-label="Modal actions">
					<div className="cs-modal__topbar-left" aria-hidden="true" />
					<div className="cs-modal__topbar-right">
						<button
							type="button"
							className="cs-share"
							aria-label={
								shareCopied ? 'Link copied' : 'Copy share link'
							}
							title={shareCopied ? 'Copied' : 'Copy share link'}
							onClick={copyCarShareLink}
						>
							{shareCopied ? '✓' : '↗'}
						</button>
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
					</div>
				</div>
				<div className="cs-modal__image">
					<Carousel images={car.imgs} carId={car.carId} />
					{slotText ? (
						<div className="cs-slot">{slotText}</div>
					) : null}
					<div
						className="cs-seg-tag"
						title={firstTagLabel(car.segment)}
					>
						{firstTagLabel(car.segment)}
					</div>
				</div>

				<div className="cs-modal__info">
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

					<p className="cs-type-label">
						{segmentTypeLabel(car.segment)}
					</p>
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

					{/* Desktop/tablet: keep nav in the info column (original layout) */}
					{showNav && mode !== 'edit' && !isMobile ? (
						<div className="cs-nav" aria-label="Car navigation">
							<div className="cs-nav__bar">{headSlot}</div>
						</div>
					) : null}
				</div>

				{showNav && mode !== 'edit' && isMobile ? (
					<div className="cs-nav" aria-label="Car navigation">
						<div className="cs-nav__bar">{headSlot}</div>
					</div>
				) : null}
			</div>
		</div>
	);
}

CarShowcase.displayName = 'CarShowcase';
export default CarShowcase;
