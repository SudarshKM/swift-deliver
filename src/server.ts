import express from 'express'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());

app.get('/health', (req, res) => {
 res.json({status: "healthy", message: "SwiftDeliver Backend"});
});

app.get('/register', (req, res) => {
    res.json({status: "registerOpen", message: "SwiftDeliver Register API"});
});

app.listen(PORT, () => {
console.log(`Server running in port ${PORT}`);
});

export default app;

