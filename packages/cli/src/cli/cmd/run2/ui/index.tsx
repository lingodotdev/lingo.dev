import { StageProvider } from "./context.stage";
import App from "./app";

export default function Ui() {
  return (
    <StageProvider>
      <App />
    </StageProvider>
  );
}
