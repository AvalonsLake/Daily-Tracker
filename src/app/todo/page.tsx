"use client";
import {useState, useEffect} from "react"
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
        setTasks((prev) => [newTask, ...prev]);
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
                            placeholder="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="input-field mt-2"
                            placeholder="Task Times"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                        <textarea
                            className="input-field mt-3"
                            placeholder="Task Details"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <textarea
                            className="input-field mt-4"
                            placeholder="Task Details"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <button onClick={addTask} className="edit-button mt-2"></button>
                    </div>
                </div>
                <ul className="space-y-3">
                    {tasks.map((t, index) => (
            <li
              key={t.$id || index}
              className={`flex flex-col p-4 rounded-lg shadow-md ${
                t.completed ? "bg-green-100" : "bg-gray-100"
              } transition-all ease-in-out duration-200`}
            >
              <div className="flex items-center">
                {editingIndex !== index && (
                  <input
                    type="checkbox"
                    checked={!!t.completed}
                    onChange={() => toggleTaskCompletion(tasks[index])}
                    className="mr-2"
                  />
                )}
                {editingIndex === index ? (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      className="input-field"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <textarea
                      rows={4}
                      className="input-field mt-2"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        t.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {t.title}
                    </h2>
                    <p
                      className={`${
                        t.completed
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {t.content}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex mt-2">
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={() => saveTask(t.$id)}
                      className="save-button"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
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
                      onClick={() => removeTask(t.$id)}
                      className="delete-button ml-2"
                    >
                      Delete
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