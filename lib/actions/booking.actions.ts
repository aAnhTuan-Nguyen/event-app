import { Booking } from '@/database'
import connectToDatabase from '@/lib/mongodb'

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string }) => {
  try {
    await connectToDatabase()
    const booking = (await Booking.create({ eventId, slug, email })).lean()
    return { success: true, data: booking }
  } catch (error) {
    console.error('Error creating booking:', error)
    return { success: false, error: error }
  }
}
