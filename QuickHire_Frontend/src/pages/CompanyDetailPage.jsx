import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'https://quick-hire-server-eta.vercel.app';

const CompanyDetails = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const companyNameFromUrl = searchParams.get('name');

  const [company, setCompany] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyNameFromUrl) {
      setError('No company selected');
      setLoading(false);
      return;
    }

    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${BASE_URL}/jobs`);
        const allJobs = res.data.data || [];
        const matchingJobs = allJobs.filter(
          (job) => job.company?.trim().toLowerCase() === companyNameFromUrl.trim().toLowerCase()
        );

        if (matchingJobs.length === 0) {
          throw new Error(`No information found for ${companyNameFromUrl}`);
        }

        const baseJob = matchingJobs[0];
        const derivedCompany = {
          name: baseJob.company,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(baseJob.company)}&background=4f46e5&color=fff&size=256`,
          industry: baseJob.category || 'Technology',
          location: baseJob.location || 'Global / Remote',
          size: '101-500 employees',
          founded: '2016',
          website: `https://${baseJob.company.toLowerCase().replace(/\s+/g, '')}.com`,
          description: `${baseJob.company} is a forward-thinking company dedicated to innovation, excellence, and creating meaningful impact in the ${baseJob.category || 'tech'} industry. We believe in empowering teams to build the future.`,
          rating: (Math.random() * 0.6 + 4.4).toFixed(1),
          reviewsCount: Math.floor(Math.random() * 300 + 80),
          openJobsCount: matchingJobs.length,
          benefits: [
            'Competitive salary & equity',
            'Health & wellness coverage',
            'Remote-first flexibility',
            'Learning & development budget',
            'Paid parental leave',
            'Team retreats & events'
          ],
          culture: 'Collaborative, inclusive, and growth-oriented. We value transparency, creativity, and work-life balance while pushing the boundaries of what’s possible.',
        };

        setCompany(derivedCompany);
        setOpenJobs(matchingJobs);
      } catch (err) {
        setError(err.message || 'Failed to load company information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyNameFromUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Company Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/browse"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Browse All Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <img
            src={company.logo}
            alt={`${company.name} logo`}
            className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-6 rounded-2xl shadow-2xl border-4 border-white/30 object-cover"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {company.name}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">{company.industry}</p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
            <div className="bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
              📍 {company.location}
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
              👥 {company.size}
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
              ⭐ {company.rating} ({company.reviewsCount} reviews)
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20 font-medium">
              {company.openJobsCount} Open Roles
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">About {company.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{company.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Founded</p>
                  <p className="font-medium text-gray-900">{company.founded}</p>
                </div>
                <div>
                  <p className="text-gray-500">Website</p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Visit website
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Benefits & Perks</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {company.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500 text-xl">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Our Culture</h3>
              <p className="text-gray-700 leading-relaxed">{company.culture}</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Open Positions ({company.openJobsCount})
              </h2>

              {openJobs.length === 0 ? (
                <div className="text-center py-16 text-gray-600 bg-gray-50 rounded-xl">
                  <p className="text-xl font-medium">No open positions at the moment.</p>
                  <p className="mt-2">Please check back later or follow us for updates!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {openJobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/jobs/${job._id}`}
                      className="
                        block bg-gray-50 hover:bg-indigo-50/40 
                        rounded-xl p-6 border border-gray-200 
                        hover:border-indigo-300 transition-all duration-300
                        group
                      "
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span className="font-medium text-emerald-600">{job.type || 'Full Time'}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {job.tags?.slice(0, 4).map((tag, idx) => (
                              <span
                                key={idx}
                                className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:self-center">
                          <span className="text-indigo-600 font-medium whitespace-nowrap group-hover:underline">
                            Apply Now →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;