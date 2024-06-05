import './Main.css';

export default function Header(props) {
	return (
		<div className="header">
			<h1 className="pif-300">
				<a
					className="pif-300"
					href="https://www.instagram.com/prtvivs.hotwheeeels"
					target="_blank"
					rel="noreferrer"
				>
					prtviv's
				</a>{' '}
				hot wheeeels <span className="pf-300">🏎️</span>
			</h1>
			<p className="subtitle pf-300">
				..includes other diecast brands too
			</p>
		</div>
	);
}
