import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Public site: statically generated with 5-minute ISR so admin content edits
// appear without a redeploy. (The admin section has its own dynamic layout.)
export const revalidate = 300;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
