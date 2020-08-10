import SignalingDelegate from "../signalingManager/signalingDelegate";
import { SignalingMessage, CandidateMessage, MediaStatusMessage } from "#/lib/data/messaging/signalingMessage";
import PeerManager from "../peerManager/peerManager";
export default class SignalingEventManger implements SignalingDelegate {
    private peerManager;
    constructor(peerManager: PeerManager);
    onConnected(id: string): void;
    onRemoteOffer(message: SignalingMessage): void;
    onRemoteAnswer(message: SignalingMessage): void;
    onRemoteCandidate(message: CandidateMessage): void;
    onRemoteDisconnected(id: string): void;
    onRemoteMediaStatusUpdated(message: MediaStatusMessage): void;
    onCall: (ids: string[]) => void;
}
