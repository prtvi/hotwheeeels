import React from 'react';
import './Utils.css';

export default function SVG(props) {
	const { name } = props;

	switch (name) {
		case 'filter':
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="17"
					height="16"
					fill="none"
				>
					<path
						stroke="#000"
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M16.5.6H.5l6.4 7.568V13.4l3.2 1.6V8.168z"
					></path>
				</svg>
			);

		case 'cancel':
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<g>
						<path fill="none" d="M0 0H24V24H0z"></path>
						<g transform="translate(6 6)">
							<path d="M.5.5l11 11" className="cls-2"></path>
							<path
								d="M-.5.5l-11 11"
								className="cls-2"
								transform="translate(12)"
							></path>
						</g>
					</g>
				</svg>
			);

		case 'share':
			return (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -4 32 32">
					<path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z" />
				</svg>
			);

		case 'check':
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="-4 -4 32 32"
					className="hidden"
				>
					<path d="m16.298,8.288l1.404,1.425-5.793,5.707c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701Zm7.702,3.712c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z" />
				</svg>
			);

		default:
			break;
	}

	return <></>;
}
