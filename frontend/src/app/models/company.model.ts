export interface Company {
  id: number;
  name: string;
  taxNumber: string;
  createdAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  taxNumber: string;
}

export interface UpdateCompanyRequest {
  name: string;
  taxNumber: string;
}

