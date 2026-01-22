// Login form take following values
export type LoginFormValues = {
    password: string;
    email: string;
};

// Register form take following values
export type RegisterFormValues = {
    name: string;
    phone: string;
    password: string;
    email: string;
};

// A user state is an object with the following properties
export interface userState {
    themeLight: string;
    token: string;
    user: userData | null;
}


// user Data contain the data that a user object can have
export interface userData {
    email: string;
    name: string;
    phone: string;
    online : boolean;
    _id: string;
    users: userData[];
    createdBy: userData;
    messages: message[];

}

// group Data contain the data that a group object can have
export interface groupData {
    email: string;
    online  :boolean
    phone: string;
    _id: string;
    name: string;
    users: userData[];
    createdBy: userData;
    messages: message[];
}


// A chat state is an object with the following properties
export interface chatState {
    groupMessages: Record<string, groupMessges>;
    userOnline: boolean;
    typing: boolean;
    someOneTyping : boolean;
    typerID: {
        senderId: string;
        receiverId: string;
    } | null;
    chatSelected: string;
    userMessageLoading: boolean;
    allUsers: userData[];
    receiverSelected: receiverSelected | null;
    messages: message[];
    searchUsers: userData[];
    allGroups: groupData[];
    groupSelected: groupData | null;
}


// A chat action is an object with the following properties
export interface groupMessges {
    groupId: string;
    messages: message[];
}


// when you select any user to chat with this will take the following values of that user
export interface receiverSelected {
    email: string;
    name: string;
    _id: string;
}





export interface message {
    _id: string;
    sender: string;
    receiver: string;
    message: string;
}