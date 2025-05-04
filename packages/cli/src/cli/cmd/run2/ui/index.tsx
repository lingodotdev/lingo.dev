import { StageProvider } from "./context.stage";
import App from "./app";
import { Newline } from "ink";

export default function Ui() {
  return (
    <StageProvider>
      <Newline />
      <App />
      <Newline />
    </StageProvider>
  );
}
