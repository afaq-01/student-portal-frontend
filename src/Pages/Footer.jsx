export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white py-4 mt-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-md">
          &copy; {new Date().getFullYear()} Department of Computer Science. All rights reserved.
        </p>
        <p className="text-md mt-2 md:mt-0">
        Designed by : Afaq Ahmad Khan
        </p>
      </div>
    </footer>
  );
}
