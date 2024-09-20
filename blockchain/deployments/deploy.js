async function main() {
    const StakeContract = await ethers.getContractFactory("StakeContract");
    const stake_to_make = await StakeContract.deploy();
    console.log("Contract Deployed to Address:", stake_to_make.address);
  }
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });