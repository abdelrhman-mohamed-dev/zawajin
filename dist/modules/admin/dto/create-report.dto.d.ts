export declare class CreateReportDto {
    reportedUserId: string;
    reportType: string;
    description: string;
    evidence?: Record<string, any>;
    conversationId?: string;
}
