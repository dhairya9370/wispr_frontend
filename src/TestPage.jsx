import { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';
import EmptyRightPane from "./ChatComponents/EmptyRightPane";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function TestPage() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const imageRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile?.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else if (selectedFile?.type === "application/pdf") {
            const fileReader = new FileReader();
            fileReader.onload = async function () {
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;
                setPreviewUrl(canvas.toDataURL());
            };
            fileReader.readAsArrayBuffer(selectedFile);
        } else {
            setPreviewUrl(null); // Don't preview unsupported types
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then(async (data) => {
                console.log("Upload success:", data);

                // render PDF first page from Cloudinary URL
                if (data.type === "application/pdf") {
                    const response = await fetch(data.url);
                    const buffer = await response.arrayBuffer();
                    const pdf = await pdfjs.getDocument({ data: buffer }).promise;
                    const page = await pdf.getPage(1);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({ canvasContext: context, viewport }).promise;
                    setPreviewUrl(canvas.toDataURL());
                } else if (data.type.startsWith("image/")) {
                    setPreviewUrl(data.url); // image preview
                } else {
                    setPreviewUrl(null);
                }
            })
            .catch((err) => {
                console.error("Upload error:", err);
            });
    };


    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let item of items) {
            if (item.type.startsWith("image")) {
                const file = item.getAsFile();
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith("image")) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    return (
        <Box>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <input
                    ref={imageRef}
                    name="file"
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    onPaste={handlePaste}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                />
                <button type="submit">Submit</button>
            </form>

            {previewUrl && (
                <Box mt={2}>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                            maxWidth: "300px",
                            maxHeight: "300px",
                            // filter: "blur(2px)",
                            borderRadius: "8px"
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}

