import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// initializing the express application
const app = express();
// allows the app to be called from the frontend (cors: 'cross origin request')
app.use(cors());
// allows passing json from the frontend to the backend
app.use(express.json());

// dummy route route
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX",
  });
});

// allows us to get data from the frontend and have a body(payload)
app.post("/", async (req, res) => {
  // getting data from the body of the frontend request
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    // sending the response to the frontend
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(8000, () =>
  console.log("Server is running on port http://localhost:8000")
);
