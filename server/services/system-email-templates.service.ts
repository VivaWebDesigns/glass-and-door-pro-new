import { eq } from "drizzle-orm";
import { db } from "../db";
import { emailTemplates, type InsertEmailTemplate } from "@shared/schema";
import { logger } from "../utils/logger";

function baseWrap(title: string, body: string): string {
  return `<h2 style="margin:0 0 16px;color:#1e3a5f;font-size:20px;">${title}</h2>
${body}`;
}

function removeLegacyAdminCta(htmlBody: string) {
  return htmlBody.replace(
    /\s*<table cellpadding="0" cellspacing="0" style="margin:24px 0;">[\s\S]*?Admin Dashboard<\/a>\s*<\/td><\/tr>\s*<\/table>/i,
    ""
  );
}

export const SYSTEM_EMAIL_TEMPLATE_DEFAULTS: InsertEmailTemplate[] = [
  {
    slug: "password-reset",
    name: "Password Reset",
    subject: "Reset Your Glass & Door Pro Password",
    description: "Sent when a user requests a password reset or an admin sends a reset link.",
    variables: ["firstName", "resetUrl"],
    htmlBody: baseWrap("Password Reset", `
    <p style="color:#374151;font-size:15px;line-height:1.6;">Hi {{firstName}},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">We received a request to reset your Glass & Door Pro password. Click the button below to set a new password:</p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr><td style="background:#2d8a7e;border-radius:6px;padding:12px 28px;">
        <a href="{{resetUrl}}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">Reset Password</a>
      </td></tr>
    </table>
    <p style="color:#374151;font-size:15px;line-height:1.6;">This link will expire in 24 hours. If you did not request a password reset, you can safely ignore this email.</p>
    <p style="color:#6b7280;font-size:14px;margin-top:24px;">If the button does not work, copy and paste this URL into your browser:</p>
    <p style="color:#6b7280;font-size:13px;word-break:break-all;">{{resetUrl}}</p>`),
  },
  {
    slug: "welcome-new-user",
    name: "Welcome New User",
    subject: "Welcome to Glass & Door Pro",
    description: "Sent when an admin manually creates a new user account.",
    variables: ["firstName", "loginUrl", "tempPassword"],
    htmlBody: baseWrap("Welcome to Glass & Door Pro", `
    <p style="color:#374151;font-size:15px;line-height:1.6;">Hi {{firstName}},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">An admin account has been created for you on the Glass & Door Pro website.</p>
    {{#tempPassword}}<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:12px 16px;margin:16px 0;border-radius:0 4px 4px 0;">
      <p style="margin:0;color:#166534;font-size:14px;"><strong>Temporary Password:</strong> {{tempPassword}}</p>
      <p style="margin:4px 0 0;color:#166534;font-size:13px;">Please change this after logging in.</p>
    </div>{{/tempPassword}}
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr><td style="background:#2d8a7e;border-radius:6px;padding:12px 28px;">
        <a href="{{loginUrl}}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">Log In to Your Account</a>
      </td></tr>
    </table>
    <p style="color:#6b7280;font-size:14px;margin-top:24px;">If you have any questions, please reach out to the site administrator.</p>`),
  },
  {
    slug: "contact-form-submission",
    name: "Contact Form Submission (Admin)",
    subject: "New Glass & Door Pro Contact Form: {{senderName}}",
    description: "Sent to admin(s) when someone submits the contact form.",
    variables: ["senderName", "senderEmail", "senderPhone", "contactPreference", "subject", "messageBody"],
    htmlBody: baseWrap("New Contact Form Submission", `
    <p style="color:#374151;font-size:15px;line-height:1.6;">A new message has been submitted through the Glass & Door Pro contact form.</p>
    <div style="background:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>From:</strong> {{senderName}}</p>
      <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Phone:</strong> {{senderPhone}}</p>
      <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Email:</strong> {{senderEmail}}</p>
      <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Preferred contact:</strong> {{contactPreference}}</p>
      <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Subject:</strong> {{subject}}</p>
      <p style="margin:8px 0 0;color:#374151;font-size:14px;"><strong>Message:</strong></p>
      <p style="margin:4px 0 0;color:#374151;font-size:14px;">{{messageBody}}</p>
    </div>`),
  },
  {
    slug: "managed-form-submission",
    name: "Managed Form Submission (Admin)",
    subject: "New Glass & Door Pro Form Submission: {{formName}}",
    description: "Sent to assigned system users when a managed frontend form receives a submission.",
    variables: ["formName", "submissionSummary"],
    htmlBody: baseWrap("New Form Submission", `
    <p style="color:#374151;font-size:15px;line-height:1.6;">A new submission was received for <strong>{{formName}}</strong>.</p>
    <div style="background:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;color:#374151;font-size:14px;white-space:pre-line;">{{submissionSummary}}</p>
    </div>`),
  },
];

export async function ensureSystemEmailTemplates(refreshExisting = false) {
  let created = 0;
  let updated = 0;

  for (const template of SYSTEM_EMAIL_TEMPLATE_DEFAULTS) {
    if (!refreshExisting) {
      const existing = await db.query.emailTemplates.findFirst({
        where: (emailTemplate, { eq }) => eq(emailTemplate.slug, template.slug),
      });

      if (
        existing &&
        (template.slug === "contact-form-submission" || template.slug === "managed-form-submission")
      ) {
        const contactTemplateNeedsUpgrade =
          template.slug === "contact-form-submission" &&
          !existing.variables.includes("senderPhone");
        const nextHtmlBody = contactTemplateNeedsUpgrade
          ? template.htmlBody
          : removeLegacyAdminCta(existing.htmlBody);
        const nextVariables = template.variables;
        const variablesChanged = JSON.stringify(existing.variables) !== JSON.stringify(nextVariables);

        if (nextHtmlBody !== existing.htmlBody || variablesChanged) {
          await db
            .update(emailTemplates)
            .set({
              htmlBody: nextHtmlBody,
              variables: nextVariables,
              updatedAt: new Date(),
            })
            .where(eq(emailTemplates.slug, template.slug));
          updated += 1;
        }
      }
    }

    if (refreshExisting) {
      await db
        .insert(emailTemplates)
        .values(template)
        .onConflictDoUpdate({
          target: emailTemplates.slug,
          set: {
            name: template.name,
            subject: template.subject,
            htmlBody: template.htmlBody,
            description: template.description,
            variables: template.variables,
            isActive: template.isActive ?? true,
            updatedAt: new Date(),
          },
        });
      updated += 1;
      continue;
    }

    const inserted = await db
      .insert(emailTemplates)
      .values(template)
      .onConflictDoNothing({
        target: emailTemplates.slug,
      });
    created += inserted.rowCount ?? 0;
  }

  logger.app.info("System email templates ensured", {
    total: SYSTEM_EMAIL_TEMPLATE_DEFAULTS.length,
    created,
    updated,
    refreshExisting,
  });

  return {
    total: SYSTEM_EMAIL_TEMPLATE_DEFAULTS.length,
    created,
    updated,
  };
}
