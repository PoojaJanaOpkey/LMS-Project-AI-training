import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoCallService, VideoCallState } from '../../../core/services/video-call.service';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="video-call-container" *ngIf="callState.isInCall">
      <div class="video-grid">
        <div class="video-wrapper">
          <video #localVideo autoplay muted playsinline class="local-video"></video>
          <div class="video-label">You</div>
        </div>
        
        <!-- Remote videos would be added dynamically here -->
        <div class="video-wrapper" *ngFor="let participant of [1,2,3] | slice:0:callState.participants-1">
          <div class="video-placeholder">
            <i class="bi bi-person-circle fs-1"></i>
            <p>Participant {{ participant }}</p>
          </div>
        </div>
      </div>
      
      <div class="video-controls">
        <button 
          class="btn btn-control"
          [class.active]="callState.isMuted"
          (click)="toggleMute()"
          title="Toggle Microphone">
          <i class="bi" [ngClass]="callState.isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'"></i>
        </button>
        
        <button 
          class="btn btn-control"
          [class.active]="callState.isVideoOff"
          (click)="toggleVideo()"
          title="Toggle Camera">
          <i class="bi" [ngClass]="callState.isVideoOff ? 'bi-camera-video-off-fill' : 'bi-camera-video-fill'"></i>
        </button>
        
        <button 
          class="btn btn-control"
          (click)="shareScreen()"
          title="Share Screen">
          <i class="bi bi-display"></i>
        </button>
        
        <button 
          class="btn btn-control btn-danger"
          (click)="endCall()"
          title="End Call">
          <i class="bi bi-telephone-x-fill"></i>
        </button>
      </div>
      
      <div class="participants-count">
        <i class="bi bi-people-fill me-2"></i>{{ callState.participants }} participant(s)
      </div>
    </div>
    
    <!-- Join Call Modal -->
    <div class="modal fade" id="joinCallModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Join Video Call</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Your Name</label>
              <input type="text" class="form-control" [(ngModel)]="userName" placeholder="Enter your name">
            </div>
            <div class="mb-3">
              <label class="form-label">Room ID</label>
              <input type="text" class="form-control" [(ngModel)]="roomId" placeholder="Enter room ID">
            </div>
            <div class="text-center mb-3">
              <video #previewVideo autoplay muted playsinline class="preview-video"></video>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="joinCall()" data-bs-dismiss="modal">
              <i class="bi bi-camera-video me-2"></i>Join Call
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-call-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #1a1a1a;
      z-index: 9999;
    }
    
    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 10px;
      padding: 20px;
      height: calc(100vh - 100px);
    }
    
    .video-wrapper {
      position: relative;
      background: #2a2a2a;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .local-video,
    .remote-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .video-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #fff;
    }
    
    .video-label {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .video-controls {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 15px;
      background: rgba(0, 0, 0, 0.8);
      padding: 15px;
      border-radius: 50px;
    }
    
    .btn-control {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #fff;
      border: none;
      color: #333;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    
    .btn-control:hover {
      transform: scale(1.1);
    }
    
    .btn-control.active {
      background: #dc3545;
      color: #fff;
    }
    
    .btn-control.btn-danger {
      background: #dc3545;
      color: #fff;
    }
    
    .participants-count {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 10px 20px;
      border-radius: 20px;
    }
    
    .preview-video {
      width: 100%;
      max-width: 400px;
      border-radius: 8px;
      background: #000;
    }
  `]
})
export class VideoCallComponent implements OnInit, OnDestroy {
  private videoCallService = inject(VideoCallService);
  
  callState: VideoCallState = {
    isInCall: false,
    isMuted: false,
    isVideoOff: false,
    participants: 0
  };
  
  userName = '';
  roomId = '';

  ngOnInit(): void {
    this.videoCallService.callState$.subscribe(state => {
      this.callState = state;
      this.updateVideoStream();
    });
  }

  ngOnDestroy(): void {
    this.endCall();
  }

  async joinCall(): Promise<void> {
    try {
      await this.videoCallService.joinCall(this.roomId, this.userName);
    } catch (error) {
      console.error('Failed to join call:', error);
      alert('Failed to join call. Please check your camera and microphone permissions.');
    }
  }

  toggleMute(): void {
    this.videoCallService.toggleMute();
  }

  toggleVideo(): void {
    this.videoCallService.toggleVideo();
  }

  async shareScreen(): Promise<void> {
    try {
      await this.videoCallService.shareScreen();
    } catch (error) {
      console.error('Failed to share screen:', error);
    }
  }

  endCall(): void {
    if (confirm('Are you sure you want to end the call?')) {
      this.videoCallService.endCall();
    }
  }

  private updateVideoStream(): void {
    const stream = this.videoCallService.getLocalStream();
    if (stream) {
      const videoElement = document.querySelector('.local-video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    }
  }
}
