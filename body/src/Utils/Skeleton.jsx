import './Utils.css';
import { getResultsPerPage } from '../functions.js';
import config from '../config.json';

function CarListSkeleton() {
	const arr = new Array(getResultsPerPage()).fill(0);

	return (
		<div className="car-list skeleton">
			{arr.map((_, i) => (
				<div className="card skeleton" key={i}>
					<div className="card-img-container skeleton"></div>
					<div className="card-name-container skeleton"></div>
				</div>
			))}
		</div>
	);
}

function LegendSkeleton() {
	const scs = config.segmentClasses;

	return (
		<div className="legend-items skeleton">
			{scs.map((_, i) => (
				<div className="legend-item skeleton" key={i}></div>
			))}
		</div>
	);
}

export default function Skeleton() {
	return (
		<>
			<LegendSkeleton />
			<CarListSkeleton />
		</>
	);
}
