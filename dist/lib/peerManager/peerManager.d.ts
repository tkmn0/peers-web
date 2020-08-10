import Peer from "#/lib/peers/peer/peer";
import PeerDelegate from "#/lib/peers/peer/peerDelegate";
import { SignalingMessage, CandidateMessage, MediaStatusMessage } from "#/lib/data/messaging/signalingMessage";
export default class PeerManager {
    private peers;
    Peers(): Peer[];
    LocalClient: () => Peer | undefined;
    private localStream;
    LocalStream: () => MediaStream | null;
    setupLocalStream: (stream: MediaStream) => void;
    peerDelegate?: PeerDelegate;
    createLocalClient: (id: string) => void;
    handleCall: (ids: string[]) => Promise<void>;
    handleRemoteOffer: (message: SignalingMessage) => void;
    handleRemoteAnswer: (message: SignalingMessage) => void;
    handleRemoteCandidate: (message: CandidateMessage) => void;
    handleRemoteDisconnected: (id: string) => void;
    handleRemoteMediaUpdated: (message: MediaStatusMessage) => void;
}
