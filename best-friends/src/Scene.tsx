import React from "react";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { LEAVE_DURATION, SEATS, Seat, T } from "./timing";

const CX = 540;
const TABLE_TOP = 1060;
const TABLE_BOTTOM = 1800;
const HW_TOP = 82;
const HW_BOTTOM = 150;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

const OUTLINE = "#0b0a0d";

const rowT = (row: number) => 0.085 + row * 0.135;
const yAt = (t: number) => TABLE_TOP + t * (TABLE_BOTTOM - TABLE_TOP);
const hwAt = (t: number) => HW_TOP + t * (HW_BOTTOM - HW_TOP);
const scaleAt = (t: number) => 0.82 + t * 0.55;

// 0 -> 1 as the camera pushes in (and the survivors get "lit")
const zoomProgress = (frame: number) =>
  interpolate(frame, T.zoom as unknown as number[], [0, 1], { ...clamp, easing: ease });
// 0 -> 1 across the ageing from 30 to 70
const ageProgress = (frame: number) =>
  interpolate(frame, T.age2 as unknown as number[], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });

/** A stroke drawn twice: a dark outline beneath, then the colour on top. */
const OLine: React.FC<{
  d: string;
  w: number;
  color: string;
  outline?: string;
  ow?: number;
}> = ({ d, w, color, outline = OUTLINE, ow = 9 }) => (
  <>
    <path d={d} stroke={outline} strokeWidth={w + ow} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
);

const OCircle: React.FC<{ cx: number; cy: number; r: number; color: string; outline?: string }> = ({
  cx,
  cy,
  r,
  color,
  outline = OUTLINE,
}) => <circle cx={cx} cy={cy} r={r} fill={color} stroke={outline} strokeWidth={8} />;

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const pt = (a: [number, number], b: [number, number], p: number) =>
  `${lerp(a[0], b[0], p).toFixed(1)} ${lerp(a[1], b[1], p).toFixed(1)}`;

const Chair: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <g stroke="#3b3a41" strokeWidth={7} strokeLinecap="round" fill="none" opacity={opacity}>
    <path d="M -100 -125 L -100 95" />
    <path d="M -100 -110 L -86 -110 M -100 -80 L -86 -80 M -100 -50 L -86 -50" />
    <path d="M -100 22 L -30 22 L -30 95" />
    <path d="M -86 -125 L -86 22" />
  </g>
);

