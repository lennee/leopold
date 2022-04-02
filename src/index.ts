import express from "express";

import asana from "./routers/asana";
import leopold from "./routers/leopold";
import google_calendar from "./routers/google_calendar";
import slack from "./routers/slack";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// Register Service Routers
app.use('/api/asana', asana);
app.use('/api/slack', slack);
app.use('/api/leopold', leopold);
app.use('/api/google/calendar', google_calendar);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
