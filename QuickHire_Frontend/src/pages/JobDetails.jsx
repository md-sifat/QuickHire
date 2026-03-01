import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyData, setApplyData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    resume_link: '',
    cover_note: '',
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`https://quick-hire-server-eta.vercel.app/jobs/${id}`);
      setJob(res.data.data);
    } catch (err) {
      setError('Failed to load job details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://quick-hire-server-eta.vercel.app/applications', { ...applyData, job_id: id });
      alert('Application submitted successfully!');
      navigate('/jobs');
    } catch (err) {
      alert('Failed to submit application.');
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">{error}</div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center text-gray-600">Job not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
          <p className="text-lg opacity-90 mb-4">{job.company} • {job.location}</p>
          <div className="flex flex-wrap gap-3">
            {job.tags?.map((tag, idx) => (
              <span key={idx} className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </section>

            {job.requirements?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">Requirements</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {job.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                </ul>
              </section>
            )}

            {job.responsibilities?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {job.responsibilities.map((resp, idx) => <li key={idx}>{resp}</li>)}
                </ul>
              </section>
            )}

            <p className="text-sm text-gray-500 mt-6">Posted on: {new Date(job.created_at).toLocaleDateString()}</p>
          </div>

          {/* Sidebar / Apply Form */}
          <div className="lg:col-span-1 bg-purple-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-6">Apply Now</h2>
            {user ? (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={applyData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={applyData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link (URL)</label>
                  <input
                    name="resume_link"
                    value={applyData.resume_link}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Note</label>
                  <textarea
                    name="cover_note"
                    value={applyData.cover_note}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 h-32"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition shadow-md"
                >
                  Submit Application
                </button>
              </form>
            ) : (
              <div className="text-center py-6 bg-white rounded-lg shadow-inner">
                <p className="text-gray-700 mb-4">You need to be logged in to apply.</p>
                <Link to="/login" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition">
                  Log In to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;