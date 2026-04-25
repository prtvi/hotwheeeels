import React from 'react';
import config from '../config.json';
import { computeHeroMeta, pickPreviewCars } from './homeHeroUtils.js';
import './HomeHero.css';

/**
 * Full-viewport marketing hero (reference: nfs-garage #view-hero).
 * Receives live collection for speedo + preview; does not own data fetching.
 */
export default function HomeHero(props) {
	const {
		onEnterGarage,
		onViewStats,
		onOpenCarId,
		metaSourceCars,
		uptime,
		since,
		firstCarDate,
	} = props;
	const m = React.useMemo(
		() => computeHeroMeta(metaSourceCars),
		[metaSourceCars],
	);
	const previews = React.useMemo(
		() => pickPreviewCars(metaSourceCars, config.heroPreviewCarCount),
		[metaSourceCars],
	);

	const viewStats = React.useCallback(
		e => {
			if (e) e.preventDefault();
			if (onViewStats) onViewStats();
		},
		[onViewStats],
	);

	return (
		<div className="home-hero" aria-label="Collection home">
			<div className="home-hero__speed-bg" aria-hidden="true" />
			<div className="home-hero__main">
				<div className="home-hero__stripe" aria-hidden="true" />
				<div className="home-hero__corner home-hero__corner--l">
					{'SYS // COLLECTION OS v2.6'}
					<br />
					STATUS: ONLINE
					<br />
					UPTIME: {uptime ? uptime.toUpperCase() : '—'}
				</div>
				<div className="home-hero__corner home-hero__corner--r">
					LAT: 48.8566° N
					<br />
					LNG: 2.3522° E
					<br />
					{/* PARIS, FR */}
				</div>

				<div className="home-hero__eyebrow">
					personal diecast archive
				</div>

				<div className="home-hero__title-wrap">
					<h1 className="home-hero__title">
						<span className="home-hero__line1">HOT</span>
						<span className="home-hero__line2" data-text="WHEEEELS">
							WHEEEELS
						</span>
					</h1>
				</div>

				<p className="home-hero__tagline">
					by prithvi &nbsp;·&nbsp; garage established in{' '}
					{since ?? '2024'} &nbsp;·&nbsp; 1:64 scale
				</p>

				<div
					className="home-hero__speedo"
					role="group"
					aria-label="Collection stats"
				>
					<div className="home-hero__spd">
						<span
							className="home-hero__spd-n home-hero__spd-n--orange"
							aria-live="polite"
						>
							{m.total}
						</span>
						<span className="home-hero__spd-l">Cars</span>
					</div>
					<div className="home-hero__spd">
						<span
							className="home-hero__spd-n home-hero__spd-n--cyan"
							aria-live="polite"
						>
							{m.nSeries}
						</span>
						<span className="home-hero__spd-l">Series</span>
					</div>
					<div className="home-hero__spd">
						<span
							className="home-hero__spd-n home-hero__spd-n--yellow"
							aria-live="polite"
						>
							{m.nTypes}
						</span>
						<span className="home-hero__spd-l">Types</span>
					</div>
					<div className="home-hero__spd">
						<span
							className="home-hero__spd-n home-hero__spd-n--orange"
							aria-live="polite"
						>
							{firstCarDate ?? since ?? m.since}
						</span>
						<span className="home-hero__spd-l">Collecting since</span>
					</div>
				</div>

				<div className="home-hero__cta">
					<button
						type="button"
						className="ds-btn ds-btn--primary"
						onClick={onEnterGarage}
					>
						<span>▶ Enter Garage</span>
					</button>
					<button
						type="button"
						className="ds-btn ds-btn--secondary"
						onClick={viewStats}
					>
						<span>View Stats</span>
					</button>
				</div>
			</div>

			<div className="home-hero__preview" id="home-hero-preview">
				<div className="home-hero__preview-label">
					Top of the collection
				</div>
				<div
					className="home-hero__strip"
					role="list"
					aria-label="Collection preview"
				>
					{previews.length === 0 ? (
						<p className="home-hero__strip-empty">Loading picks…</p>
					) : (
						previews.map((car, i) => {
							const img =
								car.imgs && car.imgs[0] ? car.imgs[0] : '';
							return (
								<button
									type="button"
									key={car.carId || i}
									className="home-hero__prev-card"
									onClick={() => {
										if (
											car.carId &&
											typeof onOpenCarId === 'function'
										) {
											onOpenCarId(car.carId);
											return;
										}
										if (typeof onEnterGarage === 'function')
											onEnterGarage();
									}}
									role="listitem"
									aria-label={`Open collection — ${car.carName || 'car'}`}
								>
									{img ? (
										<img
											src={img}
											alt=""
											className="home-hero__prev-img"
										/>
									) : (
										<div className="home-hero__prev-ph" />
									)}
									<div
										className="home-hero__prev-bar"
										aria-hidden="true"
									/>
									<div className="home-hero__prev-name">
										{car.carName}
									</div>
								</button>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}
