'use strict';

// 入力処理

import {
    Selection
} from 'vscode';
import * as _ from './common';

export function applyNavigation(status: _.ExtensionStatus): boolean {
    if (!status.targetEditor) { return false };

    // 一致するもの
    let index = status.codeList.indexOf(status.inputCode);
    if (index < 0) return false;
    let pos = status.positionList[index];
    if (!pos) return false;

    // フォーカス移動
    const selection = new Selection(
        pos.line, pos.character, pos.line, pos.character,
    );
    status.targetEditor.selection = selection;

    return true;
}

// 入力コードを更新する
export function getInputCode(oldInputCode: string, newText: string): string {
    return oldInputCode += newText;
}

//　入力コードをUndoする
export function getUndoneInputCode(inputCode: string): string {
    if (inputCode == '') return '';
    return inputCode.slice(0, -1);
}

// ジャンプできるか
export function canNavigate(codeList: string[], inputCode: string): boolean {
    // 一致するものがあるか
    return (codeList.indexOf(inputCode) >= 0);
}

// Undoできるか
export function canUndoInputCode(inputCode: string): boolean {
    return (inputCode.length > 1);
}
