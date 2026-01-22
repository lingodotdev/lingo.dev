import { User } from "../types/server";
import type { Request, Response } from "express";
import { db } from "../config/firebase.config";

export const findMatch = async (req: Request, res: Response) => {
    
    try {
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json({ success: false, message: "uid is required" });
        }

        const userRef = db.collection('users').doc(uid);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userData: Partial<User> = {
            id: uid,
            ...userSnap.data()
        }

        const userConnectedEmails = Array.isArray(userData.connectedEmails) ? userData.connectedEmails : [];

        if (userData.connectionId && userData.connectedWith) {
            const matchedUserSnap = await db.collection("users").doc(userData.connectedWith).get();

            return res.status(200).json({
                success: true,
                message: "Already matched",
                data: {
                    matchedUser: matchedUserSnap.exists ? { id: userData.connectedWith, ...matchedUserSnap.data() } : null,
                    connectionId: userData.connectionId
                }
            })
        }

        const onlineUsersSnap = await db.collection("onlineUsers").where("status", "==", "online").get();

        if (onlineUsersSnap.empty) {
            return res.status(404).json({ success: false, message: "No online users available for matching", data: null })
        }

        const userEmotionalScore = userData.emotionalScore;
        if (userEmotionalScore) {
            const availableUsers: Partial<User>[] = onlineUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((user: Partial<User>) => user.id !== uid);
            if (availableUsers.length === 0) {
                return res.status(404).json({ success: false, message: "No available users for matching", data: null });
            }
            
            const upperLimit = userEmotionalScore + 5;
            const lowerLimit = userEmotionalScore - 5;

            const usersWithinEmotionalRange = availableUsers.filter((user) => {
                return (
                    typeof user.emotionalScore === "number" &&
                    user.emotionalScore > lowerLimit &&
                    user.emotionalScore < upperLimit
                );
            })

            let randomUser = usersWithinEmotionalRange[Math.floor(Math.random() * usersWithinEmotionalRange.length)];

            if (!randomUser) {
                randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
                const connectionRef = await db.collection("connections").add({
                users: [uid, randomUser.id],
                createdAt: new Date()
                });
                const connectionId = connectionRef.id;

                await Promise.all([
                    db.collection("users").doc(uid).update({
                        connectionId,
                        connectedWith: randomUser.id,
                        connectedEmails: randomUser.email ? [...userConnectedEmails, String(randomUser.email)] : userConnectedEmails
                    }),
                    db.collection("users").doc(randomUser.id as string).update({
                        connectionId,
                        connectedWith: uid,
                        connectedEmails: userData.email ? [...(Array.isArray(randomUser.connectedEmails) ? randomUser.connectedEmails : []), String(userData.email)] : (Array.isArray(randomUser.connectedEmails) ? randomUser.connectedEmails : [])
                    })
                ])

                await Promise.all([
                    db.collection("onlineUsers").doc(uid).update({ status: "matched" }),
                    db.collection("onlineUsers").doc(randomUser.id as string).update({ status: "matched" })
                ])

                return res.status(200).json({
                    success: true,
                    message: "Match found",
                    data: {
                        matchedUser: randomUser,
                        connectionId
                    }
                })
            } else {
                const connectionRef = await db.collection("connections").add({
                    users: [uid, randomUser.id],
                    createdAt: new Date()
                });

                const connectionId = connectionRef.id;

                await Promise.all([
                    db.collection("users").doc(uid).update({
                        connectionId,
                        connectedWith: randomUser.id,
                        connectedEmails: randomUser.email ? [...userConnectedEmails, String(randomUser.email)] : userConnectedEmails
                    }),
                    db.collection("users").doc(randomUser.id as string).update({
                        connectionId,
                        connectedWith: uid,
                        connectedEmails: userData.email ? [...(Array.isArray(randomUser.connectedEmails) ? randomUser.connectedEmails : []), String(userData.email)] : (Array.isArray(randomUser.connectedEmails) ? randomUser.connectedEmails : [])
                    })
                ])

                await Promise.all([
                    db.collection("onlineUsers").doc(uid).update({ status: "matched" }),
                    db.collection("onlineUsers").doc(randomUser.id as string).update({ status: "matched" })
                ])

                return res.status(200).json({
                    success: true,
                    message: "Match found",
                    data: {
                        matchedUser: randomUser,
                        connectionId
                    }
                })
                }
            } else {
                return res.status(400).json({ success: false, message: "Emotional score required for matching!" });
            }
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}