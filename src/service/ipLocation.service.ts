import axios from "axios";  

export const getIpLocation = async (ip: string) => {
    try
    {
        const token = process.env.IPSTACK_API_KEY;
    
        const res = await axios.get<{ loc?: string; city?: string; region?: string; country?: string }>(`https://ipinfo.io/${ip}?token=${token}`);
    
        if(!res.data.loc)return null;

        const [lat, lng] = res.data.loc.split(",");

        return {
            city: res.data.city,
            region: res.data.region,
            country: res.data.country,
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        };

    }
    catch(error)
    {
        console.log("❌Error fetching IP location:", error);

        return null;
    }
}