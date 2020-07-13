'use strict';

// ヒント位置

import {
    Position,
    Range,
    TextEditor
} from 'vscode';
import * as _ from './common';

// ヒント位置を検索する
export function getPositionListByWord(setting: _.UserSetting, textEditor: TextEditor): Position[] {
    return getPositionList(setting.common.wordRegExp, textEditor);
}

// ヒント位置を検索する
export function getPositionListByLine(setting: _.UserSetting, textEditor: TextEditor): Position[] {
    return getPositionList(setting.common.lineRegExp, textEditor);
}

// ヒント位置を検索する
function getPositionList(regExp: RegExp, textEditor: TextEditor): Position[] {
    if (!regExp) return [];

    // 範囲を取得
    let range = getTargetRange(textEditor);
    // 範囲内の行を走査
    let list: Position[] = [];
    for (let i = range.start.line; i <= range.end.line; i++) {
        let line = textEditor.document.lineAt(i);
        let exec: RegExpExecArray | null;

        // exec()は最後のマッチ位置を保持しながら検索する
        while (!!(exec = regExp.exec(line.text))) {
            list.push(
                new Position(i, exec.index)
            );
        }
    }
    return list;
}

// ヒントの表示範囲を返す
function getTargetRange(textEditor: TextEditor): Range {
    const range = textEditor.visibleRanges;

    // 上下に1行膨らませる
    const startLine = Math.max(range[0].start.line - 1, 0);
    const endLine = Math.min(range[0].end.line + 1, textEditor.document.lineCount - 1);

    return new Range(
        new Position(startLine, range[0].start.character),
        new Position(endLine, range[0].end.character),
    );
}
