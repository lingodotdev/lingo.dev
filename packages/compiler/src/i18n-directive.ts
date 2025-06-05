import { createCodeMutation } from "./_base";
import { hasI18nDirective } from "./utils";

const i18nDirectiveMutation = createCodeMutation((payload) => {
  if (!payload.params.useDirective || hasI18nDirective(payload.ast)) {
    return payload;
  } else {
    return null;
  }
});

export default i18nDirectiveMutation;
