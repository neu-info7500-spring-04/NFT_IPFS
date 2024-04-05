import React, { useState, useEffect } from 'react';
import contractInterface from './contractabi.json'
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import IPFSDataDisplay from './IPFSDataDisplay';


const NFTCollection = () => {
    const { address } = useAccount();
    const [nfts, setNfts] = useState([]);
    // console.log(address)
    const { data: tokens, isLoading: isLoadingTokens } = useReadContract({
        address: '0x22Ba06d5dc211336aCd15EE4aD9872D21B759Bab',
        abi: contractInterface,
        functionName: 'getMintedTokens',
        args: [address],
    });
    // console.log("tokens", tokens)
    const { data: tokenURIs, isLoading: isLoadingURIs } = useReadContracts({
        contracts: tokens?.map((token) => ({
            address: '0x22Ba06d5dc211336aCd15EE4aD9872D21B759Bab',
            abi: contractInterface,
            functionName: 'tokenURI',
            args: [token]
        })) ?? [],
        enabled: !!tokens,
    });
    console.log(tokenURIs)
    useEffect(() => {
        if (tokenURIs && !isLoadingTokens && !isLoadingURIs) {
            const nftData = tokenURIs.map((uri, index) => ({
                tokenId: tokens[index].toString(),
                tokenURI: uri.result.toString(),
            }));
            setNfts(nftData);
        }
    }, [tokenURIs, tokens, isLoadingTokens, isLoadingURIs]);

    
    // console.log(nfts)
    return (
        <div>
            {nfts.map((nft) => (
                <div key={nft.tokenId}>
                    <IPFSDataDisplay ipfsHash={nft.tokenURI}></IPFSDataDisplay>
                    {/* You can expand this to fetch and display the NFT metadata */}
                </div>
            ))}
        </div>
    );
};

export default NFTCollection;
