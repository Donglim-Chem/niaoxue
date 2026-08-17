// 中国鸟类生态地理分区
// 依据《中国动物地理》七大区划并结合观鸟实践细分，古北界在北、东洋界在南，
// 秦岭—淮河一线是两界的大致分界。每区给出典型生境与观鸟提示。

export const REGIONS = [
  {
    key: 'northeast',
    name: '东北区',
    short: '东北',
    realm: '古北界',
    color: '#4a7c6f',
    area: '黑龙江、吉林、辽宁大部及内蒙古东北部',
    landscape: '针阔混交林、寒温带针叶林、三江平原沼泽湿地',
    highlight: '中国唯一的寒温带鸟类区。夏季森林鸣禽密集，扎龙、向海的鹤类与三江平原的雁鸭最负盛名。',
    bestSeason: '5—6 月森林繁殖季，9—10 月鹤类与雁鸭迁徙季',
  },
  {
    key: 'north',
    name: '华北区',
    short: '华北',
    realm: '古北界',
    color: '#8a7a4e',
    area: '北京、天津、河北、山西、山东、河南北部及陕西中北部',
    landscape: '暖温带落叶阔叶林、农田、太行山与燕山山地、渤海湾滨海湿地',
    highlight: '城市观鸟的主战场。北戴河与渤海湾是东亚—澳大利西亚候鸟迁徙路线上的关键驿站。',
    bestSeason: '4—5 月与 9—10 月过境期，冬季猛禽与雁鸭',
  },
  {
    key: 'northwest',
    name: '西北区',
    short: '西北',
    realm: '古北界',
    color: '#b08968',
    area: '新疆、甘肃河西走廊、宁夏、内蒙古西部、青海柴达木',
    landscape: '荒漠、戈壁、干草原、绿洲林带与内陆咸水湖',
    highlight: '干旱区特有的䳭类、百灵与沙鸡。青海湖、艾比湖等内陆湖是繁殖水鸟的孤岛。',
    bestSeason: '5—7 月繁殖季，此时荒漠鸟类最活跃',
  },
  {
    key: 'qingzang',
    name: '青藏区',
    short: '青藏',
    realm: '古北界',
    color: '#6b8cae',
    area: '西藏、青海大部、四川西部高原及甘肃南部高寒地带',
    landscape: '高寒草甸、高山草原、高原湖泊与流石滩',
    highlight: '海拔 3000 米以上的独立鸟类区系，雪雀、雪鸡、大型鹫类与黑颈鹤是标志性类群。',
    bestSeason: '6—8 月，此时道路通畅且鸟类繁殖活跃',
  },
  {
    key: 'southwest',
    name: '西南区',
    short: '西南',
    realm: '东洋界',
    color: '#5f8d4e',
    area: '云南大部、贵州、四川盆地西缘至横断山区、西藏东南部',
    landscape: '横断山垂直带谱、亚热带常绿阔叶林、干热河谷',
    highlight: '中国鸟类多样性最高的区域。横断山的垂直分异让一条山谷就能遇上数十个海拔梯度的鸟种。',
    bestSeason: '3—5 月繁殖季，冬季中低海拔观鸟同样出色',
  },
  {
    key: 'central',
    name: '华中区',
    short: '华中',
    realm: '东洋界',
    color: '#7d9a6d',
    area: '湖北、湖南、江西、安徽南部、四川盆地及陕南秦巴山地',
    landscape: '亚热带常绿阔叶林、丘陵农田、长江中游通江湖泊',
    highlight: '鄱阳湖、洞庭湖构成全球最重要的越冬水鸟聚集地，白鹤与东方白鹳的主要越冬区。',
    bestSeason: '11 月—次年 2 月越冬水鸟季',
  },
  {
    key: 'east',
    name: '华东区',
    short: '华东',
    realm: '东洋界',
    color: '#4f7ea8',
    area: '江苏、上海、浙江、福建北部、山东半岛南缘',
    landscape: '沿海滩涂、河口湿地、丘陵次生林与高度城市化的绿地',
    highlight: '黄海滩涂是全球鸻鹬类迁徙的咽喉，勺嘴鹬、大滨鹬在此补给。城市公园鸟种也相当丰富。',
    bestSeason: '4—5 月与 8—10 月鸻鹬迁徙高峰',
  },
  {
    key: 'south',
    name: '华南区',
    short: '华南',
    realm: '东洋界',
    color: '#3f8f7a',
    area: '广东、广西、海南、福建南部、台湾及云南南缘',
    landscape: '热带季雨林、南亚热带常绿阔叶林、红树林与海岛',
    highlight: '热带成分最集中的区域，蜂虎、太阳鸟、鹃鸠等类群在此达到分布北界。',
    bestSeason: '全年皆宜，4—6 月热带留鸟繁殖期最热闹',
  },
]

export const REGION_MAP = Object.fromEntries(REGIONS.map((r) => [r.key, r]))

// 居留型
export const RESIDENCY = {
  resident: { label: '留鸟', color: '#4a7c6f', desc: '全年留居，不做长距离迁徙' },
  summer: { label: '夏候鸟', color: '#c9843e', desc: '春季飞来繁殖，秋季南迁越冬' },
  winter: { label: '冬候鸟', color: '#4f7ea8', desc: '秋季飞来越冬，春季北返繁殖' },
  passage: { label: '旅鸟', color: '#8a6fa8', desc: '迁徙途中过境停歇，不在此繁殖或越冬' },
}

// 保护级别
export const PROTECTION = {
  i: { label: '国家一级', color: '#c0392b', rank: 3 },
  ii: { label: '国家二级', color: '#d68910', rank: 2 },
  common: { label: '三有保护', color: '#7f8c8d', rank: 1 },
}
