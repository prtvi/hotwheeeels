import './CarShowcase.css';
import config from '../config.json';
import { getCssDimension } from '../functions.js';

function Car(props) {
	const { index, car, showCar } = props;
	const scColorRef = config.segmentClassColorRef;
	const showCarHandler = () => showCar(index);

	const imageHeight =
		getCssDimension('--card-height') -
		getCssDimension('--card-name-cont-h');
	const segmentHeight = imageHeight / car.segmentClass.length;

	return (
		<div className="card" onClick={showCarHandler}>
			<div className="card-img-container">
				<img src={car.imgs[0]} alt="car" />

				<div className="segments">
					{car.segmentClass.map((sc, i) => (
						<div
							key={i}
							className="segment"
							title={sc}
							style={{
								backgroundColor: scColorRef[sc],
								height: `${segmentHeight}px`,
								top: `${i * segmentHeight}px`,
							}}
						></div>
					))}
				</div>
			</div>

			<div className="card-name-container">
				<span className="pif-300">{car.carName}</span>
			</div>
		</div>
	);
}

export default function Cars(props) {
	const { list, showCar } = props;

	return (
		<div className="car-list">
			{list.map((car, i) => (
				<Car key={i} car={car} index={i} showCar={showCar} />
			))}
		</div>
	);
}
