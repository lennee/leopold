import google_calendar from '../services/google/google_calendar'
import { Router } from 'express'

const googleCalendarRouter = Router()

googleCalendarRouter.get('/listEvents', (req, res) =>
  google_calendar.listEvents(req.body.calendarId)
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

googleCalendarRouter.get('/createEvent', (req, res) =>
  google_calendar.createEvent(req.body.calendarId, req.body.event)
    .then(() => res.status(200).send("Successfully Created Event"))
    .catch(() => res.sendStatus(500)));

export default googleCalendarRouter
