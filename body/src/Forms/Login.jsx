import React from 'react';
import axios from 'axios';
import config from '../config.json';

export default function Login(props) {
	const { setAuthentication, setVisitorMode } = props;

	const postLogin = async function (e) {
		e.preventDefault();
		const inputValue = document.querySelector('#login').value;

		const engineURL = config.engineURL;
		const url = engineURL + '/api/login';
		const response = await axios.post(url, { input: inputValue });
		const token = response.data;

		if (response.status === 200) {
			sessionStorage.setItem('token', token);

			const url = engineURL + '/api/verify_token';
			const response = await axios.post(url, { token: token });

			if (response.status === 200) {
				setAuthentication(true);
				setVisitorMode(false);
			} else {
				setAuthentication(false);
			}
		} else {
			setAuthentication(false);
		}
	};

	const setAsVisitor = function () {
		setAuthentication(false);
		setVisitorMode(true);
	};

	return (
		<div className="login">
			<form onSubmit={postLogin}>
				<div className="login-form">
					<div className="login-form-component">
						<label htmlFor="login" className="pf-300 login-label">
							Authenticate:
						</label>
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

						<button className="btn login-btn" type="submit">
							Login 🧑‍🔧
						</button>
					</div>
				</div>
			</form>

			<div className="just-a-visitor">
				<button className="btn" onClick={setAsVisitor}>
					Just a visitor? 👀
				</button>
			</div>
		</div>
	);
}
