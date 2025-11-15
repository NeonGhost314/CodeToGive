import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true }) target!: ElementRef;
  @Input() videoSrc!: string;
  player!: Player;

  ngOnInit(): void {
    this.player = videojs(this.target.nativeElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      sources: [{
        src: this.videoSrc,
        type: 'video/webm'
      }]
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
