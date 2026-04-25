import { getSessionItem } from '../functions.js';

function SwipeCar(props) {
	const { nItems, showCar } = props;

	const left = function () {
		const currCarIdx = getSessionItem('carIdx', Number);

		let idx = 0;
		if (currCarIdx - 1 <= 0) idx = 0;
		else idx = currCarIdx - 1;

		showCar(idx);
	};

	const right = function () {
		const currCarIdx = getSessionItem('carIdx', Number);

		let idx = 0;
		if (currCarIdx + 1 >= nItems) idx = nItems - 1;
		else idx = currCarIdx + 1;

		showCar(idx);
	};

	const currCarIdx = getSessionItem('carIdx', Number);
	const atStart = currCarIdx <= 0;
	const atEnd = currCarIdx >= nItems - 1;

	return (
		<div className="swipe-car" role="group" aria-label="Previous or next car">
			<button
				type="button"
				className={'mnav-btn' + (atStart ? ' mnav-btn--disabled' : '')}
				onClick={left}
				disabled={atStart}
			>
				◀ PREV
			</button>
			<button
				type="button"
				className={'mnav-btn' + (atEnd ? ' mnav-btn--disabled' : '')}
				onClick={right}
				disabled={atEnd}
			>
				NEXT ▶
			</button>
		</div>
	);
}
SwipeCar.displayName = 'SwipeCar';
export default SwipeCar;
