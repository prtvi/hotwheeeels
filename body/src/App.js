import React from 'react';

import AppShell from './Shell/AppShell.jsx';
import CustomCursor from './Shell/CustomCursor.jsx';
import HomeHero from './Home/HomeHero.jsx';
import Main from './Main/Main.jsx';
import Login from './Forms/Login.jsx';
import StatsPage from './Stats/StatsPage.jsx';

import {
	makeRequest,
	getEngineUrl,
	getSessionItem,
	logUrl,
	setRuntimeConfig,
} from './functions.js';

let hasLoggedUrl = false;

function getAppViewFromUrl() {
	if (typeof window === 'undefined') return 'hero';
	const s = new URLSearchParams(window.location.search);
	if (s.get('stats') === '1') return 'stats';
	if (s.get('garage') === '1' || s.has('car_id')) return 'garage';
	return 'hero';
}

export default function App() {
	const authMode = window.location.href.includes('auth');

	const [authenticated, setAuthentication] = React.useState(false);
	const [visitorMode, setVisitorMode] = React.useState(!authMode);
	const [appView, setAppView] = React.useState(getAppViewFromUrl);
	const [collectionCars, setCollectionCars] = React.useState([]);
	const [homepageStats, setHomepageStats] = React.useState(null);
	const [statsPageData, setStatsPageData] = React.useState(null);
	const [runtimeCfg, setRuntimeCfg] = React.useState(null);

	const showHero = appView === 'hero';

	React.useEffect(() => {
		if (hasLoggedUrl) return;
		hasLoggedUrl = true;
		logUrl();
	}, []);

	if (authMode) {
		(async function () {
			const token = getSessionItem('token', String);
			if (token === null) return;

			const response = await makeRequest(
				getEngineUrl() + '/api/auth/verify_token',
				{ headers: { token: token } },
				{ token: token },
			);

			if (response.status === 200) {
				setAuthentication(true);
				setVisitorMode(false);
			} else {
				setAuthentication(false);
			}
		})();
	}

	React.useEffect(() => {
		const onPop = () => setAppView(getAppViewFromUrl());
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, []);

	React.useEffect(() => {
		(async function () {
			// Bootstrap runtime config first (no file-based config).
			const cfgRes = await makeRequest(
				getEngineUrl() + '/api/config/runtime',
				undefined,
				undefined,
			);
			if (cfgRes && cfgRes.status === 200 && cfgRes.data?.config) {
				setRuntimeConfig(cfgRes.data.env, cfgRes.data.config);
				setRuntimeCfg(cfgRes.data.config);
			}

			const res = await makeRequest(
				getEngineUrl() + '/api/stats/homepage',
				undefined,
				undefined,
			);

			if (res && res.status === 200 && res.data)
				setHomepageStats(res.data);
		})();
	}, []);

	React.useEffect(() => {
		if (appView !== 'stats') return;
		let cancelled = false;
		setStatsPageData(null);
		(async function () {
			const res = await makeRequest(
				getEngineUrl() + '/api/stats',
				undefined,
				undefined,
			);
			if (cancelled) return;
			if (res && res.status === 200 && res.data) {
				setStatsPageData(res.data);
			} else {
				setStatsPageData({ _error: true });
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [appView]);

	const applyUrl = React.useCallback(u => {
		window.history.pushState({}, '', u);
		setAppView(getAppViewFromUrl());
	}, []);

	const navToHome = React.useCallback(
		e => {
			if (e) e.preventDefault();
			const u = new URL(window.location.href);
			u.searchParams.delete('garage');
			u.searchParams.delete('car_id');
			u.searchParams.delete('stats');
			const q = u.searchParams.toString();
			applyUrl(u.pathname + (q ? '?' + q : ''));
			window.scrollTo(0, 0);
		},
		[applyUrl],
	);

	const navToGarage = React.useCallback(
		e => {
			if (e) e.preventDefault();
			const u = new URL(window.location.href);
			u.searchParams.delete('stats');
			u.searchParams.set('garage', '1');
			applyUrl(u);
			window.scrollTo(0, 0);
		},
		[applyUrl],
	);

	const openCarFromHomePreview = React.useCallback(carId => {
		if (!carId) return;
		const u = new URL(window.location.href);
		u.searchParams.delete('stats');
		u.searchParams.set('garage', '1');
		u.searchParams.set('car_id', carId);
		window.history.pushState({}, '', u);
		// keep App + Main in sync (Main listens to popstate for car_id opens)
		window.dispatchEvent(new PopStateEvent('popstate'));
		window.scrollTo(0, 0);
	}, []);

	const navToStats = React.useCallback(
		e => {
			if (e) e.preventDefault();
			const u = new URL(window.location.href);
			u.searchParams.delete('garage');
			u.searchParams.delete('car_id');
			u.searchParams.set('stats', '1');
			applyUrl(u);
			window.scrollTo(0, 0);
		},
		[applyUrl],
	);

	const onSkipToContent = React.useCallback(
		e => {
			if (showHero) {
				navToGarage(e);
			}
			setTimeout(
				() => {
					document.getElementById('main-content')?.focus();
				},
				showHero ? 100 : 0,
			);
		},
		[showHero, navToGarage],
	);

	const renderMain = function () {
		if (authenticated) {
			if (appView === 'stats') {
				return (
					<StatsPage
						statsData={statsPageData}
						onOpenCarId={openCarFromHomePreview}
					/>
				);
			}
			return (
				<Main
					visitorMode={false}
					onCollectionMeta={setCollectionCars}
				/>
			);
		} else if (!authenticated && visitorMode) {
			if (appView === 'stats') {
				return (
					<StatsPage
						statsData={statsPageData}
						onOpenCarId={openCarFromHomePreview}
					/>
				);
			}
			return (
				<Main visitorMode={true} onCollectionMeta={setCollectionCars} />
			);
		} else if (!authenticated && !visitorMode) {
			return (
				<Login
					setAuthentication={setAuthentication}
					setVisitorMode={setVisitorMode}
				/>
			);
		}
	};

	const view = !authenticated && !visitorMode ? 'login' : 'main';
	const isLogin = view === 'login';

	// Navbar count: Main only mounts on garage, so hero/stats would otherwise show 0.
	const navCarCount = React.useMemo(() => {
		if (collectionCars.length > 0) return collectionCars.length;
		const t = homepageStats?.total_cars;
		if (typeof t === 'number' && !Number.isNaN(t)) return t;
		return 0;
	}, [collectionCars, homepageStats]);

	return (
		<>
			<CustomCursor />
			<AppShell
				view={view}
				carCount={navCarCount}
				since={homepageStats?.since ?? null}
				preMain={
					!isLogin && showHero ? (
						<HomeHero
							onEnterGarage={navToGarage}
							onViewStats={navToStats}
							onOpenCarId={openCarFromHomePreview}
							metaSourceCars={collectionCars}
							uptime={homepageStats?.uptime ?? null}
							since={homepageStats?.since ?? null}
							firstCarDate={homepageStats?.first_car_date ?? null}
							totalCars={homepageStats?.total_cars ?? null}
							totalSeries={homepageStats?.total_series ?? null}
							totalSegments={
								homepageStats?.total_segments ?? null
							}
							heroPreviewCarCount={
								runtimeCfg?.heroPreviewCarCount ?? null
							}
						/>
					) : null
				}
				mainHidden={!isLogin && showHero}
				onNavHome={!isLogin ? navToHome : undefined}
				onNavGarage={!isLogin ? navToGarage : undefined}
				onNavStats={!isLogin ? navToStats : undefined}
				homeNavActive={!isLogin && appView === 'hero'}
				garageNavActive={!isLogin && appView === 'garage'}
				statsNavActive={!isLogin && appView === 'stats'}
				onSkipToContent={!isLogin ? onSkipToContent : undefined}
			>
				{renderMain()}
			</AppShell>
		</>
	);
}
