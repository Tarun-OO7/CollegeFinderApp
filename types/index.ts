// Strict TypeScript interfaces for the College Discovery Platform.
// Optional fields explicitly marked because mock data intentionally includes nulls/missing values.

export interface Course {
  name: string;
  duration: string;
  fees?: number | null;
}

export interface Placement {
  averagePackage?: number | null;
  highestPackage?: number | null;
  topRecruiters: string[];
}

export type CollegeType = 'Govt' | 'Private' | 'Deemed';

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type: CollegeType;
  rating?: number | null;
  totalFees?: number | null;
  overview: string;
  courses: Course[];
  placements: Placement;
}

export interface FilterState {
  state: string;
  type: string;
  maxFees: number;
  minRating: number;
}
