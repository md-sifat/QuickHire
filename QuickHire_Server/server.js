const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();
        const jobsCollection = client.db(process.env.MONGO_DB_NAME).collection("jobs");
        const applicationsCollection = client.db(process.env.MONGO_DB_NAME).collection("applications");

        // ....... to fetch the data and filter them ..............
        // GET all jobs
        app.get('/jobs', async (req, res) => {
            try {
                const jobs = await jobsCollection.find().sort({ created_at: -1 }).toArray();
                res.json({ success: true, data: jobs });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
            }
        });

        // GET jobs filtered by category
        app.get('/jobs/filter/category', async (req, res) => {
            try {
                const { category } = req.query;
                if (!category) {
                    return res.status(400).json({ success: false, message: 'Category query param is required' });
                }
                const jobs = await jobsCollection.find({ category: { $regex: category, $options: 'i' } }).sort({ created_at: -1 }).toArray();
                res.json({ success: true, data: jobs });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to fetch jobs by category' });
            }
        });

        // GET jobs filtered by job type
        app.get('/jobs/filter/type', async (req, res) => {
            try {
                const { job_type } = req.query;
                if (!job_type) {
                    return res.status(400).json({ success: false, message: 'job_type query param is required' });
                }
                const jobs = await jobsCollection.find({ type: { $regex: job_type, $options: 'i' } }).sort({ created_at: -1 }).toArray();
                res.json({ success: true, data: jobs });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to fetch jobs by job type' });
            }
        });

        // GET jobs searched by title
        app.get('/jobs/search/title', async (req, res) => {
            try {
                const { title } = req.query;
                if (!title) {
                    return res.status(400).json({ success: false, message: 'title query param is required' });
                }
                const jobs = await jobsCollection.find({ title: { $regex: title, $options: 'i' } }).sort({ created_at: -1 }).toArray();
                res.json({ success: true, data: jobs });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to search jobs by title' });
            }
        });

        // ----------------------- all Gets api edn here -------------

        // api for post a new job in database 
        app.post('/api/jobs', async (req, res) => {
            try {
                const { title, category, company, location, salary, type, description, requirements, responsibilities, tags } = req.body;

                if (!title || !company || !location || !description || !type) {
                    return res.status(400).json({ success: false, message: 'Required fields: title, company, location, job_type, description' });
                }

                const newJob = {
                    title,
                    company,
                    location,
                    category,
                    salary: salary || null,
                    type,
                    description,
                    requirements: requirements || [],
                    responsibilities: responsibilities || [],
                    tags: tags || [],
                    created_at: new Date(),
                };

                const result = await jobsCollection.insertOne(newJob);
                res.status(201).json({ success: true, message: 'Job created successfully', data: { _id: result.insertedId, ...newJob } });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to create job' });
            }
        });



        // api for GET a  single job by ID
        app.get('/jobs/:id', async (req, res) => {
            try {
                const { id } = req.params;
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ success: false, message: 'Invalid job ID' });
                }
                const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
                if (!job) {
                    return res.status(404).json({ success: false, message: 'Job not found' });
                }
                res.json({ success: true, data: job });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to fetch job' });
            }
        });

        // api for DELETE a job by ID by admin
        app.delete('/jobs/:id', async (req, res) => {
            try {
                const { id } = req.params;
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ success: false, message: 'Invalid job ID' });
                }
                const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) {
                    return res.status(404).json({ success: false, message: 'Job not found' });
                }
                res.json({ success: true, message: 'Job deleted successfully' });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to delete job' });
            }
        });




        // ..... api for handling the application for the job post .... ////


        // api for  posting a new application for a job post
        app.post('/applications', async (req, res) => {
            try {
                const { job_id, name, email, resume_link, cover_note } = req.body;

                if (!job_id || !name || !email || !resume_link) {
                    return res.status(400).json({
                        success: false,
                        message: 'Required fields: job_id, name, email, resume_link'
                    });
                }

                // Basic email validation using regex
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    return res.status(400).json({ success: false, message: 'Invalid email format' });
                }

                // Basic URL validation for resume
                try {
                    new URL(resume_link);
                } catch {
                    return res.status(400).json({ success: false, message: 'Invalid resume URL' });
                }

                // Check if job exists
                const jobExists = await jobsCollection.findOne({ _id: new ObjectId(job_id) });
                if (!jobExists) {
                    return res.status(404).json({ success: false, message: 'Job not found' });
                }

                const newApplication = {
                    job_id: new ObjectId(job_id),
                    name,
                    email,
                    resume_link,
                    cover_note: cover_note || '',
                    status: 'pending',
                    created_at: new Date(),
                };

                const result = await applicationsCollection.insertOne(newApplication);

                res.status(201).json({
                    success: true,
                    message: 'Application submitted successfully',
                    data: { _id: result.insertedId, ...newApplication }
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Failed to submit application' });
            }
        });

        // api to count jobs by category
        // GET /api/categories/counts
        app.get('/categories/counts', async (req, res) => {
            try {
                const pipeline = [
                    { $unwind: '$tags' },
                    {
                        $group: {
                            _id: '$tags',
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { count: -1 } },
                ];
                const result = await jobsCollection.aggregate(pipeline).toArray();
                res.json({ success: true, data: result });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to get category counts' });
            }
        });


        // api for upate application status by admin
        app.put('/api/applications/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const { status } = req.body;
                if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

                const result = await applicationsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status, updated_at: new Date() } }
                );

                if (result.matchedCount === 0) return res.status(404).json({ success: false, message: 'Application not found' });

                res.json({ success: true, message: 'Application updated' });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to update application' });
            }
        });

        app.delete('/api/applications/:id', async (req, res) => {
            try {
                const { id } = req.params;
                if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

                const result = await applicationsCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) return res.status(404).json({ success: false, message: 'Application not found' });

                res.json({ success: true, message: 'Application deleted' });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to delete application' });
            }
        });

        // GET all applications (for admin dashboard)
        app.get('/api/applications', async (req, res) => {
            try {
                const applications = await applicationsCollection.find()
                    .sort({ created_at: -1 }) // newest first
                    .toArray();

                res.json({
                    success: true,
                    count: applications.length,
                    data: applications
                });
            } catch (error) {
                console.error('Error fetching applications:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch applications' });
            }
        });

        // GET applications for a specific job
        app.get('/api/applications/job/:jobId', async (req, res) => {
            try {
                const { jobId } = req.params;

                if (!ObjectId.isValid(jobId)) {
                    return res.status(400).json({ success: false, message: 'Invalid job ID' });
                }

                const applications = await applicationsCollection.find({
                    job_id: new ObjectId(jobId)
                })
                    .sort({ created_at: -1 })
                    .toArray();

                res.json({
                    success: true,
                    count: applications.length,
                    data: applications
                });
            } catch (error) {
                console.error('Error fetching job applications:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch applications for job' });
            }
        });

        // PUT update job
        app.put('/jobs/:id', async (req, res) => {
            try {
                const { id } = req.params;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid job ID format'
                    });
                }

                const updateData = { ...req.body };
                delete updateData._id;
                if (typeof updateData.requirements === 'string') {
                    updateData.requirements = updateData.requirements
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);
                }

                if (typeof updateData.responsibilities === 'string') {
                    updateData.responsibilities = updateData.responsibilities
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);
                }

                if (typeof updateData.tags === 'string') {
                    updateData.tags = updateData.tags
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);
                }

                updateData.updated_at = new Date();

                const result = await jobsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Job not found'
                    });
                }

                return res.json({
                    success: true,
                    message: 'Job updated successfully',
                    modifiedCount: result.modifiedCount
                });

            } catch (error) {
                console.error('PUT /jobs/:id ERROR:', error);

                return res.status(500).json({
                    success: false,
                    message: 'Server error while updating job',
                    error: error.message
                });
            }
        });



        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("QuickHire Server is LIVE");
});

app.listen(port, () => {
    console.log(`server is running on port : ${port}`);
}
);
