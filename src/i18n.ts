export type Lang = 'en' | 'zh';

const en = {
  play: 'Play',
  continue: 'Continue',
  add: 'Add',
  sub: 'Subtract',
  mixed: 'Mixed',
  seed: 'Seed',
  sprout: 'Sprout',
  bloom: 'Bloom',
  best: 'Best',
  level: 'Level',
  questions: 'Questions',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  close: 'Close',
  hint: 'Hint',
  check: 'Check',
  backspace: 'Delete',
  nice: 'Nice!',
  tryAgain: 'Try again',
  almost: 'Almost!',
  showMe: 'Show me',
  gotIt: 'Got it',
  next: 'Next',
  back: 'Back',
  time: 'Time',
  streak: 'Best streak',
  review: 'Review',
  newLevel: 'Next level',
  again: 'Again',
  home: 'Home',
  score: 'Score',
  perfect: 'Perfect!',
  great: 'Great job!',
  good: 'Good try!',
  tapBuds: 'Tap a bud to see how',
} as const;

export type StringKey = keyof typeof en;

const zh: Record<StringKey, string> = {
  play: '开始',
  continue: '继续',
  add: '加法',
  sub: '减法',
  mixed: '混合',
  seed: '种子',
  sprout: '小芽',
  bloom: '开花',
  best: '最好',
  level: '难度',
  questions: '题数',
  soundOn: '打开声音',
  soundOff: '关闭声音',
  close: '关闭',
  hint: '提示',
  check: '确认',
  backspace: '删除',
  nice: '太棒了',
  tryAgain: '再试一次',
  almost: '差一点',
  showMe: '教我',
  gotIt: '明白了',
  next: '继续',
  back: '上一步',
  time: '用时',
  streak: '连对',
  review: '复习',
  newLevel: '下一关',
  again: '再来',
  home: '首页',
  score: '得分',
  perfect: '全对！',
  great: '真棒！',
  good: '不错哦！',
  tapBuds: '点开花苞看解法',
};

const dictionaries: Record<Lang, Record<StringKey, string>> = { en, zh };

export function t(lang: Lang, key: StringKey): string {
  return dictionaries[lang][key] ?? en[key];
}

export function levelName(lang: Lang, level: 1 | 2 | 3): string {
  return t(lang, level === 1 ? 'seed' : level === 2 ? 'sprout' : 'bloom');
}
