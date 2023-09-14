import type { Handlers } from "$fresh/server.ts";
import Counter from "../islands/Counter.tsx";

import { TopHatBlack } from "../components/TopHat.tsx";
import AppShell from "$components/AppShell.tsx";

// Evnatually this is a public marketing page

export default function Home() {
	const profile = { name: "Eric Moore", avatarURL: "" };
	return (
		<AppShell 
			menu={{activeSection: "Home"}}
			profile={{name: "Eric Moore", avatarURL:''}}>

			<TopHatBlack
				title="Federa"
				description="Descrbes federa"
				icon={[{ href: "/feedCityRingDropsLogo.svg", type: "image/svg+xml" }]}
			>
				<meta name="og:title" content="Federa" />
			</TopHatBlack>
			<div class="py-4 px-10 mx-auto max-w-screen-l">
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

// Redirect to login if not logged in
