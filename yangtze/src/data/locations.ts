import type { RiverLocation } from './types'
import { l } from '../i18n'

export const locations: RiverLocation[] = [
  {
    id: 'tuotuohe',
    name: l('沱沱河 · 玉树', 'Tuotuo River · Yushu', '沱沱河 ・ 玉樹'),
    subtitle: l(
      '长江源头，高寒湿地与生命的摇篮',
      'The source: alpine wetlands, a cradle of life',
      '長江の源流。高寒湿地といのちのゆりかご',
    ),
    lon: 91.0,
    lat: 33.45,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: [
          l(
            '长江源头的分汊水网，冰雪融化，非"大江"，而是一片高寒湿地',
            'A braided web of meltwater — not yet a "great river", but a high-altitude wetland',
            '源流は氷雪の融け水が編む網状の流れ。「大河」ではなく高地の湿原',
          ),
          l(
            '滋养高寒草甸与藏羚羊的家园，雪山冰川是最初的水源',
            'Alpine meadows and Tibetan antelope thrive here; glaciers are the first source',
            '高山草原とチベットカモシカを育む。雪山と氷河が最初の水源',
          ),
        ],
        meaning: l(
          '这里是六千三百公里大江的起点，一切从冰雪开始。',
          'The 6,300-kilometre journey begins here — everything starts with ice and snow.',
          '六千三百キロの旅はここから。すべては氷雪から始まります。',
        ),
      },
      culture: {
        highlights: [
          l(
            '玉树藏区：高原牧业、帐篷与定居混合生活',
            'Yushu Tibetan region: highland herding, tents mixed with settled life',
            '玉樹チベット族地区。高原の牧畜、テントと定住が交じる暮らし',
          ),
          l(
            '藏传佛教日常，人与草场和河源的紧密关系',
            'Tibetan Buddhist daily life, closely bound to pastures and headwaters',
            'チベット仏教の日常。人と草原、水源との深い結びつき',
          ),
        ],
        meaning: l(
          '长江人文的源头，民族生活与自然环境紧密相连。',
          'The cultural headwaters of the Yangtze: life woven into the landscape.',
          '長江の人文の源流。民族の暮らしと自然が固く結ばれています。',
        ),
      },
    },
  },
  {
    id: 'tongtianhe',
    name: l('通天河', 'Tongtian River', '通天河'),
    subtitle: l(
      '高原宽谷，河流自由生长的地方',
      'Wide plateau valleys where the river runs free',
      '高原の広い谷、川が自由に育つところ',
    ),
    lon: 97.2,
    lat: 33.0,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: [
          l(
            '高原宽谷，辫状水道，河流自由散漫地生长',
            'Broad valleys and braided channels — the river wanders as it pleases',
            '広い谷を編むように流れる辮状流路。川は気ままに育ちます',
          ),
        ],
        meaning: l(
          '在被人类改造之前，河流本来的模样。',
          'What a river looks like before people reshape it.',
          '人の手が入る前の、川本来の姿です。',
        ),
      },
      history: {
        highlights: [
          l(
            '藏传佛教与西行文化的通道，唐蕃古道在此渡江',
            'A corridor of Tibetan Buddhism; the ancient Tang–Tibet road crossed here',
            'チベット仏教と西域文化の通り道。唐蕃古道はここで川を渡りました',
          ),
        ],
        meaning: l(
          '文明沿河流动的早期见证。',
          'Early evidence of civilizations moving along the river.',
          '文明が川に沿って流れた初期の証です。',
        ),
      },
      culture: {
        highlights: [
          l(
            '经幡与玛尼堆，信仰与天地共生的景观',
            'Prayer flags and mani stones: faith living with heaven and earth',
            'タルチョとマニ石。信仰が天地とともにある風景',
          ),
        ],
      },
    },
  },
  {
    id: 'jinshajiang',
    name: l('金沙江 · 迪庆', 'Jinsha River · Diqing', '金沙江 ・ 迪慶'),
    subtitle: l('横断山脉的血管', 'The artery of the Hengduan Mountains', '横断山脈をめぐる大動脈'),
    lon: 99.1,
    lat: 28.4,
    labelSide: 'top',
    labelDx: 62,
    facets: {
      nature: {
        highlights: [
          l(
            '大江在这里急转直下，切穿横断山脉',
            'The river plunges south, slicing through the Hengduan ranges',
            '大河はここで急転直下、横断山脈を切り裂きます',
          ),
          l(
            '深切峡谷、急流险滩，地貌与地震带交织',
            'Deep gorges and rapids, where landforms meet an active seismic belt',
            '深い峡谷と急流。地形と地震帯が絡み合う場所',
          ),
        ],
        meaning: l(
          '中国地形三级阶梯之间最剧烈的落差，都写在这段江上。',
          'The steepest drop between China’s three great terrain steps is written on this stretch.',
          '中国地形の三大段差のうち最も激しい落差が、この流れに刻まれています。',
        ),
      },
      culture: {
        highlights: [
          l(
            '迪庆藏区：高山河谷中的村落、宗教空间',
            'Diqing Tibetan region: villages and sacred spaces in high valleys',
            '迪慶チベット族地区。高山の谷あいの村と宗教空間',
          ),
          l(
            '季节性迁徙与农牧交错',
            'Seasonal migration where farming meets herding',
            '季節ごとの移動、農耕と牧畜の交錯',
          ),
        ],
        meaning: l(
          '上游民族社会如何适应复杂山地环境的样本。',
          'A living example of mountain communities adapting to hard terrain.',
          '険しい山地に適応した上流域社会の生きた見本です。',
        ),
      },
    },
  },
  {
    id: 'hutiaoxia',
    name: l('虎跳峡 · 丽江', 'Tiger Leaping Gorge · Lijiang', '虎跳峡 ・ 麗江'),
    subtitle: l(
      '世界最深峡谷之一，石鼓大拐弯',
      'One of the world’s deepest gorges; the great bend at Shigu',
      '世界屈指の深さの峡谷、石鼓の大湾曲',
    ),
    lon: 100.13,
    lat: 27.17,
    labelSide: 'bottom',
    labelDx: -60,
    facets: {
      nature: {
        highlights: [
          l(
            '巨石横阻，江水轰鸣，山与水在此激烈碰撞',
            'Boulders block the channel; the river roars — mountain and water collide',
            '巨岩が流れを阻み、水は轟く。山と水が激しくぶつかる場所',
          ),
          l(
            '山在抬升，河在切割——地质运动的现场',
            'Mountains rising, river cutting: geology in action',
            '山は隆起し、川は削る。地質運動の現場です',
          ),
        ],
        meaning: l(
          '长江在石鼓完成"长江第一湾"大拐弯，从此不再南流。',
          'At Shigu the river makes its First Bend and never flows south again.',
          '石鼓で「長江第一湾」を描き、川は二度と南へ流れません。',
        ),
      },
      culture: {
        highlights: [
          l(
            '丽江纳西聚落，东巴文化',
            'Naxi communities of Lijiang and Dongba culture',
            '麗江のナシ族集落と東巴（トンパ）文化',
          ),
          l(
            '山地商业传统（茶马古道）与旅游化后的日常共存',
            'Tea-Horse Road trading traditions living alongside modern tourism',
            '茶馬古道の商いの伝統と、観光地化後の日常が共存',
          ),
        ],
        meaning: l(
          '既有人文传统，也能看到现代化冲击下仍保留的地方性。',
          'Old traditions persisting — visibly local even under modern pressures.',
          '伝統が息づき、現代化の波の中でも土地の個性が残っています。',
        ),
      },
    },
  },
  {
    id: 'panxi',
    name: l('攀西河谷 · 凉山', 'Panxi Valley · Liangshan', '攀西河谷 ・ 涼山'),
    subtitle: l('干热河谷里的另一个世界', 'Another world in a hot, dry valley', '乾いた熱い谷の、もうひとつの世界'),
    lon: 101.7,
    lat: 26.6,
    labelSide: 'bottom',
    facets: {
      nature: {
        highlights: [
          l(
            '同属长江流域，却干热少雨、阳光炙烈',
            'Still the Yangtze basin — yet hot, dry and sun-scorched',
            '同じ長江流域なのに、乾燥して雨が少なく、日差しは灼けつくよう',
          ),
          l(
            '生态脆弱而顽强，古老村落与稀薄的绿',
            'A fragile but tenacious ecology: old villages and sparse green',
            '脆くも粘り強い生態系。古い村落とまばらな緑',
          ),
        ],
        meaning: l(
          '一条江的流域里也有"气候孤岛"。',
          'Even one river basin contains climate islands.',
          'ひとつの流域の中にも「気候の孤島」があります。',
        ),
      },
      culture: {
        highlights: [
          l('彝族村寨、服饰、火塘、节庆', 'Yi villages: dress, hearths and festivals', 'イ族の村。衣装、囲炉裏、祭り'),
          l(
            '山地交通与现代教育并存',
            'Mountain transport and modern schooling side by side',
            '山地の交通と現代の教育が並び立つ',
          ),
        ],
        meaning: l(
          '长江支流地区保存较好的少数民族文化样本。',
          'Some of the best-preserved minority cultures in the Yangtze’s tributary lands.',
          '長江支流域で最もよく残る少数民族文化のサンプルです。',
        ),
      },
    },
  },
  {
    id: 'sanxingdui',
    name: l('三星堆 · 金沙', 'Sanxingdui · Jinsha', '三星堆 ・ 金沙'),
    subtitle: l('长江上游的古蜀之光', 'The ancient Shu splendour of the upper Yangtze', '長江上流に輝いた古蜀文明'),
    lon: 104.2,
    lat: 31.0,
    labelSide: 'top',
    labelDx: 62,
    anchor: { lon: 103.8, lat: 30.2 },
    facets: {
      history: {
        highlights: [
          l(
            '神秘的青铜王国，青铜面具震撼世人',
            'A mysterious bronze kingdom whose masks astonished the world',
            '謎めいた青銅の王国。青銅仮面は世界を驚かせました',
          ),
          l(
            '与中原文明并行的古蜀文明中心',
            'A centre of ancient Shu, flourishing in parallel with the Central Plains',
            '中原文明と並び立った古蜀文明の中心地',
          ),
        ],
        meaning: l(
          '证明长江流域同样是中华文明的重要源头。',
          'Proof that the Yangtze basin is also a wellspring of Chinese civilization.',
          '長江流域もまた中華文明の重要な源であることの証です。',
        ),
      },
    },
  },
  {
    id: 'dujiangyan',
    name: l('都江堰', 'Dujiangyan', '都江堰'),
    subtitle: l('两千多年的治水智慧', 'Two millennia of water wisdom', '二千年を超える治水の知恵'),
    lon: 103.62,
    lat: 31.0,
    labelSide: 'top',
    labelDx: -45,
    facets: {
      history: {
        highlights: [
          l(
            '鱼嘴分水、宝瓶口引流，"深淘滩，低作堰"',
            'The Fish Mouth splits the flow, the Bottle Neck guides it: "dredge deep, keep weirs low"',
            '魚嘴が水を分け、宝瓶口が導く。「深く浚え、堰は低く」',
          ),
          l(
            '不筑坝，也能分水——公元前256年建成，至今仍在工作',
            'Water control without a dam — built in 256 BCE and still working today',
            'ダムなしで水を制す。紀元前256年の完成から今も現役です',
          ),
        ],
        meaning: l(
          '成就"天府之国"的水利起点，中国治水史的开篇之作。',
          'The waterworks that made the "Land of Abundance" — the opening chapter of Chinese water control.',
          '「天府の国」を生んだ水利の原点、中国治水史の開巻です。',
        ),
      },
    },
  },
  {
    id: 'baihetan',
    name: l('白鹤滩 · 溪洛渡', 'Baihetan · Xiluodu', '白鶴灘 ・ 渓洛渡'),
    subtitle: l('超级峡谷中的超级工程', 'Mega-projects in a mega-gorge', '大峡谷の中の超巨大プロジェクト'),
    lon: 102.95,
    lat: 27.35,
    labelSide: 'bottom',
    labelDx: 55,
    facets: {
      nature: {
        highlights: [
          l(
            '高坝与大江共舞，改写地貌也考验智慧',
            'High dams dance with the great river — rewriting the land, testing our wisdom',
            '高いダムと大河の共演。地形を書き換え、知恵が試されます',
          ),
          l(
            '高坝如何在复杂地质中站稳脚跟？人与自然的博弈现场',
            'How does a dam stand firm in such geology? A live contest between people and nature',
            '複雑な地質にダムはどう立つのか。人と自然のせめぎ合いの現場',
          ),
        ],
        meaning: l(
          '金沙江下游梯级电站群，世界级清洁能源走廊。',
          'The lower-Jinsha cascade: a world-class clean-energy corridor.',
          '金沙江下流の階段式発電群。世界級のクリーンエネルギー回廊です。',
        ),
      },
      history: {
        highlights: [
          l(
            '从都江堰到白鹤滩，治水传统在这里接上了现代工程史',
            'From Dujiangyan to Baihetan: the water-control tradition meets modern engineering',
            '都江堰から白鶴灘へ。治水の伝統がここで現代土木史につながります',
          ),
        ],
      },
    },
  },
  {
    id: 'chongqing',
    name: l('重庆', 'Chongqing', '重慶'),
    subtitle: l('最有生活感的长江山城', 'The mountain city most alive with river life', '暮らしの熱がこもる長江の山城'),
    lon: 106.6,
    lat: 29.6,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: [
          l(
            '两江交汇、山城地貌，城市长在山与江之间',
            'Two rivers meet; the city grows between mountains and water',
            '二つの川が合流し、街は山と川のあいだに育ちました',
          ),
        ],
      },
      culture: {
        highlights: [
          l(
            '山城结构、梯坎、江边码头、火锅、夜生活、立体交通',
            'Stair-step streets, riverside docks, hotpot, nightlife and 3-D transport',
            '段々の街並み、川辺の埠頭、火鍋、夜の賑わい、立体交通',
          ),
          l(
            '"现代民俗如何适应地形"的最佳样本',
            'The best case study of modern folk life adapting to terrain',
            '「現代の民俗が地形に適応する」最良のサンプル',
          ),
        ],
        meaning: l(
          '最有生活感的长江城市之一。',
          'One of the most vividly lived-in cities on the Yangtze.',
          '長江でもっとも生活感あふれる街のひとつです。',
        ),
      },
    },
  },
  {
    id: 'sanxia',
    name: l('三峡 · 白帝城', 'Three Gorges · Baidicheng', '三峡 ・ 白帝城'),
    subtitle: l(
      '夔门天下雄，轻舟已过万重山',
      '"Kui Gate, mightiest under heaven; my skiff has passed ten thousand hills"',
      '夔門は天下の雄。「軽舟已に過ぐ万重の山」',
    ),
    lon: 109.9,
    lat: 31.02,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: [
          l('瞿塘之雄、巫峡之秀、西陵之险', 'Qutang’s grandeur, Wu Gorge’s grace, Xiling’s peril', '瞿塘の雄、巫峡の秀、西陵の険'),
          l(
            '千百年来的江峡传奇，如今有了新的模样',
            'A thousand years of gorge legends, now wearing a new face',
            '千年の江峡伝説は、いま新しい姿をまとっています',
          ),
        ],
        meaning: l(
          '长江切开巫山，从盆地进入平原的总开关。',
          'Where the Yangtze cuts through Wushan — the master gate from basin to plain.',
          '長江が巫山を切り開く、盆地から平原への大関門です。',
        ),
      },
      history: {
        highlights: [
          l(
            '诗圣与江峡：白帝城下，"轻舟已过万重山"',
            'Poets and gorges: below Baidicheng, "my skiff has passed ten thousand hills"',
            '詩人と峡谷。白帝城のもと「軽舟已に過ぐ万重の山」',
          ),
          l(
            '三峡大坝：千年江峡的现代变奏',
            'The Three Gorges Dam: a modern variation on an ancient theme',
            '三峡ダム。千年の峡谷が奏でる現代の変奏曲',
          ),
        ],
        meaning: l(
          '中国诗歌地理与现代工程史在同一段江上重叠。',
          'China’s poetic geography and modern engineering overlap on this one stretch.',
          '中国の詩の地理と現代土木史が、同じ流れの上で重なります。',
        ),
      },
    },
  },
  {
    id: 'yichang-jingzhou',
    name: l('宜昌 · 荆州', 'Yichang · Jingzhou', '宜昌 ・ 荊州'),
    subtitle: l(
      '楚文化故都，出峡入平原',
      'Old capital of Chu; out of the gorges, onto the plain',
      '楚文化の故都。峡谷を出て平原へ',
    ),
    lon: 111.3,
    lat: 30.7,
    labelSide: 'top',
    labelDx: -20,
    facets: {
      history: {
        highlights: [
          l(
            '楚国故都：纪南城遗址，楚文化的早期中心',
            'Jinancheng, capital of ancient Chu — an early centre of Chu culture',
            '楚の故都・紀南城遺跡。楚文化の初期の中心地',
          ),
          l('"楚都的第一缕烟火"', '"The first hearth-smoke of the Chu capital"', '「楚都に立ちのぼる最初の炊煙」'),
        ],
        meaning: l(
          '长江中游文明的重要发端。',
          'A key beginning of civilization on the middle Yangtze.',
          '長江中流域文明の重要な始まりです。',
        ),
      },
      culture: {
        highlights: [
          l('从峡江文化过渡到江汉平原生活', 'Where gorge culture gives way to plains life', '峡谷の暮らしから江漢平原の暮らしへ'),
          l(
            '水边集镇、江岸饮食、日常渡运',
            'Riverside market towns, waterfront food, everyday ferries',
            '水辺の町、川岸の食、日々の渡し舟',
          ),
        ],
        meaning: l(
          '从山地到平原的人文过渡带。',
          'The cultural transition zone from mountains to plain.',
          '山地から平原への人文的な移行帯です。',
        ),
      },
    },
  },
  {
    id: 'dongting',
    name: l('洞庭湖 · 赤壁', 'Dongting Lake · Red Cliffs', '洞庭湖 ・ 赤壁'),
    subtitle: l('江湖相接，水势转换', 'Where river meets lake and waters trade places', '江と湖が出会い、水勢が入れ替わる'),
    lon: 113.1,
    lat: 29.45,
    labelSide: 'bottom',
    labelDx: 46,
    facets: {
      nature: {
        highlights: [
          l(
            '中国第二大淡水湖，湖水有时退去数十公里',
            'China’s second-largest freshwater lake, whose waters retreat tens of kilometres',
            '中国第二の淡水湖。水は時に数十キロも退きます',
          ),
          l(
            '"会呼吸"的湖泊，洲滩成为候鸟与渔民的舞台',
            'A "breathing" lake: sandbars become a stage for birds and fishers',
            '「呼吸する湖」。干潟は渡り鳥と漁師の舞台になります',
          ),
        ],
        meaning: l(
          '长江中游天然的调蓄水库。',
          'The middle Yangtze’s natural flood-regulating reservoir.',
          '長江中流域の天然の調整池です。',
        ),
      },
      history: {
        highlights: [
          l(
            '赤壁古战场：一把东风，改变三国格局',
            'The Red Cliffs battlefield: one east wind changed the Three Kingdoms',
            '赤壁の古戦場。一陣の東風が三国の勢力図を変えました',
          ),
          l(
            '城陵矶——长江与洞庭湖的"湖口"，岳阳楼上洞庭天下水',
            'Chenglingji, the lake’s gate to the river; from Yueyang Tower, "Dongting holds the world’s waters"',
            '城陵磯は湖の入り口。岳陽楼から望む「洞庭は天下の水」',
          ),
        ],
        meaning: l(
          '江上碰硬仗，英雄入史诗；江湖相接处，水势与历史一起转换。',
          'Hard battles on the water put heroes into epic; where river meets lake, history turns with the current.',
          '川の上の激戦は英雄を叙事詩に変え、江湖の境で水勢と歴史がともに転換します。',
        ),
      },
    },
  },
  {
    id: 'wuhan',
    name: l('武汉', 'Wuhan', '武漢'),
    subtitle: l('江湖城市，工业之城的浮现', 'A city of rivers and lakes; the rise of industry', '江湖の都市、工業都市の胎動'),
    lon: 114.3,
    lat: 30.6,
    labelSide: 'top',
    facets: {
      nature: {
        highlights: [
          l(
            '大江与百湖交织，湿地与城市并存，鱼米之乡也是洪水与人共生的考验',
            'A great river woven with a hundred lakes: wetlands within the city, plenty living with flood risk',
            '大河と百の湖が織りなす街。湿地と都市が共存し、豊かさは洪水との共生でもあります',
          ),
        ],
      },
      history: {
        highlights: [
          l(
            '张之洞与近代工业起点，汉阳铁厂的汽笛从这里拉响',
            'Zhang Zhidong and the dawn of modern industry — the Hanyang Ironworks whistle sounded here',
            '張之洞と近代工業の出発点。漢陽製鉄所の汽笛はここで鳴りました',
          ),
          l(
            '万里长江第一桥：武汉长江大桥',
            'The First Bridge over the Yangtze: the Wuhan Yangtze River Bridge',
            '万里の長江に架かる第一の橋、武漢長江大橋',
          ),
        ],
        meaning: l(
          '中国近代工业化在长江中游起航。',
          'China’s modern industrialization set sail from the middle Yangtze.',
          '中国の近代工業化は長江中流から船出しました。',
        ),
      },
      culture: {
        highlights: [
          l(
            '过早文化、码头传统、方言气质',
            '"Guozao" breakfast culture, dock traditions, a dialect with attitude',
            '「過早」の朝食文化、埠頭の伝統、方言の気風',
          ),
          l(
            '夏季湿热生活方式，长江大桥下的城市节奏',
            'Humid-summer rhythms of life beneath the great bridge',
            '蒸し暑い夏の暮らし、長江大橋の下の都市のリズム',
          ),
        ],
        meaning: l(
          '长江中游最典型的"江湖城市"日常样本。',
          'The classic daily life of a middle-Yangtze "river-and-lake city".',
          '長江中流域の典型的な「江湖都市」の日常サンプルです。',
        ),
      },
    },
  },
  {
    id: 'poyang',
    name: l('九江 · 鄱阳湖', 'Jiujiang · Poyang Lake', '九江 ・ 鄱陽湖'),
    subtitle: l('石钟山下，南北通江', 'Below Stone Bell Hill, a north–south river gate', '石鐘山のふもと、南北をつなぐ川の関'),
    lon: 116.25,
    lat: 29.8,
    labelSide: 'bottom',
    labelDx: 66,
    facets: {
      nature: {
        highlights: [
          l(
            '丰水是湖，枯水是河，冬季万鸟齐飞',
            'A lake in flood season, a river in the dry; ten thousand birds in winter',
            '豊水期は湖、渇水期は川。冬には万羽の鳥が舞います',
          ),
          l(
            '江豚在此栖息，中国最大淡水湖的季节魔法',
            'Finless porpoises live here — the seasonal magic of China’s largest freshwater lake',
            'スナメリの棲みか。中国最大の淡水湖が見せる季節の魔法',
          ),
        ],
        meaning: l(
          '长江与鄱阳湖的吞吐决定着下游的水情。',
          'The give-and-take between river and lake sets the water regime downstream.',
          '川と湖の吐吞が下流の水情を決めます。',
        ),
      },
      history: {
        highlights: [
          l(
            '苏轼夜泊石钟山，一篇游记问了千年的"石钟山夜雨声"',
            'Su Shi moored at Stone Bell Hill by night; his essay has asked about its sounds for a thousand years',
            '蘇軾は夜、石鐘山に舟を寄せ、その音の謎を千年問い続ける一文を残しました',
          ),
          l(
            '南北通江，近代通商口岸之一',
            'A north–south river junction and one of the modern treaty ports',
            '南北をつなぐ要衝、近代の開港場のひとつ',
          ),
        ],
        meaning: l(
          '文人山水与商路水运在湖口交汇。',
          'Literati landscapes and trade routes converge at the lake’s mouth.',
          '文人の山水と商いの水運が湖口で交わります。',
        ),
      },
    },
  },
  {
    id: 'nanjing',
    name: l('南京', 'Nanjing', '南京'),
    subtitle: l(
      '虎踞龙盘的江畔古都',
      'The riverside capital where "tigers crouch, dragons coil"',
      '「虎踞龍蟠」の江畔の古都',
    ),
    lon: 118.8,
    lat: 32.08,
    labelSide: 'top',
    facets: {
      history: {
        highlights: [
          l(
            '石头城见证六朝与明清交替，燕子矶上古都烟火',
            'The Stone City watched Six Dynasties give way to Ming and Qing; old-capital life at Yanziji',
            '石頭城は六朝から明清への移ろいを見つめ、燕子磯には古都の暮らしが灯ります',
          ),
          l(
            '"虎踞龙盘"的江畔城市，江流依旧',
            'A riverside city of legend — and the river still flows',
            '「虎踞龍蟠」の川辺の都。流れは今も変わりません',
          ),
        ],
        meaning: l(
          '六朝古都与江防要地，长江下游的历史枢纽。',
          'Ancient capital and river stronghold: the historical hub of the lower Yangtze.',
          '六朝の古都にして江防の要地。長江下流の歴史の要です。',
        ),
      },
      culture: {
        highlights: [
          l(
            '秦淮河生活、梧桐树街区、鸭馔',
            'Qinhuai riverside life, plane-tree avenues, celebrated duck dishes',
            '秦淮河の暮らし、プラタナスの並木道、名物の鴨料理',
          ),
          l('慢节奏与旧都气质并存', 'A slow tempo wrapped in old-capital temperament', 'ゆったりした時間と旧都の気品が同居します'),
        ],
        meaning: l(
          '历史沉积很深、但当下依然鲜活的城市生活。',
          'Deep layers of history beneath a city still vividly alive.',
          '歴史が深く積もりながら、今も生き生きとした都市の暮らしです。',
        ),
      },
    },
  },
  {
    id: 'guazhou',
    name: l('扬州 · 瓜洲', 'Yangzhou · Guazhou', '揚州 ・ 瓜洲'),
    subtitle: l(
      '古诗里的渡口，运河与长江的十字路口',
      'The ferry of ancient poems, where Canal crosses River',
      '古詩に詠まれた渡し場、運河と長江の十字路',
    ),
    lon: 119.45,
    lat: 32.2,
    labelSide: 'top',
    labelDx: 44,
    facets: {
      history: {
        highlights: [
          l(
            '南北水运咽喉：从这里扬帆，通江达运河',
            'The throat of north–south shipping: set sail here for river and canal alike',
            '南北水運ののど元。ここから帆を上げ、川へ運河へ',
          ),
          l(
            '瓜洲古渡与京杭大运河，商旅云集，百业兴盛',
            'Guazhou ferry and the Grand Canal: merchants gathered, trades flourished',
            '瓜洲の古渡と京杭大運河。商人が集い、百業が栄えました',
          ),
        ],
        meaning: l(
          '大运河与长江在此相交，撑起古代中国的水运版图。',
          'Canal meets River here, holding up imperial China’s waterborne economy.',
          '大運河と長江がここで交わり、古代中国の水運地図を支えました。',
        ),
      },
      culture: {
        highlights: [
          l(
            '"京口瓜洲一水间"，古诗里的渡口至今有渡船',
            '"Jingkou and Guazhou, one water apart" — the poem’s ferry still runs today',
            '「京口瓜洲一水の間」。詩の渡し舟は今も行き交います',
          ),
        ],
      },
    },
  },
  {
    id: 'jiangnan',
    name: l('江南水网 · 苏杭', 'Jiangnan Waterlands · Suzhou–Hangzhou', '江南水網 ・ 蘇杭'),
    subtitle: l(
      '河道如织，人与水温柔相处',
      'A lacework of canals; people and water at ease',
      '水路が織りなす土地、人と水の穏やかな関係',
    ),
    lon: 120.62,
    lat: 31.3,
    labelSide: 'bottom',
    labelDx: -70,
    facets: {
      nature: {
        highlights: [
          l(
            '河道如织，古镇临水而建',
            'Canals woven like cloth; old towns built at the water’s edge',
            '布のように織られた水路。古鎮は水辺に建ちます',
          ),
          l('人与水的相处方式温柔而智慧', 'A gentle, clever way of living with water', '水との付き合い方は、やさしくて賢い'),
        ],
        meaning: l(
          '长江水系在下游铺开的最细密的毛细血管。',
          'The finest capillaries of the Yangtze system, spread across the delta.',
          '長江水系が下流に広げた、もっとも細やかな毛細血管です。',
        ),
      },
      history: {
        highlights: [
          l(
            '良渚古城与水利系统：五千年前的治水文明',
            'Liangzhu’s ancient city and waterworks: a water-control civilization 5,000 years ago',
            '良渚古城と水利システム。五千年前の治水文明',
          ),
          l(
            '良渚人深谙治水与耕作——早期中国的水利密码',
            'The Liangzhu people mastered water and farming — early China’s hydraulic code',
            '良渚の人々は治水と農耕に長けていました。古代中国の水利の暗号です',
          ),
        ],
        meaning: l(
          '把中华文明五千年的起点，落在了长江下游。',
          'It anchors the 5,000-year story of Chinese civilization in the lower Yangtze.',
          '中華文明五千年の起点を長江下流に据えました。',
        ),
      },
      culture: {
        highlights: [
          l(
            '水巷、茶馆、园林与周边日常，江南饮食',
            'Water lanes, teahouses, gardens and everyday life; Jiangnan cuisine',
            '水路の小道、茶館、庭園と日々の暮らし、江南の食',
          ),
          l('丝绸与电商——传统与新经济并存', 'Silk and e-commerce: old trades beside the new economy', '絹と EC。伝統と新経済が並走します'),
        ],
        meaning: l(
          '吴依水乡不是静态古镇，而是持续运转的生活世界。',
          'The water towns are not museum pieces but a living, working world.',
          '水郷は静止した古鎮ではなく、動き続ける生活世界です。',
        ),
      },
    },
  },
  {
    id: 'shanghai',
    name: l('上海 · 长江口', 'Shanghai · Yangtze Estuary', '上海 ・ 長江河口'),
    subtitle: l('通向海洋的最后一站', 'The last stop before the ocean', '海へ向かう最後の停車場'),
    lon: 121.5,
    lat: 31.4,
    labelSide: 'bottom',
    labelDx: 30,
    facets: {
      nature: {
        highlights: [
          l(
            '崇明东滩：泥沙堆积，陆地仍在生长',
            'Chongming’s eastern shoals: silt piles up, land still growing',
            '崇明東灘。土砂が積もり、陸地は今も成長しています',
          ),
          l(
            '潮汐往复，候鸟翩跹，江海在此交汇',
            'Tides come and go, migratory birds dance — river meets sea',
            '潮は満ち引き、渡り鳥は舞い、川と海がここで出会います',
          ),
        ],
        meaning: l(
          '六千三百公里旅程的终点，也是新陆地的起点。',
          'The end of a 6,300 km journey — and the beginning of new land.',
          '六千三百キロの旅の終点は、新しい大地の始点でもあります。',
        ),
      },
      history: {
        highlights: [
          l(
            '吴淞口炮台湾：近代海防、口岸起点',
            'Wusongkou’s forts: modern coastal defence and the port era’s beginning',
            '呉淞口の砲台湾。近代海防と開港時代の始まり',
          ),
          l(
            '近代上海的开埠之门，海风与新世界',
            'The gate through which Shanghai opened — sea winds and a new world',
            '近代上海の開港の門。潮風と新しい世界',
          ),
        ],
        meaning: l(
          '从治水到工业，从古老到近代，长江在此汇入世界。',
          'From water control to industry, from ancient to modern — here the Yangtze joins the world.',
          '治水から工業へ、古代から近代へ。長江はここで世界へ注ぎます。',
        ),
      },
      culture: {
        highlights: [
          l(
            '国际都市：码头、金融、移民文化、咖啡馆、街区生活',
            'A global city: docks, finance, migrant cultures, cafés and street life',
            '国際都市。埠頭、金融、移民文化、カフェ、街角の暮らし',
          ),
        ],
        meaning: l(
          '长江如何从民族地区一路走到全球化都市的收尾。',
          'The finale: how the Yangtze travels from highland homelands to a globalized metropolis.',
          '民族の故郷から国際都市まで、長江の旅の終章です。',
        ),
      },
    },
  },
]
