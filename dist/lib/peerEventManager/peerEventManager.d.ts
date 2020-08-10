import PeerDelegate from "../peers/peer/peerDelegate";
import RtcMediaModel from "#/lib/data/mediaModel/rtcMeidaModel";
import PeerManager from "../peers/peerManager/peerManager";
import SignalingManager from "../signaling/signalingManager/signalingManager";
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
