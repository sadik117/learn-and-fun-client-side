import React from 'react';
import HeroSection from '../layouts/HeroSection';
import SkillsSection from '../layouts/SkillsSection';
import PrizeCarousel from '../layouts/PrizeCarousel';

const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <PrizeCarousel></PrizeCarousel>
            <SkillsSection></SkillsSection>
        </div>
    );
};

export default Home;