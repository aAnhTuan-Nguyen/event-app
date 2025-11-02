import { Event } from '@/database'
import connectToDatabase from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const formData = await request.formData()

    // Xử lý file upload
    const file = formData.get('image') as File | null
    if (!file) {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
          if (error) reject(error)
          resolve(result)
        })
        .end(buffer)
    })

    // Lấy các field thường
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventData: any = {
      title: formData.get('title'),
      description: formData.get('description'),
      overview: formData.get('overview'),
      image: (uploadResult as { secure_url: string }).secure_url,
      venue: formData.get('venue'),
      location: formData.get('location'),
      date: formData.get('date'),
      time: formData.get('time'),
      mode: formData.get('mode'),
      audience: formData.get('audience'),
      organizer: formData.get('organizer'),
      tags: [],
      agenda: []
    }

    // Lấy tất cả tags (tags[0], tags[1], ...)
    formData.forEach((value, key) => {
      if (key.startsWith('tags[')) {
        eventData.tags.push(value)
      }
      if (key.startsWith('agenda[')) {
        eventData.agenda.push(value)
      }
    })

    // Tạo event
    const createdEvent = await Event.create(eventData)

    return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 })
  } catch (error) {
    console.error('Error handling POST /api/events:', error)
    return NextResponse.json(
      { message: 'Event creation failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    const events = await Event.find().sort({ createdAt: -1 })
    return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 })
  } catch (error) {
    console.error('Error handling GET /api/events:', error)
    return NextResponse.json(
      { message: 'Failed to fetch events', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
