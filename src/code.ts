'use strict';

// ヒント表示

import {
    Position
} from 'vscode';
import * as _ from './common';

// ヒント文字を作成する
export function getCodeList(setting: _.UserSetting, positionList: Position[]): string[] {
    let count = positionList.length;

    // ヒントを作成する
    let list: string[] = [];
    switch (setting.type.hintLengthType) {
        case _.HintLengthType.Fixed:
            list = generateFixedCodeList(setting.common.hintCharList, count, setting.type.fixedHintLength);
            break;
        case _.HintLengthType.Variable:
            list = generateVariableCodeList(setting.common.hintCharList, count);
            break;
    }
    return list;
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
