import { Router } from 'express'
import type { Request, Response } from 'express'
import { generateItinerary } from '../services/itinerary.js'
import type { Hotel } from '../types.js'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { hotel, nights = 3, guests = 2 } = req.body as { hotel: Hotel; nights: number; guests: number }

  if (!hotel?.name || !hotel?.destinationDetails?.displayName) {
    res.status(400).json({ error: 'hotel is required' })
    return
  }

  try {
    const data = await generateItinerary(hotel, nights, guests)
    res.json({
      destination: hotel.destinationDetails.displayName,
      hotel,
      nights,
      guests,
      ...data,
    })
  } catch (err) {
    console.error('[itinerary] error:', err)
    res.status(500).json({ error: 'Failed to generate itinerary' })
  }
})

export default router
