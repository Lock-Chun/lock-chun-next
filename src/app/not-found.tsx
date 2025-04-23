import Link from 'next/link'
import Navbar from "./components/navbar";
 
export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex-col flex items-center justify-center my-5 gap-5">
        <h2 className="text-6xl font-bold">404 - Not Found</h2>
        <p className="text-4xl">That page doesn&apos;t exist.</p>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-3xl px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          <Link href="/">Return Home</Link>
        </button>
      </div>
    </>
  )
}