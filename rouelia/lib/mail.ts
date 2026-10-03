/**
 * Envoi d'e-mails par Brevo (API transactionnelle).
 * La clé est un secret Cloudflare nommé BREVO_API_KEY. Sans clé, rien n'est envoyé (développement, tests).
 */
import { brand } from "@/content";

export interface Mail {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
  /** Nom affiché comme expéditeur (le commerce pour ses clients, Rouelia sinon). */
  fromName?: string;
  /** Adresse de réponse (celle du commerçant pour ses clients). */
  replyTo?: string;
  tags?: string[];
}

export type MailResult = { ok: true } | { ok: false; skipped?: boolean; error?: string };
type Transport = (mail: Mail) => Promise<MailResult>;

/** Adresse d'envoi, sur le domaine authentifié dans Brevo. */
export const SENDER = brand.email;

const g = globalThis as unknown as { __roueliaMailTransport?: Transport | null };

export const mailConfigured = () => !!g.__roueliaMailTransport || !!process.env.BREVO_API_KEY;

async function brevo(mail: Mail): Promise<MailResult> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: false, skipped: true };
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: mail.fromName ?? brand.name, email: SENDER },
        to: [{ email: mail.to.email, ...(mail.to.name ? { name: mail.to.name } : {}) }],
        ...(mail.replyTo ? { replyTo: { email: mail.replyTo } } : {}),
        subject: mail.subject,
        htmlContent: mail.html,
        textContent: mail.text,
        ...(mail.tags?.length ? { tags: mail.tags } : {}),
      }),
    });
    if (res.ok) return { ok: true };
    const detail = (await res.text()).slice(0, 300);
    console.error("[mail] Brevo refuse l'envoi", res.status, detail);
    return { ok: false, error: `brevo_${res.status}` };
  } catch (e) {
    console.error("[mail] envoi impossible", e);
    return { ok: false, error: "reseau" };
  }
}

/** Envoie un e-mail. Ne lève jamais d'erreur : un e-mail raté ne doit pas casser une partie ou une inscription. */
export async function sendMail(mail: Mail): Promise<MailResult> {
  return (g.__roueliaMailTransport ?? brevo)(mail);
}

/** Pour les tests : remplace l'envoi (null = Brevo). */
export function setMailTransport(t: Transport | null) {
  g.__roueliaMailTransport = t;
}
