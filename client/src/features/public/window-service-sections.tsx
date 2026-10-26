import {
  BadgeCheck,
  CalendarDays,
  CheckCircle,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wrench,
} from "lucide-react";
import { arr, str } from "@/features/admin/cms/builder/block-renderer.shared";

const icons = {
  BadgeCheck,
  CalendarDays,
  CheckCircle,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wrench,
};
type Item = { title: string; description: string; icon?: string; imageUrl?: string };

function ItemIcon({ name, className = "h-8 w-8" }: { name?: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? CheckCircle;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}

function Heading({ props }: { props: Record<string, unknown> }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#087e9c]">
        {str(props.eyebrow)}
      </p>
      <h2 className="font-heading text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
        {str(props.title)}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-slate-600">{str(props.subtitle)}</p>
    </div>
  );
}

export function WindowServiceSection({ props }: { props: Record<string, unknown> }) {
  const cards = arr<Item>(props.cards);
  const variant = str(props.variant);
  if (variant === "window-installation-steps") {
    return (
      <div data-testid="window-installation-steps">
        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
          <Heading props={props} />
          <img
            src={str(props.imageUrl)}
            alt={str(props.imageAlt)}
            width={1280}
            height={853}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <ol className="mt-8 grid md:grid-cols-3 md:gap-x-6">
          {cards.map((card, index) => (
            <li
              key={card.title}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-slate-200 py-5 last:border-b-0 md:block md:py-7 md:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <div className="row-span-2 flex items-start gap-5 md:mb-4 md:items-center">
                <span className="font-heading text-3xl font-bold tabular-nums text-[#087e9c] md:text-4xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="hidden text-[#1a8ead] md:block">
                  <ItemIcon name={card.icon} />
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold leading-snug text-slate-900">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (variant === "window-type-catalog") {
    return (
      <div data-testid="window-type-catalog">
        <Heading props={props} />
        <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 md:gap-x-6">
          {cards.map((card) => (
            <li key={card.title}>
              <img
                src={card.imageUrl}
                alt={`Illustration of ${card.title.toLowerCase()}`}
                width={768}
                height={512}
                loading="lazy"
                className="mb-3 aspect-[3/2] w-full rounded-lg bg-[#eef8fc] object-contain"
              />
              <h3 className="mb-1 text-base font-semibold leading-snug text-slate-900">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div data-testid="window-trust-band" className="bg-[#202c46] p-6 text-white md:p-8">
      <div className="grid gap-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.65fr)] md:gap-8">
        <div className="border-b border-[#7bd5e6]/30 pb-7 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <h2 className="text-xs font-bold uppercase leading-relaxed tracking-[0.14em] text-[#8edbea]">
            {str(props.title)}
          </h2>
          <p
            data-testid="window-experience"
            className="mt-4 font-heading text-7xl font-bold leading-none tracking-tight text-[#8edbea]"
          >
            {str(props.experienceValue)}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-tight">{str(props.experienceTitle)}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            {str(props.experienceDescription)}
          </p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2">
          {cards.map((card, index) => (
            <li
              key={card.title}
              className={`flex items-start gap-3 ${index === cards.length - 1 ? "sm:col-span-2" : ""}`}
            >
              <span className="shrink-0 text-[#8edbea]">
                <ItemIcon name={card.icon} className="h-7 w-7" />
              </span>
              <div>
                <h3 className="mb-1 text-base font-semibold leading-snug">{card.title}</h3>
                <p className="text-sm leading-relaxed text-slate-200">{card.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
