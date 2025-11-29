/**
 * Firestore utility helpers for assignments, submissions, users and notifications.
 *
 * All functions expect a configured Firestore `db` exported from `utils/firebase`.
 *
 * Note: Date values are stored/retrieved as JavaScript `Date` objects where appropriate.
 */

import {db} from "@/utils/firebase";
import {addDoc, collection, getDocs, doc, updateDoc, query, where, getDoc, deleteDoc } from "firebase/firestore";

/**
 * Get assignments by teacher, optionally filtered by date.
 *
 * @param {string} teacherId - The teacher's ID.
 * @param {Object} [options] - Extra filters.
 * @param {string|Date} [options.date] - A date string or Date object to compare against.
 * @param {"before"|"after"} [options.direction] - Whether to fetch assignments before or after the date.
 * @returns {Promise<Array<Object>>} - Sorted list of assignment objects.
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
        throw error;
    }
}

/**
 * Fetch a single assignment by ID.
 *
 * @param {string} id - Assignment document ID.
 * @returns {Promise<Object|null>} - Assignment object or null if not found.
 */
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
        throw error;
    }
}

/**
 * Create a new assignment.
 *
 * @param {Object} params
 * @param {string} params.userId - Teacher's user ID (stored as teacherId).
 * @param {string} params.courseName
 * @param {string} params.title
 * @param {string} params.description
 * @param {string|Date} params.dueDate
 * @param {Array} [params.deliverables]
 * @returns {Promise<void>}
 */
export async function createAssignment({ userId, courseName, title, description, dueDate, deliverables, rubric }) {
    try {
        await addDoc(collection(db, "assignments"), {
            teacherId: userId,
            courseName,
            title,
            description,
            dueDate,
            rubric: rubric || [],
            deliverables: deliverables || [],
            createdAt: new Date(),
        });
        console.log("Recording saved to Firebase ✅");
    } catch (err) {
        console.error("Error saving to Firebase:", err);
        throw err;
    }
}

/**
 * Update an assignment document.
 *
 * @param {string} id - Assignment ID.
 * @param {Object} updates - Partial fields to update.
 * @returns {Promise<void>}
 */
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
        throw err;
    }
}

/**
 * Delete an assignment by ID.
 *
 * @param {string} id - Assignment ID.
 * @returns {Promise<boolean>} - True if deletion succeeded.
 */
export async function deleteAssignment(id) {
    try {
        const ref = doc(db, "assignments", id);
        await deleteDoc(ref);
        console.log('✅ Deleted assignment with ID: ', id);
        return true;
    } catch (error) {
        console.error("Error deleting assignment:", error);
        throw error;
    }
}

/**
 * Create a submission and optionally create a notification for a recipient.
 *
 * @param {Object} data - Submission payload to store in `submissions` collection.
 * @param {string} [notificationRecipient] - Recipient user ID for a notification (usually the teacher).
 * @returns {Promise<void>}
 */
export async function createSubmission(data, notificationRecipient) {
    try {
        await addDoc(collection(db, "submissions"), {
            ...data,
        });
        console.log("Submission created successfully ✅");
        if (notificationRecipient) {
            // Then create a notification for the teacher
            await addDoc(collection(db, "notifications"), {
                recipientId: notificationRecipient,
                type: "submission",
                message: `A ${data.studentName} submitted an assignment.`,
                link: `/assignments`,
                createdAt: new Date(),
                read: false,
            });
            console.log("Teacher notified of submission ✅");
        }
    } catch (error) {
        console.error("Error creating submission:", error);
        throw error;
    }
}

/**
 * Fetch a submission by its document ID.
 *
 * @param {string} id - Submission document ID.
 * @returns {Promise<Object|null>} - Submission object or null if not found.
 */
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
        throw error;
    }
}

/**
 * Get all submissions for a given assignment.
 *
 * @param {string} assignmentId - Assignment ID to query submissions for.
 * @returns {Promise<Array<Object>>} - Array of submission objects.
 */
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
        throw error;
    }
}

/**
 * Fetch a submission by its ID (alternate helper).
 *
 * @param {string} id - Submission ID.
 * @returns {Promise<Object|null>} - Submission or null.
 */
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
        throw error;
    }
}

/**
 * Delete a submission by ID.
 *
 * @param {string} id - Submission document ID.
 * @returns {Promise<void>}
 */
export async function deleteSubmission(id) {
    try {
        const ref = doc(db, "submissions", id);
        await deleteDoc(ref);
        console.log('Deleted submission with ID: ', id);
    } catch (err) {
        console.error("Error deleting submission:", err);
        throw err;
    }
}

/**
 * Update a submission document.
 *
 * @param {string} id - Submission ID.
 * @param {Object} updates - Partial fields to update.
 * @returns {Promise<void>}
 */
export async function updateSubmission(id, updates) {
    try {
        const ref = doc(db, "submissions", id);
        await updateDoc(ref, {
            ...updates,
            updatedAt: new Date(),
        });
        console.log(`Submission ${id} updated ✅`);
    } catch (err) {
        console.error("Error updating submission:", err);
        throw err;
    }
}

/**
 * Create a user document in `users` collection.
 *
 * @param {Object} params
 * @param {string} params.uuid
 * @param {string} params.name
 * @param {string} params.email
 * @returns {Promise<void>}
 */
export async function createUser({uuid, name, email}) {
    try {
        await addDoc(collection(db, "users"), {
            uuid,
            name,
            email,
            createdAt: new Date(),
        });
        console.log("User created successfully ✅");
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

/**
 * Update a notification document.
 *
 * @param {string} id - Notification document ID.
 * @param {Object} updates - Partial fields to update.
 * @returns {Promise<void>}
 */
export async function updateNotification(id, updates) {
    try {
        const ref = doc(db, "notifications", id);
        await updateDoc(ref, {
            ...updates,
            updatedAt: new Date(), // optional timestamp
        });
        console.log(`Notification ${id} updated ✅`);
    } catch (error) {
        console.error("Error updating notification:", error);
        throw error;
    }
}