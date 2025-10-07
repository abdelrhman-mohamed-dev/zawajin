import { DataSource } from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';
import { Like } from '../../modules/interactions/entities/like.entity';

export async function seedLikes(dataSource: DataSource, users: User[]) {
  const likeRepository = dataSource.getRepository(Like);

  // Define mutual likes (will create matches)
  const mutualLikes = [
    // Ahmed Hassan and Fatima Zahra - mutual match
    {
      user1: 'ahmed.hassan@example.com',
      user2: 'fatima.zahra@example.com',
    },
    // Omar Abdullah and Maryam Ahmed - mutual match
    {
      user1: 'omar.abdullah@example.com',
      user2: 'maryam.ahmed@example.com',
    },
    // Khalid Rahman and Khadija Yusuf - mutual match
    {
      user1: 'khalid.rahman@example.com',
      user2: 'khadija.yusuf@example.com',
    },
    // Ibrahim Mahmoud and Nadia Omar - mutual match
    {
      user1: 'ibrahim.mahmoud@example.com',
      user2: 'nadia.omar@example.com',
    },
  ];

  // Define one-way likes (no match yet)
  const oneWayLikes = [
    // Aisha likes Ahmed (but he likes Fatima)
    {
      from: 'aisha.mohammed@example.com',
      to: 'ahmed.hassan@example.com',
    },
    // Sara likes Yusuf
    {
      from: 'sara.ibrahim@example.com',
      to: 'yusuf.ali@example.com',
    },
    // Hassan likes Layla
    {
      from: 'hassan.khalil@example.com',
      to: 'layla.hassan@example.com',
    },
    // Zainab likes Ibrahim
    {
      from: 'zainab.ali@example.com',
      to: 'ibrahim.mahmoud@example.com',
    },
    // Mustafa likes Aisha
    {
      from: 'mustafa.tariq@example.com',
      to: 'aisha.mohammed@example.com',
    },
    // Yusuf likes Sara
    {
      from: 'yusuf.ali@example.com',
      to: 'sara.ibrahim@example.com',
    },
  ];

  let createdCount = 0;

  // Create mutual likes
  for (const mutualLike of mutualLikes) {
    const user1 = users.find((u) => u.email === mutualLike.user1);
    const user2 = users.find((u) => u.email === mutualLike.user2);

    if (!user1 || !user2) continue;

    // User1 likes User2
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

    // User2 likes User1 (creating mutual match)
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

  // Create one-way likes
  for (const oneWayLike of oneWayLikes) {
    const fromUser = users.find((u) => u.email === oneWayLike.from);
    const toUser = users.find((u) => u.email === oneWayLike.to);

    if (!fromUser || !toUser) continue;

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
