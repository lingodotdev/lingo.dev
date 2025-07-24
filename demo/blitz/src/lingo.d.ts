declare module "lingo.dev/react/rsc" {
  import { ReactNode } from "react"

  export function loadDictionary(locale: string): Promise<any>

  export function LingoProvider(props: {
    children: ReactNode
    loadDictionary: (locale: string) => Promise<any>
  }): JSX.Element
}
