import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetBySlug = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    forms: {
      getBySlug: mockGetBySlug,
      create: mockCreate,
      update: mockUpdate,
    },
  },
}));

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

  it("preserves edited fields on existing system forms", async () => {
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

    const contactUpdate = mockUpdate.mock.calls.find(
      ([id]: [string]) => id === "contact-form-id"
    );

    expect(contactUpdate).toBeTruthy();
    expect(contactUpdate[1].name).toBe("Custom Contact Form");
    expect(contactUpdate[1].fields).toHaveLength(1);
    expect(contactUpdate[1].fields[0].label).toBe("How can we help?");
    expect(contactUpdate[1].settings.successMessage).toBe("Custom contact success");
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

    const contactUpdate = mockUpdate.mock.calls.find(
      ([id]: [string]) => id === "contact-form-id"
    );

    expect(contactUpdate[1].fields.map((formField: { key: string }) => formField.key)).toEqual([
      "name",
      "phone",
      "email",
      "contactPreference",
      "subject",
      "message",
    ]);
    expect(contactUpdate[1].fields.find((formField: { key: string }) => formField.key === "phone").required).toBe(true);
    expect(contactUpdate[1].fields.find((formField: { key: string }) => formField.key === "email").required).toBe(false);
    expect(contactUpdate[1].settings.schemaVersion).toBe(2);
  });

  it("creates missing system forms on a clean install", async () => {
    mockGetBySlug.mockResolvedValue(undefined);

    const mod = await import("../services/system-forms.service");
    await mod.ensureSystemForms();

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const createdSlugs = mockCreate.mock.calls.map(([form]) => form.slug);
    expect(createdSlugs).toEqual(
      expect.arrayContaining([
        "contact-form",
      ])
    );
  });
});
