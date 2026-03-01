import React from 'react';
import { useNavigate } from 'react-router-dom';

import heroImage from '../assets/Pic.png'; 

const Hero = () => {
  const navigate = useNavigate();

  const handleSearchRedirect = () => {
    navigate('/jobs');
  };

  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Discover
            <br />
            more than{' '}
            <span className="text-purple-600">5000+</span> Jobs
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
            Great platform for the job seeker that searching for new career heights and passionate about startups.
          </p>

          <div className="mt-10 flex justify-center lg:justify-start">
            <button
              onClick={handleSearchRedirect}
              className="group relative inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg px-10 py-5 rounded-full shadow-lg shadow-purple-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-300/50 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              <span>Search Your Desire Jobs</span>
              <svg
                className="w-6 h-6 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            Popular:{' '}
            <span className="text-purple-600 font-medium hover:underline cursor-pointer">
              UI Designer
            </span>
            ,{' '}
            <span className="text-purple-600 font-medium hover:underline cursor-pointer">
              UX Researcher
            </span>
            ,{' '}
            <span className="text-purple-600 font-medium hover:underline cursor-pointer">
              Android
            </span>
            ,{' '}
            <span className="text-purple-600 font-medium hover:underline cursor-pointer">
              Admin
            </span>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src={heroImage || 'https://images.unsplash.com/photo-1556155099-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
              alt="Happy professional pointing to opportunities"
              className="w-full max-w-md lg:max-w-lg rounded-2xl shadow-2xl object-cover border-8 border-white"
            />

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;