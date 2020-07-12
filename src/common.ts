'use strict';

// Enumや構造体

import * as vscode from 'vscode';
import { stat } from 'fs';

// ヒントタイプ
export enum HintLengthType {
    Fixed,
    Variable
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
        hintCharList: string[]
    };

    type: {
        hintLengthType: HintLengthType,
        fixedHintLength: number,
    };

    ui: {
        fontFamily: string,
        fontSize: number,
        fontColor: string,
        backgroundColor: string
    };
}

// 位置とコード
export type HintParam = {
    pos: vscode.Position;
    code: string;
}

// ステータス
export class ExtensionStatus extends vscode.Disposable {
    state: ExtensionState;
    positionList: vscode.Position[];
    codeList: string[];
    inputCode: string;
    foregroundDecoration: vscode.TextEditorDecorationType | null;
    backgroundDecoration: vscode.TextEditorDecorationType | null;

    constructor() {
        super(() => { this.dispose(); });

        this.state = ExtensionState.NotActive;
        this.positionList = [];
        this.codeList = [];
        this.inputCode = '';
        this.foregroundDecoration = null;
        this.backgroundDecoration = null;
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
    };

    dispose() {
        this.finalize();
    };
}
