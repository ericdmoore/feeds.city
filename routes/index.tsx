import type {Handlers} from '$fresh/server.ts'
import Counter from "../islands/Counter.tsx";

import { TopHatBlack } from '../components/TopHat.tsx';
import PublicHero from '../islands/public-hero.tsx';
import PublicFeatures from '../components/public/featureGrid.tsx'
import Testimonial from '../components/public/testimonial.tsx';
import Pricing  from '../components/public/pricing.tsx';
import Stats from '../components/public/stats.tsx';
import SignUp from '../islands/public-signup.tsx';
import Footer  from '../components/public/footer.tsx'


// Evnatually this is a public marketing page

export default function Home() {
  return (
    <>
      <TopHatBlack 
        title='Feeds.City' 
        description='A citywide set of feeds to be customized' 
        icon='/feedCityRingDropsLogo.svg'
      />
      <PublicHero nav={ {_: {'Sign In':{href:'/login'}, 'Sign Up':{href:'/register'}}} }/>
      <PublicFeatures/>
      <Testimonial 
        author={{name:"Marie Chilvers",title:'CEO, Workcation'}} 
        bgImg={{src:"https://tailwindui.com/img/logos/workcation-logo-white.svg", alt:'Workstation Marketing background Image'}} 
        testimonial={`This app has completely transformed how we interact with customers. We've seen record bookings, higher customer satisfaction, and reduced churn.`}
      />
      {/* Sausage:'99.999%' */}
      <Stats 
        line1='Trusted by developers from over 80 planets' 
        line2='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium' 
        stats={{Pepperoni:'100%', Delivery:'24/7', Calories:'100k'}}/>
      <Pricing/>
      <SignUp/>
      <Footer
        nav={{About:'/about', Blog: '/blog', Jobs:'/jobs', Press:'/press',Market:'/market'} } 
        social={{
          Twitter: {alias:'twitter', href:'https://twitter.com'},
          Discord: {alias:'discord', href:'https://discord.com'},
          YouTube: {alias:'youtube', href:'https://youtube.com'},
          Twitch: {alias:'twitch', href:'https://twitch.com'},
          Reddit: {alias:'reddit', href:'https://reddit.com'},
          GitHub: {alias:'github', href:'https://github.com'},
        }}
      />
    </>
  );
}