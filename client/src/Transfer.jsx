import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

function Transfer({ address, setBalance, signature, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const transferMessage = {
        recipientPulicKey: recipient,
        amount: sendAmount,
      };

      // convert transferMessage to utf8 bytes because keccak256 expects utf8 bytes as input.
      const transferMessageBytes = utf8ToBytes(JSON.stringify(transferMessage));

      // hash the transferMessageBytes with keccak256 to get the message hash as bytes. keccak256 expects bytes as input.
      const transferMessageHash = keccak256(transferMessageBytes);

      // sign the transferMessageHash with the private key to get the signature.
      const signedMessage = secp256k1.sign(transferMessageHash, privateKey);

      // convert the signature to a compact hex string.
      const signatureCompactHex = signedMessage.toCompactHex();

      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signatureCompactHex,
        recoveryId: signedMessage.recovery,
        messageHash: toHex(transferMessageHash),
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
