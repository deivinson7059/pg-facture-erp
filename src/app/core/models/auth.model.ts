import { RouteInfo } from "app/layout/sidebar/sidebar.metadata";

export interface ApiResponse {
    code: number;
    success: boolean;
    messages: {
        success?: string;
        error?: string | string[];
    };
    error?: string;
}



export interface UserData {
    id: string;
    name: string;
    identification_number: string;
    email: string;
}

export interface Warehouse {
    ware: string;
    role_id: string;
    role_name: string;
    list: string;
}

export interface Company {
    cmpy: string;
    cmpy_name: string;
    wares: Warehouse[];
}

export interface FirstStepResponse extends ApiResponse {
    data?: {
        user: UserData;
        cmpy: Company[];
    };
}

export interface SecondStepResponse extends ApiResponse {
    data?: {
        user: UserData;
        cmpy: {
            id: string;
            ware: string;
            role_id: string;
            role: string;
            path: string;
            list: string;
            platform_id: number;
            scopes: string[];
        };
        token: string;
        access_token: string;
        menu: RouteInfo[];
    };
}