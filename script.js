// 全局变量
let currentBazi = null;
let currentFiveElements = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
let currentDayElement = null;
let currentBodyStrength = null; // 身强身弱状态
let lunarLoading = false; // 防止重复加载
let fortunesData = null; // 签诗数据
let fortunesLoaded = false; // 数据是否已加载

// 嵌入式签诗数据（当外部加载失败时使用）
const embeddedFortunesData = {
  "fortuneDict": {
    "metal": {
      "strong": [
        {
          "title": "金行身强签",
          "poem": "金戈铁马气如虹，玉宇澄清万里风。刚强自有回天力，不惧前路有险峰。",
          "explanation": "金性刚健，身强更显威仪。您具备领导才能和决断力，适合开拓进取，但需注意刚愎自用，适当听取他人建议。"
        },
        {
          "title": "金刚不坏签",
          "poem": "百炼成钢志愈坚，千锤万击若等闲。正气凛然驱邪佞，光明磊落照人间。",
          "explanation": "如金刚般坚固，您有极强的抗压能力和原则性。在团队中是可靠的核心，但需避免过于强硬，以柔克刚更佳。"
        },
        {
          "title": "金城铁壁签",
          "poem": "金城铁壁固若汤，正气凌霄镇四方。谋略深沉藏机变，稳坐中军帐不慌。",
          "explanation": "您如同坚固的城墙，稳重而有谋略。在复杂环境中能保持冷静，适合决策和规划，但需注意不要过于封闭。"
        },
        {
          "title": "金声玉振签",
          "poem": "金声玉振彻云霄，威仪自显德高超。言行一致守诚信，名扬四海誉不凋。",
          "explanation": "您的声音如金玉般清脆，言行一致，信誉卓著。在社交和职场中影响力强，但需保持谦逊以免招妒。"
        }
      ],
      "weak": [
        {
          "title": "金弱需润签",
          "poem": "金石虽坚需水润，锋芒不露藏内秀。待得春风化雨时，精光内蕴耀九州。",
          "explanation": "金性偏弱，需水来生扶。您才华内敛，需等待时机展现。多接触属水之人事物，可增强运势。"
        },
        {
          "title": "金声玉振签",
          "poem": "金声玉振待时鸣，潜龙勿用藏其形。一朝得遇风云会，响彻云霄天下惊。",
          "explanation": "如珍贵乐器待奏响，您需要积累和准备。暂时低调行事，待时机成熟自然一鸣惊人。"
        },
        {
          "title": "金波荡漾签",
          "poem": "金波荡漾映月光，柔能克刚蕴锋芒。待时而动隐智慧，静水流深藏华章。",
          "explanation": "您如月光下的金色波浪，柔和而有内涵。暂时隐藏锋芒，积累能量，时机一到便能发挥巨大潜力。"
        },
        {
          "title": "金辉含彩签",
          "poem": "金辉含彩待晨光，内秀不彰自芬芳。修身养性积厚德，一朝展翅任翱翔。",
          "explanation": "您内在的光彩如同含而未发的金色光芒。注重内在修养，积累德行，未来必能大放异彩。"
        }
      ]
    },
    "wood": {
      "strong": [
        {
          "title": "木行身强签",
          "poem": "参天古木根深固，枝繁叶茂荫四方。仁德广布如春泽，生生不息福运长。",
          "explanation": "木性仁爱，身强则生机勃勃。您有强大的成长力和包容心，适合教育、公益事业，但需避免过于散漫。"
        },
        {
          "title": "栋梁之材签",
          "poem": "良材本是栋梁器，经风历雨更坚直。他日若遂凌云志，撑起广厦千万间。",
          "explanation": "您具备成为栋梁的潜质，坚韧不拔。在事业上会有重要成就，但需注意劳逸结合，避免过劳。"
        },
        {
          "title": "春木繁茂签",
          "poem": "春木繁茂生机旺，仁心善行德自彰。广结善缘福泽厚，绿荫蔽日送清凉。",
          "explanation": "您如春天的树木般生机盎然，仁德之心带来广泛的人缘。多行善事，福报自然深厚，但需避免过于理想化。"
        },
        {
          "title": "青松傲雪签",
          "poem": "青松傲雪立寒峰，坚韧不拔志不穷。历经沧桑色愈翠，风骨铮铮显英雄。",
          "explanation": "您如雪中青松，坚韧而有风骨。面对困难能坚持原则，适合需要毅力的工作，但需注意刚直易折。"
        }
      ],
      "weak": [
        {
          "title": "木弱逢春签",
          "poem": "弱柳扶风待春回，枯木逢阳又生枝。柔能克刚真智慧，以屈求伸是良机。",
          "explanation": "木性偏弱，需水滋养。您具有柔韧性，善于适应环境。多亲近自然，佩戴绿色饰品可增强木气。"
        },
        {
          "title": "芝兰玉树签",
          "poem": "芝兰生于深林处，不以无人而不芳。谦谦君子温如玉，德馨自能引凤凰。",
          "explanation": "如幽谷兰花，您有内在的美德和才华。不必急于表现，保持品格高尚，自会吸引赏识之人。"
        },
        {
          "title": "新芽破土签",
          "poem": "新芽破土力虽微，蓄势待发向天追。阳光雨露勤滋养，终成巨木显神威。",
          "explanation": "您如刚破土的新芽，力量虽小但潜力巨大。需要耐心积累，接受他人帮助，终能成长为参天大树。"
        },
        {
          "title": "幽兰空谷签",
          "poem": "幽兰空谷自芬芳，不慕繁华守淡妆。清心寡欲修内德，自有知音识妙香。",
          "explanation": "您如空谷幽兰，清雅高洁。不必追逐世俗繁华，保持内心宁静，自有懂您的人出现。"
        }
      ]
    },
    "water": {
      "strong": [
        {
          "title": "水行身强签",
          "poem": "大江东去势滔天，海纳百川容乃宽。智慧如渊深莫测，随方就圆任自然。",
          "explanation": "水性智慧，身强则气势磅礴。您思维敏捷，适应力强，适合创意、咨询行业，但需避免随波逐流。"
        },
        {
          "title": "上善若水签",
          "poem": "上善若水利万物，处下不争德自高。胸怀似海纳千流，以柔克刚是真道。",
          "explanation": "具备水的最高品德，您善良、包容且不争。这种品质会为您带来长远的福报和人际关系。"
        },
        {
          "title": "汪洋浩瀚签",
          "poem": "汪洋浩瀚纳百川，智慧深邃如渊泉。随机应变无穷尽，润泽万物福绵延。",
          "explanation": "您如浩瀚海洋，包容而智慧。能适应各种变化，善于处理复杂问题，但需注意不要失去自己的方向。"
        },
        {
          "title": "瀑布飞流签",
          "poem": "瀑布飞流势磅礴，雷霆万钧不可当。洗净尘嚣显本色，一往无前向远方。",
          "explanation": "您如瀑布般充满力量和冲劲。适合开拓性工作，能克服重重障碍，但需注意有时过于急躁。"
        }
      ],
      "weak": [
        {
          "title": "水弱需源签",
          "poem": "细流潺潺待泉涌，滴水穿石贵在恒。静水深流藏智慧，蓄势待发跃龙门。",
          "explanation": "水性偏弱，需金来生扶。您有持久的毅力，但需要加强行动力。多与属金之人合作，可补不足。"
        },
        {
          "title": "清泉石上签",
          "poem": "清泉石上流细细，明月松间照悠悠。心静自然乾坤大，淡泊明志致远猷。",
          "explanation": "如清泉般清澈宁静，您需要保持内心的平和。在淡泊中积累力量，终会达到理想境界。"
        },
        {
          "title": "溪流绕石签",
          "poem": "溪流绕石巧迂回，以柔克刚显智慧。不争不抢循道进，终归大海势巍巍。",
          "explanation": "您如溪流般灵活，懂得迂回前进。面对障碍能以柔克刚，最终达成目标，但需注意不要过于迂回。"
        },
        {
          "title": "晨露润物签",
          "poem": "晨露晶莹润物微，点滴滋养显慈悲。温柔细腻藏大爱，春风化雨福相随。",
          "explanation": "您如晨露般温柔细腻，能潜移默化地影响他人。适合需要耐心和细心的工作，但需注意不要过于敏感。"
        }
      ]
    },
    "fire": {
      "strong": [
        {
          "title": "火行身强签",
          "poem": "烈日当空照四方，光芒万丈显辉煌。热情奔放如烈焰，焚尽荆棘路自康。",
          "explanation": "火性热情，身强则光芒四射。您有领导力和感染力，适合演艺、营销等行业，但需避免急躁冲动。"
        },
        {
          "title": "凤凰涅槃签",
          "poem": "凤凰浴火得重生，炼就真金不怕焚。历尽劫波初心在，光明普照众生欣。",
          "explanation": "如凤凰涅槃，您有强大的重生能力和创造力。经历挑战后会更加强大，适合从事革新性工作。"
        },
        {
          "title": "烈火真金签",
          "poem": "烈火真金炼愈纯，热情似火耀乾坤。照亮黑暗引前路，温暖人心福满门。",
          "explanation": "您如烈火般纯粹而热情，能激励他人，照亮前路。适合领导或创意工作，但需注意控制情绪。"
        },
        {
          "title": "旭日东升签",
          "poem": "旭日东升光芒耀，驱散阴霾照大道。生机勃勃万象新，鸿运当头福星照。",
          "explanation": "您如初升的太阳，带来希望和活力。运势正处于上升期，适合开始新项目，但需注意不要过于冒进。"
        }
      ],
      "weak": [
        {
          "title": "火弱需薪签",
          "poem": "星火虽微可燎原，待得东风助烈焰。韬光养晦积能量，一飞冲天耀九天。",
          "explanation": "火性偏弱，需木来生扶。您有潜力但需要外在支持。多与属木之人交往，可获得助力。"
        },
        {
          "title": "烛照幽微签",
          "poem": "烛光虽微照暗室，温暖人心胜骄阳。不必争辉于日月，自有真光照八方。",
          "explanation": "如烛光般温暖，您有细腻的情感和洞察力。不必与强光争辉，发挥自己的独特价值更为重要。"
        },
        {
          "title": "萤火烁夜签",
          "poem": "萤火烁夜点点光，虽不明亮却温馨。默默奉献不争艳，自有知音识丹心。",
          "explanation": "您如萤火虫般，光芒虽小却能照亮黑暗。默默付出会被人看见和感激，适合支持性角色。"
        },
        {
          "title": "炉火纯青签",
          "poem": "炉火纯青需时炼，内敛光华待机显。厚积薄发终有时，一鸣惊人震九天。",
          "explanation": "您如炉火般需要时间锤炼。暂时内敛才华，专注提升自己，时机成熟便能一鸣惊人。"
        }
      ]
    },
    "earth": {
      "strong": [
        {
          "title": "土行身强签",
          "poem": "厚德载物如大地，万物生长赖其基。沉稳踏实步步稳，积善之家有余庆。",
          "explanation": "土性沉稳，身强则根基稳固。您可靠务实，适合管理、建筑等行业，但需避免过于保守固执。"
        },
        {
          "title": "泰山不移签",
          "poem": "稳如泰山不可移，信若磐石众人依。脚踏实地行正道，厚积薄发自成蹊。",
          "explanation": "如泰山般稳重可靠，您值得信赖且有耐心。坚持正道，稳步前进，终会取得扎实的成就。"
        },
        {
          "title": "沃土生金签",
          "poem": "沃土生金育英才，厚德载福自然来。根基深厚风雨稳，福泽绵长笑颜开。",
          "explanation": "您如肥沃的土地，能滋养万物。为人可靠，能培养人才，福泽深厚，但需注意不要过于包揽责任。"
        },
        {
          "title": "坤德载物签",
          "poem": "坤德载物容天地，沉稳大气显威仪。包容万象胸襟阔，厚德流光福寿齐。",
          "explanation": "您具备大地般的包容和稳重。能容纳不同意见，适合协调和管理工作，但需注意不要优柔寡断。"
        }
      ],
      "weak": [
        {
          "title": "土弱需培签",
          "poem": "土壤贫瘠需肥培，根深方能叶茂繁。虚心学习增智慧，厚积薄发终成才。",
          "explanation": "土性偏弱，需火来生扶。您需要加强学习和积累。多与属火之人交流，可激发热情和动力。"
        },
        {
          "title": "大地回春签",
          "poem": "冻土虽坚待春融，万物复苏赖阳和。耐心守得云开日，沃野千里丰收多。",
          "explanation": "如冻土等待春融，您需要耐心等待时机。加强内在修养，时机一到自然会有丰硕收获。"
        },
        {
          "title": "尘土飞扬签",
          "poem": "尘土飞扬待雨润，根基未稳莫急行。静心修炼增定力，踏实前行路自平。",
          "explanation": "您如待雨滋润的尘土，需要稳定根基。暂时不要急于行动，先打好基础，未来才能稳步前进。"
        },
        {
          "title": "梯田层叠签",
          "poem": "梯田层叠步步高，稳扎稳打不焦躁。循序渐进终登顶，一览众山显英豪。",
          "explanation": "您如梯田般需要一步步建设。脚踏实地，循序渐进，终能达到理想高度，适合需要耐心的长期项目。"
        }
      ]
    }
  },
  "lotteryResults": [
    { "level": "大吉", "message": "春风得意马蹄疾，一日看尽长安花。今日机缘如潮涌，心想事成乐无涯。" },
    { "level": "上吉", "message": "云开月明照前程，贵人相助路自平。只需保持初心在，功成名就自然成。" },
    { "level": "中吉", "message": "柳暗花明又一村，稳步前行福自临。小有波折不足虑，坚持到底见真金。" },
    { "level": "小吉", "message": "细雨滋润万物生，点滴积累终成城。今日种下善因种，来日收获满园春。" }
  ],
  "fortuneSentences": [
    "今日天时地利，你的命格与流年相得益彰，适宜开展新计划，会有意想不到的收获。",
    "五行流转，生生不息。今日你的能量与天地共鸣，人际关系和谐，贵人运上升。",
    "命理显示今日是你的幸运日，小小的冒险可能会带来丰厚的回报，保持开放心态。",
    "天地之气与你命格相生，今日思维清晰，决策果断，是处理重要事务的好时机。",
    "五行平衡，身心和谐。今日适合内省与规划，为未来的成功打下坚实基础。",
    "今日天干地支与你的命格形成良好互动，创造力旺盛，艺术灵感迸发。",
    "命理流转，今日你的能量场强大，吸引力倍增，适合社交与展示自我。",
    "天地能量与你的五行互补，今日财务状况良好，可能有意外之财的机会。",
    "今日命格与流年相合，情感运势上升，单身者可能有浪漫邂逅，有伴者关系更融洽。",
    "五行相生，今日你的健康状况良好，精力充沛，适合运动与户外活动。"
  ],
  "fiveDimensionAdvice": {
    "metal": {
      "strong": {
        "study": "学业上，金行身强者思维清晰，逻辑性强，适合法律、金融、管理等需要严谨思维的领域。建议制定系统学习计划，发挥分析和判断优势。",
        "career": "事业上，具备领导才能和决断力，适合担任管理职位或自主创业。注意刚柔并济，避免过于强硬。",
        "wealth": "财富方面，理财观念稳健，适合长期投资和资产配置。避免冲动消费，注重积累。",
        "relationship": "姻缘方面，重视诚信和原则，感情较为专一。需多表达情感，避免过于理性。",
        "health": "健康方面，肺部和呼吸系统需多关注，建议定期锻炼，保持空气流通。"
      },
      "weak": {
        "study": "学业上，金行身弱者需加强自信，循序渐进。适合需要耐心和细致的学科，如会计、审计等。",
        "career": "事业上，适合团队协作或辅助性职位，借助他人力量发展。注意积累经验和人脉。",
        "wealth": "财富方面，宜保守理财，避免高风险投资。注重储蓄，逐步积累财富。",
        "relationship": "姻缘方面，感情较为内敛，需主动表达。适合寻找稳重可靠的伴侣。",
        "health": "健康方面，注意呼吸道和皮肤保养，多喝水，避免干燥环境。"
      }
    },
    "wood": {
      "strong": {
        "study": "学业上，木行身强者富有创意和探索精神，适合艺术、设计、教育等领域。建议多参与实践项目。",
        "career": "事业上，具有成长性和拓展能力，适合新兴行业或创新岗位。注意目标专注，避免分散精力。",
        "wealth": "财富方面，眼光长远，适合投资成长型项目。避免盲目扩张，注意风险控制。",
        "relationship": "姻缘方面，性格温和，善于沟通。感情丰富，需注意平衡付出与索取。",
        "health": "健康方面，肝脏和眼睛需多关注，建议适量运动，保持情绪舒畅。"
      },
      "weak": {
        "study": "学业上，木行身弱者需培养耐心，打好基础。适合循序渐进的学习方式，如语言、文学等。",
        "career": "事业上，适合稳定性较强的岗位，或与他人合作。注意提升专业技能，增强竞争力。",
        "wealth": "财富方面，宜稳健理财，避免借贷。注重日常开支管理，逐步改善经济状况。",
        "relationship": "姻缘方面，感情细腻，需增强自信。适合寻找包容性强的伴侣。",
        "health": "健康方面，注意肝胆调理，避免熬夜，保持规律作息。"
      }
    },
    "water": {
      "strong": {
        "study": "学业上，水行身强者思维敏捷，适应力强，适合贸易、咨询、外交等需要沟通的领域。建议多涉猎广泛知识。",
        "career": "事业上，善于变通和协调，适合公关、销售、咨询等岗位。注意坚持原则，避免随波逐流。",
        "wealth": "财富方面，财运流动性强，适合短期投资或贸易。注意资金周转，避免过度投机。",
        "relationship": "姻缘方面，感情丰富，善于理解他人。需注意专一性，避免感情波动。",
        "health": "健康方面，肾脏和泌尿系统需多关注，建议多喝水，避免过度劳累。"
      },
      "weak": {
        "study": "学业上，水行身弱者需加强专注力，避免分散。适合需要深入钻研的学科，如研究、技术等。",
        "career": "事业上，适合稳定性强的岗位，或技术类工作。注意积累经验，提升专业深度。",
        "wealth": "财富方面，财运较为平稳，宜储蓄为主。可考虑长期稳健投资，避免冒险。",
        "relationship": "姻缘方面，感情较为含蓄，需主动沟通。适合寻找稳重踏实的伴侣。",
        "health": "健康方面，注意肾脏保健，避免久坐，适度运动。"
      }
    },
    "fire": {
      "strong": {
        "study": "学业上，火行身强者热情积极，富有感染力，适合表演、营销、传媒等需要表现力的领域。建议多参与实践活动。",
        "career": "事业上，具有领导力和感染力，适合演艺、餐饮、营销等行业。注意控制情绪，避免冲动决策。",
        "wealth": "财富方面，财运起伏较大，适合开拓性投资。注意理性消费，避免过度挥霍。",
        "relationship": "姻缘方面，感情热烈，表达直接。需注意对方感受，避免急躁。",
        "health": "健康方面，心脏和血液循环需多关注，建议保持平和心态，避免过度兴奋。"
      },
      "weak": {
        "study": "学业上，火行身弱者需增强动力，设定小目标。适合需要耐心和细心的学科，如手工、护理等。",
        "career": "事业上，适合支持性岗位或团队协作。注意提升热情，积极参与集体活动。",
        "wealth": "财富方面，财运较为平稳，宜稳步积累。避免高风险投资，注重节俭。",
        "relationship": "姻缘方面，感情较为被动，需增强主动性。适合寻找热情开朗的伴侣。",
        "health": "健康方面，注意心脏保健，避免过度劳累，保持充足睡眠。"
      }
    },
    "earth": {
      "strong": {
        "study": "学业上，土行身强者踏实稳重，有耐心，适合建筑、农业、管理等需要扎实基础的领域。建议按部就班学习。",
        "career": "事业上，可靠务实，适合管理、行政、建筑等岗位。注意灵活变通，避免过于保守。",
        "wealth": "财富方面，财运稳健，适合长期投资和不动产。注重储蓄，避免投机。",
        "relationship": "姻缘方面，感情稳定，重视承诺。需多表达情感，避免沉闷。",
        "health": "健康方面，脾胃和消化系统需多关注，建议饮食规律，避免暴饮暴食。"
      },
      "weak": {
        "study": "学业上，土行身弱者需增强自信，循序渐进。适合需要耐心和毅力的学科，如历史、地理等。",
        "career": "事业上，适合稳定性强的岗位，或技术类工作。注意打好基础，逐步提升。",
        "wealth": "财富方面，财运较为平稳，宜保守理财。注重开源节流，逐步改善经济状况。",
        "relationship": "姻缘方面，感情较为内向，需多沟通。适合寻找踏实可靠的伴侣。",
        "health": "健康方面，注意脾胃调理，饮食清淡，避免思虑过度。"
      }
    }
  },
  "luckyGuide": {
    "metal": {
      "luckyColors": ["白色", "金色", "银色"],
      "luckyNumbers": [4, 9],
      "auspiciousDirections": ["西方", "西北方"],
      "dailyAdvice": "多接触金属物品，佩戴金属饰品，保持环境整洁有序。"
    },
    "wood": {
      "luckyColors": ["绿色", "青色"],
      "luckyNumbers": [3, 8],
      "auspiciousDirections": ["东方", "东南方"],
      "dailyAdvice": "多接触植物，佩戴木制饰品，保持积极向上的心态。"
    },
    "water": {
      "luckyColors": ["黑色", "蓝色", "灰色"],
      "luckyNumbers": [1, 6],
      "auspiciousDirections": ["北方"],
      "dailyAdvice": "多接触水元素，佩戴水属性饰品，保持灵活变通。"
    },
    "fire": {
      "luckyColors": ["红色", "紫色", "橙色"],
      "luckyNumbers": [2, 7],
      "auspiciousDirections": ["南方"],
      "dailyAdvice": "多接触火元素，佩戴红色饰品，保持热情活力。"
    },
    "earth": {
      "luckyColors": ["黄色", "棕色", "米色"],
      "luckyNumbers": [5, 0],
      "auspiciousDirections": ["中央", "西南方", "东北方"],
      "dailyAdvice": "多接触土元素，佩戴土属性饰品，保持稳重踏实。"
    }
  }
};

