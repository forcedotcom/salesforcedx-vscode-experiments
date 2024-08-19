import * as path from 'path';

class EventEmitter {
  private listeners: any[] = [];
  constructor() {}
  public event = (listener: any) => this.listeners.push(listener);
  public dispose = jest.fn();
  public fire = (e: any) => this.listeners.forEach((listener) => listener(e));
}

const getMockVSCode = () => {
  return {
    CancellationTokenSource: class {
      public listeners: any[] = [];
      public token = {
        isCancellationRequested: false,
        onCancellationRequested: (listener: any) => {
          this.listeners.push(listener);
          return {
            dispose: () => {
              this.listeners = [];
            }
          };
        }
      };
      public cancel = () => {
        this.listeners.forEach((listener) => {
          listener.call();
        });
      };
      public dispose = () => {};
    },
    CodeLens: jest.fn(),
    TreeItem: jest.fn(),
    commands: {
      executeCommand: jest.fn(),
      registerCommand: jest.fn(),
      registerTextEditorCommand: jest.fn()
    },
    Disposable: jest.fn(),
    env: {
      sessionId: 'abc123',
      machineId: '12345534',
      clipboard: {
        readText: jest.fn(),
        writeText: jest.fn()
      }
    },
    EventEmitter,
    ExtensionMode: { Production: 1, Development: 2, Test: 3 },
    extensions: {
      getExtension: jest.fn()
    },
    languages: {
      createDiagnosticCollection: jest.fn(),
      registerCodeLensProvider: jest.fn(),
      registerInlineCompletionItemProvider: jest.fn(() => {
        return {};
      })
    },
    ThemeColor: jest.fn(),
    Uri: {
      parse: jest.fn(),
      file: jest.fn(),
      joinPath: jest.fn()
    },
    Position: jest.fn(),
    ProgressLocation: {
      SourceControl: 1,
      Window: 10,
      Notification: 15
    },
    Range: jest.fn(),
    SnippetString: jest.fn(),
    StatusBarAlignment: {
      Left: 1,
      Right: 2
    },
    SymbolKind: {
      Class: 4,
      Method: 5,
      Property: 6,
      Constructor: 8,
      Enum: 9,
      Interface: 10
    },
    window: {
      activeTextEditor: {
        selection: {
          active: 'cursor-position'
        },
        document: {
          getText: () => 'some text',
          lineAt: jest.fn(),
          uri: { scheme: 'file' },
          fileName: path.join('some', 'path', 'to', 'file.ext')
        }
      },
      showInformationMessage: jest.fn(),
      showWarningMessage: jest.fn(),
      showErrorMessage: jest.fn(),
      showInputBox: jest.fn(),
      showQuickPick: jest.fn(),
      setStatusBarMessage: jest.fn(),
      withProgress: jest.fn(),
      createOutputChannel: jest.fn(),
      showSaveDialog: jest.fn(),
      OutputChannel: {
        show: jest.fn()
      },
      createStatusBarItem: jest.fn(),
      registerWebviewViewProvider: jest.fn(),
      onDidChangeTextEditorSelection: jest.fn(),
      onDidChangeActiveTextEditor: jest.fn(),
      createTextEditorDecorationType: jest.fn()
    },
    workspace: {
      applyEdit: jest.fn(),
      getConfiguration: () => {
        return {
          get: jest.fn(),
          update: jest.fn()
        };
      },
      onDidChangeConfiguration: () => ({
        dispose: jest.fn()
      }),
      onDidChangeTextDocument: jest.fn(),
      onDidOpenTextDocument: jest.fn(),
      createFileSystemWatcher: jest.fn().mockReturnValue({
        onDidChange: jest.fn(),
        onDidCreate: jest.fn(),
        onDidDelete: jest.fn()
      }),
      workspaceFolders: [{ uri: { path: path.join('some', 'path') } }],
      fs: {
        writeFile: jest.fn(),
        readFile: jest.fn()
      },
      findFiles: jest.fn(),
      openTextDocument: jest.fn()
    },
    l10n: {
      t: jest.fn()
    },
    OverviewRulerLane: jest.fn(),
    WorkspaceEdit: jest.fn(),
    WorkspaceConfiguration: jest.fn()
  };
};

jest.mock(
  'vscode',
  () => {
    return getMockVSCode();
  },
  { virtual: true }
);
