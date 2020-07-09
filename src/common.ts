'use strict';

// Enumや構造体

import * as vscode from 'vscode';

// ヒントタイプ
export enum HintLengthType {
    Fixed,
    Variable
};

// 設定型
export interface UserSetting {
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
