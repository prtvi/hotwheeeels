import React from 'react';
import './Utils.css';
// import Marquee from './Marquee';

export default function Message(props) {
	const { closeModal } = props;

	document
		.querySelector(':root')
		.style.setProperty('--modal-height', '100px');

	return (
		<div className="message">
			{/* <Marquee direction="left" /> */}

			<div>
				<button className="btn pf-300" onClick={closeModal}>
					Close
				</button>
			</div>
		</div>
	);
}
