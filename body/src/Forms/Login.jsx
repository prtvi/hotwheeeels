import React from 'react';
import axios from 'axios';
import config from '../config.json';

export default function Login(props) {
	const { setAuthentication } = props;

	const postLogin = async function (e) {
		e.preventDefault();
		const engineURL = config.engineURL;

		const formData = new FormData(e.currentTarget);
		const formDataJson = {};
		formData.forEach((value, key) => (formDataJson[key] = value));

		const url = engineURL + '/api/login';
		const response = await axios.post(url, formDataJson);

		if (response.status === 200)
			sessionStorage.setItem('token', response.data);

		const token = sessionStorage.getItem('token');

		if (token) {
			const url = engineURL + '/api/verify_token';
			const response = await axios.post(url, { token: token });

			if (response.status === 200) setAuthentication(true);
		}
	};

	return (
		<div className="login">
			<form onSubmit={postLogin}>
				<div className="login-input">
					<label htmlFor="login" className="pf-300">
						Login:
					</label>
					<input
						type="password"
						className="pf-300"
						id="login"
						name="input"
						placeholder="pass"
					/>
				</div>

				<div className="btn-container">
					<button className="btn login-btn" type="submit">
						Login
					</button>
					<button className="btn">View readonly</button>
				</div>
			</form>
		</div>
	);
}
