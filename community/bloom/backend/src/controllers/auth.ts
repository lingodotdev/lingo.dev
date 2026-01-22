import { Request, Response } from "express";
import { db } from "../config/firebase.config";
import { User } from "../types/server";

export const logout = async (req: Request, res: Response) => {
    try {
        
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json({ success: false, message: "UID is required" });
        }

        const userRef = db.collection("users").doc(uid);

        try {
            const userSnap = await userRef.get();

            if (!userSnap.exists) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const userData: Partial<User> = {
                id: uid,
                ...userSnap.data()
            }

            if (userData.connectionId) {
                await db.collection("connections").doc(userData.connectionId).delete();
            }

            const result = await userRef.update({
                status: "offline",
                connectedWith: null,
                connectionId: null
            });

            console.log("User status updated to offline:", result);

            const onlineUsersCollection = db.collection("onlineUsers").doc(uid);
            await onlineUsersCollection.delete();

        } catch (error) {
            console.log("Users not found in online users list");
        }

        const connRef = db.collection("connections").where("userIds", "array-contains", uid);
        const connSnapshot = await connRef.get();

        if (!connSnapshot.empty) {
            const connDoc = connSnapshot.docs[0];
            await connDoc.ref.delete();
        }

        return res.status(200).json({ success: true, message: "User logged out successfully!" });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}