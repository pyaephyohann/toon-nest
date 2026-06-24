import Navbar from "./components/NavBar";
import Sidebar from "./components/SideBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
