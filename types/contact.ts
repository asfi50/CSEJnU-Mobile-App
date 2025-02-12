export interface Contact {
  roles: {
    um_student?: boolean;
    um_teacher?: boolean;
  };
  name: string;
  email: string; // This will be used as identifier
  student_id?: string;
  batch?: string;
  cr?: string[];
  graduated?: string[];
  job_description?: string;
  blood_type?: string;
  birthday?: string;
  gender?: string[];
  phone?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  telegram?: string;
  github?: string;
  website?: string;
  photo?: string | null;
}

export interface ContactFilterOptions {
  search: string;
  roles: {
    students: boolean;
    teachers: boolean;
    graduated: boolean;
    cr: boolean;
  };
  batch?: string;
  gender?: string[];
  blood_type?: string[];
}

// Update SortOption type to be more specific
export type SortOption = 'name' | 'email' | 'batch' | 'birthday';

export interface ContactSortOptions {
  field: SortOption;
  ascending: boolean;
}
