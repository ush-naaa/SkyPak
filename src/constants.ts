import { City } from './types';

export const PAKISTANI_CITIES: City[] = [
  { id: 'karachi', name: 'Karachi', nameUrdu: 'کراچی', lat: 24.8607, lng: 67.0011, pollution: 'High' },
  { id: 'lahore', name: 'Lahore', nameUrdu: 'لاہور', lat: 31.5204, lng: 74.3587, pollution: 'High' },
  { id: 'islamabad', name: 'Islamabad', nameUrdu: 'اسلام آباد', lat: 33.6844, lng: 73.0479, pollution: 'Moderate' },
  { id: 'peshawar', name: 'Peshawar', nameUrdu: 'پشاور', lat: 34.0151, lng: 71.5249, pollution: 'Moderate' },
  { id: 'quetta', name: 'Quetta', nameUrdu: 'کوئٹہ', lat: 30.1798, lng: 66.9750, pollution: 'Low' },
  { id: 'multan', name: 'Multan', nameUrdu: 'ملتان', lat: 30.1575, lng: 71.5249, pollution: 'Moderate' },
  { id: 'faisalabad', name: 'Faisalabad', nameUrdu: 'فیصل آباد', lat: 31.4504, lng: 73.1350, pollution: 'High' },
  { id: 'rawalpindi', name: 'Rawalpindi', nameUrdu: 'راولپنڈی', lat: 33.5651, lng: 73.0169, pollution: 'High' },
];

export const METEOR_SHOWERS = [
  { name: 'Quadrantids', month: 0, day: 3, zhr: 120 },
  { name: 'Lyrids', month: 3, day: 22, zhr: 18 },
  { name: 'Eta Aquariids', month: 4, day: 6, zhr: 50 },
  { name: 'Delta Aquariids', month: 6, day: 30, zhr: 25 },
  { name: 'Perseids', month: 7, day: 12, zhr: 100 },
  { name: 'Orionids', month: 9, day: 21, zhr: 25 },
  { name: 'Leonids', month: 10, day: 17, zhr: 15 },
  { name: 'Geminids', month: 11, day: 14, zhr: 150 },
  { name: 'Ursids', month: 11, day: 22, zhr: 10 },
];
