/**
 * #SVG Avatars
 *
 * ##Overivew:
 *
 * Given an arbitary hash input, and a chosen style library, create an indenticons that is roughly unique for the hash.
 *
 * Inputs:
 * - Hash Buffer
 * - Style Lib (Interface specified later)
 *
 * Output As:
 * - string:
 * - dataString
 * - callback
 *
 * Ship with 2 small SVG Style Libs
 * - like the monsters lib
 * - like an abstract kalideoscope lib
 *
 * Ship SVG Libs
 *  - via inline code?
 *  - via inline blob  (json.gz style)
 *  - starting with svg files on fs, but bundled into an `json.gz`-like Blob inline.
 *  -
 *
 * inpsired by:
 * - https://barro.github.io/2018/02/avatars-identicons-and-hash-visualization/
 * - https://github.com/laurentpayot/minidenticons
 * - [gravatar](https://en.gravatar.com/)
 * - [memoji](https://support.apple.com/en-us/HT208986)
 * - [monsterIDs](https://wordpress.org/plugins/wp-monsterid/)
 */

/**
 * Body Color 0xXXXXXX
 * Head Shape 8
 *  * Forehead Shape 2
 *  * Nose Shape 4
 * Hat Shape 8 /Color:0xXXXXXX
 * Hair Shape 8 /Color:0xXXXXXX
 *
 * Eyebrows Shape 4 /Color:0xXXXXXX
 * Glasses Shape 4 /Color:0xXXXXXX
 * Eyes Shape 4 /Color:0xXXXXXX
 * Lips Shape 4 /Color:0xXXXXXX
 *
 * Neck Shape 4
 *
 * Arm Shape 4
 * Watches/Bracelets 8 Shape/Color:0xXXXXXX
 *
 * Torso Shape 4
 * Shirt Shape 4 /Color:0xXXXXXX
 * Tie/Necklace Shape 4 /Color:0xXXXXXX
 *
 * Belt Shape 4 /Color:0xXXXXXX
 *
 * Legs Shape 4
 * Pants Shape 4 /Color:0xXXXXXX
 *
 * Feet Shape 4
 * Shoes Shape 4 /Color:0xXXXXXX
 */

// 2choice (2bits) x15 = 30 bits
// 8choice (3bits) x4 = 12 bits
// total of 42
// 48bit colors    x13 = 624 bits
//
// sha-256 leaves a buffer of 256 bits
// buffer is used once for control
// color-buffer (same buffer- but thought of in a circular buffer) has index lookups for the color categories
// at those starting spots you read the next 8 bits to get your starting position for the 48bit hex color
// 256bits of shape choices * 256 colors * where each color is a

/**
 * svgStyle(hash).as.svgString()
 * svgStyle(hash).as.svgDataString()
 * svgStyle(hash).as.canvasElement()
 */

/**
 * This is effectively the wonderful code provided from: https://github.com/laurentpayot/minidenticons/blob/main/minidenticons.js
 */

// density of 4 for the lowest probability of collision
const SQUARE_DENSITY = 4;

// 18 different colors only for easy distinction
const COLORS_NB = 18;
const DEFAULT_SATURATION = 50;
const DEFAULT_LIGHTNESS = 50;

// 32 bit FNV-1a hash parameters
const FNV_PRIME = 16777619;
const OFFSET_BASIS = 2166136261;

// based on the FNV-1a hash algorithm, modified for *signed* 32 bit integers http://www.isthe.com/chongo/tech/comp/fnv/index.html
function simpleHash(str: string) {
	return str.split("")
		// >>> 0 for 32 bit unsigned integer conversion https://2ality.com/2012/02/js-integers.html
		.reduce(
			(hash, char) => ((hash ^ char.charCodeAt(0)) >>> 0) * FNV_PRIME,
			OFFSET_BASIS,
		);
}

export function identicon(
	msg: string,
	saturation = DEFAULT_SATURATION,
	lightness = DEFAULT_LIGHTNESS,
) {
	const hash = simpleHash(msg);
	// dividing hash by FNV_PRIME to get last XOR result for better color randomness (will be an integer except for empty string hash)
	const hue = ((hash / FNV_PRIME) % COLORS_NB) * (360 / COLORS_NB);
	const rects = [...Array(msg ? 25 : 0).keys()]
		// 2 + ((3 * 5 - 1) - modulo) to concentrate squares at the center
		.map((i) => {
			let str = "";
			const x = i > 14 ? 7 - ~~(i / 5) : ~~(i / 5);
			const y = i % 5;

			if (hash % (16 - i % 15) < SQUARE_DENSITY) {
				str = `<rect x="${x}" y="${y}" width="1" height="1"/>`;
			}
			return { x, y, str };
		})
		.filter((r) => r.str.length > 0);
	// xmlns attribute added in case of SVG file generation https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg#sect1
	const fill = `fill="hsl(${hue} ${saturation}% ${lightness}%)"`;
	const rectStr = rects.map((r) => r.str).join("\n");
	return {
		fill,
		rects,
		rectStr,
		svgString:
			`<svg viewBox="-1.5 -1.5 8 8" xmlns="http://www.w3.org/2000/svg" ${fill}">${rectStr}</svg>`,
	};
}
