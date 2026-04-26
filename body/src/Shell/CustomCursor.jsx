import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './CustomCursor.css';

/**
 * Matches nfs-garage.html: hide system cursor, two fixed layers follow the pointer
 * (skew bar + mix-blend; diamond ring with lag via transition on left/top).
 */
export default function CustomCursor() {
	const [active, setActive] = useState(false);
	const bar = useRef(null);
	const ring = useRef(null);

	useLayoutEffect(() => {
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(pointer: coarse)').matches) return;
		if (window.matchMedia('(hover: none)').matches) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return;
		setActive(true);
	}, []);

	useEffect(() => {
		if (!active) return;
		const onMove = e => {
			if (bar.current) {
				bar.current.style.left = `${e.clientX}px`;
				bar.current.style.top = `${e.clientY}px`;
			}
			if (ring.current) {
				ring.current.style.left = `${e.clientX}px`;
				ring.current.style.top = `${e.clientY}px`;
			}
		};
		document.addEventListener('mousemove', onMove, { passive: true });
		document.documentElement.classList.add('ds-custom-cursor');
		return () => {
			document.removeEventListener('mousemove', onMove);
			document.documentElement.classList.remove('ds-custom-cursor');
		};
	}, [active]);

	if (!active) return null;

	return createPortal(
		<>
			<div ref={bar} className="ds-cursor" aria-hidden="true" />
			<div ref={ring} className="ds-cursor-ring" aria-hidden="true" />
		</>,
		document.body,
	);
}
