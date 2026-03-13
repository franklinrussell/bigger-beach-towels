export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  price: number       // in SMT
  category: 'Ski Gear' | 'Apres Ski' | 'Outdoors' | 'Lodge Life'
  badge?: string
  hero?: boolean
}

export const STORE_ADDRESS = 'summit-store'

export const products: Product[] = [
  {
    id: 'bigger-beach-towel',
    name: 'The Bigger Beach Towel',
    tagline: 'Our namesake. Definitely not for beaches.',
    description:
      'Oversized luxury cotton towel, 200x120cm. Marketed for ski lodges and alpine hot tubs because technically it is a beach towel and the mountain is basically the beach but colder and more vertical.',
    price: 55,
    category: 'Lodge Life',
    badge: 'HERO PRODUCT',
    hero: true,
  },
  {
    id: 'summit-ski-poles',
    name: 'Summit Carbon Ski Poles',
    tagline: 'Built for first tracks. Light as snowflakes.',
    description:
      'Carbon fibre shaft with ergonomic cork grip and powder baskets. Rated for black diamond runs and aggressive pointing at mountain views.',
    price: 45,
    category: 'Ski Gear',
    badge: 'NEW',
  },
  {
    id: 'alpine-goggles',
    name: 'Alpine Vision Goggles',
    tagline: 'See the mountain. See the moguls. See your mistakes coming.',
    description:
      'Photochromic anti-fog lenses with UV400 protection. Wide peripheral vision for both off-piste routes and identifying which chairlift has the shortest queue.',
    price: 35,
    category: 'Ski Gear',
  },
  {
    id: 'lodge-blanket',
    name: 'Mountain Lodge Blanket',
    tagline: 'For when the slopes close and the fireplace opens.',
    description:
      'Extra-thick merino wool blend, large enough to share (but you won\'t want to). Perfect for the post-ski debrief where everyone\'s run gets slightly longer with each retelling.',
    price: 30,
    category: 'Apres Ski',
  },
  {
    id: 'hot-cocoa-kit',
    name: 'Summit Hot Cocoa Kit',
    tagline: 'The official drink of the bunny slope victors.',
    description:
      'Premium Swiss cocoa, organic milk powder, crushed candy cane, and a miniature marshmallow bag. Makes twelve cups — approximately one per run if you\'re being honest.',
    price: 15,
    category: 'Apres Ski',
    badge: 'BESTSELLER',
  },
  {
    id: 'trail-kit',
    name: 'Summit Trail Kit',
    tagline: 'For when snow becomes mud becomes adventure.',
    description:
      'All-terrain hiking essentials: laminated trail map, emergency whistle, three energy bars, and a waterproof card that reads "I know what I\'m doing." (Results may vary.)',
    price: 20,
    category: 'Outdoors',
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
