"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const user_report_entity_1 = require("./entities/user-report.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const admin_action_entity_1 = require("./entities/admin-action.entity");
const admin_notification_entity_1 = require("./entities/admin-notification.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
const subscription_plan_entity_1 = require("../subscriptions/entities/subscription-plan.entity");
const subscription_history_entity_1 = require("../subscriptions/entities/subscription-history.entity");
const message_entity_1 = require("../chat/entities/message.entity");
const conversation_entity_1 = require("../chat/entities/conversation.entity");
const like_entity_1 = require("../interactions/entities/like.entity");
const user_report_repository_1 = require("./repositories/user-report.repository");
const activity_log_repository_1 = require("./repositories/activity-log.repository");
const admin_action_repository_1 = require("./repositories/admin-action.repository");
const admin_notification_repository_1 = require("./repositories/admin-notification.repository");
const user_repository_1 = require("../auth/repositories/user.repository");
const admin_user_service_1 = require("./services/admin-user.service");
const admin_role_service_1 = require("./services/admin-role.service");
const admin_report_service_1 = require("./services/admin-report.service");
const admin_subscription_service_1 = require("./services/admin-subscription.service");
const admin_analytics_service_1 = require("./services/admin-analytics.service");
const admin_chat_service_1 = require("./services/admin-chat.service");
const admin_user_controller_1 = require("./controllers/admin-user.controller");
const admin_role_controller_1 = require("./controllers/admin-role.controller");
const admin_report_controller_1 = require("./controllers/admin-report.controller");
const admin_subscription_controller_1 = require("./controllers/admin-subscription.controller");
const admin_analytics_controller_1 = require("./controllers/admin-analytics.controller");
const admin_chat_controller_1 = require("./controllers/admin-chat.controller");
const conversation_repository_1 = require("../chat/repositories/conversation.repository");
const message_repository_1 = require("../chat/repositories/message.repository");
const mail_module_1 = require("../mail/mail.module");
const firebase_service_1 = require("../../services/firebase.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                user_report_entity_1.UserReport,
                activity_log_entity_1.ActivityLog,
                admin_action_entity_1.AdminAction,
                admin_notification_entity_1.AdminNotification,
                subscription_entity_1.Subscription,
                subscription_plan_entity_1.SubscriptionPlan,
                subscription_history_entity_1.SubscriptionHistory,
                message_entity_1.Message,
                conversation_entity_1.Conversation,
                like_entity_1.Like,
            ]),
            mail_module_1.MailModule,
        ],
        controllers: [
            admin_user_controller_1.AdminUserController,
            admin_role_controller_1.AdminRoleController,
            admin_report_controller_1.AdminReportController,
            admin_subscription_controller_1.AdminSubscriptionController,
            admin_analytics_controller_1.AdminAnalyticsController,
            admin_chat_controller_1.AdminChatController,
        ],
        providers: [
            user_repository_1.UserRepository,
            user_report_repository_1.UserReportRepository,
            activity_log_repository_1.ActivityLogRepository,
            admin_action_repository_1.AdminActionRepository,
            admin_notification_repository_1.AdminNotificationRepository,
            conversation_repository_1.ConversationRepository,
            message_repository_1.MessageRepository,
            admin_user_service_1.AdminUserService,
            admin_role_service_1.AdminRoleService,
            admin_report_service_1.AdminReportService,
            admin_subscription_service_1.AdminSubscriptionService,
            admin_analytics_service_1.AdminAnalyticsService,
            admin_chat_service_1.AdminChatService,
            firebase_service_1.FirebaseService,
        ],
        exports: [admin_user_service_1.AdminUserService, admin_report_service_1.AdminReportService, admin_analytics_service_1.AdminAnalyticsService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map