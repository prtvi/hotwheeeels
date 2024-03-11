import React from 'react';
import './Modal.css';

export default function Modal(props) {
	if (!props.isOpen) return null;

	return (
		<div className="modal-out">
			<div className="modal-body">
				<div className="modal-header">
					<div className="modal-title">
						<h3 className="pf-400">{props.modalTitle}</h3>
					</div>
					<div className="modal-close" onClick={props.onClose}>
						<span>❌</span>
					</div>
				</div>

				{props.children}
			</div>
		</div>
	);
}
