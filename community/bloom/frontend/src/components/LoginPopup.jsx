import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../services/authService";
import { setUser, toggleLoginScreen } from "../redux/slices/navSlice";

const LoginPopup = () => {

  const dispatch = useDispatch();
  const router = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    const { user } = await signInWithGoogle();

    const myUser = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
    };

    const { success, message } = await createProfile(myUser);

    if (success) {
      dispatch(setUser(myUser));
      dispatch(toggleLoginScreen());
      router("/dashboard");
    }

    alert(message);
  };

  return (
    <div className="fixed inset-0 bg-black/70 grid place-items-center z-50" onClick={() => dispatch(toggleLoginScreen())}>
      
      {/* FORM START */}
      <form
        onSubmit={handleSignin}
        onClick={(e) => e.stopPropagation()}
        className="lg:w-[28vw] bg-white rounded-lg grid place-items-center py-10 px-8"
      >
        
        <div className="text-4xl font-bold text-green-600">Bloom🌱</div>

        <p className="my-3">
          Talk to someone who knows how you feel.
        </p>

        <div className="grid gap-2 mt-4">
          <button
            type="submit"
            className="flex gap-3 justify-center items-center border w-[18rem] py-2 border-gray-200 rounded-lg"
          >
            <FcGoogle className="text-2xl" />
            <span>Connect with Google</span>
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 w-[18rem]">
          <input
            type="checkbox"
            required
            className="mt-1 accent-blue-500"
          />
          <p>
            I certify I have read and agree to the Terms of Service and confirm that I
            am at least 18 years old.
          </p>
        </div>

      </form>
      {/* FORM END */}

    </div>
  );
};

export default LoginPopup;