const Friend: React.FC<{ seat: Seat }> = ({ seat }) => {
  const frame = useCurrentFrame();
  const t = rowT(seat.row);
  const y = yAt(t);
  const x = CX + seat.side * hwAt(t);
  const s = scaleAt(t);

  const z = zoomProgress(frame);
  const a = ageProgress(frame);

  // leaving
  const lp =
    seat.leaveAt === null
      ? 0
      : interpolate(frame, [seat.leaveAt, seat.leaveAt + LEAVE_DURATION], [0, 1], clamp);
  const stand = interpolate(lp, [0, 0.28], [0, 1], { ...clamp, easing: ease });
  const walk = interpolate(lp, [0.22, 1], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const fade = interpolate(lp, [0.6, 1], [1, 0], clamp);
  const darken = interpolate(lp, [0.05, 0.35], [0, 1], clamp);

  // seated colour: rows under the lamp are brighter
  const seatedColor = interpolateColors(seat.row, [0, 4], ["#c4c3c9", "#8d8c93"]);
  const isStayer = seat.leaveAt === null;
  const lit = isStayer ? interpolateColors(z, [0, 1], [seatedColor, "#f5f5f5"]) : seatedColor;
  const fill = interpolateColors(darken, [0, 1], [lit, "#1a191d"]);
  const outline = interpolateColors(darken, [0, 1], [OUTLINE, "#77767d"]);

  // walking pose
  const phase = walk * Math.PI * 7;
  const legSwing = Math.sin(phase) * 26 * Math.min(1, walk * 6);
  const bob = Math.abs(Math.sin(phase)) * -6 * Math.min(1, walk * 6);
  const dx = -walk * 420;
  const dy = -stand * 34 + bob + walk * 40;

  const hip: [number, number] = [-58, 12];
  const leg = (angle: number) => {
    const r = (angle * Math.PI) / 180;
    return `M ${hip[0]} ${hip[1]} L ${(hip[0] + Math.sin(r) * 88).toFixed(1)} ${(hip[1] + Math.cos(r) * 88).toFixed(1)}`;
  };

  // ageing hunch (only matters for the one who stayed)
  const hunch = isStayer ? a * 16 : 0;

  const arm = `M -50 -62 L ${pt([-22, -12], [-46, -10], stand)} L ${pt([14, -14], [-36, 34], stand)}`;

  return (
    <g transform={`translate(${x} ${y}) scale(${-seat.side * s} ${s})`} opacity={fade}>
      <Chair opacity={interpolate(walk, [0, 0.3], [1, 0.55], clamp)} />
      <g transform={`translate(${dx} ${dy})`}>
        {stand > 0.02 ? (
          <g opacity={stand}>
            <OLine d={leg(legSwing)} w={15} color={fill} outline={outline} />
            <OLine d={leg(-legSwing)} w={15} color={fill} outline={outline} />
          </g>
        ) : null}
        <g transform={`rotate(${hunch} ${hip[0]} ${hip[1]})`}>
          <OLine d="M -55 -86 L -58 12" w={40} color={fill} outline={outline} />
          <OCircle cx={-50 + hunch * 0.6} cy={-126 + hunch * 0.5} r={30} color={fill} outline={outline} />
          <OLine d={arm} w={15} color={fill} outline={outline} />
        </g>
        {isStayer ? (
          <g opacity={interpolate(a, [0.25, 0.6], [0, 1], clamp)}>
            <path d="M -92 -10 L -125 205" stroke="#8a8990" strokeWidth={7} strokeLinecap="round" />
            <OLine d="M -60 -50 Q -96 -40 -92 -10" w={13} color={fill} />
          </g>
        ) : null}
      </g>
    </g>
  );
};

const Protagonist: React.FC = () => {
  const frame = useCurrentFrame();
  const z = zoomProgress(frame);
  const a = ageProgress(frame);
  const color = interpolateColors(z, [0, 1], ["#e9e9ec", "#ffffff"]);
  const drop = a * 12;
  const cane = interpolate(a, [0.25, 0.6], [0, 1], clamp);
  // left arm moves from resting on the table to holding the cane
  const leftArm = `M 516 ${1002 + drop} L ${pt([498, 1046], [470, 1030], cane)} L ${pt([514, 1070], [490, 1002], cane)}`;
  return (
    <g>
      {/* chair */}
      <g stroke="#3b3a41" strokeWidth={7} fill="none" strokeLinecap="round">
        <path d="M 500 1060 L 500 912 L 580 912 L 580 1060" />
        <path d="M 500 940 L 580 940" />
      </g>
      <OLine d={`M 540 ${996 + drop} L 540 1060`} w={50} color={color} />
      <path d={`M 540 ${992 + drop} L 540 1062`} stroke="#121115" strokeWidth={9} />
      <OCircle cx={540 + a * 4} cy={958 + drop * 1.6} r={31} color={color} />
      <OLine d={leftArm} w={15} color={color} />
      <OLine d={`M 564 ${1002 + drop} L 582 1046 L 566 1070`} w={15} color={color} />
    </g>
  );
};

const ProtagonistCane: React.FC = () => {
  const frame = useCurrentFrame();
  const cane = interpolate(ageProgress(frame), [0.25, 0.6], [0, 1], clamp);
  return (
    <path d="M 480 1004 L 432 1235" stroke="#8a8990" strokeWidth={7} strokeLinecap="round" opacity={cane} />
  );
};

const TableItems: React.FC = () => {
  const items: React.ReactNode[] = [];
  for (let row = 0; row < 6; row++) {
    const t = rowT(row) + 0.01;
    const y = yAt(t);
    const s = scaleAt(t);
    for (const side of [-1, 1]) {
      const x = CX + side * (hwAt(t) - 34 * s);
      items.push(
        <g key={`${row}${side}`} transform={`translate(${x} ${y}) scale(${s})`}>
          <ellipse cx={0} cy={4} rx={24} ry={8} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.13)" strokeWidth={2} />
          <path d="M -8 -20 L 8 -20 L 6 4 L -6 4 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
        </g>,
      );
    }
  }
  return <g>{items}</g>;
};

