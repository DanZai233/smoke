export const getQuote = (todayCount: number, limit: number): string => {
  if (todayCount === 0) return '“一根不抽，修仙有望！保持住啊大兄弟！”';
  if (todayCount < limit * 0.3) return '“今天抽得挺克制，是个养生达人呢。”';
  if (todayCount < limit * 0.8) return '“注意点数量啊，离每日上限越来越近了。”';
  if (todayCount < limit) return '“危！今天的额度马上就要刷爆了！”';
  if (todayCount === limit) return '“刚好触线！今天不许再抽了，肺要罢工了！”';
  return '“哥，肺都熏黑了，快住嘴吧！你已经超标了！”';
};

export const tips = [
  "想抽烟时，喝杯凉水转移注意力。",
  "每忍住不抽一根，法拉利的螺丝就多一颗。",
  "吃点无糖口香糖，让嘴巴忙起来。",
  "深深深呼吸，想象肺在感谢你。",
  "算算你这辈子抽烟花了多少钱，能换几台顶配iPhone？",
  "戒烟不叫放弃，叫放过自己。",
  "不要想『我再也不抽了』，就想『这一小时我先不抽』。",
];

export const getRandomTip = () => {
  return tips[Math.floor(Math.random() * tips.length)];
};
