import Link from "next/link";

export default function Nav() {
    return <nav className="bg-black text-white p-4 ">
        <ul className="flex gap-4">
            <li>
                <Link href="/">Home</Link>
            </li>
            <li>
                <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
                <Link href="/assignments">Assignments</Link>
            </li>
        </ul>
    </nav>
}