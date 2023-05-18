import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {ethers} from 'ethers';
import '../Style/enterLotteryPageStyle.css';
import wheel from '../Assets/wheel.png'
import constants from '../contract_constants';

function EnterLotteryPage () {
    const navigate = useNavigate();

    const [showContent, setShowContent] = useState(true);
    const [currentAccount, setCurrentAccount] = useState("");
    const [status, setStatus] = useState(false);
    const [isWinner, setIsWinner] = useState('');

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                try {
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    console.log(address);
                    setCurrentAccount(address);
                    console.log("Adresa " + currentAccount);
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
            const status = await contractIns.isComplete();
            setStatus(status);
            const winner = await contractIns.getWinner();
            if (winner === currentAccount) {
                setIsWinner(true);
            } else {
                setIsWinner(false);
            }
        }

        loadBlockchainData();
        contract();
    }, [currentAccount]);

    const enterLottery = async () => {
        const amountToSend = ethers.utils.parseEther('0.001');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
        const tx = await contractIns.enter({value: amountToSend,});
        await tx.wait();
        setShowContent(false);
    }

    function goToFinishLottery(){
        navigate('/finishLottery');
    }

  return (
    <div className="container">
        <div className="blackDiv">
            <h1 className="title">Lottery</h1>
            <h3 className="description">Welcome to Petnica Web3 Summit lottery game !</h3>
        </div>
        <div className="whiteDiv">
        {showContent ? (
            <div>
                <div className="imageContainer"><img className="centeredImage" src={wheel} alt="Image" /></div>
                <button className="bigButton" onClick={enterLottery}>Enter the lottery</button>
            </div>
        ) : (
          <div className="newContentWrapper">
            <div><h2 className="newText">You successfully entered lottery, good luck !</h2></div>
            <div><button className="bigButton" onClick={goToFinishLottery}>Go to result page</button></div>
          </div>
        )}
        </div>
  </div>
  )
}

export default EnterLotteryPage
