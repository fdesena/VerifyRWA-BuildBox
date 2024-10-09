"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Evaluator from "../Evaluators/Evaluators";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import rwaEvaluationAbi from "../../app/json/RwaEvaluation.json";
import evaluatorRegistryAbi from "../../app/json/EvaluatorRegistry.json"; 

export type Evaluation = {
  evaluatorAddress: string;
  rwaTokenAddress: string;
  totalValue: number;
  paymentInfoAvailable: boolean;
  officialWebsite: string;
  trustScore: number;
  comments: string;
  timestamp: string;
};

export type Evaluator = {
  name: string;
  email: string;
  avaliacoes: number;
  evaluatorAddress: string;
};

const rwaEvaluationAddress = "0xB45B962D973606aFEdbcb21Ac0f622a8285D77E0";
const evaluatorRegistryAddress = "0x6C4b5478141BF30BD94DC033740a1eF96E79a943";

const ECommerce: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvaluations = async () => {
    console.log("Fetching evaluations...");
    try {
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask detected, requesting accounts...");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const evaluationContract = new ethers.Contract(rwaEvaluationAddress, rwaEvaluationAbi.abi, provider);
        const registryContract = new ethers.Contract(evaluatorRegistryAddress, evaluatorRegistryAbi.abi, provider);

        const count = await evaluationContract.getEvaluationsCount();
        console.log(`Total evaluations: ${count}`);
        const fetchedEvaluations: Evaluation[] = [];
        const fetchedEvaluators: Evaluator[] = [];

        const evaluatorAddresses = new Set<string>();

        for (let i = 0; i < count; i++) {
          const evalData = await evaluationContract.getEvaluation(i);
          console.log(`Fetched evaluation ${i}:`, evalData);
          const evaluation: Evaluation = {
            evaluatorAddress: evalData[0],
            rwaTokenAddress: evalData[1],
            totalValue: evalData[2],
            paymentInfoAvailable: evalData[3],
            officialWebsite: evalData[4],
            trustScore: evalData[5],
            comments: evalData[6],
            timestamp: new Date(evalData[7] * 1000).toLocaleDateString(),
          };
          fetchedEvaluations.push(evaluation);

          if (!evaluatorAddresses.has(evalData[0])) {
            console.log(`Fetching evaluator data for address: ${evalData[0]}`);
            const evaluatorData = await registryContract.getEvaluator(evalData[0]);
            console.log(`Evaluator data:`, evaluatorData);
            fetchedEvaluators.push({
              name: evaluatorData.name,
              email: evaluatorData.email,
              avaliacoes: 1,
              evaluatorAddress: evalData[0],
            });
            evaluatorAddresses.add(evalData[0]);
          } else {
            const evaluatorIndex = fetchedEvaluators.findIndex((a) => a.evaluatorAddress === evalData[0]);
            if (evaluatorIndex > -1) {
              fetchedEvaluators[evaluatorIndex].avaliacoes += 1;
            }
          }
        }

        setEvaluations(fetchedEvaluations);
        setEvaluators(fetchedEvaluators);
        console.log("Evaluations set:", fetchedEvaluations);
        console.log("Evaluators set:", fetchedEvaluators);
        setLoading(false);
      } else {
        console.error("MetaMask is not installed!");
        alert("MetaMask is not installed!");
      }
    } catch (error) {
      console.error("Error when searching for reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect called, fetching evaluations...");
    fetchEvaluations();
  }, []);

  if (loading) {
    console.log("Loading evaluations...");
    return <div>Loading evaluations...</div>;
  }

  const totalEvaluators = evaluators.length;
  const totalEvaluations = evaluations.length;
  const totalAssets = new Set(evaluations.map((evaluation) => evaluation.rwaTokenAddress)).size;

  console.log("Rendering evaluations:", evaluations);
  console.log("Rendering evaluators:", evaluators);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats title="Total Evaluations" total={totalEvaluations.toString()} />
        <CardDataStats title="Evaluators" total={totalEvaluators.toString()} />
        <CardDataStats title="Assets" total={totalAssets.toString()} />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <TableOne evaluations={evaluations} />
        </div>
        <Evaluator evaluators={evaluators} />
      </div>
    </>
  );
};

export default ECommerce;
