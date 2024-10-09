'use client'; // Diretiva para tornar o componente um componente do cliente

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [carteira, setCarteira] = useState<string>("");
  const router = useRouter(); // Inicializa o router

  useEffect(() => {
    const recuperarValor = () => {
      const valorArmazenado = localStorage.getItem("carteira");
      if (valorArmazenado) {
        setCarteira(valorArmazenado);
      }
    };
    recuperarValor();
  }, []);

  // Função para desconectar a carteira
  const desconectarMetamask = () => {
    // Remove a carteira do Local Storage
    localStorage.removeItem("carteira");

    // (Opcional) Remove outros dados relacionados, como name e email
    // localStorage.removeItem("name");
    // localStorage.removeItem("email");

    // Atualiza o estado para refletir que a carteira está desconectada
    setCarteira("");

    // (Opcional) Se você tiver um estado para outros dados, resete-os aqui
    // setName("");
    // setEmail("");

    // (Opcional) Notifica o usuário sobre a desconexão
    alert("MetaMask disconnected successfully.");

    // Redireciona para a página de login após desconectar
    router.push("/auth/signin");
  };

  const conectarMetamask = () => {
    router.push("/auth/signin");
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="hidden sm:block">
        </div>
        <div className="flex items-center gap-3 2xsm:gap-7">
        {carteira ? (
            <div className="flex items-center gap-2">
              <span>{carteira}</span>
              <button
                onClick={desconectarMetamask}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={conectarMetamask}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
