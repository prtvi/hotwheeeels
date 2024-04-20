import React from 'react';
import './Utils.css';

export default function Loader() {
	document
		.querySelector(':root')
		.style.setProperty('--modal-height', '200px');

	return <div className="loader"></div>;
}
