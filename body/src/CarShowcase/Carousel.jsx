import './CarShowcase.css';
import config from '../config.json';

export default function Carousel(props) {
	const { images, carId } = props;
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

	function copyCarShareLink(e) {
		const url = `${config.bodyURL}/?car_id=${carId}&src=shareicon`;
		navigator.clipboard.writeText(url);

		const toggleHidden = icons =>
			Array.from(icons).forEach(i => i.classList.toggle('hidden'));

		const icons = e.currentTarget.querySelectorAll('svg');

		toggleHidden(icons);
		setTimeout(() => toggleHidden(icons), 2000);
	}

	return (
		<div className="carousel" onLoad={showCurrSlide}>
			<div className="slideshow-container">
				{images.map((img, i) => (
					<div className="slides fade" key={i}>
						<img src={img} alt="car photos" />
					</div>
				))}

				<span className="carousel-arrow left" onClick={left}>
					&#10094;
				</span>
				<span className="carousel-arrow right" onClick={right}>
					&#10095;
				</span>

				<span
					className="share"
					title="share car details"
					onClick={copyCarShareLink}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="-2 -4 32 32"
					>
						<path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z" />
					</svg>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="-4 -4 32 32"
						className="hidden"
					>
						<path d="m16.298,8.288l1.404,1.425-5.793,5.707c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701Zm7.702,3.712c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z" />
					</svg>
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
