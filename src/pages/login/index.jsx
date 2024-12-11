import { useAuth } from "@/hooks/useContext";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useNavigate } from "react-router-dom";
import "./custom.css";
const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // Gửi token đến backend để xác thực
    fetch("http://localhost:3000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("tokenGoogle", JSON.stringify(data))
        try {
          setUser(data.user);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => console.error(err));
    navigate("/game-login/solana");
  };

  return (
    <div className="flex items-center justify-center h-full w-full bg-background-green">
      <div className="rounded-lg p-8">
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src="/assets/images/image 4.png"
            alt="Crypto Plantcare"
            className="w-40 h-40 mb-4"
          />
          <h1 className="text-xl font-bold text-gray-800">CRYPTO PLANTCARE</h1>
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
  );
};

export default LoginPage;
