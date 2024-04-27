import React from 'react';
import { getEngineUrl, makeRequest } from '../App';

const showIncorrectPass = () => {
	const ele = document.querySelector('.login-message');
	ele.classList.remove('hidden');
	setTimeout(() => ele.classList.add('hidden'), 1500);
};

export default function Login(props) {
	const { setAuthentication, setVisitorMode } = props;

	const postLogin = async function (e) {
		e.preventDefault();
		const inputValue = document.querySelector('#login').value;
		const engineUrl = getEngineUrl();

		const response = await makeRequest(
			engineUrl + '/api/login',
			{},
			{ input: inputValue }
		);

		if (response.status === 200) {
			const token = response.data;
			sessionStorage.setItem('token', token);

			setAuthentication(true);
			setVisitorMode(false);
		} else {
			showIncorrectPass();
			sessionStorage.removeItem('token');
			setAuthentication(false);
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

						<button className="pf-300 login-btn" type="submit">
							➡️
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
