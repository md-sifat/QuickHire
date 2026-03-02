import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LatestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get('https://quick-hire-server-eta.vercel.app/jobs');
        setJobs(res.data.data.slice(0, 8));
      } catch (err) {
        console.error('Failed to load latest jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Latest <span className="text-purple-600">jobs open</span>
          </h2>
          <Link
            to="/jobs"
            className="mt-3 sm:mt-0 text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1.5 text-sm md:text-base"
          >
            Show all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-44 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 group flex flex-col"
              >
                {/* Company + title */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                    {job.company?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{job.company} • {job.location}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags?.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full">
                    {job.type || 'Full Time'}
                  </span>
                </div>

                {/* Short description preview */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                  {job.description}
                </p>

                <span className="text-purple-600 text-sm font-medium self-start group-hover:underline">
                  View Details →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;