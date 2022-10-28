import NavBar from "../islands/public-navbar.tsx"
import CtaPanel from "../components/cta-panel.tsx"
import Pricing  from '../components/public/pricing.tsx';
import SimplePricing  from '../components/simple-pricing.tsx';


export default function(){
    return <>
        <NavBar nav={ {_: {'Sign In':{href:'/login'}, 'Sign Up':{href:'/register'}}} }/>
        <SimplePricing/>
        <Pricing/>
        <CtaPanel />
    </>
}