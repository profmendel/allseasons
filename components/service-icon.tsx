import {
  Baby,
  Briefcase,
  Cake,
  Church,
  Crown,
  Flower2,
  GraduationCap,
  Heart,
  Landmark,
  PartyPopper,
  Tent,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Crown,
  Briefcase,
  Cake,
  Church,
  Tent,
  GraduationCap,
  Baby,
  Flower2,
  PartyPopper,
  Landmark,
};

export function ServiceIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && iconMap[name]) || UtensilsCrossed;
  return <Icon className={className} />;
}
