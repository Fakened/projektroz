import React, { useEffect, useState } from "react";
import Rectangle from "../../components/Rectangle/Rectangle";
import DocumentDataForm from "../../components/DocumentDataForm/DocumentDataForm";
import { addDocument, addDocumentFile } from "../../api/addDocument";
import {
    getDocumentData,
    getDocumentFile,
} from "../../functions/AddDocumentFunctions";
import "./AddDocuments.scss";

function AddDocuments({ title, method }: { title: string; method: string }) {
    const [childId, setChildId] = useState("");
    const [formData, setFormData] = useState({
        file: new File([""], "filename"),
        document_path: "",
        child: 1,
        category: 1,
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const id = window.location.pathname.split("/").pop();
        if (id) setChildId(id);
    }, []);

    const handleInputChange = (id: string, value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const file = getDocumentFile(formData).file;
            console.log("Sending file:", file); // Logowanie pliku
            const response = await addDocumentFile(file);
            if (response.status === 200) {
                console.log("File uploaded successfully");
                formData.document_path = response.data.document_path;
            }
        } catch (error: any) {
            console.error("Error:", error); // Logowanie błędu
            setError(error.message);
            return;
        }
        try {
            const data = getDocumentData(formData);
            console.log("Sending data:", data); // Logowanie danych
            await addDocument(data, method);

            window.location.href = `/dashboard/manage-child/${childId}`;
        } catch (error: any) {
            console.error("Error:", error); // Logowanie błędu
            setError(error.message);
            return;
        }
    };

    const links = [
        {
            name: "Panel sterowania",
            url: "/dashboard",
            icon: "../src/assets/icons/manage.png",
        },
        {
            name: "Wyloguj",
            url: "/logout",
            icon: "../src/assets/icons/logout.png",
        },
    ];

    interface DocumentInput {
        id: string;
        inputLabel: string;
        type: "file" | "text";
    }

    const dataSets: DocumentInput[][] = [
        [
            {
                id: "filename",
                inputLabel: "Nazwa pliku",
                type: "file",
            },
        ],
    ];

    return (
        <div className="app-page add-documents-page">
            <Rectangle links={links}>
                <div className="document-content">
                    <h2>{title}</h2>
                    <form onSubmit={handleSubmit}>
                        <DocumentDataForm
                            dataSets={dataSets}
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                    </form>
                    {error && <div className="error">{error}</div>}
                </div>
            </Rectangle>
        </div>
    );
}

export default AddDocuments;