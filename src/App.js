import { useStoreApi } from "./storeApi";
import useWeb3 from "./useWeb3";
import { Button, TextField } from "@material-ui/core";
import "./App.css";
import EthLogo from "./ethereum.png";
import axios from "axios";

function App() {
  const { balance, address, message, setAddress, setBalance } = useStoreApi();
  const web3 = useWeb3();

  // get user account on button click
  const getUserAccount = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then(accounts => {
          setAddress(accounts[0]);
          updateBalance(accounts[0]);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Metamask extensions not detected!");
    }
  };

  const updateBalance = async fromAddress => {
    await web3.eth.getBalance(fromAddress).then(value => {
      setBalance(web3.utils.fromWei(value, "ether"));
    });
  };

  // matic 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
  // dai 0x8f3cf7ad23cd3cadbd9735aff958023239c6a063

  // async function swapper(e){
  //   try{
        // const amount = e.target[0].value;
        // const recipient = e.target[1].value;
    //     e.preventDefault();
    //     const addressFrom = e.target[0].value
    //     const addressTo = e.target[1].value
    //     const amount = web3.utils.toWei(e.target[2].value, "ether")
    //     const response = await axios.get(`https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=${addressFrom}&toTokenAddress=${addressTo}&amount=${amount}&fromAddress=${address}&slippage=0.1&disableEstimate=false`)
    //     if(response.data){
    //         const data = response.data
    //         // data.tx.gas = 1000000
    //          const tx = await web3.eth.sendTransaction(data.tx)
    //         if(tx.status){
    //             console.log("Swap Successfull! :)")
    //         }
    //     }
    // }catch(err){
    //     console.log("swapper encountered an error below")
    //     console.log(err)
    // }

// }


  // const switchNetwork = async () => {
  //   let currentChain = await window.ethereum.request({ method: 'eth_chainId' });
  //   // console.log(currentChain + ' <- currentChain'); //for debug
  //   return currentChain; //tried
  // }
  // console.log(fromCheck + ' <- fromCheck');

  const sendTransaction = async e => {
    e.preventDefault();
        const addressFrom = e.target[0].value
        const addressTo = e.target[1].value
        const amount = web3.utils.toWei(e.target[2].value, "ether")
        // const id = web3.eth.net.getChainId();
        // let fromCheck = await switchNetwork();
        // web3.eth.getChainId().then(console.log);
        const response = await axios.get(`https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=${addressFrom}&toTokenAddress=${addressTo}&amount=${amount}&fromAddress=${address}&slippage=0.1&disableEstimate=false`)
        if(response.data){
            const data = response.data
            // data.tx.gas = 1000000
             const tx = await web3.eth.sendTransaction(data.tx)
            if(tx.status){
                console.log("Swap Successfull! :)")
            }
        }
      updateBalance(address);
    // }catch(err){
    //     console.log("swapper encountered an error below")
    //     console.log(err)
    // }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={EthLogo} className="App-logo" alt="logo" />
        <p>
          <code>Welcome in an decentralized application</code>
        </p>
        {address ? (
          <> 
            <p> Your account: {address}</p>
            <p> Balance: {balance} </p>
          </>
          
        ) : null}
        <Button className = "App-button"
          onClick={() => getUserAccount()}
          variant="outlined"
          color="default"
        >
          Connect your wallet
        </Button>
        {message ? (
          <p>
            <code>{message}</code>
          </p>
        ) : null}
        <form onSubmit={e => sendTransaction(e)}>
          <TextField required label="Token From Address" variant="filled" />
          <TextField required label="Token To Address" variant="filled" />
          <TextField
            required
            label="Amount"
            inputProps={{ step: "any" }}
            type="number"
            variant="filled"
          />
          <Button
            style={{ margin: "10px" }}
            type="submit"
            variant="outlined"
            color="cornflowerblue"
          >
            Swap
          </Button>
        </form>
      </header>
    </div>
  );
}

export default App;