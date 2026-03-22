export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Performance' | 'Lifestyle' | 'Limited' | 'Beginner' | 'Pro';
  image: string;
  description: string;
  emi: string;
  specs: {
    weight: string;
    drop: string;
    terrain: string;
    foam: string;
  };
  rating: number;
  reviews: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'v1',
    name: 'VELOCE STRIDE X',
    price: 5499,
    category: 'Performance',
    image: '/veloce.jpeg',
    description: 'Engineered aerated mesh keeps your foot cool and blister-free. Designed for high-impact shock absorption.',
    emi: '₹1,750/mo for 3 months',
    specs: { weight: '240g', drop: '8mm', terrain: 'Road', foam: 'V-Cloud Pro' },
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'v2',
    name: 'URBAN NOMAD',
    price: 3999,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop&fm=webp',
    description: 'The ultimate city companion. Lightweight and stylish for the modern urban explorer.',
    emi: '₹1,333/mo for 3 months',
    specs: { weight: '210g', drop: '4mm', terrain: 'Urban', foam: 'Soft-Step' },
    rating: 4.5,
    reviews: 89
  },
  {
    id: 'v3',
    name: 'AERO FLOW 2.0',
    price: 6499,
    category: 'Pro',
    image: '/aero.jpeg',
    description: 'Lighter than air, faster than sound. Carbon-fiber plate for maximum energy return.',
    emi: '₹2,166/mo for 3 months',
    specs: { weight: '190g', drop: '10mm', terrain: 'Track', foam: 'Nitro-Fuel' },
    rating: 4.9,
    reviews: 56
  },
  {
    id: 'v4',
    name: 'ONYX ELITE',
    price: 8999,
    category: 'Limited',
    image: '/onyx.jpeg',
    description: 'Exclusivity in every step. Premium materials and limited production run.',
    emi: '₹2,999/mo for 3 months',
    specs: { weight: '260g', drop: '6mm', terrain: 'All', foam: 'Elite-Core' },
    rating: 5.0,
    reviews: 12
  }
];

export const TEAM_MEMBERS = [
  { name: 'Ujjwal Khanna', id: 'M24BBAU0017', role: 'Project Manager', description: 'Oversees execution and sprint deadlines.' },
  { name: 'Udit Gupta', id: 'M24BBAU0018', role: 'Design Specialist', description: 'Manages UI/UX trends and visual consistency.' },
  { name: 'Udit Badoni', id: 'M24BBAU0011', role: 'Marketing Strategist', description: 'Formulates STP and digital mix.' },
  { name: 'Kalisha Shukla', id: 'M24BBAU0164', role: 'Content Creator', description: 'Architects blog narratives and product copy.' },
  { name: 'Abhinav Singh', id: 'M24BBAU0043', role: 'SEO Executive', description: 'Directs keyword strategy and SERP visibility.' }
];

