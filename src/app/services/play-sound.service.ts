import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { fromEvent } from 'rxjs';

interface Sound {
  key: string;
  asset: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlaySoundService {

  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio = false;
  private isNative = false;

  constructor(
    private platform: Platform,
    private nativeAudio: NativeAudio
  ) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.isNative = true;
      }

      this.preload('definite', 'assets/sound/definite.mp3');
      this.preload('silence', 'assets/sound/silence.mp3');

      fromEvent(document, 'click').pipe(
        first())
        .subscribe(ev => {
          console.log('play sound silence one time');
          this.play('silence');
        });

    });
  }

  preload(key: string, asset: string): void {

    if (!this.sounds.filter((sound) => sound.key === key).length) {
      if (this.isNative && !this.forceWebAudio) {
        this.platform.ready()
          .then(() => this.nativeAudio.preloadSimple(key, asset));
        this.sounds.push({
          key: key,
          asset: asset
        });
      } else {
        const audio = new Audio();
        audio.src = asset;
        this.sounds.push({
          key: key,
          asset: asset
        });
      }
    }
  }


  play(key: string = 'definite'): boolean {
    const soundToPlay: Sound = this.sounds.find((sound) => sound.key === key);

    if (soundToPlay) {
      if (this.isNative) {
        this.platform.ready()
          .then(() => this.nativeAudio.play(soundToPlay.key)
            .then((res) => console.log(res),
              (err) => console.log('play error isNative', JSON.stringify(soundToPlay), err))
          );
      } else {
        this.audioPlayer.src = soundToPlay.asset;
        this.audioPlayer.play()
          .catch((error) => { console.log('error on play sound web', error) }); // ignore web player errors
      }
      return true;
    } else {
      return false;
    }
  }

  getSounds() {
    return this.sounds;
  }
}
