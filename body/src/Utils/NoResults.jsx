import React from 'react';
import './Utils.css';

export default function NoResults(props) {
	const { clearInput } = props;

	return (
		<div className="message-box">
			<span className="pf-400 result-msg">No matches were found</span>
			<button className="btn reload pf-300" onClick={clearInput}>
				Go back
			</button>
		</div>
	);
}
