/* ---------------- 衣橱清单（顺序 = 衣橱里显示的顺序） ---------------- */
const WARDROBE = [
  ...HAIRS,
  /* ---------- 上衣（z30） ---------- */
  { id: 't5', cat: 'top', tpl: 'hoodie', name: '波点连帽卫衣', fill: { p: 'refbody' }, alt: '#F4B3C8', sleeve: 'url(#pat-refsleeve)', print: 'clover' },
  { id: 't7', cat: 'top', tpl: 'meshTop', name: '黑色网纱叠穿', fill: { c: '#2A2628' }, alt: 'url(#pat-mesh)' },
  { id: 't8', cat: 'top', tpl: 'babyTee', name: '爱心玫瑰短袖T', fill: { p: 'roses' }, alt: '#A87E80', rib: '#A87E80', print: 'heart' },
  { id: 't9', cat: 'top', tpl: 'raglan', name: '波点插肩长袖T', fill: { p: 'pinkdots' }, alt: '#F6AAC6' },
  { id: 't6', cat: 'top', tpl: 'layerTank', name: '圆点叠穿背心T', fill: { p: 'bigdots' }, alt: '#FBF6E6', print: 'clover' },
  { id: 't10', cat: 'top', tpl: 'zipHoodie', name: '天蓝色拉链连帽卫衣', fill: { c: '#A7D1EE' }, alt: '#8EC0E6', rib: '#8EC0E6', print: 'star', isNew: true, apt: 1 },
  { id: 't11', cat: 'top', tpl: 'puffBlouse', name: '粉色泡泡袖蝴蝶结衬衫', fill: { c: '#F9C9DA' }, alt: '#F9C9DA', rib: '#E8628E', print: 'bow', isNew: true, apt: 1 },
  { id: 't12', cat: 'top', tpl: 'offShoulderTee', name: '樱桃斜肩宽松T恤', fill: { c: '#FDFBF6' }, alt: '#F48FB1', rib: '#F7A9C4', print: 'cherry', isNew: true, apt: 1 },
  { id: 't13', cat: 'top', tpl: 'vestShirt', name: '白衬衫+菱格毛衣背心', fill: { p: 'argyle' }, alt: '#FBFBF8', rib: '#2F3858', isNew: true, apt: 1 },
  { id: 't14', cat: 'top', tpl: 'printShirt', name: '热带花衬衫', fill: { p: 'hibiscus' }, isNew: true, apt: 1 },
  { id: 't15', cat: 'top', tpl: 'stripeVest', name: '海军条纹T+针织马甲', fill: { c: '#8F8984' }, alt: 'url(#pat-navystripe)', rib: '#33406A', isNew: true, apt: 1 },
  { id: 't1', cat: 'top', tpl: 'cami', name: '蝴蝶亮片吊带', fill: { c: '#F8B3D2' }, print: 'butterfly' },
  { id: 't2', cat: 'top', tpl: 'babyTee', name: 'BABY 短袖T', fill: { c: '#BEE0F7' }, rib: '#F7A9C4', print: 'baby' },
  { id: 't3', cat: 'top', tpl: 'sweater', name: '复古条纹毛衣', fill: { p: 'sweater' }, rib: '#4F6B3A' },
  { id: 't4', cat: 'top', tpl: 'trackJacket', name: '葡萄紫运动外套', fill: { g: 'violetGloss' }, print: 'stripes' },
  /* ---------- 外套（z35，叠在上衣外面） ---------- */
  { id: 'o2', cat: 'outer', tpl: 'cardigan', name: '焦糖长开衫', fill: { c: '#5E4438' }, rib: '#4A352C' },
  { id: 'o3', cat: 'outer', tpl: 'blazer', name: '黑色修身西装外套', fill: { c: '#2E2A30' }, isNew: true, apt: 1 },
  { id: 'o4', cat: 'outer', tpl: 'tweedJacket', name: '奶白小香风短外套', fill: { p: 'tweed' }, rib: '#D9859E', isNew: true, apt: 1 },
  { id: 'o5', cat: 'outer', tpl: 'trenchCoat', name: '卡其色双排扣风衣', fill: { c: '#CBAE80' }, isNew: true, apt: 1 },
  { id: 'o6', cat: 'outer', tpl: 'puffJacket', name: '粉色小猪连帽外套', fill: { c: '#F9BDD2' }, print: 'pig', isNew: true, apt: 1 },
  { id: 'o1', cat: 'outer', tpl: 'puffJacket', name: '粉色宽松外套', fill: { c: '#F7B2CC' }, print: 'dots' },
  /* ---------- 下装（z20） ---------- */
  { id: 'b4', cat: 'bottom', tpl: 'shorts', name: '卷边牛仔短裤', fill: { p: 'heartdenim' } },
  { id: 'b5', cat: 'bottom', tpl: 'capris', name: '爱心紫工装七分裤', fill: { p: 'heartplum' }, print: 'clover' },
  { id: 'b6', cat: 'bottom', tpl: 'pleatedMini', name: '焦糖格纹百褶裙', fill: { p: 'brownplaid' } },
  { id: 'b7', cat: 'bottom', tpl: 'widePants', name: '爱心迷彩阔腿裤', fill: { p: 'beigeheart' } },
  { id: 'b8', cat: 'bottom', tpl: 'skinnyJeans', name: '深蓝小脚牛仔裤', fill: { p: 'darkdenim' }, isNew: true, apt: 1 },
  { id: 'b9', cat: 'bottom', tpl: 'tierSkirt', name: '奶白蛋糕短裙', fill: { c: '#FFF8F2' }, alt: '#FCE7EE', rib: '#F48FB1', print: 'bow', isNew: true, apt: 1 },
  { id: 'b10', cat: 'bottom', tpl: 'slacks', name: '黑色直筒西装裤', fill: { c: '#2E2A30' }, isNew: true, apt: 1 },
  { id: 'b1', cat: 'bottom', tpl: 'cargo', name: '链条工装裤', fill: { c: '#CDB994' }, print: 'chain' },
  { id: 'b2', cat: 'bottom', tpl: 'pleatedMini', name: '格纹百褶裙', fill: { p: 'tartan' }, print: 'pin' },
  { id: 'b3', cat: 'bottom', tpl: 'flareJeans', name: '爱心破洞喇叭裤', fill: { p: 'denim' }, print: 'hearts' },
  /* ---------- 连衣裙（z25，穿上会自动脱掉上衣和下装） ---------- */
  { id: 'd1', cat: 'dress', tpl: 'denimDress', name: '星星牛仔吊带裙', fill: { p: 'denim' }, print: 'stars' },
  { id: 'd3', cat: 'dress', tpl: 'weddingDress', name: '逃婚白纱裙', fill: { c: '#FFFDF8' }, rib: '#F7C9D6', isNew: true, apt: 1 },
  { id: 'd4', cat: 'dress', tpl: 'overalls', name: '牛仔背带短裤', fill: { p: 'denim' }, print: 'heart', isNew: true, apt: 1 },
  { id: 'd2', cat: 'dress', tpl: 'slipDress', name: '绿色迷彩吊带裙', fill: { p: 'camo' } },
  ...EXTRA
];
