import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../utils/logger", () => ({
  logger: {
    email: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    app: { warn: vi.fn() },
  },
}));

vi.mock("../utils/metrics", () => ({
  recordEmailOutcome: vi.fn(),
}));

const mockGetDecryptedCategory = vi.fn();
const mockGetTemplate = vi.fn();
vi.mock("../storage/index", () => ({
  storage: {
    settings: {
      getDecryptedCategory: mockGetDecryptedCategory,
    },
    emailTemplates: {
      getTemplate: mockGetTemplate,
    },
  },
}));

const mockCreate = vi.fn();
const mockDomainsGet = vi.fn();
const contactTemplateFixture = {
  subject: "New Contact Form: {{senderName}}",
  htmlBody: `<p><strong>From:</strong> {{senderName}}</p>
    <p><strong>Email:</strong> {{#replyToEmail}}<a href="mailto:{{replyToEmail}}">{{senderEmail}}</a>{{/replyToEmail}}{{#emailNotProvided}}Not provided{{/emailNotProvided}}</p>
    <p><strong>Subject:</strong> {{subject}}</p>
    <p>{{messageBody}}</p>
    {{#replyToEmail}}<a href="mailto:{{replyToEmail}}">Reply to {{senderName}}</a>{{/replyToEmail}}`,
  isActive: true,
};
vi.mock("mailgun.js", () => ({
  default: vi.fn(() => ({
    client: () => ({
      messages: { create: mockCreate },
      domains: { get: mockDomainsGet },
    }),
  })),
}));

vi.mock("form-data", () => ({
  default: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({}),
    })),
  },
}));

describe("Email service", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockGetDecryptedCategory.mockResolvedValue({});
    mockGetTemplate.mockResolvedValue(undefined);
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RESEND_FROM", "");
    const mod = await import("../services/email.service");
    mod.resetMailgunConfig();
    mod.resetEmailBrandingCache();
  });

  it("sends via Resend when configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("RESEND_FROM", "Glass & Door Pro Website <website@updates.glassanddoorpro.com>");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "resend-email-id" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const mod = await import("../services/email.service");
    const result = await mod.sendEmail("doug@glassanddoorpro.com", "New contact", "<p>Hello</p>");

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_test_key",
        }),
      }),
    );
    vi.unstubAllGlobals();
  });

  it("sets Resend Reply-To for a contact email and safely renders customer content", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    mockGetTemplate.mockResolvedValue(contactTemplateFixture);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "contact-email-id" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const mod = await import("../services/email.service");
    await mod.sendContactFormEmail(
      ["doug@glassanddoorpro.com"],
      {
        senderName: "Jane <Doe>",
        senderEmail: "jane@example.com",
        senderPhone: "(704) 555-0123",
        contactPreference: "email",
        subject: "Shower <script>alert(1)</script>",
        messageBody: "First line with $&\n<img src=x onerror=alert(1)>",
      },
      "https://glassanddoorpro.com/admin",
    );

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload.reply_to).toBe("jane@example.com");
    expect(payload.html).toContain('href="mailto:jane@example.com"');
    expect(payload.html).toContain("Reply to Jane &lt;Doe&gt;");
    expect(payload.html).toContain("First line with $&amp;<br>&lt;img src=x onerror=alert(1)&gt;");
    expect(payload.html).not.toContain("<script>alert(1)</script>");
    expect(payload.html).not.toContain("<img src=x onerror=alert(1)>");

    vi.unstubAllGlobals();
  });

  it("omits Reply-To and reply links when a customer does not provide email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    mockGetTemplate.mockResolvedValue(contactTemplateFixture);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "contact-email-id" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const mod = await import("../services/email.service");
    await mod.sendContactFormEmail(
      ["doug@glassanddoorpro.com"],
      {
        senderName: "Jane Doe",
        senderEmail: "",
        senderPhone: "(704) 555-0123",
        contactPreference: "phone",
        subject: "Shower enclosure",
        messageBody: "Please call me.",
      },
      "https://glassanddoorpro.com/admin",
    );

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload).not.toHaveProperty("reply_to");
    expect(payload.html).not.toContain("mailto:");
    expect(payload.html).not.toContain("Reply to Jane Doe");
    expect(payload.html).toContain("<strong>Email:</strong> Not provided");

    vi.unstubAllGlobals();
  });

  it("sends via Mailgun when configured", async () => {
    mockGetDecryptedCategory.mockResolvedValue({
      mailgun_api_key: "key-123",
      mailgun_domain: "mg.example.com",
      mailgun_from_address: "noreply@example.com",
    });
    mockCreate.mockResolvedValue({});

    const mod = await import("../services/email.service");
    const result = await mod.sendEmail("user@test.com", "Test", "<p>Hello</p>");
    expect(result).toBe(true);
    expect(mockCreate).toHaveBeenCalled();
  });

  it("caches Mailgun config after first fetch", async () => {
    mockGetDecryptedCategory.mockResolvedValue({
      mailgun_api_key: "key-123",
      mailgun_domain: "mg.example.com",
    });
    mockCreate.mockResolvedValue({});

    const mod = await import("../services/email.service");
    await mod.sendEmail("a@b.com", "S1", "<p>1</p>");
    await mod.sendEmail("c@d.com", "S2", "<p>2</p>");

    expect(mockGetDecryptedCategory).toHaveBeenCalledTimes(1);
  });

  it("re-fetches config after resetMailgunConfig", async () => {
    mockGetDecryptedCategory.mockResolvedValue({
      mailgun_api_key: "key-123",
      mailgun_domain: "mg.example.com",
    });
    mockCreate.mockResolvedValue({});

    const mod = await import("../services/email.service");
    await mod.sendEmail("a@b.com", "S1", "<p>1</p>");
    mod.resetMailgunConfig();
    await mod.sendEmail("c@d.com", "S2", "<p>2</p>");

    expect(mockGetDecryptedCategory).toHaveBeenCalledTimes(2);
  });

  it("returns false when no email provider is configured", async () => {
    mockGetDecryptedCategory.mockResolvedValue({});

    const mod = await import("../services/email.service");
    const result = await mod.sendEmail("user@test.com", "Test", "<p>Hello</p>");
    expect(result).toBe(false);
  });

  it("reports a failed contact notification when no provider is configured", async () => {
    mockGetDecryptedCategory.mockResolvedValue({});
    mockGetTemplate.mockResolvedValue(undefined);

    const mod = await import("../services/email.service");
    await expect(
      mod.sendContactFormEmail(
        ["doug@glassanddoorpro.com"],
        {
          senderName: "Jane Doe",
          senderEmail: "",
          senderPhone: "(704) 555-0123",
          contactPreference: "phone",
          subject: "Shower enclosure",
          messageBody: "Please call me.",
        },
        "https://glassanddoorpro.com/admin",
      ),
    ).rejects.toThrow("doug@glassanddoorpro.com");
  });

  it("falls back gracefully when Mailgun send fails", async () => {
    mockGetDecryptedCategory.mockResolvedValue({
      mailgun_api_key: "key-123",
      mailgun_domain: "mg.example.com",
    });
    mockCreate.mockRejectedValue(new Error("Network error"));

    const mod = await import("../services/email.service");
    const result = await mod.sendEmail("user@test.com", "Test", "<p>Hello</p>");
    expect(result).toBe(false);
  });
});
