"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedLikes = seedLikes;
const like_entity_1 = require("../../modules/interactions/entities/like.entity");
async function seedLikes(dataSource, users) {
    const likeRepository = dataSource.getRepository(like_entity_1.Like);
    const mutualLikes = [
        {
            user1: 'ahmed.hassan@example.com',
            user2: 'fatima.zahra@example.com',
        },
        {
            user1: 'omar.abdullah@example.com',
            user2: 'maryam.ahmed@example.com',
        },
        {
            user1: 'khalid.rahman@example.com',
            user2: 'khadija.yusuf@example.com',
        },
        {
            user1: 'ibrahim.mahmoud@example.com',
            user2: 'nadia.omar@example.com',
        },
    ];
    const oneWayLikes = [
        {
            from: 'aisha.mohammed@example.com',
            to: 'ahmed.hassan@example.com',
        },
        {
            from: 'sara.ibrahim@example.com',
            to: 'yusuf.ali@example.com',
        },
        {
            from: 'hassan.khalil@example.com',
            to: 'layla.hassan@example.com',
        },
        {
            from: 'zainab.ali@example.com',
            to: 'ibrahim.mahmoud@example.com',
        },
        {
            from: 'mustafa.tariq@example.com',
            to: 'aisha.mohammed@example.com',
        },
        {
            from: 'yusuf.ali@example.com',
            to: 'sara.ibrahim@example.com',
        },
    ];
    let createdCount = 0;
    for (const mutualLike of mutualLikes) {
        const user1 = users.find((u) => u.email === mutualLike.user1);
        const user2 = users.find((u) => u.email === mutualLike.user2);
        if (!user1 || !user2)
            continue;
        const existing1 = await likeRepository.findOne({
            where: { userId: user1.id, likedUserId: user2.id },
        });
        if (!existing1) {
            const like1 = likeRepository.create({
                userId: user1.id,
                likedUserId: user2.id,
            });
            await likeRepository.save(like1);
            createdCount++;
            console.log(`  ✅ ${user1.fullName} liked ${user2.fullName}`);
        }
        const existing2 = await likeRepository.findOne({
            where: { userId: user2.id, likedUserId: user1.id },
        });
        if (!existing2) {
            const like2 = likeRepository.create({
                userId: user2.id,
                likedUserId: user1.id,
            });
            await likeRepository.save(like2);
            createdCount++;
            console.log(`  ✅ ${user2.fullName} liked ${user1.fullName} ❤️ MATCH!`);
        }
    }
    for (const oneWayLike of oneWayLikes) {
        const fromUser = users.find((u) => u.email === oneWayLike.from);
        const toUser = users.find((u) => u.email === oneWayLike.to);
        if (!fromUser || !toUser)
            continue;
        const existing = await likeRepository.findOne({
            where: { userId: fromUser.id, likedUserId: toUser.id },
        });
        if (!existing) {
            const like = likeRepository.create({
                userId: fromUser.id,
                likedUserId: toUser.id,
            });
            await likeRepository.save(like);
            createdCount++;
            console.log(`  ✅ ${fromUser.fullName} liked ${toUser.fullName}`);
        }
    }
    console.log(`\n  📊 Total likes created: ${createdCount}`);
    console.log(`  💑 Total mutual matches: ${mutualLikes.length}`);
}
//# sourceMappingURL=likes.seed.js.map