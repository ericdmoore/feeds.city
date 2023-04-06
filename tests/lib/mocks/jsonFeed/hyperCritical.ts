// curl https://hypercritical.co/feeds/main.json > hyperCritical.json
import hyperCritical from "./jsons/hyperCritical.json" assert { type: "json" };
export const jsonFeed = JSON.stringify(hyperCritical);
export default { jsonFeed };
