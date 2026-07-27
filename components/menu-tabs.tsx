"use client";

import type { MenuCategoryWithItems } from "@/types/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemCard } from "@/components/cards/menu-item-card";

export function MenuTabs({ categories }: { categories: MenuCategoryWithItems[] }) {
  const withItems = categories.filter((c) => c.items.length > 0);
  if (withItems.length === 0) return null;

  return (
    <Tabs defaultValue={withItems[0].slug} className="w-full">
      <TabsList className="mx-auto">
        {withItems.map((category) => (
          <TabsTrigger key={category.slug} value={category.slug}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {withItems.map((category) => (
        <TabsContent key={category.slug} value={category.slug}>
          {category.description && (
            <p className="mx-auto mb-8 max-w-xl text-center text-muted-foreground">
              {category.description}
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} className="h-full" />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
