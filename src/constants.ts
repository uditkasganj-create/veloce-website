export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Performance' | 'Lifestyle' | 'Limited' | 'Beginner' | 'Pro';
  image: string;
  hoverImage: string;
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
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop&fm=webp',
    hoverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop&fm=webp',
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
    hoverImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop&fm=webp',
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
    image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=800&auto=format&fit=crop&fm=webp',
    hoverImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop&fm=webp',
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
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop&fm=webp',
    hoverImage: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=800&auto=format&fit=crop&fm=webp',
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

Choosing your first pair of running shoes is more than just a fashion choice; it's a critical decision for your long-term health and performance. For beginners like Rahul, an IT professional in Bengaluru, the right shoe can be the difference between a lifelong habit and a painful injury.

## Understanding Your Foot Type
The first step in selecting a shoe is understanding your **pronation**. Pronation is the natural inward roll of the foot as it hits the ground.

*   **Neutral Pronation**: The foot rolls inward about 15%, absorbing shock effectively.
*   **Overpronation**: The foot rolls inward too much, common in those with flat feet. This requires "Stability" or "Motion Control" shoes.
*   **Supination (Underpronation)**: The foot rolls outward, common in high arches. This requires high-cushion shoes to absorb shock.

## Terrain Matters
Where will you be running?
*   **Road Shoes**: Designed for pavement. They are lightweight, flexible, and built to cushion the foot on hard, even surfaces.
*   **Trail Shoes**: Built for off-road routes with rocks, mud, and roots. They have aggressive outsoles for traction and reinforced uppers for protection.

## Cushioning and Drop
*   **Cushioning**: Measured by the thickness of the midsole. Beginners often prefer "Maximal" cushioning to protect joints.
*   **Heel-to-Toe Drop**: The difference in height between the heel and the forefoot. A standard drop is 10-12mm, while "Zero Drop" shoes mimic barefoot running.

## Sizing Tips
Always shop for shoes in the afternoon or evening, as your feet swell throughout the day. Ensure there is a thumb-width of space between your longest toe and the end of the shoe.

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

For the everyday athlete, nutrition is the fuel that powers performance and the building blocks that enable recovery. Understanding the "when" and "what" of eating can transform your running experience.

## Pre-Run: The Energy Phase
Timing is everything. 

*   **2-3 Hours Before**: Eat a balanced meal with complex carbohydrates (oats, brown rice) and a small amount of protein.
*   **30-60 Minutes Before**: A simple carb snack (banana, energy gel) provides a quick glucose boost without digestive distress.

## During the Run: Hydration and Electrolytes
For runs under 60 minutes, water is usually sufficient. For longer efforts, you need to replace lost sodium, potassium, and magnesium. Aim for 500-700ml of fluid per hour, sipped regularly.

## The "Golden Window" of Recovery
Within 30 to 45 minutes of finishing your run, your body is primed to absorb nutrients. This is the "Golden Window."
*   **Target**: 20-25g of high-quality protein to repair muscle fibers and 50-70g of carbohydrates to replenish glycogen stores.
*   **Hydration**: Drink 1.5 times the weight lost during the run in fluids.

## Rest and Sleep
Never underestimate the power of sleep. Most muscle repair happens during deep sleep cycles. Aim for 7-9 hours of quality rest to ensure your body is ready for the next challenge.

*Start your run today with the right fuel and the right gear.*
`
  },
  {
    id: 'b3',
    title: 'Maximizing Mileage: The Ultimate Guide to Running Shoe Maintenance',
    excerpt: 'How to extend the life of your performance gear and when to say goodbye.',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&fm=webp',
    content: `
# Maximizing Mileage: The Ultimate Guide to Running Shoe Maintenance

A high-quality running shoe like the VELOCE Stride X is an investment. Proper maintenance not only extends the life of the shoe but also ensures it continues to protect your feet as intended.

## The Lifespan of a Shoe
Most running shoes last between 500 to 800 kilometers (300-500 miles). However, this depends on your weight, running style, and the terrain. If you notice the foam feels "dead" or you start experiencing unusual aches in your knees or shins, it's time for a replacement.

## Cleaning Do's and Don'ts
*   **DON'T Machine Wash**: The heat and agitation can warp the midsole and degrade the adhesives.
*   **DO Hand Wash**: Use a soft brush, mild soap, and cold water. Remove the insoles and laces to wash them separately.
*   **DO Air Dry**: Never put shoes in the dryer. Stuff them with newspaper to absorb moisture and let them dry in a cool, shaded area.

## Shoe Rotation
If you run daily, consider rotating between two pairs of shoes. This allows the foam in each pair to fully decompress between runs, effectively extending the lifespan of both.

## Proper Storage
Store your shoes in a cool, dry place away from direct sunlight. Extreme heat can make the midsoles brittle, while dampness can lead to mold and odor.

*Secure your size now and keep your gear in peak condition for every mile.*
`
  }
];
