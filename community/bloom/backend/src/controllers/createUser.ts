import type { Request, Response } from "express";
import { db } from "../config/firebase.config";
import { ServerResponse } from "../types/server";

export const createUser = async (req: Request, res: Response) => {
    const { displayName, email, uid } = req.body;

    if (!displayName || !email || !uid) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        
        const userRef = db.collection("users").doc(uid);
        const onlineUserRef = db.collection("onlineUsers").doc(uid);

        const docSnap = await userRef.get();

        let response: ServerResponse = {
            success: true,
            message: "",
            data: null
        }

        if (docSnap.exists) {
            await db.collection("users").doc(uid).update({
                status: "online",
                lastLogin: new Date()
            })

            response.message = "User logged in sucessfully"
        } else {
            await db.collection("users").doc(uid).set({
                displayName,
                email,
                id: uid,
                status: "online",
                createdAt: new Date(),
                lastLogin: new Date(),
                connectedWith: null,
                connectedEmails: [],
                emotionalScore: 0
            })

            response.message = "User profile created successfully"
        }


        await onlineUserRef.set({
            uid,
            displayName,
            email,
            status: "online",
            lastLogin: new Date()
        })

        response.data = {
            uid,
            displayName,
            email
        }

        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}