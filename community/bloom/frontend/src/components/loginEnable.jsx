import { useSelector } from "react-redux";
import LoginPopup from "./LoginPopup";

const LoginEnable = () => {
  const isLoginClicked = useSelector((state) => state.nav.loginScreen);

  return <>{isLoginClicked && <LoginPopup />}</>;
};

export default LoginEnable;
