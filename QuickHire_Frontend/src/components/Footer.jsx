import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-purple-900 to-purple-950 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-900 font-bold text-xl">
                Q
              </div>
              <span className="text-2xl font-bold">QuickHire</span>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Great platform for the job seeker that passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* About / Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li><a href="#" className="hover:text-white transition">Companies</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li><a href="#" className="hover:text-white transition">Help Docs</a></li>
              <li><a href="#" className="hover:text-white transition">Guide</a></li>
              <li><a href="#" className="hover:text-white transition">Updates</a></li>
              <li><a href="#" className="hover:text-white transition">Advice</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get job notifications</h3>
            <p className="text-purple-200 text-sm mb-4">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 py-3 rounded-lg bg-purple-800 border border-purple-700 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="bg-white text-purple-900 font-medium px-6 py-3 rounded-lg hover:bg-purple-100 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-purple-800 text-center text-sm text-purple-300">
          <p>© 2026 @ QuickHire. All rights reserved.</p>

          {/* Social icons */}
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-white transition">f</a>
            <a href="#" className="hover:text-white transition">📷</a>
            <a href="#" className="hover:text-white transition">𝕏</a>
            <a href="#" className="hover:text-white transition">in</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;