export const BLOG_POSTS = [
  {
    id: 'b1',
    title: 'A Comprehensive Beginner’s Guide to Choosing the Perfect Jogging Shoe',
    excerpt: 'Understanding pronation, cushioning, and why your first pair matters more than you think.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&fm=webp',
    content: `
# A Comprehensive Beginner’s Guide to Choosing the Perfect Jogging Shoe

Buying your first pair of joggers is a bigger deal than most people think. It’s not about the
brand or the color—it’s about making sure you don't end up with a shin splint two weeks
into your new habit.

## Understanding Your Foot Type
Everyone’s feet hit the ground differently. This is called pronation, and it's the most
important thing to check:

*   **The Normal Roll:** Your foot hits and rolls inward just a bit. Most "Neutral" shoes
work fine here.
*   **The Flat Foot (Overpronation):** If your foot rolls inward too much, you’ll need
"Stability" shoes to keep things aligned.
*   **The High Arch (Supination):** If your foot stays on the outside edge, you need extra
cushion to soak up the impact.

## Terrain Matters
Don't overcomplicate this. If you’re hitting the sidewalk or a treadmill, stick with Road
Shoes—they’re light and bouncy. If you’re planning on muddy trails or rocky paths, get
Trail Shoes. They have better grip so you don't slip on a random root.

## Cushioning and Drop
As a beginner, your joints aren't used to the constant pounding yet. Go for **Maximal
Cushioning.** It feels a bit like walking on clouds, but it saves your knees. Also, look at the
"drop" (the height difference between your heel and toe). A standard 10mm drop is
usually the safest bet for starters.

## Sizing Tips
**Never buy shoes in the morning.** Your feet actually swell up as the day goes on. Go
shopping in the evening when your feet are at their biggest. You want about a thumb’s
width of space at the front. If they feel "perfectly snug" in the store, they’ll probably be too
tight ten minutes into your run.

*Browse our affordable performance shoe collection to find your perfect match today.*
`
  },
  {
    id: 'b2',
    title: 'Fueling the Run: Advanced Nutrition and Recovery Strategies',
    excerpt: 'The science of carb timing, hydration, and the golden window of recovery.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&fm=webp',
    content: `
# Fueling the Run: Advanced Nutrition and Recovery Strategies

If you treat your body like a high-performance engine, you can’t just put the cheapest fuel
in and expect it to hit top speeds. Whether you’re training for a 5k or just jogging around
Greater Noida, what you eat determines if you feel like a pro or if you hit a wall ten minutes
in.

## Getting the Timing Right
Don’t just eat right before you head out. Your stomach needs a head start.

*   **The Big Meal (2-3 hours out):** You want something that sticks. Go for oats or
brown rice. The goal is "complex carbs" that burn slowly so you don't run out of gas
mid-way.
*   **The Quick Fix (30 mins out):** If you're feeling a bit low on energy, grab a banana.
It’s pure, fast-acting glucose that won't make your stomach do flips while you're
moving.

## Hydration: It’s Not Just About Water
If you’re out for less than an hour, plain water is fine. But once you go longer, you start
losing minerals through sweat. You need **electrolytes**—specifically sodium and
magnesium. Aim to sip (don't chug) about 500-700ml every hour to keep your muscles
from cramping up.

## The "Golden Window" for Recovery
The 45 minutes right after you stop running are the most important. This is when your
muscles are basically "begging" for repairs.
*   **Protein:** You need about 20-25g (think a scoop of whey or some eggs) to fix the
micro-tears in your muscles.
*   **Carbs:** You need to refill your energy tanks (glycogen).
*   **The 1.5x Rule:** A good trick is to drink 1.5 times the weight you lost in fluid. If you
feel lighter after a run, it’s mostly water weight, and you need to put it back.

## The Secret Weapon- Sleep
You don’t actually get stronger while you’re running; you get stronger while you’re
**sleeping.** That’s when the real muscle repair happens. If you aren't hitting 7–9 hours of
deep sleep, your body is essentially running on a "low battery" mode, which is the fastest
way to get injured.

*Start your run today with the right fuel and the right gear.*
`
  },
  {
    id: 'b3',
    title: 'Maximizing Mileage: The Ultimate Guide to Running Shoe Maintenance',
    excerpt: 'How to extend the life of your performance gear and when to say goodbye.',
    image: '/speed.jpeg',
    content: `
# Maximizing Mileage: The Ultimate Guide to Running Shoe Maintenance

A solid pair of trainers is an investment—especially if you're rocking something high-end
like the VELOCE Stride X. If you treat them right, they’ll protect your joints for hundreds of
kilometers. If you treat them like old sneakers, you’ll be shopping for a new pair (and
maybe a knee brace) way sooner than you’d like.

## Knowing When to Let Go
Most shoes give up the ghost between **500 and 800 kilometers.** But don't just look at the
mileage; listen to your body. If the foam starts feeling "flat" or "dead," or if you’re suddenly
getting weird aches in your shins that weren't there before, the cushioning is likely done.
It might look clean on the outside, but the tech inside has a shelf life.

## The "Golden Rules" of Cleaning
Whatever you do, **keep them out of the washing machine.** The heat and the constant
spinning are basically a death sentence for the glue and the midsole foam.
*   **The Manual Way:** Grab an old toothbrush, some mild soap, and cold water. Scrub
the dirt off by hand.
*   **The Drying Trick:** Never throw them in the dryer or leave them in the sun. It makes
the foam brittle. Instead, pull out the insoles, stuff the shoes with some old
newspaper to soak up the moisture, and let them air dry in the shade.

## The "Rotation" Secret
If you’re running every single day, you really should have two pairs in your closet. It sounds
like an extra expense, but it actually saves you money. Foam needs time to "bounce back"
or decompress after a run. If you give a pair 48 hours to rest between sessions, the
cushioning actually lasts longer.

## Store Them Right
Don't leave your shoes in a hot car or a damp balcony. Extreme heat ruins the flexibility of
the sole, and dampness is just an invitation for smells you’ll never get rid of. A cool, dry
corner of your room is all they need.

*Secure your size now and keep your gear in peak condition for every mile.*
`
  }
];
