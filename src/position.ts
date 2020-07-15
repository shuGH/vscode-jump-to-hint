'use strict';

// ヒント位置

import {
    Position,
    Range,
    TextEditor
} from 'vscode';
import * as _ from './common';

// 空のヒント位置リストを返す
export function getEmptyPositionList(textEditorList: TextEditor[]): Position[][] {
    return textEditorList.map((editor) => { return []; });
}

// ヒント位置を検索する
export function getPositionListByWord(setting: _.UserSetting, textEditorList: TextEditor[]): Position[][] {
    return getPositionList(setting.common.wordRegExp, textEditorList);
}

// ヒント位置を検索する
export function getPositionListByLine(setting: _.UserSetting, textEditorList: TextEditor[]): Position[][] {
    return getPositionList(setting.common.lineRegExp, textEditorList);
}

// ヒント位置を検索する
function getPositionList(regExp: RegExp, textEditorList: TextEditor[]): Position[][] {
    if (!regExp) return [];

    let list: Position[][] = [];
    textEditorList.forEach((editor) => {
        // 範囲を取得
        let range = getTargetRange(editor);

        // 範囲内の行を走査
        let l: Position[] = [];
        for (let i = range.start.line; i <= range.end.line; i++) {
            let line = editor.document.lineAt(i);
            let exec: RegExpExecArray | null;

            // exec()は最後のマッチ位置を保持しながら検索する
            while (!!(exec = regExp.exec(line.text))) {
                l.push(
                    new Position(i, exec.index)
                );
            }
        }

        list.push(l);
    });
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

