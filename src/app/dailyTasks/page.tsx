"use client";
import { useState, useEffect } from "react"
import { createItem, listItems, updateItem, deleteItem } from "../functions"

interface Item {
    $id: string;
    title: string;
    time: string;
    location: string;
    notes: string;
    all_day: boolean;
    finished: boolean;
}

export default function Home() {

    const [title, setTitle] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [items, setItems] = useState<Item[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState<string>("");
    const [editingTime, setEditingTime] = useState<string>("");
    const [editingLocation, setEditingLocation] = useState<string>("");
    const [editingNotes, setEditingNotes] = useState<string>("");

    // Load Tasks and items
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    {loading && <p>Loading tasks from Appwrite cloud...</p>}
    {error && <p className="text-red-600">{error}</p>}

    useEffect(() => {
        listItems()
            .then(setItems)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, []);

    // Add an item
    const addTask = async () => {
        if (title.trim() === "" || time.trim() === "" || location.trim() === "" || notes.trim() === "") return;
        const newTask =  await createItem(title.trim(), time.trim(), location.trim(), notes.trim());
        setItems((prev) => [newTask, ...prev]);
        setTitle("");
        setTime("");
        setLocation("");
        setNotes("");
    }

    // Set all day
    const setAllDay = async (item: Item) => {
        const updated = await updateItem(item.$id, { all_day: !item.all_day });
        setItems((prev) => prev.map((i) => (i.$id === updated.$id ? updated : i)));
    }

    // Set Finished
    const setTaskFinished = async (item: Item) => {
        const updated = await updateItem(item.$id, { finished: !item.finished });
        setItems((prev) => prev.map((i) => (i.$id === updated.$id ? updated : i)));
    }

    // Delete a Task
    const removeItem = async (documentId: string) => {
        await deleteItem(documentId);
        setItems((prev) => prev.filter((i) => i.$id !== documentId));
    }

    // Save edits to tasks
    const saveTask = async (documentId: string) => {
        const updated = await updateItem(documentId, {
            title: editingTitle.trim(),
            time: editingTime.trim(),
            location: editingLocation.trim(),
            notes: editingNotes.trim()
        })
    }

    const startEditing = (index: number): void => {
        setEditingIndex(index)
        setEditingTitle(items[index].title || "")
        setEditingTime(items[index].time || "")
        setEditingLocation(items[index].location || "")
        setEditingNotes(items[index].notes || "")
    }

    const stopEditing = (): void => {
        setEditingIndex(null)
    }

    // FrontEnd stuff
    return (
        <div className="root-container">
            <div className="day-container">
                <h1 className="header">My Day</h1>
                <button></button>
                <div className="new-Task">
                    <div className="flex flex-col mb-6">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="What is the title of your task?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="input-field mt-2"
                            placeholder="From when to when is the task?"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                        <textarea
                            className="input-field mt-3"
                            placeholder="Where will this task take place?"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <textarea
                            className="input-field mt-4"
                            placeholder="Any notes about the Task?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <button onClick={addTask} className="edit-button mt-2">
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}