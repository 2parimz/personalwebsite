"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { intro } from "@/content/site";

/**
 * The intro illustration — laid out after the reference: two windows onto a
 * night skyline, string lights swagged across the wall, a side table with
 * stacked books and a lamp, a dresser with the record player, mirror, plant,
 * rug, boots. Rendered in the muted jewel palette rather than pastel.
 *
 * Vector reads as sloppy when every edge is exact, so whole groups run
 * through fractal-noise displacement to give the linework a drawn wobble.
 * The swaying shins are deliberately left unfiltered: a filter over an
 * element that animates every frame is recomputed every frame, and at that
 * stroke weight the difference does not show.
 *
 * Animated layers: shins (continuous sway), near arm + head (one wave on a
 * delay), speech bubble (last, so the room reads first).
 */

const T = { wave: 2.4, bubble: 3.5 };
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LIT_A: [number, number, number][] = [
  [656, 270, 1], [674, 312, 1], [656, 366, 1], [710, 330, 1], [726, 398, 1],
  [758, 252, 1], [776, 306, 1], [758, 410, 1], [610, 340, 0.7],
];
const LIT_B: [number, number, number][] = [
  [936, 258, 1], [954, 300, 1], [936, 354, 1], [954, 420, 1], [990, 320, 1],
  [1006, 386, 1], [1038, 284, 1], [1058, 340, 1], [1038, 424, 1], [890, 310, 0.7],
];
const BULBS = [82, 264, 452, 640, 832, 1020, 1208, 1382];
const STAR = (x: number, y: number) =>
  `M${x} ${y} l5 11 12 1 -9 9 3 12 -11 -6 -11 6 3 -12 -9 -9 12 -1 Z`;

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

        <radialGradient id="vig" cx="50%" cy="45%" r="76%">
          <stop offset="58%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#2a1c10" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id="mirrorGlass" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#cfd6d2" />
          <stop offset="60%" stopColor="#b6bfbc" />
          <stop offset="100%" stopColor="#9aa5a2" />
        </linearGradient>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a24d" />
          <stop offset="100%" stopColor="#a8863b" />
        </linearGradient>

        <pattern id="winFar" width="15" height="20" patternUnits="userSpaceOnUse">
          <rect width="15" height="20" fill="#2a3850" />
          <rect x="4" y="5" width="7" height="10" fill="#1a2540" />
        </pattern>
        <pattern id="winNear" width="17" height="23" patternUnits="userSpaceOnUse">
          <rect width="17" height="23" fill="#161f33" />
          <rect x="4" y="6" width="8" height="11" fill="#0b1220" />
        </pattern>
        <pattern id="winWine" width="17" height="23" patternUnits="userSpaceOnUse">
          <rect width="17" height="23" fill="#42202b" />
          <rect x="4" y="6" width="8" height="11" fill="#2a1119" />
        </pattern>
        <pattern id="winGreen" width="17" height="23" patternUnits="userSpaceOnUse">
          <rect width="17" height="23" fill="#22403a" />
          <rect x="4" y="6" width="8" height="11" fill="#122721" />
        </pattern>
        <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <path d="M0 0 V9" stroke="#1c1a17" strokeWidth="1.5" strokeOpacity="0.5" />
        </pattern>
      </defs>

      <g filter="url(#rough)">
        {/* shell */}
        <rect x="-20" y="-20" width="1480" height="700" fill="#ded3c0" />
        <path d="M-20 660 Q400 652 1460 662 L1460 920 L-20 920 Z" fill="#7c5e46" />
        <g stroke="#63482f" strokeWidth="2.5" opacity="0.75" fill="none">
          <path d="M-20 706 Q500 698 1460 708 M-20 764 Q600 756 1460 766 M-20 826 Q520 818 1460 828" />
          <path d="M214 662 Q212 684 216 706 M694 708 Q690 736 696 764 M1084 662 Q1088 684 1082 706 M424 826 Q428 860 422 900 M986 764 Q982 796 988 826" />
        </g>
        <path d="M-20 646 Q500 640 1460 648 L1460 666 Q500 658 -20 664 Z" fill="#cec2ae" />
        <path d="M-20 646 Q500 640 1460 648" stroke="#1c1a17" strokeWidth="3.5" fill="none" />

        {/* string lights */}
        <path
          d="M-10 34 Q170 108 356 40 Q548 108 736 38 Q928 108 1116 40 Q1300 106 1450 36"
          fill="none"
          stroke="#1c1a17"
          strokeWidth="2"
          opacity="0.8"
        />
        <g fill="#c9a24d" stroke="#1c1a17" strokeWidth="1.5">
          {BULBS.map((x, i) => (
            <circle key={x} cx={x} cy={i === 7 ? 66 : i === 0 || i === 6 ? 74 : 76} r="7" />
          ))}
        </g>
        <g stroke="#1c1a17" strokeWidth="1.6" fill="#c9a24d">
          <path d="M170 96 v22" />
          <path d={STAR(170, 118)} />
          <path d="M548 96 v26" />
          <path d={STAR(548, 122)} />
          <path d="M928 96 v20" />
          <path d={STAR(928, 116)} />
          <path d="M1300 92 v24" />
          <path d={STAR(1300, 116)} />
        </g>

        {/* window A */}
        <g>
          <path d="M598 108 Q700 104 802 108 Q806 290 802 472 Q700 476 598 472 Q594 290 598 108 Z" fill="#1c2a44" />
          <rect x="602" y="300" width="40" height="172" fill="url(#winFar)" />
          <rect x="648" y="252" width="46" height="220" fill="url(#winWine)" />
          <rect x="700" y="290" width="42" height="182" fill="url(#winNear)" />
          <rect x="748" y="230" width="52" height="242" fill="url(#winGreen)" />
          <g fill="#c9a24d">
            {LIT_A.map(([x, y, o]) => (
              <rect key={`a${x}-${y}`} x={x} y={y} width="8" height="11" opacity={o} />
            ))}
          </g>
          <path d="M598 108 Q700 104 802 108 Q806 290 802 472 Q700 476 598 472 Q594 290 598 108 Z" fill="none" stroke="#1c1a17" strokeWidth="5" />
          <path d="M700 106 Q696 290 700 474 M596 280 Q700 276 804 280" stroke="#1c1a17" strokeWidth="4.5" fill="none" />
          <path d="M582 470 Q700 464 818 470 Q820 482 818 490 Q700 496 582 490 Z" fill="#d2c7b3" stroke="#1c1a17" strokeWidth="3" />
        </g>

        {/* window B */}
        <g>
          <path d="M878 108 Q980 104 1082 108 Q1086 290 1082 472 Q980 476 878 472 Q874 290 878 108 Z" fill="#1c2a44" />
          <circle cx="1044" cy="164" r="17" fill="#eee5cf" opacity="0.85" />
          <circle cx="1037" cy="158" r="17" fill="#1c2a44" opacity="0.6" />
          <rect x="878" y="286" width="44" height="186" fill="url(#winFar)" />
          <rect x="928" y="238" width="48" height="234" fill="url(#winNear)" />
          <rect x="982" y="300" width="40" height="172" fill="url(#winWine)" />
          <rect x="1028" y="264" width="54" height="208" fill="url(#winFar)" />
          <g fill="#131d2f">
            <path d="M938 238 l-7 -18 h26 l-7 18 Z" />
            <path d="M934 220 h22 v-12 h-22 Z" />
          </g>
          <g fill="#c9a24d">
            {LIT_B.map(([x, y, o]) => (
              <rect key={`b${x}-${y}`} x={x} y={y} width="8" height="11" opacity={o} />
            ))}
          </g>
          <path d="M878 108 Q980 104 1082 108 Q1086 290 1082 472 Q980 476 878 472 Q874 290 878 108 Z" fill="none" stroke="#1c1a17" strokeWidth="5" />
          <path d="M980 106 Q976 290 980 474 M876 280 Q980 276 1084 280" stroke="#1c1a17" strokeWidth="4.5" fill="none" />
          <path d="M862 470 Q980 464 1098 470 Q1100 482 1098 490 Q980 496 862 490 Z" fill="#d2c7b3" stroke="#1c1a17" strokeWidth="3" />
        </g>

        {/* rods + sheers */}
        <g>
          <path d="M572 92 Q700 88 828 92 M852 92 Q980 88 1108 92" stroke="#a8863b" strokeWidth="6" fill="none" strokeLinecap="round" />
          <g fill="#efe9dd" opacity="0.4" stroke="#1c1a17" strokeOpacity="0.28" strokeWidth="1.4">
            <path d="M578 96 Q590 280 580 480 Q604 488 620 478 Q610 280 620 96 Z" />
            <path d="M782 96 Q772 280 784 478 Q804 488 824 480 Q812 280 824 96 Z" />
            <path d="M858 96 Q870 280 860 480 Q884 488 900 478 Q890 280 900 96 Z" />
            <path d="M1062 96 Q1052 280 1064 478 Q1084 488 1104 480 Q1092 280 1104 96 Z" />
          </g>
        </g>

        {/* left wall art */}
        <g>
          <path d="M118 150 Q204 144 292 150 Q298 236 292 322 Q204 328 118 322 Q112 236 118 150 Z" fill="#efe9dd" stroke="#a8863b" strokeWidth="6" />
          <path d="M144 272 A 60 58 0 0 1 264 272 Z" fill="#6e2733" />
          <path d="M138 272 Q204 268 270 272" stroke="#22314a" strokeWidth="6" fill="none" />
          <path d="M144 176 q26 -2 26 24 q-26 3 -26 -24 Z" fill="#2f5d50" />
        </g>
        <g>
          <path d="M330 196 Q382 192 436 196 Q440 246 436 296 Q382 300 330 296 Q326 246 330 196 Z" fill="#efe9dd" stroke="#1c1a17" strokeWidth="3.5" />
          <path d="M344 272 Q368 232 392 256 Q408 272 424 244" stroke="#22314a" strokeWidth="4" fill="none" />
          <circle cx="410" cy="218" r="10" fill="#c9a24d" />
        </g>

        {/* mirror */}
        <g>
          <path d="M1236 156 Q1318 148 1400 156 Q1408 274 1400 392 Q1318 400 1236 392 Q1228 274 1236 156 Z" fill="url(#mirrorGlass)" stroke="#a8863b" strokeWidth="6" />
          <path d="M1262 366 Q1290 250 1268 180" stroke="#efe9dd" strokeWidth="14" opacity="0.5" fill="none" />
          <path d="M1352 372 Q1372 280 1358 196" stroke="#efe9dd" strokeWidth="8" opacity="0.35" fill="none" />
        </g>

        {/* side table, books, lamp */}
        <g>
          <path d="M34 502 Q124 496 216 502 Q220 514 216 524 Q124 530 34 524 Q30 514 34 502 Z" fill="#7c5e46" stroke="#1c1a17" strokeWidth="3" />
          <path d="M48 524 Q46 592 50 656 M200 524 Q202 592 198 656" stroke="#6b4f39" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M48 596 Q124 604 200 596" stroke="#6b4f39" strokeWidth="6" fill="none" />
          <g stroke="#1c1a17" strokeWidth="2.5">
            <path d="M48 484 Q92 480 138 484 Q140 492 138 501 Q92 505 48 501 Z" fill="#22314a" />
            <path d="M42 466 Q90 462 140 466 Q142 475 140 484 Q90 488 42 484 Z" fill="#6e2733" />
            <path d="M52 450 Q92 446 134 450 Q136 458 134 467 Q92 471 52 467 Z" fill="#efe9dd" />
            <path d="M46 434 Q92 430 138 434 Q140 442 138 451 Q92 455 46 451 Z" fill="#2f5d50" />
          </g>
          <g>
            <path d="M156 502 Q182 498 208 502 Q210 508 208 512 Q182 516 156 512 Z" fill="#a8863b" stroke="#1c1a17" strokeWidth="2" />
            <path d="M178 502 q8 -2 10 0 l-2 -46 q-6 -2 -8 0 Z" fill="#a8863b" stroke="#1c1a17" strokeWidth="2" />
            <path d="M148 456 Q182 450 218 456 L208 400 Q182 396 158 400 Z" fill="url(#shade)" stroke="#1c1a17" strokeWidth="3" strokeLinejoin="round" />
            <path d="M150 458 Q182 494 214 458" fill="#f6e6ba" opacity="0.45" />
          </g>
        </g>

        {/* dresser */}
        <g>
          <path d="M1150 540 Q1288 532 1428 540 Q1434 612 1428 684 Q1288 692 1150 684 Q1144 612 1150 540 Z" fill="#2f5d50" stroke="#1c1a17" strokeWidth="3.5" />
          <path d="M1150 588 Q1288 582 1428 588 M1150 636 Q1288 630 1428 636" stroke="#1c1a17" strokeWidth="2.5" opacity="0.55" fill="none" />
          <g fill="#a8863b" stroke="#1c1a17" strokeWidth="1.6">
            <circle cx="1220" cy="564" r="6" /><circle cx="1358" cy="564" r="6" />
            <circle cx="1220" cy="612" r="6" /><circle cx="1358" cy="612" r="6" />
            <circle cx="1220" cy="660" r="6" /><circle cx="1358" cy="660" r="6" />
          </g>
          <path d="M1168 684 Q1166 700 1170 714 M1410 684 Q1412 700 1408 714" stroke="#1c1a17" strokeWidth="6" strokeLinecap="round" fill="none" />
          <g>
            <path d="M1176 490 Q1250 484 1326 490 Q1330 514 1326 540 Q1250 546 1176 540 Q1172 514 1176 490 Z" fill="#2b2724" stroke="#1c1a17" strokeWidth="3" />
            <ellipse cx="1242" cy="514" rx="38" ry="12" fill="#14110f" stroke="#1c1a17" strokeWidth="2" />
            <ellipse cx="1242" cy="514" rx="11" ry="4" fill="#6e2733" />
            <path d="M1306 498 Q1296 508 1288 518" stroke="#a8863b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="1308" cy="496" r="4.5" fill="#a8863b" stroke="#1c1a17" strokeWidth="1.5" />
          </g>
          <g>
            <path d="M1362 540 Q1388 536 1412 540 Q1416 506 1396 494 Q1388 490 1378 494 Q1358 506 1362 540 Z" fill="#8c4a3a" stroke="#1c1a17" strokeWidth="3" />
            <g stroke="#2f5d50" strokeWidth="3" fill="none">
              <path d="M1386 494 Q1378 452 1360 428 M1390 494 Q1400 456 1420 436" />
            </g>
            <path d="M1356 424 q10 -14 22 -2 q-10 12 -22 2 Z" fill="#2f5d50" />
            <path d="M1416 432 q12 -12 22 2 q-12 10 -22 -2 Z" fill="#2f5d50" />
          </g>
        </g>

        {/* plant */}
        <g>
          <path d="M1102 592 Q1136 588 1170 592 L1160 662 Q1134 668 1110 662 Z" fill="#8c4a3a" stroke="#1c1a17" strokeWidth="3" />
          <path d="M1096 584 Q1136 580 1176 584 Q1178 594 1176 600 Q1136 606 1096 600 Z" fill="#9c5844" stroke="#1c1a17" strokeWidth="3" />
          <g fill="#2f5d50" stroke="#1c1a17" strokeWidth="2.5">
            <path d="M1134 584 Q1104 508 1082 462 Q1118 474 1136 518 Q1142 552 1134 584 Z" />
            <path d="M1136 584 Q1142 494 1130 422 Q1162 460 1160 528 Q1156 562 1136 584 Z" />
            <path d="M1138 584 Q1172 518 1210 486 Q1202 540 1166 574 Q1152 584 1138 584 Z" />
          </g>
        </g>

        {/* rug */}
        <g>
          <path d="M356 706 Q712 698 1064 708 Q1070 784 1058 854 Q712 864 362 852 Q350 780 356 706 Z" fill="#6e2733" opacity="0.4" />
          <path d="M356 706 Q712 698 1064 708 Q1070 784 1058 854 Q712 864 362 852 Q350 780 356 706 Z" fill="none" stroke="#1c1a17" strokeWidth="2.5" opacity="0.42" />
          <path d="M382 726 Q712 718 1038 728 Q1044 778 1034 834 Q712 842 386 832 Q376 778 382 726 Z" fill="none" stroke="#1c1a17" strokeWidth="1.4" opacity="0.28" />
        </g>

        {/* boots */}
        <g fill="#2a2622" stroke="#1c1a17" strokeWidth="2.5">
          <path d="M1196 700 q22 -4 30 2 l4 52 q-4 8 -16 8 q-12 0 -16 -8 Z" />
          <path d="M1194 758 q34 -6 40 4 q2 10 -14 12 q-22 2 -28 -6 Z" />
          <path d="M1246 704 q22 -4 30 2 l4 50 q-4 8 -16 8 q-12 0 -16 -8 Z" />
          <path d="M1244 760 q34 -6 40 4 q2 10 -14 12 q-22 2 -28 -6 Z" />
        </g>

        {/* a garment left on the floor */}
        <g>
          <path d="M292 780 Q340 758 396 772 Q430 782 418 806 Q380 828 322 822 Q282 812 292 780 Z" fill="#efe9dd" stroke="#1c1a17" strokeWidth="2.5" />
          <path d="M310 792 Q352 780 396 790" stroke="#1c1a17" strokeOpacity="0.3" strokeWidth="2" fill="none" />
        </g>

        {/* bed */}
        <g>
          <path d="M250 606 Q620 598 992 606 Q996 640 992 672 Q620 680 250 672 Q246 640 250 606 Z" fill="#6b4f39" stroke="#1c1a17" strokeWidth="3" />
          <path d="M240 502 Q620 492 1002 502 Q1008 558 1002 614 Q620 624 240 614 Q234 558 240 502 Z" fill="#efe9dd" stroke="#1c1a17" strokeWidth="3.5" />
          <g stroke="#cfc4af" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9">
            <path d="M250 568 Q620 592 996 566" />
            <path d="M262 588 Q620 608 986 586" />
          </g>
          <path d="M244 614 Q620 626 1000 612 L1000 622 Q620 636 244 624 Z" fill="url(#hatch)" opacity="0.16" />
          <g>
            <path d="M254 448 Q322 438 392 448 Q398 482 392 514 Q322 524 254 514 Q248 482 254 448 Z" fill="#e5ddcd" stroke="#1c1a17" strokeWidth="3" />
            <path d="M272 466 Q322 460 376 466" stroke="#1c1a17" strokeOpacity="0.28" strokeWidth="2" fill="none" />
          </g>
          <g>
            <path d="M884 502 Q944 496 1002 502 Q1006 558 1002 612 Q944 618 884 612 Q880 558 884 502 Z" fill="#2f5d50" stroke="#1c1a17" strokeWidth="3" />
            <path d="M884 544 Q944 538 1002 544 M884 578 Q944 572 1002 578" stroke="#1c1a17" strokeOpacity="0.32" strokeWidth="2" fill="none" />
          </g>
          <ellipse cx="620" cy="686" rx="392" ry="15" fill="#1c1a17" opacity="0.22" />
        </g>
      </g>

      {/* figure — lower body */}
      <g filter="url(#roughSoft)">
        <path
          d="M428 512 Q500 504 572 512 Q576 538 572 564 Q500 572 428 564 Q424 538 428 512 Z"
          fill="#e5ddcd"
          stroke="#1c1a17"
          strokeWidth="3"
          transform="rotate(-4 500 538)"
        />
        <path d="M520 526 Q476 554 432 578" stroke="#57202a" strokeWidth="19" strokeLinecap="round" fill="none" />
        <ellipse cx="426" cy="581" rx="13" ry="10" fill="#c9986f" stroke="#1c1a17" strokeWidth="2" />
        <path d="M668 562 Q744 560 800 580" stroke="#2a2622" strokeWidth="46" strokeLinecap="round" fill="none" />
      </g>

      {/* shins — unfiltered on purpose, they animate every frame */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "800px 582px" }}
        animate={reduced ? {} : { rotate: [-5, 5, -5] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M800 582 Q828 508 838 446" stroke="#2a2622" strokeWidth="33" strokeLinecap="round" fill="none" />
        <path d="M796 584 Q854 518 874 460" stroke="#3b352e" strokeWidth="30" strokeLinecap="round" fill="none" />
        <path d="M838 446 Q832 420 848 412 Q866 408 864 430 Q862 444 852 452 Z" fill={skin} stroke="#1c1a17" strokeWidth="2.5" />
        <path d="M874 460 Q880 436 896 432 Q910 432 904 450 Q898 464 888 468 Z" fill={skin} stroke="#1c1a17" strokeWidth="2.5" />
      </motion.g>

      {/* figure — upper body */}
      <g filter="url(#roughSoft)">
        <path
          d="M504 494 Q580 480 650 508 Q694 526 692 556 Q686 582 632 580 Q558 576 506 548 Z"
          fill={top}
          stroke="#1c1a17"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M600 496 Q624 534 612 574" stroke="#1c1a17" strokeWidth="2" fill="none" opacity="0.28" />
        <path d="M664 532 Q678 554 662 574" stroke="#1c1a17" strokeWidth="2.5" fill="none" opacity="0.45" />

        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "500px 496px" }}
          animate={reduced ? { rotate: 0 } : { rotate: [0, -8, -8, -8, 0] }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 2.4, delay: T.wave, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" as const }
          }
        >
          <path d="M492 430 Q532 438 542 476 Q550 516 528 548 Q512 570 494 562 Q512 530 508 496 Q504 464 488 444 Z" fill={hair} stroke="#1c1a17" strokeWidth="2" />
          <ellipse cx="472" cy="462" rx="25" ry="23" fill={skin} stroke="#1c1a17" strokeWidth="2.5" />
          <path d="M448 456 Q450 426 478 420 Q508 418 516 444 Q520 458 514 470 Q508 446 486 441 Q462 438 452 460 Z" fill={hair} />
          <path d="M452 458 Q444 482 452 504 Q446 490 446 472 Q446 462 452 458 Z" fill={hair} />
          <path d="M452 457 Q459 452 466 457" stroke="#1c1a17" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M454 476 Q462 481 472 475" stroke="#1c1a17" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </motion.g>

        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "520px 514px" }}
          animate={{ rotate: reduced ? 0 : [0, -78, -64, -82, -66, -78, 0] }}
          transition={waveTransition}
        >
          <path d="M520 514 Q510 544 482 554 Q458 564 440 572" stroke={top} strokeWidth="21" strokeLinecap="round" fill="none" />
          <ellipse cx="432" cy="576" rx="14" ry="11" fill={skin} stroke="#1c1a17" strokeWidth="2.5" />
        </motion.g>

        <path d="M318 604 Q380 600 444 595 Q442 587 438 579 Q376 584 312 588 Z" fill="#b9b2a6" stroke="#1c1a17" strokeWidth="3" strokeLinejoin="round" />
        <path d="M312 588 Q302 548 294 510 Q344 506 392 504 Q416 542 438 579 Z" fill="#cdc6ba" stroke="#1c1a17" strokeWidth="3" strokeLinejoin="round" />
      </g>

      {/* speech bubble */}
      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, delay: T.bubble, ease: EASE }}
        style={{ transformBox: "view-box", transformOrigin: "380px 360px" }}
      >
        <g filter="url(#roughSoft)">
          <path
            d="M352 186 Q328 184 328 210 L326 306 Q326 330 350 331 L384 332 L336 380 L428 333 L676 328 Q700 326 699 302 L695 208 Q694 184 670 185 Z"
            fill="#f4efe4"
            stroke="#1c1a17"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </g>
        <text x="358" y="248" fill="#1c1a17" fontSize="34" fontStyle="italic" fontFamily="var(--font-display), Georgia, serif">
          {intro.greeting[0]}
        </text>
        <text x="358" y="296" fill="#1c1a17" fontSize="34" fontStyle="italic" fontFamily="var(--font-display), Georgia, serif">
          {intro.greeting[1]}
        </text>
      </motion.g>

      <rect width="1440" height="900" fill="url(#vig)" pointerEvents="none" />
      <rect width="1440" height="900" filter="url(#paperGrain)" opacity="0.1" style={{ mixBlendMode: "multiply" }} pointerEvents="none" />
    </svg>
  );
}
