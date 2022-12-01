import { assert } from "https://deno.land/std@0.150.0/_util/assert.ts";

interface StatsProps {
  line1: string;
  line2: string;
  stats: Record<string, string>;
}

const statsBoundariesAndMiddile = (d: Record<string, string>) => {
  const entries = Object.entries(d);
  assert(entries.length >= 2, "stats must have at least two entries");
  return [entries[0], entries.slice(-1)[0], ...entries.slice(1, -1)];
};

export function Stats(props: StatsProps) {
  const [first, last, ...middle] = statsBoundariesAndMiddile(props.stats);
  return (
    <section class="bg-gray-50 pt-12 sm:pt-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {props?.line1}
          </h2>
          <p class="mt-3 text-xl text-gray-500 sm:mt-4">{props?.line2}</p>
        </div>
      </div>
      <div class="mt-10 bg-white pb-12 sm:pb-16">
        <div class="relative">
          <div class="absolute inset-0 h-1/2 bg-gray-50" />
          <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl">
              <dl class="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                <div class="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                  <dt class="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    {first[0]}
                  </dt>
                  <dd class="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                    {first[1]}
                  </dd>
                </div>
                {middle.map(([unit, numeral], i) => {
                  return (
                    <div class="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                      <dt class="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                        {unit}
                      </dt>
                      <dd class="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                        {numeral}
                      </dd>
                    </div>
                  );
                })}
                <div class="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt class="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    {last[0]}
                  </dt>
                  <dd class="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                    {last[1]}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
