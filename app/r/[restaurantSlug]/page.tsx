import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { RestaurantWebsite } from "@/components/restaurant/restaurant-website"
import { serializeRestaurantWithMenus } from "@/lib/utils/serialize"

// Revalidate every 10 seconds to catch published status changes quickly
export const revalidate = 10

export async function generateMetadata({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>
}) {
  const { restaurantSlug } = await params

  const restaurant = await db.restaurant.findUnique({
    where: { slug: restaurantSlug },
    select: {
      name: true,
      description: true,
      logo: true,
      coverImage: true,
      isPublished: true,
    },
  })

  if (!restaurant || !restaurant.isPublished) {
    return {
      title: "Restaurant Not Found",
    }
  }

  return {
    title: `${restaurant.name} - Restaurant`,
    description: restaurant.description || `Visit ${restaurant.name} for delicious food`,
    openGraph: {
      title: restaurant.name,
      description: restaurant.description || `Visit ${restaurant.name}`,
      images: restaurant.coverImage ? [restaurant.coverImage] : restaurant.logo ? [restaurant.logo] : [],
    },
  }
}

export default async function RestaurantWebsitePage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>
}) {
  const { restaurantSlug } = await params

  if (!restaurantSlug || restaurantSlug.trim() === "") {
    notFound()
  }

  const restaurant = await db.restaurant.findUnique({
    where: { slug: restaurantSlug },
    include: {
      menus: {
        where: { isActive: true },
        include: {
          categories: {
            where: { isActive: true },
            include: {
              items: {
                where: { isAvailable: true },
                include: {
                  variants: true,
                  modifiers: true,
                },
                take: 6, // Show preview of items
              },
            },
            orderBy: {
              displayOrder: "asc",
            },
            take: 4, // Show preview of categories
          },
        },
        take: 1,
      },
      branches: {
        where: { isActive: true },
        take: 1,
      },
    },
  })

  if (!restaurant) {
    notFound()
  }

  // Only show published restaurants
  if (!restaurant.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-stone-50 px-4 py-12">
        <div className="max-w-lg w-full">
          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-lg shadow-amber-100/50 p-8 md:p-12 border border-amber-100/50">
            {/* Restaurant Icon/Illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-stone-100 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full opacity-60"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-stone-300 rounded-full opacity-40"></div>
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-light text-stone-800 mb-3 tracking-tight">
                Website Coming Soon
              </h1>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mb-4"></div>
              <p className="text-lg text-stone-600 font-light leading-relaxed">
                <span className="font-medium text-stone-800">{restaurant.name}</span> is setting up their website.
              </p>
            </div>

            {/* Secondary Message */}
            <div className="bg-stone-50 rounded-2xl p-6 mb-6 border border-stone-100">
              <p className="text-sm text-stone-600 text-center leading-relaxed">
                The restaurant owner needs to publish the website to make it live.
              </p>
            </div>

            {/* Owner Instructions Card */}
            <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl p-6 border border-amber-100/50">
              <h2 className="text-base font-medium text-stone-800 mb-4 text-center">
                Are you the restaurant owner?
              </h2>
              <p className="text-sm text-stone-600 mb-5 text-center font-light">
                To publish your website:
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-amber-200 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-amber-700">1</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed pt-0.5">
                    Go to <span className="font-medium">Dashboard → Settings → Website</span> tab
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-amber-200 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-amber-700">2</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed pt-0.5">
                    Toggle <span className="font-medium">"Publish Website"</span> to ON
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-amber-200 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-amber-700">3</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed pt-0.5">
                    Click <span className="font-medium">"Save Website Settings"</span>
                  </p>
                </div>
              </div>
              <a
                href="/dashboard/settings?tab=website"
                className="block w-full text-center px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Go to Website Settings
              </a>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center mt-6 text-xs text-stone-400">
            Powered by <span className="font-medium text-stone-500">RestoDrive</span>
          </p>
        </div>
      </div>
    )
  }

  // Serialize Decimal fields for client component
  const serializedRestaurant = serializeRestaurantWithMenus(restaurant)

  return <RestaurantWebsite restaurant={serializedRestaurant} />
}

