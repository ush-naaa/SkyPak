export interface DSO {
  name: string;
  id: string;
  ra: number; // Hours
  dec: number; // Degrees
  mag: number;
  type: 'Galaxy' | 'Nebula' | 'Cluster';
  description: string;
}

export const MESSIER_OBJECTS: DSO[] = [
  { 
    id: 'M31', 
    name: 'Andromeda Galaxy', 
    ra: 0.712, 
    dec: 41.27, 
    mag: 3.4, 
    type: 'Galaxy',
    description: 'The nearest major galaxy to the Milky Way.'
  },
  { 
    id: 'M42', 
    name: 'Orion Nebula', 
    ra: 5.58, 
    dec: -5.38, 
    mag: 4.0, 
    type: 'Nebula',
    description: 'A massive star-forming region in Orion.'
  },
  { 
    id: 'M45', 
    name: 'Pleiades', 
    ra: 3.79, 
    dec: 24.11, 
    mag: 1.6, 
    type: 'Cluster',
    description: 'The Seven Sisters open star cluster.'
  },
  { 
    id: 'M8', 
    name: 'Lagoon Nebula', 
    ra: 18.06, 
    dec: -24.38, 
    mag: 6.0, 
    type: 'Nebula',
    description: 'Stunning nebula visible from southern Pakistan in summer.'
  },
  { 
    id: 'M13', 
    name: 'Hercules Cluster', 
    ra: 16.69, 
    dec: 36.46, 
    mag: 5.8, 
    type: 'Cluster',
    description: 'The finest globular cluster in the northern sky.'
  }
];
