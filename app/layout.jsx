import "@/app/globals.css";
import { TopNav } from "@/components/TopNav";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "FrameOS Cloud",
  description: "FrameOS docs, blog, and cloud login.",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <TopNav user={user} />
        {children}
      </body>
    </html>
  );
}
