interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileUpload({ file, onFileChange }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-gray-600">
            {file ? (
              <span className="font-medium text-indigo-600">{file.name}</span>
            ) : (
              <>
                <span className="font-medium text-indigo-600">Upload a file</span>
                <span className="text-gray-500"> or drag and drop</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500">JSON files only</p>
        </div>
      </label>
    </div>
  );
}
