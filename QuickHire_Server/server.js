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
                const jobs = await jobsCollection.find({ tags: { $regex: category, $options: 'i' } }).sort({ created_at: -1 }).toArray();
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
                const jobs = await jobsCollection.find({ job_type: { $regex: job_type, $options: 'i' } }).sort({ created_at: -1 }).toArray();
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
