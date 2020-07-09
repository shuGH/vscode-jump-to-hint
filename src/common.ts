'use strict';

// Enumや構造体

import * as vscode from 'vscode';

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
        hintChars: string[]
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

// ステータス
export type ExtensionStatus = {
    state: ExtensionState
}
