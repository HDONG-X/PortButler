import type { KeyEvent, ScrollBoxRenderable, TextareaRenderable } from "@opentui/core";
import { render, useKeyboard, useRenderer } from "@opentui/solid";
import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { Effect } from "effect";
import { hostname, networkInterfaces } from "node:os";
import { defaultProtectedPorts, readConfig, writeConfig } from "@port-butler/config";
import {
  createCleanPlan,
  createKillPlan,
  executeCleanPlan,
  executeKillPlan,
  explainPort,
  listExplainedPorts,
  PORT_BUTLER_VERSION,
  runDoctor,
  type CleanPlan,
  type ExplainedPort,
  type KillPlan,
  type KillResult,
} from "@port-butler/core";
import { openLocalhost } from "@port-butler/platform";
import { tuiTheme } from "@port-butler/theme";

/**
 * TUI 启动选项。
 */
export interface StartTuiOptions {
  /** 可选配置路径，用于测试或隔离用户配置。 */
  configPath?: string;
}

type Language = "zh" | "en";

type TextSegment = {
  text: string;
  color?: string;
};

type OutputLine = string | TextSegment[];

type WorkspaceEntry = {
  id: number;
  input: string;
  thinking: string;
  output: OutputLine[];
  mode: "plan" | "build";
  seconds: string;
  accent: string;
  /** 是否仍在执行中。工作区会先展示命令卡片，再用该字段渲染加载状态。 */
  loading: boolean;
  /** 可本地重绘的结构化结果，用于切换语言时刷新旧输出且不重复执行命令。 */
  replay?: ReplayOutput;
};

type DoctorCheck = { name: string; ok: boolean; message: string };

type ReplayOutput =
  | { type: "help" }
  | { type: "ports"; ports: ExplainedPort[] }
  | { type: "why"; port: number; explained: ExplainedPort | null }
  | { type: "clean"; plan: CleanPlan; results?: KillResult[] }
  | { type: "protected"; ports: number[]; changedPort: number; action: "protect" | "unprotect" }
  | { type: "kill"; plan: KillPlan; results?: KillResult[] }
  | { type: "open"; url: string }
  | { type: "doctor"; checks: DoctorCheck[] }
  | { type: "ip"; addresses: LocalAddress[] }
  | { type: "unknown"; commandLine: string };

const PANEL = "#171717";
const PANEL_LIGHT = "#1f1f1f";
const BACKGROUND = "#080808";
const DIM = "#858585";
const TEXT = "#e6e6e6";
const ORANGE = "#f5a524";
const BLUE = "#60a5fa";

const promptSubmitKeyBindings = [
  { name: "return", action: "submit" as const },
  { name: "linefeed", action: "submit" as const },
];

const logo5x5: Record<string, string[]> = {
  P: ["████ ", "█   █", "████ ", "█    ", "█    "],
  O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
  T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
  B: ["████ ", "█   █", "████ ", "█   █", "████ "],
  U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
  L: ["█    ", "█    ", "█    ", "█    ", "█████"],
  E: ["█████", "█    ", "████ ", "█    ", "█████"],
};

const copy = {
  zh: {
    placeholderHome: '输入 slash 命令... "/ls"',
    placeholderWork: '输入 slash 命令... "/why 3000"',
    tab: "Tab 补齐",
    languageKey: "Ctrl+L English",
    palette: "/help 命令",
    tipPrefix: "提示",
    tip: "命令前加 /，例如 /ls 扫描端口，/doctor 检查系统",
    statusTitle: "问候",
    statusLine: "输入命令开始管理本地端口",
    context: "上下文",
    ports: "端口",
    detected: "个监听端口",
    gettingStarted: "◇ 入门",
    card1: "Port Butler 会保护关键端口，",
    card2: "并且所有 kill 都会先生成计划。",
    card3: "可以试试 ls、why 3000、",
    card4: "clean --dry-run、doctor。",
    scanPorts: "扫描端口",
    slashHint: "命令前加 /",
    autocompleteNone: "没有匹配的命令",
    autocompleteMany: "可补齐命令",
    cmdLs: "扫描端口",
    cmdWhy: "解释端口",
    cmdKill: "生成 kill 计划",
    cmdProtect: "保护端口",
    cmdUnprotect: "取消保护",
    cmdClean: "清理预览",
    cmdOpen: "打开浏览器",
    cmdDoctor: "系统检查",
    cmdIp: "本机 IP",
    cmdHelp: "查看命令",
    thinkingLabel: "思考：",
    modePlan: "计划",
    modeBuild: "执行",
    loading: "正在查询端口信息...",
    overview: "端口概览",
    commandState: "当前状态",
    protectedPorts: "默认保护",
    quickCommands: "快捷命令",
    protectedCount: "保护列表",
    riskyCount: "高风险",
    devCount: "开发服务",
    infraCount: "基础设施",
    languageStatus: "已切换到中文",
  },
  en: {
    placeholderHome: 'Type a slash command... "/ls"',
    placeholderWork: 'Type a slash command... "/why 3000"',
    tab: "Tab complete",
    languageKey: "Ctrl+L 中文",
    palette: "/help commands",
    tipPrefix: "Tip",
    tip: "Prefix commands with /, for example /ls or /doctor",
    statusTitle: "Greeting",
    statusLine: "Type a command to manage local ports",
    context: "Context",
    ports: "Ports",
    detected: "listeners detected",
    gettingStarted: "◇ Getting started",
    card1: "Port Butler protects critical ports",
    card2: "and plans every kill before it runs.",
    card3: "Try commands like ls, why 3000,",
    card4: "clean --dry-run, doctor.",
    scanPorts: "Scan ports",
    slashHint: "prefix with /",
    autocompleteNone: "No matching command",
    autocompleteMany: "Matching commands",
    cmdLs: "scan ports",
    cmdWhy: "explain port",
    cmdKill: "create kill plan",
    cmdProtect: "protect port",
    cmdUnprotect: "unprotect port",
    cmdClean: "clean preview",
    cmdOpen: "open browser",
    cmdDoctor: "system check",
    cmdIp: "local IP",
    cmdHelp: "show commands",
    thinkingLabel: "Thinking:",
    modePlan: "Plan",
    modeBuild: "Build",
    loading: "Loading port information...",
    overview: "Port Overview",
    commandState: "Current State",
    protectedPorts: "Protected",
    quickCommands: "Quick Commands",
    protectedCount: "protected list",
    riskyCount: "high risk",
    devCount: "dev servers",
    infraCount: "infrastructure",
    languageStatus: "Switched to English",
  },
} as const;

const loadingFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const slashCommands = [
  "ls",
  "why",
  "kill",
  "protect",
  "unprotect",
  "clean",
  "open",
  "doctor",
  "ip",
  "help",
];
const BORDER = "#555555";
const HEADER = "#f2f2f2";
const LOW = "#34d399";
const MEDIUM = "#f5a524";
const HIGH = "#fb7185";
const BLOCKED = "#ef4444";

/**
 * Port Butler 的 Solid TUI 根组件。默认是中文初始化页，输入命令后进入工作区。
 */
