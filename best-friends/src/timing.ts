// All timings are in frames at 30 fps.
export const T = {
  fadeIn: [0, 12],
  text1: [4, 34],
  age1: [20, 185], // 18 -> 30
  zoom: [140, 205],
  text2: [195, 245],
  age2: [232, 312], // 30 -> 70
  fadeOut: [385, 412],
} as const;

export const LEAVE_DURATION = 52;

// Seats: side -1 = left, 1 = right. row 0 = closest to the head of the table.
export type Seat = { side: -1 | 1; row: number; leaveAt: number | null };

const order: Array<[-1 | 1, number]> = [
  [-1, 4],
  [1, 3],
  [-1, 1],
  [1, 4],
  [-1, 2],
  [1, 1],
  [-1, 3],
  [-1, 0],
  [1, 2],
];

export const SEATS: Seat[] = [];
for (const side of [-1, 1] as const) {
  for (let row = 0; row < 5; row++) {
    const idx = order.findIndex(([s, r]) => s === side && r === row);
    SEATS.push({ side, row, leaveAt: idx === -1 ? null : 36 + idx * 15 });
  }
}

export const departuresAt = (frame: number) =>
  SEATS.filter((s) => s.leaveAt !== null && frame >= s.leaveAt + 20).length;
