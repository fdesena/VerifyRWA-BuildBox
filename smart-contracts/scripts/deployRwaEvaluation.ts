import { ethers, run } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const EVALUATOR_REGISTRY_ADDRESS = "0x6C4b5478141BF30BD94DC033740a1eF96E79a943"; 

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const RwaEvaluationFactory = await ethers.getContractFactory("RwaEvaluation");
    const rwaEvaluationContract = await RwaEvaluationFactory.deploy(EVALUATOR_REGISTRY_ADDRESS);

    await rwaEvaluationContract.deployTransaction.wait(5);
    
    console.log("RwaEvaluation Contract deployed to:", rwaEvaluationContract.address);

    await delay(60000);

    try {
        await run("verify:verify", {
            address: rwaEvaluationContract.address,
            constructorArguments: [EVALUATOR_REGISTRY_ADDRESS],
        });
        console.log("Contract verified successfully.");
    } catch (error) {
        console.error("Error verifying contract:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
