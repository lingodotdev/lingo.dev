import { useDispatch, useSelector } from "react-redux";
import { toggleUnit } from "../../features/settings/settingsSlice";
import type { RootState } from "../../app/store";

export default function UnitToggle() {
  const unit = useSelector((s: RootState) => s.settings.unit);
  const dispatch = useDispatch();

  return <button onClick={() => dispatch(toggleUnit())}>Unit: {unit}</button>;
}
