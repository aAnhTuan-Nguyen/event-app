'use server'
import { Booking } from '@/database'
import connectToDatabase from '@/lib/mongodb'

export const createBooking = async ({ eventId, email, slug }: { eventId: string; email: string; slug: string }) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email address'
      }
    }
    if (!slug || !eventId) {
      return {
        success: false,
        error: 'Missing required field'
      }
    }
    await connectToDatabase()
    await Booking.create({ eventId, email, slug })
    return {
      success: true
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    return {
      success: false,
      error: 'Failed to create booking. Please try again.'
    }
  }
}
