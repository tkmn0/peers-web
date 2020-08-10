import SignalingManager from "../../signaling/signalingManager/signalingManager";
import PeerDelegate from "../peer/peerDelegate";
import PeerManager from "../peerManager/peerManager";
import RtcMediaModel from "#/lib/data/mediaModel/rtcMeidaModel";
export default class PeerEventManager implements PeerDelegate {
    private peerManager;
    private signalingManger;
    constructor(peerManager: PeerManager, signalingManger: SignalingManager);
    OnSdpCreated: (id: string, sdp: RTCSessionDescription) => void;
    OnCandidateCreated: (id: string, candidate: RTCIceCandidate | null) => void;
    OnAddTrack: (id: string, trackEvent: RTCTrackEvent) => void;
    OnDisconnected: (id: string) => void;
    OnMediaStatusUpdated: (id: string, mediaModel: RtcMediaModel) => void;
    clientIsLocal: (id: string) => boolean | undefined;
}
