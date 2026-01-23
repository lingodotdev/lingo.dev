import { getTranslations } from "next-intl/server";
import NewsletterForm from "../components/NewsletterForm";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t("title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t("subtitle")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current locale:{" "}
                <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {locale}
                </span>
              </p>
            </div>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <NewsletterForm />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("features.title")}
            </h2>

            <div className="space-y-4">
              {["feature1", "feature2", "feature3", "feature4"].map(
                (feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-3 h-3 text-blue-600 dark:text-blue-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t(`features.${feature}`)}
                    </p>
                  </div>
                ),
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("validation.demo")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• {t("validation.name.required")}</li>
                <li>• {t("validation.email.format")}</li>
                <li>• {t("validation.phone.format")}</li>
                <li>• {t("validation.privacy.required")}</li>
              </ul>
            </div>
          </div>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>{t("footer")}</p>
        </footer>
      </div>
    </div>
  );
}
