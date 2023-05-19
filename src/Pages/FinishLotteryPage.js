import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers';
import constants from '../contract_constants';
import '../Style/finishLotteryPageStyle.css';
//finishLotteryPageStyle.css

const FinishLotteryPage = () => {

const [owner, setOwner] = useState('');
const [contractInstance, setcontractInstance] = useState('');
const [currentAccount, setCurrentAccount] = useState('');
const [isOwnerConnected, setisOwnerConnected] = useState(false);
const [winner, setWinner] = useState('');
const [status, setStatus] = useState(false);

useEffect(() => {
    const loadBlockchainData = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                console.log(address);
                setCurrentAccount(address);
                window.ethereum.on('accountsChanged', (accounts) => {
                    setCurrentAccount(accounts[0]);
                    console.log(currentAccount);
                })
            } catch (err) {
                console.error(err);
            }
        } else {
            alert('Please install Metamask to use this application')

        }
    };

    const contract = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
        setcontractInstance(contractIns);
        const status = await contractIns.isComplete();
        setStatus(status);
        const winner = await contractIns.getWinner();
        setWinner(winner);
        const owner = await contractIns.getManager();
        setOwner(owner);
        if (owner === currentAccount) {
            setisOwnerConnected(true);
        }
        else {
            setisOwnerConnected(false);
        }
    }

    loadBlockchainData();
    contract();
}, [currentAccount]);


const pickWinner = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
    
    const tx = await contractIns.pickWinner();
    await tx.wait();

    setStatus(true);
}

const resetLottery = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);

    const tx = await contractIns.resetLottery();
    await tx.wait();
}

  return (
    <div className="container">
    <div className="whiteDiv">
    <div className='button-container'>
        { ( isOwnerConnected ? ( <div className="btnContainer">
        <div className="buttonDiv">
            <div><button className="bigButton" onClick={pickWinner}> Pick Winner </button></div>
            <div><button className="bigButton" onClick={resetLottery}>Reset lottery</button></div>
            {status ? (<h3>Lottery Winner is : {winner}</h3>) : <h3>Lottery is still running !</h3>}
        </div>
      </div>) : 
        (<h3>Lottery is still running !</h3>))

        }
    </div>
    </div>
    <div className="blackDiv">
        <h1 className="title">Results</h1>
        <h3 className="description">See the lottery winner. Lottery ends when contract owner ends it.<br></br> Pick lottery only works for admin.</h3>
    </div>
</div>)}

export default FinishLotteryPage
