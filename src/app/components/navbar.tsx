"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full flex items-center justify-between p-4 z-10 bg-white shadow-md">
      {/* Logo on the left */}
      <div className="lg:flex-shrink-0 z-20">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Lock Chun Chinese Cuisine"
            width={300}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        type="button"
        className="inline-flex lg:hidden items-center p-2 w-10 h-10 justify-center text-sm rounded-lg z-20 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
        aria-controls="navbar-default"
        aria-expanded={isMenuOpen ? "true" : "false"}
        style={{ color: isMenuOpen ? "black" : "black" }}>
        <span className="sr-only">Open main menu</span>
        {!isMenuOpen ? (
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6m-6 6L1 13"
            />
          </svg>
        )}
      </button>

      {/* Desktop navigation - Hidden on small, visible on lg+ */}
      <div className="hidden lg:flex lg:flex-grow justify-center">
        <div className="lg:space-x-8 text-xl flex flex-row items-center">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "font-bold underline" : ""
            } lg:p-0`}>
            Home
          </Link>
          <Link
            href="/menu"
            className={`${
              pathname === "/menu" ? "font-bold underline" : ""
            } lg:p-0`}>
            Menu
          </Link>
        </div>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-(--background) bg-opacity-90 flex flex-col items-start justify-center transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "opacity-100 z-10"
            : "opacity-0 pointer-events-none -z-10"
        }`}>
        <div className="flex flex-col items-start text-(--foreground) mx-10 space-y-8">
          <Link
            href="/"
            className={`text-5xl font-semibold transition-colors ${
              pathname === "/" ? "text-(--mobileNavbarSelected) underline" : ""
            }`}
            onClick={toggleMenu}>
            Home
          </Link>
          <Link
            href="/menu"
            className={`text-5xl font-semibold transition-colors ${
              pathname === "/menu"
                ? "text-(--mobileNavbarSelected) underline"
                : ""
            }`}
            onClick={toggleMenu}>
            Menu
          </Link>
        </div>
      </div>

      {/* Empty div to balance the layout on desktop */}
      {/* MUST MATCH WIDTH OF IMAGE! */}
      <div className="hidden lg:inline lg:flex-shrink-0 lg:w-[300px]"></div>
    </nav>
  );
}

