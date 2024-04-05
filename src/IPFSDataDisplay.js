import React, { useState, useEffect } from 'react';

const IPFSDataDisplay = ({ ipfsHash }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const url = `https://ipfs.io/ipfs/${ipfsHash}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error("Fetching error:", error);
                setError(error.message);
            }
        };

        if (ipfsHash) {
            fetchData();
        }
    }, [ipfsHash]); // Re-run the effect if the ipfsHash prop changes

    if (error || data == null) {
        return <div>Error: {error}</div>;
    }
    console.log(data)
    const url = "https://ipfs.io/ipfs/".concat(data.image.split("//").pop())


    return (
        <div>
            <p>{data.name}</p>
            <img
                src={url}
            />
        </div>
    );
};

export default IPFSDataDisplay;
