import ThemeToggler from "./theme-toggler.tsx";

const Header = () => {
  return (
    <header className="main-container border-b-2 py-1">
      <div className="container">
        <ThemeToggler className="ml-auto" />
      </div>
    </header>
  );
};

export default Header;
