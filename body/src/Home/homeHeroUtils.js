/**
 * Picks a small strip for the hero; prefers recent by acquiredDate when available.
 * @param {Array<Record<string, unknown>>} cars
 * @param {number} n
 * @returns {Array<Record<string, unknown>>}
 */
function pickPreviewCars(cars, n) {
	if (!Array.isArray(cars) || !cars.length) return [];
	const sorted = [...cars]
		.filter(c => c && Array.isArray(c.imgs) && c.imgs[0])
		.sort((a, b) => {
			const da = a.acquiredDate ? new Date(a.acquiredDate) : 0;
			const db = b.acquiredDate ? new Date(b.acquiredDate) : 0;
			return db - da;
		});
	if (sorted.length) return sorted.slice(0, n);
	return cars.slice(0, n);
}

export { pickPreviewCars };
