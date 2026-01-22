"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, FadeIn, ScaleIn, ThemeToggle } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useAuthMock } from "@/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuthMock();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const success = await login(email, password);

    if (success) {
      router.push("/dashboard");
    } else {
      setError(t("login.error_invalid"));
    }

    setIsSubmitting(false);
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-[var(--text-secondary)]">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <FadeIn delay={800}>
          <ThemeToggle />
        </FadeIn>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <ScaleIn delay={100}>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--accent-primary)] rounded-2xl mb-6 shadow-glow-accent">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
            </ScaleIn>

            <FadeIn delay={200} direction="up">
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                {t("login.title")}
              </h1>
            </FadeIn>

            <FadeIn delay={300} direction="up">
              <p className="text-[var(--text-secondary)] mt-3 text-base sm:text-lg">
                {t("login.subtitle")}
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={400} direction="up">
            <Card variant="elevated" className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <FadeIn delay={500} direction="up">
                  <Input
                    type="email"
                    label={t("login.email_label")}
                    placeholder={t("login.email_placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </FadeIn>

                <FadeIn delay={600} direction="up">
                  <Input
                    type="password"
                    label={t("login.password_label")}
                    placeholder={t("login.password_placeholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </FadeIn>

                {error && (
                  <FadeIn delay={0} direction="none">
                    <p className="text-sm text-red-500 bg-red-500/10 px-4 py-3 rounded-xl">
                      {error}
                    </p>
                  </FadeIn>
                )}

                <FadeIn delay={700} direction="up">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isSubmitting}
                  >
                    {t("login.button")}
                  </Button>
                </FadeIn>
              </form>

              <FadeIn delay={800} direction="up">
                <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
                  {t("login.demo_hint")}
                </p>
              </FadeIn>
            </Card>
          </FadeIn>

          <FadeIn delay={900} direction="up">
            <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
              Powered by Lingo.dev
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
