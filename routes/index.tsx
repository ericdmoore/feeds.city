// deno-lint-ignore-file require-await ban-unused-ignore
import type { Handlers, PageProps } from "$fresh/server.ts";

import keys from "$lib/utils/keys.ts";
import envVars from "$lib/utils/vars.ts";
import sendJson from "$lib/responder/sendjson.ts";
import airtable from "$lib/clients/airtable.ts";

import { refreshCookieToken } from "../utils/cookies/refresh.ts";
import { getCookies } from "$std/http/cookie.ts";

import NavBar from "$islands/public-navbar.tsx";
import SignUp from "$islands/public-signup.tsx";

import { TopHatBlack } from "$components/TopHat.tsx";
import PublicHero from "$components/public-hero.tsx";
import PublicFeatures from "$components/public/featureGrid.tsx";
import Testimonial from "$components/public/testimonial.tsx";

// import Pricing from "../components/public/pricing.tsx";

import Stats from "$components/public/stats.tsx";
import Footer from "$components/public/footer.tsx";
import CtaPanel from "$components/cta-panel.tsx";

// import { Color } from "../types.ts";
import v1token, { validatiorsAvailable as availVals } from "../utils/tokens/v1.ts";

import { Adjustments_horizontal, Bookmark } from "../components/heroicons/outline.tsx";

import { Building_storefront, Magnifying_glass, Scissors, User_group } from "../components/heroicons/solid.tsx";

// import { DynamoDBClient, PutItemCommand , type AttributeValue} from "@aws-sdk/client-dynamodb";
// import { string, number } from '../utils/dyn/mod.ts'
// import Counter from "../islands/Counter.tsx";

interface HomeProps {
	req: Request;
	jwt: string;
	exp: number;
}

interface AirtableSideEffectRequestBase {
	apiToken: string;
	baseId: string;
	tableName: string;
}

interface AirtableSideEffectRequestDataInput extends Record<string, string | number | null | boolean> {
	Email: string;
	Status: string;
}

interface AirtableSideEffectResponse {
	id: string;
	createdTime?: string;
}

const sendToAirtable = async (
	client: AirtableSideEffectRequestBase,
	input: AirtableSideEffectRequestDataInput,
): Promise<AirtableSideEffectResponse> => {
	const air = airtable(client);
	const listedRecords = await air.LIST({ filterByFormula: `{Email}="${input.Email}"` }).json();
	let returnVal: AirtableSideEffectResponse;

	if (listedRecords.records.length > 0) {
		// found it
		// send back zeroth record
		returnVal = listedRecords.records[0];
	} else {
		// not found case
		// make it + send it back
		const createdRecords = await air.CREATE(input).json();
		returnVal = createdRecords.records[0];
	}
	return returnVal;
};

export default function Home(props: PageProps<Partial<HomeProps>>) {
	return (
		<>
			<TopHatBlack
				title="Feeds.City"
				description="An ecosystem of feeds to discover and ways to remix them"
				icon={[
					{ rel: "icon", href: "/feedcitylogo@1x.png", type: "image/png" },
					{ rel: "icon", href: "/feedcitylogo.svg", type: "image/svg+xml" },
				]}
			/>
			<NavBar
				logo={{ src: "/feedcitylogo.svg", alt: "Feed City Logo" }}
				login={{ register: { href: "/register" }, auth: { href: "/login" } }}
				nav={{
					_: {
						"Sign In": { text: "Log In", href: "/login" },
						"Sign Up": { text: "Sign Up", href: "/register" },
					},
				}}
			/>
			<PublicHero
				logo={{ src: "/feedcitylogo.svg", alt: "Feeds.City" }}
				h1="Know Your Scroll"
				h1span=" with feeds.city "
				p={() => (
					<>
						<span class="text-indigo-600">feeds.city</span>
						offers the world's 1<sup>st</sup>{"  "}<a class="font-bold" href="#">subscription proxy</a>
						that transforms your content on the fly. Enabled by an open marketplace, backed by a collective of
						developers, inspired by the quirky indie web.
					</>
				)}
				cta={{
					left: {
						text: "Subscription Proxy Wha?",
						href: "#",
						color: { bg: "indigo" as const, text: "white" as const },
					},
					right: {
						text: "Live Demo",
						href: "#",
						color: { bg: "white", text: "indigo", hover: "hover:bg-gray-50" },
					},
				}}
				heroImg={{
					src:
						"https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80",
					alt: "Feeds.City",
				}}
			/>
			<SignUp
				token={props.data.jwt ?? "missing"}
				exp={props.data.exp ?? -1}
			/>
			<PublicFeatures
				h2="Take Back Your Feed"
				tagline="A Better Way To Scroll Your Feed"
				supportingTagline="It matters how your feed is optimized. Is your feed actually yours? Now it really can be with feeds.city"
				featureList={[
					{
						title: "Distraction Free Reading",
						subtitle:
							"Reading requires focus. Focus requires concentration. Concentration is in constant battle by other interests. Clean up your reading, and it will clean up your mind.",
						icon: () => <Magnifying_glass class="h-6 w-6" />,
					},
					{
						title: "On The Fly Transforms",
						subtitle:
							"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
						icon: () => <Adjustments_horizontal class="h-6 w-6" />,
					},
					{
						title: "Emerging Marketplace",
						subtitle:
							"Get in on the ground level withj a new developer marketplace. There are developers who want to hear what you are looking for, and their are FeedFunctions (like an app) that improves your feed quality.",
						icon: () => <Building_storefront class="h-6 w-6" />,
					},
					{
						title: "Listening for Everything",
						subtitle:
							"The web is full of vibrant text. But some of us are auditory learners. Some people like to listen to everything. Now anything is listenable",
						icon: () => <Scissors class="h-6 w-6" />,
					},
					{
						title: "Longform Reading Discovery",
						subtitle:
							"Not all information is created equal. Skip out on bloated 'news' about things that won't matter in 10 minutes let alone 10 days. Start digging into longform ideas that make you are more interesting person",
						icon: () => <Bookmark class="h-6 w-6" />,
					},
					{
						title: "Integrated Social Signal",
						subtitle:
							"Just because you dont want to be advertised to all the time, You should understand the goal of what is shown to you. Is it to make an advertiser happy, or is it to engage your own brain.  how what you are being Read things for you that are lighly influenced by the things you follow",
						icon: () => <User_group class="h-6 w-6" />,
					},
				]}
			/>
			<Testimonial
				author={{ name: "Marie Chilvers", title: "CEO, Workcation" }}
				bgImg={{
					src: "https://tailwindui.com/img/logos/workcation-logo-white.svg",
					alt: "Workstation Marketing background Image",
				}}
				testimonial={`This app has completely transformed how we interact with customers. We've seen record bookings, higher customer satisfaction, and reduced churn.`}
			/>
			{/* Sausage:'99.999%' */}
			<Stats
				line1="Trusted by developers from over 80 counties"
				line2="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium"
				stats={{
					"Feed Functions": "29",
					"On-The-Fly": "100%",
					ActivityPub: "24/7",
				}}
			/>
			{/* <Pricing /> */}
			<CtaPanel />
			<Footer
				nav={{
					About: "/about",
					Blog: "/blog",
					Jobs: "/jobs",
					Press: "/press",
					Market: "/market",
				}}
				social={{
					Twitter: { alias: "twitter", href: "https://twitter.com" },
					Discord: { alias: "discord", href: "https://discord.com" },
					YouTube: { alias: "youtube", href: "https://youtube.com" },
					Twitch: { alias: "twitch", href: "https://twitch.com" },
					Reddit: { alias: "reddit", href: "https://reddit.com" },
					GitHub: { alias: "github", href: "https://github.com" },
				}}
			/>
		</>
	);
}

