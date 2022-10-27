import {AboutHero} from '../islands/public-about-hero.tsx'
import Centered from '../components/headerSection/centered.tsx'
import SectionWithTiles from '../components/headerSection/bgImgAndCards.tsx'
import ScollingCards from '../components/public/scrolling-cards.tsx'
import Footer from '../components/public/footer.tsx'
import ShopColelctions from '../components/public/bgWithOverlay.tsx'
import TieredImage from '../components/headerSection/tieredImage.tsx'
import BgImgSection from '../components/headerSection/bgImg.tsx'
import AlternatingFeatures from '../components/headerSection/alternatingFeatureSection.tsx'

export default function(){
    return (
        <>
            <AboutHero/>
            <Centered />
            <SectionWithTiles />
            <TieredImage />
            <BgImgSection />
            <AlternatingFeatures />
            <ShopColelctions/>
            <ScollingCards/>
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
    )
}