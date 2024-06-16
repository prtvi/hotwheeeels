import React from 'react';
import './Utils.css';

export default function Modal(props) {
	const { modalTitle, isOpen, setModalOpen, children } = props;

	const closeModal = React.useCallback(() => {
		// check if url search params have car_id and remove it if it exists
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('car_id')) window.history.pushState(null, '', '/');

		setModalOpen(false);
	}, [setModalOpen]);

	const handleEscForClosingModal = React.useCallback(
		e => {
			if (e.key === 'Escape') closeModal();
		},
		[closeModal]
	);

	const handleClickOutsideModalBody = e => {
		if (e.target === e.currentTarget) closeModal();
	};

	React.useEffect(() => {
		window.addEventListener('keydown', handleEscForClosingModal);

		return () => {
			window.addEventListener('keydown', handleEscForClosingModal);
		};
	}, [handleEscForClosingModal]);

	if (!isOpen) return null;

	return (
		<div className="modal-out" onClick={handleClickOutsideModalBody}>
			<div className="modal-body">
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
