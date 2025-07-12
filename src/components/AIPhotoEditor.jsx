/****************************************************************
 * Copyright (c) 2023-2025 Dmytro Ostapenko. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *****************************************************************/

import React, {useEffect, useState} from 'react';
import {MaterialButton24, MaterialButtonTonal24,} from "../widgets/MaterialButton";
import {MaterialEditText} from "../widgets/MaterialEditText";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import {supportedFileTypes} from "../util/ModelTypeConverter";
import OpenAI from "openai";
import {findOpenAIEndpointIdOrNull, getApiEndpointById, migrateFromLegacyAPIs} from "../util/Settings";

function AiPhotoEditor(props) {

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [inPhoto, setInPhoto] = useState(null);
    const [inFilePrepared, setInFilePrepared] = useState(null);
    const [outPhoto, setOutPhoto] = useState(null);
    const [errorSnackBar, setErrorSnackBar] = React.useState(false);
    const [errorSnackBarMessage, setErrorSnackBarMessage] = React.useState("");

    useEffect(() => {
        if (inPhoto !== null) {
            const img = document.getElementById('image');
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            let scale = 1;
            img.onload = () => {
                // Calculate the best fit size for the image
                scale = Math.min(1024 / img.width, 1024 / img.height);
                const x = 0;
                const y = 0;
                const width = img.width * scale;
                const height = img.height * scale;

                // Set canvas dimensions
                canvas.width = 1024;
                canvas.height = 1024;

                // Clear the canvas and draw the resized image
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, x, y, width, height);
            }

            // Initially fill the canvas with a transparent mask if needed
            ctx.fillStyle = "rgba(0, 0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let isDrawing = false;

            canvas.onmousedown = function(e) {
                isDrawing = true;
                ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
                ctx.beginPath(); // Begin the drawing path
            };

            canvas.onmousemove = function(e) {
                if (isDrawing) {
                    const scale = Math.floor(1024 / 500)
                    const x = (e.clientX - canvas.offsetLeft - 90) * scale;
                    const y = (e.clientY - canvas.offsetTop) * scale;
                    ctx.lineTo(x, y);
                    ctx.globalCompositeOperation = 'destination-out'
                    ctx.lineWidth = 50; // Width of the mask line
                    ctx.stroke();
                }
            };

            canvas.onmouseup = function() {
                isDrawing = false;
            };

            canvas.onmouseout = function() {
                isDrawing = false; // Stop drawing when the cursor leaves the canvas
            };

            // Initialize canvas background as transparent black for masking effect
            ctx.fillStyle = "rgba(0, 0, 0, 0)"; // Adjust transparency as needed
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [inPhoto]);

    function canvasToImageFile(canvasElement, fileName) {
        // Step 1: Retrieve the Data URL from the canvas
        const imageDataUrl = canvasElement.toDataURL('image/png');  // Consider changing the MIME type depending on your needs, e.g., 'image/jpeg'

        // Step 2: Convert the Data URL to a Blob
        const data = atob(imageDataUrl.split(',')[1]); // Decode the base64 data
        const arrayBuffer = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i++) {
            arrayBuffer[i] = data.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer.buffer], {type: 'image/png'}); // Adjust the 'type' based on the data URL MIME type

        // Step 3: Convert Blob to File
        return new File([blob], fileName, {type: 'image/png'});
    }

    const processFile = (file) => {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                window.Jimp.read(e.target.result).then((image) => {
                    // console.log(image)
                    if (!image.hasAlpha()) { //Check if image has opacity
                        image = image.opacity(1); //Add if it doesn't
                    }

                    image.getBase64(window.Jimp.AUTO, (err, src) => {
                        if (err) throw err;

                        setInPhoto(src)
                    });

                    image.getBuffer(window.Jimp.MIME_PNG, (err, buffer) => {
                        const blob = new Blob([buffer], {type: window.Jimp.MIME_PNG});
                        const processedFile = new File([blob], "in.png", {type: window.Jimp.MIME_PNG});
                        setInFilePrepared(processedFile);
                    });
                }).catch((e) => {
                    setErrorSnackBarMessage("Unsupported file type. Supported images format: jpg, png, gif, webp");
                    setErrorSnackBar(true);
                    console.error(e);
                })
                let srcData = e.target.result;
                let fileType = file.type;

                if (supportedFileTypes.includes(fileType)) {
                    setInPhoto(srcData);
                } else {
                    setErrorSnackBarMessage("Unsupported file type. Supported images format: jpg, png, gif, webp");
                    setErrorSnackBar(true);
                }
            }

            reader.readAsArrayBuffer(file);
        } catch (e) {
            console.error("Error processing file", e);
            setErrorSnackBarMessage("Failed to read file.");
            setErrorSnackBar(true);
        }
    }

    const processPhoto = () => {
        setLoading(true);

        sendRequest().then((response) => {
            setLoading(false);
            setOutPhoto(response);
        }).catch((e) => {
            setLoading(false);
            setErrorSnackBarMessage("Failed to process photo: " + e.message);
            setErrorSnackBar(true);
            console.error(e)
        })
    }

    const sendRequest = async () => {
        migrateFromLegacyAPIs()

        if (findOpenAIEndpointIdOrNull() !== null) {
            const openai = new OpenAI({
                apiKey: getApiEndpointById(findOpenAIEndpointIdOrNull()).key,
                dangerouslyAllowBrowser: true,
                baseURL: getApiEndpointById(findOpenAIEndpointIdOrNull()).url
            });

            const canvas = document.getElementById('canvas');
            const fileMask = canvasToImageFile(canvas, 'mask.png');

            const response = await openai.images.edit({
                image: inFilePrepared,
                prompt: input.toString(),
                mask: fileMask,
                n: 1,
                size: "1024x1024",
            });
            return response.data[0].url;
        } else {
            setErrorSnackBarMessage("This feature requires OpenAI endpoint. Open quick assistant settings and add OpenAI endpoint.");
            setErrorSnackBar(true);
            return "";
        }
    }

    return (
        <div>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={errorSnackBar} autoHideDuration={6000} onClose={() => {
                setErrorSnackBar(false);
            }}>
                <Alert
                    onClose={() => {
                        setErrorSnackBar(false);
                    }}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorSnackBarMessage}
                </Alert>
            </Snackbar>
            <div className={"app-bar"}>
                <h2 style={{
                    marginLeft: "24px",
                }}>AI Photo Editor</h2>
            </div>
            <div className={"photo-panel"}>
                <div className={"photo-block"}>
                    <div className={"container-actions"}>
                        <MaterialButtonTonal24 className={"select-file"}><span style={{
                            fontSize: "20px",
                        }} className={"material-symbols-outlined"}>photo</span>&nbsp;&nbsp;Select a photo<input
                            className={"visually-hidden-input-v2"} onChange={(e) => {
                            if (e.target.files.length !== 0) {
                                processFile(e.target.files[0])
                            }
                        }} type="file"/></MaterialButtonTonal24>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <MaterialButton24 disabled={loading} onClick={() => {
                            processPhoto();
                        }}>Generate photo edit</MaterialButton24>
                    </div>

                    <div className={"photo-container"}>
                        {inPhoto ? <img alt={"User input"} style={{display: "none"}} id={"image"} src={inPhoto}
                                        className={"photo-editor-image"}/> : <></>}
                        <canvas id={"canvas"} className={"photo-editor-image"}></canvas>
                    </div>
                    <MaterialEditText variant="filled" sx={{
                        '& .MuiFilledInput-root:after': {
                            borderBottomColor: 'var(--color-accent-800)',
                        },
                    }} InputLabelProps={{shrink: true}} rows={7} id={"iInput"} value={input} label={"Edit prompt"}
                                      multiline onChange={(e) => setInput(e.target.value)}></MaterialEditText>

                    <br/>
                    <p style={{
                        margin: "0",
                        width: "calc(100% - 32px)"
                    }} className={"hint"}>To use photo editor you will need to draw a mask over the image. Erase object you want to change and write a prompt. Currently DALL-e 2 only is supported.</p>
                </div>
                <div className={"photo-block"}>
                    <p className={"ai-photo-result-title"}>Edited photo will appear here</p>
                    <div className={"photo-container"}>
                        {loading ? <CircularProgress style={{color: "var(--color-accent-900)"}}/> :
                            <>
                                {outPhoto ? <img alt={"AI Generated output"} src={outPhoto} className={"photo-editor-image"}/> : <></>}
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AiPhotoEditor;