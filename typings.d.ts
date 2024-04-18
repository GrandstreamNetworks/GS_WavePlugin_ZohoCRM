declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
    export function ReactComponent(
        props: React.SVGProps<SVGSVGElement>,
    ): React.ReactElement;

    const url: string;
    export default url;
}

interface LooseObject {
    [key: string]: any
}

declare type CALL_CONFIG_VARIABLES = {
    CallType?: string
    Number: string
    CallDirection?: string
    Name: string
    EntityId: string
    EntityType: string
    Agent: string
    AgentFirstName?: string
    AgentLastName?: string
    AgentEmail?: string
    Duration: string
    DateTime: string
    CallStartTimeLocal: string
    CallStartTimeUTC: string
    CallEstablishedTimeLocal: string
    CallEstablishedTimeUTC: string
    CallEndTimeLocal: string
    CallEndTimeUTC: string
    CallStartTimeUTCMillis: number
    CallEstablishedTimeUTCMillis: number
    CallEndTimeUTCMillis: number
}

type Who = {
    id: string
    name: string
}

type CallParams = {
    Call_Purpose: string
    Call_Start_Time: string
    Subject: string
    Call_Type: string
    $se_module: string
    Dialled_Number?: string
    Call_Duration?: string | number
    Call_Duration_in_seconds?: number
    Call_Result?: string
    Call_Status?: string
    Who_Id?: Who
    What_Id?: Who
    Description?: string,
}