// 动态加载 lunar.js 库（在线CDN）
function loadLunarScript() {
    if (lunarLoading) return false;
    if (typeof Lunar !== 'undefined') return true; // 已经加载

    lunarLoading = true;
    console.log('尝试动态加载 lunar.js 库...');

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lunar-javascript@latest/dist/lunar.js';
    script.onload = function() {
        console.log('lunar.js 库动态加载成功');
        lunarLoading = false;
        // 重新启用计算按钮
        document.getElementById('calculate-btn').disabled = false;
        document.getElementById('calculate-btn').innerHTML = '<i class="fas fa-calculator mr-2"></i>计算八字五行';
        // 更新农历显示
        updateLunarDisplay();
    };
    script.onerror = function() {
        console.error('lunar.js 库动态加载失败');
        lunarLoading = false;
        alert('无法加载 lunar.js 库，请检查网络连接或确保本地 lunar.js 文件存在。');
    };

    document.head.appendChild(script);
    return false; // 表示正在加载中
}

// 加载签诗数据
function loadFortunesData() {
    console.log('开始加载签诗数据...');

    // 先设置默认的空数据结构，防止后续代码访问未定义属性
    fortunesData = {
        fortuneDict: {},
        lotteryResults: [],
        fortuneSentences: [],
        fiveDimensionAdvice: null,
        luckyGuide: null
    };

    // 尝试使用XMLHttpRequest加载（兼容性更好，适用于本地文件）
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'fortunes.json', false); // 同步请求
        xhr.send();

        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            fortunesData = data;
            fortunesLoaded = true;
            console.log('签诗数据加载成功（通过XMLHttpRequest）', data);

            // 启用摇签按钮
            const shakeBtn = document.getElementById('shake-btn');
            if (shakeBtn) {
                shakeBtn.disabled = false;
                shakeBtn.innerHTML = '<i class="fas fa-hand-point-up mr-3"></i>点击摇签';
            }
            return;
        } else {
            throw new Error(`HTTP error! status: ${xhr.status}`);
        }
    } catch (xhrError) {
        console.warn('XMLHttpRequest加载失败，尝试使用fetch:', xhrError);

        // 尝试使用fetch（异步）
        fetch('fortunes.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                fortunesData = data;
                fortunesLoaded = true;
                console.log('签诗数据加载成功（通过fetch）', data);

                // 启用摇签按钮
                const shakeBtn = document.getElementById('shake-btn');
                if (shakeBtn) {
                    shakeBtn.disabled = false;
                    shakeBtn.innerHTML = '<i class="fas fa-hand-point-up mr-3"></i>点击摇签';
                }
            })
            .catch(fetchError => {
                console.error('所有加载方式都失败:', fetchError);
                // 使用嵌入的签诗数据作为回退
                fortunesData = embeddedFortunesData;
                fortunesLoaded = true;
                console.log('使用嵌入的签诗数据作为回退', embeddedFortunesData);

                // 启用摇签按钮
                const shakeBtn = document.getElementById('shake-btn');
                if (shakeBtn) {
                    shakeBtn.disabled = false;
                    shakeBtn.innerHTML = '<i class="fas fa-hand-point-up mr-3"></i>点击摇签';
                }

                // 仅在真正失败时显示警告（不是所有file://协议都会失败）
                // 检查是否通过file://协议访问
                if (window.location.protocol === 'file:') {
                    alert('签诗数据加载失败，已使用内置数据。\n\n如果通过file://协议打开页面，请确保fortunes.json文件与网页在同一目录。\n建议使用本地HTTP服务器运行（如Python: python -m http.server 8000）。');
                }
            });
    }
}

