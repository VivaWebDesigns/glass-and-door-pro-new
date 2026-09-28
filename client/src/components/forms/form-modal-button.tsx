import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { PublicFormRenderer } from "./public-form-renderer";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export interface FormModalButtonProps extends Omit<ButtonProps, "children"> {
  label: string;
  action?: unknown;
  href?: unknown;
  openInNewTab?: unknown;
  formSlug?: unknown;
  modalTitle?: unknown;
  modalDescription?: unknown;
  testId?: string;
}

type ButtonAction = "form-modal" | "internal-link" | "custom-link";

function resolveButtonAction(rawAction: string, href: string): ButtonAction {
  if (rawAction === "form-modal" || rawAction === "internal-link" || rawAction === "custom-link") {
    return rawAction;
  }
  return href.startsWith("/") || href.startsWith("#") ? "internal-link" : "custom-link";
}

interface FormModalDialogButtonProps extends Omit<ButtonProps, "children"> {
  label: string;
  formSlug: string;
  modalTitle: string;
  modalDescription: string;
  testId?: string;
}

function FormModalDialogButton({
  label,
  formSlug,
  modalTitle,
  modalDescription,
  testId,
  ...buttonProps
}: FormModalDialogButtonProps) {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => clearCloseTimeout, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) clearCloseTimeout();
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button {...buttonProps} data-testid={testId}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          {modalDescription ? <DialogDescription>{modalDescription}</DialogDescription> : null}
        </DialogHeader>
        <PublicFormRenderer
          slug={formSlug}
          showHeader={false}
          descriptionOverride={modalDescription || undefined}
          onSubmitSuccess={() => {
            clearCloseTimeout();
            closeTimeoutRef.current = window.setTimeout(() => {
              setOpen(false);
              closeTimeoutRef.current = null;
            }, 1200);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export function FormModalButton({
  label,
  action,
  href,
  openInNewTab,
  formSlug,
  modalTitle,
  modalDescription,
  testId,
  ...buttonProps
}: FormModalButtonProps) {
  const normalizedHref = text(href) || "#";
  const normalizedAction = resolveButtonAction(text(action), normalizedHref);
  const normalizedFormSlug = text(formSlug);

  if (normalizedAction === "form-modal" && normalizedFormSlug) {
    return (
      <FormModalDialogButton
        {...buttonProps}
        label={label}
        formSlug={normalizedFormSlug}
        modalTitle={text(modalTitle) || label}
        modalDescription={text(modalDescription)}
        testId={testId}
      />
    );
  }

  if (normalizedAction === "internal-link") {
    return (
      <Button {...buttonProps} asChild data-testid={testId}>
        <Link href={normalizedHref}>{label}</Link>
      </Button>
    );
  }

  const shouldOpenInNewTab = openInNewTab === true;
  return (
    <Button {...buttonProps} asChild data-testid={testId}>
      <a
        href={normalizedHref}
        target={shouldOpenInNewTab ? "_blank" : undefined}
        rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
    </Button>
  );
}
