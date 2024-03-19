import React from 'react';
import './Utils.css';
// import Marquee from './Marquee';

export default function Message(props) {
	const { closeModal } = props;

	return (
		<div className="message">
			{/* <Marquee direction="left" /> */}

			<div>
				<button className="btn" onClick={closeModal}>
					Close
				</button>
			</div>
		</div>
	);
}
