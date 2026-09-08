import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-general-manager',
  imports: [RouterLink],
  templateUrl: './general-manager.html',
  styleUrl: './general-manager.css',
})
export class GeneralManager {
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const starfield = document.querySelector('.starfield') as HTMLElement | null;
    if (!starfield) {
      return;
    }

    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    starfield.style.transform = `translate(${x}px, ${y}px)`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    const starfield = document.querySelector('.starfield') as HTMLElement | null;
    if (!starfield) {
      return;
    }

    starfield.style.transform = 'translate(0, 0)';
  }
}
