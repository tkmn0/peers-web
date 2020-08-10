import SignalingDelegate from "./signalingDelegate";
import RtcMediaModel from "#/lib/data/mediaModel/rtcMeidaModel";
export default class SignalingManager {
    socket: SocketIOClient.Socket | null;
    delegate?: SignalingDelegate;
    setupWebSocket: () => void;
    private setupSignalingEvent;
    emitLocalMediaStatus: (mediaModel: RtcMediaModel) => void;
    callToOthers: (roomId: string) => void;
}
