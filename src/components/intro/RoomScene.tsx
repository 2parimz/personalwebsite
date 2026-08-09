"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { intro } from "@/content/site";

/**
 * The intro illustration.
 *
 * The thing that stops vector art reading as "clean and sloppy" is the
 * `rough` filter: fractal-noise displacement applied to whole groups, which
 * gives every edge a drawn wobble. Structure gets the strong version, the
 * figure a softer one, and the swaying shins none at all — a filter over an
 * element that animates every frame is recomputed every frame, and at that
 * stroke weight the difference is invisible.
 *
 * Animated layers: shins (continuous sway), near arm + head (one wave on a
 * delay), speech bubble (arrives last so the room reads first).
 */

const T = { wave: 2.4, bubble: 3.5 };
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Lit windows in the skyline: [x, y, opacity]. */
const LIT: [number, number, number][] = [
  [905, 418, 1], [929, 470, 1], [1005, 288, 1], [1024, 288, 1], [1043, 340, 1],
  [1005, 392, 1], [1024, 444, 1], [1043, 470, 1], [1148, 382, 1], [1167, 434, 1],
  [1148, 486, 1], [957, 330, 0.7], [976, 382, 0.7], [1198, 316, 0.7],
  [1198, 420, 0.7], [1071, 446, 0.7],
];