// 检查库是否加载，如果未加载则尝试加载
function checkLunarLib() {
    if (typeof Lunar === 'undefined') {
        console.warn('lunar.js 库未加载');
        document.getElementById('calculate-btn').disabled = true;
        document.getElementById('calculate-btn').innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>库未加载';
        document.getElementById('lunar-display').value = '库未加载';
        return false;
    }
    return true;
}

// 天干地支五行映射
const heavenlyStems = {
    '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth',
    '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water'
};

const earthlyBranches = {
    '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood', '辰': 'earth',
    '巳': 'fire', '午': 'fire', '未': 'earth', '申': 'metal', '酉': 'metal',
    '戌': 'earth', '亥': 'water'
};

// 月令（地支）对应的五行
const monthBranchToElement = {
    '寅': 'wood', '卯': 'wood', '辰': 'earth',
    '巳': 'fire', '午': 'fire', '未': 'earth',
    '申': 'metal', '酉': 'metal', '戌': 'earth',
    '亥': 'water', '子': 'water', '丑': 'earth'
};

// 五行相生：key生value
const generatingCycle = {
    'wood': 'fire',
    'fire': 'earth',
    'earth': 'metal',
    'metal': 'water',
    'water': 'wood'
};

// 五行相克：key克value
const restrainingCycle = {
    'metal': 'wood',
    'wood': 'earth',
    'earth': 'water',
    'water': 'fire',
    'fire': 'metal'
};

// 五行性格特征
const elementPersonality = {
    'metal': {
        traits: ['正直刚毅', '原则性强', '重信守诺', '果断决绝'],
        description: '性格如金，刚正不阿，原则性强，重视规则与秩序。'
    },
    'wood': {
        traits: ['仁慈宽厚', '成长进取', '灵活变通', '富有创意'],
        description: '性格如木，仁慈宽厚，富有生机与创造力，善于成长与适应。'
    },
    'water': {
        traits: ['智慧深沉', '灵活变通', '包容性强', '善于沟通'],
        description: '性格如水，智慧深沉，善于变通与沟通，包容性极强。'
    },
    'fire': {
        traits: ['热情奔放', '行动力强', '领导才能', '充满活力'],
        description: '性格如火，热情洋溢，行动力强，具有领导魅力与感染力。'
    },
    'earth': {
        traits: ['稳重踏实', '值得信赖', '耐心细致', '务实可靠'],
        description: '性格如土，稳重踏实，值得信赖，注重实际与稳定。'
    }
};

// 五行颜色
const elementColors = {
    'metal': '#C0C0C0',
    'wood': '#2E7D32',
    'water': '#1565C0',
    'fire': '#C62828',
    'earth': '#EF6C00'
};

// 五行补救建议
const remedySuggestions = {
    'metal': {
        colors: ['白色', '金色', '银色'],
        accessories: ['银饰', '金属手表', '白水晶', '钛钢饰品'],
        elements: ['多接触金属物品', '佩戴金属饰品', '使用白色系物品']
    },
    'wood': {
        colors: ['绿色', '青色'],
        accessories: ['绿幽灵', '檀木手串', '翡翠', '竹制品'],
        elements: ['多接触植物', '佩戴木制饰品', '使用绿色系物品']
    },
    'water': {
        colors: ['黑色', '蓝色', '灰色'],
        accessories: ['黑曜石', '海蓝宝', '蓝宝石', '水滴形饰品'],
        elements: ['多接触水元素', '佩戴水属性饰品', '使用黑蓝色系物品']
    },
    'fire': {
        colors: ['红色', '紫色', '橙色'],
        accessories: ['红玛瑙', '紫水晶', '琥珀', '太阳石'],
        elements: ['多接触火元素', '佩戴红色饰品', '使用暖色系物品']
    },
    'earth': {
        colors: ['黄色', '棕色', '米色'],
        accessories: ['黄水晶', '陶瓷饰品', '玛瑙', '玉石'],
        elements: ['多接触土元素', '佩戴土属性饰品', '使用大地色系物品']
    }
};




// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查库是否加载
    checkLunarLib();

    // 加载签诗数据
    loadFortunesData();

    // 设置默认出生日期为30年前
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 30);
    const formattedDate = defaultDate.toISOString().split('T')[0];
    document.getElementById('birthdate').value = formattedDate;

    // 更新农历显示
    updateLunarDisplay();

    // 绑定事件监听器
    document.getElementById('birthdate').addEventListener('change', updateLunarDisplay);
    document.getElementById('calculate-btn').addEventListener('click', calculateBazi);
    // 初始禁用摇签按钮，等待数据加载
    const shakeBtn = document.getElementById('shake-btn');
    shakeBtn.disabled = true;
    shakeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i>加载签诗中...';
    shakeBtn.addEventListener('click', performLottery);

    // 初始隐藏结果区域
    document.getElementById('results-section').classList.add('hidden');

    // 初始化合五行板块
    initFiveElementsMatch();
});

// 更新农历显示
function updateLunarDisplay() {
    const birthdate = document.getElementById('birthdate').value;
    if (!birthdate) return;

    // 检查库是否加载
    if (typeof Lunar === 'undefined') {
        document.getElementById('lunar-display').value = '库未加载';
        return;
    }

    try {
        const date = new Date(birthdate);
        // 检查 Lunar.fromDate 方法是否存在
        if (typeof Lunar.fromDate !== 'function') {
            document.getElementById('lunar-display').value = '库方法错误';
            console.error('Lunar.fromDate 不是函数，库版本可能不匹配');
            return;
        }

        const lunar = Lunar.fromDate(date);

        // 检查 toString 方法
        if (typeof lunar.toString !== 'function') {
            document.getElementById('lunar-display').value = '日期转换错误';
            return;
        }

        const lunarStr = lunar.toString();
        document.getElementById('lunar-display').value = lunarStr;
    } catch (e) {
        console.error('农历转换错误:', e);
        document.getElementById('lunar-display').value = '转换失败: ' + e.message;
    }
}

// 计算八字和五行
function calculateBazi() {
    // 显示五行测算加载动画
    const loadingElement = document.getElementById('five-elements-loading');
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }

    const birthdate = document.getElementById('birthdate').value;
    const birthtime = document.getElementById('birthtime').value;

    if (!birthdate) {
        alert('请选择出生日期');
        return;
    }

    // 检查库是否加载
    if (typeof Lunar === 'undefined') {
        const userConfirmed = confirm('lunar.js 库未加载。点击"确定"尝试从网络加载，点击"取消"检查本地文件。\n\n请确保 lunar.js 文件与网页在同一目录。\n如需离线使用，请确保已下载 lunar.js 文件。');
        if (userConfirmed) {
            // 尝试动态加载
            document.getElementById('calculate-btn').disabled = true;
            document.getElementById('calculate-btn').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>加载库中...';
            loadLunarScript();
            alert('正在尝试加载库，请稍后重试计算。');
        }
        return;
    }

    try {
        const date = new Date(birthdate + 'T' + birthtime);

        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            alert('日期格式无效，请检查输入');
            return;
        }

        // 检查 Lunar.fromDate 方法
        if (typeof Lunar.fromDate !== 'function') {
            alert('库方法错误，请尝试刷新页面');
            console.error('Lunar.fromDate 不是函数');
            return;
        }

        const lunar = Lunar.fromDate(date);

        // 检查 getBaZi 方法
        if (typeof lunar.getBaZi !== 'function') {
            alert('八字计算方法不可用，库版本可能不兼容');
            console.error('lunar.getBaZi 不是函数，库对象:', lunar);
            return;
        }

        // 获取八字
        const bazi = lunar.getBaZi();

        // 检查八字结果是否有效
        if (!Array.isArray(bazi) || bazi.length < 4) {
            alert('八字计算结果格式错误');
            console.error('八字结果格式错误:', bazi);
            return;
        }

        currentBazi = bazi;

        // 显示公历和农历日期
        document.getElementById('gregorian-date').textContent = date.toLocaleDateString('zh-CN');
        document.getElementById('lunar-date').textContent = lunar.toString();

        // 显示四柱八字
        document.getElementById('year-pillar').textContent = bazi[0] || '未知';
        document.getElementById('month-pillar').textContent = bazi[1] || '未知';
        document.getElementById('day-pillar').textContent = bazi[2] || '未知';
        document.getElementById('hour-pillar').textContent = bazi[3] || '未知';

        // 计算五行
        calculateFiveElements(bazi);

        // 显示五行能量条
        updateFiveElementsDisplay();

        // 计算身强身弱
        calculateBodyStrength(bazi);

        // 生成补救建议
        generateRemedy();

        // 生成贵人与避嫌建议
        generateRelationshipAdvice();

        // 生成运势推断
        generateFortune();

        // 生成五大维度运势建议
        generateFiveDimensionAdvice();

        // 生成综合开运指南
        generateLuckyGuide();

        // 显示结果区域
        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('results-section').classList.add('fade-in');

        // 滚动到结果区域
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });

        // 隐藏五行测算加载动画
        const loadingElement = document.getElementById('five-elements-loading');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }

    } catch (e) {
        console.error('八字计算错误:', e);
        alert('计算失败: ' + e.message + '\n请检查控制台获取详细信息');

        // 隐藏五行测算加载动画
        const loadingElement = document.getElementById('five-elements-loading');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }
}

// 计算五行得分
function calculateFiveElements(bazi) {
    // 重置得分
    currentFiveElements = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

    // 遍历八字中的每个字
    for (let pillar of bazi) {
        if (!pillar) continue;

        // 每个柱有两个字符
        for (let char of pillar) {
            // 检查天干
            if (heavenlyStems[char]) {
                currentFiveElements[heavenlyStems[char]]++;
            }
            // 检查地支
            if (earthlyBranches[char]) {
                currentFiveElements[earthlyBranches[char]]++;
            }
        }
    }

    // 计算总分并归一化到百分比（简化处理）
    const total = Object.values(currentFiveElements).reduce((a, b) => a + b, 0);
    if (total > 0) {
        for (let key in currentFiveElements) {
            currentFiveElements[key] = Math.round((currentFiveElements[key] / total) * 100);
        }
    }
}

// 更新五行显示
function updateFiveElementsDisplay() {
    const elements = ['metal', 'wood', 'water', 'fire', 'earth'];
    const elementNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };

    // 更新分数显示
    elements.forEach(el => {
        document.getElementById(`${el}-score`).textContent = currentFiveElements[el];
        document.getElementById(`${el}-bar`).style.width = `${currentFiveElements[el]}%`;
    });

    // 更新五行标签显示
    const container = document.getElementById('five-elements-score');
    container.innerHTML = '';

    elements.forEach(el => {
        const div = document.createElement('div');
        div.className = `element-item ${el}`;
        div.innerHTML = `<div class="font-bold text-lg">${elementNames[el]}</div>
                         <div class="text-sm">${currentFiveElements[el]}分</div>`;
        container.appendChild(div);
    });
}

// 计算身强身弱
function calculateBodyStrength(bazi) {
    const dayPillar = bazi[2]; // 日柱
    const monthPillar = bazi[1]; // 月柱

    if (!dayPillar || !monthPillar) return;

    const dayStem = dayPillar[0]; // 日干
    const monthBranch = monthPillar[1]; // 月支

    const dayElement = heavenlyStems[dayStem];
    currentDayElement = dayElement; // 存储日干五行
    const monthElement = monthBranchToElement[monthBranch];

    let strength = '未知';
    let description = '';

    if (dayElement && monthElement) {
        // 简单判断：如果月令五行生助日干五行，或相同，则为身强；否则为身弱
        if (dayElement === monthElement || generatingCycle[monthElement] === dayElement) {
            strength = '身强';
            description = '日干得令，能量充沛。适合担当领导角色，积极进取，发挥自身影响力。';
        } else {
            strength = '身弱';
            description = '日干不得令，能量稍弱。宜以柔克刚，借助他人力量，注重修养与积累。';
        }
    }

    // 存储身强身弱状态
    currentBodyStrength = strength;

    document.getElementById('body-strength').textContent = strength;
    document.getElementById('body-strength-desc').textContent = description;
}

// 生成补救建议
function generateRemedy() {
    // 找到得分最低的五行
    let minElement = 'metal';
    let minScore = currentFiveElements.metal;

    for (let element in currentFiveElements) {
        if (currentFiveElements[element] < minScore) {
            minScore = currentFiveElements[element];
            minElement = element;
        }
    }

    const suggestion = remedySuggestions[minElement];
    const elementNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };

    document.getElementById('remedy-text').textContent =
        `你的命理中${elementNames[minElement]}元素较弱，建议通过以下方式补充能量：`;

    const details = document.getElementById('remedy-details');
    details.innerHTML = `
        <div class="space-y-2">
            <div><span class="font-medium">推荐颜色：</span>${suggestion.colors.join('、')}</div>
            <div><span class="font-medium">推荐饰品：</span>${suggestion.accessories.slice(0, 3).join('、')}</div>
            <div><span class="font-medium">日常建议：</span>${suggestion.elements[0]}</div>
        </div>
    `;
}

