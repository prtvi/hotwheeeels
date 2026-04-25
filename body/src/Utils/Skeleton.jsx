import './Utils.css';
import { getResultsPerPage } from '../functions.js';

function FilterPillsSkeleton() {
	return (
		<div
			className="garage-skeleton-filters"
			aria-hidden
		>
			{[1, 2, 3, 4, 5, 6].map(i => (
				<div key={i} className="pill" />
			))}
		</div>
	);
}

function CarGridSkeleton() {
	const n = getResultsPerPage();
	const arr = new Array(n).fill(0);
	return (
		<div className="garage-grid-wrap" aria-hidden>
			<div className="garage-cards-grid garage-cards-grid--skeleton">
				{arr.map((_, i) => (
					<div className="garage-card garage-skeleton" key={i}>
						<div className="garage-card__img skeleton garage-skel-img">
							&nbsp;
						</div>
						<div className="garage-card__body">
							<div className="garage-skel-bottom skeleton" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default function Skeleton() {
	return (
		<div className="garage-skeleton">
			<FilterPillsSkeleton />
			<CarGridSkeleton />
		</div>
	);
}
