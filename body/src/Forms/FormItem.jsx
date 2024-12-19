import './Forms.css';
import config from '../config.json';

export default function FormItem(props) {
	const { spec, viewSize } = props;
	const className = `form-row-item fri-${viewSize}`;

	let value;

	if (config.ENV === 'prod') value = '';
	else value = spec.defaultValue;

	// set the current value for update car form
	if (spec.currValue) value = spec.currValue;

	switch (spec.inputType) {
		case 'text':
			return (
				<div className={className}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<input
						type={spec.inputType}
						name={spec.key}
						id={spec.key}
						placeholder={spec.placeholder}
						required={spec.required}
						defaultValue={value}
						maxLength={spec.maxLength}
					/>
				</div>
			);

		case 'datalist':
			return (
				<div className={className}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<input
						type="text"
						name={spec.key}
						id={spec.key}
						list={spec.key + '-datalist'}
						required={spec.required}
						defaultValue={value}
						maxLength={spec.maxLength}
					/>
					<datalist id={spec.key + '-datalist'}>
						{spec.list.map((v, i) => (
							<option value={v} key={i} />
						))}
					</datalist>
				</div>
			);

		case 'multioption':
			return (
				<div className={className}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<select
						name={spec.key}
						id={spec.key}
						defaultValue={value}
						required
						multiple
					>
						{spec.list.map((v, i) => (
							<option value={v} key={i}>
								{v}
							</option>
						))}
					</select>
				</div>
			);

		case 'number':
		case 'date':
			return (
				<div className={className}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<input
						type={spec.inputType}
						name={spec.key}
						id={spec.key}
						placeholder={spec.placeholder}
						required={spec.required}
						defaultValue={value}
					/>
				</div>
			);

		case 'checkbox':
			return (
				<div className={`${className} center-vertically`}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<input
						type={spec.inputType}
						name={spec.key}
						id={spec.key}
						placeholder={spec.placeholder}
						required={spec.required}
						defaultChecked={value}
					/>
				</div>
			);

		case 'file':
			return (
				<div className={`${className} center-vertically`}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<input
						type={spec.inputType}
						name={spec.key}
						id={spec.key}
						accept=".jpg, .jpeg, .png, .webp, .heic"
						multiple={true}
						required={spec.required}
					/>
				</div>
			);

		case 'textarea':
			return (
				<div className={className}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<textarea
						name={spec.key}
						id={spec.key}
						cols="20"
						rows="3"
						defaultValue={value}
					></textarea>
				</div>
			);

		case 'btn':
			return (
				<div className={className + ' button-box'}>
					<button className="btn" type="submit">
						Save
					</button>
					<button className="btn" type="reset">
						Clear all
					</button>
				</div>
			);

		default:
			return (
				<div className={className}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<input
						type={spec.inputType}
						name={spec.key}
						id={spec.key}
						placeholder={spec.placeholder}
						required={spec.required}
					/>
				</div>
			);
	}
}
