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
