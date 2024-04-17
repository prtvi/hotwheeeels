import React from 'react';
import axios from 'axios';
import config from './config.json';

import Main from './Main.jsx';
import Login from './Forms/Login.jsx';

export default function App() {
	const [authenticated, setAuthentication] = React.useState(false);
	const [visitorMode, setVisitorMode] = React.useState(false);

	const checkIfTokenExistsAndAuthenticate = async function () {
		const token = sessionStorage.getItem('token');
		if (token === null) return;

		const url = config.engineURL + '/api/verify_token';
		const response = await axios.post(url, { token: token });

		if (response.status === 200) {
			setAuthentication(true);
			setVisitorMode(false);
		} else {
			setAuthentication(false);
		}
	};

	checkIfTokenExistsAndAuthenticate();

	console.log('authenticated:', authenticated);
	console.log('visitorMode:', visitorMode);

	const renderMain = function () {
		if (authenticated || (!authenticated && visitorMode)) {
			return (
				<Main visitorMode={visitorMode} authenticated={authenticated} />
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

	return (
		<div className="App">
			<h1 className="pf-600">Hot Wheeeels 🚗</h1>
			{renderMain()}
		</div>
	);
}
