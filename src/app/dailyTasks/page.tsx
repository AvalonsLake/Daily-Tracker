"use client";
import { useState, useEffect, ReactNode} from "react"
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

interface Props {
  children: ReactNode;
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
        listItems();
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

    // Hide & Show New task


    // FrontEnd stuff
    return (
        <div className="root-container">
            <div className="day-container">
                <h1 className="header">My Day</h1>
                <button className="showAddNewTask edit-button">Add New Item</button>
                <div className="new-Task">
                    <button className="hideAddNewTask delete-button ml-90 mb-2"> X</button>
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
                            className="input-field mt-2"
                            placeholder="Where will this task take place?"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <textarea
                            className="input-field mt-2"
                            placeholder="Any notes about the Task?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <button onClick={addTask} className="edit-button mt-2">
                            Add Task
                        </button>
                    </div>
                </div>
                <ul className="space-y-3">
                    {items.map((i, index) => (
                    <li
                    key={i.$id || index}
                    className={`flex flex-col p-4 rounded-lg shadow-md ${
                        i.finished 
                        ? "bg-green-100" 
                        : "bg-gray-100"
                    } transition-all ease-in-out duration-200`}
                    >
                    <div className="flex items-center">
                        
                        {editingIndex === index ? (
                        <div className="flex flex-col">
                            <input
                            type="text"
                            className="input-field"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            />
                            <input
                            type="text"
                            className="input-field-location"
                            value={editingLocation}
                            onChange={(e) => setEditingLocation(e.target.value)}
                            />
                            <input
                            type="text"
                            className="input-field-time"
                            value={editingTime}
                            onChange={(e) => setEditingTime(e.target.value)}
                            />
                            <textarea
                            rows={4}
                            className="input-field mt-2"
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            />
                        </div>
                        ) : (
                        <div className="flex flex-col ">
                            <h2
                            className={`text-lg font-semibold ${
                                i.finished
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                            >
                            {i.title}
                            </h2>
                            <p
                            className={`align-self-end font-bold${
                                i.finished
                                ? "line-through text-gray-500"
                                : "text-gray-700"
                            }`}
                            >
                            {i.time}
                            </p>
                            <h2
                            className={`text-lg font-semibold${
                                i.finished
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                            >
                            {i.location}
                            </h2>
                            <p
                            className={` ${
                                i.finished
                                ? "line-through text-gray-500"
                                : "text-gray-700"
                            }`}
                            >
                            {i.notes}
                            </p>
                        </div>
                        )}
                        <label className="ml-auto">Finished</label>
                        {editingIndex !== index && (
                        <input
                            type="checkbox"
                            checked={!!i.finished}
                            onChange={() => setTaskFinished(items[index])}
                            className="mx-2"
                        />
                        )}
                    </div>

                    <div className="flex mt-2">
                        {editingIndex === index ? (
                        <>
                            <button
                            onClick={() => saveTask(i.$id)}
                            className="save-button"
                            >
                            Save
                            </button>
                            <button
                            onClick={stopEditing}
                            className="cancel-button ml-2"
                            >
                            Cancel
                            </button>
                        </>
                        ) : (
                        <>
                            <button
                            onClick={() => startEditing(index)}
                            className="edit-button"
                            >
                            Edit
                            </button>
                            <button
                            onClick={() => removeItem(i.$id)}
                            className="delete-button ml-auto"
                            >
                            X
                            </button>
                        </>
                        )}
                    </div>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    )
}