export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  mobile?: string | null;
  phone?: string | null;
  fax?: string | null;
  fburl?: string | null;
  twitterurl?: string | null;
  linkedinurl?: string | null;
  yturl?: string | null;
  googleplusurl?: string | null;
  address?: string;
  company_name?: string | null;
  image?: string | null;
  status?: 'Y' | 'N';
  createdAt?: Date;
  updatedAt?: Date;
}