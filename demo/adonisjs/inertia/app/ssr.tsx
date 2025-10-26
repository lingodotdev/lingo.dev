import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { LingoProviderWrapper, loadDictionary } from 'lingo.dev/react/client'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      return pages[`../pages/${name}.tsx`]
    },
    setup: ({ App, props }) => (
      <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
        <App {...props} />
      </LingoProviderWrapper>
    ),
  })
}
