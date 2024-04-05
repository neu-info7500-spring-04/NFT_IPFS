import React from 'react';
import { useWriteContract, useSimulateContract, useConnect, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import contractInterface from './contractabi.json'
import { WalletOptions } from './wallet-options'
import { useDisconnect } from 'wagmi'
import { Account } from './account'
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZThhZTk4My04MWQ2LTQxYTctYTJhYS0zMmU0NzI1ODJiMTAiLCJlbWFpbCI6ImRhbmllbDA4MDk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkMTE1NmQwMGE1Y2ViOTMxMDc2MyIsInNjb3BlZEtleVNlY3JldCI6ImNlNjVmMDhmMDIxZTVjNzAzMGVlOWFmNTEyZjlhMzM5OTBjYWI2MTJkODc3OTIyMTIyYTIyN2IzMDEzMDdjY2IiLCJpYXQiOjE3MTIyNzQzOTN9.vD_RQyRz4rkOQqKP369-xI8RIObAh4fo2EuJG0JrS38"
function ConnectWallet() {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <WalletOptions />
}
export function App() {


    const [ipfsUrl, setIpfsUrl] = useState('');
    const [ipfsHash, setIpfsHash] = useState('');
    const [NFTName, setNFTName] = useState('');
    const { isConnected, address } = useAccount();

    const { data } = useSimulateContract({
        address: '0x22Ba06d5dc211336aCd15EE4aD9872D21B759Bab',
        abi: contractInterface,
        functionName: 'mintNFT',
        args: [address, ipfsHash],
    });


    const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${JWT}`, 'Content-Type': 'application/json' },
        body: `{"pinataContent":{"image": "${ipfsUrl}", "name": "${NFTName}"},"pinataMetadata":{"name": "${NFTName}.json"},"pinataOptions":{"cidVersion":1}}`
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

    return (
        <div>
            <ConnectWallet />
            {isConnected &&
                <div>
                    <p>NFT name</p>
                    <input
                        type="text"
                        value={NFTName}
                        onChange={(e) => setNFTName(e.target.value)}
                        placeholder="Enter NFT name"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <p>Your image in IPFS Url</p>
                    <input
                        type="text"
                        value={ipfsUrl}
                        onChange={(e) => setIpfsUrl(e.target.value)}
                        placeholder="Enter IPFS URL"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    {/* <button disabled={isConfirming} onClick={executeSequentially}>Mint NFT</button> */}

                    {<button disabled={isConfirming}
                        onClick={() =>
                            fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options)
                                .then(response => response.json())
                                .then(response => setIpfsHash(response.IpfsHash))
                                .catch(err => console.error(err))
                        }>Mint NFT</button>}
                    {isConfirming && 'Waiting for approval'}
                    {isConfirmed && 'Success'}
                </div>}
        </div>
    );

}


