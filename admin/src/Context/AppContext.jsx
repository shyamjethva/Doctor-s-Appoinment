import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = '$'

    const calculateAge = (dob) => {
        if (!dob) return "N/A";

        const today = new Date();
        const birthdate = new Date(dob);

        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDiff = today.getMonth() - birthdate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
    }


    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDataFormate = (slotDate) => {
        if (!slotDate) return "";

        const [day, month, yearRaw] = slotDate.split('/');
        let yearNum = yearRaw === "125" ? 2025 : Number(yearRaw);

        const monthName = monthNames[Number(month) - 1];
        return `${day} ${monthName} ${yearNum}`;
    };



    const value = {

        calculateAge,
        slotDataFormate,
        currency


    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}


export default AppContextProvider
