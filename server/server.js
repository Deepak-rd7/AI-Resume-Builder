import express from "express";
import cors from "cors";
import "dotenv/config";
import dbConnect from "./config/dbConnect.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

await dbConnect();
app.use(express.json());

app.use(cors(
  {
  origin:process.env.FRONTEND_URL,   // or 3000 based on your app
  credentials: true
  }
));



app.get("/", (req, res) => res.send("Server is live"));
app.use('/api/users',userRouter);
app.use('/api/resumes',resumeRouter);
app.use('/api/ai',aiRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
