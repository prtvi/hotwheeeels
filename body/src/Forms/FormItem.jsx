import React from 'react';
import './Forms.css';
import config from '../config.json';

export default function FormItem(props) {
	const { spec, itemSizeClass } = props;
	const className = `row-item ${itemSizeClass}`;

	let value;

	if (config.ENV === 'debug') value = spec.defaultValue;
	else value = '';

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
						defaultChecked={value}
					/>
				</div>
			);

		case 'file':
			return (
				<div className={className}>
					<label className="pf-300" htmlFor={spec.key}>
						{spec.label}
					</label>
					<input
						type={spec.inputType}
						name={spec.key}
						id={spec.key}
						accept="image/*"
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
