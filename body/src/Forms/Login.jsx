import React from 'react';
import Loader from '../Utils/Loader.jsx';

import {
	getEngineUrl,
	makeRequest,
	showIncorrectPass,
	setSessionStorage,
	removeSessionItem,
} from '../functions.js';

export default function Login(props) {
	const { setAuthentication, setVisitorMode } = props;

	const [responses, setResponses] = React.useState([]);
	const [formSubmitted, setFormSubmitted] = React.useState(false);

	const postLogin = async function (e) {
		e.preventDefault();
		const inputValue = document.querySelector('#login').value;
		const engineUrl = getEngineUrl();

		setFormSubmitted(true);

		const response = await makeRequest(
			engineUrl + '/api/login',
			{},
			{ input: inputValue },
		);

		setResponses(() => [response]);

		if (response.status === 200) {
			const token = response.data;
			setSessionStorage('token', token);

			setAuthentication(true);
			setVisitorMode(false);
		} else {
			showIncorrectPass();
			removeSessionItem('token');
			setAuthentication(false);

			setFormSubmitted(false);
			setResponses(() => []);
		}
	};

	return (
		<div className="login">
			<form
				onSubmit={postLogin}
				className="login-form"
				aria-label="Authentication"
			>
				<div className="login-card">
					<div className="login-form-component">
						<label htmlFor="login" className="login-label">
							Authenticate:
						</label>
						<span
							className="login-message hidden"
							aria-live="polite"
						>
							incorrect pass
						</span>
					</div>

					<div className="login-form-component c2">
						<input
							type="password"
							className="login-input"
							id="login"
							name="input"
							required={true}
							autoComplete="current-password"
							placeholder="password"
						/>

						<button
							className="ds-btn ds-btn--primary login-btn"
							type="submit"
						>
							{formSubmitted && responses.length === 0 ? (
								<Loader width={'6px'} height={'6px'} />
							) : (
								<>Login</>
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