export function RoomScene({ reduced = false }: { reduced?: boolean }) {
  const { hair, skin, top } = intro.character;
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const swayTransition = { duration: 5.2, repeat: Infinity, ease: "easeInOut" as const };
  const waveTransition = reduced
    ? { duration: 0 }
    : {
        duration: 2.4,
        delay: T.wave,
        times: [0, 0.18, 0.32, 0.46, 0.6, 0.74, 1],
        ease: "easeInOut" as const,
      };

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio={narrow ? "xMidYMid meet" : "xMidYMid slice"}
      className="h-full w-full"
      role="img"
      aria-label="An illustrated apartment at night: a figure lying on a bed with a laptop, waving"
    >
      <defs>
        <filter id="rough" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="roughSoft" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="paperGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" />
        </filter>

        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141f36" />
          <stop offset="55%" stopColor="#22314a" />
          <stop offset="100%" stopColor="#3b4a63" />
        </linearGradient>
        <linearGradient id="lampGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e6ba" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f6e6ba" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="vig" cx="50%" cy="45%" r="74%">
          <stop offset="58%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#2a1c10" stopOpacity="0.38" />
        </radialGradient>

        <pattern id="winFar" width="16" height="22" patternUnits="userSpaceOnUse">
          <rect width="16" height="22" fill="#25334b" />
          <rect x="4" y="5" width="8" height="11" fill="#18233a" />
        </pattern>
        <pattern id="winNear" width="19" height="26" patternUnits="userSpaceOnUse">
          <rect width="19" height="26" fill="#131d2f" />
          <rect x="5" y="6" width="9" height="13" fill="#0a1220" />
        </pattern>
        <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <path d="M0 0 V9" stroke="#1c1a17" strokeWidth="1.5" strokeOpacity="0.5" />
        </pattern>
      </defs>

      {/* ============================== ROOM ============================== */}
      <g filter="url(#rough)">
        <rect x="-20" y="-20" width="1480" height="720" fill="#ded3c0" />
        <path d="M-20 668 Q400 660 1460 670 L1460 920 L-20 920 Z" fill="#7c5e46" />
        <g stroke="#63482f" strokeWidth="2.5" opacity="0.75" fill="none">
          <path d="M-20 714 Q500 706 1460 716 M-20 770 Q600 762 1460 772 M-20 830 Q520 822 1460 832" />
          <path d="M214 670 Q212 692 216 714 M694 716 Q690 742 696 770 M1084 668 Q1088 692 1082 714 M424 830 Q428 862 422 900 M986 770 Q982 800 988 830" />
        </g>
        <path d="M-20 654 Q500 648 1460 656 L1460 674 Q500 666 -20 672 Z" fill="#cec2ae" />
        <path d="M-20 654 Q500 648 1460 656" stroke="#1c1a17" strokeWidth="3.5" fill="none" />

        {/* rug */}
        <g>
          <path d="M336 708 Q700 700 1052 710 Q1058 786 1046 856 Q700 866 342 854 Q330 782 336 708 Z" fill="#6e2733" opacity="0.42" />
          <path d="M336 708 Q700 700 1052 710 Q1058 786 1046 856 Q700 866 342 854 Q330 782 336 708 Z" fill="none" stroke="#1c1a17" strokeWidth="2.5" opacity="0.45" />
          <path d="M362 728 Q700 720 1026 730 Q1032 780 1022 836 Q700 844 366 834 Q356 780 362 728 Z" fill="none" stroke="#1c1a17" strokeWidth="1.4" opacity="0.3" />
        </g>

        {/* window */}
        <g>
          <path d="M878 112 Q1054 106 1232 112 Q1238 316 1232 520 Q1054 526 878 520 Q872 316 878 112 Z" fill="url(#sky)" />
          <circle cx="1172" cy="172" r="19" fill="#eee5cf" opacity="0.85" />
          <circle cx="1164" cy="166" r="19" fill="#22314a" opacity="0.55" />

          <g>
            <rect x="878" y="360" width="62" height="160" fill="url(#winFar)" />
            <rect x="946" y="316" width="48" height="204" fill="url(#winFar)" />
            <rect x="1084" y="338" width="56" height="182" fill="url(#winFar)" />
            <rect x="1186" y="300" width="46" height="220" fill="url(#winFar)" />
          </g>
          <g>
            <rect x="900" y="404" width="54" height="116" fill="url(#winNear)" />
            <path d="M996 262 h72 v258 h-72 Z" fill="url(#winNear)" />
            <path d="M1004 262 h56 v-22 h-56 Z" fill="#131d2f" />
            <path d="M1030 240 v-34" stroke="#131d2f" strokeWidth="6" />
            <rect x="1140" y="368" width="52" height="152" fill="url(#winNear)" />
            <rect x="1064" y="430" width="34" height="90" fill="url(#winNear)" />
            <g fill="#131d2f">
              <path d="M910 404 l-8 -22 h30 l-8 22 Z" />
              <path d="M906 382 h26 v-14 h-26 Z" />
              <path d="M1150 368 l-7 -18 h26 l-7 18 Z" />
            </g>
          </g>
          <g fill="#c9a24d">
            {LIT.map(([x, y, o]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="9" height="13" opacity={o} />
            ))}
          </g>

          <path d="M878 112 Q1054 106 1232 112 Q1238 316 1232 520 Q1054 526 878 520 Q872 316 878 112 Z" fill="none" stroke="#1c1a17" strokeWidth="5" />
          <path d="M1054 108 Q1050 316 1054 524" stroke="#1c1a17" strokeWidth="5" fill="none" />
          <path d="M876 302 Q1054 296 1234 302" stroke="#1c1a17" strokeWidth="5" fill="none" />
          <path d="M858 518 Q1054 512 1250 518 Q1252 530 1250 538 Q1054 544 858 538 Z" fill="#d2c7b3" stroke="#1c1a17" strokeWidth="3" />
        </g>

        {/* curtains */}
        <g>
          <path d="M846 96 Q1054 90 1266 96" stroke="#a8863b" strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="842" cy="96" r="8" fill="#a8863b" stroke="#1c1a17" strokeWidth="2" />
          <circle cx="1270" cy="96" r="8" fill="#a8863b" stroke="#1c1a17" strokeWidth="2" />
          <g fill="#efe9dd" opacity="0.42" stroke="#1c1a17" strokeOpacity="0.3" strokeWidth="1.5">
            <path d="M852 100 Q866 300 856 528 Q886 536 902 526 Q890 300 900 100 Z" />
            <path d="M900 100 Q890 300 902 526 Q926 534 944 522 Q930 300 942 100 Z" />
            <path d="M1166 100 Q1152 300 1164 522 Q1184 534 1204 526 Q1192 300 1204 100 Z" />
            <path d="M1204 100 Q1192 300 1204 526 Q1226 536 1252 528 Q1240 300 1252 100 Z" />
          </g>
          <g stroke="#1c1a17" strokeOpacity="0.16" strokeWidth="1.2" fill="none">
            <path d="M872 104 Q862 310 870 526 M918 104 Q908 310 918 524 M1184 104 Q1174 310 1184 526 M1228 104 Q1218 310 1228 524" />
          </g>
        </g>

        {/* artwork */}
        <g>
          <path d="M176 140 Q272 134 370 140 Q376 246 370 352 Q272 358 176 352 Q170 246 176 140 Z" fill="#efe9dd" stroke="#a8863b" strokeWidth="6" />
          <path d="M206 292 A 68 66 0 0 1 340 292 Z" fill="#6e2733" />
          <path d="M198 292 Q272 288 348 292" stroke="#22314a" strokeWidth="7" fill="none" />
          <path d="M206 170 q30 -2 30 28 q-30 3 -30 -28 Z" fill="#2f5d50" />
          <path d="M172 356 Q272 352 374 356" stroke="#1c1a17" strokeWidth="4" strokeOpacity="0.22" fill="none" />
        </g>

        {/* plant */}
        <g>
          <path d="M40 670 Q90 664 140 670 L126 748 Q88 754 52 748 Z" fill="#8c4a3a" stroke="#1c1a17" strokeWidth="3" />
          <path d="M34 660 Q90 654 146 660 Q148 672 146 678 Q90 684 34 678 Z" fill="#9c5844" stroke="#1c1a17" strokeWidth="3" />
          <g fill="#2f5d50" stroke="#1c1a17" strokeWidth="2.5">
            <path d="M90 662 Q50 568 18 510 Q68 522 94 580 Q102 622 90 662 Z" />
            <path d="M92 662 Q98 546 82 452 Q126 500 124 590 Q118 636 92 662 Z" />
            <path d="M94 662 Q138 576 190 536 Q178 606 130 648 Q112 660 94 662 Z" />
            <path d="M92 662 Q130 466 172 396 Q182 494 130 606 Q112 644 92 662 Z" />
          </g>
          <g stroke="#1b3d33" strokeWidth="2" fill="none" opacity="0.85">
            <path d="M88 648 Q60 566 30 518 M90 644 Q96 548 86 468 M94 646 Q132 588 180 546 M92 644 Q128 496 166 418" />
          </g>
          <ellipse cx="92" cy="756" rx="70" ry="10" fill="#1c1a17" opacity="0.2" />
        </g>

        {/* console + record player */}
        <g>
          <path d="M1244 586 Q1336 580 1428 586 Q1432 632 1428 678 Q1336 684 1244 678 Q1240 632 1244 586 Z" fill="#7c5e46" stroke="#1c1a17" strokeWidth="3" />
          <path d="M1244 622 Q1336 616 1428 622" stroke="#1c1a17" strokeWidth="2" opacity="0.45" fill="none" />
          <path d="M1268 678 Q1266 692 1270 708 M1404 678 Q1406 692 1402 708" stroke="#1c1a17" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M1262 540 Q1336 534 1412 540 Q1416 562 1412 586 Q1336 592 1262 586 Q1258 562 1262 540 Z" fill="#2b2724" stroke="#1c1a17" strokeWidth="3" />
          <ellipse cx="1328" cy="562" rx="40" ry="13" fill="#14110f" stroke="#1c1a17" strokeWidth="2" />
          <ellipse cx="1328" cy="562" rx="12" ry="4" fill="#6e2733" />
          <path d="M1392 546 Q1382 556 1372 566" stroke="#a8863b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="1394" cy="544" r="4.5" fill="#a8863b" stroke="#1c1a17" strokeWidth="1.5" />
        </g>

        {/* books */}
        <g stroke="#1c1a17" strokeWidth="2.5">
          <path d="M1056 640 Q1110 636 1162 640 Q1164 648 1162 657 Q1110 661 1056 657 Z" fill="#22314a" />
          <path d="M1048 622 Q1108 618 1166 622 Q1168 631 1166 640 Q1108 644 1048 640 Z" fill="#6e2733" />
          <path d="M1062 605 Q1110 601 1158 605 Q1160 614 1158 623 Q1110 627 1062 623 Z" fill="#efe9dd" />
          <path d="M1052 588 Q1108 584 1164 588 Q1166 597 1164 606 Q1108 610 1052 606 Z" fill="#2f5d50" />
          <path d="M1066 574 Q1110 570 1154 574 Q1156 581 1154 589 Q1110 593 1066 589 Z" fill="#a8863b" />
        </g>

        {/* bed */}
        <g>
          <path d="M250 612 Q620 604 992 612 Q996 644 992 674 Q620 682 250 674 Q246 644 250 612 Z" fill="#6b4f39" stroke="#1c1a17" strokeWidth="3" />
          <path d="M240 508 Q620 498 1002 508 Q1008 562 1002 618 Q620 628 240 618 Q234 562 240 508 Z" fill="#efe9dd" stroke="#1c1a17" strokeWidth="3.5" />
          <g stroke="#cfc4af" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9">
            <path d="M250 572 Q620 596 996 570" />
            <path d="M262 592 Q620 612 986 590" />
          </g>
          <path d="M244 618 Q620 630 1000 616 L1000 626 Q620 640 244 628 Z" fill="url(#hatch)" opacity="0.16" />
          <g>
            <path d="M254 452 Q322 442 392 452 Q398 486 392 518 Q322 528 254 518 Q248 486 254 452 Z" fill="#e5ddcd" stroke="#1c1a17" strokeWidth="3" />
            <path d="M272 470 Q322 464 376 470" stroke="#1c1a17" strokeOpacity="0.28" strokeWidth="2" fill="none" />
          </g>
          <g>
            <path d="M884 506 Q944 500 1002 506 Q1006 562 1002 616 Q944 622 884 616 Q880 562 884 506 Z" fill="#2f5d50" stroke="#1c1a17" strokeWidth="3" />
            <path d="M884 548 Q944 542 1002 548 M884 582 Q944 576 1002 582" stroke="#1c1a17" strokeOpacity="0.32" strokeWidth="2" fill="none" />
          </g>
          <ellipse cx="620" cy="690" rx="392" ry="16" fill="#1c1a17" opacity="0.22" />
        </g>

        {/* arc lamp */}
        <g>
          <ellipse cx="205" cy="668" rx="50" ry="11" fill="#1c1a17" />
          <path d="M199 600 q6 -2 12 0 l-2 68 q-4 2 -8 0 Z" fill="#a8863b" stroke="#1c1a17" strokeWidth="2" />
          <path d="M205 604 C 205 380, 262 208, 424 200" fill="none" stroke="#a8863b" strokeWidth="9" strokeLinecap="round" />
          <path d="M382 200 Q424 194 468 200 L446 252 Q424 256 404 252 Z" fill="#a8863b" stroke="#1c1a17" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="425" cy="253" rx="16" ry="7" fill="#f6e6ba" />
          <path d="M394 256 L332 476 H518 L456 256 Z" fill="url(#lampGlow)" />
        </g>
      </g>

      {/* ====================== FIGURE — lower body ======================= */}
      <g filter="url(#roughSoft)">
        <path
          d="M428 516 Q500 508 572 516 Q576 542 572 568 Q500 576 428 568 Q424 542 428 516 Z"
          fill="#e5ddcd"
          stroke="#1c1a17"
          strokeWidth="3"
          transform="rotate(-4 500 542)"
        />
        <path d="M520 530 Q476 558 432 582" stroke="#57202a" strokeWidth="19" strokeLinecap="round" fill="none" />
        <ellipse cx="426" cy="585" rx="13" ry="10" fill="#c9986f" stroke="#1c1a17" strokeWidth="2" />
        <path d="M668 566 Q744 564 800 584" stroke="#2a2622" strokeWidth="46" strokeLinecap="round" fill="none" />
      </g>

      {/* shins — deliberately unfiltered: they animate every frame */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "800px 586px" }}
        animate={reduced ? {} : { rotate: [-5, 5, -5] }}
        transition={swayTransition}
      >
        <path d="M800 586 Q828 512 838 450" stroke="#2a2622" strokeWidth="33" strokeLinecap="round" fill="none" />
        <path d="M796 588 Q854 522 874 464" stroke="#3b352e" strokeWidth="30" strokeLinecap="round" fill="none" />
        <path d="M838 450 Q832 424 848 416 Q866 412 864 434 Q862 448 852 456 Z" fill={skin} stroke="#1c1a17" strokeWidth="2.5" />
        <path d="M874 464 Q880 440 896 436 Q910 436 904 454 Q898 468 888 472 Z" fill={skin} stroke="#1c1a17" strokeWidth="2.5" />
      </motion.g>

      {/* ====================== FIGURE — upper body ======================= */}
      <g filter="url(#roughSoft)">
        <path
          d="M504 498 Q580 484 650 512 Q694 530 692 560 Q686 586 632 584 Q558 580 506 552 Z"
          fill={top}
          stroke="#1c1a17"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M600 500 Q624 538 612 578" stroke="#1c1a17" strokeWidth="2" fill="none" opacity="0.28" />
        <path d="M664 536 Q678 558 662 578" stroke="#1c1a17" strokeWidth="2.5" fill="none" opacity="0.45" />

        {/* head — tilts up on the wave */}
        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "500px 500px" }}
          animate={reduced ? { rotate: 0 } : { rotate: [0, -8, -8, -8, 0] }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 2.4, delay: T.wave, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" as const }
          }
        >
          <path d="M492 434 Q532 442 542 480 Q550 520 528 552 Q512 574 494 566 Q512 534 508 500 Q504 468 488 448 Z" fill={hair} stroke="#1c1a17" strokeWidth="2" />
          <ellipse cx="472" cy="466" rx="25" ry="23" fill={skin} stroke="#1c1a17" strokeWidth="2.5" />
          <path d="M448 460 Q450 430 478 424 Q508 422 516 448 Q520 462 514 474 Q508 450 486 445 Q462 442 452 464 Z" fill={hair} />
          <path d="M452 462 Q444 486 452 508 Q446 494 446 476 Q446 466 452 462 Z" fill={hair} />
          <path d="M452 461 Q459 456 466 461" stroke="#1c1a17" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M454 480 Q462 485 472 479" stroke="#1c1a17" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* near forearm — rests on the laptop, then raises to wave */}
        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "520px 518px" }}
          animate={{ rotate: reduced ? 0 : [0, -78, -64, -82, -66, -78, 0] }}
          transition={waveTransition}
        >
          <path d="M520 518 Q510 548 482 558 Q458 568 440 576" stroke={top} strokeWidth="21" strokeLinecap="round" fill="none" />
          <path d="M452 570 Q458 580 452 588" stroke="#1c1a17" strokeWidth="2" fill="none" opacity="0.4" />
          <ellipse cx="432" cy="580" rx="14" ry="11" fill={skin} stroke="#1c1a17" strokeWidth="2.5" />
        </motion.g>

        {/* laptop */}
        <path d="M318 608 Q380 604 444 599 Q442 591 438 583 Q376 588 312 592 Z" fill="#b9b2a6" stroke="#1c1a17" strokeWidth="3" strokeLinejoin="round" />
        <path d="M312 592 Q302 552 294 514 Q344 510 392 508 Q416 546 438 583 Z" fill="#cdc6ba" stroke="#1c1a17" strokeWidth="3" strokeLinejoin="round" />
        <path d="M318 586 Q312 552 306 522" stroke="#1c1a17" strokeWidth="1.6" opacity="0.3" fill="none" />
      </g>

      {/* ============================= BUBBLE ============================= */}
      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, delay: T.bubble, ease: EASE }}
        style={{ transformBox: "view-box", transformOrigin: "540px 380px" }}
      >
        <g filter="url(#roughSoft)">
          <path
            d="M528 208 Q504 206 504 232 L502 330 Q502 354 526 355 L560 356 L512 404 L604 357 L836 352 Q860 350 859 326 L855 230 Q854 206 830 207 Z"
            fill="#f4efe4"
            stroke="#1c1a17"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </g>
        <text x="536" y="272" fill="#1c1a17" fontSize="38" fontStyle="italic" fontFamily="var(--font-display), Georgia, serif">
          {intro.greeting[0]}
        </text>
        <text x="536" y="322" fill="#1c1a17" fontSize="38" fontStyle="italic" fontFamily="var(--font-display), Georgia, serif">
          {intro.greeting[1]}
        </text>
      </motion.g>

      <rect width="1440" height="900" fill="url(#vig)" pointerEvents="none" />
      <rect width="1440" height="900" filter="url(#paperGrain)" opacity="0.1" style={{ mixBlendMode: "multiply" }} pointerEvents="none" />
    </svg>
  );
}
