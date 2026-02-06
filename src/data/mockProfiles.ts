import { Profile } from '../types/profile';
import { getCloudflareImageUrl } from '../utils/cloudflare';

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function addHours(d: Date, h: number): Date {
  const out = new Date(d);
  out.setHours(out.getHours() + h);
  return out;
}

const now = new Date();

export const MOCK_MEN: Profile[] = [
  {
    id: 'm1',
    name: 'Manuel',
    age: 28,
    imageUri: getCloudflareImageUrl('PHOTO-2026-02-02-21-34-16.jpg'),
    countryCode: 'DE',
    currentLocation: 'Rio de Janeiro',
    livingInLocation: false,
    leavingAt: addDays(now, 1),
    gender: 'male',
    instagram: 'Manuelsterr',
  },
  {
    id: 'm2',
    name: 'Bruno',
    age: 32,
    imageUri: getCloudflareImageUrl('860FD977-B1D7-4C43-8780-3637B21A40E8.JPG'),
    countryCode: 'PT',
    currentLocation: 'Rio de Janeiro',
    leavingAt: addHours(now, 18),
    gender: 'male',
    instagram: 'bruno.salvador',
  },
  {
    id: 'm3',
    name: 'Lucas',
    age: 25,
    imageUri: getCloudflareImageUrl('IMG_6127.PNG'),
    countryCode: 'AR',
    currentLocation: 'Rio de Janeiro',
    leavingAt: addDays(now, 2),
    gender: 'male',
    instagram: 'lucas.sp',
  },
  {
    id: 'm4',
    name: 'Azad',
    age: 31,
    imageUri: getCloudflareImageUrl('azad.JPG'),
    countryCode: 'FR',
    currentLocation: 'Rio de Janeiro',
    leavingAt: addDays(now, 1),
    gender: 'male',
    instagram: 'diego.rj',
  },
  {
    id: 'm5',
    name: 'John',
    age: 27,
    imageUri: getCloudflareImageUrl('john.JPG'),
    countryCode: 'BR',
    currentLocation: 'Rio de Janeiro',
    leavingAt: addHours(now, 48),
    gender: 'male',
    instagram: 'thiago.floripa',
  },
];

export const MOCK_WOMEN: Profile[] = [
  {
    id: 'w1',
    name: 'Beatriz',
    age: 26,
    imageUri: getCloudflareImageUrl('w1.jpg'),
    countryCode: 'BR',
    currentLocation: 'Rio de Janeiro',
    livingInLocation: true,
    gender: 'female',
    instagram: 'bea.rioo',
  },
  {
    id: 'w2',
    name: 'Marina',
    age: 29,
    imageUri: getCloudflareImageUrl('w2.jpg'),
    countryCode: 'ES',
    currentLocation: 'Rio de Janeiro',
    leavingAt: addHours(now, 12),
    gender: 'female',
    instagram: 'marina.salvador',
  },
  {
    id: 'w3',
    name: 'Camila',
    age: 24,
    imageUri: getCloudflareImageUrl('w3.jpg'),
    countryCode: 'BR',
    currentLocation: 'Rio de Janeiro',
    leavingAt: addDays(now, 3),
    gender: 'female',
    instagram: 'camila.sp',
  },
  {
    id: 'w4',
    name: 'Larissa',
    age: 31,
    imageUri: getCloudflareImageUrl('w4.jpg'),
    countryCode: 'UY',
    currentLocation: 'Rio de Janeiro',
    leavingAt: addDays(now, 7),
    gender: 'female',
    instagram: 'larissa.rj',
  },
  {
    id: 'w5',
    name: 'Fernanda',
    age: 27,
    imageUri: getCloudflareImageUrl('w5.jpg'),
    countryCode: 'BR',
    currentLocation: 'Rio de Janeiro',
    leavingAt: addHours(now, 36),
    gender: 'female',
    instagram: 'fernanda.floripa',
  },
];

export const MOCK_PROFILES = [...MOCK_MEN, ...MOCK_WOMEN];
