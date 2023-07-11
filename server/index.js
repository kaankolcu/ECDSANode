const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03a10257e133def6dbcabfeb2107c5a201c1b97233bfb875a90d7d8c67809f85cf": 100, // dan
  "033b0113bd7ff9c4d185d3ccb126fa947fa9c467ca78369acf17fd081943bc1132": 50, // al
  "02aa8c929b6b3a0018864ad8c71b33351791ea66daf1d9bf65db542a07741081c9": 75, // ben
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signature, recoveryId, messageHash } = req.body;

  const signatureRecovery = secp256k1.Signature.fromCompact(signature);

  signatureRecovery.recovery = recoveryId;

  const publicKey = signatureRecovery.recoverPublicKey(messageHash).toHex();

  setInitialBalance(publicKey);
  setInitialBalance(recipient);

  if (balances[publicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[publicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
