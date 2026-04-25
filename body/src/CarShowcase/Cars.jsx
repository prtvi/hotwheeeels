import './CarShowcase.css';
import { getConfigValue } from '../functions.js';

function Car(props) {
	const { index, car, showCar } = props;
	const segments = getConfigValue('segments', {});
	const showCarHandler = () => showCar(index);

	const firstKey = car.segment[0];
	const topColor = segments[firstKey]?.color
		? String(segments[firstKey].color)
		: 'var(--ds-palette-dim-2)';

	return (
		<button
			type="button"
			className="garage-card"
			onClick={showCarHandler}
			style={{
				animationDelay: `${Math.min(index, 24) * 0.025}s`,
			}}
		>
			<div
				className="garage-card__top"
				style={{ background: topColor }}
			/>
			<div className="garage-card__img">
				<img src={car.imgs[0]} alt="" />
				<div className="garage-card__hud" aria-hidden>
					<div className="hud-corn hud-tl" />
					<div className="hud-corn hud-tr" />
					<div className="hud-corn hud-bl" />
					<div className="hud-corn hud-br" />
					<span className="hud-label">1:64</span>
				</div>
			</div>
			<div className="garage-card__body">
				<div className="garage-card__name">{car.carName}</div>
				<div className="garage-card__meta">
					<span className="garage-card__series" title={car.series}>
						{car.series && String(car.series).trim() !== ''
							? car.series
							: '—'}
					</span>
					<span className="garage-card__year">
						{car.year != null && String(car.year).trim() !== ''
							? car.year
							: '—'}
					</span>
				</div>
			</div>
		</button>
	);
}

export default function Cars(props) {
	const { list, showCar } = props;

	return (
		<div className="garage-cards-grid" role="list" aria-label="Collection">
			{list.map((car, i) => (
				<Car key={i} car={car} index={i} showCar={showCar} />
			))}
		</div>
	);
}
