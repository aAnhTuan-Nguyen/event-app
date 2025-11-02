import React from 'react'
import Image from 'next/image'
import type { IEvent } from '@/database'
import BookEvent from '@/components/BookEvent'
import EventCard from '@/components/EventCard'
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({ icon, label, alt }: { icon: string; label: string; alt: string }) => {
  return (
    <div className='flex gap-2 items-center mt-2'>
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  )
}

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className='flex flex-col gap-4 mt-6'>
      <h2>Event Agenda</h2>
      <ul className='flex flex-col gap-3'>
        {agendaItems.map((item, index) => {
          return (
            <li key={index} className='flex gap-3 items-start'>
              <span className='shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold'>
                {index + 1}
              </span>
              <div className='flex flex-col gap-1 flex-1'>
                <p className='text-light-100 text-lg max-sm:text-sm'>{item}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className='flex flex-wrap gap-2 mt-4'>
      {tags.map((tag) => (
        <span key={tag} className='bg-primary/20 text-primary rounded-full px-3 py-1 text-sm font-semibold'>
          {tag}
        </span>
      ))}
    </div>
  )
}

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: 'no-store'
  })

  if (!response.ok) {
    return (
      <section id='event'>
        <div className='text-center'>
          <h1>Event Not Found</h1>
          <p className='mt-4'>The event you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </section>
    )
  }

  const { data }: { data: IEvent } = await response.json()

  if (!data) {
    return <div>Error: Event not found</div>
  }

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

  const { title, image, description, overview, location, date, time, mode, organizer, agenda, tags } = data

  return (
    <section id='event'>
      {/* Header Section */}
      <div className='header'>
        <h1>Event Description</h1>
        <p className='mt-2'>{description}</p>
      </div>

      <div className='details'>
        {/* left side - Event content */}
        <div className='event-content'>
          <h2 className='text-3xl font-bold mb-4'>{title}</h2>
          <Image src={image} alt={title} width={800} height={400} className='banner' />

          <section className='flex-col gap-2 mt-4'>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <EventTags tags={tags} />

          <section className='flex-col gap-2 mt-4'>
            <h2>Event Details</h2>
            <EventDetailItem icon='/icons/calendar.svg' label={date} alt='Calendar Icon' />
            <EventDetailItem icon='/icons/clock.svg' label={time} alt='Time Icon' />
            <EventDetailItem icon='/icons/pin.svg' label={location} alt='Location Icon' />
            <EventDetailItem icon='/icons/mode.svg' label={mode} alt='Mode Icon' />
            <EventDetailItem icon='/icons/audience.svg' label={organizer} alt='Organizer Icon' />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className='flex-col gap-2 mt-4'>
            <h2>About Organizer</h2>
            <p>{organizer}</p>
          </section>
        </div>

        {/* right side - Booking form */}
        <aside className='booking'>
          <div className='signup-card'>
            <h2 className='text-2xl font-bold mb-4'>Book your spot</h2>
            <BookEvent eventId={data._id} slug={data.slug} />
          </div>
        </aside>
      </div>

      {/* similar events */}
      <section className='flex flex-col gap-4 pt-20 w-full'>
        <h2>Similar Events</h2>
        <div className='events'>
          {similarEvents.length > 0 && similarEvents.map((event: IEvent) => <EventCard key={event._id} {...event} />)}
        </div>
      </section>
    </section>
  )
}

export default EventDetailsPage
