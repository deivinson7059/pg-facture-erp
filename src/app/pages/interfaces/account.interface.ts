export interface Account {
    code: string;
    cmpy: string;
    description: string;
    nature: string;
    classification: string;
    parent_account: string | null;
    active: string;
    children?: Account[];
  }