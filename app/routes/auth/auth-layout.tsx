import { Outlet } from "react-router";
import { Toaster } from "~/components/ui/sonner";

// export function meta({}: )

export default function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <>
        <Outlet />
      </>
      <Toaster />
    </main>
  );
}
