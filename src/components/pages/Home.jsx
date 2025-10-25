import React from "react";
import HeroSection from "../layouts/HeroSection";
import SkillsSection from "../layouts/SkillsSection";
import PrizeCarousel from "../layouts/PrizeCarousel";
import ReferralProgram from "../layouts/ReferralProgram";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <PrizeCarousel></PrizeCarousel>
      <SkillsSection></SkillsSection>
      <ReferralProgram></ReferralProgram>
    </div>
  );
};

export default Home;
