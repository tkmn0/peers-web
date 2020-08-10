interface CreateOfferMessage {
    data: {
        ids: string[];
    };
}
interface Transaction {
    origin: string;
    destination: string;
}
interface SignalingMessage {
    data: {
        id: Transaction;
        sdp: string;
    };
}
interface CandidateMessage {
    data: {
        id: Transaction;
        candidate: string;
    };
}
interface RoomInfoMessage {
    data: {
        roomId: string;
    };
}
interface MediaStatusMessage {
    data: {
        id: string;
        isAudioMute: boolean;
        isVideoMute: boolean;
    };
}
interface RemoteDisconnectedMessage {
    data: {
        id: string;
    };
}
export { CreateOfferMessage, SignalingMessage, CandidateMessage, RoomInfoMessage, MediaStatusMessage, RemoteDisconnectedMessage, };
