'use strict';

// 汎用関数

import * as vscode from 'vscode';
import * as _ from './common';

const CONFIG_TITLE: string = 'jumpToHint';

// 設定を読み込み
export function getUserSetting(): _.UserSetting {
    let setting: _.UserSetting = {
        common: {
            wordRegExp: new RegExp(''),
            lineRegExp: new RegExp(''),
            hintChars: []
        },
        type: {
            hintLengthType: _.HintLengthType.Variable,
            fixedHintLength: 2,
        },
        ui: {
            fontFamily: '',
            fontSize: 16,
            fontColor: '',
            backgroundColor: ''
        }
    };

    const editorConfig = vscode.workspace.getConfiguration('editor');
    const extensionConfig = vscode.workspace.getConfiguration(CONFIG_TITLE);

    setting.common = {
        wordRegExp: new RegExp(extensionConfig.get('common.wordRegExp', '\\w{2,}'), 'g'),
        lineRegExp: new RegExp(extensionConfig.get('common.lineRegExp', '^\\s*$'), 'g'),
        hintChars: extensionConfig.get('common.hintCharacters', '')
            .split("")
            .filter(function (e, i, self) { return self.indexOf(e) === i; })
    }

    setting.type = {
        hintLengthType: _.HintLengthType[extensionConfig.get('type.hintLengthType', 'Variable')],
        fixedHintLength: Math.max(extensionConfig.get('type.fixedHintLength', 1), 1)
    }

    setting.ui = {
        fontFamily: extensionConfig.get('ui.fontFamily', editorConfig.get('fontFamily', '')),
        fontSize: extensionConfig.get('ui.fontSize', editorConfig.get('fontSize', 16) - 1),
        fontColor: extensionConfig.get('ui.fontColor', 'black'),
        backgroundColor: extensionConfig.get('ui.backgroundColor', 'white')
    }

    return setting;
}

// 独自Contextの設定
export function setContext(value: boolean) {
    vscode.commands.executeCommand('setContext', 'jumpToHint.enabled', value);
}
