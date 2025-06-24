import React from "react";
import SignupForm from "./components/SignupForms";
import LoginForm from "./components/LoginForm";

function App() {
  return (
    <div>
      <h1>Bienvenido a la SPA de Blogs</h1>
      <SignupForm />
      <LoginForm />
    </div>
  );
}

export default App;