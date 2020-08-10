import {
  SignalingMessage,
  CandidateMessage,
  MediaStatusMessage,
} from "#/lib/data/messaging/signalingMessage";
import Logger from "#/lib/logger/logger";
import Peer from "#/lib/peers/peer/peer";
import PeerDelegate from "#/lib/peers/peer/peerDelegate";

export default class PeerManager {
  private peers: Peer[] = [];

  public Peers() {
    return this.peers;
  }

  public LocalClient = () => this.peers.find((x) => x.MediaModel().isLocal);

  private localStream: MediaStream | null = null;

  public LocalStream = () => this.localStream;

  public setupLocalStream = (stream: MediaStream) => {
    this.localStream = stream;
    this.LocalClient()?.addLocalStream(stream);
  };

  peerDelegate?: PeerDelegate;

  public createLocalClient = (id: string) => {
    Logger.logger().info("peerManager", "create local client");
    const peer = new Peer(id, true, this.peerDelegate!);
    this.peers.push(peer);
  };

  public handleCall = async (ids: string[]) => {
    Logger.logger().info("peerManger", "handle call", ids);
    ids.forEach(async (id) => {
      const peer = new Peer(id, false, this.peerDelegate!);
      this.peers.push(peer);
      peer.addLocalStream(this.localStream!);
      await peer.createOfferAsync();
    });
  };

  public handleRemoteOffer = (message: SignalingMessage) => {
    Logger.logger().info("peerManager", "handle remote offer", [message]);
    const sdpInit: RTCSessionDescriptionInit = {
      type: "offer",
      sdp: message.data.sdp,
    };

    const peer = new Peer(message.data.id.origin, false, this.peerDelegate!);
    this.peers.push(peer);
    peer.addLocalStream(this.localStream!);
    peer.setRemoteSdpAsync(sdpInit);
  };

  public handleRemoteAnswer = (message: SignalingMessage) => {
    Logger.logger().info("peerManager", "handle remote answer", [message]);

    const sdpInit: RTCSessionDescriptionInit = {
      type: "answer",
      sdp: message.data.sdp,
    };

    const peer = this.peers.find((x) => x.Id() === message.data.id.origin);
    peer?.setRemoteSdpAsync(sdpInit);
  };

  public handleRemoteCandidate = (message: CandidateMessage) => {
    Logger.logger().info("peerManager", "handle remote candidate", [message]);

    const candidate: RTCIceCandidate = JSON.parse(
      JSON.stringify(message.data.candidate)
    );
    const peer = this.peers.find((x) => x.Id() === message.data.id.origin);
    peer?.setRemoteCandidate(new RTCIceCandidate(candidate));
  };

  public handleRemoteDisconnected = (id: string) => {
    Logger.logger().info("peerManager", "handle remote disconnected", [id]);

    this.peers = this.peers.filter((x) => x.Id() !== id);
  };

  public handleRemoteMediaUpdated = (message: MediaStatusMessage) => {
    Logger.logger().info("peerManager", "handle remote media status updated", [
      message,
    ]);

    const peer = this.peers.find((x) => x.Id() === message.data.id);
    peer?.onRemoteMediaStatusUpdated(message);
  };
}
