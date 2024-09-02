import './CarShowcase.css';

function Car(props) {
	const { index, car, showCar } = props;
	const showCarHandler = () => showCar(index);

	let colorClass = '';
	if (car.isSpecial) colorClass = 'special';

	return (
		<div className="card" onClick={showCarHandler}>
			<div className="card-img-container">
				<img src={car.imgs[0]} alt="car" />
			</div>
			<div className="card-name-container">
				<span className={'pif-300 ' + colorClass}>{car.carName}</span>
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
