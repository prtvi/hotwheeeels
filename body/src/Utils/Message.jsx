import React from 'react';
import './Utils.css';

export default function Message(props) {
	const { closeModal } = props;

	document.querySelector('.modal-body').classList.add('message');

	return (
		<div className="message">
			<div>
				<button className="btn pf-300" onClick={closeModal}>
					Close
				</button>
			</div>
		</div>
	);
}
