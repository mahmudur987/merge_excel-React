import { Link } from "react-router-dom";

let menuSvg = (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h8m-8 6h16"
      />
    </svg>
  </>
);

let menuItems = (
  <>
    <li>
      <Link to={"/"}>Home</Link>
    </li>
    <li>
      <Link to={"/headerLess"}>HeaderLess</Link>
    </li>
    <li>
      <Link to={"/duplicates"}>CheckDuplicates</Link>
    </li>
    {/* <li>
      <Link to={"/largeFiles"}>LargeFiles</Link>
    </li> */}
    <li>
      <Link to={"/gpO2CFilter"}>GP O2C Filter</Link>
    </li>
  </>
);

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            {menuSvg}
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {menuItems}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">Merge Excel</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{menuItems}</ul>
      </div>
      <div className="navbar-end">
        <a className="btn">Login</a>
      </div>
    </div>
  );
};

export default Navbar;