// 生成贵人与避嫌建议
function generateRelationshipAdvice() {
    // 找到得分最低的五行（喜用神）
    let minElement = 'metal';
    let minScore = currentFiveElements.metal;

    for (let element in currentFiveElements) {
        if (currentFiveElements[element] < minScore) {
            minScore = currentFiveElements[element];
            minElement = element;
        }
    }

    const elementNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    const favoriteElement = minElement; // 喜用神
    const favoriteElementName = elementNames[favoriteElement];

    // 1. 确定贵人特征（与喜用神相同或生扶喜用神的五行）
    const nobleElements = new Set();
    // 相同五行
    nobleElements.add(favoriteElement);
    // 生扶喜用神的五行（寻找key，使得generatingCycle[key] === favoriteElement）
    for (let element in generatingCycle) {
        if (generatingCycle[element] === favoriteElement) {
            nobleElements.add(element);
        }
    }

    // 2. 确定避嫌特征（克制喜用神或被喜用神消耗的五行）
    const avoidElements = new Set();
    // 克制喜用神的五行（寻找key，使得restrainingCycle[key] === favoriteElement）
    for (let element in restrainingCycle) {
        if (restrainingCycle[element] === favoriteElement) {
            avoidElements.add(element);
        }
    }
    // 喜用神克制的五行（restrainingCycle[favoriteElement]）
    if (restrainingCycle[favoriteElement]) {
        avoidElements.add(restrainingCycle[favoriteElement]);
    }

    // 生成贵人描述
    let nobleDesc = `你的喜用神为${favoriteElementName}，以下特征的人可能是你的贵人：`;
    const nobleList = document.getElementById('noble-person-list');
    nobleList.innerHTML = '';

    nobleElements.forEach(element => {
        const elementName = elementNames[element];
        const personality = elementPersonality[element];
        const li = document.createElement('li');
        li.className = 'flex items-start';
        li.innerHTML = `<span class="mr-2">•</span><span><strong>${elementName}行人：</strong>${personality.description}</span>`;
        nobleList.appendChild(li);
    });

    document.getElementById('noble-person-desc').textContent = nobleDesc;

    // 生成避嫌描述
    let avoidDesc = `以下特征的人可能需要适当注意，保持适当距离：`;
    const avoidList = document.getElementById('avoid-person-list');
    avoidList.innerHTML = '';

    avoidElements.forEach(element => {
        const elementName = elementNames[element];
        const personality = elementPersonality[element];
        const li = document.createElement('li');
        li.className = 'flex items-start';
        li.innerHTML = `<span class="mr-2">•</span><span><strong>${elementName}行人：</strong>${personality.description}</span>`;
        avoidList.appendChild(li);
    });

    document.getElementById('avoid-person-desc').textContent = avoidDesc;

    // 如果没有避嫌元素，显示特殊提示
    if (avoidElements.size === 0) {
        const li = document.createElement('li');
        li.className = 'flex items-start';
        li.innerHTML = `<span class="mr-2">•</span><span>你的五行较为平衡，没有特别需要避嫌的类型，但人际交往仍需相互尊重。</span>`;
        avoidList.appendChild(li);
    }
}

// 生成运势推断
function generateFortune() {
    // 检查签诗数据是否加载
    const fortuneSentences = fortunesData && fortunesData.fortuneSentences ? fortunesData.fortuneSentences : [];
    const fortuneDict = fortunesData && fortunesData.fortuneDict ? fortunesData.fortuneDict : {};

    // 如果日干五行或身强身弱未计算，使用随机话术
    if (!currentDayElement || !currentBodyStrength) {
        if (fortuneSentences.length === 0) {
            document.getElementById('fortune-text').textContent = '签诗数据加载中，请稍后...';
            return;
        }
        const randomIndex = Math.floor(Math.random() * fortuneSentences.length);
        document.getElementById('fortune-text').textContent = fortuneSentences[randomIndex];
        return;
    }

    // 确定身强身弱键值
    const strengthKey = currentBodyStrength.includes('强') ? 'strong' : 'weak';
    const elementKey = currentDayElement; // metal, wood, water, fire, earth

    // 检查是否有对应的签诗数据
    if (fortuneDict[elementKey] && fortuneDict[elementKey][strengthKey]) {
        const poems = fortuneDict[elementKey][strengthKey];
        const randomIndex = Math.floor(Math.random() * poems.length);
        const selectedPoem = poems[randomIndex];

        // 格式化显示签诗
        const fortuneHTML = `
            <div class="space-y-4">
                <div class="text-center">
                    <h4 class="text-xl font-bold text-gray-800 mb-2">${selectedPoem.title}</h4>
                    <div class="text-lg italic text-gray-700 leading-relaxed p-4 bg-red-50 rounded-lg border-l-4 border-red-300">
                        ${selectedPoem.poem}
                    </div>
                </div>
                <div class="text-gray-700 leading-relaxed">
                    <p class="font-medium text-gray-800 mb-1">解签：</p>
                    <p>${selectedPoem.explanation}</p>
                </div>
            </div>
        `;
        document.getElementById('fortune-text').innerHTML = fortuneHTML;
    } else {
        // 回退到随机话术
        const randomIndex = Math.floor(Math.random() * fortuneSentences.length);
        document.getElementById('fortune-text').textContent = fortuneSentences[randomIndex];
    }
}

// 生成五大维度运势建议
function generateFiveDimensionAdvice() {
    // 检查数据是否加载
    const fiveDimensionAdvice = fortunesData && fortunesData.fiveDimensionAdvice ? fortunesData.fiveDimensionAdvice : null;
    if (!fiveDimensionAdvice || Object.keys(fiveDimensionAdvice).length === 0) {
        console.warn('五大维度运势建议数据未加载');
        // 设置默认文本
        document.getElementById('advice-study').textContent = '学业建议数据加载中...';
        document.getElementById('advice-career').textContent = '事业建议数据加载中...';
        document.getElementById('advice-wealth').textContent = '财富建议数据加载中...';
        document.getElementById('advice-relationship').textContent = '姻缘建议数据加载中...';
        document.getElementById('advice-health').textContent = '健康建议数据加载中...';
        return;
    }

    // 如果日干五行或身强身弱未计算，无法生成建议
    if (!currentDayElement || !currentBodyStrength) {
        console.warn('无法生成五大维度建议：缺少五行或身强身弱数据');
        // 设置默认文本
        document.getElementById('advice-study').textContent = '请先计算八字五行';
        document.getElementById('advice-career').textContent = '请先计算八字五行';
        document.getElementById('advice-wealth').textContent = '请先计算八字五行';
        document.getElementById('advice-relationship').textContent = '请先计算八字五行';
        document.getElementById('advice-health').textContent = '请先计算八字五行';
        return;
    }

    // 确定身强身弱键值
    const strengthKey = currentBodyStrength.includes('强') ? 'strong' : 'weak';
    const elementKey = currentDayElement; // metal, wood, water, fire, earth

    // 检查是否有对应的建议数据
    if (fiveDimensionAdvice[elementKey] && fiveDimensionAdvice[elementKey][strengthKey]) {
        const advice = fiveDimensionAdvice[elementKey][strengthKey];

        // 更新DOM元素
        document.getElementById('advice-study').textContent = advice.study;
        document.getElementById('advice-career').textContent = advice.career;
        document.getElementById('advice-wealth').textContent = advice.wealth;
        document.getElementById('advice-relationship').textContent = advice.relationship;
        document.getElementById('advice-health').textContent = advice.health;
    } else {
        console.warn(`未找到${elementKey} ${strengthKey}的五大维度建议数据`);
        // 设置默认文本
        document.getElementById('advice-study').textContent = '学业建议数据加载中...';
        document.getElementById('advice-career').textContent = '事业建议数据加载中...';
        document.getElementById('advice-wealth').textContent = '财富建议数据加载中...';
        document.getElementById('advice-relationship').textContent = '姻缘建议数据加载中...';
        document.getElementById('advice-health').textContent = '健康建议数据加载中...';
    }
}

// 生成综合开运指南
function generateLuckyGuide() {
    // 检查数据是否加载
    const luckyGuide = fortunesData && fortunesData.luckyGuide ? fortunesData.luckyGuide : null;
    if (!luckyGuide || Object.keys(luckyGuide).length === 0) {
        console.warn('综合开运指南数据未加载');
        // 设置默认文本
        document.getElementById('lucky-colors').innerHTML = '<span class="text-gray-500">数据加载中...</span>';
        document.getElementById('lucky-numbers').innerHTML = '<span class="text-gray-500">数据加载中...</span>';
        document.getElementById('auspicious-directions').innerHTML = '<span class="text-gray-500">数据加载中...</span>';
        document.getElementById('daily-advice').textContent = '日常建议数据加载中...';
        return;
    }

    // 如果日干五行未计算，无法生成指南
    if (!currentDayElement) {
        console.warn('无法生成开运指南：缺少五行数据');
        // 设置默认文本
        document.getElementById('lucky-colors').innerHTML = '<span class="text-gray-500">请先计算八字五行</span>';
        document.getElementById('lucky-numbers').innerHTML = '<span class="text-gray-500">请先计算八字五行</span>';
        document.getElementById('auspicious-directions').innerHTML = '<span class="text-gray-500">请先计算八字五行</span>';
        document.getElementById('daily-advice').textContent = '请先计算八字五行';
        return;
    }

    const elementKey = currentDayElement; // metal, wood, water, fire, earth

    // 检查是否有对应的指南数据
    if (luckyGuide[elementKey]) {
        const guide = luckyGuide[elementKey];

        // 更新幸运色
        const colorsContainer = document.getElementById('lucky-colors');
        colorsContainer.innerHTML = '';
        guide.luckyColors.forEach(color => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-300';
            span.textContent = color;
            colorsContainer.appendChild(span);
        });

        // 更新幸运数字
        const numbersContainer = document.getElementById('lucky-numbers');
        numbersContainer.innerHTML = '';
        guide.luckyNumbers.forEach(number => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-300';
            span.textContent = number;
            numbersContainer.appendChild(span);
        });

        // 更新吉利方位
        const directionsContainer = document.getElementById('auspicious-directions');
        directionsContainer.innerHTML = '';
        guide.auspiciousDirections.forEach(direction => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-300';
            span.textContent = direction;
            directionsContainer.appendChild(span);
        });

        // 更新日常建议
        document.getElementById('daily-advice').textContent = guide.dailyAdvice;
    } else {
        console.warn(`未找到${elementKey}的综合开运指南数据`);
        // 设置默认文本
        document.getElementById('lucky-colors').innerHTML = '<span class="text-gray-500">数据加载中...</span>';
        document.getElementById('lucky-numbers').innerHTML = '<span class="text-gray-500">数据加载中...</span>';
        document.getElementById('auspicious-directions').innerHTML = '<span class="text-gray-500">数据加载中...</span>';
        document.getElementById('daily-advice').textContent = '日常建议数据加载中...';
    }
}

