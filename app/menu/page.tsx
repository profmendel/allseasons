import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMenu } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { MenuTabs } from "@/components/menu-tabs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Food Menu",
  description:
    "Explore our full menu — rice dishes, soups, proteins, small chops, local delicacies, desserts and drinks. Every menu is customisable.",
};

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <>
      <PageHeader
        eyebrow="From Our Kitchen"
        title="A menu as rich as the occasion"
        description="Signature Nigerian classics and continental favourites, cooked fresh and served beautifully. Mix, match and customise to build your perfect spread."
      >
        <Button asChild size="lg">
          <Link href="/request-quote">
            Build your menu <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHeader>

      <section className="site-container py-16 md:py-24">
        <MenuTabs categories={menu} />
      </section>
    </>
  );
}
