import SignalingManager from "../../signaling/signalingManager/signalingManager";
import PeerDelegate from "../peer/peerDelegate";
import PeerManager from "../peerManager/peerManager";
import RtcMediaModel from "#/lib/data/mediaModel/rtcMeidaModel";
import {
  SignalingMessage,
  CandidateMessage,
  MediaStatusMessage,
} from "#/lib/data/messaging/signalingMessage";
import Logger from "#/lib/logger/logger";

export default class PeerEventManager implements PeerDelegate {
  private peerManager: PeerManager;

  private signalingManger: SignalingManager;

  constructor(peerManager: PeerManager, signalingManger: SignalingManager) {
    this.peerManager = peerManager;
    this.signalingManger = signalingManger;
  }

  OnSdpCreated = (id: string, sdp: RTCSessionDescription) => {
    if (this.clientIsLocal(id)) {
      return;
    }
    const signalingMessage: SignalingMessage = {
      data: {
        id: {
          origin: this.signalingManger.socket?.id!,
          destination: id,
        },
        sdp: sdp.sdp,
      },
    };
    this.signalingManger.socket?.emit(sdp.type, signalingMessage);
  };

  OnCandidateCreated = (id: string, candidate: RTCIceCandidate | null) => {
    if (this.clientIsLocal(id)) {
      return;
    }
    if (candidate === null) {
      return;
    }
    const candidateMessage: CandidateMessage = {
      data: {
        id: {
          origin: this.signalingManger.socket?.id!,
          destination: id,
        },
        candidate: candidate!.toJSON() as string,
      },
    };
    this.signalingManger.socket?.emit("candidate", candidateMessage);
  };

  OnAddTrack = (id: string, trackEvent: RTCTrackEvent) => {
    Logger.logger().info("peerEventManager", "on add track", [trackEvent, id]);
  };

  OnDisconnected = (id: string) =>
    this.peerManager.handleRemoteDisconnected(id);

  OnMediaStatusUpdated = (id: string, mediaModel: RtcMediaModel) => {
    if (this.signalingManger.socket?.connected) {
      const mediaMessage: MediaStatusMessage = {
        data: {
          id: this.signalingManger.socket.id,
          isAudioMute: mediaModel.isAudioMuted,
          isVideoMute: mediaModel.isVideoMuted,
        },
      };
      this.signalingManger.socket.emit("mediaUpdated", mediaMessage);
    }
  };

  clientIsLocal = (id: string) =>
    this.peerManager
      .Peers()
      .find((x) => x.Id() === id)
      ?.MediaModel().isLocal;
}