// 赛博摇签
function performLottery() {
    // 检查签诗数据是否加载
    const lotteryResults = fortunesData && fortunesData.lotteryResults ? fortunesData.lotteryResults : [];
    if (lotteryResults.length === 0) {
        alert('签诗数据尚未加载，请稍后再试。');
        return;
    }

    const button = document.getElementById('shake-btn');
    const box = document.getElementById('lottery-box');
    const result = document.getElementById('lottery-result');
    const message = document.getElementById('lottery-message');

    // 禁用按钮
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i>摇签中...';

    // 添加摇动动画 - 使用增强的竹筒摇动效果
    box.classList.add('shake-lottery');
    result.textContent = '...';

    // 3秒后显示结果
    setTimeout(() => {
        // 移除动画
        box.classList.remove('shake-lottery');
        box.classList.add('glow');

        // 随机选择签文
        const randomIndex = Math.floor(Math.random() * lotteryResults.length);
        const lottery = lotteryResults[randomIndex];

        // 显示结果
        result.textContent = lottery.level;
        result.style.color = getLotteryColor(lottery.level);

        // 显示签诗
        message.innerHTML = `
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 class="text-2xl font-bold mb-3" style="color: ${getLotteryColor(lottery.level)}">${lottery.level}</h3>
                <p class="text-lg">${lottery.message}</p>
            </div>
        `;
        message.classList.remove('hidden');

        // 恢复按钮
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-hand-point-up mr-3"></i>再次摇签';

        // 1.5秒后显示祈福选项
        setTimeout(() => {
            showIncenseModal(lottery.level);
        }, 1500);

        // 3秒后移除发光效果
        setTimeout(() => {
            box.classList.remove('glow');
        }, 3000);

    }, 3000);
}

// 获取签文颜色
function getLotteryColor(level) {
    switch(level) {
        case '大吉': return '#E53935'; // 红色
        case '上吉': return '#FB8C00'; // 橙色
        case '中吉': return '#43A047'; // 绿色
        case '小吉': return '#1E88E5'; // 蓝色
        default: return '#333';
    }
}

