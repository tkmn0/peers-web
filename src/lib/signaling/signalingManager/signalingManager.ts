import io from "socket.io-client";
import SignalingDelegate from "./signalingDelegate";
import RtcMediaModel from "#/lib/data/mediaModel/rtcMeidaModel";
import {
  SignalingMessage,
  CandidateMessage,
  MediaStatusMessage,
  CreateOfferMessage,
  RemoteDisconnectedMessage,
} from "#/lib/data/messaging/signalingMessage";

export default class SignalingManager {
  socket: SocketIOClient.Socket | null = null;

  delegate?: SignalingDelegate;

  public setupWebSocket = (uri: string) => {
    this.socket = io(uri);
    this.setupSignalingEvent();
  };

  private setupSignalingEvent = () => {
    this.socket?.on("connect", () =>
      this.delegate?.onConnected(this.socket?.id!)
    );
    this.socket?.on("remote-offer", (evt: SignalingMessage) => {
      this.delegate?.onRemoteOffer(evt);
    });
    this.socket?.on("remote-answer", (evt: SignalingMessage) => {
      this.delegate?.onRemoteAnswer(evt);
    });
    this.socket?.on("remote-candidate", (evt: CandidateMessage) => {
      this.delegate?.onRemoteCandidate(evt);
    });
    this.socket?.on("remote-disconnected", (evt: RemoteDisconnectedMessage) =>
      this.delegate?.onRemoteDisconnected(evt.data.id)
    );
    this.socket?.on("remote-media-updated", (evt: MediaStatusMessage) =>
      this.delegate?.onRemoteMediaStatusUpdated(evt)
    );
    this.socket?.on("call", (evt: CreateOfferMessage) => {
      this.delegate?.onCall(evt.data.ids);
    });
  };

  public emitLocalMediaStatus = (mediaModel: RtcMediaModel) => {
    const mediaMessage = {
      data: {
        id: this.socket?.id!,
        isAudioMute: mediaModel.isAudioMuted,
        isVideoMute: mediaModel.isVideoMuted,
      },
    };
    this.socket?.emit("mediaUpdated", mediaMessage);
  };

  public callToOthers = (roomId: string) => {
    const roomInfo = {
      data: {
        roomId,
      },
    };
    this.socket?.emit("callToOthers", roomInfo);
  };
}