const Candle: React.FC = () => {
  const frame = useCurrentFrame();
  const flick = 1 + Math.sin(frame * 0.9) * 0.06 + Math.sin(frame * 2.3) * 0.04;
  const y = yAt(0.3);
  return (
    <g>
      <circle cx={CX} cy={y - 40} r={150 * flick} fill="url(#candleGlow)" />
      <ellipse cx={CX} cy={y + 2} rx={22} ry={7} fill="rgba(0,0,0,0.5)" />
      <rect x={CX - 9} y={y - 54} width={18} height={56} rx={2} fill="#d9232c" />
      <g transform={`translate(${CX} ${y - 66}) scale(1 ${flick})`}>
        <ellipse cx={0} cy={0} rx={7} ry={14} fill="#ffc35a" />
        <ellipse cx={0} cy={3} rx={3.5} ry={7} fill="#fff6d8" />
      </g>
    </g>
  );
};

const departureFrames = SEATS.filter((s) => s.leaveAt !== null)
  .map((s) => (s.leaveAt as number) + 18)
  .sort((p, q) => p - q);

const LAMPS = [
  { y: 760, w: 30 },
  { y: 792, w: 36 },
  { y: 830, w: 44 },
  { y: 874, w: 54 },
  { y: 926, w: 66 },
];
const LAMP_OFF_AT = [1, 3, 5, 7, 8].map((i) => departureFrames[i]);

export const lampBrightness = (frame: number, k: number) => {
  const off = LAMP_OFF_AT[k];
  const flicker = frame > off - 6 && frame < off + 6 ? (Math.sin(frame * 5.1) > 0 ? 1 : 0.35) : 1;
  return interpolate(frame, [off, off + 6], [1, 0.1], clamp) * flicker;
};

const Lamps: React.FC = () => {
  const frame = useCurrentFrame();
  const avg = LAMPS.reduce((acc, _, k) => acc + lampBrightness(frame, k), 0) / LAMPS.length;
  return (
    <g>
      <ellipse cx={CX} cy={1020} rx={520} ry={620} fill="url(#roomGlow)" opacity={0.25 + avg * 0.75} />
      <line x1={CX} y1={-200} x2={CX} y2={926} stroke="#2a292e" strokeWidth={2} />
      {LAMPS.map((l, k) => {
        const b = lampBrightness(frame, k);
        return (
          <g key={k}>
            <ellipse cx={CX} cy={l.y + l.w * 0.6} rx={l.w * 1.3} ry={l.w * 0.9} fill="url(#lampGlow)" opacity={b} />
            <path
              d={`M ${CX - l.w * 0.18} ${l.y} L ${CX + l.w * 0.18} ${l.y} L ${CX + l.w / 2} ${l.y + l.w * 0.42} L ${CX - l.w / 2} ${l.y + l.w * 0.42} Z`}
              fill="#1d1c21"
            />
            <ellipse
              cx={CX}
              cy={l.y + l.w * 0.42}
              rx={l.w / 2}
              ry={l.w * 0.08}
              fill="none"
              stroke="#f0cf93"
              strokeWidth={2.5}
              opacity={0.04 + b * 0.96}
            />
          </g>
        );
      })}
    </g>
  );
};

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const z = zoomProgress(frame);
  const scale = lerp(1.3, 2.4, z);
  const ty = lerp(1150, 1235, z);
  return <g transform={`translate(${CX} ${ty}) scale(${scale}) translate(${-CX} -1100)`}>{children}</g>;
};

export const Scene: React.FC = () => {
  const ordered = [...SEATS].sort((p, q) => p.row - q.row);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="roomGlow">
          <stop offset="0%" stopColor="#3a3027" stopOpacity={0.9} />
          <stop offset="55%" stopColor="#1d1917" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#100e0f" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="lampGlow">
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#ffd9a0" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="candleGlow">
          <stop offset="0%" stopColor="#ff9b4a" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#ff9b4a" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="tableFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e2d33" />
          <stop offset="70%" stopColor="#1f1e23" />
          <stop offset="100%" stopColor="#141316" />
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="55%" r="75%">
          <stop offset="45%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.85} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="#111012" />
      <Camera>
        <Lamps />
        <Protagonist />
        <path
          d={`M ${CX - HW_TOP} ${TABLE_TOP} L ${CX + HW_TOP} ${TABLE_TOP} L ${CX + HW_BOTTOM} ${TABLE_BOTTOM} L ${CX - HW_BOTTOM} ${TABLE_BOTTOM} Z`}
          fill="url(#tableFill)"
          stroke="#3a3940"
          strokeWidth={2}
        />
        <TableItems />
        <Candle />
        <ProtagonistCane />
        {ordered.map((seat) => (
          <Friend key={`${seat.side}-${seat.row}`} seat={seat} />
        ))}
      </Camera>
      <rect width={1080} height={1920} fill="url(#vignette)" />
    </svg>
  );
};
