// Example of how to submit blobs to Celestia:

const ns = Namespace.newV0(new Uint8Array([97, 98, 99]));
const data = new Uint8Array([100, 97, 116, 97]);
const blob = new Blob(ns, data, AppVersion.latest());

const txInfo = await txClient.submitBlobs([blob]);
await txClient.submitBlobs([blob], { gasLimit: 100000n, gasPrice: 0.02 })