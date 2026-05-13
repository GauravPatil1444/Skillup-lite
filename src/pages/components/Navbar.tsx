import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import logo from '../../assets/Logo_dark.png';

const Navbar = () => {
  const { user } = useAppSelector((state:any) => state.auth);

  return (
    <nav className="bg-[#FBFCF8] border-b border-gray-100 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex items-center">
          <img src={logo} alt="Skillup Logo" className="h-10 w-auto" />
        </div>

        <div className="flex items-center gap-10">
          <Link to="/courses" className="text-sm font-bold text-[#192A56] hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link to="/my-courses" className="text-sm font-bold text-[#192A56] hover:opacity-70 transition-opacity">
            Courses
          </Link>
        </div>

        <div className="flex items-center">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#192A56]">
                Welcome, <span className="text-[#7D96FF]">{user.name}</span>
              </span>
              <div className="w-9 h-9 rounded-full bg-[#A5BEFC]/20 flex items-center justify-center border border-[#192A56]/10">
                <span className="text-[#192A56] font-bold text-xs">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-bold text-[#192A56] hover:text-[#7D96FF] transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;