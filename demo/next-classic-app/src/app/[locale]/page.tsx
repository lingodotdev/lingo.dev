'use server';

import loadIntl from "@/i18n/server";
import Counter from "./counter";

// Example of a server component
export default async function Page(props: any) {
  const i18n = await loadIntl(props.params.locale);

  return (
    <div>
      <h1>{i18n.formatMessage({id: 'home.title'})}</h1>
      <Counter />
    </div>
  );
}
