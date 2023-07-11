import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        privateKey={privateKey}
        setBalance={setBalance}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
        setSignature={setSignature}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        setPrivateKey={setPrivateKey}
        signature={signature}
        privateKey={privateKey}
      />
    </div>
  );
}

export default App;
