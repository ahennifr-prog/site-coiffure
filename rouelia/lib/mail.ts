/**
 * Envoi d'e-mails : Resend si le secret RESEND_API_KEY est posé, sinon Brevo (BREVO_API_KEY).
 * Les clés sont des secrets Cloudflare, jamais dans le code. Sans clé, rien n'est envoyé (développement, tests).
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
  /** Pièces jointes : texte (invitation .ics) ou contenu déjà en base64 (image). */
  attachments?: { filename: string; content: string; base64?: boolean }[];
}

export type MailResult = { ok: true } | { ok: false; skipped?: boolean; error?: string };
type Transport = (mail: Mail) => Promise<MailResult>;

/** Adresse d'envoi, sur le domaine authentifié dans Brevo. */
export const SENDER = brand.email;

const g = globalThis as unknown as { __roueliaMailTransport?: Transport | null };

export const mailConfigured = () => !!g.__roueliaMailTransport || !!process.env.RESEND_API_KEY || !!process.env.BREVO_API_KEY;

const base64 = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

async function resend(mail: Mail, key: string): Promise<MailResult> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${mail.fromName ?? brand.name} <${SENDER}>`,
        to: [mail.to.email],
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        ...(mail.attachments?.length ? { attachments: mail.attachments.map((a) => ({ filename: a.filename, content: a.base64 ? a.content : base64(a.content) })) } : {}),
      }),
    });
    if (res.ok) return { ok: true };
    const detail = (await res.text()).slice(0, 300);
    console.error("[mail] Resend refuse l'envoi", res.status, detail);
    return { ok: false, error: `resend_${res.status}` };
  } catch (e) {
    console.error("[mail] envoi impossible", e);
    return { ok: false, error: "reseau" };
  }
}

/** Resend en priorité si sa clé est posée, Brevo sinon. */
async function deliver(mail: Mail): Promise<MailResult> {
  const resendKey = process.env.RESEND_API_KEY;
  return resendKey ? resend(mail, resendKey) : brevo(mail);
}

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
        ...(mail.attachments?.length ? { attachment: mail.attachments.map((a) => ({ name: a.filename, content: a.base64 ? a.content : base64(a.content) })) } : {}),
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
  return (g.__roueliaMailTransport ?? deliver)(mail);
}

/** Pour les tests : remplace l'envoi (null = Resend ou Brevo). */
export function setMailTransport(t: Transport | null) {
  g.__roueliaMailTransport = t;
}
