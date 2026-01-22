import endpoints from "../config/endpoint";
import { getReq, postReq } from "../utils/api";
import {auth} from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const handleLogout = async (uid) => {
  try {
    const response = await postReq(
      `${endpoints["logout"]}/${uid}`,
      {}
    );

    const data = await response.json();

    return {
      success: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};


export const findMatch = async (uid) => {
  try {
    const response = await getReq(
      `${endpoints["find-match"]}/${uid}`
    );

    const data = await response.json();

    return {
      success: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};

export const createProfile = async (profileData) => {
  try {
    const response = await postReq(
      endpoints["create-profile"],
      profileData
    );

    const data = await response.json();

    return {
      success: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};


export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const credential = GoogleAuthProvider.credentialFromResult(result);

    const token = credential?.accessToken;
    const user = result.user;

    return {
      user,
      token,
    };
  } catch (error) {
    console.error("Error during Google Sign-In:", error.message);

    const credential = GoogleAuthProvider.credentialFromError(error);
    return {error, credential};
  }
}
