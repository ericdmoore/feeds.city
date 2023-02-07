// deno-lint-ignore-file
/**
 * Optimal solar spacing for solar furnace on the the blue play house
 *
 * See:
 * - https://www.solarreviews.com/blog/best-solar-panel-angle
 * - https://www.suncalc.org/#/32.9026,-96.7766,19/2023.12.21/14:03/1/1
 */

const PLAY_HOUSE_BEARING_DEG = 210;
const Deg90 = Math.PI / 2;
const toRads = (n: number) => n * Math.PI / 180;

// to determine min altitude
// just grab a tape-measure and do rise over run towards each of the fence poles as a scatter of azimuth angles

const summerSunDegrees = { min: 0, max: toRads(80.54) };
const winterSunDegrees = { min: 0, max: toRads(33.68) };

// flatwall installation
const topTriangleLittleCorner = Deg90 - summerSunDegrees.max;
const distanceOutUnderPanel = Math.cos(topTriangleLittleCorner);
