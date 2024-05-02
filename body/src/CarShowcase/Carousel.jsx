import './CarShowcase.css';

export default function Carousel(props) {
	const { images } = props;
	let slideIndex = 0;

	function left() {
		if (slideIndex - 1 < 0) slideIndex = images.length - 1;
		else slideIndex = slideIndex - 1;

		showCurrSlide(slideIndex);
	}

	function right() {
		if (slideIndex + 1 >= images.length) slideIndex = 0;
		else slideIndex = slideIndex + 1;

		showCurrSlide(slideIndex);
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
			// carousel onload
			slideIndex = 0;
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

				<span className="carousel-arrow left" onClick={left}>
					&#10094;
				</span>
				<span className="carousel-arrow right" onClick={right}>
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
