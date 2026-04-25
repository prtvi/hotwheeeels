import './CarShowcase.css';
import React from 'react';

function ImageCornerHud() {
	return (
		<div className="cs-img-hud cs-img-hud--on-photo" aria-hidden>
			<div className="cs-hud ch-tl" />
			<div className="cs-hud ch-tr" />
			<div className="cs-hud ch-bl" />
			<div className="cs-hud ch-br" />
		</div>
	);
}

/**
 * Slideshow + bottom film strip (prev | dots | next).
 * Arrows sit below the image so a side-edge fade can span more of the photo.
 */
export default function Carousel({ images, carId: _carId }) {
	const [idx, setIdx] = React.useState(0);
	const n = images.length;

	React.useEffect(() => {
		setIdx(0);
	}, [images]);

	const go = d => {
		if (n === 0) return;
		setIdx(i => (i + d + n * 10) % n);
	};

	if (!n) return null;

	/* One photo: hero only, no strip / nav */
	if (n === 1) {
		return (
			<div
				className="carousel carousel--single"
				role="region"
				aria-label="Car photo"
			>
				<div className="slideshow-container">
					<div className="slides" style={{ display: 'block' }}>
						<img src={images[0]} alt="" />
					</div>
					<ImageCornerHud />
				</div>
			</div>
		);
	}

	return (
		<div className="carousel" role="region" aria-label="Car photos">
			<div className="slideshow-container">
				{images.map((img, i) => (
					<div
						className="slides fade"
						key={i}
						style={{ display: i === idx ? 'block' : 'none' }}
					>
						<img src={img} alt="" />
					</div>
				))}
				<ImageCornerHud />
			</div>

			<div className="carousel-filmstrip" aria-label="Frame navigation">
				<div className="filmstrip__edge">
					<button
						type="button"
						className="carousel-arrow left"
						onClick={() => go(-1)}
						aria-label="Previous photo"
					>
						&#10094;
					</button>
				</div>
				<div
					className="dot-container"
					role="tablist"
					aria-label="Frame navigation"
				>
					{images.map((_, i) => (
						<button
							type="button"
							key={i}
							role="tab"
							aria-selected={i === idx}
							aria-label={`Frame ${i + 1} of ${n}`}
							className={'dot' + (i === idx ? ' active' : '')}
							onClick={() => setIdx(i)}
						/>
					))}
				</div>
				<div className="filmstrip__edge">
					<button
						type="button"
						className="carousel-arrow right"
						onClick={() => go(1)}
						aria-label="Next photo"
					>
						&#10095;
					</button>
				</div>
			</div>
		</div>
	);
}
