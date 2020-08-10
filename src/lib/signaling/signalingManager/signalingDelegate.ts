import {
  SignalingMessage,
  CandidateMessage,
  MediaStatusMessage,
} from "#/lib/data/messaging/signalingMessage";

export default interface SignalingDelegate {
  onConnected(id: string): void;
  onCall(ids: string[]): void;
  onRemoteOffer(message: SignalingMessage): void;
  onRemoteAnswer(message: SignalingMessage): void;
  onRemoteCandidate(message: CandidateMessage): void;
  onRemoteDisconnected(id: string): void;
  onRemoteMediaStatusUpdated(message: MediaStatusMessage): void;
}
