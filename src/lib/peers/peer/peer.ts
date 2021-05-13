import PeerDelegate from "./peerDelegate";
import RtcMediaModel from "#/lib/data/mediaModel/rtcMeidaModel";
import { MediaStatusMessage } from "#/lib/data/messaging/signalingMessage";
import Logger from "#/lib/logger/logger";

export default class Peer {
  public Id = () => this.mediaModel.id;

  public MediaModel() {
    return this.mediaModel;
  }

  private peerConnection?: RTCPeerConnection;

  private delegate: PeerDelegate;

  private mediaModel: RtcMediaModel;

  private rtpSender: RTCRtpSender[] = [];

  private localStream: MediaStream | null = null;

  constructor(id: string, isLocal: boolean, delegate: PeerDelegate) {
    this.delegate = delegate;
    this.mediaModel = new RtcMediaModel(id, isLocal, false, false);
    this.peerConnection = this.settupPeerConntection();
  }

  private settupPeerConntection = () => {
    const pcConfig: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const pc = new RTCPeerConnection(pcConfig);
    pc.ontrack = (evt) => {
      const stream = evt.streams[0];
      const model = new RtcMediaModel(
        this.mediaModel.id,
        this.mediaModel.isLocal,
        this.mediaModel.isAudioMuted,
        this.mediaModel.isVideoMuted
      );
      model.stream = stream;
      this.mediaModel = model;
      this.delegate.OnAddTrack(this.Id(), evt);
    };
    pc.onicecandidate = (evt) => {
      if (evt.candidate != null) {
        this.delegate.OnCandidateCreated(this.Id(), evt.candidate);
      }
    };
    pc.oniceconnectionstatechange = () => {
      switch (pc.iceConnectionState) {
        case "failed":
        case "closed":
        case "disconnected":
          if (this.peerConnection) {
            pc.close();
            this.peerConnection = undefined;
            this.delegate.OnDisconnected(this.Id());
          }
          break;
        default:
          break;
      }
    };
    return pc;
  };

  public addLocalStream = (stream: MediaStream) => {
    this.localStream = stream;
    if (this.mediaModel.isLocal) {
      this.mediaModel.stream = stream;
    }
    stream
      .getTracks()
      .forEach((track) =>
        this.rtpSender.push(this.peerConnection!.addTrack(track, stream))
      );
  };

  public createOfferAsync = async () => {
    if (this.peerConnection === undefined) {
      return;
    }
    try {
      const sdp = await this.peerConnection!.createOffer();
      const payload = this.findPayload(sdp.sdp!, "G722");
      if (payload) {
        sdp.sdp = this.transformSdp(sdp.sdp!, payload);
      }
      console.log("offer:", sdp.sdp!);
      this.peerConnection!.setLocalDescription(sdp);
      this.delegate.OnSdpCreated(this.Id(), sdp);
    } catch (err) {
      Logger.logger().error("peer", "error to create offer", err);
    }
  };

  public createAnswerAsync = async () => {
    if (this.peerConnection === undefined) {
      return;
    }
    try {
      const sdp = await this.peerConnection!.createAnswer();
      const payload = this.findPayload(sdp.sdp!, "G722");
      if (payload) {
        sdp.sdp = this.transformSdp(sdp.sdp!, payload);
      }
      console.log("answer:", sdp.sdp!);
      this.peerConnection.setLocalDescription(sdp);
      this.delegate.OnSdpCreated(this.Id(), sdp);
    } catch (err) {
      Logger.logger().error("peer", "error to create answer", err);
    }
  };

  public setRemoteSdpAsync = async (remoteSdp: RTCSessionDescriptionInit) => {
    Logger.logger().info("peer", "set remote sdp");
    if (this.peerConnection === undefined) {
      return;
    }
    try {
      await this.peerConnection!.setRemoteDescription(remoteSdp);
      if (remoteSdp.type === "offer") {
        await this.createAnswerAsync();
      }
    } catch (err) {
      Logger.logger().error("peer", "set remote sdp error", err);
    }
  };

  public setRemoteCandidate = async (candidate: RTCIceCandidate) => {
    if (this.peerConnection === undefined) {
      return;
    }
    try {
      await this.peerConnection!.addIceCandidate(candidate);
    } catch (err) {
      Logger.logger().error("peer", "set remote candidate", err);
    }
  };

  public onRemoteVideoMuted() {
    this.mediaModel.isVideoMuted = true;
  }

  public onRemoteVideoUnmuted() {
    this.mediaModel.isVideoMuted = false;
  }

  public onRemoteAudioMuted() {
    this.mediaModel.isAudioMuted = true;
  }

  public onRemtoeAudioUnmuted() {
    this.mediaModel.isAudioMuted = false;
  }

  public onRemoteMediaStatusUpdated = (message: MediaStatusMessage) => {
    this.mediaModel.isAudioMuted = message.data.isAudioMute;
    this.mediaModel.isVideoMuted = message.data.isVideoMute;
  };

  public toggleLocalAudioMute = () => {
    this.mediaModel.isAudioMuted = !this.mediaModel.isAudioMuted;
    this.mediaModel.stream!.getAudioTracks()[0].enabled = this.mediaModel.isLocal;
    this.delegate.OnMediaStatusUpdated(this.Id(), this.mediaModel);
  };

  public tollgleLocalVideoMute = () => {
    this.mediaModel.isVideoMuted = !this.mediaModel.isVideoMuted;
    this.mediaModel.stream!.getVideoTracks()[0].enabled = !this.mediaModel
      .isVideoMuted;
    this.delegate.OnMediaStatusUpdated(this.Id(), this.mediaModel);
  };

  private findPayload = (sdp: string, codec: string) => {
    const lines = sdp.split("\n").map((l) => l.trim());
    const fmtpLines = lines.filter((line) => line.includes("a=rtpmap"));
    let payload = "";
    fmtpLines.forEach((fmtp) => {
      const el = fmtp.split(" ");
      const value = el[1].toLowerCase().split("/")[0];
      if (value === codec.toLowerCase()) {
        // eslint-disable-next-line prefer-destructuring
        payload = el[0].split(":")[1];
      }
    });
    return payload;
  };

  private transformSdp = (sdp: string, payload: string) => {
    const lines = sdp.split("\n").map((l) => l.trim());
    let targetIndex = -1;
    let newLine;

    lines.forEach((line, index) => {
      if (line.indexOf("m=audio") === 0) {
        targetIndex = index;
        const el = line.split(" ");
        if (!el.includes(payload)) {
          return;
        }
        let payloads = el.slice(3);
        payloads = payloads.filter((p) => p !== payload);
        payloads.unshift(payload);
        const head = el.slice(0, 3);
        const newLineEls = head.concat(payloads);
        newLine = newLineEls.join(" ");
      }
    });
    if (newLine && targetIndex !== -1) {
      lines[targetIndex] = newLine;
    }
    return lines.join("\n");
  };
}
