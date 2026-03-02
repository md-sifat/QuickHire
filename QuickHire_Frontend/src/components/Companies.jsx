import React from 'react';
import vodaphone from '../assets/companies/vodaphone.ico';
import intel from '../assets/companies/intel.webp';
import amd from '../assets/companies/amd.jpg';
import talkit from '../assets/companies/talkit.png';    


const companyLogos = [
  {
    name: 'Vodafone',
    logo: vodaphone,
  },
  {
    name: 'Intel',
    logo: intel,
  },
  {
    name: 'Tesla',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/512px-Tesla_Motors.svg.png',
  },
  {
    name: 'AMD',
    logo: amd,
  },
  {
    name: 'Talkit', 
    logo: talkit,
  },
];

const Companies = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-600 mb-10 md:mb-12">
          Companies we helped grow
        </h2>

        {/* Logos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center">
          {companyLogos.map((company) => (
            <div
              key={company.name}
              className="group relative w-full max-w-[180px] h-16 md:h-20 flex items-center justify-center grayscale transition-all duration-300 hover:grayscale-0 hover:scale-110 hover:shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          Join hundreds of growing startups and tech companies hiring on QuickHire
        </div>
      </div>
    </section>
  );
};

export default Companies;