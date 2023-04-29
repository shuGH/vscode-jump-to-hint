'use strict';

// ヒント表示

import {
    Position,
    Range,
    TextEditor,
    TextEditorDecorationType,
    DecorationOptions,
    window,
    ThemeColor
} from 'vscode';
import * as _ from './common';

// 装飾を適用する
export function applyDecoration(status: _.ExtensionStatus): boolean {
    switch (status.state) {
        case _.ExtensionState.ActiveWordHint:
            return applyDecorationByPosition(status);
        case _.ExtensionState.ActiveLineHint:
            return applyDecorationByPosition(status);
        case _.ExtensionState.ActiveSearchHint:
            return applyDecorationByRange(status);
    }
    return false;
}

// 装飾を適用する
function applyDecorationByPosition(status: _.ExtensionStatus): boolean {
    status.targetEditorList.forEach((editor, i) => {
        let positionList = status.positionList[i];
        let labelList = status.labelList[i];
        let foreground = status.foregroundDecorationList[i];
        let background = status.backgroundDecorationList[i];
        let target = status.targetEditorList[i];

        if (!!positionList && !!labelList && !!target) {
            let list = getHintParamList(positionList, labelList, status.inputLabel);
            if (foreground) {
                target.setDecorations(foreground, getForegroundDecorationOptionList(list));
            }
            if (background) {
                target.setDecorations(background, getBackgroundDecorationOptionList(list));
            }
        }
    });
    return true;
}

// 装飾を適用する
function applyDecorationByRange(status: _.ExtensionStatus): boolean {
    status.targetEditorList.forEach((editor, i) => {
        let rangeList = status.rangeList[i];
        let labelList = status.labelList[i];
        let foreground = status.foregroundDecorationList[i];
        let background = status.backgroundDecorationList[i];
        let highlight = status.highlightDecorationList[i];
        let target = status.targetEditorList[i];

        if (!!rangeList && !!labelList && !!target) {
            // 位置に変換
            let positionList = rangeList.map((r, i) => {
                return r.start;
            });

            let list = getHintParamList(positionList, labelList, status.inputLabel);
            if (foreground) {
                target.setDecorations(foreground, getForegroundDecorationOptionList(list));
            }
            if (background) {
                target.setDecorations(background, getBackgroundDecorationOptionList(list));
            }
            if (highlight) {
                target.setDecorations(highlight, getHighlightDecorationOptionList(list, rangeList));
            }
        }
    });
    return true;
}

// 位置とコードを結合する
function getHintParamList(positionList: Position[], labelList: string[], inputLabel: string): _.HintParam[] {
    let list: _.HintParam[] = positionList.map((p, i) => {
        if (!!labelList[i]) {
            return { pos: p, label: labelList[i] };
        }
        return { pos: p, label: '' };
    });

    // 入力に一致するものだけ
    let re = new RegExp('^' + inputLabel + '.*', 'i');
    return list.filter((param, i) => {
        return (re.test(param.label));
    });
}

// 装飾タイプを作成する
export function getForegroundDecorationList(setting: _.UserSetting, textEditorList: TextEditor[]): TextEditorDecorationType[] {
    let list: TextEditorDecorationType[] = [];
    textEditorList.forEach((editor) => {
        list.push(window.createTextEditorDecorationType({
            after: {
                color: new ThemeColor('jumpToHint.fontColor'),
                width: '0',
                fontWeight: 'normal'
            },
        }));
    });
    return list;
}

// 装飾タイプを作成する
export function getBackgroundDecorationList(setting: _.UserSetting, textEditorList: TextEditor[]): TextEditorDecorationType[] {
    let list: TextEditorDecorationType[] = [];
    textEditorList.forEach((editor) => {
        list.push(window.createTextEditorDecorationType({
            backgroundColor: new ThemeColor('jumpToHint.backgroundColor'),
            opacity: '0',
            borderRadius: '2px',
            border: 'none'
        }));
    });
    return list;
}

// 装飾タイプを作成する
export function getHighlightDecorationList(setting: _.UserSetting, textEditorList: TextEditor[]): TextEditorDecorationType[] {
    let list: TextEditorDecorationType[] = [];
    textEditorList.forEach((editor) => {
        list.push(window.createTextEditorDecorationType({
            backgroundColor: new ThemeColor('jumpToHint.highlightColor'),
            opacity: '1',
            border: 'none',
        }));
    });
    return list;
}

// 装飾オプションを作成する
function getForegroundDecorationOptionList(list: _.HintParam[]): DecorationOptions[] {
    return list.map((param, i) => {
        return {
            range: new Range(param.pos, param.pos),
            renderOptions: {
                after: {
                    contentText: param.label,
                }
            }
        }
    });
}

// 装飾オプションを作成する
function getBackgroundDecorationOptionList(list: _.HintParam[]): DecorationOptions[] {
    return list.map((param, i) => {
        return {
            range: new Range(
                param.pos.line, param.pos.character,
                param.pos.line, param.pos.character + param.label.length
            )
        }
    });
}

// 装飾オプションを作成する
function getHighlightDecorationOptionList(hintList: _.HintParam[], rangeList: Range[]): DecorationOptions[] {
    let list: DecorationOptions[] = [];
    for (let i = 0; i < rangeList.length; i++) {
        let hint = hintList[i];
        let range = rangeList[i];
        if (!hint || !range) continue;

        // ハイライトとヒントの重なり順が制御できないため、ハイライトの範囲を変える
        // @TODO: 全角対応を入れた場合、文字列長とヒント幅が一致しないので処理を変える必要あり
        let l = range.end.character - range.start.character;
        if (l > hint.label.length) {
            list.push({
                range: new Range(
                    range.start.line, range.start.character + hint.label.length,
                    range.end.line, range.end.character
                )
            });
        }
    }
    return list;
}
