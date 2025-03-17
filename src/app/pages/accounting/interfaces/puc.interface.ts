export interface apiResponse<T = any> {
    code: number;
    messages: Messages;
    data?: T;
}
export interface Messages {
    success?: string;
    error?: string;
}
export interface Puc {
    code: string;
    cmpy: string;
    description: string;
    nature: string;
    classification: string;
    parent_account: string;
    active: "Y" | "N";
}

export interface PucData {
    account: string;
    cmpy: string;
}

export interface PucCmpy {
    cmpy: string;
}
