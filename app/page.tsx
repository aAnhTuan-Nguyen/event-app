import EventCard from '@/components/EventCard'
import ExploreButton from '@/components/ExploreButton'
import { IEvent } from '@/database'
import { getAllEvents } from '@/lib/actions/event.actions'

const page = async () => {
  // Dùng Server actions để truy cập database trực tiếp (tối ưu hơn fetch API)
  const events = await getAllEvents()

  return (
    <section>
      <h1 className='text-center'>
        The Hub for every Developer <br /> Event you can not miss
      </h1>
      <p className='text-center mt-5'>Join us for the latest updates and events in the developer community.</p>

      <ExploreButton />

      <div className='mt-20 space-y-7'>
        <h3 className='text-center'>Feature Events</h3>

        <ul className='events'>
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className='list-none'>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}

export default page
