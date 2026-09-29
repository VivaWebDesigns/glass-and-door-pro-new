import type { ReactNode } from "react";
export function renderPublicDisplayText(value: string): ReactNode {
  return value.split(/(\s&\s)/g).map((part, index) =>
    part === " & " ? (
      <span key={`${part}-${index}`} className="font-sans">
        {" & "}
      </span>
    ) : (
      part
    ),
  );
}
