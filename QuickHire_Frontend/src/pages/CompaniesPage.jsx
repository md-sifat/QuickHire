import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'https://quick-hire-server-eta.vercel.app';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, [search, industry, location]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/jobs`);
      const jobs = res.data.data || [];

      const companyMap = new Map();

      jobs.forEach((job) => {
        const compName = job.company;
        if (!compName) return;

        if (!companyMap.has(compName)) {
          companyMap.set(compName, {
            name: compName,
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(compName)}&background=random&size=128`,
            industry: job.tags?.[0] || 'Technology', // fallback
            location: job.location.split(',')[0] || 'Remote',
            size: '51-200 employees', // placeholder - you can add real data later
            description: `Leading ${job.tags?.[0] || 'tech'} company building innovative solutions.`,
            rating: (Math.random() * 0.8 + 4.2).toFixed(1),
            openJobs: 0,
          });
        }

        const comp = companyMap.get(compName);
        comp.openJobs += 1;
      });

      let result = Array.from(companyMap.values());

      if (search) {
        const term = search.toLowerCase();
        result = result.filter((c) => c.name.toLowerCase().includes(term));
      }
      if (industry) {
        result = result.filter((c) => c.industry.toLowerCase().includes(industry.toLowerCase()));
      }
      if (location) {
        result = result.filter((c) => c.location.toLowerCase().includes(location.toLowerCase()));
      }

      setCompanies(result);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Browse Companies
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Discover innovative companies hiring talented people like you. Explore culture, open roles, and more.
          </p>

          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:col-span-2 bg-white/20 border border-white/30 rounded-xl px-5 py-3.5 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition"
              />
              <input
                type="text"
                placeholder="Industry (e.g. Tech, Finance)"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-xl px-5 py-3.5 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-xl px-5 py-3.5 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No companies found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {companies.map((company) => (
              <Link
                key={company.name}
                to={`/companies/detail?name=${encodeURIComponent(company.name)}`}
                className="
                  group bg-white rounded-2xl border border-gray-200 
                  overflow-hidden shadow-sm hover:shadow-xl 
                  hover:border-indigo-200 transition-all duration-300
                  flex flex-col
                "
              >
                <div className="h-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6 border-b border-gray-100">
                  <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center text-indigo-600 font-bold text-3xl">
                    {company.name.charAt(0)}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">
                    {company.name}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="text-indigo-400">🏢</span> {company.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-indigo-400">📍</span> {company.location}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-5 line-clamp-2 flex-1">
                    {company.description}
                  </p>

                  <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{company.rating}</span>
                    </div>
                    <div className="text-indigo-600 font-medium">
                      {company.openJobs} open roles
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;