// 显示祈福模态框
function showIncenseModal(lotteryLevel) {
    // 如果已经有模态框，先移除
    const existingModal = document.getElementById('incense-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 创建模态框
    const modal = document.createElement('div');
    modal.id = 'incense-modal';
    modal.className = 'incense-modal';

    const levelColor = getLotteryColor(lotteryLevel);

    modal.innerHTML = `
        <div class="incense-content">
            <h2 class="incense-title">🎋 祈福时刻 🎋</h2>
            <p class="incense-message">
                恭喜你抽到了<span style="color: ${levelColor}; font-weight: bold;">「${lotteryLevel}」</span>签！<br>
                是否愿意为小迪烧香祈福，让好运常伴？
            </p>
            <div class="incense-buttons">
                <button class="incense-btn incense-btn-yes" id="incense-yes">
                    <i class="fas fa-praying-hands mr-2"></i>是的，我要祈福
                </button>
                <button class="incense-btn incense-btn-no" id="incense-no">
                    <i class="fas fa-times mr-2"></i>不了，谢谢
                </button>
            </div>
            <div id="incense-animation-container" class="hidden"></div>
        </div>
    `;

    document.body.appendChild(modal);

    // 绑定按钮事件
    document.getElementById('incense-yes').addEventListener('click', function() {
        showIncenseAnimation(modal, lotteryLevel);
    });

    document.getElementById('incense-no').addEventListener('click', function() {
        modal.remove();
    });
}

// 显示清香动画
function showIncenseAnimation(modal, lotteryLevel) {
    const container = document.getElementById('incense-animation-container');
    container.classList.remove('hidden');
    container.innerHTML = '';

    // 创建三支清香
    const incenseContainer = document.createElement('div');
    incenseContainer.className = 'incense-container';

    for (let i = 0; i < 3; i++) {
        const incense = document.createElement('div');
        incense.className = 'incense-stick';

        const burning = document.createElement('div');
        burning.className = 'incense-burning';

        const smoke = document.createElement('div');
        smoke.className = 'incense-smoke';

        // 添加三个烟雾粒子
        for (let j = 0; j < 3; j++) {
            const smokeParticle = document.createElement('div');
            smokeParticle.className = 'smoke-particle';
            smoke.appendChild(smokeParticle);
        }

        incense.appendChild(burning);
        incense.appendChild(smoke);
        incenseContainer.appendChild(incense);
    }

    container.appendChild(incenseContainer);

    // 移除按钮
    const buttons = document.querySelector('.incense-buttons');
    if (buttons) {
        buttons.classList.add('hidden');
    }

    // 更新消息
    const message = document.querySelector('.incense-message');
    if (message) {
        message.textContent = '清香袅袅，祈福进行中...';
    }

    // 3秒后显示祈福完成
    setTimeout(() => {
        showBlessingComplete(modal, lotteryLevel);
    }, 3000);
}

// 显示祈福完成
function showBlessingComplete(modal, lotteryLevel) {
    const container = document.getElementById('incense-animation-container');

    // 移除清香动画
    container.innerHTML = '';

    // 添加祈福完成消息
    const completeDiv = document.createElement('div');
    completeDiv.className = 'blessing-complete';
    completeDiv.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        祈福圆满！小迪已收到您的祝福，愿好运常伴！
    `;

    container.appendChild(completeDiv);
    container.classList.remove('hidden');

    // 更新消息
    const message = document.querySelector('.incense-message');
    if (message) {
        message.textContent = `「${lotteryLevel}」签的祝福已送达！`;
    }

    // 3秒后关闭模态框
    setTimeout(() => {
        modal.remove();
    }, 3000);
}

// 初始化打小人功能
document.addEventListener('DOMContentLoaded', function() {
    initBeatEvilRitual();
});

/* ==================== 打小人仪式功能 ==================== */

let beatCount = 0;
const totalBeatsRequired = 9;
let isRitualInProgress = false;
let currentRitualStage = 'home'; // home, opening, beating, burning, ending, result

// 吉祥祈福语库
const blessingSentences = [
    "小人退散，贵人进门，从此路路畅通，事事顺心。",
    "一扫阴霾，迎来阳光，心中块垒已消，好运自然来。",
    "驱逐负能量，吸引正能量，心情舒畅，福气自来。",
    "仪式完成，心境清明，小人远离，贵人相助。",
    "情绪已宣泄，心灵得净化，前路光明，好运相随。",
    "打走烦恼，迎来欢喜，心境开阔，福运亨通。",
    "小人已驱，正气长存，贵人将至，好运连连。",
    "宣泄完成，心结已解，阳光普照，前路坦荡。",
    "仪式圆满，心情舒畅，小人退避，贵人引路。",
    "负能量消散，正能量汇聚，心境平和，好运自然。"
];

// 初始化打小人仪式
function initBeatEvilRitual() {
    const startBtn = document.getElementById('start-beat-evil-btn');
    const evilPaper = document.getElementById('evil-paper');
    const restartBtn = document.getElementById('restart-ritual-btn');
    const backToHomeBtn = document.getElementById('back-to-home-btn');

    if (startBtn) {
        startBtn.addEventListener('click', startBeatEvilRitual);
    }

    if (evilPaper) {
        evilPaper.addEventListener('click', handleBeatEvilPaper);
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', restartBeatEvilRitual);
    }

    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', backToBeatEvilHome);
    }
}

// 开始打小人仪式
function startBeatEvilRitual() {
    if (isRitualInProgress) return;

    isRitualInProgress = true;
    currentRitualStage = 'opening';
    beatCount = 0;

    // 隐藏首页，显示仪式页
    document.getElementById('beat-evil-home').classList.add('hidden');
    document.getElementById('beat-evil-ritual').classList.remove('hidden');
    document.getElementById('beat-evil-result').classList.add('hidden');

    // 重置所有仪式阶段
    const stages = ['ritual-opening', 'ritual-beating', 'ritual-burning', 'ritual-ending'];
    stages.forEach(stage => {
        const element = document.getElementById(stage);
        if (element) {
            element.classList.add('hidden');
        }
    });

    // 显示祈福开场
    document.getElementById('ritual-opening').classList.remove('hidden');

    // 更新拍打计数
    updateBeatCount();

    // 3秒后自动进入拍打阶段
    setTimeout(() => {
        if (currentRitualStage === 'opening') {
            startBeatingStage();
        }
    }, 3000);
}

// 开始拍打阶段
function startBeatingStage() {
    currentRitualStage = 'beating';

    // 隐藏开场，显示拍打
    document.getElementById('ritual-opening').classList.add('hidden');
    document.getElementById('ritual-beating').classList.remove('hidden');

    // 重置纸人状态
    const evilPaper = document.getElementById('evil-paper');
    if (evilPaper) {
        evilPaper.classList.remove('beating', 'scale-beat');
        const cracks = evilPaper.querySelectorAll('.crack');
        cracks.forEach(crack => crack.classList.remove('show'));
    }
}

// 处理拍打纸人
function handleBeatEvilPaper(event) {
    if (currentRitualStage !== 'beating' || beatCount >= totalBeatsRequired) return;

    beatCount++;
    updateBeatCount();

    // 创建拖鞋挥动动画
    createSlipperSwingAnimation(event);

    // 纸人震动动画
    const evilPaper = document.getElementById('evil-paper');
    evilPaper.classList.remove('beating');
    void evilPaper.offsetWidth; // 触发重绘
    evilPaper.classList.add('beating');

    // 屏幕闪烁（白色）
    createScreenFlash('white');

    // 每3次拍打显示屏幕红光闪烁和纸人放大
    if (beatCount % 3 === 0) {
        createScreenFlash('red');
        evilPaper.classList.remove('scale-beat');
        void evilPaper.offsetWidth;
        evilPaper.classList.add('scale-beat');
    }

    // 显示裂纹（每2次拍打显示一个裂纹）
    if (beatCount % 2 === 0) {
        const crackIndex = Math.min(Math.floor(beatCount / 2), 3);
        const crack = document.querySelector(`.crack-${crackIndex}`);
        if (crack) {
            crack.classList.remove('show');
            void crack.offsetWidth;
            crack.classList.add('show');
        }
    }

    // 屏幕震动效果（强度70/100）
    if (beatCount % 2 === 0) {
        document.body.classList.remove('screen-shake');
        void document.body.offsetWidth;
        document.body.classList.add('screen-shake');
    }

    // 拍打完成，进入焚化阶段
    if (beatCount >= totalBeatsRequired) {
        setTimeout(() => {
            startBurningStage();
        }, 500);
    }
}

// 更新拍打计数显示
function updateBeatCount() {
    const beatCountElement = document.getElementById('beat-count');
    const beatProgress = document.getElementById('beat-progress');

    if (beatCountElement) {
        beatCountElement.textContent = beatCount;
    }

    if (beatProgress) {
        const progressPercent = (beatCount / totalBeatsRequired) * 100;
        beatProgress.style.width = `${progressPercent}%`;
    }
}

// 创建屏幕闪烁效果
function createScreenFlash(type) {
    const flash = document.createElement('div');
    flash.className = `screen-flash ${type}-flash`;
    document.body.appendChild(flash);

    // 动画结束后移除元素
    setTimeout(() => {
        if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
        }
    }, type === 'white' ? 150 : 300);
}

// 创建拖鞋挥动动画
function createSlipperSwingAnimation(event) {
    // 获取点击位置
    const x = event.clientX;
    const y = event.clientY;

    // 创建拖鞋元素
    const slipper = document.createElement('div');
    slipper.className = 'crystal-slipper beating-slipper';
    slipper.innerHTML = '<div class="crystal-slipper-sole"></div><div class="crystal-slipper-strap"></div>';

    // 设置位置（以点击点为中心）
    slipper.style.position = 'fixed';
    slipper.style.left = (x - 40) + 'px'; // 拖鞋宽度80px，一半40px
    slipper.style.top = (y - 20) + 'px'; // 拖鞋高度40px，一半20px
    slipper.style.zIndex = '9999';

    document.body.appendChild(slipper);

    // 添加挥动动画
    slipper.classList.add('slipper-swing');

    // 动画结束后移除元素
    setTimeout(() => {
        if (slipper.parentNode) {
            slipper.parentNode.removeChild(slipper);
        }
    }, 300);
}

// 开始焚化阶段
function startBurningStage() {
    currentRitualStage = 'burning';

    // 隐藏拍打，显示焚化
    document.getElementById('ritual-beating').classList.add('hidden');
    document.getElementById('ritual-burning').classList.remove('hidden');

    // 设置灰烬粒子的随机运动方向
    const ashes = document.querySelectorAll('.ash-particle');
    ashes.forEach(ash => {
        const x = (Math.random() * 60 - 30) + 'px';
        const y = -(Math.random() * 80 + 60) + 'px';
        ash.style.setProperty('--ash-x', x);
        ash.style.setProperty('--ash-y', y);
    });

    // 1.5秒焚化动画后进入迎贵人阶段
    setTimeout(() => {
        startEndingStage();
    }, 1500);
}

// 开始迎贵人阶段
function startEndingStage() {
    currentRitualStage = 'ending';

    // 隐藏焚化，显示迎贵人
    document.getElementById('ritual-burning').classList.add('hidden');
    document.getElementById('ritual-ending').classList.remove('hidden');

    // 1.2秒金光动画后，文字依次弹出（总时长1.0s）
    // 祥云飞入汇聚（1.0s）

    // 2秒后显示结果页
    setTimeout(() => {
        showResultPage();
    }, 2000);
}

// 显示结果页
function showResultPage() {
    currentRitualStage = 'result';
    isRitualInProgress = false;

    // 隐藏仪式页，显示结果页
    document.getElementById('beat-evil-ritual').classList.add('hidden');
    document.getElementById('beat-evil-result').classList.remove('hidden');

    // 随机选择吉祥祈福语
    const blessingText = document.getElementById('blessing-text');
    if (blessingText) {
        const randomIndex = Math.floor(Math.random() * blessingSentences.length);
        blessingText.textContent = blessingSentences[randomIndex];
    }
}

// 重新开始仪式
function restartBeatEvilRitual() {
    // 重置状态
    beatCount = 0;
    isRitualInProgress = false;
    currentRitualStage = 'home';

    // 隐藏结果页，显示首页
    document.getElementById('beat-evil-result').classList.add('hidden');
    document.getElementById('beat-evil-home').classList.remove('hidden');
    document.getElementById('beat-evil-ritual').classList.add('hidden');
}

// 返回打小人首页
function backToBeatEvilHome() {
    // 重置状态
    beatCount = 0;
    isRitualInProgress = false;
    currentRitualStage = 'home';

    // 隐藏结果页，显示首页
    document.getElementById('beat-evil-result').classList.add('hidden');
    document.getElementById('beat-evil-home').classList.remove('hidden');
    document.getElementById('beat-evil-ritual').classList.add('hidden');
}

/* ==================== 合五行板块功能 ==================== */

// 合五行板块全局变量
let myBazi = null;
let myFiveElements = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
let partnerBazi = null;
let partnerFiveElements = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
let relationshipType = 'love';

// 初始化合五行板块
function initFiveElementsMatch() {
    // 设置默认出生日期为30年前
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 30);
    const formattedDate = defaultDate.toISOString().split('T')[0];

    document.getElementById('my-birthdate').value = formattedDate;
    document.getElementById('partner-birthdate').value = formattedDate;

    // 更新农历显示
    updateMyLunarDisplay();
    updatePartnerLunarDisplay();

    // 绑定事件监听器
    document.getElementById('my-birthdate').addEventListener('change', updateMyLunarDisplay);
    document.getElementById('partner-birthdate').addEventListener('change', updatePartnerLunarDisplay);
    document.getElementById('relationship-type').addEventListener('change', function() {
        relationshipType = this.value;
    });

    document.getElementById('start-match-btn').addEventListener('click', startFiveElementsMatch);
    document.getElementById('back-to-match-input').addEventListener('click', backToMatchInput);
}

// 更新我的农历显示
function updateMyLunarDisplay() {
    const birthdate = document.getElementById('my-birthdate').value;
    if (!birthdate) return;

    if (typeof Lunar === 'undefined') {
        document.getElementById('my-lunar-display').value = '库未加载';
        return;
    }

    try {
        const date = new Date(birthdate);
        if (typeof Lunar.fromDate !== 'function') {
            document.getElementById('my-lunar-display').value = '库方法错误';
            return;
        }
        const lunar = Lunar.fromDate(date);
        const lunarStr = lunar.toString();
        document.getElementById('my-lunar-display').value = lunarStr;
    } catch (e) {
        console.error('农历转换错误:', e);
        document.getElementById('my-lunar-display').value = '转换失败: ' + e.message;
    }
}

// 更新对方农历显示
function updatePartnerLunarDisplay() {
    const birthdate = document.getElementById('partner-birthdate').value;
    if (!birthdate) return;

    if (typeof Lunar === 'undefined') {
        document.getElementById('partner-lunar-display').value = '库未加载';
        return;
    }

    try {
        const date = new Date(birthdate);
        if (typeof Lunar.fromDate !== 'function') {
            document.getElementById('partner-lunar-display').value = '库方法错误';
            return;
        }
        const lunar = Lunar.fromDate(date);
        const lunarStr = lunar.toString();
        document.getElementById('partner-lunar-display').value = lunarStr;
    } catch (e) {
        console.error('农历转换错误:', e);
        document.getElementById('partner-lunar-display').value = '转换失败: ' + e.message;
    }
}

// 开始合盘配对
function startFiveElementsMatch() {
    const myBirthdate = document.getElementById('my-birthdate').value;
    const partnerBirthdate = document.getElementById('partner-birthdate').value;

    if (!myBirthdate || !partnerBirthdate) {
        alert('请填写双方出生日期');
        return;
    }

    // 检查库是否加载
    if (typeof Lunar === 'undefined') {
        alert('lunar.js 库未加载，请稍后再试');
        return;
    }

    try {
        // 检查库方法
        if (typeof Lunar.fromDate !== 'function') {
            alert('库方法错误，请尝试刷新页面');
            console.error('Lunar.fromDate 不是函数');
            return;
        }

        // 计算我的八字五行
        const myDate = new Date(myBirthdate);
        const myLunar = Lunar.fromDate(myDate);

        if (typeof myLunar.getBaZi !== 'function') {
            alert('八字计算方法不可用，库版本可能不兼容');
            console.error('myLunar.getBaZi 不是函数');
            return;
        }

        myBazi = myLunar.getBaZi();
        calculateFiveElementsForMatch(myBazi, 'my');

        // 计算对方八字五行
        const partnerDate = new Date(partnerBirthdate);
        const partnerLunar = Lunar.fromDate(partnerDate);

        if (typeof partnerLunar.getBaZi !== 'function') {
            alert('八字计算方法不可用，库版本可能不兼容');
            console.error('partnerLunar.getBaZi 不是函数');
            return;
        }

        partnerBazi = partnerLunar.getBaZi();
        calculateFiveElementsForMatch(partnerBazi, 'partner');

        // 计算配对结果
        const matchResult = calculateMatchResult();

        // 显示结果页
        showMatchResult(matchResult);

    } catch (e) {
        console.error('合盘计算错误:', e);
        alert('计算失败: ' + e.message);
    }
}

// 为匹配计算五行得分
function calculateFiveElementsForMatch(bazi, person) {
    const elements = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

    // 遍历八字中的每个字
    for (let pillar of bazi) {
        if (!pillar) continue;

        // 每个柱有两个字符
        for (let char of pillar) {
            // 检查天干
            if (heavenlyStems[char]) {
                elements[heavenlyStems[char]]++;
            }
            // 检查地支
            if (earthlyBranches[char]) {
                elements[earthlyBranches[char]]++;
            }
        }
    }

    // 计算总分并归一化到百分比
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    if (total > 0) {
        for (let key in elements) {
            elements[key] = Math.round((elements[key] / total) * 100);
        }
    }

    if (person === 'my') {
        myFiveElements = elements;
    } else {
        partnerFiveElements = elements;
    }
}

// 计算配对结果
function calculateMatchResult() {
    // 计算五行互补分数（0-50分）
    let complementScore = 0;

    // 1. 相生关系加分
    for (let element in myFiveElements) {
        const myScore = myFiveElements[element];
        const partnerScore = partnerFiveElements[element];

        // 如果一方某元素强，另一方生扶该元素的元素也强，加分
        if (myScore > 60) { // 我的某元素很强
            const generatingElement = getGeneratingElementFor(element); // 找到生扶该元素的元素
            if (partnerFiveElements[generatingElement] > 50) {
                complementScore += 8;
            }
        }

        if (partnerScore > 60) { // 对方的某元素很强
            const generatingElement = getGeneratingElementFor(element);
            if (myFiveElements[generatingElement] > 50) {
                complementScore += 8;
            }
        }
    }

    // 2. 相同五行加分（相似性）
    let similarityScore = 0;
    for (let element in myFiveElements) {
        const diff = Math.abs(myFiveElements[element] - partnerFiveElements[element]);
        similarityScore += Math.max(0, 20 - diff); // 差异越小，分数越高
    }
    similarityScore = Math.min(similarityScore / 5, 30); // 归一化到0-30分

    // 3. 基础分数
    const baseScore = 40;

    // 4. 根据关系类型调整
    let relationshipBonus = 0;
    switch (relationshipType) {
        case 'love':
            relationshipBonus = similarityScore * 0.7; // 恋爱关系重视相似性
            break;
        case 'friend':
            relationshipBonus = complementScore * 0.8; // 朋友关系重视互补性
            break;
        case 'colleague':
            relationshipBonus = (similarityScore + complementScore) * 0.5; // 同事关系平衡
            break;
        case 'family':
            relationshipBonus = baseScore * 0.3; // 家人关系基础分高
            break;
    }

    // 总分计算
    let totalScore = baseScore + complementScore + similarityScore + relationshipBonus;
    totalScore = Math.min(Math.max(Math.round(totalScore), 0), 100);

    // 生成结果文本
    const result = {
        score: totalScore,
        conclusion: generateConclusion(totalScore),
        fateDepth: generateFateDepth(totalScore, relationshipType),
        interactionMode: generateInteractionMode(),
        advantage: generateAdvantage(),
        caution: generateCaution()
    };

    return result;
}

// 获取生扶某元素的元素
function getGeneratingElementFor(element) {
    // 在generatingCycle中查找key，使得generatingCycle[key] === element
    for (let key in generatingCycle) {
        if (generatingCycle[key] === element) {
            return key;
        }
    }
    return element; // 如果找不到，返回自身
}

// 生成核心结论
function generateConclusion(score) {
    if (score >= 90) {
        return '天作之合！你们之间的五行能量高度互补，缘分深厚，是非常理想的配对。无论是在感情、友情还是合作上，都能相互促进，共同成长。';
    } else if (score >= 75) {
        return '良缘佳配！你们的五行搭配较为和谐，有很好的相处基础。只要双方用心经营，这段关系会非常稳定且富有成果。';
    } else if (score >= 60) {
        return '中平之配！你们的五行能量有一定互补性，但也存在一些差异。需要相互理解和包容，通过磨合可以建立稳固的关系。';
    } else if (score >= 40) {
        return '有待磨合！你们的五行特点差异较大，需要更多的沟通和调整。只要双方愿意努力，也可以建立有意义的关系。';
    } else {
        return '挑战较多！你们的五行能量冲突较多，相处中可能会遇到不少挑战。需要更多的耐心和智慧来经营这段关系。';
    }
}

// 生成缘分深浅
function generateFateDepth(score, relationshipType) {
    const relationshipNames = {
        'love': '恋爱',
        'friend': '朋友',
        'colleague': '同事',
        'family': '家人'
    };
    const relationName = relationshipNames[relationshipType] || '双方';

    if (score >= 80) {
        return `${relationName}缘分深厚，似有前缘。彼此吸引力强，容易产生共鸣，关系发展自然顺畅。`;
    } else if (score >= 60) {
        return `${relationName}缘分中等，需主动经营。有建立良好关系的基础，但需要双方共同努力加深连接。`;
    } else {
        return `${relationName}缘分尚浅，需耐心培养。初期可能感觉不太契合，但通过长期相处可以逐渐建立默契。`;
    }
}

// 生成相处模式
function generateInteractionMode() {
    // 分析五行主导元素
    const myDominant = getDominantElement(myFiveElements);
    const partnerDominant = getDominantElement(partnerFiveElements);

    const elementNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    const myElement = elementNames[myDominant];
    const partnerElement = elementNames[partnerDominant];

    // 根据五行相生相克判断相处模式
    if (generatingCycle[myDominant] === partnerDominant) {
        return `你（${myElement}）生对方（${partnerElement}），自然愿意付出和滋养对方。对方受到你的生扶，会感到被支持和关爱。`;
    } else if (generatingCycle[partnerDominant] === myDominant) {
        return `对方（${partnerElement}）生你（${myElement}），对方会主动关心和支持你。你受到对方的生扶，会感到温暖和受滋养。`;
    } else if (restrainingCycle[myDominant] === partnerDominant) {
        return `你（${myElement}）克对方（${partnerElement}），你可能在关系中占据主导地位。需要注意尊重对方的独立性，避免过于控制。`;
    } else if (restrainingCycle[partnerDominant] === myDominant) {
        return `对方（${partnerElement}）克你（${myElement}），对方可能对你有所约束。需要建立平等的沟通方式，保持自我边界。`;
    } else {
        return `你们都是${myElement}行人，性格特质相似，容易理解彼此。但也要注意避免过于相似导致的单调或冲突。`;
    }
}

// 生成合拍优势
function generateAdvantage() {
    const myDominant = getDominantElement(myFiveElements);
    const partnerDominant = getDominantElement(partnerFiveElements);

    // 检查是否有相生关系
    if (generatingCycle[myDominant] === partnerDominant) {
        return `五行相生（${getElementName(myDominant)}生${getElementName(partnerDominant)}），你能够滋养和支持对方，对方也能从你这里获得能量。这种互补关系有利于长期稳定。`;
    } else if (generatingCycle[partnerDominant] === myDominant) {
        return `五行相生（${getElementName(partnerDominant)}生${getElementName(myDominant)}），对方能够滋养和支持你，你能从对方那里获得能量。这种互相滋养的关系非常珍贵。`;
    }

    // 检查是否有共同强势元素
    const commonStrongElements = [];
    for (let element in myFiveElements) {
        if (myFiveElements[element] > 60 && partnerFiveElements[element] > 60) {
            commonStrongElements.push(getElementName(element));
        }
    }

    if (commonStrongElements.length > 0) {
        return `你们在${commonStrongElements.join('、')}元素上都很强势，有共同的特质和价值观。这为你们的沟通和理解奠定了良好基础。`;
    }

    return `你们的五行配置各有特色，能够互相补充对方的不足。这种差异性如果处理得当，可以成为关系的活力来源。`;
}

// 生成注意事项
function generateCaution() {
    const myDominant = getDominantElement(myFiveElements);
    const partnerDominant = getDominantElement(partnerFiveElements);

    // 检查相克关系
    if (restrainingCycle[myDominant] === partnerDominant) {
        return `你（${getElementName(myDominant)}）克对方（${getElementName(partnerDominant)}），需要注意避免过于强势或控制。给对方足够的空间和尊重，关系才能和谐。`;
    } else if (restrainingCycle[partnerDominant] === myDominant) {
        return `对方（${getElementName(partnerDominant)}）克你（${getElementName(myDominant)}），需要注意保持自我边界，不要过度妥协。平等沟通是关键。`;
    }

    // 检查是否有共同弱势元素
    const commonWeakElements = [];
    for (let element in myFiveElements) {
        if (myFiveElements[element] < 30 && partnerFiveElements[element] < 30) {
            commonWeakElements.push(getElementName(element));
        }
    }

    if (commonWeakElements.length > 0) {
        return `你们在${commonWeakElements.join('、')}元素上都偏弱，这方面可能成为关系的短板。可以共同加强这方面的能量，比如通过环境布置、生活习惯等。`;
    }

    return `由于五行配置的差异，你们在某些方面可能有不同的需求和表达方式。需要多沟通，增进理解，避免误解。`;
}

// 获取主导元素
function getDominantElement(elements) {
    let maxElement = 'metal';
    let maxScore = elements.metal;

    for (let element in elements) {
        if (elements[element] > maxScore) {
            maxScore = elements[element];
            maxElement = element;
        }
    }

    return maxElement;
}

// 获取元素名称
function getElementName(element) {
    const names = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    return names[element] || element;
}

// 显示匹配结果
function showMatchResult(result) {
    // 隐藏输入页，显示结果页
    document.getElementById('five-elements-match-input').classList.add('hidden');
    document.getElementById('five-elements-match-result').classList.remove('hidden');

    // 初始设置分数为0
    document.getElementById('match-score').textContent = '0';

    // 设置进度环
    const progressCircle = document.querySelector('.progress-ring-circle');
    const radius = 82;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (result.score / 100) * circumference;

    // 初始设置进度环为全空
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    // 更新文本内容
    document.getElementById('match-conclusion').textContent = result.conclusion;
    document.getElementById('fate-depth').textContent = result.fateDepth;
    document.getElementById('interaction-mode').textContent = result.interactionMode;
    document.getElementById('advantage').textContent = result.advantage;
    document.getElementById('caution').textContent = result.caution;

    // 开始动画序列
    setTimeout(() => {
        // 1. 分数动画（1.2秒）
        animateScore(result.score);

        // 2. 进度环动画（1.2秒）
        progressCircle.style.transition = 'stroke-dashoffset 1.2s ease-out';
        progressCircle.style.strokeDashoffset = offset;

        // 3. 四大板块入场动画（依次延迟0.2秒）
        animateMatchBlocks();
    }, 300);
}

// 动画显示分数
function animateScore(targetScore) {
    const scoreElement = document.getElementById('match-score');
    const duration = 1200; // 1.2秒
    const steps = 60;
    const stepTime = duration / steps;
    const increment = targetScore / steps;

    let currentScore = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        currentScore = Math.min(Math.round(increment * step), targetScore);
        scoreElement.textContent = currentScore;

        if (step >= steps) {
            clearInterval(timer);
            scoreElement.textContent = targetScore;
        }
    }, stepTime);
}

// 动画显示匹配区块
function animateMatchBlocks() {
    const blocks = document.querySelectorAll('.match-block');

    blocks.forEach((block, index) => {
        setTimeout(() => {
            block.classList.add('visible');
        }, index * 200 + 1200); // 在分数动画后开始，每个区块延迟0.2秒
    });
}

// 返回配对输入页
function backToMatchInput() {
    document.getElementById('five-elements-match-result').classList.add('hidden');
    document.getElementById('five-elements-match-input').classList.remove('hidden');

    // 重置区块动画状态
    const blocks = document.querySelectorAll('.match-block');
    blocks.forEach(block => {
        block.classList.remove('visible');
    });
}

