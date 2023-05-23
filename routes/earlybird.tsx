import NavBar from "../islands/public-navbar.tsx";
import CtaPanel from "../components/cta-panel.tsx";
import Pricing from "../components/public/pricing.tsx";
import SimplePricing from "../components/simple-pricing.tsx";

export default function () {
	return (
		<>
			<NavBar
				logo={{ src: "/feedcitylogo.svg", alt: "Feed City Logo" }}
				login={{ register: { href: "/register" }, auth: { href: "/login" } }}
				nav={{
					_: {
						"Sign In": { text: "Login", href: "/login" },
						"Sign Up": { text: "Logout", href: "/register" },
					},
				}}
			/>
			<SimplePricing
				title={{
					h2: "Get Access To The Earlybird Offer",
					p: "Only Available During Beta Development",
				}}
				lBox={{
					h3: "Lifetime Access",
					p: "The Earlybird Beta Offer Grants Lifetime Access to Feeds.City",
					dividerText: `What's Included`,
					greenCheckText: [
						"Beta Development Infleunce",
						"Bonus Marketplace Tokens",
						"Early Access To Beta Features",
						"Privleged Support Access",
					],
				}}
				rBox={{
					top: "Pay Once For Lifetime Access",
					price: { amt: "$129", unit: "USD" },
					ctaBtn: {
						href: "#",
						text: () => "Buy CHARTER MEMEBR  Lifetime Access",
					},
					clarification: {
						href: "#",
						text: () => "Learn Details of the Earlybird Lifetime Access",
					},
					teaser: {
						href: "#",
						text: () =>
							"Learn more about our scholarship program iF you are unable to afford the offer",
					},
				}}
			/>
			<SimplePricing />
			{
				/*
            Private forum access
            Member resources
            Entry to annual conference
            Official member t-shirt
        */
			}
			<Pricing />
			<CtaPanel />
		</>
	);
}
