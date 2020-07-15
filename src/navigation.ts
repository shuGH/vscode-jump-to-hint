'use strict';

// 入力処理

import {
    Selection
} from 'vscode';
import * as _ from './common';

export function applyNavigation(status: _.ExtensionStatus): boolean {
    if (!status.targetEditor) { return false };

    // 一致するもの
    let index = status.labelList.indexOf(status.inputLabel);
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
export function getInputLabel(oldInputLabel: string, newText: string): string {
    return oldInputLabel += newText;
}

//　入力コードをUndoする
export function getUndoneInputLabel(inputLabel: string): string {
    if (inputLabel == '') return '';
    return inputLabel.slice(0, -1);
}

// ジャンプできるか
export function canNavigate(labelList: string[], inputLabel: string): boolean {
    // 一致するものがあるか
    return (labelList.indexOf(inputLabel) >= 0);
}

// Undoできるか
export function canUndoInputLabel(inputLabel: string): boolean {
    return (inputLabel.length > 1);
}
