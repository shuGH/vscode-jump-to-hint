'use strict';

// ヒント表示

import {
    Position,
    Range,
    TextEditorDecorationType,
    DecorationOptions,
    window
} from 'vscode';
import * as _ from './common';

// 装飾を適用する
export function applyDecoration(status: _.ExtensionStatus): boolean {
    if (!status.targetEditor) { return false };

    let list = getHintParamList(status.positionList, status.labelList, status.inputLabel);
    if (status.foregroundDecoration) {
        status.targetEditor.setDecorations(status.foregroundDecoration, getForegroundDecorationOptionList(list));
    }
    if (status.backgroundDecoration) {
        status.targetEditor.setDecorations(status.backgroundDecoration, getBackgroundDecorationOptionList(list));
    }

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
export function getForegroundDecoration(setting: _.UserSetting): TextEditorDecorationType {
    return window.createTextEditorDecorationType({
        after: {
            color: setting.theme.fontColor,
            width: '0',
            fontWeight: 'normal'
        },
    });
}

// 装飾タイプを作成する
export function getBackgroundDecoration(setting: _.UserSetting): TextEditorDecorationType {
    return window.createTextEditorDecorationType({
        backgroundColor: setting.theme.backgroundColor,
        opacity: '0',
        borderRadius: '2px',
        border: 'none'
    });
}

// 装飾オプションを作成する
function getForegroundDecorationOptionList(list: _.HintParam[]): DecorationOptions[] {
    return list.map((param, i) => {
        return {
            range: new Range(param.pos.line, param.pos.character, param.pos.line, param.pos.character),
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
            range: new Range(param.pos.line, param.pos.character, param.pos.line, param.pos.character + param.label.length),
        }
    });
}

