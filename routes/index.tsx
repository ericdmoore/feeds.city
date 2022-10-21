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
      <PublicHero nav={ {login:{href:'/login'}, signUp:{href:'/register'}} }/>
      <PublicFeatures/>
      <Testimonial 
        author={{name:"Marie Chilvers",title:'CEO, Workcation'}} 
        bgImg={{src:"https://tailwindui.com/img/logos/workcation-logo-white.svg", alt:'Workstation Marketing background Image'}} 
        testimonial={`This app has completely transformed how we interact with customers. We've seen record bookings, higher customer satisfaction, and reduced churn.`}
      />
      <Stats line1='Trusted by developers from over 80 planets' line2='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium' stats={[]}/>
      <Pricing/>
      <SignUp/>
      <Footer/>
    </>
  );
}