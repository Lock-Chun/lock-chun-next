// src/app/components/MapEmbed.tsx
import React from 'react';

interface MapEmbedProps {
  width?: string | number;
  height?: string | number;
  className?: string; // Allow passing additional Tailwind classes
}

const MapEmbed: React.FC<MapEmbedProps> = ({
  width = "100%", // Default to full width of its container
  height = "450",  // Default height
  className = ""   // Default to no extra classes
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const restaurantQuery = "Lock Chun Chinese Cuisine, Santa Clara CA"; // Your restaurant's name and location

  if (!apiKey) {
    console.error("Google Maps API key is missing. Check your .env.local file.");
    return <div className="text-red-600 bg-red-100 p-4 rounded">Map API Key is missing. Map cannot be displayed.</div>;
  }

  // Construct the embed URL
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    restaurantQuery
  )}`;

  return (
    <div className={`map-container ${className}`}>
      <iframe
        width={width}
        height={height}
        style={{ border: 0 }} // Use inline style for border or Tailwind class if preferred
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
        title={`Map of ${restaurantQuery}`} // Add a descriptive title for accessibility
      ></iframe>
    </div>
  );
};

export default MapEmbed;