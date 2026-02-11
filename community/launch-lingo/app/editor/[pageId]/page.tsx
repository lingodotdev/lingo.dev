"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function EditorPage() {
    const { pageId } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">
                Editing: {pageId}
            </h1>

            <input
                className="border p-2 w-full mb-4"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className="border p-2 w-full mb-4"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button className="bg-black text-white px-4 py-2">
                Save (we connect later)
            </button>
        </div>
    );
}
