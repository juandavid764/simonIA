import { LoginForm } from "../components/AuthPage/LoginForm";
import { RegisterForm } from "../components/AuthPage/RegisterForm";

import { useState } from "react";

export const AuthPage = () => {
  const [modo, setModo] = useState("login");

  const cambiarModo = () => {
    setModo(modo === "login" ? "registro" : "login");
  };

  return (
    <div className=" flex items-center justify-center ">
      {modo === "login" ? (
        <LoginForm cambiarModo={cambiarModo} />
      ) : (
        <RegisterForm cambiarModo={cambiarModo} isAuthPage={true} />
      )}
    </div>
  );
};