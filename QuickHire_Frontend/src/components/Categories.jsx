import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'https://quick-hire-server-eta.vercel.app';

const Categories = () => {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${BASE_URL}/jobs`);
        const jobs = res.data.data || [];

        const countsMap = jobs.reduce((acc, job) => {
          const cat = job.category; 
          if (cat) {
            acc[cat] = (acc[cat] || 0) + 1;
          }
          return acc;
        }, {});

        const formatted = Object.entries(countsMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setCategoryData(formatted);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Could not load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  };

  const getIcon = (name) => {
    const icons = {
      Design: '✒️',
      Sales: '📈',
      Marketing: '📣',
      Finance: '💰',
      Technology: '💻',
      Engineering: '</>',
      Business: '💼',
      'Human Resources': '👥',
      Development: '🛠️',
      'Customer Support': '🎧',
    };
    return icons[name] || '📁';
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 md:mb-14 gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Explore by <span className="text-indigo-600">category</span>
          </h2>

          <button
            onClick={() => navigate('/jobs')}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1.5 transition-colors group text-sm sm:text-base"
          >
            Show all jobs
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-44 sm:h-52 bg-gray-100 rounded-2xl animate-pulse border border-gray-200"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-gray-600 font-medium">{error}</div>
        ) : categoryData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No categories found. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {categoryData.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`
                  group relative bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 lg:p-8
                  text-left overflow-hidden transition-all duration-300
                  hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/60
                  hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-400/50
                `}
              >
                {/* Icon */}
                <div className="text-4xl sm:text-5xl mb-5 sm:mb-6 text-indigo-500/70 group-hover:text-indigo-600 transition-colors">
                  {getIcon(cat.name)}
                </div>

                {/* Category name */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-2">
                  {cat.name}
                </h3>

                {/* Count + arrow */}
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 group-hover:text-indigo-600 font-medium transition-colors">
                  <span>{cat.count.toLocaleString()} jobs available</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">
                    →
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/0 to-transparent group-hover:from-indigo-50/30 group-hover:via-indigo-50/10 rounded-2xl transition-all duration-400 pointer-events-none"></div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;