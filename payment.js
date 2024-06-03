// Bring the XRPL Javascript SDK for use in the project
import { Client, Wallet, xrpToDrops } from "xrpl";

// Get wallet from seed
const wallet = Wallet.fromSeed("sEdV85bcLr36AyNvXm3Et76VeJn3G8X");

// New connection to testnet
const client = new Client("wss://s.altnet.rippletest.net:51233");
await client.connect();

try {
  // Create the payment object
  const payment = {
    Account: wallet.classicAddress, // rAddress of the sending account
    TransactionType: "Payment", // Important
    Amount: xrpToDrops(1), // Important: Amount in drops, so convert
    Destination: "rDTD3vHNZ7gsfc53Y2vknNKuHufWxayCYM", // rAddress of the destination
  };

  // Prepare transaction
  const prepared = await client.autofill(payment); // Autofill saves us some time

  // Sign the transaction
  const signed = wallet.sign(prepared);

  // Submit the transaction and wait for the result before running into finally
  const result = await client.submitAndWait(signed.tx_blob);

  // Output the results of the transaction to the console
  console.log(result);
} catch (error) {
  // Output the error to the console
  console.error(error);
} finally {
  // Close the client connection
  await client.disconnect();
}
