// src/components/Companies.jsx
import React from 'react';

// You can place these logo images in src/assets/companies/
// For now I'm using placeholder URLs from a public CDN (replace with your own images)

const companyLogos = [
  {
    name: 'Vodafone',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Vodafone_2017_logo.svg/512px-Vodafone_2017_logo.svg.png',
  },
  {
    name: 'Intel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Intel_logo_%282020%29.svg/512px-Intel_logo_%282020%29.svg.png',
  },
  {
    name: 'Tesla',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/512px-Tesla_Motors.svg.png',
  },
  {
    name: 'AMD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/AMD_Logo.svg/512px-AMD_Logo.svg.png',
  },
  {
    name: 'Talkit', // assuming this is a fictional or typo for "Talkdesk" or similar
    logo: 'https://via.placeholder.com/180x60/333/fff?text=Talkit',
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

              {/* Optional subtle background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Optional subtle note or call-to-action */}
        <div className="mt-10 text-center text-sm text-gray-500">
          Join hundreds of growing startups and tech companies hiring on QuickHire
        </div>
      </div>
    </section>
  );
};

export default Companies;