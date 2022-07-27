import "zx/globals";
import env from "@chainized/config";

$.verbose = false;

let deploy = await $`anchor deploy`;

// [0] 'Deploying workspace: https://api.devnet.solana.com',
// [1] 'Upgrade authority: ./../../packages/config/solana/id.json',
// * For every contract contained in package
// [2] 'Deploying program "puppet"...',
// [3] 'Program path: /workspaces/chainized/contracts/SPL/target/deploy/puppet.so...',
// [4] 'Program Id: 72MNWohxheBmfHpT8uA9CfYhKEo12V6dfab3Q1qFso5b',
// [5] ' ',
// * After deployment of all contracts
// [6] 'Deploy success'

const stdout = String(deploy.stdout);
const deployOutputLines = stdout.split("\n");
const deployOutput = deployOutputLines.slice(2, deployOutputLines.length - 2);
const contractsCount = deployOutput.length / 4;

const programs = [];
let program = {};

deployOutput.map((line, index) => {
  if (line.startsWith('Deploying program "')) program.name = line.split('"')[1];

  if (line.startsWith("Program path: "))
    program.path = line.split("Program path: ")[1].slice(0, -3);

  if (line.startsWith("Program Id: ")) program.programId = line.slice(12);

  if (line === "") {
    programs.push(program);
    program = {};
  }
});

console.log(programs);
console.log('')
console.log('-------- ANCHOR.TOML --------')
console.log(`
[programs.devnet]
${programs.map((program) => `${program.name} = ${program.programId}`).join("\n")}
`)