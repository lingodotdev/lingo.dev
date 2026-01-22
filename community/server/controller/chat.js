import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { sendMessageSchemaValidation } from "../validations/index.js";
import GroupChat from "../models/GroupChat.js";

export const getAllUsers = async (req, res) => {
    const id = req.query.id;
    if (id === 'undefined' || !id) return res.status(400).json({ success: false, message: 'id is required' })
    try {
        const getUsers = await User.find({ _id: { $ne: id } });
        return res.status(200).json({ data: getUsers, success: true });
    } catch (error) {
        console.log("🚀 ~ file: chat.js:13 ~ getAllUsers ~ error:", error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const getAllGroups = async (req, res) => {
    const id = req.query.id;
    if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'id is required' })
    const query = {
        $or: [
            { createdBy: id },
            { users: id }
        ]
    };

    try {
        const getGroupofThisUser = await GroupChat.find(query).populate('users').select('-password').populate('createdBy');
        return res.status(200).json({ data: getGroupofThisUser, success: true });
    } catch (error) {
        console.log("🚀 ~ file: chat.js:32 ~ getAllGroups ~ error:", error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}


export const createGroup = async (req, res) => {
    const { name, users, createdBy } = req.body;


    if (!name || !users || !createdBy) return res.status(400).json({ success: false, message: 'name , users and createdBy are required' })

    try {
        const newGroup = new GroupChat({ name, users, createdBy });
        await newGroup.save();
        return res.status(200).json({ success: true, message: 'Group created successfully' })
    } catch (error) {
        console.log("🚀 ~ file: chat.js:49 ~ createGroup ~ error:", error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })

    }
}


export const getChat = async (req, res) => {
    const { senderId, receiverId } = req.query;
    if (!senderId || !receiverId) return res.status(400).json({ success: false, message: 'senderId and receiverId are required' })
    try {
        const getChat = await Chat.find({
            $or: [
                { $and: [{ sender: senderId }, { receiver: receiverId }] },
                { $and: [{ sender: receiverId }, { receiver: senderId }] }
            ]
        })
        return res.status(200).json({ data: getChat, success: true });
    } catch (error) {
        console.log("🚀 ~ file: chat.js:68 ~ getChat ~ error:", error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }

}




export const getGroupChat = async (req, res) => {
    const { senderId, receiverId, groupId } = req.query;
    try {
        const groups = await GroupChat.find({ _id: groupId });

        const allMessages = await Chat.find({ receiver: receiverId });

        const senderDeletedMessagesEntry = groups.reduce((result, group) => {
            const deletedMessageEntry = group.deletedMessage.find(
                (entry) => entry.userID.toString() === senderId
            );
            if (deletedMessageEntry) {
                result.push(...deletedMessageEntry.deletedMessageofThisUser?.map((msg) => msg?.toString()));
            }
            return result;
        }, []);
        const filteredChat = allMessages.map((message) => {
            if (senderDeletedMessagesEntry.includes(message?._id?.toString())) {
                return null;
            } else {
                return message?.toObject();
            }
        }).filter((message) => message !== null); 

        return res.status(200).json({ data: filteredChat, success: true });
    } catch (error) {
        console.error('Error fetching group chat:', error);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};





export const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    const { error } = sendMessageSchemaValidation.validate({ senderId, receiverId, message });

    if (error) return res.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const newMessage = new Chat({ sender: senderId, receiver: receiverId, message });
        await newMessage.save();
        return res.status(200).json({ success: true, message: 'Message sent successfully' })
    } catch (error) {
        console.log("🚀 ~ file: chat.js:102 ~ sendMessage ~ error:", error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const sendGroupMessage = async (req, res) => {
    const { senderId, receiverId, message, groupID } = req.body;
    const { error } = sendMessageSchemaValidation.validate({ senderId, receiverId, message });

    if (error) return res.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const newMessage = new Chat({ sender: senderId, receiver: receiverId, message });
        await newMessage.save();

        if (newMessage) {
            const saveInGroup = await GroupChat.findOneAndUpdate({ _id: groupID }, { $push: { messages: newMessage._id } }, { new: true });
            return res.status(200).json({ success: true, message: 'Message sent successfully' })
        }


    } catch (error) {
        console.log("🚀 ~ file: chat.js:124 ~ sendGroupMessage ~ error:", error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}



export const deleteGroup = async (req, res) => {
    const { groupId, ownerId } = req.query

    if (!groupId || !ownerId) return res.status(400).json({ success: false, message: 'groupId and ownerId are required' })

    try {
        const getGroup = await GroupChat.findOne({ _id: groupId });
        if (getGroup?.createdBy?.toString() === ownerId) {
            const deletedGroup = await GroupChat.findByIdAndDelete(groupId);
            if (deletedGroup) {
                const query = {
                    $or: [
                        { createdBy: ownerId },
                        { users: ownerId }
                    ]
                };
                const getGroupofThisUser = await GroupChat.find(query).populate('users').select('-password').populate('createdBy');
                return res.status(200).json({ data: getGroupofThisUser, success: true, message: 'Group deleted successfully' })
            }

        } else {
            return res.status(400).json({ success: false, message: 'You are not allowed to delete this group' })
        }
    } catch (error) {
        console.log("🚀 ~ file: chat.js:138 ~ deleteGroup ~ error:", error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }


}


export const deleteMessageFromMe = async (req, res) => {
    const data = req.body
    const { groupId, deletedMessageofThisUser, userID } = data;
    try {
        const group = await GroupChat.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        group.messages = group.messages.filter(
            (message) => !deletedMessageofThisUser.includes(message.toString())
        );

        const deletedMessageIndex = group.deletedMessage.findIndex(
            (entry) => entry.userID.toString() === userID
        );
        if (deletedMessageIndex !== -1) {
            group.deletedMessage[deletedMessageIndex].deletedMessageofThisUser = [
                ...new Set([
                    ...group.deletedMessage[deletedMessageIndex].deletedMessageofThisUser,
                    ...deletedMessageofThisUser,
                ]),
            ];
        } else {
            group.deletedMessage.push({
                userID,
                deletedMessageofThisUser,
            });
        }

        await group.save();

        return res
            .status(200)
            .json({ success: true, message: 'Selected messages deleted successfully' });
    } catch (error) {
        console.error('Error deleting messages:', error);
        return res.status(500).json({ error: 'Failed to delete messages' });
    }
}