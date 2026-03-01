import React from 'react';
import Hero from '../components/Hero';
import Companies from '../components/Companies';
import Categories from '../components/Categories';
import FeaturedJobs from '../components/FeaturedJobs';
import LatestJobs from '../components/LatestJobs';

const Home = () => {
  return (
    <>
      <Hero />
      <Companies />
      <Categories />
      <FeaturedJobs />
      <LatestJobs />
    </>
  );
};

export default Home;