import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobType, setJobType] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || '';

  const [category, setCategory] = useState(initialCategory);
  // ... rest of your code

  // When category changes (including from URL), fetch jobs
  useEffect(() => {
    fetchJobs();
  }, [category, jobType, searchTitle]);

  const categories = ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resources'];
  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];

  useEffect(() => {
    fetchJobs();
  }, [category, jobType, searchTitle]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'https://quick-hire-server-eta.vercel.app/jobs';
      if (category) {
        url = `https://quick-hire-server-eta.vercel.app/jobs/filter/category?category=${encodeURIComponent(category)}`;
      } else if (jobType) {
        url = `https://quick-hire-server-eta.vercel.app/jobs/filter/type?job_type=${encodeURIComponent(jobType)}`;
      } else if (searchTitle) {
        url = `https://quick-hire-server-eta.vercel.app/jobs/search/title?title=${encodeURIComponent(searchTitle)}`;
      }
      const res = await axios.get(url);
      setJobs(res.data.data || []);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">Find Your Dream Job</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through thousands of opportunities tailored for passionate professionals.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search by Title */}
            <form onSubmit={handleSearch} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Search by Title</label>
              <div className="flex">
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="e.g., Social Media Assistant"
                  className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-r-lg hover:bg-purple-700 transition">
                  Search
                </button>
              </div>
            </form>

            {/* Filter by Category */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setJobType('');
                  setSearchTitle('');
                }}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Filter by Job Type */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Filter by Job Type</label>
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value);
                  setCategory('');
                  setSearchTitle('');
                }}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 font-medium">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No jobs found. Try different filters!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
              >
                {/* Job Header */}
                <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-400 text-white">
                  <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                  <p className="text-sm opacity-90">{job.company} • {job.location}</p>
                </div>

                {/* Job Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags?.map((tag, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Posted: {new Date(job.created_at).toLocaleDateString()}</p>
                </div>

                {/* Footer with Details Button */}
                <div className="p-6 pt-0">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="block text-center bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition shadow-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;