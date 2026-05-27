import {
  Body,
  Observer,
  Equator,
  Horizon,
  SearchMoonPhase,
  MoonPhase,
  SearchLocalSolarEclipse,
  SearchLunarEclipse,
  SearchRiseSet,
  Illumination,
} from 'astronomy-engine';
import { AstroEvent, City } from '../types';
import { METEOR_SHOWERS } from '../constants';
import { BRIGHT_STARS } from '../data/stars';
import { MESSIER_OBJECTS } from '../data/dso';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export class AstronomyService {
  private observer: Observer;
  private city: City;

  constructor(city: City) {
    this.city = city;
    this.observer = new Observer(city.lat, city.lng, 0);
  }

  getCurrentMoonPhase() {
    const date = new Date();
    const phase = MoonPhase(date);
    return {
      phase: phase,
      name: this.getMoonPhaseName(phase),
    };
  }

  private getMoonPhaseName(phase: number): string {
    if (phase < 45) return 'New Moon';
    if (phase < 90) return 'First Quarter';
    if (phase < 135) return 'Full Moon';
    if (phase < 180) return 'Third Quarter';
    return 'New Moon';
  }

  async getEventsForYear(year: number): Promise<AstroEvent[]> {
    const events: AstroEvent[] = [];
    const startDate = new Date(year, 0, 1);

    // 1. Moon Phases (Precise times)
    let phaseDate = startDate;
    for (let i = 0; i < 12; i++) {
      const nextFullMoon = SearchMoonPhase(180, phaseDate, 40);
      if (nextFullMoon && nextFullMoon.date.getFullYear() === year) {
        events.push({
          id: `moon-full-${nextFullMoon.date.getTime()}`,
          name: 'Full Moon',
          nameUrdu: 'پورے چاند کی رات',
          date: nextFullMoon.date,
          type: 'Moon',
          altitude: 45,
          azimuth: 180,
          visibility: 'Excellent',
          peakTime: nextFullMoon.date,
          startTime: nextFullMoon.date,
          endTime: nextFullMoon.date,
          moonInterference: false,
        });
      }
      const nextNewMoon = SearchMoonPhase(0, phaseDate, 40);
      if (nextNewMoon && nextNewMoon.date.getFullYear() === year) {
        events.push({
          id: `moon-new-${nextNewMoon.date.getTime()}`,
          name: 'New Moon',
          nameUrdu: 'نیا چاند',
          date: nextNewMoon.date,
          type: 'Moon',
          altitude: 0,
          azimuth: 270,
          visibility: 'Excellent',
          peakTime: nextNewMoon.date,
          startTime: nextNewMoon.date,
          endTime: nextNewMoon.date,
          moonInterference: false,
        });
      }
      phaseDate = new Date(phaseDate.getTime() + 1000 * 60 * 60 * 24 * 30);
    }

    // 2. Eclipses (Keep existing logic)
    let solarEclipse = SearchLocalSolarEclipse(startDate, this.observer);
    while (solarEclipse && solarEclipse.peak.time.date.getFullYear() === year) {
      events.push({
        id: `solar-${solarEclipse.peak.time.date.getTime()}`,
        name: `${solarEclipse.kind} Solar Eclipse`,
        nameUrdu: 'سورج گرہن',
        date: solarEclipse.peak.time.date,
        type: 'Eclipse',
        altitude: 45, 
        azimuth: 180,
        visibility: 'Good',
        peakTime: solarEclipse.peak.time.date,
        startTime: solarEclipse.partial_begin.time.date || solarEclipse.peak.time.date,
        endTime: solarEclipse.partial_end.time.date || solarEclipse.peak.time.date,
        moonInterference: false,
      });
      solarEclipse = SearchLocalSolarEclipse(new Date(solarEclipse.peak.time.date.getTime() + 1000 * 60 * 60 * 24 * 30), this.observer);
    }

    let lunarEclipse = SearchLunarEclipse(startDate);
    while (lunarEclipse && lunarEclipse.peak.date.getFullYear() === year) {
      // Calculate start and end based on penumbral duration (sd_penum is half-duration in minutes)
      const peakMillis = lunarEclipse.peak.date.getTime();
      const semiDurationMillis = (lunarEclipse.sd_penum || 0) * 60 * 1000;
      const startTime = new Date(peakMillis - semiDurationMillis);
      const endTime = new Date(peakMillis + semiDurationMillis);

      events.push({
        id: `lunar-${lunarEclipse.peak.date.getTime()}`,
        name: `${lunarEclipse.kind} Lunar Eclipse`,
        nameUrdu: 'چاند گرہن',
        date: lunarEclipse.peak.date,
        type: 'Eclipse',
        altitude: 60,
        azimuth: 90,
        visibility: 'Excellent',
        peakTime: lunarEclipse.peak.date,
        startTime: startTime,
        endTime: endTime,
        moonInterference: false,
      });
      lunarEclipse = SearchLunarEclipse(new Date(lunarEclipse.peak.date.getTime() + 1000 * 60 * 60 * 24 * 30));
    }

    // 2. Meteor Showers
    METEOR_SHOWERS.forEach(shower => {
      const peakDate = new Date(year, shower.month, shower.day);
      events.push({
        id: `meteor-${shower.name}-${year}`,
        name: `${shower.name} Meteor Shower`,
        nameUrdu: 'شہاب ثاقب کی بارش',
        date: peakDate,
        type: 'Meteor Shower',
        altitude: 30,
        azimuth: 45,
        visibility: 'Good',
        peakTime: peakDate,
        startTime: new Date(peakDate.getTime() - 1000 * 60 * 60 * 4),
        endTime: new Date(peakDate.getTime() + 1000 * 60 * 60 * 4),
        moonInterference: MoonPhase(peakDate) > 120, // Interference if near full moon
      });
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getCelestialBodies(date: Date) {
    const bodies = [
      { name: 'Sun', color: '#ffd700', body: Body.Sun },
      { name: 'Moon', color: '#e8e8ff', body: Body.Moon },
      { name: 'Mercury', color: '#9e9e9e', body: Body.Mercury },
      { name: 'Venus', color: '#ffecb3', body: Body.Venus },
      { name: 'Mars', color: '#ff5252', body: Body.Mars },
      { name: 'Jupiter', color: '#ffcc80', body: Body.Jupiter },
      { name: 'Saturn', color: '#ffe082', body: Body.Saturn },
    ];

    const results = bodies.map(b => {
      const eq = Equator(b.body, date, this.observer, true, true);
      const hor = Horizon(date, this.observer, eq.ra, eq.dec, 'normal');
      const ill = Illumination(b.body, date);
      
      return {
        ...b,
        azimuth: hor.azimuth,
        altitude: hor.altitude,
        visible: hor.altitude > 0,
        magnitude: ill.mag,
        distanceEarth: ill.geo_dist, // AU
        distanceSun: ill.helio_dist, // AU
        type: 'Planet' as const
      };
    });

    const stars = BRIGHT_STARS.map(s => {
      const hor = Horizon(date, this.observer, s.ra, s.dec, 'normal');
      return {
        ...s,
        azimuth: hor.azimuth,
        altitude: hor.altitude,
        visible: hor.altitude > 0,
        type: 'Star' as const,
        color: '#ffffff'
      };
    });

    const dsos = MESSIER_OBJECTS.map(d => {
      const hor = Horizon(date, this.observer, d.ra, d.dec, 'normal');
      return {
        ...d,
        azimuth: hor.azimuth,
        altitude: hor.altitude,
        visible: hor.altitude > 0,
        type: 'DSO' as const,
        color: d.type === 'Nebula' ? '#ff00ff' : d.type === 'Galaxy' ? '#00f3ff' : '#00ffaa'
      };
    });

    return [...results, ...stars, ...dsos].filter(b => b.visible);
  }

  getPointer(event: AstroEvent) {
    // Return relative position for compass
    return { azimuth: event.azimuth, altitude: event.altitude };
  }
}

