import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'https://quick-hire-server-eta.vercel.app';

const AdminDashboard = () => {
    const { user, isAdmin, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('add-job'); 
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'Full Time',
        description: '',
        requirements: '',
        responsibilities: '',
        tags: '',
        category: ''
    });

    // For editing job
    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [jobsRes, appsRes] = await Promise.all([
                    axios.get(`${BASE_URL}/jobs`),
                    axios.get(`${BASE_URL}/api/applications`)
                ]);
                setJobs(jobsRes.data.data || []);
                setApplications(appsRes.data.data || []);
            } catch (err) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAdmin, navigate]);

    const handleInputChange = (e) => {
        setNewJob({ ...newJob, [e.target.name]: e.target.value });
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            const jobData = {
                ...newJob,
                requirements: newJob.requirements.split(',').map(s => s.trim()).filter(Boolean),
                responsibilities: newJob.responsibilities.split(',').map(s => s.trim()).filter(Boolean),
                tags: newJob.tags.split(',').map(s => s.trim()).filter(Boolean),
                created_at: new Date(),
            };

            await axios.post(`${BASE_URL}/api/jobs`, jobData);
            toast.success('Job posted successfully!');

            // Refresh jobs list
            const res = await axios.get(`${BASE_URL}/jobs`);
            setJobs(res.data.data || []);

            // Reset form
            setNewJob({
                title: '', company: '', location: '', salary: '', type: 'Full Time',
                description: '', requirements: '', responsibilities: '', tags: '', category: ''
            });
        } catch (err) {
            toast.error('Failed to post job');
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Delete this job?')) return;
        try {
            await axios.delete(`${BASE_URL}/jobs/${id}`);
            toast.success('Job deleted');
            setJobs(jobs.filter(j => j._id !== id));
        } catch (err) {
            toast.error('Failed to delete job');
        }
    };

    const startEditJob = (job) => {
        setEditingJob({
            ...job,
            requirements: job.requirements?.join(', ') || '',
            responsibilities: job.responsibilities?.join(', ') || '',
            tags: job.tags?.join(', ') || ''
        });
    };

    const handleEditChange = (e) => {
        setEditingJob({ ...editingJob, [e.target.name]: e.target.value });
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();

        if (!editingJob?._id) {
            toast.error('No job ID found');
            return;
        }

        try {
            const updatedData = {
                ...editingJob,
                requirements: typeof editingJob.requirements === 'string'
                    ? editingJob.requirements.split(',').map(s => s.trim()).filter(Boolean)
                    : editingJob.requirements || [],
                responsibilities: typeof editingJob.responsibilities === 'string'
                    ? editingJob.responsibilities.split(',').map(s => s.trim()).filter(Boolean)
                    : editingJob.responsibilities || [],
                tags: typeof editingJob.tags === 'string'
                    ? editingJob.tags.split(',').map(s => s.trim()).filter(Boolean)
                    : editingJob.tags || [],
            };

            const response = await axios.put(`${BASE_URL}/jobs/${editingJob._id}`, updatedData);

            if (response.data.success) {
                toast.success('Job updated successfully!');
                const res = await axios.get(`${BASE_URL}/jobs`);
                setJobs(res.data.data || []);
                setEditingJob(null);
            } else {
                toast.error(response.data.message || 'Update failed');
            }
        } catch (err) {
            console.error('Full update error:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || 'Failed to update job');
        }
    };

    const handleUpdateApplication = async (id, status) => {
        try {
            await axios.put(`${BASE_URL}/api/applications/${id}`, { status });
            toast.success(`Application marked as ${status}`);
            setApplications(apps => apps.map(a => a._id === id ? { ...a, status } : a));
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteApplication = async (id) => {
        if (!window.confirm('Delete this application?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/applications/${id}`);
            toast.success('Application deleted');
            setApplications(apps => apps.filter(a => a._id !== id));
        } catch (err) {
            toast.error('Failed to delete application');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white py-5 px-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-6">
                        <span className="text-sm opacity-90">Logged in as {user?.email}</span>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-5 py-6">
                <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-200 pb-4">
                    <button
                        onClick={() => setActiveTab('add-job')}
                        className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 ${activeTab === 'add-job'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                    >
                        Add New Job
                    </button>

                    <button
                        onClick={() => setActiveTab('all-jobs')}
                        className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 ${activeTab === 'all-jobs'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                    >
                        All Jobs ({jobs.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 ${activeTab === 'applications'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                    >
                        Applications ({applications.length})
                    </button>
                </div>

                {/* Animated Section Content */}
                <div className="transition-all duration-500 ease-in-out">
                    {/* Add New Job */}
                    {activeTab === 'add-job' && (
                        <div className="animate-fade-in">
                            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold mb-8 text-gray-900">Post a New Job</h2>
                                <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input name="title" placeholder="Job Title *" value={newJob.title} onChange={handleInputChange} required className="border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                    <input name="company" placeholder="Company Name *" value={newJob.company} onChange={handleInputChange} required className="border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                    <input name="location" placeholder="Location (e.g. Remote / Singapore)" value={newJob.location} onChange={handleInputChange} required className="border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                    <input name="salary" placeholder="Salary Range (optional)" value={newJob.salary} onChange={handleInputChange} className="border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                                        <select name="category" value={newJob.category} onChange={handleInputChange} required className="w-full border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                            <option value="">Select Category</option>
                                            <option value="Design">Design</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Business">Business</option>
                                            <option value="Human Resources">Human Resources</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type *</label>
                                        <select name="type" value={newJob.type} onChange={handleInputChange} required className="w-full border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                            <option value="Full Time">Full Time</option>
                                            <option value="Part Time">Part Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>

                                    <textarea name="description" placeholder="Full Job Description *" value={newJob.description} onChange={handleInputChange} required rows="4" className="border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 md:col-span-2" />
                                    <input name="tags" placeholder="Tags (comma separated)" value={newJob.tags} onChange={handleInputChange} className="border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 md:col-span-2" />
                                    <input name="requirements" placeholder="Requirements (comma separated)" value={newJob.requirements} onChange={handleInputChange} className="border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 md:col-span-2" />
                                    <input name="responsibilities" placeholder="Responsibilities (comma separated)" value={newJob.responsibilities} onChange={handleInputChange} className="border border-gray-300 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 md:col-span-2" />

                                    <button type="submit" className="bg-indigo-600 text-white py-3.5 rounded-lg font-medium hover:bg-indigo-700 transition md:col-span-2 shadow-md">
                                        Publish Job
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* All Jobs */}
                    {activeTab === 'all-jobs' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-8 text-gray-900">All Jobs ({jobs.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobs.map(job => (
                                    <div key={job._id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                                        <p className="text-gray-600 mb-1">{job.company} • {job.location}</p>
                                        <p className="text-sm text-gray-500 mb-4">{job.type || 'Full Time'}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {job.tags?.map((tag, i) => (
                                                <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => startEditJob(job)}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Applications */}
                    {activeTab === 'applications' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-8 text-gray-900">Applications ({applications.length})</h2>
                            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Job ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {applications.map(app => (
                                            <tr key={app._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-gray-900">{app.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{app.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{app.job_id}</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={app.status || 'pending'}
                                                        onChange={(e) => handleUpdateApplication(app._id, e.target.value)}
                                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="reviewed">Reviewed</option>
                                                        <option value="accepted">Accepted</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDeleteApplication(app._id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Edit Job Modal */}
                {editingJob && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-6">Edit Job: {editingJob.title}</h2>
                                <form onSubmit={handleUpdateJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input name="title" value={editingJob.title} onChange={handleEditChange} required className="border p-3 rounded-lg" />
                                    <input name="company" value={editingJob.company} onChange={handleEditChange} required className="border p-3 rounded-lg" />
                                    <input name="location" value={editingJob.location} onChange={handleEditChange} required className="border p-3 rounded-lg" />
                                    <input name="salary" value={editingJob.salary || ''} onChange={handleEditChange} className="border p-3 rounded-lg" />
                                    <select name="category" value={editingJob.category || ''} onChange={handleEditChange} required className="border p-3 rounded-lg">
                                        <option value="">Select Category</option>
                                        <option value="Design">Design</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Business">Business</option>
                                        <option value="Human Resources">Human Resources</option>
                                    </select>
                                    <select name="type" value={editingJob.type || 'Full-Time'} onChange={handleEditChange} className="border p-3 rounded-lg">
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                    <textarea name="description" value={editingJob.description} onChange={handleEditChange} required rows="3" className="border p-3 rounded-lg md:col-span-2" />
                                    <input name="tags" value={editingJob.tags} onChange={handleEditChange} placeholder="Tags (comma separated)" className="border p-3 rounded-lg md:col-span-2" />
                                    <input name="requirements" value={editingJob.requirements} onChange={handleEditChange} placeholder="Requirements (comma separated)" className="border p-3 rounded-lg md:col-span-2" />
                                    <input name="responsibilities" value={editingJob.responsibilities} onChange={handleEditChange} placeholder="Responsibilities (comma separated)" className="border p-3 rounded-lg md:col-span-2" />
                                    <div className="md:col-span-2 flex gap-4">
                                        <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700">
                                            Update Job
                                        </button>
                                        <button type="button" onClick={() => setEditingJob(null)} className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;