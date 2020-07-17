'use strict';

// 入力処理

import {
    Selection, window
} from 'vscode';
import * as _ from './common';

export function applyNavigation(status: _.ExtensionStatus): boolean {
    for (let i = 0; i <= status.labelList.length; i++) {
        let list = status.labelList[i];

        // 一致するものがあるか
        let index = list.indexOf(status.inputLabel);
        if (index < 0) continue;

        let pos = status.positionList[i][index];
        if (!pos) return false;
        let target = status.targetEditorList[i];
        if (!target) return false;

        // フォーカス移動
        const selection = new Selection(
            pos.line, pos.character, pos.line, pos.character,
        );
        target.selection = selection;
        window.showTextDocument(target.document, target.viewColumn);
        break;
    }

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
export function canNavigate(labelList: string[][], inputLabel: string): boolean {
    // 一致するものがあるか
    let f = false;
    labelList.forEach((l) => {
        f = f || (l.indexOf(inputLabel) >= 0);
    });
    return f;
}

// Undoできるか
export function canUndoInputLabel(inputLabel: string): boolean {
    return (inputLabel.length > 1);
}
