export interface Driver {
  id: number;
  companyId: number;
  name: string;
  license: string;
  active: boolean;
  companyName?: string;
}

export interface CreateDriverRequest {
  companyId: number;
  name: string;
  license: string;
}

export interface UpdateDriverRequest {
  companyId?: number;
  name?: string;
  license?: string;
  active?: boolean;
}