import './Utils.css';
import { getResultsPerPage } from '../functions.js';

function SkeletonCard() {
	return (
		<div className="skeleton-card">
			<div className="skeleton"></div>
			<div className="skeleton-name"></div>
		</div>
	);
}

export default function Skeleton() {
	const arr = new Array(getResultsPerPage()).fill(0);
	return (
		<div className="skeletal-list">
			{arr.map((_, i) => (
				<SkeletonCard key={i} />
			))}
		</div>
	);
}
