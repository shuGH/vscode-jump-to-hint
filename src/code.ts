'use strict';

// ヒント表示

import * as vscode from 'vscode';
import * as _ from './common';
import { runTests } from 'vscode-test';

// ヒント文字を作成する
export function updateCode(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus, setting: _.UserSetting): boolean {
    let count = status.hintList.length;
    let hintList: string[] = generateCodeList(
        setting.common.hintCharList, setting.type.hintLengthType, count, setting.type.fixedHintLength
    );

    // 更新
    status.hintList.forEach((hint, i) => {
        if (!!hintList[i]) { hint.code = hintList[i]; }
    });
    return true;
}

// ヒント列を返す
function generateCodeList(charList: string[], type: _.HintLengthType, count: number, length: number): string[] {
    switch (type) {
        case _.HintLengthType.Fixed:
            return generateFixedCodeList(charList, count, length);
        case _.HintLengthType.Variable:
            return generateVariableCodeList(charList, count);
    }
    return [];
}

// 深さ優先探索で固定長のヒント列を返す
function generateFixedCodeList(charList: string[], count: number, length: number): string[] {
    // @TODO: もうちょっとスマートな記述できそう
    let dfs = (hint: string, list: string[]): string[] => {
        if (list.length >= count) return list;
        if (hint.length < length) {
            for (let i = 0; i < charList.length; i++) {
                dfs(hint + charList[i], list);
            }
        }
        else {
            list.push(hint);
        }
        return list;
    };

    return dfs('', []);
}

// Returns a list of hint strings which will uniquely identify the given number of links.The hint strings may be of different lengths.
// https://github.com/philc/vimium
function generateVariableCodeList(charList: string[], count: number): string[] {
    let hintList: string[] = [''];
    let offset = 0;
    while ((hintList.length - offset < count) || (hintList.length == 1)) {
        let hint = hintList[offset++];
        charList.forEach(function (val: string) {
            hintList.push(hint + val);
        });
    }

    return hintList.slice(offset, offset + count);
}
