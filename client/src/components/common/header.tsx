import ThemeToggler from "./theme-toggler.tsx";

const Header = () => {
  // React.useEffect(() => {
  //   const socket = io(NETWORK.SERVER_URL);

  //   socket.on("connect", () => {
  //     console.log(`SOCKET:${socket.id} connected!`);
  //   });

  //   return () => {
  //     socket.removeListener("connect");
  //   };
  // });

  return (
    <header className="main-container border-b-2 py-1">
      <div className="container">
        <ThemeToggler className="ml-auto" />
      </div>
    </header>
  );
};

export default Header;
