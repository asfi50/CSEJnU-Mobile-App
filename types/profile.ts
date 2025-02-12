export interface ProfileData {
  name: string;
  email: string;
  exp: number;
  iat: number;
  meta: {
    role: string;
    student_id: string;
    batch: string;
    blood_type: string;
    birthday: string;
    phone: string;
    photo: string;
    gender: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    telegram: string;
    github: string;
    website: string;
    cr: boolean;
    graduated: boolean;
    job_description: string;
  };
}
