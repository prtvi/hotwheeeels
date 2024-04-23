import React from 'react';
import axios from 'axios';
import config from './config.json';

import Main from './Main.jsx';
import Login from './Forms/Login.jsx';

async function makeRequest(url, requestBody, headers) {
	try {
		if (requestBody === undefined) return await axios.get(url);
		else return await axios.post(url, requestBody, headers);
	} catch (error) {
		return error;
	}
}

const getEngineUrl = () =>
	config.ENV === 'prod' ? config.engineURL : config.engineURLDev;

export { getEngineUrl, makeRequest };

export default function App() {
	const [authenticated, setAuthentication] = React.useState(false);
	const [visitorMode, setVisitorMode] = React.useState(
		sessionStorage.getItem('visitor') === 'yes'
	);

	(async function () {
		const token = sessionStorage.getItem('token');
		if (token === null) return;

		const response = await makeRequest(
			getEngineUrl() + '/api/auth/verify_token',
			{ token: token },
			{ headers: { token: token } }
		);

		if (response.status === 200) {
			setAuthentication(true);
			setVisitorMode(false);
		} else {
			setAuthentication(false);
		}
	})();

	const renderMain = function () {
		if (authenticated || (!authenticated && visitorMode)) {
			return <Main visitorMode={visitorMode} />;
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
