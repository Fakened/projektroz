import React, { useEffect, useState } from "react";
import Rectangle from "../../components/Rectangle/Rectangle";
import ChildDataForm from "../../components/ChildDataForm/ChildDataForm";
import { putChild } from "../../api/crudChild";
import { api } from "../../api/axios";
import {
    getChildData,
    parseBackToFormData,
} from "../../functions/AddChildFunctions";
import "./EditChild.scss";
// import Child from "types/Child";

function EditChild({ title }: { title: string }) {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        birthDate: "",
        birthPlace: "",
        pesel: "",
        admissionDate: "",
        courtDecision: "",
        addressRegisteredCountry: "",
        addressRegisteredCity: "",
        addressRegisteredStreet: "",
        addressRegisteredPostalCode: "",
        addressRegisteredHouseNumber: "",
        addressCurrentCountry: "",
        addressCurrentCity: "",
        addressCurrentStreet: "",
        addressCurrentPostalCode: "",
        addressCurrentHouseNumber: "",
        motherName: "",
        motherSurname: "",
        fatherName: "",
        fatherSurname: "",
    });

    useEffect(() => {
        const dataFromStorage = localStorage.getItem("childData");
        if (dataFromStorage) {
            setFormData(parseBackToFormData(JSON.parse(dataFromStorage)));
            localStorage.removeItem("childData");
        }

        const fetchChildData = async () => {
            const childId = localStorage.getItem("childId");

            const fetchChild = async () => {
                try {
                    const response = await api.get(`children/${childId}`);
                    if (response.status !== 200) {
                        throw new Error("Błąd sieci!");
                    }
                    console.log("Response:", response); // Logowanie odpowiedzi
                    const childData = response.data;
                    setFormData(parseBackToFormData(childData));
                } catch (error: any) {
                    console.error("Error:", error); // Logowanie błędu
                    setError(error.message);
                }
            };

            // const childData = fetchChild;
            // setFormData(parseBackToFormData(childData));
        };

        fetchChildData();
    }, []);

    const [error, setError] = useState("");

    const handleInputChange = (id: string, value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = getChildData(formData);
            console.log("Sending data:", data); // Logowanie danych
            await putChild(data);
            setError("");

            window.location.href = "/dashboard";
        } catch (error: any) {
            console.error("Error:", error); // Logowanie błędu
            setError(error.message);
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

    interface DataInput {
        id: string;
        inputLabel: string;
        placeholder: string;
        type: "date" | "text";
        value?: string;
        regex?: string;
        pattern?: string;
    }

    const dataSets: DataInput[][] = [
        [
            {
                id: "name",
                inputLabel: "Imie",
                placeholder: "Wpisz imię",
                type: "text",
                value: formData.name,
            },
            {
                id: "surname",
                inputLabel: "Nazwisko",
                placeholder: "Wpisz nazwisko",
                type: "text",
                value: formData.surname,
            },
            {
                id: "birthDate",
                inputLabel: "Data Urodzenia",
                placeholder: "Wpisz datę urodzenia",
                type: "date",
                value: formData.birthDate,
                // regex: "^[0-9]{0,2}-?[0-9]{0,2}-?[0-9]{0,4}$",
                // pattern: "d{2}-d{2}-d{4}",
            },
            {
                id: "birthPlace",
                inputLabel: "Miejsce Urodzenia",
                placeholder: "Wpisz miejsce urodzenia",
                type: "text",
                value: formData.birthPlace,
            },
        ],
        [
            {
                id: "pesel",
                inputLabel: "PESEL",
                placeholder: "Wpisz PESEL",
                type: "text",
                value: formData.pesel,
                regex: "[0-9]{11}$",
            },
            {
                id: "admissionDate",
                inputLabel: "Data Przyjęcia",
                placeholder: "Wpisz datę przyjęcia",
                type: "date",
                value: formData.admissionDate,
                // regex: "^[0-9]{2}-[0-9]{2}-[0-9]{4}$",
            },
            {
                id: "courtDecision",
                inputLabel: "Decyzja Sadu",
                placeholder: "Wpisz decyzję sądu",
                type: "text",
                value: formData.courtDecision,
            },
        ],
        [
            {
                id: "addressRegisteredCountry",
                inputLabel: "Kraj Zameldowania",
                placeholder: "Wpisz kraj",
                type: "text",
                value: formData.addressRegisteredCountry,
            },
            {
                id: "addressRegisteredCity",
                inputLabel: "Miasto Zameldowania",
                placeholder: "Wpisz miasto",
                type: "text",
                value: formData.addressRegisteredCity,
            },
            {
                id: "addressRegisteredStreet",
                inputLabel: "Ulica Zameldowania",
                placeholder: "Wpisz ulicę",
                type: "text",
                value: formData.addressRegisteredStreet,
            },
            {
                id: "addressRegisteredPostalCode",
                inputLabel: "Kod Pocztowy Zameldowania",
                placeholder: "Wpisz kod pocztowy",
                type: "text",
                value: formData.addressRegisteredPostalCode,
            },
            {
                id: "addressRegisteredHouseNumber",
                inputLabel: "Numer Domu Zameldowania",
                placeholder: "Wpisz numer domu",
                type: "text",
                value: formData.addressRegisteredHouseNumber,
            },
        ],
        [
            {
                id: "addressCurrentCountry",
                inputLabel: "Kraj Zamieszkania",
                placeholder: "Wpisz kraj",
                type: "text",
                value: formData.addressCurrentCountry,
            },
            {
                id: "addressCurrentCity",
                inputLabel: "Miasto Zamieszkania",
                placeholder: "Wpisz miasto",
                type: "text",
                value: formData.addressCurrentCity,
            },
            {
                id: "addressCurrentStreet",
                inputLabel: "Ulica Zamieszkania",
                placeholder: "Wpisz ulicę",
                type: "text",
                value: formData.addressCurrentStreet,
            },
            {
                id: "addressCurrentPostalCode",
                inputLabel: "Kod pocztowy Zamieszkania",
                placeholder: "Wpisz kod pocztowy",
                type: "text",
                value: formData.addressCurrentPostalCode,
            },
            {
                id: "addressCurrentHouseNumber",
                inputLabel: "Numer domu Zamieszkania",
                placeholder: "Wpisz numer domu",
                type: "text",
                value: formData.addressCurrentHouseNumber,
            },
        ],
        [
            {
                id: "motherName",
                inputLabel: "Imie Matki",
                placeholder: "Wpisz imię matki",
                type: "text",
                value: formData.motherName,
            },
            {
                id: "motherSurname",
                inputLabel: "Nazwisko Matki",
                placeholder: "Wpisz nazwisko matki",
                type: "text",
                value: formData.motherSurname,
            },
        ],
        [
            {
                id: "fatherName",
                inputLabel: "Imie Ojca",
                placeholder: "Wpisz imię ojca",
                type: "text",
                value: formData.fatherName,
            },
            {
                id: "fatherSurname",
                inputLabel: "Nazwisko Ojca",
                placeholder: "Wpisz nazwisko ojca",
                type: "text",
                value: formData.fatherSurname,
            },
        ],
    ];

    return (
        <div className="app-page add-child-page">
            <Rectangle links={links}>
                <div className="child-content">
                    <h2>{title}</h2>
                    <form onSubmit={handleSubmit}>
                        <ChildDataForm
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

export default EditChild;