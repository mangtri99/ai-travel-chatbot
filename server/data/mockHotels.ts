import type { Hotel, SearchParams } from '../types'

const HOTELS: Hotel[] = [
  // Bali
  {
    id: 'bali-1',
    name: 'The Seminyak Beach Resort & Spa',
    location: 'Seminyak, Bali',
    price_per_night: 135,
    currency: '$',
    rating: 4.8,
    review_count: 3241,
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
    facilities: ['pool', 'beach', 'spa', 'wifi', 'restaurant', 'bar'],
    description: 'Luxurious beachfront resort with stunning ocean views and world-class spa.',
  },
  {
    id: 'bali-2',
    name: 'Ubud Jungle Villa',
    location: 'Ubud, Bali',
    price_per_night: 85,
    currency: '$',
    rating: 4.6,
    review_count: 1872,
    image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80',
    facilities: ['pool', 'wifi', 'breakfast', 'spa'],
    description: 'Peaceful jungle retreat surrounded by rice terraces and tropical greenery.',
  },
  {
    id: 'bali-3',
    name: 'Kuta Budget Inn',
    location: 'Kuta, Bali',
    price_per_night: 35,
    currency: '$',
    rating: 3.9,
    review_count: 982,
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    facilities: ['wifi', 'pool', 'air conditioning'],
    description: 'Affordable and clean rooms, walking distance to Kuta Beach.',
  },
  {
    id: 'bali-4',
    name: 'Nusa Dua Grand Palace',
    location: 'Nusa Dua, Bali',
    price_per_night: 220,
    currency: '$',
    rating: 4.9,
    review_count: 4120,
    image_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80',
    facilities: ['pool', 'beach', 'spa', 'gym', 'restaurant', 'bar', 'wifi', 'parking'],
    description: 'Five-star palace hotel on the pristine beach of Nusa Dua.',
  },

  // Paris
  {
    id: 'paris-1',
    name: 'Hôtel Le Marais Boutique',
    location: 'Le Marais, Paris',
    price_per_night: 145,
    currency: '$',
    rating: 4.7,
    review_count: 2103,
    image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
    facilities: ['wifi', 'breakfast', 'bar', 'air conditioning'],
    description: 'Charming boutique hotel in the heart of historic Le Marais district.',
  },
  {
    id: 'paris-2',
    name: 'Budget Stay Montmartre',
    location: 'Montmartre, Paris',
    price_per_night: 65,
    currency: '$',
    rating: 4.1,
    review_count: 1540,
    image_url: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=400&q=80',
    facilities: ['wifi', 'air conditioning'],
    description: 'Cozy budget-friendly rooms near Sacré-Cœur with great city views.',
  },
  {
    id: 'paris-3',
    name: 'Grand Hôtel Champs-Élysées',
    location: 'Champs-Élysées, Paris',
    price_per_night: 320,
    currency: '$',
    rating: 4.9,
    review_count: 5200,
    image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    facilities: ['spa', 'gym', 'restaurant', 'bar', 'wifi', 'parking', 'breakfast'],
    description: 'Iconic luxury hotel steps from the Eiffel Tower with panoramic views.',
  },
  {
    id: 'paris-4',
    name: 'Aparthotel République',
    location: 'République, Paris',
    price_per_night: 90,
    currency: '$',
    rating: 4.3,
    review_count: 876,
    image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80',
    facilities: ['wifi', 'air conditioning', 'parking'],
    description: 'Modern aparthotel with kitchenette, ideal for extended stays.',
  },

  // Phuket
  {
    id: 'phuket-1',
    name: 'Patong Beachfront Resort',
    location: 'Patong, Phuket',
    price_per_night: 110,
    currency: '$',
    rating: 4.5,
    review_count: 2876,
    image_url: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&q=80',
    facilities: ['pool', 'beach', 'wifi', 'restaurant', 'bar', 'spa'],
    description: 'Vibrant beachfront resort right on Patong Beach with lively nightlife.',
  },
  {
    id: 'phuket-2',
    name: 'Kata Rocks Luxury Villas',
    location: 'Kata, Phuket',
    price_per_night: 280,
    currency: '$',
    rating: 4.9,
    review_count: 1430,
    image_url: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400&q=80',
    facilities: ['pool', 'beach', 'spa', 'gym', 'restaurant', 'wifi', 'airport'],
    description: 'Exclusive cliff-top villas with private infinity pools and sea views.',
  },
  {
    id: 'phuket-3',
    name: 'Old Town Phuket Guesthouse',
    location: 'Old Town, Phuket',
    price_per_night: 45,
    currency: '$',
    rating: 4.2,
    review_count: 654,
    image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80',
    facilities: ['wifi', 'breakfast', 'air conditioning'],
    description: 'Charming Sino-Portuguese guesthouse in the historic old town.',
  },

  // Tokyo
  {
    id: 'tokyo-1',
    name: 'Shinjuku Grand Tower Hotel',
    location: 'Shinjuku, Tokyo',
    price_per_night: 175,
    currency: '$',
    rating: 4.7,
    review_count: 3980,
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
    facilities: ['gym', 'restaurant', 'wifi', 'spa', 'bar'],
    description: 'Modern skyscraper hotel with stunning views of Mount Fuji on clear days.',
  },
  {
    id: 'tokyo-2',
    name: 'Asakusa Traditional Inn',
    location: 'Asakusa, Tokyo',
    price_per_night: 95,
    currency: '$',
    rating: 4.5,
    review_count: 1220,
    image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80',
    facilities: ['wifi', 'breakfast', 'spa'],
    description: 'Authentic ryokan-style inn near Senso-ji Temple with tatami rooms.',
  },
  {
    id: 'tokyo-3',
    name: 'Capsule & Co Akihabara',
    location: 'Akihabara, Tokyo',
    price_per_night: 40,
    currency: '$',
    rating: 4.0,
    review_count: 2100,
    image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80',
    facilities: ['wifi', 'air conditioning'],
    description: 'Modern capsule hotel in the heart of electric town.',
  },

  // Singapore
  {
    id: 'sg-1',
    name: 'Marina Bay Sands View Hotel',
    location: 'Marina Bay, Singapore',
    price_per_night: 380,
    currency: '$',
    rating: 4.9,
    review_count: 6500,
    image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80',
    facilities: ['pool', 'spa', 'gym', 'restaurant', 'bar', 'wifi', 'airport'],
    description: 'Iconic hotel with the world-famous infinity pool overlooking the city skyline.',
  },
  {
    id: 'sg-2',
    name: 'Chinatown Heritage Boutique',
    location: 'Chinatown, Singapore',
    price_per_night: 120,
    currency: '$',
    rating: 4.5,
    review_count: 987,
    image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80',
    facilities: ['wifi', 'breakfast', 'air conditioning', 'gym'],
    description: 'Stylish heritage shophouse hotel in vibrant Chinatown.',
  },

  // London
  {
    id: 'london-1',
    name: 'Covent Garden Boutique Hotel',
    location: 'Covent Garden, London',
    price_per_night: 195,
    currency: '$',
    rating: 4.6,
    review_count: 2340,
    image_url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80',
    facilities: ['wifi', 'restaurant', 'bar', 'gym'],
    description: 'Chic boutique hotel in the West End, steps from theatres and restaurants.',
  },
  {
    id: 'london-2',
    name: 'Earl\'s Court Budget Hotel',
    location: 'Earl\'s Court, London',
    price_per_night: 75,
    currency: '$',
    rating: 3.8,
    review_count: 1100,
    image_url: 'https://images.unsplash.com/photo-1467987506553-8f3916508521?w=400&q=80',
    facilities: ['wifi', 'air conditioning'],
    description: 'Clean and affordable rooms with easy Tube access to central London.',
  },
]

export function searchMockHotels(params: SearchParams): Hotel[] {
  const location = params.location.toLowerCase()

  let results = HOTELS.filter((h) => {
    const hotelLocation = h.location.toLowerCase()
    // match by city name or country-level keyword
    return (
      hotelLocation.includes(location) ||
      location.includes(hotelLocation.split(',')[1]?.trim() ?? '') ||
      hotelLocation.split(',').some((part) => location.includes(part.trim()))
    )
  })

  if (params.budget_max) {
    results = results.filter((h) => h.price_per_night <= params.budget_max!)
  }

  if (params.facilities?.length) {
    results = results.sort((a, b) => {
      const aMatches = params.facilities!.filter((f) =>
        a.facilities.some((af) => af.toLowerCase().includes(f.toLowerCase())),
      ).length
      const bMatches = params.facilities!.filter((f) =>
        b.facilities.some((bf) => bf.toLowerCase().includes(f.toLowerCase())),
      ).length
      return bMatches - aMatches
    })
  }

  // Fallback: return a random sample if no location match
  if (results.length === 0) {
    results = [...HOTELS].sort(() => Math.random() - 0.5).slice(0, 4)
  }

  return results.slice(0, 6)
}
