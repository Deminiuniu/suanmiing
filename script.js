// 全局变量
let currentBazi = null;
let currentFiveElements = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
let currentDayElement = null;
let currentBodyStrength = null; // 身强身弱状态
let lunarLoading = false; // 防止重复加载
let fortunesData = null; // 签诗数据
let fortunesLoaded = false; // 数据是否已加载

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
    fetch('./fortunes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            fortunesData = data;
            fortunesLoaded = true;
            console.log('签诗数据加载成功', data);
            // 可以在这里启用摇签按钮或其他UI
            const shakeBtn = document.getElementById('shake-btn');
            if (shakeBtn) {
                shakeBtn.disabled = false;
                shakeBtn.innerHTML = '<i class="fas fa-hand-point-up mr-3"></i>点击摇签';
            }
        })
        .catch(error => {
            console.error('加载签诗数据失败:', error);
            // 使用默认数据或显示错误
            alert('签诗数据加载失败，部分功能可能受限。请检查 fortunes.json 文件是否存在。');
            // 设置默认空数据以避免后续错误
            fortunesData = {
                fortuneDict: {},
                lotteryResults: [],
                fortuneSentences: []
            };
            fortunesLoaded = true;
            // 仍然启用摇签按钮，但功能受限
            const shakeBtn = document.getElementById('shake-btn');
            if (shakeBtn) {
                shakeBtn.disabled = false;
                shakeBtn.innerHTML = '<i class="fas fa-hand-point-up mr-3"></i>点击摇签';
            }
        });
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

        // 显示结果区域
        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('results-section').classList.add('fade-in');

        // 滚动到结果区域
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });

    } catch (e) {
        console.error('八字计算错误:', e);
        alert('计算失败: ' + e.message + '\n请检查控制台获取详细信息');
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

// 折叠板块交互
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('collapse-toggle');
    const content = document.getElementById('collapse-content');
    const icon = document.getElementById('collapse-icon');
    if (toggle && content && icon) {
        toggle.addEventListener('click', function() {
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-90');
        });
    }
});