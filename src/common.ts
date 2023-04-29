'use strict';

// Enumや構造体

import {
    Disposable,
    Position,
    Range,
    TextEditorDecorationType,
    TextEditor,
    InputBox
} from 'vscode';

// ヒントタイプ
export enum HintLengthType {
    Fixed,
    Variable
};

// 入力方式
export enum InputStyle {
    TypeEvent,
    InputBox
};

// 表示先
export enum TargetTextEditorType {
    ActiveTextEditor,
    VisibleTextEditors
};

// ヒントの確定度
export enum NavigationCapability {
    CanNavigate,
    Narrowed,
    NotMatch
};

// 動作ステート
export enum ExtensionState {
    NotActive,
    ActiveWordHint,
    ActiveLineHint,
    ActiveSearchHint
};

// 設定型
export type UserSetting = {
    common: {
        wordRegExp: RegExp,
        lineRegExp: RegExp,
        hintCharList: string[],
        inputStyle: InputStyle,
        targetType: TargetTextEditorType
    };

    type: {
        hintLengthType: HintLengthType,
        fixedHintLength: number,
    };

    theme: {
        fontColor: string,
        backgroundColor: string,
        highlightColor: string
    };
}

// 位置とラベル
export type HintParam = {
    pos: Position;
    label: string;
}

// ステータス
export class ExtensionStatus extends Disposable {
    state: ExtensionState;
    positionList: Position[][];
    rangeList: Range[][];
    labelList: string[][];
    inputLabel: string;
    inputQuery: string;
    foregroundDecorationList: TextEditorDecorationType[];
    backgroundDecorationList: TextEditorDecorationType[];
    highlightDecorationList: TextEditorDecorationType[];
    targetEditorList: TextEditor[];
    subscriptionList: Disposable[];
    inputBox: InputBox | null;

    constructor() {
        super(() => { this.dispose(); });

        this.state = ExtensionState.NotActive;
        this.positionList = [];
        this.rangeList = [];
        this.labelList = [];
        this.inputLabel = '';
        this.inputQuery = '';
        this.foregroundDecorationList = [];
        this.backgroundDecorationList = [];
        this.highlightDecorationList = [];
        this.targetEditorList = [];
        this.subscriptionList = [];
        this.inputBox = null;
    };

    initialize() {
        this.finalize();
    };

    finalize() {
        this.state = ExtensionState.NotActive;
        this.positionList.length = 0;
        this.rangeList.length = 0;
        this.labelList.length = 0;
        this.inputLabel = '';
        this.inputQuery = '';

        this.foregroundDecorationList.forEach((d) => d.dispose());
        this.foregroundDecorationList = [];
        this.backgroundDecorationList.forEach((d) => d.dispose());
        this.backgroundDecorationList = [];
        this.highlightDecorationList.forEach((d) => d.dispose());
        this.highlightDecorationList = [];

        this.targetEditorList.length = 0;

        this.subscriptionList.forEach((s) => s.dispose());
        this.subscriptionList = [];
        this.inputBox?.dispose();
        this.inputBox = null;
    };

    dispose() {
        this.finalize();
    };
}
