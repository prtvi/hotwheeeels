import React from 'react';
import './Utils.css';

export default function Modal(props) {
	const { modalTitle, isOpen, setModalOpen, children, isCarShowcase } = props;

	const closeModal = React.useCallback(() => {
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
			window.removeEventListener('keydown', handleEscForClosingModal);
		};
	}, [handleEscForClosingModal]);

	if (!isOpen) return null;

	if (isCarShowcase) {
		const child = React.isValidElement(children)
			? React.cloneElement(children, {
					onClose: closeModal,
					headSlot: modalTitle,
				})
			: children;

		return (
			<div
				className="ds-car-modal__scrim"
				onClick={handleClickOutsideModalBody}
			>
				<div
					className="ds-car-modal__wrap"
					role="dialog"
					aria-modal="true"
					aria-label="Car details"
					onClick={e => e.stopPropagation()}
				>
					{child}
				</div>
			</div>
		);
	}

	return (
		<div className="modal-out" onClick={handleClickOutsideModalBody}>
			<div className="modal-body zoom-in">
				<div className="modal-header">
					<div className="modal-title">
						<h3 className="pf-400">{modalTitle}</h3>
					</div>
					<div className="modal-close" onClick={closeModal}>
						<span>&#10006;</span>
					</div>
				</div>

				{children}
			</div>
		</div>
	);
}
