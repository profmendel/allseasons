import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import { cn, gradientFromString } from "@/lib/utils";

type MediaProps = {
  src?: string | null;
  alt: string;
  /** Text used to seed the placeholder gradient + shown as a caption. */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
};

/**
 * Renders real imagery when a URL is present, otherwise a designed gradient
 * placeholder so the site looks intentional before real photography is added.
 * Fills its parent — wrap in a sized, `relative` container or pass sizing via
 * `className`.
 */
export function Media({
  src,
  alt,
  label,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  rounded,
}: MediaProps) {
  const wrapper = cn(
    "relative isolate h-full w-full overflow-hidden bg-muted",
    rounded && "rounded-2xl",
    className,
  );

  if (src) {
    return (
      <div className={wrapper}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const [from, to] = gradientFromString(label ?? alt);

  return (
    <div
      className={wrapper}
      role="img"
      aria-label={alt}
      style={{ backgroundImage: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      {/* soft light + texture */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_10%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:repeating-linear-gradient(45deg,#000_0_1px,transparent_1px_7px)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-white/12 text-white/90 ring-1 ring-inset ring-white/25 backdrop-blur-sm">
          <UtensilsCrossed className="size-6" />
        </span>
        {label && (
          <span className="max-w-[85%] font-display text-lg font-medium leading-snug text-white/95 drop-shadow-sm">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
