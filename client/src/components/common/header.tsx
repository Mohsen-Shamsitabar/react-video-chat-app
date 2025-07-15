import ThemeToggler from "./theme-toggler.tsx";

const Header = () => {
  return (
    <header className="border-b-2 flex justify-center items-center py-1">
      <div className="container">
        <ThemeToggler className="ml-auto" />
      </div>
    </header>
  );
};

export default Header;
