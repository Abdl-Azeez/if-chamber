import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="relative w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <ul className="hidden md:flex space-x-6">
            <li className="relative group">
              <button className="flex items-center space-x-1">
                <span>Thought Leadership</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute left-0 top-full w-full bg-white shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="grid grid-cols-3 gap-6 p-6">
                  <div>
                    <h4 className="font-semibold">Insights</h4>
                    <p className="text-sm text-gray-600">
                      Deep dives into industry topics.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Case Studies</h4>
                    <p className="text-sm text-gray-600">
                      Real-world applications and success stories.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Podcasts</h4>
                    <p className="text-sm text-gray-600">
                      Listen to expert discussions.
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li>News</li>
            <li>Proficiencies</li>
            <li>Expert Community</li>
          </ul>
        </div>
        <button className="md:hidden">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
