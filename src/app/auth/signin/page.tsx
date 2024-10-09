"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation"; // Importação atualizada
import evaluatorRegistryAbi from "../../json/EvaluatorRegistry.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const evaluatorRegistryAddress = "0x6C4b5478141BF30BD94DC033740a1eF96E79a943"

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Solicita acesso às contas do MetaMask
        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // Obtém o primeiro endereço da carteira
        const carteira = accounts[0];

        // Verifica se name e email estão preenchidos
        if (!name || !email) {
          alert("Please fill in your name and email before connecting.");
          return;
        }

        // Salva a carteira, nome e email no Local Storage
        await handleEvaluatorAccess(name, email, carteira);
        // Opcional: Atualize o estado local se necessário
        // setCarteira(carteira); // Se você tiver um estado para a carteira

        // Redireciona para a página inicial após conectar
      } catch (error) {
        console.error(error);
        alert("Failed to connect to MetaMask.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleEvaluatorAccess = async (name: string, email: string, wallet: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const evaluatorRegistryContract = new ethers.Contract(
        evaluatorRegistryAddress,
        evaluatorRegistryAbi.abi,
        signer
      );

      const isRegistered = await evaluatorRegistryContract.isEvaluatorRegistered(wallet);
      if (isRegistered) {
        alert("You are already registered as an appraiser. Redirecting...");
 
        localStorage.setItem("carteira", wallet);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        router.push("/");
        return;
      }

      const tx = await evaluatorRegistryContract.registerEvaluator(name, email);
      await tx.wait();

      localStorage.setItem("carteira", wallet);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Failed to register as an evaluator.");
    }
  };

  return (
    <>
  <br/><br/><br/><br/><br/><br/><br/><br/>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark" >
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className="dark:hidden"
                  src={"https://raw.githubusercontent.com/fdesena/VerifyRWA/refs/heads/main/public/images/logo/Verifyrwa.jpeg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>

              <p className="2xl:px-20">
              Focused on transparency, our RWA audit project magnifies every contract detail, ensuring clarity and trust in global asset management.
              </p>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Connect to Metamask
              </h2>

              <form>

              <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0ZM11 3.3C12.8232 3.3 14.3 4.77683 14.3 6.6C14.3 8.42317 12.8232 9.9 11 9.9C9.17683 9.9 7.7 8.42317 7.7 6.6C7.7 4.77683 9.17683 3.3 11 3.3ZM11 18.7C8.426 18.7 6.12245 17.4511 4.67658 15.5C4.70367 13.5323 9.9 12.45 11 12.45C12.4901 12.45 17.2963 13.5323 17.3234 15.5C15.8775 17.4511 13.574 18.7 11 18.7Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <button
                    type="button"
                    onClick={connectMetamask}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    Connect to Metamask
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </>
  );
};

export default SignIn;
