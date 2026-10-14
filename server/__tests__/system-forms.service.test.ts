import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetBySlug = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockGetPublicBySlug = vi.fn();
const mockCreateSubmission = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    forms: {
      getBySlug: mockGetBySlug,
      create: mockCreate,
      update: mockUpdate,
      getPublicBySlug: mockGetPublicBySlug,
      createSubmission: mockCreateSubmission,
    },
  },
}));

vi.mock("../services/email.service", () => ({
  sendContactFormEmail: vi.fn(),
  sendManagedFormSubmissionEmail: vi.fn(),
}));
vi.mock("../services/mailchimp.service", () => ({ syncContactToMailchimp: vi.fn() }));

vi.mock("../utils/logger", () => ({
  logger: {
    app: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  },
}));

describe("ensureSystemForms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preserves edited fields while upgrading existing system forms", async () => {
    mockGetBySlug.mockImplementation(async (slug: string) => {
      if (slug === "contact-form") {
        return {
          id: "contact-form-id",
          name: "Custom Contact Form",
          slug: "contact-form",
          description: "Custom contact description",
          kind: "contact",
          isSystem: true,
          isActive: true,
          fields: [
            {
              id: "contact-preference",
              key: "contactPreference",
              label: "How should we contact you?",
              type: "radio",
              placeholder: "",
              helpText: "",
              required: true,
              width: "full",
              options: [
                { label: "Call me", value: "phone", imageUrl: "" },
                { label: "Email me", value: "email", imageUrl: "" },
              ],
              config: {},
            },
            {
              id: "message",
              key: "message",
              label: "How can we help?",
              type: "textarea",
              placeholder: "Tell us what you need",
              helpText: "",
              required: true,
              width: "full",
              options: [],
              config: {},
            },
          ],
          settings: {
            schemaVersion: 2,
            submitButtonText: "Send",
            successMessage: "Custom contact success",
            mailchimpEnabled: true,
            mailchimpTag: "Glass & Door Pro General Inquiry",
            notifyAdmins: true,
            storeAsContactMessage: true,
          },
        };
      }

      return undefined;
    });

    const mod = await import("../services/system-forms.service");
    await mod.ensureSystemForms();

    const contactUpdate = mockUpdate.mock.calls.find(([id]: [string]) => id === "contact-form-id");

    expect(contactUpdate).toBeTruthy();
    expect(contactUpdate[1].name).toBe("Custom Contact Form");
    expect(contactUpdate[1].fields).toHaveLength(4);
    expect(
      contactUpdate[1].fields.find((entry: { key: string }) => entry.key === "message").label,
    ).toBe("How can we help?");
    expect(contactUpdate[1].settings.successMessage).toBe("Custom contact success");
    expect(contactUpdate[1].settings.schemaVersion).toBe(4);
  });

  it("upgrades legacy contact form fields", async () => {
    mockGetBySlug.mockResolvedValue({
      id: "contact-form-id",
      name: "Contact Form",
      slug: "contact-form",
      description: "Legacy contact form",
      kind: "contact",
      isSystem: true,
      isActive: true,
      fields: [],
      settings: {
        submitButtonText: "Send",
        successMessage: "Thanks",
        mailchimpEnabled: false,
        mailchimpTag: "",
        notifyAdmins: true,
        storeAsContactMessage: true,
      },
    });

    const mod = await import("../services/system-forms.service");
    await mod.ensureSystemForms();

    const contactUpdate = mockUpdate.mock.calls.find(([id]: [string]) => id === "contact-form-id");

    expect(contactUpdate[1].fields.map((formField: { key: string }) => formField.key)).toEqual([
      "name",
      "phone",
      "email",
      "serviceAddress",
      "subject",
      "message",
    ]);
    expect(
      contactUpdate[1].fields.find((formField: { key: string }) => formField.key === "phone")
        .required,
    ).toBe(true);
    expect(
      contactUpdate[1].fields.find((formField: { key: string }) => formField.key === "email")
        .required,
    ).toBe(true);
    expect(contactUpdate[1].settings.schemaVersion).toBe(4);
  });

  it("creates missing system forms on a clean install", async () => {
    mockGetBySlug.mockResolvedValue(undefined);

    const mod = await import("../services/system-forms.service");
    await mod.ensureSystemForms();

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const createdSlugs = mockCreate.mock.calls.map(([form]) => form.slug);
    expect(createdSlugs).toEqual(expect.arrayContaining(["contact-form"]));
  });

  it("upgrades version 3 without duplicating fields and preserves later edits", async () => {
    const existing = {
      id: "contact-form-id",
      fields: [
        {
          id: "email",
          key: "email",
          label: "Custom email",
          type: "email",
          required: false,
          helpText: "Optional",
        },
        { id: "message", key: "message", label: "Custom details", type: "textarea" },
      ],
      settings: { schemaVersion: 3, successMessage: "Custom thanks" },
    };
    mockGetBySlug.mockResolvedValue(existing);
    const { ensureSystemForms } = await import("../services/system-forms.service");
    await ensureSystemForms();
    const update = mockUpdate.mock.calls.at(-1)?.[1];
    expect(update.fields.find((entry: { key: string }) => entry.key === "email")).toMatchObject({
      label: "Custom email",
      required: true,
      helpText: "",
    });
    expect(
      update.fields.filter((entry: { key: string }) => entry.key === "serviceAddress"),
    ).toHaveLength(1);
    expect(update.settings).toMatchObject({ schemaVersion: 4, successMessage: "Custom thanks" });
    mockGetBySlug.mockResolvedValue({ ...existing, ...update });
    await ensureSystemForms();
    expect(mockUpdate.mock.calls.at(-1)?.[1].fields).toEqual(update.fields);
    mockGetBySlug.mockResolvedValue({ ...existing, settings: { schemaVersion: 4 } });
    await ensureSystemForms();
    expect(mockUpdate.mock.calls.at(-1)?.[1].fields).toEqual(existing.fields);
  });

  it("rejects incomplete contact details but accepts a complete address without line 2", async () => {
    mockGetBySlug.mockResolvedValue(undefined);
    const { ensureSystemForms } = await import("../services/system-forms.service");
    await ensureSystemForms();
    const form = { ...mockCreate.mock.calls.at(-1)?.[0], id: "contact-form-id", settings: {} };
    mockGetPublicBySlug.mockResolvedValue(form);
    mockCreateSubmission.mockImplementation(async (payload) => ({ id: "entry", ...payload }));
    const { submitManagedFormBySlug } = await import("../services/forms.service");
    const data = {
      name: "Example Customer",
      phone: "7045550123",
      email: "customer@example.com",
      subject: "Window repair",
      message: "Replace broken glass",
      serviceAddress: {
        street: "123 Main St",
        city: "Charlotte",
        state: "NC",
        postalCode: "28202",
      },
    };
    for (const key of ["phone", "email", "serviceAddress"]) {
      await expect(
        submitManagedFormBySlug("contact-form", { ...data, [key]: undefined }),
      ).rejects.toThrow(/required/);
    }
    for (const key of ["street", "city", "state", "postalCode"]) {
      await expect(
        submitManagedFormBySlug("contact-form", {
          ...data,
          serviceAddress: { ...data.serviceAddress, [key]: "" },
        }),
      ).rejects.toThrow(/required/);
    }
    expect(mockCreateSubmission).not.toHaveBeenCalled();
    const result = await submitManagedFormBySlug("contact-form", data);
    expect((result.submission.data.serviceAddress as Record<string, string>).street2).toBe("");
  });
});
