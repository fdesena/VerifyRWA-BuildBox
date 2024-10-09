import { ethers, run } from "hardhat";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const EvaluatorRegistryFactory = await ethers.getContractFactory("EvaluatorRegistry");

    const evaluatorRegistryContract = await EvaluatorRegistryFactory.deploy();

    await evaluatorRegistryContract.deployTransaction.wait(5);

    console.log("EvaluatorRegistry Contract deployed to:", evaluatorRegistryContract.address);

    await delay(60000);

    try {
        await run("verify:verify", {
            address: evaluatorRegistryContract.address,
            constructorArguments: [],
        });
        console.log("Contract verified successfully!");
    } catch (error) {
        console.error("Error during contract verification:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
