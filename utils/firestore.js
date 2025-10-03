import {db} from "@/utils/firebase";
import {addDoc, collection, getDocs, doc, updateDoc, query, where, getDoc, deleteDoc } from "firebase/firestore";

/**
 * Get assignments by teacher, optionally filtered by date.
 *
 * @param {string} teacherId - The teacher's ID.
 * @param {Object} options - Extra filters.
 * @param {string|Date} [options.date] - A date string or Date object to compare against.
 * @param {"before"|"after"} [options.direction] - Whether to fetch assignments before or after the date.
 */
export async function getAssignments(teacherId, { date, direction } = {}) {
    try {
        const q = query(
            collection(db, "assignments"),
            where("teacherId", "==", teacherId)
        );

        const snapshot = await getDocs(q);

        let assignments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (date && direction) {
            const compareDate = date instanceof Date ? date : new Date(date);
            assignments = assignments.filter((a) =>
                direction === "before"
                    ? new Date(a.dueDate) < compareDate
                    : new Date(a.dueDate) > compareDate
            );
        }

        return assignments.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return [];
    }
}

export async function getAssignment(id) {
    try {
        const docRef = doc(db, "assignments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            };
        }
        console.log("No such assignment!");
        return null;
    } catch (error) {
        console.error("Error fetching assignment:", error);
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

export async function deleteAssignment(id) {
    try {
        const ref = doc(db, "assignments", id);
        await deleteDoc(ref);
        console.log('✅ Deleted assignment with ID: ', id);
        return true;
    } catch (err) {
        console.error("Error deleting assignment:", err);
        return false;
    }
}

export async function createSubmission(data) {
    console.log(data);
    try {
        await addDoc(collection(db, "submissions"), {
            ...data,
        });
        console.log("Submission created successfully ✅");
    } catch (err) {
        console.error("Error creating submission:", err);
        throw err;
    }
}

export async function getSubmissions(id) {
    try {
        const docRef = doc(db, "submissions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            };
        }
        console.log("No such submission!");
        return null;
    } catch (error) {
        console.error("Error fetching submission:", error);
        return null;
    }
}

export async function getSubmissionsByAssignment(assignmentId) {
    try {
        const q = query(
            collection(db, "submissions"),
            where("assignmentId", "==", assignmentId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }
}

export async function getSubmission(id) {
    try {
        const docRef = doc(db, "submissions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            };
        }
        console.log("No such submission!");
        return null;
    } catch (error) {
        console.error("Error fetching submission:", error);
        return null;
    }
}

export async function deleteSubmission(id) {
    try {
        const ref = doc(db, "submissions", id);
        await deleteDoc(ref);
        console.log('Deleted submission with ID: ', id);
    } catch (err) {
        console.error("Error deleting submission:", err);
    }
}