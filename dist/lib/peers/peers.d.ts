import LogLevel from "../logger/logLevel";
export default class Peers {
    private peerManager;
    private peerEventManager;
    private signalingManager;
    private signalingEventManager;
    private roomId;
    RoomJoined: () => boolean;
    MediaModels(): import("../data/mediaModel/rtcMeidaModel").default[];
    LocalStream: () => MediaStream | null;
    setLogLevel: (level: LogLevel) => void;
    constructor();
    setupConnection(uri: string): void;
    destroy: () => void;
    addLocalStram: (stream: MediaStream) => void;
    joinRoom: (roomId: string) => void;
    toggleLocalAudioMute: () => void | undefined;
    toggleLocalVideoMute: () => void | undefined;
}
