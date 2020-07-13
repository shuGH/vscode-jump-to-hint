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
        inputStyle: InputStyle
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

// 位置とコード
export type HintParam = {
    pos: Position;
    code: string;
}

// ステータス
export class ExtensionStatus extends Disposable {
    state: ExtensionState;
    positionList: Position[];
    codeList: string[];
    inputCode: string;
    foregroundDecoration: TextEditorDecorationType | null;
    backgroundDecoration: TextEditorDecorationType | null;
    targetEditor: TextEditor | null;
    subscriptionList: Disposable[];
    inputBox: InputBox | null;

    constructor() {
        super(() => { this.dispose(); });

        this.state = ExtensionState.NotActive;
        this.positionList = [];
        this.codeList = [];
        this.inputCode = '';
        this.foregroundDecoration = null;
        this.backgroundDecoration = null;
        this.targetEditor = null;
        this.subscriptionList = [];
        this.inputBox = null;
    };

    initialize() {
        this.finalize();
    };

    finalize() {
        this.state = ExtensionState.NotActive;
        this.positionList.length = 0;
        this.codeList.length = 0;
        this.inputCode = '';
        this.foregroundDecoration?.dispose();
        this.foregroundDecoration = null;
        this.backgroundDecoration?.dispose();
        this.backgroundDecoration = null;
        this.targetEditor = null;

        this.subscriptionList.forEach((s) => s.dispose());
        this.subscriptionList = [];
        this.inputBox?.dispose();
        this.inputBox = null;
    };

    dispose() {
        this.finalize();
    };
}