export function App(props: StartTuiOptions) {
  const renderer = useRenderer();
  const [language, setLanguage] = createSignal<Language>("zh");
  const [screen, setScreen] = createSignal<"home" | "workspace">("home");
  const [prompt, setPrompt] = createSignal("");
  const [entries, setEntries] = createSignal<WorkspaceEntry[]>([]);
  const [ports, setPorts] = createSignal<ExplainedPort[]>([]);
  const [protectedPorts, setProtectedPorts] = createSignal<number[]>(defaultProtectedPorts);
  const [statusTitle, setStatusTitle] = createSignal<string>(copy.zh.statusTitle);
  const [statusLine, setStatusLine] = createSignal<string>(copy.zh.statusLine);
  const [busy, setBusy] = createSignal(false);
  const [loadingFrame, setLoadingFrame] = createSignal(0);
  const [history, setHistory] = createSignal<string[]>([]);
  const [historyIndex, setHistoryIndex] = createSignal<number | null>(null);
  const [historyDraft, setHistoryDraft] = createSignal("");
  let promptInput: TextareaRenderable | undefined;
  let lastLanguageToggleAt = 0;

  const loadingTimer = setInterval(() => setLoadingFrame((frame) => frame + 1), 90);
  onCleanup(() => clearInterval(loadingTimer));

  const text = () => copy[language()];

  const toggleLanguage = () => {
    const now = performance.now();
    if (now - lastLanguageToggleAt < 120) return;
    lastLanguageToggleAt = now;
    const next = language() === "zh" ? "en" : "zh";
    setLanguage(next);
    setStatusTitle(copy[next].statusTitle);
    setStatusLine(copy[next].languageStatus);
    setEntries((items) =>
      items.map((item) => {
        if (!item.replay || item.loading) return item;
        const rendered = renderReplay(item.replay, next);
        return {
          ...item,
          thinking: rendered.thinking,
          output: rendered.output,
          mode: rendered.mode,
        };
      }),
    );
  };

  const isEnterKey = (key: KeyEvent) =>
    key.name === "return" ||
    key.name === "enter" ||
    key.name === "linefeed" ||
    key.raw === "\r" ||
    key.raw === "\n";

  const isHistoryPreviousKey = (key: KeyEvent) =>
    key.name === "up" || key.name === "uparrow" || key.raw === "\u001b[A";

  const isHistoryNextKey = (key: KeyEvent) =>
    key.name === "down" || key.name === "downarrow" || key.raw === "\u001b[B";

  useKeyboard((key) => {
    if (key.name === "escape" || (key.ctrl && key.name === "c")) {
      renderer.destroy();
      return;
    }
    if (isEnterKey(key)) {
      key.preventDefault();
      key.stopPropagation();
      submitFromPrompt();
      return;
    }
  });

  const bindPromptInput = (input: TextareaRenderable) => {
    promptInput = input;
    promptInput.focus();
    if (promptInput.plainText !== prompt()) setPromptInputText(prompt());
  };

  const syncPromptFromInput = () => {
    const value = promptInput?.plainText ?? "";
    setPrompt(value);
    const index = historyIndex();
    if (index !== null && value !== history()[index]) {
      setHistoryIndex(null);
      setHistoryDraft(value);
    }
  };

  const handlePromptKeyDown = (key: KeyEvent) => {
    if ((key.ctrl && key.name === "l") || key.raw === "\f") {
      key.preventDefault();
      key.stopPropagation();
      toggleLanguage();
      return;
    }

    if (key.name === "tab") {
      key.preventDefault();
      key.stopPropagation();
      completePrompt();
      return;
    }

    if (isHistoryPreviousKey(key)) {
      key.preventDefault();
      key.stopPropagation();
      moveHistory(-1);
      return;
    }

    if (isHistoryNextKey(key)) {
      key.preventDefault();
      key.stopPropagation();
      moveHistory(1);
      return;
    }

    /**
     * OpenTUI 的 textarea 默认把 Enter 解释为换行；opencode 通过全局 keymap
     * 把 input.submit 重新绑定到 Enter。Port Butler 没有引入那套 keymap，
     * 所以这里在已验证可用的 textarea onKeyDown 通道里直接拦截 Enter。
     */
    if (isEnterKey(key)) {
      key.preventDefault();
      key.stopPropagation();
      submitFromPrompt();
    }
  };

  const completePrompt = () => {
    const value = promptInput?.plainText ?? prompt();
    const result = completeSlashCommand(value, language());
    setPromptInputText(result.value);
    setPrompt(result.value);
    setStatusLine(result.status);
  };

  const moveHistory = (direction: -1 | 1) => {
    const items = history();
    if (items.length === 0) return;
    const current = historyIndex();
    if (current === null) setHistoryDraft(promptInput?.plainText ?? prompt());
    const next =
      current === null
        ? direction === -1
          ? items.length - 1
          : 0
        : Math.max(0, Math.min(items.length - 1, current + direction));

    if (current !== null && direction === 1 && current === items.length - 1) {
      setHistoryIndex(null);
      setPromptInputText(historyDraft());
      setPrompt(historyDraft());
      setStatusLine(language() === "zh" ? "已回到当前输入" : "Returned to current input");
      return;
    }

    setHistoryIndex(next);
    setPromptInputText(items[next] ?? "");
    setPrompt(items[next] ?? "");
    setStatusLine(
      language() === "zh"
        ? `历史命令 ${next + 1}/${items.length}`
        : `History ${next + 1}/${items.length}`,
    );
  };

  const submitFromPrompt = () => {
    setTimeout(() => {
      setTimeout(() => {
        const value = promptInput?.plainText ?? prompt();
        setPrompt(value);
        void submit(value);
      }, 0);
    }, 0);
  };

  const submit = async (raw: string) => {
    const command = raw.trim();
    if (!command || busy()) return;
    setHistory((items) => (items.at(-1) === command ? items : [...items, command]));
    setHistoryIndex(null);
    setHistoryDraft("");
    setBusy(true);
    setPrompt("");
    setPromptInputText("");
    setScreen("workspace");
    const started = performance.now();
    const pendingId = Date.now() + entries().length;
    const accent = entries().length % 2 === 0 ? BLUE : ORANGE;
    appendEntry({
      id: pendingId,
      input: command,
      thinking:
        language() === "zh"
          ? "命令已收到，正在执行并准备结果。"
          : "Command received; running and preparing the result.",
      output: [],
      mode: "build",
      seconds: "0.0s",
      accent,
      loading: true,
    });
    setStatusLine(language() === "zh" ? "正在执行命令..." : "Running command...");
    try {
      const result = await runTuiCommand(command, props.configPath, language());
      setPorts(result.ports ?? ports());
      setProtectedPorts(result.protectedPorts ?? protectedPorts());
      setStatusTitle(result.title);
      setStatusLine(result.status);
      updateEntry(pendingId, {
        thinking: result.thinking,
        output: result.output,
        mode: result.mode,
        replay: result.replay,
        seconds: `${Math.max(0.1, (performance.now() - started) / 1000).toFixed(1)}s`,
        loading: false,
      });
    } catch (error) {
      updateEntry(pendingId, {
        thinking:
          language() === "zh"
            ? "命令执行失败。我会把原因和下一步建议展示出来。"
            : "The command failed. I will show the reason and next step.",
        output: [error instanceof Error ? error.message : String(error)],
        mode: "plan",
        seconds: `${Math.max(0.1, (performance.now() - started) / 1000).toFixed(1)}s`,
        loading: false,
      });
      setStatusTitle(language() === "zh" ? "错误" : "Error");
      setStatusLine(language() === "zh" ? "命令失败，请检查输出" : "Command failed");
    } finally {
      setBusy(false);
    }
  };

  const appendEntry = (entry: WorkspaceEntry) => {
    setEntries((items) => [...items, entry]);
  };

  const updateEntry = (
    id: number,
    patch: Partial<Omit<WorkspaceEntry, "id" | "input" | "accent">>,
  ) => {
    setEntries((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  /**
   * 设置输入框文本后，把光标放到文本末尾。OpenTUI textarea 的 setText 会重置光标，
   * 因此 Tab 补齐后必须同步 cursorOffset，否则继续输入会插到最前面。
   */
  const setPromptInputText = (value: string) => {
    if (!promptInput) return;
    promptInput.setText(value);
    promptInput.cursorOffset = displayWidth(value);
    promptInput.focus();
  };

  return (
    <Show
      when={screen() === "home"}
      fallback={
        <WorkspaceScreen
          prompt={prompt()}
          bindInput={bindPromptInput}
          onInput={syncPromptFromInput}
          onKeyDown={handlePromptKeyDown}
          onSubmit={submitFromPrompt}
          entries={entries()}
          statusLine={statusLine()}
          ports={ports()}
          protectedPorts={protectedPorts()}
          loadingFrame={loadingFrame()}
          busy={busy()}
          text={text()}
        />
      }
    >
      <HomeScreen
        prompt={prompt()}
        bindInput={bindPromptInput}
        onInput={syncPromptFromInput}
        onKeyDown={handlePromptKeyDown}
        onSubmit={submitFromPrompt}
        text={text()}
      />
    </Show>
  );
}

function HomeScreen(props: {
  prompt: string;
  bindInput: (input: TextareaRenderable) => void;
  onInput: () => void;
  onKeyDown: (key: KeyEvent) => void;
  onSubmit: () => void;
  text: (typeof copy)[Language];
}) {
  return (
    <box width="100%" height="100%" backgroundColor={BACKGROUND} flexDirection="column">
      <box flexGrow={1} />
      <box alignItems="center" flexDirection="column" width="100%">
        <OpencodeStyleLogo />
        <PromptPanel
          value={props.prompt}
          bindInput={props.bindInput}
          onInput={props.onInput}
          onKeyDown={props.onKeyDown}
          onSubmit={props.onSubmit}
          placeholder={props.text.placeholderHome}
          width={84}
          accent={ORANGE}
          text={props.text}
        />
        <box width={84} flexDirection="row" justifyContent="flex-end" marginTop={1}>
          <text fg={TEXT}>{props.text.tab}</text>
          <text fg={DIM}> </text>
          <text fg={TEXT}>{props.text.languageKey}</text>
          <text fg={DIM}> </text>
          <text fg={TEXT}>{props.text.palette}</text>
        </box>
        <box marginTop={4} flexDirection="row">
          <text fg={ORANGE}>● {props.text.tipPrefix} </text>
          <text fg={DIM}>{props.text.tip}</text>
        </box>
      </box>
      <box flexGrow={1} />
      <box width="100%" paddingX={1} flexDirection="row" justifyContent="space-between">
        <text fg={DIM}>~</text>
        <text fg={DIM}>{PORT_BUTLER_VERSION}</text>
      </box>
    </box>
  );
}

function WorkspaceScreen(props: {
  prompt: string;
  bindInput: (input: TextareaRenderable) => void;
  onInput: () => void;
  onKeyDown: (key: KeyEvent) => void;
  onSubmit: () => void;
  entries: WorkspaceEntry[];
  statusLine: string;
  ports: ExplainedPort[];
  protectedPorts: number[];
  loadingFrame: number;
  busy: boolean;
  text: (typeof copy)[Language];
}) {
  let scroll: ScrollBoxRenderable | undefined;

  createEffect(() => {
    props.entries.length;
    setTimeout(() => {
      if (!scroll || scroll.isDestroyed) return;
      scroll.scrollTo(scroll.scrollHeight);
    }, 0);
  });

  return (
    <box width="100%" height="100%" backgroundColor={BACKGROUND} flexDirection="row">
      <box
        flexGrow={1}
        minHeight={0}
        paddingLeft={1}
        paddingRight={1}
        paddingTop={1}
        flexDirection="column"
      >
        <scrollbox
          ref={(r) => (scroll = r)}
          viewportOptions={{ paddingRight: 1 }}
          verticalScrollbarOptions={{
            paddingLeft: 1,
            visible: true,
            trackOptions: {
              backgroundColor: "#111111",
              foregroundColor: "#303030",
            },
          }}
          stickyScroll={true}
          stickyStart="bottom"
          flexGrow={1}
          minHeight={0}
        >
          <For each={props.entries}>
            {(entry) => (
              <TranscriptEntry entry={entry} text={props.text} loadingFrame={props.loadingFrame} />
            )}
          </For>
        </scrollbox>
        <PromptPanel
          value={props.prompt}
          bindInput={props.bindInput}
          onInput={props.onInput}
          onKeyDown={props.onKeyDown}
          onSubmit={props.onSubmit}
          placeholder={props.text.placeholderWork}
          width="100%"
          accent={ORANGE}
          text={props.text}
        />
        <box
          width="100%"
          flexDirection="row"
          justifyContent="flex-end"
          marginTop={1}
          marginBottom={1}
        >
          <box flexDirection="row" alignItems="center">
            <text fg={TEXT}>{props.text.commandState}</text>
            <text fg={DIM}> · </text>
            <text fg={props.busy ? ORANGE : tuiTheme.safe}>
              {props.busy ? loadingFrames[props.loadingFrame % loadingFrames.length] : "●"}
            </text>
            <text fg={DIM}>{props.busy ? ` ${props.text.loading}` : ` ${props.statusLine}`}</text>
          </box>
          <box flexGrow={1} />
          <box flexDirection="row" alignItems="center">
            <text fg={TEXT}>{props.text.tab}</text>
            <text fg={DIM}> </text>
            <text fg={TEXT}>{props.text.languageKey}</text>
            <text fg={DIM}> </text>
            <text fg={TEXT}>{props.text.palette}</text>
          </box>
        </box>
      </box>
      <InfoRail
        ports={props.ports}
        protectedPorts={props.protectedPorts}
        statusLine={props.statusLine}
        busy={props.busy}
        loadingFrame={props.loadingFrame}
        text={props.text}
      />
    </box>
  );
}

/**
 * 使用与 opencode logo 相同的上下半块像素风格绘制 Port Butler 标识。
 * 字母源仍是 5x5 点阵，但渲染时把上下两行合成一个终端半块字符，
 * 因此视觉上更接近 opencode 的粗像素 logo，也能避免普通 ASCII 字体过小。
 */
function OpencodeStyleLogo() {
  const letters = "PORTBUTLER".split("");
  const rows = [0, 2, 4];

  return (
    <box flexDirection="column" marginBottom={1}>
      <For each={rows}>
        {(rowStart) => (
          <box flexDirection="row">
            <For each={letters}>
              {(letter, index) => (
                <box flexDirection="row">
                  <text fg={logoColor(index())}>
                    {halfBlockLogoRow(logo5x5[letter] ?? [], rowStart)}
                  </text>
                  <text fg={BACKGROUND}> </text>
                </box>
              )}
            </For>
          </box>
        )}
      </For>
    </box>
  );
}

function halfBlockLogoRow(letterRows: string[], rowStart: number): string {
  const top = letterRows[rowStart] ?? "     ";
  const bottom = letterRows[rowStart + 1] ?? "     ";
  return [...top].map((char, index) => halfBlockCell(char !== " ", bottom[index] !== " ")).join("");
}

function halfBlockCell(top: boolean, bottom: boolean): string {
  if (top && bottom) return "█";
  if (top) return "▀";
  if (bottom) return "▄";
  return " ";
}

function logoColor(index: number): string {
  if (index < 4) return "#6f6f6f";
  if (index < 7) return "#8a8a8a";
  return "#f2f2f2";
}

function PromptPanel(props: {
  value: string;
  bindInput: (input: TextareaRenderable) => void;
  onInput: () => void;
  onKeyDown: (key: KeyEvent) => void;
  onSubmit: () => void;
  placeholder: string;
  width: number | `${number}%`;
  accent: string;
  text: (typeof copy)[Language];
}) {
  return (
    <box width={props.width} height={5} backgroundColor={PANEL_LIGHT} flexDirection="row">
      <ThinAccentRail color={props.accent} rows={5} />
      <box flexGrow={1} paddingLeft={1} paddingTop={1} flexDirection="column">
        <textarea
          ref={props.bindInput}
          initialValue={props.value}
          placeholder={props.placeholder}
          placeholderColor={DIM}
          textColor={TEXT}
          focusedTextColor={TEXT}
          backgroundColor={PANEL_LIGHT}
          focusedBackgroundColor={PANEL_LIGHT}
          cursorColor={TEXT}
          minHeight={1}
          maxHeight={1}
          wrapMode="none"
          keyBindings={promptSubmitKeyBindings}
          focused
          onContentChange={props.onInput}
          onKeyDown={props.onKeyDown}
          onSubmit={props.onSubmit}
        />
        <box marginTop={1} flexDirection="row">
          <text fg={ORANGE}>{props.text.modePlan}</text>
          <text fg={DIM}> · </text>
          <text fg={TEXT}>/ls</text>
          <text fg={DIM}> /why 3000 /clean --dry-run </text>
          <text fg={DIM}>{props.text.slashHint}</text>
        </box>
      </box>
    </box>
  );
}

function TranscriptEntry(props: {
  entry: WorkspaceEntry;
  text: (typeof copy)[Language];
  loadingFrame: number;
}) {
  return (
    <box flexDirection="column" marginBottom={1}>
      <box width="100%" minHeight={3} backgroundColor={PANEL} flexDirection="row">
        <ThinAccentRail color={props.entry.accent} rows={3} />
        <box paddingLeft={1} justifyContent="center">
          <text fg={TEXT}>{props.entry.input}</text>
        </box>
      </box>
      <box marginTop={1} marginBottom={1} flexDirection="row">
        <text fg="#303030">▏ </text>
        <text fg="#9a7a36">{props.text.thinkingLabel} </text>
        <text fg={DIM}>{props.entry.thinking}</text>
      </box>
      <Show
        when={props.entry.loading}
        fallback={<For each={props.entry.output}>{(line) => <OutputLineView line={line} />}</For>}
      >
        <box flexDirection="row">
          <text fg={props.entry.accent}>
            {loadingFrames[props.loadingFrame % loadingFrames.length]}{" "}
          </text>
          <text fg={DIM}>{props.text.loading}</text>
        </box>
      </Show>
      <box marginTop={1} marginBottom={1} flexDirection="row">
        <text fg={props.entry.accent}>▣ </text>
        <text fg={TEXT}>
          {props.entry.mode === "plan" ? props.text.modePlan : props.text.modeBuild}
        </text>
        <text fg={DIM}>{` · Port Butler · ${props.entry.seconds}`}</text>
      </box>
    </box>
  );
}

function OutputLineView(props: { line: OutputLine }) {
  return (
    <Show when={Array.isArray(props.line)} fallback={<text fg={TEXT}>{props.line as string}</text>}>
      <box flexDirection="row">
        <For each={props.line as TextSegment[]}>
          {(segment) => <text fg={segment.color ?? TEXT}>{segment.text}</text>}
        </For>
      </box>
    </Show>
  );
}

/**
 * 渲染较细的左侧强调线。OpenTUI 的背景色块最小宽度是一个终端单元，
 * 这里改用窄竖线字形，在不破坏布局对齐的前提下降低视觉宽度。
 */
function ThinAccentRail(props: { color: string; rows: number }) {
  return (
    <box flexDirection="column" width={1}>
      <For each={Array.from({ length: props.rows })}>{() => <text fg={props.color}>▎</text>}</For>
    </box>
  );
}

function InfoRail(props: {
  ports: ExplainedPort[];
  protectedPorts: number[];
  statusLine: string;
  busy: boolean;
  loadingFrame: number;
  text: (typeof copy)[Language];
}) {
  const protectedCount = () => props.protectedPorts.length;
  const riskyCount = () =>
    props.ports.filter((port) => port.risk === "high" || port.risk === "blocked").length;
  const devCount = () => props.ports.filter((port) => port.detection.isDevServer).length;
  const infraCount = () => props.ports.filter((port) => port.detection.isInfrastructure).length;

  return (
    <box width={42} height="100%" padding={1} flexDirection="column">
      {/* <box flexDirection="column">
        <text fg={TEXT}>{props.text.overview}</text>
        <text fg={DIM}> </text>
        <text fg={DIM}>{props.statusLine}</text>
      </box> */}

      <box marginTop={0} backgroundColor={PANEL_LIGHT} padding={1} flexDirection="column">
        <text fg={TEXT}>{props.text.ports}</text>
        <MetricLine label={props.text.detected} value={props.ports.length} />
        <MetricLine label={props.text.protectedCount} value={protectedCount()} />
        <MetricLine label={props.text.riskyCount} value={riskyCount()} />
        <MetricLine label={props.text.devCount} value={devCount()} />
        <MetricLine label={props.text.infraCount} value={infraCount()} />
      </box>

      <box marginTop={1} backgroundColor={PANEL_LIGHT} padding={1} flexDirection="column">
        <text fg={TEXT}>{props.text.protectedPorts}</text>
        <text fg={DIM}> </text>
        <text fg={DIM}>22 80 443 5432 6379 3306 27017</text>
      </box>

      <box flexGrow={1} />

      <box backgroundColor={PANEL_LIGHT} padding={1} flexDirection="column">
        <text fg={TEXT}>{props.text.quickCommands}</text>
        <CommandHint command="/ls" detail={props.text.scanPorts} />
        <CommandHint command="/why 3000" detail={props.text.cmdWhy} />
        <CommandHint command="/kill 3000" detail={props.text.cmdKill} />
        <CommandHint command="/protect 3000" detail={props.text.cmdProtect} />
        <CommandHint command="/unprotect 3000" detail={props.text.cmdUnprotect} />
        <CommandHint command="/clean --dry-run" detail={props.text.cmdClean} />
        <CommandHint command="/open 3000" detail={props.text.cmdOpen} />
        <CommandHint command="/doctor" detail={props.text.cmdDoctor} />
        <CommandHint command="/ip" detail={props.text.cmdIp} />
        <CommandHint command="/help" detail={props.text.cmdHelp} />
      </box>

      <box marginTop={1} flexDirection="column">
        {/* <text fg={TEXT}>/~</text> */}
        <text fg={tuiTheme.safe}>• Port Butler {PORT_BUTLER_VERSION}</text>
      </box>
    </box>
  );
}

function MetricLine(props: { label: string; value: number }) {
  return (
    <box marginTop={1} flexDirection="row" justifyContent="space-between" width="100%">
      <text fg={DIM}>{props.label}</text>
      <text fg={TEXT}>{String(props.value)}</text>
    </box>
  );
}

function CommandHint(props: { command: string; detail: string }) {
  return (
    <box marginTop={1} flexDirection="row" justifyContent="space-between" width="100%">
      <text fg={TEXT}>{props.command}</text>
      <text fg={DIM}>{props.detail}</text>
    </box>
  );
}

async function runTuiCommand(
  commandLine: string,
  configPath: string | undefined,
  language: Language,
): Promise<{
  title: string;
  status: string;
  thinking: string;
  output: OutputLine[];
  mode: "plan" | "build";
  ports?: ExplainedPort[];
  protectedPorts?: number[];
  replay?: ReplayOutput;
}> {
  const zh = language === "zh";
  const parts = commandLine.split(/\s+/).filter(Boolean);
  let command = normalizeCommandToken(parts[0]) ?? "help";
  let args = parts.slice(1);
  if (command === "pbt") {
    command = normalizeCommandToken(args[0]) ?? "ls";
    args = args.slice(1);
  }
  const config = await Effect.runPromise(readConfig(configPath));

  if (command === "help") {
    return {
      title: zh ? "帮助" : "Help",
      status: zh ? "可用命令已显示" : "Commands shown",
      thinking: zh ? "用户需要可用命令列表，我会保持简洁。" : "The user needs the command list.",
      mode: "plan",
      protectedPorts: config.protectedPorts,
      replay: { type: "help" },
      output: zh
        ? [
            "命令：/ls, /why <端口>, /kill <端口> --dry-run, /protect <端口>, /unprotect <端口>",
            "更多：/clean --dry-run, /open <端口>, /doctor, /ip, /help",
            "安全：kill 始终先生成计划，确认后再加 --yes 或 --force。",
          ]
        : [
            "Commands: /ls, /why <port>, /kill <port> --dry-run, /protect <port>, /unprotect <port>",
            "More: /clean --dry-run, /open <port>, /doctor, /ip, /help",
            "Safety: kill always creates a plan first. Add --yes or --force only after review.",
          ],
    };
  }

  if (command === "ls") {
    const scanned = await Effect.runPromise(listExplainedPorts(config));
    return {
      title: zh ? "端口扫描" : "Port Scan",
      status: zh ? `发现 ${scanned.length} 个监听端口` : `Found ${scanned.length} listeners`,
      thinking: zh
        ? "正在扫描本机监听端口，并按保护策略标注风险。"
        : "Scanning local listening ports and marking risk.",
      mode: "build",
      ports: scanned,
      protectedPorts: config.protectedPorts,
      replay: { type: "ports", ports: scanned },
      output: renderPortLines(scanned, zh),
    };
  }

  if (command === "why") {
    const port = parseTuiPort(args[0], zh);
    const explained = await Effect.runPromise(explainPort(port, config));
    return {
      title: zh ? "端口解释" : "Explain",
      status: explained
        ? zh
          ? `端口 ${port} 已解释`
          : `Port ${port} explained`
        : zh
          ? `端口 ${port} 未被占用`
          : `Port ${port} is free`,
      thinking: zh
        ? "用户想知道端口背后的进程和识别依据。"
        : "The user wants the process and detection reasons.",
      mode: "plan",
      protectedPorts: config.protectedPorts,
      replay: { type: "why", port, explained },
      output: explained ? renderWhyLines(explained, zh) : renderFreePortLines(port, zh),
    };
  }

  if (command === "clean") {
    const confirmed = args.includes("--yes");
    const dryRun = args.includes("--dry-run") || !confirmed;
    const plan = await Effect.runPromise(
      createCleanPlan(config, {
        dryRun,
        includeInfra: args.includes("--include-infra"),
        yes: confirmed,
      }),
    );
    if (confirmed && !args.includes("--dry-run")) {
      const results = await Effect.runPromise(
        executeCleanPlan(plan, config, {
          yes: true,
          force: args.includes("--force") || config.kill.force,
          tree: config.kill.tree,
          graceMs: config.kill.graceMs,
        }),
      );
      const refreshed = await Effect.runPromise(listExplainedPorts(config));
      return {
        title: zh ? "清理执行" : "Clean",
        status: zh
          ? `已处理 ${results.length} 个清理目标`
          : `Handled ${results.length} clean targets`,
        thinking: zh
          ? "用户已经显式确认清理，因此执行候选计划并刷新端口列表。"
          : "The user confirmed clean, so executing the candidate plan and refreshing ports.",
        mode: "build",
        ports: refreshed,
        protectedPorts: config.protectedPorts,
        replay: { type: "clean", plan, results },
        output: [...renderCleanLines(plan, zh), ...renderKillExecutionLines(results, zh)],
      };
    }
    return {
      title: zh ? "清理预览" : "Clean Preview",
      status: zh
        ? `发现 ${plan.candidates.length} 个清理候选`
        : `Found ${plan.candidates.length} clean candidates`,
      thinking: zh
        ? "clean 默认只做预览，并排除 Docker、Postgres、Redis 等基础设施。"
        : "clean previews first and skips infrastructure by default.",
      mode: "plan",
      protectedPorts: config.protectedPorts,
      replay: { type: "clean", plan },
      output: renderCleanLines(plan, zh),
    };
  }

  if (command === "protect") {
    const port = parseTuiPort(args[0], zh);
    if (!config.protectedPorts.includes(port)) {
      config.protectedPorts = [...config.protectedPorts, port].sort((a, b) => a - b);
      await Effect.runPromise(writeConfig(config, configPath));
    }
    const refreshed = await Effect.runPromise(listExplainedPorts(config));
    return {
      title: zh ? "保护端口" : "Protect",
      status: zh ? `端口 ${port} 已加入保护列表` : `Port ${port} is protected`,
      thinking: zh
        ? "保护端口会写入配置，后续 kill 和 clean 都会被策略层阻止。"
        : "Protected ports are saved to config and blocked by kill/clean policy.",
      mode: "plan",
      ports: refreshed,
      protectedPorts: config.protectedPorts,
      replay: {
        type: "protected",
        ports: config.protectedPorts,
        changedPort: port,
        action: "protect",
      },
      output: renderProtectedPortLines(config.protectedPorts, zh, port, "protect"),
    };
  }

  if (command === "unprotect") {
    const port = parseTuiPort(args[0], zh);
    config.protectedPorts = config.protectedPorts.filter((item) => item !== port);
    await Effect.runPromise(writeConfig(config, configPath));
    const refreshed = await Effect.runPromise(listExplainedPorts(config));
    return {
      title: zh ? "取消保护" : "Unprotect",
      status: zh ? `端口 ${port} 已从保护列表移除` : `Port ${port} is no longer protected`,
      thinking: zh
        ? "已更新保护端口配置。移除保护不代表可以直接 kill，仍会经过风险策略。"
        : "Protection config updated. Removing protection still keeps normal risk checks.",
      mode: "plan",
      ports: refreshed,
      protectedPorts: config.protectedPorts,
      replay: {
        type: "protected",
        ports: config.protectedPorts,
        changedPort: port,
        action: "unprotect",
      },
      output: renderProtectedPortLines(config.protectedPorts, zh, port, "unprotect"),
    };
  }

  if (command === "kill") {
    const port = parseTuiPort(args[0], zh);
    const plan = await Effect.runPromise(createKillPlan(port, config));
    if (args.includes("--yes")) {
      const results = await Effect.runPromise(
        executeKillPlan(plan, {
          yes: true,
          force: args.includes("--force") || config.kill.force,
          tree: config.kill.tree,
          graceMs: config.kill.graceMs,
        }),
      );
      return {
        title: "Kill",
        status: zh ? `端口 ${port} 的 kill 计划已执行` : `Kill plan for ${port} executed`,
        thinking: zh
          ? "用户显式确认后才执行 kill 计划。"
          : "Executing only after explicit confirmation.",
        mode: "build",
        protectedPorts: config.protectedPorts,
        replay: { type: "kill", plan, results },
        output: renderKillExecutionLines(results, zh),
      };
    }
    return {
      title: "Kill Plan",
      status: zh ? `端口 ${port} 已生成 kill plan` : `Kill plan created for ${port}`,
      thinking: zh
        ? "危险操作必须先生成计划，此处不会直接终止进程。"
        : "Dangerous operations are planned first; nothing is killed here.",
      mode: "plan",
      protectedPorts: config.protectedPorts,
      replay: { type: "kill", plan },
      output: renderKillLines(plan, zh),
    };
  }

  if (command === "open") {
    const port = parseTuiPort(args[0], zh);
    const url = `${config.open.protocol}://${config.open.host}:${port}`;
    await Effect.runPromise(openLocalhost(url));
    return {
      title: zh ? "打开浏览器" : "Open",
      status: zh ? `已打开 ${url}` : `Opened ${url}`,
      thinking: zh ? "正在调用系统默认浏览器。" : "Opening with the system browser.",
      mode: "build",
      protectedPorts: config.protectedPorts,
      replay: { type: "open", url },
      output: [zh ? `已打开 ${url}` : `Opened ${url}`],
    };
  }

  if (command === "doctor") {
    const checks = await Effect.runPromise(runDoctor());
    return {
      title: "Doctor",
      status: zh ? "系统依赖检查完成" : "System checks completed",
      thinking: zh ? "正在检查平台命令和运行环境。" : "Checking platform commands and runtime.",
      mode: "build",
      protectedPorts: config.protectedPorts,
      replay: { type: "doctor", checks },
      output: checks.map((check) => `${check.ok ? "OK" : "FAIL"}  ${check.name}  ${check.message}`),
    };
  }

  if (command === "ip") {
    const addresses = listLocalAddresses();
    return {
      title: zh ? "本机 IP" : "Local IP",
      status: zh
        ? `发现 ${addresses.length} 个本机地址`
        : `Found ${addresses.length} local addresses`,
      thinking: zh
        ? "正在读取系统网络接口，展示类似 ipconfig/ifconfig 的本机地址摘要。"
        : "Reading OS network interfaces for an ipconfig-like summary.",
      mode: "build",
      protectedPorts: config.protectedPorts,
      replay: { type: "ip", addresses },
      output: renderIpLines(addresses, zh),
    };
  }

  return {
    title: zh ? "未知命令" : "Unknown",
    status: zh ? "未知命令" : "Unknown command",
    thinking: zh ? "没有识别这个命令，因此给出下一步建议。" : "The command is unknown.",
    mode: "plan",
    protectedPorts: config.protectedPorts,
    replay: { type: "unknown", commandLine },
    output: [
      zh ? `未知命令：${commandLine}` : `Unknown command: ${commandLine}`,
      zh
        ? "下一步：输入 /help 查看可用命令，命令前建议加 /。"
        : "Next: type /help to see available commands.",
    ],
  };
}

function renderReplay(
  replay: ReplayOutput,
  language: Language,
): { thinking: string; output: OutputLine[]; mode: "plan" | "build" } {
  const zh = language === "zh";
  switch (replay.type) {
    case "help":
      return {
        thinking: zh ? "用户需要可用命令列表，我会保持简洁。" : "The user needs the command list.",
        mode: "plan",
        output: zh
          ? [
              "命令：/ls, /why <端口>, /kill <端口> --dry-run, /protect <端口>, /unprotect <端口>",
              "更多：/clean --dry-run, /open <端口>, /doctor, /ip, /help",
              "安全：kill 始终先生成计划，确认后再加 --yes 或 --force。",
            ]
          : [
              "Commands: /ls, /why <port>, /kill <port> --dry-run, /protect <port>, /unprotect <port>",
              "More: /clean --dry-run, /open <port>, /doctor, /ip, /help",
              "Safety: kill always creates a plan first. Add --yes or --force only after review.",
            ],
      };
    case "ports":
      return {
        thinking: zh
          ? "正在扫描本机监听端口，并按保护策略标注风险。"
          : "Scanning local listening ports and marking risk.",
        mode: "build",
        output: renderPortLines(replay.ports, zh),
      };
    case "why":
      return {
        thinking: zh
          ? "用户想知道端口背后的进程和识别依据。"
          : "The user wants the process and detection reasons.",
        mode: "plan",
        output: replay.explained
          ? renderWhyLines(replay.explained, zh)
          : renderFreePortLines(replay.port, zh),
      };
    case "clean":
      return {
        thinking: replay.results
          ? zh
            ? "用户已经显式确认清理，因此执行候选计划并刷新端口列表。"
            : "The user confirmed clean, so executing the candidate plan and refreshing ports."
          : zh
            ? "clean 默认只做预览，并排除 Docker、Postgres、Redis 等基础设施。"
            : "clean previews first and skips infrastructure by default.",
        mode: replay.results ? "build" : "plan",
        output: replay.results
          ? [...renderCleanLines(replay.plan, zh), ...renderKillExecutionLines(replay.results, zh)]
          : renderCleanLines(replay.plan, zh),
      };
    case "protected":
      return {
        thinking:
          replay.action === "protect"
            ? zh
              ? "保护端口会写入配置，后续 kill 和 clean 都会被策略层阻止。"
              : "Protected ports are saved to config and blocked by kill/clean policy."
            : zh
              ? "已更新保护端口配置。移除保护不代表可以直接 kill，仍会经过风险策略。"
              : "Protection config updated. Removing protection still keeps normal risk checks.",
        mode: "plan",
        output: renderProtectedPortLines(replay.ports, zh, replay.changedPort, replay.action),
      };
    case "kill":
      return {
        thinking: replay.results
          ? zh
            ? "用户显式确认后才执行 kill 计划。"
            : "Executing only after explicit confirmation."
          : zh
            ? "危险操作必须先生成计划，此处不会直接终止进程。"
            : "Dangerous operations are planned first; nothing is killed here.",
        mode: replay.results ? "build" : "plan",
        output: replay.results
          ? renderKillExecutionLines(replay.results, zh)
          : renderKillLines(replay.plan, zh),
      };
    case "open":
      return {
        thinking: zh ? "正在调用系统默认浏览器。" : "Opening with the system browser.",
        mode: "build",
        output: [zh ? `已打开 ${replay.url}` : `Opened ${replay.url}`],
      };
    case "doctor":
      return {
        thinking: zh ? "正在检查平台命令和运行环境。" : "Checking platform commands and runtime.",
        mode: "build",
        output: replay.checks.map(
          (check) => `${check.ok ? "OK" : "FAIL"}  ${check.name}  ${check.message}`,
        ),
      };
    case "ip":
      return {
        thinking: zh
          ? "正在读取系统网络接口，展示类似 ipconfig/ifconfig 的本机地址摘要。"
          : "Reading OS network interfaces for an ipconfig-like summary.",
        mode: "build",
        output: renderIpLines(replay.addresses, zh),
      };
    case "unknown":
      return {
        thinking: zh ? "没有识别这个命令，因此给出下一步建议。" : "The command is unknown.",
        mode: "plan",
        output: [
          zh ? `未知命令：${replay.commandLine}` : `Unknown command: ${replay.commandLine}`,
          zh
            ? "下一步：输入 /help 查看可用命令，命令前建议加 /。"
            : "Next: type /help to see available commands.",
        ],
      };
  }
}

/**
 * 规范化 TUI 命令名称。TUI 推荐使用 slash command（例如 /ls），
 * 但这里仍兼容裸命令，避免用户少输入 / 时无法执行。
 */
function normalizeCommandToken(value: string | undefined): string | undefined {
  const command = value?.trim().replace(/^\/+/, "");
  return command && command.length > 0 ? command : undefined;
}

/**
 * 实现类似 Linux shell 的单词补齐：Tab 只补齐第一个 slash 命令单词。
 * 多个候选存在时会补齐公共前缀；没有公共前缀时在状态栏展示候选列表。
 */
function completeSlashCommand(
  value: string,
  language: Language,
): { value: string; status: string } {
  const zh = language === "zh";
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const rest = value.slice(leading.length);
  const match = rest.match(/^(\S*)([\s\S]*)$/);
  const token = match?.[1] ?? "";
  const suffix = match?.[2] ?? "";
  const normalized = token.replace(/^\/+/, "").toLowerCase();

  if (suffix.trim().length > 0) {
    return {
      value,
      status: zh ? "Tab 只补齐命令单词，参数保持不变" : "Tab completes the command word only",
    };
  }

  if (token.length === 0) {
    return {
      value: `${leading}/`,
      status: zh
        ? "继续输入命令，或再按 Tab 查看候选"
        : "Type a command, or press Tab again for matches",
    };
  }

  const matches = slashCommands.filter((command) => command.startsWith(normalized));
  if (matches.length === 0) {
    return {
      value,
      status: `${copy[language].autocompleteNone}: ${token}`,
    };
  }

  if (matches.length === 1) {
    return {
      value: `${leading}/${matches[0]} `,
      status: zh ? `已补齐 /${matches[0]}` : `Completed /${matches[0]}`,
    };
  }

  const common = commonPrefix(matches);
  if (common.length > normalized.length) {
    return {
      value: `${leading}/${common}`,
      status: `${copy[language].autocompleteMany}: ${matches.map((command) => `/${command}`).join("  ")}`,
    };
  }

  return {
    value,
    status: `${copy[language].autocompleteMany}: ${matches.map((command) => `/${command}`).join("  ")}`,
  };
}

/**
 * 计算多个命令候选的公共前缀，用于 Tab 逐步补齐。
 */
function commonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0] ?? "";
  for (const value of values.slice(1)) {
    while (!value.startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

type LocalAddress = {
  name: string;
  family: "IPv4" | "IPv6";
  address: string;
  internal: boolean;
  mac: string;
  cidr: string | null;
};

/**
 * 读取本机网络接口地址。使用 Node/Bun 标准库而不是直接调用 ipconfig/ifconfig，
 * 这样 Windows 与 macOS 都走同一套解析逻辑，避免平台输出格式差异。
 */
function listLocalAddresses(): LocalAddress[] {
  return Object.entries(networkInterfaces())
    .flatMap(([name, items]) =>
      (items ?? []).map((item) => ({
        name,
        family: item.family,
        address: item.address,
        internal: item.internal,
        mac: item.mac,
        cidr: item.cidr ?? null,
      })),
    )
    .filter((item): item is LocalAddress => item.family === "IPv4" || item.family === "IPv6")
    .sort((a, b) => Number(a.internal) - Number(b.internal) || a.name.localeCompare(b.name));
}

/**
 * 渲染 /ip 的网络接口摘要。外部可访问地址使用绿色，本机回环地址使用灰色，
 * 用户可以快速区分“局域网可访问”和“仅本机可访问”的地址。
 */
function renderIpLines(addresses: LocalAddress[], zh: boolean): OutputLine[] {
  if (addresses.length === 0) {
    return [zh ? "没有读取到可展示的网络接口地址。" : "No network interface addresses found."];
  }

  const rows = addresses.map((item) => ({
    cells: [
      item.name,
      item.family,
      item.internal ? (zh ? "本机" : "loopback") : zh ? "局域网" : "LAN",
      item.address,
      item.cidr ?? "-",
      item.mac === "00:00:00:00:00:00" ? "-" : item.mac,
    ],
    item,
  }));
  return [
    zh ? `主机名：${hostname()}` : `Hostname: ${hostname()}`,
    ...renderIpTable(["INTERFACE", "FAMILY", "SCOPE", "ADDRESS", "CIDR", "MAC"], rows),
  ];
}

function renderIpTable(
  headers: string[],
  rows: Array<{ cells: Array<string | number>; item: LocalAddress }>,
): OutputLine[] {
  const normalizedRows = rows.map((row) => ({
    cells: row.cells.map(normalizeTableCell),
    item: row.item,
  }));
  const normalizedHeaders = headers.map(normalizeTableCell);
  const widths = normalizedHeaders.map((header, index) =>
    Math.max(
      displayWidth(header),
      ...normalizedRows.map((row) => displayWidth(row.cells[index] ?? "")),
    ),
  );
  const separator = `+${widths.map((width) => "-".repeat(width + 2)).join("+")}+`;
  return [
    [{ text: separator, color: BORDER }],
    colorTableRow(normalizedHeaders, widths, () => HEADER),
    [{ text: separator, color: BORDER }],
    ...normalizedRows.map((row) =>
      colorTableRow(row.cells, widths, (index) => ipCellColor(row.item, index)),
    ),
    [{ text: separator, color: BORDER }],
  ];
}

function ipCellColor(item: LocalAddress, index: number): string {
  if (index === 0) return BLUE;
  if (index === 1) return item.family === "IPv4" ? LOW : MEDIUM;
  if (index === 2 || index === 3) return item.internal ? DIM : LOW;
  return DIM;
}

/**
 * 渲染保护端口列表，供 /protect 与 /unprotect 显示最新策略结果。
 */
function renderProtectedPortLines(
  ports: number[],
  zh: boolean,
  changedPort: number,
  action: "protect" | "unprotect",
): OutputLine[] {
  const rows = [
    [
      zh ? "本次操作" : "Action",
      action === "protect" ? (zh ? "加入保护" : "protected") : zh ? "取消保护" : "unprotected",
      action === "protect" ? LOW : MEDIUM,
    ],
    [zh ? "目标端口" : "Target port", changedPort, BLUE],
    [zh ? "保护数量" : "Protected count", ports.length, LOW],
    [zh ? "保护列表" : "Protected list", ports.length > 0 ? ports.join("  ") : "-", LOW],
  ] satisfies Array<[string, string | number, string]>;

  return [
    sectionTitle(
      action === "protect"
        ? zh
          ? "保护端口"
          : "Protect Port"
        : zh
          ? "取消保护"
          : "Unprotect Port",
    ),
    ...renderKeyValueTable(rows),
  ];
}

function parseTuiPort(value: string | undefined, zh: boolean): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      zh
        ? "端口参数无效。原因：端口必须是 1-65535 的整数。下一步：例如输入 why 3000。"
        : "Invalid port. Reason: port must be an integer from 1 to 65535. Next: try why 3000.",
    );
  }
  return port;
}

function renderPortLines(ports: ExplainedPort[], zh: boolean): OutputLine[] {
  if (ports.length === 0)
    return [zh ? "当前没有发现正在监听的本地端口。" : "No local listeners found."];
  const rows = ports.map((item) => ({
    cells: [
      item.binding.localPort,
      item.process.pid,
      item.detection.kind,
      item.risk,
      item.protected ? (zh ? "是" : "yes") : zh ? "否" : "no",
      item.zombieScore,
      item.binding.localAddress,
      item.process.name,
    ],
    port: item,
  }));

  return [
    zh ? `共发现 ${ports.length} 个监听端口：` : `Found ${ports.length} listening ports:`,
    ...renderPortTable(
      ["PORT", "PID", "KIND", "RISK", "PROTECTED", "SCORE", "ADDRESS", "PROCESS"],
      rows,
    ),
  ];
}

/**
 * 为 TUI 输出生成完整的彩色等宽文本表格。这里不会截断行数，确保 ls 一次展示全部端口；
 * 边框、表头、风险、保护状态、地址会分别上色，让用户不用逐列阅读也能直观看出重点。
 */
function renderPortTable(
  headers: string[],
  rows: Array<{ cells: Array<string | number>; port: ExplainedPort }>,
): OutputLine[] {
  const normalizedRows = rows.map((row) => ({
    cells: row.cells.map(normalizeTableCell),
    port: row.port,
  }));
  const normalizedHeaders = headers.map(normalizeTableCell);
  const widths = normalizedHeaders.map((header, index) =>
    Math.max(
      displayWidth(header),
      ...normalizedRows.map((row) => displayWidth(row.cells[index] ?? "")),
    ),
  );
  const separator = `+${widths.map((width) => "-".repeat(width + 2)).join("+")}+`;
  const renderHeader = () => colorTableRow(normalizedHeaders, widths, () => HEADER);
  const renderRow = (row: { cells: string[]; port: ExplainedPort }) =>
    colorTableRow(row.cells, widths, (index) => portCellColor(row.port, index));

  return [
    [{ text: separator, color: BORDER }],
    renderHeader(),
    [{ text: separator, color: BORDER }],
    ...normalizedRows.map(renderRow),
    [{ text: separator, color: BORDER }],
  ];
}

/**
 * 把一行表格拆成边框和单元格片段。边框变暗、信息列按语义上色。
 */
function colorTableRow(
  cells: string[],
  widths: number[],
  colorForCell: (index: number, cell: string) => string,
): TextSegment[] {
  const segments: TextSegment[] = [{ text: "|", color: BORDER }];
  for (let index = 0; index < cells.length; index += 1) {
    const cell = cells[index] ?? "";
    segments.push({ text: " " });
    segments.push({
      text: padDisplayEnd(cell, widths[index] ?? 0),
      color: colorForCell(index, cell),
    });
    segments.push({ text: " " });
    segments.push({ text: "|", color: BORDER });
  }
  return segments;
}

/**
 * 根据端口语义给关键列着色：风险最醒目，保护状态和地址提供辅助判断。
 */
function portCellColor(port: ExplainedPort, index: number): string {
  if (index === 0) return BLUE;
  if (index === 2)
    return port.detection.isInfrastructure ? MEDIUM : port.detection.isDevServer ? LOW : DIM;
  if (index === 3) return riskColor(port.risk);
  if (index === 4) return port.protected ? LOW : DIM;
  if (index === 5) return port.zombieScore >= 60 ? HIGH : port.zombieScore >= 30 ? MEDIUM : DIM;
  if (index === 6)
    return port.binding.localAddress === "127.0.0.1" || port.binding.localAddress === "::1"
      ? LOW
      : DIM;
  if (index === 7) return TEXT;
  return TEXT;
}

function riskColor(risk: ExplainedPort["risk"]): string {
  if (risk === "low") return LOW;
  if (risk === "medium") return MEDIUM;
  if (risk === "high") return HIGH;
  return BLOCKED;
}

/**
 * 表格单元格清洗函数。平台命令返回值可能为空或包含多余空白，
 * 统一转换后可以保证 TUI 表格稳定对齐。
 */
function normalizeTableCell(value: string | number | null | undefined): string {
  const text = String(value ?? "-")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0 ? text : "-";
}

/**
 * 计算终端等宽显示宽度。中文、全角标点和多数 CJK 字符实际占两个单元，
 * 如果直接使用 string.length，包含“是/否”的列会把表头横线撑歪。
 */
function displayWidth(value: string): number {
  return [...value].reduce((width, char) => width + (isWideTerminalChar(char) ? 2 : 1), 0);
}

/**
 * 按终端显示宽度补齐右侧空格，而不是按 JS 字符数量补齐。
 */
function padDisplayEnd(value: string, targetWidth: number): string {
  const padding = Math.max(0, targetWidth - displayWidth(value));
  return `${value}${" ".repeat(padding)}`;
}

/**
 * 粗略判断终端宽字符。覆盖中文、日文、韩文、全角符号等常见范围；
 * Port Butler 的表格只需要稳定对齐文本输出，不依赖复杂 emoji 宽度。
 */
function isWideTerminalChar(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return (
    (code >= 0x1100 && code <= 0x115f) ||
    (code >= 0x2e80 && code <= 0xa4cf) ||
    (code >= 0xac00 && code <= 0xd7a3) ||
    (code >= 0xf900 && code <= 0xfaff) ||
    (code >= 0xfe10 && code <= 0xfe19) ||
    (code >= 0xfe30 && code <= 0xfe6f) ||
    (code >= 0xff00 && code <= 0xff60) ||
    (code >= 0xffe0 && code <= 0xffe6)
  );
}

function renderWhyLines(port: ExplainedPort, zh: boolean): OutputLine[] {
  const protectedText = port.protected ? (zh ? "是" : "yes") : zh ? "否" : "no";
  const startedAt = port.process.startedAt?.toLocaleString() ?? "-";
  return [
    sectionTitle(zh ? "端口详情" : "Port Detail"),
    ...renderKeyValueTable([
      [zh ? "端口" : "Port", port.binding.localPort, BLUE],
      [zh ? "地址" : "Address", port.binding.localAddress, addressColor(port.binding.localAddress)],
      [zh ? "协议" : "Protocol", port.binding.protocol.toUpperCase(), DIM],
      [zh ? "进程" : "Process", port.process.name, TEXT],
      ["PID", port.process.pid, BLUE],
      ["PPID", port.process.ppid ?? "-", DIM],
      [zh ? "用户" : "User", port.process.user ?? "-", DIM],
      [zh ? "启动时间" : "Started", startedAt, DIM],
      [zh ? "工作目录" : "CWD", port.process.cwd ?? "-", DIM],
      [zh ? "命令行" : "Command", port.process.commandLine ?? "-", DIM],
    ]),
    sectionTitle(zh ? "判断结果" : "Decision"),
    ...renderKeyValueTable([
      [zh ? "类型" : "Kind", port.detection.kind, kindColor(port)],
      [
        zh ? "置信度" : "Confidence",
        `${port.detection.confidence}%`,
        confidenceColor(port.detection.confidence),
      ],
      [zh ? "风险" : "Risk", port.risk, riskColor(port.risk)],
      [zh ? "受保护" : "Protected", protectedText, port.protected ? LOW : DIM],
      [zh ? "僵尸评分" : "Zombie score", port.zombieScore, zombieScoreColor(port.zombieScore)],
      [
        zh ? "开发服务" : "Dev server",
        boolText(port.detection.isDevServer, zh),
        port.detection.isDevServer ? LOW : DIM,
      ],
      [
        zh ? "基础设施" : "Infrastructure",
        boolText(port.detection.isInfrastructure, zh),
        port.detection.isInfrastructure ? MEDIUM : DIM,
      ],
    ]),
    sectionTitle(zh ? "依据" : "Reasons"),
    ...renderReasonList(port.detection.reasons, zh),
    ...renderReasonList(port.zombieReasons, zh),
    sectionTitle(zh ? "建议" : "Next"),
    ...renderWhyAdvice(port, zh),
  ];
}

function renderFreePortLines(port: number, zh: boolean): OutputLine[] {
  return [
    sectionTitle(zh ? "端口详情" : "Port Detail"),
    ...renderKeyValueTable([
      [zh ? "端口" : "Port", port, BLUE],
      [zh ? "状态" : "Status", zh ? "空闲" : "free", LOW],
    ]),
    [
      { text: zh ? "建议：" : "Next: ", color: HEADER },
      {
        text: zh
          ? "可以直接启动你的开发服务，或输入 /ls 刷新端口列表。"
          : "Start your dev server or run /ls to refresh.",
        color: DIM,
      },
    ],
  ];
}

function renderWhyAdvice(port: ExplainedPort, zh: boolean): OutputLine[] {
  if (port.protected || port.risk === "blocked") {
    return [
      [
        { text: zh ? "保护策略：" : "Protected: ", color: BLOCKED },
        {
          text: zh
            ? "该端口不建议终止。如确需处理，先确认服务归属，再使用 /unprotect。"
            : "Do not kill this by default. Confirm ownership before /unprotect.",
          color: DIM,
        },
      ],
    ];
  }
  if (port.detection.isInfrastructure) {
    return [
      [
        { text: zh ? "基础设施：" : "Infrastructure: ", color: MEDIUM },
        {
          text: zh
            ? "默认不建议清理数据库、Docker、Redis 等服务。"
            : "Databases, Docker, Redis and similar services are skipped by default.",
          color: DIM,
        },
      ],
    ];
  }
  return [
    [
      { text: zh ? "下一步：" : "Next: ", color: LOW },
      {
        text: zh
          ? `如确认可结束，先看 /kill ${port.binding.localPort} 的计划，再决定是否加 --yes。`
          : `Review /kill ${port.binding.localPort}, then add --yes only if safe.`,
        color: DIM,
      },
    ],
  ];
}

function renderReasonList(reasons: string[], zh: boolean): OutputLine[] {
  if (reasons.length === 0)
    return [[{ text: zh ? "· 暂无额外依据" : "· No extra reasons", color: DIM }]];
  return reasons.map((reason) => [
    { text: "· ", color: BORDER },
    { text: reason, color: DIM },
  ]);
}

function renderKeyValueTable(rows: Array<[string, string | number, string?]>): OutputLine[] {
  const normalizedRows = rows.map(([key, value, color]) => ({
    key: normalizeTableCell(key),
    value: normalizeTableCell(value),
    color,
  }));
  const keyWidth = Math.max(...normalizedRows.map((row) => displayWidth(row.key)));
  return normalizedRows.map((row) => [
    { text: "  ", color: BORDER },
    { text: padDisplayEnd(row.key, keyWidth), color: HEADER },
    { text: "  ", color: BORDER },
    { text: row.value, color: row.color ?? TEXT },
  ]);
}

function sectionTitle(title: string): TextSegment[] {
  return [
    { text: "◆ ", color: ORANGE },
    { text: title, color: HEADER },
  ];
}

function boolText(value: boolean, zh: boolean): string {
  return value ? (zh ? "是" : "yes") : zh ? "否" : "no";
}

function kindColor(port: ExplainedPort): string {
  if (port.detection.isInfrastructure) return MEDIUM;
  if (port.detection.isDevServer) return LOW;
  return DIM;
}

function confidenceColor(confidence: number): string {
  if (confidence >= 80) return LOW;
  if (confidence >= 50) return MEDIUM;
  return DIM;
}

function zombieScoreColor(score: number): string {
  if (score >= 60) return HIGH;
  if (score >= 30) return MEDIUM;
  return DIM;
}

function addressColor(address: string): string {
  return address === "127.0.0.1" || address === "::1" ? LOW : DIM;
}

function renderCleanLines(plan: CleanPlan, zh: boolean): OutputLine[] {
  if (plan.candidates.length === 0) {
    return [zh ? "没有达到清理阈值的候选项。" : "No candidates reached the clean threshold."];
  }
  return [
    sectionTitle(zh ? "清理候选" : "Clean Candidates"),
    ...renderPortTable(
      ["PORT", "PID", "KIND", "RISK", "PROTECTED", "SCORE", "ADDRESS", "PROCESS"],
      plan.candidates.map((item) => ({
        cells: [
          item.binding.localPort,
          item.process.pid,
          item.detection.kind,
          item.risk,
          item.protected ? (zh ? "是" : "yes") : zh ? "否" : "no",
          item.zombieScore,
          item.binding.localAddress,
          item.process.name,
        ],
        port: item,
      })),
    ),
  ];
}

function renderKillExecutionLines(
  results: Array<{ pid: number; ok: boolean; message: string }>,
  zh: boolean,
): OutputLine[] {
  return [
    sectionTitle(zh ? "执行结果" : "Execution"),
    ...results.map((result) => [
      { text: result.ok ? "OK " : "FAIL ", color: result.ok ? LOW : BLOCKED },
      { text: `PID ${result.pid}  `, color: BLUE },
      { text: result.message, color: result.ok ? TEXT : HIGH },
    ]),
  ];
}

function renderKillLines(plan: KillPlan, zh: boolean): OutputLine[] {
  if (plan.targets.length === 0) return [plan.message];
  return [
    sectionTitle("Kill Plan"),
    [
      {
        text: plan.blocked ? "BLOCKED " : plan.requiresConfirmation ? "REVIEW  " : "READY   ",
        color: plan.blocked ? BLOCKED : plan.requiresConfirmation ? MEDIUM : LOW,
      },
      { text: plan.message, color: TEXT },
    ],
    ...renderKillTargetTable(plan.targets, zh),
    sectionTitle(zh ? "建议" : "Next"),
    plan.blocked
      ? [
          {
            text: zh ? "该计划被保护策略阻止。" : "This plan is blocked by protection policy.",
            color: BLOCKED,
          },
        ]
      : plan.requiresConfirmation
        ? [
            {
              text: zh
                ? "下一步：确认无风险后输入 /kill <端口> --yes，必要时加 --force。"
                : "Next: after review, type /kill <port> --yes, add --force if needed.",
              color: DIM,
            },
          ]
        : [
            {
              text: zh
                ? "低风险目标，可输入 /kill <端口> --yes 执行。"
                : "Low risk target. Type /kill <port> --yes to execute.",
              color: DIM,
            },
          ],
  ];
}

function renderKillTargetTable(targets: KillPlan["targets"], zh: boolean): OutputLine[] {
  const rows = targets.map((target) => ({
    cells: [
      target.port,
      target.pid,
      target.name,
      target.kind,
      target.risk,
      target.reasons.join("; ") || "-",
    ],
    target,
  }));
  const headers = ["PORT", "PID", "PROCESS", "KIND", "RISK", zh ? "REASON" : "REASON"];
  const normalizedRows = rows.map((row) => ({
    cells: row.cells.map(normalizeTableCell),
    target: row.target,
  }));
  const widths = headers.map((header, index) =>
    Math.max(
      displayWidth(header),
      ...normalizedRows.map((row) => displayWidth(row.cells[index] ?? "")),
    ),
  );
  const separator = `+${widths.map((width) => "-".repeat(width + 2)).join("+")}+`;
  return [
    [{ text: separator, color: BORDER }],
    colorTableRow(headers, widths, () => HEADER),
    [{ text: separator, color: BORDER }],
    ...normalizedRows.map((row) =>
      colorTableRow(row.cells, widths, (index) =>
        index === 4 ? riskColor(row.target.risk) : index === 0 || index === 1 ? BLUE : TEXT,
      ),
    ),
    [{ text: separator, color: BORDER }],
  ];
}

/**
 * 启动 Solid 终端渲染器。渲染生命周期由 OpenTUI 管理。
 */
export async function startTui(options: StartTuiOptions = {}): Promise<void> {
  await render(() => <App {...options} />, { exitOnCtrlC: true, targetFps: 30 });
}
