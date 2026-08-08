import type { RiverLocation } from './types'

export const locations: RiverLocation[] = [
  {
    id: 'tuotuohe',
    name: '沱沱河 · 玉树',
    subtitle: '长江源头，高寒湿地与生命的摇篮',
    lon: 91.0,
    lat: 33.45,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: [
          '长江源头的分汊水网，冰雪融化，非"大江"，而是一片高寒湿地',
          '滋养高寒草甸与藏羚羊的家园，雪山冰川是最初的水源',
        ],
        meaning: '这里是六千三百公里大江的起点，一切从冰雪开始。',
      },
      culture: {
        highlights: [
          '玉树藏区：高原牧业、帐篷与定居混合生活',
          '藏传佛教日常，人与草场和河源的紧密关系',
        ],
        meaning: '长江人文的源头，民族生活与自然环境紧密相连。',
      },
    },
  },
  {
    id: 'tongtianhe',
    name: '通天河',
    subtitle: '高原宽谷，河流自由生长的地方',
    lon: 97.2,
    lat: 33.0,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: ['高原宽谷，辫状水道，河流自由散漫地生长'],
        meaning: '在被人类改造之前，河流本来的模样。',
      },
      history: {
        highlights: ['藏传佛教与西行文化的通道，唐蕃古道在此渡江'],
        meaning: '文明沿河流动的早期见证。',
      },
      culture: {
        highlights: ['经幡与玛尼堆，信仰与天地共生的景观'],
      },
    },
  },
  {
    id: 'jinshajiang',
    name: '金沙江 · 迪庆',
    subtitle: '横断山脉的血管',
    lon: 99.1,
    lat: 28.4,
    labelSide: 'top',
    labelDx: 62,
    facets: {
      nature: {
        highlights: [
          '大江在这里急转直下，切穿横断山脉',
          '深切峡谷、急流险滩，地貌与地震带交织',
        ],
        meaning: '中国地形三级阶梯之间最剧烈的落差，都写在这段江上。',
      },
      culture: {
        highlights: [
          '迪庆藏区：高山河谷中的村落、宗教空间',
          '季节性迁徙与农牧交错',
        ],
        meaning: '上游民族社会如何适应复杂山地环境的样本。',
      },
    },
  },
  {
    id: 'hutiaoxia',
    name: '虎跳峡 · 丽江',
    subtitle: '世界最深峡谷之一，石鼓大拐弯',
    lon: 100.13,
    lat: 27.17,
    labelSide: 'bottom',
    labelDx: -60,
    facets: {
      nature: {
        highlights: [
          '巨石横阻，江水轰鸣，山与水在此激烈碰撞',
          '山在抬升，河在切割——地质运动的现场',
        ],
        meaning: '长江在石鼓完成"长江第一湾"大拐弯，从此不再南流。',
      },
      culture: {
        highlights: [
          '丽江纳西聚落，东巴文化',
          '山地商业传统（茶马古道）与旅游化后的日常共存',
        ],
        meaning: '既有人文传统，也能看到现代化冲击下仍保留的地方性。',
      },
    },
  },
  {
    id: 'panxi',
    name: '攀西河谷 · 凉山',
    subtitle: '干热河谷里的另一个世界',
    lon: 101.7,
    lat: 26.6,
    labelSide: 'bottom',
    facets: {
      nature: {
        highlights: [
          '同属长江流域，却干热少雨、阳光炙烈',
          '生态脆弱而顽强，古老村落与稀薄的绿',
        ],
        meaning: '一条江的流域里也有"气候孤岛"。',
      },
      culture: {
        highlights: [
          '彝族村寨、服饰、火塘、节庆',
          '山地交通与现代教育并存',
        ],
        meaning: '长江支流地区保存较好的少数民族文化样本。',
      },
    },
  },
  {
    id: 'sanxingdui',
    name: '三星堆 · 金沙',
    subtitle: '长江上游的古蜀之光',
    lon: 104.2,
    lat: 31.0,
    labelSide: 'top',
    labelDx: 62,
    anchor: { lon: 103.8, lat: 30.2 },
    facets: {
      history: {
        highlights: [
          '神秘的青铜王国，青铜面具震撼世人',
          '与中原文明并行的古蜀文明中心',
        ],
        meaning: '证明长江流域同样是中华文明的重要源头。',
      },
    },
  },
  {
    id: 'dujiangyan',
    name: '都江堰',
    subtitle: '两千多年的治水智慧',
    lon: 103.62,
    lat: 31.0,
    labelSide: 'top',
    labelDx: -45,
    facets: {
      history: {
        highlights: [
          '鱼嘴分水、宝瓶口引流，"深淘滩，低作堰"',
          '不筑坝，也能分水——公元前256年建成，至今仍在工作',
        ],
        meaning: '成就"天府之国"的水利起点，中国治水史的开篇之作。',
      },
    },
  },
  {
    id: 'baihetan',
    name: '白鹤滩 · 溪洛渡',
    subtitle: '超级峡谷中的超级工程',
    lon: 102.95,
    lat: 27.35,
    labelSide: 'bottom',
    labelDx: 55,
    facets: {
      nature: {
        highlights: [
          '高坝与大江共舞，改写地貌也考验智慧',
          '高坝如何在复杂地质中站稳脚跟？人与自然的博弈现场',
        ],
        meaning: '金沙江下游梯级电站群，世界级清洁能源走廊。',
      },
      history: {
        highlights: ['从都江堰到白鹤滩，治水传统在这里接上了现代工程史'],
      },
    },
  },
  {
    id: 'chongqing',
    name: '重庆',
    subtitle: '最有生活感的长江山城',
    lon: 106.6,
    lat: 29.6,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: ['两江交汇、山城地貌，城市长在山与江之间'],
      },
      culture: {
        highlights: [
          '山城结构、梯坎、江边码头、火锅、夜生活、立体交通',
          '"现代民俗如何适应地形"的最佳样本',
        ],
        meaning: '最有生活感的长江城市之一。',
      },
    },
  },
  {
    id: 'sanxia',
    name: '三峡 · 白帝城',
    subtitle: '夔门天下雄，轻舟已过万重山',
    lon: 109.9,
    lat: 31.02,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: [
          '瞿塘之雄、巫峡之秀、西陵之险',
          '千百年来的江峡传奇，如今有了新的模样',
        ],
        meaning: '长江切开巫山，从盆地进入平原的总开关。',
      },
      history: {
        highlights: [
          '诗圣与江峡：白帝城下，"轻舟已过万重山"',
          '三峡大坝：千年江峡的现代变奏',
        ],
        meaning: '中国诗歌地理与现代工程史在同一段江上重叠。',
      },
    },
  },
  {
    id: 'yichang-jingzhou',
    name: '宜昌 · 荆州',
    subtitle: '楚文化故都，出峡入平原',
    lon: 111.3,
    lat: 30.7,
    labelSide: 'bottom',
    labelDx: -40,
    facets: {
      history: {
        highlights: [
          '楚国故都：纪南城遗址，楚文化的早期中心',
          '"楚都的第一缕烟火"',
        ],
        meaning: '长江中游文明的重要发端。',
      },
      culture: {
        highlights: [
          '从峡江文化过渡到江汉平原生活',
          '水边集镇、江岸饮食、日常渡运',
        ],
        meaning: '从山地到平原的人文过渡带。',
      },
    },
  },
  {
    id: 'dongting',
    name: '洞庭湖 · 赤壁',
    subtitle: '江湖相接，水势转换',
    lon: 113.1,
    lat: 29.45,
    labelSide: 'bottom',
    labelDx: 46,
    facets: {
      nature: {
        highlights: [
          '中国第二大淡水湖，湖水有时退去数十公里',
          '"会呼吸"的湖泊，洲滩成为候鸟与渔民的舞台',
        ],
        meaning: '长江中游天然的调蓄水库。',
      },
      history: {
        highlights: [
          '赤壁古战场：一把东风，改变三国格局',
          '城陵矶——长江与洞庭湖的"湖口"，岳阳楼上洞庭天下水',
        ],
        meaning: '江上碰硬仗，英雄入史诗；江湖相接处，水势与历史一起转换。',
      },
    },
  },
  {
    id: 'wuhan',
    name: '武汉',
    subtitle: '江湖城市，工业之城的浮现',
    lon: 114.3,
    lat: 30.6,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: ['大江与百湖交织，湿地与城市并存，鱼米之乡也是洪水与人共生的考验'],
      },
      history: {
        highlights: [
          '张之洞与近代工业起点，汉阳铁厂的汽笛从这里拉响',
          '万里长江第一桥：武汉长江大桥',
        ],
        meaning: '中国近代工业化在长江中游起航。',
      },
      culture: {
        highlights: [
          '过早文化、码头传统、方言气质',
          '夏季湿热生活方式，长江大桥下的城市节奏',
        ],
        meaning: '长江中游最典型的"江湖城市"日常样本。',
      },
    },
  },
  {
    id: 'poyang',
    name: '九江 · 鄱阳湖',
    subtitle: '石钟山下，南北通江',
    lon: 116.25,
    lat: 29.8,
    labelSide: 'bottom',
    labelDx: 66,
    facets: {
      nature: {
        highlights: [
          '丰水是湖，枯水是河，冬季万鸟齐飞',
          '江豚在此栖息，中国最大淡水湖的季节魔法',
        ],
        meaning: '长江与鄱阳湖的吞吐决定着下游的水情。',
      },
      history: {
        highlights: [
          '苏轼夜泊石钟山，一篇游记问了千年的"石钟山夜雨声"',
          '南北通江，近代通商口岸之一',
        ],
        meaning: '文人山水与商路水运在湖口交汇。',
      },
    },
  },
  {
    id: 'nanjing',
    name: '南京',
    subtitle: '虎踞龙盘的江畔古都',
    lon: 118.8,
    lat: 32.08,
    labelSide: 'top',
    facets: {
      history: {
        highlights: [
          '石头城见证六朝与明清交替，燕子矶上古都烟火',
          '"虎踞龙盘"的江畔城市，江流依旧',
        ],
        meaning: '六朝古都与江防要地，长江下游的历史枢纽。',
      },
      culture: {
        highlights: [
          '秦淮河生活、梧桐树街区、鸭馔',
          '慢节奏与旧都气质并存',
        ],
        meaning: '历史沉积很深、但当下依然鲜活的城市生活。',
      },
    },
  },
  {
    id: 'guazhou',
    name: '扬州 · 瓜洲',
    subtitle: '古诗里的渡口，运河与长江的十字路口',
    lon: 119.45,
    lat: 32.2,
    labelSide: 'top',
    labelDx: 44,
    facets: {
      history: {
        highlights: [
          '南北水运咽喉：从这里扬帆，通江达运河',
          '瓜洲古渡与京杭大运河，商旅云集，百业兴盛',
        ],
        meaning: '大运河与长江在此相交，撑起古代中国的水运版图。',
      },
      culture: {
        highlights: ['"京口瓜洲一水间"，古诗里的渡口至今有渡船'],
      },
    },
  },
  {
    id: 'jiangnan',
    name: '江南水网 · 苏杭',
    subtitle: '河道如织，人与水温柔相处',
    lon: 120.62,
    lat: 31.3,
    labelSide: 'bottom',
    labelDx: -70,
    facets: {
      nature: {
        highlights: [
          '河道如织，古镇临水而建',
          '人与水的相处方式温柔而智慧',
        ],
        meaning: '长江水系在下游铺开的最细密的毛细血管。',
      },
      history: {
        highlights: [
          '良渚古城与水利系统：五千年前的治水文明',
          '良渚人深谙治水与耕作——早期中国的水利密码',
        ],
        meaning: '把中华文明五千年的起点，落在了长江下游。',
      },
      culture: {
        highlights: [
          '水巷、茶馆、园林与周边日常，江南饮食',
          '丝绸与电商——传统与新经济并存',
        ],
        meaning: '吴依水乡不是静态古镇，而是持续运转的生活世界。',
      },
    },
  },
  {
    id: 'shanghai',
    name: '上海 · 长江口',
    subtitle: '通向海洋的最后一站',
    lon: 121.5,
    lat: 31.4,
    labelSide: 'bottom',
    labelDx: 30,
    facets: {
      nature: {
        highlights: [
          '崇明东滩：泥沙堆积，陆地仍在生长',
          '潮汐往复，候鸟翩跹，江海在此交汇',
        ],
        meaning: '六千三百公里旅程的终点，也是新陆地的起点。',
      },
      history: {
        highlights: [
          '吴淞口炮台湾：近代海防、口岸起点',
          '近代上海的开埠之门，海风与新世界',
        ],
        meaning: '从治水到工业，从古老到近代，长江在此汇入世界。',
      },
      culture: {
        highlights: [
          '国际都市：码头、金融、移民文化、咖啡馆、街区生活',
        ],
        meaning: '长江如何从民族地区一路走到全球化都市的收尾。',
      },
    },
  },
]
