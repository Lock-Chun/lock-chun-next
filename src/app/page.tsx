import Navbar from "./components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <div className="flex flex-col md:flex-row items-center justify-center gap-40 mt-20 mx-10">
          <div className="flex-col flex gap-0">
            <h2 className="text-6xl md:text-7xl font-bold">Lock Chun</h2>
            <p className="text-3xl md:text-4xl my-3 font-semibold italic">Santa Clara, CA</p>
            <hr className="outline-1" />

            <p className="text-xl mt-8">Phone Number: (408) 249-2784</p>

            <p className="text-xl mt-8">Address: 4495 Stevens Creek Blvd, Santa Clara, CA 95051</p>

            <p className="text-3xl mt-8 font-bold underline">Hours</p>

            <div className="text-lg mt-3 flex gap-10">
              <div className="flex flex-col">
                <p>
                  Mon<br />
                  Tues - Thurs<br />
                  Fri - Sat<br />
                  Sun
                </p>
              </div>

              <div className="flex flex-col">
                <p>
                  <span className="text-red-500">CLOSED</span><br />
                  11:30 AM - 8:30 PM<br />
                  11:30 AM - 9:00 PM<br />
                  2:00 PM - 8:30 PM
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-4xl">[[Image Placeholder]]</p>
          </div>
        </div>
      </main>
    </>
  );
}
