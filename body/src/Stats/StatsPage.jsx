import React from 'react';
import { getConfigValue } from '../functions.js';
import '../Main/GaragePage.css';
import './StatsPage.css';

function dash(v) {
	if (v === null || v === undefined || v === '') return '—';
	return v;
}

function segmentLabel(key) {
	const segs = getConfigValue('segments', {});
	const s = segs && typeof segs === 'object' ? segs[key] : null;
	if (s && s.label) return String(s.label);
	return String(key);
}

/** e.g. "26 APR 2024" (nfs-garage style) */
function formatDateAdded(iso) {
	if (!iso) return '—';
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return '—';
	return d
		.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		})
		.toUpperCase()
		.replace(/\s+/g, ' ');
}

/**
 * Collection stats (data from `GET /api/stats`). Reference: nfs-garage; garage topbar + hero speedo.
 */
export default function StatsPage({ statsData, onOpenCarId }) {
	const h = statsData && !statsData._error ? statsData : {};
	const byType = Array.isArray(h.by_type) ? h.by_type : null;
	const byRarity = Array.isArray(h.by_rarity) ? h.by_rarity : null;
	const recent = Array.isArray(h.recent_additions) ? h.recent_additions : null;
	const loadError = Boolean(statsData?._error);
	const ready = Boolean(statsData) && !loadError;

	const maxType = React.useMemo(() => {
		if (!byType || !byType.length) return 1;
		return Math.max(1, ...byType.map(r => r.count));
	}, [byType]);

	if (loadError) {
		return (
			<div
				className="garage-page stats-page"
				aria-label="Collection statistics"
			>
				<p className="stats-page__empty" role="alert">
					Unable to load statistics. Try again later.
				</p>
			</div>
		);
	}

	return (
		<div
			className="garage-page stats-page"
			aria-label="Collection and site statistics"
		>
			<header className="garage-toolbar">
				<div className="garage-topbar">
					<div className="garage-topbar-left">
						<div className="page-label">{'// ANALYTICS'}</div>
						<h1 className="garage-title">COLLECTION STATS</h1>
						<p className="garage-sub">
							Live from the archive · Uptime:{' '}
							<b>{h.uptime ? h.uptime.toUpperCase() : '—'}</b>
						</p>
					</div>
					<div className="garage-topbar-right">
						<div
							className="stats-page__sysreadout"
							aria-hidden="true"
						>
							<div>SYS // STATS OS v1</div>
							<div>STATUS: ONLINE</div>
							<div>SCALE: 1:64</div>
						</div>
					</div>
				</div>
			</header>

			<section
				className="stats-page__section"
				aria-labelledby="stats-speedo-heading"
			>
				<h2 id="stats-speedo-heading" className="visually-hidden">
					Collection totals
				</h2>
				<div
					className="stats-page__speedo"
					role="group"
					aria-label="Collection headline numbers"
				>
					<div className="stats-page__spd">
						<span
							className="stats-page__spd-n stats-page__spd-n--orange"
							aria-live="polite"
						>
							{dash(h.total_cars)}
						</span>
						<span className="stats-page__spd-l">Cars</span>
					</div>
					<div className="stats-page__spd">
						<span
							className="stats-page__spd-n stats-page__spd-n--cyan"
							aria-live="polite"
						>
							{dash(h.total_series)}
						</span>
						<span className="stats-page__spd-l">Series</span>
					</div>
					<div className="stats-page__spd">
						<span
							className="stats-page__spd-n stats-page__spd-n--yellow"
							aria-live="polite"
						>
							{dash(h.total_segments)}
						</span>
						<span className="stats-page__spd-l">Segments</span>
					</div>
					<div className="stats-page__spd">
						<span
							className="stats-page__spd-n stats-page__spd-n--orange"
							aria-live="polite"
						>
							{dash(h.first_car_date ?? h.since)}
						</span>
						<span className="stats-page__spd-l">Collecting since</span>
					</div>
				</div>
			</section>

			<div className="stats-page__grid">
				<section
					className="stats-page__panel"
					aria-labelledby="stats-type-heading"
				>
					<div className="stats-page__panel-head">
						<h2
							id="stats-type-heading"
							className="stats-page__panel-title"
						>
							<span className="stats-page__panel-line" />
							By type
						</h2>
						<p className="stats-page__panel-sub">
							Cars by segment
						</p>
					</div>
					{!ready ? (
						<p className="stats-page__empty">Loading…</p>
					) : !byType || byType.length === 0 ? (
						<p className="stats-page__empty">No data</p>
					) : (
						<ul className="stats-page__bars">
							{byType.map((row, i) => (
								<li key={row.key || i} className="stats-page__barli">
									<div className="stats-page__barhead">
										<span
											className="stats-page__barname"
											title={String(row.key)}
										>
											{segmentLabel(row.key)}
										</span>
										<span className="stats-page__barnum">
											{row.count}
										</span>
									</div>
									<div
										className="stats-page__bartrack"
										role="presentation"
									>
										<div
											className={
												'stats-page__barfill stats-page__barfill--type-' +
												(i % 4)
											}
											style={{
												width: `${(row.count / maxType) * 100}%`,
											}}
										/>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>

				<section
					className="stats-page__panel"
					aria-labelledby="stats-rarity-heading"
				>
					<div className="stats-page__panel-head">
						<h2
							id="stats-rarity-heading"
							className="stats-page__panel-title"
						>
							<span className="stats-page__panel-line stats-page__panel-line--rarity" />
							By rarity
						</h2>
						<p className="stats-page__panel-sub">
							Chases & Treasure Hunts
						</p>
					</div>
					{!ready ? (
						<p className="stats-page__empty">Loading…</p>
					) : !byRarity || byRarity.length === 0 ? (
						<p className="stats-page__empty">No data</p>
					) : (
						<div
							className="stats-page__rarity"
							role="group"
							aria-label="Premium segment counts"
						>
							<ul className="stats-page__rarity-grid">
								{byRarity.map((row, i) => {
									const tone =
										i % 3 === 0
											? 'orange'
											: i % 3 === 1
												? 'cyan'
												: 'yellow';
									return (
										<li
											key={row.key || i}
											className="stats-page__rarity-box"
										>
											<span
												className={
													'stats-page__rarity-n stats-page__rarity-n--' + tone
												}
												aria-label={`${segmentLabel(row.key)}: ${row.count} cars`}
											>
												{row.count}
											</span>
											<span
												className="stats-page__rarity-l"
												title={String(row.key)}
											>
												{segmentLabel(row.key)}
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					)}
				</section>
			</div>

			<section
				className="stats-page__recent"
				aria-labelledby="stats-recent-heading"
			>
				<h2
					id="stats-recent-heading"
					className="stats-page__recent-kicker"
				>
					RECENT ADDITIONS
				</h2>
				{!ready ? (
					<p className="stats-page__empty stats-page__recent-empty">
						Loading…
					</p>
				) : recent == null ? (
					<p className="stats-page__empty stats-page__recent-empty">
						—
					</p>
				) : recent.length === 0 ? (
					<p className="stats-page__empty stats-page__recent-empty">
						No cars in the archive yet
					</p>
				) : (
					<ul
						className="stats-page__recent-list"
						aria-label="Recently added cars"
					>
						{recent.map((car, i) => {
							const img = car.imgs && car.imgs[0] ? car.imgs[0] : '';
							const when = car.date_added || null;
							return (
								<li key={car.carId || i} className="stats-page__recent-li">
									<button
										type="button"
										className="stats-page__recent-row"
										aria-label={`Open ${car.carName || 'car'} in garage, added ${formatDateAdded(when)}`}
										onClick={() => {
											if (car.carId && typeof onOpenCarId === 'function') {
												onOpenCarId(car.carId);
											}
										}}
									>
										<span className="stats-page__recent-main">
											{img ? (
												<img
													src={img}
													alt=""
													className="stats-page__recent-thumb"
												/>
											) : (
												<div
													className="stats-page__recent-thumbPh"
													aria-hidden="true"
												/>
											)}
											<span
												className="stats-page__recent-title"
												title={car.carName || undefined}
											>
												{car.carName || '—'}
											</span>
										</span>
										<time
											className="stats-page__recent-date"
											dateTime={when || undefined}
										>
											{formatDateAdded(when)}
										</time>
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</section>
		</div>
	);
}
