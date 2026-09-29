import { describe, expect, it } from "vitest";
import sharp from "sharp";
import nodemailer from "nodemailer";
import { sql } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";

describe("upgraded dependency runtime compatibility", () => {
  it("encodes and reads WebP using the installed native image runtime", async () => {
    const image = await sharp({
      create: { width: 8, height: 6, channels: 4, background: "#123456" },
    })
      .resize(4, 3)
      .webp()
      .toBuffer();
    const metadata = await sharp(image).metadata();
    expect(metadata).toMatchObject({ format: "webp", width: 4, height: 3 });
  });
  it("builds a MIME message locally without sending mail", async () => {
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
    const result = await transport.sendMail({
      from: "sender@example.test",
      to: "recipient@example.test",
      subject: "Runtime check",
      text: "Plain body",
      html: "<p>HTML body</p>",
    });
    const message = result.message.toString();
    expect(message).toContain("Subject: Runtime check");
    expect(message).toContain("multipart/alternative");
    expect(message).toContain("Plain body");
    expect(message).toContain("<p>HTML body</p>");
  });
  it("escapes embedded quotes in PostgreSQL identifiers", () => {
    const result = new PgDialect().sqlToQuery(sql`select ${sql.identifier('name"quoted')}`);
    expect(result.sql).toBe('select "name""quoted"');
  });
});
