export interface Driver {
  id: number;
  companyId: number;
  name: string;
  license: string;
  active: boolean;
}

export interface CreateDriverRequest {
  companyId: number;
  name: string;
  license: string;
}

