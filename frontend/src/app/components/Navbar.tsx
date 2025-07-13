'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  console.log('pathname:', pathname);

  const linkClass = (path: string) =>
    pathname === path
      ? 'text-blue-400 font-bold underline' // destaque no link ativo
      : 'text-white hover:text-blue-300';

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-bold">🏨 SaaS Hotel</h1>
        <div className="space-x-4">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/register-client" className={linkClass('/register-client')}>Register</Link>
          <Link href="/clients" className={linkClass('/clients')}>Clients</Link>
          <Link href="/rooms" className={linkClass('/rooms')}>Rooms</Link>
          <Link href="/reservations" className={linkClass('/reservations')}>Reservations</Link>


        </div>
      </div>
    </nav>
  );
};

export default Navbar;
