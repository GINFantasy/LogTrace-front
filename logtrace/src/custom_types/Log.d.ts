type LogMode = "INLINE" | "RECORD" | "DETAIL";
type LOGType = "SYSTEM" | "";

/**
 * 参数类型
 */
export type Param = {
  key: string;
  value: string;
};

/**
 * 日志信息
 */
export type LogData = {
  level: string; // 方法入参记录
  site: string;
  content: string | null; // 内容
  paramList: Param[] | null; // 入参列表
} | null;

/**
 * 日志返回值格式
 */
export interface LogMessage {
  read: 0 | 1; // 是否已读
  createTime: string; // 产生时间
  level: string; // 级别
  thread: string; // 所在线程
  site: string; // 产生位置
  mode: LogMode; // 日志模式
  type: string; // 日志类别
  requestPath: string; // 请求路径
  className: string; // 请求父类
  methodName: string; // 请求方法
  paramList: Param[] | null; // 入参列表
  returnString: string; // 请求返回值
  logDataList: LogData[]; // 具体日志信息列表
  stackList: string[]; // 堆栈调用信息
}

export type BuiltinTheme = "vs" | "vs-dark" | "hc-black";
export interface CodeObj{
  className:string,
  code:string,
  line:number,
  method:string
}
export interface IStandaloneThemeData {
  base: BuiltinTheme;
  inherit: boolean;
  rules: ITokenThemeRule[];
  encodedTokensColors?: string[];
  colors: IColors;
}

export type IColors = {
  [colorId: string]: string;
};

export interface ITokenThemeRule {
  token: string;
  foreground?: string;
  background?: string;
  fontStyle?: string;
}

export interface IDisposable {
  dispose(): void;
}

export type Thenable<T> = PromiseLike<T>;
export type IShortMonarchLanguageAction = string;
export interface IExpandedMonarchLanguageAction {
  /**
   * array of actions for each parenthesized match group
   */
  group?: IMonarchLanguageAction[];
  /**
   * map from string to ILanguageAction
   */
  cases?: Object;
  /**
   * token class (ie. css class) (or "@brackets" or "@rematch")
   */
  token?: string;
  /**
   * the next state to push, or "@push", "@pop", "@popall"
   */
  next?: string;
  /**
   * switch to this state
   */
  switchTo?: string;
  /**
   * go back n characters in the stream
   */
  goBack?: number;
  /**
   * @open or @close
   */
  bracket?: string;
  /**
   * switch to embedded language (using the mimetype) or get out using "@pop"
   */
  nextEmbedded?: string;
  /**
   * log a message to the browser console window
   */
  log?: string;
}
export type IMonarchLanguageAction =
  | IShortMonarchLanguageAction
  | IExpandedMonarchLanguageAction
  | IShortMonarchLanguageAction[]
  | IExpandedMonarchLanguageAction[];
export type IShortMonarchLanguageRule1 = [
  string | RegExp,
  IMonarchLanguageAction
];

export type IShortMonarchLanguageRule2 = [
  string | RegExp,
  IMonarchLanguageAction,
  string
];
export interface IExpandedMonarchLanguageRule {
  /**
   * match tokens
   */
  regex?: string | RegExp;
  /**
   * action to take on match
   */
  action?: IMonarchLanguageAction;
  /**
   * or an include rule. include all rules from the included state
   */
  include?: string;
}

export type IMonarchLanguageRule =
  | IShortMonarchLanguageRule1
  | IShortMonarchLanguageRule2
  | IExpandedMonarchLanguageRule;
/**
 * This interface can be shortened as an array, ie. ['{','}','delimiter.curly']
 */
export interface IMonarchLanguageBracket {
  /**
   * open bracket
   */
  open: string;
  /**
   * closing bracket
   */
  close: string;
  /**
   * token class
   */
  token: string;
}
export interface IMonarchLanguage {
  /**
   * map from string to ILanguageRule[]
   */
  tokenizer: {
    [name: string]: IMonarchLanguageRule[];
  };
  /**
   * is the language case insensitive?
   */
  ignoreCase?: boolean;
  /**
   * is the language unicode-aware? (i.e., /\u{1D306}/)
   */
  unicode?: boolean;
  /**
   * if no match in the tokenizer assign this token class (default 'source')
   */
  defaultToken?: string;
  /**
   * for example [['{','}','delimiter.curly']]
   */
  brackets?: IMonarchLanguageBracket[];
  /**
   * start symbol in the tokenizer (by default the first entry is used)
   */
  start?: string;
  /**
   * attach this to every token class (by default '.' + name)
   */
  tokenPostfix?: string;
  /**
   * include line feeds (in the form of a \n character) at the end of lines
   * Defaults to false
   */
  includeLF?: boolean;
  /**
   * Other keys that can be referred to by the tokenizer.
   */
  [key: string]: any;
}
