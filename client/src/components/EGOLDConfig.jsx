import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Table from 'react-bootstrap/Table';

export default function EGOLDConfig() {

    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);

    const [perEGOLD, setPerEGOLD] = useState("");

    const [EGOLDprice, setEGOLDprice] = useState("");

    useEffect(() => {
        setTimeout(async () => {
            const artifact = require(`../contracts/EGOLD.json`);
            const _web3 = new Web3(Web3.givenProvider);
            const _accounts = await _web3.eth.requestAccounts();
            const networkID = await _web3.eth.net.getId();
            const { abi } = artifact;
            let address, contract;
            try {
                address = artifact.networks[networkID].address;
                contract = new _web3.eth.Contract(abi, address);
            } catch (err) {
                console.error(err);
            }
            setAccounts(_accounts);
            setContract(contract);

            await contract.methods.EGoldPrice().call({ from: _accounts[0] })
                .then(e => {
                    //console.log(e);
                    setPerEGOLD(e);
                })
                .catch(err => console.log(err));

        }, 100)

    }, [])

    const getDataHandler = async () => {
        await contract.methods.EGoldPrice().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setPerEGOLD(e);
            })
            .catch(err => console.log(err));
    }

    const setEGOLDPriceHandler = (e) => {
        setEGOLDprice(e.target.value);
    }

    const setEGOLD = async () => {
        await contract.methods.setGoldPrice(EGOLDprice)
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
            })
            .catch(err => console.log(err));
        getDataHandler();
        setEGOLDprice("");
    }


    return (
        <div>
            <h1>Data</h1>
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <th>1</th>
                        <th>Per EGOLD Price</th>
                        <td>{perEGOLD} EINR</td>
                    </tr>
                </tbody>
            </Table>
            <div style={{
                padding: "1rem",
                display: "flex",
                gap: "7px"
            }}>
                <label><h5>Set EGOLD Price</h5></label><br />
                <input onChange={setEGOLDPriceHandler} value={EGOLDprice} placeholder='Price in EINR'/>
                <button onClick={setEGOLD}>Set</button> <br />
            </div>
        </div>
    )
}