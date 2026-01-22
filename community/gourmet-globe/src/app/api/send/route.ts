import { cookies } from "next/headers";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const locale = await getLocale();
  const { name, email } = await request.json();

  try {
    const { subject, body } = loadTemplate(locale);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Acme <from@example.com>",
      to: [email],
      subject,
      text: body.replace("{{name}}", name),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function getLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("lingo-locale");
  const locale = cookieLocale?.value ?? "en";
  return locale;
}

function loadTemplate(locale: string) {
  const template = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "components",
      "resend",
      "email",
      `${locale}.txt`
    ),
    "utf8"
  );
  const lines = template.split("\n");
  const subject = lines[0].trim();
  const body = lines.slice(1).join("\n").trim();

  return { subject, body };
}
