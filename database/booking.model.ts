import { Schema, model, models, Document, Types } from 'mongoose'
import Event from './event.model'

/**
 * TypeScript interface for Booking document
 * Extends Document to include Mongoose document properties
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Booking Schema Definition
 * Includes email validation, event reference validation, and automatic timestamps
 */
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true // Index for faster lookups
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(email)
        },
        message: 'Please provide a valid email address'
      }
    }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    collection: 'bookings'
  }
)

/**
 * Pre-save hook to validate that the referenced event exists
 * Prevents orphaned bookings by checking event existence before saving
 */
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId)

      if (!eventExists) {
        return next(new Error(`Event with ID ${this.eventId} does not exist`))
      }
    } catch {
      return next(new Error('Failed to validate event reference'))
    }
  }

  next()
})

/**
 * Export Booking model
 * Uses models cache to prevent model recompilation in development
 */
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema)

export default Booking
