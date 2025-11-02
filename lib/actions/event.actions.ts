'use server'

import { Event } from '@/database'
import connectToDatabase from '@/lib/mongodb'
// tại sao lại dùng server action? thay vì API route?
// Lợi ích của server action:
// - Không cần viết API route
// - Tối ưu hóa hiệu năng (ít JS hơn, ít request hơn)
// - Bảo mật tốt hơn (logic không lộ ra client)
// - Tích hợp mượt với form HTML

// dùng khi nào ?
// - khi logic đơn giản, không cần tái sử dụng nhiều nơi

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectToDatabase()

    const event = await Event.findOne({ slug })

    return await Event.find({
      tags: { $in: event?.tags ?? [] },
      slug: { $ne: slug }
    }).lean()
  } catch (error) {
    console.error('Error fetching similar events:', error)
    return []
  }
}
