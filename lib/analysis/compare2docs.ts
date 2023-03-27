import { Minhash } from "minhash";

interface MinhashInterface {
  update: (s: string) => void;
  jaccard: (other: MinhashInterface) => number;
}

export const compareDocSimilarity = (
  docA: string,
  docB: string,
  tokenizer: (d: string) => string[] = (d) => d.split(" "),
) => {
  const d1 = new Minhash() as MinhashInterface;
  const d2 = new Minhash() as MinhashInterface;

  tokenizer(docA).forEach((t) => d1.update(t));
  tokenizer(docB).forEach((t) => d2.update(t));

  return Promise.resolve({ d1, d2, score: d1.jaccard(d2) as number });
};

const d1 =
  "minhash is a probabilistic data structure for estimating the similarity between datasets";
const d2 =
  "minhash is a probability data structure for estimating the similarity between documents";
(async () => {
  console.log(d1);
  console.log(d2);
  console.log(await compareDocSimilarity(d1, d2));
})();
