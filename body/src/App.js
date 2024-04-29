import React from 'react';

import Main from './Main/Main.jsx';
import Login from './Forms/Login.jsx';

import { makeRequest, getEngineUrl, getSessionItem } from './functions.js';

export default function App() {
	const authMode = window.location.href.includes('auth');

	const [authenticated, setAuthentication] = React.useState(false);
	const [visitorMode, setVisitorMode] = React.useState(!authMode);

	if (authMode) {
		(async function () {
			const token = getSessionItem('token', String);
			if (token === null) return;

			const response = await makeRequest(
				getEngineUrl() + '/api/auth/verify_token',
				{ headers: { token: token } },
				{ token: token }
			);

			if (response.status === 200) {
				setAuthentication(true);
				setVisitorMode(false);
			} else {
				setAuthentication(false);
			}
		})();
	}

	const renderMain = function () {
		if (authenticated) {
			return <Main visitorMode={false} />;
		} else if (!authenticated && visitorMode) {
			return <Main visitorMode={true} />;
		} else if (!authenticated && !visitorMode) {
			return (
				<Login
					setAuthentication={setAuthentication}
					setVisitorMode={setVisitorMode}
				/>
			);
		}
	};

	return (
		<div className="App">
			<h1 className="pf-600">Hot Wheeeels 🚗</h1>
			{renderMain()}
		</div>
	);
}
