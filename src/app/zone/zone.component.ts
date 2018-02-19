import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {

  constructor(private zone: NgZone) {}

  ngOnInit() {
    //console.log('init');
  }

  progress: number = 0;

  processWithinAngularZone() {
    this.progress = 0;
    this.increaseProgress(() => console.log('Done!'));
  }

  processOutsideAngularZone() {
    this.progress = 0;
    this.zone.runOutsideAngular(() => {
      function mMove(e){
        console.log('mousemove', e.pageX, e.pageY);
      }
      document.addEventListener('mousemove', mMove);
      this.increaseProgress(() => {
        this.zone.run(() => {
          document.removeEventListener('mousemove', mMove)
          console.log('Outside Done!');
        });
      });
    });
  }

  increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);
  
    if (this.progress < 100) {
      window.setTimeout(() => {
        this.increaseProgress(doneCallback);
      }, 10);
    } else {
      doneCallback();
    }
  }

}