/**
 * Handler spins up a UUID and wraps it in a JWT, which gets set as a cookie
 * - the JWT returns to autghorize the waitlist request
 * - the UUID will then be use to validate any subsequent requests from the client
 * - the request to join the waitlist should include the UUID
 */
export const handler: Handlers = {
	GET: async (req, ctx) => {
		const env = await envVars("<< MISSING >>");
		const v1 = v1token(
			{
				privateKey: keys.key.ecdsa.sign,
				publicKey: keys.key.ecdsa.verify,
			},
			env("KEY_ID")!,
			[
				availVals.isFromMe,
				availVals.isV1Token,
				availVals.validIssuanceDate,
			],
		);
		const { respHeaders, jwt, jwtData } = await refreshCookieToken(
			v1,
			60 * 15, /* 15 min */
		)(
			new Headers(req.headers),
			"sessionID",
		);

		const rendered = await ctx.render({
			req,
			jwt,
			exp: jwtData.headers?.exp as number,
		} as HomeProps);

		return new Response(rendered.body, {
			headers: respHeaders,
			status: 200,
			statusText: "OK",
		});
	},

	POST: async (req) => {
		const env = await envVars("<< MISSING >>");

		const _email = new URL(req.url).searchParams.get("email");
		const Email = _email ? decodeURIComponent(_email) : null;

		const _keyID = new URL(req.url).searchParams.get("keyID");
		const keyID = _keyID ? decodeURIComponent(_keyID) : null;

		const status = new URL(req.url).searchParams.get("status");
		const Status = status === "test" && keyID === env("KEY_D_PRIVATE") ? "test" : "WaitingToVerifyAddress";

		const token = new URL(req.url).searchParams.get("token") ||
			getCookies(req.headers)?.sessionID || null as string | null;

		const v1tok = v1token({
			privateKey: keys.key.ecdsa.sign,
			publicKey: keys.key.ecdsa.verify,
		}, env("KEY_ID")!);

		if (token && Email) {
			const { payload } = await v1tok.parse(token);

			if (await v1tok.validate(token) && await v1tok.verify(token)) {
				const [apiToken, baseId, tableName] = [
					env("AIRTABLE_TOKEN"),
					env("AIRTABLE_BASE"),
					env("AIRTABLE_TABLE"),
				];
				const id = await sendToAirtable({ apiToken, baseId, tableName }, { Email, Status });

				return sendJson(
					{ id, Email, jwt: await v1tok.mint({ ...payload, Email }) },
					200,
					"OK",
				);
			} else {
				return sendJson(
					{ jwt: await v1tok.mint({ ...payload, Email }) },
					401,
					"INVALID_TOKEN",
				);
			}
		} else {
			const errorCoode = 401;
			const errorTitle = "INVALID_REQUEST";
			return sendJson(
				{
					errorCoode,
					errorTitle,
					errorMsg: ` parameters: 'token' + 'email' are both required`,
				},
				errorCoode,
				errorTitle,
			);
		}
	},
};
