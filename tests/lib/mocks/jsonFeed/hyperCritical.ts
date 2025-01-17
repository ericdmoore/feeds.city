// curl https://hypercritical.co/feeds/main.json > hyperCritical.json
import hyperCritical from "./jsons/hyperCritical.json" with { type: "json" };
export const jsonFeed = JSON.stringify(hyperCritical);
export default { jsonFeed };
