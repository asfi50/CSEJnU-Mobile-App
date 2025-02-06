export interface Contact {
  roles: {
    um_student?: boolean;
    um_teacher?: boolean;
  };
  name: string;
  email: string; // This will be used as identifier
  phone: string;
  blood_type: string;
  linkedin: string;
  facebook: string;
}
