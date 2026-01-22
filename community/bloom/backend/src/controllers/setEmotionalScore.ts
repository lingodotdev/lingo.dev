import type { Request, Response } from "express";
import { db } from "../config/firebase.config";

export const setEmotionalScore = async (req: Request, res: Response) => {
    const { uid, emotionalScore, emotionalTag }: { uid: string; emotionalScore: number, emotionalTag: "Calm" | "Balanced" | "Stressed" } = req.body;

    if (!uid || emotionalScore === undefined || !emotionalTag) {
        return res.status(400).json({ success: false, message: "Required uid and emotional score and emotional tag" });
    }

    try {
        const userSnap = db.collection("users").doc(uid);
        if (!userSnap) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await userSnap.update({
            emotionalScore: emotionalScore,
            emotionalLevel: emotionalTag
        });

        return res.status(200).json({ success: true, message: "Score set successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}