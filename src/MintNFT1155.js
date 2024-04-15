import React from 'react';
import { useWriteContract, useSimulateContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import contractInterface from './contractabi1155.json'
import { WalletOptions } from './wallet-options'
import { useDisconnect } from 'wagmi'
import { App as Uploader } from './Uploader';

const axios = require('axios')
const FormData = require('form-data')
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZThhZTk4My04MWQ2LTQxYTctYTJhYS0zMmU0NzI1ODJiMTAiLCJlbWFpbCI6ImRhbmllbDA4MDk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkMTE1NmQwMGE1Y2ViOTMxMDc2MyIsInNjb3BlZEtleVNlY3JldCI6ImNlNjVmMDhmMDIxZTVjNzAzMGVlOWFmNTEyZjlhMzM5OTBjYWI2MTJkODc3OTIyMTIyYTIyN2IzMDEzMDdjY2IiLCJpYXQiOjE3MTIyNzQzOTN9.vD_RQyRz4rkOQqKP369-xI8RIObAh4fo2EuJG0JrS38"

export function App() {


    const [ipfsUrl, setIpfsUrl] = useState('');
    const [ipfsHash, setIpfsHash] = useState('');
    const [NFTName, setNFTName] = useState('');
    const [amount, setAmount] = useState('');
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const { isConnected, address } = useAccount();
    const [fileName, setFileName] = useState("No selected file");


    const { data } = useSimulateContract({
        address: '0x664B1a644BB89C3460212038AF883C6359Fa773d',
        abi: contractInterface,
        functionName: 'mint',
        args: [address, amount, ipfsHash],
    });


    const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${JWT}`, 'Content-Type': 'application/json' },
        body: `{"pinataContent":{"image": "${ipfsUrl}", "name": "${NFTName}","amount": "${amount}"},"pinataMetadata":{"name": "${NFTName}.json"},"pinataOptions":{"cidVersion":1}}`
        // body: '{"pinataContent":{"description": "Friendly OpenSea Creature that enjoys long swims in the.", "external_url": "https://openseacreatures.io/3", "image": "ipfs://Qmd3tn8zkDUTcStp6Y1Y64qttD7UcJ4fqEN1rHtdBvgtp9", "name": "Dave Starbelly"},"pinataMetadata":{"name":"pinnie2.json"},"pinataOptions":{"cidVersion":1}}'
    };

    const { writeContract, data: hash } = useWriteContract()
    console.log("options", options)
    console.log("data", data)
    console.log("ipfsHash", ipfsHash)

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (ipfsHash && data) {
            try {
                writeContract(data.request);
            } catch (err) {
                console.error('Error writing contract:', err);
            }
        }
    }, [ipfsHash, data]);

    useEffect(() => {
        if (ipfsUrl) {
            fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options)
                .then(response => response.json())
                .then(response => setIpfsHash(response.IpfsHash))
                .catch(err => console.error(err))
        }
    }, [ipfsUrl]);
    const handleImageChange = async (e) => {
        // setFile(e.target.files[0]);
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setFileName(selectedFile.name)

            };
            reader.readAsDataURL(selectedFile);
        }
    };
    const handleDelete = async (e) => {
        setFileName("No selected File");
        setImage(null);
    }

    const Mint = async (e) => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pinataOptions', '{"cidVersion": 0}');
            formData.append('pinataMetadata', '{"name": "pinnie"}');

            try {
                const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                    headers: {
                        'Authorization': `Bearer ${JWT}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(res.data);
                console.log(`View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
                setIpfsUrl(`ipfs://${res.data.IpfsHash}`)
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

    };

    return (
        <div>
            {isConnected &&
                <div className='panel'>
                    <Uploader onChange={handleImageChange} image={image} fileName={fileName} onClick={handleDelete}></Uploader>
                    <div className='inputData'>

                        <p>NFT name</p>
                        <input
                            type="text"
                            value={NFTName}
                            onChange={(e) => setNFTName(e.target.value)}
                            placeholder="Enter NFT name"
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <p>Amount of NFT</p>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount of NFT"
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        {/* <p>Your image in IPFS Url</p> */}
                        {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
                        {/* {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />} */}
                        {/* <button disabled={isConfirming} onClick={executeSequentially}>Mint NFT</button> */}
                    </div>
                </div>}
            {<button className="mintBut" disabled={isConfirming}
                onClick={() => Mint()
                }>Mint NFT</button>}
            {isConfirming && 'Waiting for approval'}
            {isConfirmed && 'Success'}
        </div>

    );

}


