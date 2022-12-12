// deno-lint-ignore-file require-await ban-unused-ignore
import type { Handlers, PageProps } from "$fresh/server.ts";

import { config } from "$std/dotenv/mod.ts";
import { Airtable } from "airtable";
import sendJson from "../lib/responder/sendjson.ts";

import { refreshCookieToken } from "../utils/cookies/refresh.ts";
import { getCookies } from "$std/http/cookie.ts";
import { jwKeyPair } from "../utils/ECkeys/grab.ts";

import { TopHatBlack } from "../components/TopHat.tsx";
import NavBar from "../islands/public-navbar.tsx";
import PublicHero from "../components/public-hero.tsx";
import PublicFeatures from "../components/public/featureGrid.tsx";
import Testimonial from "../components/public/testimonial.tsx";
import Pricing from "../components/public/pricing.tsx";
import Stats from "../components/public/stats.tsx";
import SignUp from "../islands/public-signup.tsx";
import Footer from "../components/public/footer.tsx";
import CtaPanel from "../components/cta-panel.tsx";

import v1token from "../utils/tokens/v1.ts";

import {
  Bolt,
  Chat_bubble_bottom_center_text,
  Globe_alt,
  Scale,
} from "../components/heroicons/outline.tsx";

// import { DynamoDBClient, PutItemCommand , type AttributeValue} from "@aws-sdk/client-dynamodb";
// import { string, number } from '../utils/dyn/mod.ts'
// import Counter from "../islands/Counter.tsx";

interface HomeProps {
  req: Request;
  jwt: string;
  exp: number;
}

export default function Home(props: PageProps<Partial<HomeProps>>) {
  return (
    <>
      <TopHatBlack
        title="Feeds.City"
        description="A citywide ecosystem of feeds to discover and ways to remix them"
        icon="/feedCityRingDropsLogo.svg"
      />
      <NavBar
        nav={{
          _: {
            "Sign In": { href: "/login" },
            "Sign Up": { href: "/register" },
          },
        }}
      />
      <PublicHero 
        logo = {{src:"/feedCityRingDropsLogo.svg", alt:"Feeds.City"}}
        h1="Subscribe On Your Terms"
        h1span=" With feeds.city "
        p={ () => 
          <span>In a world of corporate algorithms that rule your information, 
            <span class="text-indigo-600"> feeds.city </span> 
            is a vibrant ecosystem of feeds to read, write, & remix
          </span>
        }
        cta={{
          left: {text: "Get Started", href: "#", color:{bg:'indigo', text:'white'}}, 
          right: {text: "Live Demo", href: "#", color:{bg:'white', text:'indigo', hover: 'hover:bg-gray-50'}}
        }}
        heroImg={{
            src: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80",
            alt: "Feeds.City"
        }}
      />
      <SignUp
        token={props.data.jwt ?? "missing"}
        exp={props.data.exp ?? -1}
      />
      <PublicFeatures
        h2="Transactions"
        tagline="A Better Way To Send Money"
        supportingTagline="Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam."
        featureList={[
          {
            title: "Competitive exchange rates",
            subtitle:
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
            icon: () => <Globe_alt class="h-6 w-6" />,
          },
          {
            title: "No hidden fees",
            subtitle:
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
            icon: () => <Scale class="h-6 w-6" />,
          },
          {
            title: "Transfers are instant",
            subtitle:
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
            icon: () => <Bolt class="h-6 w-6" />,
          },
          {
            title: "Mobile notifications",
            subtitle:
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
            icon: () => <Chat_bubble_bottom_center_text class="h-6 w-6" />,
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
        line1="Trusted by developers from over 80 planets"
        line2="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium"
        stats={{ Pepperoni: "100%", Delivery: "24/7", Calories: "100k" }}
      />
      <Pricing />
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
 * Handler spin up a UUID for the session, Set it as a cookie, and return the UUID to the client
 * - the UUID will then be use to validate any subsequent requests from the client
 * - the request to jin the waitlist will include the UUID
 */
export const handler: Handlers = {
  GET: async (req, ctx) => {
    const v1 = v1token(await jwKeyPair(), Deno.env.get("KEY_ID")!);
    const { respHeaders, jwt, jwtData } = await refreshCookieToken(
      v1,
      60 * 15, /* 10 min */
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
    await config({ export: true, safe: true }).catch(() =>
      console.error("errored while processsing .env file")
    );

    const _email = new URL(req.url).searchParams.get("email");
    const email = _email ? decodeURIComponent(_email) : null;

    const _keyID = new URL(req.url).searchParams.get("keyID");
    const keyID = _keyID ? decodeURIComponent(_keyID) : null;

    const status = new URL(req.url).searchParams.get("status");
    const Status = status === "test" && keyID === Deno.env.get("KEY_D_PRIVATE")
      ? "test"
      : "WaitingToVerifyAddress";

    const token = new URL(req.url).searchParams.get("token") ||
      getCookies(req.headers)?.sessionID || null as string | null;
    const v1tok = v1token(await jwKeyPair(), Deno.env.get("KEY_ID")!);

    if (token && email) {
      const { payload } = await v1tok.parse(token);

      if (await v1tok.validate(token) && await v1tok.verify(token)) {
        const [apiKey, baseId, tableName] = await Promise.all([
          Deno.env.get("AIRTABLE_KEY"),
          Deno.env.get("AIRTABLE_BASE"),
          Deno.env.get("AIRTABLE_TABLE"),
        ]);
        const airtable = new Airtable({
          useEnv: false,
          apiKey,
          baseId,
          tableName,
        });

        const doesAlreadyExist = await airtable.select({
          maxRecords: 1,
          pageSize: 1,
          fields: ["Email", "Status"],
          filterByFormula: `{Email}="${email}"`,
        }).catch((er) => {
          console.error(">>>", er);
          return { er, records: [] as { id: string; [key: string]: string }[] };
        });

        const id =
          !("er" in doesAlreadyExist) && doesAlreadyExist?.records.length === 0
            ? (await airtable.create({ Email: email, Status })).id
            : doesAlreadyExist?.records[0].id ?? "id_FOUND_ERROR_INSTEAD";

        return sendJson(
          { id, email, jwt: await v1tok.mint({ ...payload, email }) },
          200,
          "OK",
        );
      } else {
        return sendJson(
          { jwt: await v1tok.mint({ ...payload, email }) },
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
