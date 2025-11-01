import { Schema, model, models, Document } from 'mongoose'

/**
 * TypeScript interface for Event document
 * Extends Document to include Mongoose document properties
 */
export interface IEvent extends Document {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Event Schema Definition
 * Includes validation, indexing, and automatic timestamps
 */
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Date is required']
    },
    time: {
      type: String,
      required: [true, 'Time is required']
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be online, offline, or hybrid'
      },
      lowercase: true
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v && v.length > 0,
        message: 'Agenda must have at least one item'
      }
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v && v.length > 0,
        message: 'At least one tag is required'
      }
    }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    collection: 'events'
  }
)

/**
 * Pre-save hook to generate URL-friendly slug from title
 * Only regenerates if title is modified
 */
EventSchema.pre('save', function (next) {
  // Only generate slug if title is new or modified
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  // Normalize date to ISO format if it's a valid date string
  if (this.isModified('date')) {
    const parsedDate = new Date(this.date)
    if (!isNaN(parsedDate.getTime())) {
      this.date = parsedDate.toISOString().split('T')[0] // YYYY-MM-DD format
    } else {
      return next(new Error('Invalid date format'))
    }
  }

  // Normalize time to HH:MM format
  if (this.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/
    if (!timeRegex.test(this.time)) {
      return next(new Error('Time must be in HH:MM format'))
    }
  }

  next()
})

/**
 * Export Event model
 * Uses models cache to prevent model recompilation in development
 */
const Event = models.Event || model<IEvent>('Event', EventSchema)

export default Event
