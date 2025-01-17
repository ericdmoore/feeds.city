// curl https://daringfireball.net/feeds/json >> tests/mocks/jsonFeed/daringFireball.json
import dfb from "./jsons/daringFireball.json" with { type: "json" };

export const jsonFeed = JSON.stringify(dfb);
export const rss = `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>Daring Fireball</title>
<subtitle>By John Gruber</subtitle>
<link rel="alternate" type="text/html" href="https://daringfireball.net/" />
<link rel="self" type="application/atom+xml" href="https://daringfireball.net/feeds/main" />
<id>https://daringfireball.net/feeds/main</id>


<updated>2022-04-22T01:12:06Z</updated><rights>Copyright © 2022, John Gruber</rights><entry>
	<title>Sheryl Sandberg Pressured Daily Mail to Drop Unflattering Story About Bobby Kotick While She Was Dating Him</title>
	<link rel="alternate" type="text/html" href="https://www.wsj.com/articles/sandberg-facebook-kotick-activision-blizzard-daily-mail-11650549074" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4r" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/21/sandberg-kotick-daily-mail-online" />
	<id>tag:daringfireball.net,2022:/linked//6.39051</id>
	<published>2022-04-22T01:12:06Z</published>
	<updated>2022-04-22T01:12:06Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Ben Fritz, Keach Hagey, Kirsten Grind, and Emily Glazer, reporting for The Wall Street Journal (<a href="https://apple.news/Aop-9TUaTTteYo3bRSAsPAA">News+ link</a>):</p>

<blockquote>
  <p>In 2016 and 2019, Ms. Sandberg contacted the digital edition of
the Daily Mail, which was reporting on a story that would have
revealed the existence of a temporary restraining order against
Mr. Kotick that had been obtained by a former girlfriend in 2014,
according to people involved in the article and the campaigns to
stop its publication.</p>

<p>Working with a team that included Facebook and Activision
employees as well as paid outside advisers, Ms. Sandberg and Mr.
Kotick developed a strategy to persuade the Daily Mail not to
report on the restraining order, first when they began dating in
2016 and again around the time they were breaking up in 2019, the
people said. Among other concerns, Ms. Sandberg’s legal and
public-relations advisers, both inside and outside Facebook,
worried that a story would reflect negatively on her reputation as
an advocate for women.</p>
</blockquote>

<p>It’s a well-worn adage but never more true: it’s the cover-up that does you in. Sandberg’s efforts to bury this story are now far more damaging to her reputation than the actual story would have been. She wasn’t even involved — only Kotick was.</p>

<blockquote>
  <p>Facebook recently started a review of Ms. Sandberg’s actions and
whether she violated the company’s rules, according to people
close to her and to Mr. Kotick. The review started after The Wall
Street Journal began reporting on the incidents late last year,
those people said.</p>
</blockquote>

<p>Sandberg might be in some actual trouble over this. Having Facebook staffers do dirty work for Facebook is shitty, but it’s their job. Having them do dirty work for a boyfriend at Activision is something else. I’m no corporate governance expert but I think if she had called the Daily Mail, on her own, only as herself, it’d arguably have been defensible.</p>

<blockquote>
  <p>The digital edition of the Daily Mail, which is called the
MailOnline and operates separately from the print publication,
never published a story. Its reporting stemmed from 2014 court
filings it had obtained that showed that an ex-girlfriend of Mr.
Kotick’s had received a temporary restraining order against him
after alleging that he harassed her at her home, according to
people familiar with the situation and documents reviewed by the
Journal.</p>

<p>The woman had initially petitioned for a longer-lasting order, but
three weeks later the matter was removed from the court calendar
at the request of both parties, and the temporary restraining
order ended and the petition was dismissed, according to Los
Angeles County Superior Court records. The accuser later told
people that the declaration she filed for the restraining order
included many allegations that were either exaggerated or untrue,
according to some of the people with knowledge of the matter.</p>
</blockquote>

<p>This is the weirdest part of the story — Kotick’s ex-girlfriend effectively had <em>nevermind</em>ed the whole thing. If the story had come out in 2016 or 2019, it would have blown over as nothing more than a bad breakup.</p>

<div>
<a  title="Permanent link to ‘Sheryl Sandberg Pressured Daily Mail to Drop Unflattering Story About Bobby Kotick While She Was Dating Him’"  href="https://daringfireball.net/linked/2022/04/21/sandberg-kotick-daily-mail-online">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Elon Musk Says He Has the Dough to Back Twitter Acquisition</title>
	<link rel="alternate" type="text/html" href="https://www.axios.com/elon-musk-twitter-funding-d0a9c8e1-9c75-4dc9-948c-4618588450ca.html" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4q" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/21/musk-dough-twitter" />
	<id>tag:daringfireball.net,2022:/linked//6.39050</id>
	<published>2022-04-21T17:39:22Z</published>
	<updated>2022-04-21T17:58:50Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Dan Primack, reporting for Axios:</p>

<blockquote>
  <p>Elon Musk on Thursday disclosed in a <a href="https://www.sec.gov/Archives/edgar/data/1418091/000110465922048128/tm2213229d1_sc13da.htm">federal securities
filing</a> that he doesn’t yet have any equity partners on his
takeover bid for Twitter, but said that he has secured billions of
dollars worth of loan commitments from Morgan Stanley. [...]</p>

<p>Musk committed to invest up to $21 billion of his own money,
although this wouldn’t preclude him from cutting back on that
amount by bringing on equity partners at a later date. He also
said he has $13 billion in committed debt financing from Morgan
Stanley and $12.5 billion of margin loan commitments from Morgan
Stanley.</p>
</blockquote>

<div>
<a  title="Permanent link to ‘Elon Musk Says He Has the Dough to Back Twitter Acquisition’"  href="https://daringfireball.net/linked/2022/04/21/musk-dough-twitter">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>The Atlantic: ‘Stop Saying Vaccines Don’t Work for the Immunocompromised’</title>
	<link rel="alternate" type="text/html" href="https://www.theatlantic.com/health/archive/2022/04/covid-vaccine-is-effective-immunocompromised/629596/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4p" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/21/atlantic-vaccines-immunocompromised" />
	<id>tag:daringfireball.net,2022:/linked//6.39049</id>
	<published>2022-04-21T16:55:40Z</published>
	<updated>2022-04-21T16:55:40Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Benjamin Mazer, writing for The Atlantic:</p>

<blockquote>
  <p>But well-intentioned stories on this issue sometimes overstate the
case, claiming that COVID shots for the immunocompromised are
“<a href="https://web.archive.org/web/20220328104931/https:/www.nytimes.com/2022/03/28/briefing/covid-omicron-caseload-antiviral-pills.html">ineffective</a>” or “<a href="https://www.theguardian.com/society/2021/dec/07/michele-brown-was-vaccinated-but-had-a-suppressed-immune-system-would-better-health-advice-have-saved-her">cannot work on everyone</a>.”
That is incorrect, and it hinders uptake of vaccines. The shots do
provide these patients with very meaningful protection as a rule,
Jennifer Nuzzo, the director of the Pandemic Center at Brown
University School of Public Health, told me. To suggest otherwise
“is just a complete distortion.... It’s just scaring people, and
it’s not saving lives.” [...]</p>

<p>Antibodies matter, but they matter most for <a href="https://www.science.org/doi/10.1126/science.abm3425">preventing
illness</a>, at any level of severity. Regarding the most
dangerous outcomes from disease, recent research from the CDC
indicates that — shot for shot — the immunocompromised achieve
<em>most of the same benefits as healthy people</em>. One study,
published in March, looked at the pandemic’s Delta wave and found
that three doses of an mRNA vaccine gave immunocompromised people
<a href="https://www.bmj.com/content/376/bmj-2021-069761">87 percent protection</a> against hospitalization, compared
with 97 percent for others. Another CDC report, also out last
month, suggested that on the very worst outcomes — the need for a
breathing tube, or death — mRNA vaccines were <a href="https://www.cdc.gov/mmwr/volumes/71/wr/mm7112e1.htm">74 percent
effective</a> for immunocompromised patients (including many
who hadn’t gotten all their shots), and 92 percent effective for
the immunocompetent. A 10-to-20-percentage-point gap in safety
from the most dire outcomes is consequential, especially for those
who are most susceptible to the disease. Still, these results
should reassure us that the immunocompromised are not fighting
this battle unarmed.</p>
</blockquote>

<p>Vaccines, vaccines, vaccines.</p>

<div>
<a  title="Permanent link to ‘The Atlantic: ‘Stop Saying Vaccines Don’t Work for the Immunocompromised’’"  href="https://daringfireball.net/linked/2022/04/21/atlantic-vaccines-immunocompromised">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>CNN+ Streaming Service to Shut Down at End of Month</title>
	<link rel="alternate" type="text/html" href="https://www.nytimes.com/2022/04/21/business/cnn-plus-shutting-down.html" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4o" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/21/cnn-plus" />
	<id>tag:daringfireball.net,2022:/linked//6.39048</id>
	<published>2022-04-21T16:02:38Z</published>
	<updated>2022-04-21T16:08:07Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>The New York Times:</p>

<blockquote>
  <p>Warner Bros. Discovery has decided to shut down CNN+, the ballyhooed streaming service that had been intended to bring CNN into the digital future, just weeks after its splashy debut, according to two people familiar with its plans.</p>

<p>The service is set to cease operations on April 30, the sources said.</p>

<p>Chris Licht, the incoming president of CNN, called an all-hands meeting among CNN+ staffers for noon on Thursday to share the news.</p>
</blockquote>

<p>Ignominious, to say the least. Even <a href="https://daringfireball.net/search/quibi">Quibi</a> lasted <a href="https://en.wikipedia.org/wiki/Quibi">eight months</a>.</p>

<div>
<a  title="Permanent link to ‘CNN+ Streaming Service to Shut Down at End of Month’"  href="https://daringfireball.net/linked/2022/04/21/cnn-plus">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>HomePods Are Appreciating in Value</title>
	<link rel="alternate" type="text/html" href="https://www.theverge.com/2022/4/19/23033038/apple-homepod-appreciate-price-ebay-used-box" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4n" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/20/homepod-value" />
	<id>tag:daringfireball.net,2022:/linked//6.39047</id>
	<published>2022-04-21T01:31:47Z</published>
	<updated>2022-04-21T13:34:11Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Sean Hollister, writing for The Verge:</p>

<blockquote>
  <p>I thought it was really strange when Apple kept selling the
original $299 HomePod months after it got discontinued. But now,
it’s starting to make sense — not only are some people still
willing to pay a premium for the somewhat smart speaker, they’re
willing to pay <em>more than Apple charged for it</em>.</p>

<p>We took a look at eBay sales numbers after spotting <a href="https://twitter.com/ChanceHMiller/status/1516537846747828228">9to5Mac
editor-in-chief Chance Miller’s tweet</a>, and we soon discovered
it wasn’t just a joke: on average, an Apple HomePod fetched $375
this past week. That’s 25 percent more than Apple charged.</p>
</blockquote>

<p>I don’t think it’s strange or incredible that HomePods are fetching $375 on eBay. They’re wonderful devices, and there does not exist any competing product with even vaguely the same sound quality at anything near their price. People who think HomePods are overpriced peers to Alexa and Google voice dinguses have no idea how good HomePods sound, especially when paired.</p>

<p>What’s strange and somewhat incredible is that Apple discontinued them without a replacement.</p>

<div>
<a  title="Permanent link to ‘HomePods Are Appreciating in Value’"  href="https://daringfireball.net/linked/2022/04/20/homepod-value">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Brazilian Judge Rules That Apple Must Compensate Customer Over $1,000 for Selling iPhone Without a Charger</title>
	<link rel="alternate" type="text/html" href="https://www.macrumors.com/2022/04/20/apple-compensate-brazilian-customer-iphone-charger/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4m" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/20/brazilian-judge" />
	<id>tag:daringfireball.net,2022:/linked//6.39046</id>
	<published>2022-04-21T01:12:46Z</published>
	<updated>2022-04-21T01:12:46Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Sami Fathi, MacRumors:</p>

<blockquote>
  <p>Apple must compensate a Brazilian customer who recently purchased
an iPhone for selling the device without a charger included in the
box, which violates consumer law, a judge has ruled.</p>

<p>Apple’s decision to remove the charger in the box sparked
controversy in 2020. Apple claims the move is for environmental
reasons, claiming the decision is equivalent to removing nearly
450,000 cars from the road per year.</p>

<p>Nonetheless, the move has sparked some public and legal outcry. In
the latest development, a judge in Brazil, a country that has
long-questioned Apple’s reasoning to remove the accessory, is
forcing Apple to compensate a customer nearly $1,075 for the lack
of a charger.</p>
</blockquote>

<p>Brazil has apparently decided to <a href="https://daringfireball.net/linked/2022/03/24/eu-sideloading-legislation">compete with the E.U.</a> for the idiot crown.</p>

<div>
<a  title="Permanent link to ‘Brazilian Judge Rules That Apple Must Compensate Customer Over $1,000 for Selling iPhone Without a Charger’"  href="https://daringfireball.net/linked/2022/04/20/brazilian-judge">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Biden Administration Looks Gift Horse in Mouth, But Can’t See It Because the Horse Is Wearing a Mask</title>
	<link rel="alternate" type="text/html" href="https://www.bloomberg.com/opinion/articles/2022-04-19/mask-mandate-judge-s-ruling-is-gift-to-democrats?sref=5KSwFgaY" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4l" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/19/biden-admin-gift-horse" />
	<id>tag:daringfireball.net,2022:/linked//6.39045</id>
	<published>2022-04-20T00:27:42Z</published>
	<updated>2022-04-20T01:02:59Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Matt Yglesias, in his column for Bloomberg:</p>

<blockquote>
  <p>The federal judge who on Monday <a href="https://www.bloomberg.com/news/articles/2022-04-18/mask-mandate-for-planes-trains-overturned-by-florida-judge?srnd=premium&amp;sref=EP6bV7CS">struck down</a> the CDC’s mask
mandate in airports, airplanes and other public transit did
President Joe Biden and the Democratic Party a favor.</p>

<p>This lingering non-pharmaceutical intervention, at a time when
mask rules have been dropped in virtually every other context
(including in the U.S. Capitol Building) has become an
embarrassment at a time when the country has otherwise moved on
from so-called NPIs.</p>

<p>The basic problem is that the rule itself was issued by the
Centers for Disease Control and Prevention, which is a scientific
agency — and a conservative one at that. CDC guidelines suggest,
for example, that nobody should eat rare steak or runny eggs, and
that a woman should not have more than one alcoholic drink a day.</p>

<p>The science behind those calls may be sound. But they are sharply
at odds with the habits and values of huge numbers of Americans.
Fortunately, they do not have the force of law. Alcohol
regulations are made by state legislatures, which ideally will be
guided but not controlled by science as they make laws about
public health.</p>
</blockquote>

<p>The CDC is even more conservative than Yglesias suggests. They recommend cooking steak to 145°F, which is a hell of a lot more well-done than merely “not rare”. I’d send a steak cooked that well-done back to the kitchen.</p>

<blockquote>
  <p>In reality the White House should have <a href="https://www.bloomberg.com/opinion/articles/2022-02-13/mask-mandate-biden-should-put-the-cdc-in-its-place?sref=EP6bV7CS">put its foot down</a> and
lifted the rule weeks ago. But its reluctance to meddle with a
scientific agency is understandable. At the same time,
scientifically speaking, it’s always going to be the case that
everyone wearing a mask will be at least a little bit safer than
everyone not wearing a mask. The problem is that mask-wearing is
annoying and socially divisive, with efforts to enforce the rule
generating clashes between passengers and airline staff.</p>

<p>So the judge — a Trump appointee who is surely no fan of Biden,
Pelosi or their party — may have succeeded in getting an awkward
topic off the agenda. For that, Democrats ought to be grateful.</p>
</blockquote>

<p>Well, <a href="https://twitter.com/AnthonyColeyDOJ/status/1516541173799788554">so much for that</a>.</p>

<div>
<a  title="Permanent link to ‘Biden Administration Looks Gift Horse in Mouth, But Can’t See It Because the Horse Is Wearing a Mask’"  href="https://daringfireball.net/linked/2022/04/19/biden-admin-gift-horse">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Netflix Shares Drop 25% After Company Reports Losing Subscribers for First Time in a Decade</title>
	<link rel="alternate" type="text/html" href="https://www.cnbc.com/2022/04/19/netflix-nflx-earnings-q1-2022.html" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4k" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/19/netflix-loses-subs" />
	<id>tag:daringfireball.net,2022:/linked//6.39044</id>
	<published>2022-04-19T23:08:08Z</published>
	<updated>2022-04-19T23:24:44Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Sarah Whitten, reporting for CNBC:</p>

<blockquote>
  <p>Netflix on Tuesday reported a loss of 200,000 subscribers during
the first quarter — its first decline in paid users in more than
a decade — and warned of deepening trouble ahead. The company’s
shares cratered more than 25% in extended hours after the report
on more than a full day’s worth of trading volume. Fellow
streaming stocks Roku, Spotify and Disney also tumbled in the
after-hours market after Netflix’s brutal update.</p>

<p>Netflix is forecasting a global paid subscriber loss of 2 million
for the second quarter. The last time Netflix lost subscribers was
October 2011. [...]</p>

<p>Co-CEO Reed Hastings said the company is <a href="https://www.cnbc.com/2022/04/19/netflix-is-exploring-lower-priced-ad-supported-plans-after-years-of-resisting.html">exploring lower-priced,
ad-supported tiers</a> as a means to bring in new subscribers
after years of resisting advertisements on the platform.</p>

<p>Netflix previously told shareholders it expected to add 2.5
million net subscribers during the first quarter. Analysts had
predicted that number would be closer to 2.7 million. During the
same period a year ago, Netflix added 3.98 million paid users.</p>
</blockquote>

<p>That’s a big miss — expecting to add 2.5 million subscribers and instead losing some, and now expecting to <em>lose</em> millions next quarter.</p>

<p>Here’s one spitball idea for what’s wrong: too much focus on <em>quantity</em> of content and not nearly enough on <em>quality</em>. My wife and I have been slowly watching old seasons of <em>Seinfeld</em> on Netflix when we have nothing else to watch, or just want to watch one more easily-digestible show before going to bed. But it occurred to me this week that we haven’t watched <em>anything</em> else on Netflix in weeks. Just old <em>Seinfelds</em>. We’re watching lots of stuff on HBO Max and Apple TV+, and some new movies on Disney+, Hulu, and even Paramount+ — but not Netflix. This is a sample size of one family of three, but at this point, if we were forced to drop one of our streaming subscriptions, Netflix might be the first to go, based purely on what we’re actually watching. It seems weird that the only thing we’ve watched recently on Netflix is a sitcom from 25 years ago. The last Netflix original I can recall watching was (the admittedly very good) <em><a href="https://letterboxd.com/film/dont-look-up-2021/">Don’t Look Up</a></em>, and we’re looking forward to the final episodes of <em>Ozark</em>. But right now HBO Max has <em><a href="https://letterboxd.com/film/the-batman/">The Batman</a></em>, Disney+ has all their recent theatrical releases and <em>The Kenobi Chronicles</em> coming soon, and Apple TV+ has <em>Slow Horses</em> and <em>Severance</em>. (<em>Severance</em> is probably my favorite show or movie in years — it’s so fucking good.)</p>

<p>The average quality of the average Netflix original just isn’t very good compared to their competition — not enough to justify the highest subscription prices in the industry.</p>

<div>
<a  title="Permanent link to ‘Netflix Shares Drop 25% After Company Reports Losing Subscribers for First Time in a Decade’"  href="https://daringfireball.net/linked/2022/04/19/netflix-loses-subs">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>NFL Sunday Ticket: How Much Do Bars and Restaurants Pay?</title>
	<link rel="alternate" type="text/html" href="https://tvanswerman.com/2021/10/19/nfl-sunday-ticket-how-much-do-bars-restaurants-pay/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4i" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/19/nfl-sunday-ticket-bars-and-restaurants" />
	<id>tag:daringfireball.net,2022:/linked//6.39042</id>
	<published>2022-04-19T22:36:29Z</published>
	<updated>2022-04-21T01:23:37Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Philip Swann, writing at The TV Answer Man back in October:</p>

<blockquote>
  <p>We don’t know how many bars and restaurants actually subscribe to
the Sunday Ticket, but we do know how much they pay if they do and
it’s <em>significant</em>. <a href="https://www.directv.com/forbusiness/large-restaurants-and-bars/">According to DirectTV’s web site</a>, a
bar/restaurant with a Fire Code Occupancy (FCO) of 101-200 must
pay $6,000 a season for the Ticket. Owners of establishments with
a FCO of 201-350 must pay $8,500; those with 351-500 must pay
$12,350 while those with places that can serve 501-750 people must
pay $13,700.</p>

<p>The rate goes even higher: If you have a bar/restaurant that can
serve 751-1000 people, you would have to pay $19,000 for the
Sunday Ticket; $28,125 for a place with a FCO of 1,001-1500; and
$37,500 for an establishment with a FCO of 1,501 to 2,000.</p>

<p>Finally, if you have a mega place that can serve between 2,001 and
5,000 people, you’ll need to fork over $78,000!</p>
</blockquote>

<p>I omitted bars and restaurants from <a href="https://daringfireball.net/2022/04/apple_nfl_sunday_ticket">my piece yesterday</a> on Apple purportedly having already secured the rights for Sunday Ticket streaming rights in 2023, but it’s worth thinking about. Even small bars and restaurants pay a <em>lot</em> more for Sunday Ticket than home users do. And my understanding is that businesses <em>have</em> to get it via satellite DirecTV service — there’s no streaming option.</p>

<p>Even consumer Sunday Ticket is <a href="https://nflsthelp.directv.com/hc/en-us/articles/204503399-How-do-I-find-out-if-I-am-eligible-to-purchase-NFLSUNDAYTICKET-TV-">only available via streaming for certain people</a> — students, and people who live in multi-unit buildings who can’t install a satellite dish, for example.</p>

<p>I would expect all of this to change under Apple. Swann speculates that even if Apple secures the rights for streaming, that <em>businesses</em> might still be served by DirecTV. I can’t see that happening. No way does Apple pay $2 or 2.5 billion for <em>partial</em> Sunday Ticket rights. At that price, Apple should reasonably demand exclusive rights, which means Sunday Ticket will only be available via streaming, and NFL fans can climb up on their roofs and disconnect their DirecTV dishes.</p>

<p>When you think about it, it seems obvious the NFL would want to move in this direction. Even if, say, Apple bid the exact same amount for Sunday Ticket as DirecTV, it seems to me the NFL would prefer to sell the rights to Apple. Streaming is the future. Satellite TV service has always been a niche, at best, and at this point is going the way of the dodo. If you’ll forgive mixing sports metaphors, <a href="https://latimesblogs.latimes.com/sports_blog/2011/10/steve-jobs-used-wayne-gretzky-as-inspiration.html">skate to where the puck is heading</a>, not where it’s been.</p>

<p>The question is, how will Apple charge bars and restaurants for Sunday Ticket? And what sort of equipment will they need to set it up <em>and</em> control it?</p>

<div>
<a  title="Permanent link to ‘NFL Sunday Ticket: How Much Do Bars and Restaurants Pay?’"  href="https://daringfireball.net/linked/2022/04/19/nfl-sunday-ticket-bars-and-restaurants">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Open Letter to Apple About Final Cut Pro</title>
	<link rel="alternate" type="text/html" href="https://www.gopetition.com/petitions/support-open-letter-to-tim-cook-about-final-cut-pro.html" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4h" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/19/final-cut-pro-open-letter" />
	<id>tag:daringfireball.net,2022:/linked//6.39041</id>
	<published>2022-04-19T19:34:39Z</published>
	<updated>2022-04-20T00:13:07Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>From an open letter signed by over 100 industry professionals:</p>

<blockquote>
  <p>Final Cut Pro is a wonderful application used by many YouTubers,
education and small business content creators worldwide. We know
why it is successful. It is liberating, efficient and fun to work
with. But, unfortunately in professional film and TV, editors who
use Final Cut Pro are a tiny minority.</p>
</blockquote>

<p>I seldom link to open letters because I generally think they’re pointless. And I wavered on linking to this one because it isn’t particularly well-written. The above paragraph that I quoted is the nut of it: Final Cut Pro has great bones, many pros who do use it love it, but it’s hard to use in many pro workflows because so few pros do use it. This quote from the preface to the actual letter addresses it:</p>

<blockquote>
  <p>Steven Sanders, editor in chief of the Fox TV series <em>War of
the Worlds</em> season 3, said, “The two main reasons why I am often not
allowed to choose my favourite editing application, which is Final
Cut Pro are:</p>

<ol>
<li><p>Collaboration! Editing big productions needs collaboration.
Different users have to be able to access the same library at
the same time. There is no way around this. Avid Media Composer
does it and even DaVinci Resolve does it. Apple still targets
the single user. They have to change that. That will change
everything.</p></li>
<li><p>Many professionals do not know how Final Cut works. They are
afraid of it, even regard is as ‘iMovie Pro.’ I hear that all
the time in my business. This perception really has to change.”</p></li>
</ol>
</blockquote>

<p>In other words, these Final Cut Pro-using professionals are asking Apple to do whatever it takes to make Final Cut Pro more popular in the industry. That it’s so seldom used — to name one example, it’s not on Netflix’s list of approved products for their own commissioned productions — is proof that something has gone deeply awry.</p>

<p>Scott Simmons, writing at ProVideo Coalition, <a href="https://www.provideocoalition.com/an-open-letter-to-tim-cook-about-final-cut-pro-signed-by-editors-and-post-production-pros-around-the-world/">has culled a bunch of insightful comments from fellow signers of the letter</a>.</p>

<div>
<a  title="Permanent link to ‘Open Letter to Apple About Final Cut Pro’"  href="https://daringfireball.net/linked/2022/04/19/final-cut-pro-open-letter">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	
	<link rel="alternate" type="text/html" href="https://l.kolide.co/3OmQZOO" />
	<link rel="shorturl" href="http://df4.us/u4j" />
	<link rel="related" type="text/html" href="https://daringfireball.net/feeds/sponsors/2022/04/kolide_--_endpoint_security_po" />
	<id>tag:daringfireball.net,2022:/feeds/sponsors//11.39043</id>
	<author><name>Daring Fireball Department of Commerce</name></author>
	<published>2022-04-19T18:44:48-05:00</published>
	<updated>2022-04-19T18:44:48-05:00</updated>
	<content type="html" xml:base="https://daringfireball.net/feeds/sponsors/" xml:lang="en"><![CDATA[
<p>At Kolide, we believe the supposedly Average Person is the key to unlocking a new class of security detection, compliance, and threat remediation. So do the hundreds of organizations that send important security notifications to employees from Kolide’s Slack app.  </p>

<p>Collectively, we know that organizations can dramatically lower the actual risks they will likely face with a structured, message-based approach. More importantly, they’ll be able to engage end-users to fix nuanced problems that can’t be automated.</p>

<p><a href="https://l.kolide.co/3OmQZOO">Try Kolide Free for 14 Days; no credit card required</a>.</p>

<p><a href="https://l.kolide.co/36EqHGx">Honest.Security</a> is one part guide and another-part manifesto that defines a user-first approach to security and IT compliance. It’s not just Kolide’s north star but also an aspirational roadmap. It’s our positive contribution to counterbalance the worrying upward trend of human-hostile cyber security, device management, and workplace surveillance philosophies that we’ve seen reach a fever pitch as organizations adapt to the long-term term prospects of remote work.</p>

<div>
<a  title="Permanent link to ‘Kolide — Endpoint Security Powered by People’"  href="https://daringfireball.net/feeds/sponsors/2022/04/kolide_--_endpoint_security_po">&nbsp;★&nbsp;</a>
</div>

	]]></content>
	<title>[Sponsor] Kolide -- Endpoint Security Powered by People</title></entry><entry>
	<title>‘How I Experience the Web Today’</title>
	<link rel="alternate" type="text/html" href="https://how-i-experience-web-today.com/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4g" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/19/how-i-experience-the-web-today" />
	<id>tag:daringfireball.net,2022:/linked//6.39040</id>
	<published>2022-04-19T18:35:15Z</published>
	<updated>2022-04-19T18:35:38Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Only barely, just barely, a parody.</p>

<p>(You’ll want to disable any content blockers you have installed for this one.)</p>

<div>
<a  title="Permanent link to ‘‘How I Experience the Web Today’’"  href="https://daringfireball.net/linked/2022/04/19/how-i-experience-the-web-today">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Facebook on 30 Percent Platform Fees: ‘Hold Our Beer’</title>
	<link rel="alternate" type="text/html" href="https://www.marketwatch.com/story/facebook-parent-meta-set-to-take-nearly-50-cut-from-virtual-sales-within-its-metaverse-11649885375" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4f" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/18/facebook-platform-fees" />
	<id>tag:daringfireball.net,2022:/linked//6.39039</id>
	<published>2022-04-19T00:40:03Z</published>
	<updated>2022-04-19T00:40:14Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Jon Swartz, reporting for MarketWatch:</p>

<blockquote>
  <p>Meta said <a href="https://about.fb.com/news/2022/04/testing-creator-monetization-horizon-worlds/">in a blog post</a> Monday it is allowing a handful of
Horizon Worlds creators to sell virtual assets that could
eventually include NFTs. Virtual-reality platform Horizon Worlds
is considered an integral piece of Meta’s unfolding metaverse. The
company said it will take up to 47.5% on each transaction, which
includes a “hardware platform fee” of 30% via its Meta Quest
Store, as well as a 17.5% cut on Horizon Worlds.</p>

<p>“We think it’s a pretty competitive rate in the market. We
believe in the other platforms being able to have their share,”
Vivek Sharma, Meta’s vice president of Horizon, <a href="https://www.theverge.com/2022/4/11/23020684/meta-horizon-worlds-test-creators-sell-virtual-items-monetization">told The
Verge</a>. [...]</p>

<p>“Meta has repeatedly taken aim at Apple for charging developers a
30% commission for in-app purchases in the App Store — and have
used small businesses and creators as a scapegoat at every turn,”
Apple spokesman Fred Sainz said in an email to MarketWatch. “Now — Meta seeks to charge those same creators significantly more
than any other platform. [Meta’s] announcement lays bare Meta’s
hypocrisy. It goes to show that while they seek to use Apple’s
platform for free, they happily take from the creators and small
businesses that use their own.”</p>
</blockquote>

<p>Did Zuckerberg lose a bet to Tim Cook or something? I can’t imagine a better gift to Apple and Google regarding their app store commission fees.</p>

<p><a href="https://www.facebook.com/zuck/posts/10113127348899371">Here’s Zuckerberg all the way back in June 2021</a>:</p>

<blockquote>
  <p>To help more creators make a living on our platforms, we’re going
to keep paid online events, fan subscriptions, badges, and our
upcoming independent news products free for creators until 2023.
And when we do introduce a revenue share, it will be less than the
30% that Apple and others take.</p>
</blockquote>

<p><a href="https://twitter.com/boztank/status/1514666410043064322">Here’s Andrew “Boz” Bosworth this weekend</a>, trying out the same lame argument Epic Games has used regarding why they’re purportedly upset about Apple and Google’s 30 percent fees for mobile games but not the 30 percent (or higher!) fees charged by Microsoft, Sony, and Nintendo for their dedicated game platforms:</p>

<blockquote>
  <p>Apple takes 30% of software and a significant margin on their
devices. They’ve capitalized on their market power to favor their
own business interests, which comes at great expense to
developers.</p>
</blockquote>

<p>Good luck with that argument.</p>

<div>
<a  title="Permanent link to ‘Facebook on 30 Percent Platform Fees: ‘Hold Our Beer’’"  href="https://daringfireball.net/linked/2022/04/18/facebook-platform-fees">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
    
    <link rel="alternate" type="text/html" href="https://daringfireball.net/2022/04/apple_nfl_sunday_ticket" />
	<link rel="shorturl" href="http://df4.us/u4e" />
	<id>tag:daringfireball.net,2022://1.39038</id>
	<published>2022-04-18T22:02:12Z</published>
	<updated>2022-04-21T18:50:34Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<summary type="text">That should be the point of Apple securing the rights to Sunday Ticket. Not just to get NFL games on Apple TV+, but to further cement TV+ as a dominant force in streaming video.</summary>
	<content type="html" xml:base="https://daringfireball.net/" xml:lang="en"><![CDATA[
<p><a href="https://thestreamable.com/news/report-nfl-sunday-ticket-to-apple-tv-plus-may-be-done-deal">Matt Tamanini, writing for The Streamable</a>:</p>

<blockquote>
  <p>According to one industry insider, Apple might have already
secured the most sought-after rights package in all of
broadcasting and is just waiting for the most opportune time to
announce it. In a <a href="https://puck.news/ruperts-age-apple-nfl-and-the-bomb-of-the-pandemic/">Q&amp;A article for Puck News</a>, the
entertainment news outlet’s founding partner Matthew Belloni said
that while his sources are telling him that Apple is in the
driver’s seat to secure the NFL Sunday Ticket rights beginning in
the fall of 2023, others are saying that the deal is already done.</p>

<p>“One source told me this weekend that the deal is actually done,”
Belloni wrote, “and is being kept quiet at Apple’s request, which
I haven’t confirmed and don’t know for a fact; Apple isn’t
commenting.”</p>

<p>If this is in fact true, it would line up with how Apple likes to
dole out information. <a href="https://thestreamable.com/news/report-apple-considering-streaming-mlb-games">Despite reports abounding for months</a>,
Apple CEO Tim Cook chose to hold the announcement of Major League
Baseball coming to <a href="https://thestreamable.com/video-streaming/apple-tv-plus">Apple TV+</a> for <a href="https://thestreamable.com/news/apple-announces-friday-night-baseball-mlb-big-inning-coming-to-apple-tv-plus">one of their previously
scheduled keynote presentations</a>.</p>
</blockquote>

<p>I know nothing about these negotiations between Apple and the NFL, but I do think it’s true that if Apple <em>has</em> already secured these rights, they’d prefer to keep the deal under wraps until a time of their own choosing to announce them. But it doesn’t seem feasible to keep the deal under wraps until the NFL’s 2023 seasons starts next year. Even if Apple and the NFL keep their mouths shut, the media industry is gossipy as hell, and word would likely leak from other parties, like Amazon and Disney. Let alone DirecTV, which is going to have to tell their longtime subscribers eventually.</p>

<p>NFL Sunday Ticket, as currently offered from DirecTV, is by anyone’s standards expensive:</p>

<blockquote>
  <p>The streamer’s baseball package only includes two games per week,
while the NFL package would allow fans to watch all out-of-market
games. Currently on DIRECTV, the Sunday Ticket’s To Go plan costs
$73.49 per month during the season or $293.96 for the season while
their Max Plan — which also includes NFL RedZone and DIRECTV’s
Fantasy Zone — runs $99 per month and $395.99 for the season.</p>

<p>If Apple wanted to make one of those options available to all
subscribers, it would undoubtedly require an increase in their
monthly subscription fee, or the more likely option is that they
would keep the monthly fee at the low $4.99 level and make Sunday
Ticket available for an add-on price. The question then becomes,
how much does the streamer charge for the a la carte option?</p>
</blockquote>

<p>I don’t know about the “undoubtedly” there. It seems unlikely, I agree, that Apple would pay $2 billion per year for Sunday Ticket rights and then just include those games as part of the standard TV+ subscription, for all users. I think it’s even <em>less</em> likely that Apple would raise the prices for all TV+ users, whether they’re interested in NFL football or not. (TV+ is a worldwide service, for one thing, and in some countries, “football” is a different sport.) But it doesn’t seem <em>impossible</em> to me that Apple would just include Sunday Ticket for all TV+ subscribers, without raising the price. The question is, why does Apple want to stream NFL games? To make money directly from those games, or to get as many people as possible to try TV+ and eventually subscribe?</p>

<p>Some quick back-of-the-envelope math. At $5/month an Apple TV+ subscriber pays Apple $60/year. $2 billion divided by $60 comes to about 33 million — that’s how many new TV+ subscribers Apple would need to add, based on Sunday Ticket alone, to break even on the deal. (For the sake of argument, let’s just say that family plan and <a href="https://www.apple.com/apple-one/">Apple One bundle subscribers</a> are paying about $5/month for TV+ content too, as part of their subscription tiers. It also seems possible that the rights for Sunday Ticket might sell for more like $2.5 billion. Half a billion dollars here, half a billion dollars there — it adds up.)</p>

<p><a href="https://nflcommunications.com/Documents/NFL%202021%20Viewership.pdf">According to the NFL, regular season games last year averaged 17 million total viewers</a>. It’s worth noting, though, that average viewership is driven primary by <em>in</em>-market games, not out-of-market games. Most NFL fans watch one game on Sundays: their local team, via local TV. The games broadcast on your local TV channels are geo-excluded from Sunday Ticket — to watch them, you need to either watch on traditional TV or via a streaming service that includes your local TV channels. “All the Sunday afternoon games <em>except</em> for your favorite team” is not a selling point for most NFL fans.</p>

<p>The top-rated national broadcast, NBC’s Sunday Night Football, <a href="https://deadline.com/2022/01/tom-brady-nfl-sunday-night-football-viewership-rise-tv-history-nbc-1234908545/">averaged 18.5 million viewers per week last year</a>. But Sunday Ticket doesn’t include the Thursday, Sunday, and <a href="https://daringfireball.net/linked/2022/03/16/aikman-buck-mnf">Monday night</a> national games, which the NFL sells the rights to separately. I’m just including Sunday Night Football’s viewership for context.</p>

<p>So can Apple feasibly get 30+ million new TV+ subscribers just by offering access to NFL Sunday Ticket with a standard TV+ subscription? That doesn’t seem possible. But that doesn’t mean they wouldn’t do it anyway, just to drive TV+ subscriptions by <em>some</em> number of millions of additional subscribers, and by raising awareness of TV+ in general.</p>

<p>If Apple does get the rights to Sunday Ticket, and they do choose to charge subscribers a premium for access to it, I think there’s a good chance that they’ll charge substantially less than DirecTV’s rates — that Apple will still try to make it more of a mass-market play for regular NFL fans, not just for superfans and gambling junkies.</p>

<p>I am reminded of Fox obtaining the broadcast rights for NFL games back in 1993. A few years ago <a href="https://www.theringer.com/nfl/2018/12/13/18137938/nfl-fox-deal-rupert-murdoch-1993-john-madden-terry-bradshaw-howie-long-jimmy-johnson-cbs-nbc">The Ringer put together a good oral history of that deal</a>. Fox spent a then-record $1.6 billion for the rights to the NFC games that had theretofore been broadcast on CBS, and they hired away all of CBS’s broadcasting talent, including John Madden. The point wasn’t just to put the best NFL games on Fox, the point was to put Fox itself on the map, to establish Fox as a peer to the big three traditional networks.</p>

<p>To me, that should be the point of Apple securing the rights to Sunday Ticket. Not just to get NFL games on Apple TV+, but to further cement TV+ as a top-shelf streaming service.</p>



    ]]></content>
  <title>★ More Rumors on Apple Obtaining the Rights to NFL Sunday Ticket</title></entry><entry>
	<title>Audio Hijack 4</title>
	<link rel="alternate" type="text/html" href="https://weblog.rogueamoeba.com/2022/03/31/audio-hijack-4-has-arrived/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4d" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/18/audio-hijack-4" />
	<id>tag:daringfireball.net,2022:/linked//6.39037</id>
	<published>2022-04-18T18:49:19Z</published>
	<updated>2022-04-18T18:49:48Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Rogue Amoeba:</p>

<blockquote>
  <p>With an all-new JavaScript engine and API, building
programmatically-driven workflows in Audio Hijack is now a
reality. Scripts can run automatically when sessions start and
stop, and process recordings as they’re created. A whole new world
of automation is possible with this ability to manipulate
sessions.</p>

<p>Scripting isn’t just for power users, however. Even if you’re not
fluent in JavaScript, you can streamline your use of Audio Hijack.
The built-in scripts make automation possible for anyone, and on
MacOS 12 (Monterey), Audio Hijack even integrates with the
Shortcuts app.</p>
</blockquote>

<p>Rogue Amoeba CEO/Lackey Paul Kafasis and I discussed Audio Hijack 4’s new scripting and automation support at length <a href="https://daringfireball.net/thetalkshow/2022/04/15/ep-343">on the most recent episode of my podcast</a>. There’s so much other new stuff, too. I just love Rogue Amoeba’s user interface design — it’s simultaneously Rogue-Amoeba-y and yet feels standard, very idiomatically “Mac-like”. When an app looks cool, it just makes you want to use it.</p>

<div>
<a  title="Permanent link to ‘Audio Hijack 4’"  href="https://daringfireball.net/linked/2022/04/18/audio-hijack-4">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Android Apps on Windows 11 Review</title>
	<link rel="alternate" type="text/html" href="https://www.androidpolice.com/windows-11-android-apps-review/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4c" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/18/android-apps-on-windows-11" />
	<id>tag:daringfireball.net,2022:/linked//6.39036</id>
	<published>2022-04-18T18:37:19Z</published>
	<updated>2022-04-18T20:27:11Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Will Sattelberg, writing for Android Police:</p>

<blockquote>
  <p>As for the app selection, it’s as bad as you might’ve guessed
from the jump. Forget Google apps, obviously — they aren’t on
Fire Tablets, and they aren’t here. TikTok has been predominantly
featured on Microsoft’s press images for the Appstore since it
was announced, and for good reason: it’s the only major social
network with a listing. Forget Facebook, Instagram, and Twitter — you’re stuck with TikTok if you want to experience the social
side of the web.</p>

<p>Games don’t fare much better. Looking at the top paid titles, I
only recognized two names — and that was because I knew the
Nickelodeon properties they were based on — not the games
themselves. Free titles didn’t fare much better; you’ll find
Subway Surfers and the Talking Tom series, but not much more. None
of our favorite free-to-play titles appeared in a search: no Among
Us, Call of Duty Mobile, or Roblox.</p>

<p>Granted, you can fill all of these absences elsewhere on Windows
11. Many of these titles have versions on Steam or the web — you
don’t need the Android version of Among Us to play on Windows. The
same goes for those missing apps, from Google services to social
networks to recipe apps and smart home controls. It’s not hard to
access Gmail these days, even if it’s not in a dedicated app, and
that all begs the question: why does this service even exist?</p>
</blockquote>

<p>It sounds a lot like <a href="https://support.apple.com/guide/app-store/iphone-ipad-apps-mac-apple-silicon-fird2c7092da/mac">running iPhone and iPad apps on the Mac</a>, except at least through Apple, the selection of apps comes from the platform’s main app store. With Windows 11’s support for Android apps, you get a non-native platform experience <em>and</em> a poor selection of apps.</p>

<p>Better than nothing? Maybe. A big deal? Apparently not.</p>

<div>
<a  title="Permanent link to ‘Android Apps on Windows 11 Review’"  href="https://daringfireball.net/linked/2022/04/18/android-apps-on-windows-11">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>The Talk Show: ‘Fussy Typography Improvements’</title>
	<link rel="alternate" type="text/html" href="https://daringfireball.net/thetalkshow/2022/04/15/ep-343" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u4b" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/15/the-talk-show-343" />
	<id>tag:daringfireball.net,2022:/linked//6.39035</id>
	<published>2022-04-15T22:35:21Z</published>
	<updated>2022-04-19T18:25:21Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>For your weekend listening enjoyment: Paul Kafasis returns to the show to talk about Friday Night Baseball, Rogue Amoeba’s new Audio Hijack 4 release, and a bit of speculation on WWDC.</p>

<p>Sponsored by:</p>

<ul>
<li><a href="https://getdrafts.com/thetalkshow">Drafts</a>: Where text starts. Special 10th anniversary offer: get Drafts Pro for just $4.99 for the first year. The whole year. Seriously.</li>
<li><a href="https://squarespace.com/talkshow">Squarespace</a>: Make your next move. Use code <strong>talkshow</strong> for 10% off your first order.</li>
<li><a href="https://memberful.com/talkshow">Memberful</a>: Monetize your passion with membership. Start your free trial today.</li>
<li><a href="https://www.drinktrade.com/thetalkshow">Trade Coffee</a>: Incredible coffee delivered fresh from the best roasters in the nation.</li>
</ul>

<div>
<a  title="Permanent link to ‘The Talk Show: ‘Fussy Typography Improvements’’"  href="https://daringfireball.net/linked/2022/04/15/the-talk-show-343">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
    
    <link rel="alternate" type="text/html" href="https://daringfireball.net/2022/04/30_years_of_bbedit_not_sucking" />
	<link rel="shorturl" href="http://df4.us/u4a" />
	<id>tag:daringfireball.net,2022://1.39034</id>
	<published>2022-04-15T17:38:20Z</published>
	<updated>2022-04-15T18:18:11Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<summary type="text">Times have certainly changed, as has BBEdit, but BBEdit today is remarkably similar in spirit to BBEdit then.</summary>
	<content type="html" xml:base="https://daringfireball.net/" xml:lang="en"><![CDATA[
<p>Rich Siegel, <a href="https://groups.google.com/g/comp.sys.mac.announce/c/gvPGyuX3UCs">30 years ago this week</a>:</p>

<blockquote>
  <p>This is the first public release of BBEdit, which is a free text
editor that has been under development and extensive in-house
testing for the past two years.</p>

<p>BBEdit is 32-bit clean, compatible with any Macintosh running
system version 6.0 or later, and when running under System 7.0,
takes specific advantage of new features to enhance performance
and appearance.</p>
</blockquote>

<p>“32-bit clean” was a bugaboo at the time for older Mac apps (the platform was only 8 years old, so “older” wasn’t very old) to run on System 7.</p>

<blockquote>
  <p>BBEdit is also very economical with respect to disk and memory
usage; it will run in a partition as small as 256K. The size of
any file is only limited by the amount of memory available in
BBEdit’s partition; there is no 32K upper bound.</p>
</blockquote>

<p>Text editors that used the standard system text editing APIs in that era were limited to opening files no larger than 32 kilobytes. That felt constraining even back in 1992. BBEdit could open files as large as the amount of available RAM. Times and technology have certainly changed, as has BBEdit, but BBEdit today (version 14.1, <a href="https://www.barebones.com/support/bbedit/notes-14.1.html">released a month ago</a>) is remarkably similar in spirit to BBEdit then.</p>

<blockquote>
  <p>BBEdit offers fast and flexible multi-file search and replace
capabilities; under System 7, it can also use On Location 2.0 as a
searching engine. Grep pattern-matching is available for single-
or multi-file searches.</p>
</blockquote>

<p>I started using BBEdit in the fall of 1992. I think the version number was 2.1. (Anyone who claims to have used BBEdit 1.x is either misremembering or was a colleague or friend of Rich Siegel’s in 1991.) BBEdit’s multi-file search and replace remains the best I’ve ever seen. In 1992, though, it was a breakthrough. </p>

<p>And I remember thinking, “Grep search, what’s that about?”</p>

<p>Eight years later I was working at Bare Bones Software. My lasting contribution: tweaking the user manual’s Grep chapter when BBEdit 6.something adopted the <a href="https://www.pcre.org/">PCRE</a> regular expression engine; theretofore it had been using a heavily modified version of <a href="https://garyhouston.github.io/regex/">Henry Spencer’s original library</a>.</p>

<p>18 years ago I created Markdown in BBEdit, with the intention of using it from BBEdit. That’s worked out pretty well — just about every long piece I’ve written for Daring Fireball was written in BBEdit (including this one, natch). At that time, I considered BBEdit mature and well-established.</p>

<hr />

<p>Discussions marking this week’s anniversary <a href="https://www.metafilter.com/195001/It-still-doesnt-suck-BBEdit-turns-30">on MetaFilter</a> and <a href="https://news.ycombinator.com/item?id=31008290">Hacker News</a>.</p>

<p><a href="https://sixcolors.com/link/2022/04/mac-text-editor-bbedit-celebrates-20th-anniversary/">Jason Snell, at Six Colors</a>:</p>

<blockquote>
  <p>I use BBEdit every day. I write most of my stories in BBEdit.
Sometimes <a href="https://sixcolors.com/tag/bbedit/">I write <em>about</em> BBEdit in
BBEdit</a>.</p>
</blockquote>

<p><a href="https://mjtsai.com/blog/2022/04/14/bbedit-turns-30/">Michael Tsai</a>:</p>

<blockquote>
  <p>I’ve been using it since a year or two later, and I doubt there’s
an app I’ve spent more time in. And let’s not forget the excellent
documentation and customer support that go along with the app.</p>
</blockquote>

<p><a href="https://twitter.com/peternlewis/status/1514069879191908358">Peter Lewis</a>:</p>

<blockquote>
  <p>Congratulations on 30 years of BBEdit! I’ve definitely been using
it for at least 29 years and I can’t imagine my Mac without it. It
is the absolutely gold standard for release notes, quality and
reliability.</p>
</blockquote>

<p>And lastly, <a href="https://twitter.com/ChrisSmith_RSB/status/1513891571401478144">Christian Smith</a>:</p>

<blockquote>
  <p>I can think of no other piece of software that has stayed so true
to its original design principles as BBEdit.</p>
</blockquote>

<p>I can’t put it better than that.</p>



    ]]></content>
  <title>★ 30 Years of BBEdit Not Sucking</title></entry><entry>
	<title>Chaim Gartenberg Leaves The Verge for Google</title>
	<link rel="alternate" type="text/html" href="https://twitter.com/cgartenberg/status/1514714799652941837" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u49" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/15/gartenberg-google" />
	<id>tag:daringfireball.net,2022:/linked//6.39033</id>
	<published>2022-04-15T17:31:33Z</published>
	<updated>2022-04-15T17:39:23Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Chaim Gartenberg:</p>

<blockquote>
  <p>Some personal news: after nearly a decade, today was my last day
<a href="https://twitter.com/verge">@Verge</a>. It’s been an amazing ride, with what is honestly a list
of far too many people to thank for all the support and guidance
over the years.</p>

<p>Next up: I’m incredibly excited to be heading over to Google,
where I’ll be working on internal communications to help tell more
stories about all the amazing things going on there! (If you’re at
Google, definitely say hello!)</p>
</blockquote>

<p><a href="https://daringfireball.net/linked/2022/03/04/bohn-google">After Dieter Bohn last month</a>, Gartenberg makes it two long-time Verge writers heading to Google recently.</p>

<div>
<a  title="Permanent link to ‘Chaim Gartenberg Leaves The Verge for Google’"  href="https://daringfireball.net/linked/2022/04/15/gartenberg-google">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Elon Musk Makes Play to Buy Twitter Entirely and Take It Private</title>
	<link rel="alternate" type="text/html" href="https://www.sec.gov/Archives/edgar/data/1418091/000110465922045641/tm2212748d1_sc13da.htm#ex-b_001" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u48" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/14/musk-twitter-private" />
	<id>tag:daringfireball.net,2022:/linked//6.39032</id>
	<published>2022-04-15T00:15:48Z</published>
	<updated>2022-04-15T00:15:48Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Elon Musk, in a letter to Twitter chairman Bret Taylor and filed with the SEC:</p>

<blockquote>
  <p>I invested in Twitter as I believe in its potential to be the
platform for free speech around the globe, and I believe free
speech is a societal imperative for a functioning democracy.</p>

<p>However, since making my investment I now realize the company will
neither thrive nor serve this societal imperative in its current
form. Twitter needs to be transformed as a private company.</p>

<p>As a result, I am offering to buy 100% of Twitter for $54.20 per
share in cash, a 54% premium over the day before I began investing
in Twitter and a 38% premium over the day before my investment was
publicly announced. My offer is my best and final offer and if it
is not accepted, I would need to reconsider my position as a
shareholder.</p>

<p>Twitter has extraordinary potential. I will unlock it.</p>
</blockquote>

<p>Also from that SEC filing, these bullet points from Musk:</p>

<ul>
<li>I am not playing the back-and-forth game.</li>
<li>I have moved straight to the end.</li>
<li>It’s a high price and your shareholders will love it.</li>
<li>If the deal doesn’t work, given that I don’t have confidence in management nor do I believe I can drive the necessary change in the public market, I would need to reconsider my position as a shareholder.
<ul><li>This is not a threat, it’s simply not a good investment without the changes that need to be made.</li>
<li>And those changes won’t happen without taking the company private.</li></ul></li>
</ul>

<p>Musk can say it’s not a threat, but what he means is that it’s not <em>merely</em> a threat. If Musk pulls out of Twitter I think Twitter’s share price will, at least temporarily, sink. </p>

<div>
<a  title="Permanent link to ‘Elon Musk Makes Play to Buy Twitter Entirely and Take It Private’"  href="https://daringfireball.net/linked/2022/04/14/musk-twitter-private">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Peloton Raises Subscription Fees, Cuts Prices for Bikes and Treadmills</title>
	<link rel="alternate" type="text/html" href="https://www.cnbc.com/2022/04/14/peloton-raises-subscription-fees-cuts-prices-for-bikes-treads.html" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u47" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/14/peloton-squeeze" />
	<id>tag:daringfireball.net,2022:/linked//6.39031</id>
	<published>2022-04-14T19:08:23Z</published>
	<updated>2022-04-19T18:24:06Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Lauren Thomas, reporting for CNBC:</p>

<blockquote>
  <p>Effective June 1, the price of Peloton’s all-access subscription
plan in the United States will go up to $44 per month, from $39.
In Canada, the fee will rise to $55 per month, from $49. Pricing
for international members will remain unchanged, Peloton said. The
cost of a digital-only membership, for people who don’t own any of
Peloton’s equipment, will still be $12.99 a month.</p>

<p>Peloton explained the decision in <a href="https://www.onepeloton.com/press/articles/update-on-pricing">a company blog post</a> shared
with CNBC. “There’s a cost to creating exceptional content and an
engaging platform,” the company said. The price increases will
allow Peloton to continue to deliver to users, it added. [...]</p>

<p>The price of its Bike will drop to $1,445 from $1,745. The cost
includes a $250 shipping and set-up fee. The Bike+ will drop to
$1,995 from $2,495. The Tread machine will sell for $2,695,
down from $2,845. The Tread cost includes a $350 shipping and
set-up fee.</p>
</blockquote>

<p>Hey, prices go up. Inflation is running high. OK. But raising the prices <em>only</em> for people who already paid for Peloton’s premium-priced hardware and not for people on the digital-only plan doesn’t pass the sniff test that this is about the cost of content creation. If it were really about content creation costs, they’d raise subscription prices for everyone, or, only for the people who haven’t also purchased Peloton devices that cost $2000 or more.</p>

<p>It’s not like $39/month was cheap. It seems transparently obvious that they’re just soaking their best and most loyal customers — the ones whose hardware purchases have tied them to Peloton. (Unsubscribe and your bike or treadmill still works, but the display becomes useless. <strong>Update:</strong> Well, not totally useless. The display will still show you basic dashboard stats, like time, resistance, and distance — you just can’t use the display to show classes or anything entertainment-related.)</p>

<p>So the message to prospective new buyers is “<em>We’ve lowered prices on our hardware; buy one today and we’ll squeeze you for more later.</em>” Good messaging.</p>

<div>
<a  title="Permanent link to ‘Peloton Raises Subscription Fees, Cuts Prices for Bikes and Treadmills’"  href="https://daringfireball.net/linked/2022/04/14/peloton-squeeze">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Easy Come, Easy Go, NFT Edition</title>
	<link rel="alternate" type="text/html" href="https://www.coindesk.com/business/2022/04/13/jack-dorseys-first-tweet-nft-went-on-sale-for-48m-it-ended-with-a-top-bid-of-just-280/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u46" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/14/easy-come-easy-go" />
	<id>tag:daringfireball.net,2022:/linked//6.39030</id>
	<published>2022-04-14T18:28:19Z</published>
	<updated>2022-04-14T18:28:20Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Sandali Handagama, reporting for CoinDesk:</p>

<blockquote>
  <p>A non-fungible token (NFT) of Twitter founder Jack Dorsey’s
first-ever tweet could sell for just under $280. The current owner
of the NFT listed it for $48 million last week.</p>

<p>Iranian-born crypto entrepreneur Sina Estavi <a href="https://www.coindesk.com/markets/2021/03/22/jack-dorseys-first-tweet-sells-for-29m/">purchased the
NFT</a> for $2.9 million in March 2021. Last Thursday, he
<a href="https://twitter.com/sinaEstavi/status/1511832413973983239">announced</a> on Twitter that he wished to sell the NFT, and
pledged 50% of its proceeds (which he thought would exceed $25
million) to charity. <a href="https://opensea.io/assets/matic/0x28009881f0ffe85c90725b8b02be55773647c64a/20/">The auction</a> closed Wednesday, with just
seven total offers ranging from 0.09 ETH ($277 at current prices)
to 0.0019 ETH (almost $6).</p>

<p>“The deadline I set was over, but if I get a good offer, I might
accept it, I might never sell it,” Estavi told CoinDesk via a
WhatsApp message on Wednesday.</p>
</blockquote>

<p>Yeah, he might never sell it.</p>

<div>
<a  title="Permanent link to ‘Easy Come, Easy Go, NFT Edition’"  href="https://daringfireball.net/linked/2022/04/14/easy-come-easy-go">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
    
    <link rel="alternate" type="text/html" href="https://daringfireball.net/2022/04/studio_display_one_month_in" />
	<link rel="shorturl" href="http://df4.us/u44" />
	<id>tag:daringfireball.net,2022://1.39028</id>
	<published>2022-04-14T01:00:01Z</published>
	<updated>2022-04-14T17:53:20Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<summary type="text">I expect a *display* from the world’s most-renowned computer company to be at least as reliable a computer as my refrigerator.</summary>
	<content type="html" xml:base="https://daringfireball.net/" xml:lang="en"><![CDATA[
<p>A few updates to <a href="https://daringfireball.net/2022/03/the_apple_studio_display">my review of the Apple Studio</a>, after using it just about every day for the last month.</p>

<h2>What I’m Buying</h2>

<p>I’m ordering a Studio Display with the works: the nano-texture display and the height-adjustable stand. I saw the nano-texture display in person at an Apple Store, and it seems just what I need for a window-filled office. Reflections just disappear. It’s like magic.</p>

<p>But I can see why — $300 price difference aside — the nano-texture finish is not to everyone’s liking. Side-by-side with a regular glossy-finish Studio Display, the nano-texture display looks ... a bit dull? It’s just as bright, and I don’t think it looks less sharp, but the glossy glass makes everything look more vibrant on screen. Personally, I prefer the less-vibrant-but-still-just-as-bright look, and if I could pay $300 extra to get a similar nano-texture/matte finish on a MacBook Pro display, I’d spring for that, too.</p>

<h2>Restarting the Apple Studio Display</h2>

<p>Yesterday I noticed that the audio output from my Studio Display review unit was garbled. All audio, from all sources, was stuttered and jittery. Not just a little bit off, but unlistenable. Audio from my MacBook Pro’s built-in speakers, or from headphones, was fine. Detaching and reattaching the Mac to the Studio Display didn’t help. Neither did restarting the MacBook Pro.</p>

<p>I had one last guess for a fix: restarting the Studio Display. But there are no buttons on the display, and there are no software controls in Mac OS to tell an attached Studio Display to restart.<sup id="fnr1-2022-04-13"><a href="#fn1-2022-04-13">1</a></sup> So, under my desk I crawled. Pulled the power plug from the wall socket, waited a few seconds, plugged it back in. To my knowledge, this is the first time my Studio Display review unit restarted since I first plugged it in on March 11. (My unit came with “firmware” version 15.4 (build 19E241), which is still the current version, so I’ve yet to see the firmware update process firsthand.<sup id="fnr2-2022-04-13"><a href="#fn2-2022-04-13">2</a></sup>)</p>

<p>The Studio Display rebooted. While booting, it shows a black background with three small circles aligned horizontally, and those dots animate side-to-side. Seems like this would be better if the animation were Apple’s standard clock-like circular spinner, but whatever, the Studio Display doesn’t take long to boot.</p>

<p>Plugged the MacBook Pro back in and boom — audio was back to normal. Problem solved.</p>

<p>But “pull the power cord out of the wall” is not exactly an intuitive solution to glitchy audio. It is fascinating that the Studio Display is, under the hood, a self-contained iOS computer, but the overwhelming majority of Studio Display owners will never know that, nor should they. A monitor is the sort of thing you expect to plug in and never need to unplug — certainly not just to get sound working.</p>

<p>All sorts of devices are really computers under the hood today. My refrigerator has an embedded computer of some sort, for controlling temperatures, ice-making, and notifying me when filters are due to be changed. I’ve owned it for over five years and have never needed to reboot it. I expect a <em>display</em> from the world’s most-renowned computer company to be at least as reliable a computer as my refrigerator.</p>

<p>If you’re going to design a display without a power button, it ought never need to be power-cycled.</p>

<div class="footnotes">
<hr />
<ol>

<li id="fn1-2022-04-13">
<p>Or at least no such commands I’m aware of. If there’s a command-line incantation or something that can do this, I’d love to hear about it.&nbsp;<a href="#fnr1-2022-04-13"  class="footnoteBackLink"  title="Jump back to footnote 1 in the text.">&#x21A9;&#xFE0E;︎</a></p>
</li>

<li id="fn2-2022-04-13">
<p>Speaking of Studio Display firmware updates, we’ve seen nada on that front in terms of addressing the deplorable image quality of the built-in camera. I’ve heard nothing on that front, officially or unofficially, since I posted <a href="https://daringfireball.net/linked/2022/03/17/three-updates-regarding-studio-display">this on March 17</a>. I’ve heard from some early Studio Display buyers who were hoping for a software fix for the camera image quality before their return windows expired. Perhaps Murphy’s Law will kick in and a “<em>hey, the camera quality is now at least as good as an iPad</em>” update will drop this week — but I’m resigned to accepting that the Studio Display just has a crappy camera.&nbsp;<a href="#fnr2-2022-04-13"  class="footnoteBackLink"  title="Jump back to footnote 2 in the text.">&#x21A9;&#xFE0E;</a></p>
</li>

</ol>
</div>



    ]]></content>
  <title>★ Studio Display, One Month In</title></entry><entry>
	
	<link rel="alternate" type="text/html" href="https://l.kolide.co/3BdU5Pc" />
	<link rel="shorturl" href="http://df4.us/u45" />
	<link rel="related" type="text/html" href="https://daringfireball.net/feeds/sponsors/2022/04/kolide_4" />
	<id>tag:daringfireball.net,2022:/feeds/sponsors//11.39029</id>
	<author><name>Daring Fireball Department of Commerce</name></author>
	<published>2022-04-13T21:06:35-05:00</published>
	<updated>2022-04-13T21:06:35-05:00</updated>
	<content type="html" xml:base="https://daringfireball.net/feeds/sponsors/" xml:lang="en"><![CDATA[
<p>Kolide is a SaaS app that sends employees important, timely, and relevant security recommendations concerning their Mac, Windows, and Linux devices, right inside Slack.</p>

<p>Kolide is perfect for organizations that want to move beyond a traditional lock-down model and move to one where employees are educated about security and device management while fixing nuanced problems. We call this approach Honest Security.</p>

<p>For example, Kolide can:</p>

<ol>
<li>Instruct developers to set passphrases on the unencrypted SSH keys littered throughout their devices.</li>
<li>Find plain-text two-factor backup codes and teach end-users how to store them securely.</li>
<li>Convince employees to uninstall evil (yet allowed) browser extensions that sell their browser history to marketing companies</li>
</ol>

<p><a href="https://l.kolide.co/3BdU5Pc">You can try Kolide</a> on an unlimited number of devices with all its features for free and without a credit card for 14 days.</p>

<div>
<a  title="Permanent link to ‘Kolide’"  href="https://daringfireball.net/feeds/sponsors/2022/04/kolide_4">&nbsp;★&nbsp;</a>
</div>

	]]></content>
	<title>[Sponsor] Kolide</title></entry><entry>
	<title>Giants’ Alyssa Nakken Becomes First On-Field Woman Coach in MLB History</title>
	<link rel="alternate" type="text/html" href="https://www.mlb.com/news/alyssa-nakken-1st-on-field-woman-coach-in-mlb-history" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u43" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/13/nakken-on-field-coach" />
	<id>tag:daringfireball.net,2022:/linked//6.39027</id>
	<published>2022-04-13T12:24:44Z</published>
	<updated>2022-04-14T01:15:46Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Maria Guardado, reporting for MLB.com:</p>

<blockquote>
  <p>Alyssa Nakken broke another historic barrier on Tuesday night, becoming the first woman to coach on the field in a Major League game in the Giants’ 13-2 victory over the Padres at Oracle Park.</p>

<p>Nakken took over as the Giants’ first-base coach in the top of the third inning after Antoan Richardson was ejected from the game by crew chief Greg Gibson following a dispute with Padres third-base coach Mike Shildt. Nakken said bench coach Kai Correa came down to the batting cages and told her she would be replacing Richardson. And so she made her on-field coaching debut with the Giants, who originally hired the 31-year-old as an assistant coach in January 2020.</p>
</blockquote>

<p>Meanwhile, <a href="https://www.si.com/mlb/2022/04/09/rachel-balkovec-tampa-tarpons-yankees-minor-league-historic-debut-game-victory">in similarly cool news from Florida</a>:</p>

<blockquote>
  <p>Cheered by many fans who came just to see her make history, Rachel Balkovec debuted with a win Friday night as the first woman to manage the affiliate of a Major League Baseball team. Balkovec guided the New York Yankees’ Class A Tampa Tarpons over Lakeland 9-6.</p>

<p>“I’ve never heard my name chanted like that,” she said. “It was so much fun. Again, I just see, it’s like I see me sitting in the stands, whatever 15, 20 years ago, and so it’s just really cool.”</p>
</blockquote>

<div>
<a  title="Permanent link to ‘Giants’ Alyssa Nakken Becomes First On-Field Woman Coach in MLB History’"  href="https://daringfireball.net/linked/2022/04/13/nakken-on-field-coach">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>CNN Minus Is More Like It</title>
	<link rel="alternate" type="text/html" href="https://www.cnbc.com/2022/04/12/cnn-plus-low-viewership-numbers-warner-bros-discovery.html" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u42" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/12/cnn-minus" />
	<id>tag:daringfireball.net,2022:/linked//6.39026</id>
	<published>2022-04-13T02:22:47Z</published>
	<updated>2022-04-13T02:26:16Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Alex Sherman, reporting for CNBC: </p>

<blockquote>
  <p>Fewer than 10,000 people are using CNN+ on a daily basis two weeks into its existence, according to people familiar with the matter. The people spoke with CNBC on the condition of anonymity in order to discuss nonpublic data.</p>

<p>CNN+ launched on March 29. The subscription news streaming service, which charges $5.99 a month or $59.99 annually, only became available on Roku on Monday and still isn’t on Android TV. Still, the paltry audience casts doubt on the future of the application following the recently completed combination of Discovery and WarnerMedia into Warner Bros. Discovery.</p>
</blockquote>

<p>It’s an interesting idea. People <em>do</em> pay monthly subscription fees to watch exclusive entertainment and sports content on streaming services. Might not they pay for streaming news, too? Perhaps not. 10,000 users per day is crickets-chirping territory for CNN.</p>

<div>
<a  title="Permanent link to ‘CNN Minus Is More Like It’"  href="https://daringfireball.net/linked/2022/04/12/cnn-minus">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Inside Tom Brady’s Un-Retirement</title>
	<link rel="alternate" type="text/html" href="https://www.bostonglobe.com/2022/04/08/sports/inside-tom-bradys-un-retirement-how-brian-flores-soccer-match-were-among-key-factors/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u41" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/12/brady-un-retirement" />
	<id>tag:daringfireball.net,2022:/linked//6.39025</id>
	<published>2022-04-13T01:47:26Z</published>
	<updated>2022-04-13T01:56:03Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Ben Volin, reporting for The Boston Globe:</p>

<blockquote>
  <p>On Feb. 1, Tom Brady announced that he was stepping away from football. The Buccaneers moved ahead with Bruce Arians as head coach and assessed their options at quarterback.</p>

<p>By March 30, Brady was back with the Bucs, preparing to play his 23rd NFL season at age 45. And his head coach was Todd Bowles after Arians retired and took a consulting job with the team.</p>

<p>How did this drastic turn of events take place in just two months? This wasn’t a Brett Favre situation, with Brady walking away for several months before getting the itch again during training camp. Brady was “retired” for all of 40 days, and came back in time for the Buccaneers to be active in free agency.</p>

<p>Instead, Brady’s change of heart was the result of a fascinating fall of dominos involving the Miami Dolphins, Sean Payton, Brian Flores’s lawsuit, former Patriots offensive lineman Rich Ohrnberger, and a Manchester United soccer match.</p>
</blockquote>

<p>This story is kind of bananas on the surface, but makes sense. The real fly in the ointment of the whole scheme was Brian Flores’s discrimination lawsuit against the Dolphins and the NFL. If not for that, today Tom Brady might be part-owner of the Dolphins and their starting quarterback next season — in the same division as the Patriots. But Flores’s lawsuit was at least <a href="https://www.cnn.com/2022/02/01/sport/brian-flores-lawsuit-nfl-racial-discrimination-spt/index.html">partially precipitated by an errant text message sent to him by … Bill Belichick</a>!</p>

<div>
<a  title="Permanent link to ‘Inside Tom Brady’s Un-Retirement’"  href="https://daringfireball.net/linked/2022/04/12/brady-un-retirement">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Elon Musk’s Twitter Board Seat: Never Mind</title>
	<link rel="alternate" type="text/html" href="https://twitter.com/paraga/status/1513354622466867201" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u40" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/11/musk-twitter-board-seat" />
	<id>tag:daringfireball.net,2022:/linked//6.39024</id>
	<published>2022-04-11T17:19:14Z</published>
	<updated>2022-04-11T22:40:24Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Twitter CEO Parag Agrawal, in a tweet:</p>

<blockquote>
  <p>Elon has decided not to join our board. I sent a brief note to the
company, sharing with you all here.</p>
</blockquote>

<p>The first thing I’ll note is that Agrawal had to share the “brief note” itself as a screenshot, because, well, Twitter only supports up to 280 characters in a post. Duh, right? We all know that. But it’s really kind of silly when you consider that even Twitter’s own CEO, sharing important breaking news, has to use screenshots to share even a “brief note”. (The seemingly obvious solution would be to allow users to include a text attachment to a tweet, the same way we’ve been able to attach images and videos for years.)</p>

<p>From the note:</p>

<blockquote>
  <p>We announced on Tuesday that Elon would be appointed to the Board
contingent on a background check and formal acceptance. Elon’s
appointment to the board was to become officially effective 4/9,
but Elon shared that same morning that he will no longer be
joining the board.</p>
</blockquote>

<p>Is the “background check” relevant here? Like, did something turn up in the background check that Twitter deemed problematic? The simple explanation is that Musk simply realized that he could have freer rein — and thus more fun, and more influence — <em>not</em> on the board than on it. But why mention the background check at all here then? Just as a jab — a not-so-subtle dig?</p>

<blockquote>
  <p>I believe this is for the best. We have and will always value
input from our shareholders whether they are on our Board or
not. Elon is our biggest shareholder and we will remain open to
his input.</p>

<p>There will be distractions ahead, but our goals and priorities
remain unchanged.</p>
</blockquote>

<p>Translation: <em>We are largely beholden to Elon Musk now, as our stock price is inextricably tied to his continuing shareholding.</em></p>

<p>I mean what happens to Twitter’s share price if Musk dumps all his stock and tweets something like “I tried to help Twitter but the company is run by a bunch of bozos. I’m out.” That’s just 76 characters and I bet it would tank Twitter’s stock.</p>

<div>
<a  title="Permanent link to ‘Elon Musk’s Twitter Board Seat: Never Mind’"  href="https://daringfireball.net/linked/2022/04/11/musk-twitter-board-seat">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Matt Levine on Elon Musk</title>
	<link rel="alternate" type="text/html" href="https://www.bloomberg.com/opinion/articles/2022-04-04/elon-musk-bought-some-twitter" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3z" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/10/levine-musk-twitter" />
	<id>tag:daringfireball.net,2022:/linked//6.39023</id>
	<published>2022-04-10T17:59:43Z</published>
	<updated>2022-04-10T18:02:13Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Matt Levine, in his Money Stuff column for Bloomberg:</p>

<blockquote>
  <p>Look this all makes complete sense, obvious, intuitive, simple sense. If you are the richest person in the world, and annoying, and you constantly play a computer game, and you get a lot of enjoyment and a sense of identity from that game and are maybe a little addicted, then at some point you might have some suggestions for improvements in the game. So you might leave comments and email the company that makes the game saying “hey you should try my ideas.” And the company might ignore you (or respond politely but not move fast enough for your liking). It might occur to you: “Look, I am the richest person in the world; how much could this game company possibly cost? I should just buy it and change the game however I want.” Even if your complaints are quite minor, why shouldn’t you get to play exactly the game you want? Even if you have no complaints, why not own the game you love, just to make sure it continues to be exactly what you want? The game is Twitter, the richest person in the world is Elon Musk.</p>
</blockquote>

<p>I don’t think anyone in the media gets Elon Musk the way Matt Levine does.</p>

<div>
<a  title="Permanent link to ‘Matt Levine on Elon Musk’"  href="https://daringfireball.net/linked/2022/04/10/levine-musk-twitter">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>The Case for Netflix to Add an Ad-Based Tier</title>
	<link rel="alternate" type="text/html" href="https://stratechery.com/2022/why-netflix-should-sell-ads/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3y" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/10/netflix-ads" />
	<id>tag:daringfireball.net,2022:/linked//6.39022</id>
	<published>2022-04-10T17:38:03Z</published>
	<updated>2022-04-10T17:56:34Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Ben Thompson, last week on Stratechery:</p>

<blockquote>
  <p>Meanwhile, subscriber growth has stalled, even as the advertising market has proven to be much larger than even Google or Facebook can cover. Moreover, the post-ATT world is freeing up more money for the sort of top-of-funnel advertising that would probably be the norm on a Netflix advertising service. In short, the opportunity is there, the product is right, and the business need is pressing in a way it wasn’t previously.</p>
</blockquote>

<p>Thompson and I talked about this on <a href="https://dithering.fm/">Dithering</a> last week, and I think this is a fascinating question. The first thing to note is that the “Netflix should sell ads” take that Thompson espouses is about adding new lower-priced tiers that are subsidized through commercials — <em>no one</em> is arguing that Netflix should add ads to existing subscription tiers. Basically, what’s being suggested is the Hulu model: pay something to get access but with ads, or pay more to get access without any ads at all.</p>

<p>When you keep that point in mind, as a business case, it makes a lot of sense for Netflix to expand this way. My argument against Netflix doing this is about <em>brand</em>, though. Netflix has built an incredibly valuable brand, and part of that brand’s foundation is that Netflix is a premium service that doesn’t do rinky-dink shit like force you to watch unskippable ads. When you’re a Netflix customer, Netflix is always on your side. Unskippable ads are not on your side. Ergo Netflix should never create a lower-priced-with-ads subscription tier. Yes, they’d add more subscribers that way, and goose revenue growth for a few more years, but I think the revenue they’d gain would be outweighed, significantly, by the brand equity they’d lose in doing so. Netflix isn’t just like Hulu or Peacock or any of the also-ran services with ads. Netflix is fucking Netflix, <em>the</em> leading streaming service.</p>

<p>There’s no way to account for brand value on a balance sheet, but great CEOs know what it’s worth in their guts, and savvy investors should too.</p>

<div>
<a  title="Permanent link to ‘The Case for Netflix to Add an Ad-Based Tier’"  href="https://daringfireball.net/linked/2022/04/10/netflix-ads">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Kolide</title>
	<link rel="alternate" type="text/html" href="https://l.kolide.co/34TPEwA" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3x" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/09/kolide" />
	<id>tag:daringfireball.net,2022:/linked//6.39021</id>
	<published>2022-04-09T19:59:34Z</published>
	<updated>2022-04-09T19:59:34Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>My thanks to Kolide for sponsoring this week at DF. Kolide believes the supposedly “average person” is the key to unlocking a new class of security detection, compliance, and threat remediation. So do the hundreds of organizations that send important security notifications to employees from Kolide’s Slack app.  </p>

<p>Kolide believes organizations can dramatically lower the actual risks they will likely face with a structured, message-based approach. More importantly, they’ll be able to engage end-users to fix nuanced problems that can’t be automated.</p>

<p><a href="https://l.kolide.co/34TPEwA">Try Kolide Free for 14 days — with no credit card required</a>.</p>

<div>
<a  title="Permanent link to ‘Kolide’"  href="https://daringfireball.net/linked/2022/04/09/kolide">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>‘SF Wide’ Font Variants Coming in June?</title>
	<link rel="alternate" type="text/html" href="https://twitter.com/chockenberry/status/1512277300070412289" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3w" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/08/sf-wide-chock" />
	<id>tag:daringfireball.net,2022:/linked//6.39020</id>
	<published>2022-04-08T20:40:10Z</published>
	<updated>2022-04-09T19:27:59Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Craig Hockenberry, commenting on the WWDC 2022 poster image:</p>

<blockquote>
  <p>No one has commented on this yet, but I bet there’s a new SF
variant in June.</p>

<p>I guessing that SF Wide will look great on slides…</p>
</blockquote>

<p>The “Call to Code” slogan is set in what appears to be a new wide variant of San Francisco, Apple’s family of fonts that it uses for everything from the OS system font (MacOS, iOS, WatchOS, and tvOS) to packaging to advertising. Can’t believe I didn’t notice this.</p>

<div>
<a  title="Permanent link to ‘‘SF Wide’ Font Variants Coming in June?’"  href="https://daringfireball.net/linked/2022/04/08/sf-wide-chock">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
    
    <link rel="alternate" type="text/html" href="https://daringfireball.net/2022/04/more_friday_night_baseball_details" />
	<link rel="shorturl" href="http://df4.us/u3v" />
	<id>tag:daringfireball.net,2022://1.39019</id>
	<published>2022-04-08T20:00:31Z</published>
	<updated>2022-04-08T20:00:32Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<summary type="text">A diverse broadcast crew, including Melanie Newman calling play-by-play, but no pausing or fast-forwarding during games.</summary>
	<content type="html" xml:base="https://daringfireball.net/" xml:lang="en"><![CDATA[
<p><a href="https://www.apple.com/newsroom/2022/04/apple-introduces-broadcasters-and-production-details-for-friday-night-baseball/">Apple Newsroom, yesterday</a>:</p>

<blockquote>
  <p>Beginning Friday, April 8, the broadcast team of Melanie Newman
(play-by-play), Chris Young (analyst), Hannah Keyser (analyst),
and Brooke Fletcher (reporter) will call the New York Mets at the
Washington Nationals at 7 p.m. ET; and Stephen Nelson
(play-by-play), Hunter Pence (analyst), Katie Nolan (analyst), and
Heidi Watney (reporter) comprise the crew that will call the
Houston Astros at the Los Angeles Angels game at 9:30 p.m. ET.
Game assignments for “Friday Night Baseball” broadcasters will be
announced on a weekly basis. In her new role with “Friday Night
Baseball,” Newman becomes the second woman to lead play-by-play
duties for a national broadcast team; she joined the Baltimore
Orioles’ broadcast team in 2020.</p>
</blockquote>

<p>A diverse announcing crew, for sure.</p>

<blockquote>
  <p>Produced by MLB Network’s Emmy Award-winning production team in
partnership with Apple, “Friday Night Baseball” will offer a
modern and dynamic broadcast experience that appeals to new
viewers and veteran fans alike. Each game broadcast will employ
state-of-the-art cameras, including high-speed Phantoms, the
high-resolution Megalodon, and more throughout the season to
present vivid, live-action shots, and offer immersive sound in 5.1
with spatial audio enabled. “Friday Night Baseball” will also
incorporate new on-screen graphics that include innovative new
probabilities-based forecasts of different situational outcomes,
plus highlights and live look-ins from around the league
integrated right into the broadcast. Throughout the “Friday Night
Baseball” broadcasts, fans can enjoy on-screen callouts about
batters’ walk-up songs from Apple Music, test their knowledge of
baseball trivia with help from Siri, and more. And, in a first for
MLB games, “Friday Night Baseball” will feature rules analysis and
interpretation from former MLB umpire Brian Gorman.</p>
</blockquote>

<p>That all sounds good, but on Twitter, streaming media analyst <a href="https://twitter.com/DanRayburn/status/1512450898928283659">Dan Rayburn reports some disappointing news</a>:</p>

<blockquote>
  <p>Apple says their Friday Night exclusive MLB games that kick off
tonight on Apple TV+ will not support “Pause, fast forward, and
other playback controls aren’t available with Friday Night
Baseball.” That seems odd.</p>
</blockquote>

<p>Jason Snell (among many others) <a href="https://sixcolors.com/link/2022/04/apple-provides-new-friday-night-baseball-details/">notes that Apple makes no mention of 4K streaming</a>, either, which strongly suggests that for now at least, all games will be in 1080p. The lack of pause and fast-forwarding is a technical issue that’s entirely in Apple’s hands, I think. (I don’t think they support those features in live-streamed event keynotes, either.) The lack of 4K (and HDR) might be more of a league-wide infrastructure issue — I’m not sure if <em>any</em> regular season MLB games are broadcast on TV or streamed in 4K.</p>

<p>Excited to see how this goes, and how Apple can improve the technology of “Friday Night Baseball” as the season proceeds.</p>



    ]]></content>
  <title>★ Play Ball: Apple Announces More Details About ‘Friday Night Baseball’ on Opening Day</title></entry><entry>
	<title>Senate Confirms Ketanji Brown Jackson, Elevating the First Black Woman to the Supreme Court</title>
	<link rel="alternate" type="text/html" href="https://www.nytimes.com/live/2022/04/07/us/ketanji-brown-jackson-vote-scotus#the-senate-votes-to-move-forward-with-jacksons-confirmation" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3u" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/07/brown-jackson" />
	<id>tag:daringfireball.net,2022:/linked//6.39018</id>
	<published>2022-04-07T18:45:49Z</published>
	<updated>2022-04-07T18:49:12Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>The New York Times:</p>

<blockquote>
  <p>The Senate on Thursday confirmed Judge Ketanji Brown Jackson to the Supreme Court, making her the first Black woman to be elevated to the pinnacle of the judicial branch in what her supporters hailed as a needed step toward bringing new diversity and life experience to the court.</p>
</blockquote>

<p>Not a lot of drama, because three Republicans had already pledged their support (and reasonably so), but historic nonetheless. Today marks a great day in American history.</p>

<div>
<a  title="Permanent link to ‘Senate Confirms Ketanji Brown Jackson, Elevating the First Black Woman to the Supreme Court’"  href="https://daringfireball.net/linked/2022/04/07/brown-jackson">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
    
    <link rel="alternate" type="text/html" href="https://daringfireball.net/2022/04/apple_netherlands_acm_dance" />
	<link rel="shorturl" href="http://df4.us/u3t" />
	<id>tag:daringfireball.net,2022://1.39017</id>
	<published>2022-04-07T00:08:20Z</published>
	<updated>2022-04-08T01:17:26Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<summary type="text">Baby steps, but all of these changes are in the direction of decreasing regulatory pressure. Apple can be stubborn but they’re not stupid.</summary>
	<content type="html" xml:base="https://daringfireball.net/" xml:lang="en"><![CDATA[
<p>Apple last week adjusted its proposed plan for compliance with the Netherlands ACM’s regulations on dating apps. <a href="https://developer.apple.com/news/?id=jmps5hyj">Three changes were announced</a>:</p>

<blockquote>
  <ul>
<li><p>Removal of the Separate Binary Requirement: Apple is eliminating
the requirement that developers of dating apps in the
Netherlands who choose to use the above entitlements must create
and use a separate binary. This change means that developers may
include either entitlement in their existing dating app, but
still must limit its use to the app in the Netherlands
storefront and on devices running iOS or iPadOS.</p></li>
<li><p>Payment Service Provider Criteria: Apple is providing updated
and more-specific criteria to evaluate non-Apple payment
service providers that developers of dating apps in the
Netherlands may use.</p></li>
<li><p>Consumer Disclosures: Apps that use either entitlement need to
include an in-app modal sheet that explains to users that
they’re going to make purchases through an external payment
system, and the potential impact that choice could have on the
user. Apple is adjusting the language on the modal sheet and
reducing the number of times the sheet must be displayed.</p></li>
</ul>
</blockquote>

<p>None of these proposed changes are earth-shattering, but they’re all for the better.</p>

<p>Apple’s initial proposal that apps using these entitlements in the Netherlands would need to do so using a separate binary — meaning, a second Netherlands-only version of the app — seemed deliberately confusing. One problem with requiring a separate binary, for example, is that Dutch users who already have one or more dating apps installed might not have gotten updated versions that use these new entitlements via software update. There are some popular apps in the App Store with multiple binaries, but it’s unusual. Sometimes it’s a split between a free/lite version and a paid/pro version, but that’s less common these days, where the typical strategy is a free-to-download-and-use version that contains an in-app purchase to unlock additional features or remove ads.</p>

<p>The other notable change is to the required language in the warning screen users must be presented before making purchases via non-Apple payment processors or being sent to the web. Here’s the <em>previous</em> version of the warning screen (<a href="https://daringfireball.net/2022/02/going_dutch">which I wrote about two months ago</a>): </p>

<blockquote>
  <p><b>Title:</b> This app does not support the App Store’s private and
secure payment system</p>

<p><b>Body:</b> All purchases in the &lt;App Name&gt; app will be managed by
the developer “﹤Developer Name﹥.” Your stored App Store payment
method and related features, such as subscription management and
refund requests, will not be available. Only purchases through the
App Store are secured by Apple.</p>

<p>Learn More</p>

<p>Action 1: Continue <br />
Action 2: Cancel</p>
</blockquote>

<p>Here’s the updated version, from Apple’s <a href="https://developer.apple.com/support/storekit-external-entitlement/">developer page for the StoreKit External Purchase Entitlement</a>:</p>

<blockquote>
  <p><b>Title:</b> This app doesn’t support the App Store’s payment system.</p>

<p><b>Body:</b> All purchases in this app will be managed by the developer
“&lt;Developer Name&gt;.” You will no longer be transacting with
Apple. Your stored App Store payment method and related features,
such as subscription management and refund requests, will not be
available. Apple is not responsible for the privacy or security of
transactions made with this developer.</p>

<p>Learn More</p>

<p>Action 1: Continue <br />
Action 2: Cancel</p>
</blockquote>

<p>The changes to this language are subtle, but good. “This app doesn’t support the App Store’s payment system” is simply true. As I wrote in February, the old title sort of implied not just that Apple’s payment system is private and secure, but that <em>only</em> Apple’s payment system is private and secure. The new language is more matter-of-fact, which feels appropriate.</p>

<p>As far as I can tell, though, Apple still hasn’t said what’s supposed to happen if a user taps on “Learn More”.</p>

<hr />

<p><a href="https://developer.apple.com/news/?id=grjqafts">Apple also last week announced an update</a> on “reader” app distribution, <a href="https://daringfireball.net/linked/2021/09/01/apple-anti-steering-relaxation">pursuant to their agreement last September with the Japan Fair Trade Commission</a>. Apple:</p>

<blockquote>
  <p>Last year, Apple <a href="https://www.apple.com/newsroom/2021/09/japan-fair-trade-commission-closes-app-store-investigation/">announced</a> an update coming to the App Store
in early 2022 that would allow developers of “reader” apps to
include an in-app link to their website for account creation and
management purposes. Starting today, with the update of <a href="https://developer.apple.com/app-store/review/guidelines/#reader-apps">App Store
Review guideline 3.1.3(a)</a>, developers of reader apps can now
request access to the External Link Account Entitlement. This
entitlement lets reader apps link to a website that is owned or
maintained by the developer, so that users can create or manage
their account outside of the app. Reader apps are apps that
provide one or more of the following digital content types — magazines, newspapers, books, audio, music, or video — as the
primary functionality of the app.</p>

<p><a href="https://developer.apple.com/support/reader-apps/">Learn about the External Link Account Entitlement</a></p>
</blockquote>

<p>Baby steps, but all of these changes are in the direction of decreasing regulatory pressure. Apple can be stubborn but they’re not stupid.</p>



    ]]></content>
  <title>★ Apple’s Dance With the Netherlands ACM Continues</title></entry><entry>
	<title>Overcast 2022.2</title>
	<link rel="alternate" type="text/html" href="https://marco.org/2022/03/25/overcast-redesign-2022" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3s" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/05/overcast-2022-2" />
	<id>tag:daringfireball.net,2022:/linked//6.39016</id>
	<published>2022-04-05T19:09:40Z</published>
	<updated>2022-04-05T19:09:43Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Marco Arment:</p>

<blockquote>
  <p><a href="https://overcast.fm/">Overcast</a>’s latest update (2022.2) brings the largest redesign
in its nearly-eight-year history, plus many of the most frequently
requested features and lots of under-the-hood improvements. I’m
pretty proud of this one.</p>

<p>For this first and largest phase of the redesign, I focused on the
home screen, playlist screen, typography, and spacing. (I plan to
revamp the now-playing and individual-podcast screens in a later
update.)</p>
</blockquote>

<p>Overcast is one of my favorite and most-used apps.</p>

<div>
<a  title="Permanent link to ‘Overcast 2022.2’"  href="https://daringfireball.net/linked/2022/04/05/overcast-2022-2">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>WWDC 2022: June 6–10</title>
	<link rel="alternate" type="text/html" href="https://www.apple.com/newsroom/2022/04/apples-worldwide-developers-conference-returns-in-its-all-online-format/" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3r" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/05/wwdc-2022" />
	<id>tag:daringfireball.net,2022:/linked//6.39015</id>
	<published>2022-04-05T18:08:56Z</published>
	<updated>2022-04-05T18:08:57Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Apple Newsroom:</p>

<blockquote>
  <p>Apple today announced it will host its annual Worldwide Developers
Conference (WWDC) in an online format from June 6 through 10, free
for all developers to attend. Building on the success of the past
two years of virtual events, WWDC22 will showcase the latest
innovations in iOS, iPadOS, macOS, watchOS, and tvOS, while giving
developers access to Apple engineers and technologies to learn how
to create groundbreaking apps and interactive experiences. [...]</p>

<p>In addition to the online conference, Apple will host a special
day for developers and students at Apple Park on June 6 to watch
the keynote and State of the Union videos together, along with the
online community. Space will be limited, and details about how to
apply to attend will be provided on the Apple Developer site and
app soon.</p>
</blockquote>

<div>
<a  title="Permanent link to ‘WWDC 2022: June 6–10’"  href="https://daringfireball.net/linked/2022/04/05/wwdc-2022">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Elon Musk Buys 9.2 Percent of Twitter, Making Him the Largest Shareholder</title>
	<link rel="alternate" type="text/html" href="https://www.cnn.com/2022/04/04/investing/elon-musk-twitter-shares-stake/index.html" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3q" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/05/musk-twitter" />
	<id>tag:daringfireball.net,2022:/linked//6.39014</id>
	<published>2022-04-05T15:47:02Z</published>
	<updated>2022-04-05T19:01:50Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Chris Isidore, CNN Business:</p>

<blockquote>
  <p>Elon Musk recently purchased 9.2% of Twitter stock, according to a
filing Monday, making him the largest shareholder in the company.</p>

<p>News of the purchase sent shares of Twitter soaring 22% in early
trading. Musk did not disclose what he paid for the shares, but
his stake was worth $2.9 billion as of the close of trading
Friday, and $3.5 billion after the spike early Monday.</p>
</blockquote>

<p>He does keep things interesting.</p>

<p><strong>Update:</strong> <a href="https://www.sec.gov/ix?doc=/Archives/edgar/data/0001418091/000119312522095651/d342257d8k.htm">Musk is now on Twitter’s board of directors</a>. As a friend quipped, imagine how bad it would be if Trump were actually a billionaire.</p>

<div>
<a  title="Permanent link to ‘Elon Musk Buys 9.2 Percent of Twitter, Making Him the Largest Shareholder’"  href="https://daringfireball.net/linked/2022/04/05/musk-twitter">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Studio 3T</title>
	<link rel="alternate" type="text/html" href="https://url.3t.io/LCeEo" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3o" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/02/studio-3t" />
	<id>tag:daringfireball.net,2022:/linked//6.39012</id>
	<published>2022-04-02T20:41:38Z</published>
	<updated>2022-04-02T20:41:39Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>My thanks to Studio 3T for sponsoring this week at DF. Studio 3T is <em>the</em> GUI for MongoDB. Studio 3T users get to:</p>

<ul>
<li><em>Query faster than ever</em> using the Visual Query Builder and IntelliShell.</li>
<li><em>Do fewer chores</em> with the automating Task Scheduler for exports, migrations, and data comparisons.</li>
<li><em>Deliver better results</em> with a powerful Aggregation Editor.</li>
</ul>

<p>Studio 3T starts at just $19 per month per user, includes regular software updates, and personalized tech support from their dedicated support team. And now, <a href="https://url.3t.io/LCeEo">they offer a free edition</a> that includes a wide range of essential features. If you’re a developer who uses MongoDB, check out Studio 3T today.</p>

<div>
<a  title="Permanent link to ‘Studio 3T’"  href="https://daringfireball.net/linked/2022/04/02/studio-3t">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>‘I Would Like to Be Paid Like a Plumber’</title>
	<link rel="alternate" type="text/html" href="https://news.lettersofnote.com/p/nirvana?s=r" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3n" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/02/paid-like-a-plumber" />
	<id>tag:daringfireball.net,2022:/linked//6.39011</id>
	<published>2022-04-02T19:18:32Z</published>
	<updated>2022-04-02T19:18:32Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Letters of Note:</p>

<blockquote>
  <p>17 months after <em>Nevermind</em>’s release, the band began to record
what would be their final album, <em>In Utero</em> — produced by Steve
Albini, outspoken engineer extraordinaire. In November of 1992,
shortly before they formally agreed on his involvement, Albini
wrote to Nirvana and laid bare his philosophy in a pitch letter
that is fascinating from start to finish.</p>
</blockquote>

<p>Remarkable clarity.</p>

<p>(Via <a href="https://www.studioneat.com/pages/gazette">The Studio Neat Gazette</a>.)</p>

<div>
<a  title="Permanent link to ‘‘I Would Like to Be Paid Like a Plumber’’"  href="https://daringfireball.net/linked/2022/04/02/paid-like-a-plumber">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>The Talk Show: ‘Doggy Lake’</title>
	<link rel="alternate" type="text/html" href="https://daringfireball.net/thetalkshow/2022/03/31/ep-342" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3m" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/04/01/the-talk-show-342" />
	<id>tag:daringfireball.net,2022:/linked//6.39010</id>
	<published>2022-04-01T17:44:45Z</published>
	<updated>2022-04-01T17:44:45Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Matthew Panzarino returns to the show to talk about Apple’s new Mac Studio and Studio Display.</p>

<p>Sponsored by:</p>

<ul>
<li><a href="https://squarespace.com/talkshow">Squarespace</a>: Make your next move. Use code <strong>talkshow</strong> for 10% off your first order.</li>
<li><a href="https://memberful.com/talkshow">Memberful</a>: Monetize your passion with membership. Start your free trial today.</li>
<li><a href="https://www.backblaze.com/thetalkshow">Backblaze</a>: Backblaze makes backing up and accessing your data astonishingly easy.</li>
<li><a href="https://www.drinktrade.com/thetalkshow">Trade Coffee</a>: Incredible coffee delivered fresh from the best roasters in the nation</li>
</ul>

<div>
<a  title="Permanent link to ‘The Talk Show: ‘Doggy Lake’’"  href="https://daringfireball.net/linked/2022/04/01/the-talk-show-342">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Tim Bray, 5G Skeptic</title>
	<link rel="alternate" type="text/html" href="https://www.tbray.org/ongoing/When/202x/2022/03/26/Is-5G-BS" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3l" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/03/31/tim-bray-5g-skeptic" />
	<id>tag:daringfireball.net,2022:/linked//6.39009</id>
	<published>2022-03-31T20:43:43Z</published>
	<updated>2022-03-31T20:43:44Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Tim Bray:</p>

<blockquote>
  <p>When I was working at AWS, around 2017 we started getting excited
pitches from companies who wanted to be part of the 5G build-out,
saying that obviously there’d be lots of opportunities for
public-cloud providers. But I never walked away convinced. Either
I didn’t believe the supposed customers really needed what 5G
offered, or I didn’t believe the opportunity was anywhere near big
enough to justify the trillion-dollar build-out investment. Six
years later, I still don’t. This is a report on a little online
survey I ran, looking for actual real-world 5G impact to see if I
was wrong.</p>
</blockquote>

<p>Bray collected a lot of comments from various readers. Most of them seem to agree with Bray (<a href="https://daringfireball.net/linked/2022/03/23/5g-battery-life">and me</a>) that 5G offers no substantial practical advantages over LTE. There are some people who report getting good 5G coverage in remote locations that have poor LTE coverage, and 5G seemingly does work much better than LTE in places like stadiums and arenas with big crowds of people.</p>

<div>
<a  title="Permanent link to ‘Tim Bray, 5G Skeptic’"  href="https://daringfireball.net/linked/2022/03/31/tim-bray-5g-skeptic">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>The Verge: ‘A Facebook Bug Led to Increased Views of Harmful Content Over Six Months’</title>
	<link rel="alternate" type="text/html" href="https://www.theverge.com/2022/3/31/23004326/facebook-news-feed-downranking-integrity-bug" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3k" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/03/31/facebook-harmful-content-bug" />
	<id>tag:daringfireball.net,2022:/linked//6.39008</id>
	<published>2022-03-31T20:35:35Z</published>
	<updated>2022-03-31T20:35:35Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Alex Heath, reporting for The Verge:</p>

<blockquote>
  <p>A group of Facebook engineers identified a “massive ranking
failure” that exposed as much as half of all News Feed views to
“integrity risks” over the past six months, according to an
internal report on the incident obtained by The Verge.</p>

<p>The engineers first noticed the issue last October, when a sudden
surge of misinformation began flowing through the News Feed, notes
the report, which was shared inside the company last week. Instead
of suppressing dubious posts reviewed by the company’s network of
outside fact-checkers, the News Feed was instead giving the posts
distribution, spiking views by as much as 30 percent globally.
Unable to find the root cause, the engineers watched the surge
subside a few weeks later and then flare up repeatedly until the
ranking issue was fixed on March 11th.</p>
</blockquote>

<p>It really does sound like a bug, and some bugs really are devilishly tricky to track down and fix. But it seems a bit odd that it took Facebook six months to fix this one, given how intense the scrutiny of the company has gotten for the very problem this bug made worse.</p>

<div>
<a  title="Permanent link to ‘The Verge: ‘A Facebook Bug Led to Increased Views of Harmful Content Over Six Months’’"  href="https://daringfireball.net/linked/2022/03/31/facebook-harmful-content-bug">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>Jon Fortt Argues Both Sides of Apple’s Original Streaming Content Strategy</title>
	<link rel="alternate" type="text/html" href="https://twitter.com/jonfortt/status/1509511742048636932" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3j" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/03/31/fortt-apple-tv-plus" />
	<id>tag:daringfireball.net,2022:/linked//6.39007</id>
	<published>2022-03-31T18:57:55Z</published>
	<updated>2022-03-31T19:03:55Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Three-minute clip from CNBC’s Squawk Box, wherein Jon Fortt argues — compellingly — both sides of the “What’s the business case for Apple’s original content strategy?” question. Count me on the side of his second argument.</p>

<div>
<a  title="Permanent link to ‘Jon Fortt Argues Both Sides of Apple’s Original Streaming Content Strategy’"  href="https://daringfireball.net/linked/2022/03/31/fortt-apple-tv-plus">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>John Siracusa: ‘Independence Day’</title>
	<link rel="alternate" type="text/html" href="https://hypercritical.co/2022/03/30/independence-day" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3i" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/03/31/siracusa-independence-day" />
	<id>tag:daringfireball.net,2022:/linked//6.39006</id>
	<published>2022-03-31T18:38:16Z</published>
	<updated>2022-03-31T18:38:48Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Finally.</p>

<div>
<a  title="Permanent link to ‘John Siracusa: ‘Independence Day’’"  href="https://daringfireball.net/linked/2022/03/31/siracusa-independence-day">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>LA Times: ‘Bruce Willis’s Aphasia Was Suspected by Coworkers for Years’</title>
	<link rel="alternate" type="text/html" href="https://www.latimes.com/entertainment-arts/movies/story/2022-03-30/bruce-willis-aphasia-memory-loss-cognitive-disorder" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3h" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/03/31/willis-aphasia" />
	<id>tag:daringfireball.net,2022:/linked//6.39005</id>
	<published>2022-03-31T18:09:57Z</published>
	<updated>2022-03-31T19:54:05Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Meg James and Amy Kaufman, reporting for the LA Times:</p>

<blockquote>
  <p>According to those who have worked with the elder Willis on his recent films, the actor has been exhibiting signs of decline in recent years. In interviews with The Times this month, nearly two dozen people who were on set with the actor expressed concern about Willis’ well-being. […]</p>

<p>Jesse V. Johnson, who directed the low-budget film “White Elephant,” first worked with Willis decades ago when he was a stuntman. But when the filmmaker and the actor met briefly before shooting began in Georgia last April, “it was clear that he was not the Bruce I remembered,” Johnson said. Concerned about Willis’ mental state, he said he approached the actor’s team — which is led by his assistant-turned-handler Stephen J. Eads — and bluntly asked about the actor’s condition.</p>

<p>“They stated that he was happy to be there, but that it would be best if we could finish shooting him by lunch and let him go early,” Johnson recalled of the conversation. Filmmakers proceeded to quickly film the actor’s parts, even as Willis questioned where he was: “I know why you’re here, and I know why you’re here, but why am I here?” two crew members said he asked aloud.</p>
</blockquote>

<p>Sad story, but it explains Willis’s seemingly-odd low-budget film choices in recent years. According to The Times, Willis made 22 movies in 4 years.</p>

<p>I’ve been a huge Bruce Willis fan ever since <em>Moonlighting</em> (a show that, to my mind, doesn’t get nearly the credit it deserves for ushering in the modern era of “prestige TV”). Willis had the <em>it</em> that all great acting stars do: once you saw him in a role, it was impossible to imagine anyone else playing that part.</p>

<div>
<a  title="Permanent link to ‘LA Times: ‘Bruce Willis’s Aphasia Was Suspected by Coworkers for Years’’"  href="https://daringfireball.net/linked/2022/03/31/willis-aphasia">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
	<title>A Spate of SMS Spam From People’s Own Phone Numbers</title>
	<link rel="alternate" type="text/html" href="https://www.theverge.com/2022/3/28/22999719/spam-texts-own-phone-number-verizon-att-tmobile" />
	<link rel="shorturl" type="text/html" href="http://df4.us/u3g" />
	<link rel="related" type="text/html" href="https://daringfireball.net/linked/2022/03/30/spate-of-sms-spam" />
	<id>tag:daringfireball.net,2022:/linked//6.39004</id>
	<published>2022-03-30T21:58:11Z</published>
	<updated>2022-03-30T21:58:12Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<content type="html" xml:base="https://daringfireball.net/linked/" xml:lang="en"><![CDATA[
<p>Chris Welch, writing for The Verge:</p>

<blockquote>
  <p>This morning, I received a very blatant spam text offering me “a
little gift” for supposedly paying my phone bill. Normally I’d
groan, roll my eyes, and quickly delete such a thing, but there
was something different about this particular message: it was
spoofed as coming from my own phone number. As best my iPhone
could tell, it was a legitimate message from me to myself. Tapping
into the sender details took me to my own contact card. [...]</p>

<p>Turns out I wasn’t alone. Many customers on Verizon have <a href="https://www.reddit.com/r/verizon/comments/tplkdg/spam_from_my_own_number/">reported
getting similar spam</a> from their respective numbers over the
last few days — same for <a href="https://www.reddit.com/r/Visible/comments/tpqhv3/spam_text_from_my_own_number/">its MVNO Visible</a> — and several
<em>Verge</em> employees on other carriers have also encountered them. I
posted an Instagram story about it and have gotten plenty of
“same” responses. SMS phishing, or “smishing,” <a href="https://www.vice.com/en/article/m7appv/sms-phishing-is-getting-out-of-control">has been on the
rise</a> in recent years, but there’s something more disconcerting
and invasive about it being linked to your own number. It’s all
very “the call is coming from inside the house.”</p>
</blockquote>

<p>I got the same exact spam over the weekend, but instead of coming from my personal phone number (which is indeed on Verizon), it came to my personal phone number <em>from</em> my Google Voice number. Spooky, to say the least.</p>

<p>My wife got the same spam over the weekend too, from her own number to her own number, and for a moment, it was really freaky, because she had previously only texted herself to send photos from one device to another. So the whole chain of messages above the spam message made it look like the spammer was somehow sending her photos from her own photo library.</p>

<div>
<a  title="Permanent link to ‘A Spate of SMS Spam From People’s Own Phone Numbers’"  href="https://daringfireball.net/linked/2022/03/30/spate-of-sms-spam">&nbsp;★&nbsp;</a>
</div>

	]]></content>
  </entry><entry>
    
    <link rel="alternate" type="text/html" href="https://daringfireball.net/2022/03/doj_google_communicate_with_care" />
	<link rel="shorturl" href="http://df4.us/u2w" />
	<id>tag:daringfireball.net,2022://1.38984</id>
	<published>2022-03-24T18:14:07Z</published>
	<updated>2022-03-26T23:18:45Z</updated>
	<author>
		<name>John Gruber</name>
		<uri>http://daringfireball.net/</uri>
	</author>
	<summary type="text">Part of me thinks this “Communicate With Care” policy at Google is just arrogant, but more than that, I think it’s just foolishly stubborn. If you don’t want it discovered, don’t put it in email.</summary>
	<content type="html" xml:base="https://daringfireball.net/" xml:lang="en"><![CDATA[
<p><a href="https://arstechnica.com/tech-policy/2022/03/google-routinely-hides-emails-from-litigation-by-ccing-attorneys-doj-alleges/">Jon Brodkin, writing for Ars Technica</a>:</p>

<blockquote>
  <p>The US Department of Justice and 14 state attorneys general
yesterday asked a federal judge to sanction Google for misusing
attorney-client privilege to hide emails from litigation.</p>

<p>“In a program called ‘Communicate with Care,’ Google trains and
directs employees to add an attorney, a privilege label, and a
generic ‘request’ for counsel’s advice to shield sensitive
business communications, regardless of whether any legal advice is
actually needed or sought. Often, knowing the game, the in-house
counsel included in these Communicate-with-Care emails does not
respond at all,” the DOJ told the court. The fact that attorneys
often don’t reply to the emails “underscor[es] that these
communications are not genuine requests for legal advice but
rather an effort to hide potential evidence,” the DOJ said. [...]</p>

<p>CCing lawyers is a <a href="https://www.todaysgeneralcounsel.com/to-cc-or-not-to-cc-that-is-the-privilege-question/">common
practice</a>,
but the DOJ says Google took it to an “egregious” level. “Google’s
institutionalized manufacturing of false privilege claims is
egregious, spanning nearly a decade and permeating the company
from the top executives on down,” the DOJ said.</p>
</blockquote>

<p>Without commenting on Google’s program or the specifics of the DOJ’s accusations, the broader issue makes me think about the nature of digital communication. Pre-email, business communication between colleagues was typically either in-person (not recorded), on the phone (not recorded), or via printed memoranda and reports (recorded, on paper). During a legal inquiry, printed memos could be subpoenaed or subject to discovery, and phone records could too. But telephone records only show who called whom, when, and for how long. The content of phone calls wasn’t (and still isn’t) recorded.</p>

<p>Email corresponds directly to the form of printed memos. That’s even where email lingo like “CC” and the “Subject” line comes from. (“CC” originally stood for “<a href="https://www.merriam-webster.com/dictionary/carbon%20copy">carbon copy</a>”, which is how those copies were actually made — using <a href="https://en.wikipedia.org/wiki/Carbon_paper">carbon paper</a>.) Emails are seemingly just like paper memos, only digital. But, because email is so much more profoundly convenient to use, both to send and receive, it quickly became more casual. Psychologically, using email for work <em>feels</em> a lot more like face-to-face conversations or phone calls. Many people with office jobs send thousands of emails per year at work. Only a maniac sent out thousands of printed memos per year pre-email.</p>

<p>I don’t think you have to be doing something immoral or on shaky legal footing to want to communicate with colleagues privately, without fear of those communications being exposed in future legal inquiries. Any sort of strategic deliberation is something you’d naturally want to remain forever private. So I get the basic desire. But I think a loose policy of just cc’ing company attorneys on we-want-this-to-remain-private emails is a poor strategy. The emails are still there. And the DOJ and state attorneys general can look at this behavior, see that the lawyers aren’t really involved in the discussions, and raise a stink about it, as they have with Google. Whatever the contents of those emails, this “Communicate With Care” program <em>looks</em> shady.</p>

<p>Last year, writing about a Phil Schiller email that was made public through discovery in the Epic v. Apple lawsuit, <a href="https://daringfireball.net/2021/06/app_store_the_schiller_cut#fn1-2021-06-07">I asked a question in a footnote</a>:<sup id="fnr1-2022-03-24"><a href="#fn1-2022-03-24">1</a></sup></p>

<blockquote>
  <p>It really has all been email, too. Unless I’m missing something,
not one piece of communication entered into evidence — from
either Apple or Epic — has been anything other than an email
message. Not one message from iMessage or any other messaging
service. I find that very surprising. Do Apple executives never
use iMessage to discuss work? Nor Epic’s? If anyone with legal
expertise can explain why this is, let me know.</p>
</blockquote>

<p>I got a few answers from readers. Basically, there’s little that would stop either side in a lawsuit from demanding access to private messages from services like iMessage, WhatsApp, Signal, <s>Telegram,</s> etc. [Correction: <a href="https://daringfireball.net/linked/2022/03/25/telegram-encryption">Telegram should not be in that list</a>.] In criminal investigations, of course, law enforcement often does attempt to obtain such messages — law enforcement tries to obtain <em>everything</em>. But in many civil proceedings there’s an unspoken gentleperson’s agreement not to pursue such messages through discovery, being deemed too broad, too personal, too invasive. Technically, there’s a big difference between these services and email. Email is stored unencrypted on a server. The aforementioned messaging services are end-to-end encrypted. You’d have to get them from the individual parties’ devices — presuming they weren’t deleted.</p>

<p>So what I don’t get about Google’s “Communicate With Care” policy is why it involves email at all. Why not a policy recommending against using email, period, for anything deemed confidential? I get that Google is in <a href="https://arstechnica.com/gadgets/2021/08/a-decade-and-a-half-of-instability-the-history-of-google-messaging-apps/">a uniquely awkward position</a> regarding post-email messaging services, but how about just using a service other than email that’s end-to-end encrypted? Or discussing all such matters in person or over voice? Part of me thinks this “Communicate With Care” policy at Google is just arrogant, but more than that, I think it’s just foolishly stubborn. If you don’t want it discovered, don’t put it in email.</p>

<p>On the other hand, <a href="https://www.eff.org/deeplinks/2009/12/google-ceo-eric-schmidt-dismisses-privacy">as Eric Schmidt himself once advised</a>, “If you have something that you don’t want anyone to know, maybe you shouldn’t be doing it in the first place.”</p>

<div class="footnotes">
<hr />
<ol>
<li id="fn1-2022-03-24">
<p>Speaking of footnotes, post-publication, a friend pointed me to at least one iMessage exchange that <em>was</em> entered into evidence in Epic v. Apple — exhibit PX-0276, between Apple employees Herve Sibert and Eric Friedman. I can’t find a link online, but it was part of a trove of evidence that was briefly hosted on Box.com during the trial. I’ll host <a href="https://daringfireball.net/misc/2022/03/PX-0276.pdf">a copy of the PDF here</a>. It doesn’t strike me as particularly interesting in and of itself, but it does show that at least one iMessage exchange was entered into evidence.&nbsp;<a href="#fnr1-2022-03-24"  class="footnoteBackLink"  title="Jump back to footnote 1 in the text.">&#x21A9;&#xFE0E;</a></p>
</li>
</ol>
</div>
]]></content>
  <title>★ The D.O.J. Goes After Google’s ‘Communicate With Care’ Program</title></entry></feed>
<!-- THE END -->
`;

export default { rss, jsonFeed };
