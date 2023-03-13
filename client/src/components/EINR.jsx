import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Table from 'react-bootstrap/Table';
import Tx from './Tx';
import Button from 'react-bootstrap/Button';
import useMeta from '../MetamaskLogin/useMeta';
import StripePayment from './StripePayment';
import RozarPay from './RozarPay';

export default function EINR({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { EINRContract, EINRAddress, accounts, web3 } } = useMeta();


    const [myBalance, setMyBalance] = useState("");

    const [mint, setMint] = useState("0");

    const [_Tx, set_Tx] = useState(false);
    const [success, setSuccess] = useState(false);
    const [RID, setRID] = useState("");

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                getDataHandler();
            }, 100)
        } else {
            setMyBalance(null);
        }
    }, [accounts])

    useEffect(() => {
        if (success) {
            setBackdrop(true);
            setTx(true);
            setMint("0");
            setTimeout(async () => {
                getDataHandler();
                setSuccess(false);
            }, 4000)
        }
    }, [success])

    const getDataHandler = async () => {
        await EINRContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setMyBalance(Web3.utils.fromWei(e, "ether"));
                // setMyBalance(e);
            })
            .catch(err => console.log(err));
    }

    const setMintHandler = (e) => {
        setMint(e.target.value);
    }

    const mintEINR = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (mint === "0") {
            alert("Mint amount should be greater than 0");
            return;
        }
        set_Tx(true);
    }

    return (
        <div>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <h1>Data</h1>
            <Table striped bordered hover >
                <tbody>
                    <tr>
                        <th>1</th>
                        <th>My Balance</th>
                        <td>{myBalance ? `${myBalance} EINR` : '--'}</td>
                    </tr>
                </tbody>
            </Table>
            <div style={{
                padding: "1rem",
                display: "flex",
                gap: "7px"
            }}>
                <label><h5>EINR</h5></label>
                <input onChange={setMintHandler} value={mint} type='number' min={1} placeholder='Enter EINR Amount' />
                <Button onClick={mintEINR} variant="primary" size="sz" >
                    Mint
                </Button>

            </div>

            {/* {_Tx && <StripePayment
                _Tx={_Tx}
                set_Tx={set_Tx}
                setReceipt={setReceipt}
                success={success}
                setSuccess={setSuccess}
                setRID={setRID}
                totalPrice={mint}
                account={accounts[0]}
                from='INR'
                to='EINR'
            />} */}
            {_Tx && <RozarPay
                _Tx={_Tx}
                set_Tx={set_Tx}
                setReceipt={setReceipt}
                success={success}
                setSuccess={setSuccess}
                setRID={setRID}
                totalPrice={mint}
                account={accounts[0]}
                from='INR'
                to='EINR' />}
        </div>
    )
}
