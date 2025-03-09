export interface apiResponse<T = any> {
    message: string;
    data?: T;
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

export interface PucData{
    account: string;
    cmpy: string;
}
