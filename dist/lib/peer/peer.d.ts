import PeerDelegate from "./peerDelegate";
import RtcMediaModel from "#/lib/data/mediaModel/rtcMeidaModel";
import { MediaStatusMessage } from "#/lib/data/messaging/signalingMessage";
export default class Peer {
    Id: () => string;
    MediaModel(): RtcMediaModel;
    private peerConnection?;
    private delegate;
    private mediaModel;
    private rtpSender;
    private localStream;
    constructor(id: string, isLocal: boolean, delegate: PeerDelegate);
    private settupPeerConntection;
    addLocalStream: (stream: MediaStream) => void;
    createOfferAsync: () => Promise<void>;
    createAnswerAsync: () => Promise<void>;
    setRemoteSdpAsync: (remoteSdp: RTCSessionDescriptionInit) => Promise<void>;
    setRemoteCandidate: (candidate: RTCIceCandidate) => Promise<void>;
    onRemoteVideoMuted(): void;
    onRemoteVideoUnmuted(): void;
    onRemoteAudioMuted(): void;
    onRemtoeAudioUnmuted(): void;
    onRemoteMediaStatusUpdated: (message: MediaStatusMessage) => void;
    toggleLocalAudioMute: () => void;
    tollgleLocalVideoMute: () => void;
}
