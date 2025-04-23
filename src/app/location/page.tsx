import Navbar from "../components/navbar";
import MapEmbed from "../components/MapEmbed"; // Import the map component

export default function LocationPage() {
  const address = "4495 Stevens Creek Blvd, Santa Clara, CA 95051";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Our Location</h1>

        <div className="text-center mb-6">
          <p className="text-xl">{address}</p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Get Directions on Google Maps
          </a>
        </div>

        {/* Embed the map */}
        <div className="w-full md:w-3/4 lg:w-2/3 mx-auto shadow-lg rounded-lg overflow-hidden">
          <MapEmbed />
          {/* You can pass props like width/height/className if needed */}
          {/* <MapEmbed width="600" height="400" className="border border-gray-300"/> */}
        </div>

        {/* You can add hours information here as well */}
        <div className="mt-8 text-center">
           <h2 className="text-2xl font-semibold mb-2">Hours</h2>
           <ul className="list-none">
             <li>Tuesday - Thursday: 11:30 AM - 8:30 PM</li>
             <li>Friday - Saturday: 11:30 AM - 9:00 PM</li>
             <li>Sunday: 2:00 PM - 8:30 PM</li>
             <li>Monday: Closed</li>
           </ul>
        </div>

      </div>
    </main>
  );
}