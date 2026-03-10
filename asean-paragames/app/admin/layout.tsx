"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="flex w-full h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-48 bg-black p-6 border-r border-gray-700">
        <div className="mb-8">
          <h2 className="text-cyan-400 font-bold text-lg">ASEAN</h2>
          <h2 className="text-cyan-400 font-bold text-lg">PARAGAMES 2025</h2>
            </div>
            <nav className="space-y-4">
              <ul className="space-y-2">
                <li className={`${pathname === '/admin/requests' ? 'bg-cyan-400 font-bold text-black' : ''} py-2 px-3 text-white font-semibold rounded`}>
                  <Link href="/admin/requests">
                    Requests
                  </Link>
                </li>
                <li className={`${pathname === '/admin/competitions' ? 'bg-cyan-400 font-bold text-black' : ''} py-2 px-3 text-white font-semibold rounded`}>
                  <Link href="/admin/competitions">
                    Tournament List
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
        </div>
  );
}