'use server'

import { Event } from '@/database'
import connectToDatabase from '@/lib/mongodb'
import type { IEvent } from '@/database'

// tại sao lại dùng server action? thay vì API route?
// Lợi ích của server action:
// - Không cần viết API route
// - Tối ưu hóa hiệu năng (ít JS hơn, ít request hơn)
// - Bảo mật tốt hơn (logic không lộ ra client)
// - Tích hợp mượt với form HTML
// - Hoạt động trong build time (không bị lỗi khi deploy)
// - Truy cập trực tiếp database (nhanh hơn fetch API)

// dùng khi nào ?
// - GET data trong Server Components (page.tsx)
// - Khi cần data lúc build time (pre-rendering)

// Lấy tất cả events
export async function getAllEvents(): Promise<IEvent[]> {
  try {
    await connectToDatabase()
    const events = await Event.find().sort({ createdAt: -1 }).lean()

    return JSON.parse(JSON.stringify(events))
  } catch (error) {
    console.error('Error fetching all events:', error)
    return []
  }
}

// Lấy event theo slug
export async function getEventBySlug(slug: string): Promise<IEvent | null> {
  try {
    await connectToDatabase()
    const event = await Event.findOne({ slug }).lean()

    if (!event) return null

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    console.error('Error fetching event by slug:', error)
    return null
  }
}

// Lấy các events tương tự
export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
  try {
    await connectToDatabase()

    const event = await Event.findOne({ slug })

    if (!event) return []

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      $or: [{ tags: { $in: event.tags ?? [] } }, { mode: event.mode }]
    })
      .limit(3)
      .lean()

    return JSON.parse(JSON.stringify(similarEvents))
  } catch (error) {
    console.error('Error fetching similar events:', error)
    return []
  }
}
