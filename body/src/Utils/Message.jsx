import React from 'react';
import './Message.css';

export default function Message(props) {
	const { closeModal } = props;

	return (
		<div className="message">
			<div>
				<button className="btn" onClick={closeModal}>
					Close
				</button>
			</div>
		</div>
	);
}
