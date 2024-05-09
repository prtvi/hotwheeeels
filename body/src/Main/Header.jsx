import './Main.css';

export default function Header(props) {
	return (
		<div className="header">
			<h1 className="pf-500">
				<a
					href="https://www.instagram.com/prtviv"
					target="_blank"
					rel="noreferrer"
				>
					Prithvi's
				</a>{' '}
				Hot Wheeeels collection 🏎️
			</h1>
			<p
				className="subtitle pif-200"
				title="showcase of my hot wheels collection, includes other diecast brands too"
			>
				..includes other diecast brands too
			</p>
		</div>
	);
}
