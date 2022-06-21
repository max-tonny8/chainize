#!/usr/bin/env zx

import "zx/globals";
import env from "@chainized/config";

$.verbose = false;

let airdropRawMessage =
  await $`solana airdrop 2 --skip-seed-phrase-validation -C ${env.SOLANA_CONFIG} --output json`;

let signatureProcessing;
airdropRawMessage
  .toString()
  .split(`\n`)
  .slice(1, 4)
  .map((line) => {
    signatureProcessing = signatureProcessing + line;
    return line;
  });

const airdropSignature = JSON.parse(signatureProcessing.slice(9)).signature;

await $`solana confirm -v ${airdropSignature} -C ${env.SOLANA_CONFIG}`;

echo(
  `Balance: ${await $`solana balance ${env.SOLANA_ID} -C ${env.SOLANA_CONFIG}`}`
);
