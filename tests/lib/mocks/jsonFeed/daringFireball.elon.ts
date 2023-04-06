import dfb from "./jsons/daringFireball.short.json" assert { type: "json" };
export const jsonFeed = JSON.stringify(dfb);
export const jsonFeedUrl = "https://daringfireball.net/feeds/json";
export default { jsonFeed, jsonFeedUrl };
