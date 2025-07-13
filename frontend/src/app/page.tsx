import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-00">🏨 Hotel Management System</h1>
      <div className="space-x-4">
        <Link href="/register-client">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer ">
            Register Client
          </button>
        </Link>
        <Link href="/clients">
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer">
            View Clients
          </button>
        </Link>
      </div>
    </main>
  );
}