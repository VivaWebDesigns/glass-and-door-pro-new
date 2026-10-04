import { useRef, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  FileText,
  House,
  Images,
  Mail,
  MapPin,
  Menu,
  PanelTop,
  Star,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { MenuItem } from "@shared/schema";

function iconFor(item: MenuItem) {
  const label = item.label.toLowerCase();
  if (item.url === "/") return House;
  if (label.includes("about")) return FileText;
  if (label.includes("area") || item.url.startsWith("/service-areas")) return MapPin;
  if (label.includes("gallery")) return Images;
  if (label.includes("review")) return Star;
  if (label.includes("contact")) return Mail;
  if (label.includes("residential")) return House;
  if (label.includes("commercial")) return Building2;
  if (label.includes("window")) return PanelTop;
  return Wrench;
}

function isCurrent(item: MenuItem, path: string): boolean {
  return (
    (item.url !== "#" && item.url === path) ||
    !!item.children?.some((child) => isCurrent(child, path))
  );
}

export function MobileNavigation({
  items,
  brandLogo,
  brandName,
  currentPath,
}: {
  items: MenuItem[];
  brandLogo: string;
  brandName: string;
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);
  const [stack, setStack] = useState<MenuItem[]>([]);
  const [direction, setDirection] = useState(1);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const current = stack[stack.length - 1];
  const visibleItems = current ? current.children : items;
  const overview =
    current && current.url !== "#"
      ? {
          ...current,
          id: `${current.id}-overview`,
          label: /^services$/i.test(current.label)
            ? "Services Overview"
            : /^service areas$/i.test(current.label)
              ? "All Service Areas"
              : `All ${current.label}`,
          children: [],
        }
      : null;

  function changeOpen(next: boolean) {
    setOpen(next);
    if (next) {
      setStack([]);
      setDirection(1);
    }
  }

  function followLink(url: string) {
    changeOpen(false);
    if (url === "/") {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    }
  }

  function navigate(nextStack: MenuItem[], nextDirection: number) {
    setDirection(nextDirection);
    setStack(nextStack);
    titleRef.current?.focus();
  }

  function row(item: MenuItem) {
    const Icon = iconFor(item);
    const subtitle =
      !current && /^services$/i.test(item.label)
        ? "Residential & commercial"
        : !current && /^service areas$/i.test(item.label)
          ? "Greater Charlotte"
          : null;
    const hasChildren = item.children?.length > 0;
    const contents = (
      <>
        <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-[#1a8ead]" strokeWidth={1.75} />
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-medium leading-snug">{item.label}</span>
          {subtitle && (
            <span className="mt-1 block text-sm font-normal text-muted-foreground">{subtitle}</span>
          )}
        </span>
        <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground" />
      </>
    );
    const className =
      "flex min-h-14 w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-foreground transition-colors hover:bg-muted/60 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-[current=page]:bg-muted/60";
    return (
      <li key={item.id} className="border-b border-border/60 last:border-0">
        {hasChildren ? (
          <button
            type="button"
            className={className}
            data-testid={`button-mobile-group-${item.id}`}
            onClick={() => navigate([...stack, item], 1)}
          >
            {contents}
            {isCurrent(item, currentPath) && <span className="sr-only">Contains current page</span>}
          </button>
        ) : item.url === "#" ? (
          <p className="px-3 py-4 text-sm font-semibold text-muted-foreground">{item.label}</p>
        ) : item.openInNewTab ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            data-testid={`link-mobile-${item.id}`}
            onClick={() => followLink(item.url)}
          >
            {contents}
          </a>
        ) : (
          <Link
            href={item.url}
            className={className}
            aria-current={item.url === currentPath ? "page" : undefined}
            data-testid={`link-mobile-${item.id}`}
            onClick={() => followLink(item.url)}
          >
            {contents}
          </Link>
        )}
      </li>
    );
  }

  return (
    <Sheet open={open} onOpenChange={changeOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open navigation menu"
          size="icon"
          variant="ghost"
          className="rounded-full border border-border/70 bg-background/70"
          data-testid="button-mobile-menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        data-testid="mobile-navigation"
        overlayClassName="bg-black/40 backdrop-blur-sm motion-reduce:animate-none"
        className="w-[84vw] max-w-[360px] gap-0 overflow-hidden border-0 bg-white pb-[env(safe-area-inset-bottom)] shadow-xl duration-300 data-[state=open]:duration-300 sm:max-w-[360px] motion-reduce:animate-none motion-reduce:transition-none [&>button]:right-3 [&>button]:top-3 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-muted [&>button]:opacity-100 [&>button>svg]:h-5 [&>button>svg]:w-5"
      >
        <SheetHeader className="space-y-0 px-5 pt-14 pb-3">
          <Link
            href="/"
            onClick={() => followLink("/")}
            className="mb-4 self-start rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${brandName} home`}
          >
            <img
              src={brandLogo}
              alt={brandName}
              className="h-16 w-auto max-w-full object-contain"
            />
          </Link>
          {current && (
            <button
              type="button"
              onClick={() => navigate(stack.slice(0, -1), -1)}
              className="mb-2 flex min-h-11 w-fit items-center gap-2 rounded-md pr-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {stack.length > 1 ? stack[stack.length - 2].label : "Back"}
            </button>
          )}
          <SheetTitle
            ref={titleRef}
            tabIndex={-1}
            className={
              current ? "text-2xl font-bold leading-tight tracking-tight outline-none" : "sr-only"
            }
          >
            {current?.label ?? "Site navigation"}
          </SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-6"
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.ul
              key={stack.map((item) => item.id).join("/") || "root"}
              custom={direction}
              variants={{
                enter: (dir: number) => ({ opacity: 0, x: reduceMotion ? 0 : dir * 24 }),
                center: { opacity: 1, x: 0 },
                exit: (dir: number) => ({ opacity: 0, x: reduceMotion ? 0 : dir * -24 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              {overview && row(overview)}
              {visibleItems.map(row)}
            </motion.ul>
          </AnimatePresence>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
