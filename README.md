# QuickHire – Job Portal Platform

Modern full-stack job portal for job seekers and companies.

**Live Demo:** [https://quick-hire-frontend-seven.vercel.app/](https://quick-hire-frontend-seven.vercel.app/)

**Admin Credentials (for testing):**
- Username: `admin`
- Password: `admin1234`

## Features

### For Job Seekers
- Browse thousands of jobs with powerful filters (category, job type, title search)
- View detailed job descriptions, requirements, responsibilities & company info
- Apply to jobs with resume link + cover note (requires login)
- Responsive design – works perfectly on mobile, tablet & desktop
- Google & Email/Password authentication
- Profile avatar & name display after login

### For Companies / Recruiters (via Admin Dashboard)
- Admin panel to manage jobs & applications
- Add new job postings
- Edit existing jobs
- Delete jobs
- View all applications
- Update application status (Pending → Reviewed → Accepted → Rejected)
- Delete applications
- Dashboard statistics: total jobs, total applications, pending count

### Tech Stack

**Frontend**
- React (Vite)
- React Router v6
- Tailwind CSS
- Firebase Authentication (Email + Google)
- Axios for API calls
- react-hot-toast for notifications
- Context API for global auth state

**Backend**
- Node.js + Express.js
- MongoDB Atlas (via Mongoose-like native driver)
- Vercel serverless deployment
- REST API endpoints for jobs & applications

**Deployment**
- Frontend: Vercel
- Backend: Vercel (serverless)
- Database: MongoDB Atlas

## Project Structure
