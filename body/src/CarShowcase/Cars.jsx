import './CarShowcase.css';
import config from '../config.json';

function Car(props) {
	const { index, car, showCar } = props;
	const scColorRef = config.segmentClassColorRef;
	const showCarHandler = () => showCar(index);

	return (
		<div className="card" onClick={showCarHandler}>
			<div className="card-img-container">
				<img src={car.imgs[0]} alt="car" />
				<div
					className="segment"
					style={{ backgroundColor: scColorRef[car.segmentClass] }}
					title={car.segmentClass}
				></div>
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
