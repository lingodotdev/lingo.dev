"use i18n";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

const externalText = <>External text</>;

function Button() {
  const [counter, setCounter] = useState(0);

  return (
    <button
      onClick={() => setCounter((old) => old + 1)}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
    >
      Clicked {counter} times
    </button>
  );
}

function App() {
  const text = "Hello World";
  const translatableText = <>Hello World</>;
  const translatableMixedContextFragment = (
    <>
      <b>Mixed</b> content <i>fragment</i>
    </>
  );

  return (
    <main className="flex grow w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start text-gray-100">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Lingo.dev compiler demo
      </h1>
      <p className="mb-8">
        It automatically extract text from your JSX and translate it to other
        languages.
      </p>
      <Button />
      <div>
        Text inserted as an <code>{"{expression}"}</code> is not translated:{" "}
        {text}
      </div>
      <div>
        To translate it you have to wrap it into the &lt;&gt;{translatableText}
        &lt;/&gt;
      </div>
      <div>
        Text external to the component is not translated: {externalText}
      </div>
      <div>
        Content that has text and other tags inside will br translated as a
        single entity: {translatableMixedContextFragment}
      </div>
    </main>
  );
}
