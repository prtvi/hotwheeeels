import React from 'react';
import './Utils.css';

function SkeletonCard() {
	return (
		<div className="skeleton-card">
			<div className="skeleton"></div>
			<div className="skeleton-name"></div>
		</div>
	);
}

export default function Skeleton() {
	const arr = new Array(8).fill(0);
	return (
		<div className="skeletal-list">
			{arr.map((_, i) => (
				<SkeletonCard key={i} />
			))}
		</div>
	);
}
