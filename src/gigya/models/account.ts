declare type AnyRecord={
    [key:string] :any
}

export interface Data extends AnyRecord
{
    
}

 export interface Preferences {
     [key:string] :{
         isConsentGranted: boolean
     }
 }

    export interface Emails {
        verified: string[];
        unverified: any[];
    }

    export interface Identity {
      
    }

    export interface Coordinates {
        lat: number;
        lon: number;
    }

    export interface LastLoginLocation {
        country: string;
        coordinates: Coordinates;
    }

    export interface LoginIDs {
        emails: string[];
        unverifiedEmails: any[];
    }

    export interface RbaPolicy {
        riskPolicyLocked: boolean;
    }

    export interface Profile {
        nickname: string;
        firstName: string;
        lastName: string;
        email: string;
        photoURL: string;
        thumbnailURL: string;
    }

    export interface Identity {
        provider: string;
        providerUID: string;
        allowsLogin: boolean;
        isLoginIdentity: boolean;
        isExpiredSession: boolean;
        lastUpdated: Date;
        lastUpdatedTimestamp: number;
        oldestDataUpdated: Date;
        oldestDataUpdatedTimestamp: number;
        firstName: string;
        lastName: string;
        nickname: string;
        email: string;
        photoURL: string;
        thumbnailURL: string;


    }

    export interface UserInfo {
        UID: string;
        UIDSig: string;
        UIDSignature: string;
        signatureTimestamp: string;
        isSiteUser: boolean;
        isConnected: boolean;
        isTempUser: boolean;
        isLoggedIn: boolean;
        loginProvider: string;
        loginProviderUID: string;
        isSiteUID: boolean;
        identities: Identity[];
        nickname: string;
        photoURL: string;
        thumbnailURL: string;
        firstName: string;
        lastName: string;
        email: string;
        capabilities: string;
        providers: string;
        oldestDataUpdatedTimestamp: number;
        oldestDataAge: number;
        statusReason: string;
        timestamp: string;
        time: Date;
    }

    export interface Workflow {
        path: string;
    }

    export interface EventMap {
        events: string;
        args: any[];
    }

    export interface CustomEventMap {
        eventMap: EventMap[];
    }

    export interface Data2 {
    }

    export interface RequestParams {
        connectWithoutLoginBehavior: string;
        defaultRegScreenSet: string;
        defaultMobileRegScreenSet: string;
        sessionExpiration: number;
        rememberSessionExpiration: number;
        apiDomain: string;
        workflow: Workflow;
        storageDomainOverride: string;
        enabledProviders: string;
        lang: string;
        customEventMap: CustomEventMap;
        APIKey: string;
        data: Data2;
        include: string;
    }

    export interface Account {
        registeredTimestamp: number;
        UID: string;
        UIDSignature: string;
        signatureTimestamp: string;
        created: Date;
        createdTimestamp: number;
        data: Data;
        preferences: Preferences;
        emails: Emails;
        identities: Identity[];
        isActive: boolean;
        isLockedOut: boolean;
        isRegistered: boolean;
        isVerified: boolean;
        lastLogin: Date;
        lastLoginLocation: LastLoginLocation;
        lastLoginTimestamp: number;
        lastUpdated: Date;
        lastUpdatedTimestamp: number;
        loginProvider: string;
        loginIDs: LoginIDs;
        rbaPolicy: RbaPolicy;
        oldestDataUpdated: Date;
        oldestDataUpdatedTimestamp: number;
        profile: Profile;
        registered: Date;
        regSource: string;
        socialProviders: string;
        verified: Date;
        verifiedTimestamp: number;
        userInfo: UserInfo;
        id_token: string;
        status: string;
        operation: string;
        email: string;
    }



