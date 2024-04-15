import React, { useState, useEffect } from 'react';
import contractInterface from './contractabi.json'
import contractInterface1155 from './contractabi1155.json'
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import IPFSDataDisplay from './IPFSDataDisplay';


const NFTCollection = () => {
    const { address } = useAccount();
    const [nfts, setNfts] = useState([]);
    const [nfts1155, setNfts1155] = useState([]);
    // console.log(address)
    const { data: tokens, isLoading: isLoadingTokens } = useReadContract({
        address: '0x22Ba06d5dc211336aCd15EE4aD9872D21B759Bab',
        abi: contractInterface,
        functionName: 'getMintedTokens',
        args: [address],
    });
    const { data: tokens1155, isLoading: isLoadingTokens1155 } = useReadContract({
        address: '0x664B1a644BB89C3460212038AF883C6359Fa773d',
        abi: contractInterface,
        functionName: 'getMintedTokens',
        args: [address],
    });
    console.log("tokens1155", tokens1155)
    const { data: tokenURIs, isLoading: isLoadingURIs } = useReadContracts({
        contracts: tokens?.map((token) => ({
            address: '0x22Ba06d5dc211336aCd15EE4aD9872D21B759Bab',
            abi: contractInterface,
            functionName: 'tokenURI',
            args: [token]
        })) ?? [],
        enabled: !!tokens,
    });

    const { data: tokenURIs1155, isLoading: isLoadingURIs1155 } = useReadContracts({
        contracts: tokens1155?.map((token) => ({
            address: '0x664B1a644BB89C3460212038AF883C6359Fa773d',
            abi: contractInterface1155,
            functionName: 'uri',
            args: [token]
        })) ?? [],
        enabled: !!tokens1155,
    });

    console.log("tokenURIs", tokenURIs)
    console.log("tokenURIs1155", tokenURIs1155)
    useEffect(() => {
        if (tokenURIs && !isLoadingTokens && !isLoadingURIs) {
            const nftData = tokenURIs.map((uri, index) => ({
                tokenId: tokens[index].toString(),
                tokenURI: uri.result.toString(),
            }));
            setNfts(nftData);
        }
    }, [tokenURIs, tokens, isLoadingTokens, isLoadingURIs]);

    useEffect(() => {
        if (tokenURIs1155 && !isLoadingTokens1155 && !isLoadingURIs1155) {
            const nftData1155 = tokenURIs1155.map((uri, index) => ({
                tokenId: tokens1155[index].toString(),
                tokenURI: uri.result.toString(),
            }));
            setNfts1155(nftData1155);
        }
    }, [tokenURIs1155, tokens1155, isLoadingTokens1155, isLoadingURIs1155]);


    console.log("nfts", nfts)
    console.log("nfts1155", nfts1155)
    return (
        <div className='displace'>
            <p>ERC721</p>
            <div className='gallery'>

                {nfts.map((nft) => (
                    <div className='gallery-item' key={nft.tokenId}>
                        <IPFSDataDisplay ipfsHash={nft.tokenURI}></IPFSDataDisplay>
                    </div>
                ))}
            </div>
            <p>ERC1155</p>
            <div className='gallery'>
                {nfts1155.map((nft) => (
                    <div className='gallery-item'  key={nft.tokenId}>
                        <IPFSDataDisplay ipfsHash={nft.tokenURI}></IPFSDataDisplay>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NFTCollection;
