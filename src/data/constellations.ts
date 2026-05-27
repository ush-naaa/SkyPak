import { BRIGHT_STARS } from './stars';

export interface Constellation {
  name: string;
  nameUrdu: string;
  lines: [string, string][]; // Pairs of star names
}

export const CONSTELLATIONS: Constellation[] = [
  {
    name: "Orion",
    nameUrdu: "جبار",
    lines: [
      ["Betelgeuse", "Alnilam"],
      ["Alnilam", "Bellatrix"],
      ["Alnilam", "Alnitak"],
      ["Alnilam", "Mintaka"],
      ["Rigel", "Saiph"],
      ["Rigel", "Mintaka"],
      ["Saiph", "Alnitak"]
    ]
  },
  {
    name: "Ursa Major",
    nameUrdu: "دب اکبر",
    lines: [
      ["Dubhe", "Merak"],
      ["Merak", "Phecda"],
      ["Phecda", "Megrez"],
      ["Megrez", "Alioth"],
      ["Alioth", "Mizar"],
      ["Mizar", "Alkaid"]
    ]
  },
  {
    name: "Cassiopeia",
    nameUrdu: "ذات الکرسی",
    lines: [
      ["Schedar", "Caph"],
      ["Schedar", "Tsih"],
      ["Tsih", "Ruchbah"],
      ["Ruchbah", "Segun"]
    ]
  }
];
