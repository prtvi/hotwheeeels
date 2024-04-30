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
			{ input: inputValue }
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
			<form onSubmit={postLogin}>
				<div className="login-form">
					<div className="login-form-component">
						<label htmlFor="login" className="pf-300 login-label">
							Authenticate:
						</label>
						<span className="pf-300 login-message hidden">
							incorrect pass
						</span>
					</div>

					<div className="login-form-component c2">
						<input
							type="password"
							className="pf-300"
							id="login"
							name="input"
							required={true}
							placeholder="password"
						/>

						<button className="btn login-btn pf-300" type="submit">
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
