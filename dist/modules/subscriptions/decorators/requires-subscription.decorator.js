"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiresSubscription = void 0;
const common_1 = require("@nestjs/common");
const RequiresSubscription = (...features) => (0, common_1.SetMetadata)('requiresSubscription', features);
exports.RequiresSubscription = RequiresSubscription;
//# sourceMappingURL=requires-subscription.decorator.js.map