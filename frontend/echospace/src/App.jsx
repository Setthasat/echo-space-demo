import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Body from "./components/Body";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Hero />
      <Body />
      <footer className="w-full mt-auto py-8 px-4 bg-white border-t border-gray-200 text-center text-gray-500 text-sm">
        <div className="mt-2">© 2024 Echo Spaces. A safe space for every student.</div>
      </footer>
    </div>
  );
}

export default App;
