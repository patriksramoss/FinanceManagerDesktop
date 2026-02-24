import React from "react";
import PlaidLinkButton from "src/components/Plaid/PlaidLinkButton";
import { getAccessToken } from "src/stores/Plaid";
import useAuthStore from "src/stores/Auth";
import logoImg from "src/assets/images/logo.png";
import skyBg from "src/assets/images/sky-background.jpg";

const Auth: React.FC = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSuccess = async (publicToken: string) => {
    const token = await getAccessToken(publicToken);
    setAccessToken(token);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100 m-0">
      <div className="flex w-[900px] h-[520px] bg-gray-100 rounded-xl shadow-xl overflow-hidden">
        <div
          className="flex-1 bg-cover bg-center"
          style={{ backgroundImage: `url(${skyBg})` }}
        />

        <div className="flex-1 flex flex-col justify-center items-center text-center bg-white p-12">
          <img src={logoImg} alt="Logo" className="h-[90px] mb-6" />

          <h2 className="text-[1.8rem] font-semibold m-0">Link Your Bank</h2>

          <p className="mt-3 mb-8 text-sm text-gray-700">
            Securely connect your bank account to continue
          </p>
          <PlaidLinkButton onSuccess={handleSuccess} />
          <span className="mt-6 text-xs text-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
