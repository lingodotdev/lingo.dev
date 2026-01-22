interface TranslationPreviewProps {
  translations: Record<string, any>;
}

export default function TranslationPreview({ translations }: TranslationPreviewProps) {
  const downloadTranslation = (locale: string, content: any) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${locale}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Translations Ready</h2>
      <div className="grid gap-4">
        {Object.entries(translations).map(([locale, content]) => (
          <div
            key={locale}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{locale}</h3>
              <button
                onClick={() => downloadTranslation(locale, content)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Download
              </button>
            </div>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto max-h-40">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
