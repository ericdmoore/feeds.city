/**
 * Tailwind CSS colors are 0-900 kindof...
 * 0 is actually 50, and the rest of the values are 100 steps from 100
 * @param n
 * @returns number
 */
export default function (n: number) {
	return n === 50 ? 900 : n === 900 ? 50 : 450 + -1 * (n - 450);
}
