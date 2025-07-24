import { LocaleSwitcher } from "lingo.dev/react/client";
import "./App.css";

function App() {
  return (
    <div>
      <h1>Hello, world!</h1>
      <p>
        This is an example app that demonstrates how{" "}
        <strong className="text-gray-900">Lingo.dev Compiler</strong> can be{" "}
        used to localize apps built with <a href="https://vite.dev/">Vite</a>.
      </p>
      <p>To switch between locales, use the following dropdown:</p>
      <div>
        <LocaleSwitcher locales={["en", "es"]} />
      </div>
    </div>
  );
}

export default App;
