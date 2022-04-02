import * as GCal from '../services/google_calendar'
import { Router } from 'express'

const googleCalendarRouter = Router()

googleCalendarRouter.get('/listEvents', (req, res) =>
  GCal.listEvents(req.body.calendarId)
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

export default googleCalendarRouter
