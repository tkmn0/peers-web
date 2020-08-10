import RtcMediaModel from "#/lib/data/mediaModel/rtcMeidaModel";
export default interface PeerDelegate {
    OnSdpCreated(id: string, sdp: RTCSessionDescriptionInit): void;
    OnCandidateCreated(id: string, candidate: RTCIceCandidate | null): void;
    OnAddTrack(id: string, track: RTCTrackEvent): void;
    OnDisconnected(id: string): void;
    OnMediaStatusUpdated(id: string, mediaModel: RtcMediaModel): void;
}
