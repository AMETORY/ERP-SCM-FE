export interface LocationData {
    formattedAddress: string;
    location: {
        latitude: number;
        longitude: number;
    };
    displayName: {
        text: string;
    };
}
