import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";

import { TopHatBlack } from "../components/TopHat.tsx";
import AppShell from "$components/AppShell.tsx";

// Evnatually this is a public marketing page

// export const config: RouteConfig = {
// 	routeOverride: "/feeds*"
// };

export default function Home() {
	return (
		<AppShell 
			menu={{activeSection: "Home"}}
			profile={{name: "Eric Moore", avatarURL:''}}>
			<TopHatBlack
				title="Federa"
				description="Descrbes federa"
				icon={[{ 
					href: "/feedCityRingDropsLogo.svg", type: "image/svg+xml" 
				}]}
			>
				<meta name="og:title" content="Federa" />
			</TopHatBlack>
			<div class="p-4 mx-auto max-w-screen-md">
				<ul>
					<li>
						<a href="/ast">ast</a>
					</li>
					<li>
						<a href="/ast/http://example.com">ast/url</a>
					</li>
					<li>
						<a href="/ast/composition/http://example.com">
							ast/composition/url
						</a>
					</li>
					<li>
						<a href="/user">user</a>
					</li>
					<li>
						<a href="/user/register">user/register</a>
					</li>
					<li>
						<a href="/login">login</a>
					</li>
					<li>
						<a href="/logout">logout</a>
					</li>
				</ul>
			</div>
		</AppShell>
	);
}


export const handler: Handlers = {
	GET: async (req, ctx) => {

		const u = new URL(req.url)
		console.log('url: ',u)
		const rendered = await ctx.render({ activeMenu: 'Home'});

		return new Response(rendered.body, {
			status: 200,
			statusText: "OK",
		});
	}
}
// redirect to login if not logged in
// list of feeds
// add feed
// edit / remove feed
