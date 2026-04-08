import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VideoCallConfig {
  roomId: string;
  userName: string;
  isHost: boolean;
  courseId?: number;
  courseName?: string;
}

export interface VideoCallState {
  isInCall: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  participants: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private callStateSubject = new BehaviorSubject<VideoCallState>({
    isInCall: false,
    isMuted: false,
    isVideoOff: false,
    participants: 0
  });

  public callState$ = this.callStateSubject.asObservable();

  private localStream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;

  // Initialize video call
  async startCall(config: VideoCallConfig): Promise<void> {
    try {
      // Request camera and microphone permissions
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      this.updateCallState({ isInCall: true, participants: 1 });
      
      // In a real app, you would set up WebRTC peer connections here
      console.log('Video call started:', config);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error starting video call:', error);
      throw error;
    }
  }

  // Join existing call
  async joinCall(roomId: string, userName: string): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      this.updateCallState({ isInCall: true });
      
      console.log(`${userName} joined room: ${roomId}`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error joining call:', error);
      throw error;
    }
  }

  // End call
  endCall(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.updateCallState({
      isInCall: false,
      isMuted: false,
      isVideoOff: false,
      participants: 0
    });
  }

  // Toggle mute
  toggleMute(): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.updateCallState({ isMuted: !audioTrack.enabled });
      }
    }
  }

  // Toggle video
  toggleVideo(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.updateCallState({ isVideoOff: !videoTrack.enabled });
      }
    }
  }

  // Get local stream
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  // Generate Zoom meeting link (placeholder)
  generateZoomLink(courseId: number, courseName: string): string {
    // In production, this would call your backend to create a Zoom meeting
    return `https://zoom.us/j/demo-${courseId}?pwd=demo`;
  }

  // Generate Google Meet link (placeholder)
  generateGoogleMeetLink(courseId: number, courseName: string): string {
    // In production, this would call your backend to create a Google Meet
    return `https://meet.google.com/demo-${courseId}`;
  }

  private updateCallState(update: Partial<VideoCallState>): void {
    const current = this.callStateSubject.value;
    this.callStateSubject.next({ ...current, ...update });
  }

  // Share screen
  async shareScreen(): Promise<MediaStream | null> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      return screenStream;
    } catch (error) {
      console.error('Error sharing screen:', error);
      return null;
    }
  }
}
