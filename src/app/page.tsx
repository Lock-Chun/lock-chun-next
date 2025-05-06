import Navbar from "./components/navbar";
import MapEmbed from "./components/MapEmbed";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const address = "Lock Chun Chinese Cuisine, Santa Clara CA";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  return (
    <div className="min-h-screen pt-[77px]"> {/* Adjusted for Navbar height */}
      <Navbar />

      {/* Hero Section with Gradient Overlay */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <Image
          src="/mobile.jpg"
          alt="Lock Chun Restaurant"
          fill
          className="object-cover md:hidden brightness-90"
          priority
        />
        <Image
          src="/desktop.jpg"
          alt="Lock Chun Restaurant"
          fill
          className="object-cover hidden md:inline brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/40 to-stone-50"></div>
        <div className="absolute bottom-8 left-0 w-full p-8 md:p-16">
          <h1 className=" text-5xl md:text-7xl font-black text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.6)]">
            Lock Chun
          </h1>
          <p className=" text-2xl md:text-3xl mt-2 font-semibold text-white italic drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.6)]">
            Chinese-American Cuisine in Santa Clara
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Info Section */}
          <div className="space-y-8">
            <div className="border-b border-stone-300 pb-6">
              <h2 className="text-3xl md:text-4xl font-semibold mb-2">
                Call to Order
              </h2>
              <address className="not-italic text-lg text-stone-600">
                <p className="flex items-center gap-2 mb-6 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  (408) 249-2784
                </p>
                <h2 className="text-3xl md:text-4xl text-(--foreground) font-semibold mb-2">
                  Visit Us
                </h2>
                <p className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  4495 Stevens Creek Blvd, Santa Clara, CA 95051
                </p>
              </address>
            </div>

            <div className="border-b border-stone-300 pb-6">
              <h2 className="text-3xl md:text-4xl  font-semibold mb-4">
                Hours
              </h2>
              <div className="grid grid-cols-2 gap-2 text-lg">
                <div className="font-medium">Monday</div>
                <div className="text-red-600 font-medium">CLOSED</div>

                <div className="font-medium">Tues - Thurs</div>
                <div>11:30 AM - 8:30 PM</div>

                <div className="font-medium">Fri - Sat</div>
                <div>11:30 AM - 9:00 PM</div>

                <div className="font-medium">Sunday</div>
                <div>2:00 PM - 8:30 PM</div>
              </div>
            </div>

            <div className="flex items-center text-center justify-center md:justify-start">
              <Link
                href="menu"
                className="inline-block px-8 py-3 bg-red-700 hover:bg-red-800 text-white font-medium rounded-md transition-colors text-md md:text-lg">
                View Menu
              </Link>
              <Link
                href={googleMapsUrl}
                className="inline-block ml-4 px-8 py-3 border border-stone-400 hover:border-stone-800 hover:bg-stone-200 text-stone-800 font-medium rounded-md transition-colors text-md md:text-lg">
                Get Directions
              </Link>
            </div>
          </div>
          <MapEmbed />
        </div>
      </main>
    </div>
  );
}
