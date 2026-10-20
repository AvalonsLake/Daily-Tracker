"use client";
import {useState, useEffect} from "react"
import { createItem, listItems, updateItem, deleteItem } from "../functions"

interface Item {
    $id: string;
    title: string;
    time: string;
    location: string;
    all_day: boolean;
    finished: boolean;
}

export default function Home() {

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [items, setItems] = useState<Item[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState<string>("");
    const [editingContent, setEditingContent] = useState<string>("");

    // FrontEnd stuff
    return (
        <div>
            Hello World!
        </div>
    )
}