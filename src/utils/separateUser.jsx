export default function separateUser(chat, userId) {

  const userIdx = chat?.participants?.findIndex(p => p._id.toString() === userId.toString());
  if (userIdx === -1) return { user: null, receiver: null };
  const user = chat?.participants[userIdx];
  let recIdx = null;
  if (!chat?.isGroup) {
    recIdx = userIdx === 0 ? 1 : 0;
  }
  const receiver = chat?.isGroup ? chat : chat?.participants[recIdx];
  return {
    user: { ...user },
    receiver: receiver ? { ...receiver } : null
  };
}
