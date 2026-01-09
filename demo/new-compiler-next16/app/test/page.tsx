export default function CompilerTestPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Compiler-Beta Test Page
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            This page demonstrates automatic translation transformation
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The compiler-beta loader automatically transforms JSX text into
            translation calls.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Each piece of text is assigned a unique hash based on the content,
            component name, and file path.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Check the developer console to see the transformed code!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <FeatureCard
            title="Automatic Detection"
            description="No manual tagging required"
          />
          <FeatureCard
            title="Hash-Based System"
            description="Unique identifiers for each text"
          />
          <FeatureCard
            title="Metadata Tracking"
            description="All translations saved to metadata.json"
          />
          <FeatureCard
            title="Turbopack Compatible"
            description="Works seamlessly with Next.js 16"
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-2">
            Before Transformation
          </h3>
          <pre className="text-green-400 text-sm overflow-x-auto">
            {`<h1>Welcome to our site</h1>`}
          </pre>
          <h3 className="text-white text-lg font-semibold mt-4 mb-2">
            After Transformation
          </h3>
          <pre className="text-green-400 text-sm overflow-x-auto">
            {`<h1>{t("a1b2c3d4e5f6")}</h1>`}
          </pre>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Development Status
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            The compiler-beta is currently transforming this page.
          </p>
          <p className="text-blue-800 dark:text-blue-200 mt-2">
            Look for the .lingo directory in the project root after building.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
