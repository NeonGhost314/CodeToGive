import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.8s ease-out', style({ opacity: 1 })),
  ]),
]);

export const staggerFadeIn = trigger('staggerFadeIn', [
  transition(':enter', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(100, [
          animate(
            '0.5s ease-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

export const cardHover = trigger('cardHover', [
  transition('idle => hover', [animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')]),
  transition('hover => idle', [animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')]),
]);
