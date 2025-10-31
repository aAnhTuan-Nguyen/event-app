export type EventCardProps = {
  title: string
  image: string
  slug: string
  location: string
  date: string
  time: string
}

export const EVENTS: EventCardProps[] = [
  {
    title: 'Dev Summit 2025',
    image: '/images/event1.png',
    slug: 'dev-summit-2025',
    location: 'Hà Nội, Việt Nam',
    date: '2025-11-20',
    time: '09:00 AM'
  },
  {
    title: 'Frontend Conf',
    image: '/images/event2.png',
    slug: 'frontend-conf-2025',
    location: 'Hồ Chí Minh, Việt Nam',
    date: '2025-12-05',
    time: '10:30 AM'
  },
  {
    title: 'AI & Cloud Meetup',
    image: '/images/event3.png',
    slug: 'ai-cloud-meetup',
    location: 'Đà Nẵng, Việt Nam',
    date: '2026-01-15',
    time: '01:00 PM'
  },
  {
    title: 'Design Systems Workshop',
    image: '/images/event4.png',
    slug: 'design-systems-workshop',
    location: 'Online',
    date: '2025-11-30',
    time: '07:00 PM'
  },
  {
    title: 'Fullstack Fest',
    image: '/images/event5.png',
    slug: 'fullstack-fest-2026',
    location: 'Hà Nội, Việt Nam',
    date: '2026-02-10',
    time: '09:00 AM'
  }
]
