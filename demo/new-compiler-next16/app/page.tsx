import { Counter } from "@/components/Counter";
import { LocaleSwitcher } from "@lingo.dev/compiler/react";
import Link from "next/link";
import { ServerChild } from "@/components/ServerChild";
import { ClientChildWrapper } from "@/components/ClientChildWrapper";

const externalText = <>External text</>;

export default function Home() {
  const text = "Hello World";
  const translatableText = <>Hello World</>;
  const translatableMixedContextFragment = (
    <>
      <b>Mixed</b> content <i>fragment</i>
    </>
  );

  const something = { cool: "cool", translatedCool: <>translated cool</> };

  return (
    <main className="flex w-full min-h-screen flex-col items-center bg-white dark:bg-black sm:items-start">
      <header className="flex justify-between p-10 w-full">
        <span>Lingo.dev compiler Next demo</span>
        <nav>
          <Link href="/test">Test</Link> 1
        </nav>
        <LocaleSwitcher
          locales={[
            { code: "en", label: "English" },
            { code: "es", label: "Spanish" },
            { code: "de", label: "Deutsch" },
            { code: "ru", label: "Русский" },
          ]}
          className="locale-switcher"
        />
      </header>
      <div className="flex w-full grow flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Lingo.dev compiler demo
        </h1>
        <p className="mb-8">
          It automatically extract text from your JSX and translate it to other
          languages. <br />
          It supports both server and client components.
        </p>
        <div className="my-2">
          <Counter />
        </div>
        <div className="my-2">
          <ClientChildWrapper>
            <ServerChild />
          </ClientChildWrapper>
        </div>
        <div data-lingo-override={{ ru: "Секретная информация" }}>
          Use data-lingo-override to override translations
        </div>
        <div>
          Text inserted as an <code>{"{expression}"}</code> is not translated:{" "}
          {text}
        </div>
        <div>
          To translate it you have to wrap it into the {"<>"}
          {translatableText}
          {"</>"}
        </div>
        <div>
          <div>
            What happens if I use a property {something.cool} and{" "}
            {something.translatedCool}
          </div>
          <div>
            Text external to the component is not translated: {externalText}
          </div>
          <div>
            Content that has text and other tags inside will br translated as a
            single entity: {translatableMixedContextFragment}
          </div>
        </div>
      </div>
    </main>
  );
}
