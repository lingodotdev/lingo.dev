import admin from "firebase-admin";
import serviceAccount from "./serviceAccKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export const db = admin.firestore();
export const auth = admin.auth();