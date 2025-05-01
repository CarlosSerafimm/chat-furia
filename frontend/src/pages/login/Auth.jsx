import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = sessionStorage.getItem("username");
    if (savedUsername) {
      navigate("/chat", { replace: true });
    }
  }, [navigate]);
  useEffect(() => {
    const savedUsername = sessionStorage.getItem("username");
    if (savedUsername) {
      navigate("/chat", { replace: true });
    }
  }, []);

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        {isLogin ? (
          <Login toggle={() => setIsLogin(false)} />
        ) : (
          <Register toggle={() => setIsLogin(true)} />
        )}
      </motion.div>
    </div>
  );
}

export default Auth;
