import {db} from "@/utils/firebase";
import {addDoc, collection, getDocs, doc, updateDoc } from "firebase/firestore";

export async function getAssignments() {
    try {
        const snapshot = await getDocs(collection(db, "assignments"));
        return snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } catch (error) {
        console.error("Error fetching assignments:", error);
    }
}

export async function createAssignment({ userId, courseName, title, description, dueDate }) {
    try {
        await addDoc(collection(db, "assignments"), {
            teacherId: userId,
            courseName,
            title,
            description,
            dueDate,
            rubric: {},
            deliverables: [],
            createdAt: new Date(),
        });
        console.log("Recording saved to Firebase ✅");
    } catch (err) {
        console.error("Error saving to Firebase:", err);
    }
}

export async function updateAssignment(id, updates) {
    try {
        const ref = doc(db, "assignments", id);
        await updateDoc(ref, {
            ...updates,
            updatedAt: new Date(), // optional timestamp
        });
        console.log(`Assignment ${id} updated ✅`);
    } catch (err) {
        console.error("Error updating assignment:", err);
    }
}

