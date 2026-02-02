export type Gender = 'male' | 'female';

interface ProfileBase {
  id: string;
  name: string;
  age: number;
  imageUri: string;
  countryCode: string;
  currentLocation: string;
  gender: Gender;
  /** Instagram username (no @). Opens instagram.com on web, app on mobile when available. */
  instagram?: string;
}

/** Exactly one: leaving (has leavingAt) or living (livingInLocation: true). */
export type Profile = ProfileBase &
  (
    | { livingInLocation: true }
    | { livingInLocation?: false; leavingAt: Date }
  );

export interface SwipeDirection {
  x: number;
  y: number;
}
