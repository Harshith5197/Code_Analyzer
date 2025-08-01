import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import ComplexityAnalyzer from "@/components/ComplexityAnalyzer";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLoggedIn ? (
        <ComplexityAnalyzer onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
};

export default Index;
