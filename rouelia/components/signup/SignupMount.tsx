"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAppState } from "@/components/AppState";

const SignupDialog = dynamic(() => import("./SignupDialog").then((m) => m.SignupDialog), { ssr: false });

/** La fenêtre d'inscription n'est chargée qu'à sa première ouverture. */
export function SignupMount() {
  const { signup } = useAppState();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (signup.open) setMounted(true);
  }, [signup.open]);
  return mounted ? <SignupDialog /> : null;
}
