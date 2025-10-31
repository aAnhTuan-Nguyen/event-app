import EventCard from '@/components/EventCard'
import ExploreButton from '@/components/ExploreButton'
import { EVENTS } from '@/lib/constants/events'

const page = () => {
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
          {EVENTS.map((event) => (
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
