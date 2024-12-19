import Loading from "@/components/loading";
import { createUser } from "@/utils/authServices";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./custom.css";
const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoginSuccessOpen, setIsLoginSuccessOpen] = useState(false);

  const handleGoogleLoginSuccess = useCallback(async (credentialResponse) => {
    // Gửi token đến backend để xác thực
    await fetch("http://localhost:3000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential }), 
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("tokenGoogle", JSON.stringify(data.token));
  //      createUserToGameShift(data.user.sub, data.user.email);
      })
      .catch((err) => console.error(err));
    setIsLoginSuccessOpen(true);
    navigate("/game-login/solana");
  }, []);

  const createUserToGameShift = async (referenceId, email) => {
    try {
      const resp = await createUser(referenceId, email);
      console.log("Tạo user thành công:", resp);

      if (resp.response.data.statusCode === 409) {
        return;
      }
    } catch (error) {
      console.error("Lỗi khi tạo user trong GameShift:", error);
    }
  };



  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập quá trình tải
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 giây

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className="flex items-center justify-center h-full w-full bg-background-green">
        <div className="rounded-lg p-8 relative">
          <div className="flex flex-col items-center justify-center mb-6">
            <img
              src="/assets/images/image 4.png"
              alt="Crypto Plantcare"
              className="w-40 h-40 mb-4"
            />
            <h1 className="text-xl font-bold text-gray-800">
              CRYPTO PLANTCARE
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              ------------- Sign in to your account --------------
            </p>
          </div>

          <GoogleOAuthProvider clientId="426378821599-58dil04pq5oropr6siq4su8qus2tgqci.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
