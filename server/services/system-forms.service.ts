import { cmsFormFieldSchema, type CmsFormField, type CmsFormSettings, type InsertCmsForm } from "@shared/schema";
import { z } from "zod";
import { storage } from "../storage";
import { logger } from "../utils/logger";

type CmsFormFieldInput = z.input<typeof cmsFormFieldSchema>;

function field(
  id: string,
  key: string,
  label: string,
  type: CmsFormField["type"],
  options: Partial<CmsFormFieldInput> = {}
): CmsFormField {
  return cmsFormFieldSchema.parse({
    id,
    key,
    label,
    type,
    placeholder: "",
    helpText: "",
    required: false,
    width: "full",
    options: [],
    config: {},
    ...options,
  });
}

function settings(overrides: Partial<CmsFormSettings>): CmsFormSettings {
  return {
    schemaVersion: 0,
    submitButtonText: "Submit",
    successMessage: "Thanks! Your submission has been received.",
    mailchimpEnabled: false,
    mailchimpTag: "",
    notifyAdmins: false,
    storeAsContactMessage: false,
    ...overrides,
  };
}

type ManagedSystemForm = InsertCmsForm;

const SYSTEM_FORMS: ManagedSystemForm[] = [
  {
    name: "Contact Form",
    slug: "contact-form",
    description: "Primary public quote and contact form used throughout the Glass & Door Pro website.",
    kind: "contact",
    isSystem: true,
    isActive: true,
    fields: [
      field("name", "name", "Name", "text", { placeholder: "Your name", required: true, width: "half" }),
      field("phone", "phone", "Phone", "tel", {
        placeholder: "(704) 555-0123",
        helpText: "Best number for a callback",
        required: true,
        width: "half",
      }),
      field("email", "email", "Email", "email", {
        placeholder: "you@example.com",
        helpText: "Optional unless you prefer an email response",
        required: false,
        width: "half",
      }),
      field("contact-preference", "contactPreference", "How should we contact you?", "radio", {
        required: true,
        options: [
          { label: "Call me", value: "phone", imageUrl: "" },
          { label: "Email me", value: "email", imageUrl: "" },
        ],
        config: { choiceLayout: "inline", defaultValue: "phone" },
      }),
      field("subject", "subject", "Subject", "text", { placeholder: "What is this about?", required: true }),
      field("message", "message", "Message", "textarea", { placeholder: "Tell us more...", required: true }),
    ],
    settings: settings({
      schemaVersion: 2,
      submitButtonText: "Send Message",
      successMessage: "Thanks for reaching out. We'll get back to you soon.",
      mailchimpEnabled: false,
      mailchimpTag: "Glass & Door Pro General Inquiry",
      notifyAdmins: true,
      storeAsContactMessage: true,
    }),
  },
];

export async function ensureSystemForms() {
  logger.app.info("Ensuring system forms");

  for (const systemForm of SYSTEM_FORMS) {
    const existing = await storage.forms.getBySlug(systemForm.slug);
    if (existing) {
      const existingSettings =
        (typeof existing.settings === "object" && existing.settings
          ? existing.settings
          : {}) as Partial<CmsFormSettings>;
      const existingSchemaVersion =
        typeof existingSettings.schemaVersion === "number" ? existingSettings.schemaVersion : 0;
      const systemSchemaVersion =
        typeof systemForm.settings.schemaVersion === "number" ? systemForm.settings.schemaVersion : 0;
      const shouldUpgradeFields = existingSchemaVersion < systemSchemaVersion;

      await storage.forms.update(existing.id, {
        name: existing.name || systemForm.name,
        description: existing.description ?? systemForm.description ?? "",
        kind: existing.kind || systemForm.kind,
        isSystem: true,
        isActive: existing.isActive ?? true,
        fields:
          !shouldUpgradeFields && Array.isArray(existing.fields) && existing.fields.length > 0
            ? existing.fields
            : systemForm.fields,
        settings:
          {
            ...systemForm.settings,
            ...existingSettings,
            schemaVersion: Math.max(existingSchemaVersion, systemSchemaVersion),
          },
      });
      continue;
    }

    await storage.forms.create(systemForm);
  }

  logger.app.info("System forms ensured");
}
