'use strict';

// ヒント表示

import * as vscode from 'vscode';
import * as _ from './common';

// 装飾を適用する
export function applyDecoration(status: _.ExtensionStatus): boolean {
    if (!status.targetEditor) { return false };

    let list = getHintParamList(status.positionList, status.codeList, status.inputCode);
    if (status.foregroundDecoration) {
        status.targetEditor.setDecorations(status.foregroundDecoration, getForegroundDecorationOptionList(list));
    }
    if (status.backgroundDecoration) {
        status.targetEditor.setDecorations(status.backgroundDecoration, getBackgroundDecorationOptionList(list));
    }

    return true;
}

// 位置とコードを結合する
function getHintParamList(positionList: vscode.Position[], codeList: string[], inputCode: string): _.HintParam[] {
    let list: _.HintParam[] = positionList.map((p, i) => {
        if (!!codeList[i]) {
            return { pos: p, code: codeList[i] };
        }
        return { pos: p, code: '' };
    });

    // 入力に一致するものだけ
    let re = new RegExp('^' + inputCode + '.*', 'i');
    return list.filter((param, i) => {
        return (re.test(param.code));
    });
}

// 装飾タイプを作成する
export function getForegroundDecoration(setting: _.UserSetting): vscode.TextEditorDecorationType {
    return vscode.window.createTextEditorDecorationType({
        after: {
            color: setting.ui.fontColor,
            width: '0',
            fontWeight: '400',
        },
    });
}

// 装飾タイプを作成する
export function getBackgroundDecoration(setting: _.UserSetting): vscode.TextEditorDecorationType {
    return vscode.window.createTextEditorDecorationType({
        backgroundColor: setting.ui.backgroundColor,
        opacity: '0',
        borderRadius: '2px'
    });
}

// 装飾オプションを作成する
function getForegroundDecorationOptionList(list: _.HintParam[]): vscode.DecorationOptions[] {
    return list.map((param, i) => {
        return {
            range: new vscode.Range(param.pos.line, param.pos.character, param.pos.line, param.pos.character),
            renderOptions: {
                after: {
                    contentText: param.code,
                }
            }
        }
    });
}

// 装飾オプションを作成する
function getBackgroundDecorationOptionList(list: _.HintParam[]): vscode.DecorationOptions[] {
    return list.map((param, i) => {
        return {
            range: new vscode.Range(param.pos.line, param.pos.character, param.pos.line, param.pos.character + param.code.length),
        }
    });
}

