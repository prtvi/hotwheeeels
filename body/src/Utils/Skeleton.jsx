import './Utils.css';
import config from '../config.json';

function SkeletonCard() {
	return (
		<div className="skeleton-card">
			<div className="skeleton"></div>
			<div className="skeleton-name"></div>
		</div>
	);
}

export default function Skeleton() {
	const arr = new Array(config.resultsPerPage).fill(0);
	return (
		<div className="skeletal-list">
			{arr.map((_, i) => (
				<SkeletonCard key={i} />
			))}
		</div>
	);
}
