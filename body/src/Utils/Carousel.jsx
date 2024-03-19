import React from 'react';
import './Utils.css';

export default function Carousel(props) {
	const { images } = props;

	const [slideIndex, setSlideIndex] = React.useState(0);

	function goLeft() {
		let idx = 0;

		if (slideIndex - 1 < 0) idx = images.length - 1;
		else idx = slideIndex - 1;

		setSlideIndex(idx);
		showCurrSlide(idx);
	}

	function goRight() {
		let idx = 0;

		if (slideIndex + 1 >= images.length) idx = 0;
		else idx = slideIndex + 1;

		setSlideIndex(idx);
		showCurrSlide(idx);
	}

	function showCurrSlide(idx) {
		const slides = document.getElementsByClassName('slides');
		const dots = document.getElementsByClassName('dot');

		for (let i = 0; i < slides.length; i++) {
			dots[i].classList.remove('active');
			slides[i].style.display = 'none';
		}

		if (typeof idx === 'number') {
			slides[idx].style.display = 'block';
			dots[idx].classList.add('active');
		} else {
			slides[slideIndex].style.display = 'block';
			dots[slideIndex].classList.add('active');
		}
	}

	return (
		<div className="carousel" onLoad={showCurrSlide}>
			<div className="slideshow-container">
				{images.map((img, i) => {
					return (
						<div className="slides fade" key={i}>
							<img src={img} alt="car photos" />
						</div>
					);
				})}

				<span className="trigger prev" onClick={goLeft}>
					&#10094;
				</span>
				<span className="trigger next" onClick={goRight}>
					&#10095;
				</span>

				<div className="dot-container">
					{images.map((_, i) => (
						<span className="dot" id={`dot_${i}`} key={i}></span>
					))}
				</div>
			</div>
		</div>
	);
}
