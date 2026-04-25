import React, { useMemo } from 'react';
import './AppShell.css';

const IG = 'https://www.instagram.com/prtvivs.hotwheeeels';

/**
 * App frame: top nav, optional pre-main (hero), main, footer.
 */
export default function AppShell(props) {
	const {
		view,
		children,
		preMain = null,
		mainHidden = false,
		onNavHome,
		onNavGarage,
		onNavStats,
		onSkipToContent,
		homeNavActive = false,
		garageNavActive = false,
		statsNavActive = false,
		carCount = 0,
	} = props;
	const isLoginView = view === 'login';
	const isSpa =
		typeof onNavHome === 'function' &&
		typeof onNavGarage === 'function' &&
		typeof onNavStats === 'function';

	const { homeLinkHref, garageLinkHref, statsLinkHref } = useMemo(() => {
		if (typeof window === 'undefined') {
			return {
				homeLinkHref: '/',
				garageLinkHref: '/?garage=1',
				statsLinkHref: '/?stats=1',
			};
		}
		const w = window.location.href;
		const h = new URL(w);
		h.search = '';
		const g = new URL(w);
		g.searchParams.set('garage', '1');
		const st = new URL(w);
		st.searchParams.delete('garage');
		st.searchParams.delete('car_id');
		st.searchParams.set('stats', '1');
		return {
			homeLinkHref: h.pathname + h.search,
			garageLinkHref: g.pathname + g.search,
			statsLinkHref: st.pathname + st.search,
		};
	}, []);

	const rightLabel = isLoginView
		? 'AUTH'
		: carCount === 1
			? '1 CAR LOGGED'
			: `${carCount} CARS LOGGED`;

	return (
		<div className="app-shell App">
			<a
				className="app-shell__skip"
				href="#main-content"
				onClick={e => {
					if (onSkipToContent) {
						e.preventDefault();
						onSkipToContent(e);
					}
				}}
			>
				Skip to collection
			</a>
			<header
				className="app-shell__header"
				role="navigation"
				aria-label="Main"
			>
				<div className="app-shell__bar">
					<a
						className="app-shell__logo"
						href={IG}
						target="_blank"
						rel="noreferrer"
					>
						<span
							className="app-shell__logo-slash"
							aria-hidden="true"
						>
							▶▶
						</span>
						<span className="app-shell__logo-name">PRTVIV</span>
						<span
							className="app-shell__logo-tag"
							aria-hidden="true"
						>
							HOT WHEEEELS
						</span>
					</a>
					<div
						className="app-shell__nav-center"
						role="group"
						aria-label="Site sections"
					>
						{!isLoginView && isSpa ? (
							<>
								<button
									type="button"
									className={
										'ds-btn ds-btn--sm ds-btn--ghost app-shell__link' +
										(homeNavActive
											? ' app-shell__link--active'
											: '')
									}
									aria-current={
										homeNavActive ? 'page' : undefined
									}
									onClick={onNavHome}
								>
									Home
								</button>
								<button
									type="button"
									className={
										'ds-btn ds-btn--sm ds-btn--ghost app-shell__link' +
										(garageNavActive
											? ' app-shell__link--active'
											: '')
									}
									aria-current={
										garageNavActive ? 'page' : undefined
									}
									onClick={onNavGarage}
								>
									Garage
								</button>
								<button
									type="button"
									className={
										'ds-btn ds-btn--sm ds-btn--ghost app-shell__link' +
										(statsNavActive
											? ' app-shell__link--active'
											: '')
									}
									aria-current={
										statsNavActive ? 'page' : undefined
									}
									onClick={onNavStats}
								>
									Stats
								</button>
							</>
						) : (
							<>
								<a
									href={homeLinkHref}
									className="ds-btn ds-btn--sm ds-btn--ghost app-shell__link"
								>
									Home
								</a>
								<a
									href={garageLinkHref}
									className="ds-btn ds-btn--sm ds-btn--ghost app-shell__link app-shell__link--active"
								>
									Garage
								</a>
								<a
									href={statsLinkHref}
									className="ds-btn ds-btn--sm ds-btn--ghost app-shell__link"
								>
									Stats
								</a>
							</>
						)}
					</div>
					<div
						className="app-shell__status"
						aria-label="Cars logged in collection"
					>
						<span
							className="app-shell__status-dot"
							aria-hidden="true"
						/>
						<span className="app-shell__status-txt app-shell__mono">
							{rightLabel}
						</span>
					</div>
				</div>
			</header>

			<div className="app-shell__content">
				{preMain}
				<main
					className="app-main"
					id="main-content"
					role="main"
					tabIndex={-1}
					hidden={mainHidden}
				>
					{children}
				</main>
			</div>

			<footer
				className="app-shell__footer"
				role="contentinfo"
				aria-label="Colophon"
			>
				<div className="app-shell__footer-inner">
					<a
						href={IG}
						className="app-shell__footer-link"
						target="_blank"
						rel="noreferrer"
					>
						@prtvivs.hotwheeeels
					</a>
					<span className="app-shell__footer-sep" aria-hidden="true">
						{'//'}
					</span>
					<span className="app-shell__footer-meta app-shell__mono">
						1:64
					</span>
					<span className="app-shell__footer-sep" aria-hidden="true">
						{'//'}
					</span>
					<span className="app-shell__footer-meta">Est. 2013</span>
				</div>
			</footer>
		</div>
	);
}
