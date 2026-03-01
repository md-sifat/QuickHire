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
        // await client.connect();
        const jobsCollection = client.db(process.env.MONGO_DB_NAME).collection("jobs");

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
                const { title, category, company, location, salary , type, description, requirements, responsibilities , tags } = req.body;

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
