'use strict';

// Enumや構造体

import {
    Disposable,
    Position,
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

// 動作ステート
export enum ExtensionState {
    NotActive,
    ActiveWordHint,
    ActiveLineHint
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
        backgroundColor: string
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
    labelList: string[][];
    inputLabel: string;
    foregroundDecorationList: TextEditorDecorationType[];
    backgroundDecorationList: TextEditorDecorationType[];
    targetEditorList: TextEditor[];
    subscriptionList: Disposable[];
    inputBox: InputBox | null;

    constructor() {
        super(() => { this.dispose(); });

        this.state = ExtensionState.NotActive;
        this.positionList = [];
        this.labelList = [];
        this.inputLabel = '';
        this.foregroundDecorationList = [];
        this.backgroundDecorationList = [];
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
        this.labelList.length = 0;
        this.inputLabel = '';

        this.foregroundDecorationList.forEach((d) => d.dispose());
        this.foregroundDecorationList = [];
        this.backgroundDecorationList.forEach((d) => d.dispose());
        this.backgroundDecorationList = [];

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
