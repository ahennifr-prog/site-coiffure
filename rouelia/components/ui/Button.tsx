import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[transform,background-color,box-shadow,color] duration-200 ease-(--ease-out) active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 select-none";
const variants: Record<Variant, string> = {
  primary: "bg-tomette text-white shadow-[0_8px_20px_-8px_rgb(196_64_31/0.7)] hover:bg-tomette-deep",
  secondary: "bg-paper text-ink ring-1 ring-inset ring-line hover:ring-ink/40",
  ghost: "text-tomette-deep underline-offset-4 hover:underline",
  light: "bg-cream text-ink hover:bg-white",
};
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${variant === "ghost" ? "min-h-11 px-1" : sizes[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<"a">,
  "href"
>) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
