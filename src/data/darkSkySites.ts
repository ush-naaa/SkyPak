export interface DarkSkySite {
  name: string;
  nameUrdu: string;
  region: string;
  bortle: number; // 1-9 (1 is darkest)
  lat: number;
  lng: number;
  description: string;
}

export const PAKISTANI_DARK_SKY_SITES: DarkSkySite[] = [
  {
    name: "Hingol National Park",
    nameUrdu: "ہنگول نیشنل پارک",
    region: "Balochistan",
    bortle: 1,
    lat: 25.43,
    lng: 65.51,
    description: "One of the darkest spots in Pakistan with Bortle 1 skies. Perfect for astrophotography."
  },
  {
    name: "Deosai Plains",
    nameUrdu: "دیوسائی",
    region: "Gilgit-Baltistan",
    bortle: 2,
    lat: 34.98,
    lng: 75.45,
    description: "High altitude viewing at 4,000m+. Exceptionally clear atmosphere."
  },
  {
    name: "Gorakh Hill Station",
    nameUrdu: "گورکھ ہل",
    region: "Sindh",
    bortle: 2,
    lat: 26.85,
    lng: 67.15,
    description: "The 'Murree of Sindh'. Excellent dark sky site away from Karachi's light pollution."
  },
  {
    name: "Kalash Valley",
    nameUrdu: "کیلاش",
    region: "KPK",
    bortle: 3,
    lat: 35.68,
    lng: 71.72,
    description: "Nestled in the Hindu Kush mountains, offering pristine views of the Milky Way."
  },
  {
    name: "Cholistan Desert",
    nameUrdu: "چولستان",
    region: "Punjab",
    bortle: 2,
    lat: 28.5,
    lng: 71.7,
    description: "Vast desert area with minimal light pollution and flat horizons."
  }
];
