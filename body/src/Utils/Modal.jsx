import React from 'react';
import './Modal.css';

export default function Modal(props) {
	const { modalTitle, height, isOpen, closeModal, children } = props;

	const handleEsc = React.useCallback(
		e => {
			if (e.key === 'Escape') closeModal();
		},
		[closeModal]
	);

	const handleClick = e => {
		if (e.target === e.currentTarget) closeModal();
	};

	React.useEffect(() => {
		window.addEventListener('keydown', handleEsc);

		return () => {
			window.addEventListener('keydown', handleEsc);
		};
	}, [handleEsc]);

	if (!isOpen) return null;

	return (
		<div className="modal-out" onClick={handleClick}>
			<div className="modal-body" style={{ height: `${height}px` }}>
				<div className="modal-header">
					<div className="modal-title">
						<h3 className="pf-400">{modalTitle}</h3>
					</div>
					<div className="modal-close" onClick={closeModal}>
						<span>✖️</span>
					</div>
				</div>

				{children}
			</div>
		</div>
	);
}
