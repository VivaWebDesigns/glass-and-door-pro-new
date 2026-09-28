import { formatGlassReviewDate } from "@shared/glass-review-dates";

function GoogleSourceIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        fill="#4285F4"
        d="M44.5 20H24v8.5h11.8C34.7 34 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.3l6-6C34.8 4.9 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.8 0 20.5-7.8 20.5-21 0-1.4-.1-2.7-.3-4Z"
      />
      <path
        fill="#34A853"
        d="M6.1 14.1 13.1 19.2C15 14.3 19.2 11 24 11c3.3 0 6.3 1.2 8.6 3.3l6-6C34.8 4.9 29.6 3 24 3 16.1 3 9.2 7.5 5.7 14Z"
      />
      <path
        fill="#FBBC05"
        d="M24 45c5.5 0 10.3-1.8 14-5l-6.5-5.4C29.5 36.1 26.9 37 24 37c-5.9 0-10.9-4-12.6-9.4l-7.1 5.5C7.8 40.1 15.2 45 24 45Z"
      />
      <path
        fill="#EA4335"
        d="M11.4 27.6A13 13 0 0 1 11 24c0-1.3.2-2.6.6-3.8l-7.3-5.6A21 21 0 0 0 3 24c0 3.3.8 6.4 2.2 9.1Z"
      />
    </svg>
  );
}

export function ReviewSourceBadge({
  item,
}: {
  item: { source?: string; sourceIcon?: string; date?: string; reviewDate?: string };
}) {
  const source = item.source || "Google";
  const showGoogleIcon = (item.sourceIcon || source).toLowerCase() === "google";
  const reviewDate = formatGlassReviewDate(item.reviewDate, item.date);

  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
      {showGoogleIcon ? <GoogleSourceIcon /> : null}
      {!showGoogleIcon ? <span>{source}</span> : null}
      {reviewDate ? <span className="font-medium text-[#1a8ead]">· {reviewDate}</span> : null}
    </div>
  );
}
