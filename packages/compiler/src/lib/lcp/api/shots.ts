import { z } from "zod";
import { dictionarySchema } from "../schema";

export default [
  // Shot #1
  [
    {
      version: 0.1,
      locale: "en",
      files: {
        "demo-app/my-custom-header.tsx": {
          entries: {
            "1z2x3c4v": "Dashboard",
            "5t6y7u8i": "Settings",
            "9o0p1q2r": "Logout",
          },
        },
        "demo-app/my-custom-footer.tsx": {
          entries: {
            "9k0l1m2n": "© 2025 Lingo.dev. All rights reserved.",
          },
        },
      },
    },
    {
      version: 0.1,
      locale: "es",
      files: {
        "demo-app/my-custom-header.tsx": {
          entries: {
            "1z2x3c4v": "Panel de control",
            "5t6y7u8i": "Configuración",
            "9o0p1q2r": "Cerrar sesión",
          },
        },
        "demo-app/my-custom-footer.tsx": {
          entries: {
            "9k0l1m2n": "© 2025 Lingo.dev. Todos los derechos reservados.",
          },
        },
      },
    },
  ],
  // More shots here...
] satisfies [
  z.infer<typeof dictionarySchema>,
  z.infer<typeof dictionarySchema>,
][];
