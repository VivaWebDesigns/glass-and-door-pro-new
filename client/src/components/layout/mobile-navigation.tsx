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
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef<number | null>(null);
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
      setDragOffset(0);
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
      "flex min-h-16 w-full items-center gap-4 rounded-lg px-3 py-4 text-left text-foreground transition-colors hover:bg-muted/60 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-[current=page]:bg-muted/60";
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
            onClick={() => changeOpen(false)}
          >
            {contents}
          </a>
        ) : (
          <Link
            href={item.url}
            className={className}
            aria-current={item.url === currentPath ? "page" : undefined}
            data-testid={`link-mobile-${item.id}`}
            onClick={() => changeOpen(false)}
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
        side="bottom"
        aria-describedby={undefined}
        data-testid="mobile-navigation"
        overlayClassName="bg-black/40 backdrop-blur-sm motion-reduce:animate-none"
        style={
          dragOffset
            ? { transform: `translateY(${dragOffset}px)`, animation: "none", transition: "none" }
            : undefined
        }
        className="h-[min(680px,90dvh)] max-h-[90dvh] gap-0 overflow-hidden rounded-t-[28px] border-0 bg-white pb-[env(safe-area-inset-bottom)] shadow-xl duration-300 data-[state=open]:duration-300 motion-reduce:animate-none motion-reduce:transition-none [&>button]:right-5 [&>button]:top-10 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-muted [&>button]:opacity-100 [&>button>svg]:h-5 [&>button>svg]:w-5"
      >
        <div
          aria-hidden="true"
          data-testid="mobile-menu-drag-handle"
          className="flex h-9 shrink-0 touch-none items-center justify-center cursor-grab active:cursor-grabbing"
          onPointerDown={(event) => {
            dragStart.current = event.clientY;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (dragStart.current !== null)
              setDragOffset(Math.max(0, event.clientY - dragStart.current));
          }}
          onPointerUp={(event) => {
            if (dragStart.current !== null && event.clientY - dragStart.current > 70)
              changeOpen(false);
            dragStart.current = null;
            setDragOffset(0);
          }}
          onPointerCancel={() => {
            dragStart.current = null;
            setDragOffset(0);
          }}
        >
          <span className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>
        <SheetHeader className="space-y-0 px-6 pt-2 pb-3">
          <img
            src={brandLogo}
            alt={brandName}
            className="mb-5 h-11 w-auto max-w-[calc(100%-3.5rem)] self-start object-contain"
          />
          {current && (
            <button
              type="button"
              onClick={() => navigate(stack.slice(0, -1), -1)}
              className="mb-2 flex min-h-11 w-fit items-center gap-2 rounded-md pr-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {stack.length > 1 ? stack[stack.length - 2].label : "Explore"}
            </button>
          )}
          <SheetTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-[32px] font-bold leading-tight tracking-tight outline-none"
          >
            {current?.label ?? "Explore"}
          </SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="min-h-0 overflow-y-auto overscroll-contain px-3 pb-6"
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
