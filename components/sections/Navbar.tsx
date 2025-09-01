"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Experience", href: "/experience" },
    { name: "Education", href: "/education" },
    { name: "Projects", href: "/project" },
    { name: "Certificates", href: "/certificates" },
  ];

  return (
    <nav className="max-w-6xl mx-auto bg-black sticky top-4 z-50">
      <div>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center cursor-pointer">
            <img
              src="/logo_dark.svg"
              alt="MeshSpire Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>

          <div className="hidden md:flex space-x-14 border border-white rounded-full py-1 px-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors "
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="text-l hidden md:flex gap-2">
            <a
              href="#footer"
              className="bg-white text-black border border-white rounded-full px-6 py-1 transition duration-300 hover:bg-black hover:text-white cursor-pointer"
            >
              Connect
            </a>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} aria-label="Toggle Menu">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black shadow-lg border-t border-white">
          <div className="flex flex-col items-center space-y-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
