import { useState } from "react";
import './Uploader.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'


export function App({ onChange, image, fileName, onClick }) {
    // const [image, setImage] = useState(null)
    // const [fileName, setFileName] = useState("No selected file")
    // const [file, setFile] = useState(null);

    // const handleImageChange = async (e) => {
    //     // setFile(e.target.files[0]);
    //     const selectedFile = e.target.files[0];
    //     setFile(selectedFile);

    //     if (selectedFile) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImage(reader.result);
    //             setFileName(selectedFile.name)
    //         };
    //         reader.readAsDataURL(selectedFile);
    //     }
    // };

    return (
        <main>
            <form action=""
                onClick={() => document.querySelector(".input-field").click()}>
                <input type="file" accept="image/*" className="input-field" hidden
                    onChange={onChange}>

                </input>
                {image ? <img src={image} height={'300px'}  alt={fileName}></img>
                    :
                    <>
                        <MdCloudUpload color="#1475cf" size={60}></MdCloudUpload>
                        <p>Browse Image to upload</p>
                    </>
                }
            </form>
            <section className="uploaded-row">
                <AiFillFileImage color="#1475cf"></AiFillFileImage>
                <span className="upload-content">
                    {fileName}
                    <MdDelete
                        onClick={
                            onClick
                        }></MdDelete>
                </span>
            </section>
        </main >
    )
}

