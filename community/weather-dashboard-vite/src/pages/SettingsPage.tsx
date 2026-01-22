import { useDispatch, useSelector } from "react-redux";
import { toggleUnit } from "../features/settings/settingsSlice";
import type { RootState } from "../app/store";

export default function SettingsPage() {
  const unit = useSelector((s: RootState) => s.settings.unit);
  const dispatch = useDispatch();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Settings</h2>
      <button
        onClick={() => dispatch(toggleUnit())}
        className="mt-4 border p-2 rounded"
      >
        Switch to {unit === "C" ? "F" : "C"}
      </button>
    </div>
  );
}
