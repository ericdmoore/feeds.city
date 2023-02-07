import type { PageProps } from "$fresh/server.ts";
import { NavBar } from "../islands/navbar.tsx";

export default function TestingPage(props: PageProps<Partial<null>>) {
  console.log("Testing page");
  return (
    <NavBar
      logo={{ src: "/feedcitylogo.svg", alt: "Feed City Logo" }}
      menus={{
        GroupA: [
          {
            name: "Item1",
            desc:
              "A wonderful description of item1, and it might even get truncated because its long, and it might even get truncated because its long",
            href: "#",
          },
        ],
        GroupB: [
          {
            name: "Item1",
            desc:
              "A wonderful description of item1, and it might even get truncated because its long, and it might even get truncated because its long",
            href: "#",
          },
        ],
      }}
    />
  );
}
