"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedConversations = seedConversations;
const like_entity_1 = require("../../modules/interactions/entities/like.entity");
const conversation_entity_1 = require("../../modules/chat/entities/conversation.entity");
const message_entity_1 = require("../../modules/chat/entities/message.entity");
async function seedConversations(dataSource, users) {
    const conversationRepository = dataSource.getRepository(conversation_entity_1.Conversation);
    const messageRepository = dataSource.getRepository(message_entity_1.Message);
    const likeRepository = dataSource.getRepository(like_entity_1.Like);
    const mutualMatches = [
        {
            user1Email: 'ahmed.hassan@example.com',
            user2Email: 'fatima.zahra@example.com',
            messages: [
                {
                    from: 'ahmed.hassan@example.com',
                    content: 'As-salamu alaykum! I saw your profile and would love to get to know you better.',
                },
                {
                    from: 'fatima.zahra@example.com',
                    content: 'Wa alaykumu s-salam! Thank you for reaching out. I would like that too.',
                },
                {
                    from: 'ahmed.hassan@example.com',
                    content: 'What are your thoughts on family and future goals?',
                },
                {
                    from: 'fatima.zahra@example.com',
                    content: 'Family is very important to me. I hope to build a strong Islamic household insha\'Allah.',
                },
            ],
        },
        {
            user1Email: 'omar.abdullah@example.com',
            user2Email: 'maryam.ahmed@example.com',
            messages: [
                {
                    from: 'omar.abdullah@example.com',
                    content: 'Salam! I noticed we have similar values. Would you like to chat?',
                },
                {
                    from: 'maryam.ahmed@example.com',
                    content: 'Wa alaikum salam! Yes, I would like that. Tell me about yourself.',
                },
            ],
        },
        {
            user1Email: 'khalid.rahman@example.com',
            user2Email: 'khadija.yusuf@example.com',
            messages: [
                {
                    from: 'khadija.yusuf@example.com',
                    content: 'As-salamu alaykum! I appreciate your profile. How do you spend your free time?',
                },
                {
                    from: 'khalid.rahman@example.com',
                    content: 'Wa alaykumu s-salam! I enjoy reading and spending time with family. What about you?',
                },
                {
                    from: 'khadija.yusuf@example.com',
                    content: 'I love traveling and exploring new cultures while staying true to my values.',
                },
            ],
        },
        {
            user1Email: 'ibrahim.mahmoud@example.com',
            user2Email: 'nadia.omar@example.com',
            messages: [
                {
                    from: 'ibrahim.mahmoud@example.com',
                    content: 'Salam! It\'s nice to match with you. What are you looking for in a partner?',
                },
                {
                    from: 'nadia.omar@example.com',
                    content: 'Wa alaikum salam! I value honesty, kindness, and someone who is serious about their deen.',
                },
            ],
        },
    ];
    let conversationCount = 0;
    let messageCount = 0;
    for (const match of mutualMatches) {
        const user1 = users.find((u) => u.email === match.user1Email);
        const user2 = users.find((u) => u.email === match.user2Email);
        if (!user1 || !user2)
            continue;
        const mutualLike = await likeRepository.findOne({
            where: { userId: user1.id, likedUserId: user2.id },
        });
        if (!mutualLike)
            continue;
        let conversation = await conversationRepository.findOne({
            where: [
                { participant1Id: user1.id, participant2Id: user2.id },
                { participant1Id: user2.id, participant2Id: user1.id },
            ],
        });
        if (!conversation) {
            conversation = conversationRepository.create({
                participant1Id: user1.id,
                participant2Id: user2.id,
                matchId: mutualLike.id,
            });
            await conversationRepository.save(conversation);
            conversationCount++;
            console.log(`  ✅ Created conversation between ${user1.fullName} and ${user2.fullName}`);
        }
        for (const msgData of match.messages) {
            const sender = users.find((u) => u.email === msgData.from);
            if (!sender)
                continue;
            const existingMessage = await messageRepository.findOne({
                where: {
                    conversationId: conversation.id,
                    senderId: sender.id,
                    content: msgData.content,
                },
            });
            if (!existingMessage) {
                const message = messageRepository.create({
                    conversationId: conversation.id,
                    senderId: sender.id,
                    content: msgData.content,
                    messageType: message_entity_1.MessageType.TEXT,
                    status: message_entity_1.MessageStatus.READ,
                    readAt: new Date(),
                });
                await messageRepository.save(message);
                messageCount++;
            }
        }
        const lastMessage = match.messages[match.messages.length - 1];
        await conversationRepository.update(conversation.id, {
            lastMessageAt: new Date(),
            lastMessagePreview: lastMessage.content.substring(0, 100),
        });
    }
    console.log(`\n  📊 Total conversations created: ${conversationCount}`);
    console.log(`  💬 Total messages created: ${messageCount}`);
}
//# sourceMappingURL=conversations.seed.js.map