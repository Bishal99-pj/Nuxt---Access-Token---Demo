export type Branches = {
    data: Branch[];
}

export type Branch = {
    id: string;
    name: string;
    status: number;
    geolocation: Geoposition;
    details: string;
    address_id: string;
    address: string[];
    address_text: string;
    postcode: string;
    contact_number: ContactNumber;
    parking_available: boolean;
    click_and_collect_available: boolean;
    opening_hours: OpeningHour[];
    distance?: number;
}

export type ContactNumber = "0330 333 3303";

export type Geoposition = {
    latitude: string;
    longitude: string;
}

export type OpeningHour = "Mon - Fri: 0700-2000" | "Sat: 0700-1800" | "Sun: 1000-1600" | "Sun: 0900-1600" | "Mon - Fri: 0700-1900" | "Mon - Fri: 0630-2000" | "Sat: 0630-1800" | "Sun: 0900-1600 " | "Sat: 0800-1800" | "Mon - Fri: 0600-2000" | "Sat: 0630-1900" | "Sat: 0700-1900" | "Sat: 0600-1900" | "Mon - Fri: 0700-1800" | "Mon - Fri: 0730-2000" | "Sat: 0830-1800" | "Bank Hol: 0700-1900" | "Bank Hol: 0700-1700";
