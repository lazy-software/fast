export interface Fast {
    id: string;
    startTime: number;
    endTime: number;
    duration: number; // in milliseconds
}

export interface AppState {
    fasts: Fast[];
    activeFast: {
        id: string;
        startTime: number;
    } | null;
}
