import { getConfigValue } from '../functions.js';

export default function Legend(props) {
	const { filter, activeSegment = '' } = props;
	const segments = getConfigValue('segments', {});
	const scs = Object.entries(segments).filter(i => i[1].avlbl);

	const onFtab = key => {
		if (key === '') {
			filter('');
			return;
		}
		const next = activeSegment === key ? '' : key;
		filter(next);
	};

	return (
		<div
			className="garage-filter-tabs"
			role="tablist"
			aria-label="Filter by segment"
		>
			<button
				type="button"
				role="tab"
				aria-selected={activeSegment === ''}
				className={'garage-ftab' + (activeSegment === '' ? ' on' : '')}
				onClick={() => onFtab('')}
			>
				<span
					className="ftab-dot"
					style={{ background: 'var(--ds-palette-dim-2)' }}
					aria-hidden
				/>
				All
			</button>
			{scs.map(sc => {
				const [key, def] = sc;
				const isOn = activeSegment === key;
				return (
					<button
						type="button"
						key={key}
						role="tab"
						aria-selected={isOn}
						className={'garage-ftab' + (isOn ? ' on' : '')}
						onClick={() => onFtab(key)}
					>
						<span
							className="ftab-dot"
							style={{ background: def.color }}
							aria-hidden
						/>
						{def.label}
					</button>
				);
			})}
		</div>
	);
}
