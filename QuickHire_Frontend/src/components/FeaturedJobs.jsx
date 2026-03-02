import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('https://quick-hire-server-eta.vercel.app/jobs');
        setJobs(res.data.data.slice(0, 8));
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Featured <span className="text-indigo-600">Jobs</span>
          </h2>
          <Link
            to="/jobs"
            className="mt-4 sm:mt-0 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition-colors"
          >
            Show all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-60 bg-white rounded-2xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="
                  group bg-white rounded-2xl 
                  border border-gray-200 
                  overflow-hidden 
                  transition-all duration-300 
                  hover:border-indigo-300 
                  hover:shadow-lg hover:shadow-indigo-100/50 
                  hover:-translate-y-1
                "
              >
                <div className="p-6 md:p-7">
                  {/* Company Logo + Title */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl flex-shrink-0 border border-indigo-100">
                      {job.company?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <p className="text-sm text-gray-500 mb-5 flex items-center gap-1.5">
                    <span className="text-indigo-400">📍</span> {job.location}
                  </p>

                  {/* Tags & Type */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.tags?.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-medium border border-emerald-100">
                      {job.type || 'Full Time'}
                    </span>
                  </div>

                  {/* View Details */}
                  <span className="text-indigo-600 font-medium text-sm group-hover:text-indigo-800 transition-colors flex items-center gap-1.5">
                    View Details
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;