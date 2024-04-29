import React from 'react';
import './Utils.css';

export default function Loader(props) {
	const { width, height, modalHeight } = props;

	if (modalHeight !== undefined)
		document.querySelector('.modal-body').classList.add('message');

	return (
		<div className="loader" style={{ width: width, height: height }}></div>
	);
}
