import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Event } from '@/database'

type RouteParams = {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 *
 * @param request - Next.js request object
 * @param context - Route context containing dynamic parameters
 * @returns JSON response with event data or error message
 */

export async function GET(request: NextRequest, context: RouteParams): Promise<NextResponse> {
  try {
    // Await the params promise to get the slug
    const { slug } = await context.params

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or missing slug parameter'
        },
        { status: 400 }
      )
    }

    // Sanitize slug (remove special characters, convert to lowercase)
    const sanitizedSlug = slug.trim().toLowerCase()

    // Connect to database
    await connectToDatabase()

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean()

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: `Event with slug "${sanitizedSlug}" not found`
        },
        { status: 404 }
      )
    }

    // Return successful response with event data
    return NextResponse.json(
      {
        success: true,
        data: event
      },
      { status: 200 }
    )
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error('Error fetching event by slug:', error)

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while fetching the event'
      },
      { status: 500 }
    )
  }
}
